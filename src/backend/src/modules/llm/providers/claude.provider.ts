import { Injectable, Logger } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { ChatMessage, ChatOptions, LLMResponse, ChatMessageContent } from '../llm.service';

type TextBlock = { type: 'text'; text: string };
type ImageBlock = { type: 'image'; source: { type: 'base64'; media_type: string; data: string } };
type ClaudeMessageContent = string | Array<TextBlock | ImageBlock>;

@Injectable()
export class ClaudeProvider {
  private readonly logger = new Logger(ClaudeProvider.name);
  private readonly client: Anthropic;
  private readonly model: string;

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      this.logger.warn('ANTHROPIC_API_KEY not set');
    }

    this.client = new Anthropic({
      apiKey: apiKey || 'dummy-key',
    });

    this.model = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022';
  }

  /**
   * Convert ChatMessageContent to Claude's expected format
   */
  private convertContentToClaudeFormat(content: ChatMessageContent): ClaudeMessageContent {
    if (typeof content === 'string') {
      return content;
    }

    return content.map((part): TextBlock | ImageBlock => {
      if (part.type === 'text') {
        return { type: 'text', text: part.text };
      } else if (part.type === 'image_url') {
        return {
          type: 'image',
          source: {
            type: 'base64',
            media_type: 'image/png',
            data: part.image_url.url,
          },
        };
      }
      return { type: 'text', text: '' };
    });
  }

  async chat(messages: ChatMessage[], options?: ChatOptions): Promise<LLMResponse> {
    try {
      // Claude 需要分离系统消息
      const systemMessage = messages.find((m) => m.role === 'system');
      const chatMessages = messages.filter((m) => m.role !== 'system');

      // Convert messages to Claude's format
      const claudeMessages = chatMessages.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: this.convertContentToClaudeFormat(msg.content),
      }));

      const response = await this.client.messages.create({
        model: this.model as Anthropic.MessageCreateParams['model'],
        system: typeof systemMessage?.content === 'string' ? systemMessage.content : undefined,
        messages: claudeMessages as Anthropic.MessageParam[],
        max_tokens: options?.maxTokens ?? 2000,
        temperature: options?.temperature ?? 0.7,
      });

      // Claude 返回的内容可能在 text block 中
      const content = response.content
        .filter((block) => block.type === 'text')
        .map((block) => (block.type === 'text' ? block.text : ''))
        .join('\n');

      return {
        content,
        model: response.model,
        usage: {
          promptTokens: response.usage?.input_tokens || 0,
          completionTokens: response.usage?.output_tokens || 0,
          totalTokens: (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0),
        },
      };
    } catch (error) {
      this.logger.error('Claude API error:', error);
      throw error;
    }
  }

  async *chatStream(
    messages: ChatMessage[],
    options?: ChatOptions,
  ): AsyncGenerator<string, void, unknown> {
    try {
      const systemMessage = messages.find((m) => m.role === 'system');
      const chatMessages = messages.filter((m) => m.role !== 'system');

      // Convert messages to Claude's format
      const claudeMessages = chatMessages.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: this.convertContentToClaudeFormat(msg.content),
      }));

      const stream = await this.client.messages.create({
        model: this.model as Anthropic.MessageCreateParams['model'],
        system: typeof systemMessage?.content === 'string' ? systemMessage.content : undefined,
        messages: claudeMessages as Anthropic.MessageParam[],
        max_tokens: options?.maxTokens ?? 2000,
        temperature: options?.temperature ?? 0.7,
        stream: true,
      });

      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          yield chunk.delta.text;
        }
      }
    } catch (error) {
      this.logger.error('Claude streaming error:', error);
      throw error;
    }
  }

  /**
   * Vision API - 图像理解
   */
  async analyzeImage(
    imageBase64: string,
    prompt: string,
    mimeType: 'image/png' | 'image/jpeg' | 'image/gif' | 'image/webp' = 'image/png',
  ): Promise<string> {
    try {
      const response = await this.client.messages.create({
        model: this.model as Anthropic.MessageCreateParams['model'],
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mimeType,
                  data: imageBase64,
                },
              },
            ],
          },
        ],
      });

      const content = response.content
        .filter((block) => block.type === 'text')
        .map((block) => (block.type === 'text' ? block.text : ''))
        .join('\n');

      return content;
    } catch (error) {
      this.logger.error('Claude Vision API error:', error);
      throw error;
    }
  }
}
