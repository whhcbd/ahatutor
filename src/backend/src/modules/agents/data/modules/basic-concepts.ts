import type { VisualizationSuggestion } from '@shared/types/agent.types';

export const BASIC_CONCEPTS: Record<string, Omit<VisualizationSuggestion, 'insights'>> = {
  '基因型与表型': {
    type: 'probability_distribution',
    title: '基因型与表型关系可视化',
    description: '展示基因型如何决定表型，以及显性和隐性的表达方式。',
    elements: ['显性', '隐性', '表型', '基因型'],
    layout: 'hierarchical',
    interactions: ['hover', 'click'],
    colors: {
      dominant: '#4CAF50',
      recessive: '#FF9800',
      heterozygous: '#2196F3',
    },
    data: {
      categories: ['AA（显性纯合）', 'Aa（杂合子）', 'aa（隐性纯合）'],
      values: [0.25, 0.5, 0.25],
      colors: ['#4CAF50', '#2196F3', '#FF9800'],
      total: 'Aa × Aa 杂交结果',
      formula: '1AA : 2Aa : 1aa',
      phenotypeMapping: {
        'AA': '显性表型',
        'Aa': '显性表型',
        'aa': '隐性表型'
      },
      phenotypeRatio: '3显性 : 1隐性'
    },
    annotations: [
      '显性基因掩盖隐性基因的表达',
      '杂合子Aa表现为显性表型',
      '基因型比1:2:1，表型比3:1'
    ]
  },

  '中心法则': {
    type: 'diagram',
    title: '中心法则可视化',
    description: '展示遗传信息的流动方向：DNA → RNA → 蛋白质，以及某些病毒中的RNA → RNA和RNA → DNA的特殊情况。',
    elements: ['DNA', 'RNA', '蛋白质', '转录', '翻译', '逆转录'],
    layout: 'hierarchical',
    interactions: ['hover', 'click'],
    colors: {
      dna: '#4CAF50',
      rna: '#2196F3',
      protein: '#FF9800',
      transcription: '#9C27B0',
      translation: '#7B1FA2',
      reverseTranscription: '#F44336',
    },
    data: {
      flow: [
        { from: 'DNA', to: 'RNA', process: '转录', enzyme: 'RNA聚合酶', location: '细胞核' },
        { from: 'RNA', to: '蛋白质', process: '翻译', enzyme: '核糖体', location: '细胞质' }
      ],
      exceptions: [
        {
          virus: 'RNA病毒',
          flow: 'RNA → RNA',
          process: 'RNA复制',
          enzyme: 'RNA依赖的RNA聚合酶',
          example: '冠状病毒、流感病毒'
        },
        {
          virus: '逆转录病毒',
          flow: 'RNA → DNA → RNA → 蛋白质',
          process: '逆转录',
          enzyme: '逆转录酶',
          example: 'HIV、乙肝病毒'
        }
      ],
      summary: '大多数生物遵循 DNA → RNA → 蛋白质'
    },
    annotations: [
      '中心法则由Crick于1958年提出',
      '转录：遗传信息从DNA转移到RNA',
      '翻译：遗传信息从RNA转移到蛋白质',
      '逆转录是对中心法则的重要补充'
    ]
  },

  '基因': {
    type: 'diagram',
    title: '基因结构可视化',
    description: '展示基因的基本结构：包括启动子、外显子、内含子、终止子等组成部分。',
    elements: ['启动子', '外显子', '内含子', '终止子', '增强子', '非翻译区'],
    layout: 'hierarchical',
    interactions: ['hover', 'click'],
    colors: {
      promoter: '#2196F3',
      exon: '#4CAF50',
      intron: '#FF9800',
      terminator: '#F44336',
      utr: '#9C27B0',
      enhancer: '#7B1FA2',
    },
    data: {
      structure: [
        { name: '启动子', description: 'RNA聚合酶结合位点，决定转录起始', position: '基因上游' },
        { name: '5\'非翻译区(5\' UTR)', description: '不翻译成蛋白质的mRNA序列', position: '转录起始位点上游' },
        { name: '外显子', description: '编码蛋白质的序列，保留在成熟mRNA中', position: '基因主体' },
        { name: '内含子', description: '不编码蛋白质的序列，转录后切除', position: '基因主体' },
        { name: '3\'非翻译区(3\' UTR)', description: '不翻译成蛋白质的mRNA序列', position: '转录终止位点下游' },
        { name: '终止子', description: '转录终止信号', position: '基因下游' }
      ],
      regulatory: [
        { name: '增强子', description: '激活转录的调控元件', feature: '可远距离作用' },
        { name: '沉默子', description: '抑制转录的调控元件', feature: '可远距离作用' },
        { name: '绝缘子', description: '阻断增强子作用的边界元件', feature: '防止非特异性激活' }
      ],
      processing: [
        { step: 1, process: '转录', description: 'DNA转录成前体mRNA' },
        { step: 2, process: '剪接', description: '切除内含子，连接外显子' },
        { step: 3, process: '加帽加尾', description: '5\'加m7G帽，3\'加polyA尾' },
        { step: 4, process: '翻译', description: '成熟mRNA翻译成蛋白质' }
      ]
    },
    annotations: [
      '基因是遗传信息的基本单位',
      '人类基因组约2万个基因',
      '真核生物基因通常含有内含子',
      '原核生物基因通常不含内含子'
    ]
  },

  '等位基因': {
    type: 'diagram',
    title: '等位基因概念可视化',
    description: '展示等位基因的定义和类型：位于同源染色体同一基因座上的不同基因形式。',
    elements: ['同源染色体', '基因座', '等位基因', '显性等位基因', '隐性等位基因', '共显性等位基因', '复等位基因'],
    layout: 'hierarchical',
    interactions: ['hover', 'click'],
    colors: {
      chromosome1: '#4CAF50',
      chromosome2: '#2196F3',
      locus: '#FF9800',
      dominant: '#F44336',
      recessive: '#FFB74D',
      codominant: '#9C27B0',
      multiple: '#7B1FA2',
    },
    data: {
      definition: {
        locus: '同源染色体上相同的位置',
        alleles: '同一基因座上的不同基因形式',
        pairs: '二倍体生物每个基因座有两个等位基因'
      },
      alleleTypes: [
        {
          name: '显性等位基因',
          symbol: '大写字母（A）',
          expression: '在杂合状态下也能表达',
          example: '豌豆的圆粒基因（R）'
        },
        {
          name: '隐性等位基因',
          symbol: '小写字母（a）',
          expression: '只在纯合状态下表达',
          example: '豌豆的皱粒基因（r）'
        },
        {
          name: '共显性等位基因',
          symbol: '上标字母（IA, IB）',
          expression: '两个等位基因都表达，产生中间表型',
          example: 'ABO血型的IA和IB'
        },
        {
          name: '复等位基因',
          symbol: '多个等位基因（A1, A2, A3...）',
          expression: '群体中有多个等位基因，个体只有两个',
          example: 'ABO血型系统（IA, IB, i）'
        }
      ],
      examples: [
        {
          trait: '豌豆形状',
          locus: '豌豆第7号染色体',
          alleles: ['R（圆粒，显性）', 'r（皱粒，隐性）'],
          genotypes: ['RR（圆粒）', 'Rr（圆粒）', 'rr（皱粒）']
        },
        {
          trait: 'ABO血型',
          locus: '人类第9号染色体',
          alleles: ['IA（A型抗原）', 'IB（B型抗原）', 'i（无抗原）'],
          genotypes: ['IAIA或IAi（A型）', 'IBIB或IBi（B型）', 'IAIB（AB型，共显性）', 'ii（O型）']
        },
        {
          trait: '毛色（孟德尔的兔子）',
          locus: '兔子某染色体',
          alleles: ['C（全色）', 'cch（喜马拉雅）', 'ch（白化）', 'c（全白）'],
          description: '复等位基因，显性等级：C > cch > ch > c'
        }
      ],
      inheritancePatterns: [
        {
          name: '完全显性',
          description: '显性等位基因完全掩盖隐性等位基因',
          example: '豌豆圆粒与皱粒'
        },
        {
          name: '不完全显性',
          description: '杂合子表型介于两个纯合子之间',
          example: '金鱼草红花与白花杂交产生粉红花'
        },
        {
          name: '共显性',
          description: '两个等位基因都表达，产生独特表型',
          example: 'ABO血型的AB型'
        }
      ]
    },
    annotations: [
      '等位基因是由突变产生的',
      '孟德尔遗传定律基于等位基因的分离',
      '复等位基因增加群体的遗传多样性',
      '等位基因频率是群体遗传学的重要参数'
    ]
  },

  '纯合子与杂合子': {
    type: 'diagram',
    title: '纯合子与杂合子可视化',
    description: '展示纯合子、杂合子的概念及其在遗传中的作用。',
    elements: ['纯合子', '杂合子', '显性纯合子', '隐性纯合子', '同源染色体', '等位基因'],
    layout: 'hierarchical',
    interactions: ['hover', 'click'],
    colors: {
      homozygousDominant: '#4CAF50',
      homozygousRecessive: '#FF9800',
      heterozygous: '#2196F3',
      chromosome: '#9C27B0',
    },
    data: {
      definitions: [
        {
          name: '纯合子',
          definition: '同源染色体同一基因座上的两个等位基因相同',
          types: [
            {
              name: '显性纯合子',
              genotype: 'AA',
              phenotype: '显性表型',
              example: '豌豆圆粒（RR）'
            },
            {
              name: '隐性纯合子',
              genotype: 'aa',
              phenotype: '隐性表型',
              example: '豌豆皱粒（rr）'
            }
          ]
        },
        {
          name: '杂合子',
          definition: '同源染色体同一基因座上的两个等位基因不同',
          genotype: 'Aa',
          phenotype: '显性表型（完全显性情况下）',
          example: '豌豆圆粒（Rr）'
        }
      ],
      inheritance: {
        homozygous: {
          breeding: '纯合子自交，后代基因型一致',
          trueBreeding: '纯合子称为真实遗传',
          examples: ['RR × RR → 全部RR', 'rr × rr → 全部rr']
        },
        heterozygous: {
          breeding: '杂合子自交，后代出现性状分离',
          segregation: '符合孟德尔分离定律',
          examples: ['Rr × Rr → 1/4 RR : 1/2 Rr : 1/4 rr']
        }
      },
      geneticCrosses: [
        {
          cross: '纯合子 × 纯合子（AA × aa）',
          f1: '全部杂合子（Aa）',
          f1Phenotype: '全部显性表型',
          f2: '自交F1 → 3/4 显性 : 1/4 隐性'
        },
        {
          cross: '杂合子 × 隐性纯合子（Aa × aa）',
          ratio: '1/2 Aa : 1/2 aa',
          phenotype: '1/2 显性 : 1/2 隐性',
          application: '测交，检测未知基因型'
        },
        {
          cross: '杂合子 × 杂合子（Aa × Aa）',
          ratio: '1/4 AA : 1/2 Aa : 1/4 aa',
          phenotype: '3/4 显性 : 1/4 隐性',
          name: '杂合子杂交，经典孟德尔比例'
        }
      ],
      importance: [
        '纯合子用于建立稳定遗传品系',
        '杂合子用于产生遗传变异',
        '杂合优势：杂合子在某些性状上优于纯合子',
        '近交导致纯合度增加，可能产生近交衰退'
      ]
    },
    annotations: [
      '纯合子产生配子时，等位基因不分离',
      '杂合子产生配子时，等位基因按1:1分离',
      '测交可以鉴定杂合子',
      '杂合优势是杂交育种的基础'
    ]
  }
};
