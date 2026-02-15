import { Controller, Post, Body, Get, Query, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsNumber, IsArray, IsBoolean, IsObject } from 'class-validator';
import { AgentPipelineService } from './agent-pipeline.service';
import { ConceptAnalyzerService } from './concept-analyzer.service';
import { PrerequisiteExplorerService } from './prerequisite-explorer.service';
import { GeneticsEnricherService } from './genetics-enricher.service';
import { VisualDesignerService } from './visual-designer.service';
import { NarrativeComposerService } from './narrative-composer.service';
import { QuizGeneratorService } from './quiz-generator.service';
import { WebSearchService } from './skills/web-search.service';
import { ResourceRecommendService } from './skills/resource-recommend.service';
import { VisualizationGeneratorService } from './skills/visualization-generator.service';
import { GeneticsVisualizationService } from './skills/genetics-visualization.service';
import { InteractiveControlService } from './skills/interactive-control.service';
import { AnswerEvaluatorService } from './skills/answer-evaluator.service';
import { SixAgentInput } from '@shared/types/agent.types';
import { Difficulty, QuestionType, QuizQuestion, Option, QuizExplanation } from '@shared/types/genetics.types';
import { ResourceType } from '@shared/types/skill.types';

class QuizQuestionDto {
  @ApiProperty({ description: '题目ID' })
  @IsString()
  id!: string;

  @ApiProperty({ description: '题目类型' })
  @IsString()
  type!: string;

  @ApiProperty({ description: '题目难度' })
  @IsString()
  difficulty!: string;

  @ApiProperty({ description: '知识点' })
  @IsString()
  topic!: string;

  @ApiProperty({ description: '题目内容' })
  @IsString()
  content!: string;

  @ApiProperty({ description: '选择题选项', required: false })
  @IsOptional()
  @IsArray()
  options?: Option[];

  @ApiProperty({ description: '正确答案' })
  @IsString()
  correctAnswer!: string;

  @ApiProperty({ description: '分级解析' })
  @IsObject()
  explanation!: QuizExplanation;

  @ApiProperty({ description: '标签' })
  @IsArray()
  @IsString({ each: true })
  tags!: string[];
}

class PipelineDto implements SixAgentInput {
  @ApiProperty({ description: '目标概念' })
  @IsString()
  concept!: string;

  @ApiProperty({ description: '用户水平', enum: ['beginner', 'intermediate', 'advanced'], required: false })
  @IsOptional()
  @IsEnum(['beginner', 'intermediate', 'advanced'] as const)
  userLevel?: 'beginner' | 'intermediate' | 'advanced';

  @ApiProperty({ description: '学习目标', required: false })
  @IsOptional()
  @IsString()
  learningGoal?: string;

  @ApiProperty({ description: '关注领域', required: false, type: [String] })
  @IsOptional()
  focusAreas?: string[];
}

class ExploreDto {
  @ApiProperty({ description: '目标概念' })
  @IsString()
  concept!: string;

  @ApiProperty({ description: '递归深度', required: false })
  @IsOptional()
  @IsNumber()
  maxDepth?: number;
}

class AnalyzeDto {
  @ApiProperty({ description: '目标概念' })
  @IsString()
  concept!: string;

  @ApiProperty({ description: '用户水平', enum: ['beginner', 'intermediate', 'advanced'], required: false })
  @IsOptional()
  @IsEnum(['beginner', 'intermediate', 'advanced'] as const)
  userLevel?: 'beginner' | 'intermediate' | 'advanced';
}

class EnrichDto {
  @ApiProperty({ description: '目标概念' })
  @IsString()
  concept!: string;
}

class GenerateQuizDto {
  @ApiProperty({ description: '知识点' })
  @IsString()
  topic!: string;

  @ApiProperty({ description: '难度', enum: ['easy', 'medium', 'hard'] })
  @IsEnum(Difficulty)
  difficulty!: Difficulty;

  @ApiProperty({ description: '题目数量', required: false })
  @IsOptional()
  @IsNumber()
  count?: number;

  @ApiProperty({ description: '用户水平', enum: ['beginner', 'intermediate', 'advanced'], required: false })
  @IsOptional()
  @IsEnum(['beginner', 'intermediate', 'advanced'] as const)
  userLevel?: 'beginner' | 'intermediate' | 'advanced';
}

