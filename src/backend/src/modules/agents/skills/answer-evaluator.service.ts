import { Injectable, Logger } from '@nestjs/common';
import { LLMService } from '../../llm/llm.service';
import { QuizQuestion } from '@shared/types/genetics.types';

export interface AnswerEvaluationRequest {
  question: QuizQuestion;
  userAnswer: string;
  explanationLevel?: number;
}

export interface AnswerEvaluationResponse {
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

export interface SelfAssessmentRequest {
  question: QuizQuestion;
  userAnswer: string;
  errorType: 'low_level' | 'high_level';
  userNote?: string;
}

export interface SelfAssessmentResponse {
  confirmed: boolean;
  errorType: 'low_level' | 'high_level';
  suggestion?: string;
  shouldGenerateSimilarQuestions: boolean;
  recommendedTopics?: string[];
}

export interface ExplanationRequest {
  question: QuizQuestion;
  userAnswer: string;
  level: number;
  previousLevel?: number;
}

export interface ExplanationResponse {
  explanation: string;
  level: number;
  canExpand: boolean;
  canSimplify: boolean;
  followUpQuestions?: string[];
}

@Injectable()
export class AnswerEvaluatorService {
  private readonly logger = new Logger(AnswerEvaluatorService.name);

  constructor(private readonly llmService: LLMService) {}

  async evaluateAnswer(request: AnswerEvaluationRequest): Promise<AnswerEvaluationResponse> {
    const { question, userAnswer, explanationLevel = 1 } = request;
    this.logger.log(`Evaluating answer: ${userAnswer} for question: ${question.id}`);

    const schema = {
      type: 'object',
      properties: {
        isCorrect: { type: 'boolean' },
        confidence: { type: 'number', minimum: 0, maximum: 1 },
        reason: { type: 'string' },
        needsSelfAssessment: { type: 'boolean' }
      }
    };

    const prompt = `你是一位严谨的遗传学教师，请判断以下答案是否正确：

**题目**: ${question.content}
**正确答案**: ${question.correctAnswer}
**用户答案**: ${userAnswer}

## 判断标准

- **完全正确**: 用户答案与正确答案完全一致（如选择A选项，答案为A）
- **同义正确**: 用户答案与正确答案意思相同（如 "3:1" 和 "3比1"）
- **错误**: 用户答案与正确答案不一致
- **模糊**: 无法确定用户答案是否正确，格式异常或内容不清晰

## 要求

1. 严格判断对错，对于选择题，选项必须完全匹配
2. 对于模糊答案，设置 needsSelfAssessment 为 true
3. 对于同义正确，置信度设置为 0.8-0.95
4. 返回 JSON 格式`;

    try {
      const response = await this.llmService.structuredChat<{
        isCorrect: boolean;
        confidence: number;
        reason: string;
        needsSelfAssessment: boolean;
      }>(
        [{ role: 'user', content: prompt }],
        schema,
        { temperature: 0.3 }
      );

      const evaluationResponse: AnswerEvaluationResponse = {
        ...response,
        explanation: question.explanation,
        currentExplanationLevel: explanationLevel
      };

      this.logger.log(`Evaluation result: ${JSON.stringify(evaluationResponse)}`);
      return evaluationResponse;
    } catch (error) {
      this.logger.error('Failed to evaluate answer:', error);

      const isCorrect = userAnswer === question.correctAnswer;
      return {
        isCorrect,
        confidence: isCorrect ? 1.0 : 1.0,
        reason: isCorrect ? '答案正确' : `答案错误，正确答案是 ${question.correctAnswer}`,
        needsSelfAssessment: false,
        explanation: question.explanation,
        currentExplanationLevel: explanationLevel
      };
    }
  }

