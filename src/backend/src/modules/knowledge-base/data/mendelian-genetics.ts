import { ConceptAnalysis } from '@shared/types/agent.types';

/**
 * 孟德尔遗传学概念数据
 */
export const mendelianGeneticsData: Record<string, ConceptAnalysis> = {
  // 孟德尔定律
  '孟德尔定律': {
    concept: '孟德尔定律',
    domain: '遗传学',
    complexity: 'basic',
    visualizationPotential: 0.8,
    suggestedVisualizations: ['mendel_laws_summary', 'pea_experiment'],
    keyTerms: ['分离定律', '自由组合定律', '孟德尔', '豌豆实验', '遗传因子'],
  },

  // 孟德尔第一定律（分离定律）
  '孟德尔第一定律': {
    concept: '孟德尔第一定律',
    domain: '遗传学',
    complexity: 'basic',
    visualizationPotential: 0.8,
    suggestedVisualizations: ['punnett_square', 'inheritance_pattern'],
    keyTerms: ['等位基因', '显性', '隐性', '分离', '配子'],
  },

  // 孟德尔第二定律（自由组合定律）
  '孟德尔第二定律': {
    concept: '孟德尔第二定律',
    domain: '遗传学',
    complexity: 'intermediate',
    visualizationPotential: 0.85,
    suggestedVisualizations: ['dihybrid_cross', 'punnett_square_16'],
    keyTerms: ['自由组合', '两对性状', '独立分配', '配子组合'],
  },

  // 伴性遗传
  '伴性遗传': {
    concept: '伴性遗传',
    domain: '遗传学',
    complexity: 'intermediate',
    visualizationPotential: 0.9,
    suggestedVisualizations: ['sex_chromosome_inheritance', 'pedigree_chart'],
    keyTerms: ['性染色体', 'X连锁', 'Y连锁', '伴性遗传', '携带者'],
  },

  // X连锁遗传
  'X连锁遗传': {
    concept: 'X连锁遗传',
    domain: '遗传学',
    complexity: 'intermediate',
    visualizationPotential: 0.85,
    suggestedVisualizations: ['x_linked_inheritance', 'carrier_female'],
    keyTerms: ['X染色体', '隐性遗传', '显性遗传', '携带者', '交叉遗传'],
  },

  // Y连锁遗传
  'Y连锁遗传': {
    concept: 'Y连锁遗传',
    domain: '遗传学',
    complexity: 'intermediate',
    visualizationPotential: 0.8,
    suggestedVisualizations: ['y_linked_inheritance', 'male_only'],
    keyTerms: ['Y染色体', '全雄遗传', '父传子', '限雄遗传'],
  },

  // 连锁互换
  '连锁互换': {
    concept: '连锁互换',
    domain: '遗传学',
    complexity: 'advanced',
    visualizationPotential: 0.85,
    suggestedVisualizations: ['chromosome_crossover', 'genetic_mapping'],
    keyTerms: ['连锁', '互换', '同源染色体', '交叉', '基因定位'],
  },

  // 交叉互换
  '交叉互换': {
    concept: '交叉互换',
    domain: '细胞遗传学',
    complexity: 'intermediate',
    visualizationPotential: 0.85,
    suggestedVisualizations: ['crossing_over', 'chiasma', 'genetic_recombination'],
    keyTerms: ['交叉', '互换', '重组', '四分体', '基因重组'],
  },

  // 联会
  '联会': {
    concept: '联会',
    domain: '细胞遗传学',
    complexity: 'intermediate',
    visualizationPotential: 0.8,
    suggestedVisualizations: ['synapsis', 'tetrad_formation'],
    keyTerms: ['同源染色体配对', '四分体', '交叉互换', '减数分裂前期I'],
  },

  // 四分体
  '四分体': {
    concept: '四分体',
    domain: '细胞遗传学',
    complexity: 'intermediate',
    visualizationPotential: 0.8,
    suggestedVisualizations: ['tetrad_structure', 'chromatid_quartet'],
    keyTerms: ['四条染色单体', '同源染色体', '联会', '交叉互换'],
  },

  // 质量性状
  '质量性状': {
    concept: '质量性状',
    domain: '遗传学',
    complexity: 'intermediate',
    visualizationPotential: 0.75,
    suggestedVisualizations: ['qualitative_traits', 'discrete_distribution'],
    keyTerms: ['不连续变异', '孟德尔性状', '单基因控制', '离散分布'],
  },

  // 数量性状
  '数量性状': {
    concept: '数量性状',
    domain: '数量遗传学',
    complexity: 'advanced',
    visualizationPotential: 0.8,
    suggestedVisualizations: ['quantitative_traits', 'continuous_distribution', 'bell_curve'],
    keyTerms: ['连续变异', '多基因遗传', '正态分布', '环境影响'],
  },

  // 多基因遗传
  '多基因遗传': {
    concept: '多基因遗传',
    domain: '数量遗传学',
    complexity: 'advanced',
    visualizationPotential: 0.8,
    suggestedVisualizations: ['polygenic_inheritance', 'additive_effects'],
    keyTerms: ['多基因', '累加效应', '数量性状', '阈值性状'],
  },

  // 从性遗传
  '从性遗传': {
    concept: '从性遗传',
    domain: '遗传学',
    complexity: 'intermediate',
    visualizationPotential: 0.7,
    suggestedVisualizations: ['sex_influenced_traits', 'hormone_effect'],
    keyTerms: ['从性遗传', '常染色体', '性别影响', '激素'],
  },

  // 限性遗传
  '限性遗传': {
    concept: '限性遗传',
    domain: '遗传学',
    complexity: 'intermediate',
    visualizationPotential: 0.7,
    suggestedVisualizations: ['sex_limited_traits', 'gender_specific'],
    keyTerms: ['限性遗传', '性别限制', '表型表达', '解剖结构'],
  },
};
