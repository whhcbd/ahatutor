/**
 * 可视化配色方案标准
 * 基于遗传学语义定义统一配色
 */

export type ColorScheme = Record<string, string>;

export const VisualizationColors: ColorScheme = {
  // 表型颜色 - 基于遗传学语义
  dominant: '#4CAF50',
  recessive: '#FF9800',
  carrier: '#2196F3',
  normal: '#8BC34A',
  affected: '#F44336',

  // 性别颜色
  male: '#64B5F6',
  female: '#F06292',

  // 染色体颜色
  chromosome1: '#9C27B0',
  chromosome2: '#BA68C8',
  chromosomeX: '#E91E63',
  chromosomeY: '#2196F3',

  // 基因相关
  gene: '#2196F3',
  locus: '#FF9800',
  promoter: '#4CAF50',
  enhancer: '#FF5722',
  exon: '#9C27B0',
  intron: '#FFB74D',

  // 掌握度颜色 - 用于知识图谱
  masteryHigh: '#4ade80',
  masteryMedium: '#fbbf24',
  masteryLow: '#fb923c',
  masteryNone: '#f87171',

  // 节点类型颜色 - 用于知识图谱边框
  nodeConcept: '#3b82f6',
  nodePrinciple: '#8b5cf6',
  nodeFormula: '#ec4899',
  nodeDefault: '#6b7280',

  // 交互颜色
  hover: '#FFC107',
  selected: '#FF5722',
  disabled: '#9E9E9E',
  background: '#f9fafb',
  border: '#e5e7eb',

  // 文字颜色
  textPrimary: '#1f2937',
  textSecondary: '#6b7280',
  textDisabled: '#9ca3af',
} as const;

export const PhenotypeColors: ColorScheme = {
  显性: VisualizationColors.dominant,
  隐性: VisualizationColors.recessive,
  携带者: VisualizationColors.carrier,
  正常: VisualizationColors.normal,
  患病: VisualizationColors.affected,
  杂合: VisualizationColors.carrier,
  纯合: VisualizationColors.dominant,
} as const;

export const MasteryColors: ColorScheme = {
  high: VisualizationColors.masteryHigh,
  medium: VisualizationColors.masteryMedium,
  low: VisualizationColors.masteryLow,
  none: VisualizationColors.masteryNone,
} as const;

export const SexColors: ColorScheme = {
  male: VisualizationColors.male,
  female: VisualizationColors.female,
} as const;

export function getPhenotypeColor(phenotype: string): string {
  const normalized = phenotype.toLowerCase();
  if (normalized.includes('正常') || normalized.includes('显性') || normalized.includes('dominant')) {
    return VisualizationColors.dominant;
  }
  if (normalized.includes('携带') || normalized.includes('杂合') || normalized.includes('heterozygous') || normalized.includes('carrier')) {
    return VisualizationColors.carrier;
  }
  if (normalized.includes('患病') || normalized.includes('隐性') || normalized.includes('recessive')) {
    return VisualizationColors.affected;
  }
  return VisualizationColors.normal;
}

export function getMasteryColor(mastery: number): string {
  if (mastery >= 80) return VisualizationColors.masteryHigh;
  if (mastery >= 50) return VisualizationColors.masteryMedium;
  if (mastery >= 20) return VisualizationColors.masteryLow;
  return VisualizationColors.masteryNone;
}

export function getSexColor(sex: 'male' | 'female' | string): string {
  if (sex === 'male' || sex === '雄性' || sex === '父') {
    return VisualizationColors.male;
  }
  if (sex === 'female' || sex === '雌性' || sex === '母') {
    return VisualizationColors.female;
  }
  return VisualizationColors.male;
}
