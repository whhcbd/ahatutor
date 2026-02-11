import { ConceptAnalysis } from '@shared/types/agent.types';

/**
 * 染色体遗传学概念数据
 */
export const chromosomalGeneticsData: Record<string, ConceptAnalysis> = {
  // 减数分裂
  '减数分裂': {
    concept: '减数分裂',
    domain: '细胞遗传学',
    complexity: 'intermediate',
    visualizationPotential: 0.95,
    suggestedVisualizations: ['meiosis_stages', 'chromosome_segregation'],
    keyTerms: ['减数分裂', '配子', '同源染色体', '交叉互换', '四分体'],
  },

  // 染色体畸变
  '染色体畸变': {
    concept: '染色体畸变',
    domain: '细胞遗传学',
    complexity: 'advanced',
    visualizationPotential: 0.85,
    suggestedVisualizations: ['chromosome_abnormalities', 'karyotype_comparison'],
    keyTerms: ['数目异常', '结构异常', '非整倍体', '整倍体'],
  },

  // 非整倍体
  '非整倍体': {
    concept: '非整倍体',
    domain: '细胞遗传学',
    complexity: 'advanced',
    visualizationPotential: 0.8,
    suggestedVisualizations: ['aneuploidy', 'chromosome_number_variation'],
    keyTerms: ['三体', '单体', '唐氏综合征', '特纳氏综合征'],
  },

  // 三体
  '三体': {
    concept: '三体',
    domain: '细胞遗传学',
    complexity: 'advanced',
    visualizationPotential: 0.8,
    suggestedVisualizations: ['trisomy', '21_trisomy'],
    keyTerms: ['21三体', '唐氏综合征', '18三体', '13三体', '减数分裂错误'],
  },

  // 单体
  '单体': {
    concept: '单体',
    domain: '细胞遗传学',
    complexity: 'advanced',
    visualizationPotential: 0.75,
    suggestedVisualizations: ['monosomy', 'x_monosomy'],
    keyTerms: ['特纳氏综合征', 'X单体', '常染色体单体致死'],
  },

  // 染色体结构畸变
  '染色体结构畸变': {
    concept: '染色体结构畸变',
    domain: '细胞遗传学',
    complexity: 'advanced',
    visualizationPotential: 0.85,
    suggestedVisualizations: ['structural_abnormalities', 'chromosome_rearrangement'],
    keyTerms: ['缺失', '重复', '倒位', '易位'],
  },

  // 缺失
  '缺失': {
    concept: '缺失',
    domain: '细胞遗传学',
    complexity: 'advanced',
    visualizationPotential: 0.8,
    suggestedVisualizations: ['deletion', 'chromosome_segment_loss'],
    keyTerms: ['末端缺失', '中间缺失', '猫叫综合征', '基因丢失'],
  },

  // 重复
  '重复': {
    concept: '重复',
    domain: '细胞遗传学',
    complexity: 'advanced',
    visualizationPotential: 0.8,
    suggestedVisualizations: ['duplication', 'chromosome_segment_copy'],
    keyTerms: ['串联重复', '基因剂量效应', '片段重复'],
  },

  // 倒位
  '倒位': {
    concept: '倒位',
    domain: '细胞遗传学',
    complexity: 'advanced',
    visualizationPotential: 0.8,
    suggestedVisualizations: ['inversion', 'chromosome_segment_flip'],
    keyTerms: ['臂内倒位', '臂间倒位', '倒位环', '基因位置改变'],
  },

  // 易位
  '易位': {
    concept: '易位',
    domain: '细胞遗传学',
    complexity: 'advanced',
    visualizationPotential: 0.85,
    suggestedVisualizations: ['translocation', 'chromosome_segment_exchange'],
    keyTerms: ['相互易位', '罗伯逊易位', '慢性粒白血病', '费城染色体'],
  },
};
