import type { VisualizationSuggestion } from '@shared/types/agent.types';

export const MENDELIAN_GENETICS: Record<string, Omit<VisualizationSuggestion, 'insights'>> = {
  '孟德尔第一定律': {
    type: 'punnett_square',
    title: '孟德尔第一定律（分离定律）可视化',
    description: '通过豌豆杂交实验展示基因的分离规律：在杂合子中，等位基因在形成配子时彼此分离，每个配子只获得其中一个基因。',
    elements: ['显性基因', '隐性基因', '配子', '基因型', '表型'],
    layout: 'grid',
    interactions: ['hover', 'click'],
    colors: {
      dominant: '#4CAF50',
      recessive: '#FF9800',
      heterozygous: '#2196F3',
    },
    data: {
      maleGametes: ['A', 'a'],
      femaleGametes: ['A', 'a'],
      parentalCross: {
        male: { genotype: 'Aa', phenotype: '杂合子（高茎）' },
        female: { genotype: 'Aa', phenotype: '杂合子（高茎）' }
      },
      offspring: [
        { genotype: 'AA', phenotype: '显性纯合（高茎）', probability: 0.25 },
        { genotype: 'Aa', phenotype: '杂合子（高茎）', probability: 0.5 },
        { genotype: 'aa', phenotype: '隐性纯合（矮茎）', probability: 0.25 },
      ],
      description: '单因子杂交：Aa × Aa → 1AA:2Aa:1aa，表型比为3:1'
    },
    annotations: [
      'A为显性基因（高茎），a为隐性基因（矮茎）',
      '配子形成时，A和a基因分离到不同配子中',
      '受精时配子随机结合，形成不同基因型的合子'
    ]
  },

  '孟德尔第二定律': {
    type: 'punnett_square',
    title: '孟德尔第二定律（自由组合定律）可视化',
    description: '展示两对或更多对等位基因在遗传时的自由组合规律：不同对的等位基因在配子形成时独立分配。',
    elements: ['双杂合子', '配子组合', '自由组合', '表型比例'],
    layout: 'grid',
    interactions: ['hover', 'click'],
    colors: {
      dominant: '#4CAF50',
      recessive: '#FF9800',
      heterozygous: '#2196F3',
    },
    data: {
      maleGametes: ['AB', 'Ab', 'aB', 'ab'],
      femaleGametes: ['AB', 'Ab', 'aB', 'ab'],
      parentalCross: {
        male: { genotype: 'AaBb', phenotype: '双显性（黄色圆粒）' },
        female: { genotype: 'AaBb', phenotype: '双显性（黄色圆粒）' }
      },
      offspring: [
        { genotype: 'AABB', phenotype: '黄色圆粒', probability: 0.0625 },
        { genotype: 'AABb', phenotype: '黄色圆粒', probability: 0.125 },
        { genotype: 'AAbb', phenotype: '黄色皱粒', probability: 0.0625 },
        { genotype: 'AaBB', phenotype: '黄色圆粒', probability: 0.125 },
        { genotype: 'AaBb', phenotype: '黄色圆粒', probability: 0.25 },
        { genotype: 'Aabb', phenotype: '黄色皱粒', probability: 0.125 },
        { genotype: 'aaBB', phenotype: '绿色圆粒', probability: 0.0625 },
        { genotype: 'aaBb', phenotype: '绿色圆粒', probability: 0.125 },
        { genotype: 'aabb', phenotype: '绿色皱粒', probability: 0.0625 },
      ],
      description: '双因子杂交：AaBb × AaBb，表型比为9:3:3:1'
    },
    annotations: [
      'A/a控制种子颜色（黄色/绿色），B/b控制种子形状（圆粒/皱粒）',
      '两对基因独立分配，形成4种配子：AB、Ab、aB、ab',
      '16种组合产生9种基因型，4种表型，比例为9:3:3:1'
    ]
  },

  '伴性遗传': {
    type: 'inheritance_path',
    title: '伴性遗传（X连锁隐性遗传）可视化',
    description: '展示X连锁隐性遗传（如色盲、血友病）的传递规律：男性从母亲获得X染色体，女性从双亲各获得一条X染色体。',
    elements: ['X染色体', 'Y染色体', '携带者', '患者', '遗传传递'],
    layout: 'hierarchical',
    interactions: ['hover', 'click'],
    colors: {
      affected: '#F44336',
      carrier: '#FFB74D',
      normal: '#4CAF50',
      male: '#64B5F6',
      female: '#F06292',
    },
    data: {
      generations: [
        {
          generation: 1,
          individuals: [
            { id: 'I-1', sex: 'male', genotype: 'X^aY', phenotype: '色盲', affected: true },
            { id: 'I-2', sex: 'female', genotype: 'X^AX^A', phenotype: '正常', affected: false },
          ]
        },
        {
          generation: 2,
          individuals: [
            { id: 'II-1', sex: 'female', genotype: 'X^AX^a', phenotype: '携带者', affected: false, carrier: true, parents: ['I-1', 'I-2'] },
            { id: 'II-2', sex: 'male', genotype: 'X^AY', phenotype: '正常', affected: false, parents: ['I-1', 'I-2'] },
            { id: 'II-3', sex: 'female', genotype: 'X^AX^A', phenotype: '正常', affected: false },
            { id: 'II-4', sex: 'male', genotype: 'X^AY', phenotype: '正常', affected: false },
          ]
        },
        {
          generation: 3,
          individuals: [
            { id: 'III-1', sex: 'male', genotype: 'X^AY', phenotype: '正常', affected: false, parents: ['II-1', 'II-2'] },
            { id: 'III-2', sex: 'female', genotype: 'X^AX^a', phenotype: '携带者', affected: false, carrier: true, parents: ['II-1', 'II-2'] },
            { id: 'III-3', sex: 'male', genotype: 'X^aY', phenotype: '色盲', affected: true, parents: ['II-1', 'II-2'] },
            { id: 'III-4', sex: 'female', genotype: 'X^AX^A', phenotype: '正常', affected: false, parents: ['II-3', 'II-4'] },
          ]
        }
      ],
      inheritance: {
        pattern: 'X连锁隐性遗传',
        chromosome: 'X染色体',
        gene: '色盲基因'
      },
      explanation: 'X连锁隐性遗传的特点：1）男性发病率高于女性；2）男性从母亲获得致病基因；3）女性携带者表型正常但可传递给后代；4）不存在从男性到男性的传递（父亲→儿子）。'
    },
    annotations: [
      '男性只有一条X染色体，半合子，隐性基因也会表达',
      '女性有两条X染色体，需要纯合隐性才会患病',
      '携带者女性：X^AX^a，表型正常但携带致病基因'
    ]
  },

  '连锁互换': {
    type: 'punnett_square',
    title: '基因连锁与互换可视化',
    description: '展示位于同一条染色体上的基因如何连锁遗传，以及在减数分裂中如何发生互换产生新的基因组合。',
    elements: ['连锁基因', '互换', '配子类型', '重组率'],
    layout: 'grid',
    interactions: ['hover', 'click'],
    colors: {
      dominant: '#4CAF50',
      recessive: '#FF9800',
      heterozygous: '#2196F3',
    },
    data: {
      maleGametes: ['AB', 'Ab', 'aB', 'ab'],
      femaleGametes: ['AB', 'Ab', 'aB', 'ab'],
      parentalCross: {
        male: { genotype: 'AB/ab', phenotype: '双显性' },
        female: { genotype: 'AB/ab', phenotype: '双显性' }
      },
      offspring: [
        { genotype: 'AB/AB', phenotype: '双显性（亲本型）', probability: 0.4 },
        { genotype: 'ab/ab', phenotype: '双隐性（亲本型）', probability: 0.4 },
        { genotype: 'AB/ab', phenotype: '双杂合（亲本型）', probability: 0.1 },
        { genotype: 'Ab/Ab', phenotype: '单显性（重组型）', probability: 0.025 },
        { genotype: 'aB/aB', phenotype: '单显性（重组型）', probability: 0.025 },
        { genotype: 'Ab/aB', phenotype: '双杂合（重组型）', probability: 0.05 },
      ],
      description: '连锁遗传：AB/ab × AB/ab，重组率约10%',
      recombinationRate: 0.1
    },
    annotations: [
      'A和B基因位于同一条染色体上，表现为连锁',
      '互换发生在减数分裂前期I的同源染色体之间',
      '重组型配子的比例反映基因间的遗传距离'
    ]
  },

  '显性与隐性遗传': {
    type: 'punnett_square',
    title: '显性与隐性遗传可视化',
    description: '展示显性基因和隐性基因的遗传规律：显性基因在杂合状态下就能表达，隐性基因只有在纯合状态下才能表达。',
    elements: ['显性基因', '隐性基因', '杂合子', '纯合子', '表型', '基因型'],
    layout: 'grid',
    interactions: ['hover', 'click'],
    colors: {
      dominant: '#4CAF50',
      recessive: '#FF9800',
      heterozygous: '#2196F3',
    },
    data: {
      maleGametes: ['A', 'a'],
      femaleGametes: ['A', 'a'],
      parentalCross: {
        male: { genotype: 'Aa', phenotype: '杂合子（显性表型）' },
        female: { genotype: 'Aa', phenotype: '杂合子（显性表型）' }
      },
      offspring: [
        { genotype: 'AA', phenotype: '显性纯合（显性表型）', probability: 0.25 },
        { genotype: 'Aa', phenotype: '杂合子（显性表型）', probability: 0.5 },
        { genotype: 'aa', phenotype: '隐性纯合（隐性表型）', probability: 0.25 },
      ],
      description: 'A为显性基因，a为隐性基因，表型比为3显性:1隐性'
    },
    annotations: [
      '显性基因：在杂合子(Aa)中能表达的基因',
      '隐性基因：只在纯合子(aa)中表达的基因',
      '不完全显性：杂合子表型介于双亲之间（如紫茉莉红花×白花=粉花）',
      '共显性：两个等位基因都表达（如AB型血）'
    ]
  },

  'X连锁遗传': {
    type: 'inheritance_path',
    title: 'X连锁遗传（性染色体遗传）可视化',
    description: '展示基因位于X染色体上的遗传规律：男性(XY)从母亲获得X染色体，女性(XX)从双亲各获得一条X染色体。',
    elements: ['X染色体', 'Y染色体', '伴性遗传', '男性遗传', '女性遗传'],
    layout: 'hierarchical',
    interactions: ['hover', 'click'],
    colors: {
      xChromosome: '#E91E63',
      yChromosome: '#1976D2',
      affected: '#F44336',
      carrier: '#FFB74D',
      normal: '#4CAF50',
    },
    data: {
      patterns: [
        {
          type: 'X连锁隐性遗传',
          examples: ['色盲', '血友病A', '进行性肌营养不良'],
          characteristics: ['男性发病率高于女性', '男性从母亲获得致病基因', '不存在父亲→儿子的传递', '女性携带者表型正常']
        },
        {
          type: 'X连锁显性遗传',
          examples: ['抗维生素D佝偻病', '遗传性肾炎'],
          characteristics: ['女性发病率高于男性', '男性患者将致病基因传给所有女儿', '女性患者可传给子女']
        }
      ],
      examples: {
        'X连锁隐性': {
          cross: '正常男性(X^AY) × 携带者女性(X^AX^a)',
          offspring: ['1/4正常男性(X^AY)', '1/4色盲男性(X^aY)', '1/4正常女性(X^AX^A)', '1/4携带者女性(X^AX^a)']
        },
        'X连锁显性': {
          cross: '正常男性(X^AY) × 患病女性(X^AX)',
          offspring: ['1/2患病女性(X^AX)', '1/2患病男性(X^AY)']
        }
      }
    },
    annotations: [
      '男性只有一条X染色体，称为半合子',
      'Y染色体上基因很少，主要决定男性性别',
      'X连锁隐性遗传病在男性中更多见',
      '女性携带者可将致病基因传给儿子'
    ]
  },

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

  '测交': {
    type: 'punnett_square',
    title: '测交原理可视化',
    description: '展示测交的原理和方法：用未知基因型的个体与隐性纯合子杂交，根据后代表型推断亲本基因型。',
    elements: ['待测个体', '隐性纯合子', '测交后代', '基因型鉴定'],
    layout: 'grid',
    interactions: ['hover', 'click'],
    colors: {
      dominant: '#4CAF50',
      recessive: '#FF9800',
      heterozygous: '#2196F3',
      unknown: '#9C27B0',
    },
    data: {
      testCrosses: [
        {
          name: '显性纯合子测交',
          parentGenotype: 'AA',
          testerGenotype: 'aa',
          cross: 'AA × aa',
          offspringRatio: '全部Aa',
          offspringPhenotype: '全部显性表型',
          conclusion: '亲本为显性纯合子'
        },
        {
          name: '杂合子测交',
          parentGenotype: 'Aa',
          testerGenotype: 'aa',
          cross: 'Aa × aa',
          offspringRatio: '1/2 Aa : 1/2 aa',
          offspringPhenotype: '1/2 显性 : 1/2 隐性',
          conclusion: '亲本为杂合子'
        }
      ],
      applications: [
        {
          scenario: '植物育种',
          description: '鉴定优良品种是纯合还是杂合',
          example: '小麦抗病品种的基因型鉴定'
        },
        {
          scenario: '动物育种',
          description: '确定携带者个体',
          example: '家畜中鉴定隐性致病基因携带者'
        },
        {
          scenario: '遗传学研究',
          description: '验证基因的显隐性关系',
          example: '新发现的性状遗传模式分析'
        }
      ],
      advantages: [
        '简单直接，只需观察表型',
        '准确可靠，能区分纯合子和杂合子',
        '适用于大多数性状',
        '是遗传学的基本实验方法'
      ],
      limitations: [
        '需要时间获得后代',
        '某些性状可能受环境因素影响',
        '不完全显性情况下分析复杂'
      ]
    },
    annotations: [
      '测交是孟德尔遗传学的重要实验方法',
      '隐性纯合子作为测试者，只产生一种配子（a）',
      '测交后代表型直接反映待测个体的配子类型',
      '测交是验证基因分离定律的经典实验'
    ]
  },

  '共显性': {
    type: 'punnett_square',
    title: '共显性遗传可视化',
    description: '展示共显性遗传的规律：杂合子中两个等位基因都表达，产生独特的表型。',
    elements: ['共显性等位基因', '杂合子表型', 'ABO血型', 'MN血型'],
    layout: 'grid',
    interactions: ['hover', 'click'],
    colors: {
      alleleA: '#F44336',
      alleleB: '#2196F3',
      codominant: '#9C27B0',
    },
    data: {
      examples: [
        {
          name: 'ABO血型系统',
          alleles: ['IA（A型抗原）', 'IB（B型抗原）', 'i（无抗原）'],
          cross: 'IAi × IBi',
          gametes: { parent1: ['IA', 'i'], parent2: ['IB', 'i'] },
          offspring: [
            { genotype: 'IAIB', phenotype: 'AB型（共显性）', probability: 0.25 },
            { genotype: 'IAi', phenotype: 'A型', probability: 0.25 },
            { genotype: 'IBi', phenotype: 'B型', probability: 0.25 },
            { genotype: 'ii', phenotype: 'O型', probability: 0.25 }
          ],
          codominance: 'IA和IB在杂合子IAIB中都表达，形成AB型血'
        },
        {
          name: 'MN血型系统',
          alleles: ['M抗原', 'N抗原'],
          cross: 'MN × MN',
          gametes: { parent1: ['M', 'N'], parent2: ['M', 'N'] },
          offspring: [
            { genotype: 'MM', phenotype: 'M型', probability: 0.25 },
            { genotype: 'MN', phenotype: 'MN型（共显性）', probability: 0.5 },
            { genotype: 'NN', phenotype: 'N型', probability: 0.25 }
          ],
          codominance: 'M和N抗原在杂合子MN中都表达'
        },
        {
          name: '金鱼草花色（不完全显性）',
          alleles: ['R（红花）', 'r（白花）'],
          cross: 'RR × rr',
          f1: '全部Rr（粉红花）',
          f1Self: 'Rr × Rr',
          offspring: [
            { genotype: 'RR', phenotype: '红花', probability: 0.25 },
            { genotype: 'Rr', phenotype: '粉红花（不完全显性）', probability: 0.5 },
            { genotype: 'rr', phenotype: '白花', probability: 0.25 }
          ],
          note: '不完全显性：杂合子表型介于双亲之间'
        }
      ],
      patterns: [
        {
          name: '共显性',
          description: '两个等位基因都完整表达，产生混合表型',
          examples: ['ABO血型的AB型', 'MN血型的MN型'],
          key: '杂合子表型不同于任一纯合子'
        },
        {
          name: '不完全显性',
          description: '杂合子表型介于两个纯合子之间',
          examples: ['金鱼草红花×白花=粉红花', '安德鲁斯短毛鸡×长毛鸡=中毛鸡'],
          key: '杂合子表型是中间状态'
        },
        {
          name: '完全显性',
          description: '显性等位基因完全掩盖隐性等位基因',
          examples: ['豌豆圆粒与皱粒', '孟德尔的高茎与矮茎'],
          key: '杂合子表型与显性纯合子相同'
        }
      ],
      significance: [
        '共显性和不完全显性增加了表型的多样性',
        'ABO血型的共显性在输血中有重要临床意义',
        '不完全显性在植物育种中有应用价值',
        '这些现象说明了基因表达的不同模式'
      ]
    },
    annotations: [
      '共显性：两个等位基因都表达，产生独特表型',
      '不完全显性：杂合子表型介于两个纯合子之间',
      'ABO血型是最经典的共显性例子',
      '共显性基因没有显隐性关系'
    ]
  },

  '不完全显性': {
    type: 'punnett_square',
    title: '不完全显性遗传可视化',
    description: '展示不完全显性遗传的规律：杂合子表型介于两个纯合子表型之间。',
    elements: ['不完全显性', '中间表型', '杂合子', '纯合子'],
    layout: 'grid',
    interactions: ['hover', 'click'],
    colors: {
      homozygous1: '#F44336',
      heterozygous: '#9C27B0',
      homozygous2: '#2196F3',
    },
    data: {
      examples: [
        {
          name: '金鱼草花色',
          alleles: ['C（红花）', 'c（白花）'],
          parental: {
            parent1: { genotype: 'CC', phenotype: '红花' },
            parent2: { genotype: 'cc', phenotype: '白花' }
          },
          f1: {
            cross: 'CC × cc',
            genotype: '全部Cc',
            phenotype: '粉红花（不完全显性）'
          },
          f2: {
            cross: 'Cc × Cc',
            offspring: [
              { genotype: 'CC', phenotype: '红花', probability: 0.25 },
              { genotype: 'Cc', phenotype: '粉红花', probability: 0.5 },
              { genotype: 'cc', phenotype: '白花', probability: 0.25 }
            ],
            ratio: '1红花 : 2粉红花 : 1白花'
          }
        },
        {
          name: '安德鲁斯鸡毛长',
          alleles: ['L（长毛）', 'l（短毛）'],
          f1: { genotype: '全部Ll', phenotype: '中毛' },
          f2: { ratio: '1长毛 : 2中毛 : 1短毛' }
        },
        {
          name: '人类头发卷曲度',
          alleles: ['H（卷发）', 'h（直发）'],
          genotypes: [
            { genotype: 'HH', phenotype: '卷发' },
            { genotype: 'Hh', phenotype: '波浪发' },
            { genotype: 'hh', phenotype: '直发' }
          ]
        }
      ],
      characteristics: [
        '杂合子表型介于两个纯合子之间',
        'F2代出现1:2:1的基因型比和表型比',
        '不同于完全显性（3:1表型比）',
        '不同于共显性（两个等位基因都表达）'
      ],
      comparison: [
        {
          type: '完全显性',
          example: '豌豆圆粒（R）与皱粒（r）',
          f1: '全部Rr（圆粒）',
          f2: '3圆粒 : 1皱粒',
          note: '杂合子与显性纯合子表型相同'
        },
        {
          type: '不完全显性',
          example: '金鱼草红花（C）与白花（c）',
          f1: '全部Cc（粉红花）',
          f2: '1红花 : 2粉红花 : 1白花',
          note: '杂合子表型介于双亲之间'
        },
        {
          type: '共显性',
          example: 'ABO血型的IA与IB',
          f1: 'IAIB（AB型）',
          f2: '1A型 : 1AB型 : 1B型 : 1O型',
          note: '杂合子同时表达两个等位基因'
        }
      ]
    },
    annotations: [
      '不完全显性是孟德尔定律的重要补充',
      '杂合子表型是两个纯合子表型的中间状态',
      'F2代表型比与基因型比相同（1:2:1）',
      '不完全显性在植物中比较常见'
    ]
  }
};
