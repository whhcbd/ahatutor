import { Controller, Post, Body, Get, Param, UseGuards, Query, Req, Logger, Optional, Res, Headers, Sse } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsNumber, IsArray, IsBoolean, IsObject } from 'class-validator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AgentPipelineService } from './agent-pipeline.service';
import { ConceptAnalyzerService } from './concept-analyzer.service';
import { PrerequisiteExplorerService } from './prerequisite-explorer.service';
import { GeneticsEnricherService } from './genetics-enricher.service';
import { VisualDesignerService } from './visual-designer.service';
import { QuizGeneratorService } from './quiz-generator.service';
import { WebSearchService } from './skills/web-search.service';
import { ResourceRecommendService } from './skills/resource-recommend.service';
import { VisualizationGeneratorService } from './skills/visualization-generator.service';
import { GeneticsVisualizationService } from './skills/genetics-visualization.service';
import { InteractiveControlService } from './skills/interactive-control.service';
import { AnswerEvaluatorService } from './skills/answer-evaluator.service';
import { VisualizationRAGService } from './visualization-rag.service';
import { StreamResponseService } from './stream-response.service';
import { ComponentCatalogService } from './component-catalog.service';
import { SixAgentInput, Difficulty, QuestionType, QuizQuestion, Option, QuizExplanation, ResourceType, UserAction } from '@ahatutor/shared';

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
  @ApiProperty({ description: '知识点列表' })
  @IsArray()
  @IsString({ each: true })
  topics!: string[];

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
    @Optional() private readonly prerequisiteExplorer: PrerequisiteExplorerService,
    @Optional() private readonly geneticsEnricher: GeneticsEnricherService,
    @Optional() private readonly visualDesigner: VisualDesignerService,
    @Optional() private readonly quizGenerator: QuizGeneratorService,
    @Optional() private readonly webSearchService: WebSearchService,
    @Optional() private readonly resourceRecommendService: ResourceRecommendService,
    @Optional() private readonly visualizationGenerator: VisualizationGeneratorService,
    @Optional() private readonly geneticsVisualization: GeneticsVisualizationService,
    @Optional() private readonly interactiveControl: InteractiveControlService,
    @Optional() private readonly answerEvaluator: AnswerEvaluatorService,
    @Optional() private readonly visualizationRAG: VisualizationRAGService,
    @Optional() private readonly streamResponseService: StreamResponseService,
    private readonly componentCatalogService: ComponentCatalogService,
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
    if (!this.prerequisiteExplorer) {
      return {
        success: false,
        message: 'Prerequisite Explorer service is not available',
      };
    }
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
    if (!this.geneticsEnricher) {
      return { message: 'GeneticsEnricher service is not available' };
    }
    return await this.geneticsEnricher.enrichConcept(dto.concept);
  }

  @Post('quiz/generate')
  @ApiOperation({ summary: '生成题目' })
  async generateQuiz(@Body() dto: GenerateQuizDto) {
    if (!this.quizGenerator) {
      return {
        success: false,
        message: 'Quiz Generator service is not available',
      };
    }
    if (dto.count && dto.count > 1) {
      return await this.quizGenerator.generateQuestions({
        topics: dto.topics,
        difficulty: dto.difficulty,
        count: dto.count,
        userLevel: dto.userLevel,
      });
    }
    return await this.quizGenerator.generateQuestion({
      topic: dto.topics[0],
      difficulty: dto.difficulty,
      userLevel: dto.userLevel,
    });
  }

  @Post('quiz/evaluate')
  @ApiOperation({ summary: '评估答案（旧版，保持兼容）' })
  async evaluateAnswer(@Body() dto: EvaluateAnswerDto) {
    if (!this.quizGenerator) {
      return {
        success: false,
        message: 'Quiz Generator service is not available',
      };
    }
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
    if (!this.answerEvaluator) {
      return {
        success: false,
        message: 'Answer Evaluator service is not available',
      };
    }
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
    if (!this.answerEvaluator) {
      return {
        success: false,
        message: 'Answer Evaluator service is not available',
      };
    }
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
    if (!this.answerEvaluator) {
      return {
        success: false,
        message: 'Answer Evaluator service is not available',
      };
    }
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
    if (!this.quizGenerator) {
      return {
        success: false,
        message: 'Quiz Generator service is not available',
      };
    }
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
    if (dto.includeEnrichment && this.geneticsEnricher) {
      enrichment = await this.geneticsEnricher.enrichConcept(dto.concept);
    }
    if (dto.includePrerequisites && this.prerequisiteExplorer) {
      tree = await this.prerequisiteExplorer.explorePrerequisites(dto.concept, 3);
    }

    const visualization = await this.visualDesigner?.designVisualization(
      dto.concept,
      conceptAnalysis,
      enrichment,
      tree
    );

    if (!visualization || !this.visualDesigner) {
      return {
        visualization: null,
        d3Config: null,
        graphData: null,
      };
    }

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
    const enrichment = this.geneticsEnricher ? await this.geneticsEnricher.enrichConcept(concept) : undefined;
    const tree = this.prerequisiteExplorer ? await this.prerequisiteExplorer.explorePrerequisites(concept, 2) : undefined;

    if (!this.visualDesigner) {
      return {
        visualization: null,
        d3Config: null,
        graphData: { nodes: [], links: [] },
      };
    }

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

  // ==================== Skills Routes ====================

  @Post('skills/search')
  @ApiOperation({ summary: '联网搜索' })
  async webSearch(@Body() dto: WebSearchDto) {
    if (!this.webSearchService) {
      return { message: 'WebSearch service is not available' };
    }
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
    if (!this.webSearchService) {
      return { message: 'WebSearch service is not available' };
    }
    return await this.webSearchService.searchForConcept(concept);
  }

  @Post('skills/resources')
  @ApiOperation({ summary: '推荐学习资源' })
  async recommendResources(@Body() dto: ResourceRecommendDto) {
    if (!this.resourceRecommendService) {
      return { message: 'ResourceRecommend service is not available' };
    }
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
    if (!this.visualDesigner) {
      return { answer: 'VisualDesigner service is not available', context: null };
    }
    return await this.visualDesigner.answerQuestion(
      dto.concept,
      dto.question,
      dto.userLevel || 'intermediate',
      dto.conversationHistory || []
    );
  }

  @Sse('visualize/ask/stream')
  @ApiOperation({ summary: '基于可视化的流式问答（SSE）' })
  streamAskVisualization(
    @Query('concept') concept: string,
    @Query('question') question: string,
    @Query('userLevel') userLevel?: 'beginner' | 'intermediate' | 'advanced',
  ): Observable<any> {
    if (!this.visualDesigner || !this.streamResponseService) {
      throw new Error('Required services are not available');
    }

    const stream = this.streamResponseService.createStreamResponse(
      () => this.visualDesigner.answerQuestion(
        concept,
        question,
        userLevel || 'intermediate',
        []
      ),
      {
        chunkSize: 50,
        enableSkeleton: true,
        enableProgressiveData: true
      }
    );

    return stream.pipe(
      map(chunk => ({ data: chunk }))
    );
  }

  @Post('action')
  @ApiOperation({ summary: '处理A2UI组件的用户操作' })
  async handleUserAction(@Body() action: UserAction) {
    this.logger.log(`Received user action: ${action.actionType} on component ${action.componentId}`);

    try {
      const validation = this.componentCatalogService.validateUserAction(action);

      if (!validation.valid) {
        this.logger.warn(`User action validation failed: ${validation.errors.join(', ')}`);
        return {
          success: false,
          error: 'Validation failed',
          details: validation.errors,
          message: 'Action validation failed'
        };
      }

      if (this.componentCatalogService.checkAuthRequirement(action.componentId)) {
        this.logger.warn(`Component ${action.componentId} requires authentication`);
        return {
          success: false,
          error: 'Authentication required',
          message: `Component ${action.componentId} requires authentication`
        };
      }

      const result = await this.processUserAction(action);
      return {
        success: true,
        result,
        message: 'Action processed successfully'
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to process user action: ${errorMessage}`);
      return {
        success: false,
        error: errorMessage,
        message: 'Failed to process action'
      };
    }
  }

  @Get('visualize/concepts')
  @ApiOperation({ summary: '获取所有硬编码可视化概念' })
  async getHardcodedConcepts() {
    if (!this.visualDesigner) {
      return { concepts: [] };
    }
    return await this.visualDesigner.getHardcodedConcepts();
  }

  private async processUserAction(action: UserAction) {
    this.logger.log(`Processing user action: ${action.actionType} for component ${action.componentId}`);

    switch (action.actionType) {
      case 'click':
        return this.handleClickAction(action);
      case 'change':
        return this.handleChangeAction(action);
      case 'submit':
        return this.handleSubmitAction(action);
      case 'focus':
      case 'blur':
      case 'input':
        return this.handleInputAction(action);
      default:
        this.logger.warn(`Unknown action type: ${action.actionType}`);
        return { processed: false, message: 'Unknown action type' };
    }
  }

  private async handleClickAction(action: UserAction) {
    const { componentId, payload } = action;
    this.logger.log(`Handling click action on ${componentId}`, payload);

    return {
      processed: true,
      componentId,
      actionType: 'click',
      response: {
        type: 'update',
        componentId,
        timestamp: Date.now()
      }
    };
  }

  private async handleChangeAction(action: UserAction) {
    const { componentId, payload } = action;
    this.logger.log(`Handling change action on ${componentId}`, payload);

    return {
      processed: true,
      componentId,
      actionType: 'change',
      response: {
        type: 'data_update',
        componentId,
        updatedData: payload,
        timestamp: Date.now()
      }
    };
  }

  private async handleSubmitAction(action: UserAction) {
    const { componentId, payload } = action;
    this.logger.log(`Handling submit action on ${componentId}`, payload);

    return {
      processed: true,
      componentId,
      actionType: 'submit',
      response: {
        type: 'confirmation',
        componentId,
        message: '操作已提交',
        timestamp: Date.now()
      }
    };
  }

  private async handleInputAction(action: UserAction) {
    const { componentId, payload, actionType } = action;
    this.logger.log(`Handling ${actionType} action on ${componentId}`, payload);

    return {
      processed: true,
      componentId,
      actionType,
      response: {
        type: 'input_update',
        componentId,
        eventType: actionType,
        timestamp: Date.now()
      }
    };
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
    if (!this.visualizationGenerator) {
      return {
        success: false,
        message: 'Visualization Generator service is not available',
      };
    }
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
    if (!this.geneticsVisualization) {
      return {
        success: false,
        message: 'Genetics Visualization service is not available',
      };
    }
    return await this.geneticsVisualization.generate(dto as any);
  }

  @Post('skills/visualization/control')
  @ApiOperation({ summary: '控制可视化交互' })
  async controlVisualization(@Body() dto: InteractiveControlDto) {
    if (!this.interactiveControl) {
      return {
        success: false,
        message: 'Interactive Control service is not available',
      };
    }
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

  // ==================== Visualization RAG Routes ====================

  @Get('visualization-rag/status')
  @ApiOperation({ summary: '获取可视化RAG索引状态' })
  async getVisualizationRAGStatus() {
    if (!this.visualizationRAG) {
      return { status: 'disabled', message: 'Visualization RAG service is not available' };
    }
    return await this.visualizationRAG.getIndexStatus();
  }

  @Post('visualization-rag/search')
  @ApiOperation({ summary: '根据问题检索相关可视化' })
  async searchVisualization(@Body() body: { question: string; threshold?: number; topK?: number }) {
    if (!this.visualizationRAG) {
      return { message: 'Visualization RAG service is not available' };
    }
    return await this.visualizationRAG.retrieveByQuestion(
      body.question,
      body.threshold || 0.7,
      body.topK || 3
    );
  }

  @Post('visualization-rag/reindex')
  @ApiOperation({ summary: '重新初始化可视化RAG索引' })
  async reindexVisualizationRAG() {
    if (!this.visualizationRAG) {
      return { message: 'Visualization RAG service is not available' };
    }
    await this.visualizationRAG.reinitializeIndex();
    return { message: 'Visualization RAG index reinitialized' };
  }
}
