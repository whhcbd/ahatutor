import { ConceptAnalysis } from '@shared/types/agent.types';

/**
 * 分子遗传学概念数据
 */
export const molecularGeneticsData: Record<string, ConceptAnalysis> = {
  // DNA复制
  'DNA复制': {
    concept: 'DNA复制',
    domain: '分子遗传学',
    complexity: 'intermediate',
    visualizationPotential: 0.9,
    suggestedVisualizations: ['dna_replication_fork', 'semi_conservative'],
    keyTerms: ['半保留复制', '复制叉', 'DNA聚合酶', '引物', '冈崎片段'],
  },

  // DNA半保留复制
  'DNA半保留复制': {
    concept: 'DNA半保留复制',
    domain: '分子遗传学',
    complexity: 'intermediate',
    visualizationPotential: 0.85,
    suggestedVisualizations: ['semi_conservative_replication', 'meselson_stahl'],
    keyTerms: ['半保留复制', '亲代链', '新合成链', 'Meselson-Stahl实验'],
  },

  // 复制叉
  '复制叉': {
    concept: '复制叉',
    domain: '分子遗传学',
    complexity: 'intermediate',
    visualizationPotential: 0.8,
    suggestedVisualizations: ['replication_fork', 'dna_synthesis'],
    keyTerms: ['Y型结构', '前导链', '后随链', 'DNA聚合酶'],
  },

  // 前导链
  '前导链': {
    concept: '前导链',
    domain: '分子遗传学',
    complexity: 'intermediate',
    visualizationPotential: 0.75,
    suggestedVisualizations: ['leading_strand', 'continuous_synthesis'],
    keyTerms: ['连续合成', '5\'到3\'方向', 'DNA聚合酶'],
  },

  // 后随链
  '后随链': {
    concept: '后随链',
    domain: '分子遗传学',
    complexity: 'intermediate',
    visualizationPotential: 0.75,
    suggestedVisualizations: ['lagging_strand', 'okazaki_fragments'],
    keyTerms: ['不连续合成', '冈崎片段', '5\'到3\'方向'],
  },

  // 冈崎片段
  '冈崎片段': {
    concept: '冈崎片段',
    domain: '分子遗传学',
    complexity: 'intermediate',
    visualizationPotential: 0.75,
    suggestedVisualizations: ['okazaki_fragments', 'dna_ligation'],
    keyTerms: ['后随链合成', '短片段', 'DNA连接酶', '不连续复制'],
  },

  // DNA聚合酶
  'DNA聚合酶': {
    concept: 'DNA聚合酶',
    domain: '分子生物学',
    complexity: 'intermediate',
    visualizationPotential: 0.75,
    suggestedVisualizations: ['dna_polymerase', 'enzyme_structure'],
    keyTerms: ['DNA合成', '5\'到3\'聚合酶活性', '校对功能', 'Proofreading'],
  },

  // DNA连接酶
  'DNA连接酶': {
    concept: 'DNA连接酶',
    domain: '分子生物学',
    complexity: 'intermediate',
    visualizationPotential: 0.75,
    suggestedVisualizations: ['dna_ligase', 'dna_repair'],
    keyTerms: ['连接DNA片段', '磷酸二酯键', 'DNA修复', '重组DNA'],
  },

  // 转录与翻译
  '转录与翻译': {
    concept: '转录与翻译',
    domain: '分子遗传学',
    complexity: 'intermediate',
    visualizationPotential: 0.9,
    suggestedVisualizations: ['central_dogma', 'protein_synthesis'],
    keyTerms: ['转录', '翻译', 'mRNA', 'tRNA', '核糖体', '密码子', '反密码子'],
  },

  // 中心法则
  '中心法则': {
    concept: '中心法则',
    domain: '分子遗传学',
    complexity: 'basic',
    visualizationPotential: 0.85,
    suggestedVisualizations: ['central_dogma_flow', 'dna_rna_protein'],
    keyTerms: ['DNA', 'RNA', '蛋白质', '转录', '翻译', '逆转录'],
  },

  // 转录
  '转录': {
    concept: '转录',
    domain: '分子遗传学',
    complexity: 'intermediate',
    visualizationPotential: 0.85,
    suggestedVisualizations: ['transcription_process', 'rna_polymerase'],
    keyTerms: ['RNA聚合酶', '启动子', '终止子', 'mRNA', '前体mRNA'],
  },

  // 翻译
  '翻译': {
    concept: '翻译',
    domain: '分子遗传学',
    complexity: 'intermediate',
    visualizationPotential: 0.9,
    suggestedVisualizations: ['translation_process', 'ribosome', 'codon_anticodon'],
    keyTerms: ['核糖体', 'tRNA', '密码子', '反密码子', '多肽链', '起始', '延伸', '终止'],
  },

  // RNA聚合酶
  'RNA聚合酶': {
    concept: 'RNA聚合酶',
    domain: '分子生物学',
    complexity: 'intermediate',
    visualizationPotential: 0.8,
    suggestedVisualizations: ['rna_polymerase', 'transcription'],
    keyTerms: ['转录酶', 'RNA合成', '启动子识别', '转录延伸'],
  },

  // 启动子
  '启动子': {
    concept: '启动子',
    domain: '分子遗传学',
    complexity: 'intermediate',
    visualizationPotential: 0.75,
    suggestedVisualizations: ['promoter', 'gene_regulation'],
    keyTerms: ['TATA框', '转录起始位点', 'RNA聚合酶结合', '启动子区域'],
  },

  // 增强子
  '增强子': {
    concept: '增强子',
    domain: '分子遗传学',
    complexity: 'advanced',
    visualizationPotential: 0.75,
    suggestedVisualizations: ['enhancer', 'gene_regulation'],
    keyTerms: ['转录增强', '远距离调控', '转录因子结合'],
  },

  // 沉默子
  '沉默子': {
    concept: '沉默子',
    domain: '分子遗传学',
    complexity: 'advanced',
    visualizationPotential: 0.7,
    suggestedVisualizations: ['silencer', 'gene_repression'],
    keyTerms: ['转录抑制', '负调控元件', '基因沉默'],
  },

  // 转录因子
  '转录因子': {
    concept: '转录因子',
    domain: '分子遗传学',
    complexity: 'advanced',
    visualizationPotential: 0.8,
    suggestedVisualizations: ['transcription_factors', 'protein_dna_binding'],
    keyTerms: ['DNA结合蛋白', '转录调控', '激活因子', '抑制因子'],
  },

  // 剪接
  '剪接': {
    concept: '剪接',
    domain: '分子遗传学',
    complexity: 'advanced',
    visualizationPotential: 0.8,
    suggestedVisualizations: ['rna_splicing', 'intron_exon'],
    keyTerms: ['内含子', '外显子', '剪接体', '可变剪接'],
  },

  // 内含子
  '内含子': {
    concept: '内含子',
    domain: '分子遗传学',
    complexity: 'intermediate',
    visualizationPotential: 0.75,
    suggestedVisualizations: ['intron', 'gene_structure'],
    keyTerms: ['非编码区', '剪接去除', '基因间隔序列'],
  },

  // 外显子
  '外显子': {
    concept: '外显子',
    domain: '分子遗传学',
    complexity: 'intermediate',
    visualizationPotential: 0.75,
    suggestedVisualizations: ['exon', 'gene_structure'],
    keyTerms: ['编码区', '保留序列', '蛋白质编码'],
  },

  // 可变剪接
  '可变剪接': {
    concept: '可变剪接',
    domain: '分子遗传学',
    complexity: 'advanced',
    visualizationPotential: 0.8,
    suggestedVisualizations: ['alternative_splicing', 'protein_diversity'],
    keyTerms: ['多种mRNA', '蛋白质多样性', '组织特异性'],
  },

  // 多聚腺苷酸化
  '多聚腺苷酸化': {
    concept: '多聚腺苷酸化',
    domain: '分子遗传学',
    complexity: 'advanced',
    visualizationPotential: 0.7,
    suggestedVisualizations: ['polya_tail', 'mrna_processing'],
    keyTerms: ['PolyA尾', 'mRNA稳定性', '转录后加工'],
  },

  // 5'帽子
  '5\'帽子': {
    concept: '5\'帽子',
    domain: '分子遗传学',
    complexity: 'advanced',
    visualizationPotential: 0.7,
    suggestedVisualizations: ['5_cap', 'mrna_processing'],
    keyTerms: ['7-甲基鸟苷', 'mRNA保护', '翻译起始', '核输出'],
  },

  // 遗传密码
  '遗传密码': {
    concept: '遗传密码',
    domain: '分子遗传学',
    complexity: 'intermediate',
    visualizationPotential: 0.8,
    suggestedVisualizations: ['codon_table', 'genetic_code'],
    keyTerms: ['密码子', '三联体', '简并性', '通用性', '无标点性'],
  },

  // 密码子
  '密码子': {
    concept: '密码子',
    domain: '分子遗传学',
    complexity: 'basic',
    visualizationPotential: 0.75,
    suggestedVisualizations: ['codon_structure', 'codon_table'],
    keyTerms: ['三联体', 'mRNA', '氨基酸', '起始密码子', '终止密码子'],
  },

  // 反密码子
  '反密码子': {
    concept: '反密码子',
    domain: '分子遗传学',
    complexity: 'basic',
    visualizationPotential: 0.75,
    suggestedVisualizations: ['anticodon_structure', 'tRNA_binding'],
    keyTerms: ['tRNA', '碱基配对', '密码子识别', '氨基酸携带'],
  },

  // 起始密码子
  '起始密码子': {
    concept: '起始密码子',
    domain: '分子遗传学',
    complexity: 'basic',
    visualizationPotential: 0.7,
    suggestedVisualizations: ['start_codon', 'aug'],
    keyTerms: ['AUG', '甲硫氨酸', '翻译起始'],
  },

  // 终止密码子
  '终止密码子': {
    concept: '终止密码子',
    domain: '分子遗传学',
    complexity: 'basic',
    visualizationPotential: 0.7,
    suggestedVisualizations: ['stop_codon', 'translation_termination'],
    keyTerms: ['UAA', 'UAG', 'UGA', '翻译终止', '释放因子'],
  },

  // 蛋白质合成
  '蛋白质合成': {
    concept: '蛋白质合成',
    domain: '分子遗传学',
    complexity: 'intermediate',
    visualizationPotential: 0.85,
    suggestedVisualizations: ['protein_synthesis', 'translation_animation'],
    keyTerms: ['翻译', '核糖体', '氨基酸', '多肽链', '折叠'],
  },

  // 核糖体
  '核糖体': {
    concept: '核糖体',
    domain: '分子生物学',
    complexity: 'intermediate',
    visualizationPotential: 0.8,
    suggestedVisualizations: ['ribosome_structure', 'subunits'],
    keyTerms: ['大亚基', '小亚基', 'rRNA', '蛋白质合成', 'mRNA结合位点'],
  },

  // 基因表达
  '基因表达': {
    concept: '基因表达',
    domain: '分子遗传学',
    complexity: 'intermediate',
    visualizationPotential: 0.8,
    suggestedVisualizations: ['gene_expression_flow', 'regulation'],
    keyTerms: ['转录', '翻译', '调控', '启动子', '增强子'],
  },

  // 基因调控
  '基因调控': {
    concept: '基因调控',
    domain: '分子遗传学',
    complexity: 'advanced',
    visualizationPotential: 0.8,
    suggestedVisualizations: ['gene_regulation', 'operon', 'transcription_factors'],
    keyTerms: ['启动子', '增强子', '沉默子', '转录因子', '操纵子', '阻遏蛋白'],
  },

  // 操纵子
  '操纵子': {
    concept: '操纵子',
    domain: '分子遗传学',
    complexity: 'advanced',
    visualizationPotential: 0.85,
    suggestedVisualizations: ['lac_operon', 'gene_regulation_unit'],
    keyTerms: ['启动子', '操纵基因', '结构基因', '调节基因', '乳糖操纵子', '色氨酸操纵子'],
  },

  // 乳糖操纵子
  '乳糖操纵子': {
    concept: '乳糖操纵子',
    domain: '分子遗传学',
    complexity: 'advanced',
    visualizationPotential: 0.85,
    suggestedVisualizations: ['lac_operon_mechanism', 'induction_repression'],
    keyTerms: ['lacZ', 'lacY', 'lacA', '启动子', '操纵基因', '阻遏蛋白', '诱导物'],
  },

  // 基因突变
  '基因突变': {
    concept: '基因突变',
    domain: '遗传学',
    complexity: 'intermediate',
    visualizationPotential: 0.8,
    suggestedVisualizations: ['mutation_types', 'dna_sequence_change'],
    keyTerms: ['点突变', '插入', '缺失', '置换', '移码突变'],
  },

  // 点突变
  '点突变': {
    concept: '点突变',
    domain: '遗传学',
    complexity: 'intermediate',
    visualizationPotential: 0.75,
    suggestedVisualizations: ['point_mutation', 'base_substitution'],
    keyTerms: ['碱基替换', '转换', '颠换', '同义突变', '错义突变', '无义突变'],
  },

  // 移码突变
  '移码突变': {
    concept: '移码突变',
    domain: '遗传学',
    complexity: 'intermediate',
    visualizationPotential: 0.8,
    suggestedVisualizations: ['frameshift_mutation', 'reading_frame'],
    keyTerms: ['插入', '缺失', '阅读框', '三联体', '蛋白质改变'],
  },

  // 同义突变
  '同义突变': {
    concept: '同义突变',
    domain: '遗传学',
    complexity: 'intermediate',
    visualizationPotential: 0.7,
    suggestedVisualizations: ['silent_mutation', 'codon_usage'],
    keyTerms: ['密码子简并', '氨基酸不变', '中性突变'],
  },

  // 错义突变
  '错义突变': {
    concept: '错义突变',
    domain: '遗传学',
    complexity: 'intermediate',
    visualizationPotential: 0.75,
    suggestedVisualizations: ['missense_mutation', 'amino_acid_change'],
    keyTerms: ['氨基酸改变', '蛋白质功能', '保守性', '非保守性'],
  },

  // 无义突变
  '无义突变': {
    concept: '无义突变',
    domain: '遗传学',
    complexity: 'intermediate',
    visualizationPotential: 0.75,
    suggestedVisualizations: ['nonsense_mutation', 'premature_stop'],
    keyTerms: ['终止密码子', '蛋白质截断', '提前终止'],
  },

  // DNA修复
  'DNA修复': {
    concept: 'DNA修复',
    domain: '分子遗传学',
    complexity: 'advanced',
    visualizationPotential: 0.8,
    suggestedVisualizations: ['dna_repair_mechanisms', 'repair_pathways'],
    keyTerms: ['直接修复', '切除修复', '错配修复', '重组修复', 'SOS修复'],
  },
};
