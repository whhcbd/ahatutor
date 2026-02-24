import type { VisualizationSuggestion } from '@shared/types/agent.types';

export const MOLECULAR_GENETICS: Record<string, Omit<VisualizationSuggestion, 'insights'>> = {
  '减数分裂': {
    type: 'diagram',
    title: '减数分裂过程可视化',
    description: '展示减数分裂的全过程：DNA复制一次，细胞连续分裂两次，产生四个单倍体配子。',
    elements: ['间期', '减数第一次分裂', '减数第二次分裂', '配子'],
    layout: 'hierarchical',
    interactions: ['click', 'hover'],
    colors: {
      chromosome: '#9C27B0',
      centromere: '#F44336',
      spindle: '#2196F3',
    },
    animationConfig: {
      duration: 8000,
      easing: 'easeInOut',
      autoplay: false,
      steps: [
        { phase: '间期', description: 'DNA复制，每条染色体形成两条姐妹染色单体', duration: 2000 },
        { phase: '前期I', description: '同源染色体联会，发生互换', duration: 1500 },
        { phase: '中期I', description: '同源染色体排列在赤道板两侧', duration: 1000 },
        { phase: '后期I', description: '同源染色体分离，移向两极', duration: 1500 },
        { phase: '末期I', description: '形成两个子细胞，染色体数减半', duration: 1000 },
        { phase: '减数第二次分裂', description: '姐妹染色单体分离，形成四个单倍体细胞', duration: 1000 }
      ]
    },
    annotations: [
      '减数分裂产生配子（精子/卵细胞），染色体数目减半',
      '同源染色体分离和姐妹染色单体分离确保遗传多样性',
      '减数分裂是孟德尔定律的细胞学基础'
    ]
  },

  'DNA复制': {
    type: 'diagram',
    title: 'DNA半保留复制可视化',
    description: '展示DNA双螺旋结构的半保留复制过程：DNA双链解开，每条链作为模板合成新链，形成两个与亲代DNA相同的子代DNA。',
    elements: ['DNA双螺旋', '解旋酶', 'DNA聚合酶', '半保留复制'],
    layout: 'hierarchical',
    interactions: ['click', 'hover'],
    colors: {
      templateStrand: '#4CAF50',
      newStrand: '#2196F3',
      helicase: '#FF9800',
      polymerase: '#9C27B0',
    },
    animationConfig: {
      duration: 6000,
      easing: 'easeInOut',
      autoplay: false,
      steps: [
        { phase: '解旋', description: '解旋酶解开DNA双链，形成复制叉', duration: 1500 },
        { phase: '引物合成', description: '引物酶合成RNA引物', duration: 1000 },
        { phase: '链延伸', description: 'DNA聚合酶沿5\'→3\'方向合成新链', duration: 2500 },
        { phase: '连接与修复', description: 'DNA连接酶连接冈崎片段，修复系统校正错误', duration: 1000 }
      ]
    },
    annotations: [
      'DNA复制是半保留的：每个子代DNA包含一条亲代链和一条新合成的链',
      'DNA聚合酶只能沿5\'→3\'方向合成DNA',
      '前导链连续合成，后随链不连续合成（冈崎片段）'
    ]
  },

  '转录与翻译': {
    type: 'diagram',
    title: '中心法则：转录与翻译可视化',
    description: '展示遗传信息从DNA流向RNA再流向蛋白质的过程：DNA转录成mRNA，mRNA翻译成蛋白质。',
    elements: ['DNA', 'mRNA', 'tRNA', '核糖体', '蛋白质'],
    layout: 'hierarchical',
    interactions: ['click', 'hover'],
    colors: {
      dna: '#4CAF50',
      mrna: '#2196F3',
      trna: '#FF9800',
      ribosome: '#9C27B0',
      protein: '#F44336',
    },
    animationConfig: {
      duration: 7000,
      easing: 'easeInOut',
      autoplay: false,
      steps: [
        { phase: '转录', description: '在细胞核内，DNA的一条链作为模板合成mRNA', duration: 2500 },
        { phase: '加工', description: 'mRNA经剪接、加帽、加尾后成熟', duration: 1000 },
        { phase: '翻译', description: '在细胞质中，mRNA与核糖体结合，tRNA携带氨基酸合成多肽链', duration: 2500 },
        { phase: '折叠', description: '多肽链折叠成有功能的蛋白质', duration: 1000 }
      ]
    },
    annotations: [
      '转录：以DNA为模板合成RNA的过程，发生在细胞核内',
      '翻译：以mRNA为模板合成蛋白质的过程，发生在细胞质中',
      '密码子：mRNA上三个相邻的碱基决定一个氨基酸'
    ]
  },

  '基因突变': {
    type: 'probability_distribution',
    title: '基因突变类型与频率可视化',
    description: '展示不同类型的基因突变（点突变、插入、缺失等）及其对蛋白质功能的影响。',
    elements: ['点突变', '插入', '缺失', '错义突变', '无义突变', '同义突变'],
    layout: 'circular',
    interactions: ['hover', 'click'],
    colors: {
      pointMutation: '#FF9800',
      insertion: '#2196F3',
      deletion: '#F44336',
      silent: '#4CAF50',
      missense: '#FFB74D',
      nonsense: '#D32F2F',
    },
    data: {
      categories: ['同义突变（无影响）', '错义突变（部分影响）', '无义突变（严重影响）', '移码突变（严重影响）'],
      values: [0.25, 0.45, 0.20, 0.10],
      colors: ['#4CAF50', '#FFB74D', '#D32F2F', '#F44336'],
      total: '突变效应分布（示例）',
      formula: '突变类型分布取决于突变位置和性质'
    },
    annotations: [
      '点突变：单个碱基的改变，包括转换和颠换',
      '插入/缺失：导致移码突变，严重影响蛋白质结构',
      '同义突变：密码子改变但编码的氨基酸不变',
      '错义突变：编码的氨基酸发生改变',
      '无义突变：编码氨基酸的密码子变成终止密码子'
    ]
  },

  '转录': {
    type: 'diagram',
    title: '转录过程可视化',
    description: '展示以DNA为模板合成RNA的过程：RNA聚合酶识别启动子，解开DNA双链，以一条链为模板合成互补的mRNA。',
    elements: ['DNA模板', 'RNA聚合酶', '启动子', '终止子', 'mRNA', '转录泡'],
    layout: 'hierarchical',
    interactions: ['click', 'hover'],
    colors: {
      templateStrand: '#4CAF50',
      codingStrand: '#81C784',
      mrna: '#2196F3',
      polymerase: '#9C27B0',
      promoter: '#FF9800',
    },
    animationConfig: {
      duration: 6000,
      easing: 'easeInOut',
      autoplay: false,
      steps: [
        { phase: '起始', description: 'RNA聚合酶识别并结合启动子，DNA局部解旋', duration: 1500 },
        { phase: '延伸', description: 'RNA聚合酶沿模板链移动，合成mRNA（5\'→3\'方向）', duration: 3000 },
        { phase: '终止', description: '到达终止子，转录停止，mRNA释放', duration: 1500 }
      ]
    },
    data: {
      direction: 'RNA聚合酶沿DNA模板链3\'→5\'移动，合成mRNA为5\'→3\'方向',
      template: '模板链（反义链）被转录',
      codingStrand: '编码链（有义链）与mRNA序列相同（T→U）',
      product: '前体mRNA需要加工（5\'加帽、3\'加尾、剪接）'
    },
    annotations: [
      '转录发生在细胞核内（原核生物在细胞质）',
      'RNA聚合酶不需要引物即可起始RNA合成',
      '启动子位于基因上游，决定转录起始位点',
      '原核生物为多顺反子，真核生物为单顺反子'
    ]
  },

  '翻译': {
    type: 'diagram',
    title: '翻译过程可视化',
    description: '展示以mRNA为模板合成蛋白质的过程：核糖体识别起始密码子，tRNA携带氨基酸按照密码子顺序合成多肽链。',
    elements: ['mRNA', '核糖体', 'tRNA', '氨基酸', '密码子', '反密码子', '多肽链'],
    layout: 'hierarchical',
    interactions: ['click', 'hover'],
    colors: {
      mrna: '#2196F3',
      trna: '#FF9800',
      ribosome: '#9C27B0',
      aminoAcid: '#4CAF50',
      peptideChain: '#F44336',
    },
    animationConfig: {
      duration: 7000,
      easing: 'easeInOut',
      autoplay: false,
      steps: [
        { phase: '起始', description: '核糖体小亚基结合mRNA，起始tRNA结合起始密码子AUG', duration: 1500 },
        { phase: '延伸', description: '氨酰tRNA进入A位点，肽键形成，核糖体移位', duration: 4000 },
        { phase: '终止', description: '到达终止密码子，释放因子结合，多肽链释放', duration: 1500 }
      ]
    },
    data: {
      sites: {
        A: 'A位点：氨酰tRNA进入位点',
        P: 'P位点：肽酰tRNA位点，肽链延伸位点',
        E: 'E位点：空载tRNA退出位点'
      },
      direction: '核糖体沿mRNA 5\'→3\'移动',
      startCodon: 'AUG（编码甲硫氨酸）',
      stopCodons: 'UAA、UAG、UGA（不编码氨基酸）'
    },
    annotations: [
      '翻译发生在细胞质中的核糖体上',
      '每三个碱基组成一个密码子，编码一个氨基酸',
      '遗传密码具有简并性、通用性和无标点性',
      '多聚核糖体可同时翻译一条mRNA，提高效率'
    ]
  },

  'DNA双螺旋结构': {
    type: 'diagram',
    title: 'DNA双螺旋结构可视化',
    description: '展示DNA分子的双螺旋结构：由两条互补的核苷酸链反向平行缠绕成螺旋状，每圈螺旋包含约10个碱基对。',
    elements: ['磷酸基团', '脱氧核糖', '含氮碱基', '碱基对', '氢键', '磷酸二酯键', '双螺旋'],
    layout: 'hierarchical',
    interactions: ['click', 'hover', 'zoom'],
    colors: {
      phosphate: '#E91E63',
      sugar: '#2196F3',
      adenine: '#4CAF50',
      thymine: '#FFC107',
      guanine: '#FF5722',
      cytosine: '#9C27B0',
      backbone: '#1565C0'
    },
    data: {
      structure: {
        backbone: '磷酸基团和脱氧核糖交替排列，形成骨架',
        bases: 'A-T、G-C配对，通过氢键连接',
        antiparallel: '两条链方向相反（5\'→3\'和3\'→5\'）',
        helical: '右手螺旋，每圈10.5个碱基对'
      },
      basePairs: [
        { pair: 'A-T', hydrogenBonds: 2, strength: '中等' },
        { pair: 'G-C', hydrogenBonds: 3, strength: '强' }
      ],
      components: [
        { name: '磷酸基团', role: '形成DNA骨架，带负电荷' },
        { name: '脱氧核糖', role: '五碳糖，连接磷酸基团和碱基' },
        { name: '含氮碱基', role: '携带遗传信息（A、T、G、C）' },
        { name: '氢键', role: '维持碱基配对，可解离' }
      ]
    },
    animationConfig: {
      duration: 8000,
      easing: 'easeInOut',
      autoplay: false,
      steps: [
        { phase: '结构展示', description: '展示DNA双螺旋的三维结构', duration: 2000 },
        { phase: '碱基配对', description: '高亮显示A-T和G-C碱基对及氢键', duration: 2000 },
        { phase: '骨架组成', description: '展示磷酸-脱氧核糖骨架', duration: 2000 },
        { phase: '旋转演示', description: '旋转DNA分子展示双螺旋特征', duration: 2000 }
      ]
    },
    annotations: [
      'DNA双螺旋结构是遗传物质储存的分子基础',
      '两条链通过碱基配对互补，保证遗传信息准确传递',
      '双螺旋结构使DNA能够紧凑地储存大量遗传信息',
      '碱基的排列顺序包含遗传密码信息',
      '磷酸二酯键连接核苷酸，形成稳定的骨架结构'
    ]
  },

  '核糖体': {
    type: 'diagram',
    title: '核糖体结构与功能可视化',
    description: '展示核糖体的结构：由大亚基和小亚基组成，包含rRNA和蛋白质，是蛋白质合成的场所。',
    elements: ['大亚基', '小亚基', 'rRNA', 'A位点', 'P位点', 'E位点', 'mRNA通道'],
    layout: 'hierarchical',
    interactions: ['hover', 'click'],
    colors: {
      largeSubunit: '#9C27B0',
      smallSubunit: '#BA68C8',
      rrna: '#7B1FA2',
      protein: '#4CAF50',
      mrna: '#2196F3',
      trna: '#FF9800',
    },
    data: {
      structure: {
        prokaryotic: '70S（50S大亚基 + 30S小亚基）',
        eukaryotic: '80S（60S大亚基 + 40S小亚基）',
        composition: 'rRNA（约60%） + 蛋白质（约40%）'
      },
      sites: [
        { name: 'A位点', description: '氨酰tRNA进入位点', function: '接受新进入的氨酰tRNA' },
        { name: 'P位点', description: '肽酰tRNA位点', function: '肽链合成和延伸位点' },
        { name: 'E位点', description: '退出位点', function: '空载tRNA离开核糖体' }
      ],
      functions: [
        '解码mRNA的遗传信息',
        '催化肽键形成（肽酰转移酶活性）',
        '协调tRNA进出和mRNA移动'
      ]
    },
    annotations: [
      '核糖体是细胞中蛋白质合成的分子机器',
      '肽酰转移酶活性由rRNA催化，是核酶的典型例子',
      '抗生素可通过抑制细菌核糖体发挥杀菌作用',
      '多个核糖体可同时结合一条mRNA形成多聚核糖体'
    ]
  },

  '乳糖操纵子': {
    type: 'diagram',
    title: '乳糖操纵子调控机制可视化',
    description: '展示原核生物基因调控的经典模型：乳糖操纵子如何通过阻遏蛋白和cAMP-CAP复合物进行正负调控。',
    elements: ['启动子', '操纵基因', '结构基因', '调节基因', '阻遏蛋白', '诱导物'],
    layout: 'hierarchical',
    interactions: ['hover', 'click'],
    colors: {
      promoter: '#2196F3',
      operator: '#FF9800',
      lacz: '#4CAF50',
      lacy: '#8BC34A',
      laca: '#CDDC39',
      repressor: '#F44336',
      inducer: '#FFC107',
      cap: '#9C27B0',
    },
    data: {
      components: [
        { name: '调节基因(lacI)', product: '阻遏蛋白', function: '编码阻遏蛋白' },
        { name: '启动子(lacP)', product: 'RNA聚合酶结合位点', function: '转录起始' },
        { name: '操纵基因(lacO)', product: '阻遏蛋白结合位点', function: '转录控制' },
        { name: '结构基因(lacZYA)', product: 'β-半乳糖苷酶、透酶、转乙酰酶', function: '乳糖代谢' }
      ],
      states: {
        withoutLactose: {
          condition: '无乳糖',
          repressor: '结合操纵基因',
          transcription: '关闭',
          description: '阻遏蛋白结合操纵基因，阻止RNA聚合酶通过'
        },
        withLactose: {
          condition: '有乳糖',
          repressor: '与乳糖结合脱离',
          transcription: '开启',
          description: '乳糖作为诱导物结合阻遏蛋白，使其脱离操纵基因'
        }
      }
    },
    annotations: [
      '乳糖操纵子是基因调控的经典模型，由Jacob和Monod发现',
      '负调控：阻遏蛋白在无乳糖时抑制转录',
      '正调控：cAMP-CAP复合物在葡萄糖缺乏时激活转录',
      '乳糖存在且葡萄糖缺乏时，操纵子表达水平最高'
    ]
  },

  'DNA修复': {
    type: 'diagram',
    title: 'DNA修复机制可视化',
    description: '展示细胞如何修复DNA损伤：包括直接修复、切除修复（碱基切除修复和核苷酸切除修复）、错配修复和重组修复。',
    elements: ['DNA损伤', '修复酶', '切除修复', '错配修复', '重组修复', 'SOS修复'],
    layout: 'hierarchical',
    interactions: ['hover', 'click'],
    colors: {
      damagedDNA: '#F44336',
      repairedDNA: '#4CAF50',
      enzyme: '#2196F3',
      repairPathway: '#FF9800',
    },
    data: {
      pathways: [
        {
          name: '直接修复',
          description: '直接修复损伤的碱基',
          enzymes: ['光复活酶（修复嘧啶二聚体）', 'O6-甲基鸟嘌呤甲基转移酶'],
          examples: '紫外线损伤的修复'
        },
        {
          name: '碱基切除修复（BER）',
          description: '切除受损碱基，替换正确的',
          enzymes: ['DNA糖苷酶', 'AP内切酶', 'DNA聚合酶', 'DNA连接酶'],
          examples: '氧化损伤、脱氨基损伤'
        },
        {
          name: '核苷酸切除修复（NER）',
          description: '切除含有损伤的核苷酸片段',
          enzymes: ['损伤识别蛋白', '切除酶', 'DNA聚合酶', 'DNA连接酶'],
          examples: '嘧啶二聚体、 bulky adducts'
        },
        {
          name: '错配修复（MMR）',
          description: '修复DNA复制过程中的错配',
          enzymes: ['MutS', 'MutL', 'MutH', 'DNA聚合酶', 'DNA连接酶'],
          examples: '复制错误（G-T配对等）'
        },
        {
          name: '重组修复',
          description: '利用同源染色体进行修复',
          enzymes: ['RecA', 'RecBCD', 'DNA聚合酶', 'DNA连接酶'],
          examples: '双链断裂修复'
        },
        {
          name: 'SOS修复',
          description: '应急修复，允许错误跨过损伤位点',
          enzymes: ['RecA', 'LexA', '易错DNA聚合酶'],
          examples: '严重损伤时的应急反应'
        }
      ]
    },
    annotations: [
      'DNA修复是维持基因组稳定性的重要机制',
      'DNA聚合酶具有校对功能（3\'→5\'外切酶活性）',
      '修复缺陷可导致突变累积和癌症发生',
      '着色性干皮病（XP）患者由于NER缺陷，对紫外线敏感'
    ]
  },

  '复制叉': {
    type: 'diagram',
    title: 'DNA复制叉结构可视化',
    description: '展示DNA复制叉的结构和复制过程：双链DNA解开形成Y形结构，两条新链在复制叉处同时合成。',
    elements: ['复制叉', '前导链', '后随链', '冈崎片段', '解旋酶', 'DNA聚合酶', '单链结合蛋白'],
    layout: 'hierarchical',
    interactions: ['hover', 'click'],
    colors: {
      templateStrand1: '#4CAF50',
      templateStrand2: '#81C784',
      newStrand1: '#2196F3',
      newStrand2: '#64B5F6',
      fork: '#FF9800',
      helicase: '#9C27B0',
      ssb: '#F44336',
    },
    data: {
      structure: {
        forkShape: 'Y形结构，双链DNA在此处解开',
        leadingStrand: '连续合成，与复制叉移动方向相同（5\'→3\'）',
        laggingStrand: '不连续合成，与复制叉移动方向相反，形成冈崎片段'
      },
      enzymes: [
        { name: '解旋酶', function: '解开DNA双链，形成复制叉' },
        { name: '单链结合蛋白(SSB)', function: '稳定解开的单链DNA，防止重新退火' },
        { name: 'DNA聚合酶III', function: '合成新DNA链（原核）' },
        { name: '引物酶', function: '合成RNA引物，为DNA聚合酶提供3\'-OH' },
        { name: 'DNA连接酶', function: '连接冈崎片段' }
      ],
      synthesis: {
        leading: {
          direction: '连续合成',
          polymerase: 'DNA聚合酶III',
          primer: '只需一个引物'
        },
        lagging: {
          direction: '不连续合成',
          polymerase: 'DNA聚合酶III',
          primer: '需要多个引物',
          fragments: '冈崎片段（1000-2000bp，原核）'
        }
      }
    },
    annotations: [
      '复制叉是DNA复制的工作中心',
      '真核生物有多个复制起点，形成多个复制叉',
      '复制叉双向移动，提高复制效率',
      '后随链的不连续合成是半保留复制的重要特征'
    ]
  },

  '前导链': {
    type: 'diagram',
    title: '前导链合成可视化',
    description: '展示前导链的连续合成过程：前导链与复制叉移动方向相同，DNA聚合酶可以连续合成。',
    elements: ['前导链', '连续合成', '5\'→3\'方向', 'DNA聚合酶', '复制叉'],
    layout: 'hierarchical',
    interactions: ['hover', 'click'],
    colors: {
      leadingStrand: '#4CAF50',
      templateStrand: '#81C784',
      polymerase: '#2196F3',
      fork: '#FF9800',
    },
    data: {
      synthesis: {
        direction: '与复制叉移动方向相同',
        synthesisMode: '连续合成',
        strandPolarity: '3\'→5\'模板 → 5\'→3\'新链',
        primer: '只需要一个RNA引物'
      },
      process: [
        { step: 1, description: '解旋酶解开DNA双链，形成复制叉' },
        { step: 2, description: '引物酶在前导链模板3\'端合成引物' },
        { step: 3, description: 'DNA聚合酶从引物开始连续合成新链' },
        { step: 4, description: '随复制叉移动持续延伸' },
        { step: 5, description: '到达复制终点，完成复制' }
      ],
      advantages: [
        '合成速度快，无需频繁切换',
        '只需一个引物，效率高',
        '与复制叉同步移动，协调性好'
      ]
    },
    annotations: [
      '前导链是DNA复制中的"快车道"',
      'DNA聚合酶只能沿5\'→3\'方向合成DNA',
      '前导链模板为3\'→5\'方向，允许连续合成',
      '与后随链相比，前导链合成更简单高效'
    ]
  },

  '后随链': {
    type: 'diagram',
    title: '后随链合成可视化',
    description: '展示后随链的不连续合成过程：后随链与复制叉移动方向相反，DNA聚合酶需要分段合成冈崎片段。',
    elements: ['后随链', '冈崎片段', '不连续合成', 'DNA聚合酶', '引物酶', 'DNA连接酶'],
    layout: 'hierarchical',
    interactions: ['hover', 'click'],
    colors: {
      laggingStrand: '#FF9800',
      okazakiFragment: '#FFB74D',
      templateStrand: '#81C784',
      polymerase: '#2196F3',
      primase: '#9C27B0',
      ligase: '#4CAF50',
    },
    data: {
      synthesis: {
        direction: '与复制叉移动方向相反',
        synthesisMode: '不连续合成',
        strandPolarity: '5\'→3\'模板 → 3\'→5\'新链（需反转）',
        fragments: '冈崎片段',
        fragmentSize: '原核1000-2000bp，真核100-200bp'
      },
      process: [
        { step: 1, description: '复制叉移动，暴露后随链模板' },
        { step: 2, description: '引物酶合成RNA引物' },
        { step: 3, description: 'DNA聚合酶从引物开始合成冈崎片段' },
        { step: 4, description: '下一个引物合成，DNA聚合酶切换' },
        { step: 5, description: '重复步骤2-4，合成多个冈崎片段' },
        { step: 6, description: 'RNA引物被去除，DNA连接酶连接片段' }
      ],
      okazakiFragments: {
        discoverer: '冈崎令治（Reiji Okazaki）及其团队',
        year: 1968,
        composition: '短DNA片段（含RNA引物）',
        fate: 'RNA引物被切除，DNA片段被连接酶连接'
      }
    },
    annotations: [
      '后随链合成较复杂，需要频繁切换',
      '冈崎片段以日本科学家冈崎令治命名',
      '真核生物冈崎片段比原核生物短',
      '后随链不连续合成是半保留复制的必然结果'
    ]
  },

  'DNA聚合酶': {
    type: 'diagram',
    title: 'DNA聚合酶结构与功能可视化',
    description: '展示DNA聚合酶的核心功能：催化dNTP聚合形成DNA链，具有5\'→3\'聚合酶活性和3\'→5\'外切酶活性（校对功能）。',
    elements: ['DNA聚合酶', '聚合酶活性', '外切酶活性', '校对功能', 'dNTP', '磷酸二酯键'],
    layout: 'hierarchical',
    interactions: ['hover', 'click'],
    colors: {
      polymerase: '#9C27B0',
      templateStrand: '#4CAF50',
      newStrand: '#2196F3',
      dntp: '#FF9800',
      phosphodiester: '#F44336',
    },
    data: {
      activities: [
        {
          name: '5\'→3\'聚合酶活性',
          function: '催化dNTP聚合，形成磷酸二酯键',
          direction: '只能沿5\'→3\'方向合成DNA',
          requirement: '需要3\'-OH作为引物'
        },
        {
          name: '3\'→5\'外切酶活性',
          function: '切除错配碱基，校对复制错误',
          direction: '反向移动，切除错误碱基',
          importance: '提高复制准确性（错误率从10^-4降至10^-7）'
        }
      ],
      types: [
        {
          name: 'DNA聚合酶I（原核）',
          functions: ['填补缺口', '切除RNA引物', '具有5\'→3\'外切酶活性'],
          size: '大分子酶'
        },
        {
          name: 'DNA聚合酶III（原核）',
          functions: ['主要复制酶', '高持续合成能力', '具有校对功能'],
          size: '多亚基复合体'
        },
        {
          name: 'DNA聚合酶δ（真核）',
          functions: ['后随链合成', '校对功能'],
          feature: '高保真度'
        },
        {
          name: 'DNA聚合酶ε（真核）',
          functions: ['前导链合成', '校对功能'],
          feature: '高持续合成能力'
        }
      ],
      fidelity: {
        mechanisms: ['碱基配对选择', '3\'→5\'校对', '错配修复系统'],
        errorRate: '约10^-9（每10亿个碱基复制1个错误）'
      }
    },
    annotations: [
      'DNA聚合酶需要引物才能起始合成',
      'Taq聚合酶耐高温，用于PCR技术',
      '缺乏3\'→5\'外切酶活性的聚合酶错误率高',
      'DNA聚合酶是基因工程和分子生物学研究的重要工具'
    ]
  },

  '启动子': {
    type: 'diagram',
    title: '启动子结构可视化',
    description: '展示启动子的核心序列和功能：启动子是RNA聚合酶识别和结合的DNA序列，决定转录起始位点。',
    elements: ['启动子', 'TATA框', 'CAAT框', 'GC框', '转录起始位点', 'RNA聚合酶', '转录因子'],
    layout: 'hierarchical',
    interactions: ['hover', 'click'],
    colors: {
      promoter: '#9C27B0',
      tataBox: '#F44336',
      caatBox: '#FF9800',
      gcBox: '#4CAF50',
      transcriptionStart: '#2196F3',
      rnaPolymerase: '#7B1FA2',
    },
    data: {
      coreElements: [
        {
          name: 'TATA框',
          sequence: 'TATAAA（或类似序列）',
          position: '转录起始位点上游约-25bp',
          function: '确定转录起始位置，结合TBP蛋白'
        },
        {
          name: 'CAAT框',
          sequence: 'GGCCAATCT',
          position: '转录起始位点上游约-75bp',
          function: '增强转录活性'
        },
        {
          name: 'GC框',
          sequence: 'GGGCGG',
          position: '转录起始位点上游约-90bp',
          function: '结合SP1转录因子，增强转录'
        },
        {
          name: '转录起始位点',
          symbol: '+1',
          function: '转录开始的位置，通常为A或G'
        }
      ],
      types: [
        {
          name: '组成型启动子',
          description: '持续转录，不受调控',
          example: '持家基因启动子'
        },
        {
          name: '诱导型启动子',
          description: '受特定信号诱导激活',
          example: '热休克蛋白启动子'
        },
        {
          name: '组织特异性启动子',
          description: '在特定组织中激活',
          example: '血红蛋白基因启动子'
        }
      ],
      binding: [
        { step: 1, description: '通用转录因子结合启动子核心序列' },
        { step: 2, description: 'TBP结合TATA框，组装预起始复合物' },
        { step: 3, description: 'RNA聚合酶II加入复合物' },
        { step: 4, description: '转录起始，RNA聚合酶开始合成mRNA' }
      ]
    },
    annotations: [
      '启动子位于基因上游，决定转录起始位点',
      'TATA框是真核启动子的核心元件',
      '原核生物启动子有-10区和-35区',
      '启动子突变可导致基因表达异常'
    ]
  },

  '剪接': {
    type: 'diagram',
    title: 'mRNA剪接过程可视化',
    description: '展示真核生物mRNA剪接过程：切除内含子，连接外显子，形成成熟mRNA的过程。',
    elements: ['内含子', '外显子', '剪接体', '5\'剪接位点', '3\'剪接位点', '分支点', '套索结构'],
    layout: 'hierarchical',
    interactions: ['hover', 'click'],
    colors: {
      intron: '#FF9800',
      exon: '#4CAF50',
      spliceosome: '#9C27B0',
      lariat: '#F44336',
      matureMrna: '#2196F3',
    },
    data: {
      process: [
        {
          step: 1,
          name: '识别',
          description: '剪接体识别5\'剪接位点（GU）、分支点、3\'剪接位点（AG）',
          consensus: '5\'GU...A...3\'AG'
        },
        {
          step: 2,
          name: '第一次转酯反应',
          description: '分支点腺嘌呤2\'-OH攻击5\'剪接位点，形成套索结构'
        },
        {
          step: 3,
          name: '第二次转酯反应',
          description: '外显子3\'-OH攻击3\'剪接位点，外显子连接'
        },
        {
          step: 4,
          name: '释放',
          description: '内含子套索被释放并降解，外显子连接成成熟mRNA'
        }
      ],
      consensusSequences: {
        '5\'剪接位点': 'GU（几乎100%保守）',
        '分支点': 'CURAY（R=嘌呤）',
        '3\'剪接位点': 'AG（几乎100%保守）'
      },
      spliceosome: {
        composition: 'snRNP（小核核糖核蛋白）复合物',
        components: ['U1 snRNP', 'U2 snRNP', 'U4/U6 snRNP', 'U5 snRNP'],
        function: '催化剪接反应'
      },
      types: [
        {
          name: '组成型剪接',
          description: '所有组织中以相同方式剪接',
          majority: '95%以上'
        },
        {
          name: '可变剪接',
          description: '不同组织或发育阶段产生不同mRNA变体',
          significance: '极大增加了蛋白质多样性（约20,000个基因可产生>100,000种蛋白质）'
        }
      ]
    },
    annotations: [
      '剪接是真核mRNA加工的关键步骤',
      '内含子平均长度为3kb，外显子约150bp',
      '剪接错误可导致遗传病（如β地中海贫血）',
      '可变剪接是基因表达调控的重要机制'
    ]
  },

  '密码子': {
    type: 'probability_distribution',
    title: '遗传密码子可视化',
    description: '展示64个密码子及其编码的20种氨基酸：3个碱基组成1个密码子，编码1个氨基酸或终止信号。',
    elements: ['密码子', '反密码子', '氨基酸', '起始密码子', '终止密码子', '简并性'],
    layout: 'grid',
    interactions: ['hover', 'click'],
    colors: {
      start: '#4CAF50',
      stop: '#F44336',
      hydrophobic: '#FF9800',
      hydrophilic: '#2196F3',
      polar: '#9C27B0',
      charged: '#FFB74D',
    },
    data: {
      properties: {
        total: 64,
        aminoAcids: 20,
        startCodons: ['AUG（甲硫氨酸/起始）'],
        stopCodons: ['UAA', 'UAG', 'UGA'],
        degeneracy: '多数氨基酸由多个密码子编码（简并性）'
      },
      codeTable: {
        'AUG': '甲硫氨酸（起始）',
        'UUU/UUC': '苯丙氨酸',
        'UUA/UUG/CUU/CUC/CUA/CUG': '亮氨酸',
        'AUU/AUC/AUA': '异亮氨酸',
        'GUU/GUC/GUA/GUG': '缬氨酸',
        'UCU/UCC/UCA/UCG/AGU/AGC': '丝氨酸',
        'CCU/CCC/CCA/CCG': '脯氨酸',
        'ACU/ACC/ACA/ACG': '苏氨酸',
        'GCU/GCC/GCA/GCG': '丙氨酸',
        'UAU/UAC': '酪氨酸',
        'CAU/CAC': '组氨酸',
        'CAA/CAG': '谷氨酰胺',
        'AAU/AAC': '天冬酰胺',
        'AAA/AAG': '赖氨酸',
        'GAU/GAC': '天冬氨酸',
        'GAA/GAG': '谷氨酸',
        'UGU/UGC': '半胱氨酸',
        'UGG': '色氨酸',
        'CGU/CGC/CGA/CGG/AGA/AGG': '精氨酸',
        'GGU/GGC/GGA/GGG': '甘氨酸'
      },
      features: [
        { name: '通用性', description: '几乎所有生物使用相同的遗传密码' },
        { name: '简并性', description: '多个密码子可编码同一氨基酸' },
        { name: '无标点性', description: '密码子之间无间隔，连续读取' },
        { name: '方向性', description: '从5\'→3\'方向读取' }
      ]
    },
    annotations: [
      '64个密码子中，61个编码氨基酸，3个为终止密码子',
      '简并性可以缓冲突变的影响（同义突变）',
      '起始密码子AUG同时编码甲硫氨酸',
      '线粒体中存在个别密码子差异'
    ]
  },

  '基因调控': {
    type: 'diagram',
    title: '真核生物基因调控可视化',
    description: '展示真核生物基因表达的多层次调控机制：从染色质重塑到翻译后修饰的完整调控网络。',
    elements: ['染色质重塑', '转录调控', '转录后调控', '翻译调控', '翻译后调控', '增强子', '沉默子'],
    layout: 'hierarchical',
    interactions: ['hover', 'click'],
    colors: {
      chromatin: '#9C27B0',
      transcription: '#4CAF50',
      postTranscription: '#2196F3',
      translation: '#FF9800',
      postTranslation: '#F44336',
      enhancer: '#7B1FA2',
      silencer: '#FFB74D',
    },
    data: {
      levels: [
        {
          level: '染色质水平',
          mechanisms: ['染色质重塑', 'DNA甲基化', '组蛋白修饰'],
          effect: '控制染色质开放程度，影响转录因子结合'
        },
        {
          level: '转录水平',
          mechanisms: ['转录因子', '增强子', '沉默子', '绝缘子'],
          effect: '调控转录起始速率和位置'
        },
        {
          level: '转录后水平',
          mechanisms: ['可变剪接', 'RNA编辑', 'miRNA调控', 'mRNA稳定性'],
          effect: '产生不同的mRNA变体，调控mRNA稳定性'
        },
        {
          level: '翻译水平',
          mechanisms: ['翻译起始因子', 'eIF/eRF', '核糖体调控'],
          effect: '调控蛋白质合成速率'
        },
        {
          level: '翻译后水平',
          mechanisms: ['蛋白磷酸化', '泛素化', '糖基化', '蛋白水解'],
          effect: '调控蛋白质活性、稳定性和定位'
        }
      ],
      cisRegulatory: [
        { name: '启动子', description: '转录起始位点附近，RNA聚合酶结合区域' },
        { name: '增强子', description: '可远距离激活转录，组织特异性表达' },
        { name: '沉默子', description: '抑制转录，负调控元件' },
        { name: '绝缘子', description: '阻断增强子对远端基因的影响' }
      ],
      transRegulatory: [
        { name: '转录因子', description: 'DNA结合蛋白，激活或抑制转录' },
        { name: '共激活因子', description: '与转录因子协同作用，激活转录' },
        { name: '共抑制因子', description: '与转录因子协同作用，抑制转录' }
      ]
    },
    annotations: [
      '真核生物基因调控比原核生物更复杂',
      '多层级调控实现精细的时空表达控制',
      '细胞分化是基因差异表达的结果',
      '癌症常与基因调控异常相关'
    ]
  },

  '表观遗传记忆': {
    type: 'diagram',
    title: '表观遗传记忆机制可视化',
    description: '展示表观遗传信息如何在细胞分裂中传递：DNA甲基化、组蛋白修饰等表观遗传标记的维持机制。',
    elements: ['DNA甲基化', '组蛋白修饰', '染色质状态', '细胞分裂', '表观遗传继承', '表观遗传重编程'],
    layout: 'hierarchical',
    interactions: ['hover', 'click'],
    colors: {
      methylation: '#F44336',
      histone: '#9C27B0',
      chromatinActive: '#4CAF50',
      chromatinInactive: '#FF9800',
      inheritance: '#2196F3',
      reprogramming: '#7B1FA2',
    },
    data: {
      mechanisms: [
        {
          name: 'DNA甲基化',
          description: 'CpG二核苷酸的胞嘧啶5\'位甲基化',
          pattern: 'CG二核苷酸在基因组中成簇出现（CpG岛）',
          maintenance: 'DNMT1识别半甲基化DNA，在新链上添加甲基基团'
        },
        {
          name: '组蛋白修饰',
          description: '组蛋白尾部的可逆共价修饰',
          types: ['乙酰化（激活）', '甲基化（激活或抑制）', '磷酸化（激活）', '泛素化（激活或抑制）'],
          maintenance: '修饰识别蛋白招募维持复合物'
        },
        {
          name: '染色质重塑',
          description: 'ATP依赖的染色质结构改变',
          effect: '控制染色质开放程度（常染色质/异染色质）',
          maintenance: '重塑复合物通过组蛋白修饰定位'
        }
      ],
      inheritance: {
        description: '表观遗传标记通过细胞分裂传递',
        process: [
          'DNA复制时产生半甲基化DNA',
          'DNMT1识别半甲基化位点并甲基化新链',
          '组蛋白修饰随核小体分配',
          '修饰读取蛋白识别旧标记并重建修饰'
        ],
        stability: '大部分表观遗传标记在多次分裂中保持稳定'
      },
      reprogramming: [
        {
          type: '全基因组重编程',
          context: '受精卵、原始生殖细胞',
          extent: '大部分表观遗传标记被擦除'
        },
        {
          type: '部分重编程',
          context: '体细胞重编程（iPS细胞）',
          extent: '部分标记保留，诱导多能性'
        },
        {
          type: '环境诱导重编程',
          context: '营养、压力、毒素暴露',
          extent: '特定基因座表观遗传状态改变'
        }
      ],
      examples: [
        {
          name: '基因组印记',
          description: '亲本来源特异性的表观遗传标记',
          inheritance: '印记在配子形成时建立，在发育中维持'
        },
        {
          name: 'X染色体失活',
          description: '雌性哺乳动物的一条X染色体失活',
          maintenance: 'Xist RNA介导的异染色质化在分裂中维持'
        }
      ]
    },
    annotations: [
      '表观遗传记忆允许细胞"记住"其身份',
      '表观遗传异常可导致发育缺陷和疾病',
      '环境因素可通过表观遗传影响基因表达',
      '表观遗传治疗是癌症研究的新方向'
    ]
  },

  '基因表达调控': {
    type: 'diagram',
    title: '基因表达调控机制可视化',
    description: '展示基因表达调控的具体机制：从信号转导到转录因子结合的完整调控路径。',
    elements: ['信号分子', '受体', '信号转导', '转录因子', '靶基因', 'mRNA', '蛋白质', '反馈调节'],
    layout: 'hierarchical',
    interactions: ['hover', 'click'],
    colors: {
      signal: '#FF9800',
      receptor: '#F44336',
      pathway: '#9C27B0',
      transcriptionFactor: '#2196F3',
      targetGene: '#4CAF50',
      mrna: '#00BCD4',
      protein: '#7B1FA2',
      feedback: '#FF5722',
    },
    data: {
      signalTransduction: [
        {
          type: '激素调控',
          example: '类固醇激素受体',
          pathway: '激素穿过膜→结合胞内受体→受体-DNA复合物→调控转录',
          responseTime: '慢（小时）'
        },
        {
          type: '生长因子调控',
          example: 'EGF、TGF-β',
          pathway: '结合膜受体→磷酸化级联→转录因子激活→基因表达',
          responseTime: '中（分钟-小时）'
        },
        {
          type: '细胞因子调控',
          example: '干扰素、白细胞介素',
          pathway: 'JAK-STAT通路→转录因子二聚化→核转位→基因激活',
          responseTime: '快（分钟）'
        }
      ],
      regulationTypes: [
        {
          name: '正调控',
          description: '激活基因表达',
          mechanism: '转录因子结合增强子→招募共激活因子→染色质开放→转录激活',
          example: '热休克蛋白基因（HSF）'
        },
        {
          name: '负调控',
          description: '抑制基因表达',
          mechanism: '阻遏蛋白结合沉默子→招募共抑制因子→染色质紧缩→转录抑制',
          example: '乳糖操纵子（lacI阻遏蛋白）'
        },
        {
          name: '反馈调控',
          description: '产物调节自身表达',
          positive: '产物激活自身表达（自激活）',
          negative: '产物抑制自身表达（负反馈，维持稳态）'
        }
      ],
      regulatoryElements: [
        {
          name: '顺式作用元件',
          description: 'DNA上的调控序列',
          examples: [
            { name: '启动子', location: '转录起始位点附近', function: '结合RNA聚合酶和通用转录因子' },
            { name: '增强子', location: '可远距离（几十kb）', function: '增强转录活性，组织特异性' },
            { name: '沉默子', location: '基因附近或远端', function: '抑制转录活性' },
            { name: '绝缘子', location: '基因之间', function: '阻断增强子对远端基因的影响' },
            { name: '应答元件', location: '启动子附近', function: '结合特定转录因子，响应特定信号' }
          ]
        },
        {
          name: '反式作用因子',
          description: '蛋白质调控因子',
          examples: [
            { name: '通用转录因子', function: '结合启动子，组装预起始复合物' },
            { name: '特异性转录因子', function: '结合增强子或沉默子，调控特异性基因' },
            { name: '共激活因子', function: '与转录因子协同，激活转录' },
            { name: '共抑制因子', function: '与转录因子协同，抑制转录' },
            { name: '中介体复合物', function: '连接转录因子和RNA聚合酶' }
          ]
        }
      ],
      examples: [
        {
          gene: 'β-珠蛋白基因',
          regulation: '位点控制区（LCR）远程调控红细胞特异性表达',
          defect: '突变导致地中海贫血'
        },
        {
          gene: 'c-Myc原癌基因',
          regulation: '生长因子信号通过MAPK通路激活c-Myc',
          defect: '过度激活导致癌症'
        },
        {
          gene: 'p53抑癌基因',
          regulation: 'DNA损伤激活p53→细胞周期阻滞或凋亡',
          defect: '突变导致基因组不稳定性'
        }
      ]
    },
    annotations: [
      '基因表达调控是细胞响应环境变化的核心机制',
      '复杂的调控网络确保基因在正确的时间、正确的地点表达',
      '调控异常是许多疾病的分子基础',
      '理解调控机制有助于开发靶向治疗药物'
    ]
  },

  '冈崎片段': {
    type: 'diagram',
    title: '冈崎片段合成过程可视化',
    description: '展示冈崎片段在后随链上的合成过程：由于DNA聚合酶只能沿5\'→3\'方向合成，后随链必须分段合成冈崎片段，最后由DNA连接酶连接成完整的链。',
    elements: ['冈崎片段', '后随链', 'RNA引物', 'DNA聚合酶', 'DNA连接酶', '复制叉', '前导链'],
    layout: 'hierarchical',
    interactions: ['hover', 'click'],
    colors: {
      okazakiFragment: '#FF9800',
      laggingStrand: '#FFB74D',
      leadingStrand: '#4CAF50',
      templateStrand: '#81C784',
      rnaPrimer: '#9C27B0',
      polymerase: '#2196F3',
      ligase: '#F44336',
      fork: '#FF5722',
    },
    animationConfig: {
      duration: 8000,
      easing: 'easeInOut',
      autoplay: false,
      steps: [
        { phase: '复制叉移动', description: '复制叉向右移动，暴露后随链模板', duration: 1000 },
        { phase: '引物合成', description: '引物酶合成RNA引物，为DNA聚合酶提供3\'-OH', duration: 1000 },
        { phase: '片段合成', description: 'DNA聚合酶沿5\'→3\'方向合成冈崎片段', duration: 1500 },
        { phase: '重复过程', description: '随着复制叉继续移动，合成多个冈崎片段', duration: 2000 },
        { phase: '引物去除', description: 'RNA引物被DNA聚合酶I（原核）或核酸酶切除', duration: 1000 },
        { phase: '片段连接', description: 'DNA连接酶将相邻冈崎片段连接成完整DNA链', duration: 1500 }
      ]
    },
    data: {
      structure: {
        definition: '后随链上合成的不连续的短DNA片段',
        length: {
          prokaryotic: '1000-2000个核苷酸',
          eukaryotic: '100-200个核苷酸（由于核小体存在）'
        },
        composition: '5\'端为RNA引物，3\'端为新合成的DNA'
      },
      synthesisProcess: {
        reason: 'DNA聚合酶只能沿5\'→3\'方向合成，而后随链模板方向相反',
        mechanism: '必须反向分段合成，形成冈崎片段',
        direction: '与复制叉移动方向相反'
      },
      enzymes: [
        { name: '引物酶', function: '合成RNA引物，为DNA聚合酶提供3\'-OH起始点' },
        { name: 'DNA聚合酶III（原核）/δ（真核）', function: '合成冈崎片段的主体部分' },
        { name: 'DNA聚合酶I（原核）/核酸酶（真核）', function: '切除RNA引物' },
        { name: 'DNA连接酶', function: '将相邻冈崎片段的磷酸二酯键连接' }
      ],
      significance: [
        '是DNA半不连续复制的直接证据',
        '解释了为什么DNA复制需要连接酶',
        '真核生物冈崎片段较短与核小体结构相关',
        '为理解DNA复制机制提供了关键概念'
      ],
      examples: [
        {
          organism: '大肠杆菌（原核）',
          fragmentLength: '1000-2000个核苷酸',
          feature: '冈崎片段较长，需要较少的引物和连接操作'
        },
        {
          organism: '真核生物',
          fragmentLength: '100-200个核苷酸',
          feature: '冈崎片段较短，需要更多引物和连接酶，与核小体结构相关'
        }
      ]
    },
    annotations: [
      '冈崎片段由日本科学家冈崎令治及其团队在1968年发现',
      '前导链连续合成，后随链不连续合成（冈崎片段）',
      '原核生物冈崎片段比真核生物长10倍左右',
      '冈崎片段的存在证明了DNA复制是半不连续的',
      '每个冈崎片段都需要RNA引物来启动合成',
      'DNA连接酶的活性对于形成完整的DNA链至关重要'
    ]
  }
};
