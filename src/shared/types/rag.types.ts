/**
 * RAG (Retrieval-Augmented Generation) 相关类型定义
 */

// 文档类型
export enum DocumentType {
  PDF = 'pdf',
  WORD = 'word',
  MARKDOWN = 'markdown',
  TEXT = 'text',
}

// 文档状态
export enum DocumentStatus {
  UPLOADING = 'uploading',
  PARSING = 'parsing',
  VECTORIZING = 'vectorizing',
  READY = 'ready',
  ERROR = 'error',
}

// 文档块
export interface DocumentChunk {
  id: string;
  documentId: string;
  content: string;
  metadata: {
    pageNumber?: number;
    chapter?: string;
    section?: string;
    tags?: string[];
  };
  embedding?: number[];
}

// 文档
export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  status: DocumentStatus;
  size: number;
  uploadedAt: Date;
  processedAt?: Date;
  chunks: DocumentChunk[];
  metadata: {
    source?: string;
    author?: string;
    title?: string;
  };
}

// 查询选项
export interface QueryOptions {
  topK?: number; // 返回结果数量
  threshold?: number; // 相似度阈值
  filter?: {
    documentId?: string;
    tags?: string[];
    chapter?: string;
  };
}

// 查询结果
export interface QueryResult {
  chunk: DocumentChunk;
  score: number; // 相似度分数
  relevance: 'high' | 'medium' | 'low';
}

// 消息角色
export enum MessageRole {
  SYSTEM = 'system',
  USER = 'user',
  ASSISTANT = 'assistant',
}

// 聊天消息
export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  imageUrl?: string; // 多模态支持
}

// 对话会话
export interface ChatSession {
  id: string;
  userId: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  metadata: {
    topic?: string;
    mode?: 'speed' | 'depth';
  };
}

// RAG 服务接口
export interface RAGServiceConfig {
  vectorStore: {
    type: 'pinecone' | 'weaviate';
    apiKey: string;
    environment?: string;
    indexName: string;
  };
  embedding: {
    provider: 'openai' | 'cohere';
    model: string;
    dimensions: number;
  };
  chunkSize: number;
  chunkOverlap: number;
}

// 流式响应
export interface StreamResponse {
  content: string;
  done: boolean;
  sources?: QueryResult[];
}
