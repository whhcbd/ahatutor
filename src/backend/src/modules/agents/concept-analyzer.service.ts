import { Injectable, Logger } from '@nestjs/common';
import { LLMService } from '../llm/llm.service';
import { KnowledgeBaseService } from '../knowledge-base/knowledge-base.service';
import { ConceptAnalysis } from '@shared/types/agent.types';

/**
 * Agent 1: ConceptAnalyzer
 * "这真正在问什么？"
 *
 * 职责：分析用户输入，提取核心概念
 *
 * 优化：优先从知识库获取，仅对未知概念调用 AI
 */

interface ConceptAnalysisResponse {
  coreConcept: string;
  domain: string;
  complexity: 'basic' | 'intermediate' | 'advanced';
  visualizationPotential?: number;
  suggestedVisualizations?: string[];
  keyTerms?: string[];
}

@Injectable()
export class ConceptAnalyzerService {
  private readonly logger = new Logger(ConceptAnalyzerService.name);

  constructor(
    private readonly llmService: LLMService,
    private readonly knowledgeBase: KnowledgeBaseService,
  ) {}

  /**
   * 分析用户输入，提取核心概念信息
   *
   * 优化：先查知识库，未找到才调用 AI
   */
  async analyze(input: string, userLevel: 'beginner' | 'intermediate' | 'advanced' = 'intermediate'): Promise<ConceptAnalysis> {
    this.logger.log(`Analyzing concept: "${input}"`);

    // 1. 首先尝试从知识库获取
    const kbAnalysis = this.knowledgeBase.getConceptAnalysis(input);
    if (kbAnalysis) {
      this.logger.log(`✅ Found in knowledge base: ${kbAnalysis.concept}`);
      return kbAnalysis;
    }

    // 2. 搜索相似概念
    const similarConcepts = this.knowledgeBase.searchConcepts(input);
    if (similarConcepts.length > 0) {
      this.logger.log(`Found similar concepts: ${similarConcepts.join(', ')}`);
      // 如果找到完全匹配的概念，使用它
      for (const concept of similarConcepts) {
        const analysis = this.knowledgeBase.getConceptAnalysis(concept);
        if (analysis) {
          this.logger.log(`✅ Using similar concept from KB: ${concept}`);
          return analysis;
        }
      }
    }

    // 3. 知识库未找到，调用 AI
    this.logger.log(`🤖 Calling AI for unknown concept: ${input}`);
    return await this.analyzeWithAI(input, userLevel);
  }

  /**
   * 使用 AI 分析概念（仅当知识库未找到时使用）
   */
  private async analyzeWithAI(input: string, userLevel: 'beginner' | 'intermediate' | 'advanced'): Promise<ConceptAnalysis> {
    const prompt = `你是一位遗传学教育专家。请分析以下用户输入：

用户输入: "${input}"
用户水平: ${userLevel}

请分析并提取关键信息，返回 JSON 格式。`;

    const schema = {
      type: 'object',
      properties: {
        input: { type: 'string', description: '原始输入' },
        coreConcept: { type: 'string', description: '核心概念' },
        domain: { type: 'string', description: '领域（如：遗传学）' },
        subDomain: { type: 'string', description: '子领域（如：分子遗传学）' },
        complexity: { type: 'string', enum: ['basic', 'intermediate', 'advanced'], description: '复杂度' },
        visualizationPotential: { type: 'number', minimum: 0, maximum: 1, description: '可视化潜力' },
        suggestedVisualizations: {
          type: 'array',
          items: { type: 'string' },
          description: '建议的可视化方式'
        },
        keyTerms: {
          type: 'array',
          items: { type: 'string' },
          description: '关键术语'
        },
        relatedConcepts: {
          type: 'array',
          items: { type: 'string' },
          description: '相关概念'
        }
      },
      required: ['coreConcept', 'domain', 'complexity', 'keyTerms']
    };

    try {
      const response = await this.llmService.structuredChat<ConceptAnalysisResponse>(
        [{ role: 'user', content: prompt }],
        schema,
        { temperature: 0.3 }
      );

      const analysis: ConceptAnalysis = {
        concept: response.coreConcept,
        domain: response.domain,
        complexity: response.complexity,
        visualizationPotential: response.visualizationPotential ?? 0,
        suggestedVisualizations: response.suggestedVisualizations ?? [],
        keyTerms: response.keyTerms ?? [],
      };

      this.logger.log(`✅ AI analysis complete: ${analysis.concept} (${analysis.complexity})`);
      return analysis;
    } catch (error) {
      this.logger.error('Failed to analyze concept with AI:', error);
      throw error;
    }
  }

  /**
   * 判断输入是否为计算问题
   */
  isCalculationProblem(input: string): boolean {
    const calculationKeywords = [
      '概率', '比例', '多少', '计算', '频率',
      '%', '：', '/', '×', 'Punnett'
    ];
    return calculationKeywords.some(keyword => input.includes(keyword));
  }

  /**
   * 判断输入是否需要举例说明
   */
  requiresExample(input: string): boolean {
    const exampleKeywords = [
      '举例', '例子', '例如', '比如', 'instance'
    ];
    return exampleKeywords.some(keyword => input.includes(keyword));
  }
}
