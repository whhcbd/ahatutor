import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import type { DocumentChunk } from '@shared/types/rag.types';

export interface SplitOptions {
  outputDir?: string;
  chunkSize?: number;
  chunkOverlap?: number;
  strategy?: 'headers' | 'paragraphs' | 'sentences';
  saveToFile?: boolean;
  filenamePattern?: string;
}

export interface SplitResult {
  chunks: Omit<DocumentChunk, 'embedding'>[];
  files: string[];
  metadata: {
    totalChunks: number;
    totalSize: number;
    outputDir: string;
  };
}

@Injectable()
export class DocumentSplitterService {
  private readonly logger = new Logger(DocumentSplitterService.name);

  private readonly DEFAULT_OPTIONS: Required<SplitOptions> = {
    outputDir: './data/split-docs',
    chunkSize: 2000,
    chunkOverlap: 200,
    strategy: 'headers',
    saveToFile: true,
    filenamePattern: '{documentId}-chunk-{index}.md',
  };

  async splitMarkdownFile(
    filePath: string,
    options: SplitOptions = {},
  ): Promise<SplitResult> {
    const opts = { ...this.DEFAULT_OPTIONS, ...options };

    this.logger.log(`Splitting file: ${filePath} with strategy: ${opts.strategy}`);

    const content = await fs.readFile(filePath, 'utf-8');
    const documentId = this.getDocumentId(filePath);

    const chunks = await this.splitContentInternal(content, documentId, opts);

    let files: string[] = [];

    if (opts.saveToFile) {
      files = await this.saveChunksToFile(chunks, opts.outputDir, opts.filenamePattern, documentId);
    }

    const metadata: SplitResult['metadata'] = {
      totalChunks: chunks.length,
      totalSize: content.length,
      outputDir: opts.outputDir,
    };

    this.logger.log(`Split complete: ${chunks.length} chunks, ${files.length} files saved`);

    return { chunks, files, metadata };
  }

  async splitContent(
    content: string,
    documentId: string,
    options: Required<SplitOptions>,
  ): Promise<Omit<DocumentChunk, 'embedding'>[]> {
    return this.splitContentInternal(content, documentId, options);
  }

  async splitContentWithResult(
    content: string,
    documentId: string,
    options: Required<SplitOptions>,
  ): Promise<SplitResult> {
    const chunks = this.splitContentInternal(content, documentId, options);

    let files: string[] = [];

    if (options.saveToFile) {
      files = await this.saveChunksToFile(chunks, options.outputDir, options.filenamePattern, documentId);
    }

    const metadata: SplitResult['metadata'] = {
      totalChunks: chunks.length,
      totalSize: content.length,
      outputDir: options.outputDir,
    };

    this.logger.log(`Split complete: ${chunks.length} chunks, ${files.length} files saved`);

    return { chunks, files, metadata };
  }

  private splitContentInternal(
    content: string,
    documentId: string,
    options: Required<SplitOptions>,
  ): Omit<DocumentChunk, 'embedding'>[] {
    switch (options.strategy) {
      case 'headers':
        return this.splitByHeaders(content, documentId);
      case 'paragraphs':
        return this.splitByParagraphs(content, documentId, options.chunkSize, options.chunkOverlap);
      case 'sentences':
        return this.splitBySentences(content, documentId, options.chunkSize, options.chunkOverlap);
      default:
        return this.splitByHeaders(content, documentId);
    }
  }

