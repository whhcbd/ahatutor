import { Injectable, Logger } from '@nestjs/common';
import { OpenAIProvider } from './providers/openai.provider';
import { ClaudeProvider } from './providers/claude.provider';
import { DeepSeekProvider } from './providers/deepseek.provider';
import { GLMProvider } from './providers/glm.provider';
import { MockProvider } from './providers/mock.provider';

export interface ChatMessageTextPart {
  type: 'text';
  text: string;
}

export interface ChatMessageImagePart {
  type: 'image_url';
  image_url: {
    url: string;
  };
}

export type ChatMessageContent = string | Array<ChatMessageTextPart | ChatMessageImagePart>;

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: ChatMessageContent;
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
  private readonly defaultProvider = process.env.DEFAULT_LLM_PROVIDER || 'mock';

  constructor(
    private readonly openaiProvider: OpenAIProvider,
    private readonly claudeProvider: ClaudeProvider,
    private readonly deepseekProvider: DeepSeekProvider,
    private readonly glmProvider: GLMProvider,
    private readonly mockProvider: MockProvider,
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
        case 'mock':
          return await this.mockProvider.chat(messages, options);
        default:
          return await this.mockProvider.chat(messages, options);
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
        case 'mock':
          yield* this.mockProvider.chatStream(messages, options);
          return;
        default:
          yield* this.mockProvider.chatStream(messages, options);
          return;
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
          return await this.openaiProvider.embed(text);
        case 'deepseek':
          return await this.openaiProvider.embed(text);
        case 'glm':
          return await this.glmProvider.embed(text);
        case 'mock':
          return await this.mockProvider.embed(text);
        default:
          return await this.mockProvider.embed(text);
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
      let jsonText = response.content.trim();
      
      this.logger.debug(`Parsing LLM response, length: ${jsonText.length}`);
      this.logger.debug(`Original response preview: ${response.content.substring(0, 200)}`);
      
      const extractionMethods = [
        {
          name: 'Markdown code block',
          extract: (text: string) => {
            const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
            return match ? match[1] : null;
          }
        },
        {
          name: 'First complete JSON object',
          extract: (text: string) => {
            const match = text.match(/\{[\s\S]*\}/);
            return match ? match[0] : null;
          }
        },
        {
          name: 'Raw text',
          extract: (text: string) => text
        }
      ];

      for (const method of extractionMethods) {
        const extracted = method.extract(jsonText);
        if (extracted) {
          try {
            const result = JSON.parse(extracted) as T;
            this.logger.debug(`Successfully parsed JSON using ${method.name}`);
            return result;
          } catch (e) {
            this.logger.warn(`Failed to parse with ${method.name}: ${e instanceof Error ? e.message : String(e)}`);
          }
        }
      }

      this.logger.error('All JSON extraction methods failed', {
        responseContent: response.content.substring(0, 1000),
        fullLength: response.content.length
      });
      
      throw new Error('Invalid JSON response from LLM: All extraction methods failed');
    } catch (error) {
      this.logger.error('Failed to parse LLM response as JSON:', {
        error: error instanceof Error ? error.message : String(error),
        responseContent: response.content.substring(0, 1000),
        fullLength: response.content.length
      });
      throw new Error(`Invalid JSON response from LLM: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
