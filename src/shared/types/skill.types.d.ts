export declare enum SkillType {
    WEB_SEARCH = "web_search",
    RESOURCE_RECOMMEND = "resource_recommend"
}
export interface SearchResult {
    title: string;
    url: string;
    snippet: string;
    publishedDate?: string;
    source: string;
    relevanceScore?: number;
}
export interface WebSearchInput {
    query: string;
    numResults?: number;
    language?: string;
    timeRange?: 'day' | 'week' | 'month' | 'year' | 'all';
    safeSearch?: boolean;
}
export interface WebSearchOutput {
    query: string;
    results: SearchResult[];
    totalCount: number;
    searchTime: number;
    hasMore: boolean;
}
export declare enum ResourceType {
    VIDEO = "video",
    ARTICLE = "article",
    PAPER = "paper",
    BOOK = "book",
    COURSE = "course",
    INTERACTIVE = "interactive"
}
export interface ResourceRecommendation {
    id: string;
    type: ResourceType;
    title: string;
    description: string;
    url?: string;
    author?: string;
    publisher?: string;
    duration?: number;
    readingTime?: number;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    tags: string[];
    thumbnailUrl?: string;
    rating?: number;
    relevanceScore: number;
    source: string;
}
export interface ResourceRecommendInput {
    concept: string;
    userLevel?: 'beginner' | 'intermediate' | 'advanced';
    preferredTypes?: ResourceType[];
    language?: string;
    count?: number;
    excludeSeen?: boolean;
}
export interface ResourceRecommendOutput {
    concept: string;
    recommendations: ResourceRecommendation[];
    totalCount: number;
    filters?: {
        types: ResourceType[];
        difficulty: string;
    };
}
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
