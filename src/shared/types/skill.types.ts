/**
 * Agent Skills 相关类型定义
 */

// Skill 类型枚举
export enum SkillType {
  WEB_SEARCH = "web_search", // 联网搜索
  RESOURCE_RECOMMEND = "resource_recommend", // 资源推荐
  VISUALIZATION_GENERATE = "visualization_generate", // 生成可视化配置
  INTERACTIVE_CONTROL = "interactive_control", // 可视化交互控制
  GENETICS_VISUALIZATION = "genetics_visualization", // 遗传学专用可视化
  VECTOR_RETRIEVAL = "vector_retrieval", // 向量检索
  DOCUMENT_INDEXING = "document_indexing", // 文档索引
  CONTEXT_RETRIEVAL = "context_retrieval", // 上下文检索
  STREAMING_ANSWER = "streaming_answer", // 流式输出
}

// ==================== 可视化相关类型 ====================

// 可视化类型（与 agent.types.ts 保持一致）
export enum VisualizationType {
  KNOWLEDGE_GRAPH = "knowledge_graph",
  PUNNETT_SQUARE = "punnett_square",
  INHERITANCE_PATH = "inheritance_path",
  PEDIGREE_CHART = "pedigree_chart",
  PROBABILITY_DISTRIBUTION = "probability_distribution",
  MEIOSIS_ANIMATION = "meiosis_animation",
  CHROMOSOME_BEHAVIOR = "chromosome_behavior",
  DNA_REPLICATION = "dna_replication",
  PROTEIN_SYNTHESIS = "protein_synthesis",
  GENE_EXPRESSION = "gene_expression",
}

// 可视化生成输入
export interface VisualizationGenerateInput {
  concept: string;
  context?: {
    difficulty?: "beginner" | "intermediate" | "advanced";
    focusAreas?: string[];
    userLevel?: string;
  };
  preferences?: {
    preferredTypes?: VisualizationType[];
    interactive?: boolean;
    animation?: boolean;
  };
}

// 可视化参数配置
export interface VisualizationParameter {
  key: string;
  label: string;
  type: "slider" | "input" | "select" | "toggle" | "radio";
  defaultValue: number | string | boolean;
  min?: number;
  max?: number;
  step?: number;
  options?: Array<{ value: string; label: string }>;
  description?: string;
}

// 可视化生成输出
export interface VisualizationGenerateOutput {
  concept: string;
  visualizations: VisualizationConfig[];
  recommendedPrimary?: VisualizationType;
  explanation: string;
}

// 可视化配置
export interface VisualizationConfig {
  type: VisualizationType;
  title: string;
  description: string;
  data: unknown;
  parameters?: VisualizationParameter[];
  interactions?: {
    type: "click" | "hover" | "zoom" | "drag" | "select";
    description: string;
  }[];
  insights?: UnderstandingInsight[];
}

// 理解提示（帮助用户从可视化中学习）
export interface UnderstandingInsight {
  keyPoint: string;
  visualConnection: string;
  commonMistake: string;
  checkQuestion: string;
}

// 遗传学可视化专用输入
export interface GeneticsVisualizationInput {
  concept: string;
  visualizationType: VisualizationType;
  parameters?: Record<string, unknown>;
  scenario?: {
    parentalCross?: {
      male: { genotype: string; phenotype: string };
      female: { genotype: string; phenotype: string };
    };
    targetTrait?: string;
    inheritancePattern?: string;
  };
}

// 遗传学可视化输出
export interface GeneticsVisualizationOutput {
  visualizationConfig: VisualizationConfig;
  geneticContext: {
    concept: string;
    principle: string;
    formula?: string;
    example: string;
  };
  interactiveSteps?: Array<{
    step: number;
    description: string;
    highlight?: string[];
  }>;
}

// 交互控制输入
export interface InteractiveControlInput {
  visualizationId: string;
  controlType:
    | "play"
    | "pause"
    | "step_forward"
    | "step_backward"
    | "reset"
    | "update_parameter";
  parameterUpdates?: Record<string, number | string | boolean>;
  currentStep?: number;
}

// 交互控制输出
export interface InteractiveControlOutput {
  visualizationId: string;
  currentState: {
    isPlaying: boolean;
    currentStep: number;
    totalSteps: number;
    parameters: Record<string, unknown>;
  };
  updatedVisualization?: {
    data: unknown;
    highlights?: string[];
  };
}

// ==================== RAG 相关类型 ====================

// 文档类型
export enum DocumentType {
  PDF = "pdf",
  DOCX = "docx",
  MD = "md",
  TXT = "txt",
  HTML = "html",
}

