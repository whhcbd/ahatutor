import { Injectable, Logger } from '@nestjs/common';
import { ConceptAnalysis, PrerequisiteNode, GeneticsEnrichment } from '@shared/types/agent.types';

/**
 * 静态知识库服务
 * 提供预定义的遗传学概念数据，避免频繁调用 AI
 */
@Injectable()
export class KnowledgeBaseService {
  private readonly logger = new Logger(KnowledgeBaseService.name);

  // 预定义的遗传学概念数据库
  private readonly conceptDatabase = new Map<string, {
    analysis: ConceptAnalysis;
    prerequisites: PrerequisiteNode;
    enrichment: GeneticsEnrichment;
  }>();

  constructor() {
    this.initializeKnowledgeBase();
  }

  /**
   * 初始化知识库 - 预定义常见遗传学概念
   */
  private initializeKnowledgeBase() {
    // 孟德尔第一定律（分离定律）
    this.conceptDatabase.set('孟德尔第一定律', {
      analysis: {
        concept: '孟德尔第一定律',
        domain: '遗传学',
        complexity: 'basic',
        visualizationPotential: 0.8,
        suggestedVisualizations: ['punnett_square', 'inheritance_pattern'],
        keyTerms: ['等位基因', '显性', '隐性', '分离', '配子'],
      },
      prerequisites: this.getPrerequisitesFor('孟德尔第一定律'),
      enrichment: this.getEnrichmentFor('孟德尔第一定律'),
    });

    // 孟德尔第二定律（自由组合定律）
    this.conceptDatabase.set('孟德尔第二定律', {
      analysis: {
        concept: '孟德尔第二定律',
        domain: '遗传学',
        complexity: 'intermediate',
        visualizationPotential: 0.85,
        suggestedVisualizations: ['dihybrid_cross', 'punnett_square_16'],
        keyTerms: ['自由组合', '两对性状', '独立分配', '配子组合'],
      },
      prerequisites: this.getPrerequisitesFor('孟德尔第二定律'),
      enrichment: this.getEnrichmentFor('孟德尔第二定律'),
    });

    // 伴性遗传
    this.conceptDatabase.set('伴性遗传', {
      analysis: {
        concept: '伴性遗传',
        domain: '遗传学',
        complexity: 'intermediate',
        visualizationPotential: 0.9,
        suggestedVisualizations: ['sex_chromosome_inheritance', 'pedigree_chart'],
        keyTerms: ['性染色体', 'X连锁', 'Y连锁', '伴性遗传', '携带者'],
      },
      prerequisites: this.getPrerequisitesFor('伴性遗传'),
      enrichment: this.getEnrichmentFor('伴性遗传'),
    });

    // 连锁互换
    this.conceptDatabase.set('连锁互换', {
      analysis: {
        concept: '连锁互换',
        domain: '遗传学',
        complexity: 'advanced',
        visualizationPotential: 0.85,
        suggestedVisualizations: ['chromosome_crossover', 'genetic_mapping'],
        keyTerms: ['连锁', '互换', '同源染色体', '交叉', '基因定位'],
      },
      prerequisites: this.getPrerequisitesFor('连锁互换'),
      enrichment: this.getEnrichmentFor('连锁互换'),
    });

    // 哈代-温伯格定律
    this.conceptDatabase.set('哈代-温伯格定律', {
      analysis: {
        concept: '哈代-温伯格定律',
        domain: '群体遗传学',
        complexity: 'advanced',
        visualizationPotential: 0.7,
        suggestedVisualizations: ['allele_frequency', 'population_equilibrium'],
        keyTerms: ['基因频率', '基因型频率', '遗传平衡', '理想群体'],
      },
      prerequisites: this.getPrerequisitesFor('哈代-温伯格定律'),
      enrichment: this.getEnrichmentFor('哈代-温伯格定律'),
    });

    // 基因型与表型
    this.conceptDatabase.set('基因型与表型', {
      analysis: {
        concept: '基因型与表型',
        domain: '遗传学',
        complexity: 'basic',
        visualizationPotential: 0.75,
        suggestedVisualizations: ['genotype_phenotype_mapping'],
        keyTerms: ['基因型', '表型', '表现度', '外显率'],
      },
      prerequisites: this.getPrerequisitesFor('基因型与表型'),
      enrichment: this.getEnrichmentFor('基因型与表型'),
    });

    // DNA复制
    this.conceptDatabase.set('DNA复制', {
      analysis: {
        concept: 'DNA复制',
        domain: '分子遗传学',
        complexity: 'intermediate',
        visualizationPotential: 0.9,
        suggestedVisualizations: ['dna_replication_fork', 'semi_conservative'],
        keyTerms: ['半保留复制', '复制叉', 'DNA聚合酶', '引物', '冈崎片段'],
      },
      prerequisites: this.getPrerequisitesFor('DNA复制'),
      enrichment: this.getEnrichmentFor('DNA复制'),
    });

    // 转录与翻译
    this.conceptDatabase.set('转录与翻译', {
      analysis: {
        concept: '转录与翻译',
        domain: '分子遗传学',
        complexity: 'intermediate',
        visualizationPotential: 0.9,
        suggestedVisualizations: ['central_dogma', 'protein_synthesis'],
        keyTerms: ['转录', '翻译', 'mRNA', 'tRNA', '核糖体', '密码子', '反密码子'],
      },
      prerequisites: this.getPrerequisitesFor('转录与翻译'),
      enrichment: this.getEnrichmentFor('转录与翻译'),
    });

    // 基因突变
    this.conceptDatabase.set('基因突变', {
      analysis: {
        concept: '基因突变',
        domain: '遗传学',
        complexity: 'intermediate',
        visualizationPotential: 0.8,
        suggestedVisualizations: ['mutation_types', 'dna_sequence_change'],
        keyTerms: ['点突变', '插入', '缺失', '置换', ' frameshift'],
      },
      prerequisites: this.getPrerequisitesFor('基因突变'),
      enrichment: this.getEnrichmentFor('基因突变'),
    });

    // 减数分裂
    this.conceptDatabase.set('减数分裂', {
      analysis: {
        concept: '减数分裂',
        domain: '细胞遗传学',
        complexity: 'intermediate',
        visualizationPotential: 0.95,
        suggestedVisualizations: ['meiosis_stages', 'chromosome_segregation'],
        keyTerms: ['减数分裂', '配子', '同源染色体', '交叉互换', '四分体'],
      },
      prerequisites: this.getPrerequisitesFor('减数分裂'),
      enrichment: this.getEnrichmentFor('减数分裂'),
    });

    this.logger.log(`Knowledge base initialized with ${this.conceptDatabase.size} concepts`);
  }

