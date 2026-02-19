/**
 * Agent API Client
 * Handles all communication with the backend Agent services
 */

import type {
  QuizQuestion,
  Difficulty as SharedDifficulty,
  ErrorType as SharedErrorType,
  QuizExplanation,
  Option,
  QuestionType,
} from '@shared/types/genetics.types';
import type { VisualizationSuggestion } from '@shared/types/agent.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// Agent API base URL includes the /api prefix
const AGENT_API_BASE = `${API_BASE_URL}/api`;

// ==================== Types ====================

export type UserLevel = 'beginner' | 'intermediate' | 'advanced';
// 使用共享类型的 Difficulty，但为了向后兼容，重新导出
export type Difficulty = SharedDifficulty;
export type ErrorType = SharedErrorType;
export type ResourceType = 'video' | 'article' | 'paper' | 'book' | 'course' | 'interactive';

export interface ConceptAnalysis {
  concept: string;
  domain: string;
  complexity: 'basic' | 'intermediate' | 'advanced';
  visualizationPotential: number;
  suggestedVisualizations: string[];
  keyTerms: string[];
}

export interface PrerequisiteNode {
  concept: string;
  isFoundation: boolean;
  level: number;
  prerequisites?: PrerequisiteNode[];
}

export interface GeneticsEnrichment {
  concept: string;
  definition: string;
  principles: string[];
  formulas: Array<{
    key: string;
    latex: string;
    variables: Record<string, string>;
  }>;
  examples: Array<{
    name: string;
    description: string;
  }>;
  misconceptions: string[];
  visualization: {
    type: 'knowledge_graph' | 'animation' | 'chart' | 'diagram';
    elements: string[];
    colors?: Record<string, string>;
  };
}

export interface NarrativeComposition {
  learningPath: string[];
  explanationOrder: string[];
  connectingStories: string[];
  difficultyProgression: 'linear' | 'spiral' | 'hierarchical';
}

// 重新导出共享类型
export type { QuizQuestion, QuizExplanation, Option, QuestionType };

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  publishedDate?: string;
  source: string;
  relevanceScore?: number;
}

export interface ResourceRecommendation {
  id: string;
  type: ResourceType;
  title: string;
  description: string;
  url?: string;
  author?: string;
  publisher?: string;
  duration?: number;
  readingTime?: number;
  difficulty?: UserLevel;
  tags: string[];
  thumbnailUrl?: string;
  rating?: number;
  relevanceScore: number;
  source: string;
}

export interface PipelineInput {
  concept: string;
  userLevel?: UserLevel;
  learningGoal?: string;
  focusAreas?: string[];
}

export interface PipelineOutput {
  conceptAnalysis: ConceptAnalysis;
  prerequisiteTree: PrerequisiteNode;
  geneticsEnrichment: GeneticsEnrichment;
  visualDesign: VisualizationSuggestion;
  narrativeComposition: NarrativeComposition;
  quiz?: QuizQuestion;
}

// ==================== API Client ====================

class AgentApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = AGENT_API_BASE) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  // ==================== Pipeline ====================

  async executePipeline(input: PipelineInput): Promise<PipelineOutput> {
    return this.request<PipelineOutput>('/agent/pipeline', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async quickAnalyze(concept: string): Promise<{
    analysis: ConceptAnalysis;
    tree: PrerequisiteNode;
  }> {
    return this.request(`/agent/quick?concept=${encodeURIComponent(concept)}`);
  }

  async getLearningPath(
    concept: string,
    userLevel?: UserLevel
  ): Promise<{
    path: string[];
    enrichedContent: Map<string, GeneticsEnrichment>;
  }> {
    const params = new URLSearchParams({ concept });
    if (userLevel) params.append('userLevel', userLevel);
    return this.request(`/agent/learning-path?${params}`);
  }

  // ==================== Concept Analyzer ====================

  async analyzeConcept(concept: string, userLevel?: UserLevel): Promise<ConceptAnalysis> {
    return this.request<ConceptAnalysis>('/agent/analyze', {
      method: 'POST',
      body: JSON.stringify({ concept, userLevel }),
    });
  }

  // ==================== Prerequisite Explorer ====================

  async explorePrerequisites(
    concept: string,
    maxDepth: number = 3
  ): Promise<{
    tree: PrerequisiteNode;
    learningPath: string[];
    textRepresentation: string;
  }> {
    return this.request('/agent/explore', {
      method: 'POST',
      body: JSON.stringify({ concept, maxDepth }),
    });
  }

  // ==================== Genetics Enricher ====================

  async enrichConcept(concept: string): Promise<GeneticsEnrichment> {
    return this.request<GeneticsEnrichment>('/agent/enrich', {
      method: 'POST',
      body: JSON.stringify({ concept }),
    });
  }

  // ==================== Visual Designer ====================

  async designVisualization(
    concept: string,
    options?: {
      includeEnrichment?: boolean;
      includePrerequisites?: boolean;
    }
  ): Promise<{
    visualization: VisualizationSuggestion;
    d3Config: Record<string, unknown>;
    graphData?: {
      nodes: Array<{ id: string; label: string; level: number; isFoundation: boolean }>;
      links: Array<{ source: string; target: string }>;
    };
  }> {
    return this.request('/agent/visualize', {
      method: 'POST',
      body: JSON.stringify({ concept, ...options }),
    });
  }

  async getVisualizationCode(concept: string): Promise<{
    code: string;
    visualization: VisualizationSuggestion;
  }> {
    return this.request(`/agent/visualize/code?concept=${encodeURIComponent(concept)}`);
  }

  async askVisualizationQuestion(params: {
    concept: string;
    question: string;
    conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
  }): Promise<{
    textAnswer: string;
    visualization?: VisualizationSuggestion;
    followUpQuestions?: string[];
    relatedConcepts?: string[];
  }> {
    return this.request('/agent/visualize/ask', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async getHardcodedConcepts(): Promise<Array<{
    concept: string;
    title: string;
    type: string;
    description: string;
  }>> {
    return this.request('/agent/visualize/concepts');
  }

  // ==================== Narrative Composer ====================

  async composeNarrative(
    concept: string
  ): Promise<{
    narrative: NarrativeComposition;
    treeText: string;
  }> {
    return this.request('/agent/narrative', {
      method: 'POST',
      body: JSON.stringify({ concept }),
    });
  }

  async generateLearningScript(
    concept: string
  ): Promise<{
    narrative: NarrativeComposition;
    script: string;
    estimatedTime: number;
    checkpoints: string[];
  }> {
    return this.request('/agent/narrative/script', {
      method: 'POST',
      body: JSON.stringify({ concept }),
    });
  }

  async generateInteractiveFlow(
    concept: string
  ): Promise<{
    narrative: NarrativeComposition;
    flow: Array<{
      step: number;
      title: string;
      content: string;
      type: 'explanation' | 'question' | 'activity' | 'assessment';
      interaction?: string;
    }>;
  }> {
    return this.request('/agent/narrative/interactive', {
      method: 'POST',
      body: JSON.stringify({ concept }),
    });
  }

  // ==================== Quiz Generator ====================

  async generateQuiz(params: {
    topic: string;
    difficulty: Difficulty;
    count?: number;
    userLevel?: UserLevel;
  }): Promise<QuizQuestion | QuizQuestion[]> {
    return this.request('/agent/quiz/generate', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async evaluateAnswer(params: {
    question: string;
    correctAnswer: string;
    userAnswer: string;
  }): Promise<{
    isCorrect: boolean;
    confidence: number;
    reason: string;
  }> {
    return this.request('/agent/quiz/evaluate', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async generateSimilarQuestions(params: {
    question: string;
    topic: string;
    userAnswer: string;
    errorType: ErrorType;
    count?: number;
  }): Promise<{ similarQuestions: QuizQuestion[] }> {
    return this.request('/agent/quiz/similar', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async generateQuizForTopic(params: {
    topic: string;
    difficulty?: Difficulty;
    count?: number;
    userLevel?: UserLevel;
  }): Promise<QuizQuestion[]> {
    const queryParams = new URLSearchParams({
      topic: params.topic,
      difficulty: params.difficulty || 'medium',
      count: String(params.count || 5),
    });
    if (params.userLevel) {
      queryParams.append('userLevel', params.userLevel);
    }
    return this.request(`/agent/quiz/topic?${queryParams}`);
  }

  // ==================== Skills ====================

  async webSearch(params: {
    query: string;
    numResults?: number;
    language?: string;
    timeRange?: 'day' | 'week' | 'month' | 'year' | 'all';
  }): Promise<{
    skill: string;
    success: boolean;
    data?: {
      query: string;
      results: SearchResult[];
      totalCount: number;
      searchTime: number;
      hasMore: boolean;
    };
    error?: string;
  }> {
    return this.request('/agent/skills/search', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async searchForConcept(concept: string): Promise<{
    query: string;
    results: SearchResult[];
    totalCount: number;
    searchTime: number;
    hasMore: boolean;
  }> {
    return this.request('/agent/skills/search/concept', {
      method: 'POST',
      body: JSON.stringify({ concept }),
    });
  }

  async recommendResources(params: {
    concept: string;
    userLevel?: UserLevel;
    preferredTypes?: ResourceType[];
    language?: string;
    count?: number;
  }): Promise<{
    skill: string;
    success: boolean;
    data?: {
      concept: string;
      recommendations: ResourceRecommendation[];
      totalCount: number;
      filters?: {
        types: ResourceType[];
        difficulty: string;
      };
    };
    error?: string;
  }> {
    return this.request('/agent/skills/resources', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }
}

// ==================== Export ====================

export const agentApi = new AgentApiClient();

// Default export for convenience
export default agentApi;
