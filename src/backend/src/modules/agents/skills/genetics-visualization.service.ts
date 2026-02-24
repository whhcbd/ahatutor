import { Injectable, Logger } from '@nestjs/common';
import { GeneticsVisualizationInput, GeneticsVisualizationOutput, VisualizationConfig, VisualizationType, SkillExecutionResult, SkillType } from '@shared/types/skill.types';
import { UnderstandingInsight,  } from '@shared/types/agent.types';
import { PunnettSquareData, InheritancePathData, ProbabilityDistributionData, MeiosisAnimationData, ChromosomeBehaviorData,  } from '@shared/types/agent.types';
import { HARDCODED_VISUALIZATIONS, isHardcodedConcept } from '../data/hardcoded-visualizations.data';

/**
 * 遗传学专用可视化服务
 *
 * 功能：
 * - 生成遗传学特定的可视化数据
 * - 支持庞氏方格、遗传路径、概率分布等
 * - 提供遗传学上下文和原理
 */
@Injectable()
export class GeneticsVisualizationService {
  private readonly logger = new Logger(GeneticsVisualizationService.name);

  /**
   * 生成遗传学可视化
   */
  async generate(
    input: GeneticsVisualizationInput,
  ): Promise<SkillExecutionResult<GeneticsVisualizationOutput>> {
    const startTime = Date.now();

    try {
      this.logger.log(`Generating genetics visualization for: ${input.concept}, type: ${input.visualizationType}`);

      const { concept, visualizationType, parameters, scenario } = input;

      let visualizationConfig: VisualizationConfig;
      let geneticContext;

      switch (visualizationType) {
        case VisualizationType.PUNNETT_SQUARE:
          visualizationConfig = this.generatePunnettSquare(concept, parameters, scenario);
          geneticContext = this.getPunnettSquareContext(concept);
          break;
        case VisualizationType.INHERITANCE_PATH:
          visualizationConfig = this.generateInheritancePath(concept, parameters, scenario);
          geneticContext = this.getInheritancePathContext(concept);
          break;
        case VisualizationType.PROBABILITY_DISTRIBUTION:
          visualizationConfig = this.generateProbabilityDistribution(concept, parameters);
          geneticContext = this.getProbabilityDistributionContext(concept);
          break;
        case VisualizationType.MEIOSIS_ANIMATION:
          visualizationConfig = this.generateMeiosisAnimation(concept, parameters);
          geneticContext = this.getMeiosisContext(concept);
          break;
        case VisualizationType.CHROMOSOME_BEHAVIOR:
          visualizationConfig = this.generateChromosomeBehavior(concept, parameters);
          geneticContext = this.getChromosomeBehaviorContext(concept);
          break;
        default:
          throw new Error(`Unsupported visualization type: ${visualizationType}`);
      }

      const processingTime = Date.now() - startTime;
      this.logger.log(`Genetics visualization generated in ${processingTime}ms`);

      return {
        skill: SkillType.GENETICS_VISUALIZATION,
        success: true,
        data: {
          visualizationConfig,
          geneticContext,
          interactiveSteps: this.getInteractiveSteps(visualizationType),
        },
        metadata: {
          processingTime,
        },
      };
    } catch (error) {
      this.logger.error('Genetics visualization generation failed:', error);

      return {
        skill: SkillType.GENETICS_VISUALIZATION,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: {
          processingTime: Date.now() - startTime,
        },
      };
    }
  }

