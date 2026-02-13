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
  },

  '非整倍体': {
    type: 'diagram',
    title: '非整倍体类型可视化',
    description: '展示非整倍体的各种类型：单体、三体、多体及其形成机制和后果。',
    elements: ['单体', '三体', '多体', '不分离', '染色体丢失', '染色体迟滞'],
    layout: 'hierarchical',
    interactions: ['hover', 'click'],
    colors: {
      normal: '#4CAF50',
      monosomy: '#F44336',
      trisomy: '#FF9800',
      tetrasomy: '#2196F3',
      missing: '#FFB74D',
    },
    data: {
      types: [
        {
          name: '单体(2n-1)',
          description: '某对染色体缺失一条',
          formation: '减数分裂不分离或染色体丢失',
          viability: '大多数常染色体单体致死',
          examples: [
            'X单体（特纳氏综合征）45,X - 可存活',
            '常染色体单体 - 胚胎期致死'
          ]
        },
        {
          name: '三体(2n+1)',
          description: '某对染色体多出一条',
          formation: '减数分裂不分离',
          viability: '部分常染色体三体可存活',
          examples: [
            '21三体（唐氏综合征）47,XX,+21',
            '18三体（爱德华氏综合征）47,XY,+18',
            '13三体（帕陶氏综合征）47,XX,+13',
            '性染色体三体：47,XXY；47,XXX；47,XYY'
          ]
        },
        {
          name: '多体(2n+n)',
          description: '某对染色体多出多条',
          formation: '多次不分离事件',
          examples: ['48,XXXX', '49,XXXXX'],
          viability: '性染色体多体相对可存活'
        }
      ],
      mechanisms: [
        {
          type: '减数第一次分裂不分离',
          description: '同源染色体未分离到不同极',
          result: 'n+1和n-1配子',
          frequency: '约占2/3的非整倍体'
        },
        {
          type: '减数第二次分裂不分离',
          description: '姐妹染色单体未分离',
          result: 'n+1和n-1配子',
          frequency: '约占1/3的非整倍体'
        },
        {
          type: '有丝分裂不分离',
          description: '合子分裂时染色体不分离',
          result: '嵌合体（部分细胞正常，部分异常）',
          example: '嵌合型唐氏综合征'
        },
        {
          type: '染色体迟滞',
          description: '染色体在分裂时落后',
          result: '形成微核或丢失',
          frequency: '较常见'
        }
      ]
    },
    annotations: [
      '非整倍体是染色体数目异常的最常见类型',
      '约30%的人类妊娠流产与染色体非整倍体相关',
      '性染色体非整倍体比常染色体非整倍体更可存活',
      '高龄孕妇的卵子更容易发生不分离'
    ]
  },

  '核型': {
    type: 'diagram',
    title: '人类核型分析可视化',
    description: '展示人类正常核型（46,XX或46,XY）的排列方式和核型分析的临床应用。',
    elements: ['核型分析', '染色体配对', '核型公式', '染色体带型', 'G显带'],
    layout: 'grid',
    interactions: ['hover', 'click'],
    colors: {
      groupA: '#F44336',
      groupB: '#FF9800',
      groupC: '#FFEB3B',
      groupD: '#4CAF50',
      groupE: '#2196F3',
      groupF: '#9C27B0',
      groupG: '#E91E63',
      sex: '#607D8B',
    },
    data: {
      karyotypeGroups: [
        { group: 'A组', chromosomes: '1-3号', description: '最大的染色体，中着丝粒', color: '#F44336' },
        { group: 'B组', chromosomes: '4-5号', description: '大染色体，亚中着丝粒', color: '#FF9800' },
        { group: 'C组', chromosomes: '6-12号+X', description: '中等大小，亚中着丝粒', color: '#FFEB3B' },
        { group: 'D组', chromosomes: '13-15号', description: '中等大小，近端着丝粒，带随体', color: '#4CAF50' },
        { group: 'E组', chromosomes: '16-18号', description: '小染色体，亚中着丝粒', color: '#2196F3' },
        { group: 'F组', chromosomes: '19-20号', description: '小染色体，中着丝粒', color: '#9C27B0' },
        { group: 'G组', chromosomes: '21-22号+Y', description: '最小，近端着丝粒，21、22带随体', color: '#E91E63' }
      ],
      karyotypeNotation: [
        { notation: '46,XX', description: '正常女性核型，46条染色体，两条X染色体' },
        { notation: '46,XY', description: '正常男性核型，46条染色体，一条X一条Y' },
        { notation: '47,XX,+21', description: '唐氏综合征（21三体）女性' },
        { notation: '45,X', description: '特纳氏综合征（X单体）' },
        { notation: '46,XX,t(9;22)', description: '携带费城染色体易位的女性' }
      ],
      banding: [
        { technique: 'G显带', description: '吉姆萨染色，显示深浅带', resolution: '400-550条带' },
        { technique: 'R显带', description: '与G带相反', resolution: '与G带相似' },
        { technique: 'Q显带', description: '荧光染色', resolution: '与G带相似' },
        { technique: '高分辨率显带', description: '早中期染色体', resolution: '800-1200条带' }
      ],
      applications: [
        '染色体疾病诊断（唐氏综合征、特纳氏综合征等）',
        '产前诊断（羊水穿刺、绒毛取样）',
        '白血病分型（特定染色体异常）',
        '不孕不育原因分析（平衡易位携带者）',
        '肿瘤诊断和预后评估'
      ]
    },
    annotations: [
      '核型是生物体所有染色体的图像',
      '人类核型分析是细胞遗传学的重要诊断工具',
      '核型公式按染色体大小和着丝粒位置分组排列',
      '核型分析需要培养细胞至分裂中期'
    ]
  },

  '多倍体': {
    type: 'diagram',
    title: '多倍体形成机制可视化',
    description: '展示多倍体的形成机制和类型：三倍体、四倍体等整倍体异常在人类中的表现。',
    elements: ['多倍体', '三倍体', '四倍体', '双精受精', '核内复制', '有丝分裂失败'],
    layout: 'hierarchical',
    interactions: ['hover', 'click'],
    colors: {
      normal: '#4CAF50',
      triploid: '#FF9800',
      tetraploid: '#F44336',
      sperm: '#2196F3',
      egg: '#E91E63',
    },
    data: {
      types: [
        {
          name: '三倍体(3n)',
          chromosomeNumber: '69条染色体',
          mechanisms: [
            '双精受精：两个精子与一个卵子结合',
            '双雌受精：极体未排出参与受精',
            '受精后第一次有丝分裂失败'
          ],
          viability: '胚胎期或出生后早期死亡',
          examples: ['部分葡萄胎（三倍体）', '部分自然流产为三倍体']
        },
        {
          name: '四倍体(4n)',
          chromosomeNumber: '92条染色体',
          mechanisms: [
            '核内复制：DNA复制但不分裂',
            '有丝分裂失败：第一次有丝分裂完全失败',
            '细胞融合：两个二倍体细胞融合'
          ],
          viability: '几乎全部胚胎期死亡',
          examples: ['极少数嵌合四倍体可存活至出生']
        },
        {
          name: '嵌合多倍体',
          description: '部分细胞为多倍体，部分正常',
          formation: '受精后某个细胞分裂异常',
          viability: '比完全多倍体存活率高',
          examples: ['部分三倍体嵌合体']
        }
      ],
      formationMechanisms: [
        {
          name: '双精受精',
          process: '两个精子同时进入一个卵子',
          outcome: '正常卵子(23) + 2个精子(23+23) = 69',
          frequency: '三倍体最常见原因'
        },
        {
          name: '双雌受精',
          process: '卵子分裂失败，两个极体参与受精',
          outcome: '异常卵子(46) + 精子(23) = 69',
          frequency: '较少见'
        },
        {
          name: '核内复制',
          process: 'DNA复制但细胞不分裂',
          outcome: '二倍体细胞 → 四倍体细胞',
          frequency: '四倍体常见原因'
        },
        {
          name: '有丝分裂失败',
          process: '受精卵第一次分裂完全失败',
          outcome: '受精卵(46) → 46 → 46（不分裂）',
          frequency: '较少见'
        }
      ],
      clinical: [
        '三倍体自然流产率：约占自然流产的15-20%',
        '存活的三倍体：极罕见，多在新生儿期死亡',
        '多倍体在植物中常见（如小麦是六倍体）',
        '多倍体在动物中罕见且通常致死'
      ]
    },
    annotations: [
      '多倍体是整倍体异常的一种',
      '人类多倍体几乎总是胚胎期致死',
      '三倍体是导致自然流产的常见原因',
      '植物多倍体在农业中有重要应用'
    ]
  },

  '罗伯逊易位': {
    type: 'diagram',
    title: '罗伯逊易位机制可视化',
    description: '展示罗伯逊易位的形成机制：两条近端着丝粒染色体在着丝粒处融合，形成一条衍生染色体。',
    elements: ['罗伯逊易位', '近端着丝粒', '染色体融合', '衍生染色体', '平衡易位', '唐氏综合征'],
    layout: 'hierarchical',
    interactions: ['hover', 'click'],
    colors: {
      chromosome13: '#4CAF50',
      chromosome14: '#2196F3',
      chromosome21: '#FF9800',
      chromosome22: '#9C27B0',
      derivative: '#F44336',
      centromere: '#E91E63',
    },
    data: {
      mechanism: {
        involved: '近端着丝粒染色体（13、14、15、21、22号）',
        process: '两条染色体在着丝粒处断裂并融合',
        result: '形成一条大的衍生染色体',
        loss: '两条短臂丢失（含少量重复序列）'
      },
      commonTranslocations: [
        {
          type: 'rob(13;14)',
          frequency: '最常见的罗伯逊易位（约1/1300）',
          description: '13号和14号染色体易位',
          carriers: '表型正常，可能有不孕不育史'
        },
        {
          type: 'rob(14;21)',
          frequency: '约1/1000',
          description: '14号和21号染色体易位',
          risk: '携带者生育21三体后代风险显著增高（10-15%）',
          clinical: '平衡易位携带者筛查重要'
        },
        {
          type: 'rob(21;21)',
          frequency: '罕见',
          description: '两条21号染色体易位',
          carriers: '无法生育正常后代',
          outcome: '所有后代均为21三体或流产'
        }
      ],
      carrierRisk: [
        '携带者核型：45,XX,der(14;21)',
        '携带者表型：正常（仅损失45条染色体）',
        '生育风险：根据易位类型不同而异',
        '后代可能的核型：正常、平衡易位携带者、三体、流产'
      ],
      geneticCounseling: [
        '家族史调查',
        '核型分析确认易位类型',
        '评估生育风险',
        '产前诊断（羊穿、NIPT）',
        '辅助生殖技术（PGD）'
      ]
    },
    annotations: [
      '罗伯逊易位是最常见的染色体结构异常',
      '约1/1000的新生儿携带罗伯逊易位',
      '罗伯逊易位携带者表型正常',
      'rob(14;21)是家族性唐氏综合征的主要原因'
    ]
  },

  '联会': {
    type: 'diagram',
    title: '减数分裂联会可视化',
    description: '展示减数分裂前期I同源染色体联会的过程：同源染色体精确配对，形成二价体。',
    elements: ['同源染色体', '联会', '二价体', '联会复合物', '交叉'],
    layout: 'hierarchical',
    interactions: ['hover', 'click'],
    colors: {
      homolog1: '#4CAF50',
      homolog2: '#2196F3',
      synaptonemal: '#FF9800',
      crossover: '#F44336',
      bivalent: '#9C27B0',
    },
    data: {
      stages: [
        {
          name: '细线期',
          description: '染色体开始凝缩，呈现细丝状',
          keyEvents: ['染色体开始凝缩', '同源染色体尚未配对']
        },
        {
          name: '偶线期',
          description: '同源染色体开始配对，形成联会复合物',
          keyEvents: ['同源染色体识别', '联会复合物开始组装', '端粒附着在核膜上']
        },
        {
          name: '粗线期',
          description: '同源染色体完全配对，形成二价体，发生交叉',
          keyEvents: ['联会完成', '形成二价体', '同源重组发生', '交叉可见']
        },
        {
          name: '双线期',
          description: '同源染色体开始分离，交叉点逐渐向端部移动',
          keyEvents: ['同源染色体部分分离', '交叉端化', '重组交换完成']
        },
        {
          name: '终变期',
          description: '染色体高度凝缩，二价体移向赤道板',
          keyEvents: ['染色体进一步凝缩', '核膜破裂', '纺锤体形成']
        }
      ],
      synaptonemalComplex: {
        structure: '蛋白质复合物结构，连接同源染色体',
        components: [
          { name: '侧元件', location: '连接每条同源染色体', composition: '蛋白质' },
          { name: '中央元件', location: '连接两个侧元件', composition: '蛋白质' },
          { name: '横丝', location: '连接侧元件和中央元件', composition: '蛋白质' }
        ],
        function: '稳定同源染色体配对，促进同源重组'
      },
      significance: [
        '联会是同源染色体精确配对的关键过程',
        '联会复合物确保同源重组的准确性',
        '交叉产生遗传变异，是孟德尔自由组合定律的细胞学基础',
        '联会缺陷导致不育和染色体异常'
      ],
      relatedConcepts: [
        '同源重组：联会过程中发生的基因交换',
        '交叉互换：联会时同源染色体间的物质交换',
        '二价体：联会后的同源染色体对'
      ]
    },
    annotations: [
      '联会发生在减数分裂前期I',
      '联会复合物是联会的关键结构',
      '交叉是遗传变异的重要来源',
      '联会异常可导致不孕不育'
    ]
  },

  '同源重组': {
    type: 'diagram',
    title: '同源重组机制可视化',
    description: '展示同源重组的分子机制：DNA双链断裂修复过程中，同源染色体间的遗传物质交换。',
    elements: ['DNA双链断裂', '单链入侵', 'Holliday连接体', '交叉', '基因转换'],
    layout: 'hierarchical',
    interactions: ['hover', 'click'],
    colors: {
      dna1: '#4CAF50',
      dna2: '#2196F3',
      break: '#F44336',
      invasion: '#FF9800',
      holliday: '#9C27B0',
      crossover: '#7B1FA2',
    },
    data: {
      process: [
        {
          step: 1,
          name: 'DNA双链断裂',
          description: 'SPO11蛋白在染色质上产生程序性双链断裂',
          enzymes: ['SPO11（产生断裂）', 'MRX复合物（切除5\'端）']
        },
        {
          step: 2,
          name: '末端切除',
          description: '5\'端被切除，产生3\'单链突出',
          result: '形成3\'单链悬垂'
        },
        {
          step: 3,
          name: '单链入侵',
          description: '3\'单链侵入同源染色体，寻找同源序列',
          protein: 'RAD51和DMC1介导单链入侵',
          result: '形成D环（Displacement loop）'
        },
        {
          step: 4,
          name: 'DNA合成',
          description: '以同源染色体为模板合成DNA',
          enzyme: 'DNA聚合酶',
          result: '延伸入侵的3\'端'
        },
        {
          step: 5,
          name: '双Holliday连接体形成',
          description: '另一端也入侵同源染色体，形成两个Holliday连接体',
          structure: '两个DNA分子交叉连接'
        },
        {
          step: 6,
          name: '分解',
          description: 'Holliday连接体被核酸酶分解',
          outcomes: [
            '交叉（Crossover）：产生遗传交换',
            '非交叉（Non-crossover）：仅产生基因转换'
          ]
        }
      ],
      keyProteins: [
        { name: 'SPO11', function: '产生程序性双链断裂' },
        { name: 'RAD51', function: '介导单链入侵，核心重组酶' },
        { name: 'DMC1', function: '减数分裂特异性重组酶' },
        { name: 'BRCA2', function: '协助RAD51加载到DNA' },
        { name: 'MSH4/MSH5', function: '稳定Holliday连接体' },
        { name: 'MLH1/MLH3', function: '分解Holliday连接体' }
      ],
      outcomes: [
        {
          type: '交叉（Crossover）',
          description: '同源染色体间发生物理交换',
          significance: '产生新的基因组合，增加遗传多样性',
          frequency: '每对同源染色体至少1个交叉'
        },
        {
          type: '非交叉（Non-crossover）',
          description: '不产生物理交换，但可能有基因转换',
          significance: '修复DNA断裂，维持基因组稳定性',
          frequency: '大多数重组事件是非交叉'
        }
      ],
      significance: [
        '同源重组是减数分裂的核心机制',
        '交叉是遗传变异的重要来源',
        '同源重组修复DNA双链断裂',
        '重组缺陷导致不育和染色体异常'
      ]
    },
    annotations: [
      '同源重组发生在减数分裂前期I',
      '交叉是孟德尔自由组合定律的细胞学基础',
      'BRCA基因突变增加癌症风险',
      '同源重组是基因组稳定性的重要保障'
    ]
  },

  '染色体组型': {
    type: 'diagram',
    title: '染色体组型分析可视化',
    description: '展示染色体组型的分析方法和分组：按染色体大小、着丝粒位置和带型进行分类排列。',
    elements: ['染色体组', '常染色体', '性染色体', '带型', '着丝粒位置', '分组'],
    layout: 'hierarchical',
    interactions: ['hover', 'click'],
    colors: {
      groupA: '#4CAF50',
      groupB: '#2196F3',
      groupC: '#FF9800',
      groupD: '#9C27B0',
      groupE: '#7B1FA2',
      groupF: '#F44336',
      groupG: '#00BCD4',
      sexChromosome: '#FF5722',
    },
    data: {
      humanKaryotype: {
        total: '46条（23对）',
        autosomes: '44条（22对）',
        sexChromosomes: '2条（1对）',
        notation: '46,XX（女性）或46,XY（男性）'
      },
      groups: [
        {
          name: 'A组（1-3号）',
          description: '最大的染色体',
          characteristics: '着丝粒近中部',
          chromosomes: [
            { number: 1, description: '最大，着丝粒近中部' },
            { number: 2, description: '第二大，着丝粒近中部' },
            { number: 3, description: '第三大，着丝粒近中部' }
          ]
        },
        {
          name: 'B组（4-5号）',
          description: '大染色体',
          characteristics: '着丝粒亚中部',
          chromosomes: [
            { number: 4, description: '大，着丝粒亚中部' },
            { number: 5, description: '大，着丝粒亚中部' }
          ]
        },
        {
          name: 'C组（6-12号，X染色体）',
          description: '中等大小染色体',
          characteristics: '着丝粒亚中部',
          chromosomes: '6-12号常染色体，X染色体大小类似7号'
        },
        {
          name: 'D组（13-15号）',
          description: '中等偏小染色体',
          characteristics: '着丝粒近端部，有随体',
          chromosomes: [
            { number: 13, description: '中等偏小，着丝粒近端部，有随体' },
            { number: 14, description: '中等偏小，着丝粒近端部，有随体' },
            { number: 15, description: '中等偏小，着丝粒近端部，有随体' }
          ]
        },
        {
          name: 'E组（16-18号）',
          description: '较小染色体',
          characteristics: '着丝粒中部或亚中部',
          chromosomes: [
            { number: 16, description: '小，着丝粒中部' },
            { number: 17, description: '小，着丝粒亚中部' },
            { number: 18, description: '小，着丝粒亚中部' }
          ]
        },
        {
          name: 'F组（19-20号）',
          description: '小染色体',
          characteristics: '着丝粒中部',
          chromosomes: [
            { number: 19, description: '很小，着丝粒中部' },
            { number: 20, description: '很小，着丝粒中部' }
          ]
        },
        {
          name: 'G组（21-22号，Y染色体）',
          description: '最小染色体',
          characteristics: '着丝粒近端部，21和22号有随体',
          chromosomes: [
            { number: 21, description: '最小，着丝粒近端部，有随体' },
            { number: 22, description: '很小，着丝粒近端部，有随体' },
            { number: 'Y', description: '最小，着丝粒近端部，无随体' }
          ]
        }
      ],
      bandingPatterns: {
        method: 'Giemsa染色（G带）',
        principle: '染色体上AT和GC含量不同，染色深浅不同',
        darkBands: 'Giemsa深染区（AT丰富）',
        lightBands: 'Giemsa浅染区（GC丰富）',
        significance: '每个染色体有独特的带型，用于识别染色体和异常'
      },
      centromerePositions: [
        {
          type: '中部着丝粒（Metacentric）',
          description: '着丝粒位于染色体中部',
          ratio: 'p:q ≈ 1:1',
          examples: '1号、3号、16号、19号、20号'
        },
        {
          type: '亚中部着丝粒（Submetacentric）',
          description: '着丝粒偏移但不在端部',
          ratio: 'p:q ≈ 1:1.5-3',
          examples: '2号、4-12号、17号、18号、X染色体'
        },
        {
          type: '近端着丝粒（Acrocentric）',
          description: '着丝粒靠近端部',
          ratio: 'p:q ≈ 1:7-10',
          examples: '13-15号、21号、22号、Y染色体'
        }
      ]
    },
    annotations: [
      '人类染色体组型分为A-G共7组',
      'G带是最常用的染色体显带技术',
      '染色体异常通过带型变化检测',
      '核型分析是产前诊断的重要手段'
    ]
  }
};
