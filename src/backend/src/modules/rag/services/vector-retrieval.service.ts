import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LLMService } from '../../llm/llm.service';
import {
  VectorRetrievalInput,
  VectorRetrievalOutput,
  RetrievalResult,
  SkillExecutionResult,
  SkillType,
} from '@shared/types/skill.types';

/**
 * 向量检索服务
 *
 * 功能：
 * - 将用户查询向量化
 * - 在向量数据库中检索相关文档块
 * - 支持过滤和重排
 * - 构建上下文
 */
@Injectable()
export class VectorRetrievalService {
  private readonly logger = new Logger(VectorRetrievalService.name);

  constructor(
    private readonly llmService: LLMService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 向量检索
   */
  async retrieve(
    input: VectorRetrievalInput,
  ): Promise<SkillExecutionResult<VectorRetrievalOutput>> {
    const startTime = Date.now();

    try {
      this.logger.log(`Retrieving for query: ${input.query}`);

      const { query, topK = 5, filters, rerank = false } = input;

      const embedding = await this.llmService.generateEmbedding(query);

      let results = await this.searchVectorStore(embedding, topK, filters);

      if (rerank && results.length > 0) {
        results = await this.rerankResults(query, results);
      }

      const context = this.buildContext(results);
      const retrievalTime = Date.now() - startTime;

      this.logger.log(`Retrieval completed in ${retrievalTime}ms, found ${results.length} results`);

      return {
        skill: SkillType.VECTOR_RETRIEVAL,
        success: true,
        data: {
          query,
          results,
          totalFound: results.length,
          retrievalTime,
          context,
        },
        metadata: {
          processingTime: retrievalTime,
        },
      };
    } catch (error) {
      this.logger.error('Vector retrieval failed:', error);

      return {
        skill: SkillType.VECTOR_RETRIEVAL,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: {
          processingTime: Date.now() - startTime,
        },
      };
    }
  }

  /**
   * 批量检索
   */
  async retrieveBatch(
    queries: string[],
    topK: number = 5,
  ): Promise<SkillExecutionResult<Map<string, VectorRetrievalOutput>>> {
    const startTime = Date.now();
    const resultMap = new Map<string, VectorRetrievalOutput>();
    let failedCount = 0;

    for (const query of queries) {
      const result = await this.retrieve({ query, topK });
      if (result.success && result.data) {
        resultMap.set(query, result.data);
      } else {
        failedCount++;
      }
    }

    const processingTime = Date.now() - startTime;

    return {
      skill: SkillType.VECTOR_RETRIEVAL,
      success: failedCount === 0,
      data: resultMap,
      metadata: {
        processingTime,
      },
    };
  }

  /**
   * 搜索向量数据库
   */
  private async searchVectorStore(
    embedding: number[],
    topK: number,
    filters?: VectorRetrievalInput['filters'],
  ): Promise<RetrievalResult[]> {
    const vectorStoreType = this.configService.get<string>('VECTOR_STORE_TYPE', 'mock');

    switch (vectorStoreType) {
      case 'pinecone':
        return await this.searchPinecone(embedding, topK, filters);
      case 'weaviate':
        return await this.searchWeaviate(embedding, topK, filters);
      case 'mock':
      default:
        return await this.searchMock(embedding, topK, filters);
    }
  }

  /**
   * 搜索 Pinecone
   */
  private async searchPinecone(
    embedding: number[],
    topK: number,
    filters?: VectorRetrievalInput['filters'],
  ): Promise<RetrievalResult[]> {
    try {
      const { Pinecone } = await import('@pinecone-database/pinecone');

      const apiKey = this.configService.get<string>('PINECONE_API_KEY') || '';
      const indexName = this.configService.get<string>('PINECONE_INDEX_NAME', 'ahatutor');

      const pinecone = new Pinecone({ apiKey });
      const index = pinecone.index(indexName);

      const filter = this.buildPineconeFilter(filters);

      const queryResponse = await index.query({
        vector: embedding,
        topK,
        includeMetadata: true,
        filter: filter || undefined,
      });

      const results: RetrievalResult[] = [];

      for (const match of queryResponse.matches || []) {
        if (match.metadata) {
          results.push({
            chunkId: match.id,
            documentId: match.metadata.documentId as string,
            content: match.metadata.content as string,
            score: match.score || 0,
            metadata: {
              documentId: match.metadata.documentId as string,
              chunkIndex: match.metadata.chunkIndex as number,
              topics: match.metadata.topics as string[] || [],
              section: match.metadata.section as string,
              chapter: match.metadata.chapter as string,
              difficulty: match.metadata.difficulty as string,
            },
          });
        }
      }

      this.logger.log(`Retrieved ${results.length} results from Pinecone`);
      return results;
    } catch (error) {
      this.logger.error('Pinecone search failed:', error);
      return [];
    }
  }

  /**
   * 搜索 Weaviate
   */
  private async searchWeaviate(
    embedding: number[],
    topK: number,
    filters?: VectorRetrievalInput['filters'],
  ): Promise<RetrievalResult[]> {
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

      const nearVector = { vector: embedding };
      const where = this.buildWeaviateFilter(filters);

      const query = `
        {
          Get {
            ${className}(
              limit: ${topK}
              nearVector: ${JSON.stringify(nearVector)}
              ${where ? `where: ${where}` : ''}
            ) {
              id
              _additional {
                distance
                  vector
              }
              documentId
              content
              chunkIndex
              topics
              section
              chapter
              difficulty
            }
          }
        }
      `;

      const response = await (client.graphql as any).raw(query);

      const results: RetrievalResult[] = [];

      for (const item of response.data.Get[className] || []) {
        results.push({
          chunkId: item.id,
          documentId: item.documentId,
          content: item.content,
          score: 1 - (item._additional?.distance || 1),
          metadata: {
            documentId: item.documentId,
            chunkIndex: item.chunkIndex,
            topics: item.topics || [],
            section: item.section,
            chapter: item.chapter,
            difficulty: item.difficulty,
          },
        });
      }

      this.logger.log(`Retrieved ${results.length} results from Weaviate`);
      return results;
    } catch (error) {
      this.logger.error('Weaviate search failed:', error);
      return [];
    }
  }

