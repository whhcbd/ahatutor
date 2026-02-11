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
  }
};
