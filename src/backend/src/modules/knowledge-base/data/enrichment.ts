import { GeneticsEnrichment } from '@shared/types/agent.types';

/**
 * 遗传学丰富内容数据
 * 包含每个概念的详细定义、原理、公式、例子、误区和可视化建议
 */
export const enrichmentData: Record<string, GeneticsEnrichment> = {
  // ==================== 基础概念 ====================
  '基因': {
    concept: '基因',
    definition: '基因是遗传信息的基本单位，是DNA分子上具有特定核苷酸序列的片段，通过转录和翻译指导蛋白质或功能性RNA的合成',
    principles: [
      '基因是遗传的功能单位',
      '一个基因决定一个或多个性状',
      '基因在染色体上呈线性排列',
      '基因可以发生突变',
    ],
    formulas: [],
    examples: [
      {
        name: '豌豆花色基因',
        description: '控制豌豆花色的基因，显性等位基因产生紫色花，隐性等位基因产生白色花',
      },
    ],
    misconceptions: [
      '一个基因不一定只控制一个性状（多效性）',
      '一个性状不一定只由一个基因控制（多基因遗传）',
    ],
    visualization: {
      type: 'diagram',
      title: '基因结构示意图',
      description: '展示基因在DNA分子上的位置和结构',
      elements: ['DNA双螺旋', '基因位置', '染色体'],
      colors: {},
    },
  },

  'DNA': {
    concept: 'DNA',
    definition: '脱氧核糖核酸，是生物体内的遗传物质，由核苷酸组成的双螺旋结构大分子，携带生物体的遗传信息',
    principles: [
      'DNA由四种核苷酸组成：A、T、G、C',
      'A与T配对，G与C配对',
      'DNA双螺旋结构由沃森和克里克发现',
      'DNA通过半保留复制进行遗传',
    ],
    formulas: [],
    examples: [
      {
        name: '人类基因组',
        description: '人类基因组包含约30亿个碱基对，编码约2-2.5万个基因',
      },
    ],
    misconceptions: [
      'DNA不仅存在于细胞核中，也存在于线粒体和叶绿体中',
      '并非所有DNA都编码蛋白质（包含非编码区）',
    ],
    visualization: {
      type: 'animation',
      title: 'DNA双螺旋结构',
      description: '展示DNA分子的双螺旋结构和碱基配对规则',
      elements: ['双螺旋结构', '碱基配对', '磷酸骨架'],
      colors: {
        A: '#FF6B6B',
        T: '#4ECDC4',
        G: '#FFE66D',
        C: '#95E1D3',
      },
    },
  },

  'RNA': {
    concept: 'RNA',
    definition: '核糖核酸，由核苷酸组成的单链大分子，参与蛋白质合成和基因表达调控等多种细胞功能',
    principles: [
      'RNA通常是单链结构',
      'RNA的碱基是A、U、G、C（用U代替T）',
      'RNA有多种类型：mRNA、tRNA、rRNA等',
      'RNA可以具有催化功能（核酶）',
    ],
    formulas: [],
    examples: [
      {
        name: 'mRNA',
        description: '信使RNA，携带遗传信息从DNA到核糖体，指导蛋白质合成',
      },
    ],
    misconceptions: [
      'RNA不只是传递信息的中间体，还有多种功能',
      'RNA病毒使用RNA作为遗传物质',
    ],
    visualization: {
      type: 'diagram',
      title: 'RNA结构示意图',
      description: '展示RNA的单链结构和不同类型',
      elements: ['单链结构', '核苷酸', '不同类型的RNA'],
      colors: {},
    },
  },

  '染色体': {
    concept: '染色体',
    definition: '染色体是细胞核内承载遗传信息的线性结构，由DNA和蛋白质组成，在细胞分裂时可见',
    principles: [
      '染色体由DNA和组蛋白组成',
      '每个物种有固定的染色体数目',
      '同源染色体一条来自父方，一条来自母方',
      '性染色体决定性别',
    ],
    formulas: [],
    examples: [
      {
        name: '人类染色体',
        description: '人类体细胞有46条染色体（23对），其中44条常染色体和2条性染色体',
      },
    ],
    misconceptions: [
      '染色体只在细胞分裂时形成，间期以染色质形式存在',
      '基因不是均匀分布在染色体上的',
    ],
    visualization: {
      type: 'diagram',
      title: '染色体结构',
      description: '展示染色体的组成和结构',
      elements: ['染色体结构', '着丝粒', '端粒', '染色质'],
      colors: {},
    },
  },

  '性染色体': {
    concept: '性染色体',
    definition: '决定个体性别的染色体，哺乳动物中X和Y是性染色体',
    principles: [
      'XX为雌性，XY为雄性（哺乳动物）',
      'X染色体携带基因多于Y染色体',
      'Y染色体决定雄性性别',
      '伴性遗传与性染色体相关',
    ],
    formulas: [],
    examples: [
      {
        name: '红绿色盲',
        description: 'X连锁隐性遗传病，男性发病率高于女性',
      },
    ],
    misconceptions: [
      '不是所有生物都使用XY性别决定系统',
      'Y染色体并非完全不含基因',
    ],
    visualization: {
      type: 'diagram',
      title: '性染色体图示',
      description: '展示X和Y染色体与性别决定',
      elements: ['X染色体', 'Y染色体', '性别决定'],
      colors: {
        X: '#FF69B4',
        Y: '#4169E1',
      },
    },
  },

  '有丝分裂': {
    concept: '有丝分裂',
    definition: '体细胞分裂方式，产生两个遗传物质相同的子细胞',
    principles: [
      'DNA复制发生在间期',
      '分裂分为前期、中期、后期、末期',
      '姐妹染色单体分离',
      '染色体数目保持不变',
    ],
    formulas: [],
    examples: [
      {
        name: '皮肤细胞分裂',
        description: '皮肤细胞通过有丝分裂产生新的皮肤细胞用于生长和修复',
      },
    ],
    misconceptions: [
      '有丝分裂不是产生配子的方式',
      '有丝分裂和减数分裂的区别在于同源染色体是否配对',
    ],
    visualization: {
      title: '有丝分裂动画演示',
      description: '展示细胞有丝分裂的完整过程，包括前期、中期、后期和末期的染色体变化',
      type: 'animation',
      elements: ['前期', '中期', '后期', '末期'],
      colors: {},
    },
  },

  // ==================== 孟德尔遗传学 ====================
  '孟德尔第一定律': {
    concept: '孟德尔第一定律',
    definition: '在生物体的体细胞中，控制同一性状的遗传因子成对存在，不相融合；在形成配子时，成对的遗传因子彼此分离，分别进入不同的配子中，随配子遗传给后代',
    principles: [
      '分离定律：等位基因在配子形成时分离',
      '显隐性原理：显性基因掩盖隐性基因的表达',
      '纯合与杂合：AA、aa为纯合子，Aa为杂合子',
    ],
    formulas: [
      {
        key: '分离比',
        latex: '3:1',
        variables: {
          '3': '显性性状个体数',
          '1': '隐性性状个体数',
        },
      },
    ],
    examples: [
      {
        name: '豌豆高茎 × 矮茎',
        description: '纯合高茎(DD) × 纯合矮茎(dd) → F1全为高茎(Dd)，F2自交得到高茎:矮茎 = 3:1',
      },
    ],
    misconceptions: [
      '显性基因不是更优越，只是表达被优先显示',
      '杂合子携带的隐性基因可能在后代中表达',
      '分离比3:1只在大量样本中成立',
    ],
    visualization: {
      title: '孟德尔分离定律可视化',
      description: '通过Punnett方格展示等位基因的分离规律和3:1的表型比例',
      type: 'knowledge_graph',
      elements: ['Punnett方格', '配子', '等位基因', '表型比例'],
      colors: {
        dominant: '#4CAF50',
        recessive: '#9E9E9E',
        hybrid: '#2196F3',
      },
    },
  },

  '孟德尔第二定律': {
    concept: '孟德尔第二定律',
    definition: '控制不同性状的遗传因子在遗传时互不干扰，彼此分离，随机组合到不同的配子中',
    principles: [
      '自由组合定律：不同对性状独立遗传',
      '多对基因的组合遵循概率乘法原理',
      '适用于非同源染色体上的基因',
    ],
    formulas: [
      {
        key: '双杂交比例',
        latex: '9:3:3:1',
        variables: {
          '9': '双显性个体数',
          '3': '单显性个体数(每种)',
          '1': '双隐性个体数',
        },
      },
    ],
    examples: [
      {
        name: '豌豆双性状杂交',
        description: '黄色圆粒(YYRR) × 绿色皱粒(yyrr) → F2中得到9黄圆:3黄皱:3绿圆:1绿皱',
      },
    ],
    misconceptions: [
      '自由组合定律不适用于连锁基因',
      '实际比例可能因连锁而偏离9:3:3:1',
      '二对以上性状的组合更加复杂',
    ],
    visualization: {
      title: '孟德尔自由组合定律演示',
      description: '展示两对性状的独立遗传和9:3:3:1的分离比',
      type: 'knowledge_graph',
      elements: ['Punnett方格16格', '两对性状', '独立分配'],
      colors: {
        trait1: '#4CAF50',
        trait2: '#2196F3',
      },
    },
  },

  '伴性遗传': {
    concept: '伴性遗传',
    definition: '位于性染色体上的基因所控制的性状在遗传时与性别相关联的遗传方式',
    principles: [
      'X连锁遗传：基因位于X染色体上',
      'Y连锁遗传：基因位于Y染色体上',
      '男性只有一条X染色体，更容易表现X连锁隐性性状',
    ],
    formulas: [
      {
        key: '伴性遗传概率',
        latex: 'P = \\frac{1}{2}',
        variables: {
          'P': '携带者母亲将X连锁基因传给儿子的概率',
        },
      },
    ],
    examples: [
      {
        name: '红绿色盲',
        description: 'X连锁隐性遗传，男性发病率高于女性，女性携带者正常但可遗传给儿子',
      },
      {
        name: '血友病',
        description: 'X连锁隐性遗传，主要通过女性携带者传递给男性后代',
      },
    ],
    misconceptions: [
      '不是所有伴性遗传都是男性发病更多',
      '女性X连锁隐性纯合子也会发病',
      'Y连锁基因只从父亲传给儿子',
    ],
    visualization: {
      title: '伴性遗传系谱图',
      description: '展示X连锁遗传在家族中的传递路径和携带者状态',
      type: 'knowledge_graph',
      elements: ['性染色体', '系谱图', '携带者', '交叉遗传'],
      colors: {
        X: '#FF69B4',
        Y: '#4169E1',
        affected: '#FF4444',
      },
    },
  },

  '连锁互换': {
    concept: '连锁互换',
    definition: '位于同一条染色体上的基因常常连在一起不相分离，称为连锁；在减数分裂四分体时期，同源染色体上的非姐妹染色单体之间发生交叉互换',
    principles: [
      '完全连锁：基因间距离很近，不发生互换',
      '不完全连锁：基因间发生互换，产生重组类型',
      '互换率与基因间距离成正比',
    ],
    formulas: [
      {
        key: '互换率',
        latex: 'RF = \\frac{重组型配子数}{总配子数} \\times 100\\%',
        variables: {
          'RF': '重组频率(Recombination Frequency)',
        },
      },
    ],
    examples: [
      {
        name: '果蝇连锁遗传',
        description: '果蝇的灰身(B)对黑身(b)、长翅(V)对残翅(v)为连锁遗传，互换率约17%',
      },
    ],
    misconceptions: [
      '连锁不是绝对的，几乎都会发生一定程度的互换',
      '互换率不能超过50%',
      '基因图距单位为厘摩(cM)，1cM≈1%互换率',
    ],
    visualization: {
      title: '连锁互换示意图',
      description: '展示同源染色体间的交叉互换和基因重组过程',
      type: 'knowledge_graph',
      elements: ['同源染色体', '交叉点', '基因图', '重组配子'],
      colors: {
        chromosome1: '#FF6B6B',
        chromosome2: '#4ECDC4',
        crossover: '#FFE66D',
      },
    },
  },

  '哈代-温伯格定律': {
    concept: '哈代-温伯格定律',
    definition: '在一个理想群体中，若无突变、迁移、选择和遗传漂变，则基因频率和基因型频率将代代保持不变',
    principles: [
      '理想群体条件：无限大、随机交配、无突变、无迁移、无自然选择',
      'p + q = 1，p² + 2pq + q² = 1',
      '可用于计算携带者频率',
    ],
    formulas: [
      {
        key: '基因频率平衡公式',
        latex: 'p + q = 1',
        variables: {
          'p': '显性基因频率',
          'q': '隐性基因频率',
        },
      },
      {
        key: '基因型频率平衡公式',
        latex: 'p^2 + 2pq + q^2 = 1',
        variables: {
          'p²': '显性纯合子频率',
          '2pq': '杂合子频率',
          'q²': '隐性纯合子频率',
        },
      },
    ],
    examples: [
      {
        name: '计算白化病携带者频率',
        description: '白化病发病率为1/10000(q²)，则q=1/100，携带者频率2pq≈1/50',
      },
    ],
    misconceptions: [
      '自然群体很少完全符合哈代-温伯格平衡',
      '该定律提供的是理论基准，用于检测进化因素',
      '可以用该定律估算遗传病携带者频率',
    ],
    visualization: {
      title: '哈代-温伯格平衡图表',
      description: '展示基因频率和基因型频率的平衡分布（p² + 2pq + q² = 1）',
      type: 'chart',
      elements: ['基因频率分布', '群体遗传平衡', '基因型频率'],
      colors: {
        p: '#4CAF50',
        q: '#FF9800',
      },
    },
  },

  '基因型与表型': {
    concept: '基因型与表型',
    definition: '基因型是个体的遗传组成，表型是基因型与环境相互作用所表现出的可观察性状',
    principles: [
      '基因型决定表型的潜能',
      '环境可以影响表型的表达',
      '同一基因型在不同环境中可能产生不同表型',
    ],
    formulas: [],
    examples: [
      {
        name: '人类肤色',
        description: '肤色由多基因控制，也受阳光照射等环境影响',
      },
      {
        name: '花色',
        description: '某些花在不同pH土壤中呈现不同颜色',
      },
    ],
    misconceptions: [
      '表型相同不一定基因型相同',
      '外显率和表现度概念',
      '基因型不一定完全决定表型',
    ],
    visualization: {
      title: '基因型与表型关系图',
      description: '展示基因型、环境因素和表型之间的相互作用关系',
      type: 'diagram',
      elements: ['基因型', '环境', '表型', '外显率', '表现度'],
      colors: {},
    },
  },

  'DNA复制': {
    concept: 'DNA复制',
    definition: '以亲代DNA分子为模板合成子代DNA分子的过程，是半保留复制',
    principles: [
      '半保留复制：每个子代DNA含一条亲代链和一条新合成的链',
      '双向复制：从复制起点向两个方向进行',
      '5\'→3\'方向合成：DNA聚合酶只能从5\'端向3\'端延伸',
    ],
    formulas: [],
    examples: [
      {
        name: '大肠杆菌DNA复制',
        description: '大肠杆菌基因组复制从单一起点开始，约40分钟完成',
      },
    ],
    misconceptions: [
      'DNA复制不是全保留复制',
      '后随链合成冈崎片段，然后连接',
      '需要RNA引物启动DNA合成',
    ],
    visualization: {
      title: 'DNA半保留复制动画',
      description: '展示DNA双螺旋的半保留复制过程，包括复制叉、前导链和后随链的合成',
      type: 'animation',
      elements: ['复制叉', '前导链', '后随链', '冈崎片段'],
      colors: {
        leading: '#4CAF50',
        lagging: '#2196F3',
        parent: '#9E9E9E',
      },
    },
  },

  '转录与翻译': {
    concept: '转录与翻译',
    definition: '转录是以DNA为模板合成RNA的过程，翻译是以mRNA为模板合成蛋白质的过程',
    principles: [
      '中心法则：DNA→RNA→蛋白质',
      '转录在细胞核内进行，翻译在细胞质核糖体上进行',
      '遗传密码是通用的、简并的、无标点的',
    ],
    formulas: [],
    examples: [
      {
        name: '血红蛋白合成',
        description: '血红蛋白基因转录成mRNA，然后在核糖体上翻译成血红蛋白',
      },
    ],
    misconceptions: [
      '不是所有RNA都编码蛋白质',
      '原核生物转录和翻译可以同时进行',
      '密码子有64种，但只编码20种氨基酸',
    ],
    visualization: {
      title: '转录与翻译过程动画',
      description: '展示从DNA转录生成mRNA，到核糖体翻译合成蛋白质的完整过程',
      type: 'animation',
      elements: ['DNA', 'mRNA', 'tRNA', '核糖体', '多肽链', '密码子'],
      colors: {
        dna: '#4CAF50',
        mrna: '#2196F3',
        trna: '#FF9800',
        protein: '#9C27B0',
      },
    },
  },

  '基因突变': {
    concept: '基因突变',
    definition: 'DNA分子中碱基对的增添、缺失或替换引起的基因结构改变',
    principles: [
      '基因突变是生物变异的根本来源',
      '具有普遍性、随机性、低频性、不定向性',
      '有害突变多，有利突变少',
    ],
    formulas: [],
    examples: [
      {
        name: '镰刀型细胞贫血症',
        description: '血红蛋白基因中一个碱基替换导致谷氨酸变为缬氨酸',
      },
    ],
    misconceptions: [
      '基因突变不都是有害的',
      '基因突变不一定改变蛋白质功能',
      '自然突变频率很低，但人工诱变可提高频率',
    ],
    visualization: {
      title: '基因突变类型图解',
      description: '展示不同类型的基因突变，包括点突变、插入、缺失和移码突变',
      type: 'diagram',
      elements: ['点突变', '插入', '缺失', '置换', '移码突变'],
      colors: {
        normal: '#4CAF50',
        mutation: '#FF4444',
      },
    },
  },

  '减数分裂': {
    concept: '减数分裂',
    definition: '进行有性生殖的生物，在产生成熟生殖细胞时进行的染色体数目减半的细胞分裂',
    principles: [
      '减数分裂结果：染色体数目减半',
      'DNA复制一次，细胞连续分裂两次',
      '同源染色体联会、交叉互换',
    ],
    formulas: [],
    examples: [
      {
        name: '精子形成',
        description: '精原细胞经减数分裂产生4个精细胞，再经变形成为精子',
      },
    ],
    misconceptions: [
      '减数分裂不是产生体细胞的方式',
      '减数分裂和有丝分裂的主要区别',
      '同源染色体分离发生在减数第一次分裂',
    ],
    visualization: {
      title: '减数分裂动画演示',
      description: '展示减数分裂过程中染色体减半和配子形成的完整过程',
      type: 'animation',
      elements: ['间期', '减数第一次分裂', '减数第二次分裂', '配子'],
      colors: {
        phase1: '#4CAF50',
        phase2: '#2196F3',
        gamete: '#FF9800',
      },
    },
  },

  'PCR技术': {
    concept: 'PCR技术',
    definition: '聚合酶链式反应，是一种体外快速扩增特定DNA片段的技术',
    principles: [
      '高温变性：DNA双链分离',
      '低温退火：引物与模板结合',
      '适温延伸：DNA聚合酶合成新链',
      '指数级扩增：每循环DNA量翻倍',
    ],
    formulas: [
      {
        key: 'DNA拷贝数',
        latex: 'N = N_0 \\times 2^n',
        variables: {
          'N': 'n次循环后的DNA拷贝数',
          'N₀': '初始DNA拷贝数',
          'n': '循环次数',
        },
      },
    ],
    examples: [
      {
        name: 'DNA检测',
        description: 'PCR可用于犯罪现场DNA分析、亲子鉴定、疾病诊断等',
      },
    ],
    misconceptions: [
      'PCR不是直接复制整个基因组',
      'PCR需要特异性引物',
      'Taq酶耐高温是PCR成功的关键',
    ],
    visualization: {
      title: 'PCR技术扩增动画',
      description: '展示PCR反应的三个步骤（变性、退火、延伸）和DNA的指数级扩增',
      type: 'animation',
      elements: ['变性', '退火', '延伸', '循环扩增'],
      colors: {
        denature: '#FF6B6B',
        anneal: '#4ECDC4',
        extend: '#FFE66D',
      },
    },
  },

  'CRISPR': {
    concept: 'CRISPR',
    definition: '成簇的规律间隔的短回文重复序列，是一种细菌的免疫系统，被开发为革命性的基因编辑工具',
    principles: [
      'Cas9蛋白在gRNA引导下切割DNA',
      '产生双链断裂',
      '细胞修复导致基因敲除或敲入',
      '可精确编辑基因组',
    ],
    formulas: [],
    examples: [
      {
        name: '基因治疗',
        description: 'CRISPR已被用于治疗遗传性疾病如镰刀型细胞贫血症',
      },
    ],
    misconceptions: [
      'CRISPR编辑可能产生脱靶效应',
      '不是所有基因编辑都能成功',
      '伦理问题需要慎重考虑',
    ],
    visualization: {
      title: 'CRISPR基因编辑动画',
      description: '展示Cas9蛋白在gRNA引导下精准切割DNA并进行基因编辑的过程',
      type: 'animation',
      elements: ['Cas9蛋白', 'gRNA', '靶DNA', '切割位点'],
      colors: {
        cas9: '#FF6B6B',
        grna: '#4ECDC4',
        dna: '#FFE66D',
      },
    },
  },

  // ==================== X连锁遗传 ====================
  'X连锁遗传': {
    concept: 'X连锁遗传',
    definition: '基因位于X染色体上的遗传方式，包括显性和隐性遗传',
    principles: [
      '男性只有一条X染色体，X染色体上的隐性基因更容易表达',
      '女性有两条X染色体，需要纯合隐性才表达X连锁隐性性状',
      '男性从母亲那里获得X染色体',
      '女性携带者可以将X连锁隐性基因传给儿子',
    ],
    formulas: [
      {
        key: '男性发病率',
        latex: 'P(\\text{男性发病}) = q',
        variables: {
          'q': 'X连锁隐性基因频率',
        },
      },
    ],
    examples: [
      {
        name: '红绿色盲',
        description: 'X连锁隐性遗传，男性发病率约7%，女性发病率约0.5%',
      },
      {
        name: '血友病A',
        description: 'X连锁隐性遗传病，凝血因子VIII缺乏',
      },
    ],
    misconceptions: [
      'X连锁遗传不都是隐性遗传，也有显性遗传',
      '女性X连锁隐性纯合子会发病',
      '不是所有男性疾病都是X连锁遗传',
    ],
    visualization: {
      title: 'X连锁遗传系谱图',
      description: '展示X连锁隐性遗传在家族中的传递路径',
      type: 'knowledge_graph',
      elements: ['系谱符号', '携带者女性', '患病男性', '传递路径'],
      colors: {
        male: '#4169E1',
        female: '#FF69B4',
        carrier: '#FFD700',
        affected: '#FF4444',
      },
    },
  },

  // ==================== Y连锁遗传 ====================
  'Y连锁遗传': {
    concept: 'Y连锁遗传',
    definition: '基因位于Y染色体上的遗传方式，只能在男性间传递',
    principles: [
      'Y连锁基因只能从父亲传给儿子',
      '女性没有Y染色体，不会表现出Y连锁性状',
      '所有父系男性都具有相同的Y连锁基因',
      'Y染色体基因很少，主要与性别决定和生育相关',
    ],
    formulas: [],
    examples: [
      {
        name: '外耳道多毛症',
        description: 'Y连锁遗传性状，表现为男性外耳道长出硬毛',
      },
      {
        name: 'H-Y抗原',
        description: 'Y染色体上的组织相容性抗原',
      },
    ],
    misconceptions: [
      'Y连锁性状非常罕见',
      '不是所有男性特有性状都是Y连锁遗传',
      'Y染色体基因突变也会遗传给所有儿子',
    ],
    visualization: {
      title: 'Y连锁遗传模式图',
      description: '展示Y连锁基因在父系男性中的垂直传递',
      type: 'diagram',
      elements: ['Y染色体', '父子传递', '全雄遗传'],
      colors: {
        Y: '#4169E1',
        male: '#6495ED',
      },
    },
  },

  // ==================== 交叉互换 ====================
  '交叉互换': {
    concept: '交叉互换',
    definition: '在减数分裂前期I，同源染色体的非姐妹染色单体之间发生染色体片段交换的现象',
    principles: [
      '交叉互换发生在四分体时期',
      '交叉点是染色体片段交换的位置',
      '交叉互换产生基因重组',
      '互换率与基因间距离成正比',
    ],
    formulas: [
      {
        key: '互换率',
        latex: 'RF = \\frac{\\text{重组型配子数}}{\\text{总配子数}} \\times 100\\%',
        variables: {
          'RF': '重组频率',
        },
      },
    ],
    examples: [
      {
        name: '果蝇交叉互换',
        description: '果蝇减数分裂中同源染色体的交叉互换产生新的基因组合',
      },
    ],
    misconceptions: [
      '交叉互换不是随机发生的，某些位置是热点',
      '交叉不一定意味着互换，有时只有视觉上的交叉',
      '交叉互换只发生在减数分裂，不发生在有丝分裂',
    ],
    visualization: {
      title: '交叉互换示意图',
      description: '展示四分体时期同源染色体的交叉和片段交换',
      type: 'animation',
      elements: ['四分体', '交叉点', '非姐妹染色单体', '基因交换'],
      colors: {
        chromosome1: '#FF6B6B',
        chromosome2: '#4ECDC4',
        crossover: '#FFE66D',
      },
    },
  },

  // ==================== 联会 ====================
  '联会': {
    concept: '联会',
    definition: '在减数分裂前期I，同源染色体配对的过程',
    principles: [
      '联会是减数分裂特有的现象',
      '同源染色体精确配对',
      '联会形成四分体结构',
      '联会为交叉互换创造条件',
    ],
    formulas: [],
    examples: [
      {
        name: '精母细胞联会',
        description: '精子形成过程中同源染色体的联会',
      },
    ],
    misconceptions: [
      '联会只发生在减数第一次分裂',
      '有丝分裂没有联会现象',
      '联会失败会导致不育或染色体异常',
    ],
    visualization: {
      title: '联会过程动画',
      description: '展示同源染色体配对形成四分体的过程',
      type: 'animation',
      elements: ['同源染色体', '配对', '四分体', '联会复合体'],
      colors: {
        chr1: '#FF6B6B',
        chr2: '#4ECDC4',
        synaptonemal: '#FFE66D',
      },
    },
  },

  // ==================== 四分体 ====================
  '四分体': {
    concept: '四分体',
    definition: '在减数分裂前期I，联会后的一对同源染色体包含四条染色单体的结构',
    principles: [
      '一对同源染色体有四条染色单体',
      '四分体时期是交叉互换发生的时期',
      '非姐妹染色单体间可以发生交叉',
      '四分体数目等于同源染色体对数',
    ],
    formulas: [],
    examples: [
      {
        name: '人类四分体',
        description: '人类减数分裂中有23个四分体',
      },
    ],
    misconceptions: [
      '四分体不是四个细胞',
      '四分体是暂时性结构，后期会解体',
      '四条染色单体并非完全相同',
    ],
    visualization: {
      title: '四分体结构图',
      description: '展示四分体的四条染色单体和交叉点',
      type: 'diagram',
      elements: ['四条染色单体', '着丝粒', '交叉点', '同源染色体'],
      colors: {
        chr1_a: '#FF6B6B',
        chr1_b: '#FF9999',
        chr2_a: '#4ECDC4',
        chr2_b: '#7DD3C0',
      },
    },
  },

  // ==================== 质量性状 ====================
  '质量性状': {
    concept: '质量性状',
    definition: '表现为不连续变异的性状，通常由单对或少数几对基因控制',
    principles: [
      '性状表现呈离散分布',
      '没有中间过渡类型',
      '通常遵循孟德尔遗传规律',
      '受环境影响较小',
    ],
    formulas: [],
    examples: [
      {
        name: '豌豆花色',
        description: '紫色或白色，没有中间类型',
      },
      {
        name: '人类血型',
        description: 'A型、B型、AB型、O型，质量性状',
      },
      {
        name: '豌豆豆粒形状',
        description: '圆粒或皱粒，不连续变异',
      },
    ],
    misconceptions: [
      '质量性状不一定只有两种表现',
      '可以有多个等位基因（复等位基因）',
      '显隐性关系不是绝对的',
    ],
    visualization: {
      title: '质量性状分布图',
      description: '展示质量性状的离散分布特征',
      type: 'chart',
      elements: ['离散分布', '类别区分', '无中间类型'],
      colors: {
        type1: '#4CAF50',
        type2: '#2196F3',
        type3: '#FF9800',
      },
    },
  },

  // ==================== 数量性状 ====================
  '数量性状': {
    concept: '数量性状',
    definition: '表现为连续变异的性状，通常由多对基因控制',
    principles: [
      '性状表现呈连续分布',
      '有中间过渡类型',
      '受多对基因影响（多基因遗传）',
      '受环境因素影响较大',
    ],
    formulas: [],
    examples: [
      {
        name: '人类身高',
        description: '呈正态分布的连续性状',
      },
      {
        name: '作物产量',
        description: '受多基因和环境影响的数量性状',
      },
      {
        name: '肤色',
        description: '从深到浅的连续分布',
      },
    ],
    misconceptions: [
      '数量性状不是单基因控制的',
      '数量性状也遵循遗传规律',
      '环境对数量性状影响显著',
    ],
    visualization: {
      title: '数量性状分布曲线',
      description: '展示数量性状的正态分布特征',
      type: 'chart',
      elements: ['正态分布', '连续变异', '中间型最多'],
      colors: {
        curve: '#4CAF50',
        fill: 'rgba(76, 175, 80, 0.2)',
      },
    },
  },

  // ==================== 多基因遗传 ====================
  '多基因遗传': {
    concept: '多基因遗传',
    definition: '由多对非等位基因共同控制同一性状的遗传方式',
    principles: [
      '每对基因对性状有微小累加效应',
      '基因间遵循自由组合定律',
      '形成连续变异的数量性状',
      'F2代性状分离接近正态分布',
    ],
    formulas: [],
    examples: [
      {
        name: '人类肤色',
        description: '由多对基因共同控制，形成连续分布',
      },
      {
        name: '小麦粒色',
        description: '由两对基因控制，F2代呈现1:4:6:4:1的比例',
      },
    ],
    misconceptions: [
      '多基因遗传不是多效性',
      '每个基因的作用可以相等或不等',
      '多基因遗传也受环境影响',
    ],
    visualization: {
      title: '多基因遗传累加效应图',
      description: '展示多对基因的累加效应和连续分布',
      type: 'chart',
      elements: ['基因累加', '剂量效应', '正态分布'],
      colors: {},
    },
  },

  // ==================== 从性遗传 ====================
  '从性遗传': {
    concept: '从性遗传',
    definition: '常染色体基因控制的性状在不同性别中有不同表达的遗传方式',
    principles: [
      '基因位于常染色体上',
      '性状表达受性别影响',
      '在不同性别中外显率或表现度不同',
      '不是伴性遗传',
    ],
    formulas: [],
    examples: [
      {
        name: '人类秃顶',
        description: '常染色体显性遗传，男性更容易表达',
      },
      {
        name: '原发性血色病',
        description: '男性发病率明显高于女性',
      },
    ],
    misconceptions: [
      '从性遗传不是伴性遗传',
      '基因在男女中都存在，只是表达不同',
      '从性遗传和限性遗传不同',
    ],
    visualization: {
      title: '从性遗传表达差异图',
      description: '展示同一基因在男女中的不同表达',
      type: 'diagram',
      elements: ['常染色体基因', '性别差异表达', '外显率'],
      colors: {
        male: '#4169E1',
        female: '#FF69B4',
      },
    },
  },

  // ==================== 限性遗传 ====================
  '限性遗传': {
    concept: '限性遗传',
    definition: '基因只在一种性别中表达的遗传方式',
    principles: [
      '基因可以在常染色体或性染色体上',
      '性状只在特定性别中表现',
      '与性激素或解剖结构有关',
      '另一个性别可能携带基因但不表达',
    ],
    formulas: [],
    examples: [
      {
        name: '乳腺癌易感基因',
        description: 'BRCA1/2突变主要影响女性',
      },
      {
        name: '前列腺癌',
        description: '只在男性中发生的癌症',
      },
      {
        name: '公鸡的鸡冠形状',
        description: '只在雄性中表达的性状',
      },
    ],
    misconceptions: [
      '限性遗传不一定是性连锁遗传',
      '限性遗传和从性遗传不同',
      '限性性状往往与性激素有关',
    ],
    visualization: {
      title: '限性遗传模式图',
      description: '展示性状只在特定性别中表达',
      type: 'diagram',
      elements: ['性别限制表达', '基因携带', '表型表达'],
      colors: {
        expressed: '#FF4444',
        silent: '#9E9E9E',
      },
    },
  },

  // ==================== 染色体畸变 ====================
  '染色体畸变': {
    concept: '染色体畸变',
    definition: '染色体数目或结构发生异常改变的遗传变异',
    principles: [
      '包括数目异常和结构异常',
      '数目异常：整倍体、非整倍体',
      '结构异常：缺失、重复、倒位、易位',
      '通常导致严重的遗传病或胚胎死亡',
    ],
    formulas: [],
    examples: [
      {
        name: '唐氏综合征',
        description: '21三体，最常见的常染色体三体',
      },
      {
        name: '慢性粒白血病',
        description: '费城染色体，t(9;22)易位',
      },
    ],
    misconceptions: [
      '不是所有染色体畸变都是致死的',
      '有些畸变携带者表型正常',
      '染色体畸变可以通过核型分析检测',
    ],
    visualization: {
      title: '染色体畸变类型图',
      description: '展示各种染色体数目和结构异常',
      type: 'diagram',
      elements: ['数目异常', '结构异常', '核型分析'],
      colors: {
        normal: '#4CAF50',
        abnormal: '#FF4444',
      },
    },
  },

  // ==================== 非整倍体 ====================
  '非整倍体': {
    concept: '非整倍体',
    definition: '染色体数目不是单倍体的整数倍的个体',
    principles: [
      '体细胞中染色体数目不正常',
      '包括三体(2n+1)和单体(2n-1)',
      '通常由于减数分裂时染色体分离异常',
      '多数非整倍体是致死的',
    ],
    formulas: [],
    examples: [
      {
        name: '21三体',
        description: '唐氏综合征，3号21号染色体',
      },
      {
        name: '特纳氏综合征',
        description: 'X单体(45,X)',
      },
    ],
    misconceptions: [
      '非整倍体不同于整倍体',
      '常染色体单体通常是致死的',
      '性染色体非整倍体存活率较高',
    ],
    visualization: {
      title: '非整倍体核型对比',
      description: '展示正常与异常核型的染色体数目',
      type: 'diagram',
      elements: ['三体', '单体', '核型'],
      colors: {},
    },
  },

  // ==================== 三体 ====================
  '三体': {
    concept: '三体',
    definition: '某对同源染色体多出一条的染色体异常',
    principles: [
      '体细胞中某号染色体有三条',
      '记作2n+1',
      '常染色体三体多数致死',
      '性染色体三体存活率较高',
    ],
    formulas: [],
    examples: [
      {
        name: '21三体',
        description: '唐氏综合征，智力低下、特殊面容',
      },
      {
        name: '18三体',
        description: '爱德华氏综合征，多发畸形',
      },
      {
        name: '13三体',
        description: '帕陶氏综合征，严重畸形',
      },
    ],
    misconceptions: [
      '三体不同于多倍体',
      '三体是特定染色体多一条',
      '不同染色体三体的严重程度不同',
    ],
    visualization: {
      title: '三体核型图',
      description: '展示三体患者多出的一条染色体',
      type: 'diagram',
      elements: ['正常核型', '三体核型', '多出染色体'],
      colors: {
        normal: '#4CAF50',
        extra: '#FF4444',
      },
    },
  },

  // ==================== 单体 ====================
  '单体': {
    concept: '单体',
    definition: '某对同源染色体缺少一条的染色体异常',
    principles: [
      '体细胞中某号染色体只有一条',
      '记作2n-1',
      '常染色体单体通常是致死的',
      'X单体可以存活（特纳氏综合征）',
    ],
    formulas: [],
    examples: [
      {
        name: '特纳氏综合征',
        description: '45,X，女性性腺发育不良',
      },
    ],
    misconceptions: [
      '常染色体单体几乎不能存活',
      '单体不同于缺失',
      '只有X单体能在人类中存活',
    ],
    visualization: {
      title: '单体核型图',
      description: '展示单体患者缺少的染色体',
      type: 'diagram',
      elements: ['正常核型', '单体核型', '缺失染色体'],
      colors: {
        present: '#4CAF50',
        missing: '#FF4444',
      },
    },
  },

  // ==================== 染色体结构畸变 ====================
  '染色体结构畸变': {
    concept: '染色体结构畸变',
    definition: '染色体发生断裂后异常重接导致的结构改变',
    principles: [
      '包括缺失、重复、倒位、易位',
      '由于染色体断裂和重接错误',
      '可能改变基因剂量或位置',
      '可导致遗传病或肿瘤',
    ],
    formulas: [],
    examples: [
      {
        name: '猫叫综合征',
        description: '5号染色体短臂缺失',
      },
    ],
    misconceptions: [
      '结构畸变不一定改变染色体数目',
      '有些结构畸变携带者表型正常',
      '结构畸变可以遗传',
    ],
    visualization: {
      title: '染色体结构畸变类型',
      description: '展示缺失、重复、倒位、易位四种类型',
      type: 'diagram',
      elements: ['缺失', '重复', '倒位', '易位'],
      colors: {},
    },
  },

  // ==================== 缺失 ====================
  '缺失': {
    concept: '缺失',
    definition: '染色体片段丢失的结构异常',
    principles: [
      '染色体断裂后片段丢失',
      '包括末端缺失和中间缺失',
      '导致基因剂量减少',
      '纯合缺失通常致死',
    ],
    formulas: [],
    examples: [
      {
        name: '猫叫综合征',
        description: '5p缺失，患儿哭声像猫叫',
      },
      {
        name: '视网膜母细胞瘤',
        description: '13q14缺失导致眼部肿瘤',
      },
    ],
    misconceptions: [
      '缺失片段越大症状越重',
      '杂合缺失可能存活',
      '微缺失需要分子检测',
    ],
    visualization: {
      title: '染色体缺失示意图',
      description: '展示末端缺失和中间缺失',
      type: 'diagram',
      elements: ['正常染色体', '末端缺失', '中间缺失', '丢失片段'],
      colors: {
        normal: '#4CAF50',
        deleted: '#FF4444',
      },
    },
  },

  // ==================== 重复 ====================
  '重复': {
    concept: '重复',
    definition: '染色体片段增加一份的结构异常',
    principles: [
      '染色体片段重复',
      '导致基因剂量增加',
      '产生基因剂量效应',
      '可能比缺失的危害小',
    ],
    formulas: [],
    examples: [
      {
        name: '腓骨肌萎缩症',
        description: 'PMP22基因重复导致',
      },
    ],
    misconceptions: [
      '重复也可能致病',
      '重复可以是串联重复',
      '大片段重复也有危害',
    ],
    visualization: {
      title: '染色体重复示意图',
      description: '展示染色体片段的重复',
      type: 'diagram',
      elements: ['正常染色体', '重复染色体', '重复片段'],
      colors: {
        original: '#4CAF50',
        duplicated: '#2196F3',
      },
    },
  },

  // ==================== 倒位 ====================
  '倒位': {
    concept: '倒位',
    definition: '染色体片段断裂后反向重接的结构异常',
    principles: [
      '包括臂内倒位和臂间倒位',
      '倒位环是减数分裂的特殊结构',
      '倒位携带者通常表型正常',
      '可能产生不平衡配子',
    ],
    formulas: [],
    examples: [
      {
        name: '血友病A倒位',
        description: 'X染色体倒位导致因子VIII基因破坏',
      },
    ],
    misconceptions: [
      '倒位不丢失或获得遗传物质',
      '倒位可能影响基因表达',
      '倒位杂合子生育力可能降低',
    ],
    visualization: {
      title: '染色体倒位示意图',
      description: '展示臂内倒位和臂间倒位',
      type: 'diagram',
      elements: ['正常染色体', '倒位染色体', '倒位环', '断裂点'],
      colors: {
        segment1: '#4CAF50',
        segment2: '#2196F3',
        inverted: '#FF9800',
      },
    },
  },

  // ==================== 易位 ====================
  '易位': {
    concept: '易位',
    definition: '不同染色体间发生片段交换的结构异常',
    principles: [
      '包括相互易位和罗伯逊易位',
      '相互易位：两条非同源染色体交换片段',
      '罗伯逊易位：两条近端着丝粒染色体融合',
      '易位携带者通常表型正常',
    ],
    formulas: [],
    examples: [
      {
        name: '费城染色体',
        description: 't(9;22)(q34;q11)，慢性粒白血病',
      },
      {
        name: '罗伯逊易位',
        description: '14;21易位导致易位型唐氏综合征',
      },
    ],
    misconceptions: [
      '易位不丢失遗传物质（相互易位）',
      '罗伯逊易位会丢失一条染色体',
      '易位可能导致不孕不育',
    ],
    visualization: {
      title: '染色体易位示意图',
      description: '展示相互易位和罗伯逊易位',
      type: 'diagram',
      elements: ['相互易位', '罗伯逊易位', '衍生染色体'],
      colors: {
        chr1: '#FF6B6B',
        chr2: '#4ECDC4',
        derivative: '#FFE66D',
      },
    },
  },

  // ==================== DNA半保留复制 ====================
  'DNA半保留复制': {
    concept: 'DNA半保留复制',
    definition: 'DNA复制时，每条新合成的DNA分子包含一条亲代链和一条新合成的子链',
    principles: [
      '亲代DNA双链解开作为模板',
      '每条模板链合成新的互补链',
      '子代DNA含一条亲代链和一条新链',
      '由Meselson-Stahl实验证明',
    ],
    formulas: [],
    examples: [
      {
        name: 'Meselson-Stahl实验',
        description: '用^15N标记DNA证明半保留复制',
      },
    ],
    misconceptions: [
      'DNA不是全保留复制或分散复制',
      '两条链都作为模板',
      '半保留复制保证遗传信息稳定',
    ],
    visualization: {
      title: 'DNA半保留复制示意图',
      description: '展示亲代链如何保留在子代DNA中',
      type: 'animation',
      elements: ['亲代链', '新合成链', '子代DNA'],
      colors: {
        parent: '#9E9E9E',
        new: '#4CAF50',
      },
    },
  },

  // ==================== 复制叉 ====================
  '复制叉': {
    concept: '复制叉',
    definition: 'DNA复制时双链解旋形成的Y型区域',
    principles: [
      'DNA双螺旋解开形成复制叉',
      '复制叉向两个方向移动',
      '前导链和后随链在此合成',
      '涉及多种酶和蛋白复合物',
    ],
    formulas: [],
    examples: [
      {
        name: '大肠杆菌复制',
        description: '从单一起点双向复制形成两个复制叉',
      },
    ],
    misconceptions: [
      '复制叉不是静止的',
      '复制叉移动速度受多种因素影响',
      '复制叉稳定性很重要',
    ],
    visualization: {
      title: '复制叉结构图',
      description: '展示复制叉的Y型结构和相关酶',
      type: 'diagram',
      elements: ['复制叉', '解旋酶', 'DNA聚合酶', '前导链', '后随链'],
      colors: {
        fork: '#FF6B6B',
        leading: '#4CAF50',
        lagging: '#2196F3',
      },
    },
  },

  // ==================== 前导链 ====================
  '前导链': {
    concept: '前导链',
    definition: 'DNA复制中沿5\'到3\'方向连续合成的子链',
    principles: [
      '与复制叉移动方向相同',
      '连续合成，不需要冈崎片段',
      '由DNA聚合酶连续延伸',
      '合成速度快于后随链',
    ],
    formulas: [],
    examples: [
      {
        name: 'DNA复制',
        description: '前导链连续合成',
      },
    ],
    misconceptions: [
      '前导链不需要RNA引物（实际上也需要）',
      '前导链和后随链是同时合成的',
      '前导链合成方向是5\'到3\'',
    ],
    visualization: {
      title: '前导链合成示意图',
      description: '展示前导链的连续合成过程',
      type: 'animation',
      elements: ['连续合成', '5\'到3\'方向', '复制叉移动'],
      colors: {
        leading: '#4CAF50',
        template: '#9E9E9E',
      },
    },
  },

  // ==================== 后随链 ====================
  '后随链': {
    concept: '后随链',
    definition: 'DNA复制中沿5\'到3\'方向不连续合成的子链',
    principles: [
      '与复制叉移动方向相反',
      '不连续合成，形成冈崎片段',
      '冈崎片段 later 连接成完整链',
      '合成速度慢于前导链',
    ],
    formulas: [],
    examples: [
      {
        name: '冈崎片段',
        description: '后随链合成的短片段',
      },
    ],
    misconceptions: [
      '后随链合成方向也是5\'到3\'',
      '需要多个RNA引物',
      '冈崎片段连接需要DNA连接酶',
    ],
    visualization: {
      title: '后随链合成示意图',
      description: '展示后随链的不连续合成',
      type: 'animation',
      elements: ['冈崎片段', '不连续合成', 'DNA连接酶'],
      colors: {
        lagging: '#2196F3',
        fragments: '#FF9800',
      },
    },
  },

  // ==================== 冈崎片段 ====================
  '冈崎片段': {
    concept: '冈崎片段',
    definition: '后随链合成过程中产生的短DNA片段',
    principles: [
      '原核生物约1000-2000核苷酸',
      '真核生物约100-200核苷酸',
      '由RNA引物起始合成',
      'DNA连接酶将冈崎片段连接',
    ],
    formulas: [],
    examples: [
      {
        name: '大肠杆菌',
        description: '冈崎片段长度1000-2000nt',
      },
    ],
    misconceptions: [
      '冈崎片段只存在于后随链',
      '前导链没有冈崎片段',
      '冈崎片段需要连接',
    ],
    visualization: {
      title: '冈崎片段示意图',
      description: '展示后随链上的冈崎片段',
      type: 'diagram',
      elements: ['后随链', '冈崎片段', 'RNA引物', 'DNA连接酶'],
      colors: {
        fragment: '#FF9800',
        primer: '#FF4444',
        ligase: '#4CAF50',
      },
    },
  },

  // ==================== DNA聚合酶 ====================
  'DNA聚合酶': {
    concept: 'DNA聚合酶',
    definition: '催化DNA合成的酶，以DNA为模板合成新的DNA链',
    principles: [
      '只能从5\'到3\'方向合成',
      '需要引物和模板',
      '具有校对功能（3\'到5\'外切酶活性）',
      '需要dNTP作为底物',
    ],
    formulas: [],
    examples: [
      {
        name: 'DNA聚合酶I',
        description: '大肠杆菌主要的DNA聚合酶，有外切酶活性',
      },
      {
        name: 'Taq聚合酶',
        description: '耐热DNA聚合酶，用于PCR',
      },
    ],
    misconceptions: [
      'DNA聚合酶不能从头合成',
      '需要RNA引物',
      'DNA聚合酶有校对功能',
    ],
    visualization: {
      title: 'DNA聚合酶结构图',
      description: '展示DNA聚合酶的结构和功能',
      type: 'diagram',
      elements: ['聚合酶结构', '活性位点', '模板DNA', '新合成链'],
      colors: {
        enzyme: '#4CAF50',
        dna: '#2196F3',
      },
    },
  },

  // ==================== DNA连接酶 ====================
  'DNA连接酶': {
    concept: 'DNA连接酶',
    definition: '催化DNA片段间形成磷酸二酯键的酶',
    principles: [
      '连接DNA片段的3\'-OH和5\'-磷酸',
      '需要ATP或NAD+提供能量',
      '用于DNA复制和修复',
      '用于重组DNA技术',
    ],
    formulas: [],
    examples: [
      {
        name: '冈崎片段连接',
        description: 'DNA连接酶连接后随链的冈崎片段',
      },
    ],
    misconceptions: [
      'DNA连接酶不能合成DNA',
      '只能连接已有的DNA片段',
      'DNA连接酶需要能量',
    ],
    visualization: {
      title: 'DNA连接酶作用示意图',
      description: '展示DNA连接酶连接DNA片段',
      type: 'diagram',
      elements: ['DNA连接酶', '磷酸二酯键', 'DNA片段'],
      colors: {
        ligase: '#4CAF50',
        dna1: '#2196F3',
        dna2: '#FF9800',
      },
    },
  },

  // ==================== 中心法则 ====================
  '中心法则': {
    concept: '中心法则',
    definition: '描述遗传信息流动方向的规律：DNA→RNA→蛋白质',
    principles: [
      'DNA可以自我复制',
      'DNA转录成RNA',
      'RNA翻译成蛋白质',
      '某些病毒可以RNA→DNA（逆转录）',
    ],
    formulas: [],
    examples: [
      {
        name: '蛋白质合成',
        description: 'DNA转录mRNA，mRNA翻译蛋白质',
      },
    ],
    misconceptions: [
      '中心法则不是绝对的',
      '逆转录是中心法则的补充',
      '有些RNA可以复制（RNA病毒）',
    ],
    visualization: {
      title: '中心法则流程图',
      description: '展示遗传信息的流动方向',
      type: 'diagram',
      elements: ['DNA', 'RNA', '蛋白质', '复制', '转录', '翻译'],
      colors: {
        dna: '#4CAF50',
        rna: '#2196F3',
        protein: '#FF9800',
      },
    },
  },

  // ==================== 转录 ====================
  '转录': {
    concept: '转录',
    definition: '以DNA为模板合成RNA的过程',
    principles: [
      '由RNA聚合酶催化',
      '遵循碱基配对规则（A-U, T-A, G-C）',
      '转录方向是5\'到3\'',
      '包括起始、延伸、终止阶段',
    ],
    formulas: [],
    examples: [
      {
        name: 'mRNA合成',
        description: '基因转录产生mRNA',
      },
    ],
    misconceptions: [
      '转录不是复制',
      'RNA不是DNA的完全互补',
      '转录需要启动子',
    ],
    visualization: {
      title: '转录过程动画',
      description: '展示RNA聚合酶转录合成RNA',
      type: 'animation',
      elements: ['DNA模板', 'RNA聚合酶', '新合成RNA', '启动子'],
      colors: {
        dna: '#4CAF50',
        rna: '#2196F3',
        polymerase: '#FF9800',
      },
    },
  },

  // ==================== 翻译 ====================
  '翻译': {
    concept: '翻译',
    definition: '以mRNA为模板合成蛋白质的过程',
    principles: [
      '在核糖体上进行',
      'tRNA携带氨基酸',
      '密码子与反密码子配对',
      '包括起始、延伸、终止阶段',
    ],
    formulas: [],
    examples: [
      {
        name: '蛋白质合成',
        description: '核糖体翻译mRNA产生多肽链',
      },
    ],
    misconceptions: [
      '翻译不是转录的反过程',
      '需要氨基酸和ATP',
      '密码子是通用的',
    ],
    visualization: {
      title: '翻译过程动画',
      description: '展示核糖体翻译合成蛋白质',
      type: 'animation',
      elements: ['核糖体', 'mRNA', 'tRNA', '氨基酸', '多肽链'],
      colors: {
        ribosome: '#FF9800',
        mrna: '#2196F3',
        trna: '#4CAF50',
        protein: '#E91E63',
      },
    },
  },

  // ==================== RNA聚合酶 ====================
  'RNA聚合酶': {
    concept: 'RNA聚合酶',
    definition: '催化RNA合成的酶，以DNA为模板合成RNA',
    principles: [
      '识别启动子',
      '解开DNA双螺旋',
      '催化磷酸二酯键形成',
      '不需要引物',
    ],
    formulas: [],
    examples: [
      {
        name: 'RNA聚合酶II',
        description: '真核生物转录mRNA的酶',
      },
    ],
    misconceptions: [
      'RNA聚合酶不需要引物',
      'RNA聚合酶有校对功能',
      '不同类型RNA由不同RNA聚合酶转录',
    ],
    visualization: {
      title: 'RNA聚合酶结构图',
      description: '展示RNA聚合酶的结构',
      type: 'diagram',
      elements: ['RNA聚合酶', '活性位点', 'DNA模板', '新合成RNA'],
      colors: {
        enzyme: '#FF9800',
        dna: '#4CAF50',
        rna: '#2196F3',
      },
    },
  },

  // ==================== 启动子 ====================
  '启动子': {
    concept: '启动子',
    definition: 'DNA上结合RNA聚合酶并起始转录的序列',
    principles: [
      '位于基因上游',
      '含TATA框等保守序列',
      '结合RNA聚合酶和转录因子',
      '决定转录起始位置',
    ],
    formulas: [],
    examples: [
      {
        name: 'TATA框',
        description: '真核启动子的核心序列',
      },
    ],
    misconceptions: [
      '启动子本身不被转录',
      '不同基因的启动子不同',
      '启动子突变影响基因表达',
    ],
    visualization: {
      title: '启动子结构图',
      description: '展示启动子的结构和元件',
      type: 'diagram',
      elements: ['TATA框', '转录起始位点', 'RNA聚合酶结合位点'],
      colors: {
        promoter: '#FF9800',
        gene: '#4CAF50',
      },
    },
  },

  // ==================== 增强子 ====================
  '增强子': {
    concept: '增强子',
    definition: '提高基因转录效率的DNA序列',
    principles: [
      '可以位于基因上游或下游',
      '距离基因可以很远',
      '结合转录激活因子',
      '通过DNA环化与启动子相互作用',
    ],
    formulas: [],
    examples: [
      {
        name: 'SV40增强子',
        description: '病毒增强子，能强烈提高转录',
      },
    ],
    misconceptions: [
      '增强子本身不被转录',
      '增强子作用与方向和位置无关',
      '增强子需要转录因子结合',
    ],
    visualization: {
      title: '增强子作用机制图',
      description: '展示增强子与启动子的相互作用',
      type: 'diagram',
      elements: ['增强子', '启动子', '转录因子', 'DNA环化'],
      colors: {
        enhancer: '#FF4444',
        promoter: '#FF9800',
        factors: '#4CAF50',
      },
    },
  },

  // ==================== 沉默子 ====================
  '沉默子': {
    concept: '沉默子',
    definition: '抑制基因转录的DNA序列',
    principles: [
      '结合转录抑制因子',
      '降低或阻断基因转录',
      '参与基因表达调控',
      '与增强子作用相反',
    ],
    formulas: [],
    examples: [
      {
        name: '沉默子介导的抑制',
        description: '某些基因在特定组织中不表达',
      },
    ],
    misconceptions: [
      '沉默子不是基因',
      '沉默子需要转录因子结合',
      '沉默子与增强子共同调控基因',
    ],
    visualization: {
      title: '沉默子作用示意图',
      description: '展示沉默子对基因转录的抑制',
      type: 'diagram',
      elements: ['沉默子', '抑制因子', '转录抑制'],
      colors: {
        silencer: '#9E9E9E',
        repressor: '#607D8B',
      },
    },
  },

  // ==================== 转录因子 ====================
  '转录因子': {
    concept: '转录因子',
    definition: '结合DNA调节基因转录的蛋白质',
    principles: [
      '识别特定DNA序列',
      '激活或抑制转录',
      '与RNA聚合酶相互作用',
      '形成转录复合物',
    ],
    formulas: [],
    examples: [
      {
        name: 'TFIIA',
        description: 'RNA聚合酶II通用转录因子',
      },
    ],
    misconceptions: [
      '转录因子本身不催化转录',
      '转录因子需要结合DNA',
      '转录因子组合决定基因表达模式',
    ],
    visualization: {
      title: '转录因子作用图',
      description: '展示转录因子与DNA的结合',
      type: 'diagram',
      elements: ['转录因子', 'DNA结合结构域', '激活结构域'],
      colors: {
        factor: '#4CAF50',
        dna: '#2196F3',
      },
    },
  },

  // ==================== 剪接 ====================
  '剪接': {
    concept: '剪接',
    definition: '去除前体mRNA中内含子并连接外显子的过程',
    principles: [
      '发生在细胞核内',
      '由剪接体催化',
      '遵循GT-AG规则',
      '产生成熟mRNA',
    ],
    formulas: [],
    examples: [
      {
        name: 'mRNA加工',
        description: '前体mRNA剪接去除内含子',
      },
    ],
    misconceptions: [
      '不是所有基因都需要剪接',
      '可变剪接产生多种mRNA',
      '剪接缺陷导致遗传病',
    ],
    visualization: {
      title: 'RNA剪接示意图',
      description: '展示内含子去除和外显子连接',
      type: 'animation',
      elements: ['内含子', '外显子', '剪接体', '套索结构'],
      colors: {
        intron: '#9E9E9E',
        exon: '#4CAF50',
        spliceosome: '#FF9800',
      },
    },
  },

  // ==================== 内含子 ====================
  '内含子': {
    concept: '内含子',
    definition: '基因中不编码蛋白质的序列，在RNA加工时被去除',
    principles: [
      '位于外显子之间',
      '转录后在剪接时去除',
      '不参与蛋白质编码',
      '可能具有调控功能',
    ],
    formulas: [],
    examples: [
      {
        name: '人类基因',
        description: '大多数人类基因含有内含子',
      },
    ],
    misconceptions: [
      '内含子不是"垃圾DNA"',
      '内含子可能含有调控元件',
      '有些内含子编码miRNA',
    ],
    visualization: {
      title: '基因结构示意图',
      description: '展示基因的外显子和内含子结构',
      type: 'diagram',
      elements: ['外显子', '内含子', 'UTR'],
      colors: {
        exon: '#4CAF50',
        intron: '#9E9E9E',
        utr: '#FF9800',
      },
    },
  },

  // ==================== 外显子 ====================
  '外显子': {
    concept: '外显子',
    definition: '基因中编码蛋白质的序列，在成熟mRNA中保留',
    principles: [
      '被转录并保留在成熟mRNA中',
      '包含蛋白质编码信息',
      '在外显子-内含子边界有保守序列',
      '外显子剪接增强子调控剪接',
    ],
    formulas: [],
    examples: [
      {
        name: '编码区',
        description: '外显子组成基因的编码区',
      },
    ],
    misconceptions: [
      '外显子不都编码氨基酸（5\'和3\'UTR）',
      '外显子数目在不同基因中差异很大',
      '剪接异常可能影响外显子',
    ],
    visualization: {
      title: '外显子示意图',
      description: '展示外显子在基因中的位置',
      type: 'diagram',
      elements: ['外显子', '内含子', '编码区', 'UTR'],
      colors: {
        exon: '#4CAF50',
        intron: '#9E9E9E',
      },
    },
  },

  // ==================== 可变剪接 ====================
  '可变剪接': {
    concept: '可变剪接',
    definition: '一个基因的pre-mRNA通过不同剪接方式产生多种mRNA的过程',
    principles: [
      '外显子可以跳过或保留',
      '内含子可以保留',
      '产生蛋白质多样性',
      '受剪接因子调控',
    ],
    formulas: [],
    examples: [
      {
        name: '果蝇Dscam基因',
        description: '可产生38000多种mRNA变体',
      },
    ],
    misconceptions: [
      '可变剪接是蛋白质多样性的重要机制',
      '可变剪接受严格调控',
      '可变剪接异常导致疾病',
    ],
    visualization: {
      title: '可变剪接模式图',
      description: '展示不同可变剪接方式',
      type: 'diagram',
      elements: ['外显子跳过', '内含子保留', '可变外显子'],
      colors: {
        constitutive: '#4CAF50',
        alternative: '#FF9800',
        skipped: '#9E9E9E',
      },
    },
  },

  // ==================== 遗传密码 ====================
  '遗传密码': {
    concept: '遗传密码',
    definition: 'DNA或RNA中核苷酸序列与蛋白质中氨基酸序列的对应关系',
    principles: [
      '密码子是三联体',
      '64个密码子编码20种氨基酸和终止信号',
      '具有通用性、简并性、无标点性',
      '密码子表是固定的',
    ],
    formulas: [],
    examples: [
      {
        name: 'AUG密码子',
        description: '编码甲硫氨酸，也是起始密码子',
      },
    ],
    misconceptions: [
      '遗传密码在几乎所有生物中通用',
      '简并性减少突变影响',
      '有些线粒体密码子有例外',
    ],
    visualization: {
      title: '遗传密码表',
      description: '展示完整的密码子表',
      type: 'diagram',
      elements: ['64个密码子', '20种氨基酸', '终止密码子'],
      colors: {},
    },
  },

  // ==================== 密码子 ====================
  '密码子': {
    concept: '密码子',
    definition: 'mRNA上三个连续的核苷酸，编码一个氨基酸',
    principles: [
      '三联体编码',
      '4³=64种组合',
      '61个编码氨基酸，3个终止信号',
      '5\'端第一个碱基最重要',
    ],
    formulas: [],
    examples: [
      {
        name: 'AUG',
        description: '起始密码子，编码甲硫氨酸',
      },
    ],
    misconceptions: [
      '密码子不与tRNA直接配对',
      '简并性：一个氨基酸可有多个密码子',
      '密码子有方向性',
    ],
    visualization: {
      title: '密码子结构图',
      description: '展示密码子的三联体结构',
      type: 'diagram',
      elements: ['第一碱基', '第二碱基', '第三碱基', '氨基酸'],
      colors: {
        base1: '#4CAF50',
        base2: '#2196F3',
        base3: '#FF9800',
      },
    },
  },

  // ==================== 反密码子 ====================
  '反密码子': {
    concept: '反密码子',
    definition: 'tRNA上与mRNA密码子互补配对的三联体序列',
    principles: [
      '位于tRNA的环上',
      '与密码子反向互补配对',
      '3\'端携带氨基酸',
      '决定tRNA的特异性',
    ],
    formulas: [],
    examples: [
      {
        name: 'tRNA',
        description: 'tRNA的反密码子环含有反密码子',
      },
    ],
    misconceptions: [
      '反密码子与密码子是反向配对',
      '摆动配对允许一定错配',
      '反密码子决定携带的氨基酸',
    ],
    visualization: {
      title: '反密码子配对图',
      description: '展示tRNA反密码子与mRNA密码子配对',
      type: 'diagram',
      elements: ['tRNA', '反密码子', 'mRNA', '密码子', '氨基酸'],
      colors: {
        trna: '#4CAF50',
        mrna: '#2196F3',
        anticodon: '#FF9800',
        codon: '#FF4444',
      },
    },
  },

  // ==================== 起始密码子 ====================
  '起始密码子': {
    concept: '起始密码子',
    definition: 'AUG，编码蛋白质合成的第一个氨基酸',
    principles: [
      'AUG是起始密码子',
      '编码甲硫氨酸（Met）',
      '确定读码框',
      '在原核中编码fMet，真核中编码Met',
    ],
    formulas: [],
    examples: [
      {
        name: '蛋白质合成起始',
        description: '核糖体识别起始密码子AUG',
      },
    ],
    misconceptions: [
      'AUG不总是起始密码子（少数例外）',
      '起始密码子决定读码框',
      '原核和真核的起始氨基酸不同',
    ],
    visualization: {
      title: '起始密码子识别',
      description: '展示核糖体识别起始密码子',
      type: 'diagram',
      elements: ['起始密码子AUG', '核糖体', '起始tRNA'],
      colors: {
        aug: '#FF4444',
        ribosome: '#FF9800',
        initiator_trna: '#4CAF50',
      },
    },
  },

  // ==================== 终止密码子 ====================
  '终止密码子': {
    concept: '终止密码子',
    definition: '不编码氨基酸，标记蛋白质合成终止的三联体',
    principles: [
      '三个终止密码子：UAA、UAG、UGA',
      '不对应任何tRNA',
      '被释放因子识别',
      '导致多肽链释放',
    ],
    formulas: [],
    examples: [
      {
        name: '终止信号',
        description: 'UAA、UAG、UGA终止蛋白质合成',
      },
    ],
    misconceptions: [
      '终止密码子不编码氨基酸',
      '终止密码子是保守的',
      '有些生物有特殊机制通读终止密码子',
    ],
    visualization: {
      title: '终止密码子作用',
      description: '展示终止密码子终止翻译',
      type: 'diagram',
      elements: ['终止密码子', '释放因子', '多肽链释放'],
      colors: {
        stop: '#FF4444',
        factor: '#FF9800',
        protein: '#4CAF50',
      },
    },
  },

  // ==================== 蛋白质合成 ====================
  '蛋白质合成': {
    concept: '蛋白质合成',
    definition: '以mRNA为模板合成多肽链的过程，包括翻译和折叠',
    principles: [
      '在核糖体上进行',
      '包括翻译起始、延伸、终止',
      '需要mRNA、tRNA、氨基酸、ATP',
      '合成后需要正确折叠',
    ],
    formulas: [],
    examples: [
      {
        name: '胰岛素合成',
        description: '胰岛β细胞合成胰岛素原，加工成胰岛素',
      },
    ],
    misconceptions: [
      '蛋白质合成不等于翻译',
      '合成后需要加工和折叠',
      '蛋白质合成受精确调控',
    ],
    visualization: {
      title: '蛋白质合成过程',
      description: '展示从翻译到折叠的完整过程',
      type: 'animation',
      elements: ['核糖体', '多肽链', '折叠', '成熟蛋白质'],
      colors: {
        ribosome: '#FF9800',
        peptide: '#4CAF50',
        protein: '#2196F3',
      },
    },
  },

  // ==================== 核糖体 ====================
  '核糖体': {
    concept: '核糖体',
    definition: '由rRNA和蛋白质组成的细胞器，是蛋白质合成的场所',
    principles: [
      '由大亚基和小亚基组成',
      '含有rRNA和蛋白质',
      '有A、P、E三个tRNA结合位点',
      '参与翻译过程',
    ],
    formulas: [],
    examples: [
      {
        name: '真核核糖体',
        description: '80S核糖体，由60S和40S亚基组成',
      },
    ],
    misconceptions: [
      '核糖体不是膜结合细胞器',
      '核糖体可游离或附着在内质网',
      'rRNA是核糖体的催化成分',
    ],
    visualization: {
      title: '核糖体结构图',
      description: '展示核糖体的亚基和tRNA结合位点',
      type: 'diagram',
      elements: ['大亚基', '小亚基', 'A位点', 'P位点', 'E位点'],
      colors: {
        large: '#FF9800',
        small: '#FFD54F',
        sites: '#4CAF50',
      },
    },
  },

  // ==================== 基因表达 ====================
  '基因表达': {
    concept: '基因表达',
    definition: '基因转录和翻译产生功能性产物的过程',
    principles: [
      '包括转录、翻译、加工',
      '受精确调控',
      '具有时空特异性',
      '可受环境诱导',
    ],
    formulas: [],
    examples: [
      {
        name: '乳糖诱导',
        description: '乳糖诱导大肠杆菌乳糖操纵子表达',
      },
    ],
    misconceptions: [
      '基因表达不等于转录',
      '基因表达需要多步调控',
      '不是所有基因都同时表达',
    ],
    visualization: {
      title: '基因表达过程',
      description: '展示从基因到蛋白质的完整过程',
      type: 'animation',
      elements: ['基因', '转录', 'RNA加工', '翻译', '蛋白质'],
      colors: {
        dna: '#4CAF50',
        rna: '#2196F3',
        protein: '#FF9800',
      },
    },
  },

  // ==================== 基因调控 ====================
  '基因调控': {
    concept: '基因调控',
    definition: '控制基因表达的时间和水平的机制',
    principles: [
      '包括转录水平、转录后、翻译水平调控',
      '涉及调控序列和调控蛋白',
      '具有复杂性和精确性',
      '确保基因正确表达',
    ],
    formulas: [],
    examples: [
      {
        name: '乳糖操纵子',
        description: '大肠杆菌乳糖代谢基因的调控',
      },
    ],
    misconceptions: [
      '基因调控不是简单的开关',
      '涉及多层次调控',
      '调控异常导致疾病',
    ],
    visualization: {
      title: '基因调控网络',
      description: '展示基因调控的层次和网络',
      type: 'diagram',
      elements: ['转录调控', '转录后调控', '翻译调控', '调控蛋白'],
      colors: {},
    },
  },

  // ==================== 操纵子 ====================
  '操纵子': {
    concept: '操纵子',
    definition: '原核生物中功能相关的基因连同其调控序列组成的表达单位',
    principles: [
      '包括结构基因、启动子、操纵基因',
      '由阻遏蛋白调控',
      '是原核生物特有的基因调控单位',
      '乳糖操纵子是典型例子',
    ],
    formulas: [],
    examples: [
      {
        name: '乳糖操纵子',
        description: '调控乳糖代谢基因的表达',
      },
    ],
    misconceptions: [
      '真核生物没有操纵子',
      '操纵子是原核生物特有的',
      '操纵子包含结构基因和调控序列',
    ],
    visualization: {
      title: '操纵子结构图',
      description: '展示操纵子的基因组成',
      type: 'diagram',
      elements: ['结构基因', '启动子', '操纵基因', '阻遏蛋白'],
      colors: {
        genes: '#4CAF50',
        promoter: '#FF9800',
        operator: '#2196F3',
        repressor: '#FF4444',
      },
    },
  },

  // ==================== 乳糖操纵子 ====================
  '乳糖操纵子': {
    concept: '乳糖操纵子',
    definition: '大肠杆菌中调控乳糖代谢基因表达的操纵子系统',
    principles: [
      '包括lacZ、lacY、lacA基因',
      '由阻遏蛋白负调控',
      '由CAP-cAMP正调控',
      '乳糖诱导时表达',
    ],
    formulas: [],
    examples: [
      {
        name: '乳糖代谢',
        description: '乳糖存在时，乳糖操纵子表达分解乳糖的酶',
      },
    ],
    misconceptions: [
      '乳糖操纵子同时受正负调控',
      '葡萄糖存在时抑制乳糖操纵子',
      '阻遏蛋白结合操纵基因',
    ],
    visualization: {
      title: '乳糖操纵子调控机制',
      description: '展示乳糖操纵子的诱导和阻遏状态',
      type: 'animation',
      elements: ['lacZ', 'lacY', 'lacA', '阻遏蛋白', '诱导物', 'CAP'],
      colors: {
        genes: '#4CAF50',
        repressor: '#FF4444',
        inducer: '#FF9800',
        cap: '#2196F3',
      },
    },
  },

  // ==================== 点突变 ====================
  '点突变': {
    concept: '点突变',
    definition: 'DNA分子中一个碱基对被另一个碱基对替换',
    principles: [
      '包括转换和颠换',
      '可以导致氨基酸改变或不改变',
      '分为同义、错义、无义突变',
      '是分子进化的基础',
    ],
    formulas: [],
    examples: [
      {
        name: '镰刀型细胞贫血症',
        description: 'β珠蛋白基因一个碱基替换导致Glu→Val',
      },
    ],
    misconceptions: [
      '点突变不一定改变蛋白质',
      '点突变也可以是有益的',
      '点突变的效应取决于位置',
    ],
    visualization: {
      title: '点突变示意图',
      description: '展示碱基替换的不同类型',
      type: 'diagram',
      elements: ['转换', '颠换', '同义', '错义', '无义'],
      colors: {
        normal: '#4CAF50',
        mutated: '#FF4444',
      },
    },
  },

  // ==================== 移码突变 ====================
  '移码突变': {
    concept: '移码突变',
    definition: 'DNA分子中插入或缺失一个或几个（不是3的倍数）碱基对导致的突变',
    principles: [
      '改变阅读框',
      '影响突变点后所有氨基酸',
      '通常产生无功能蛋白质',
      '可能提前出现终止密码子',
    ],
    formulas: [],
    examples: [
      {
        name: '移码突变',
        description: '插入或缺失1-2个碱基',
      },
    ],
    misconceptions: [
      '3的倍数的插入缺失不是移码',
      '移码突变通常比点突变危害大',
      '移码突变影响下游序列',
    ],
    visualization: {
      title: '移码突变示意图',
      description: '展示插入和缺失导致的移码',
      type: 'diagram',
      elements: ['正常序列', '插入', '缺失', '移码'],
      colors: {
        normal: '#4CAF50',
        frameshift: '#FF4444',
      },
    },
  },

  // ==================== 同义突变 ====================
  '同义突变': {
    concept: '同义突变',
    definition: '改变密码子但不改变编码氨基酸的突变',
    principles: [
      '由于密码子简并性产生',
      '不改变蛋白质序列',
      '可能影响翻译效率',
      '通常是中性突变',
    ],
    formulas: [],
    examples: [
      {
        name: '同义突变',
        description: '如CCU→CCC，都编码Pro',
      },
    ],
    misconceptions: [
      '同义突变不都是中性的',
      '可能影响mRNA稳定性或翻译',
      '同义突变可用于分子标记',
    ],
    visualization: {
      title: '同义突变示意图',
      description: '展示密码子改变但氨基酸不变',
      type: 'diagram',
      elements: ['原始密码子', '突变密码子', '相同氨基酸'],
      colors: {
        original: '#4CAF50',
        mutated: '#FF9800',
        amino_acid: '#2196F3',
      },
    },
  },

  // ==================== 错义突变 ====================
  '错义突变': {
    concept: '错义突变',
    definition: '导致编码氨基酸改变的突变',
    principles: [
      '改变一个氨基酸',
      '可能影响蛋白质功能',
      '分为保守性和非保守性替换',
      '效应取决于氨基酸性质差异',
    ],
    formulas: [],
    examples: [
      {
        name: '镰刀型细胞贫血症',
        description: 'Glu→Val，非保守性替换',
      },
    ],
    misconceptions: [
      '错义突变不一定有害',
      '有些错义突变影响较小',
      '错义突变是分子进化的重要方式',
    ],
    visualization: {
      title: '错义突变示意图',
      description: '展示氨基酸的改变',
      type: 'diagram',
      elements: ['原始氨基酸', '突变氨基酸', '蛋白质功能影响'],
      colors: {
        original: '#4CAF50',
        mutated: '#FF4444',
        conservative: '#FF9800',
      },
    },
  },

  // ==================== 无义突变 ====================
  '无义突变': {
    concept: '无义突变',
    definition: '使编码氨基酸的密码子变成终止密码子的突变',
    principles: [
      '产生提前终止密码子',
      '导致蛋白质截断',
      '通常严重影响蛋白质功能',
      '可能触发mRNA降解',
    ],
    formulas: [],
    examples: [
      {
        name: '无义突变',
        description: '如CAG→TAG，Gln→终止',
      },
    ],
    misconceptions: [
      '无义突变通常有害',
      '截短的蛋白质可能不稳定',
      '无义突变的致病性取决于位置',
    ],
    visualization: {
      title: '无义突变示意图',
      description: '展示提前终止密码子的产生',
      type: 'diagram',
      elements: ['正常蛋白质', '截断蛋白质', '终止密码子'],
      colors: {
        normal: '#4CAF50',
        truncated: '#FF4444',
        stop: '#FF0000',
      },
    },
  },

  // ==================== DNA修复 ====================
  'DNA修复': {
    concept: 'DNA修复',
    definition: '细胞内修复DNA损伤的一系列机制',
    principles: [
      '包括直接修复、切除修复、重组修复',
      '维持基因组稳定性',
      '防止突变积累',
      '多种修复途径协同工作',
    ],
    formulas: [],
    examples: [
      {
        name: '光复活',
        description: '光裂合酶直接修复嘧啶二聚体',
      },
      {
        name: '核苷酸切除修复',
        description: '切除修复胸腺嘧啶二聚体',
      },
    ],
    misconceptions: [
      'DNA修复不是100%准确',
      '有些DNA损伤无法修复',
      'DNA修复缺陷导致遗传病和癌症',
    ],
    visualization: {
      title: 'DNA修复机制图',
      description: '展示不同的DNA修复途径',
      type: 'diagram',
      elements: ['直接修复', '切除修复', '重组修复', 'SOS修复'],
      colors: {
        direct: '#4CAF50',
        excision: '#2196F3',
        recombination: '#FF9800',
        sos: '#FF4444',
      },
    },
  },

  // ==================== 基因频率 ====================
  '基因频率': {
    concept: '基因频率',
    definition: '群体中某个等位基因占该基因座所有等位基因的比例',
    principles: [
      '用p和q表示二态基因座',
      'p + q = 1',
      '基因频率反映群体遗传组成',
      '可通过基因型频率计算',
    ],
    formulas: [
      {
        key: '基因频率计算',
        latex: 'p = \\frac{2N_{AA} + N_{Aa}}{2N}',
        variables: {
          'p': '显性基因频率',
          'N_AA': 'AA个体数',
          'N_Aa': 'Aa个体数',
          'N': '总个体数',
        },
      },
    ],
    examples: [
      {
        name: 'MN血型',
        description: '通过MN血型分布计算M和N基因频率',
      },
    ],
    misconceptions: [
      '基因频率不同于基因型频率',
      '基因频率可以用哈代-温伯格定律估计',
      '基因频率可以随时间变化',
    ],
    visualization: {
      title: '基因频率示意图',
      description: '展示基因频率的概念',
      type: 'chart',
      elements: ['基因库', '等位基因比例', '群体遗传'],
      colors: {
        p: '#4CAF50',
        q: '#FF9800',
      },
    },
  },

  // ==================== 基因型频率 ====================
  '基因型': {
    concept: '基因型频率',
    definition: '群体中某基因型个体占该基因座所有基因型个体的比例',
    principles: [
      '包括AA、Aa、aa三种基因型频率',
      '基因型频率之和等于1',
      '基因型频率由基因频率决定',
      '受随机交配影响',
    ],
    formulas: [
      {
        key: '哈代-温伯格平衡',
        latex: 'p^2 + 2pq + q^2 = 1',
        variables: {
          'p²': 'AA基因型频率',
          '2pq': 'Aa基因型频率',
          'q²': 'aa基因型频率',
        },
      },
    ],
    examples: [
      {
        name: '基因型分布',
        description: '通过基因型频率计算基因频率',
      },
    ],
    misconceptions: [
      '基因型频率不等于基因频率',
      '基因型频率在不同群体中不同',
      '基因型频率受自然选择影响',
    ],
    visualization: {
      title: '基因型频率分布图',
      description: '展示基因型频率的分布',
      type: 'chart',
      elements: ['AA', 'Aa', 'aa', '频率'],
      colors: {
        AA: '#4CAF50',
        Aa: '#FF9800',
        aa: '#2196F3',
      },
    },
  },

  // ==================== 遗传平衡 ====================
  '遗传平衡': {
    concept: '遗传平衡',
    definition: '群体中基因频率和基因型频率保持稳定的状态',
    principles: [
      '理想群体达到遗传平衡',
      '符合哈代-温伯格定律',
      '需要五个条件',
      '是理论基准状态',
    ],
    formulas: [
      {
        key: '哈代-温伯格平衡',
        latex: 'p + q = 1, \\quad p^2 + 2pq + q^2 = 1',
        variables: {
          'p': '显性基因频率',
          'q': '隐性基因频率',
        },
      },
    ],
    examples: [
      {
        name: '理想群体',
        description: '无限大、随机交配、无突变、无迁移、无选择的群体',
      },
    ],
    misconceptions: [
      '自然群体很少完全处于遗传平衡',
      '遗传平衡是动态平衡',
      '偏离平衡提示进化因素存在',
    ],
    visualization: {
      title: '遗传平衡示意图',
      description: '展示遗传平衡时基因型频率的分布',
      type: 'chart',
      elements: ['基因型频率', '平衡分布', '群体遗传'],
      colors: {},
    },
  },

  // ==================== 遗传漂变 ====================
  '遗传漂变': {
    concept: '遗传漂变',
    definition: '基因频率在小群体中的随机波动',
    principles: [
      '随机改变基因频率',
      '在小群体中效应显著',
      '可以导致基因固定或丢失',
      '与自然选择不同',
    ],
    formulas: [],
    examples: [
      {
        name: '奠基者效应',
        description: '小群体建立时基因频率随机变化',
      },
      {
        name: '瓶颈效应',
        description: '群体数量锐减后基因频率改变',
      },
    ],
    misconceptions: [
      '遗传漂变是随机的',
      '遗传漂变在所有群体中都存在',
      '小群体中漂变效应更强',
    ],
    visualization: {
      title: '遗传漂变示意图',
      description: '展示基因频率的随机波动',
      type: 'chart',
      elements: ['基因频率波动', '小群体', '随机性'],
      colors: {},
    },
  },

  // ==================== 奠基者效应 ====================
  '奠基者效应': {
    concept: '奠基者效应',
    definition: '由少数个体建立新群体导致的基因频率改变',
    principles: [
      '小群体建立新种群',
      '奠基者基因频率不代表源群体',
      '遗传多样性降低',
      '是遗传漂变的一种',
    ],
    formulas: [],
    examples: [
      {
        name: '人类种群',
        description: '人类走出非洲时的奠基者效应',
      },
    ],
    misconceptions: [
      '奠基者效应导致遗传多样性低',
      '奠基者效应不可逆',
      '对物种进化有重要影响',
    ],
    visualization: {
      title: '奠基者效应示意图',
      description: '展示小群体建立新群体的过程',
      type: 'diagram',
      elements: ['源群体', '奠基者', '新群体', '基因频率改变'],
      colors: {
        source: '#4CAF50',
        founders: '#FF9800',
        new: '#2196F3',
      },
    },
  },

  // ==================== 瓶颈效应 ====================
  '瓶颈效应': {
    concept: '瓶颈效应',
    definition: '群体数量急剧减少后基因频率的随机改变',
    principles: [
      '群体数量临时锐减',
      '生存个体的基因频率随机改变',
      '遗传多样性降低',
      '即使群体恢复，多样性也难恢复',
    ],
    formulas: [],
    examples: [
      {
        name: '猎豹',
        description: '猎豹经历过瓶颈效应，遗传多样性极低',
      },
    ],
    misconceptions: [
      '瓶颈效应后遗传多样性永久降低',
      '瓶颈效应可能导致近交衰退',
      '瓶颈效应是遗传漂变的一种',
    ],
    visualization: {
      title: '瓶颈效应示意图',
      description: '展示群体数量变化和基因频率改变',
      type: 'chart',
      elements: ['群体数量', '瓶颈', '基因频率变化'],
      colors: {},
    },
  },

  // ==================== 基因流 ====================
  '基因流': {
    concept: '基因流',
    definition: '等位基因在不同群体间的迁移',
    principles: [
      '通过个体迁移或配子传播',
      '增加群体间遗传相似性',
      '减少群体间遗传差异',
      '与遗传漂变作用相反',
    ],
    formulas: [],
    examples: [
      {
        name: '花粉传播',
        description: '花粉在不同植物群体间传播基因',
      },
    ],
    misconceptions: [
      '基因流使群体趋于相似',
      '基因流可以引入新等位基因',
      '地理隔离阻止基因流',
    ],
    visualization: {
      title: '基因流示意图',
      description: '展示基因在群体间的流动',
      type: 'diagram',
      elements: ['群体间迁移', '基因流动', '遗传相似性'],
      colors: {},
    },
  },

  // ==================== 自然选择 ====================
  '自然选择': {
    concept: '自然选择',
    definition: '适者生存，适应性更强的个体留下更多后代',
    principles: [
      '性状存在变异',
      '变异可遗传',
      '资源有限导致竞争',
      '有利性状被选择',
    ],
    formulas: [],
    examples: [
      {
        name: '工业黑化现象',
        description: '桦尺蠖在工业化地区的黑化适应',
      },
    ],
    misconceptions: [
      '自然选择不是唯一的进化因素',
      '自然选择作用于个体而非群体',
      '自然选择可以作用于任何可遗传性状',
    ],
    visualization: {
      title: '自然选择示意图',
      description: '展示自然选择的作用过程',
      type: 'diagram',
      elements: ['变异', '竞争', '选择', '适应'],
      colors: {
        fit: '#4CAF50',
        unfit: '#FF4444',
      },
    },
  },

  // ==================== 定向选择 ====================
  '定向选择': {
    concept: '定向选择',
    definition: '选择某一极端表型的自然选择',
    principles: [
      '偏好某一极端表型',
      '导致平均性状值改变',
      '推动群体向一个方向进化',
      '常见于环境变化时',
    ],
    formulas: [],
    examples: [
      {
        name: '长颈鹿',
        description: '选择长颈的个体，导致群体颈长增加',
      },
    ],
    misconceptions: [
      '定向选择不一定长期持续',
      '环境改变可能改变选择方向',
      '定向选择减少遗传多样性',
    ],
    visualization: {
      title: '定向选择示意图',
      description: '展示选择对极端表型的偏好',
      type: 'chart',
      elements: ['表型分布', '方向选择', '平均值改变'],
      colors: {
        selected: '#4CAF50',
        eliminated: '#FF4444',
      },
    },
  },

  // ==================== 稳定选择 ====================
  '稳定选择': {
    concept: '稳定选择',
    definition: '选择中间表型，淘汰两极端的自然选择',
    principles: [
      '偏好中间型表型',
      '减少表型变异',
      '维持群体稳定',
      '在稳定环境中常见',
    ],
    formulas: [],
    examples: [
      {
        name: '婴儿体重',
        description: '过轻或过重的婴儿存活率较低',
      },
    ],
    misconceptions: [
      '稳定选择减少遗传多样性',
      '稳定选择不是保守选择',
      '环境改变可能转为其他选择',
    ],
    visualization: {
      title: '稳定选择示意图',
      description: '展示对中间型的偏好',
      type: 'chart',
      elements: ['表型分布', '中间型优势', '极端型淘汰'],
      colors: {
        middle: '#4CAF50',
        extremes: '#FF4444',
      },
    },
  },

  // ==================== 破坏性选择 ====================
  '破坏性选择': {
    concept: '破坏性选择',
    definition: '选择两个极端表型，淘汰中间型的自然选择',
    principles: [
      '偏好极端表型',
      '增加表型变异',
      '可能导致物种形成',
      '在异质环境中常见',
    ],
    formulas: [],
    examples: [
      {
        name: '鸟类喙大小',
        description: '大喙食大种子，小喙食小种子，中间型不利',
      },
    ],
    misconceptions: [
      '破坏性选择增加多样性',
      '可能导致种群分化',
      '比稳定选择少见',
    ],
    visualization: {
      title: '破坏性选择示意图',
      description: '展示对两个极端的偏好',
      type: 'chart',
      elements: ['表型分布', '极端优势', '中间淘汰'],
      colors: {
        extremes: '#4CAF50',
        middle: '#FF4444',
      },
    },
  },

  // ==================== 适合度 ====================
  '适合度': {
    concept: '适合度',
    definition: '个体将其基因传递给下一代的相对能力',
    principles: [
      '包括生存能力和繁殖能力',
      '是相对概念',
      '适应度的核心',
      '用W或f表示',
    ],
    formulas: [
      {
        key: '相对适合度',
        latex: 'w = \\frac{\\text{个体留存的平均后代数}}{\\text{种群平均后代数}}',
        variables: {
          'w': '相对适合度',
        },
      },
    ],
    examples: [
      {
        name: '工业黑化',
        description: '黑色桦尺蠖在污染环境中适合度更高',
      },
    ],
    misconceptions: [
      '适合度不等于生存',
      '繁殖能力也很重要',
      '适合度是相对的',
    ],
    visualization: {
      title: '适合度比较图',
      description: '展示不同基因型的适合度',
      type: 'chart',
      elements: ['基因型', '后代数', '相对适合度'],
      colors: {},
    },
  },

  // ==================== 表观遗传学 ====================
  '表观遗传学': {
    concept: '表观遗传学',
    definition: '研究基因表达的可遗传变化，不涉及DNA序列改变的学科',
    principles: [
      '不改变DNA序列',
      '可以遗传',
      '影响基因表达',
      '受环境影响',
    ],
    formulas: [],
    examples: [
      {
        name: 'DNA甲基化',
        description: 'CpG岛甲基化导致基因沉默',
      },
    ],
    misconceptions: [
      '表观遗传不是遗传的否定',
      '表观遗传变化是可逆的',
      '表观遗传在发育中很重要',
    ],
    visualization: {
      title: '表观遗传学机制',
      description: '展示表观遗传的调控机制',
      type: 'diagram',
      elements: ['DNA甲基化', '组蛋白修饰', '染色质重塑'],
      colors: {},
    },
  },

  // ==================== DNA甲基化 ====================
  'DNA甲基化': {
    concept: 'DNA甲基化',
    definition: 'DNA分子上添加甲基基团的修饰',
    principles: [
      '主要发生在CpG二核苷酸',
      '通常抑制基因转录',
      '在基因组印记中重要',
      '可以遗传',
    ],
    formulas: [],
    examples: [
      {
        name: 'X染色体失活',
        description: '通过DNA甲基化实现一条X染色体失活',
      },
    ],
    misconceptions: [
      '甲基化不总是抑制转录',
      '甲基化可以被去除',
      '甲基化是动态的',
    ],
    visualization: {
      title: 'DNA甲基化示意图',
      description: '展示DNA甲基化修饰',
      type: 'diagram',
      elements: ['CpG岛', '甲基基团', '基因沉默'],
      colors: {
        methylated: '#9E9E9E',
        unmethylated: '#4CAF50',
      },
    },
  },

  // ==================== 组蛋白修饰 ====================
  '组蛋白修饰': {
    concept: '组蛋白修饰',
    definition: '组蛋白N端尾巴的化学修饰',
    principles: [
      '包括乙酰化、甲基化、磷酸化等',
      '影响染色质结构',
      '调控基因表达',
      '是组蛋白密码的基础',
    ],
    formulas: [],
    examples: [
      {
        name: '组蛋白乙酰化',
        description: '乙酰化使染色质疏松，促进转录',
      },
    ],
    misconceptions: [
      '组蛋白修饰是动态的',
      '不同修饰有不同效应',
      '组蛋白修饰可被酶去除',
    ],
    visualization: {
      title: '组蛋白修饰示意图',
      description: '展示组蛋白的各种修饰',
      type: 'diagram',
      elements: ['组蛋白', '乙酰化', '甲基化', '磷酸化'],
      colors: {},
    },
  },

  // ==================== 染色质重塑 ====================
  '染色质重塑': {
    concept: '染色质重塑',
    definition: '通过消耗ATP改变染色质结构和位置的过程',
    principles: [
      '由染色质重塑复合体催化',
      '改变核小体位置',
      '影响DNA可及性',
      '调控基因表达',
    ],
    formulas: [],
    examples: [
      {
        name: 'SWI/SNF复合体',
        description: '重要的染色质重塑复合体',
      },
    ],
    misconceptions: [
      '染色质重塑需要ATP',
      '重塑影响DNA-蛋白质相互作用',
      '重塑在发育中很重要',
    ],
    visualization: {
      title: '染色质重塑示意图',
      description: '展示染色质重塑的过程',
      type: 'animation',
      elements: ['核小体', '重塑复合体', '染色质结构改变'],
      colors: {},
    },
  },
};
