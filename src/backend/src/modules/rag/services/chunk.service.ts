import { Injectable } from '@nestjs/common';
import type { DocumentChunk } from '../../../../shared/types/rag.types';

/**
 * 文本分块服务
 * 将长文本分割成适合向量化的块
 */
@Injectable()
export class ChunkService {
  private readonly DEFAULT_CHUNK_SIZE = 1000; // 默认块大小（字符数）
  private readonly DEFAULT_CHUNK_OVERLAP = 200; // 默认重叠大小

  /**
   * 将文本分割成块
   * @param content 原始文本内容
   * @param documentId 文档ID
   * @param options 分块选项
   */
  chunk(
    content: string,
    documentId: string,
    options: {
      chunkSize?: number;
      chunkOverlap?: number;
      separator?: string;
    } = {},
  ): Omit<DocumentChunk, 'embedding'>[] {
    const {
      chunkSize = this.DEFAULT_CHUNK_SIZE,
      chunkOverlap = this.DEFAULT_CHUNK_OVERLAP,
      separator = '\n\n',
    } = options;

    const chunks: Omit<DocumentChunk, 'embedding'>[] = [];

    // 按段落分割（保持语义完整性）
    const paragraphs = content.split(separator);
    let currentChunk = '';
    let chunkIndex = 0;

    for (const paragraph of paragraphs) {
      const trimmedParagraph = paragraph.trim();
      if (!trimmedParagraph) continue;

      // 如果当前块加上新段落超过大小限制
      if (
        currentChunk.length + trimmedParagraph.length > chunkSize &&
        currentChunk.length > 0
      ) {
        // 保存当前块
        chunks.push(this.createChunk(currentChunk, documentId, chunkIndex++));

        // 保留重叠部分
        const overlapText = this.getOverlapText(
          currentChunk,
          chunkOverlap,
        );
        currentChunk = overlapText + trimmedParagraph;
      } else {
        // 添加到当前块
        currentChunk +=
          currentChunk.length > 0 ? separator + trimmedParagraph : trimmedParagraph;
      }
    }

    // 保存最后一个块
    if (currentChunk.trim().length > 0) {
      chunks.push(this.createChunk(currentChunk, documentId, chunkIndex));
    }

    return chunks;
  }

  /**
   * 按标题结构分块（Markdown 专用）
   * @param content Markdown 内容
   * @param documentId 文档ID
   */
  chunkByHeaders(
    content: string,
    documentId: string,
  ): Omit<DocumentChunk, 'embedding'>[] {
    const chunks: Omit<DocumentChunk, 'embedding'>[] = [];
    const lines = content.split('\n');

    let currentChunk = '';
    let currentChapter = '';
    let currentSection = '';
    let chunkIndex = 0;

    for (const line of lines) {
      // 检测标题
      const headerMatch = line.match(/^(#{1,3})\s+(.+)$/);
      if (headerMatch) {
        const level = headerMatch[1].length;
        const title = headerMatch[2].trim();

        // 保存前一个块
        if (currentChunk.trim().length > 0) {
          chunks.push(
            this.createChunk(currentChunk.trim(), documentId, chunkIndex++, {
              chapter: currentChapter || undefined,
              section: currentSection || undefined,
            }),
          );
        }

        // 更新当前标题
        if (level === 1) {
          currentChapter = title;
          currentSection = '';
        } else if (level === 2) {
          currentSection = title;
        }

        currentChunk = line + '\n';
      } else {
        currentChunk += line + '\n';
      }
    }

    // 保存最后一个块
    if (currentChunk.trim().length > 0) {
      chunks.push(
        this.createChunk(currentChunk.trim(), documentId, chunkIndex++, {
          chapter: currentChapter || undefined,
          section: currentSection || undefined,
        }),
      );
    }

    return chunks;
  }

  /**
   * 创建块对象
   */
  private createChunk(
    content: string,
    documentId: string,
    index: number,
    metadata: {
      chapter?: string;
      section?: string;
      pageNumber?: number;
      tags?: string[];
    } = {},
  ): Omit<DocumentChunk, 'embedding'> {
    return {
      id: `${documentId}_chunk_${index}`,
      documentId,
      content: content.trim(),
      metadata: {
        ...metadata,
        tags: metadata.tags || [],
      },
    };
  }

  /**
   * 获取重叠文本（用于保持上下文连续性）
   */
  private getOverlapText(text: string, overlapSize: number): string {
    if (text.length <= overlapSize) return text;
    return text.slice(-overlapSize);
  }
}
