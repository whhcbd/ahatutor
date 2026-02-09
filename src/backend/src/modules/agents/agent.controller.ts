import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { AgentPipelineService } from './agent-pipeline.service';
import { ConceptAnalyzerService } from './concept-analyzer.service';
import { PrerequisiteExplorerService } from './prerequisite-explorer.service';
import { GeneticsEnricherService } from './genetics-enricher.service';
import { VisualDesignerService } from './visual-designer.service';
import { NarrativeComposerService } from './narrative-composer.service';
import { QuizGeneratorService } from './quiz-generator.service';
import { WebSearchService } from './skills/web-search.service';
import { ResourceRecommendService } from './skills/resource-recommend.service';
import { SixAgentInput } from '@shared/types/agent.types';
import { Difficulty } from '@shared/types/genetics.types';
import { ResourceType, SkillType } from '@shared/types/skill.types';

class PipelineDto implements SixAgentInput {
  @ApiProperty({ description: '目标概念' })
  concept: string;

  @ApiProperty({ description: '用户水平', enum: ['beginner', 'intermediate', 'advanced'], required: false })
  userLevel?: 'beginner' | 'intermediate' | 'advanced';

  @ApiProperty({ description: '学习目标', required: false })
  learningGoal?: string;

  @ApiProperty({ description: '关注领域', required: false, type: [String] })
  focusAreas?: string[];
}

class ExploreDto {
  @ApiProperty({ description: '目标概念' })
  concept: string;

  @ApiProperty({ description: '递归深度', required: false })
  maxDepth?: number;
}

class GenerateQuizDto {
  @ApiProperty({ description: '知识点' })
  topic: string;

  @ApiProperty({ description: '难度', enum: ['easy', 'medium', 'hard'] })
  difficulty: Difficulty;

  @ApiProperty({ description: '题目数量', required: false })
  count?: number;

  @ApiProperty({ description: '用户水平', enum: ['beginner', 'intermediate', 'advanced'], required: false })
  userLevel?: 'beginner' | 'intermediate' | 'advanced';
}

class EvaluateAnswerDto {
  @ApiProperty({ description: '题目内容' })
  question: string;

  @ApiProperty({ description: '正确答案' })
  correctAnswer: string;

  @ApiProperty({ description: '用户答案' })
  userAnswer: string;
}

class SimilarQuestionDto {
  @ApiProperty({ description: '原题内容' })
  question: string;

  @ApiProperty({ description: '考点' })
  topic: string;

  @ApiProperty({ description: '用户错误答案' })
  userAnswer: string;

  @ApiProperty({ description: '错误类型', enum: ['low_level', 'high_level'] })
  errorType: 'low_level' | 'high_level';

  @ApiProperty({ description: '生成数量', required: false })
  count?: number;
}

class VisualDesignDto {
  @ApiProperty({ description: '目标概念' })
  concept: string;

  @ApiProperty({ description: '包含遗传学丰富内容', required: false })
  includeEnrichment?: boolean;

  @ApiProperty({ description: '包含前置知识树', required: false })
  includePrerequisites?: boolean;
}

class NarrativeDto {
  @ApiProperty({ description: '目标概念' })
  concept: string;

  @ApiProperty({ description: '用户水平', enum: ['beginner', 'intermediate', 'advanced'], required: false })
  userLevel?: 'beginner' | 'intermediate' | 'advanced';
}

class WebSearchDto {
  @ApiProperty({ description: '搜索查询' })
  query: string;

  @ApiProperty({ description: '结果数量', required: false })
  numResults?: number;

  @ApiProperty({ description: '语言', required: false })
  language?: string;

  @ApiProperty({ description: '时间范围', enum: ['day', 'week', 'month', 'year', 'all'], required: false })
  timeRange?: 'day' | 'week' | 'month' | 'year' | 'all';
}

class ResourceRecommendDto {
  @ApiProperty({ description: '目标概念' })
  concept: string;

  @ApiProperty({ description: '用户水平', enum: ['beginner', 'intermediate', 'advanced'], required: false })
  userLevel?: 'beginner' | 'intermediate' | 'advanced';

  @ApiProperty({ description: '资源类型', enum: ['video', 'article', 'paper', 'book', 'course', 'interactive'], required: false, type: [String] })
  preferredTypes?: ResourceType[];

  @ApiProperty({ description: '语言', required: false })
  language?: string;

  @ApiProperty({ description: '推荐数量', required: false })
  count?: number;
}

