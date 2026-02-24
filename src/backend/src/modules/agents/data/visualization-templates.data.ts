export const VISUALIZATION_TEMPLATES = [
  {
    templateId: 'punnett-monohybrid-basic',
    concept: '孟德尔第一定律',
    conceptKeywords: ['孟德尔', '分离定律', '单基因杂交', '显隐性', '基因型', '表型', '配子'],
    vizType: 'punnett_square',
    vizCategory: 'punnett',
    title: '单基因杂交Punnett方格',
    description: '展示一对等位基因杂交后代的基因型和表型分布',
    applicableScenarios: [
      '单基因杂交预测',
      '显隐性遗传分析',
      '基因型表型比例计算'
    ],
    templateStructure: {
      type: 'dynamic',
      components: [
        {
          id: 'male-gametes',
          type: 'group',
          componentType: 'cell',
          position: 'auto',
          properties: { orientation: 'top' },
          contentSource: 'extracted',
          dataExtraction: {
            sourceField: 'maleGametes'
          }
        },
        {
          id: 'female-gametes',
          type: 'group',
          componentType: 'cell',
          position: 'auto',
          properties: { orientation: 'left' },
          contentSource: 'extracted',
          dataExtraction: {
            sourceField: 'femaleGametes'
          }
        },
        {
          id: 'offspring-grid',
          type: 'group',
          componentType: 'grid',
          position: 'auto',
          properties: { rows: 2, columns: 2 },
          contentSource: 'extracted',
          dataExtraction: {
            sourceField: 'offspring'
          }
        }
      ],
      parameters: [
        {
          name: 'maleGametes',
          type: 'array',
          description: '雄配子基因型',
          required: true,
          extractionRules: {
            pattern: '[A-Z][a-z]?',
            examples: ['A', 'a', 'B', 'b']
          }
        },
        {
          name: 'femaleGametes',
          type: 'array',
          description: '雌配子基因型',
          required: true,
          extractionRules: {
            pattern: '[A-Z][a-z]?',
            examples: ['A', 'a', 'B', 'b']
          }
        },
        {
          name: 'offspring',
          type: 'array',
          description: '后代表型分布',
          required: true
        }
      ]
    },
    dataGenerationRules: {
      extractionPattern: '(?:配子|杂交|后代).*?([A-Z][a-z]?)',
      computedFields: [
        {
          field: 'phenotypeRatios',
          formula: 'count_by_phenotype(offspring)',
          variables: { 'offspring': 'offspring' }
        }
      ],
      fallbackDefaults: {
        maleGametes: ['A', 'a'],
        femaleGametes: ['A', 'a'],
        offspring: [
          { genotype: 'AA', phenotype: '显性', probability: 0.25 },
          { genotype: 'Aa', phenotype: '显性', probability: 0.5 },
          { genotype: 'aa', phenotype: '隐性', probability: 0.25 }
        ]
      }
    },
    styling: {
      colorScheme: ['#10B981', '#EF4444', '#3B82F6'],
      layout: 'grid',
      interactionLevel: 'basic'
    },
    educationalAids: {
      keyPoints: [
        '配子形成时等位基因分离',
        '受精时雌雄配子随机结合',
        'F2代出现3:1表型比例'
      ],
      commonMistakes: [
        '认为F1代全部是显性个体',
        '忽略基因型和表型的区别',
        '错误计算概率'
      ],
      thinkingProcess: [
        '第一步：确定亲本的基因型',
        '第二步：写出可能的配子类型',
        '第三步：绘制Punnett方格',
        '第四步：统计后代基因型和表型',
        '第五步：计算各表型的概率'
      ]
    },
    metadata: {
      chapter: '第二章 孟德尔定律',
      difficulty: 'basic',
      prerequisites: ['等位基因', '配子'],
      relatedConcepts: ['孟德尔第二定律', '显隐性关系'],
      tags: ['经典遗传', '杂交', '概率']
    }
  },
  {
    templateId: 'meiosis-prophase-i',
    concept: '减数分裂前期I',
    conceptKeywords: ['减数分裂', '前期', '同源染色体', '联会', '四分体', '交叉'],
    vizType: 'chromosome_behavior',
    vizCategory: 'chromosome',
    title: '减数分裂前期I染色体行为',
    description: '展示同源染色体配对和联会过程',
    applicableScenarios: [
      '减数分裂过程学习',
      '同源染色体行为分析',
      '联会和交叉过程'
    ],
    templateStructure: {
      type: 'dynamic',
      components: [
        {
          id: 'cell-nucleus',
          type: 'element',
          componentType: 'cell',
          position: { x: 50, y: 50 },
          properties: { radius: 40, phase: 'prophase-i' },
          contentSource: 'static'
        },
        {
          id: 'homologous-pairs',
          type: 'group',
          componentType: 'chromosome',
          position: 'auto',
          properties: { state: 'pairing' },
          contentSource: 'extracted',
          dataExtraction: {
            sourceField: 'chromosomePairs',
            transform: 'pair_homologous'
          }
        }
      ],
      parameters: [
        {
          name: 'chromosomePairs',
          type: 'array',
          description: '同源染色体对数',
          required: true,
          defaultValue: 23,
          extractionRules: {
            pattern: '\\d+对同源染色体',
            examples: ['23对', '4对']
          }
        },
        {
          name: 'crossoverFrequency',
          type: 'number',
          description: '交叉频率',
          required: false,
          defaultValue: 0.1
        }
      ]
    },
    dataGenerationRules: {
      extractionPattern: '同源染色体\\s*(\\d+)\\s*对',
      computedFields: [],
      fallbackDefaults: {
        chromosomePairs: Array.from({ length: 4 }, (_, i) => ({
          id: `pair-${i}`,
          homologous1: { id: `chr${i * 2}a`, genes: [] },
          homologous2: { id: `chr${i * 2}b`, genes: [] },
          crossover: i < 1
        })),
        crossoverFrequency: 0.25
      }
    },
    styling: {
      colorScheme: ['#8B5CF6', '#EC4899', '#3B82F6'],
      layout: 'network',
      interactionLevel: 'animated'
    },
    educationalAids: {
      keyPoints: [
        '同源染色体在前期I配对',
        '联会形成四分体',
        '非姐妹染色单体可能交叉',
        '同源染色体分离发生在中期I'
      ],
      commonMistakes: [
        '混淆姐妹染色单体和非姐妹染色单体',
        '认为交叉发生在任何阶段',
        '忽略染色体数目变化'
      ],
      thinkingProcess: [
        '识别减数分裂阶段',
        '观察同源染色体状态',
        '确定是否发生交叉',
        '分析染色体分离模式'
      ]
    },
    metadata: {
      chapter: '第四章 染色体',
      difficulty: 'intermediate',
      prerequisites: ['有丝分裂', '染色体结构'],
      relatedConcepts: ['减数分裂中期', '减数分裂后期'],
      tags: ['细胞分裂', '减数分裂', '染色体行为']
    }
  },
  {
    templateId: 'probability-binomial',
    concept: '二项分布',
    conceptKeywords: ['二项分布', '概率', '分布', '独立事件', '重复试验', '伯努利'],
    vizType: 'probability_distribution',
    vizCategory: 'chart',
    title: '二项分布概率图',
    description: '展示多次独立重复试验的概率分布',
    applicableScenarios: [
      '遗传概率计算',
      '独立事件分析',
      '多次重复试验'
    ],
    templateStructure: {
      type: 'dynamic',
      components: [
        {
          id: 'chart-axis',
          type: 'element',
          componentType: 'chart',
          position: 'auto',
          properties: { chartType: 'bar' },
          contentSource: 'extracted',
          dataExtraction: {
            sourceField: 'distributionData'
          }
        }
      ],
      parameters: [
        {
          name: 'n',
          type: 'number',
          description: '试验次数',
          required: true,
          extractionRules: {
            pattern: '\\d+\\s*(?:次|次试验)',
            examples: ['4次', '10次试验', '5次']
          }
        },
        {
          name: 'p',
          type: 'number',
          description: '成功概率',
          required: true,
          defaultValue: 0.5,
          extractionRules: {
            pattern: '概率[：:]\\s*([0-9.]+)',
            examples: ['概率: 0.5', '概率是0.25', '成功概率为0.75']
          }
        },
        {
          name: 'distributionData',
          type: 'array',
          description: '概率分布数据',
          required: true
        }
      ]
    },
    dataGenerationRules: {
      extractionPattern: '(\\d+)\\s*(?:次|次试验).*?概率.*?([0-9.]+)',
      computedFields: [
        {
          field: 'distributionData',
          formula: 'binomial_distribution(n, p)',
          variables: { 'n': 'n', 'p': 'p' }
        }
      ],
      fallbackDefaults: {
        n: 4,
        p: 0.25,
        distributionData: [
          { outcome: '4个显性', probability: 0.0039 },
          { outcome: '3个显性', probability: 0.0625 },
          { outcome: '2个显性', probability: 0.1875 },
          { outcome: '1个显性', probability: 0.3125 },
          { outcome: '0个显性', probability: 0.4336 }
        ]
      }
    },
    styling: {
      colorScheme: ['#F59E0B', '#10B981', '#3B82F6'],
      layout: 'grid',
      interactionLevel: 'interactive'
    },
    educationalAids: {
      keyPoints: [
        '二项分布适用于n次独立重复试验',
        '每次试验只有成功/失败两种结果',
        '成功概率p保持不变',
        '公式：(n choose k) * p^k * (1-p)^(n-k)'
      ],
      commonMistakes: [
        '忽略试验的独立性条件',
        '错误计算组合数',
        '混淆成功和失败的概率'
      ],
      thinkingProcess: [
        '确定试验次数n',
        '确定成功概率p',
        '应用二项分布公式',
        '计算各结果概率'
      ]
    },
    metadata: {
      chapter: '第二章 孟德尔定律',
      difficulty: 'intermediate',
      prerequisites: ['概率基础', '组合数学'],
      relatedConcepts: ['正态分布', '泊松分布'],
      tags: ['概率', '分布', '统计学']
    }
  }
];