  async processSelfAssessment(request: SelfAssessmentRequest): Promise<SelfAssessmentResponse> {
    const { question, userAnswer, errorType, userNote } = request;
    this.logger.log(`Processing self-assessment: ${errorType} for question: ${question.id}`);

    let suggestion: string | undefined;
    let recommendedTopics: string[] = [];

    if (errorType === 'low_level') {
      suggestion = '这是一个低级错误（如笔误、手滑）。建议下次答题时更仔细一些。';
    } else {
      const prompt = `用户答错了这道遗传学题目，是因为概念不理解（高级错误）：

**题目**: ${question.content}
**正确答案**: ${question.correctAnswer}
**用户答案**: ${userAnswer}
**用户备注**: ${userNote || '无'}

请分析：
1. 用户可能对哪个概念不理解？
2. 建议复习哪些相关知识点？
3. 是否需要生成相似题进行巩固？

返回 JSON 格式，包含：
- suggestion: 简短建议（50字以内）
- recommendedTopics: 建议复习的知识点列表（1-3个）
- shouldGenerateSimilarQuestions: 是否需要生成相似题`;

      const schema = {
        type: 'object',
        properties: {
          suggestion: { type: 'string' },
          recommendedTopics: {
            type: 'array',
            items: { type: 'string' }
          },
          shouldGenerateSimilarQuestions: { type: 'boolean' }
        }
      };

      try {
        const response = await this.llmService.structuredChat<{
          suggestion: string;
          recommendedTopics: string[];
          shouldGenerateSimilarQuestions: boolean;
        }>(
          [{ role: 'user', content: prompt }],
          schema,
          { temperature: 0.5 }
        );

        suggestion = response.suggestion;
        recommendedTopics = response.recommendedTopics;

        return {
          confirmed: true,
          errorType,
          suggestion,
          shouldGenerateSimilarQuestions: response.shouldGenerateSimilarQuestions,
          recommendedTopics
        };
      } catch (error) {
        this.logger.error('Failed to generate suggestion:', error);
      }
    }

    return {
      confirmed: true,
      errorType,
      suggestion,
      shouldGenerateSimilarQuestions: errorType === 'high_level',
      recommendedTopics
    };
  }

  async getExplanation(request: ExplanationRequest): Promise<ExplanationResponse> {
    const { question, userAnswer, level } = request;
    this.logger.log(`Getting explanation level ${level} for question: ${question.id}`);

    const levelKey = `level${level}` as keyof typeof question.explanation;

    if (question.explanation && question.explanation[levelKey]) {
      const canExpand = level < 5 && !!question.explanation[`level${level + 1}` as keyof typeof question.explanation];
      const canSimplify = level > 1 && !!question.explanation[`level${level - 1}` as keyof typeof question.explanation];

      const followUpQuestions = await this.generateFollowUpQuestions(question, level);

      return {
        explanation: question.explanation[levelKey],
        level,
        canExpand,
        canSimplify,
        followUpQuestions
      };
    }

    const prompt = `为以下遗传学题目生成等级${level}的解析：

**题目**: ${question.content}
**正确答案**: ${question.correctAnswer}
**用户答案**: ${userAnswer}

## 解析等级说明

- **Level 1 (最简练)**: 直接给出答案和核心结论，不超过50字
- **Level 2 (简略)**: 简要说明解题思路，100字左右
- **Level 3 (标准)**: 详细解题步骤和原理，200字左右
- **Level 4 (深入)**: 深入分析原理和扩展知识，300字左右
- **Level 5 (全面)**: 全面讲解，包含前置知识、原理、应用、拓展等，500字以上

要求：生成符合等级${level}的解析，返回 JSON 格式`;

    const schema = {
      type: 'object',
      properties: {
        explanation: { type: 'string' },
        followUpQuestions: {
          type: 'array',
          items: { type: 'string' }
        }
      }
    };

    try {
      const response = await this.llmService.structuredChat<{
        explanation: string;
        followUpQuestions: string[];
      }>(
        [{ role: 'user', content: prompt }],
        schema,
        { temperature: 0.5 }
      );

      const canExpand = level < 5;
      const canSimplify = level > 1;

      return {
        explanation: response.explanation,
        level,
        canExpand,
        canSimplify,
        followUpQuestions: response.followUpQuestions
      };
    } catch (error) {
      this.logger.error('Failed to generate explanation:', error);

      return {
        explanation: '解析生成失败，请稍后重试。',
        level,
        canExpand: level < 5,
        canSimplify: level > 1
      };
    }
  }

  private async generateFollowUpQuestions(question: QuizQuestion, currentLevel: number): Promise<string[]> {
    if (currentLevel >= 4) {
      const prompt = `基于以下遗传学题目，生成2-3个可能的追问问题：

**题目**: ${question.content}
**考点**: ${question.topic}

要求：
1. 问题应该帮助用户深入理解这个知识点
2. 问题应该与当前题目相关但有所不同
3. 返回 JSON 格式`;

      const schema = {
        type: 'object',
        properties: {
          questions: {
            type: 'array',
            items: { type: 'string' }
          }
        }
      };

      try {
        const response = await this.llmService.structuredChat<{
          questions: string[];
        }>(
          [{ role: 'user', content: prompt }],
          schema,
          { temperature: 0.6 }
        );

        return response.questions;
      } catch (error) {
        this.logger.error('Failed to generate follow-up questions:', error);
      }
    }

    return [];
  }

  async batchEvaluate(requests: AnswerEvaluationRequest[]): Promise<AnswerEvaluationResponse[]> {
    this.logger.log(`Batch evaluating ${requests.length} answers`);

    const evaluations = await Promise.all(
      requests.map(request => this.evaluateAnswer(request))
    );

    return evaluations;
  }
}
