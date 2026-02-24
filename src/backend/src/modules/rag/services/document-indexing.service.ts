import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LLMService } from '../../llm/llm.service';
import { DocumentSplitterService } from './document-splitter.service';
import { DocumentIndexingInput, DocumentIndexingOutput, SkillExecutionResult, SkillType } from '@shared/types/skill.types';
import { DocumentChunk, DocumentMetadata } from '@shared/types/rag.types';

/**
 * 文档索引服务
 *
 * 功能：
 * - 解析文档（PDF、Word、Markdown）
 * - 文本分块（支持拆分成文件）
 * - 向量化
 * - 存储到向量数据库
 */
@Injectable()
export class DocumentIndexingService {
  private readonly logger = new Logger(DocumentIndexingService.name);
  private readonly chunkSize = 500;

  constructor(
    private readonly llmService: LLMService,
    private readonly configService: ConfigService,
    private readonly documentSplitter: DocumentSplitterService,
  ) {}

  /**
   * 索引文档
   */
  async index(
    input: DocumentIndexingInput,
  ): Promise<SkillExecutionResult<DocumentIndexingOutput>> {
    const startTime = Date.now();

    try {
      this.logger.log(`Indexing document: ${input.documentId || input.filePath}`);

      let content: string;
      let metadata: Partial<DocumentMetadata> = {};

      if (input.content) {
        content = input.content;
        metadata = input.metadata || {};
      } else if (input.filePath) {
        const parsed = await this.parseDocument(input.filePath, input.metadata || {});
        content = parsed.content;
        metadata = parsed.metadata;
      } else {
        throw new Error('Either content or filePath must be provided');
      }

      const documentId = input.documentId || metadata.id || this.generateDocumentId();

      const chunks = await this.createChunks(
        documentId,
        content,
        metadata,
        input.saveChunksToFile,
        input.chunkStrategy,
      );
      const embeddings = await this.generateEmbeddings(chunks);

      void embeddings;

      await this.storeChunks(documentId, chunks, embeddings);

      const processingTime = Date.now() - startTime;
      this.logger.log(`Document indexed in ${processingTime}ms, ${chunks.length} chunks created`);

      return {
        skill: SkillType.DOCUMENT_INDEXING,
        success: true,
        data: {
          documentId,
          chunksCreated: chunks.length,
          chunks,
          indexingTime: processingTime,
          status: 'success',
        },
        metadata: {
          processingTime,
        },
      };
    } catch (error) {
      this.logger.error('Document indexing failed:', error);

      return {
        skill: SkillType.DOCUMENT_INDEXING,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: {
          processingTime: Date.now() - startTime,
        },
      };
    }
  }

  /**
   * 批量索引文档
   */
  async indexBatch(
    inputs: DocumentIndexingInput[],
  ): Promise<SkillExecutionResult<Map<string, DocumentIndexingOutput>>> {
    const startTime = Date.now();
    const resultMap = new Map<string, DocumentIndexingOutput>();
    let failedCount = 0;

    for (const input of inputs) {
      const result = await this.index(input);
      if (result.success && result.data) {
        resultMap.set(result.data.documentId, result.data);
      } else {
        failedCount++;
      }
    }

    const processingTime = Date.now() - startTime;

    return {
      skill: SkillType.DOCUMENT_INDEXING,
      success: failedCount === 0,
      data: resultMap,
      metadata: {
        processingTime,
      },
    };
  }

  /**
   * 解析文档
   */
  private async parseDocument(
    filePath: string,
    metadata: Partial<DocumentMetadata>,
  ): Promise<{ content: string; metadata: Partial<DocumentMetadata> }> {
    const ext = filePath.split('.').pop()?.toLowerCase();

    switch (ext) {
      case 'pdf':
        return await this.parsePDF(filePath, metadata);
      case 'docx':
        return await this.parseDocx(filePath, metadata);
      case 'md':
        return await this.parseMarkdown(filePath, metadata);
      case 'txt':
        return await this.parseText(filePath, metadata);
      default:
        throw new Error(`Unsupported file type: ${ext}`);
    }
  }

