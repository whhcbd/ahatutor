import { Injectable, Logger } from '@nestjs/common';
import { LLMService } from '../../llm/llm.service';
import {
  VisualizationGenerateInput,
  VisualizationGenerateOutput,
  VisualizationType,
  VisualizationParameter,
  UnderstandingInsight,
  SkillExecutionResult,
  SkillType,
} from '@shared/types/skill.types';

/**
 * 可视化生成服务
 *
 * 功能：
 * - 根据知识点自动推荐合适的可视化类型
 * - 生成可视化配置（数据、参数、交互）
 * - 提供理解提示帮助用户学习
 */
@Injectable()
export class VisualizationGeneratorService {
  private readonly logger = new Logger(VisualizationGeneratorService.name);

  constructor(private readonly llmService: LLMService) {}

  /**
   * 生成可视化配置
   */
  async generate(
    input: VisualizationGenerateInput,
  ): Promise<SkillExecutionResult<VisualizationGenerateOutput>> {
    const startTime = Date.now();

    try {
      this.logger.log(`Generating visualization for: ${input.concept}`);

      const { concept, context, preferences } = input;

      const userLevel = context?.difficulty || 'intermediate';
      const focusAreas = context?.focusAreas || [];

      const prompt = this.buildVisualizationPrompt(concept, userLevel, focusAreas, preferences);

      interface VisualizationSuggestion {
        type: VisualizationType;
        title: string;
        description: string;
        priority: number;
        rationale: string;
        data?: unknown;
        parameters?: VisualizationParameter[];
        insights?: UnderstandingInsight[];
      }

      interface SuggestedVisualizations {
        visualizations: VisualizationSuggestion[];
        recommendedPrimary: VisualizationType;
        explanation: string;
      }

      const response = await this.llmService.structuredChat<SuggestedVisualizations>(
        [{ role: 'user', content: prompt }],
        { response_format: { type: 'json_object' } },
      );

      const processingTime = Date.now() - startTime;

      this.logger.log(`Visualization generated in ${processingTime}ms, found ${response.visualizations.length} types`);

      return {
        skill: SkillType.VISUALIZATION_GENERATE,
        success: true,
        data: {
          concept,
          visualizations: response.visualizations.map(v => ({
            type: v.type,
            title: v.title,
            description: v.description,
            data: v.data,
            parameters: v.parameters,
            insights: v.insights,
            interactions: this.getInteractionTypes(v.type) as any,
          })),
          recommendedPrimary: response.recommendedPrimary,
          explanation: response.explanation,
        },
        metadata: {
          processingTime,
        },
      };
    } catch (error) {
      this.logger.error('Visualization generation failed:', error);

      return {
        skill: SkillType.VISUALIZATION_GENERATE,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: {
          processingTime: Date.now() - startTime,
        },
      };
    }
  }

  /**
   * 构建可视化生成的 Prompt
   */
  private buildVisualizationPrompt(
    concept: string,
    userLevel: 'beginner' | 'intermediate' | 'advanced',
    focusAreas: string[],
    _preferences?: VisualizationGenerateInput['preferences'],
  ): string {
    const levelDescription = {
      beginner: '初学者，需要直观、简单的可视化',
      intermediate: '有一定基础，需要中等复杂度的可视化',
      advanced: '深入理解，需要详细、专业的可视化',
    };

    const focusStr = focusAreas.length > 0 ? `特别关注：${focusAreas.join('、')}` : '';

    return `你是一个遗传学可视化专家。请为以下遗传学概念推荐合适的可视化方案。

概念：${concept}
用户水平：${userLevel} - ${levelDescription[userLevel]}
${focusStr}

可用的可视化类型：
1. knowledge_graph - 知识图谱：展示概念之间的关系和知识结构
2. punnett_square - 庞氏方格：展示基因型和表型的遗传比例
3. inheritance_path - 遗传路径：展示遗传性状在家族中的传递
4. pedigree_chart - 系谱图：展示家族遗传史
5. probability_distribution - 概率分布：展示遗传比例和概率
6. meiosis_animation - 减数分裂动画：展示减数分裂过程
7. chromosome_behavior - 染色体行为：展示染色体的分离、组合等
8. dna_replication - DNA复制动画：展示DNA复制过程
9. protein_synthesis - 蛋白质合成动画：展示中心法则
10. gene_expression - 基因表达：展示基因调控过程

请分析这个概念，返回 JSON 格式：
{
  "recommendedPrimary": "最推荐的可视化类型（从上面10种中选择）",
  "explanation": "解释为什么推荐这些可视化，以及它们如何帮助理解这个概念（200字以内）",
  "visualizations": [
    {
      "type": "可视化类型",
      "title": "可视化标题",
      "description": "这个可视化要展示什么（100字以内）",
      "priority": 1-10（10为最重要）,
      "rationale": "为什么这个可视化适合这个概念（50字以内）",
      "data": {
        "data": 根据可视化类型提供示例数据结构
      },
      "parameters": [
        {
          "key": "参数名",
          "label": "参数显示名称",
          "type": "slider|input|select|toggle|radio",
          "defaultValue": 默认值,
          "min": 最小值（仅slider）,
          "max": 最大值（仅slider）,
          "step": 步长（仅slider）,
          "options": [{"value": "值", "label": "显示名"}]（仅select/radio）,
          "description": "参数说明"
        }
      ],
      "insights": [
        {
          "keyPoint": "关键知识点",
          "visualConnection": "如何通过可视化理解这个点",
          "commonMistake": "常见错误理解",
          "checkQuestion": "自检问题"
        }
      ]
    }
  ]
}

注意事项：
- 推荐 2-4 种最适合的可视化类型
- 每种可视化提供具体的参数配置
- 提供帮助用户从可视化中学习的理解提示
- 根据 ${concept} 的特点选择最合适的可视化类型`;
  }

