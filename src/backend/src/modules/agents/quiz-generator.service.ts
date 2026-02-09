import { Injectable, Logger } from '@nestjs/common';
import { LLMService } from '../llm/llm.service';
import { QuizQuestion, Difficulty, QuestionType } from '@shared/types/genetics.types';

/**
 * Agent 6: QuizGenerator
 * "如何生成题目和评估？"
 *
 * 职责：生成遗传学题目和评估
 */
@Injectable()
export class QuizGeneratorService {
  private readonly logger = new Logger(QuizGeneratorService.name);

  constructor(private readonly llmService: LLMService) {}

  /**
   * 生成单道题目
   */
  async generateQuestion(params: {
    topic: string;
    difficulty: Difficulty;
    userLevel?: 'beginner' | 'intermediate' | 'advanced';
    questionType?: QuestionType;
    mistakes?: string[];
  }): Promise<QuizQuestion> {
    this.logger.log(`Generating question for topic: ${params.topic}`);

    const prompt = this.buildQuizPrompt(params);

    const schema = {
      type: 'object',
      properties: {
        question: { type: 'string' },
        options: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              label: { type: 'string' },
              content: { type: 'string' }
            }
          }
        },
        correctAnswer: { type: 'string' },
        explanation: {
          type: 'object',
          properties: {
            level1: { type: 'string' },
            level2: { type: 'string' },
            level3: { type: 'string' },
            level4: { type: 'string' },
            level5: { type: 'string' }
          }
        },
        topic: { type: 'string' },
        tags: {
          type: 'array',
          items: { type: 'string' }
        }
      }
    };

    try {
      const response = await this.llmService.structuredChat<typeof schema>(
        [{ role: 'user', content: prompt }],
        schema,
        { temperature: 0.7 }
      );

      const question: QuizQuestion = {
        id: this.generateId(),
        type: params.questionType || QuestionType.MULTIPLE_CHOICE,
        difficulty: params.difficulty,
        topic: params.topic,
        content: response.question,
        options: response.options?.map(opt => ({
          id: opt.id,
          label: opt.label,
          content: opt.content,
          isCorrect: opt.id === response.correctAnswer,
        })),
        correctAnswer: response.correctAnswer,
        explanation: response.explanation as any,
        tags: response.tags || [params.topic],
      };

      this.logger.log(`Question generated: ${question.id}`);
      return question;
    } catch (error) {
      this.logger.error('Failed to generate question:', error);
      throw error;
    }
  }

  /**
   * 生成多道题目
   */
  async generateQuestions(params: {
    topics: string[];
    difficulty: Difficulty;
    count: number;
    userLevel?: 'beginner' | 'intermediate' | 'advanced';
    mistakes?: string[];
  }): Promise<QuizQuestion[]> {
    this.logger.log(`Generating ${params.count} questions`);

    const questions: QuizQuestion[] = [];

    for (let i = 0; i < params.count; i++) {
      // 循环选择知识点
      const topic = params.topics[i % params.topics.length];

      try {
        const question = await this.generateQuestion({
          topic,
          difficulty: params.difficulty,
          userLevel: params.userLevel,
          mistakes: params.mistakes,
        });

        questions.push(question);
      } catch (error) {
        this.logger.error(`Failed to generate question ${i + 1}:`, error);
      }
    }

    return questions;
  }

  /**
   * 评估用户答案
   */
  async evaluateAnswer(params: {
    question: QuizQuestion;
    userAnswer: string;
  }): Promise<{
    isCorrect: boolean;
    confidence: number;
    reason: string;
    needsSelfAssessment: boolean;
  }> {
    this.logger.log(`Evaluating answer: ${params.userAnswer}`);

    const prompt = `请判断以下答案是否正确：

题目：${params.question.content}
正确答案：${params.question.correctAnswer}
用户答案：${params.userAnswer}

要求：
1. 严格判断对错
2. 对于模糊答案，倾向于判错（让用户自评）
3. 返回 JSON 格式`;

    const schema = {
      type: 'object',
      properties: {
        isCorrect: { type: 'boolean' },
        confidence: { type: 'number', minimum: 0, maximum: 1 },
        reason: { type: 'string' },
        needsSelfAssessment: { type: 'boolean' }
      }
    };

    try {
      const response = await this.llmService.structuredChat<typeof schema>(
        [{ role: 'user', content: prompt }],
        schema,
        { temperature: 0.3 }
      );

      return response;
    } catch (error) {
      this.logger.error('Failed to evaluate answer:', error);
      throw error;
    }
  }

  /**
   * 生成相似题（举一反三）
   */
  async generateSimilarQuestions(params: {
    question: QuizQuestion;
    userAnswer: string;
    errorType: 'low_level' | 'high_level';
    count?: number;
  }): Promise<QuizQuestion[]> {
    this.logger.log(`Generating similar questions for: ${params.question.id}`);

    const prompt = `基于以下错题，生成${params.count || 3}道相似题用于巩固练习：

原题：${params.question.content}
考点：${params.question.topic}
用户错误：${params.userAnswer}
错误类型：${params.errorType}

要求：
1. 保持相同知识点和难度
2. 改变题目条件和数值
3. 可以改变问法但考点不变
4. 返回 JSON 格式`;

    // 类似生成题目的 schema，但包含 variation 字段
    const schema = {
      type: 'object',
      properties: {
        similarQuestions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              question: { type: 'string' },
              options: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    label: { type: 'string' },
                    content: { type: 'string' }
                  }
                }
              },
              correctAnswer: { type: 'string' },
              explanation: {
                type: 'object',
                properties: {
                  level1: { type: 'string' },
                  level2: { type: 'string' },
                  level3: { type: 'string' },
                  level4: { type: 'string' },
                  level5: { type: 'string' }
                }
              },
              variation: { type: 'string', description: '变式说明' }
            }
          }
        }
      }
    };

    try {
      const response = await this.llmService.structuredChat<typeof schema>(
        [{ role: 'user', content: prompt }],
        schema,
        { temperature: 0.7 }
      );

      return response.similarQuestions.map((sq, index) => ({
        id: this.generateId(),
        type: params.question.type,
        difficulty: params.question.difficulty,
        topic: params.question.topic,
        content: sq.question,
        options: sq.options?.map(opt => ({
          id: opt.id,
          label: opt.label,
          content: opt.content,
          isCorrect: opt.id === sq.correctAnswer,
        })),
        correctAnswer: sq.correctAnswer,
        explanation: sq.explanation as any,
        tags: [...params.question.tags, '举一反三'],
        metadata: {
          source: `similar-to-${params.question.id}`,
          variation: sq.variation,
        },
      }));
    } catch (error) {
      this.logger.error('Failed to generate similar questions:', error);
      throw error;
    }
  }

  /**
   * 构建出题 Prompt
   */
  private buildQuizPrompt(params: {
    topic: string;
    difficulty: Difficulty;
    userLevel?: 'beginner' | 'intermediate' | 'advanced';
    mistakes?: string[];
  }): string {
    let prompt = `你是一位遗传学教师，请根据以下知识点出一道选择题：

知识点：${params.topic}
难度：${params.difficulty}
用户水平：${params.userLevel || 'intermediate'}`;

    if (params.mistakes && params.mistakes.length > 0) {
      prompt += `\n历史错题：${params.mistakes.join(', ')}`;
    }

    prompt += `

要求：
1. 题目要考查核心概念
2. 4个选项，只有一个正确
3. 不要涉及超纲内容
4. 返回 JSON 格式`;

    return prompt;
  }

  /**
   * 生成唯一 ID
   */
  private generateId(): string {
    return `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
