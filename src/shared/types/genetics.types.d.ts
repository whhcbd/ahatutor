export declare enum QuestionType {
    MULTIPLE_CHOICE = "multiple_choice",
    FILL_BLANK = "fill_blank",
    SHORT_ANSWER = "short_answer",
    ESSAY = "essay",
    CALCULATION = "calculation"
}
export declare enum Difficulty {
    EASY = "easy",
    MEDIUM = "medium",
    HARD = "hard"
}
export interface Option {
    id: string;
    label: string;
    content: string;
    isCorrect?: boolean;
}
export interface QuizQuestion {
    id: string;
    type: QuestionType;
    difficulty: Difficulty;
    topic: string;
    content: string;
    options?: Option[];
    correctAnswer: string | string[];
    explanation: QuizExplanation;
    tags: string[];
    metadata?: {
        source?: string;
        estimatedTime?: number;
    };
}
export interface QuizExplanation {
    level1: string;
    level2: string;
    level3: string;
    level4: string;
    level5: string;
}
export interface UserAnswer {
    questionId: string;
    answer: string;
    isCorrect: boolean;
    confidence?: number;
    timestamp: Date;
    timeSpent: number;
}
export declare enum ErrorType {
    LOW_LEVEL = "low_level",
    HIGH_LEVEL = "high_level"
}
export interface Mistake {
    id: string;
    userId: string;
    question: QuizQuestion;
    userAnswer: string;
    errorType: ErrorType;
    topic: string;
    timestamp: Date;
    image?: string;
    similarQuestions?: string[];
    reviewed: boolean;
    reviewCount: number;
}
export interface PunnettSquareResult {
    parent1: string;
    parent2: string;
    genotypes: Record<string, number>;
    phenotypes: Record<string, number>;
    ratios: {
        genotypic: string;
        phenotypic: string;
    };
    grid: string[][];
}
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
export interface QuizConfig {
    mode: 'mistake' | 'topic' | 'time_range' | 'custom';
    topics?: string[];
    difficulty?: Difficulty[];
    questionCount: number;
    questionTypes?: QuestionType[];
    timeLimit?: number;
    startDate?: Date;
    endDate?: Date;
    mistakeIds?: string[];
}
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
export interface SpeedModeSession {
    id: string;
    userId: string;
    state: SpeedModeState;
    currentQuestion?: QuizQuestion;
    userAnswer?: UserAnswer;
    explanationLevel: number;
    mistakes: Mistake[];
    startTime: Date;
    endTime?: Date;
    questionsAnswered: number;
    correctCount: number;
}
export declare enum SpeedModeState {
    IDLE = "idle",
    QUESTIONING = "questioning",
    ANSWERING = "answering",
    EVALUATING = "evaluating",
    SELF_ASSESS = "self_assess",
    EXPLAINING = "explaining",
    CONTINUING = "continuing"
}
export declare enum ReportType {
    DAILY = "daily",
    WEEKLY = "weekly",
    SUBJECT = "subject",
    MISTAKE = "mistake"
}
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
export interface TopicMastery {
    topic: string;
    mastery: number;
    questionsCount: number;
    accuracy: number;
    lastStudied: Date;
}
export interface ErrorDistribution {
    lowLevelErrors: number;
    highLevelErrors: number;
    byTopic: Record<string, {
        low: number;
        high: number;
    }>;
}
export interface ChartData {
    type: 'pie' | 'bar' | 'line' | 'radar';
    data: Record<string, unknown>;
}
