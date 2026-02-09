import { Module } from '@nestjs/common';
import { MistakeController } from './mistake.controller';
import { MistakeService } from './services/mistake.service';
import { OcrService } from './services/ocr.service';
import { SimilarQuestionService } from './services/similar-question.service';
import { LLMModule } from '../llm/llm.module';

@Module({
  imports: [LLMModule.register()],
  controllers: [MistakeController],
  providers: [
    MistakeService,
    OcrService,
    SimilarQuestionService,
  ],
  exports: [
    MistakeService,
    OcrService,
    SimilarQuestionService,
  ],
})
export class MistakeModule {}
