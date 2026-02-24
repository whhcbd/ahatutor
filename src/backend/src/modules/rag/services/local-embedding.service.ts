import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LocalEmbeddingService implements OnModuleInit {
  private vectorDimension = 2000;
  private initialized = false;

  async onModuleInit() {
    await this.initialize();
  }

  private async initialize() {
    try {
      const basePath = path.join(process.cwd(), '..', 'data', 'external', 'genetics-rag');
      const vectorsPath = process.env.RAG_VECTORS_FILE || 
        path.join(basePath, 'vectors_fine_grained.json');

      if (!fs.existsSync(vectorsPath)) {
        console.warn('⚠️  Vector file not found, using fallback initialization');
        this.initializeFallback();
        return;
      }

      const vectorsData = JSON.parse(fs.readFileSync(vectorsPath, 'utf-8'));
      console.log(`🔍 LocalEmbeddingService: Loading ${vectorsData.length} vectors from ${vectorsPath}`);
      
      if (vectorsData.length > 0 && vectorsData[0] && vectorsData[0].vector && Array.isArray(vectorsData[0].vector)) {
        this.vectorDimension = vectorsData[0].vector.length;
        console.log(`   Detected vector dimension: ${this.vectorDimension}`);
      }

      this.initialized = true;
      console.log('✅ LocalEmbeddingService initialized');
      console.log(`   Vector dimension: ${this.vectorDimension}\n`);
    } catch (error) {
      console.warn('⚠️  Failed to load vector stats, using fallback');
      console.error('Error details:', error);
      this.initializeFallback();
    }
  }

  private initializeFallback() {
    this.vectorDimension = 2000;
    this.initialized = true;
    console.log('✅ LocalEmbeddingService initialized (fallback mode)\n');
  }

  async embed(text: string): Promise<number[]> {
    if (!this.initialized) {
      await this.initialize();
    }

    return this.textToVector(text);
  }

  async embedBatch(texts: string[]): Promise<number[][]> {
    if (!this.initialized) {
      await this.initialize();
    }

    return texts.map(text => this.textToVector(text));
  }

  private textToVector(text: string): number[] {
    const vector = new Array(this.vectorDimension).fill(0);
    const words = text.match(/[\u4e00-\u9fa5]+|[a-zA-Z]+/g) || [];

    for (const word of words) {
      const key = word.toLowerCase();
      const index = this.hashString(key) % this.vectorDimension;
      vector[index]++;
    }

    const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    if (norm > 0) {
      for (let i = 0; i < vector.length; i++) {
        vector[i] = vector[i] / norm;
      }
    }

    return vector;
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  cosineSimilarity(vec1: number[], vec2: number[]): number {
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
}
