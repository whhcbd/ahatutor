import { ConceptAnalysis } from '@shared/types/agent.types';

/**
 * 群体遗传学概念数据
 */
export const populationGeneticsData: Record<string, ConceptAnalysis> = {
  // 哈代-温伯格定律
  '哈代-温伯格定律': {
    concept: '哈代-温伯格定律',
    domain: '群体遗传学',
    complexity: 'advanced',
    visualizationPotential: 0.7,
    suggestedVisualizations: ['allele_frequency', 'population_equilibrium'],
    keyTerms: ['基因频率', '基因型频率', '遗传平衡', '理想群体'],
  },

  // 基因频率
  '基因频率': {
    concept: '基因频率',
    domain: '群体遗传学',
    complexity: 'intermediate',
    visualizationPotential: 0.75,
    suggestedVisualizations: ['allele_frequency_distribution', 'gene_pool'],
    keyTerms: ['等位基因频率', '基因库', '群体遗传', 'p和q'],
  },

  // 基因型频率
  '基因型频率': {
    concept: '基因型频率',
    domain: '群体遗传学',
    complexity: 'intermediate',
    visualizationPotential: 0.75,
    suggestedVisualizations: ['genotype_frequency', 'population_genetics'],
    keyTerms: ['基因型分布', '基因型计数', '群体遗传'],
  },

  // 遗传平衡
  '遗传平衡': {
    concept: '遗传平衡',
    domain: '群体遗传学',
    complexity: 'advanced',
    visualizationPotential: 0.75,
    suggestedVisualizations: ['genetic_equilibrium', 'hardy_weinberg'],
    keyTerms: ['基因频率稳定', '理想群体', '哈代-温伯格平衡'],
  },

  // 遗传漂变
  '遗传漂变': {
    concept: '遗传漂变',
    domain: '群体遗传学',
    complexity: 'advanced',
    visualizationPotential: 0.8,
    suggestedVisualizations: ['genetic_drift', 'allele_frequency_changes'],
    keyTerms: ['随机波动', '小群体', '奠基者效应', '瓶颈效应'],
  },

  // 奠基者效应
  '奠基者效应': {
    concept: '奠基者效应',
    domain: '群体遗传学',
    complexity: 'advanced',
    visualizationPotential: 0.75,
    suggestedVisualizations: ['founder_effect', 'population_bottleneck'],
    keyTerms: ['小群体建立', '基因频率改变', '遗传漂变'],
  },

  // 瓶颈效应
  '瓶颈效应': {
    concept: '瓶颈效应',
    domain: '群体遗传学',
    complexity: 'advanced',
    visualizationPotential: 0.8,
    suggestedVisualizations: ['bottleneck_effect', 'population_crash'],
    keyTerms: ['群体锐减', '遗传多样性丧失', '遗传漂变'],
  },

  // 基因流
  '基因流': {
    concept: '基因流',
    domain: '群体遗传学',
    complexity: 'advanced',
    visualizationPotential: 0.8,
    suggestedVisualizations: ['gene_flow', 'migration'],
    keyTerms: ['基因迁移', '群体间基因交流', '等位基因流动'],
  },

  // 自然选择
  '自然选择': {
    concept: '自然选择',
    domain: '进化遗传学',
    complexity: 'intermediate',
    visualizationPotential: 0.85,
    suggestedVisualizations: ['natural_selection', 'adaptive_evolution'],
    keyTerms: ['适者生存', '适应性', '选择压力', '定向选择', '稳定选择'],
  },

  // 定向选择
  '定向选择': {
    concept: '定向选择',
    domain: '进化遗传学',
    complexity: 'advanced',
    visualizationPotential: 0.75,
    suggestedVisualizations: ['directional_selection', 'selection_shift'],
    keyTerms: ['极端表型', '选择压力', '平均性状改变'],
  },

  // 稳定选择
  '稳定选择': {
    concept: '稳定选择',
    domain: '进化遗传学',
    complexity: 'advanced',
    visualizationPotential: 0.75,
    suggestedVisualizations: ['stabilizing_selection', 'intermediate_advantage'],
    keyTerms: ['中间型', '极端型淘汰', '性状稳定'],
  },

  // 破坏性选择
  '破坏性选择': {
    concept: '破坏性选择',
    domain: '进化遗传学',
    complexity: 'advanced',
    visualizationPotential: 0.75,
    suggestedVisualizations: ['disruptive_selection', 'extreme_advantage'],
    keyTerms: ['极端表型优势', '中间型淘汰', '多态性'],
  },

  // 适合度
  '适合度': {
    concept: '适合度',
    domain: '进化遗传学',
    complexity: 'intermediate',
    visualizationPotential: 0.75,
    suggestedVisualizations: ['fitness', 'reproductive_success'],
    keyTerms: ['适应度', '生殖成功率', '生存能力', '相对适合度'],
  },

  // 选择系数
  '选择系数': {
    concept: '选择系数',
    domain: '进化遗传学',
    complexity: 'advanced',
    visualizationPotential: 0.7,
    suggestedVisualizations: ['selection_coefficient', 'selection_pressure'],
    keyTerms: ['选择强度', '适合度降低', 's值'],
  },
};
