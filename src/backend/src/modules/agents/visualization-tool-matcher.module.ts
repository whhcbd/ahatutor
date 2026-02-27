import { Module } from '@nestjs/common';
import { VisualizationToolMatcherService } from './visualization-tool-matcher.service';
import { VisualizationRAGService } from './visualization-rag.service';
import { TemplateMatcherService } from './template-matcher.service';

@Module({
  providers: [
    VisualizationToolMatcherService,
    VisualizationRAGService,
    TemplateMatcherService,
  ],
  exports: [
    VisualizationToolMatcherService,
  ],
})
export class VisualizationToolMatcherModule {}
