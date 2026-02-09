import { Injectable, Logger } from '@nestjs/common';
import { LLMService } from '../llm/llm.service';
import { VisualizationSuggestion, ConceptAnalysis, GeneticsEnrichment, PrerequisiteNode } from '@shared/types/agent.types';

/**
 * Agent 4: VisualDesigner
 * "如何展示这个概念？"
 *
 * 职责：设计最佳的可视化方案
 * - 确定可视化类型（知识图谱/动画/图表）
 * - 设计颜色方案
 * - 定义交互逻辑
 * - 生成渲染配置
 */
@Injectable()
export class VisualDesignerService {
  private readonly logger = new Logger(VisualDesignerService.name);

  // 遗传学可视化模板库
  private readonly visualizationTemplates = {
    // 知识图谱相关
    knowledge_graph: {
      default: {
        type: 'knowledge_graph' as const,
        layout: 'force',
        nodeSize: 20,
        linkDistance: 100,
        colors: {
          foundation: '#4CAF50',    // 基础概念 - 绿色
          intermediate: '#2196F3',  // 中级概念 - 蓝色
          advanced: '#9C27B0',      // 高级概念 - 紫色
          target: '#F44336',        // 目标概念 - 红色
        },
      },
      hierarchical: {
        type: 'knowledge_graph' as const,
        layout: 'hierarchical',
        direction: 'TB',            // Top to Bottom
        nodeSize: 25,
        levelSpacing: 80,
        colors: {
          byLevel: true,
        },
      },
    },

    // Punnett 方格
    punnett_square: {
      type: 'chart' as const,
      chartType: 'table',
      cellSize: 60,
      highlightDominant: '#4CAF50',
      highlightRecessive: '#FF9800',
      highlightHeterozygous: '#2196F3',
    },

    // 染色体动画
    chromosome_animation: {
      type: 'animation' as const,
      animationType: 'meiosis',
      duration: 5000,               // 5秒
      keyframes: [
        { time: 0, action: 'interphase' },
        { time: 0.2, action: 'prophase' },
        { time: 0.4, action: 'metaphase' },
        { time: 0.6, action: 'anaphase' },
        { time: 0.8, action: 'telophase' },
      ],
      colors: {
        chromosomeA: '#E91E63',
        chromosomeB: '#3F51B5',
        centromere: '#FFC107',
      },
    },

    // 遗传系谱图
    pedigree_chart: {
      type: 'diagram' as const,
      symbol: 'standard',
      male: {
        shape: 'square',
        color: '#64B5F6',
        affected: '#1976D2',
      },
      female: {
        shape: 'circle',
        color: '#F06292',
        affected: '#C2185B',
      },
      carrier: {
        pattern: 'striped',
      },
    },

    // 概率分布图
    probability_distribution: {
      type: 'chart' as const,
      chartType: 'bar',
      colors: {
        dominant: '#66BB6A',
        heterozygous: '#42A5F5',
        recessive: '#FFA726',
      },
    },

    // DNA 结构
    dna_structure: {
      type: 'animation' as const,
      animationType: 'rotation',
      duration: 10000,
      colors: {
        adenine: '#E53935',
        thymine: '#1E88E5',
        guanine: '#43A047',
        cytosine: '#FB8C00',
        backbone: '#37474F',
      },
    },
  };

  // 可视化类型关键词映射
  private readonly visualizationKeywords = {
    knowledge_graph: [
      '关系', '联系', '依赖', '前置', '基础',
      'relation', 'connection', 'dependency', 'prerequisite'
    ],
    animation: [
      '过程', '分裂', '复制', '转录', '翻译',
      'process', 'division', 'replication', 'transcription', 'translation'
    ],
    chart: [
      '比例', '概率', '分布', '统计', '频率',
      'ratio', 'probability', 'distribution', 'statistics', 'frequency'
    ],
    diagram: [
      '结构', '系谱', '家谱', '流程', '路径',
      'structure', 'pedigree', 'flow', 'path'
    ],
  };

  constructor(private readonly llmService: LLMService) {}