  /**
   * 检查概念是否存在于知识库中
   */
  hasConcept(concept: string): boolean {
    return this.conceptDatabase.has(concept);
  }

  /**
   * 获取概念分析
   */
  getConceptAnalysis(concept: string): ConceptAnalysis | null {
    const data = this.conceptDatabase.get(concept);
    return data?.analysis || null;
  }

  /**
   * 获取前置知识树
   */
  getPrerequisites(concept: string): PrerequisiteNode | null {
    const data = this.conceptDatabase.get(concept);
    return data?.prerequisites || null;
  }

  /**
   * 获取遗传学丰富内容
   */
  getEnrichment(concept: string): GeneticsEnrichment | null {
    const data = this.conceptDatabase.get(concept);
    return data?.enrichment || null;
  }

  /**
   * 获取完整的概念数据
   */
  getConceptData(concept: string) {
    return this.conceptDatabase.get(concept) || null;
  }

  /**
   * 搜索相关概念
   */
  searchConcepts(query: string): string[] {
    const results: string[] = [];
    const lowerQuery = query.toLowerCase();

    for (const concept of this.conceptDatabase.keys()) {
      if (concept.toLowerCase().includes(lowerQuery)) {
        results.push(concept);
      }
    }

    return results;
  }

  // ==================== 私有方法：生成各概念的数据 ====================

