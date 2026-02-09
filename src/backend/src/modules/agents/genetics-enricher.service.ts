import { Injectable, Logger } from '@nestjs/common';
import { LLMService } from '../llm/llm.service';
import { GeneticsEnrichment, VisualizationSuggestion } from '@shared/types/agent.types';

/**
 * Agent 3: GeneticsEnricher
 * "精确的遗传学原理是什么？"
 *
 * 职责：为概念添加详细的遗传学教学内容
 */

interface GeneticsEnrichmentResponse {
  concept: string;
  definition: string;
  principles?: string[];
  formulas?: Array<{
    key: string;
    latex: string;
    variables: Record<string, unknown>;
    explanation: string;
  }>;
  examples?: Array<{
    name: string;
    description: string;
    cross?: string;
    result?: string;
  }>;
  misconceptions?: string[];
  visualization?: {
    type: 'knowledge_graph' | 'animation' | 'chart' | 'diagram';
    elements?: string[];
    colors?: Record<string, string>;
    suggestion?: string;
  };
}

@Injectable()
export class GeneticsEnricherService {
  private readonly logger = new Logger(GeneticsEnricherService.name);

  constructor(private readonly llmService: LLMService) {}

  /**
   * 丰富遗传学概念的教学内容
   */
  async enrichConcept(concept: string): Promise<GeneticsEnrichment> {
    this.logger.log(`Enriching concept: "${concept}"`);

    const prompt = `你是一位遗传学教师。请为以下遗传学概念添加详细的教学内容：

概念：${concept}

请添加：
1. **核心定义**：用简洁的语言定义这个概念
2. **遗传学定律/原理**：相关的遗传学定律（如孟德尔定律、哈代-温伯格定律等）
3. **关键公式**：遗传学计算公式（如基因型频率、表型比例等）
4. **典型实例**：经典的遗传学实例（如豌豆实验、果蝇实验等）
5. **常见误区**：学生容易混淆的概念
6. **可视化建议**：如何用图表/动画展示这个概念

返回 JSON 格式。`;

    const schema = {
      type: 'object',
      properties: {
        concept: { type: 'string' },
        definition: { type: 'string' },
        principles: {
          type: 'array',
          items: { type: 'string' }
        },
        formulas: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              key: { type: 'string' },
              latex: { type: 'string' },
              variables: { type: 'object' },
              explanation: { type: 'string' }
            }
          }
        },
        examples: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              description: { type: 'string' },
              cross: { type: 'string' },
              result: { type: 'string' }
            }
          }
        },
        misconceptions: {
          type: 'array',
          items: { type: 'string' }
        },
        visualization: {
          type: 'object',
          properties: {
            type: { type: 'string' },
            elements: {
              type: 'array',
              items: { type: 'string' }
            },
            colors: { type: 'object' },
            suggestion: { type: 'string' }
          }
        }
      }
    };

    try {
      const response = await this.llmService.structuredChat<GeneticsEnrichmentResponse>(
        [{ role: 'user', content: prompt }],
        schema,
        { temperature: 0.5 }
      );

      const enrichment: GeneticsEnrichment = {
        concept: response.concept,
        definition: response.definition,
        principles: response.principles ?? [],
        formulas: (response.formulas ?? []).map(f => ({
          key: f.key,
          latex: f.latex,
          variables: f.variables as Record<string, string>,
        })),
        examples: (response.examples ?? []).map(e => ({
          name: e.name,
          description: e.description,
        })),
        misconceptions: response.misconceptions ?? [],
        visualization: (response.visualization ?? {
          type: 'knowledge_graph',
          elements: [],
        }) as VisualizationSuggestion,
      };

      this.logger.log(`Concept enriched: ${enrichment.concept}`);
      return enrichment;
    } catch (error) {
      this.logger.error('Failed to enrich concept:', error);
      throw error;
    }
  }

  /**
   * 生成概念的简要描述
   */
  async getSummary(concept: string): Promise<string> {
    const prompt = `请用一句话解释"${concept}"这个遗传学概念，要求通俗易懂。`;

    try {
      const response = await this.llmService.chat([
        { role: 'user', content: prompt }
      ]);

      return response.content;
    } catch (error) {
      this.logger.error('Failed to get summary:', error);
      throw error;
    }
  }

  /**
   * 获取相关例题
   */
  async getExamples(concept: string, count: number = 3): Promise<Array<{ name: string; description: string }>> {
    const prompt = `请为"${concept}"这个遗传学概念提供 ${count} 个经典例题或实例。`;

    try {
      const response = await this.llmService.structuredChat<{
        examples: Array<{ name: string; description: string }>;
      }>(
        [{ role: 'user', content: prompt }],
        {
          type: 'object',
          properties: {
            examples: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' }
                }
              }
            }
          }
        },
        { temperature: 0.5 }
      );

      return response.examples || [];
    } catch (error) {
      this.logger.error('Failed to get examples:', error);
      throw error;
    }
  }
}
