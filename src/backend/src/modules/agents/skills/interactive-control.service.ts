import { Injectable, Logger } from '@nestjs/common';
import { LLMService } from '../../llm/llm.service';
import {
  InteractiveControlInput,
  InteractiveControlOutput,
  VisualizationConfig,
  SkillExecutionResult,
  SkillType,
  VisualizationType,
} from '@shared/types/skill.types';

/**
 * 可视化交互控制服务
 *
 * 功能：
 * - 处理可视化交互操作
 * - 更新可视化状态
 * - 生成交互反馈
 * - 推荐下一步操作
 */
@Injectable()
export class InteractiveControlService {
  private readonly logger = new Logger(InteractiveControlService.name);

  private readonly activeVisualizations = new Map<string, VisualizationState>();

  constructor(private readonly llmService: LLMService) {}

  /**
   * 处理交互控制
   */
  async control(
    input: InteractiveControlInput,
  ): Promise<SkillExecutionResult<InteractiveControlOutput>> {
    const startTime = Date.now();

    try {
      this.logger.log(`Processing control for visualization: ${input.visualizationId}, type: ${input.controlType}`);

      const { visualizationId, controlType, parameterUpdates, currentStep } = input;

      const state = this.activeVisualizations.get(visualizationId);

      if (!state) {
        throw new Error(`Visualization not found: ${visualizationId}`);
      }

      const newState = this.updateState(state, controlType, parameterUpdates, currentStep);

      this.activeVisualizations.set(visualizationId, newState);

      const updatedVisualization = await this.applyStateToVisualization(newState);

      const processingTime = Date.now() - startTime;
      this.logger.log(`Control processed in ${processingTime}ms`);

      return {
        skill: SkillType.INTERACTIVE_CONTROL,
        success: true,
        data: {
          visualizationId,
          currentState: newState,
          updatedVisualization,
        },
        metadata: {
          processingTime,
        },
      };
    } catch (error) {
      this.logger.error('Interactive control failed:', error);

      return {
        skill: SkillType.INTERACTIVE_CONTROL,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: {
          processingTime: Date.now() - startTime,
        },
      };
    }
  }

  /**
   * 注册可视化
   */
  registerVisualization(visualizationId: string, config: VisualizationConfig): void {
    this.activeVisualizations.set(visualizationId, {
      visualizationId,
      config,
      isPlaying: false,
      currentStep: 0,
      totalSteps: this.calculateTotalSteps(config),
      parameters: this.extractInitialParameters(config),
    });

    this.logger.log(`Registered visualization: ${visualizationId}`);
  }

  /**
   * 注销可视化
   */
  unregisterVisualization(visualizationId: string): void {
    this.activeVisualizations.delete(visualizationId);
    this.logger.log(`Unregistered visualization: ${visualizationId}`);
  }

  /**
   * 获取可视化状态
   */
  getState(visualizationId: string): VisualizationState | undefined {
    return this.activeVisualizations.get(visualizationId);
  }

  /**
   * 更新状态
   */
  private updateState(
    state: VisualizationState,
    controlType: InteractiveControlInput['controlType'],
    parameterUpdates?: Record<string, number | string | boolean>,
    currentStep?: number,
  ): VisualizationState {
    const newState = { ...state };

    switch (controlType) {
      case 'play':
        newState.isPlaying = true;
        break;
      case 'pause':
        newState.isPlaying = false;
        break;
      case 'step_forward':
        newState.currentStep = Math.min(state.currentStep + 1, state.totalSteps);
        newState.isPlaying = false;
        break;
      case 'step_backward':
        newState.currentStep = Math.max(state.currentStep - 1, 0);
        newState.isPlaying = false;
        break;
      case 'reset':
        newState.isPlaying = false;
        newState.currentStep = 0;
        newState.parameters = this.extractInitialParameters(state.config);
        break;
      case 'update_parameter':
        if (parameterUpdates) {
          newState.parameters = { ...state.parameters, ...parameterUpdates };
          newState.currentStep = 0;
        }
        break;
    }

    if (currentStep !== undefined) {
      newState.currentStep = currentStep;
    }

    return newState;
  }

  /**
   * 将状态应用到可视化
   */
  private async applyStateToVisualization(
    state: VisualizationState,
  ): Promise<InteractiveControlOutput['updatedVisualization']> {
    const { config, currentStep, parameters } = state;

    const updatedData = await this.updateVisualizationData(config, currentStep, parameters);
    const highlights = this.getHighlightsForStep(config, currentStep);

    return {
      data: updatedData,
      highlights,
    };
  }

