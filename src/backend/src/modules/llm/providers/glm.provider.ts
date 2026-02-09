import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { ChatMessage, ChatOptions, LLMResponse } from '../llm.service';

/**
 * GLM (智谱 AI) 提供商
 * 兼容 OpenAI SDK 格式
 */
@Injectable()
export class GLMProvider {
  private readonly logger = new Logger(GLMProvider.name);
  private readonly client: OpenAI;
  private readonly model: string;

  constructor() {
    const apiKey = process.env.GLM_API_KEY;
    if (!apiKey) {
      this.logger.warn('GLM_API_KEY not set');
    }

    const baseURL = process.env.GLM_BASE_URL || 'https://open.bigmodel.cn/api/paas/v4';

    this.client = new OpenAI({
      apiKey: apiKey || 'dummy-key',
      baseURL,
    });

    this.model = process.env.GLM_MODEL || 'glm-4-flash';
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
      this.logger.error('GLM API error:', error);
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
      this.logger.error('GLM streaming error:', error);
      throw error;
    }
  }

  /**
   * GLM 提供嵌入 API
   */
  async embed(text: string): Promise<number[]> {
    try {
      const embeddingModel = process.env.GLM_EMBEDDING_MODEL || 'embedding-2';
      const response = await this.client.embeddings.create({
        model: embeddingModel as 'embedding-2',
        input: text,
      });

      return response.data[0]?.embedding || [];
    } catch (error) {
      this.logger.error('GLM embedding error:', error);
      throw error;
    }
  }

  /**
   * Vision API - 图像理解
   */
  async analyzeImage(imageUrl: string, prompt: string): Promise<string> {
    try {
      // GLM-4V 支持视觉理解
      const visionModel = process.env.GLM_VISION_MODEL || 'glm-4v';

      const response = await this.client.chat.completions.create({
        model: visionModel as 'glm-4v',
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
      this.logger.error('GLM Vision API error:', error);
      throw error;
    }
  }
}
