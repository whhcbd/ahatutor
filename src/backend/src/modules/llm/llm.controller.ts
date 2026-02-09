import { Controller, Post, Body, Sse, Header, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { LLMService, ChatMessage } from './llm.service';
import { Response } from 'express';

class ChatDto {
  @ApiProperty({ description: '聊天消息列表' })
  messages: ChatMessage[];

  @ApiProperty({ description: 'LLM 提供商', required: false, enum: ['openai', 'claude', 'deepseek', 'glm'] })
  provider?: string;

  @ApiProperty({ description: '温度参数', required: false })
  temperature?: number;

  @ApiProperty({ description: '最大 token 数', required: false })
  maxTokens?: number;

  @ApiProperty({ description: '是否流式输出', required: false })
  stream?: boolean;
}

@ApiTags('LLM')
@Controller('llm')
export class LLMController {
  constructor(private readonly llmService: LLMService) {}

  @Post('chat')
  @ApiOperation({ summary: '发送聊天请求' })
  async chat(@Body() dto: ChatDto) {
    const response = await this.llmService.chat(dto.messages, {
      provider: dto.provider,
      temperature: dto.temperature,
      maxTokens: dto.maxTokens,
    });
    return response;
  }

  @Post('stream')
  @ApiOperation({ summary: '流式聊天' })
  @Header('Content-Type', 'text/event-stream')
  @Header('Cache-Control', 'no-cache')
  @Header('Connection', 'keep-alive')
  async stream(@Body() dto: ChatDto, @Res() res: Response) {
    const stream = this.llmService.chatStream(dto.messages, {
      provider: dto.provider,
      temperature: dto.temperature,
      maxTokens: dto.maxTokens,
    });

    res.write('data: ');

    for await (const chunk of stream) {
      res.write(JSON.stringify({ content: chunk }));
      res.write('\n\n');
    }

    res.write('data: [DONE]\n\n');
    res.end();
  }

  @Post('embed')
  @ApiOperation({ summary: '获取文本嵌入向量' })
  async embed(
    @Body('text') text: string,
    @Body('provider') provider?: string,
  ) {
    const embedding = await this.llmService.embed(text, provider);
    return { embedding };
  }
}
