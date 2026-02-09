import { Injectable, Logger } from '@nestjs/common';
import { LLMService } from '../llm/llm.service';
import { ConceptAnalysis } from '@shared/types/agent.types';

/**
 * Agent 1: ConceptAnalyzer
 * "这真正在问什么？"
 *
 * 职责：分析用户输入，提取核心概念
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

  constructor(private readonly llmService: LLMService) {}

  /**
   * 分析用户输入，提取核心概念信息
   */
  async analyze(input: string, userLevel: 'beginner' | 'intermediate' | 'advanced' = 'intermediate'): Promise<ConceptAnalysis> {
    this.logger.log(`Analyzing concept: "${input}"`);

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

      this.logger.log(`Concept analyzed: ${analysis.concept} (${analysis.complexity})`);
      return analysis;
    } catch (error) {
      this.logger.error('Failed to analyze concept:', error);
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