class EvaluateAnswerDto {
  @ApiProperty({ description: '题目内容' })
  @IsString()
  question!: string;

  @ApiProperty({ description: '正确答案' })
  @IsString()
  correctAnswer!: string;

  @ApiProperty({ description: '用户答案' })
  @IsString()
  userAnswer!: string;
}

class EvaluateAnswerV2Dto {
  @ApiProperty({ description: '完整题目对象' })
  @IsObject()
  question!: QuizQuestionDto;

  @ApiProperty({ description: '用户答案' })
  @IsString()
  userAnswer!: string;

  @ApiProperty({ description: '解析等级', required: false })
  @IsOptional()
  @IsNumber()
  explanationLevel?: number;
}

class SelfAssessmentDto {
  @ApiProperty({ description: '完整题目对象' })
  question!: QuizQuestion;

  @ApiProperty({ description: '用户答案' })
  @IsString()
  userAnswer!: string;

  @ApiProperty({ description: '错误类型', enum: ['low_level', 'high_level'] })
  @IsEnum(['low_level', 'high_level'] as const)
  errorType!: 'low_level' | 'high_level';

  @ApiProperty({ description: '用户备注', required: false })
  @IsOptional()
  @IsString()
  userNote?: string;
}

class GetExplanationDto {
  @ApiProperty({ description: '完整题目对象' })
  question!: QuizQuestion;

  @ApiProperty({ description: '用户答案' })
  @IsString()
  userAnswer!: string;

  @ApiProperty({ description: '解析等级' })
  @IsNumber()
  level!: number;

  @ApiProperty({ description: '前一等级', required: false })
  @IsOptional()
  @IsNumber()
  previousLevel?: number;
}

class SimilarQuestionDto {
  @ApiProperty({ description: '原题内容' })
  @IsString()
  question!: string;

  @ApiProperty({ description: '考点' })
  @IsString()
  topic!: string;

  @ApiProperty({ description: '用户错误答案' })
  @IsString()
  userAnswer!: string;

  @ApiProperty({ description: '错误类型', enum: ['low_level', 'high_level'] })
  @IsEnum(['low_level', 'high_level'] as const)
  errorType!: 'low_level' | 'high_level';

  @ApiProperty({ description: '生成数量', required: false })
  @IsOptional()
  @IsNumber()
  count?: number;
}

class VisualDesignDto {
  @ApiProperty({ description: '目标概念' })
  @IsString()
  concept!: string;

  @ApiProperty({ description: '包含遗传学丰富内容', required: false })
  @IsOptional()
  includeEnrichment?: boolean;

  @ApiProperty({ description: '包含前置知识树', required: false })
  @IsOptional()
  includePrerequisites?: boolean;
}

class NarrativeDto {
  @ApiProperty({ description: '目标概念' })
  @IsString()
  concept!: string;

  @ApiProperty({ description: '用户水平', enum: ['beginner', 'intermediate', 'advanced'], required: false })
  @IsOptional()
  @IsEnum(['beginner', 'intermediate', 'advanced'] as const)
  userLevel?: 'beginner' | 'intermediate' | 'advanced';
}

class WebSearchDto {
  @ApiProperty({ description: '搜索查询' })
  @IsString()
  query!: string;

  @ApiProperty({ description: '结果数量', required: false })
  @IsOptional()
  @IsNumber()
  numResults?: number;

  @ApiProperty({ description: '语言', required: false })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiProperty({ description: '时间范围', enum: ['day', 'week', 'month', 'year', 'all'], required: false })
  @IsOptional()
  @IsEnum(['day', 'week', 'month', 'year', 'all'] as const)
  timeRange?: 'day' | 'week' | 'month' | 'year' | 'all';
}

class ResourceRecommendDto {
  @ApiProperty({ description: '目标概念' })
  @IsString()
  concept!: string;

  @ApiProperty({ description: '用户水平', enum: ['beginner', 'intermediate', 'advanced'], required: false })
  @IsOptional()
  @IsEnum(['beginner', 'intermediate', 'advanced'] as const)
  userLevel?: 'beginner' | 'intermediate' | 'advanced';

