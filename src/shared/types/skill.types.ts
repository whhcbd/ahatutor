/**
 * Agent Skills 相关类型定义
 */

// Skill 类型枚举
export enum SkillType {
  WEB_SEARCH = 'web_search',          // 联网搜索
  RESOURCE_RECOMMEND = 'resource_recommend',  // 资源推荐
}

// 搜索结果类型
export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  publishedDate?: string;
  source: string;
  relevanceScore?: number;
}

// 联网搜索输入
export interface WebSearchInput {
  query: string;
  numResults?: number;       // 默认 5
  language?: string;         // 默认 'zh'
  timeRange?: 'day' | 'week' | 'month' | 'year' | 'all';
  safeSearch?: boolean;
}

// 联网搜索输出
export interface WebSearchOutput {
  query: string;
  results: SearchResult[];
  totalCount: number;
  searchTime: number;  // 毫秒
  hasMore: boolean;
}

// 资源类型
export enum ResourceType {
  VIDEO = 'video',          // 视频教程
  ARTICLE = 'article',      // 文章/文档
  PAPER = 'paper',          // 学术论文
  BOOK = 'book',            // 电子书
  COURSE = 'course',        // 在线课程
  INTERACTIVE = 'interactive',  // 交互式资源
}

// 资源推荐结果
export interface ResourceRecommendation {
  id: string;
  type: ResourceType;
  title: string;
  description: string;
  url?: string;
  author?: string;
  publisher?: string;
  duration?: number;        // 视频时长（秒）
  readingTime?: number;     // 阅读时间（分钟）
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  thumbnailUrl?: string;
  rating?: number;          // 0-5
  relevanceScore: number;   // 0-1
  source: string;           // 推荐来源
}

// 资源推荐输入
export interface ResourceRecommendInput {
  concept: string;
  userLevel?: 'beginner' | 'intermediate' | 'advanced';
  preferredTypes?: ResourceType[];
  language?: string;        // 默认 'zh'
  count?: number;           // 默认 5
  excludeSeen?: boolean;    // 排除已浏览资源
}

// 资源推荐输出
export interface ResourceRecommendOutput {
  concept: string;
  recommendations: ResourceRecommendation[];
  totalCount: number;
  filters?: {
    types: ResourceType[];
    difficulty: string;
  };
}

// Skill 执行结果
export interface SkillExecutionResult<T = unknown> {
  skill: SkillType;
  success: boolean;
  data?: T;
  error?: string;
  metadata?: {
    processingTime: number;
    cached?: boolean;
  };
}
