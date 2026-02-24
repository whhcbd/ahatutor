import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import type { DocumentChunk } from '@shared/types/rag.types';

interface LocalVectorData {
  id: string;
  vector: number[];
  content: string;
  metadata: {
    chapter?: string;
    section?: string;
    subsection?: string;
    level?: number;
    chunkType?: string;
  };
}

@Injectable()
export class LocalVectorStoreService implements OnModuleInit {
  private vectors: Map<string, number[]> = new Map();
  private chunks: Map<string, DocumentChunk> = new Map();
  private initialized = false;

  async onModuleInit() {
    await this.initialize();
  }

  private async initialize() {
    try {
      const basePath = path.join(process.cwd(), 'data', 'external', 'genetics-rag');
      const chunksPath = process.env.RAG_CHUNKS_FILE || 
        path.join(basePath, 'chunks_fine_grained_simplified.json');
      const vectorsPath = process.env.RAG_VECTORS_FILE || 
        path.join(basePath, 'vectors_fine_grained.json');

      console.log('🔄 Loading fine-grained RAG data...');
      console.log(`   Base path: ${basePath}`);
      console.log(`   Chunks: ${chunksPath}`);
      console.log(`   Vectors: ${vectorsPath}`);

      if (!fs.existsSync(chunksPath)) {
        throw new Error(`Chunks file not found: ${chunksPath}`);
      }

      if (!fs.existsSync(vectorsPath)) {
        throw new Error(`Vectors file not found: ${vectorsPath}`);
      }

      const chunksData = JSON.parse(fs.readFileSync(chunksPath, 'utf-8'));
      const vectorsData: any[] = JSON.parse(fs.readFileSync(vectorsPath, 'utf-8'));

      console.log(`Loading ${chunksData.length} chunks and ${vectorsData.length} vectors...`);
      
      if (vectorsData.length > 0) {
        console.log(`First vector entry:`, JSON.stringify(vectorsData[0], null, 2).substring(0, 500));
      }

      for (const chunk of chunksData) {
        if (!chunk || !chunk.id) continue;
        this.chunks.set(chunk.id, {
          id: chunk.id,
          documentId: chunk.chapter || 'genetics_textbook_v4_fine_grained',
          content: chunk.content || '',
          metadata: {
            chapter: chunk.chapter,
            section: chunk.section,
            subsection: chunk.subsection,
            tags: [],
          },
        });
      }

      for (const vectorData of vectorsData) {
        if (!vectorData || !vectorData.id) continue;
        const vector = vectorData.vector;
        if (vector && Array.isArray(vector)) {
          this.vectors.set(vectorData.id, vector);
        }
      }

      console.log(`✅ Loaded ${this.chunks.size} chunks`);
      console.log(`✅ Loaded ${this.vectors.size} vectors`);
      
      if (this.vectors.size > 0) {
        const firstVector = this.vectors.values().next().value;
        console.log(`First vector length: ${firstVector?.length}, sample values: [${firstVector?.slice(0, 3)}]`);
      }
      
      this.initialized = true;
      console.log('✅ Fine-grained RAG system initialized!\n');
    } catch (error) {
      console.error('❌ Failed to initialize local vector store:', error);
      this.initialized = false;
      throw error;
    }
  }

  async similaritySearch(
    queryEmbedding: number[],
    options: {
      topK?: number;
      threshold?: number;
      filter?: {
        tags?: string[];
        chapter?: string;
      };
    } = {},
  ): Promise<Array<{ chunk: DocumentChunk; score: number }>> {
    if (!this.initialized) {
      await this.initialize();
    }

    const { topK = 5, threshold = 0.7, filter } = options;
    const results: Array<{ chunk: DocumentChunk; score: number }> = [];

    for (const [chunkId, vector] of this.vectors.entries()) {
      const chunk = this.chunks.get(chunkId);
      if (!chunk) continue;

      if (filter?.chapter && chunk.metadata.chapter !== filter.chapter) {
        continue;
      }

      const score = this.cosineSimilarity(queryEmbedding, vector);
      if (score >= threshold) {
        results.push({ chunk, score });
      }
    }

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, topK);
  }

  async getChunk(chunkId: string): Promise<DocumentChunk | undefined> {
    if (!this.initialized) {
      await this.initialize();
    }
    return this.chunks.get(chunkId);
  }

  async getAllChunks(): Promise<DocumentChunk[]> {
    if (!this.initialized) {
      await this.initialize();
    }
    return Array.from(this.chunks.values());
  }

  async getStats(): Promise<{
    totalChunks: number;
    totalVectors: number;
    chapters: Set<string>;
  }> {
    if (!this.initialized) {
      await this.initialize();
    }

    const chapters = new Set<string>();
    for (const chunk of this.chunks.values()) {
      if (chunk.metadata.chapter) {
        chapters.add(chunk.metadata.chapter);
      }
    }

    return {
      totalChunks: this.chunks.size,
      totalVectors: this.vectors.size,
      chapters,
    };
  }

  private cosineSimilarity(vec1: number[], vec2: number[]): number {
    if (!vec1 || !vec2 || !Array.isArray(vec1) || !Array.isArray(vec2)) {
      return 0;
    }
    if (vec1.length === 0 || vec2.length === 0) {
      return 0;
    }
    if (vec1.length !== vec2.length) {
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

  async reload(): Promise<void> {
    console.log('🔄 Reloading fine-grained RAG data...');
    this.vectors.clear();
    this.chunks.clear();
    this.initialized = false;
    await this.initialize();
  }
}
