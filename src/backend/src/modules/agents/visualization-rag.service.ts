import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { LLMService } from '../llm/llm.service';
import { getHardcodedVisualization, getHardcodedConceptList } from './data/hardcoded-visualizations.data';
import { VisualizationSuggestion } from '@shared/types/agent.types';

interface VisualizationEmbedding {
  concept: string;
  title: string;
  description: string;
  elements: string[];
  type: string;
  visualization: Omit<VisualizationSuggestion, 'insights'>;
  embedding: number[];
}

export interface VisualizationMatch {
  concept: string;
  title: string;
  score: number;
  visualization: Omit<VisualizationSuggestion, 'insights'>;
}

@Injectable()
export class VisualizationRAGService implements OnModuleInit {
  private readonly logger = new Logger(VisualizationRAGService.name);
  private embeddings: VisualizationEmbedding[] = [];
  private isInitialized = false;

  constructor(private readonly llmService: LLMService) {}

  async onModuleInit() {
    await this.initializeVisualizationIndex();
  }

  async initializeVisualizationIndex() {
    this.logger.log('Initializing visualization RAG index...');

    try {
      const concepts = getHardcodedConceptList();
      this.embeddings = [];

      for (const concept of concepts) {
        const viz = getHardcodedVisualization(concept);
        if (viz) {
          const searchKey = this.buildSearchKey(concept, viz);
          const embedding = await this.llmService.generateEmbedding(searchKey);

          this.embeddings.push({
            concept,
            title: viz.title,
            description: viz.description,
            elements: viz.elements,
            type: viz.type,
            visualization: viz,
            embedding,
          });
        }
      }

      this.isInitialized = true;
      this.logger.log(`Visualization RAG index initialized with ${this.embeddings.length} visualizations`);
    } catch (error) {
      this.logger.error('Failed to initialize visualization index:', error);
    }
  }

  private buildSearchKey(concept: string, viz: Omit<VisualizationSuggestion, 'insights'>): string {
    return `${concept} ${viz.title} ${viz.description} ${viz.elements.join(' ')}`;
  }

  async retrieveByQuestion(
    question: string,
    threshold: number = 0.7,
    topK: number = 3
  ): Promise<VisualizationMatch[]> {
    if (!this.isInitialized) {
      this.logger.warn('Visualization index not initialized, initializing now...');
      await this.initializeVisualizationIndex();
    }

    if (this.embeddings.length === 0) {
      return [];
    }

    try {
      const questionEmbedding = await this.llmService.generateEmbedding(question);

      const matches: VisualizationMatch[] = this.embeddings
        .map((viz) => ({
          concept: viz.concept,
          title: viz.title,
          score: this.cosineSimilarity(questionEmbedding, viz.embedding),
          visualization: viz.visualization,
        }))
        .filter((match) => match.score >= threshold)
        .sort((a, b) => b.score - a.score)
        .slice(0, topK);

      if (matches.length > 0) {
        this.logger.log(`Found ${matches.length} matching visualizations for question: "${question}"`);
        matches.forEach((m, i) => {
          this.logger.debug(`  ${i + 1}. ${m.concept} (${m.title}): score=${m.score.toFixed(3)}`);
        });
      }

      return matches;
    } catch (error) {
      this.logger.error('Failed to retrieve visualization by question:', error);
      return [];
    }
  }

  async retrieveByConcept(
    concept: string,
    threshold: number = 0.5
  ): Promise<VisualizationMatch | null> {
    if (!this.isInitialized) {
      await this.initializeVisualizationIndex();
    }

    const viz = getHardcodedVisualization(concept);
    if (!viz) {
      return null;
    }

    try {
      const conceptEmbedding = await this.llmService.generateEmbedding(concept);

      const embedding = this.embeddings.find((e) => e.concept === concept);
      if (!embedding) {
        return null;
      }

      const score = this.cosineSimilarity(conceptEmbedding, embedding.embedding);

      if (score >= threshold) {
        return {
          concept,
          title: embedding.title,
          score,
          visualization: embedding.visualization,
        };
      }

      return null;
    } catch (error) {
      this.logger.error('Failed to retrieve visualization by concept:', error);
      return null;
    }
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      return 0;
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    if (normA === 0 || normB === 0) {
      return 0;
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  getIndexStatus() {
    return {
      isInitialized: this.isInitialized,
      count: this.embeddings.length,
      concepts: this.embeddings.map((e) => e.concept),
    };
  }

  async reinitializeIndex() {
    this.logger.log('Reinitializing visualization index...');
    await this.initializeVisualizationIndex();
  }
}
