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

// Punnett 方格数据
export interface PunnettSquareData {
  maleGametes: string[];      // 雄配子 ['X', 'Y']
  femaleGametes: string[];     // 雌配子 ['X', 'X']
  offspring: Array<{           // 后代基因型和表型
    genotype: string;
    phenotype: string;
    probability: number;       // 0-1
    sex?: 'male' | 'female';
  }>;
  parentalCross: {
    male: { genotype: string; phenotype: string };
    female: { genotype: string; phenotype: string };
  };
  parentalConfig?: {           // 用于连锁遗传
    male: { genotype: string; phenotype: string; arrangement?: string };
    female: { genotype: string; phenotype: string; arrangement?: string };
  };
  description?: string;        // 杂交方式说明
  recombinationRate?: number;  // 重组率（用于连锁遗传）
}

// 遗传路径数据（用于伴性遗传等）
export interface InheritancePathData {
  generations: Array<{
    generation: number;        // 第几代
    individuals: Array<{
      id: string;
      sex: 'male' | 'female';
      genotype: string;
      phenotype: string;
      affected: boolean;        // 是否患病
      carrier?: boolean;        // 是否携带者（女性）
      parents?: string[];       // 父母ID
    }>;
  }>;
  inheritance: {
    pattern: string;           // 遗传模式描述
    chromosome: string;        // 相关染色体（如 'X'）
    gene: string;              // 基因名称
  };
  explanation: string;         // 解释说明
}

// 系谱图数据
export interface PedigreeChartData {
  individuals: Array<{
    id: string;
    sex: 'male' | 'female';
    affected: boolean;
    carrier?: boolean;
    generation: number;
    position: number;          // 在该代中的位置
    parents?: {
      father?: string;
      mother?: string;
    };
    spouse?: string;           // 配偶ID
  }>;
  legend: {
    condition: string;         // 疾病/性状名称
    inheritancePattern: string; // 遗传方式
  };
}

// 概率分布数据
export interface ProbabilityDistributionData {
  categories: string[];        // 类别名称 ['显性纯合', '杂合', '隐性']
  values: number[];            // 概率值 [0.25, 0.5, 0.25]
  colors?: string[];           // 颜色
  total?: string;              // 总计说明
  formula?: string;            // 相关公式
  parameters?: Record<string, number>;  // 参数（如 p, q, p², 2pq, q²）
  phenotypeMapping?: Record<string, string>;  // 表型映射（基因型 -> 表型）
  phenotypeRatio?: string;     // 表型比例
}

// 测交分析数据
export interface TestCrossData {
  unknownGenotype: {
    symbol: string;            // 未知基因型符号
    genotype: string;          // 基因型（如 ? 或 A?）
    description: string;       // 个体描述
  };
  testParent: {
    symbol: string;            // 测交亲本符号
    genotype: string;          // 测交亲本基因型（通常是纯合隐性）
    phenotype: string;         // 表型
  };
  crossResults: Array<{
    offspringGenotype: string;  // 后代基因型
    offspringPhenotype: string; // 后代表型
    count: number;              // 个体数量
    percentage?: number;       // 百分比
  }>;
  conclusion: {
    deducedGenotype: string;   // 推断出的基因型
    confidence: string;         // 推断置信度
    explanation: string;        // 解释说明
  };
  title: string;               // 可视化标题
}

// 三点测交数据
export interface ThreePointTestCrossData {
  genes: Array<{
    name: string;              // 基因名称
    symbol: string;            // 基因符号
    alleles: string[];         // 等位基因列表
  }>;
  parentalGenotypes: Array<{
    id: string;                // 亲本ID
    genotype: string;          // 基因型（如 A+B+C+）
    type: 'parent' | 'trihybrid'; // 亲本类型
  }>;
  offspringData: Array<{
    genotype: string;          // 后代基因型
    count: number;             // 个体数量
    percentage: number;        // 百分比
    phenotypeDescription?: string; // 表型描述
  }>;
  recombinationFrequencies: {
    region1_2: {
      distance: number;        // 基因间距离（cM）
      rf: number;              // 重组率（%）
    };
    region2_3: {
      distance: number;        // 基因间距离（cM）
      rf: number;              // 重组率（%）
    };
    region1_3: {
      distance: number;        // 基因间距离（cM）
      rf: number;              // 重组率（%）
    };
  };
  geneOrder: string;           // 推断的基因顺序（如 A-B-C）
  chromosomeMap: {
    scale: number;             // 比例尺
    unit: string;              // 单位（如 cM）
    positions: Array<{
      gene: string;            // 基因名称
      position: number;        // 位置
    }>;
  };
  title: string;               // 可视化标题
}

