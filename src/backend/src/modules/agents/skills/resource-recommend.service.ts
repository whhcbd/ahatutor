import { Injectable, Logger } from '@nestjs/common';
import { LLMService } from '../../llm/llm.service';
import { WebSearchService } from './web-search.service';
import {
  ResourceRecommendInput,
  ResourceRecommendOutput,
  ResourceRecommendation,
  ResourceType,
  SkillExecutionResult,
  SkillType,
} from '@shared/types/skill.types';

/**
 * 资源推荐服务
 *
 * 功能：
 * - 根据学习进度推荐相关资源
 * - 视频教程、文献推荐
 * - 支持多种资源类型
 */
@Injectable()
export class ResourceRecommendService {
  private readonly logger = new Logger(ResourceRecommendService.name);

  // 预定义的遗传学学习资源库（可以扩展为数据库）
  private readonly curatedResources: Record<string, ResourceRecommendation[]> = {
    // 视频资源
    '伴性遗传': [
      {
        id: 'crs-001',
        type: ResourceType.VIDEO,
        title: '伴性遗传原理详解 - Khan Academy',
        description: '通过动画和实例讲解伴性遗传的基本原理，包括红绿色盲、血友病等经典案例。',
        url: 'https://www.khanacademy.org/science/biology/classical-genetics',
        author: 'Khan Academy',
        duration: 1800, // 30分钟
        difficulty: 'beginner',
        tags: ['伴性遗传', '遗传学', '基础'],
        rating: 4.8,
        relevanceScore: 0.95,
        source: 'curated',
      },
      {
        id: 'crs-002',
        type: ResourceType.VIDEO,
        title: '果蝇伴性遗传实验 - 虚拟实验室',
        description: '交互式虚拟实验，模拟摩尔根的果蝇实验，探索伴性遗传的发现过程。',
        url: 'https://phet.colorado.edu/en/simulations/genetics',
        author: 'PhET Interactive Simulations',
        duration: 2400, // 40分钟
        difficulty: 'intermediate',
        tags: ['伴性遗传', '实验', '虚拟实验室'],
        rating: 4.9,
        relevanceScore: 0.92,
        source: 'curated',
      },
    ],
    '孟德尔定律': [
      {
        id: 'crs-003',
        type: ResourceType.VIDEO,
        title: '孟德尔豌豆实验完整解析',
        description: '从孟德尔的豌豆实验出发，详细讲解分离定律和自由组合定律的发现过程和现代应用。',
        url: 'https://www.youtube.com/watch?v=example',
        author: 'Crash Course Biology',
        duration: 720, // 12分钟
        difficulty: 'beginner',
        tags: ['孟德尔定律', '分离定律', '自由组合定律'],
        rating: 4.7,
        relevanceScore: 0.93,
        source: 'curated',
      },
    ],
    '连锁互换': [
      {
        id: 'crs-004',
        type: ResourceType.INTERACTIVE,
        title: '基因连锁与互换 - 交互式学习模块',
        description: '通过交互式图表理解基因连锁现象和互换机制，学习如何进行遗传作图。',
        url: 'https://learn.genetics.utah.edu/',
        author: 'University of Utah',
        duration: 1500,
        difficulty: 'intermediate',
        tags: ['连锁互换', '基因作图', '染色体重组'],
        rating: 4.8,
        relevanceScore: 0.90,
        source: 'curated',
      },
    ],
  };

  constructor(
    private readonly llmService: LLMService,
    private readonly webSearchService: WebSearchService,
  ) {}