  /**
   * 设计可视化方案
   */
  async designVisualization(
    concept: string,
    conceptAnalysis: ConceptAnalysis,
    geneticsEnrichment?: GeneticsEnrichment,
    prerequisiteTree?: PrerequisiteNode,
  ): Promise<VisualizationSuggestion> {
    this.logger.log(`Designing visualization for: ${concept}`);

    // 1. 基于关键词快速判断可视化类型
    const quickType = this.detectVisualizationType(concept, conceptAnalysis);

    // 2. 使用 LLM 细化设计方案
    const refined = await this.refineVisualizationDesign(
      concept,
      quickType,
      conceptAnalysis,
      geneticsEnrichment,
      prerequisiteTree,
    );

    // 3. 应用预定义模板
    const withTemplate = this.applyTemplate(concept, refined);

    this.logger.log(`Visualization designed: ${withTemplate.type}`);
    return withTemplate;
  }

  /**
   * 基于关键词快速检测可视化类型
   */
  private detectVisualizationType(
    concept: string,
    analysis: ConceptAnalysis,
  ): 'knowledge_graph' | 'animation' | 'chart' | 'diagram' {
    const searchText = `${concept} ${analysis.keyTerms.join(' ')}`.toLowerCase();

    for (const [type, keywords] of Object.entries(this.visualizationKeywords)) {
      for (const keyword of keywords) {
        if (searchText.includes(keyword.toLowerCase())) {
          return type as 'knowledge_graph' | 'animation' | 'chart' | 'diagram';
        }
      }
    }

    // 默认返回知识图谱
    return 'knowledge_graph';
  }

  /**
   * 使用 LLM 细化可视化设计
   */
  private async refineVisualizationDesign(
    concept: string,
    detectedType: 'knowledge_graph' | 'animation' | 'chart' | 'diagram',
    conceptAnalysis: ConceptAnalysis,
    geneticsEnrichment?: GeneticsEnrichment,
    prerequisiteTree?: PrerequisiteNode,
  ): Promise<Omit<VisualizationSuggestion, 'type'>> {
    const prompt = `你是一位数据可视化专家。请为以下遗传学概念设计最佳的可视化方案。

概念: ${concept}
领域: ${conceptAnalysis.domain}
复杂度: ${conceptAnalysis.complexity}
可视化潜力: ${conceptAnalysis.visualizationPotential}
建议的可视化: ${conceptAnalysis.suggestedVisualizations.join(', ')}

${geneticsEnrichment ? `
遗传学原理: ${geneticsEnrichment.principles.join(', ')}
相关公式: ${geneticsEnrichment.formulas.map(f => f.key).join(', ')}
` : ''}

${prerequisiteTree ? `
前置知识层级: ${this.getTreeDepth(prerequisiteTree)} 层
` : ''}

初步判断类型: ${detectedType}

请返回 JSON 格式的可视化设计方案：`;

    const schema = {
      type: 'object',
      properties: {
        elements: {
          type: 'array',
          items: { type: 'string' },
          description: '需要展示的元素列表'
        },
        colors: {
          type: 'object',
          description: '颜色方案映射'
        },
        layout: {
          type: 'string',
          enum: ['force', 'hierarchical', 'circular', 'grid'],
          description: '布局方式'
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
          description: '动画配置（如适用）',
          properties: {
            duration: { type: 'number' },
            easing: { type: 'string' },
            autoplay: { type: 'boolean' }
          }
        }
      },
      required: ['elements']
    };

    try {
      const response = await this.llmService.structuredChat<typeof schema>(
        [{ role: 'user', content: prompt }],
        schema,
        { temperature: 0.3 }
      );

      return {
        elements: response.elements || [],
        colors: response.colors,
        layout: response.layout,
        interactions: response.interactions,
        annotations: response.annotations,
        animationConfig: response.animationConfig,
      };
    } catch (error) {
      this.logger.error('Failed to refine visualization design:', error);
      // 返回基础设计
      return {
        elements: [concept, ...conceptAnalysis.keyTerms.slice(0, 3)],
        colors: {},
      };
    }
  }

