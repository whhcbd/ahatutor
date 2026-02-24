import { Injectable, Logger, Optional } from '@nestjs/common';
import { LLMService } from '../llm/llm.service';
import { VisualizationRAGService } from './visualization-rag.service';
import { PathFinderService } from '../knowledge-graph/services/path-finder.service';
import { VectorRetrievalService } from '../rag/services/vector-retrieval.service';
import { RetrievalResult } from '@shared/types/skill.types';
import { VisualizationSuggestion, ConceptAnalysis, GeneticsEnrichment, PrerequisiteNode, PunnettSquareData, InheritancePathData, ProbabilityDistributionData, PedigreeChartData, UnderstandingInsight, VisualizationAnswerResponse } from '@ahatutor/shared';
import {
  getHardcodedVisualization,
  getHardcodedConceptList,
} from './data/hardcoded-visualizations.data';
import { DynamicVizGeneratorService } from './dynamic-viz-generator.service';
import { A2UIAdapterService } from './a2ui-adapter.service';
import type { A2UIPayload } from '@shared/types/a2ui.types';
import { TemplateMatcherService } from './template-matcher.service';
import { buildA2UIPayload } from './data/a2ui-templates.data';

/**
 * Agent 4: VisualDesigner
 * "如何展示这个概念？"
 *
 * 职责：设计最佳的可视化方案，并生成真正的语义化可视化数据
 * - 确定可视化类型（Punnett方格/遗传路径/概率分布/知识图谱等）
 * - 生成具体的可视化数据结构
 * - 设计颜色方案和交互逻辑
 * - 生成理解提示（帮助用户从可视化中学习）
 */

interface VisualizationDesignResponse {
  title: string;
  description: string;
  elements: string[];
  colors?: Record<string, string>;
  layout?: 'force' | 'hierarchical' | 'circular' | 'grid';
  interactions?: Array<'click' | 'hover' | 'zoom' | 'drag' | 'select'>;
  annotations?: string[];
  animationConfig?: {
    duration: number;
    easing: string;
    autoplay: boolean;
  };
}

// LLM 生成可视化数据的响应结构
interface PunnettSquareResponse {
  maleGametes: string[];
  femaleGametes: string[];
  parentalCross: {
    male: { genotype: string; phenotype: string };
    female: { genotype: string; phenotype: string };
  };
  offspring: Array<{
    genotype: string;
    phenotype: string;
    probability: number;
    sex?: 'male' | 'female';
  }>;
  description?: string;
}

interface InheritancePathResponse {
  generations: Array<{
    generation: number;
    individuals: Array<{
      id: string;
      sex: 'male' | 'female';
      genotype: string;
      phenotype: string;
      affected: boolean;
      carrier?: boolean;
      parents?: string[];
    }>;
  }>;
  inheritance: {
    pattern: string;
    chromosome: string;
    gene: string;
  };
  explanation: string;
}

interface ProbabilityDistributionResponse {
  categories: string[];
  values: number[];
  colors?: string[];
  total?: string;
  formula?: string;
}

interface UnderstandingInsightResponse {
  keyPoint: string;
  visualConnection: string;
  commonMistake: string;
  checkQuestion: string;
}

@Injectable()
export class VisualDesignerService {
  private readonly logger = new Logger(VisualDesignerService.name);

  // 遗传学概念到可视化类型的映射
  private readonly conceptToVizType: Record<string, {
    type: VisualizationSuggestion['type'];
    priority: number;
  }> = {
    '伴性遗传': { type: 'inheritance_path', priority: 10 },
    '性连锁遗传': { type: 'inheritance_path', priority: 10 },
    'x连锁遗传': { type: 'inheritance_path', priority: 10 },
    'y连锁遗传': { type: 'inheritance_path', priority: 10 },
    '孟德尔第一定律': { type: 'punnett_square', priority: 10 },
    '分离定律': { type: 'punnett_square', priority: 10 },
    '孟德尔第二定律': { type: 'punnett_square', priority: 10 },
    '自由组合定律': { type: 'punnett_square', priority: 10 },
    '杂交': { type: 'punnett_square', priority: 9 },
    '基因型': { type: 'punnett_square', priority: 7 },
    '概率': { type: 'probability_distribution', priority: 8 },
    '分布': { type: 'probability_distribution', priority: 8 },
  };

  constructor(
    private readonly llmService: LLMService,
    @Optional() private readonly visualizationRAG: VisualizationRAGService,
    @Optional() private readonly pathFinder: PathFinderService,
    @Optional() private readonly vectorRetrieval: VectorRetrievalService,
    @Optional() private readonly dynamicVizGenerator: DynamicVizGeneratorService,
    @Optional() private readonly a2uiAdapter: A2UIAdapterService,
    @Optional() private readonly templateMatcher: TemplateMatcherService,
  ) {}

  /**
   * 设计可视化方案（主入口）
   */
  async designVisualization(
    concept: string,
    conceptAnalysis: ConceptAnalysis,
    geneticsEnrichment?: GeneticsEnrichment,
    prerequisiteTree?: PrerequisiteNode,
  ): Promise<VisualizationSuggestion> {
    this.logger.log(`Designing visualization for: ${concept}`);

    // 硬编码检查 - 用于概念可视化功能
    const hardcodedViz = getHardcodedVisualization(concept);
    if (hardcodedViz) {
      this.logger.log(`Using hardcoded visualization for: ${concept}`);
      const insights = await this.generateUnderstandingInsights(
        concept,
        hardcodedViz.type,
        hardcodedViz.data,
        prerequisiteTree,
      );
      return {
        ...hardcodedViz,
        insights,
      };
    }

    let ragKnowledgePoints: Record<string, any> = {};

    if (this.vectorRetrieval) {
      try {
        const retrievalResult = await this.vectorRetrieval.retrieve({
          query: concept,
          topK: 5
        });

        if (retrievalResult.data?.results && retrievalResult.data.results.length > 0) {
          ragKnowledgePoints = {
            content: retrievalResult.data.results.map(r => r.content).join('\n\n'),
            metadata: retrievalResult.data.results.map(r => r.metadata)
          };
          this.logger.log(`Retrieved ${retrievalResult.data.results.length} relevant chunks from RAG for knowledge points`);
        }
      } catch (ragError) {
        this.logger.warn('Failed to retrieve knowledge points from RAG:', ragError);
      }
    }

    // 使用AI生成可视化
    // 1. 确定可视化类型
    const vizType = this.determineVisualizationType(concept, conceptAnalysis);

    // 2. 生成可视化数据和元数据
    const result = await this.generateVisualizationData(
      concept,
      vizType,
      conceptAnalysis,
      geneticsEnrichment,
      ragKnowledgePoints,
    );

    // 3. 生成理解提示
    const insights = await this.generateUnderstandingInsights(
      concept,
      vizType,
      result.data,
      prerequisiteTree,
    );

    return {
      ...result,
      insights,
    };
  }

  /**
   * 确定可视化类型
   */
  private determineVisualizationType(
    concept: string,
    analysis: ConceptAnalysis,
  ): VisualizationSuggestion['type'] {
    const conceptLower = concept.toLowerCase();

    // 1. 检查精确匹配
    for (const [key, value] of Object.entries(this.conceptToVizType)) {
      if (conceptLower.includes(key.toLowerCase())) {
        return value.type;
      }
    }

    // 2. 检查关键术语
    const keyTermsText = analysis.keyTerms.join(' ').toLowerCase();

    if (keyTermsText.includes('伴性') || keyTermsText.includes('性连锁') || keyTermsText.includes('x染色体')) {
      return 'inheritance_path';
    }
    if (keyTermsText.includes('杂交') || keyTermsText.includes('配子') || keyTermsText.includes('基因型')) {
      return 'punnett_square';
    }
    if (keyTermsText.includes('概率') || keyTermsText.includes('比例') || keyTermsText.includes('分布')) {
      return 'probability_distribution';
    }

    // 3. 默认返回知识图谱
    return 'knowledge_graph';
  }