// 文档元数据
export interface DocumentMetadata {
  id: string;
  title: string;
  type: DocumentType;
  source: string;
  author?: string;
  subject: string;
  chapter?: string;
  section?: string;
  topics: string[];
  difficulty?: "beginner" | "intermediate" | "advanced";
  uploadedAt: Date;
  size: number;
}

// 文档块（用于向量存储）
export interface DocumentChunk {
  id: string;
  documentId: string;
  content: string;
  metadata: {
    documentId: string;
    chunkIndex: number;
    topics: string[];
    section?: string;
    chapter?: string;
    difficulty?: string;
  };
  embedding?: number[];
}

// 文档索引输入
export interface DocumentIndexingInput {
  documentId?: string;
  filePath?: string;
  content?: string;
  metadata: Partial<DocumentMetadata>;
  chunkSize?: number;
  chunkOverlap?: number;
}

// 文档索引输出
export interface DocumentIndexingOutput {
  documentId: string;
  chunksCreated: number;
  chunks: DocumentChunk[];
  indexingTime: number;
  status: "success" | "partial" | "failed";
}

// 向量检索输入
export interface VectorRetrievalInput {
  query: string;
  topK?: number;
  filters?: {
    subject?: string;
    topics?: string[];
    difficulty?: string;
    documentId?: string;
  };
  rerank?: boolean;
}

// 检索结果（带分数）
export interface RetrievalResult {
  chunkId: string;
  documentId: string;
  content: string;
  score: number;
  metadata: DocumentChunk["metadata"];
}

// 向量检索输出
export interface VectorRetrievalOutput {
  query: string;
  results: RetrievalResult[];
  totalFound: number;
  retrievalTime: number;
  context?: string;
}

// 上下文检索输入（多轮对话）
export interface ContextRetrievalInput {
  currentQuery: string;
  conversationHistory: Array<{ role: string; content: string }>;
  previousContext?: RetrievalResult[];
  topK?: number;
  contextWindow?: number;
}

// 上下文检索输出
export interface ContextRetrievalOutput {
  retrievedContext: RetrievalResult[];
  conversationContext: {
    summary: string;
    relevantTopics: string[];
    followUpQuestions?: string[];
  };
  expandedQuery: string;
}

// 流式输出输入
export interface StreamingAnswerInput {
  query: string;
  context: RetrievalResult[];
  conversationHistory?: Array<{ role: string; content: string }>;
  mode?: "answer" | "explanation" | "step_by_step";
  style?: "concise" | "detailed" | "tutorial";
  streamOptions?: {
    onChunk?: (chunk: string) => void;
    onEnd?: () => void;
    onError?: (error: Error) => void;
  };
}

// 流式输出块
export interface StreamingChunk {
  content: string;
  isComplete: boolean;
  metadata?: {
    tokenCount?: number;
    reasoning?: string;
  };
}

// 流式输出输出
export interface StreamingAnswerOutput {
  stream: AsyncGenerator<StreamingChunk> | null;
  fullAnswer: string;
  citations: Array<{ chunkId: string; content: string }>;
  sources: Array<{ documentId: string; title: string; url?: string }>;
  generationTime: number;
}

// ==================== 原有类型保留 ====================

// 搜索结果类型
export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  publishedDate?: string;
  source: string;
  relevanceScore?: number;
}

// 联网搜索输入
export interface WebSearchInput {
  query: string;
  numResults?: number;
  language?: string;
  timeRange?: "day" | "week" | "month" | "year" | "all";
  safeSearch?: boolean;
}

// 联网搜索输出
export interface WebSearchOutput {
  query: string;
  results: SearchResult[];
  totalCount: number;
  searchTime: number;
  hasMore: boolean;
}

// 资源类型
export enum ResourceType {
  VIDEO = "video",
  ARTICLE = "article",
  PAPER = "paper",
  BOOK = "book",
  COURSE = "course",
  INTERACTIVE = "interactive",
}

// 资源推荐结果
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
  difficulty?: "beginner" | "intermediate" | "advanced";
  tags: string[];
  thumbnailUrl?: string;
  rating?: number;
  relevanceScore: number;
  source: string;
}

// 资源推荐输入
export interface ResourceRecommendInput {
  concept: string;
  userLevel?: "beginner" | "intermediate" | "advanced";
  preferredTypes?: ResourceType[];
  language?: string;
  count?: number;
  excludeSeen?: boolean;
}

// 资源推荐输出
export interface ResourceRecommendOutput {
  concept: string;
  recommendations: ResourceRecommendation[];
  totalCount: number;
  filters?: {
    types: ResourceType[];
    difficulty: string;
  };
}

// Skill 执行结果
export interface SkillExecutionResult<T = unknown> {
  skill: SkillType;
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    processingTime: number;
    cached?: boolean;
  };
}