  /**
   * 生成庞氏方格
   */
  private generatePunnettSquare(
    concept: string,
    parameters?: Record<string, unknown>,
    scenario?: GeneticsVisualizationInput['scenario'],
  ): VisualizationConfig {
    const parentalCross = scenario?.parentalCross || {
      male: { genotype: 'X^A Y', phenotype: '正常' },
      female: { genotype: 'X^A X^a', phenotype: '携带者' },
    };

    const maleGametes = this.extractGametes(parentalCross.male.genotype);
    const femaleGametes = this.extractGametes(parentalCross.female.genotype);

    const offspring: PunnettSquareData['offspring'] = [];
    for (const maleGamete of maleGametes) {
      for (const femaleGamete of femaleGametes) {
        const genotype = this.combineGametes(maleGamete, femaleGamete);
        const phenotype = this.determinePhenotype(genotype, concept);
        const probability = 1 / (maleGametes.length * femaleGametes.length);

        offspring.push({
          genotype,
          phenotype,
          probability,
          sex: genotype.includes('Y') ? 'male' : genotype.includes('X') ? 'female' : undefined,
        });
      }
    }

    const data: PunnettSquareData = {
      maleGametes,
      femaleGametes,
      offspring,
      parentalCross,
      description: `${concept}的庞氏方格分析`,
      recombinationRate: parameters?.recombinationRate as number,
    };

    return {
      type: VisualizationType.PUNNETT_SQUARE,
      title: `${concept} - 庞氏方格`,
      description: '展示基因型和表型的遗传比例',
      data,
      parameters: [
        {
          key: 'maleGenotype',
          label: '雄性基因型',
          type: 'input',
          defaultValue: parentalCross.male.genotype,
          description: '输入雄性亲本的基因型',
        },
        {
          key: 'femaleGenotype',
          label: '雌性基因型',
          type: 'input',
          defaultValue: parentalCross.female.genotype,
          description: '输入雌性亲本的基因型',
        },
        {
          key: 'recombinationRate',
          label: '重组率',
          type: 'slider',
          defaultValue: 0,
          min: 0,
          max: 50,
          step: 1,
          description: '基因重组率（0-50%）',
        },
      ],
      interactions: [
        { type: 'hover', description: '悬停查看基因型详情' },
        { type: 'click', description: '点击选择配子组合' },
      ],
      insights: this.getPunnettSquareInsights(concept),
    };
  }

  /**
   * 生成遗传路径
   */
  private generateInheritancePath(
    concept: string,
    parameters?: Record<string, unknown>,
    scenario?: GeneticsVisualizationInput['scenario'],
  ): VisualizationConfig {
    const generations: InheritancePathData['generations'] = [];
    const numGenerations = (parameters?.numGenerations as number) || 3;

    let currentGenotypes = ['X^A X^a', 'X^A Y'];

    for (let gen = 0; gen < numGenerations; gen++) {
      const individuals: InheritancePathData['generations'][0]['individuals'] = [];

      for (let i = 0; i < currentGenotypes.length; i++) {
        const genotype = currentGenotypes[i];
        const phenotype = this.determinePhenotype(genotype, concept);
        const isAffected = this.isAffected(genotype, concept);

        individuals.push({
          id: `G${gen}-I${i}`,
          sex: genotype.includes('Y') ? 'male' : 'female',
          genotype,
          phenotype,
          affected: isAffected,
          carrier: !isAffected && genotype.includes('X^a'),
          parents: gen > 0 ? [`G${gen - 1}-I${Math.floor(i / 2)}`] : undefined,
        });
      }

      generations.push({ generation: gen + 1, individuals });
      currentGenotypes = this.getNextGenerationGenotypes(currentGenotypes);
    }

    const data: InheritancePathData = {
      generations,
      inheritance: {
        pattern: scenario?.inheritancePattern || '伴性遗传',
        chromosome: 'X',
        gene: 'A',
      },
      explanation: `${concept}在家族中的传递路径`,
    };

    return {
      type: VisualizationType.INHERITANCE_PATH,
      title: `${concept} - 遗传路径`,
      description: '展示遗传性状在家族中的传递过程',
      data,
      parameters: [
        {
          key: 'numGenerations',
          label: '代数',
          type: 'slider',
          defaultValue: 3,
          min: 2,
          max: 5,
          step: 1,
          description: '展示的家族代数',
        },
      ],
      interactions: [
        { type: 'click', description: '点击个体查看基因型' },
        { type: 'hover', description: '悬停显示表型' },
      ],
      insights: this.getInheritancePathInsights(concept),
    };
  }

