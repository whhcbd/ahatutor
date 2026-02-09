import { Module, DynamicModule } from '@nestjs/common';
import { AgentPipelineService } from './agent-pipeline.service';
import { ConceptAnalyzerService } from './concept-analyzer.service';
import { PrerequisiteExplorerService } from './prerequisite-explorer.service';
import { GeneticsEnricherService } from './genetics-enricher.service';
import { VisualDesignerService } from './visual-designer.service';
import { NarrativeComposerService } from './narrative-composer.service';
import { QuizGeneratorService } from './quiz-generator.service';
import { AgentController } from './agent.controller';
import { LLMModule } from '../llm/llm.module';
import { WebSearchService } from './skills/web-search.service';
import { ResourceRecommendService } from './skills/resource-recommend.service';

@Module({})
export class AgentModule {
  static register(): DynamicModule {
    return {
      module: AgentModule,
      imports: [LLMModule.register()],
      controllers: [AgentController],
      providers: [
        AgentPipelineService,
        ConceptAnalyzerService,
        PrerequisiteExplorerService,
        GeneticsEnricherService,
        VisualDesignerService,
        NarrativeComposerService,
        QuizGeneratorService,
        WebSearchService,
        ResourceRecommendService,
      ],
      exports: [
        AgentPipelineService,
        ConceptAnalyzerService,
        PrerequisiteExplorerService,
        GeneticsEnricherService,
        VisualDesignerService,
        NarrativeComposerService,
        QuizGeneratorService,
        WebSearchService,
        ResourceRecommendService,
      ],
      global: true,
    };
  }
}
