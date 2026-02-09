/**
 * 共享常量定义
 */

// API 路径常量
export const API_PATHS = {
  // RAG 服务
  RAG: {
    UPLOAD: '/api/rag/upload',
    QUERY: '/api/rag/query',
    CHAT: '/api/rag/chat',
    DOCUMENTS: '/api/rag/documents',
  },
  // LLM 服务
  LLM: {
    CHAT: '/api/llm/chat',
    STREAM: '/api/llm/stream',
    COMPLETION: '/api/llm/completion',
  },
  // Agent 服务
  AGENT: {
    ANALYZE: '/api/agent/analyze',
    EXPLORE: '/api/agent/explore',
    ENRICH: '/api/agent/enrich',
    PIPELINE: '/api/agent/pipeline',
  },
  // 题目服务
  QUIZ: {
    GENERATE: '/api/quiz/generate',
    SUBMIT: '/api/quiz/submit',
    FEEDBACK: '/api/quiz/feedback',
  },
  // 错题服务
  MISTAKE: {
    UPLOAD: '/api/mistake/upload',
    LIST: '/api/mistake/list',
    SIMILAR: '/api/mistake/similar',
  },
  // 报告服务
  REPORT: {
    GENERATE: '/api/report/generate',
    EXPORT: '/api/report/export',
  },
  // 知识图谱
  GRAPH: {
    QUERY: '/api/graph/query',
    PATH: '/api/graph/path',
  },
} as const;

// 遗传学核心知识点
export const GENETICS_TOPICS = [
  // 基础概念
  '基因',
  '染色体',
  'DNA',
  'RNA',
  '基因型',
  '表型',
  '显性',
  '隐性',
  '纯合子',
  '杂合子',

  // 孟德尔定律
  '孟德尔第一定律',
  '孟德尔第二定律',
  '分离定律',
  '自由组合定律',

  // 伴性遗传
  '伴性遗传',
  '性染色体',
  '常染色体',
  'X连锁遗传',
  'Y连锁遗传',
  '红绿色盲',

  // 连锁互换
  '连锁遗传',
  '互换',
  '基因连锁图',
  '重组率',

  // 群体遗传学
  '哈代-温伯格定律',
  '基因频率',
  '基因型频率',
  '遗传漂变',
  '基因流动',

  // 数量遗传
  '数量性状',
  '质量性状',
  '多基因遗传',

  // 突变
  '基因突变',
  '染色体变异',
  '点突变',
  '移码突变',

  // 分子遗传学
  '转录',
  '翻译',
  '密码子',
  '启动子',
  '操纵子',
] as const;

// 解析等级常量
export const EXPLANATION_LEVELS = {
  LEVEL1: { value: 1, name: '最简练', description: '只给出核心结论' },
  LEVEL2: { value: 2, name: '简要解释', description: '一句话说明' },
  LEVEL3: { value: 3, name: '标准解析', description: '包含完整说明' },
  LEVEL4: { value: 4, name: '详细讲解', description: '添加原理说明' },
  LEVEL5: { value: 5, name: '教学级解析', description: '从基础开始完整推导' },
} as const;

// 艾宾浩斯复习间隔（天）
export const EBBINGHAUS_INTERVALS = [1, 2, 4, 7, 15, 30, 60, 120] as const;

// 错误类型
export const ERROR_TYPES = {
  LOW_LEVEL: {
    key: 'low_level',
    name: '低级错误',
    description: '笔误、手滑、计算失误',
    color: '#FFA500',
  },
  HIGH_LEVEL: {
    key: 'high_level',
    name: '高级错误',
    description: '概念不理解、原理不清楚',
    color: '#FF4444',
  },
} as const;

// 速通模式状态
export const SPEED_MODE_STATES = {
  IDLE: 'idle',
  QUESTIONING: 'questioning',
  ANSWERING: 'answering',
  EVALUATING: 'evaluating',
  SELF_ASSESS: 'self_assess',
  EXPLAINING: 'explaining',
  CONTINUING: 'continuing',
} as const;

// 学情报告类型
export const REPORT_TYPES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  SUBJECT: 'subject',
  MISTAKE: 'mistake',
} as const;

// HTTP 状态码
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// 默认配置
export const DEFAULT_CONFIG = {
  QUIZ: {
    DEFAULT_QUESTION_COUNT: 10,
    DEFAULT_TIME_LIMIT: 0, // 不限时
    DEFAULT_EXPLANATION_LEVEL: 3,
  },
  RAG: {
    CHUNK_SIZE: 1000,
    CHUNK_OVERLAP: 200,
    TOP_K: 5,
    THRESHOLD: 0.7,
  },
  LLM: {
    DEFAULT_TEMPERATURE: 0.7,
    DEFAULT_MAX_TOKENS: 2000,
    STREAM_CHUNK_SIZE: 100,
  },
} as const;
