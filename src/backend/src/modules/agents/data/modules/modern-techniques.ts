import type { VisualizationSuggestion } from '@shared/types/agent.types';

export const MODERN_TECHNIQUES: Record<string, Omit<VisualizationSuggestion, 'insights'>> = {
  'PCR技术': {
    type: 'diagram',
    title: 'PCR技术原理可视化',
    description: '展示聚合酶链式反应（PCR）的基本原理：通过变性、退火、延伸三个步骤的循环，在体外扩增特定DNA片段。',
    elements: ['变性', '退火', '延伸', '引物', 'Taq聚合酶', 'DNA扩增'],
    layout: 'hierarchical',
    interactions: ['click', 'hover'],
    colors: {
      templateStrand: '#4CAF50',
      newStrand: '#2196F3',
      primer: '#FF9800',
      taqPolymerase: '#9C27B0',
    },
    animationConfig: {
      duration: 8000,
      easing: 'easeInOut',
      autoplay: false,
      steps: [
        { phase: '变性（94-98°C）', description: 'DNA双链解旋成单链', duration: 2000 },
        { phase: '退火（50-65°C）', description: '引物与模板单链互补结合', duration: 2000 },
        { phase: '延伸（72°C）', description: 'Taq聚合酶从引物开始合成新DNA链', duration: 2500 },
        { phase: '循环重复', description: '每个循环DNA拷贝数翻倍，30循环后可产生约10亿个拷贝', duration: 1500 }
      ]
    },
    data: {
      cycles: [
        { cycle: 1, molecules: 2, description: '1个DNA分子变成2个' },
        { cycle: 2, molecules: 4, description: '2个DNA分子变成4个' },
        { cycle: 3, molecules: 8, description: '4个DNA分子变成8个' },
        { cycle: 10, molecules: 1024, description: '约1000个拷贝' },
        { cycle: 20, molecules: 1048576, description: '约100万个拷贝' },
        { cycle: 30, molecules: 1073741824, description: '约10亿个拷贝' }
      ],
      components: [
        { name: '模板DNA', description: '待扩增的DNA片段' },
        { name: '引物', description: '与模板DNA两端互补的短链DNA，确定扩增区域' },
        { name: 'Taq聚合酶', description: '耐热DNA聚合酶，在高温下保持活性' },
        { name: 'dNTPs', description: 'DNA合成的原料（dATP、dCTP、dGTP、dTTP）' },
        { name: '缓冲液', description: '提供适宜的离子环境和pH' }
      ],
      formula: '2^n（n为循环次数）'
    },
    annotations: [
      'PCR由Kary Mullis于1983年发明，1993年获诺贝尔奖',
      'Taq聚合酶从水生嗜热菌中分离，耐高温',
      'PCR广泛用于基因克隆、突变检测、法医鉴定、传染病诊断',
      '实时定量PCR（qPCR）可定量检测DNA起始量'
    ]
  },

  'CRISPR': {
    type: 'diagram',
    title: 'CRISPR-Cas9基因编辑可视化',
    description: '展示CRISPR-Cas9基因编辑系统的原理：向导RNA（gRNA）引导Cas9蛋白切割目标DNA，产生双链断裂，通过细胞修复机制实现基因敲除、敲入或修饰。',
    elements: ['Cas9蛋白', '向导RNA', 'PAM序列', '双链断裂', '基因敲除', '基因敲入', '同源重组'],
    layout: 'hierarchical',
    interactions: ['click', 'hover'],
    colors: {
      cas9: '#9C27B0',
      grna: '#2196F3',
      targetDNA: '#4CAF50',
      cutSite: '#F44336',
      donorDNA: '#FF9800',
    },
    animationConfig: {
      duration: 6000,
      easing: 'easeInOut',
      autoplay: false,
      steps: [
        { phase: '识别', description: 'gRNA-Cas9复合物识别目标DNA序列（需邻近PAM序列）', duration: 1500 },
        { phase: '切割', description: 'Cas9在目标位置产生双链断裂', duration: 1500 },
        { phase: '修复', description: '细胞通过NHEJ或HDR修复断裂', duration: 2000 },
        { phase: '结果', description: 'NHEJ导致基因敲除，HDR可实现精准编辑', duration: 1000 }
      ]
    },
    data: {
      components: [
        {
          name: 'Cas9核酸酶',
          description: '源自化脓链球菌的RNA导向的DNA内切酶，由RuvC和HNH两个核酸酶结构域组成',
          function: '在向导RNA引导下识别并切割目标DNA，产生双链断裂'
        },
        {
          name: '向导RNA (gRNA)',
          description: '由crRNA（识别序列）和tracrRNA（支架结构）融合而成的单链RNA，约20个核苷酸的引导序列与目标DNA互补配对',
          function: '引导Cas9蛋白精确识别目标DNA序列'
        },
        {
          name: 'PAM序列',
          description: '前间区序列邻近基序（Protospacer Adjacent Motif），通常为NGG序列，位于目标DNA的3\'端',
          function: 'Cas9识别目标DNA的必需条件，是区分外源和自身DNA的关键'
        },
        {
          name: '供体DNA模板（可选）',
          description: '设计好的双链DNA片段，包含目标位点两侧的同源序列（约50-100bp）和想要插入的新序列',
          function: '作为同源重组修复的模板，实现精准的基因插入或点突变修复'
        }
      ],
      steps: [
        {
          step: 1,
          name: 'gRNA-Cas9复合物形成',
          description: 'Cas9蛋白与向导RNA组装成核糖核蛋白复合物（RNP）',
          details: [
            'Cas9蛋白结合向导RNA的重复序列和反重复序列',
            '形成稳定的RNP复合物，提高编辑效率',
            '减少脱靶效应，提高特异性'
          ]
        },
        {
          step: 2,
          name: '识别目标DNA序列',
          description: 'gRNA-Cas9复合物在基因组中扫描，寻找与gRNA互补的目标序列',
          details: [
            'gRNA的20核苷酸引导序列与目标DNA配对',
            '必须存在邻近的PAM序列（NGG）',
            '完全匹配后，Cas9构象改变，准备切割'
          ]
        },
        {
          step: 3,
          name: '产生双链断裂',
          description: 'Cas9的两个核酸酶结构域分别在DNA的两条链上切割，产生平端双链断裂',
          details: [
            'HNH结构域切割与gRNA互补的链',
            'RuvC结构域切割非互补链',
            '在PAM序列上游3-4个碱基处产生断裂',
            '断裂激活细胞的DNA修复机制'
          ]
        },
        {
          step: 4,
          name: 'DNA修复与编辑',
          description: '细胞通过内源性DNA修复机制修复双链断裂，实现基因编辑',
          details: [
            'NHEJ：直接连接断裂端，易产生插入或缺失',
            'HDR：以供体DNA为模板进行精确修复',
            'HDR仅在有丝分裂S/G2期活跃',
            '通过提供供体DNA可实现精准编辑'
          ]
        }
      ],
      repairMechanisms: [
        {
          name: '非同源末端连接 (NHEJ)',
          description: '细胞直接连接DNA断裂的两端，不需要模板，快速但不精确，容易产生小的插入或缺失（indel）',
          outcome: 'indel突变可能导致移码或基因功能丧失，常用于基因敲除研究',
          application: '基因敲除、功能研究、治疗性失活突变'
        },
        {
          name: '同源定向修复 (HDR)',
          description: '细胞利用同源DNA模板精确修复断裂，需要提供与断裂点两侧同源的供体DNA，精确但效率较低',
          outcome: '精确的基因插入、点突变修复或序列替换，保留基因功能',
          application: '基因敲入、点突变修复、基因功能恢复、精准基因治疗'
        }
      ]
    },
    annotations: [
      'CRISPR源自细菌的适应性免疫系统',
      'Jennifer Doudna和Emmanuelle Charpentier因CRISPR研究获2020年诺贝尔化学奖',
      '相比ZFN和TALEN，CRISPR更简单、高效、经济',
      '脱靶效应是主要的安全隐患'
    ]
  },

  '基因工程': {
    type: 'diagram',
    title: '基因工程（重组DNA技术）可视化',
    description: '展示基因工程的基本流程：目的基因获取、载体构建、转化宿主细胞、筛选和表达。',
    elements: ['目的基因', '载体', '限制酶', 'DNA连接酶', '转化', '筛选', '表达'],
    layout: 'hierarchical',
    interactions: ['hover', 'click'],
    colors: {
      gene: '#4CAF50',
      vector: '#2196F3',
      restrictionEnzyme: '#F44336',
      ligase: '#FF9800',
      hostCell: '#9C27B0',
    },
    data: {
      steps: [
        {
          step: 1,
          name: '目的基因获取',
          methods: ['PCR扩增', '从基因组文库筛选', '化学合成', 'cDNA文库'],
          description: '获得需要克隆的目标基因'
        },
        {
          step: 2,
          name: '载体构建',
          methods: ['限制酶切', '连接酶连接'],
          description: '将目的基因插入载体DNA'
        },
        {
          step: 3,
          name: '转化/转染',
          methods: ['热激法', '电穿孔法', '脂质体转染'],
          description: '将重组DNA导入宿主细胞'
        },
        {
          step: 4,
          name: '筛选',
          methods: ['抗生素抗性', '蓝白斑筛选', 'PCR鉴定', '测序'],
          description: '筛选出含有重组DNA的细胞'
        },
        {
          step: 5,
          name: '表达',
          methods: ['诱导表达', '纯化蛋白'],
          description: '宿主细胞表达目的蛋白'
        }
      ],
      vectors: [
        { type: '质粒', host: '细菌', features: ['复制原点', '抗性基因', '多克隆位点'] },
        { type: '噬菌体', host: '细菌', features: ['高容量', '高效转导'] },
        { type: '病毒载体', host: '真核细胞', features: ['高效感染', '稳定表达'] },
        { type: '人工染色体', host: '真核细胞', features: ['大容量', '稳定维持'] }
      ]
    },
    annotations: [
      '基因工程是现代生物技术的核心',
      '限制酶和DNA连接酶是基因工程的"工具酶"',
      '常用宿主：大肠杆菌、酵母、昆虫细胞、哺乳动物细胞',
      '应用：生产胰岛素、生长激素等药物，转基因作物，基因治疗'
    ]
  },

  '测序技术': {
    type: 'diagram',
    title: 'DNA测序技术可视化',
    description: '展示DNA测序技术的发展：从第一代Sanger测序到第三代单分子测序的原理和应用。',
    elements: ['Sanger测序', 'NGS', '第三代测序', '测序通量', '读长', '准确度', '成本'],
    layout: 'hierarchical',
    interactions: ['hover', 'click'],
    colors: {
      firstGen: '#F44336',
      secondGen: '#FF9800',
      thirdGen: '#4CAF50',
      throughput: '#2196F3',
      readLength: '#9C27B0',
      accuracy: '#7B1FA2',
      cost: '#00BCD4',
    },
    data: {
      generations: [
        {
          name: '第一代测序（Sanger法）',
          principle: '双脱氧链终止法，使用荧光标记的双脱氧核苷酸',
          readLength: '700-1000 bp',
          throughput: '低（一次测序一个片段）',
          accuracy: '极高（>99.99%）',
          cost: '高（每个碱基）',
          applications: '验证性测序、小项目',
          year: 1977
        },
        {
          name: '第二代测序（NGS）',
          principle: '大规模平行测序，边合成边测序或边连接边测序',
          platforms: ['Illumina（边合成边测序）', 'Ion Torrent（半导体检测）', '454（焦磷酸测序）'],
          readLength: '50-300 bp（Illumina）',
          throughput: '极高（每次运行产生数GB数据）',
          accuracy: '高（99.9%）',
          cost: '低（每个碱基）',
          applications: '全基因组测序、RNA-seq、ChIP-seq',
          year: 2005
        },
        {
          name: '第三代测序',
          principle: '单分子实时测序，无需PCR扩增',
          platforms: ['PacBio（SMRT测序）', 'Oxford Nanopore（纳米孔测序）'],
          readLength: '极长（>10 kb，可达100 kb+）',
          throughput: '中等',
          accuracy: '中等（95-99%，持续改进）',
          cost: '中等',
          applications: '结构变异检测、从头组装、甲基化检测',
          year: 2010
        }
      ],
      applications: [
        {
          name: '全基因组测序（WGS）',
          description: '测序整个基因组，用于疾病诊断、进化研究',
          dataVolume: '人类基因组约3 GB'
        },
        {
          name: '全外显子测序（WES）',
          description: '测序所有编码外显子（约1-2%基因组）',
          target: '约30 Mb'
        },
        {
          name: '转录组测序（RNA-seq）',
          description: '测序所有RNA，研究基因表达',
          applications: '差异表达分析、可变剪接检测、新转录本发现'
        },
        {
          name: '表观遗传测序',
          description: '检测DNA甲基化、组蛋白修饰等',
          methods: 'Bisulfite-seq、ChIP-seq、ATAC-seq'
        }
      ],
      metrics: {
        readLength: '单次测序读出的碱基数',
        throughput: '单次运行产生的总数据量',
        coverage: '基因组每个位置被测序的平均次数',
        qscore: '质量分数，Q30表示错误率0.1%'
      }
    },
    annotations: [
      'Sanger测序法由Frederick Sanger发明，获1980年诺贝尔奖',
      'Illumina测序是目前应用最广泛的NGS技术',
      'Nanopore测序可实时测序，无需复杂仪器',
      '测序成本下降推动精准医学发展'
    ]
  },

  '基因克隆': {
    type: 'diagram',
    title: '基因克隆技术可视化',
    description: '展示基因克隆的完整流程：从目的基因获取到重组蛋白表达和纯化的全过程。',
    elements: ['目的基因', '载体构建', '转化', '克隆筛选', '小量制备', '大量表达', '蛋白纯化'],
    layout: 'hierarchical',
    interactions: ['hover', 'click'],
    colors: {
      gene: '#4CAF50',
      vector: '#2196F3',
      transformation: '#FF9800',
      screening: '#9C27B0',
      expression: '#F44336',
      purification: '#7B1FA2',
    },
    data: {
      workflow: [
        {
          step: 1,
          name: '目的基因获取',
          methods: [
            { name: 'PCR扩增', description: '使用特异性引物扩增目标基因' },
            { name: '限制酶切', description: '从基因组或cDNA文库获取' },
            { name: '化学合成', description: '直接合成基因序列' }
          ],
          considerations: '添加合适的酶切位点、去除内含子（如需要）'
        },
        {
          step: 2,
          name: '载体选择与构建',
          vectors: [
            { type: '克隆载体', purpose: '基因扩增和保存', features: '高拷贝数、多克隆位点' },
            { type: '表达载体', purpose: '蛋白表达', features: '启动子、融合标签、筛选标记' },
            { type: '穿梭载体', purpose: '在不同宿主间转移', features: '多个复制原点' }
          ],
          cloningMethods: ['限制酶切连接', 'Gateway克隆', 'Gibson组装', 'TOPO克隆']
        },
        {
          step: 3,
          name: '转化/转染',
          methods: [
            { host: '大肠杆菌', methods: ['热激法', '电穿孔法'] },
            { host: '酵母', methods: ['醋酸锂法', '电穿孔法'] },
            { host: '哺乳动物细胞', methods: ['脂质体转染', '磷酸钙沉淀', '病毒感染'] }
          ]
        },
        {
          step: 4,
          name: '克隆筛选与鉴定',
          methods: [
            { name: '抗生素筛选', description: '只有含载体的细胞才能生长' },
            { name: '蓝白斑筛选', description: 'α-互补筛选重组克隆' },
            { name: '菌落PCR', description: '快速验证插入片段' },
            { name: '限制酶切分析', description: '验证插入片段大小' },
            { name: '测序验证', description: '确认序列正确性' }
          ]
        },
        {
          step: 5,
          name: '表达与纯化',
          expressionSystems: [
            { host: '大肠杆菌', advantages: '快速、廉价、高产', limitations: '无翻译后修饰' },
            { host: '酵母', advantages: '真核表达、分泌表达', limitations: '糖基化与哺乳动物不同' },
            { host: '昆虫细胞', advantages: '翻译后修饰、高表达', limitations: '成本较高' },
            { host: '哺乳动物细胞', advantages: '天然翻译后修饰', limitations: '昂贵、低产' }
          ],
          purificationMethods: ['亲和层析', '离子交换层析', '凝胶过滤层析', '标签蛋白纯化（His-tag、GST-tag）']
        }
      ],
      tags: [
        { name: 'His-tag', description: '6个组氨酸标签，镍柱亲和纯化' },
        { name: 'GST-tag', description: '谷胱甘肽S转移酶标签，谷胱甘肽柱纯化' },
        { name: 'Flag-tag', description: '短肽标签，抗Flag抗体纯化/检测' },
        { name: 'Myc-tag', description: '短肽标签，抗Myc抗体检测' },
        { name: 'GFP-tag', description: '绿色荧光蛋白，可视化检测' }
      ]
    },
    annotations: [
      '基因克隆是分子生物学的基础技术',
      '正确的载体选择对克隆成功至关重要',
      '融合标签可简化蛋白纯化和检测',
      '密码子优化可提高异源表达效率'
    ]
  },

  '载体系统': {
    type: 'diagram',
    title: '基因载体系统可视化',
    description: '展示不同类型的基因载体及其特点：质粒、噬菌体、病毒载体、人工染色体等。',
    elements: ['质粒', '噬菌体', '病毒载体', '人工染色体', '复制原点', '抗性基因', '多克隆位点', '启动子'],
    layout: 'hierarchical',
    interactions: ['hover', 'click'],
    colors: {
      plasmid: '#4CAF50',
      phage: '#FF9800',
      viral: '#F44336',
      artificialChromosome: '#9C27B0',
      ori: '#2196F3',
      resistance: '#7B1FA2',
      mcs: '#00BCD4',
      promoter: '#FF5722',
    },
    data: {
      vectorTypes: [
        {
          name: '质粒载体',
          host: '原核生物（主要是大肠杆菌）',
          size: '2-15 kb',
          features: ['复制原点（ori）', '抗生素抗性基因', '多克隆位点（MCS）', '筛选标记（如lacZ）'],
          copyNumber: '高拷贝（100-500）或低拷贝（5-20）',
          applications: '基因克隆、质粒制备、基因表达',
          examples: 'pUC系列、pBR322、pET系列'
        },
        {
          name: '噬菌体载体',
          host: '原核生物',
          size: 'λ噬菌体：40-50 kb，M13：7 kb',
          features: ['高效转导', '高容量', '筛选系统'],
          copyNumber: '溶原状态：单拷贝，裂解状态：多拷贝',
          applications: '文库构建、基因克隆、噬菌体展示',
          examples: 'λgt11、M13mp系列'
        },
        {
          name: '病毒载体',
          host: '真核细胞',
          types: [
            { name: '逆转录病毒', features: '整合到宿主基因组，稳定表达', size: '8-10 kb' },
            { name: '慢病毒', features: '感染分裂和非分裂细胞，整合表达', size: '8-10 kb' },
            { name: '腺病毒', features: '不整合，瞬时高表达，高容量', size: '8-35 kb' },
            { name: '腺相关病毒（AAV）', features: '低免疫原性，长效表达，基因治疗常用', size: '4.7 kb' },
            { name: '杆状病毒', features: '昆虫细胞表达，高产量', size: '38 kb' }
          ],
          applications: '基因治疗、疫苗开发、真核表达'
        },
        {
          name: '人工染色体',
          host: '真核细胞',
          types: [
            { name: '酵母人工染色体（YAC）', size: '100-2000 kb', host: '酵母' },
            { name: '细菌人工染色体（BAC）', size: '100-300 kb', host: '大肠杆菌' },
            { name: '哺乳动物人工染色体（MAC）', size: 'Mb级别', host: '哺乳动物细胞' }
          ],
          features: ['大容量', '稳定维持', '包含中心粒序列'],
          applications: '基因组文库、大基因克隆、转基因动物'
        }
      ],
      essentialComponents: [
        {
          name: '复制原点（Ori）',
          function: '决定载体的复制能力和拷贝数',
          examples: ['ColE1（高拷贝）', 'p15A（低拷贝）', 'SV40 ori（真核）']
        },
        {
          name: '筛选标记',
          function: '筛选含有载体的细胞',
          examples: ['氨苄青霉素抗性（AmpR）', '卡那霉素抗性（KanR）', 'lacZ（蓝白斑筛选）']
        },
        {
          name: '多克隆位点（MCS）',
          function: '含有多个限制酶切位点，便于插入外源基因',
          features: '通常10-20个不同的酶切位点'
        },
        {
          name: '启动子',
          function: '驱动外源基因转录',
          examples: ['T7启动子（原核表达）', 'CMV启动子（真核强表达）', 'lac启动子（可诱导）']
        },
        {
          name: '融合标签',
          function: '蛋白纯化和检测',
          examples: ['His-tag', 'GST-tag', 'Flag-tag', 'GFP']
        }
      ],
      selectionMethods: [
        {
          name: '抗生素抗性筛选',
          principle: '只有含载体的细胞能在抗生素培养基上生长',
          antibiotics: ['氨苄青霉素', '卡那霉素', '氯霉素']
        },
        {
          name: '蓝白斑筛选',
          principle: 'α-互补：插入片段破坏lacZ基因，形成白色菌落',
          substrate: 'X-gal'
        },
        {
          name: '营养缺陷型筛选',
          principle: '互补宿主细胞的营养缺陷',
          example: 'leu2、ura3等'
        }
      ]
    },
    annotations: [
      '载体选择取决于宿主类型和实验目的',
      '质粒是分子生物学中最常用的载体',
      '病毒载体是基因治疗的主要工具',
      '人工染色体可携带大片段DNA'
    ]
  }
};