  /**
   * 应用预定义模板
   */
  private applyTemplate(
    concept: string,
    design: Omit<VisualizationSuggestion, 'type'>,
  ): VisualizationSuggestion {
    // 检查是否匹配特定遗传学概念的模板
    const specialCases = [
      { keywords: ['punnett', '方格', '杂交'], template: this.visualizationTemplates.punnett_square },
      { keywords: ['减数', '分裂', 'meiosis'], template: this.visualizationTemplates.chromosome_animation },
      { keywords: ['系谱', '家谱', 'pedigree'], template: this.visualizationTemplates.pedigree_chart },
      { keywords: ['概率', '比例', '分布'], template: this.visualizationTemplates.probability_distribution },
      { keywords: ['dna', '结构', '双螺旋'], template: this.visualizationTemplates.dna_structure },
    ];

    const conceptLower = concept.toLowerCase();

    for (const { keywords, template } of specialCases) {
      if (keywords.some(k => conceptLower.includes(k))) {
        this.logger.debug(`Applying special template: ${template.type}`);
        return {
          type: template.type as VisualizationSuggestion['type'],
          elements: design.elements,
          colors: { ...template.colors, ...design.colors },
          layout: design.layout || (template as any).layout,
          interactions: design.interactions,
          annotations: design.annotations,
          animationConfig: design.animationConfig || (template as any).animationConfig,
          template,  // 保存完整模板供渲染使用
        };
      }
    }

    // 默认使用知识图谱模板
    const defaultTemplate = design.layout === 'hierarchical'
      ? this.visualizationTemplates.knowledge_graph.hierarchical
      : this.visualizationTemplates.knowledge_graph.default;

    return {
      type: 'knowledge_graph',
      elements: design.elements,
      colors: { ...defaultTemplate.colors, ...design.colors },
      layout: design.layout || defaultTemplate.layout,
      interactions: design.interactions || ['click', 'hover', 'zoom'],
      annotations: design.annotations,
    };
  }

  /**
   * 生成 D3.js 渲染配置
   */
  async generateD3Config(visualization: VisualizationSuggestion): Promise<Record<string, unknown>> {
    const baseConfig = {
      type: visualization.type,
      elements: visualization.elements,
      colors: visualization.colors,
      layout: visualization.layout,
      interactions: visualization.interactions,
    };

    // 根据类型添加特定配置
    switch (visualization.type) {
      case 'knowledge_graph':
        return {
          ...baseConfig,
          simulation: {
            forceCharge: -300,
            forceLink: { distance: visualization.layout === 'hierarchical' ? 80 : 100 },
            forceCenter: { strength: 0.1 },
          },
          node: {
            radius: 20,
            strokeWidth: 2,
          },
          link: {
            strokeWidth: 1.5,
            opacity: 0.6,
          },
        };

      case 'animation':
        return {
          ...baseConfig,
          animation: visualization.animationConfig || {
            duration: 5000,
            easing: 'easeInOut',
            autoplay: true,
            loop: false,
          },
        };

      case 'chart':
        return {
          ...baseConfig,
          chart: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'top' },
              tooltip: { enabled: true },
            },
          },
        };

      case 'diagram':
        return {
          ...baseConfig,
          renderer: 'svg',
          scalable: true,
          exportable: true,
        };

      default:
        return baseConfig;
    }
  }

  /**
   * 生成可视化代码模板
   */
  async generateVisualizationCode(
    visualization: VisualizationSuggestion,
    data?: Record<string, unknown>,
  ): Promise<string> {
    const codePrompt = `请为以下可视化配置生成 D3.js 渲染代码：

可视化类型: ${visualization.type}
元素: ${JSON.stringify(visualization.elements)}
颜色: ${JSON.stringify(visualization.colors)}
布局: ${visualization.layout}
交互: ${JSON.stringify(visualization.interactions)}

${data ? `数据: ${JSON.stringify(data)}` : ''}

要求：
1. 生成完整的 TypeScript 代码
2. 使用 D3.js v7
3. 包含必要的类型定义
4. 添加详细的注释
5. 代码应该可以直接在 React 组件中使用

请只返回代码，不要任何解释文字。`;

    try {
      const response = await this.llmService.chat(
        [{ role: 'user', content: codePrompt }],
        { temperature: 0.2 }
      );

      return response.content;
    } catch (error) {
      this.logger.error('Failed to generate visualization code:', error);
      throw error;
    }
  }

  /**
   * 获取知识树深度
   */
  private getTreeDepth(node: PrerequisiteNode): number {
    if (!node.prerequisites || node.prerequisites.length === 0) {
      return 1;
    }
    return 1 + Math.max(...node.prerequisites.map(p => this.getTreeDepth(p)));
  }

  /**
   * 为知识图谱生成节点和边数据
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
}
