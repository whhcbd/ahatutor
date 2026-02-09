import { Injectable, OnModuleInit } from '@nestjs/common';
import type { DocumentChunk } from '@shared/types/rag.types';

/**
 * 内存向量存储服务
 * 用于 MVP 阶段快速开发，生产环境建议使用 Pinecone/Weaviate
 */
@Injectable()
export class VectorStoreService implements OnModuleInit {
  // 内存存储：documentId -> chunks[]
  private documentsMap = new Map<string, DocumentChunk[]>();

  // 内存存储：chunkId -> chunk
  private chunksMap = new Map<string, DocumentChunk>();

  // 向量索引：用于相似度搜索
  private embeddingsMap = new Map<string, number[]>();

  onModuleInit() {
    console.log('VectorStoreService initialized with in-memory storage');
    console.log('WARNING: Data will be lost on restart. Use Pinecone/Weaviate for production.');
  }

  /**
   * 存储文档块
   * @param documentId 文档ID
   * @param chunks 文档块数组
   */
  async storeChunks(
    documentId: string,
    chunks: DocumentChunk[],
  ): Promise<void> {
    // 删除旧的 chunks
    await this.deleteDocument(documentId);

    // 存储新的 chunks
    for (const chunk of chunks) {
      this.chunksMap.set(chunk.id, chunk);
      if (chunk.embedding) {
        this.embeddingsMap.set(chunk.id, chunk.embedding);
      }
    }

    this.documentsMap.set(documentId, chunks);
  }

  /**
   * 根据文档ID获取所有块
   * @param documentId 文档ID
   */
  async getChunksByDocument(documentId: string): Promise<DocumentChunk[]> {
    return this.documentsMap.get(documentId) || [];
  }

  /**
   * 根据块ID获取单个块
   * @param chunkId 块ID
   */
  async getChunk(chunkId: string): Promise<DocumentChunk | undefined> {
    return this.chunksMap.get(chunkId);
  }

  /**
   * 相似度搜索
   * @param queryEmbedding 查询向量
   * @param options 搜索选项
   */
  async similaritySearch(
    queryEmbedding: number[],
    options: {
      topK?: number;
      threshold?: number;
      documentId?: string;
      filter?: {
        tags?: string[];
        chapter?: string;
      };
    } = {},
  ): Promise<Array<{ chunk: DocumentChunk; score: number }>> {
    const { topK = 5, threshold = 0.7, documentId, filter } = options;

    const results: Array<{ chunk: DocumentChunk; score: number }> = [];

    // 遍历所有 chunks
    for (const [chunkId, embedding] of this.embeddingsMap.entries()) {
      const chunk = this.chunksMap.get(chunkId);
      if (!chunk) continue;

      // 文档过滤
      if (documentId && chunk.documentId !== documentId) continue;

      // 元数据过滤
      if (filter) {
        if (filter.tags && filter.tags.length > 0) {
          const chunkTags = chunk.metadata.tags || [];
          if (!filter.tags.some((tag) => chunkTags.includes(tag))) continue;
        }
        if (filter.chapter && chunk.metadata.chapter !== filter.chapter) continue;
      }

      // 计算相似度
      const score = this.cosineSimilarity(queryEmbedding, embedding);

      if (score >= threshold) {
        results.push({ chunk, score });
      }
    }

    // 按相似度排序
    results.sort((a, b) => b.score - a.score);

    // 返回 topK 结果
    return results.slice(0, topK);
  }

  /**
   * 删除文档的所有块
   * @param documentId 文档ID
   */
  async deleteDocument(documentId: string): Promise<void> {
    const chunks = this.documentsMap.get(documentId) || [];
    for (const chunk of chunks) {
      this.chunksMap.delete(chunk.id);
      this.embeddingsMap.delete(chunk.id);
    }
    this.documentsMap.delete(documentId);
  }

  /**
   * 获取存储统计
   */
  getStats(): {
    totalDocuments: number;
    totalChunks: number;
    totalEmbeddings: number;
  } {
    return {
      totalDocuments: this.documentsMap.size,
      totalChunks: this.chunksMap.size,
      totalEmbeddings: this.embeddingsMap.size,
    };
  }

  /**
   * 清空所有数据
   */
  async clear(): Promise<void> {
    this.documentsMap.clear();
    this.chunksMap.clear();
    this.embeddingsMap.clear();
  }

  /**
   * 计算余弦相似度
   */
  private cosineSimilarity(vec1: number[], vec2: number[]): number {
    if (vec1.length !== vec2.length) {
      throw new Error('Vectors must have the same length');
    }

    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < vec1.length; i++) {
      dotProduct += vec1[i] * vec2[i];
      norm1 += vec1[i] * vec1[i];
      norm2 += vec2[i] * vec2[i];
    }

    const denominator = Math.sqrt(norm1) * Math.sqrt(norm2);
    if (denominator === 0) return 0;

    return dotProduct / denominator;
  }
}