  @ApiProperty({ description: '资源类型', enum: ['video', 'article', 'paper', 'book', 'course', 'interactive'], required: false, type: [String] })
  @IsOptional()
  preferredTypes?: ResourceType[];

  @ApiProperty({ description: '语言', required: false })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiProperty({ description: '推荐数量', required: false })
  @IsOptional()
  @IsNumber()
  count?: number;
}

class AskQuestionDto {
  @ApiProperty({ description: '当前概念' })
  @IsString()
  concept!: string;

  @ApiProperty({ description: '用户问题' })
  @IsString()
  question!: string;

  @ApiProperty({ description: '用户水平', enum: ['beginner', 'intermediate', 'advanced'], required: false })
  @IsOptional()
  @IsEnum(['beginner', 'intermediate', 'advanced'] as const)
  userLevel?: 'beginner' | 'intermediate' | 'advanced';

  @ApiProperty({ description: '对话历史', required: false, type: [Object] })
  @IsOptional()
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

class VisualizationGenerateDto {
  @ApiProperty({ description: '目标概念' })
  @IsString()
  concept!: string;

  @ApiProperty({ description: '用户水平', enum: ['beginner', 'intermediate', 'advanced'], required: false })
  @IsOptional()
  @IsEnum(['beginner', 'intermediate', 'advanced'] as const)
  difficulty?: 'beginner' | 'intermediate' | 'advanced';

