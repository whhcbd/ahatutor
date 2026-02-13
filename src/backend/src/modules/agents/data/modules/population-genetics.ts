import type { VisualizationSuggestion } from '@shared/types/agent.types';

export const POPULATION_GENETICS: Record<string, Omit<VisualizationSuggestion, 'insights'>> = {
  '哈代-温伯格定律': {
    type: 'probability_distribution',
    title: '哈代-温伯格平衡可视化',
    description: '展示理想种群中基因频率和基因型频率的平衡状态：p² + 2pq + q² = 1，其中p为显性基因频率，q为隐性基因频率。',
    elements: ['基因频率', '基因型频率', 'Hardy-Weinberg平衡', '随机交配'],
    layout: 'circular',
    interactions: ['hover', 'click'],
    colors: {
      dominant: '#4CAF50',
      heterozygous: '#2196F3',
      recessive: '#FF9800',
    },
    data: {
      categories: ['显性纯合 (p²)', '杂合子 (2pq)', '隐性纯合 (q²)'],
      values: [0.49, 0.42, 0.09],
      colors: ['#4CAF50', '#2196F3', '#FF9800'],
      total: '总和 = 1 (100%)',
      formula: 'p² + 2pq + q² = 1，其中 p=0.7, q=0.3',
      parameters: {
        p: 0.7,
        q: 0.3,
        p2: 0.49,
        twoPQ: 0.42,
        q2: 0.09
      }
    },
    annotations: [
      'p = 显性等位基因频率，q = 隐性等位基因频率',
      '种群满足H-W平衡的条件：无限大、随机交配、无突变、无迁移、无自然选择',
      '显性表型比例 = p² + 2pq，隐性表型比例 = q²'
    ]
  },

  '遗传漂变': {
    type: 'probability_distribution',
    title: '遗传漂变可视化',
    description: '展示小群体中等位基因频率的随机波动：由于抽样误差，基因频率会随机改变，可能导致等位基因固定或丢失。',
    elements: ['基因频率', '随机波动', '小群体', '固定', '丢失', '奠基者效应', '瓶颈效应'],
    layout: 'circular',
    interactions: ['hover', 'click'],
    colors: {
      alleleA: '#4CAF50',
      allelea: '#FF9800',
      drift: '#2196F3',
      fixed: '#9C27B0',
      lost: '#F44336',
    },
    data: {
      scenario: '小群体（N=20），初始等位基因频率p=0.5，q=0.5',
      generations: [
        { generation: 0, p: 0.5, q: 0.5, event: '起始状态' },
        { generation: 1, p: 0.55, q: 0.45, event: '随机波动' },
        { generation: 2, p: 0.48, q: 0.52, event: '随机波动' },
        { generation: 5, p: 0.62, q: 0.38, event: '随机波动' },
        { generation: 10, p: 0.78, q: 0.22, event: '趋向固定' },
        { generation: 20, p: 1.0, q: 0.0, event: 'A等位基因固定' }
      ],
      outcomes: {
        fixed: '等位基因频率达到1.0，群体中只有该等位基因',
        lost: '等位基因频率达到0.0，该等位基因从群体中消失',
        probability: '小群体中遗传漂变效应更显著'
      }
    },
    annotations: [
      '遗传漂变在小群体中更为显著',
      '奠基者效应：新建立的群体基因频率不同于源群体',
      '瓶颈效应：群体大小急剧减少后，基因频率发生改变',
      '遗传漂变是中性进化的主要驱动力'
    ]
  },

  '自然选择': {
    type: 'probability_distribution',
    title: '自然选择类型可视化',
    description: '展示自然选择的三种主要类型：定向选择（favor extreme）、稳定选择（favor intermediate）和破坏性选择（favor extremes）。',
    elements: ['定向选择', '稳定选择', '破坏性选择', '适合度', '表型分布'],
    layout: 'hierarchical',
    interactions: ['hover', 'click'],
    colors: {
      directional: '#4CAF50',
      stabilizing: '#2196F3',
      disruptive: '#FF9800',
      phenotype: '#9C27B0',
    },
    data: {
      selectionTypes: [
        {
          name: '定向选择',
          description: ' favor某一极端的表型',
          graph: '分布曲线向一个方向移动',
          example: '工业黑化现象：深色桦尺蠖在污染环境下生存优势',
          colors: ['#4CAF50', '#81C784']
        },
        {
          name: '稳定选择',
          description: ' favor中间型表型，淘汰两极',
          graph: '分布曲线变窄，峰值升高',
          example: '人类出生体重：中等体重婴儿存活率最高',
          colors: ['#2196F3', '#64B5F6']
        },
        {
          name: '破坏性选择',
          description: ' favor两个极端表型，淘汰中间型',
          graph: '分布曲线出现双峰',
          example: '达尔文雀：喙的大小分化为大喙和小喙两种类型',
          colors: ['#FF9800', '#FFB74D']
        }
      ],
      fitness: {
        definition: '个体生存和繁殖的相对能力',
        components: ['生存能力', '繁殖成功率', '交配成功率'],
        selectionPressure: '环境因素对适合度差异的影响'
      }
    },
    annotations: [
      '自然选择是进化的主要机制之一',
      '选择压力决定了哪些表型更有利于生存和繁殖',
      '定向选择推动群体向一个方向进化',
      '稳定选择维持群体的稳定性',
      '破坏性选择可导致物种分化'
    ]
  },

  '瓶颈效应': {
    type: 'inheritance_path',
    title: '瓶颈效应可视化',
    description: '展示群体经历瓶颈事件后，遗传多样性显著降低的过程：群体大小急剧减少后，幸存者的基因库可能无法代表原始群体的遗传多样性。',
    elements: ['原始群体', '瓶颈事件', '幸存者', '恢复群体', '基因丢失', '遗传多样性降低'],
    layout: 'hierarchical',
    interactions: ['hover', 'click'],
    colors: {
      original: '#4CAF50',
      bottleneck: '#F44336',
      survivors: '#FF9800',
      recovered: '#2196F3',
      lost: '#9C27B0',
    },
    data: {
      stages: [
        {
          stage: '原始群体',
          population: 1000,
          diversity: '高（5个等位基因）',
          alleles: ['A1', 'A2', 'A3', 'A4', 'A5'],
          description: '群体遗传多样性丰富'
        },
        {
          stage: '瓶颈事件',
          event: '灾难（如火灾、洪水）',
          population: 10,
          description: '群体急剧减少'
        },
        {
          stage: '幸存者',
          population: 10,
          diversity: '低（2个等位基因）',
          alleles: ['A2', 'A4'],
          description: 'A1、A3、A5丢失'
        },
        {
          stage: '恢复群体',
          population: 1000,
          diversity: '低（2个等位基因）',
          alleles: ['A2', 'A4'],
          description: '群体数量恢复，但遗传多样性永久降低'
        }
      ],
      examples: [
        '猎豹：经历历史瓶颈，遗传多样性极低',
        '象海豹：过度捕捞导致瓶颈，遗传多样性降低',
        '人类非洲起源理论：走出非洲的瓶颈效应'
      ]
    },
    annotations: [
      '瓶颈效应是遗传漂变的一种极端形式',
      '瓶颈效应导致遗传多样性永久性丧失',
      '瓶颈后的群体对环境变化适应能力降低',
      '瓶颈效应可用于研究人类迁徙历史'
    ]
  },

  '奠基者效应': {
    type: 'inheritance_path',
    title: '奠基者效应可视化',
    description: '展示奠基者效应的机制：少数个体建立新群体时，其基因库可能无法代表源群体的全部遗传多样性。',
    elements: ['源群体', '奠基者', '新群体', '基因频率差异', '遗传多样性降低'],
    layout: 'hierarchical',
    interactions: ['hover', 'click'],
    colors: {
      sourcePopulation: '#4CAF50',
      founders: '#FF9800',
      newPopulation: '#2196F3',
      lost: '#F44336',
    },
    data: {
      stages: [
        {
          stage: '源群体',
          population: 10000,
          diversity: '高（10个等位基因）',
          alleles: ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10'],
          frequencies: '各约10%'
        },
        {
          stage: '奠基者迁移',
          founders: '10个个体',
          carriedAlleles: ['A1', 'A2', 'A3'],
          description: '少数个体迁移到新环境'
        },
        {
          stage: '新群体建立',
          population: 10000,
          diversity: '低（3个等位基因）',
          alleles: ['A1', 'A2', 'A3'],
          frequencies: 'A1-50%, A2-30%, A3-20%',
          description: 'A4-A10等位基因永久丢失'
        }
      ],
      examples: [
        {
          population: '阿米什人（美国宾州）',
          founders: '约200名德国移民',
          effect: '某些遗传病频率异常高（如埃勒斯-当洛综合征）',
          alleleFrequencies: '与源群体显著不同'
        },
        {
          population: '皮特凯恩岛居民',
          founders: '邦蒂号哗变者（约20人）',
          effect: 'Y染色体多样性极低',
          genePool: '仅来自少数奠基者'
        },
        {
          population: '芬兰人群',
          founders: '少数祖先群体',
          effect: '某些遗传病仅见于芬兰人',
          diseases: ['芬兰型先天性肾病', '芬兰型淀粉样变性']
        }
      ],
      consequences: [
        '遗传多样性降低',
        '基因频率与源群体不同',
        '某些遗传病频率异常高',
        '对疾病易感性可能不同'
      ]
    },
    annotations: [
      '奠基者效应是遗传漂变的一种形式',
      '新群体的基因库由奠基者的基因随机决定',
      '奠基者效应可解释某些隔离人群的遗传特征',
      '人类迁徙史中奠基者效应很常见'
    ]
  },

  '基因流': {
    type: 'inheritance_path',
    title: '基因流机制可视化',
    description: '展示基因流（基因迁移）的过程：基因在不同群体间通过个体迁移或配子传播，影响群体的遗传组成。',
    elements: ['基因流', '个体迁移', '配子传播', '群体间杂交', '基因频率改变', '遗传同质化'],
    layout: 'hierarchical',
    interactions: ['hover', 'click'],
    colors: {
      population1: '#4CAF50',
      population2: '#2196F3',
      migrant: '#FF9800',
      hybrid: '#9C27B0',
      geneFlow: '#FFC107',
    },
    data: {
      mechanisms: [
        {
          type: '个体迁移',
          description: '成年个体从一个群体迁移到另一个群体',
          example: '鸟类迁徙时在不同群体间繁殖',
          effect: '迁移者的基因进入新群体'
        },
        {
          type: '配子传播',
          description: '花粉、精子等配子在不同群体间传播',
          example: '风媒植物的花粉长距离传播',
          effect: '不同群体的基因通过配子混合'
        },
        {
          type: '群体间杂交',
          description: '不同群体个体交配产生后代',
          example: '相邻群体的动物交配',
          effect: '基因在群体间交流'
        }
      ],
      effects: [
        {
          name: '遗传同质化',
          description: '基因流使不同群体的基因频率趋于一致',
          result: '减少群体间的遗传差异'
        },
        {
          name: '引入新变异',
          description: '外源基因进入群体',
          result: '增加遗传多样性'
        },
        {
          name: '对抗自然选择和遗传漂变',
          description: '基因流可以抵消局部适应和遗传漂变',
          result: '维持群体间相似性'
        }
      ],
      examples: [
        {
          scenario: '农作物育种',
          description: '将野生品种的抗病基因导入栽培品种',
          benefit: '提高抗病性',
          method: '杂交育种'
        },
        {
          scenario: '狼的群体',
          description: '不同狼群间个体迁移',
          effect: '维持遗传多样性',
          importance: '防止近亲繁殖'
        },
        {
          scenario: '海洋生物',
          description: '洋流携带幼虫到不同海域',
          effect: '基因在远距离群体间流动',
          result: '广阔地理范围内的遗传连接'
        }
      ],
      factors: [
        '群体间距离：距离越近，基因流越强',
        '迁移能力：物种的迁移能力影响基因流强度',
        '地理屏障：山脉、河流等阻碍基因流',
        '行为因素：社会结构、繁殖策略等影响个体迁移'
      ]
    },
    annotations: [
      '基因流是群体遗传学的重要进化力量',
      '基因流可以引入新的遗传变异',
      '高基因流导致群体间遗传相似',
      '基因流是人类进化的重要机制'
    ]
  },

  '突变': {
    type: 'diagram',
    title: '基因突变类型与机制可视化',
    description: '展示基因突变的各种类型及其分子机制：点突变、插入、缺失、重复等，以及突变对蛋白质功能的影响。',
    elements: ['点突变', '插入', '缺失', '重复', '颠换', '转换', '移码突变'],
    layout: 'hierarchical',
    interactions: ['hover', 'click'],
    colors: {
      normal: '#4CAF50',
      pointMutation: '#FF9800',
      insertion: '#2196F3',
      deletion: '#F44336',
      duplication: '#9C27B0',
      substitution: '#FFC107',
    },
    data: {
      pointMutations: [
        {
          name: '转换',
          description: '嘌呤之间或嘧啶之间的替换',
          examples: ['A→G', 'G→A', 'C→T', 'T→C'],
          frequency: '转换比颠换更常见（约2:1）',
          effect: '通常影响较小'
        },
        {
          name: '颠换',
          description: '嘌呤与嘧啶之间的替换',
          examples: ['A→C', 'A→T', 'G→C', 'G→T'],
          frequency: '较不常见',
          effect: '通常影响较大'
        }
      ],
      effectsOnProtein: [
        {
          type: '同义突变',
          description: '密码子改变但编码相同氨基酸',
          example: 'GAA→GAG（都编码谷氨酸）',
          effect: '无影响（通常）'
        },
        {
          type: '错义突变',
          description: '密码子改变导致氨基酸改变',
          example: 'GAA→GCA（谷氨酸→丙氨酸）',
          effect: '蛋白质功能可能受影响'
        },
        {
          type: '无义突变',
          description: '密码子变成终止密码子',
          example: 'UAC→UAA（酪氨酸→终止）',
          effect: '蛋白质提前终止，功能严重受损'
        }
      ],
      indelMutations: [
        {
          type: '插入',
          description: '插入一个或多个碱基',
          frameshift: '插入数不是3的倍数导致移码',
          example: 'CAG → CAAG（插入A）',
          consequence: '可能改变整个下游氨基酸序列'
        },
        {
          type: '缺失',
          description: '缺失一个或多个碱基',
          frameshift: '缺失数不是3的倍数导致移码',
          example: 'CAG → CG（缺失A）',
          consequence: '可能改变整个下游氨基酸序列'
        },
        {
          type: '重复',
          description: '一段序列重复一次或多次',
          example: 'CAG → CAGCAG（重复）',
          diseases: '亨廷顿舞蹈症（CAG重复扩张）'
        }
      ],
      mutationRates: {
        perBasePerGeneration: '约10^-8（每个碱基每代）',
        perGenePerGeneration: '约10^-5（每个基因每代）',
        factors: ['DNA聚合酶错误', '自发损伤', '化学物质', '辐射']
      }
    },
    annotations: [
      '突变是进化的原材料',
      '大多数突变是中性或有害的，有益突变罕见',
      '突变率相对较低，但代代累积可产生大量变异',
      'DNA修复系统可以纠正大多数突变'
    ]
  }
};
