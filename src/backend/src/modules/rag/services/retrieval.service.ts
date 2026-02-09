import { Injectable } from '@nestjs/common';
import { EmbeddingService } from './embedding.service';
import { VectorStoreService } from './vector-store.service';
import type { QueryResult, QueryOptions } from '../../../../shared/types/rag.types';

/**
 * 检索服务
 * 负责知识库查询和结果排序
 */
@Injectable()
export class RetrievalService {
  constructor(
    private readonly embeddingService: EmbeddingService,
    private readonly vectorStore: VectorStoreService,
  ) {}

  /**
   * 查询知识库
   * @param query 查询文本
   * @param options 查询选项
   * @returns 查询结果
   */
  async query(
    query: string,
    options: QueryOptions = {},
  ): Promise<QueryResult[]> {
    // 生成查询向量
    const queryEmbedding = await this.embeddingService.embed(query);

    // 相似度搜索
    const searchResults = await this.vectorStore.similaritySearch(queryEmbedding, {
      topK: options.topK || 5,
      threshold: options.threshold || 0.7,
      documentId: options.filter?.documentId,
      filter: {
        tags: options.filter?.tags,
        chapter: options.filter?.chapter,
      },
    });

    // 转换为 QueryResult 格式
    return searchResults.map(({ chunk, score }) => ({
      chunk,
      score,
      relevance: this.getRelevanceLevel(score),
    }));
  }

  /**
   * 混合检索（向量 + 关键词）
   * @param query 查询文本
   * @param options 查询选项
   * @returns 查询结果
   */
  async hybridQuery(
    query: string,
    options: QueryOptions = {},
  ): Promise<QueryResult[]> {
    // 向量搜索
    const vectorResults = await this.query(query, options);

    // 关键词搜索（简单实现）
    const keywordResults = await this.keywordSearch(query, options);

    // 合并结果（加权平均）
    const combinedResults = this.combineResults(
      vectorResults,
      keywordResults,
    );

    return combinedResults.slice(0, options.topK || 5);
  }

  /**
   * 关键词搜索
   */
  private async keywordSearch(
    query: string,
    options: QueryOptions,
  ): Promise<QueryResult[]> {
    // 简单的关键词匹配实现
    const queryLower = query.toLowerCase();
    const queryTerms = queryLower.split(/\s+/).filter((term) => term.length > 2);

    // TODO: 实现更复杂的关键词搜索（如倒排索引）
    // 这里作为占位，返回空数组
    return [];
  }

  /**
   * 合并向量搜索和关键词搜索结果
   */
  private combineResults(
    vectorResults: QueryResult[],
    keywordResults: QueryResult[],
  ): QueryResult[] {
    const combined = new Map<string, QueryResult>();

    // 向量搜索权重 0.7
    for (const result of vectorResults) {
      const key = result.chunk.id;
      combined.set(key, {
        ...result,
        score: result.score * 0.7,
      });
    }

    // 关键词搜索权重 0.3
    for (const result of keywordResults) {
      const key = result.chunk.id;
      const existing = combined.get(key);
      if (existing) {
        existing.score += result.score * 0.3;
      } else {
        combined.set(key, {
          ...result,
          score: result.score * 0.3,
        });
      }
    }

    // 排序
    return Array.from(combined.values()).sort(
      (a, b) => b.score - a.score,
    );
  }

  /**
   * 根据分数获取相关性等级
   */
  private getRelevanceLevel(score: number): 'high' | 'medium' | 'low' {
    if (score >= 0.85) return 'high';
    if (score >= 0.75) return 'medium';
    return 'low';
  }
}
