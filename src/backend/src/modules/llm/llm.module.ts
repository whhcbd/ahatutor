import { Module, DynamicModule } from '@nestjs/common';
import { LLMService } from './llm.service';
import { LLMController } from './llm.controller';
import { OpenAIProvider } from './providers/openai.provider';
import { ClaudeProvider } from './providers/claude.provider';
import { DeepSeekProvider } from './providers/deepseek.provider';
import { GLMProvider } from './providers/glm.provider';
import { MockProvider } from './providers/mock.provider';
import { EnhancedLocalEmbeddingService } from '../rag/services/enhanced-local-embedding.service';

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
        MockProvider,
        EnhancedLocalEmbeddingService,
      ],
      exports: [LLMService],
      global: true,
    };
  }
}
