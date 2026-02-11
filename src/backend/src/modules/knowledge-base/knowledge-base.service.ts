import { Injectable, Logger } from '@nestjs/common';
import { ConceptAnalysis, PrerequisiteNode, GeneticsEnrichment } from '@shared/types/agent.types';

// 导入各模块的概念分析数据
import { basicConceptsData } from './data/basic-concepts';
import { molecularGeneticsData } from './data/molecular-genetics';
import { mendelianGeneticsData } from './data/mendelian-genetics';
import { populationGeneticsData } from './data/population-genetics';
import { chromosomalGeneticsData } from './data/chromosomal-genetics';
import { modernTechniquesData } from './data/modern-techniques';
import { epigeneticsData } from './data/epigenetics';

// 导入前置知识数据
import { prerequisiteData } from './data/prerequisites';

// 导入遗传学丰富内容数据
import { enrichmentData } from './data/enrichment';

/**
 * 静态知识库服务
 * 提供预定义的遗传学概念数据，避免频繁调用 AI
 */
@Injectable()
export class KnowledgeBaseService {
  private readonly logger = new Logger(KnowledgeBaseService.name);

  // 预定义的遗传学概念数据库
  private readonly conceptDatabase = new Map<string, {
    analysis: ConceptAnalysis;
    prerequisites: PrerequisiteNode;
    enrichment: GeneticsEnrichment;
  }>();

  constructor() {
    this.initializeKnowledgeBase();
  }

  /**
   * 初始化知识库 - 从模块导入所有概念数据
   */
  private initializeKnowledgeBase() {
    // 合并所有模块的概念分析数据
    const allAnalysisData: Record<string, ConceptAnalysis> = {
      ...basicConceptsData,
      ...molecularGeneticsData,
      ...mendelianGeneticsData,
      ...populationGeneticsData,
      ...chromosomalGeneticsData,
      ...modernTechniquesData,
      ...epigeneticsData,
    };

    // 为每个概念添加前置知识和丰富内容
    for (const [conceptName, analysis] of Object.entries(allAnalysisData)) {
      this.conceptDatabase.set(conceptName, {
        analysis,
        prerequisites: this.getPrerequisitesFor(conceptName),
        enrichment: this.getEnrichmentFor(conceptName),
      });
    }

    this.logger.log(`Knowledge base initialized with ${this.conceptDatabase.size} concepts`);
  }

  /**
   * 检查概念是否存在于知识库中
   */
  hasConcept(concept: string): boolean {
    return this.conceptDatabase.has(concept);
  }

  /**
   * 获取概念分析
   */
  getConceptAnalysis(concept: string): ConceptAnalysis | null {
    const data = this.conceptDatabase.get(concept);
    return data?.analysis || null;
  }

  /**
   * 获取前置知识树
   */
  getPrerequisites(concept: string): PrerequisiteNode | null {
    const data = this.conceptDatabase.get(concept);
    return data?.prerequisites || null;
  }

  /**
   * 获取遗传学丰富内容
   */
  getEnrichment(concept: string): GeneticsEnrichment | null {
    const data = this.conceptDatabase.get(concept);
    return data?.enrichment || null;
  }

  /**
   * 获取完整的概念数据
   */
  getConceptData(concept: string) {
    return this.conceptDatabase.get(concept) || null;
  }

  /**
   * 搜索相关概念
   */
  searchConcepts(query: string): string[] {
    const results: string[] = [];
    const lowerQuery = query.toLowerCase();

    for (const concept of this.conceptDatabase.keys()) {
      if (concept.toLowerCase().includes(lowerQuery)) {
        results.push(concept);
      }
    }

    return results;
  }

  /**
   * 获取所有概念列表
   */
  getAllConcepts(): string[] {
    return Array.from(this.conceptDatabase.keys());
  }

  /**
   * 获取指定领域的概念
   */
  getConceptsByDomain(domain: string): string[] {
    const results: string[] = [];

    for (const [concept, data] of this.conceptDatabase.entries()) {
      if (data.analysis.domain === domain) {
        results.push(concept);
      }
    }

    return results;
  }

  /**
   * 获取指定复杂度的概念
   */
  getConceptsByComplexity(complexity: string): string[] {
    const results: string[] = [];

    for (const [concept, data] of this.conceptDatabase.entries()) {
      if (data.analysis.complexity === complexity) {
        results.push(concept);
      }
    }

    return results;
  }

  // ==================== 私有方法：获取前置知识和丰富内容 ====================

  /**
   * 获取概念的前置知识树
   */
  private getPrerequisitesFor(concept: string): PrerequisiteNode {
    // 如果在模块数据中存在，直接返回
    if (prerequisiteData[concept]) {
      return prerequisiteData[concept];
    }

    // 默认返回基础遗传学
    return {
      concept: '基础遗传学',
      isFoundation: true,
      level: 1,
      prerequisites: [],
    };
  }

  /**
   * 获取概念的遗传学丰富内容
   */
  private getEnrichmentFor(concept: string): GeneticsEnrichment {
    // 如果在模块数据中存在，直接返回
    if (enrichmentData[concept]) {
      return enrichmentData[concept];
    }

    // 默认返回基本结构
    return {
      concept,
      definition: `${concept}的相关概念解释`,
      principles: [],
      formulas: [],
      examples: [],
      misconceptions: [],
      visualization: {
        title: `${concept}知识图谱`,
        description: `展示${concept}的相关概念和知识结构`,
        type: 'knowledge_graph',
        elements: [],
        colors: {},
      },
    };
  }
}