  private getPrerequisitesFor(concept: string): PrerequisiteNode {
    const prerequisiteMap: Record<string, PrerequisiteNode> = {
      '孟德尔第一定律': {
        concept: '基因',
        isFoundation: true,
        level: 1,
        prerequisites: [
          { concept: 'DNA', isFoundation: true, level: 2, prerequisites: [] },
          { concept: '染色体', isFoundation: true, level: 2, prerequisites: [] },
        ],
      },
      '孟德尔第二定律': {
        concept: '孟德尔第一定律',
        isFoundation: true,
        level: 1,
        prerequisites: [
          { concept: '基因', isFoundation: true, level: 2, prerequisites: [] },
          { concept: '配子形成', isFoundation: false, level: 2, prerequisites: [] },
        ],
      },
      '伴性遗传': {
        concept: '孟德尔定律',
        isFoundation: true,
        level: 1,
        prerequisites: [
          { concept: '性染色体', isFoundation: true, level: 2, prerequisites: [] },
          { concept: '基因', isFoundation: true, level: 2, prerequisites: [] },
        ],
      },
      '连锁互换': {
        concept: '孟德尔第二定律',
        isFoundation: true,
        level: 1,
        prerequisites: [
          { concept: '同源染色体', isFoundation: true, level: 2, prerequisites: [] },
          { concept: '交叉互换', isFoundation: false, level: 2, prerequisites: [] },
        ],
      },
      '哈代-温伯格定律': {
        concept: '孟德尔定律',
        isFoundation: true,
        level: 1,
        prerequisites: [
          { concept: '基因频率', isFoundation: false, level: 2, prerequisites: [] },
          { concept: '基因型频率', isFoundation: false, level: 2, prerequisites: [] },
          { concept: '群体', isFoundation: false, level: 2, prerequisites: [] },
        ],
      },
      '基因型与表型': {
        concept: '基因',
        isFoundation: true,
        level: 1,
        prerequisites: [
          { concept: 'DNA', isFoundation: true, level: 2, prerequisites: [] },
          { concept: '蛋白质', isFoundation: false, level: 2, prerequisites: [] },
        ],
      },
      'DNA复制': {
        concept: 'DNA',
        isFoundation: true,
        level: 1,
        prerequisites: [
          { concept: 'DNA结构', isFoundation: true, level: 2, prerequisites: [] },
          { concept: '酶', isFoundation: false, level: 2, prerequisites: [] },
        ],
      },
      '转录与翻译': {
        concept: 'DNA',
        isFoundation: true,
        level: 1,
        prerequisites: [
          { concept: 'RNA', isFoundation: true, level: 2, prerequisites: [] },
          { concept: '蛋白质合成', isFoundation: false, level: 2, prerequisites: [] },
          { concept: '核糖体', isFoundation: false, level: 2, prerequisites: [] },
        ],
      },
      '基因突变': {
        concept: 'DNA',
        isFoundation: true,
        level: 1,
        prerequisites: [
          { concept: 'DNA复制', isFoundation: false, level: 2, prerequisites: [] },
          { concept: 'DNA修复', isFoundation: false, level: 2, prerequisites: [] },
        ],
      },
      '减数分裂': {
        concept: '细胞分裂',
        isFoundation: true,
        level: 1,
        prerequisites: [
          { concept: '有丝分裂', isFoundation: true, level: 2, prerequisites: [] },
          { concept: '染色体', isFoundation: true, level: 2, prerequisites: [] },
          { concept: '配子', isFoundation: false, level: 2, prerequisites: [] },
        ],
      },
    };

    return prerequisiteMap[concept] || {
      concept: '基础遗传学',
      isFoundation: true,
      level: 1,
      prerequisites: [],
    };
  }

