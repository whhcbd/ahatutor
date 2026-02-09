import { Module, DynamicModule } from '@nestjs/common';
import { LLMService } from './llm.service';
import { LLMController } from './llm.controller';
import { OpenAIProvider } from './providers/openai.provider';
import { ClaudeProvider } from './providers/claude.provider';
import { DeepSeekProvider } from './providers/deepseek.provider';
import { GLMProvider } from './providers/glm.provider';

@Module({})
export class LLMModule {
  static register(): DynamicModule {
    return {
      module: LLMModule,
      controllers: [LLMController],
      providers: [
        LLMService,
        OpenAIProvider,
        ClaudeProvider,
        DeepSeekProvider,
        GLMProvider,
      ],
      exports: [LLMService],
      global: true,
    };
  }
}