  /**
   * Mock 搜索（用于开发测试）
   */
  private async searchMock(
    _embedding: number[],
    topK: number,
    filters?: VectorRetrievalInput['filters'],
  ): Promise<RetrievalResult[]> {
    this.logger.warn(`Mock retrieval for topK=${topK}, filters=${JSON.stringify(filters)}`);

    return [
      {
        chunkId: 'mock-chunk-1',
        documentId: 'mock-doc-1',
        content: '孟德尔第一定律（分离定律）指出，在生物体的体细胞中，控制同一性状的遗传因子成对存在，不相融合；在形成配子时，成对的遗传因子彼此分离，分别进入不同的配子中，随配子遗传给后代。',
        score: 0.95,
        metadata: {
          documentId: 'mock-doc-1',
          chunkIndex: 0,
          topics: ['孟德尔定律', '分离定律'],
          section: '孟德尔遗传',
          chapter: '第一章',
          difficulty: 'beginner',
        },
      },
      {
        chunkId: 'mock-chunk-2',
        documentId: 'mock-doc-1',
        content: '孟德尔第二定律（自由组合定律）指出，控制不同性状的遗传因子的分离和组合是互不干扰的；在形成配子时，决定同一性状的成对的遗传因子彼此分离，而决定不同性状的遗传因子则自由组合。',
        score: 0.88,
        metadata: {
          documentId: 'mock-doc-1',
          chunkIndex: 1,
          topics: ['孟德尔定律', '自由组合定律'],
          section: '孟德尔遗传',
          chapter: '第一章',
          difficulty: 'beginner',
        },
      },
    ].slice(0, topK);
  }

