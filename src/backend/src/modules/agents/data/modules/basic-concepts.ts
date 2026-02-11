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
  }
};
