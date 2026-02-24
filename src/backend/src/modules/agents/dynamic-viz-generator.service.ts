import { Injectable } from '@nestjs/common';
import { LLMService } from '../llm/llm.service';
import { RAGService } from '../rag/services/rag.service';

interface VisualizationTemplate {
  templateId: string;
  concept: string;
  conceptKeywords: string[];
  vizType: string;
  vizCategory: string;
  title: string;
  description: string;
  applicableScenarios: string[];
  templateStructure: any;
  dataGenerationRules: any;
  styling: any;
  educationalAids: any;
  metadata: any;
}

interface VisualizationTemplateMatch {
  template: VisualizationTemplate;
  similarity: number;
  matchReason: string;
}

interface DynamicVizInput {
  question: string;
  concept?: string;
  userLevel?: 'beginner' | 'intermediate' | 'advanced';
  conversationHistory?: Array<{ role: string; content: string }>;
}

interface DynamicVizResponse {
  visualizationApplicable: boolean;
  applicableReason: string;
  selectedTemplate?: {
    templateId: string;
    reason: string;
  };
  extractedData?: Record<string, any>;
  visualizationData?: any;
  textAnswer?: {
    mainAnswer: string;
    keyPoints: string[];
    examples: string[];
    commonMistakes: string[];
  };
  educationalAids?: any;
  citations?: any[];
}

@Injectable()
export class DynamicVizGeneratorService {
  private templates: VisualizationTemplate[] = [];
  
  constructor(
    private readonly llmService: LLMService,
    private readonly ragService: RAGService,
  ) {}

  async generateDynamicVisualization(input: DynamicVizInput): Promise<DynamicVizResponse> {
    const { question, concept, userLevel = 'intermediate' } = input;

    const conceptText = concept || await this.extractConcept(question);

    const ragResult = await this.ragService.query({
      query: question,
      topK: 5,
      threshold: 0.6
    });

    const knowledgeContent = ragResult.results.map(r => r.content).join('\n\n');

    const templateMatches = await this.retrieveVisualizationTemplates(
      conceptText,
      question
    );

    const prompt = this.buildGenerationPrompt({
      question,
      concept: conceptText,
      knowledgeContent,
      recommendedTemplates: templateMatches,
      userLevel
    });

    const response = await this.llmService.structuredChat<DynamicVizResponse>(
      [{ role: 'user', content: prompt }],
      DYNAMIC_VIZ_RESPONSE_SCHEMA,
      { temperature: 0.3 }
    );

    return response;
  }

  private async extractConcept(question: string): Promise<string> {
    const prompt = `从以下问题中提取核心遗传学概念（不超过10个字）：\n${question}`;
    const response = await this.llmService.chat([
      { role: 'user', content: prompt }
    ], { temperature: 0.1 });
    return response.content.trim();
  }