  /**
   * 更新可视化数据
   */
  private async updateVisualizationData(
    config: VisualizationConfig,
    step: number,
    parameters: Record<string, unknown>,
  ): Promise<unknown> {
    switch (config.type) {
      case VisualizationType.PUNNETT_SQUARE:
        return this.updatePunnettSquareData(config.data, parameters);
      case VisualizationType.INHERITANCE_PATH:
        return this.updateInheritancePathData(config.data, step, parameters);
      case VisualizationType.PROBABILITY_DISTRIBUTION:
        return this.updateProbabilityDistributionData(config.data, parameters);
      case VisualizationType.MEIOSIS_ANIMATION:
        return this.updateMeiosisAnimationData(config.data, step, parameters);
      case VisualizationType.CHROMOSOME_BEHAVIOR:
        return this.updateChromosomeBehaviorData(config.data, step, parameters);
      default:
        return config.data;
    }
  }

  /**
   * 更新庞氏方格数据
   */
  private async updatePunnettSquareData(data: unknown, parameters: Record<string, unknown>): Promise<unknown> {
    if (parameters.maleGenotype || parameters.femaleGenotype) {
      interface Offspring {
        genotype: string;
        phenotype: string;
        probability: number;
        sex?: string;
      }

      interface PunnettData {
        maleGametes: string[];
        femaleGametes: string[];
        offspring: Offspring[];
      }

      const punnettData = data as PunnettData;

      const maleGametes = parameters.maleGenotype
        ? this.extractGametes(parameters.maleGenotype as string)
        : punnettData.maleGametes;
      const femaleGametes = parameters.femaleGenotype
        ? this.extractGametes(parameters.femaleGenotype as string)
        : punnettData.femaleGametes;

      const offspring: Offspring[] = [];
      for (const maleGamete of maleGametes) {
        for (const femaleGamete of femaleGametes) {
          const genotype = this.combineGametes(maleGamete, femaleGamete);
          const phenotype = this.determinePhenotype(genotype);
          const probability = 1 / (maleGametes.length * femaleGametes.length);

          offspring.push({
            genotype,
            phenotype,
            probability,
            sex: genotype.includes('Y') ? 'male' : genotype.includes('X') ? 'female' : undefined,
          });
        }
      }

      return {
        ...punnettData,
        maleGametes,
        femaleGametes,
        offspring,
      };
    }

    return data;
  }

  /**
   * 更新遗传路径数据
   */
  private async updateInheritancePathData(data: unknown, step: number, _parameters: Record<string, unknown>): Promise<unknown> {
    interface Individual {
      id: string;
      sex: string;
      genotype: string;
      phenotype: string;
      affected: boolean;
      carrier?: boolean;
      parents?: string[];
    }

    interface Generation {
      generation: number;
      individuals: Individual[];
    }

    interface InheritancePathData {
      generations: Generation[];
    }

    const inheritanceData = data as InheritancePathData;

    const highlightedIndividuals = step > 0 && step <= inheritanceData.generations.length
      ? inheritanceData.generations[step - 1].individuals.map(ind => ind.id)
      : [];

    return {
      ...inheritanceData,
      highlightedIndividuals,
    };
  }

  /**
   * 更新概率分布数据
   */
  private async updateProbabilityDistributionData(data: unknown, parameters: Record<string, unknown>): Promise<unknown> {
    interface ProbabilityDistributionData {
      categories: string[];
      values: number[];
      formula: string;
      parameters: { p: number; q: number };
    }

    const probData = data as ProbabilityDistributionData;

    if (parameters.p !== undefined || parameters.q !== undefined) {
      const p = parameters.p as number ?? probData.parameters.p;
      const q = parameters.q as number ?? probData.parameters.q;

      return {
        ...probData,
        values: [
          p * p,
          2 * p * q,
          q * q,
        ],
        parameters: { p, q },
      };
    }

    return data;
  }

  /**
   * 更新减数分裂动画数据
   */
  private async updateMeiosisAnimationData(data: unknown, step: number, _parameters: Record<string, unknown>): Promise<unknown> {
    interface Stage {
      name: string;
      description: string;
      chromosomeCount: number;
      keyEvent: string;
    }

    interface MeiosisData {
      stages: Stage[];
      duration: number;
      highlights: string[];
    }

    const meiosisData = data as MeiosisData;

    const currentStage = step >= 0 && step < meiosisData.stages.length
      ? meiosisData.stages[step]
      : null;

    return {
      ...meiosisData,
      currentStage,
      highlights: currentStage ? [currentStage.keyEvent] : [],
    };
  }

