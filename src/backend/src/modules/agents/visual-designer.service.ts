import { Injectable, Logger } from '@nestjs/common';
import { LLMService } from '../llm/llm.service';
import { VisualizationRAGService } from './visualization-rag.service';
import { PathFinderService } from '../knowledge-graph/services/path-finder.service';
import {
  VisualizationSuggestion,
  ConceptAnalysis,
  GeneticsEnrichment,
  PrerequisiteNode,
  PunnettSquareData,
  InheritancePathData,
  ProbabilityDistributionData,
  UnderstandingInsight,
  VisualizationAnswerResponse,
} from '@shared/types/agent.types';
import {
  getHardcodedVisualization,
  getHardcodedConceptList,
} from './data/hardcoded-visualizations.data';

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
    private readonly visualizationRAG: VisualizationRAGService,
    private readonly pathFinder: PathFinderService,
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

    // 优先检查是否有硬编码的数据
    const hardcodedViz = getHardcodedVisualization(concept);
    if (hardcodedViz) {
      this.logger.log(`Using hardcoded visualization for: ${concept}`);

      // 生成理解提示（即使是硬编码数据也生成提示）
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

    // 没有硬编码数据，使用AI生成
    // 1. 确定可视化类型
    const vizType = this.determineVisualizationType(concept, conceptAnalysis);

    // 2. 生成可视化数据和元数据
    const result = await this.generateVisualizationData(
      concept,
      vizType,
      conceptAnalysis,
      geneticsEnrichment,
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
  ): Promise<Omit<VisualizationSuggestion, 'insights'>> {
    const baseDesign = await this.generateBaseDesign(concept, vizType, analysis, enrichment);

    let data: VisualizationSuggestion['data'] = undefined;

    switch (vizType) {
      case 'punnett_square':
        data = await this.generatePunnettSquareData(concept, enrichment);
        break;
      case 'inheritance_path':
        data = await this.generateInheritancePathData(concept, enrichment);
        break;
      case 'probability_distribution':
        data = await this.generateProbabilityDistributionData(concept, enrichment);
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
  ): Promise<PunnettSquareData> {
    const enrichmentInfo = enrichment
      ? `\n相关原理：${enrichment.principles.join(', ')}\n相关例子：${enrichment.examples.map(e => e.name).join(', ')}`
      : '';

    const prompt = `你是遗传学专家。请为"${concept}"生成一个 Punnett 方格（杂交棋盘）的数据。${enrichmentInfo}

要求：
1. 选择一个经典且具有代表性的杂交组合
2. 明确双亲的基因型和表型
3. 计算所有可能的配子组合
4. 给出每个后代的基因型、表型和概率
5. 如涉及伴性遗传，标注性别
6. 添加简要说明

返回 JSON 格式的 Punnett 方格数据。`;

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
  ): Promise<InheritancePathData> {
    const enrichmentInfo = enrichment
      ? `\n相关原理：${enrichment.principles.join(', ')}\n常见误区：${enrichment.misconceptions.join(', ')}`
      : '';

    const prompt = `你是遗传学专家。请为"${concept}"设计一个家族遗传路径的可视化数据。${enrichmentInfo}

要求：
1. 设计一个3-4代的家族系谱
2. 包含不同性别的个体
3. 清楚标注每个个体的基因型、表型、是否患病、是否携带者
4. 展示基因是如何在代际间传递的
5. 给出清晰的遗传模式解释

返回 JSON 格式的遗传路径数据。`;

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
   * 根据问题生成 Punnett 方格数据
   */
  private async generatePunnettSquareDataWithQuestion(
    concept: string,
    question: string,
    enrichment?: GeneticsEnrichment,
  ): Promise<PunnettSquareData> {
    const enrichmentInfo = enrichment
      ? `\n相关原理：${enrichment.principles.join(', ')}\n相关例子：${enrichment.examples.map(e => e.name).join(', ')}`
      : '';

    const prompt = `你是遗传学专家。用户正在学习"${concept}"概念，并提出了以下问题："${question}"

请为这个问题设计一个 Punnett 方格（杂交棋盘）的数据。${enrichmentInfo}

要求：
1. 选择一个经典且具有代表性的杂交组合，能够回答用户的问题
2. 明确双亲的基因型和表型
3. 计算所有可能的配子组合
4. 给出每个后代的基因型、表型和概率
5. 如涉及伴性遗传，标注性别
6. 添加简要说明

返回 JSON 格式的 Punnett 方格数据。`;

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
  ): Promise<InheritancePathData> {
    const enrichmentInfo = enrichment
      ? `\n相关原理：${enrichment.principles.join(', ')}\n常见误区：${enrichment.misconceptions.join(', ')}`
      : '';

    const prompt = `你是遗传学专家。用户正在学习"${concept}"概念，并提出了以下问题："${question}"

请为这个问题设计一个家族遗传路径的可视化数据。${enrichmentInfo}

要求：
1. 设计一个3-4代的家族系谱
2. 包含不同性别的个体
3. 清楚标注每个个体的基因型、表型、是否患病、是否携带者
4. 展示基因是如何在代际间传递的，特别要回答用户的问题
5. 给出清晰的遗传模式解释

返回 JSON 格式的遗传路径数据。`;

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
  ): Promise<ProbabilityDistributionData> {
    const enrichmentInfo = enrichment
      ? `\n相关公式：${enrichment.formulas.map(f => `${f.key}: ${f.latex}`).join('\n')}`
      : '';

    const prompt = `你是遗传学专家。请为"${concept}"生成一个概率分布的可视化数据。${enrichmentInfo}

要求：
1. 根据概念确定要展示的概率分布类型
2. 给出清晰的分类（如基因型类别、表型类别）
3. 计算各分类的概率值（总和应为1）
4. 如有相关公式，一并提供
5. 说明这些概率的实际意义

返回 JSON 格式的概率分布数据。`;

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

    let selectedVisualization: Omit<VisualizationSuggestion, 'insights'> | null = null;
    let matchedConcept: string | null = null;

    try {
      const matches = await this.visualizationRAG.retrieveByQuestion(question, 0.6, 3);

      if (matches.length > 0) {
        const bestMatch = matches[0];
        selectedVisualization = bestMatch.visualization;
        matchedConcept = bestMatch.concept;
        this.logger.log(`RAG found matching visualization: ${bestMatch.concept} (score: ${bestMatch.score.toFixed(3)})`);
      }
    } catch (ragError) {
      this.logger.warn('Visualization RAG retrieval failed:', ragError);
    }

    let contextInfo = '';
    if (selectedVisualization) {
      contextInfo = `\n\n相关可视化信息：\n知识点：${matchedConcept}\n标题：${selectedVisualization.title}\n描述：${selectedVisualization.description}\n元素：${selectedVisualization.elements.join('、')}`;
    } else {
      const hardcodedViz = getHardcodedVisualization(concept);
      if (hardcodedViz) {
        contextInfo = `\n\n当前可视化信息：\n标题：${hardcodedViz.title}\n描述：${hardcodedViz.description}\n元素：${hardcodedViz.elements.join('、')}`;
      }
    }

    const historyContext = conversationHistory.length > 0
      ? `\n\n对话历史：\n${conversationHistory.map(h => `${h.role}: ${h.content}`).join('\n')}`
      : '';

    const prompt = `你是遗传学教育专家。用户正在学习"${concept}"概念，并提出了以下问题。

${contextInfo}${historyContext}

用户问题：${question}

重要判断：
首先判断用户的问题是否与遗传学相关。
- 如果问题明显与遗传学无关（例如：游戏、娱乐、政治、日常闲聊等），请礼貌地说明这是遗传学学习助手，建议用户提问遗传学相关问题。
- 如果问题与遗传学相关，请详细回答。

请提供：
1. 清晰、简洁的文字回答（根据用户水平${userLevel}调整深度）
2. 如果问题可以通过可视化更好地回答，建议合适的可视化类型
3. 1-2个具体的例子，帮助用户理解概念（如果适用）
4. 2-3个后续建议问题，帮助用户深入理解（如果是非遗传学问题，可以提供遗传学相关的问题建议）

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
          description: '是否需要额外的可视化来更好地回答这个问题（非遗传学问题设为false）'
        },
        suggestedVisualizationType: {
          type: 'string',
          enum: ['punnett_square', 'inheritance_path', 'probability_distribution', 'none'],
          description: '建议的可视化类型（非遗传学问题设为none）'
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
          description: '2-3个后续建议问题。如果是非遗传学问题，可以提供遗传学相关的问题建议帮助用户回归学习主题',
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
        { temperature: 0.4 }
      );

      let visualization: VisualizationSuggestion | undefined;

      if (response.needVisualization) {
        if (selectedVisualization) {
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
              visualization = await this.generateQuestionBasedVisualization(
                concept,
                question,
                response.suggestedVisualizationType,
                userLevel
              );
            } catch (vizError) {
              this.logger.warn('Failed to generate question-based visualization, continuing without visualization:', vizError);
            }
          }
        }
      }

      let learningPath: Array<{ id: string; name: string; level: number }> | undefined;
      try {
        const pathResult = await this.pathFinder.getLearningPath(concept);
        learningPath = pathResult.path;
        this.logger.log(`Generated learning path for ${concept}: ${learningPath?.length || 0} nodes`);
      } catch (pathError) {
        this.logger.warn('Failed to generate learning path, continuing without path:', pathError);
      }

      return {
        textAnswer: response.textAnswer,
        visualization,
        examples: response.examples,
        followUpQuestions: response.followUpQuestions,
        relatedConcepts: response.relatedConcepts,
        learningPath
      };
    } catch (error) {
      this.logger.error('Failed to answer question:', error);

      return {
        textAnswer: `很抱歉，我在处理您的问题时遇到了一些困难。请尝试重新表述您的问题，或者查看"${concept}"的基本可视化内容来理解相关概念。`,
        followUpQuestions: [
          `什么是${concept}的核心原理？`,
          `${concept}有哪些实际应用例子？`,
          `${concept}与其他遗传学概念有什么联系？`
        ]
      };
    }
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
      switch (vizType) {
        case 'punnett_square':
          const punnettData = await this.generatePunnettSquareDataWithQuestion(concept, question);
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
          const inheritanceData = await this.generateInheritancePathDataWithQuestion(concept, question);
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
          const probData = await this.generateProbabilityDistributionData(concept);
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
}