@ApiTags('Agent')
@Controller('agent')
export class AgentController {
  constructor(
    private readonly pipelineService: AgentPipelineService,
    private readonly conceptAnalyzer: ConceptAnalyzerService,
    private readonly prerequisiteExplorer: PrerequisiteExplorerService,
    private readonly geneticsEnricher: GeneticsEnricherService,
    private readonly visualDesigner: VisualDesignerService,
    private readonly narrativeComposer: NarrativeComposerService,
    private readonly quizGenerator: QuizGeneratorService,
    private readonly webSearchService: WebSearchService,
    private readonly resourceRecommendService: ResourceRecommendService,
  ) {}

  @Post('pipeline')
  @ApiOperation({ summary: '执行六 Agent 流水线' })
  async executePipeline(@Body() dto: PipelineDto) {
    return await this.pipelineService.executePipeline(dto);
  }

  @Post('analyze')
  @ApiOperation({ summary: '分析概念' })
  async analyze(
    @Body('concept') concept: string,
    @Body('userLevel') userLevel?: 'beginner' | 'intermediate' | 'advanced',
  ) {
    return await this.conceptAnalyzer.analyze(concept, userLevel);
  }

  @Post('explore')
  @ApiOperation({ summary: '探索前置知识' })
  async explore(@Body() dto: ExploreDto) {
    const tree = await this.prerequisiteExplorer.explorePrerequisites(
      dto.concept,
      dto.maxDepth || 3
    );
    return {
      tree,
      learningPath: this.prerequisiteExplorer.flattenToLearningPath(tree),
      textRepresentation: this.prerequisiteExplorer.toString(tree),
    };
  }

  @Post('enrich')
  @ApiOperation({ summary: '丰富遗传学知识' })
  async enrich(@Body('concept') concept: string) {
    return await this.geneticsEnricher.enrichConcept(concept);
  }

  @Post('quiz/generate')
  @ApiOperation({ summary: '生成题目' })
  async generateQuiz(@Body() dto: GenerateQuizDto) {
    if (dto.count && dto.count > 1) {
      return await this.quizGenerator.generateQuestions({
        topics: [dto.topic],
        difficulty: dto.difficulty,
        count: dto.count,
        userLevel: dto.userLevel,
      });
    }
    return await this.quizGenerator.generateQuestion({
      topic: dto.topic,
      difficulty: dto.difficulty,
      userLevel: dto.userLevel,
    });
  }

  @Post('quiz/evaluate')
  @ApiOperation({ summary: '评估答案' })
  async evaluateAnswer(@Body() dto: EvaluateAnswerDto) {
    return await this.quizGenerator.evaluateAnswer({
      question: {
        id: 'temp',
        type: 'multiple_choice' as const,
        difficulty: 'medium' as const,
        topic: 'temp',
        content: dto.question,
        correctAnswer: dto.correctAnswer,
        explanation: {} as any,
        tags: [],
      },
      userAnswer: dto.userAnswer,
    });
  }

  @Post('quiz/similar')
  @ApiOperation({ summary: '生成相似题（举一反三）' })
  async generateSimilarQuestions(@Body() dto: SimilarQuestionDto) {
    return await this.quizGenerator.generateSimilarQuestions({
      question: {
        id: 'temp',
        type: 'multiple_choice' as const,
        difficulty: 'medium' as const,
        topic: dto.topic,
        content: dto.question,
        correctAnswer: 'A',
        explanation: {} as any,
        tags: [],
      },
      userAnswer: dto.userAnswer,
      errorType: dto.errorType,
      count: dto.count,
    });
  }

  // ==================== VisualDesigner Routes ====================

  @Post('visualize')
  @ApiOperation({ summary: '设计可视化方案' })
  async designVisualization(@Body() dto: VisualDesignDto) {
    // 获取基础分析
    const conceptAnalysis = await this.conceptAnalyzer.analyze(dto.concept);

    let enrichment, tree;
    if (dto.includeEnrichment) {
      enrichment = await this.geneticsEnricher.enrichConcept(dto.concept);
    }
    if (dto.includePrerequisites) {
      tree = await this.prerequisiteExplorer.explorePrerequisites(dto.concept, 3);
    }

    const visualization = await this.visualDesigner.designVisualization(
      dto.concept,
      conceptAnalysis,
      enrichment,
      tree
    );

    return {
      visualization,
      d3Config: await this.visualDesigner.generateD3Config(visualization),
      graphData: tree ? this.visualDesigner.generateGraphData(tree) : null,
    };
  }

  @Get('visualize/code')
  @ApiOperation({ summary: '生成可视化代码' })
  async generateVisualizationCode(@Query('concept') concept: string) {
    const conceptAnalysis = await this.conceptAnalyzer.analyze(concept);
    const enrichment = await this.geneticsEnricher.enrichConcept(concept);
    const tree = await this.prerequisiteExplorer.explorePrerequisites(concept, 2);

    const visualization = await this.visualDesigner.designVisualization(
      concept,
      conceptAnalysis,
      enrichment,
      tree
    );

    const code = await this.visualDesigner.generateVisualizationCode(visualization, {
      nodes: tree ? this.visualDesigner.generateGraphData(tree).nodes : [],
      edges: tree ? this.visualDesigner.generateGraphData(tree).links : [],
    });

    return { code, visualization };
  }