  /**
   * 生成概率分布
   */
  private generateProbabilityDistribution(
    concept: string,
    _parameters?: Record<string, unknown>,
  ): VisualizationConfig {
    const data: ProbabilityDistributionData = {
      categories: ['显性纯合', '杂合', '隐性'],
      values: [0.25, 0.5, 0.25],
      colors: ['#3b82f6', '#8b5cf6', '#ec4899'],
      total: '1',
      formula: 'p² + 2pq + q² = 1',
      parameters: { p: 0.5, q: 0.5 },
      phenotypeMapping: {
        '显性纯合': '显性性状',
        '杂合': '显性性状（携带者）',
        '隐性': '隐性性状',
      },
      phenotypeRatio: '3:1',
    };

    return {
      type: VisualizationType.PROBABILITY_DISTRIBUTION,
      title: `${concept} - 概率分布`,
      description: '展示基因型和表型的概率分布',
      data,
      parameters: [
        {
          key: 'p',
          label: '显性基因频率 (p)',
          type: 'slider',
          defaultValue: 0.5,
          min: 0,
          max: 1,
          step: 0.01,
          description: '显性等位基因的频率',
        },
        {
          key: 'q',
          label: '隐性基因频率 (q)',
          type: 'slider',
          defaultValue: 0.5,
          min: 0,
          max: 1,
          step: 0.01,
          description: '隐性等位基因的频率',
        },
      ],
      interactions: [
        { type: 'hover', description: '悬停查看具体数值' },
      ],
      insights: this.getProbabilityDistributionInsights(concept),
    };
  }

  /**
   * 生成减数分裂动画
   */
  private generateMeiosisAnimation(
    concept: string,
    _parameters?: Record<string, unknown>,
  ): VisualizationConfig {
    const data: MeiosisAnimationData = {
      stages: [
        { name: '间期', description: '染色体复制，每条染色体形成两条姐妹染色单体', chromosomeCount: 46, keyEvent: 'DNA复制' },
        { name: '前期 I', description: '同源染色体联会，可能发生基因互换', chromosomeCount: 46, keyEvent: '同源联会' },
        { name: '中期 I', description: '同源染色体排列在赤道板两侧', chromosomeCount: 23, keyEvent: '四分体形成' },
        { name: '后期 I', description: '同源染色体分离，移向两极', chromosomeCount: 23, keyEvent: '同源分离' },
        { name: '末期 I', description: '形成两个子细胞', chromosomeCount: 23, keyEvent: '细胞分裂' },
        { name: '前期 II', description: '染色单体排列在赤道板上', chromosomeCount: 23, keyEvent: '染色体排列' },
        { name: '中期 II', description: '着丝点分裂，染色单体分离', chromosomeCount: 46, keyEvent: '染色单体分离' },
        { name: '后期 II', description: '染色单体移向两极', chromosomeCount: 46, keyEvent: '单体分离' },
        { name: '末期 II', description: '形成四个子细胞', chromosomeCount: 23, keyEvent: '细胞分裂完成' },
      ],
      duration: 15000,
      highlights: ['同源联会', '基因互换', '四分体', '同源分离'],
    };

    return {
      type: VisualizationType.MEIOSIS_ANIMATION,
      title: `${concept} - 减数分裂`,
      description: '展示减数分裂的全过程',
      data,
      parameters: [
        {
          key: 'duration',
          label: '动画时长（秒）',
          type: 'slider',
          defaultValue: 15,
          min: 5,
          max: 30,
          step: 1,
          description: '动画播放总时长',
        },
        {
          key: 'showLabels',
          label: '显示标签',
          type: 'toggle',
          defaultValue: true,
          description: '是否显示阶段标签',
        },
      ],
      interactions: [
        { type: 'click', description: '点击播放/暂停' },
        { type: 'hover', description: '悬停暂停并说明' },
      ],
      insights: this.getMeiosisInsights(concept),
    };
  }

