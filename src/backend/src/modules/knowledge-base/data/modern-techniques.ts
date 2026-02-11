import { ConceptAnalysis } from '@shared/types/agent.types';

/**
 * 现代遗传学技术概念数据
 */
export const modernTechniquesData: Record<string, ConceptAnalysis> = {
  // 基因工程
  '基因工程': {
    concept: '基因工程',
    domain: '生物技术',
    complexity: 'advanced',
    visualizationPotential: 0.85,
    suggestedVisualizations: ['genetic_engineering', 'recombinant_dna'],
    keyTerms: ['重组DNA', '载体', '限制酶', '连接酶', '转基因'],
  },

  // 重组DNA技术
  '重组DNA技术': {
    concept: '重组DNA技术',
    domain: '生物技术',
    complexity: 'advanced',
    visualizationPotential: 0.85,
    suggestedVisualizations: ['recombinant_dna_technology', 'gene_cloning'],
    keyTerms: ['DNA重组', '载体', '克隆', '宿主细胞'],
  },

  // 限制性内切酶
  '限制性内切酶': {
    concept: '限制性内切酶',
    domain: '分子生物学',
    complexity: 'advanced',
    visualizationPotential: 0.8,
    suggestedVisualizations: ['restriction_enzymes', 'dna_cleavage'],
    keyTerms: ['限制酶', '识别序列', '切割位点', '黏性末端', '平末端'],
  },

  // 质粒
  '质粒': {
    concept: '质粒',
    domain: '分子生物学',
    complexity: 'intermediate',
    visualizationPotential: 0.8,
    suggestedVisualizations: ['plasmid_structure', 'cloning_vector'],
    keyTerms: ['环状DNA', '载体', '复制原点', '抗性基因', '克隆载体'],
  },

  // 基因克隆
  '基因克隆': {
    concept: '基因克隆',
    domain: '生物技术',
    complexity: 'advanced',
    visualizationPotential: 0.85,
    suggestedVisualizations: ['gene_cloning', 'molecular_cloning'],
    keyTerms: ['DNA复制', '载体', '宿主细胞', '基因扩增'],
  },

  // PCR技术
  'PCR技术': {
    concept: 'PCR技术',
    domain: '分子生物学',
    complexity: 'intermediate',
    visualizationPotential: 0.9,
    suggestedVisualizations: ['pcr_cycles', 'dna_amplification'],
    keyTerms: ['聚合酶链式反应', 'DNA扩增', '引物', 'Taq酶', '变性', '退火', '延伸'],
  },

  // 转基因
  '转基因': {
    concept: '转基因',
    domain: '生物技术',
    complexity: 'advanced',
    visualizationPotential: 0.8,
    suggestedVisualizations: ['transgenic_organisms', 'gene_transfer'],
    keyTerms: ['外源基因', '转基因生物', '基因转移', '表达'],
  },

  // 基因治疗
  '基因治疗': {
    concept: '基因治疗',
    domain: '医学遗传学',
    complexity: 'advanced',
    visualizationPotential: 0.8,
    suggestedVisualizations: ['gene_therapy', 'viral_vectors'],
    keyTerms: ['遗传病治疗', '基因修复', '载体', '体内', '体外'],
  },

  // DNA测序
  'DNA测序': {
    concept: 'DNA测序',
    domain: '分子生物学',
    complexity: 'advanced',
    visualizationPotential: 0.8,
    suggestedVisualizations: ['dna_sequencing', 'sequence_analysis'],
    keyTerms: ['碱基序列', '桑格测序', '二代测序', '三代测序'],
  },

  // 人类基因组计划
  '人类基因组计划': {
    concept: '人类基因组计划',
    domain: '基因组学',
    complexity: 'advanced',
    visualizationPotential: 0.75,
    suggestedVisualizations: ['human_genome_project', 'genome_mapping'],
    keyTerms: ['基因组测序', '30亿碱基对', '基因图谱', '2003年完成'],
  },

  // CRISPR
  'CRISPR': {
    concept: 'CRISPR',
    domain: '基因编辑',
    complexity: 'advanced',
    visualizationPotential: 0.9,
    suggestedVisualizations: ['crispr_cas9', 'gene_editing'],
    keyTerms: ['基因编辑', 'Cas9', '向导RNA', '双链断裂', '基因敲除', '基因敲入'],
  },

  // 基因编辑
  '基因编辑': {
    concept: '基因编辑',
    domain: '生物技术',
    complexity: 'advanced',
    visualizationPotential: 0.85,
    suggestedVisualizations: ['gene_editing', 'genome_modification'],
    keyTerms: ['CRISPR', '基因修饰', '基因敲除', '基因敲入', '碱基编辑'],
  },

  // 遗传标记
  '遗传标记': {
    concept: '遗传标记',
    domain: '遗传学',
    complexity: 'intermediate',
    visualizationPotential: 0.75,
    suggestedVisualizations: ['genetic_markers', 'gene_mapping'],
    keyTerms: ['DNA标记', '基因定位', '连锁分析', 'RFLP', 'SNP'],
  },

  // SNP
  'SNP': {
    concept: 'SNP',
    domain: '遗传学',
    complexity: 'intermediate',
    visualizationPotential: 0.75,
    suggestedVisualizations: ['snp', 'single_nucleotide_polymorphism'],
    keyTerms: ['单核苷酸多态性', '基因变异', '基因分型', '关联分析'],
  },

  // DNA指纹
  'DNA指纹': {
    concept: 'DNA指纹',
    domain: '法医学',
    complexity: 'intermediate',
    visualizationPotential: 0.8,
    suggestedVisualizations: ['dna_fingerprinting', 'forensic_analysis'],
    keyTerms: ['VNTR', 'STR', '个体识别', '亲子鉴定'],
  },

  // RFLP
  'RFLP': {
    concept: 'RFLP',
    domain: '分子遗传学',
    complexity: 'intermediate',
    visualizationPotential: 0.75,
    suggestedVisualizations: ['rflp', 'restriction_fragment_length'],
    keyTerms: ['限制性片段长度多态性', '限制酶切', 'DNA多态性'],
  },
};