  /**
   * 获取可视化支持的交互类型
   */
  private getInteractionTypes(
    type: VisualizationType,
  ): Array<{ type: string; description: string }> {
    const interactionMap: Record<VisualizationType, Array<{ type: string; description: string }>> = {
      [VisualizationType.KNOWLEDGE_GRAPH]: [
        { type: 'click', description: '点击节点查看详情' },
        { type: 'hover', description: '悬停显示关联' },
        { type: 'zoom', description: '缩放查看结构' },
        { type: 'drag', description: '拖拽调整布局' },
      ],
      [VisualizationType.PUNNETT_SQUARE]: [
        { type: 'hover', description: '悬停查看基因型信息' },
        { type: 'click', description: '点击选择配子组合' },
      ],
      [VisualizationType.INHERITANCE_PATH]: [
        { type: 'click', description: '点击个体查看基因型' },
        { type: 'hover', description: '悬停显示表型' },
      ],
      [VisualizationType.PEDIGREE_CHART]: [
        { type: 'hover', description: '悬停查看个体信息' },
        { type: 'click', description: '点击高亮遗传路径' },
        { type: 'zoom', description: '缩放查看细节' },
      ],
      [VisualizationType.PROBABILITY_DISTRIBUTION]: [
        { type: 'hover', description: '悬停查看数值' },
      ],
      [VisualizationType.MEIOSIS_ANIMATION]: [
        { type: 'click', description: '点击播放/暂停' },
        { type: 'hover', description: '悬停暂停并说明' },
      ],
      [VisualizationType.CHROMOSOME_BEHAVIOR]: [
        { type: 'click', description: '点击选择染色体' },
        { type: 'drag', description: '拖拽移动染色体' },
      ],
      [VisualizationType.DNA_REPLICATION]: [
        { type: 'click', description: '点击播放/暂停' },
        { type: 'hover', description: '悬停查看碱基配对' },
      ],
      [VisualizationType.PROTEIN_SYNTHESIS]: [
        { type: 'click', description: '点击播放/暂停' },
        { type: 'hover', description: '悬停查看分子结构' },
      ],
      [VisualizationType.GENE_EXPRESSION]: [
        { type: 'click', description: '点击调控元件' },
        { type: 'hover', description: '悬停查看功能说明' },
      ],
    };

    return interactionMap[type] || [];
  }

  /**
   * 为学习路径生成可视化
   */
  async generateForLearningPath(
    concepts: string[],
    userLevel?: 'beginner' | 'intermediate' | 'advanced',
  ): Promise<Map<string, VisualizationGenerateOutput>> {
    const visualizationMap = new Map<string, VisualizationGenerateOutput>();

    for (const concept of concepts) {
      const result = await this.generate({
        concept,
        context: { difficulty: userLevel },
      });

      if (result.success && result.data) {
        visualizationMap.set(concept, result.data);
      }
    }

    return visualizationMap;
  }

  /**
   * 批量生成可视化（用于速通模式）
   */
  async generateBatch(
    inputs: VisualizationGenerateInput[],
  ): Promise<SkillExecutionResult<Map<string, VisualizationGenerateOutput>>> {
    const startTime = Date.now();
    const resultMap = new Map<string, VisualizationGenerateOutput>();
    let failedCount = 0;

    for (const input of inputs) {
      const result = await this.generate(input);
      if (result.success && result.data) {
        resultMap.set(input.concept, result.data);
      } else {
        failedCount++;
      }
    }

    const processingTime = Date.now() - startTime;

    return {
      skill: SkillType.VISUALIZATION_GENERATE,
      success: failedCount === 0,
      data: resultMap,
      metadata: {
        processingTime,
      },
    };
  }
}
