import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { LLMModule } from './modules/llm/llm.module';
import { AgentModule } from './modules/agents/agent.module';
import { RAGModule } from './modules/rag/rag.module';
import { GraphModule } from './modules/knowledge-graph/graph.module';
import { MistakeModule } from './modules/mistake/mistake.module';
import { ReportModule } from './modules/report/report.module';

// 模块占位 - 这些模块将在后续实现
// import { AuthModule } from './modules/auth/auth.module';
// import { QuizModule } from './modules/services/quiz.module';
// import { CacheModule } from './modules/cache/cache.module';

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // 限流模块
    ThrottlerModule.forRoot([{
      ttl: 60000, // 60 秒
      limit: 100, // 最多 100 次请求
    }]),

    // AI 服务模块
    LLMModule.register(),
    AgentModule.register(),
    RAGModule,
    GraphModule,
    MistakeModule,
    ReportModule,

    // 功能模块（待实现）
    // AuthModule,
    // QuizModule,
    // CacheModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
