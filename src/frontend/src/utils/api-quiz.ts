import apiClient from './api-client';
import { Difficulty } from '@shared/types/genetics.types';

export interface Option {
  id: string;
  label: string;
  content: string;
  isCorrect?: boolean;
}

export interface QuizExplanation {
  level1: string;
  level2: string;
  level3: string;
  level4: string;
  level5: string;
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  FILL_BLANK = 'fill_blank',
  SHORT_ANSWER = 'short_answer',
  ESSAY = 'essay',
  CALCULATION = 'calculation',
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

export interface AnswerEvaluationResult {
  isCorrect: boolean;
  confidence: number;
  reason: string;
  needsSelfAssessment: boolean;
  explanation?: {
    level1: string;
    level2: string;
    level3: string;
    level4: string;
    level5: string;
  };
  currentExplanationLevel?: number;
}

export interface SelfAssessmentResult {
  confirmed: boolean;
  errorType: 'low_level' | 'high_level';
  suggestion?: string;
  shouldGenerateSimilarQuestions: boolean;
  recommendedTopics?: string[];
}

export interface ExplanationResult {
  explanation: string;
  level: number;
  canExpand: boolean;
  canSimplify: boolean;
  followUpQuestions?: string[];
}

export const quizApi = {
  async generate(params: {
    topic: string;
    difficulty: 'easy' | 'medium' | 'hard';
    count?: number;
    userLevel?: 'beginner' | 'intermediate' | 'advanced';
  }): Promise<QuizQuestion | QuizQuestion[]> {
    const { data } = await apiClient.post<QuizQuestion | QuizQuestion[]>('/agent/quiz/generate', params);
    return data;
  },

  async generateQuestions(params: {
    topics: string[];
    difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
    count: number;
    userLevel?: 'beginner' | 'intermediate' | 'advanced';
  }): Promise<QuizQuestion[]> {
    const { data } = await apiClient.post<QuizQuestion[]>('/agent/quiz/generate', {
      topics: params.topics,
      difficulty: params.difficulty === 'mixed' ? 'medium' : params.difficulty,
      count: params.count,
      userLevel: params.userLevel,
    });
    return data;
  },

  async evaluate(params: {
    question: string;
    correctAnswer: string;
    userAnswer: string;
  }): Promise<{
    isCorrect: boolean;
    confidence: number;
    reason: string;
    needsSelfAssessment: boolean;
  }> {
    const { data } = await apiClient.post('/agent/quiz/evaluate', params);
    return data;
  },

  async evaluateV2(params: {
    question: QuizQuestion;
    userAnswer: string;
    explanationLevel?: number;
  }): Promise<AnswerEvaluationResult> {
    const { data } = await apiClient.post<AnswerEvaluationResult>('/agent/quiz/evaluate/v2', params);
    return data;
  },

  async processSelfAssessment(params: {
    question: QuizQuestion;
    userAnswer: string;
    errorType: 'low_level' | 'high_level';
    userNote?: string;
  }): Promise<SelfAssessmentResult> {
    const { data } = await apiClient.post<SelfAssessmentResult>('/agent/quiz/self-assess', params);
    return data;
  },

  async getExplanation(params: {
    question: QuizQuestion;
    userAnswer: string;
    level: number;
    previousLevel?: number;
  }): Promise<ExplanationResult> {
    const { data } = await apiClient.post<ExplanationResult>('/agent/quiz/explanation', params);
    return data;
  },

  async similar(params: {
    question: string;
    topic: string;
    userAnswer: string;
    errorType: 'low_level' | 'high_level';
    count?: number;
  }): Promise<QuizQuestion[]> {
    const { data } = await apiClient.post<QuizQuestion[]>('/agent/quiz/similar', params);
    return data;
  },
};
