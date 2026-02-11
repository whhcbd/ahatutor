import { ConceptAnalysis } from '@shared/types/agent.types';

/**
 * 表观遗传学概念数据
 */
export const epigeneticsData: Record<string, ConceptAnalysis> = {
  // 表观遗传学
  '表观遗传学': {
    concept: '表观遗传学',
    domain: '遗传学',
    complexity: 'advanced',
    visualizationPotential: 0.8,
    suggestedVisualizations: ['epigenetics', 'gene_regulation'],
    keyTerms: ['DNA甲基化', '组蛋白修饰', '非编码RNA', '染色质重塑', '可遗传'],
  },

  // DNA甲基化
  'DNA甲基化': {
    concept: 'DNA甲基化',
    domain: '表观遗传学',
    complexity: 'advanced',
    visualizationPotential: 0.8,
    suggestedVisualizations: ['dna_methylation', 'epigenetic_marks'],
    keyTerms: ['甲基转移酶', 'CpG岛', '基因沉默', '表观遗传标记'],
  },

  // 组蛋白修饰
  '组蛋白修饰': {
    concept: '组蛋白修饰',
    domain: '表观遗传学',
    complexity: 'advanced',
    visualizationPotential: 0.8,
    suggestedVisualizations: ['histone_modification', 'chromatin_structure'],
    keyTerms: ['乙酰化', '甲基化', '磷酸化', '组蛋白密码', '染色质开放'],
  },

  // 染色质重塑
  '染色质重塑': {
    concept: '染色质重塑',
    domain: '表观遗传学',
    complexity: 'advanced',
    visualizationPotential: 0.75,
    suggestedVisualizations: ['chromatin_remodeling', 'chromatin_accessibility'],
    keyTerms: ['染色质结构', '基因表达调控', 'ATP依赖', '开放/关闭'],
  },

  // 非编码RNA
  '非编码RNA': {
    concept: '非编码RNA',
    domain: '分子遗传学',
    complexity: 'advanced',
    visualizationPotential: 0.75,
    suggestedVisualizations: ['non_coding_rna', 'gene_regulation'],
    keyTerms: ['miRNA', 'siRNA', 'lncRNA', '基因调控', 'RNA干扰'],
  },

  // 核定位信号
  '核定位信号': {
    concept: '核定位信号',
    domain: '细胞生物学',
    complexity: 'advanced',
    visualizationPotential: 0.7,
    suggestedVisualizations: ['nuclear_localization_signal', 'protein_transport'],
    keyTerms: ['NLS', '蛋白质入核', '核孔复合体', '氨基酸序列'],
  },
};
