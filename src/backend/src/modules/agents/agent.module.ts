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
import { VisualizationGeneratorService } from './skills/visualization-generator.service';
import { GeneticsVisualizationService } from './skills/genetics-visualization.service';
import { InteractiveControlService } from './skills/interactive-control.service';
import { AnswerEvaluatorService } from './skills/answer-evaluator.service';
import { VisualizationRAGService } from './visualization-rag.service';
import { RAGModule } from '../rag/rag.module';
import { GraphModule } from '../knowledge-graph/graph.module';

@Module({})
export class AgentModule {
  static register(): DynamicModule {
    return {
      module: AgentModule,
      imports: [LLMModule.register(), RAGModule, GraphModule],
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
        VisualizationGeneratorService,
        GeneticsVisualizationService,
        InteractiveControlService,
        AnswerEvaluatorService,
        VisualizationRAGService,
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
        VisualizationGeneratorService,
        GeneticsVisualizationService,
        InteractiveControlService,
        AnswerEvaluatorService,
      ],
      global: true,
    };
  }
}
