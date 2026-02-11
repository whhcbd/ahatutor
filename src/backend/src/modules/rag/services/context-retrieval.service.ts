import { Injectable, Logger } from '@nestjs/common';
import { LLMService } from '../../llm/llm.service';
import { VectorRetrievalService } from './vector-retrieval.service';
import {
  ContextRetrievalInput,
  ContextRetrievalOutput,
  RetrievalResult,
  SkillExecutionResult,
  SkillType,
} from '@shared/types/skill.types';

/**
 * 上下文检索服务
 *
 * 功能：
 * - 基于对话历史的上下文检索
 * - 对话总结
 * - 扩展查询
 * - 生成追问建议
 */
@Injectable()
export class ContextRetrievalService {
  private readonly logger = new Logger(ContextRetrievalService.name);

  constructor(
    private readonly llmService: LLMService,
    private readonly vectorRetrievalService: VectorRetrievalService,
  ) {}

  /**
   * 上下文检索
   */
  async retrieve(
    input: ContextRetrievalInput,
  ): Promise<SkillExecutionResult<ContextRetrievalOutput>> {
    const startTime = Date.now();

    try {
      this.logger.log(`Context retrieval for query: ${input.currentQuery}`);

      const {
        currentQuery,
        conversationHistory,
        previousContext,
        topK = 5,
        contextWindow = 3,
      } = input;

      void previousContext;
      void contextWindow;

      const expandedQuery = await this.expandQuery(currentQuery, conversationHistory);
      this.logger.log(`Expanded query: ${expandedQuery}`);

      const retrievedContext = await this.vectorRetrievalService.retrieve({
        query: expandedQuery,
        topK,
      });

      const conversationContext = await this.analyzeConversationContext(
        currentQuery,
        conversationHistory,
        retrievedContext.success ? retrievedContext.data?.results || [] : [],
      );

      const processingTime = Date.now() - startTime;
      this.logger.log(`Context retrieval completed in ${processingTime}ms`);

      return {
        skill: SkillType.CONTEXT_RETRIEVAL,
        success: true,
        data: {
          retrievedContext: retrievedContext.success && retrievedContext.data
            ? retrievedContext.data.results
            : [],
          conversationContext,
          expandedQuery,
        },
        metadata: {
          processingTime,
        },
      };
    } catch (error) {
      this.logger.error('Context retrieval failed:', error);

      return {
        skill: SkillType.CONTEXT_RETRIEVAL,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: {
          processingTime: Date.now() - startTime,
        },
      };
    }
  }

  /**
   * 扩展查询（基于对话历史）
   */
  private async expandQuery(
    currentQuery: string,
    conversationHistory: Array<{ role: string; content: string }>,
  ): Promise<string> {
    if (!conversationHistory || conversationHistory.length === 0) {
      return currentQuery;
    }

    const recentHistory = conversationHistory.slice(-4);
    const historyText = recentHistory
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');

    interface QueryExpansion {
      expandedQuery: string;
      addedContext: string;
      reasoning: string;
    }

    const prompt = `你是一个查询扩展专家。根据对话历史，扩展用户的当前查询，使其包含必要的上下文。

对话历史：
${historyText}

当前查询：${currentQuery}

请返回 JSON 格式：
{
  "expandedQuery": "扩展后的查询",
  "addedContext": "添加了什么上下文",
  "reasoning": "扩展的理由"
}

注意事项：
- 保持查询的自然语言形式
- 只添加必要的上下文，避免冗余
- 如果查询已经很完整，可以不扩展
- 使用中文`;

    try {
      const result = await this.llmService.structuredChat<QueryExpansion>(
        [{ role: 'user', content: prompt }],
        { response_format: { type: 'json_object' } },
      );

      this.logger.log(`Query expanded: "${currentQuery}" -> "${result.expandedQuery}"`);
      return result.expandedQuery;
    } catch (error) {
      this.logger.error('Query expansion failed:', error);
      return currentQuery;
    }
  }

  /**
   * 分析对话上下文
   */
  private async analyzeConversationContext(
    currentQuery: string,
    conversationHistory: Array<{ role: string; content: string }>,
    retrievedResults: RetrievalResult[],
  ): Promise<ContextRetrievalOutput['conversationContext']> {
    interface ConversationAnalysis {
      summary: string;
      relevantTopics: string[];
      followUpQuestions: string[];
    }

    const historyText = conversationHistory
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');

    const retrievedTopics = this.extractTopics(retrievedResults);

    const prompt = `你是对话上下文分析专家。分析以下对话，总结上下文并识别相关主题。

对话历史：
${historyText}

当前查询：${currentQuery}

检索到的相关主题：${retrievedTopics.join('、') || '无'}

请返回 JSON 格式：
{
  "summary": "对话上下文总结（100字以内）",
  "relevantTopics": ["相关主题1", "相关主题2", ...],
  "followUpQuestions": ["追问1", "追问2", "追问3"]
}

注意事项：
- 总结要简洁明了
- 主题与遗传学相关
- 追问要启发式、有价值
- 使用中文`;

    try {
      const result = await this.llmService.structuredChat<ConversationAnalysis>(
        [{ role: 'user', content: prompt }],
        { response_format: { type: 'json_object' } },
      );

      return {
        summary: result.summary,
        relevantTopics: result.relevantTopics,
        followUpQuestions: result.followUpQuestions,
      };
    } catch (error) {
      this.logger.error('Conversation context analysis failed:', error);

      return {
        summary: '无法生成对话总结',
        relevantTopics: retrievedTopics,
        followUpQuestions: [],
      };
    }
  }

