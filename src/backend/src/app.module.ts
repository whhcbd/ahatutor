import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { LLMModule } from './modules/llm/llm.module';
import { AgentModule } from './modules/agents/agent.module';
import { RAGModule } from './modules/rag/rag.module';
import { GraphModule } from './modules/knowledge-graph/graph.module';
import { KnowledgeGraphModule } from './modules/knowledge-graph/knowledge-graph.module';
import { MistakeModule } from './modules/mistake/mistake.module';
import { ReportModule } from './modules/report/report.module';
import { KnowledgeBaseModule } from './modules/knowledge-base/knowledge-base.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProgressModule } from './modules/progress/progress.module';
import { QuizBankModule } from './modules/quiz-bank/quiz-bank.module';

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // 限流模块
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),

    // AI 服务模块
    LLMModule.register(),
    KnowledgeBaseModule,
    AgentModule.register(),
    // RAGModule,
    GraphModule,
    KnowledgeGraphModule,
    // MistakeModule,
    // ReportModule,

    // 用户和进度模块
    AuthModule,
    ProgressModule,

    // 题库模块
    QuizBankModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
