import { Injectable } from '@nestjs/common';
import { DocumentService } from './document.service';
import { RetrievalService } from './retrieval.service';
import {
  UploadDocumentDto,
  QueryDto,
  DocumentResponseDto,
  QueryResponseDto,
} from '../dto/rag.dto';
import { VectorStoreService } from './vector-store.service';

/**
 * RAG 服务主入口
 * 协调文档处理和检索
 */
@Injectable()
export class RAGService {
  constructor(
    private readonly documentService: DocumentService,
    private readonly retrievalService: RetrievalService,
    private readonly vectorStore: VectorStoreService,
  ) {}

  /**
   * 上传文档
   */
  async uploadDocument(uploadDto: UploadDocumentDto): Promise<DocumentResponseDto> {
    const document = await this.documentService.uploadDocument(
      uploadDto.name,
      uploadDto.content,
      uploadDto.metadata || {},
    );

    return this.toDocumentResponse(document);
  }

  /**
   * 获取所有文档
   */
  async getDocuments(): Promise<DocumentResponseDto[]> {
    const documents = this.documentService.getAllDocuments();
    return documents.map((doc) => this.toDocumentResponse(doc));
  }

  /**
   * 获取单个文档
   */
  async getDocument(id: string): Promise<DocumentResponseDto> {
    const document = this.documentService.getDocument(id);
    if (!document) {
      throw new Error(`Document not found: ${id}`);
    }
    return this.toDocumentResponse(document);
  }

  /**
   * 删除文档
   */
  async deleteDocument(id: string): Promise<void> {
    await this.documentService.deleteDocument(id);
  }

  /**
   * 查询知识库
   */
  async query(queryDto: QueryDto): Promise<QueryResponseDto> {
    const results = await this.retrievalService.query(queryDto.query, {
      topK: queryDto.topK,
      threshold: queryDto.threshold,
      filter: queryDto.documentId
        ? { documentId: queryDto.documentId }
        : undefined,
    });

    return {
      query: queryDto.query,
      results: results.map((r) => ({
        content: r.chunk.content,
        score: r.score,
        relevance: r.relevance,
        metadata: {
          documentId: r.chunk.documentId,
          documentName: this.documentService.getDocument(r.chunk.documentId)?.name || 'Unknown',
          chunkId: r.chunk.id,
          pageNumber: r.chunk.metadata.pageNumber,
          chapter: r.chunk.metadata.chapter,
          section: r.chunk.metadata.section,
        },
      })),
      totalResults: results.length,
    };
  }

  /**
   * 获取统计信息
   */
  async getStats(): Promise<{
    totalDocuments: number;
    totalChunks: number;
    totalEmbeddings: number;
  }> {
    return await this.vectorStore.getStats();
  }

  /**
   * 转换为响应 DTO
   */
  private toDocumentResponse(document: any): DocumentResponseDto {
    return {
      id: document.id,
      name: document.name,
      type: document.type,
      status: document.status,
      size: document.size,
      uploadedAt: document.uploadedAt,
      processedAt: document.processedAt,
      chunkCount: document.chunks.length,
      metadata: {
        source: document.metadata.source,
        author: document.metadata.author,
        title: document.metadata.title,
      },
    };
  }
}
