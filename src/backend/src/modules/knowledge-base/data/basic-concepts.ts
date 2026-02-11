import { ConceptAnalysis } from '@shared/types/agent.types';

/**
 * 基础遗传学概念数据
 */
export const basicConceptsData: Record<string, ConceptAnalysis> = {
  // 基因
  '基因': {
    concept: '基因',
    domain: '遗传学',
    complexity: 'basic',
    visualizationPotential: 0.8,
    suggestedVisualizations: ['dna_structure', 'gene_location', 'gene_expression'],
    keyTerms: ['DNA', '遗传信息', '蛋白质', '等位基因', '基因座'],
  },

  // DNA
  'DNA': {
    concept: 'DNA',
    domain: '分子遗传学',
    complexity: 'basic',
    visualizationPotential: 0.95,
    suggestedVisualizations: ['double_helix', 'nucleotide_structure', 'base_pairing'],
    keyTerms: ['脱氧核糖核酸', '双螺旋', '核苷酸', '碱基', '磷酸', '脱氧核糖'],
  },

  // RNA
  'RNA': {
    concept: 'RNA',
    domain: '分子遗传学',
    complexity: 'basic',
    visualizationPotential: 0.85,
    suggestedVisualizations: ['rna_structure', 'rna_types', 'transcription'],
    keyTerms: ['核糖核酸', 'mRNA', 'tRNA', 'rRNA', '单链', '核糖'],
  },

  // 染色体
  '染色体': {
    concept: '染色体',
    domain: '细胞遗传学',
    complexity: 'basic',
    visualizationPotential: 0.9,
    suggestedVisualizations: ['chromosome_structure', 'karyotype', 'chromosome_number'],
    keyTerms: ['染色质', '着丝粒', '端粒', '同源染色体', '性染色体', '常染色体'],
  },

  // 性染色体
  '性染色体': {
    concept: '性染色体',
    domain: '遗传学',
    complexity: 'basic',
    visualizationPotential: 0.85,
    suggestedVisualizations: ['sex_chromosomes', 'xy_system', 'sex_determination'],
    keyTerms: ['X染色体', 'Y染色体', '性别决定', '伴性遗传', '同配性别', '异配性别'],
  },

  // 细胞分裂
  '细胞分裂': {
    concept: '细胞分裂',
    domain: '细胞生物学',
    complexity: 'basic',
    visualizationPotential: 0.9,
    suggestedVisualizations: ['cell_division_stages', 'mitosis_vs_meiosis'],
    keyTerms: ['有丝分裂', '减数分裂', '细胞周期', '纺锤体', '染色体分配'],
  },

  // 有丝分裂
  '有丝分裂': {
    concept: '有丝分裂',
    domain: '细胞生物学',
    complexity: 'intermediate',
    visualizationPotential: 0.95,
    suggestedVisualizations: ['mitosis_stages', 'chromosome_movement'],
    keyTerms: ['间期', '前期', '中期', '后期', '末期', '细胞板', '缢裂'],
  },

  // 配子
  '配子': {
    concept: '配子',
    domain: '遗传学',
    complexity: 'basic',
    visualizationPotential: 0.75,
    suggestedVisualizations: ['gamete_formation', 'sperm_egg'],
    keyTerms: ['精子', '卵子', '单倍体', '受精', '减数分裂'],
  },

  // 同源染色体
  '同源染色体': {
    concept: '同源染色体',
    domain: '细胞遗传学',
    complexity: 'basic',
    visualizationPotential: 0.8,
    suggestedVisualizations: ['homologous_chromosomes', 'pairing'],
    keyTerms: ['同源', '配对', '等位基因', '联会', '二倍体'],
  },

  // 染色单体
  '染色单体': {
    concept: '染色单体',
    domain: '细胞遗传学',
    complexity: 'basic',
    visualizationPotential: 0.75,
    suggestedVisualizations: ['chromatid_structure', 'sister_chromatids'],
    keyTerms: ['姐妹染色单体', 'DNA复制', '着丝粒', '细胞分裂'],
  },

  // 着丝粒
  '着丝粒': {
    concept: '着丝粒',
    domain: '细胞遗传学',
    complexity: 'basic',
    visualizationPotential: 0.75,
    suggestedVisualizations: ['centromere_structure', 'chromosome_parts'],
    keyTerms: ['主缢痕', '纺锤丝附着', '染色体分离', '动粒'],
  },

  // 端粒
  '端粒': {
    concept: '端粒',
    domain: '分子遗传学',
    complexity: 'advanced',
    visualizationPotential: 0.75,
    suggestedVisualizations: ['telomere_structure', 'chromosome_ends'],
    keyTerms: ['染色体末端', '重复序列', '细胞衰老', '端粒酶'],
  },

  // 显性与隐性
  '显性与隐性': {
    concept: '显性与隐性',
    domain: '遗传学',
    complexity: 'basic',
    visualizationPotential: 0.8,
    suggestedVisualizations: ['dominance_relationships', 'phenotype_expression'],
    keyTerms: ['显性', '隐性', '等位基因', '杂合子', '纯合子', '表型'],
  },

  // 等位基因
  '等位基因': {
    concept: '等位基因',
    domain: '遗传学',
    complexity: 'basic',
    visualizationPotential: 0.75,
    suggestedVisualizations: ['allele_types', 'gene_variants'],
    keyTerms: ['显性等位基因', '隐性等位基因', '复等位基因', '基因型'],
  },

  // 基因型与表型
  '基因型与表型': {
    concept: '基因型与表型',
    domain: '遗传学',
    complexity: 'basic',
    visualizationPotential: 0.75,
    suggestedVisualizations: ['genotype_phenotype_mapping'],
    keyTerms: ['基因型', '表型', '表现度', '外显率'],
  },

  // 外显率
  '外显率': {
    concept: '外显率',
    domain: '遗传学',
    complexity: 'advanced',
    visualizationPotential: 0.7,
    suggestedVisualizations: ['penetrance_chart', 'genotype_expression'],
    keyTerms: ['外显率', '不完全外显', '完全外显', '表型表达'],
  },

  // 表现度
  '表现度': {
    concept: '表现度',
    domain: '遗传学',
    complexity: 'advanced',
    visualizationPotential: 0.7,
    suggestedVisualizations: ['expressivity_spectrum', 'phenotype_variation'],
    keyTerms: ['表现度', '变异表达', '轻度', '中度', '重度'],
  },

  // DNA双螺旋结构
  'DNA双螺旋结构': {
    concept: 'DNA双螺旋结构',
    domain: '分子遗传学',
    complexity: 'basic',
    visualizationPotential: 0.95,
    suggestedVisualizations: ['double_helix', 'base_pairing', 'antiparallel'],
    keyTerms: ['双螺旋', '沃森和克里克', '碱基配对', '反向平行', '大沟小沟'],
  },

  // 碱基配对
  '碱基配对': {
    concept: '碱基配对',
    domain: '分子遗传学',
    complexity: 'basic',
    visualizationPotential: 0.85,
    suggestedVisualizations: ['base_pairing', 'at_cg_pairs'],
    keyTerms: ['A-T配对', 'G-C配对', '氢键', '互补配对'],
  },
};
