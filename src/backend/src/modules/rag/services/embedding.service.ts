import { Injectable } from '@nestjs/common';
import { LLMService } from '../../llm/llm.service';

/**
 * 向量化服务
 * 将文本转换为向量表示（嵌入）
 */
@Injectable()
export class EmbeddingService {
  constructor(private readonly llmService: LLMService) {}

  /**
   * 生成单个文本的嵌入向量
   * @param text 文本内容
   * @returns 嵌入向量
   */
  async embed(text: string): Promise<number[]> {
    try {
      const embedding = await this.llmService.generateEmbedding(text);
      return embedding;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to generate embedding: ${message}`);
    }
  }

  /**
   * 批量生成嵌入向量
   * @param texts 文本数组
   * @returns 嵌入向量数组
   */
  async embedBatch(texts: string[]): Promise<number[][]> {
    const embeddings: number[][] = [];

    // 分批处理，避免 API 速率限制
    const batchSize = 20;
    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      const batchEmbeddings = await Promise.all(
        batch.map((text) => this.embed(text)),
      );
      embeddings.push(...batchEmbeddings);
    }

    return embeddings;
  }

  /**
   * 计算两个向量之间的余弦相似度
   * @param vec1 向量1
   * @param vec2 向量2
   * @returns 相似度分数 (0-1)
   */
  cosineSimilarity(vec1: number[], vec2: number[]): number {
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

  /**
   * 计算欧氏距离
   * @param vec1 向量1
   * @param vec2 向量2
   * @returns 距离
   */
  euclideanDistance(vec1: number[], vec2: number[]): number {
    if (vec1.length !== vec2.length) {
      throw new Error('Vectors must have the same length');
    }

    let sum = 0;
    for (let i = 0; i < vec1.length; i++) {
      const diff = vec1[i] - vec2[i];
      sum += diff * diff;
    }

    return Math.sqrt(sum);
  }
}