  private getEnrichmentFor(concept: string): GeneticsEnrichment {
    const enrichmentMap: Record<string, GeneticsEnrichment> = {
      '孟德尔第一定律': {
        concept: '孟德尔第一定律',
        definition: '在生物体的体细胞中，控制同一性状的遗传因子成对存在，不相融合；在形成配子时，成对的遗传因子彼此分离，分别进入不同的配子中，随配子遗传给后代',
        principles: [
          '分离定律：等位基因在配子形成时分离',
          '显隐性原理：显性基因掩盖隐性基因的表达',
          '纯合与杂合：AA、aa为纯合子，Aa为杂合子',
        ],
        formulas: [
          {
            key: '分离比',
            latex: '3:1',
            variables: {
              '3': '显性性状个体数',
              '1': '隐性性状个体数',
            },
          },
        ],
        examples: [
          {
            name: '豌豆高茎 × 矮茎',
            description: '纯合高茎(DD) × 纯合矮茎(dd) → F1全为高茎(Dd)，F2自交得到高茎:矮茎 = 3:1',
          },
        ],
        misconceptions: [
          '显性基因不是更优越，只是表达被优先显示',
          '杂合子携带的隐性基因可能在后代中表达',
          '分离比3:1只在大量样本中成立',
        ],
        visualization: {
          type: 'knowledge_graph',
          elements: ['Punnett方格', '配子', '等位基因', '表型比例'],
          colors: {
            dominant: '#4CAF50',
            recessive: '#9E9E9E',
            hybrid: '#2196F3',
          },
        },
      },
      '孟德尔第二定律': {
        concept: '孟德尔第二定律',
        definition: '控制不同性状的遗传因子在遗传时互不干扰，彼此分离，随机组合到不同的配子中',
        principles: [
          '自由组合定律：不同对性状独立遗传',
          '多对基因的组合遵循概率乘法原理',
          '适用于非同源染色体上的基因',
        ],
        formulas: [
          {
            key: '双杂交比例',
            latex: '9:3:3:1',
            variables: {
              '9': '双显性个体数',
              '3': '单显性个体数(每种)',
              '1': '双隐性个体数',
            },
          },
        ],
        examples: [
          {
            name: '豌豆双性状杂交',
            description: '黄色圆粒(YYRR) × 绿色皱粒(yyrr) → F2中得到9黄圆:3黄皱:3绿圆:1绿皱',
          },
        ],
        misconceptions: [
          '自由组合定律不适用于连锁基因',
          '实际比例可能因连锁而偏离9:3:3:1',
          '二对以上性状的组合更加复杂',
        ],
        visualization: {
          type: 'knowledge_graph',
          elements: ['Punnett方格16格', '两对性状', '独立分配'],
          colors: {
            trait1: '#4CAF50',
            trait2: '#2196F3',
          },
        },
      },
      '伴性遗传': {
        concept: '伴性遗传',
        definition: '位于性染色体上的基因所控制的性状在遗传时与性别相关联的遗传方式',
        principles: [
          'X连锁遗传：基因位于X染色体上',
          'Y连锁遗传：基因位于Y染色体上',
          '男性只有一条X染色体，更容易表现X连锁隐性性状',
        ],
        formulas: [
          {
            key: '伴性遗传概率',
            latex: 'P = \\frac{1}{2}',
            variables: {
              'P': '携带者母亲将X连锁基因传给儿子的概率',
            },
          },
        ],
        examples: [
          {
            name: '红绿色盲',
            description: 'X连锁隐性遗传，男性发病率高于女性，女性携带者正常但可遗传给儿子',
          },
          {
            name: '血友病',
            description: 'X连锁隐性遗传，主要通过女性携带者传递给男性后代',
          },
        ],
        misconceptions: [
          '不是所有伴性遗传都是男性发病更多',
          '女性X连锁隐性纯合子也会发病',
          'Y连锁基因只从父亲传给儿子',
        ],
        visualization: {
          type: 'knowledge_graph',
          elements: ['性染色体', '系谱图', '携带者', '交叉遗传'],
          colors: {
            X: '#FF69B4',
            Y: '#4169E1',
            affected: '#FF4444',
          },
        },
      },
      '连锁互换': {
        concept: '连锁互换',
        definition: '位于同一条染色体上的基因常常连在一起不相分离，称为连锁；在减数分裂四分体时期，同源染色体上的非姐妹染色单体之间发生交叉互换',
        principles: [
          '完全连锁：基因间距离很近，不发生互换',
          '不完全连锁：基因间发生互换，产生重组类型',
          '互换率与基因间距离成正比',
        ],
        formulas: [
          {
            key: '互换率',
            latex: 'RF = \\frac{重组型配子数}{总配子数} \\times 100\\%',
            variables: {
              'RF': '重组频率(Recombination Frequency)',
            },
          },
        ],
        examples: [
          {
            name: '果蝇连锁遗传',
            description: '果蝇的灰身(B)对黑身(b)、长翅(V)对残翅(v)为连锁遗传，互换率约17%',
          },
        ],
        misconceptions: [
          '连锁不是绝对的，几乎都会发生一定程度的互换',
          '互换率不能超过50%',
          '基因图距单位为厘摩(cM)，1cM≈1%互换率',
        ],
        visualization: {
          type: 'knowledge_graph',
          elements: ['同源染色体', '交叉点', '基因图', '重组配子'],
          colors: {
            chromosome1: '#FF6B6B',
            chromosome2: '#4ECDC4',
            crossover: '#FFE66D',
          },
        },
      },
      '哈代-温伯格定律': {
        concept: '哈代-温伯格定律',
        definition: '在一个理想群体中，若无突变、迁移、选择和遗传漂变，则基因频率和基因型频率将代代保持不变',
        principles: [
          '理想群体条件：无限大、随机交配、无突变、无迁移、无自然选择',
          'p + q = 1，p² + 2pq + q² = 1',
          '可用于计算携带者频率',
        ],
        formulas: [
          {
            key: '基因频率平衡公式',
            latex: 'p + q = 1',
            variables: {
              'p': '显性基因频率',
              'q': '隐性基因频率',
            },
          },
          {
            key: '基因型频率平衡公式',
            latex: 'p^2 + 2pq + q^2 = 1',
            variables: {
              'p²': '显性纯合子频率',
              '2pq': '杂合子频率',
              'q²': '隐性纯合子频率',
            },
          },
        ],
        examples: [
          {
            name: '计算白化病携带者频率',
            description: '白化病发病率为1/10000(q²)，则q=1/100，携带者频率2pq≈1/50',
          },
        ],
        misconceptions: [
          '自然群体很少完全符合哈代-温伯格平衡',
          '该定律提供的是理论基准，用于检测进化因素',
          '可以用该定律估算遗传病携带者频率',
        ],
        visualization: {
          type: 'chart',
          elements: ['基因频率分布', '群体遗传平衡', '基因型频率'],
          colors: {
            p: '#4CAF50',
            q: '#FF9800',
          },
        },
      },
      '基因型与表型': {
        concept: '基因型与表型',
        definition: '基因型是个体的遗传组成，表型是基因型与环境相互作用所表现出的可观察性状',
        principles: [
          '基因型决定表型的潜能',
          '环境可以影响表型的表达',
          '同一基因型在不同环境中可能产生不同表型',
        ],
        formulas: [],
        examples: [
          {
            name: '人类肤色',
            description: '肤色由多基因控制，也受阳光照射等环境影响',
          },
          {
            name: '花色',
            description: '某些花在不同pH土壤中呈现不同颜色',
          },
        ],
        misconceptions: [
          '表型相同不一定基因型相同',
          '外显率和表现度概念',
          '基因型不一定完全决定表型',
        ],
        visualization: {
          type: 'diagram',
          elements: ['基因型', '环境', '表型', '外显率', '表现度'],
          colors: {},
        },
      },
      'DNA复制': {
        concept: 'DNA复制',
        definition: '以亲代DNA分子为模板合成子代DNA分子的过程，是半保留复制',
        principles: [
          '半保留复制：每个子代DNA含一条亲代链和一条新合成的链',
          '双向复制：从复制起点向两个方向进行',
          '5\'→3\'方向合成：DNA聚合酶只能从5\'端向3\'端延伸',
        ],
        formulas: [],
        examples: [
          {
            name: '大肠杆菌DNA复制',
            description: '大肠杆菌基因组复制从单一起点开始，约40分钟完成',
          },
        ],
        misconceptions: [
          'DNA复制不是全保留复制',
          '后随链合成冈崎片段，然后连接',
          '需要RNA引物启动DNA合成',
        ],
        visualization: {
          type: 'animation',
          elements: ['复制叉', '前导链', '后随链', '冈崎片段'],
          colors: {
            leading: '#4CAF50',
            lagging: '#2196F3',
            parent: '#9E9E9E',
          },
        },
      },
      '转录与翻译': {
        concept: '转录与翻译',
        definition: '转录是以DNA为模板合成RNA的过程，翻译是以mRNA为模板合成蛋白质的过程',
        principles: [
          '中心法则：DNA→RNA→蛋白质',
          '转录在细胞核内进行，翻译在细胞质核糖体上进行',
          '遗传密码是通用的、简并的、无标点的',
        ],
        formulas: [],
        examples: [
          {
            name: '血红蛋白合成',
            description: '血红蛋白基因转录成mRNA，然后在核糖体上翻译成血红蛋白',
          },
        ],
        misconceptions: [
          '不是所有RNA都编码蛋白质',
          '原核生物转录和翻译可以同时进行',
          '密码子有64种，但只编码20种氨基酸',
        ],
        visualization: {
          type: 'animation',
          elements: ['DNA', 'mRNA', 'tRNA', '核糖体', '多肽链', '密码子'],
          colors: {
            dna: '#4CAF50',
            mrna: '#2196F3',
            trna: '#FF9800',
            protein: '#9C27B0',
          },
        },
      },
      '基因突变': {
        concept: '基因突变',
        definition: 'DNA分子中碱基对的增添、缺失或替换引起的基因结构改变',
        principles: [
          '基因突变是生物变异的根本来源',
          '具有普遍性、随机性、低频性、不定向性',
          '有害突变多，有利突变少',
        ],
        formulas: [],
        examples: [
          {
            name: '镰刀型细胞贫血症',
            description: '血红蛋白基因中一个碱基替换导致谷氨酸变为缬氨酸',
          },
        ],
        misconceptions: [
          '基因突变不都是有害的',
          '基因突变不一定改变蛋白质功能',
          '自然突变频率很低，但人工诱变可提高频率',
        ],
        visualization: {
          type: 'diagram',
          elements: ['点突变', '插入', '缺失', '置换', '移码突变'],
          colors: {
            normal: '#4CAF50',
            mutation: '#FF4444',
          },
        },
      },
      '减数分裂': {
        concept: '减数分裂',
        definition: '进行有性生殖的生物，在产生成熟生殖细胞时进行的染色体数目减半的细胞分裂',
        principles: [
          '减数分裂结果：染色体数目减半',
          'DNA复制一次，细胞连续分裂两次',
          '同源染色体联会、交叉互换',
        ],
        formulas: [],
        examples: [
          {
            name: '精子形成',
            description: '精原细胞经减数分裂产生4个精细胞，再经变形成为精子',
          },
        ],
        misconceptions: [
          '减数分裂不是产生体细胞的方式',
          '减数分裂和有丝分裂的主要区别',
          '同源染色体分离发生在减数第一次分裂',
        ],
        visualization: {
          type: 'animation',
          elements: ['间期', '减数第一次分裂', '减数第二次分裂', '配子'],
          colors: {
            phase1: '#4CAF50',
            phase2: '#2196F3',
            gamete: '#FF9800',
          },
        },
      },
    };

    return enrichmentMap[concept] || {
      concept,
      definition: `${concept}的相关概念解释`,
      principles: [],
      formulas: [],
      examples: [],
      misconceptions: [],
      visualization: {
        type: 'knowledge_graph',
        elements: [],
        colors: {},
      },
    };
  }
}