  /**
   * 解析 PDF
   */
  private async parsePDF(
    filePath: string,
    metadata: Partial<DocumentMetadata>,
  ): Promise<{ content: string; metadata: Partial<DocumentMetadata> }> {
    try {
      const pdfParse = await import('pdf-parse');
      const fs = await import('fs/promises');
      const dataBuffer = await fs.readFile(filePath);
      const data = await pdfParse.default(dataBuffer) as any;

      return {
        content: data.text,
        metadata: {
          ...metadata,
          type: 'pdf',
          size: data.text.length,
          parser: 'local',
        },
      };
    } catch (error) {
      this.logger.error('PDF parsing failed:', error);
      throw new Error(`Failed to parse PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 解析 DOCX
   */
  private async parseDocx(
    filePath: string,
    metadata: Partial<DocumentMetadata>,
  ): Promise<{ content: string; metadata: Partial<DocumentMetadata> }> {
    try {
      const mammoth = await import('mammoth');
      const result = await mammoth.extractRawText({ path: filePath });

      return {
        content: result.value,
        metadata: {
          ...metadata,
          type: 'word',
          size: result.value.length,
        },
      };
    } catch (error) {
      this.logger.error('DOCX parsing failed:', error);
      throw new Error(`Failed to parse DOCX: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 解析 Markdown
   */
  private async parseMarkdown(
    filePath: string,
    metadata: Partial<DocumentMetadata>,
  ): Promise<{ content: string; metadata: Partial<DocumentMetadata> }> {
    try {
      const fs = await import('fs/promises');
      const content = await fs.readFile(filePath, 'utf-8');

      return {
        content,
        metadata: {
          ...metadata,
          type: 'markdown',
          size: content.length,
        },
      };
    } catch (error) {
      this.logger.error('Markdown parsing failed:', error);
      throw new Error(`Failed to parse Markdown: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 解析纯文本
   */
  private async parseText(
    filePath: string,
    metadata: Partial<DocumentMetadata>,
  ): Promise<{ content: string; metadata: Partial<DocumentMetadata> }> {
    try {
      const fs = await import('fs/promises');
      const content = await fs.readFile(filePath, 'utf-8');

      return {
        content,
        metadata: {
          ...metadata,
          type: 'text',
          size: content.length,
        },
      };
    } catch (error) {
      this.logger.error('Text parsing failed:', error);
      throw new Error(`Failed to parse Text: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 创建文档块
   */
  private async createChunks(
    documentId: string,
    content: string,
    metadata: Partial<DocumentMetadata>,
    saveChunksToFile = false,
    chunkStrategy: 'headers' | 'paragraphs' | 'sentences' = 'headers',
  ): Promise<DocumentChunk[]> {
    if (saveChunksToFile) {
      this.logger.log(`Using DocumentSplitterService with strategy: ${chunkStrategy}`);

      const result = await this.documentSplitter.splitContentWithResult(
        content,
        documentId,
        {
          chunkSize: this.chunkSize,
          chunkOverlap: 100,
          strategy: chunkStrategy,
          saveToFile: true,
          outputDir: './data/split-docs',
          filenamePattern: `{documentId}-chunk-{index}.md`,
        },
      );

      this.logger.log(`Created ${result.chunks.length} chunks and ${result.files.length} files`);

      return result.chunks as DocumentChunk[];
    }

    const chunks: DocumentChunk[] = [];
    const sentences = content.split(/[。！？？.!?]/);
    let currentChunk = '';
    let chunkIndex = 0;

    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim();
      if (!trimmedSentence) continue;

      if (currentChunk.length + trimmedSentence.length > this.chunkSize) {
        if (currentChunk) {
          chunks.push(this.createChunk(documentId, chunkIndex++, currentChunk, metadata));
          currentChunk = trimmedSentence;
        } else {
          chunks.push(this.createChunk(documentId, chunkIndex++, trimmedSentence, metadata));
        }
      } else {
        currentChunk += (currentChunk ? '。' : '') + trimmedSentence;
      }
    }

    if (currentChunk) {
      chunks.push(this.createChunk(documentId, chunkIndex, currentChunk, metadata));
    }

    this.logger.log(`Created ${chunks.length} chunks from document ${documentId}`);
    return chunks;
  }

  /**
   * 创建单个文档块
   */
  private createChunk(
    documentId: string,
    chunkIndex: number,
    content: string,
    metadata: Partial<DocumentMetadata>,
  ): DocumentChunk {
    return {
      id: `${documentId}-chunk-${chunkIndex}`,
      documentId,
      content,
      metadata: {
        documentId,
        chunkIndex,
        topics: metadata.topics || [],
        section: metadata.section,
        chapter: metadata.chapter,
        difficulty: metadata.difficulty,
      },
    };
  }

  /**
   * 生成嵌入向量
   */
  private async generateEmbeddings(chunks: DocumentChunk[]): Promise<number[][]> {
    const embeddings: number[][] = [];

    for (const chunk of chunks) {
      try {
        const embedding = await this.llmService.generateEmbedding(chunk.content);
        embeddings.push(embedding);
      } catch (error) {
        this.logger.error(`Failed to generate embedding for chunk ${chunk.id}:`, error);
        throw error;
      }
    }

    this.logger.log(`Generated ${embeddings.length} embeddings`);
    return embeddings;
  }

  /**
   * 存储文档块到向量数据库
   */
  private async storeChunks(
    documentId: string,
    chunks: DocumentChunk[],
    embeddings: number[][],
  ): Promise<{ success: boolean; storedCount: number }> {
    const vectorStoreType = this.configService.get<string>('VECTOR_STORE_TYPE', 'mock');

    switch (vectorStoreType) {
      case 'pinecone':
        return await this.storeToPinecone(documentId, chunks, embeddings);
      case 'weaviate':
        return await this.storeToWeaviate(documentId, chunks, embeddings);
      case 'mock':
      default:
        return await this.storeToMock(documentId, chunks, embeddings);
    }
  }

  /**
   * 存储到 Pinecone
   */
  private async storeToPinecone(
    _documentId: string,
    chunks: DocumentChunk[],
    embeddings: number[][],
  ): Promise<{ success: boolean; storedCount: number }> {
    try {
      const { Pinecone } = await import('@pinecone-database/pinecone');

      const apiKey = this.configService.get<string>('PINECONE_API_KEY') || '';
      const indexName = this.configService.get<string>('PINECONE_INDEX_NAME', 'ahatutor');

      const pinecone = new Pinecone({ apiKey: apiKey as any });
      const index = pinecone.index(indexName);

      const records = chunks.map((chunk, index) => ({
        id: chunk.id,
        values: embeddings[index],
        metadata: {
          content: chunk.content,
          ...chunk.metadata,
        },
      }));

      await index.upsert(records as any);

      this.logger.log(`Stored ${records.length} chunks to Pinecone`);
      return { success: true, storedCount: records.length };
    } catch (error) {
      this.logger.error('Pinecone storage failed:', error);
      return { success: false, storedCount: 0 };
    }
  }

  /**
   * 存储到 Weaviate
   */
  private async storeToWeaviate(
    _documentId: string,
    chunks: DocumentChunk[],
    embeddings: number[][],
  ): Promise<{ success: boolean; storedCount: number }> {
    try {
      const { default: weaviate } = await import('weaviate-ts-client');

      const url = this.configService.get<string>('WEAVIATE_URL', 'http://localhost:8080');
      const apiKey = this.configService.get<string>('WEAVIATE_API_KEY');

      const client = weaviate.client({
        scheme: 'http',
        host: url.replace('http://', '').replace('https://', ''),
        apiKey: apiKey as any,
      });

      const className = 'DocumentChunk';

      const dataObjects = chunks.map((chunk, index) => ({
        id: chunk.id,
        properties: {
          content: chunk.content,
          ...chunk.metadata,
        },
        vector: embeddings[index],
      }));

      await (client.batch as any).data.createMany({
        className,
        data: dataObjects,
      });

      this.logger.log(`Stored ${dataObjects.length} chunks to Weaviate`);
      return { success: true, storedCount: dataObjects.length };
    } catch (error) {
      this.logger.error('Weaviate storage failed:', error);
      return { success: false, storedCount: 0 };
    }
  }

  /**
   * 存储到 Mock（用于开发测试）
   */
  private async storeToMock(
    documentId: string,
    chunks: DocumentChunk[],
    _embeddings: number[][],
  ): Promise<{ success: boolean; storedCount: number }> {
    this.logger.warn(`Mock storing ${chunks.length} chunks for document ${documentId}`);
    return { success: true, storedCount: chunks.length };
  }

  /**
   * 删除文档索引
   */
  async deleteDocument(documentId: string): Promise<boolean> {
    try {
      const vectorStoreType = this.configService.get<string>('VECTOR_STORE_TYPE', 'mock');

      switch (vectorStoreType) {
        case 'pinecone':
          return await this.deleteFromPinecone(documentId);
        case 'weaviate':
          return await this.deleteFromWeaviate(documentId);
        case 'mock':
        default:
          this.logger.warn(`Mock deleting document ${documentId}`);
          return true;
      }
    } catch (error) {
      this.logger.error('Document deletion failed:', error);
      return false;
    }
  }

  /**
   * 从 Pinecone 删除
   */
  private async deleteFromPinecone(documentId: string): Promise<boolean> {
    try {
      const { Pinecone } = await import('@pinecone-database/pinecone');
      const apiKey = this.configService.get<string>('PINECONE_API_KEY') || '';
      const indexName = this.configService.get<string>('PINECONE_INDEX_NAME', 'ahatutor');

      const pinecone = new Pinecone({ apiKey: apiKey as any });
      const index = pinecone.index(indexName);

      await index.deleteMany({ filter: { documentId: { $eq: documentId } } });

      this.logger.log(`Deleted document ${documentId} from Pinecone`);
      return true;
    } catch (error) {
      this.logger.error('Pinecone deletion failed:', error);
      return false;
    }
  }

  /**
   * 从 Weaviate 删除
   */
  private async deleteFromWeaviate(documentId: string): Promise<boolean> {
    try {
      const { default: weaviate } = await import('weaviate-ts-client');
      const url = this.configService.get<string>('WEAVIATE_URL', 'http://localhost:8080');
      const apiKey = this.configService.get<string>('WEAVIATE_API_KEY');

      const client = weaviate.client({
        scheme: 'http',
        host: url.replace('http://', '').replace('https://', ''),
        apiKey: apiKey as any,
      });

      await (client.batch as any).delete.byWhere({
        className: 'DocumentChunk',
        where: {
          path: ['documentId'],
          operator: 'Equal',
          valueText: documentId,
        },
      });

      this.logger.log(`Deleted document ${documentId} from Weaviate`);
      return true;
    } catch (error) {
      this.logger.error('Weaviate deletion failed:', error);
      return false;
    }
  }

  /**
   * 生成文档ID
   */
  private generateDocumentId(): string {
    return `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 获取文档统计
   */
  async getDocumentStats(): Promise<{
    totalDocuments: number;
    totalChunks: number;
    bySubject: Record<string, number>;
  }> {
    return {
      totalDocuments: 0,
      totalChunks: 0,
      bySubject: {},
    };
  }
}
