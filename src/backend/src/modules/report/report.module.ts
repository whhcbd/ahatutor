import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './services/report.service';
import { MistakeModule } from '../mistake/mistake.module';
import { LLMModule } from '../llm/llm.module';

@Module({
  imports: [MistakeModule, LLMModule.register()],
  controllers: [ReportController],
  providers: [ReportService],
  exports: [ReportService],
})
export class ReportModule {}
