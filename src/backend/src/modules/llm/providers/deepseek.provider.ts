import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { ChatMessage, ChatOptions, LLMResponse } from '../llm.service';

@Injectable()
export class DeepSeekProvider {
  private readonly logger = new Logger(DeepSeekProvider.name);
  private readonly client: OpenAI;
  private readonly model: string;

  constructor() {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      this.logger.warn('DEEPSEEK_API_KEY not set');
    }

    const baseURL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';

    this.client = new OpenAI({
      apiKey: apiKey || 'dummy-key',
      baseURL,
    });

    this.model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';
  }

  async chat(messages: ChatMessage[], options?: ChatOptions): Promise<LLMResponse> {
    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: messages as OpenAI.Chat.ChatCompletionMessageParam[],
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 2000,
      });

      return {
        content: response.choices[0]?.message?.content || '',
        model: response.model,
        usage: {
          promptTokens: response.usage?.prompt_tokens || 0,
          completionTokens: response.usage?.completion_tokens || 0,
          totalTokens: response.usage?.total_tokens || 0,
        },
      };
    } catch (error) {
      this.logger.error('DeepSeek API error:', error);
      throw error;
    }
  }

  async *chatStream(
    messages: ChatMessage[],
    options?: ChatOptions,
  ): AsyncGenerator<string, void, unknown> {
    try {
      const stream = await this.client.chat.completions.create({
        model: this.model,
        messages: messages as OpenAI.Chat.ChatCompletionMessageParam[],
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 2000,
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          yield content;
        }
      }
    } catch (error) {
      this.logger.error('DeepSeek streaming error:', error);
      throw error;
    }
  }

  /**
   * DeepSeek 目前不提供独立的嵌入 API
   * 如需嵌入功能，请使用 OpenAI 的嵌入服务
   */
  async embed(_text: string): Promise<number[]> {
    throw new Error('DeepSeek does not provide embedding API. Please use OpenAI for embeddings.');
  }
}
