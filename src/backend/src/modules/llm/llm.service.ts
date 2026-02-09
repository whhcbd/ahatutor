import { Injectable, Logger } from '@nestjs/common';
import { OpenAIProvider } from './providers/openai.provider';
import { ClaudeProvider } from './providers/claude.provider';
import { DeepSeekProvider } from './providers/deepseek.provider';
import { GLMProvider } from './providers/glm.provider';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatOptions {
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface LLMResponse {
  content: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * LLM 服务 - 支持多个提供商
 */
@Injectable()
export class LLMService {
  private readonly logger = new Logger(LLMService.name);
  private readonly defaultProvider = process.env.DEFAULT_LLM_PROVIDER || 'openai';

  constructor(
    private readonly openaiProvider: OpenAIProvider,
    private readonly claudeProvider: ClaudeProvider,
    private readonly deepseekProvider: DeepSeekProvider,
    private readonly glmProvider: GLMProvider,
  ) {}

  /**
   * 发送聊天请求
   */
  async chat(
    messages: ChatMessage[],
    options?: ChatOptions & { provider?: string },
  ): Promise<LLMResponse> {
    const provider = options?.provider || this.defaultProvider;

    this.logger.debug(`Using LLM provider: ${provider}`);

    try {
      switch (provider) {
        case 'openai':
          return await this.openaiProvider.chat(messages, options);
        case 'claude':
          return await this.claudeProvider.chat(messages, options);
        case 'deepseek':
          return await this.deepseekProvider.chat(messages, options);
        case 'glm':
          return await this.glmProvider.chat(messages, options);
        default:
          throw new Error(`Unknown LLM provider: ${provider}`);
      }
    } catch (error) {
      this.logger.error(`LLM request failed for provider ${provider}:`, error);
      throw error;
    }
  }

  /**
   * 流式聊天
   */
  async *chatStream(
    messages: ChatMessage[],
    options?: ChatOptions & { provider?: string },
  ): AsyncGenerator<string, void, unknown> {
    const provider = options?.provider || this.defaultProvider;

    this.logger.debug(`Using streaming LLM provider: ${provider}`);

    try {
      switch (provider) {
        case 'openai':
          yield* this.openaiProvider.chatStream(messages, options);
          return;
        case 'claude':
          yield* this.claudeProvider.chatStream(messages, options);
          return;
        case 'deepseek':
          yield* this.deepseekProvider.chatStream(messages, options);
          return;
        case 'glm':
          yield* this.glmProvider.chatStream(messages, options);
          return;
        default:
          throw new Error(`Unknown LLM provider: ${provider}`);
      }
    } catch (error) {
      this.logger.error(`LLM stream request failed for provider ${provider}:`, error);
      throw error;
    }
  }

  /**
   * 获取嵌入向量
   */
  async embed(text: string, provider?: string): Promise<number[]> {
    const embedProvider = provider || this.defaultProvider;

    this.logger.debug(`Using embedding provider: ${embedProvider}`);

    try {
      switch (embedProvider) {
        case 'openai':
          return await this.openaiProvider.embed(text);
        case 'claude':
          // Claude 不提供嵌入 API，回退到 OpenAI
          return await this.openaiProvider.embed(text);
        case 'deepseek':
          // DeepSeek 不提供嵌入 API，回退到 OpenAI
          return await this.openaiProvider.embed(text);
        case 'glm':
          // GLM 提供嵌入 API
          return await this.glmProvider.embed(text);
        default:
          return await this.openaiProvider.embed(text);
      }
    } catch (error) {
      this.logger.error(`Embedding request failed for provider ${embedProvider}:`, error);
      throw error;
    }
  }

  /**
   * 生成嵌入向量（别名方法，用于 RAG 服务）
   */
  async generateEmbedding(text: string, provider?: string): Promise<number[]> {
    return this.embed(text, provider);
  }

  /**
   * 结构化输出（JSON 模式）
   */
  async structuredChat<T>(
    messages: ChatMessage[],
    schema: Record<string, unknown>,
    options?: ChatOptions & { provider?: string },
  ): Promise<T> {
    const provider = options?.provider || this.defaultProvider;

    // 添加 JSON 格式要求到系统消息
    const jsonMessages = [
      {
        role: 'system' as const,
        content: `You must respond with valid JSON only. Do not include any explanatory text outside the JSON structure.
JSON Schema:
${JSON.stringify(schema, null, 2)}`,
      },
      ...messages,
    ];

    const response = await this.chat(jsonMessages, { ...options, provider });

    try {
      // 尝试提取 JSON（处理可能的 markdown 代码块）
      let jsonText = response.content.trim();
      if (jsonText.startsWith('```')) {
        const match = jsonText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (match) {
          jsonText = match[1];
        }
      }
      return JSON.parse(jsonText) as T;
    } catch (error) {
      this.logger.error('Failed to parse LLM response as JSON:', response.content);
      throw new Error(`Invalid JSON response from LLM: ${error}`);
    }
  }
}