  // ==================== NarrativeComposer Routes ====================

  @Post('narrative')
  @ApiOperation({ summary: '创建学习叙事' })
  async composeNarrative(@Body() dto: NarrativeDto) {
    const conceptAnalysis = await this.conceptAnalyzer.analyze(dto.concept, dto.userLevel);
    const tree = await this.prerequisiteExplorer.explorePrerequisites(dto.concept, 3);
    const enrichment = await this.geneticsEnricher.enrichConcept(dto.concept);

    const narrative = await this.narrativeComposer.composeNarrative(
      dto.concept,
      conceptAnalysis,
      tree,
      enrichment
    );

    return {
      narrative,
      treeText: this.narrativeComposer.flattenTreeToString(tree),
    };
  }

  @Post('narrative/script')
  @ApiOperation({ summary: '生成详细学习脚本' })
  async generateLearningScript(@Body() dto: NarrativeDto) {
    const conceptAnalysis = await this.conceptAnalyzer.analyze(dto.concept, dto.userLevel);
    const tree = await this.prerequisiteExplorer.explorePrerequisites(dto.concept, 3);
    const enrichment = await this.geneticsEnricher.enrichConcept(dto.concept);

    const narrative = await this.narrativeComposer.composeNarrative(
      dto.concept,
      conceptAnalysis,
      tree,
      enrichment
    );

    const script = await this.narrativeComposer.generateLearningScript(
      narrative,
      dto.concept,
      dto.userLevel
    );

    return { narrative, ...script };
  }

  @Post('narrative/interactive')
  @ApiOperation({ summary: '生成互动式学习流程' })
  async generateInteractiveFlow(@Body() dto: NarrativeDto) {
    const conceptAnalysis = await this.conceptAnalyzer.analyze(dto.concept, dto.userLevel);
    const tree = await this.prerequisiteExplorer.explorePrerequisites(dto.concept, 3);
    const enrichment = await this.geneticsEnricher.enrichConcept(dto.concept);

    const narrative = await this.narrativeComposer.composeNarrative(
      dto.concept,
      conceptAnalysis,
      tree,
      enrichment
    );

    const flow = await this.narrativeComposer.generateInteractiveFlow(narrative);

    return { narrative, flow };
  }

  // ==================== Skills Routes ====================

  @Post('skills/search')
  @ApiOperation({ summary: '联网搜索' })
  async webSearch(@Body() dto: WebSearchDto) {
    return await this.webSearchService.search({
      query: dto.query,
      numResults: dto.numResults || 5,
      language: dto.language || 'zh',
      timeRange: dto.timeRange || 'all',
    });
  }

  @Post('skills/search/concept')
  @ApiOperation({ summary: '搜索概念相关最新资讯' })
  async searchForConcept(@Body('concept') concept: string) {
    return await this.webSearchService.searchForConcept(concept);
  }

  @Post('skills/resources')
  @ApiOperation({ summary: '推荐学习资源' })
  async recommendResources(@Body() dto: ResourceRecommendDto) {
    return await this.resourceRecommendService.recommend({
      concept: dto.concept,
      userLevel: dto.userLevel,
      preferredTypes: dto.preferredTypes,
      language: dto.language || 'zh',
      count: dto.count || 5,
    });
  }

  // ==================== Pipeline Shortcuts ====================

  @Get('quick')
  @ApiOperation({ summary: '快速分析模式' })
  async quickAnalyze(@Query('concept') concept: string) {
    return await this.pipelineService.quickAnalyze(concept);
  }

  @Get('learning-path')
  @ApiOperation({ summary: '生成学习路径' })
  async getLearningPath(
    @Query('concept') concept: string,
    @Query('userLevel') userLevel?: 'beginner' | 'intermediate' | 'advanced',
  ) {
    return await this.pipelineService.generateLearningPath(concept, userLevel);
  }

  @Get('quiz/topic')
  @ApiOperation({ summary: '为主题生成题目' })
  async generateQuizForTopic(
    @Query('topic') topic: string,
    @Query('difficulty') difficulty: 'easy' | 'medium' | 'hard' = 'medium',
    @Query('count') count: number = 5,
    @Query('userLevel') userLevel?: 'beginner' | 'intermediate' | 'advanced',
  ) {
    return await this.pipelineService.generateQuizForTopic({
      topic,
      difficulty,
      count,
      userLevel,
    });
  }
}
