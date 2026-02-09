import type { QuizQuestion } from './genetics.types';

/**
 * Agent 相关类型定义
 */

// Agent 类型枚举
export enum AgentType {
  CONCEPT_ANALYZER = 'concept_analyzer',
  PREREQUISITE_EXPLORER = 'prerequisite_explorer',
  GENETICS_ENRICHER = 'genetics_enricher',
  VISUAL_DESIGNER = 'visual_designer',
  NARRATIVE_COMPOSER = 'narrative_composer',
  QUIZ_GENERATOR = 'quiz_generator',
}

// LLM 提供商类型
export enum LLMProvider {
  OPENAI = 'openai',
  CLAUDE = 'claude',
  DEEPSEEK = 'deepseek',
  KIMI = 'kimi',
}

// Agent 输入接口
export interface AgentInput {
  type: AgentType;
  concept: string;
  context?: Record<string, unknown>;
  userId?: string;
  sessionId?: string;
}

// Agent 输出接口
export interface AgentOutput {
  type: AgentType;
  success: boolean;
  data: unknown;
  error?: string;
  metadata?: {
    processingTime: number;
    llmProvider: LLMProvider;
    model: string;
  };
}

// 概念分析结果
export interface ConceptAnalysis {
  concept: string;
  domain: string;
  complexity: 'basic' | 'intermediate' | 'advanced';
  visualizationPotential: number; // 0-1
  suggestedVisualizations: string[];
  keyTerms: string[];
}

// 前置知识探索结果
export interface PrerequisiteNode {
  concept: string;
  isFoundation: boolean;
  level: number; // 距离目标概念的层级
  prerequisites?: PrerequisiteNode[];
}

// 遗传学知识丰富结果
export interface GeneticsEnrichment {
  concept: string;
  definition: string;
  principles: string[];
  formulas: GeneticsFormula[];
  examples: GeneticsExample[];
  misconceptions: string[];
  visualization: VisualizationSuggestion;
}

export interface GeneticsFormula {
  key: string;
  latex: string;
  variables: Record<string, string>;
}

export interface GeneticsExample {
  name: string;
  description: string;
}

export interface VisualizationSuggestion {
  type: 'knowledge_graph' | 'animation' | 'chart' | 'diagram';
  elements: string[];
  colors?: Record<string, string>;
  layout?: 'force' | 'hierarchical' | 'circular' | 'grid';
  interactions?: Array<'click' | 'hover' | 'zoom' | 'drag' | 'select'>;
  annotations?: string[];
  animationConfig?: {
    duration: number;
    easing: string;
    autoplay: boolean;
  };
}

// 叙事作曲结果
export interface NarrativeComposition {
  learningPath: string[];
  explanationOrder: string[];
  connectingStories: string[];
  difficultyProgression: 'linear' | 'spiral' | 'hierarchical';
}

// Agent 流水线配置
export interface AgentPipelineConfig {
  enabledAgents: AgentType[];
  parallelExecution?: boolean;
  maxRetries?: number;
  timeout?: number;
}

// Agent 流水线结果
export interface AgentPipelineResult {
  inputs: AgentInput[];
  outputs: AgentOutput[];
  totalTime: number;
  success: boolean;
}

// 六 Agent 协作流水线输入
export interface SixAgentInput {
  concept: string;
  userLevel?: 'beginner' | 'intermediate' | 'advanced';
  learningGoal?: string;
  focusAreas?: string[];
}

// 六 Agent 协作流水线输出
export interface SixAgentOutput {
  conceptAnalysis: ConceptAnalysis;
  prerequisiteTree: PrerequisiteNode;
  geneticsEnrichment: GeneticsEnrichment;
  visualDesign: VisualizationSuggestion;
  narrativeComposition: NarrativeComposition;
  quiz?: QuizQuestion;
}