  private splitByHeaders(
    content: string,
    documentId: string,
  ): Omit<DocumentChunk, 'embedding'>[] {
    const chunks: Omit<DocumentChunk, 'embedding'>[] = [];
    const lines = content.split('\n');

    let currentChunk = '';
    let currentChapter = '';
    let currentSection = '';
    let currentSubsection = '';
    let chunkIndex = 0;

    for (const line of lines) {
      const headerMatch = line.match(/^(#{1,4})\s+(.+)$/);
      
      if (headerMatch) {
        const level = headerMatch[1].length;
        const title = headerMatch[2].trim();

        if (currentChunk.trim().length > 0) {
          chunks.push(
            this.createChunk(
              currentChunk.trim(),
              documentId,
              chunkIndex++,
              {
                chapter: currentChapter || undefined,
                section: currentSection || undefined,
                subsection: currentSubsection || undefined,
                headerLevel: level,
              },
            ),
          );
        }

        if (level === 1) {
          currentChapter = title;
          currentSection = '';
          currentSubsection = '';
        } else if (level === 2) {
          currentSection = title;
          currentSubsection = '';
        } else if (level === 3) {
          currentSubsection = title;
        }

        currentChunk = line + '\n';
      } else {
        currentChunk += line + '\n';
      }
    }

    if (currentChunk.trim().length > 0) {
      chunks.push(
        this.createChunk(currentChunk.trim(), documentId, chunkIndex++, {
          chapter: currentChapter || undefined,
          section: currentSection || undefined,
          subsection: currentSubsection || undefined,
        }),
      );
    }

    return chunks;
  }

  private splitByParagraphs(
    content: string,
    documentId: string,
    chunkSize: number,
    chunkOverlap: number,
  ): Omit<DocumentChunk, 'embedding'>[] {
    const chunks: Omit<DocumentChunk, 'embedding'>[] = [];
    const paragraphs = content.split(/\n\n+/);
    
    let currentChunk = '';
    let chunkIndex = 0;

    for (const paragraph of paragraphs) {
      const trimmedParagraph = paragraph.trim();
      if (!trimmedParagraph) continue;

      if (currentChunk.length + trimmedParagraph.length > chunkSize && currentChunk.length > 0) {
        chunks.push(
          this.createChunk(currentChunk.trim(), documentId, chunkIndex++),
        );

        const overlapText = this.getOverlapText(currentChunk, chunkOverlap);
        currentChunk = overlapText + '\n\n' + trimmedParagraph;
      } else {
        currentChunk += (currentChunk ? '\n\n' : '') + trimmedParagraph;
      }
    }

    if (currentChunk.trim().length > 0) {
      chunks.push(
        this.createChunk(currentChunk.trim(), documentId, chunkIndex++),
      );
    }

    return chunks;
  }

  private splitBySentences(
    content: string,
    documentId: string,
    chunkSize: number,
    chunkOverlap: number,
  ): Omit<DocumentChunk, 'embedding'>[] {
    const chunks: Omit<DocumentChunk, 'embedding'>[] = [];
    const sentences = content.split(/[。！？？.!?]/);
    
    let currentChunk = '';
    let chunkIndex = 0;

    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim();
      if (!trimmedSentence) continue;

      if (currentChunk.length + trimmedSentence.length > chunkSize && currentChunk.length > 0) {
        chunks.push(
          this.createChunk(currentChunk.trim(), documentId, chunkIndex++),
        );

        const overlapText = this.getOverlapText(currentChunk, chunkOverlap);
        currentChunk = overlapText + '。' + trimmedSentence;
      } else {
        currentChunk += (currentChunk ? '。' : '') + trimmedSentence;
      }
    }

    if (currentChunk.trim().length > 0) {
      chunks.push(
        this.createChunk(currentChunk.trim(), documentId, chunkIndex++),
      );
    }

    return chunks;
  }

  private async saveChunksToFile(
    chunks: Omit<DocumentChunk, 'embedding'>[],
    outputDir: string,
    filenamePattern: string,
    documentId: string,
  ): Promise<string[]> {
    await fs.mkdir(outputDir, { recursive: true });

    const files: string[] = [];

    for (const chunk of chunks) {
      const filename = filenamePattern
        .replace('{documentId}', documentId)
        .replace('{index}', chunk.id.split('_').pop() || '0')
        .replace('{chapter}', chunk.metadata.chapter?.replace(/\s+/g, '-') || 'unknown')
        .replace('{section}', chunk.metadata.section?.replace(/\s+/g, '-') || 'unknown');

      const filepath = path.join(outputDir, filename);

      const fileContent = this.formatChunkAsMarkdown(chunk);

      await fs.writeFile(filepath, fileContent, 'utf-8');

      files.push(filepath);
      this.logger.debug(`Saved chunk: ${filepath}`);
    }

    return files;
  }

  private formatChunkAsMarkdown(chunk: Omit<DocumentChunk, 'embedding'>): string {
    let content = '';

    if (chunk.metadata.chapter) {
      content += `# ${chunk.metadata.chapter}\n\n`;
    }

    if (chunk.metadata.section) {
      content += `## ${chunk.metadata.section}\n\n`;
    }

    if (chunk.metadata.subsection) {
      content += `### ${chunk.metadata.subsection}\n\n`;
    }

    content += `---\n`;
    content += `**Chunk ID:** ${chunk.id}\n`;
    content += `**Document ID:** ${chunk.documentId}\n`;
    content += `---\n\n`;

    content += chunk.content;

    return content;
  }

  private createChunk(
    content: string,
    documentId: string,
    index: number,
    metadata: {
      chapter?: string;
      section?: string;
      subsection?: string;
      headerLevel?: number;
    } = {},
  ): Omit<DocumentChunk, 'embedding'> {
    return {
      id: `${documentId}_chunk_${index}`,
      documentId,
      content: content.trim(),
      metadata: {
        ...metadata,
        tags: [],
      },
    };
  }

  private getOverlapText(text: string, overlapSize: number): string {
    if (text.length <= overlapSize) return text;
    return text.slice(-overlapSize);
  }

  private getDocumentId(filePath: string): string {
    const basename = path.basename(filePath, path.extname(filePath));
    return basename
      .replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '-')
      .toLowerCase();
  }

  async batchSplitFiles(
    filePaths: string[],
    options: SplitOptions = {},
  ): Promise<Map<string, SplitResult>> {
    const results = new Map<string, SplitResult>();

    for (const filePath of filePaths) {
      try {
        const result = await this.splitMarkdownFile(filePath, options);
        results.set(filePath, result);
      } catch (error) {
        this.logger.error(`Failed to split file ${filePath}:`, error);
      }
    }

    return results;
  }
}