  /**
   * 构建 Pinecone 过滤器
   */
  private buildPineconeFilter(filters?: VectorRetrievalInput['filters']): Record<string, unknown> | null {
    if (!filters) return null;

    const pineconeFilter: Record<string, unknown> = {};

    if (filters.subject) {
      pineconeFilter.subject = { $eq: filters.subject };
    }

    if (filters.topics && filters.topics.length > 0) {
      pineconeFilter.topics = { $in: filters.topics };
    }

    if (filters.difficulty) {
      pineconeFilter.difficulty = { $eq: filters.difficulty };
    }

    if (filters.documentId) {
      pineconeFilter.documentId = { $eq: filters.documentId };
    }

    return Object.keys(pineconeFilter).length > 0 ? pineconeFilter : null;
  }

  /**
   * 构建 Weaviate 过滤器
   */
  private buildWeaviateFilter(filters?: VectorRetrievalInput['filters']): string | null {
    if (!filters) return null;

    const conditions: string[] = [];

    if (filters.subject) {
      conditions.push(`{
        path: ["subject"],
        operator: Equal,
        valueText: "${filters.subject}"
      }`);
    }

    if (filters.topics && filters.topics.length > 0) {
      conditions.push(`{
        path: ["topics"],
        operator: ContainsAny,
        valueTextArray: ${JSON.stringify(filters.topics)}
      }`);
    }

    if (filters.difficulty) {
      conditions.push(`{
        path: ["difficulty"],
        operator: Equal,
        valueText: "${filters.difficulty}"
      }`);
    }

    if (filters.documentId) {
      conditions.push(`{
        path: ["documentId"],
        operator: Equal,
        valueText: "${filters.documentId}"
      }`);
    }

    if (conditions.length === 0) return null;

    return `{
      operator: And,
      operands: [${conditions.join(', ')}]
    }`;
  }

  /**
   * 重排检索结果
   */
  private async rerankResults(
    query: string,
    results: RetrievalResult[],
  ): Promise<RetrievalResult[]> {
    try {
      interface RerankRequest {
        model: string;
        query: string;
        documents: Array<{ id: string; text: string }>;
        top_n: number;
      }

      interface RerankResponse {
        results: Array<{
          index: number;
          relevance_score: number;
        }>;
      }

      const cohereApiKey = this.configService.get<string>('COHERE_API_KEY');

      if (!cohereApiKey) {
        this.logger.warn('Cohere API key not found, skipping rerank');
        return results;
      }

      const response = await fetch('https://api.cohere.ai/v1/rerank', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${cohereApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'rerank-multilingual-v2.0',
          query,
          documents: results.map(r => ({ id: r.chunkId, text: r.content })),
          top_n: results.length,
        } as RerankRequest),
      });

      if (!response.ok) {
        throw new Error(`Cohere API error: ${response.status}`);
      }

      const rerankData = await response.json() as RerankResponse;

      const rerankedResults = rerankData.results
        .sort((a, b) => b.relevance_score - a.relevance_score)
        .map(item => ({
          ...results[item.index],
          score: item.relevance_score,
        }));

      this.logger.log(`Reranked ${rerankedResults.length} results`);
      return rerankedResults;
    } catch (error) {
      this.logger.error('Rerank failed:', error);
      return results;
    }
  }

  /**
   * 构建上下文
   */
  private buildContext(results: RetrievalResult[]): string {
    if (results.length === 0) return '';

    return results
      .map((result, index) => {
        const source = result.metadata.chapter
          ? `${result.metadata.chapter} - ${result.metadata.section || ''}`
          : `文档 ${result.documentId}`;
        return `[来源${index + 1}：${source}]\n${result.content}`;
      })
      .join('\n\n---\n\n');
  }

  /**
   * 获取相似问题
   */
  async getSimilarQuestions(
    question: string,
    topK: number = 5,
  ): Promise<string[]> {
    const result = await this.retrieve({
      query: question,
      topK,
    });

    if (!result.success || !result.data) {
      return [];
    }

    return result.data.results
      .filter(r => r.content.includes('?') || r.content.includes('？'))
      .map(r => r.content)
      .slice(0, topK);
  }
}