  @ApiProperty({ description: '关注领域', required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  focusAreas?: string[];

  @ApiProperty({ description: '首选可视化类型', required: false, type: [String] })
  @IsOptional()
  @IsArray()
  preferredTypes?: string[];

  @ApiProperty({ description: '是否交互', required: false })
  @IsOptional()
  @IsBoolean()
  interactive?: boolean;

  @ApiProperty({ description: '是否动画', required: false })
  @IsOptional()
  @IsBoolean()
  animation?: boolean;
}

class GeneticsVisualizationDto {
  @ApiProperty({ description: '目标概念' })
  @IsString()
  concept!: string;

  @ApiProperty({ description: '可视化类型' })
  @IsString()
  visualizationType!: string;

  @ApiProperty({ description: '参数', required: false })
  @IsOptional()
  parameters?: Record<string, unknown>;

  @ApiProperty({ description: '场景', required: false })
  @IsOptional()
  scenario?: {
    parentalCross?: {
      male: { genotype: string; phenotype: string };
      female: { genotype: string; phenotype: string };
    };
    targetTrait?: string;
    inheritancePattern?: string;
  };
}

class InteractiveControlDto {
  @ApiProperty({ description: '可视化ID' })
  @IsString()
  visualizationId!: string;

  @ApiProperty({ description: '控制类型', enum: ['play', 'pause', 'step_forward', 'step_backward', 'reset', 'update_parameter'] })
  @IsEnum(['play', 'pause', 'step_forward', 'step_backward', 'reset', 'update_parameter'] as const)
  controlType!: 'play' | 'pause' | 'step_forward' | 'step_backward' | 'reset' | 'update_parameter';

  @ApiProperty({ description: '参数更新', required: false })
  @IsOptional()
  parameterUpdates?: Record<string, number | string | boolean>;

  @ApiProperty({ description: '当前步骤', required: false })
  @IsOptional()
  @IsNumber()
  currentStep?: number;
}

class VectorRetrievalDto {
  @ApiProperty({ description: '查询内容' })
  @IsString()
  query!: string;

  @ApiProperty({ description: '返回数量', required: false })
  @IsOptional()
  @IsNumber()
  topK?: number;

  @ApiProperty({ description: '过滤条件', required: false })
  @IsOptional()
  filters?: {
    subject?: string;
    topics?: string[];
    difficulty?: string;
    documentId?: string;
  };

  @ApiProperty({ description: '是否重排', required: false })
  @IsOptional()
  @IsBoolean()
  rerank?: boolean;
}

class ContextRetrievalDto {
  @ApiProperty({ description: '当前查询' })
  @IsString()
  currentQuery!: string;

  @ApiProperty({ description: '对话历史', required: false })
  @IsOptional()
  conversationHistory?: Array<{ role: string; content: string }>;

  @ApiProperty({ description: '返回数量', required: false })
  @IsOptional()
  @IsNumber()
  topK?: number;

  @ApiProperty({ description: '上下文窗口', required: false })
  @IsOptional()
  @IsNumber()
  contextWindow?: number;
}

class StreamingAnswerDto {
  @ApiProperty({ description: '查询内容' })
  @IsString()
  query!: string;

  @ApiProperty({ description: '检索上下文', required: false })
  @IsOptional()
  context?: Array<{
    chunkId: string;
    documentId: string;
    content: string;
    score: number;
    metadata?: unknown;
  }>;

  @ApiProperty({ description: '对话历史', required: false })
  @IsOptional()
  conversationHistory?: Array<{ role: string; content: string }>;

  @ApiProperty({ description: '模式', enum: ['answer', 'explanation', 'step_by_step'], required: false })
  @IsOptional()
  @IsEnum(['answer', 'explanation', 'step_by_step'] as const)
  mode?: 'answer' | 'explanation' | 'step_by_step';

  @ApiProperty({ description: '风格', enum: ['concise', 'detailed', 'tutorial'], required: false })
  @IsOptional()
  @IsEnum(['concise', 'detailed', 'tutorial'] as const)
  style?: 'concise' | 'detailed' | 'tutorial';
}

@ApiTags('Agent')
@Controller('agent')
export class AgentController {
  private readonly logger = new Logger(AgentController.name);

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
    private readonly visualizationGenerator: VisualizationGeneratorService,
    private readonly geneticsVisualization: GeneticsVisualizationService,
    private readonly interactiveControl: InteractiveControlService,
    private readonly answerEvaluator: AnswerEvaluatorService,
  ) {}

  @Post('pipeline')
  @ApiOperation({ summary: '执行六 Agent 流水线' })
  async executePipeline(@Body() dto: PipelineDto) {
    return await this.pipelineService.executePipeline(dto);
  }

  @Post('analyze')
  @ApiOperation({ summary: '分析概念' })
  async analyze(@Body() dto: AnalyzeDto) {
    return await this.conceptAnalyzer.analyze(dto.concept, dto.userLevel);
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
  async enrich(@Body() dto: EnrichDto) {
    return await this.geneticsEnricher.enrichConcept(dto.concept);
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
  @ApiOperation({ summary: '评估答案（旧版，保持兼容）' })
  async evaluateAnswer(@Body() dto: EvaluateAnswerDto) {
    return await this.quizGenerator.evaluateAnswer({
      question: {
        id: 'temp',
        type: QuestionType.MULTIPLE_CHOICE,
        difficulty: Difficulty.MEDIUM,
        topic: 'temp',
        content: dto.question,
        correctAnswer: dto.correctAnswer,
        explanation: {
          level1: '',
          level2: '',
          level3: '',
          level4: '',
          level5: '',
        },
        tags: [],
      },
      userAnswer: dto.userAnswer,
    });
  }

  @Post('quiz/evaluate/v2')
  @ApiOperation({ summary: '评估答案（新版，支持分等级解析）' })
  async evaluateAnswerV2(@Body() dto: EvaluateAnswerV2Dto) {
    this.logger.log(`Received evaluate request - Question ID: ${dto.question.id}, Type: ${dto.question.type}, Difficulty: ${dto.question.difficulty}`);
    this.logger.log(`Question object: ${JSON.stringify(dto.question)}`);
    
    const quizQuestion: QuizQuestion = {
      ...dto.question,
      type: dto.question.type as QuestionType,
      difficulty: dto.question.difficulty as Difficulty,
    };
    
    return await this.answerEvaluator.evaluateAnswer({
      question: quizQuestion,
      userAnswer: dto.userAnswer,
      explanationLevel: dto.explanationLevel || 1,
    });
  }

  @Post('quiz/self-assess')
  @ApiOperation({ summary: '用户自评处理' })
  async processSelfAssessment(@Body() dto: SelfAssessmentDto) {
    return await this.answerEvaluator.processSelfAssessment({
      question: dto.question,
      userAnswer: dto.userAnswer,
      errorType: dto.errorType,
      userNote: dto.userNote,
    });
  }

  @Post('quiz/explanation')
  @ApiOperation({ summary: '获取分等级解析' })
  async getExplanation(@Body() dto: GetExplanationDto) {
    return await this.answerEvaluator.getExplanation({
      question: dto.question,
      userAnswer: dto.userAnswer,
      level: dto.level,
      previousLevel: dto.previousLevel,
    });
  }

  @Post('quiz/similar')
  @ApiOperation({ summary: '生成相似题（举一反三）' })
  async generateSimilarQuestions(@Body() dto: SimilarQuestionDto) {
    return await this.quizGenerator.generateSimilarQuestions({
      question: {
        id: 'temp',
        type: QuestionType.MULTIPLE_CHOICE,
        difficulty: Difficulty.MEDIUM,
        topic: dto.topic,
        content: dto.question,
        correctAnswer: 'A',
        explanation: {
          level1: '',
          level2: '',
          level3: '',
          level4: '',
          level5: '',
        },
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
  @ApiOperation({ summary: '生成可视化配置' })
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

    const d3Config = await this.visualDesigner.generateD3Config(visualization);
    const graphData = tree ? this.visualDesigner.generateGraphData(tree) : { nodes: [], links: [] };

    return {
      visualization,
      d3Config,
      graphData,
    };
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

  // ==================== Question & Answer Routes ====================

  @Post('visualize/ask')
  @ApiOperation({ summary: '基于可视化回答用户问题' })
  async askVisualizationQuestion(@Body() dto: AskQuestionDto) {
    return await this.visualDesigner.answerQuestion(
      dto.concept,
      dto.question,
      dto.userLevel || 'intermediate',
      dto.conversationHistory || []
    );
  }

  @Get('visualize/concepts')
  @ApiOperation({ summary: '获取所有可用的硬编码概念列表' })
  async getHardcodedConcepts() {
    return await this.visualDesigner.getHardcodedConcepts();
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
    const difficultyMap: Record<string, Difficulty> = {
      easy: Difficulty.EASY,
      medium: Difficulty.MEDIUM,
      hard: Difficulty.HARD,
    };
    return await this.pipelineService.generateQuizForTopic({
      topic,
      difficulty: difficultyMap[difficulty],
      count,
      userLevel,
    });
  }

  // ==================== 可视化 Skills Routes ====================

  @Post('skills/visualization/generate')
  @ApiOperation({ summary: '生成可视化配置' })
  async generateVisualization(@Body() dto: VisualizationGenerateDto) {
    return await this.visualizationGenerator.generate({
      concept: dto.concept,
      context: {
        difficulty: dto.difficulty,
        focusAreas: dto.focusAreas,
      },
      preferences: {
        preferredTypes: dto.preferredTypes as any,
        interactive: dto.interactive,
        animation: dto.animation,
      },
    });
  }

  @Post('skills/visualization/genetics')
  @ApiOperation({ summary: '生成遗传学专用可视化' })
  async generateGeneticsVisualization(@Body() dto: GeneticsVisualizationDto) {
    return await this.geneticsVisualization.generate(dto as any);
  }

  @Post('skills/visualization/control')
  @ApiOperation({ summary: '控制可视化交互' })
  async controlVisualization(@Body() dto: InteractiveControlDto) {
    return await this.interactiveControl.control(dto as any);
  }

  // ==================== RAG Skills Routes ====================

  @Post('skills/rag/retrieve')
  @ApiOperation({ summary: '向量检索' })
  async vectorRetrieve(@Body() dto: VectorRetrievalDto) {
    return await this.pipelineService.retrieveWithContext({
      query: dto.query,
      topK: dto.topK,
      filters: dto.filters,
      rerank: dto.rerank,
    });
  }

  @Post('skills/rag/context')
  @ApiOperation({ summary: '上下文检索（多轮对话）' })
  async contextRetrieve(@Body() dto: ContextRetrievalDto) {
    return await this.pipelineService.retrieveWithConversation({
      currentQuery: dto.currentQuery,
      conversationHistory: dto.conversationHistory || [],
      topK: dto.topK,
      contextWindow: dto.contextWindow,
    });
  }

  @Post('skills/rag/stream')
  @ApiOperation({ summary: '流式答案生成' })
  async streamingAnswer(@Body() dto: StreamingAnswerDto) {
    return await this.pipelineService.generateStreamingAnswer({
      query: dto.query,
      context: (dto.context || []) as any,
      conversationHistory: dto.conversationHistory,
      mode: dto.mode,
      style: dto.style,
    });
  }
}
