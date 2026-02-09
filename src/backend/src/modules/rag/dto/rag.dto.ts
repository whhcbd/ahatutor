import { IsString, IsOptional, IsNumber, IsObject } from 'class-validator';
import { DocumentType, DocumentStatus } from '../../../../shared/types/rag.types';

/**
 * 上传文档 DTO
 */
export class UploadDocumentDto {
  @IsString()
  name: string;

  @IsString()
  content: string;

  @IsOptional()
  type?: DocumentType;

  @IsOptional()
  @IsObject()
  metadata?: {
    source?: string;
    author?: string;
    title?: string;
    tags?: string[];
  };
}

/**
 * 查询 DTO
 */
export class QueryDto {
  @IsString()
  query: string;

  @IsOptional()
  @IsNumber()
  topK?: number = 5;

  @IsOptional()
  @IsNumber()
  threshold?: number = 0.7;

  @IsOptional()
  documentId?: string;
}

/**
 * 文档响应 DTO
 */
export interface DocumentResponseDto {
  id: string;
  name: string;
  type: DocumentType;
  status: DocumentStatus;
  size: number;
  uploadedAt: Date;
  processedAt?: Date;
  chunkCount: number;
  metadata: {
    source?: string;
    author?: string;
    title?: string;
  };
}

/**
 * 查询结果响应 DTO
 */
export interface QueryResponseDto {
  query: string;
  results: Array<{
    content: string;
    score: number;
    relevance: 'high' | 'medium' | 'low';
    metadata: {
      documentId: string;
      documentName: string;
      chunkId: string;
      pageNumber?: number;
      chapter?: string;
      section?: string;
    };
  }>;
  totalResults: number;
}
