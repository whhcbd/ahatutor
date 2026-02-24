import { Module, DynamicModule } from '@nestjs/common';
import { AgentPipelineService } from './agent-pipeline.service';
import { ConceptAnalyzerService } from './concept-analyzer.service';
import { PrerequisiteExplorerService } from './prerequisite-explorer.service';
import { GeneticsEnricherService } from './genetics-enricher.service';
import { VisualDesignerService } from './visual-designer.service';
import { DynamicVizGeneratorService } from './dynamic-viz-generator.service';
import { AgentController } from './agent.controller';
import { LLMModule } from '../llm/llm.module';
import { RAGModule } from '../rag/rag.module';
// import { NarrativeComposerService } from './narrative-composer.service';
import { QuizGeneratorService } from './quiz-generator.service';
// import { WebSearchService } from './skills/web-search.service';
// import { ResourceRecommendService } from './skills/resource-recommend.service';
// import { VisualizationGeneratorService } from './skills/visualization-generator.service';
// import { GeneticsVisualizationService } from './skills/genetics-visualization.service';
// import { InteractiveControlService } from './skills/interactive-control.service';
import { AnswerEvaluatorService } from './skills/answer-evaluator.service';
// import { VisualizationRAGService } from './visualization-rag.service';
// import { GraphModule } from '../knowledge-graph/graph.module';
import { QuizBankModule } from '../quiz-bank/quiz-bank.module';
import { TemplateMatcherService } from './template-matcher.service';
import { A2UIAdapterService } from './a2ui-adapter.service';
import { StreamResponseService } from './stream-response.service';
import { ComponentCatalogService } from './component-catalog.service';

@Module({})
export class AgentModule {
  static register(): DynamicModule {
    return {
      module: AgentModule,
      imports: [LLMModule.register(), RAGModule, QuizBankModule],
      controllers: [AgentController],
      providers: [
        AgentPipelineService,
        ConceptAnalyzerService,
        // PrerequisiteExplorerService,
        // GeneticsEnricherService,
        VisualDesignerService,
        DynamicVizGeneratorService,
        // NarrativeComposerService,
        QuizGeneratorService,
        // WebSearchService,
        // ResourceRecommendService,
        // VisualizationGeneratorService,
        // GeneticsVisualizationService,
        // InteractiveControlService,
        AnswerEvaluatorService,
        TemplateMatcherService,
        A2UIAdapterService,
        StreamResponseService,
        ComponentCatalogService,
      ],
      exports: [
        AgentPipelineService,
        ConceptAnalyzerService,
        VisualDesignerService,
      ],
      global: true,
    };
  }
}