  private async retrieveVisualizationTemplates(
    concept: string,
    question: string
  ): Promise<VisualizationTemplateMatch[]> {
    const topK = 3;
    const threshold = 0.6;

    const conceptEmbedding = await this.llmService.embed(concept);
    const questionEmbedding = await this.llmService.embed(question);

    const matches = await Promise.all(this.templates.map(async (template) => {
      const templateEmbedding = await this.llmService.embed(
        `${template.concept} ${template.conceptKeywords.join(' ')}`
      );

      const conceptSimilarity = this.cosineSimilarity(conceptEmbedding, templateEmbedding);
      const questionSimilarity = this.cosineSimilarity(questionEmbedding, templateEmbedding);
      const combinedSimilarity = conceptSimilarity * 0.7 + questionSimilarity * 0.3;

      return {
        template,
        similarity: combinedSimilarity,
        matchReason: `概念相似度: ${conceptSimilarity.toFixed(2)}, 问题相似度: ${questionSimilarity.toFixed(2)}`
      };
    }));

    return matches
      .filter(m => m.similarity >= threshold)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    if (normA === 0 || normB === 0) return 0;
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  private buildGenerationPrompt(input: {
    question: string;
    concept: string;
    knowledgeContent: string;
    recommendedTemplates: VisualizationTemplateMatch[];
    userLevel: string;
  }): string {
    const { question, concept, knowledgeContent, recommendedTemplates, userLevel } = input;

    return `你是一个遗传学可视化生成专家。请基于提供的知识点、问题信息和可视化模板，生成适合的可视化内容。

## 输入信息

### 1. 知识点内容
${knowledgeContent}

### 2. 用户问题
${question}

### 3. 核心概念
${concept}

### 4. 用户水平
${userLevel}

### 5. 推荐的可视化模板
${recommendedTemplates.map((t, index) => `
**模板 ${index + 1}: ${t.template.templateId}**
- 标题: ${t.template.title}
- 适用概念: ${t.template.concept}
- 相似度: ${t.similarity.toFixed(2)}
- 描述: ${t.template.description}
- 适用场景: ${t.template.applicableScenarios.join(', ')}
- 匹配原因: ${t.matchReason}
- 教学要点: ${t.template.educationalAids?.keyPoints?.join(', ') || '暂无'}
`).join('\n')}

## 任务要求

### 第一步：评估可视化适用性
分析用户问题是否适合可视化处理，考虑：
1. 问题是否涉及具体遗传学概念或过程？
2. 是否可以通过图形、动画或图表帮助理解？
3. 可视化是否能提供比纯文本更好的解释？

如果适合，选择最佳模板；如果不适合，说明原因。

### 第二步：选择和调整模板
从推荐的模板中选择最合适的，并根据具体问题进行调整：
- 提取模板需要的参数值
- 从知识点内容中获取相关数据
- 应用数据生成规则
- 调整模板结构以适应具体问题

### 第三步：生成可视化数据
基于选择的模板和提取的数据，生成完整的可视化数据：
1. 实现所有必需的组件
2. 设置正确的参数值
3. 应用样式配置
4. **从RAG知识库提取知识点内容并填充到模板**

### 第四步：回答用户问题
基于知识点内容和可视化数据，生成对用户问题的准确回答：
1. 直接回答问题的核心
2. 引用知识点中的关键信息
3. 结合可视化进行解释
4. 提供相关的教学要点

## 重要要求

1. **严格基于输入内容**：不要使用知识点之外的信息
2. **模板适配**：确保生成的可视化数据符合所选模板的结构
3. **数据准确性**：从知识点中准确提取数据，正确应用生成规则
4. **教学价值**：生成的内容要有助于${userLevel}水平的学生理解概念
5. **格式规范**：严格遵循JSON输出格式，确保可解析
6. **从RAG知识库提取知识点**：
   - keyPoints: 从RAG知识库中提取3-5个关键知识点
   - understandingPoints: 从RAG知识库中提取理解要点
   - commonMistakes: 从RAG知识库中提取常见错误
   - checkQuestions: 从RAG知识库中提取自检问题
   - **不要生成新的知识点，使用RAG知识库中已有的内容**

请严格按照以下JSON格式输出，不要添加任何其他文本：`;
  }

  setTemplates(templates: VisualizationTemplate[]) {
    this.templates = templates;
  }
}

const DYNAMIC_VIZ_RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    visualizationApplicable: {
      type: 'boolean',
      description: '是否适合可视化处理'
    },
    applicableReason: {
      type: 'string',
      description: '适用性判断的原因'
    },
    selectedTemplate: {
      type: 'object',
      properties: {
        templateId: {
          type: 'string',
          description: '选择的模板ID'
        },
        reason: {
          type: 'string',
          description: '选择该模板的原因'
        }
      },
      required: ['templateId', 'reason']
    },
    extractedData: {
      type: 'object',
      description: '从知识点中提取的数据'
    },
    visualizationData: {
      type: 'object',
      description: '生成的可视化数据（必须包含知识点字段：keyPoints, understandingPoints, commonMistakes, checkQuestions）'
    },
    textAnswer: {
      type: 'object',
      properties: {
        mainAnswer: {
          type: 'string',
          description: '主要回答'
        },
        keyPoints: {
          type: 'array',
          items: { type: 'string' },
          description: '关键要点'
        },
        examples: {
          type: 'array',
          items: { type: 'string' },
          description: '举例说明'
        },
        commonMistakes: {
          type: 'array',
          items: { type: 'string' },
          description: '常见错误'
        }
      },
      required: ['mainAnswer']
    },
    educationalAids: {
      type: 'object',
      description: '教育辅助信息（包含知识点内容：keyPoints, understandingPoints, commonMistakes, checkQuestions）',
      properties: {
        keyPoints: {
          type: 'array',
          items: { type: 'string' },
          description: '3-5个关键知识点，帮助学生理解遗传规律'
        },
        understandingPoints: {
          type: 'array',
          items: { type: 'string' },
          description: '如何通过可视化理解概念'
        },
        commonMistakes: {
          type: 'array',
          items: { type: 'string' },
          description: '学生常见的错误理解'
        },
        checkQuestions: {
          type: 'array',
          items: { type: 'string' },
          description: '帮助学生自检的问题'
        }
      }
    },
    citations: {
      type: 'array',
      items: { type: 'object' },
      description: '引用来源'
    }
  },
  required: ['visualizationApplicable', 'applicableReason']
};