  /**
   * 提取主题
   */
  private extractTopics(results: RetrievalResult[]): string[] {
    const topicSet = new Set<string>();

    for (const result of results) {
      for (const topic of result.metadata.topics) {
        topicSet.add(topic);
      }
    }

    return Array.from(topicSet);
  }

  /**
   * 多轮对话中的上下文管理
   */
  async manageConversationContext(
    conversationHistory: Array<{ role: string; content: string }>,
    maxTurns: number = 10,
  ): Promise<Array<{ role: string; content: string }>> {
    if (conversationHistory.length <= maxTurns) {
      return conversationHistory;
    }

    const systemMsg = conversationHistory.find(msg => msg.role === 'system');
    const userAssistantMsgs = conversationHistory.filter(msg => msg.role !== 'system');

    const recentTurns = userAssistantMsgs.slice(-maxTurns * 2);

    const summaryPrompt = `请总结以下对话的关键内容，保留最重要的信息。

对话内容：
${userAssistantMsgs.slice(0, -maxTurns * 2).map(msg => `${msg.role}: ${msg.content}`).join('\n')}

请用100字以内总结，使用中文。`;

    try {
      const summary = await this.llmService.chat([
        { role: 'user', content: summaryPrompt },
      ]);

      const managedHistory: Array<{ role: string; content: string }> = [];

      if (systemMsg) {
        managedHistory.push(systemMsg);
      }

      managedHistory.push({
        role: 'system',
        content: `以下是之前对话的总结：${summary}\n当前对话：`,
      });

      managedHistory.push(...recentTurns);

      return managedHistory;
    } catch (error) {
      this.logger.error('Conversation summarization failed:', error);
      return conversationHistory.slice(-maxTurns * 2);
    }
  }

  /**
   * 获取相关追问
   */
  async getFollowUpQuestions(
    currentQuery: string,
    retrievedResults: RetrievalResult[],
    count: number = 3,
  ): Promise<string[]> {
    if (retrievedResults.length === 0) {
      return [];
    }

    const context = retrievedResults
      .slice(0, 3)
      .map(r => r.content)
      .join('\n\n');

    interface FollowUpQuestions {
      questions: string[];
    }

    const prompt = `你是一个学习引导专家。根据当前问题和相关内容，生成有价值的追问。

当前问题：${currentQuery}

相关内容：
${context}

请返回 JSON 格式：
{
  "questions": ["追问1", "追问2", "追问3"]
}

注意事项：
- 追问要启发学生思考
- 与遗传学知识相关
- 有助于深入理解概念
- 使用中文`;

    try {
      const result = await this.llmService.structuredChat<FollowUpQuestions>(
        [{ role: 'user', content: prompt }],
        { response_format: { type: 'json_object' } },
      );

      return result.questions.slice(0, count);
    } catch (error) {
      this.logger.error('Follow-up questions generation failed:', error);
      return [];
    }
  }

  /**
   * 上下文感知的答案验证
   */
  async verifyAnswerWithContext(
    question: string,
    answer: string,
    conversationHistory: Array<{ role: string; content: string }>,
  ): Promise<{ isCorrect: boolean; feedback: string; suggestions: string[] }> {
    interface AnswerVerification {
      isCorrect: boolean;
      confidence: number;
      feedback: string;
      suggestions: string[];
    }

    const historyText = conversationHistory
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');

    const prompt = `你是一个答案验证专家。验证学生的答案是否正确，并给出反馈。

问题：${question}

学生答案：${answer}

对话历史：
${historyText}

请返回 JSON 格式：
{
  "isCorrect": true/false,
  "confidence": 0-1之间的置信度,
  "feedback": "反馈内容（100字以内）",
  "suggestions": ["建议1", "建议2", ...]
}

注意事项：
- 结合对话历史判断
- 部分正确也算正确
- 反馈要鼓励为主
- 建议要有指导性
- 使用中文`;

    try {
      const result = await this.llmService.structuredChat<AnswerVerification>(
        [{ role: 'user', content: prompt }],
        { response_format: { type: 'json_object' } },
      );

      return {
        isCorrect: result.isCorrect,
        feedback: result.feedback,
        suggestions: result.suggestions,
      };
    } catch (error) {
      this.logger.error('Answer verification failed:', error);

      return {
        isCorrect: true,
        feedback: '无法验证答案',
        suggestions: [],
      };
    }
  }
}
