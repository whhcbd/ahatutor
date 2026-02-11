import type { QuizQuestion } from './genetics.types';
export declare enum AgentType {
    CONCEPT_ANALYZER = "concept_analyzer",
    PREREQUISITE_EXPLORER = "prerequisite_explorer",
    GENETICS_ENRICHER = "genetics_enricher",
    VISUAL_DESIGNER = "visual_designer",
    NARRATIVE_COMPOSER = "narrative_composer",
    QUIZ_GENERATOR = "quiz_generator"
}
export declare enum LLMProvider {
    OPENAI = "openai",
    CLAUDE = "claude",
    DEEPSEEK = "deepseek",
    KIMI = "kimi"
}
export interface AgentInput {
    type: AgentType;
    concept: string;
    context?: Record<string, unknown>;
    userId?: string;
    sessionId?: string;
}
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
export interface NarrativeComposition {
    learningPath: string[];
    explanationOrder: string[];
    connectingStories: string[];
    difficultyProgression: 'linear' | 'spiral' | 'hierarchical';
}
export interface AgentPipelineConfig {
    enabledAgents: AgentType[];
    parallelExecution?: boolean;
    maxRetries?: number;
    timeout?: number;
}
export interface AgentPipelineResult {
    inputs: AgentInput[];
    outputs: AgentOutput[];
    totalTime: number;
    success: boolean;
}
export interface SixAgentInput {
    concept: string;
    userLevel?: 'beginner' | 'intermediate' | 'advanced';
    learningGoal?: string;
    focusAreas?: string[];
}
export interface SixAgentOutput {
    conceptAnalysis: ConceptAnalysis;
    prerequisiteTree: PrerequisiteNode;
    geneticsEnrichment: GeneticsEnrichment;
    visualDesign: VisualizationSuggestion;
    narrativeComposition: NarrativeComposition;
    quiz?: QuizQuestion;
}
