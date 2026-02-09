import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { ChatMessage, ChatOptions, LLMResponse } from '../llm.service';

@Injectable()
export class OpenAIProvider {
  private readonly logger = new Logger(OpenAIProvider.name);
  private readonly client: OpenAI;
  private readonly model: string;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      this.logger.warn('OPENAI_API_KEY not set');
    }

    this.client = new OpenAI({
      apiKey: apiKey || 'dummy-key',
    });

    this.model = process.env.OPENAI_MODEL || 'gpt-4';
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
      this.logger.error('OpenAI API error:', error);
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
      this.logger.error('OpenAI streaming error:', error);
      throw error;
    }
  }

  async embed(text: string): Promise<number[]> {
    try {
      const model = process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small';
      const response = await this.client.embeddings.create({
        model: model as 'text-embedding-3-small',
        input: text,
      });

      return response.data[0]?.embedding || [];
    } catch (error) {
      this.logger.error('OpenAI embedding error:', error);
      throw error;
    }
  }

  /**
   * Vision API - 图像理解
   */
  async analyzeImage(imageUrl: string, prompt: string): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4-vision-preview' as const,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: imageUrl } },
            ],
          },
        ],
        max_tokens: 2000,
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      this.logger.error('OpenAI Vision API error:', error);
      throw error;
    }
  }
}
