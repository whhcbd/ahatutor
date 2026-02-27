import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { pipeline, env } from '@xenova/transformers';

env.allowLocalModels = true;
env.allowRemoteModels = true;

export interface EmbeddingModelConfig {
  modelName: string;
  revision?: string;
  quantized?: boolean;
  progressCallback?: (progress: number) => void;
}

@Injectable()
export class EnhancedLocalEmbeddingService implements OnModuleInit {
  private readonly logger = new Logger(EnhancedLocalEmbeddingService.name);
  private embeddingPipeline: any = null;
  private initialized = false;
  private vectorDimension = 768;
  private modelName = 'Xenova/all-MiniLM-L6-v2';

  private config: EmbeddingModelConfig = {
    modelName: 'Xenova/all-MiniLM-L6-v2',
    revision: 'main',
    quantized: true
  };

  async onModuleInit() {
    try {
      await this.initialize();
    } catch (error) {
      this.logger.warn('⚠️ 本地embedding模型初始化失败，将在需要时重试');
      this.logger.warn('错误详情:', error instanceof Error ? error.message : String(error));
      this.initialized = false;
    }
  }

  async initialize(config?: Partial<EmbeddingModelConfig>) {
    if (this.initialized && !config) {
      return;
    }

    if (config) {
      this.config = { ...this.config, ...config };
    }

    try {
      this.logger.log(`正在加载本地embedding模型: ${this.config.modelName}`);
      this.logger.log('首次加载需要下载模型，请耐心等待...');

      const progressCallback = (progress: any) => {
        if (progress.status === 'progress') {
          const percent = progress.progress || 0;
          if (config?.progressCallback) {
            config.progressCallback(percent);
          }
          if (percent % 10 === 0) {
            this.logger.debug(`模型下载进度: ${Math.round(percent)}%`);
          }
        } else if (progress.status === 'done') {
          this.logger.log('模型下载完成');
        } else if (progress.status === 'error') {
          this.logger.error('模型下载失败:', progress);
        }
      };

      this.embeddingPipeline = await pipeline(
        'feature-extraction',
        this.config.modelName,
        {
          quantized: this.config.quantized,
          progress_callback: progressCallback,
          revision: this.config.revision
        }
      );

      const testVector = await this.embeddingPipeline('test');
      this.vectorDimension = testVector.dims[2];

      this.initialized = true;
      this.logger.log(`✅ 本地embedding模型加载成功`);
      this.logger.log(`   模型: ${this.config.modelName}`);
      this.logger.log(`   向量维度: ${this.vectorDimension}`);
      this.logger.log(`   量化: ${this.config.quantized ? '是' : '否'}\n`);
    } catch (error) {
      this.logger.error('❌ 本地embedding模型加载失败:', error);
      this.initialized = false;
      throw error;
    }
  }

  async embed(text: string): Promise<number[]> {
    if (!this.initialized) {
      try {
        await this.initialize();
      } catch (error) {
        this.logger.warn('本地embedding模型不可用，使用fallback方法');
        return this.generateFallbackEmbedding(text);
      }
    }

    if (!this.embeddingPipeline) {
      this.logger.warn('Embedding pipeline not initialized, using fallback method');
      return this.generateFallbackEmbedding(text);
    }

    try {
      const result = await this.embeddingPipeline(text, {
        pooling: 'mean',
        normalize: true
      });

      return Array.from(result.data);
    } catch (error) {
      this.logger.error(`生成embedding失败: ${error}`);
      throw error;
    }
  }

  private generateFallbackEmbedding(text: string): number[] {
    const vector: number[] = [];
    const length = 2000;

    for (let i = 0; i < length; i++) {
      const charCode = text.charCodeAt(i % text.length) || 0;
      const position = i / length;
      const value = Math.sin(charCode * position * 0.1) * Math.cos(i * 0.01);
      vector.push(value);
    }

    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    if (magnitude > 0) {
      for (let i = 0; i < vector.length; i++) {
        vector[i] /= magnitude;
      }
    }

    return vector;
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    if (!this.initialized) {
      await this.initialize();
    }

    if (!this.embeddingPipeline) {
      throw new Error('Embedding pipeline not initialized');
    }

    try {
      const batchSize = 32;
      const embeddings: number[][] = [];

      for (let i = 0; i < texts.length; i += batchSize) {
        const batch = texts.slice(i, i + batchSize);
        
        this.logger.debug(`正在批量生成embedding: ${i + 1}-${Math.min(i + batchSize, texts.length)}/${texts.length}`);
        
        const result = await this.embeddingPipeline(batch, {
          pooling: 'mean',
          normalize: true
        });

        for (let j = 0; j < batch.length; j++) {
          embeddings.push(Array.from(result.data[j]));
        }
      }

      return embeddings;
    } catch (error) {
      this.logger.error(`批量生成embedding失败: ${error}`);
      throw error;
    }
  }

  cosineSimilarity(vec1: number[], vec2: number[]): number {
    if (!vec1 || !vec2 || !Array.isArray(vec1) || !Array.isArray(vec2)) {
      return 0;
    }
    if (vec1.length === 0 || vec2.length === 0) {
      return 0;
    }
    if (vec1.length !== vec2.length) {
      this.logger.warn(`向量维度不匹配: vec1=${vec1.length}, vec2=${vec2.length}`);
      return 0;
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

  euclideanDistance(vec1: number[], vec2: number[]): number {
    if (!vec1 || !vec2 || !Array.isArray(vec1) || !Array.isArray(vec2)) {
      return Infinity;
    }
    if (vec1.length !== vec2.length) {
      this.logger.warn(`向量维度不匹配: vec1=${vec1.length}, vec2=${vec2.length}`);
      return Infinity;
    }

    let sum = 0;
    for (let i = 0; i < vec1.length; i++) {
      const diff = vec1[i] - vec2[i];
      sum += diff * diff;
    }

    return Math.sqrt(sum);
  }

  getVectorDimension(): number {
    return this.vectorDimension;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  getModelInfo(): { modelName: string; dimension: number; quantized: boolean } {
    return {
      modelName: this.config.modelName,
      dimension: this.vectorDimension,
      quantized: this.config.quantized || false
    };
  }

  async testEmbedding(text: string = '这是一个测试文本'): Promise<{
    text: string;
    embedding: number[];
    dimension: number;
    sampleValues: number[];
  }> {
    if (!this.initialized) {
      await this.initialize();
    }

    const embedding = await this.embed(text);
    
    return {
      text,
      embedding,
      dimension: embedding.length,
      sampleValues: embedding.slice(0, 5)
    };
  }
}

@Injectable()
export class MultiModelEmbeddingService {
  private readonly logger = new Logger(MultiModelEmbeddingService.name);
  private services = new Map<string, EnhancedLocalEmbeddingService>();

  async getModel(modelName: string): Promise<EnhancedLocalEmbeddingService> {
    if (this.services.has(modelName)) {
      return this.services.get(modelName)!;
    }

    const service = new EnhancedLocalEmbeddingService();
    await service.initialize({ modelName });
    
    this.services.set(modelName, service);
    return service;
  }

  async switchModel(modelName: string): Promise<EnhancedLocalEmbeddingService> {
    this.logger.log(`切换到模型: ${modelName}`);
    return await this.getModel(modelName);
  }

  getAvailableModels(): string[] {
    return [
      'Xenova/all-MiniLM-L6-v2',
      'Xenova/all-mpnet-base-v2',
      'Xenova/bge-small-en-v1.5',
      'Xenova/bge-base-zh-v1.5',
      'Xenova/m3e-base'
    ];
  }
}
