/**
 * RAG 配置
 */

export interface VectorStoreConfig {
  type: 'pinecone' | 'weaviate';
  apiKey: string;
  environment?: string;
  indexName: string;
  baseURL?: string;
}

export interface EmbeddingConfig {
  provider: 'openai' | 'cohere';
  model: string;
  dimensions: number;
}

export interface RAGConfig {
  vectorStore: VectorStoreConfig;
  embedding: EmbeddingConfig;
  chunkSize: number;
  chunkOverlap: number;
  topK: number;
  threshold: number;
}

export const DEFAULT_RAG_CONFIG: Partial<RAGConfig> = {
  chunkSize: 1000,
  chunkOverlap: 200,
  topK: 5,
  threshold: 0.7,
  embedding: {
    provider: 'openai',
    model: 'text-embedding-3-small',
    dimensions: 1536,
  },
};
