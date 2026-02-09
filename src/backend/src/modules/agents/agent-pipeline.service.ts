import { Injectable, Logger } from '@nestjs/common';
import { ConceptAnalyzerService } from './concept-analyzer.service';
import { PrerequisiteExplorerService } from './prerequisite-explorer.service';
import { GeneticsEnricherService } from './genetics-enricher.service';
import { VisualDesignerService } from './visual-designer.service';
import { NarrativeComposerService } from './narrative-composer.service';
import { QuizGeneratorService } from './quiz-generator.service';
import { SixAgentInput, SixAgentOutput } from '@shared/types/agent.types';
import { Difficulty } from '@shared/types/genetics.types';

/**
 * Agent 流水线服务
 * 整合六个 Agent 的协作流程
 */
@Injectable()
export class AgentPipelineService {
  private readonly logger = new Logger(AgentPipelineService.name);

  constructor(
    private readonly conceptAnalyzer: ConceptAnalyzerService,
    private readonly prerequisiteExplorer: PrerequisiteExplorerService,
    private readonly geneticsEnricher: GeneticsEnricherService,
    private readonly visualDesigner: VisualDesignerService,
    private readonly narrativeComposer: NarrativeComposerService,
    private readonly quizGenerator: QuizGeneratorService,
  ) {}

  /**
   * 执行完整的六 Agent 流水线
   *
   * 流程：
   * 1. ConceptAnalyzer - 分析概念
   * 2. PrerequisiteExplorer - 探索前置知识
   * 3. GeneticsEnricher - 丰富教学内容
   * 4. VisualDesigner - 可视化设计
   * 5. NarrativeComposer - 叙事作曲
   * 6. QuizGenerator - 生成题目（可选）
   */
  async executePipeline(input: SixAgentInput): Promise<SixAgentOutput> {
    this.logger.log(`Executing pipeline for: ${input.concept}`);
    const startTime = Date.now();

    try {
      // Agent 1: 概念分析
      this.logger.debug('Step 1: ConceptAnalyzer');
      const conceptAnalysis = await this.conceptAnalyzer.analyze(
        input.concept,
        input.userLevel
      );

      // Agent 2: 前置知识探索（核心创新）
      this.logger.debug('Step 2: PrerequisiteExplorer');
      const prerequisiteTree = await this.prerequisiteExplorer.explorePrerequisites(
        input.concept,
        3 // 默认递归深度 3 层
      );

      // Agent 3: 遗传学知识丰富
      this.logger.debug('Step 3: GeneticsEnricher');
      const geneticsEnrichment = await this.geneticsEnricher.enrichConcept(
        input.concept
      );

      // Agent 4: 可视化设计
      this.logger.debug('Step 4: VisualDesigner');
      const visualDesign = await this.visualDesigner.designVisualization(
        input.concept,
        conceptAnalysis,
        geneticsEnrichment,
        prerequisiteTree
      );

      // Agent 5: 叙事作曲
      this.logger.debug('Step 5: NarrativeComposer');
      const narrativeComposition = await this.narrativeComposer.composeNarrative(
        input.concept,
        conceptAnalysis,
        prerequisiteTree,
        geneticsEnrichment
      );

      // Agent 6: 题目生成（可选）
      let quiz;
      if (input.focusAreas?.includes('quiz')) {
        this.logger.debug('Step 6: QuizGenerator');
        const question = await this.quizGenerator.generateQuestion({
          topic: input.concept,
          difficulty: input.userLevel === 'beginner' ? Difficulty.EASY : input.userLevel === 'advanced' ? Difficulty.HARD : Difficulty.MEDIUM,
          userLevel: input.userLevel,
        });
        quiz = question;
      }

      const elapsed = Date.now() - startTime;
      this.logger.log(`Pipeline completed in ${elapsed}ms`);

      return {
        conceptAnalysis,
        prerequisiteTree,
        geneticsEnrichment,
        visualDesign,
        narrativeComposition,
        quiz,
      };
    } catch (error) {
      this.logger.error('Pipeline execution failed:', error);
      throw error;
    }
  }

  /**
   * 快速模式：只执行概念分析和前置知识探索
   */
  async quickAnalyze(concept: string): Promise<{
    analysis: Awaited<ReturnType<ConceptAnalyzerService['analyze']>>;
    tree: Awaited<ReturnType<PrerequisiteExplorerService['explorePrerequisites']>>;
  }> {
    this.logger.log(`Quick analysis for: ${concept}`);

    const analysis = await this.conceptAnalyzer.analyze(concept);
    const tree = await this.prerequisiteExplorer.explorePrerequisites(concept, 2);

    return { analysis, tree };
  }

  /**
   * 学习路径模式：生成从基础到目标的学习路径
   */
  async generateLearningPath(
    concept: string,
    _userLevel: 'beginner' | 'intermediate' | 'advanced' = 'intermediate'
  ): Promise<{
    path: string[];
    enrichedContent: Map<string, unknown>;
  }> {
    this.logger.log(`Generating learning path for: ${concept}`);

    // 获取前置知识树
    const tree = await this.prerequisiteExplorer.explorePrerequisites(concept, 3);

    // 扁平化为学习路径
    const path = this.prerequisiteExplorer.flattenToLearningPath(tree);

    // 为每个概念获取丰富内容
    const enrichedContent = new Map();
    for (const node of path) {
      try {
        const enrichment = await this.geneticsEnricher.enrichConcept(node);
        enrichedContent.set(node, enrichment);
      } catch (error) {
        this.logger.error(`Failed to enrich ${node}:`, error);
      }
    }

    return { path, enrichedContent };
  }

  /**
   * 速通模式：生成题目
   */
  async generateQuizForTopic(params: {
    topic: string;
    difficulty: Difficulty;
    count: number;
    userLevel?: 'beginner' | 'intermediate' | 'advanced';
  }) {
    this.logger.log(`Generating quiz for topic: ${params.topic}`);

    const questions = await this.quizGenerator.generateQuestions({
      topics: [params.topic],
      difficulty: params.difficulty,
      count: params.count,
      userLevel: params.userLevel,
    });

    return questions;
  }
}
