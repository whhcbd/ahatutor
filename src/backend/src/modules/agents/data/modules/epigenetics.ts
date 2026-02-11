import type { VisualizationSuggestion } from '@shared/types/agent.types';

export const EPIGENETICS: Record<string, Omit<VisualizationSuggestion, 'insights'>> = {
  'DNA甲基化': {
    type: 'diagram',
    title: 'DNA甲基化机制可视化',
    description: '展示DNA甲基化的形成和功能：甲基转移酶在胞嘧啶的5位碳原子上添加甲基基团，主要发生在CpG二核苷酸上，导致基因沉默。',
    elements: ['甲基化', 'CpG岛', '甲基转移酶', '基因沉默', '表观遗传标记'],
    layout: 'hierarchical',
    interactions: ['hover', 'click'],
    colors: {
      cytosine: '#4CAF50',
      guanine: '#2196F3',
      methylGroup: '#FF9800',
      methylated: '#F44336',
      unmethylated: '#81C784',
      cpgIsland: '#9C27B0',
    },
    data: {
      mechanism: {
        enzyme: 'DNA甲基转移酶(DNMT)',
        substrate: 'S-腺苷甲硫氨酸(SAM)提供甲基',
        target: 'CpG二核苷酸中的胞嘧啶',
        product: '5-甲基胞嘧啶'
      },
      locations: [
        { name: 'CpG岛', description: '富含CpG二核苷酸的DNA区域，常位于基因启动子区' },
        { name: '基因体', description: '基因内部的甲基化，可能与转录活性相关' },
        { name: '重复序列', description: '转座子等重复元件的甲基化，维持基因组稳定' }
      ],
      effects: [
        {
          methylation: '启动子区高甲基化',
          outcome: '基因沉默（转录抑制）',
          example: '抑癌基因甲基化导致癌症'
        },
        {
          methylation: '启动子区低甲基化',
          outcome: '基因激活（转录活跃）',
          example: '胚胎发育阶段基因激活'
        }
      ],
      applications: [
        '肿瘤诊断（异常甲基化模式）',
        '表观遗传治疗（DNMT抑制剂）',
        '年龄推测（DNA甲基化时钟）',
        '环境暴露评估'
      ]
    },
    annotations: [
      'DNA甲基化是最重要的表观遗传修饰之一',
      '哺乳动物中约70%的CpG位点被甲基化',
      'DNA甲基化模式在细胞分裂中可遗传',
      'DNA甲基化在X染色体失活和基因组印记中起关键作用'
    ]
  },

  '组蛋白修饰': {
    type: 'diagram',
    title: '组蛋白修饰可视化',
    description: '展示组蛋白尾部的各种修饰及其对染色质结构和基因表达的影响：乙酰化、甲基化、磷酸化等修饰构成"组蛋白密码"。',
    elements: ['组蛋白', '乙酰化', '甲基化', '磷酸化', '组蛋白密码', '染色质开放', '基因激活'],
    layout: 'hierarchical',
    interactions: ['hover', 'click'],
    colors: {
      histone: '#9C27B0',
      h3: '#7B1FA2',
      acetylation: '#4CAF50',
      methylation: '#2196F3',
      phosphorylation: '#FF9800',
      euchromatin: '#C8E6C9',
      heterochromatin: '#FFCDD2',
    },
    data: {
      histones: ['H2A', 'H2B', 'H3', 'H4'],
      tail: 'N端尾部伸出核小体，可被修饰',
      modifications: [
        {
          type: '乙酰化',
          enzyme: '组蛋白乙酰转移酶(HAT)',
          removal: '组蛋白去乙酰化酶(HDAC)',
          effect: '染色质开放，基因激活',
          example: 'H3K9ac、H3K27ac'
        },
        {
          type: '甲基化',
          enzyme: '组蛋白甲基转移酶',
          removal: '组蛋白去甲基化酶',
          effect: '取决于位点：激活或抑制',
          example: 'H3K4me3(激活)、H3K27me3(抑制)'
        },
        {
          type: '磷酸化',
          enzyme: '激酶',
          removal: '磷酸酶',
          effect: 'DNA损伤修复、染色体凝缩',
          example: 'H2AX磷酸化'
        },
        {
          type: '泛素化',
          enzyme: 'E3泛素连接酶',
          removal: '去泛素化酶',
          effect: '转录调控、DNA修复',
          example: 'H2B泛素化'
        }
      ],
      chromatinStates: [
        {
          name: '常染色质',
          marks: 'H3K4me3、H3K9ac、H3K27ac',
          structure: '松散',
          expression: '活跃转录'
        },
        {
          name: '异染色质',
          marks: 'H3K9me3、H3K27me3',
          structure: '紧密',
          expression: '转录沉默'
        }
      ]
    },
    annotations: [
      '组蛋白修饰是"组蛋白密码"假说的核心',
      '不同修饰的组合可被读取蛋白识别，产生特定效应',
      '组蛋白乙酰化通常与基因激活相关',
      '组蛋白去乙酰化酶(HDAC)抑制剂是抗肿瘤药物'
    ]
  }
};
