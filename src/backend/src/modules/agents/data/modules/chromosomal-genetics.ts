import type { VisualizationSuggestion } from '@shared/types/agent.types';

export const CHROMOSOMAL_GENETICS: Record<string, Omit<VisualizationSuggestion, 'insights'>> = {
  'DNA双螺旋结构': {
    type: 'diagram',
    title: 'DNA双螺旋结构可视化',
    description: '展示DNA的经典双螺旋结构：两条反向平行的多核苷酸链围绕同一中心轴盘旋，碱基通过氢键配对（A-T两个氢键，G-C三个氢键）。',
    elements: ['双螺旋', '碱基配对', '磷酸脱氧核糖骨架', '氢键', '大沟', '小沟'],
    layout: 'hierarchical',
    interactions: ['hover', 'click'],
    colors: {
      adenine: '#4CAF50',
      thymine: '#FF9800',
      guanine: '#2196F3',
      cytosine: '#9C27B0',
      backbone: '#607D8B',
      hydrogenBond: '#FFC107',
    },
    data: {
      basePairs: [
        { base1: 'A', base2: 'T', bonds: 2, color1: '#4CAF50', color2: '#FF9800' },
        { base1: 'G', base2: 'C', bonds: 3, color1: '#2196F3', color2: '#9C27B0' },
        { base1: 'C', base2: 'G', bonds: 3, color1: '#9C27B0', color2: '#2196F3' },
        { base1: 'T', base2: 'A', bonds: 2, color1: '#FF9800', color2: '#4CAF50' },
      ],
      structure: {
        strands: 2,
        orientation: 'antiparallel',
        grooveMajor: '大沟（宽）',
        grooveMinor: '小沟（窄）',
        helixTurn: '每圈约10个碱基对'
      }
    },
    annotations: [
      'Watson和Crick于1953年提出DNA双螺旋结构模型',
      '两条链反向平行：一条5\'→3\'，另一条3\'→5\'',
      'A与T配对（2个氢键），G与C配对（3个氢键）',
      '磷酸-脱氧核糖骨架在外侧，碱基对在内侧'
    ]
  },

  '染色体': {
    type: 'diagram',
    title: '染色体结构可视化',
    description: '展示染色体的典型结构：包括着丝粒、端粒、长臂(q)和短臂(p)，以及染色质如何组织成染色体。',
    elements: ['着丝粒', '端粒', '长臂', '短臂', '染色单体', '动粒'],
    layout: 'hierarchical',
    interactions: ['hover', 'click'],
    colors: {
      chromatid: '#9C27B0',
      centromere: '#F44336',
      telomere: '#4CAF50',
      arm: '#2196F3',
      kinetochore: '#FF9800',
    },
    data: {
      structure: {
        type: '中期染色体',
        chromatids: 2,
        sisterChromatids: '姐妹染色单体',
        centromerePosition: '着丝粒位置决定染色体形态（中着丝粒、亚中着丝粒、近端着丝粒）',
      },
      parts: [
        { name: '短臂(p)', description: '着丝粒上方的染色体臂' },
        { name: '长臂(q)', description: '着丝粒下方的染色体臂' },
        { name: '着丝粒', description: '姐妹染色单体连接处，纺锤丝附着点' },
        { name: '端粒', description: '染色体末端的重复序列，保护染色体' },
        { name: '动粒', description: '着丝粒处的蛋白复合体，纺锤丝附着' }
      ],
      karyotype: {
        human: '46条染色体（23对）',
        autosomes: '44条常染色体（22对）',
        sexChromosomes: '2条性染色体（XX或XY）'
      }
    },
    annotations: [
      '染色体是细胞分裂期染色质的高度凝缩状态',
      '人类有46条染色体，其中44条为常染色体，2条为性染色体',
      '端粒随细胞分裂逐渐缩短，与细胞衰老相关',
      '着丝粒位置决定染色体的三条形态：中着丝粒、亚中着丝粒、近端着丝粒'
    ]
  },

  '有丝分裂': {
    type: 'diagram',
    title: '有丝分裂过程可视化',
    description: '展示有丝分裂的全过程：细胞分裂一次，产生两个遗传物质相同的子细胞，包含前期、前中期、中期、后期和末期。',
    elements: ['间期', '前期', '中期', '后期', '末期', '胞质分裂'],
    layout: 'hierarchical',
    interactions: ['click', 'hover'],
    colors: {
      chromosome: '#9C27B0',
      centromere: '#F44336',
      spindle: '#2196F3',
      nucleus: '#E1BEE7',
      cellMembrane: '#4CAF50',
    },
    animationConfig: {
      duration: 10000,
      easing: 'easeInOut',
      autoplay: false,
      steps: [
        { phase: '间期', description: 'DNA复制，中心体复制，为分裂做准备', duration: 2000 },
        { phase: '前期', description: '染色质凝缩成染色体，核膜解体，纺锤体形成', duration: 2000 },
        { phase: '中期', description: '染色体排列在赤道板上，纺锤丝附着在着丝粒上', duration: 1500 },
        { phase: '后期', description: '着丝粒分裂，姐妹染色单体分离，移向两极', duration: 2500 },
        { phase: '末期', description: '染色体解螺旋，核膜重新形成，胞质分裂', duration: 2000 }
      ]
    },
    data: {
      phases: [
        { name: '前期', events: ['染色体凝缩', '核膜消失', '纺锤体形成'] },
        { name: '中期', events: ['染色体排列', '纺锤丝附着'] },
        { name: '后期', events: ['着丝粒分裂', '染色单体分离'] },
        { name: '末期', events: ['核膜重组', '胞质分裂'] }
      ],
      outcome: '一个母细胞 → 两个遗传相同的子细胞（2n→2n）'
    },
    annotations: [
      '有丝分裂是体细胞增殖的主要方式',
      '产生的两个子细胞遗传物质与母细胞相同',
      '确保多细胞生物生长发育和细胞更新',
      '与减数分裂的主要区别：只分裂一次，同源染色体不配对'
    ]
  },

  '染色体结构': {
    type: 'diagram',
    title: '染色体结构可视化',
    description: '展示染色体的精细结构：包括着丝粒、端粒、长短臂(p/q)、核仁组织区等组成部分。',
    elements: ['着丝粒', '端粒', '短臂(p)', '长臂(q)', '核仁组织区', '随体', '次缢痕'],
    layout: 'hierarchical',
    interactions: ['hover', 'click'],
    colors: {
      pArm: '#4CAF50',
      qArm: '#2196F3',
      centromere: '#F44336',
      telomere: '#FF9800',
      nor: '#9C27B0',
      satellite: '#7B1FA2',
    },
    data: {
      structure: [
        { name: '着丝粒', description: '姐妹染色单体连接处，纺锤丝附着点', location: '染色体中部或近端' },
        { name: '短臂(p)', description: '着丝粒上方的染色体臂', length: '可能很短或不存在' },
        { name: '长臂(q)', description: '着丝粒下方的染色体臂', length: '通常较长' },
        { name: '端粒', description: '染色体末端的重复序列，保护染色体', sequence: 'TTAGGG重复' },
        { name: '核仁组织区(NOR)', description: '含rRNA基因，形成核仁的部位', location: '近端着丝粒染色体短臂' },
        { name: '随体', description: '核仁组织区末端的球形突出', appearance: '球状结构' },
        { name: '次缢痕', description: '除着丝粒外的凹陷区域', function: '与特定功能相关' }
      ],
      centromereTypes: [
        { type: '中着丝粒', description: '着丝粒位于染色体中部，两臂长度相近', example: '1号染色体' },
        { type: '亚中着丝粒', description: '着丝粒偏向一端，两臂长度不同', example: '人类多数染色体' },
        { type: '近端着丝粒', description: '着丝粒靠近一端，短臂很短', example: '13-15号、21-22号染色体' }
      ]
    },
    annotations: [
      'p(petite)代表短臂，q(下一个字母)代表长臂',
      '端粒随细胞分裂逐渐缩短，与细胞衰老相关',
      '着丝粒位置决定染色体在分裂时的形态',
      '核型分析是染色体疾病的诊断方法之一'
    ]
  },

  '染色体畸变': {
    type: 'diagram',
    title: '染色体畸变类型可视化',
    description: '展示染色体畸变的两大类：数目异常（非整倍体、整倍体）和结构异常（缺失、重复、倒位、易位）。',
    elements: ['数目异常', '结构异常', '非整倍体', '缺失', '重复', '倒位', '易位'],
    layout: 'hierarchical',
    interactions: ['hover', 'click'],
    colors: {
      normal: '#4CAF50',
      abnormal: '#F44336',
      deletion: '#FF9800',
      duplication: '#2196F3',
      inversion: '#9C27B0',
      translocation: '#FFC107',
    },
    data: {
      numericalAbnormalities: [
        {
          name: '非整倍体',
          description: '染色体数目不是单倍体的整数倍',
          types: ['三体（2n+1）', '单体（2n-1）', '多体'],
          examples: ['21三体（唐氏综合征）', 'X单体（特纳氏综合征）']
        },
        {
          name: '整倍体',
          description: '染色体数目是单倍体的整数倍（但不是二倍体）',
          types: ['三倍体（3n）', '四倍体（4n）'],
          examples: ['植物中常见，人类中致死']
        }
      ],
      structuralAbnormalities: [
        {
          name: '缺失',
          description: '染色体片段丢失',
          type: '末端缺失/中间缺失',
          example: '猫叫综合征（5号染色体短臂缺失）'
        },
        {
          name: '重复',
          description: '染色体片段增加',
          type: '串联重复/插入重复',
          example: 'Charcot-Marie-Tooth病（PMP22基因重复）'
        },
        {
          name: '倒位',
          description: '染色体片段断裂后180°翻转重接',
          type: '臂内倒位/臂间倒位',
          example: '血友病A（F8基因倒位）'
        },
        {
          name: '易位',
          description: '两条染色体间片段交换',
          type: '相互易位/罗伯逊易位',
          example: '慢性粒白血病（费城染色体）'
        }
      ]
    },
    annotations: [
      '染色体畸变可由物理、化学、生物因素引起',
      '大多数常染色体非整倍体致死',
      '性染色体非整倍体相对可存活',
      '平衡易位携带者表型正常但生育力可能受影响'
    ]
  },

  '三体': {
    type: 'diagram',
    title: '三体综合征可视化',
    description: '展示三体的形成机制和常见类型：某对染色体多出一条，共三条同源染色体。以21三体（唐氏综合征）为例。',
    elements: ['三体', '减数分裂错误', '不分离', '唐氏综合征', '18三体', '13三体'],
    layout: 'hierarchical',
    interactions: ['hover', 'click'],
    colors: {
      chromosome1: '#4CAF50',
      chromosome2: '#81C784',
      chromosome3: '#C8E6C9',
      normal: '#2196F3',
      trisomy: '#F44336',
    },
    data: {
      mechanism: '减数分裂时同源染色体不分离',
      nondisjunction: {
        meiosis1: '同源染色体未分离，产生n+1和n-1配子',
        meiosis2: '姐妹染色单体未分离，产生n+1和n-1配子',
        result: '正常配子（n）与异常配子（n+1）结合形成2n+1合子'
      },
      commonTrisomies: [
        {
          chromosome: '21号染色体',
          name: '唐氏综合征（Down综合征）',
          incidence: '1/700',
          features: ['智力障碍', '特殊面容', '先天性心脏病', '肌张力低下']
        },
        {
          chromosome: '18号染色体',
          name: '爱德华氏综合征（Edwards综合征）',
          incidence: '1/5000',
          features: ['严重发育迟缓', '多发畸形', '大多1岁内死亡']
        },
        {
          chromosome: '13号染色体',
          name: '帕陶氏综合征（Patau综合征）',
          incidence: '1/10000',
          features: ['严重脑部畸形', '多发畸形', '大多6个月内死亡']
        }
      ],
      riskFactors: [
        '母龄增加（35岁以上风险显著增加）',
        '既往生育过三体患儿',
        '携带平衡易位'
      ]
    },
    annotations: [
      '21三体是最常见的常染色体三体',
      '21三体患者可存活至成年',
      '性染色体三体（XXX、XXY、XYY）相对温和',
      '三体风险与母龄密切相关'
    ]
  },

  '染色体结构畸变': {
    type: 'diagram',
    title: '染色体结构畸变类型可视化',
    description: '展示四种主要的染色体结构畸变：缺失、重复、倒位和易位的形成机制。',
    elements: ['缺失', '重复', '倒位', '易位', '断裂', '重接'],
    layout: 'grid',
    interactions: ['hover', 'click'],
    colors: {
      normal: '#4CAF50',
      deletion: '#F44336',
      duplication: '#2196F3',
      inversion: '#9C27B0',
      translocation: '#FF9800',
      breakpoint: '#FFC107',
    },
    data: {
      types: [
        {
          name: '缺失',
          mechanism: '染色体断裂后片段丢失',
          diagram: '正常染色体 → 断裂 → 片段丢失 → 缺失染色体',
          consequence: '基因丢失，可能致病',
          example: '5p-综合征（猫叫综合征）'
        },
        {
          name: '重复',
          mechanism: '染色体片段增加一份拷贝',
          diagram: '正常染色体 → 片段复制 → 重复染色体',
          consequence: '基因剂量增加',
          example: 'PMP22重复导致CMT1A病'
        },
        {
          name: '倒位',
          mechanism: '染色体片段断裂后180°翻转重接',
          diagram: 'ABC → 断裂B-C → ACB → 倒位ACB',
          consequence: '基因顺序改变，可能影响基因表达',
          example: '血友病A（F8基因倒位）'
        },
        {
          name: '易位',
          mechanism: '两条非同源染色体间片段交换',
          diagram: '染色体1 AB + 染色体2 CD → 染色体1 AD + 染色体2 CB',
          consequence: '可能形成融合基因',
          example: 't(9;22)费城染色体（BCR-ABL融合基因）'
        }
      ],
      classification: {
        balanced: '平衡易位/倒位：遗传物质无丢失，携带者表型正常',
        unbalanced: '不平衡易位/缺失/重复：遗传物质丢失或增加，致病'
      }
    },
    annotations: [
      '染色体结构畸变可由射线、化学物质、病毒感染引起',
      '平衡结构畸变携带者可能有不孕不育史',
      '产前诊断可检测染色体结构畸变',
      '费城染色体t(9;22)是慢性粒白血病的特征性改变'
    ]
  }
};