  /**
   * 生成可视化数据和元数据
   */
  private async generateVisualizationData(
    concept: string,
    vizType: VisualizationSuggestion['type'],
    analysis: ConceptAnalysis,
    enrichment?: GeneticsEnrichment,
    ragKnowledgePoints?: Record<string, any>,
  ): Promise<Omit<VisualizationSuggestion, 'insights'>> {
    const baseDesign = await this.generateBaseDesign(concept, vizType, analysis, enrichment);

    let data: VisualizationSuggestion['data'] = undefined;

    switch (vizType) {
      case 'punnett_square':
        data = await this.generatePunnettSquareData(concept, enrichment, ragKnowledgePoints);
        break;
      case 'inheritance_path':
        data = await this.generateInheritancePathData(concept, enrichment, ragKnowledgePoints);
        break;
      case 'probability_distribution':
        data = await this.generateProbabilityDistributionData(concept, enrichment, ragKnowledgePoints);
        break;
      case 'pedigree_chart':
        data = await this.generatePedigreeChartData(concept, enrichment, ragKnowledgePoints);
        break;
      default:
        // knowledge_graph 等类型由前端处理
        break;
    }

    return {
      type: vizType,
      title: baseDesign.title,
      description: baseDesign.description,
      elements: baseDesign.elements,
      colors: baseDesign.colors,
      layout: baseDesign.layout,
      interactions: baseDesign.interactions,
      annotations: baseDesign.annotations,
      animationConfig: baseDesign.animationConfig,
      data,
    };
  }

