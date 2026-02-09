import { Module } from '@nestjs/common';
import { RAGController } from './rag.controller';
import { DocumentService } from './services/document.service';
import { ChunkService } from './services/chunk.service';
import { EmbeddingService } from './services/embedding.service';
import { VectorStoreService } from './services/vector-store.service';
import { RetrievalService } from './services/retrieval.service';
import { LLMModule } from '../llm/llm.module';

@Module({
  imports: [LLMModule.register()],
  controllers: [RAGController],
  providers: [
    DocumentService,
    ChunkService,
    EmbeddingService,
    VectorStoreService,
    RetrievalService,
  ],
  exports: [
    DocumentService,
    ChunkService,
    EmbeddingService,
    VectorStoreService,
    RetrievalService,
  ],
})
export class RAGModule {}