  /**
   * 生成染色体行为可视化
   */
  private generateChromosomeBehavior(
    concept: string,
    _parameters?: Record<string, unknown>,
  ): VisualizationConfig {
    const data: ChromosomeBehaviorData = {
      chromosomes: [
        {
          id: 'X',
          name: 'X染色体',
          length: 155,
          color: '#ec4899',
          genes: [
            { name: '血友病', position: 0.28, dominant: false },
            { name: '色盲', position: 0.65, dominant: false },
            { name: 'DMD', position: 0.85, dominant: false },
          ],
        },
        {
          id: 'Y',
          name: 'Y染色体',
          length: 58,
          color: '#3b82f6',
          genes: [
            { name: 'SRY', position: 0.1, dominant: true },
          ],
        },
        {
          id: '21',
          name: '21号染色体',
          length: 48,
          color: '#10b981',
          genes: [
            { name: 'APP', position: 0.75, dominant: false },
          ],
        },
      ],
      behavior: {
        type: 'segregation',
        description: '同源染色体在减数分裂时分离到不同配子',
        stage: '后期 I',
      },
    };

    return {
      type: VisualizationType.CHROMOSOME_BEHAVIOR,
      title: `${concept} - 染色体行为`,
      description: '展示染色体的分离和组合',
      data,
      parameters: [
        {
          key: 'behaviorType',
          label: '行为类型',
          type: 'select',
          defaultValue: 'segregation',
          options: [
            { value: 'segregation', label: '分离' },
            { value: 'recombination', label: '重组' },
            { value: 'assortment', label: '自由组合' },
          ],
          description: '选择要展示的染色体行为',
        },
      ],
      interactions: [
        { type: 'click', description: '点击选择染色体' },
        { type: 'drag', description: '拖拽移动染色体' },
        { type: 'hover', description: '悬停查看基因信息' },
      ],
      insights: this.getChromosomeBehaviorInsights(concept),
    };
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
  private determinePhenotype(genotype: string, _concept: string): string {
    if (genotype.includes('Y')) {
      return genotype.includes('X^a') ? '患病' : '正常';
    }
    return genotype.includes('X^A') ? '正常/携带者' : '患病';
  }

  /**
   * 辅助方法：判断是否患病
   */
  private isAffected(genotype: string, _concept: string): boolean {
    return genotype.includes('X^a Y') || (genotype.includes('X^a X^a') && !genotype.includes('Y'));
  }

  /**
   * 辅助方法：获取下一代基因型
   */
  private getNextGenerationGenotypes(parentGenotypes: string[]): string[] {
    const nextGenotypes: string[] = [];

    for (const parent1 of parentGenotypes) {
      for (const parent2 of parentGenotypes) {
        const alleles1 = parent1.replace(/\s/g, '').split(/[XY]/)[0];
        const alleles2 = parent2.replace(/\s/g, '').split(/[XY]/)[0];

        for (const c1 of alleles1) {
          for (const c2 of alleles2) {
            for (const sex of ['X', 'Y']) {
              nextGenotypes.push(`${c1}${sex} ${c2}${sex}`);
            }
          }
        }
      }
    }

    return nextGenotypes.slice(0, parentGenotypes.length);
  }

  /**
   * 获取庞氏方格上下文
   */
  private getPunnettSquareContext(concept: string) {
    return {
      concept,
      principle: '庞氏方格用于预测后代基因型和表型的比例',
      formula: '1:2:1 (基因型), 3:1 (表型)',
      example: '血友病是伴X隐性遗传病，父亲正常，母亲携带者，儿子有50%概率患病',
    };
  }

  /**
   * 获取遗传路径上下文
   */
  private getInheritancePathContext(concept: string) {
    return {
      concept,
      principle: '遗传路径展示性状在家族中的传递规律',
      formula: '显性基因掩盖隐性基因，隐性基因纯合时表达',
      example: '伴性遗传中，X染色体上的基因传递模式与性别相关',
    };
  }

  /**
   * 获取概率分布上下文
   */
  private getProbabilityDistributionContext(concept: string) {
    return {
      concept,
      principle: '哈代-温伯格定律描述群体中等位基因频率的平衡',
      formula: 'p² + 2pq + q² = 1',
      example: '在一个平衡群体中，等位基因频率在代际间保持不变',
    };
  }

  /**
   * 获取减数分裂上下文
   */
  private getMeiosisContext(concept: string) {
    return {
      concept,
      principle: '减数分裂是产生配子的细胞分裂过程，染色体数目减半',
      formula: '2n → n (二倍体到单倍体）',
      example: '人类体细胞46条染色体，减数分裂后精子/卵子只有23条',
    };
  }

  /**
   * 获取染色体行为上下文
   */
  private getChromosomeBehaviorContext(concept: string) {
    return {
      concept,
      principle: '同源染色体分离和自由组合是遗传学的基本规律',
      formula: '分离定律：nⁿ (n为基因对数）',
      example: '两对基因自由组合产生4种配子',
    };
  }

  /**
   * 获取庞氏方格理解提示
   */
  private getPunnettSquareInsights(_concept: string): UnderstandingInsight[] {
    return [
      {
        keyPoint: '配子的形成',
        visualConnection: '方格的顶部和左侧列出了父母可能产生的配子类型',
        commonMistake: '认为配子包含父母的全部基因',
        checkQuestion: '杂合子 Aa 能产生几种配子？',
      },
      {
        keyPoint: '基因型的组合',
        visualConnection: '方格内的每个格子代表一种可能的基因型组合',
        commonMistake: '忽略基因型的概率差异',
        checkQuestion: 'AA、Aa、aa 的比例是多少？',
      },
      {
        keyPoint: '表型的表达',
        visualConnection: '相同基因型可能有不同表型（如显性/隐性）',
        commonMistake: '混淆基因型和表型',
        checkQuestion: 'Aa 和 aa 的表型相同吗？',
      },
    ];
  }

  /**
   * 获取遗传路径理解提示
   */
  private getInheritancePathInsights(_concept: string): UnderstandingInsight[] {
    return [
      {
        keyPoint: '携带者的概念',
        visualConnection: '携带者带有隐性基因但不表现出性状',
        commonMistake: '认为携带者一定会患病',
        checkQuestion: '伴性遗传中，女性携带者的儿子会怎样？',
      },
      {
        keyPoint: '遗传概率',
        visualConnection: '每次生育都是独立事件，概率不会累积',
        commonMistake: '认为前面没有患病孩子，后面就不会有',
        checkQuestion: '如果第一胎正常，第二胎患病的概率会变吗？',
      },
    ];
  }

  /**
   * 获取概率分布理解提示
   */
  private getProbabilityDistributionInsights(_concept: string): UnderstandingInsight[] {
    return [
      {
        keyPoint: '基因频率与基因型频率',
        visualConnection: 'p和q是等位基因频率，p²、2pq、q²是基因型频率',
        commonMistake: '混淆基因频率和基因型频率',
        checkQuestion: '如果p=0.8，q是多少？',
      },
      {
        keyPoint: '平衡条件',
        visualConnection: '群体满足无突变、随机交配等条件时频率保持平衡',
        commonMistake: '认为基因频率会自动向平衡靠拢',
        checkQuestion: '哪些因素会破坏哈代-温伯格平衡？',
      },
    ];
  }

  /**
   * 获取减数分裂理解提示
   */
  private getMeiosisInsights(_concept: string): UnderstandingInsight[] {
    return [
      {
        keyPoint: '同源联会',
        visualConnection: '前期I同源染色体配对，可能发生基因互换',
        commonMistake: '认为同源染色体是相同的',
        checkQuestion: '同源联会有什么生物学意义？',
      },
      {
        keyPoint: '染色体数目减半',
        visualConnection: '减数分裂将二倍体细胞变为单倍体配子',
        commonMistake: '认为减数分裂产生体细胞',
        checkQuestion: '减数分裂与有丝分裂的主要区别是什么？',
      },
    ];
  }

  /**
   * 获取染色体行为理解提示
   */
  private getChromosomeBehaviorInsights(_concept: string): UnderstandingInsight[] {
    return [
      {
        keyPoint: '分离定律',
        visualConnection: '同源染色体在减数分裂后期分离到不同配子',
        commonMistake: '认为同源染色体总是在一起',
        checkQuestion: '如果两对基因位于不同染色体，它们会怎样分离？',
      },
      {
        keyPoint: '自由组合',
        visualConnection: '非同源染色体随机组合进入配子',
        commonMistake: '认为非同源染色体有固定组合方式',
        checkQuestion: '两对基因自由组合产生几种配子？',
      },
    ];
  }

  /**
   * 获取交互步骤
   */
  private getInteractiveSteps(type: VisualizationType) {
    const stepsMap: Record<VisualizationType, Array<{ step: number; description: string; highlight?: string[] }>> = {
      [VisualizationType.PUNNETT_SQUARE]: [
        { step: 1, description: '确定父母基因型', highlight: ['maleGenotype', 'femaleGenotype'] },
        { step: 2, description: '生成可能的配子', highlight: ['maleGametes', 'femaleGametes'] },
        { step: 3, description: '组合配子形成后代', highlight: ['offspring'] },
        { step: 4, description: '分析基因型和表型比例', highlight: ['probability'] },
      ],
      [VisualizationType.INHERITANCE_PATH]: [
        { step: 1, description: '从祖先开始，确定初始基因型' },
        { step: 2, description: '根据遗传规则计算后代基因型' },
        { step: 3, description: '判断每个个体的表型和携带状态' },
        { step: 4, description: '追踪性状在家族中的传递' },
      ],
      [VisualizationType.MEIOSIS_ANIMATION]: [
        { step: 1, description: '间期：染色体复制' },
        { step: 2, description: '前期I：同源联会，可能发生互换' },
        { step: 3, description: '中期I：四分体排列' },
        { step: 4, description: '后期I：同源染色体分离' },
        { step: 5, description: '末期I：形成两个子细胞' },
        { step: 6, description: '减数第二次分裂：染色单体分离' },
      ],
      [VisualizationType.CHROMOSOME_BEHAVIOR]: [
        { step: 1, description: '识别同源染色体对' },
        { step: 2, description: '观察染色体在细胞分裂中的行为' },
        { step: 3, description: '理解分离和自由组合的规律' },
      ],
      [VisualizationType.KNOWLEDGE_GRAPH]: [
        { step: 1, description: '识别核心概念' },
        { step: 2, description: '探索相关概念' },
        { step: 3, description: '理解概念之间的关系' },
      ],
      [VisualizationType.PEDIGREE_CHART]: [
        { step: 1, description: '识别家族成员' },
        { step: 2, description: '标注表型状态' },
        { step: 3, description: '分析遗传模式' },
      ],
      [VisualizationType.PROBABILITY_DISTRIBUTION]: [
        { step: 1, description: '设定基因频率' },
        { step: 2, description: '计算基因型频率' },
        { step: 3, description: '观察分布变化' },
      ],
      [VisualizationType.DNA_REPLICATION]: [
        { step: 1, description: 'DNA双链解旋' },
        { step: 2, description: '引物结合' },
        { step: 3, description: 'DNA聚合酶合成新链' },
      ],
      [VisualizationType.PROTEIN_SYNTHESIS]: [
        { step: 1, description: '转录：DNA到mRNA' },
        { step: 2, description: '翻译：mRNA到蛋白质' },
        { step: 3, description: '蛋白质折叠' },
      ],
      [VisualizationType.GENE_EXPRESSION]: [
        { step: 1, description: '基因调控元件识别' },
        { step: 2, description: '转录因子结合' },
        { step: 3, description: '基因表达激活' },
      ],
    };

    return stepsMap[type] || [];
  }

  /**
   * 检查是否支持硬编码可视化
   */
  hasHardcodedVisualization(concept: string): boolean {
    return isHardcodedConcept(concept);
  }

  /**
   * 获取硬编码可视化数据
   */
  getHardcodedVisualization(concept: string) {
    return HARDCODED_VISUALIZATIONS[concept];
  }
}
