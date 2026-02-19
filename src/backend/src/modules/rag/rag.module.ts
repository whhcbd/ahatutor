import { Module } from '@nestjs/common';
import { RAGController } from './rag.controller';
import { RAGService } from './services/rag.service';
import { DocumentService } from './services/document.service';
import { ChunkService } from './services/chunk.service';
import { EmbeddingService } from './services/embedding.service';
import { VectorStoreService } from './services/vector-store.service';
import { RetrievalService } from './services/retrieval.service';
import { DocumentIndexingService } from './services/document-indexing.service';
import { DocumentSplitterService } from './services/document-splitter.service';
import { VectorRetrievalService } from './services/vector-retrieval.service';
import { ContextRetrievalService } from './services/context-retrieval.service';
import { StreamingAnswerService } from './services/streaming-answer.service';
import { LLMModule } from '../llm/llm.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [LLMModule.register(), ConfigModule],
  controllers: [RAGController],
  providers: [
    RAGService,
    DocumentService,
    ChunkService,
    EmbeddingService,
    VectorStoreService,
    RetrievalService,
    DocumentIndexingService,
    DocumentSplitterService,
    VectorRetrievalService,
    ContextRetrievalService,
    StreamingAnswerService,
  ],
  exports: [
    RAGService,
    DocumentService,
    ChunkService,
    EmbeddingService,
    VectorStoreService,
    RetrievalService,
    DocumentIndexingService,
    DocumentSplitterService,
    VectorRetrievalService,
    ContextRetrievalService,
    StreamingAnswerService,
  ],
})
export class RAGModule {}