  /**
   * 推荐学习资源
   */
  async recommend(
    input: ResourceRecommendInput,
  ): Promise<SkillExecutionResult<ResourceRecommendOutput>> {
    const startTime = Date.now();

    try {
      this.logger.log(`Recommending resources for: ${input.concept}`);

      // 1. 首先检查预定义资源库
      const curated = this.getCuratedResources(
        input.concept,
        input.userLevel,
        input.preferredTypes,
      );

      // 2. 如果预定义资源不足，使用网络搜索补充
      let additional: ResourceRecommendation[] = [];
      if (curated.length < (input.count || 5)) {
        additional = await this.searchAdditionalResources(input);
      }

      // 3. 合并并排序结果
      const allRecommendations = [...curated, ...additional]
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, input.count || 5);

      const processingTime = Date.now() - startTime;
      this.logger.log(`Recommendation completed in ${processingTime}ms, found ${allRecommendations.length} resources`);

      return {
        skill: SkillType.RESOURCE_RECOMMEND,
        success: true,
        data: {
          concept: input.concept,
          recommendations: allRecommendations,
          totalCount: allRecommendations.length,
          filters: {
            types: input.preferredTypes || [ResourceType.VIDEO, ResourceType.ARTICLE],
            difficulty: input.userLevel || 'intermediate',
          },
        },
        metadata: {
          processingTime,
          cached: curated.length > 0,
        },
      };
    } catch (error) {
      this.logger.error('Recommendation failed:', error);

      return {
        skill: SkillType.RESOURCE_RECOMMEND,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: {
          processingTime: Date.now() - startTime,
        },
      };
    }
  }

  /**
   * 获取预定义的资源
   */
  private getCuratedResources(
    concept: string,
    userLevel?: 'beginner' | 'intermediate' | 'advanced',
    preferredTypes?: ResourceType[],
  ): ResourceRecommendation[] {
    const resources = this.curatedResources[concept] || [];

    return resources.filter(resource => {
      // 过滤难度等级
      if (userLevel && resource.difficulty && resource.difficulty !== userLevel) {
        // 允许上一个/下一个等级
        const levels: Array<'beginner' | 'intermediate' | 'advanced'> = ['beginner', 'intermediate', 'advanced'];
        const currentLevelIndex = levels.indexOf(userLevel);
        const resourceLevelIndex = levels.indexOf(resource.difficulty);
        if (Math.abs(currentLevelIndex - resourceLevelIndex) > 1) {
          return false;
        }
      }

      // 过滤资源类型
      if (preferredTypes && preferredTypes.length > 0) {
        if (!preferredTypes.includes(resource.type)) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * 使用网络搜索补充资源
   */
  private async searchAdditionalResources(
    input: ResourceRecommendInput,
  ): Promise<ResourceRecommendation[]> {
    try {
      // 构建搜索查询
      const searchQuery = this.buildSearchQuery(input);

      // 执行搜索
      const searchResult = await this.webSearchService.search({
        query: searchQuery,
        numResults: (input.count || 5) * 2, // 多搜索一些以供筛选
        language: input.language || 'zh',
      });

      if (!searchResult.success || !searchResult.data) {
        return [];
      }

      // 使用 LLM 分析和评分搜索结果
      const analyzed = await this.analyzeSearchResults(
        input.concept,
        searchResult.data.results,
        input.userLevel,
      );

      return analyzed;
    } catch (error) {
      this.logger.error('Failed to search additional resources:', error);
      return [];
    }
  }

  /**
   * 构建搜索查询
   */
  private buildSearchQuery(input: ResourceRecommendInput): string {
    const concept = input.concept;
    const level = input.userLevel || 'intermediate';
    const types = input.preferredTypes || [];

    const levelKeywords = {
      beginner: '入门 基础 教程',
      intermediate: '中级 进阶',
      advanced: '高级 专业 深入',
    };

    const typeKeywords = {
      [ResourceType.VIDEO]: '视频',
      [ResourceType.ARTICLE]: '文章 文档',
      [ResourceType.PAPER]: '论文',
      [ResourceType.BOOK]: '电子书',
      [ResourceType.COURSE]: '课程',
      [ResourceType.INTERACTIVE]: '交互 互动',
    };

    let query = `遗传学 ${concept} ${levelKeywords[level]}`;

    if (types.length > 0) {
      const typeKeywordsStr = types.map(t => typeKeywords[t]).join(' ');
      query += ` ${typeKeywordsStr}`;
    }

    return query;
  }

  /**
   * 使用 LLM 分析搜索结果并提取结构化信息
   */
  private async analyzeSearchResults(
    concept: string,
    results: Array<{ title: string; url: string; snippet: string }>,
    userLevel?: 'beginner' | 'intermediate' | 'advanced',
  ): Promise<ResourceRecommendation[]> {
    try {
      const prompt = `分析以下搜索结果，提取适合学习"${concept}"的资源信息。

用户水平：${userLevel || 'intermediate'}

搜索结果：
${results.map((r, i) => `${i + 1}. 标题: ${r.title}\n   URL: ${r.url}\n   摘要: ${r.snippet}`).join('\n\n')}

请分析每个结果，返回 JSON 格式：
{
  "resources": [
    {
      "id": "unique_id",
      "type": "video|article|paper|book|course|interactive",
      "title": "资源标题",
      "description": "简短描述（100字以内）",
      "url": "原始URL",
      "difficulty": "beginner|intermediate|advanced",
      "tags": ["标签1", "标签2"],
      "relevanceScore": 0.85
    }
  ]
}

注意：
- 只分析真正相关的学习资源
- type 根据来源判断（youtube/bilibili=video, arxiv/nature=paper, etc.）
- relevanceScore 范围 0-1，表示与概念的相关性
- 过滤掉明显不相关的结果`;

      interface AnalyzedResource {
        id: string;
        type: ResourceType;
        title: string;
        description: string;
        url: string;
        difficulty: 'beginner' | 'intermediate' | 'advanced';
        tags: string[];
        relevanceScore: number;
      }

      interface AnalyzedResourcesResponse {
        resources: AnalyzedResource[];
      }

      const response = await this.llmService.structuredChat<AnalyzedResourcesResponse>(
        [{ role: 'user', content: prompt }],
        {},
      );

      // 确保每个资源都有必要的字段
      return (response.resources || []).map((resource, index) => ({
        id: resource.id || `generated-${index}`,
        type: resource.type || ResourceType.ARTICLE,
        title: resource.title,
        description: resource.description,
        url: resource.url,
        difficulty: resource.difficulty || 'intermediate',
        tags: resource.tags || [],
        relevanceScore: resource.relevanceScore || 0.5,
        source: 'web_search',
      }));
    } catch (error) {
      this.logger.error('Failed to analyze search results:', error);
      return [];
    }
  }

  /**
   * 为学习路径推荐资源
   */
  async recommendForLearningPath(
    concepts: string[],
    userLevel?: 'beginner' | 'intermediate' | 'advanced',
  ): Promise<Map<string, ResourceRecommendation[]>> {
    const resourceMap = new Map<string, ResourceRecommendation[]>();

    for (const concept of concepts) {
      const result = await this.recommend({
        concept,
        userLevel,
        count: 3,
      });

      if (result.success && result.data) {
        resourceMap.set(concept, result.data.recommendations);
      }
    }

    return resourceMap;
  }
}