// 减数分裂动画数据
export interface MeiosisAnimationData {
  stages: Array<{
    name: string;              // 阶段名称
    description: string;       // 描述
    chromosomeCount: number;   // 染色体数量变化
    keyEvent: string;          // 关键事件
  }>;
  duration: number;            // 动画总时长(ms)
  highlights: string[];        // 重点标注
}

// 染色体行为可视化数据
export interface ChromosomeBehaviorData {
  chromosomes: Array<{
    id: string;
    name: string;              // 如 'X染色体', 'Y染色体', '21号染色体'
    length: number;            // 相对长度
    color: string;
    genes: Array<{
      name: string;
      position: number;        // 相对位置 0-1
      dominant: boolean;
    }>;
  }>;
  behavior: {
    type: string;              // 行为类型 'segregation', 'recombination', 'assortment'
    description: string;
    stage: string;             // 发生阶段
  };
}

export interface VisualizationSuggestion {
  type: 'knowledge_graph' | 'animation' | 'chart' | 'diagram' | 'punnett_square' | 'inheritance_path' | 'pedigree_chart' | 'probability_distribution' | 'meiosis_animation' | 'chromosome_behavior' | 'test_cross' | 'three_point_test_cross';
  title: string;               // 可视化标题
  description: string;         // 这个可视化要说明什么问题

  // 原有的元数据（保留）
  elements: string[];
  colors?: Record<string, string>;
  layout?: 'force' | 'hierarchical' | 'circular' | 'grid';
  interactions?: Array<'click' | 'hover' | 'zoom' | 'drag' | 'select'>;
  annotations?: string[];
  animationConfig?: {
    duration: number;
    easing: string;
    autoplay: boolean;
    steps?: Array<{
      phase: string;
      description: string;
      duration: number;
    }>;
  };

  // 新增：语义化可视化数据（根据type选择对应的数据）
  // 支持更多扩展数据类型（用于新添加的可视化概念）
  data?: (
    | PunnettSquareData
    | InheritancePathData
    | PedigreeChartData
    | ProbabilityDistributionData
    | MeiosisAnimationData
    | ChromosomeBehaviorData
    | Record<string, unknown>  // 允许其他类型的数据
  );

  // 理解提示（帮助用户从可视化中学习）
  insights?: UnderstandingInsight[];
}

// 理解提示（用于强化学习效果）
export interface UnderstandingInsight {
  keyPoint: string;            // 关键知识点
  visualConnection: string;    // 如何通过可视化理解这个点
  commonMistake: string;       // 常见错误理解
  checkQuestion: string;       // 自检问题
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
  narrativeComposition?: NarrativeComposition;
  quiz?: QuizQuestion;
}

// 可视化问答响应
export interface VisualizationAnswerResponse {
  textAnswer: string;           // 文字回答
  visualization?: VisualizationSuggestion; // 可视化（如适用）
  a2uiTemplate?: {
    templateId: string;
    a2uiTemplate: any;
    parameters: Record<string, any>;
    schema: any;
  }; // A2UI模板蓝图（供应用内agent填充和前端渲染）
  examples?: Array<{ title: string; description: string }>; // 举例
  followUpQuestions?: string[]; // 后续建议问题
  relatedConcepts?: string[];   // 相关概念
  learningPath?: Array<{ id: string; name: string; level: number }>; // 学习路径
  citations?: Array<{ chunkId: string; content: string; chapter?: string; section?: string }>; // 引用的具体内容
  sources?: Array<{ documentId: string; title: string; chapter?: string; section?: string }>; // 来源文档
}
