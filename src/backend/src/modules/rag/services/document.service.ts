import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { DocumentStatus, DocumentType } from '@shared/types/rag.types';
import type { Document, DocumentChunk } from '@shared/types/rag.types';
import { ChunkService } from './chunk.service';
import { EmbeddingService } from './embedding.service';
import { VectorStoreService } from './vector-store.service';

/**
 * 文档管理服务
 * 负责文档的上传、处理和管理
 */
@Injectable()
export class DocumentService {
  // 内存存储文档元数据
  private documents = new Map<string, Document>();

  constructor(
    private readonly chunkService: ChunkService,
    private readonly embeddingService: EmbeddingService,
    private readonly vectorStore: VectorStoreService,
  ) {}

  /**
   * 上传并处理文档
   * @param name 文档名称
   * @param content 文档内容（已解析的文本/Markdown）
   * @param metadata 元数据
   */
  async uploadDocument(
    name: string,
    content: string,
    metadata: {
      type?: DocumentType;
      source?: string;
      author?: string;
      title?: string;
      tags?: string[];
    } = {},
  ): Promise<Document> {
    const documentId = uuidv4();
    const now = new Date();

    // 创建文档记录
    const document: Document = {
      id: documentId,
      name,
      type: metadata.type || this.detectDocumentType(name, content),
      status: DocumentStatus.VECTORIZING,
      size: content.length,
      uploadedAt: now,
      chunks: [],
      metadata: {
        source: metadata.source,
        author: metadata.author,
        title: metadata.title || name,
      },
    };

    this.documents.set(documentId, document);

    try {
      // 文本分块
      document.status = DocumentStatus.PARSING;
      const isMarkdown = content.trim().startsWith('#');
      const chunks = isMarkdown
        ? this.chunkService.chunkByHeaders(content, documentId)
        : this.chunkService.chunk(content, documentId);

      document.chunks = chunks;
      document.status = DocumentStatus.VECTORIZING;

      // 生成嵌入向量
      const texts = chunks.map((c) => c.content);
      const embeddings = await this.embeddingService.embedBatch(texts);

      // 添加嵌入向量到 chunks
      const chunksWithEmbeddings: DocumentChunk[] = chunks.map((chunk, index) => ({
        ...chunk,
        embedding: embeddings[index],
      }));

      document.chunks = chunksWithEmbeddings;

      // 存储到向量数据库
      await this.vectorStore.storeChunks(documentId, chunksWithEmbeddings);

      // 更新状态
      document.status = DocumentStatus.READY;
      document.processedAt = new Date();

      return document;
    } catch (error) {
      document.status = DocumentStatus.ERROR;
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to process document: ${message}`);
    }
  }

  /**
   * 获取文档
   * @param id 文档ID
   */
  getDocument(id: string): Document | undefined {
    return this.documents.get(id);
  }

  /**
   * 获取所有文档
   */
  getAllDocuments(): Document[] {
    return Array.from(this.documents.values());
  }

  /**
   * 删除文档
   * @param id 文档ID
   */
  async deleteDocument(id: string): Promise<void> {
    await this.vectorStore.deleteDocument(id);
    this.documents.delete(id);
  }

  /**
   * 检测文档类型
   */
  private detectDocumentType(name: string, _content: string): DocumentType {
    const ext = name.split('.').pop()?.toLowerCase();
    if (ext === 'md') return DocumentType.MARKDOWN;
    if (ext === 'pdf') return DocumentType.PDF;
    if (ext === 'doc' || ext === 'docx') return DocumentType.WORD;
    return DocumentType.TEXT;
  }
}
