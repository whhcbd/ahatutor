import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WebSearchInput, WebSearchOutput, SearchResult, SkillExecutionResult, SkillType } from '@shared/types/skill.types';
import {  } from '@shared/types/agent.types';

/**
 * 搜索提供商接口
 */
interface SearchProvider {
  search(query: string, options: WebSearchInput): Promise<SearchResult[]>;
}

/**
 * Tavily API 搜索提供商（推荐用于 AI 应用）
 * 文档: https://tavily.com/docs
 */
class TavilyProvider implements SearchProvider {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.tavily.com/search';
  private readonly logger = new Logger(TavilyProvider.name);

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async search(query: string, options: WebSearchInput): Promise<SearchResult[]> {
    if (!this.apiKey) {
      throw new Error('Tavily API key is not configured');
    }

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: this.apiKey,
          query: query,
          search_depth: 'basic',
          max_results: options.numResults || 5,
          include_answer: false,
          include_raw_content: false,
          include_images: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Tavily API error: ${response.statusText}`);
      }

      const data = await response.json();

      return data.results.map((result: any) => ({
        title: result.title,
        url: result.url,
        snippet: result.content,
        publishedDate: result.publishedDate,
        source: new URL(result.url).hostname,
        relevanceScore: result.score || 0.8,
      }));
    } catch (error) {
      this.logger.error('Tavily search failed:', error);
      throw error;
    }
  }
}

/**
 * Bing Web Search API 提供商
 * 文档: https://docs.microsoft.com/en-us/bing/search-apis/bing-web-search
 */
class BingProvider implements SearchProvider {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.bing.microsoft.com/v7.0/search';
  private readonly logger = new Logger(BingProvider.name);

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async search(query: string, options: WebSearchInput): Promise<SearchResult[]> {
    if (!this.apiKey) {
      throw new Error('Bing API key is not configured');
    }

    try {
      const url = new URL(this.baseUrl);
      url.searchParams.append('q', query);
      url.searchParams.append('count', String(options.numResults || 5));

      if (options.language) {
        url.searchParams.append('mkt', options.language === 'zh' ? 'zh-CN' : 'en-US');
      }

      if (options.safeSearch) {
        url.searchParams.append('safeSearch', 'Strict');
      }

      const response = await fetch(url.toString(), {
        headers: {
          'Ocp-Apim-Subscription-Key': this.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Bing API error: ${response.statusText}`);
      }

      const data = await response.json();

      return (data.webPages?.value || []).map((result: any) => ({
        title: result.name,
        url: result.url,
        snippet: result.snippet,
        source: new URL(result.url).hostname,
        relevanceScore: 0.8,
      }));
    } catch (error) {
      this.logger.error('Bing search failed:', error);
      throw error;
    }
  }
}

/**
 * SerpAPI 搜索提供商（支持 Google、Bing 等多种搜索引擎）
 * 文档: https://serpapi.com/search-api
 */
class SerpApiProvider implements SearchProvider {
  private readonly apiKey: string;
  private readonly engine: string;
  private readonly baseUrl = 'https://serpapi.com/search';
  private readonly logger = new Logger(SerpApiProvider.name);

  constructor(apiKey: string, engine: string = 'google') {
    this.apiKey = apiKey;
    this.engine = engine;
  }

  async search(query: string, options: WebSearchInput): Promise<SearchResult[]> {
    if (!this.apiKey) {
      throw new Error('SerpAPI key is not configured');
    }

    try {
      const url = new URL(this.baseUrl);
      url.searchParams.append('api_key', this.apiKey);
      url.searchParams.append('engine', this.engine);
      url.searchParams.append('q', query);
      url.searchParams.append('num', String(options.numResults || 5));

      if (options.language) {
        const langMap: Record<string, string> = {
          zh: 'lang_zh-CN',
          en: 'lang_en',
          ja: 'lang_ja',
        };
        url.searchParams.append('hl', langMap[options.language] || options.language);
      }

      if (options.safeSearch) {
        url.searchParams.append('safe', 'active');
      }

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`SerpAPI error: ${response.statusText}`);
      }

      const data = await response.json();

      return (data.organic_results || []).map((result: any) => ({
        title: result.title,
        url: result.link,
        snippet: result.snippet,
        source: new URL(result.link).hostname,
        relevanceScore: 0.8,
      }));
    } catch (error) {
      this.logger.error('SerpAPI search failed:', error);
      throw error;
    }
  }
}

