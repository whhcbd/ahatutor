/**
 * 遗传学相关类型定义
 */

// 题目类型
export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  FILL_BLANK = 'fill_blank',
  SHORT_ANSWER = 'short_answer',
  ESSAY = 'essay',
  CALCULATION = 'calculation',
}

// 题目难度
export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

// 选择题选项
export interface Option {
  id: string;
  label: string;
  content: string;
  isCorrect?: boolean;
}

// 题目
export interface QuizQuestion {
  id: string;
  type: QuestionType;
  difficulty: Difficulty;
  topic: string; // 知识点
  content: string; // 题目内容
  options?: Option[]; // 选择题选项
  correctAnswer: string | string[]; // 正确答案
  explanation: QuizExplanation; // 分级解析
  tags: string[];
  metadata?: {
    source?: string;
    estimatedTime?: number;
    chapter?: string;
    chapterNumber?: number;
  };
}

// 分级解析
export interface QuizExplanation {
  level1: string; // 最简练
  level2: string; // 简要解释
  level3: string; // 标准解析
  level4: string; // 详细讲解
  level5: string; // 教学级解析
}

// 用户回答
export interface UserAnswer {
  questionId: string;
  answer: string;
  isCorrect: boolean;
  confidence?: number; // AI 判断的置信度
  timestamp: Date;
  timeSpent: number; // 秒
}

// 错误类型
export enum ErrorType {
  LOW_LEVEL = 'low_level', // 低级错误（笔误、计算）
  HIGH_LEVEL = 'high_level', // 高级错误（知识性）
}

// 错题记录
export interface Mistake {
  id: string;
  userId: string;
  question: QuizQuestion;
  userAnswer: string;
  errorType: ErrorType;
  topic: string;
  timestamp: Date;
  image?: string; // 错题图片 URL
  similarQuestions?: string[]; // 举一反三题目 ID
  reviewed: boolean;
  reviewCount: number;
}

// Punnett Square 结果
export interface PunnettSquareResult {
  parent1: string;
  parent2: string;
  genotypes: Record<string, number>; // 基因型频率
  phenotypes: Record<string, number>; // 表型频率
  ratios: {
    genotypic: string; // 如 "1:2:1"
    phenotypic: string; // 如 "3:1"
  };
  grid: string[][]; // 配子组合矩阵
}

// 遗传学计算输入
export interface GeneticsCalculationInput {
  type: 'punnett_square' | 'probability' | 'hardy_weinberg';
  parent1?: string;
  parent2?: string;
  targetGenotype?: string;
  population?: {
    dominant: number;
    recessive: number;
    total: number;
  };
}

// 试卷配置
export interface QuizConfig {
  mode: 'mistake' | 'topic' | 'time_range' | 'custom';
  topics?: string[]; // 知识点范围
  difficulty?: Difficulty[];
  questionCount: number;
  questionTypes?: QuestionType[];
  timeLimit?: number; // 秒，0 表示不限时
  startDate?: Date;
  endDate?: Date;
  mistakeIds?: string[]; // 错题组卷
}

// 试卷
export interface Quiz {
  id: string;
  name: string;
  config: QuizConfig;
  questions: QuizQuestion[];
  createdAt: Date;
  totalTime?: number;
  completed?: boolean;
  score?: number;
}

// 速通模式会话
export interface SpeedModeSession {
  id: string;
  userId: string;
  state: SpeedModeState;
  currentQuestion?: QuizQuestion;
  userAnswer?: UserAnswer;
  explanationLevel: number; // 1-5
  mistakes: Mistake[];
  startTime: Date;
  endTime?: Date;
  questionsAnswered: number;
  correctCount: number;
}

// 速通模式状态
export enum SpeedModeState {
  IDLE = 'idle',
  QUESTIONING = 'questioning',
  ANSWERING = 'answering',
  EVALUATING = 'evaluating',
  SELF_ASSESS = 'self_assess',
  EXPLAINING = 'explaining',
  CONTINUING = 'continuing',
}

// 学情报告类型
export enum ReportType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  SUBJECT = 'subject',
  MISTAKE = 'mistake',
}

// 学情报告
export interface LearningReport {
  id: string;
  userId: string;
  type: ReportType;
  date: Date;
  summary: {
    totalQuestions: number;
    correctAnswers: number;
    accuracy: number;
    timeSpent: number;
  };
  topicMastery: TopicMastery[];
  errorDistribution: ErrorDistribution;
  weakTopics: string[];
  recommendations: string[];
  charts: ChartData[];
}

// 知识点掌握度
export interface TopicMastery {
  topic: string;
  mastery: number; // 0-100
  questionsCount: number;
  accuracy: number;
  lastStudied: Date;
}

// 错误分布
export interface ErrorDistribution {
  lowLevelErrors: number;
  highLevelErrors: number;
  byTopic: Record<string, { low: number; high: number }>;
}

// 图表数据
export interface ChartData {
  type: 'pie' | 'bar' | 'line' | 'radar';
  data: Record<string, unknown>;
}
