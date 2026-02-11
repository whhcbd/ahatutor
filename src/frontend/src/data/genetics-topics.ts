/**
 * 遗传学知识点列表
 * 用于速通模式的轮询出题
 */

export const GENETICS_TOPICS = [
  // 经典遗传学
  '孟德尔第一定律',
  '孟德尔第二定律',
  '伴性遗传',
  '连锁互换',
  '基因型与表型',
  '显性与隐性遗传',
  '不完全显性',
  '共显性',
  '复等位基因',
  '多基因遗传',

  // 分子遗传学
  'DNA复制',
  '转录与翻译',
  '基因突变',
  '染色体变异',
  '基因重组',
  '中心法则',
  '基因表达调控',
  '表观遗传学',
  'RNA干扰',
  'PCR技术',

  // 细胞遗传学
  '减数分裂',
  '有丝分裂',
  '染色体结构',
  '核型分析',
  '染色体畸变',
  '单倍体与多倍体',

  // 群体遗传学
  '哈代-温伯格定律',
  '基因频率',
  '遗传漂变',
  '自然选择',
  '物种形成',

  // 应用遗传学
  '遗传咨询',
  '基因检测',
  '基因治疗',
  '转基因技术',
  '克隆技术',
  '人类基因组计划',

  // 特殊遗传现象
  '母系遗传',
  '基因组印记',
  '线粒体遗传',
  '限制性片段长度多态性',
  '嵌合体',
  '镶嵌现象',
  'X染色体失活',
  '三体综合征',

  // 遗传病相关
  '常染色体显性遗传病',
  '常染色体隐性遗传病',
  'X连锁显性遗传病',
  'X连锁隐性遗传病',
  '唐氏综合征',
  '苯丙酮尿症',
  '白化病',
  '血友病',
  '色盲',
  '镰刀型细胞贫血症',

  // 基因工程与生物技术
  '限制性内切酶',
  'DNA连接酶',
  '质粒载体',
  '基因文库',
  'DNA指纹技术',
  'Southern杂交',
  'Northern杂交',
  'Western杂交',
  '荧光原位杂交',
  '基因敲除技术',
  'CRISPR-Cas9技术',
  '干细胞技术',

  // 遗传学实验方法
  '孟德尔杂交实验',
  '测交实验',
  '果蝇遗传实验',
  '肺炎双球菌转化实验',
  '噬菌体侵染实验',
  'DNA双螺旋模型',
  '格里菲斯实验',
  '艾弗里实验',
  '赫尔希-蔡斯实验',

  // 数量遗传学
  '数量性状',
  '质量性状',
  '遗传率',
  '广义遗传率',
  '狭义遗传率',
  '加性效应',
  '显性效应',
  '上位性效应',

  // 发育遗传学
  '同源异形基因',
  '发育调控基因',
  '细胞分化',
  '细胞凋亡',
  '胚胎发育遗传控制',
];

// 按分类导出，方便按需使用
export const CLASSICAL_GENETICS = GENETICS_TOPICS.slice(0, 10);
export const MOLECULAR_GENETICS = GENETICS_TOPICS.slice(10, 20);
export const CYTOGENETICS = GENETICS_TOPICS.slice(20, 26);
export const POPULATION_GENETICS = GENETICS_TOPICS.slice(26, 31);
export const APPLIED_GENETICS = GENETICS_TOPICS.slice(31, 37);
export const SPECIAL_GENETICS = GENETICS_TOPICS.slice(37, 45);
export const GENETIC_DISEASES = GENETICS_TOPICS.slice(45, 55);
export const GENETIC_ENGINEERING = GENETICS_TOPICS.slice(55, 67);
export const GENETIC_EXPERIMENTS = GENETICS_TOPICS.slice(67, 76);
export const QUANTITATIVE_GENETICS = GENETICS_TOPICS.slice(76, 84);
export const DEVELOPMENTAL_GENETICS = GENETICS_TOPICS.slice(84, 89);