/**
 * 模拟搜索提供商（用于开发测试）
 */
class MockSearchProvider implements SearchProvider {
  private readonly logger = new Logger(MockSearchProvider.name);

  async search(query: string, _options: WebSearchInput): Promise<SearchResult[]> {
    this.logger.log(`Mock search for: ${query}`);

    return [
      {
        title: `关于"${query}"的遗传学研究进展`,
        url: 'https://example.com/genetics/research',
        snippet: `最新的${query}研究显示，遗传学领域正在快速发展。科学家们发现了新的基因调控机制...`,
        source: 'example.com',
        relevanceScore: 0.95,
      },
      {
        title: `${query}教学资源 - 大学遗传学课程`,
        url: 'https://example.edu/genetics/course',
        snippet: `本课程涵盖${query}的核心概念，包括孟德尔定律、基因互作和表观遗传学等内容...`,
        source: 'example.edu',
        relevanceScore: 0.88,
      },
      {
        title: `遗传学${query}最新发现 - Nature Genetics`,
        url: 'https://nature.com/genetics/discovery',
        snippet: `Nature Genetics 报道了关于${query}的重大突破，这一发现可能改变我们对遗传学的理解...`,
        source: 'nature.com',
        relevanceScore: 0.92,
      },
    ];
  }
}

/**
 * 联网搜索服务
 *
 * 功能：
 * - 实时检索最新遗传学资讯
 * - 补充教材外知识
 * - 支持多个搜索提供商
 */
@Injectable()
export class WebSearchService {
  private readonly logger = new Logger(WebSearchService.name);
  private provider: SearchProvider;

  constructor(private readonly configService: ConfigService) {
    const providerType = this.configService.get<string>('WEB_SEARCH_PROVIDER', 'mock');

    switch (providerType) {
      case 'tavily':
        const tavilyKey = this.configService.get<string>('TAVILY_API_KEY');
        this.provider = new TavilyProvider(tavilyKey || '');
        this.logger.log('Using Tavily search provider');
        break;
      case 'bing':
        const bingKey = this.configService.get<string>('BING_API_KEY');
        this.provider = new BingProvider(bingKey || '');
        this.logger.log('Using Bing search provider');
        break;
      case 'serpapi':
        const serpKey = this.configService.get<string>('SERPAPI_API_KEY');
        const serpEngine = this.configService.get<string>('SERPAPI_ENGINE', 'google');
        this.provider = new SerpApiProvider(serpKey || '', serpEngine);
        this.logger.log(`Using SerpAPI search provider with ${serpEngine} engine`);
        break;
      case 'mock':
      default:
        this.provider = new MockSearchProvider();
        this.logger.warn('Using mock search provider (for development only)');
    }
  }

  /**
   * 执行联网搜索
   */
  async search(input: WebSearchInput): Promise<SkillExecutionResult<WebSearchOutput>> {
    const startTime = Date.now();

    try {
      this.logger.log(`Searching for: ${input.query}`);

      // 调用搜索提供商
      const results = await this.provider.search(input.query, input);

      const processingTime = Date.now() - startTime;
      this.logger.log(`Search completed in ${processingTime}ms, found ${results.length} results`);

      return {
        skill: SkillType.WEB_SEARCH,
        success: true,
        data: {
          query: input.query,
          results: results,
          totalCount: results.length,
          searchTime: processingTime,
          hasMore: false,
        },
        metadata: {
          processingTime,
          cached: false,
        },
      };
    } catch (error) {
      this.logger.error('Search failed:', error);

      return {
        skill: SkillType.WEB_SEARCH,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: {
          processingTime: Date.now() - startTime,
        },
      };
    }
  }

  /**
   * 搜索与概念相关的最新资讯
   */
  async searchForConcept(concept: string, options?: Partial<WebSearchInput>): Promise<WebSearchOutput> {
    const result = await this.search({
      query: `遗传学 ${concept} 最新研究`,
      numResults: 5,
      language: 'zh',
      ...options,
    });

    if (!result.success || !result.data) {
      throw new Error(result.error || 'Search failed');
    }

    return result.data;
  }

  /**
   * 搜索补充教材外知识
   */
  async searchSupplementaryKnowledge(topic: string): Promise<SearchResult[]> {
    const result = await this.search({
      query: `${topic} 详细解释 教程`,
      numResults: 3,
      language: 'zh',
    });

    if (result.success && result.data) {
      return result.data.results;
    }

    return [];
  }
}
