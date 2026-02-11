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
        { name: 'Cas9核酸酶', function: '切割DNA产生双链断裂' },
        { name: '向导RNA(gRNA)', function: '引导Cas9识别目标DNA序列' },
        { name: 'PAM序列', function: 'Cas9识别所必需（NGG）' },
        { name: '供体DNA（可选）', function: '用于同源重组修复，实现精准编辑' }
      ],
      repairPathways: [
        {
          name: '非同源末端连接(NHEJ)',
          outcome: '易出错，产生插入或缺失',
          application: '基因敲除'
        },
        {
          name: '同源定向修复(HDR)',
          outcome: '精确修复，需要供体DNA模板',
          application: '基因敲入、点突变修复'
        }
      ],
      applications: [
        '基因敲除（研究基因功能）',
        '基因治疗（修复致病突变）',
        '转基因生物培育',
        '疾病模型构建',
        '基因驱动（控制蚊虫等）'
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
  }
};