  /**
   * 更新染色体行为数据
   */
  private async updateChromosomeBehaviorData(data: unknown, _step: number, parameters: Record<string, unknown>): Promise<unknown> {
    interface Gene {
      name: string;
      position: number;
      dominant: boolean;
    }

    interface Chromosome {
      id: string;
      name: string;
      length: number;
      color: string;
      genes: Gene[];
    }

    interface ChromosomeBehaviorData {
      chromosomes: Chromosome[];
      behavior: {
        type: string;
        description: string;
        stage: string;
      };
    }

    const behaviorData = data as ChromosomeBehaviorData;

    if (parameters.behaviorType) {
      const behaviorDescriptions: Record<string, string> = {
        segregation: '同源染色体在减数分裂时分离到不同配子',
        recombination: '同源染色体间发生基因互换',
        assortment: '非同源染色体随机组合进入配子',
      };

      return {
        ...behaviorData,
        behavior: {
          type: parameters.behaviorType as string,
          description: behaviorDescriptions[parameters.behaviorType as string] || '',
          stage: '后期 I',
        },
      };
    }

    return data;
  }

  /**
   * 获取步骤高亮
   */
  private getHighlightsForStep(config: VisualizationConfig, step: number): string[] {
    const data = config.data as any;
    const highlightsMap: Record<VisualizationType, string[]> = {
      [VisualizationType.PUNNETT_SQUARE]: [],
      [VisualizationType.INHERITANCE_PATH]: [],
      [VisualizationType.PROBABILITY_DISTRIBUTION]: [],
      [VisualizationType.MEIOSIS_ANIMATION]: data?.highlights?.[step] ? [data.highlights[step]] : [],
      [VisualizationType.CHROMOSOME_BEHAVIOR]: [],
      [VisualizationType.KNOWLEDGE_GRAPH]: [],
      [VisualizationType.PEDIGREE_CHART]: [],
      [VisualizationType.DNA_REPLICATION]: [],
      [VisualizationType.PROTEIN_SYNTHESIS]: [],
      [VisualizationType.GENE_EXPRESSION]: [],
    };

    return highlightsMap[config.type] || [];
  }

  /**
   * 计算总步数
   */
  private calculateTotalSteps(config: VisualizationConfig): number {
    const data = config.data as any;
    switch (config.type) {
      case VisualizationType.MEIOSIS_ANIMATION:
        return data?.stages?.length || 9;
      case VisualizationType.INHERITANCE_PATH:
        return data?.generations?.length || 3;
      default:
        return 1;
    }
  }

  /**
   * 提取初始参数
   */
  private extractInitialParameters(config: VisualizationConfig): Record<string, unknown> {
    const params: Record<string, unknown> = {};

    if (config.parameters) {
      for (const param of config.parameters) {
        params[param.key] = param.defaultValue;
      }
    }

    return params;
  }

  /**
   * 辅助方法：提取配子
   */
  private extractGametes(genotype: string): string[] {
    const alleles = genotype.replace(/\s/g, '').split(/[XY]/);
    const gametes: string[] = [];
    const n = alleles.length / 2;

    for (let i = 0; i < n; i++) {
      gametes.push(alleles[i] + alleles[i + n]);
    }

    return gametes;
  }

  /**
   * 辅助方法：组合配子
   */
  private combineGametes(maleGamete: string, femaleGamete: string): string {
    return maleGamete + ' ' + femaleGamete;
  }

  /**
   * 辅助方法：确定表型
   */
  private determinePhenotype(genotype: string): string {
    if (genotype.includes('Y')) {
      return genotype.includes('X^a') ? '患病' : '正常';
    }
    return genotype.includes('X^A') ? '正常/携带者' : '患病';
  }

  /**
   * 获取推荐操作
   */
  async getRecommendedActions(
    visualizationId: string,
    currentState: VisualizationState,
  ): Promise<SkillExecutionResult<{ actions: string[]; reasoning: string }>> {
    interface RecommendedActions {
      actions: string[];
      reasoning: string;
    }

    const prompt = `你是可视化交互推荐专家。根据当前状态推荐用户操作。

可视化ID：${visualizationId}
类型：${currentState.config.type}
当前步骤：${currentState.currentStep}/${currentState.totalSteps}
播放状态：${currentState.isPlaying ? '播放中' : '暂停'}
当前参数：${JSON.stringify(currentState.parameters)}

请返回 JSON 格式：
{
  "actions": ["操作1", "操作2", ...],
  "reasoning": "推荐理由"
}

注意事项：
- 操作包括：play, pause, step_forward, step_backward, reset, update_parameter:xxx
- 推荐要考虑当前状态
- 操作要简洁明确
- 使用中文`;

    try {
      const result = await this.llmService.structuredChat<RecommendedActions>(
        [{ role: 'user', content: prompt }],
        { response_format: { type: 'json_object' } },
      );

      return {
        skill: SkillType.INTERACTIVE_CONTROL,
        success: true,
        data: result,
      };
    } catch (error) {
      this.logger.error('Recommended actions generation failed:', error);

      return {
        skill: SkillType.INTERACTIVE_CONTROL,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

interface VisualizationState {
  visualizationId: string;
  config: VisualizationConfig;
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  parameters: Record<string, unknown>;
}
