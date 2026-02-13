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
  },

  'RNA干扰': {
    type: 'diagram',
    title: 'RNA干扰机制可视化',
    description: '展示RNA干扰(RNAi)的分子机制：小分子RNA(siRNA或miRNA)与RISC复合物结合，通过碱基配对靶向降解mRNA或抑制翻译。',
    elements: ['siRNA', 'miRNA', 'RISC复合物', 'mRNA降解', '翻译抑制', '基因沉默'],
    layout: 'hierarchical',
    interactions: ['hover', 'click'],
    colors: {
      sirna: '#4CAF50',
      mirna: '#2196F3',
      risc: '#9C27B0',
      mrna: '#FF9800',
      degraded: '#F44336',
      inhibited: '#FFB74D',
    },
    data: {
      pathways: [
        {
          name: 'siRNA途径',
          source: '外源长双链RNA（病毒、转基因）',
          processing: 'Dicer酶切割为21-23bp siRNA',
          loading: 'siRNA加载到RISC复合物',
          target: '完全互补配对mRNA',
          outcome: 'mRNA被降解（AGO2切割）',
          specificity: '高度特异性'
        },
        {
          name: 'miRNA途径',
          source: '内源pre-miRNA',
          processing: 'Drosha和Dicer逐步切割为21-25bp miRNA',
          loading: 'miRNA加载到RISC复合物',
          target: '部分互补配对mRNA（3\' UTR）',
          outcome: '翻译抑制或mRNA降解',
          specificity: '一个miRNA可调控多个mRNA'
        }
      ],
      components: [
        { name: 'Dicer', function: '切割双链RNA为小RNA' },
        { name: 'RISC', function: 'RNA诱导沉默复合物，核心为Argonaute蛋白' },
        { name: 'Argonaute', function: '切割mRNA或抑制翻译' },
        { name: 'RDRP', function: 'RNA依赖的RNA聚合酶，扩增siRNA（植物）' }
      ],
      applications: [
        '基因功能研究（基因敲降）',
        '基因治疗（靶向沉默致病基因）',
        '抗病毒治疗（靶向病毒RNA）',
        '抗肿瘤治疗（沉默癌基因）'
      ]
    },
    annotations: [
      'RNA干扰由Andrew Fire和Craig Mello发现，2006年获诺贝尔奖',
      'siRNA主要来源于外源双链RNA，miRNA来源于内源转录',
      'RNA干扰是重要的基因表达调控机制',
      'RNAi技术在功能基因组学和疾病治疗中有广泛应用'
    ]
  },

  '染色质重塑': {
    type: 'diagram',
    title: '染色质重塑复合物可视化',
    description: '展示染色质重塑复合物如何利用ATP水解的能量改变核小体位置和结构，从而调控DNA的可及性和基因表达。',
    elements: ['染色质重塑', '核小体滑动', '核小体置换', 'ATP依赖', '染色质开放', '基因激活'],
    layout: 'hierarchical',
    interactions: ['hover', 'click'],
    colors: {
      nucleosome: '#9C27B0',
      remodelingComplex: '#2196F3',
      atp: '#4CAF50',
      adp: '#FF9800',
      accessibleDna: '#81C784',
      inaccessibleDna: '#FFCDD2',
    },
    data: {
      families: [
        {
          name: 'SWI/SNF家族',
          subunits: '12-15个亚基',
          mechanism: '滑动或驱逐核小体',
          effect: '促进基因激活',
          example: 'BRG1（SMARCA4）',
          diseases: '癌症突变'
        },
        {
          name: 'ISWI家族',
          subunits: '2-4个亚基',
          mechanism: '规则核小体间距',
          effect: '维持染色质结构',
          example: 'SNF2H',
          function: '转录抑制、DNA复制'
        },
        {
          name: 'CHD家族',
          subunits: '包含染色结构域',
          mechanism: '识别修饰组蛋白，重塑核小体',
          effect: '发育调控',
          example: 'CHD1、CHD7',
          diseases: '发育综合征'
        },
        {
          name: 'INO80家族',
          subunits: '包含Ino80 ATP酶',
          mechanism: '交换组蛋白变体',
          effect: 'DNA修复、转录激活',
          example: 'INO80、SWR1',
          function: 'H2A.Z交换'
        }
      ],
      mechanisms: [
        {
          type: '核小体滑动',
          description: '核小体沿DNA移动，暴露或隐藏调控序列',
          energy: 'ATP水解',
          result: '改变DNA可及性'
        },
        {
          type: '组蛋白交换',
          description: '核小体中的组蛋白被变体替换',
          example: 'H2A替换为H2A.Z',
          result: '改变染色质性质'
        },
        {
          type: '核小体驱逐',
          description: '核小体被完全移除，DNA裸露',
          result: '强转录激活'
        }
      ],
      regulation: [
        '转录因子招募重塑复合物',
        '组蛋白修饰指导重塑',
        '非编码RNA调控重塑',
        '细胞周期依赖性'
      ]
    },
    annotations: [
      '染色质重塑需要消耗ATP能量',
      '重塑复合物是大型多亚基复合体',
      '染色质重塑是表观遗传调控的重要机制',
      '重塑复合物突变与多种癌症和发育疾病相关'
    ]
  },

  '非编码RNA': {
    type: 'diagram',
    title: '非编码RNA功能可视化',
    description: '展示各类非编码RNA(ncRNA)的功能：从长链非编码RNA(lncRNA)到环状RNA(circRNA)，它们在基因调控中发挥重要作用。',
    elements: ['lncRNA', 'miRNA', 'piRNA', 'circRNA', 'snoRNA', '基因调控', '表观遗传'],
    layout: 'hierarchical',
    interactions: ['hover', 'click'],
    colors: {
      lncrna: '#9C27B0',
      mirna: '#4CAF50',
      pirna: '#2196F3',
      circrna: '#FF9800',
      snorna: '#F44336',
      target: '#FFB74D',
    },
    data: {
      categories: [
        {
          name: '长链非编码RNA(lncRNA)',
          size: '>200 nt',
          abundance: '数量多，表达量低',
          mechanisms: [
            '支架蛋白复合物',
            '引导染色质修饰',
            '作为miRNA海绵(ceRNA)',
            '调节转录因子'
          ],
          examples: ['XIST(X染色体失活)', 'HOTAIR(表观遗传调控)', 'MALAT1(癌症相关)'],
          functions: '发育调控、细胞分化、癌症发生'
        },
        {
          name: '微小RNA(miRNA)',
          size: '21-25 nt',
          abundance: '数量多，表达量高',
          mechanisms: [
            '结合mRNA 3\'UTR',
            '抑制翻译或降解mRNA',
            '一个miRNA调控多个靶基因'
          ],
          examples: ['let-7(发育调控)', 'miR-21(癌症促进)', 'miR-34(肿瘤抑制)'],
          functions: '转录后调控、发育、疾病'
        },
        {
          name: '环状RNA(circRNA)',
          structure: '共价闭合环状',
          abundance: '稳定性高',
          mechanisms: [
            'miRNA海绵作用',
            '与蛋白结合',
            '可翻译短肽'
          ],
          examples: ['ciRS-7(miR-7海绵)', 'CDR1as'],
          functions: '转录后调控、生物标志物'
        },
        {
          name: 'Piwi相关RNA(piRNA)',
          size: '24-31 nt',
          expression: '生殖细胞特异性',
          mechanisms: [
            '与Piwi蛋白结合',
            '沉默转座子',
            '维持基因组稳定性'
          ],
          examples: ['piRNA簇'],
          functions: '生殖系保护、转座子沉默'
        },
        {
          name: '小核仁RNA(snoRNA)',
          size: '60-300 nt',
          location: '核仁',
          mechanisms: [
            '指导rRNA修饰',
            '2\'-O-甲基化',
            '假尿苷化'
          ],
          examples: ['U3 snoRNA'],
          functions: 'rRNA加工、核糖体生物合成'
        }
      ],
      regulation: [
        '转录调控（lncRNA作为增强子）',
        '表观遗传调控（招募修饰复合物）',
        '转录后调控（miRNA、siRNA）',
        '翻译调控（结合核糖体或mRNA）'
      ]
    },
    annotations: [
      '人类基因组中约98%的转录产物为非编码RNA',
      '非编码RNA曾是"垃圾DNA"，现在被认为是重要的调控分子',
      'lncRNA具有组织特异性表达',
      'circRNA可作为疾病诊断的生物标志物'
    ]
  },

  '基因组印记': {
    type: 'diagram',
    title: '基因组印记机制可视化',
    description: '展示基因组印记的机制：某些基因根据亲本来源进行差异表达，通过DNA甲基化和组蛋白修饰实现。',
    elements: ['印记基因', '父源表达', '母源表达', 'DNA甲基化', '差异甲基化区域', '表观遗传'],
    layout: 'hierarchical',
    interactions: ['hover', 'click'],
    colors: {
      paternal: '#2196F3',
      maternal: '#E91E63',
      imprinted: '#9C27B0',
      dmrs: '#FF9800',
      methylated: '#F44336',
      unmethylated: '#4CAF50',
    },
    data: {
      mechanism: {
        establishment: '配子形成过程中建立印记',
        maintenance: '受精后维持印记状态',
        erasure: '原始生殖细胞中抹除印记',
        reestablishment: '新配子中重新建立印记'
      },
      imprintedGenes: [
        {
          name: 'IGF2/H19区域',
          chromosome: '11p15.5',
          paternalExpression: 'IGF2（生长因子）',
          maternalExpression: 'H19（lncRNA）',
          disorder: '贝威综合征、Silver-Russell综合征'
        },
        {
          name: 'SNRPN/UBE3A区域',
          chromosome: '15q11-q13',
          paternalExpression: 'SNRPN',
          maternalExpression: 'UBE3A',
          disorder: '普拉德-威利综合征、安格曼综合征'
        },
        {
          name: 'GNAS复合物',
          chromosome: '20q13',
          multipleImprints: '多个启动子选择性印记',
          disorder: '假性甲状旁腺功能减退症'
        }
      ],
      disorders: [
        {
          name: '普拉德-威利综合征',
          cause: '父源15q11-q13缺失或印记缺陷',
          features: ['过度食欲', '肥胖', '智力障碍', '性腺发育不全'],
          pattern: '父源基因不表达'
        },
        {
          name: '安格曼综合征',
          cause: '母源15q11-q13缺失或UBE3A突变',
          features: ['严重智力障碍', '癫痫', '共济失调', '愉快性格'],
          pattern: '母源基因不表达'
        },
        {
          name: '贝威综合征',
          cause: '11p15.5父源印记缺陷或双亲二体',
          features: ['过度生长', '脐疝', '智力障碍'],
          pattern: 'IGF2过表达'
        }
      ]
    },
    annotations: [
      '基因组印记是哺乳动物特有的表观遗传现象',
      '印记基因在配子形成过程中获得亲本特异性的甲基化',
      '约100-200个人类基因受印记调控',
      '印记缺陷导致多种发育和神经疾病'
    ]
  }
};
