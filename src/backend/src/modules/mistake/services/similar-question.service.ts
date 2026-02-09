import { Injectable } from '@nestjs/common';
import { LLMService } from '../../llm/llm.service';

/**
 * 举一反三服务
 * 基于错题生成相似题目
 */

export interface SimilarQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  variation: string;
}

interface SimilarQuestionsResponse {
  similarQuestions: SimilarQuestion[];
}

interface TopicQuestionsResponse {
  questions: Array<{
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }>;
}

@Injectable()
export class SimilarQuestionService {
  constructor(private readonly llmService: LLMService) {}

  /**
   * 生成相似题
   */
  async generate(
    mistake: any,
    options: { count?: number; difficulty?: 'easy' | 'medium' | 'hard' } = {},
  ) {
    const { count = 3, difficulty } = options;

    const prompt = `基于以下错题，生成 ${count} 道相似题目用于巩固练习：

【原题】
题目：${mistake.question}
${mistake.options ? `选项：${mistake.options.join('\\n')}` : ''}
正确答案：${mistake.correctAnswer || '未知'}
用户答案：${mistake.userAnswer || '未知'}
错误类型：${mistake.errorType}
知识点：${mistake.tags?.join(', ') || '未分类'}

【要求】
1. 保持相同的知识点和考点
2. 可以改变题目条件、数值或问法，但考点不变
3. 难度${difficulty ? `调整为 ${difficulty}` : '与原题相近'}
4. 提供详细的解析
5. 返回 JSON 格式

【返回格式】
{
  "similarQuestions": [
    {
      "id": "similar_1",
      "question": "题目内容",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0,
      "explanation": "详细解析",
      "variation": "条件改变/数值改变/问法改变"
    }
  ]
}`;

    try {
      const result = await this.llmService.structuredChat<SimilarQuestionsResponse>(
        [{ role: 'user', content: prompt }],
        {
          type: 'object',
          properties: {
            similarQuestions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  question: { type: 'string' },
                  options: { type: 'array', items: { type: 'string' } },
                  correctAnswer: { type: 'number' },
                  explanation: { type: 'string' },
                  variation: { type: 'string' },
                },
              },
            },
          },
        },
      );

      // 添加原错题信息
      return {
        originalQuestion: mistake,
        similarQuestions: result.similarQuestions,
        generatedAt: new Date(),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`生成相似题失败: ${message}`);
    }
  }

  /**
   * 生成变式练习（针对特定知识点）
   */
  async generateByTopic(
    topic: string,
    options: { count?: number; difficulty?: 'easy' | 'medium' | 'hard' } = {},
  ) {
    const { count = 5, difficulty } = options;

    const prompt = `针对知识点"${topic}"，生成 ${count} 道练习题：

【要求】
1. 题目类型为选择题
2. 难度${difficulty ? `为 ${difficulty}` : '适中'}
3. 涵盖该知识点的不同方面
4. 每题提供详细解析

【返回格式】
{
  "questions": [
    {
      "id": "q_1",
      "question": "题目内容",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0,
      "explanation": "解析"
    }
  ]
}`;

    try {
      const result = await this.llmService.structuredChat<TopicQuestionsResponse>(
        [{ role: 'user', content: prompt }],
        {
          type: 'object',
          properties: {
            questions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  question: { type: 'string' },
                  options: { type: 'array', items: { type: 'string' } },
                  correctAnswer: { type: 'number' },
                  explanation: { type: 'string' },
                },
              },
            },
          },
        },
      );

      return {
        topic,
        questions: result.questions,
        generatedAt: new Date(),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`生成练习题失败: ${message}`);
    }
  }

  /**
   * 生成错题重练试卷
   */
  async generateReviewQuiz(mistakeIds: string[], allMistakes: Map<string, any>) {
    const mistakes = mistakeIds
      .map((id) => allMistakes.get(id))
      .filter(Boolean);

    if (mistakes.length === 0) {
      throw new Error('没有找到有效的错题');
    }

    // 按知识点分组
    const topicGroups = new Map<string, any[]>();
    for (const mistake of mistakes) {
      for (const tag of mistake.tags || [mistake.subject || 'other']) {
        if (!topicGroups.has(tag)) {
          topicGroups.set(tag, []);
        }
        topicGroups.get(tag)!.push(mistake);
      }
    }

    // 为每个知识点生成复习题
    const reviewQuestions = [];

    for (const [_topic, topicMistakes] of topicGroups) {
      const similar = await this.generate(topicMistakes[0], { count: 2 });
      reviewQuestions.push(...similar.similarQuestions);
    }

    return {
      quizId: `review_${Date.now()}`,
      title: '错题重练',
      totalQuestions: reviewQuestions.length,
      questions: reviewQuestions,
      topics: Array.from(topicGroups.keys()),
      generatedAt: new Date(),
    };
  }
}