  /**
   * 生成基础设计元数据
   */
  private async generateBaseDesign(
    concept: string,
    vizType: VisualizationSuggestion['type'],
    analysis: ConceptAnalysis,
    enrichment?: GeneticsEnrichment,
  ): Promise<Omit<VisualizationDesignResponse, 'elements'> & { elements: string[] }> {
    const prompt = `你是遗传学可视化设计专家。请为以下概念设计可视化方案。

概念: ${concept}
可视化类型: ${vizType}
复杂度: ${analysis.complexity}
关键术语: ${analysis.keyTerms.join(', ')}

${enrichment ? `
遗传学原理: ${enrichment.principles.join(', ')}
相关公式: ${enrichment.formulas.map(f => f.key).join(', ')}
` : ''}

请返回 JSON 格式的可视化设计方案。注意：title 和 description 应该帮助用户理解这个可视化要说明什么问题。`;

    const schema = {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: '可视化标题，应该清楚说明这个图表要展示的内容'
        },
        description: {
          type: 'string',
          description: '详细描述这个可视化要帮助用户理解什么问题，如何通过图表理解答案'
        },
        elements: {
          type: 'array',
          items: { type: 'string' },
          description: '需要展示的元素列表'
        },
        colors: {
          type: 'object',
          description: '颜色方案映射（元素名 -> 颜色值）'
        },
        layout: {
          type: 'string',
          enum: ['force', 'hierarchical', 'circular', 'grid'],
          description: '布局方式（适用于知识图谱）'
        },
        interactions: {
          type: 'array',
          items: { type: 'string' },
          enum: ['click', 'hover', 'zoom', 'drag', 'select'],
          description: '支持的交互方式'
        },
        annotations: {
          type: 'array',
          items: { type: 'string' },
          description: '需要添加的注释说明'
        },
        animationConfig: {
          type: 'object',
          description: '动画配置',
          properties: {
            duration: { type: 'number' },
            easing: { type: 'string' },
            autoplay: { type: 'boolean' }
          }
        }
      },
      required: ['title', 'description', 'elements']
    };

    try {
      const response = await this.llmService.structuredChat<VisualizationDesignResponse>(
        [{ role: 'user', content: prompt }],
        schema,
        { temperature: 0.3 }
      );

      return {
        title: response.title,
        description: response.description,
        elements: response.elements ?? [],
        colors: response.colors,
        layout: response.layout,
        interactions: response.interactions,
        annotations: response.annotations,
        animationConfig: response.animationConfig,
      };
    } catch (error) {
      this.logger.error('Failed to generate base design:', error);
      // 返回默认设计
      return {
        title: `${concept} 可视化`,
        description: `通过可视化帮助理解${concept}的核心概念`,
        elements: [concept, ...analysis.keyTerms.slice(0, 3)],
        colors: this.getDefaultColors(vizType),
      };
    }
  }

  /**
   * 生成 Punnett 方格数据
   */
  private async generatePunnettSquareData(
    concept: string,
    enrichment?: GeneticsEnrichment,
    ragKnowledgePoints?: Record<string, any>,
  ): Promise<PunnettSquareData> {
    const enrichmentInfo = enrichment
      ? `\n相关原理：${enrichment.principles.join(', ')}\n相关例子：${enrichment.examples.map(e => e.name).join(', ')}`
      : '';

    const prompt = `你是遗传学专家。请为"${concept}"生成一个 Punnett 方格（杂交棋盘）的数据。${enrichmentInfo}

重要提示：
- 你会收到RAG知识库检索到的知识点内容
- 请将这些知识点内容准确填入对应的字段
- 不要生成新的知识点，而是使用知识库中已有的内容

RAG知识库知识点内容：
${JSON.stringify(ragKnowledgePoints || {}, null, 2)}

要求：
1. 选择一个经典且具有代表性的杂交组合
2. 明确双亲的基因型和表型
3. 计算所有可能的配子组合
4. 给出每个后代的基因型、表型和概率
5. 如涉及伴性遗传，标注性别
6. 添加简要说明
7. **从RAG知识库提取知识点并填充**：
   - keyPoints: 从RAG知识库中提取3-5个关键知识点
   - understandingPoints: 从RAG知识库中提取理解要点
   - commonMistakes: 从RAG知识库中提取常见错误
   - checkQuestions: 从RAG知识库中提取自检问题

返回 JSON 格式的 Punnett 方格数据（必须包含从RAG知识库填充的知识点字段）。`;

    const schema = {
      type: 'object',
      properties: {
        maleGametes: {
          type: 'array',
          items: { type: 'string' },
          description: '雄配子列表，如 ["X", "Y"] 或 ["A", "a"]'
        },
        femaleGametes: {
          type: 'array',
          items: { type: 'string' },
          description: '雌配子列表'
        },
        parentalCross: {
          type: 'object',
          properties: {
            male: {
              type: 'object',
              properties: {
                genotype: { type: 'string', description: '基因型，如 XY 或 XaY' },
                phenotype: { type: 'string', description: '表型描述' }
              },
              required: ['genotype', 'phenotype']
            },
            female: {
              type: 'object',
              properties: {
                genotype: { type: 'string', description: '基因型，如 XX 或 XAXa' },
                phenotype: { type: 'string', description: '表型描述' }
              },
              required: ['genotype', 'phenotype']
            }
          },
          required: ['male', 'female']
        },
        offspring: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              genotype: { type: 'string' },
              phenotype: { type: 'string' },
              probability: { type: 'number' },
              sex: { type: 'string', enum: ['male', 'female'] }
            },
            required: ['genotype', 'phenotype', 'probability']
          },
          description: '所有可能的后代组合'
        },
        description: {
          type: 'string',
          description: '杂交方式简要说明'
        },
        keyPoints: {
          type: 'array',
          items: { type: 'string' },
          description: '3-5个关键知识点，帮助学生理解遗传规律'
        },
        understandingPoints: {
          type: 'array',
          items: { type: 'string' },
          description: '如何通过这个Punnett方格理解概念'
        },
        commonMistakes: {
          type: 'array',
          items: { type: 'string' },
          description: '学生常见的错误理解'
        },
        checkQuestions: {
          type: 'array',
          items: { type: 'string' },
          description: '帮助学生自检的问题'
        }
      },
      required: ['maleGametes', 'femaleGametes', 'parentalCross', 'offspring']
    };

    try {
      const response = await this.llmService.structuredChat<PunnettSquareResponse>(
        [{ role: 'user', content: prompt }],
        schema,
        { temperature: 0.2 }
      );

      return response;
    } catch (error) {
      this.logger.error('Failed to generate Punnett square data:', error);
      // 返回示例数据
      return {
        maleGametes: ['X', 'Y'],
        femaleGametes: ['X^A', 'X^a'],
        parentalCross: {
          male: { genotype: 'XY', phenotype: '正常男性' },
          female: { genotype: 'X^AX^a', phenotype: '携带者女性' }
        },
        offspring: [
          { genotype: 'X^AX', phenotype: '正常女性', probability: 0.25, sex: 'female' },
          { genotype: 'X^aX', phenotype: '携带者女性', probability: 0.25, sex: 'female' },
          { genotype: 'X^AY', phenotype: '正常男性', probability: 0.25, sex: 'male' },
          { genotype: 'X^aY', phenotype: '患病男性', probability: 0.25, sex: 'male' },
        ],
        description: 'X连锁隐性遗传：携带者女性与正常男性婚配'
      };
    }
  }

  /**
   * 生成遗传路径数据（用于伴性遗传等）
   */
  private async generateInheritancePathData(
    concept: string,
    enrichment?: GeneticsEnrichment,
    ragKnowledgePoints?: Record<string, any>,
  ): Promise<InheritancePathData> {
    const enrichmentInfo = enrichment
      ? `\n相关原理：${enrichment.principles.join(', ')}\n常见误区：${enrichment.misconceptions.join(', ')}`
      : '';

    const prompt = `你是遗传学专家。请为"${concept}"设计一个家族遗传路径的可视化数据。${enrichmentInfo}

重要提示：
- 你会收到RAG知识库检索到的知识点内容
- 请将这些知识点内容准确填入对应的字段
- 不要生成新的知识点，而是使用知识库中已有的内容

RAG知识库知识点内容：
${JSON.stringify(ragKnowledgePoints || {}, null, 2)}

要求：
1. 设计一个3-4代的家族系谱
2. 包含不同性别的个体
3. 清楚标注每个个体的基因型、表型、是否患病、是否携带者
4. 展示基因是如何在代际间传递的
5. 给出清晰的遗传模式解释
6. **从RAG知识库提取知识点并填充**：
   - keyPoints: 从RAG知识库中提取3-5个关键知识点
   - understandingPoints: 从RAG知识库中提取理解要点
   - commonMistakes: 从RAG知识库中提取常见错误
   - checkQuestions: 从RAG知识库中提取自检问题

返回 JSON 格式的遗传路径数据（必须包含从RAG知识库填充的知识点字段）。`;

    const schema = {
      type: 'object',
      properties: {
        generations: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              generation: { type: 'number' },
              individuals: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    sex: { type: 'string', enum: ['male', 'female'] },
                    genotype: { type: 'string' },
                    phenotype: { type: 'string' },
                    affected: { type: 'boolean' },
                    carrier: { type: 'boolean' },
                    parents: { type: 'array', items: { type: 'string' } }
                  },
                  required: ['id', 'sex', 'genotype', 'phenotype', 'affected']
                }
              }
            },
            required: ['generation', 'individuals']
          }
        },
        inheritance: {
          type: 'object',
          properties: {
            pattern: { type: 'string', description: '遗传模式，如"X连锁隐性遗传"' },
            chromosome: { type: 'string', description: '相关染色体' },
            gene: { type: 'string', description: '基因名称' }
          },
          required: ['pattern', 'chromosome', 'gene']
        },
        explanation: {
          type: 'string',
          description: '遗传路径的详细解释说明'
        },
        keyPoints: {
          type: 'array',
          items: { type: 'string' },
          description: '3-5个关键知识点，帮助学生理解遗传规律'
        },
        understandingPoints: {
          type: 'array',
          items: { type: 'string' },
          description: '如何通过这个遗传路径理解概念'
        },
        commonMistakes: {
          type: 'array',
          items: { type: 'string' },
          description: '学生常见的错误理解'
        },
        checkQuestions: {
          type: 'array',
          items: { type: 'string' },
          description: '帮助学生自检的问题'
        }
      },
      required: ['generations', 'inheritance', 'explanation']
    };

    try {
      const response = await this.llmService.structuredChat<InheritancePathResponse>(
        [{ role: 'user', content: prompt }],
        schema,
        { temperature: 0.2 }
      );

      return response;
    } catch (error) {
      this.logger.error('Failed to generate inheritance path data:', error);
      throw new Error(`无法为"${concept}"生成遗传路径数据`);
    }
  }

  /**
   * 生成 Punnett 方格数据（带问题）
   */
  private async generatePunnettSquareDataWithQuestion(
    concept: string,
    question: string,
    enrichment?: GeneticsEnrichment,
    ragKnowledgePoints?: Record<string, any>,
  ): Promise<PunnettSquareData> {
    const enrichmentInfo = enrichment
      ? `\n相关原理：${enrichment.principles.join(', ')}\n相关例子：${enrichment.examples.map(e => e.name).join(', ')}`
      : '';

    const prompt = `你是遗传学专家。用户正在学习"${concept}"概念，并提出了以下问题："${question}"

请为这个问题设计一个 Punnett 方格（杂交棋盘）的数据。${enrichmentInfo}

重要提示：
- 你会收到RAG知识库检索到的知识点内容
- 请将这些知识点内容准确填入对应的字段
- 不要生成新的知识点，而是使用知识库中已有的内容

RAG知识库知识点内容：
${JSON.stringify(ragKnowledgePoints || {}, null, 2)}

要求：
1. 选择一个经典且具有代表性的杂交组合，能够回答用户的问题
2. 明确双亲的基因型和表型
3. 计算所有可能的配子组合
4. 给出每个后代的基因型、表型和概率
5. 如涉及伴性遗传，标注性别
6. 添加简要说明
7. **从RAG知识库提取知识点并填充**：
   - keyPoints: 从RAG知识库中提取3-5个关键知识点
   - understandingPoints: 从RAG知识库中提取理解要点
   - commonMistakes: 从RAG知识库中提取常见错误
   - checkQuestions: 从RAG知识库中提取自检问题

返回 JSON 格式的 Punnett 方格数据（必须包含从RAG知识库填充的知识点字段）。`;

    const schema = {
      type: 'object',
      properties: {
        maleGametes: {
          type: 'array',
          items: { type: 'string' },
          description: '雄配子列表，如 ["X", "Y"] 或 ["A", "a"]'
        },
        femaleGametes: {
          type: 'array',
          items: { type: 'string' },
          description: '雌配子列表'
        },
        parentalCross: {
          type: 'object',
          properties: {
            male: {
              type: 'object',
              properties: {
                genotype: { type: 'string', description: '基因型，如 XY 或 XaY' },
                phenotype: { type: 'string', description: '表型描述' }
              },
              required: ['genotype', 'phenotype']
            },
            female: {
              type: 'object',
              properties: {
                genotype: { type: 'string', description: '基因型，如 XX 或 XAXa' },
                phenotype: { type: 'string', description: '表型描述' }
              },
              required: ['genotype', 'phenotype']
            }
          },
          required: ['male', 'female']
        },
        offspring: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              genotype: { type: 'string' },
              phenotype: { type: 'string' },
              probability: { type: 'number' },
              sex: { type: 'string', enum: ['male', 'female'] }
            },
            required: ['genotype', 'phenotype', 'probability']
          },
          description: '所有可能的后代组合'
        },
        description: {
          type: 'string',
          description: '杂交方式简要说明'
        },
        keyPoints: {
          type: 'array',
          items: { type: 'string' },
          description: '3-5个关键知识点，帮助学生理解遗传规律'
        },
        understandingPoints: {
          type: 'array',
          items: { type: 'string' },
          description: '如何通过这个Punnett方格理解概念'
        },
        commonMistakes: {
          type: 'array',
          items: { type: 'string' },
          description: '学生常见的错误理解'
        },
        checkQuestions: {
          type: 'array',
          items: { type: 'string' },
          description: '帮助学生自检的问题'
        }
      },
      required: ['maleGametes', 'femaleGametes', 'parentalCross', 'offspring']
    };

    try {
      const response = await this.llmService.structuredChat<PunnettSquareResponse>(
        [{ role: 'user', content: prompt }],
        schema,
        { temperature: 0.2 }
      );

      return response;
    } catch (error) {
      this.logger.error('Failed to generate Punnett square data:', error);
      throw new Error(`无法为"${concept}"和问题"${question}"生成Punnett方格数据`);
    }
  }

  /**
   * 根据问题生成遗传路径数据（用于伴性遗传等）
   */
  private async generateInheritancePathDataWithQuestion(
    concept: string,
    question: string,
    enrichment?: GeneticsEnrichment,
    ragKnowledgePoints?: Record<string, any>,
  ): Promise<InheritancePathData> {
    const enrichmentInfo = enrichment
      ? `\n相关原理：${enrichment.principles.join(', ')}\n常见误区：${enrichment.misconceptions.join(', ')}`
      : '';

    const prompt = `你是遗传学专家。用户正在学习"${concept}"概念，并提出了以下问题："${question}"

请为这个问题设计一个家族遗传路径的可视化数据。${enrichmentInfo}

重要提示：
- 你会收到RAG知识库检索到的知识点内容
- 请将这些知识点内容准确填入对应的字段
- 不要生成新的知识点，而是使用知识库中已有的内容

RAG知识库知识点内容：
${JSON.stringify(ragKnowledgePoints || {}, null, 2)}

要求：
1. 设计一个3-4代的家族系谱
2. 包含不同性别的个体
3. 清楚标注每个个体的基因型、表型、是否患病、是否携带者
4. 展示基因是如何在代际间传递的，特别要回答用户的问题
5. 给出清晰的遗传模式解释
6. **从RAG知识库提取知识点并填充**：
   - keyPoints: 从RAG知识库中提取3-5个关键知识点
   - understandingPoints: 从RAG知识库中提取理解要点
   - commonMistakes: 从RAG知识库中提取常见错误
   - checkQuestions: 从RAG知识库中提取自检问题

返回 JSON 格式的遗传路径数据（必须包含从RAG知识库填充的知识点字段）。`;

    const schema = {
      type: 'object',
      properties: {
        generations: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              generation: { type: 'number' },
              individuals: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    sex: { type: 'string', enum: ['male', 'female'] },
                    genotype: { type: 'string' },
                    phenotype: { type: 'string' },
                    affected: { type: 'boolean' },
                    carrier: { type: 'boolean' },
                    parents: { type: 'array', items: { type: 'string' } }
                  },
                  required: ['id', 'sex', 'genotype', 'phenotype', 'affected']
                }
              }
            },
            required: ['generation', 'individuals']
          }
        },
        inheritance: {
          type: 'object',
          properties: {
            pattern: { type: 'string', description: '遗传模式，如"X连锁隐性遗传"' },
            chromosome: { type: 'string', description: '相关染色体' },
            gene: { type: 'string', description: '基因名称' }
          },
          required: ['pattern', 'chromosome', 'gene']
        },
        explanation: {
          type: 'string',
          description: '遗传路径的详细解释说明'
        },
        keyPoints: {
          type: 'array',
          items: { type: 'string' },
          description: '3-5个关键知识点，帮助学生理解遗传规律'
        },
        understandingPoints: {
          type: 'array',
          items: { type: 'string' },
          description: '如何通过这个遗传路径理解概念'
        },
        commonMistakes: {
          type: 'array',
          items: { type: 'string' },
          description: '学生常见的错误理解'
        },
        checkQuestions: {
          type: 'array',
          items: { type: 'string' },
          description: '帮助学生自检的问题'
        }
      },
      required: ['generations', 'inheritance', 'explanation']
    };

    try {
      const response = await this.llmService.structuredChat<InheritancePathResponse>(
        [{ role: 'user', content: prompt }],
        schema,
        { temperature: 0.2 }
      );

      return response;
    } catch (error) {
      this.logger.error('Failed to generate inheritance path data:', error);
      throw new Error(`无法为"${concept}"和问题"${question}"生成遗传路径数据`);
    }
  }

  /**
   * 生成概率分布数据
   */
  private async generateProbabilityDistributionData(
    concept: string,
    enrichment?: GeneticsEnrichment,
    ragKnowledgePoints?: Record<string, any>,
  ): Promise<ProbabilityDistributionData> {
    const enrichmentInfo = enrichment
      ? `\n相关公式：${enrichment.formulas.map(f => `${f.key}: ${f.latex}`).join('\n')}`
      : '';

    const prompt = `你是遗传学专家。请为"${concept}"生成一个概率分布的可视化数据。${enrichmentInfo}

重要提示：
- 你会收到RAG知识库检索到的知识点内容
- 请将这些知识点内容准确填入对应的字段
- 不要生成新的知识点，而是使用知识库中已有的内容

RAG知识库知识点内容：
${JSON.stringify(ragKnowledgePoints || {}, null, 2)}

要求：
1. 根据概念确定要展示的概率分布类型
2. 给出清晰的分类（如基因型类别、表型类别）
3. 计算各分类的概率值（总和应为1）
4. 如有相关公式，一并提供
5. 说明这些概率的实际意义
6. **从RAG知识库提取知识点并填充**：
   - keyPoints: 从RAG知识库中提取3-5个关键知识点
   - understandingPoints: 从RAG知识库中提取理解要点
   - commonMistakes: 从RAG知识库中提取常见错误
   - checkQuestions: 从RAG知识库中提取自检问题

返回 JSON 格式的概率分布数据（必须包含从RAG知识库填充的知识点字段）。`;

    const schema = {
      type: 'object',
      properties: {
        categories: {
          type: 'array',
          items: { type: 'string' },
          description: '类别名称'
        },
        values: {
          type: 'array',
          items: { type: 'number' },
          description: '对应概率值（0-1之间）'
        },
        colors: {
          type: 'array',
          items: { type: 'string' },
          description: '各类别颜色（可选）'
        },
        total: {
          type: 'string',
          description: '总计说明'
        },
        formula: {
          type: 'string',
          description: '相关公式（如有）'
        },
        keyPoints: {
          type: 'array',
          items: { type: 'string' },
          description: '3-5个关键知识点，帮助学生理解遗传规律'
        },
        understandingPoints: {
          type: 'array',
          items: { type: 'string' },
          description: '如何通过这个概率分布理解概念'
        },
        commonMistakes: {
          type: 'array',
          items: { type: 'string' },
          description: '学生常见的错误理解'
        },
        checkQuestions: {
          type: 'array',
          items: { type: 'string' },
          description: '帮助学生自检的问题'
        }
      },
      required: ['categories', 'values']
    };

    try {
      const response = await this.llmService.structuredChat<ProbabilityDistributionResponse>(
        [{ role: 'user', content: prompt }],
        schema,
        { temperature: 0.2 }
      );

      return response;
    } catch (error) {
      this.logger.error('Failed to generate probability distribution data:', error);
      // 返回示例数据
      return {
        categories: ['显性纯合 (AA)', '杂合 (Aa)', '隐性纯合 (aa)'],
        values: [0.25, 0.5, 0.25],
        colors: ['#4CAF50', '#2196F3', '#FF9800'],
        total: '总和 = 1 (100%)',
        formula: '双杂合子自交：Aa × Aa → 1AA:2Aa:1aa'
      };
    }
  }

  /**
   * 生成家系表数据
   */
  private async generatePedigreeChartData(
    concept: string,
    enrichment?: GeneticsEnrichment,
    ragKnowledgePoints?: Record<string, any>,
  ): Promise<PedigreeChartData> {
    const enrichmentInfo = enrichment
      ? `\n相关原理：${enrichment.principles.join(', ')}\n常见例子：${enrichment.examples.map(e => e.name).join(', ')}`
      : '';

    const prompt = `你是遗传学专家。请为"${concept}"设计一个家系表（系谱图）的数据。${enrichmentInfo}

重要提示：
- 你会收到RAG知识库检索到的知识点内容
- 请将这些知识点内容准确填入对应的字段
- 不要生成新的知识点，而是使用知识库中已有的内容

RAG知识库知识点内容：
${JSON.stringify(ragKnowledgePoints || {}, null, 2)}

要求：
1. 设计一个经典且具有代表性的家系结构（3-5代）
2. 明确每个成员的性别、表型、是否患病或携带
3. 清晰展示亲缘关系和配偶关系
4. 明确遗传模式（显性/隐性、常染色体/性染色体）
5. 添加简要说明
6. **从RAG知识库提取知识点并填充**：
   - keyPoints: 从RAG知识库中提取3-5个关键知识点
   - understandingPoints: 从RAG知识库中提取理解要点
   - commonMistakes: 从RAG知识库中提取常见错误
   - checkQuestions: 从RAG知识库中提取自检问题

返回 JSON 格式的家系表数据（必须包含从RAG知识库填充的知识点字段）。`;

    const schema = {
      type: 'object',
      properties: {
        individuals: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', description: '个体唯一标识符' },
              sex: { type: 'string', enum: ['male', 'female'], description: '性别' },
              affected: { type: 'boolean', description: '是否患病' },
              carrier: { type: 'boolean', description: '是否为携带者' },
              generation: { type: 'number', description: '世代数（1, 2, 3...）' },
              position: { type: 'number', description: '在该代中的位置' },
              parents: {
                type: 'object',
                properties: {
                  father: { type: 'string', description: '父亲ID' },
                  mother: { type: 'string', description: '母亲ID' }
                }
              },
              spouse: { type: 'string', description: '配偶ID' }
            },
            required: ['id', 'sex', 'affected', 'generation', 'position']
          },
          description: '家系成员列表'
        },
        legend: {
          type: 'object',
          properties: {
            condition: { type: 'string', description: '疾病或性状名称' },
            inheritancePattern: { type: 'string', description: '遗传模式' }
          },
          required: ['condition', 'inheritancePattern']
        },
        keyPoints: {
          type: 'array',
          items: { type: 'string' },
          description: '3-5个关键知识点，帮助学生理解遗传规律'
        },
        understandingPoints: {
          type: 'array',
          items: { type: 'string' },
          description: '如何通过这个家系表理解概念'
        },
        commonMistakes: {
          type: 'array',
          items: { type: 'string' },
          description: '学生常见的错误理解'
        },
        checkQuestions: {
          type: 'array',
          items: { type: 'string' },
          description: '帮助学生自检的问题'
        }
      },
      required: ['individuals', 'legend']
    };

    try {
      const response = await this.llmService.structuredChat<PedigreeChartResponse>(
        [{ role: 'user', content: prompt }],
        schema,
        { temperature: 0.2 }
      );

      return response;
    } catch (error) {
      this.logger.error('Failed to generate pedigree chart data:', error);
      return {
        individuals: [
          { id: 'I1', sex: 'male', affected: false, generation: 1, position: 1 },
          { id: 'I2', sex: 'female', affected: false, generation: 1, position: 2, spouse: 'I1' },
          { id: 'II1', sex: 'male', affected: false, generation: 2, position: 1, parents: { father: 'I1', mother: 'I2' } },
          { id: 'II2', sex: 'female', affected: true, generation: 2, position: 2, parents: { father: 'I1', mother: 'I2' }, spouse: 'II1' },
          { id: 'III1', sex: 'male', affected: false, generation: 3, position: 1, parents: { father: 'II1', mother: 'II2' } },
          { id: 'III2', sex: 'female', affected: true, generation: 3, position: 2, parents: { father: 'II1', mother: 'II2' } },
        ],
        legend: {
          condition: '血友病（X连锁隐性遗传）',
          inheritancePattern: 'X连锁隐性遗传，男性患病，女性携带者'
        },
        keyPoints: ['X连锁隐性遗传特征', '携带者概念', '隔代遗传现象'],
        understandingPoints: ['通过性别和表型分布判断遗传方式', '携带者外观正常但可传递致病基因'],
        commonMistakes: ['误认为女性也会患病', '忽略携带者的重要性'],
        checkQuestions: ['为什么男性更容易患病？', '携带者的后代遗传风险如何？'],
      };
    }
  }

  /**
   * 生成理解提示
   */
  private async generateUnderstandingInsights(
    concept: string,
    vizType: VisualizationSuggestion['type'],
    data: VisualizationSuggestion['data'],
    prerequisiteTree?: PrerequisiteNode,
  ): Promise<UnderstandingInsight[]> {
    const prerequisiteInfo = prerequisiteTree
      ? `\n前置知识：${this.formatPrerequisiteTree(prerequisiteTree)}`
      : '';

    const prompt = `你是教育学专家。请为"${concept}"的可视化（类型：${vizType}）生成学习提示。

${data ? `
参考数据：${JSON.stringify(data).substring(0, 500)}...
` : ''}${prerequisiteInfo}

请生成2-3个理解提示，每个提示包含：
1. keyPoint: 关键知识点
2. visualConnection: 如何通过可视化理解这个点
3. commonMistake: 学生常见的错误理解
4. checkQuestion: 帮助学生自检的问题

返回 JSON 数组格式。`;

    const schema = {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          keyPoint: { type: 'string' },
          visualConnection: { type: 'string' },
          commonMistake: { type: 'string' },
          checkQuestion: { type: 'string' }
        },
        required: ['keyPoint', 'visualConnection', 'commonMistake', 'checkQuestion']
      },
      minItems: 2,
      maxItems: 4
    };

    try {
      const response = await this.llmService.structuredChat<UnderstandingInsightResponse[]>(
        [{ role: 'user', content: prompt }],
        schema,
        { temperature: 0.3 }
      );

      return response;
    } catch (error) {
      this.logger.error('Failed to generate understanding insights:', error);
      return [];
    }
  }

  /**
   * 使用动态可视化生成器生成可视化
   * 当没有硬编码或 RAG 匹配的可视化时使用
   */
  private async generateDynamicVisualization(
    concept: string,
    question: string,
    userLevel: 'beginner' | 'intermediate' | 'advanced'
  ): Promise<VisualizationSuggestion> {
    if (!this.dynamicVizGenerator) {
      throw new Error('DynamicVizGeneratorService is not available');
    }

    this.logger.log(`Generating dynamic visualization for concept: ${concept}, question: ${question}`);

    try {
      const dynamicResult = await this.dynamicVizGenerator.generateDynamicVisualization({
        question,
        concept,
        userLevel
      });

      if (!dynamicResult.visualizationApplicable || !dynamicResult.visualizationData) {
        throw new Error('Dynamic visualization generation failed or not applicable');
      }

      this.logger.log(`Dynamic visualization generated successfully: ${dynamicResult.selectedTemplate?.templateId}`);

      return {
        type: dynamicResult.visualizationData.type || 'punnett_square',
        title: dynamicResult.visualizationData.title || `动态可视化：${concept}`,
        description: dynamicResult.visualizationData.description || '基于 AI 动态生成的可视化',
        data: dynamicResult.visualizationData.data,
        colors: this.getDefaultColors(dynamicResult.visualizationData.type || 'punnett_square'),
        elements: dynamicResult.visualizationData.elements || [],
        interactions: ['hover', 'click'],
      };
    } catch (error) {
      this.logger.error('Dynamic visualization generation failed:', error);
      throw error;
    }
  }

  /**
   * 获取默认颜色方案
   */
  private getDefaultColors(vizType: VisualizationSuggestion['type']): Record<string, string> {
    const colorSchemes: Record<string, Record<string, string>> = {
      punnett_square: {
        dominant: '#4CAF50',
        recessive: '#FF9800',
        heterozygous: '#2196F3',
        male: '#64B5F6',
        female: '#F06292',
      },
      inheritance_path: {
        affected: '#F44336',
        carrier: '#FFB74D',
        normal: '#4CAF50',
        male: '#64B5F6',
        female: '#F06292',
      },
      probability_distribution: {
        high: '#4CAF50',
        medium: '#2196F3',
        low: '#FF9800',
      },
      knowledge_graph: {
        foundation: '#4CAF50',
        intermediate: '#2196F3',
        advanced: '#9C27B0',
        target: '#F44336',
      },
    };

    return colorSchemes[vizType] || {};
  }

  /**
   * 生成 D3.js 渲染配置
   */
  async generateD3Config(visualization: VisualizationSuggestion): Promise<Record<string, unknown>> {
    return {
      type: visualization.type,
      title: visualization.title,
      description: visualization.description,
      colors: visualization.colors,
      data: visualization.data,
      interactions: visualization.interactions,
    };
  }

  /**
   * 生成知识图谱数据
   */
  generateGraphData(prerequisiteTree: PrerequisiteNode): {
    nodes: Array<{ id: string; label: string; level: number; isFoundation: boolean }>;
    links: Array<{ source: string; target: string }>;
  } {
    const nodes: Array<{ id: string; label: string; level: number; isFoundation: boolean }> = [];
    const links: Array<{ source: string; target: string }> = [];

    const traverse = (node: PrerequisiteNode, parent?: string) => {
      nodes.push({
        id: node.concept,
        label: node.concept,
        level: node.level,
        isFoundation: node.isFoundation,
      });

      if (parent) {
        links.push({ source: parent, target: node.concept });
      }

      node.prerequisites?.forEach(child => traverse(child, node.concept));
    };

    traverse(prerequisiteTree);

    return { nodes, links };
  }

  /**
   * 格式化前置知识树为字符串
   */
  private formatPrerequisiteTree(tree: PrerequisiteNode, indent = 0): string {
    const prefix = '  '.repeat(indent);
    let result = `${prefix}${tree.concept}`;
    if (tree.isFoundation) {
      result += ' (基础)';
    }
    if (tree.prerequisites && tree.prerequisites.length > 0) {
      tree.prerequisites.forEach(child => {
        result += '\n' + this.formatPrerequisiteTree(child, indent + 1);
      });
    }
    return result;
  }

  /**
   * 清理文本回答中的重复内容
   * 移除examples、followUpQuestions、relatedConcepts在textAnswer中的重复
   */
  private cleanTextAnswer(
    textAnswer: string,
    examples?: Array<{ title: string; description: string }>,
    followUpQuestions?: string[],
    relatedConcepts?: string[]
  ): string {
    if (!textAnswer) return textAnswer;

    let cleanedAnswer = textAnswer;

    if (examples && examples.length > 0) {
      const examplePatterns = [
        /举例说明[：:][\s\S]*?(?=\n\n|\n(?=[一二三四五六七八九十]|您可能还想了解)|$)/g,
        /例子[：:][\s\S]*?(?=\n\n|\n(?=[一二三四五六七八九十]|您可能还想了解)|$)/g,
        /例如[：:][\s\S]*?(?=\n\n|\n(?=[一二三四五六七八九十]|您可能还想了解)|$)/g,
      ];
      examplePatterns.forEach(pattern => {
        cleanedAnswer = cleanedAnswer.replace(pattern, '');
      });
    }

    if (followUpQuestions && followUpQuestions.length > 0) {
      const questionPatterns = [
        /后续建议问题[：:][\s\S]*?(?=\n\n|\n(?=[一二三四五六七八九十])|$)/g,
        /您可能还想了解[：:][\s\S]*?(?=\n\n|\n(?=[一二三四五六七八九十])|$)/g,
      ];
      questionPatterns.forEach(pattern => {
        cleanedAnswer = cleanedAnswer.replace(pattern, '');
      });
    }

    if (relatedConcepts && relatedConcepts.length > 0) {
      const conceptPatterns = [
        /相关概念[：:][\s\S]*?(?=\n\n|\n(?=[一二三四五六七八九十])|$)/g,
      ];
      conceptPatterns.forEach(pattern => {
        cleanedAnswer = cleanedAnswer.replace(pattern, '');
      });
    }

    cleanedAnswer = cleanedAnswer.replace(/\n{3,}/g, '\n\n').trim();

    return cleanedAnswer;
  }

  /**
   * 基于可视化回答用户问题
   * @param concept 当前学习的概念
   * @param question 用户的问题
   * @param userLevel 用户水平
   * @param conversationHistory 对话历史
   * @returns 可视化问答响应
   */
  async answerQuestion(
    concept: string,
    question: string,
    userLevel: 'beginner' | 'intermediate' | 'advanced' = 'intermediate',
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
  ): Promise<VisualizationAnswerResponse> {
    this.logger.log(`Answering question for concept: ${concept}, question: ${question}`);

    // 检测用户是否明确要求可视化内容
    const requiresVisualization = question.includes('请为这个问题生成详细的可视化内容') ||
                                  question.includes('生成可视化内容') ||
                                  question.includes('可视化说明') ||
                                  question.includes('可视化') ||
                                  question.includes('图表') ||
                                  question.includes('图示') ||
                                  question.includes('展示') ||
                                  question.includes('表现') ||
                                  question.includes('画') ||
                                  question.includes('画出') ||
                                  question.includes('图解') ||
                                  question.includes('图示') ||
                                  question.includes('系谱') ||
                                  question.includes('图') ||
                                  question.includes('可视化表现');

    // 使用向量检索获取相关知识库内容
    let ragContext: RetrievalResult[] = [];
    let ragContextText = '';
    
    if (this.vectorRetrieval) {
      try {
        const retrievalResult = await this.vectorRetrieval.retrieve({
          query: question,
          topK: 5,
        });
        
        if (retrievalResult.success && retrievalResult.data) {
          ragContext = retrievalResult.data.results;
          
          if (ragContext.length > 0) {
            ragContextText = `\n\n**参考资料（来自遗传学教材）：**\n\n${ragContext.map((r, i) => {
              const source = r.metadata.chapter
                ? `${r.metadata.chapter}${r.metadata.section ? ' - ' + r.metadata.section : ''}`
                : '未知章节';
              return `[参考资料${i + 1} - 来源：${source}]\n${r.content}`;
            }).join('\n\n---\n\n')}`;
            
            this.logger.log(`Retrieved ${ragContext.length} relevant chunks from RAG knowledge base`);
          }
        }
      } catch (ragError) {
        this.logger.warn('Vector RAG retrieval failed:', ragError);
      }
    }

    let selectedVisualization: Omit<VisualizationSuggestion, 'insights'> | null = null;
    let matchedConcept: string | null = null;

    if (this.visualizationRAG) {
      try {
        const matches = await this.visualizationRAG.retrieveByQuestion(question, 0.3, 5);

        if (matches.length > 0) {
          const bestMatch = matches[0];
          selectedVisualization = bestMatch.visualization;
          matchedConcept = bestMatch.concept;
          this.logger.log(`RAG found matching visualization: ${bestMatch.concept} (score: ${bestMatch.score.toFixed(3)})`);
        } else {
          this.logger.log(`RAG found no matches for question: "${question}" (threshold: 0.3)`);
        }
      } catch (ragError) {
        this.logger.warn('Visualization RAG retrieval failed:', ragError);
      }
    }

    let contextInfo = '';
    let useRagVisualization = false;
    if (selectedVisualization) {
      useRagVisualization = true;
      contextInfo = `\n\n相关可视化信息（来自RAG检索）：\n知识点：${matchedConcept}\n标题：${selectedVisualization.title}\n描述：${selectedVisualization.description}\n元素：${selectedVisualization.elements.join('、')}\n类型：${selectedVisualization.type}\n\n重要：这是系统通过向量检索为你找到的最相关的可视化，请直接使用它，不需要再建议新的可视化类型！`;
      this.logger.log(`Using RAG-retrieved visualization for concept: ${matchedConcept}`);
    } else {
      // 硬编码检查已禁用 - 完全使用AI生成和RAG检索
      // const hardcodedViz = getHardcodedVisualization(concept);
      // if (hardcodedViz) {
      //   contextInfo = `\n\n当前可视化信息（来自硬编码）：\n标题：${hardcodedViz.title}\n描述：${hardcodedViz.description}\n元素：${hardcodedViz.elements.join('、')}\n类型：${hardcodedViz.type}`;
      //   this.logger.log(`Using hardcoded visualization for concept: ${concept}`);
      // }
    }

    const historyContext = conversationHistory.length > 0
      ? `\n\n对话历史：\n${conversationHistory.map(h => `${h.role}: ${h.content}`).join('\n')}`
      : '';

    const prompt = `你是遗传学教育专家。用户正在学习"${concept}"概念，并提出了以下问题。

${ragContextText}
${contextInfo}${historyContext}

**核心要求：**
${ragContext.length > 0 
  ? '1. **严格基于参考资料回答**：所有答案必须来自上面的参考资料，不能编造或使用外部知识\n2. **标注来源**：在每个关键点后用[参考资料N]标注来自哪个参考资料\n3. **说明章节**：明确说明答案来自课本的哪个章节\n4. **如果参考资料不足**：请明确说明"根据提供的参考资料，没有找到相关信息"，不要编造答案'
  : '如果没有提供参考资料，请基于遗传学知识回答'}

**回答要求（非常重要）：**
1. **详细全面**：请提供详细的解释，不要只给简短的几句话。每个概念都要充分展开说明。
2. **结构清晰**：使用分段、分点的方式组织内容，让回答更容易理解。
3. **背景知识**：在回答主要问题时，适当补充相关的背景知识和上下文。
4. **逐步推导**：如果是计算或推导类问题，请详细展示每个步骤。
5. **适用范围**：说明原理的适用条件和限制。

**重要格式要求（必须遵守）：**
- **textAnswer字段**：只包含对用户问题的直接文字回答，**不要**在其中单独列出"举例说明"、"后续建议问题"、"相关概念"等标题或段落。所有例子、后续问题、相关概念都应该放在对应的结构化字段中。
- **examples字段**：将具体的例子放在这个数组中，包含title和description，**不要**在textAnswer中重复。
- **followUpQuestions字段**：将后续建议问题放在这个数组中，**不要**在textAnswer中重复。
- **relatedConcepts字段**：将相关概念放在这个数组中，**不要**在textAnswer中重复。

错误示例（textAnswer中包含了例子、后续问题和相关概念）：
textAnswer包含了"举例说明："、"后续建议问题："、"相关概念："等标题，这是错误的。

正确示例（textAnswer只包含核心回答内容，其他内容放在结构化字段中）：
textAnswer: "基因组测序技术在个性化医疗中的应用非常广泛。通过分析个体的基因组，可以预测个体患某些遗传性疾病的可能性，从而采取预防措施。此外，基因组测序还可以帮助医生了解患者对特定药物的反应，从而选择最合适的治疗方案。在癌症治疗中，测序可以帮助识别癌症中的基因突变，从而指导治疗策略，例如靶向治疗和免疫治疗[参考资料1]。"
examples: [
  {"title": "癌症治疗中的基因组测序应用", "description": "通过基因组测序，医生可以识别患者的肿瘤中哪些基因发生了突变，从而选择针对性的药物进行治疗。"},
  {"title": "遗传性疾病的基因组测序诊断", "description": "基因组测序可以帮助医生确定患者的基因突变，从而提供准确的诊断和治疗方案。"}
]
followUpQuestions: [
  "个性化医疗如何改变现代医学实践？",
  "基因组测序技术在罕见病诊断中的应用有哪些？"
]
relatedConcepts: ["疾病风险评估", "药物反应预测", "遗传性疾病的诊断", "癌症治疗", "基因组测序"]

用户问题：${question}

重要判断：
首先判断用户的问题是否与遗传学相关。
- 如果问题明显与遗传学无关（例如：游戏、娱乐、政治、日常闲聊等），请礼貌地说明这是遗传学学习助手，建议用户提问遗传学相关问题。
- 如果问题与遗传学相关，请详细回答。

请提供：
1. **详细的文字回答**（根据用户水平${userLevel}调整深度，但务必详细和完整，**只包含核心回答内容**）
2. 如果问题可以通过可视化更好地回答，建议合适的可视化类型
3. 1-2个具体的例子，帮助用户理解概念（如果适用，放在examples数组中）
4. 2-3个后续建议问题，帮助用户深入理解（如果是非遗传学问题，可以提供遗传学相关的问题建议，放在followUpQuestions数组中）

**重要说明：后续建议问题必须是具体的遗传学知识问题，例如"孟德尔分离定律是什么？"、"基因如何影响生物的表型？"、"伴性遗传有什么特点？"等，而不是"你想要了解什么？"、"你想学习更多信息吗？"等元问题。问题应该直接指向具体的遗传学概念或现象。**

**关于可视化的重要说明：**
- ${requiresVisualization ? '用户明确要求生成可视化内容，请优先考虑创建详细的可视化说明，确保可视化内容能够准确回答用户的问题。' : ''}
- 如果"相关可视化信息"部分提供了具体的可视化（包含类型、标题、描述、元素），这表示系统已经为你找到了最相关的可视化，请直接使用它：
  - 将needVisualization设为true
  - 将suggestedVisualizationType设为该可视化的类型
  - 不要建议其他可视化类型
- 只有当没有找到相关的可视化时，才考虑生成新的可视化
- 不要因为有一个Punnett方格就总是使用它，要判断它是否真正适合回答用户的问题
- 如果用户问的是"基因传递"、"DNA复制"、"减数分裂"等机制问题，应该优先使用相关的机制可视化，而不是遗传比例可视化（如Punnett方格）**

返回JSON格式。`;

    const schema = {
      type: 'object',
      properties: {
        textAnswer: {
          type: 'string',
          description: '对用户问题的文字回答。如果是非遗传学问题，请礼貌说明这是遗传学学习助手，并引导用户提问遗传学相关问题。如果与遗传学相关，应该清晰、准确、适合${userLevel}水平的学生理解'
        },
        needVisualization: {
          type: 'boolean',
          description: '是否需要可视化来更好地回答这个问题（非遗传学问题设为false）。如果"相关可视化信息"中提供了具体的可视化，请优先使用它，设为true'
        },
        suggestedVisualizationType: {
          type: 'string',
          enum: ['punnett_square', 'inheritance_path', 'probability_distribution', 'none'],
          description: '建议的可视化类型（非遗传学问题设为none）。如果"相关可视化信息"中提供了可视化，请使用该可视化的类型。不要因为习惯使用Punnett方格就总是返回punnett_square，要判断它是否真的适合回答用户的问题'
        },
        examples: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string', description: '例子的标题' },
              description: { type: 'string', description: '例子的详细描述' }
            },
            required: ['title', 'description']
          },
          description: '1-2个具体的例子，帮助用户理解概念（非遗传学问题可以不提供）',
          minItems: 0,
          maxItems: 2
        },
        followUpQuestions: {
          type: 'array',
          items: { type: 'string' },
          description: '2-3个后续建议问题。必须是具体的遗传学知识问题（如"孟德尔分离定律是什么？"、"基因如何影响生物的表型？"、"伴性遗传有什么特点？"），不能是元问题（如"你想要了解什么？"、"你想学习更多信息吗？"）。如果是非遗传学问题，可以提供遗传学相关的问题建议帮助用户回归学习主题',
          minItems: 2,
          maxItems: 3
        },
        relatedConcepts: {
          type: 'array',
          items: { type: 'string' },
          description: '相关的概念，帮助用户扩展知识面（非遗传学问题可以不提供）',
          minItems: 0,
          maxItems: 3
        }
      },
      required: ['textAnswer', 'needVisualization', 'followUpQuestions']
    };

    try {
      const response = await this.llmService.structuredChat<{
        textAnswer: string;
        needVisualization: boolean;
        suggestedVisualizationType?: 'punnett_square' | 'inheritance_path' | 'probability_distribution' | 'none';
        examples?: Array<{ title: string; description: string }>;
        followUpQuestions: string[];
        relatedConcepts?: string[];
      }>(
        [{ role: 'user', content: prompt }],
        schema,
        { 
          temperature: 0.7,
          maxTokens: 4000,
        }
      );

      let visualization: VisualizationSuggestion | undefined;
    let a2uiTemplate: any = null;

      if (requiresVisualization) {
      this.logger.log(`User explicitly requested visualization, trying template matching first`);

      try {
        const templateMatch = await this.templateMatcher?.matchTemplate(question, concept);

        if (templateMatch?.matched && templateMatch.template && templateMatch.confidence > 0.7) {
          this.logger.log(`Template matched: ${templateMatch.templateId} with confidence ${templateMatch.confidence.toFixed(2)}`);

          const mergedParameters = {
            ...templateMatch.template.defaultValues,
            ...templateMatch.suggestedParameters
          };

          a2uiTemplate = buildA2UIPayload(templateMatch.template, mergedParameters);

          this.logger.log(`Generated A2UI payload for: ${templateMatch.templateId}`);
        }
      } catch (templateError) {
        this.logger.warn('Template matching failed, falling back to dynamic generation:', templateError);
      }
      
      if (!a2uiTemplate) {
        this.logger.log(`No template match or confidence too low, trying dynamic generation`);
        
        try {
          visualization = await this.generateDynamicVisualization(
            concept,
            question,
            userLevel
          );
          this.logger.log(`Successfully generated dynamic visualization for question: ${question.substring(0, 50)}`);
        } catch (vizError) {
          this.logger.warn('Failed to generate dynamic visualization, trying RAG fallback:', vizError);
          
          if (useRagVisualization && selectedVisualization) {
            this.logger.log(`Using RAG-matched visualization: ${matchedConcept}`);
            visualization = {
              ...selectedVisualization,
              insights: undefined
            } as VisualizationSuggestion;
          } else {
            // 硬编码检查已禁用 - 完全使用AI生成和RAG检索
            // const hardcodedViz = getHardcodedVisualization(concept);
            // if (hardcodedViz) {
            //   this.logger.log(`Using hardcoded visualization for concept: ${concept}`);
            //   visualization = {
            //     ...hardcodedViz,
            //     insights: undefined
            //   } as VisualizationSuggestion;
            // } else 
            if (response.suggestedVisualizationType && response.suggestedVisualizationType !== 'none') {
              try {
                this.logger.log(`Trying question-based visualization as final fallback`);
                visualization = await this.generateQuestionBasedVisualization(
                  concept,
                  question,
                  response.suggestedVisualizationType,
                  userLevel
                );
              } catch (fallbackError) {
                this.logger.warn('Failed to generate fallback visualization, continuing without visualization:', fallbackError);
              }
            }
          }
        }
      }
      } else if (response.needVisualization) {
        this.logger.log(`LLM suggested visualization, prioritizing dynamic generation`);
        
        try {
          visualization = await this.generateDynamicVisualization(
            concept,
            question,
            userLevel
          );
          this.logger.log(`Successfully generated dynamic visualization`);
        } catch (vizError) {
          this.logger.warn('Failed to generate dynamic visualization, trying fallback:', vizError);
          
          if (useRagVisualization && selectedVisualization) {
            this.logger.log(`Using RAG-matched visualization: ${matchedConcept}`);
            visualization = {
              ...selectedVisualization,
              insights: undefined
            } as VisualizationSuggestion;
          } else {
            const hardcodedViz = getHardcodedVisualization(concept);
            if (hardcodedViz) {
              this.logger.log(`Using hardcoded visualization for concept: ${concept}`);
              visualization = {
                ...hardcodedViz,
                insights: undefined
              } as VisualizationSuggestion;
            } else if (response.suggestedVisualizationType && response.suggestedVisualizationType !== 'none') {
              try {
                this.logger.log(`Trying question-based visualization as final fallback`);
                visualization = await this.generateQuestionBasedVisualization(
                  concept,
                  question,
                  response.suggestedVisualizationType,
                  userLevel
                );
              } catch (fallbackError) {
                this.logger.warn('Failed to generate fallback visualization, continuing without visualization:', fallbackError);
              }
            }
          }
        }
      }

      let learningPath: Array<{ id: string; name: string; level: number }> | undefined;
      if (this.pathFinder) {
        try {
          const pathResult = await this.pathFinder.getLearningPath(concept);
          learningPath = pathResult.path;
          this.logger.log(`Generated learning path for ${concept}: ${learningPath?.length || 0} nodes`);
        } catch (pathError) {
          this.logger.warn('Failed to generate learning path, continuing without path:', pathError);
        }
      }

      // 提取来源信息
      const citations = ragContext.length > 0 ? ragContext.map(r => ({
        chunkId: r.chunkId,
        content: r.content,
        chapter: r.metadata.chapter,
        section: r.metadata.section,
      })) : undefined;

      const sources = ragContext.length > 0 ? (() => {
        const sourceMap = new Map<string, { documentId: string; title: string; chapter?: string; section?: string }>();
        for (const result of ragContext) {
          if (!sourceMap.has(result.documentId)) {
            const title = result.metadata.chapter 
              ? `${result.metadata.chapter}${result.metadata.section ? ' - ' + result.metadata.section : ''}`
              : `文档 ${result.documentId}`;
            sourceMap.set(result.documentId, {
              documentId: result.documentId,
              title,
              chapter: result.metadata.chapter,
              section: result.metadata.section,
            });
          }
        }
        return Array.from(sourceMap.values());
      })() : undefined;

      return {
        textAnswer: this.cleanTextAnswer(
          response.textAnswer,
          response.examples,
          response.followUpQuestions,
          response.relatedConcepts
        ),
        visualization,
        a2uiTemplate,
        examples: response.examples,
        followUpQuestions: response.followUpQuestions,
        relatedConcepts: response.relatedConcepts,
        learningPath,
        citations,
        sources,
      };
    } catch (error) {
      this.logger.error('Failed to answer question:', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        concept,
        question: question.substring(0, 100)
      });

      const errorType = this.classifyError(error);
      
      let errorMessage: string;
      let recoverySuggestion: string;

      switch (errorType) {
        case 'LLM_TIMEOUT':
          errorMessage = '很抱歉，AI响应时间过长，请求已超时。';
          recoverySuggestion = '请尝试简化您的问题，或者稍后再试。';
          break;
        case 'LLM_QUOTA_EXCEEDED':
          errorMessage = '很抱歉，API调用次数已达上限。';
          recoverySuggestion = '请稍后再试，或联系管理员增加配额。';
          break;
        case 'INVALID_JSON':
          errorMessage = '很抱歉，AI返回的数据格式有误。';
          recoverySuggestion = '请尝试重新表述您的问题。';
          break;
        case 'NETWORK_ERROR':
          errorMessage = '很抱歉，网络连接出现问题。';
          recoverySuggestion = '请检查网络连接后重试。';
          break;
        default:
          errorMessage = `很抱歉，我在处理您的问题时遇到了一些困难。`;
          recoverySuggestion = `请尝试重新表述您的问题，或者查看"${concept}"的基本可视化内容来理解相关概念。`;
      }

      return {
        textAnswer: `${errorMessage}\n\n${recoverySuggestion}`,
        followUpQuestions: [
          `什么是${concept}的核心原理？`,
          `${concept}有哪些实际应用例子？`,
          `${concept}与其他遗传学概念有什么联系？`
        ]
      };
    }
  }

  async generateA2UIForVisualization(
    visualizationType: string,
    visualizationData: any,
    context?: {
      question?: string;
      knowledgeBase?: string[];
    }
  ): Promise<A2UIPayload | undefined> {
    this.logger.log(`Generating A2UI for visualization type: ${visualizationType}`);

    if (!this.a2uiAdapter) {
      this.logger.warn('A2UIAdapterService not available, skipping A2UI generation');
      return undefined;
    }

    try {
      const a2uiPayload = await this.a2uiAdapter.generateA2UIFromVisualization(
        visualizationType,
        visualizationData
      );

      if (context) {
        a2uiPayload.metadata = {
          ...a2uiPayload.metadata,
          ...context
        };
      }

      return a2uiPayload;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to generate A2UI: ${errorMessage}`);
      return undefined;
    }
  }

  async answerQuestionWithA2UI(
    concept: string,
    question: string,
    userLevel: 'beginner' | 'intermediate' | 'advanced' = 'intermediate',
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [],
    enableA2UI: boolean = true
  ): Promise<VisualizationAnswerResponse & { a2uiPayload?: A2UIPayload }> {
    this.logger.log(`Answering question with A2UI support for concept: ${concept}`);

    const response = await this.answerQuestion(
      concept,
      question,
      userLevel,
      conversationHistory
    );

    let a2uiPayload: A2UIPayload | undefined;

    if (enableA2UI && response.visualization) {
      try {
        a2uiPayload = await this.generateA2UIForVisualization(
          response.visualization.type,
          response.visualization.data,
          {
            question,
            knowledgeBase: response.citations?.map(c => c.content)
          }
        );

        if (a2uiPayload) {
          this.logger.log(`Successfully generated A2UI payload: ${a2uiPayload.metadata?.templateId || a2uiPayload.surface.rootId}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        this.logger.warn(`Failed to generate A2UI, continuing without it: ${errorMessage}`);
      }
    }

    return {
      ...response,
      a2uiPayload
    };
  }

  /**
   * 基于问题生成可视化数据
   * @param concept 概念
   * @param question 用户问题
   * @param vizType 可视化类型
   * @param userLevel 用户水平
   * @returns 可视化建议
   */
  private async generateQuestionBasedVisualization(
    concept: string,
    question: string,
    vizType: 'punnett_square' | 'inheritance_path' | 'probability_distribution',
    _userLevel: 'beginner' | 'intermediate' | 'advanced'
  ): Promise<VisualizationSuggestion> {
    const truncatedQuestion = question.length > 50 ? question.substring(0, 50) + '...' : question;

    try {
      let ragKnowledgePoints: Record<string, any> = {};

      if (this.vectorRetrieval) {
        try {
          const retrievalResult = await this.vectorRetrieval.retrieve({
            query: `${concept} ${question}`,
            topK: 5
          });

          if (retrievalResult.data?.results && retrievalResult.data.results.length > 0) {
            ragKnowledgePoints = {
              content: retrievalResult.data.results.map(r => r.content).join('\n\n'),
              metadata: retrievalResult.data.results.map(r => r.metadata)
            };
            this.logger.log(`Retrieved ${retrievalResult.data.results.length} relevant chunks from RAG for knowledge points`);
          }
        } catch (ragError) {
          this.logger.warn('Failed to retrieve knowledge points from RAG:', ragError);
        }
      }

      switch (vizType) {
        case 'punnett_square':
          const punnettData = await this.generatePunnettSquareDataWithQuestion(concept, question, undefined, ragKnowledgePoints);
          return {
            type: 'punnett_square',
            title: `针对您的问题：${truncatedQuestion}`,
            description: `这个Punnett方格帮助您理解"${concept}"中与您的问题相关的遗传规律`,
            elements: ['配子', '基因型', '表型', '概率'],
            colors: this.getDefaultColors('punnett_square'),
            data: punnettData,
            interactions: ['hover', 'click']
          };

        case 'inheritance_path':
          const inheritanceData = await this.generateInheritancePathDataWithQuestion(concept, question, undefined, ragKnowledgePoints);
          return {
            type: 'inheritance_path',
            title: `针对您的问题：${truncatedQuestion}`,
            description: `这个遗传路径图展示"${concept}"在家族中的传递方式`,
            elements: ['世代', '基因型', '表型', '携带者'],
            colors: this.getDefaultColors('inheritance_path'),
            layout: 'hierarchical',
            interactions: ['hover', 'click'],
            data: inheritanceData
          };

        case 'probability_distribution':
          const probData = await this.generateProbabilityDistributionData(concept, undefined, ragKnowledgePoints);
          return {
            type: 'probability_distribution',
            title: `针对您的问题：${truncatedQuestion}`,
            description: `这个概率分布展示"${concept}"中各种结果的可能性`,
            elements: ['类别', '概率', '分布'],
            colors: this.getDefaultColors('probability_distribution'),
            layout: 'circular',
            interactions: ['hover', 'click'],
            data: probData
          };

        default:
          throw new Error(`Unsupported visualization type: ${vizType}`);
      }
    } catch (error) {
      this.logger.error('Failed to generate question-based visualization:', error);
      throw error;
    }
  }

  /**
   * 获取所有可用的硬编码概念列表
   * @returns 概念列表及其基本信息
   */
  async getHardcodedConcepts(): Promise<Array<{
    concept: string;
    title: string;
    type: string;
    description: string;
  }>> {
    const concepts = getHardcodedConceptList();

    return concepts.map(concept => {
      const viz = getHardcodedVisualization(concept);
      return {
        concept,
        title: viz?.title || concept,
        type: viz?.type || 'unknown',
        description: viz?.description || ''
      };
    });
  }

  /**
   * 分类错误类型
   */
  private classifyError(error: unknown): string {
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();
      
      if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
        return 'LLM_TIMEOUT';
      }
      if (errorMessage.includes('quota') || errorMessage.includes('limit') || errorMessage.includes('429')) {
        return 'LLM_QUOTA_EXCEEDED';
      }
      if (errorMessage.includes('invalid json') || errorMessage.includes('parse')) {
        return 'INVALID_JSON';
      }
      if (errorMessage.includes('network') || errorMessage.includes('econnrefused') || errorMessage.includes('fetch')) {
        return 'NETWORK_ERROR';
      }
    }
    
    return 'UNKNOWN_ERROR';
  }
}
