import { Injectable, Logger, Optional } from '@nestjs/common';
import { LLMService } from '../llm/llm.service';
import { A2UITemplates, buildA2UIPayload } from './data/a2ui-templates.data';
import type { A2UIPayload, A2UIComponent } from '@shared/types/a2ui.types';
import type { A2UITemplate } from './data/a2ui-templates.data';

interface A2UIConfig {
  remoteUIAgentUrl?: string;
  remoteUIAgentApiKey?: string;
  timeout?: number;
  maxRetries?: number;
  enableFallback?: boolean;
}

interface A2UIRequest {
  templateId: string;
  data: Record<string, any>;
  context?: {
    question?: string;
    knowledgeBase?: string[];
    preferences?: Record<string, any>;
  };
}

interface RemoteUIAgentResponse {
  success: boolean;
  payload?: A2UIPayload;
  error?: string;
  metadata?: {
    processingTime: number;
    modelUsed: string;
    tokensProcessed: number;
  };
}

@Injectable()
export class A2UIAdapterService {
  private readonly logger = new Logger(A2UIAdapterService.name);
  private config: A2UIConfig = {
    timeout: 30000,
    maxRetries: 3,
    enableFallback: true
  };

  constructor(
    @Optional() private readonly llmService: LLMService,
  ) {
    this.loadConfig();
  }

  private loadConfig(): void {
    if (process.env.REMOTE_UI_AGENT_URL) {
      this.config.remoteUIAgentUrl = process.env.REMOTE_UI_AGENT_URL;
    }
    if (process.env.REMOTE_UI_AGENT_API_KEY) {
      this.config.remoteUIAgentApiKey = process.env.REMOTE_UI_AGENT_API_KEY;
    }
    if (process.env.A2UI_TIMEOUT) {
      this.config.timeout = parseInt(process.env.A2UI_TIMEOUT, 10);
    }
    if (process.env.A2UI_MAX_RETRIES) {
      this.config.maxRetries = parseInt(process.env.A2UI_MAX_RETRIES, 10);
    }
  }

  async generateA2UI(
    templateId: string,
    data: Record<string, any>,
    context?: A2UIRequest['context']
  ): Promise<A2UIPayload> {
    this.logger.log(`Generating A2UI for template: ${templateId}`);

    try {
      const template = A2UITemplates.find(t => t.templateId === templateId);
      
      if (!template) {
        throw new Error(`Template not found: ${templateId}`);
      }

      if (!this.validateDataAgainstSchema(template, data)) {
        throw new Error('Data validation failed against template schema');
      }

      const enrichedData = await this.enrichData(template, data, context);
      
      let payload: A2UIPayload;

      if (this.config.remoteUIAgentUrl && this.config.remoteUIAgentApiKey) {
        payload = await this.generateWithRemoteAgent(templateId, enrichedData, context);
      } else {
        if (this.llmService && context?.question) {
          payload = await this.generateWithLocalLLM(template, enrichedData, context);
        } else {
          payload = buildA2UIPayload(template, enrichedData);
        }
      }

      this.logger.log(`Successfully generated A2UI payload: ${payload.metadata?.templateId || payload.surface.rootId}`);
      return payload;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to generate A2UI: ${errorMessage}`);
      
      if (this.config.enableFallback) {
        return this.generateFallbackPayload(templateId, data);
      }
      
      throw error;
    }
  }

  async generateA2UIFromVisualization(
    visualizationType: string,
    visualizationData: Record<string, any>
  ): Promise<A2UIPayload> {
    this.logger.log(`Generating A2UI from visualization type: ${visualizationType}`);

    const template = A2UITemplates.find(t => t.visualizationType === visualizationType);
    
    if (!template) {
      throw new Error(`No template found for visualization type: ${visualizationType}`);
    }

    return this.generateA2UI(template.templateId, visualizationData);
  }

  private async generateWithRemoteAgent(
    templateId: string,
    data: Record<string, any>,
    context?: A2UIRequest['context']
  ): Promise<A2UIPayload> {
    const startTime = Date.now();
    const maxRetries = this.config.maxRetries || 3;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        this.logger.log(`Remote agent attempt ${attempt}/${this.config.maxRetries}`);
        
        const response = await this.callRemoteUIAgent({
          templateId,
          data,
          context
        });

        if (!response.success || !response.payload) {
          throw new Error(response.error || 'Remote agent returned invalid response');
        }

        const processingTime = Date.now() - startTime;
        this.logger.log(`Remote agent succeeded in ${processingTime}ms`);
        
        return response.payload;

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        this.logger.error(`Remote agent attempt ${attempt} failed: ${errorMessage}`);
        
        if (attempt === maxRetries) {
          throw error;
        }

        await this.delay(this.calculateBackoffDelay(attempt));
      }
    }

    throw new Error('Remote agent failed after maximum retries');
  }

  private async callRemoteUIAgent(request: A2UIRequest): Promise<RemoteUIAgentResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(`${this.config.remoteUIAgentUrl}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.remoteUIAgentApiKey}`,
        },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Remote agent HTTP error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        payload: data.payload,
        metadata: data.metadata
      };

    } catch (error) {
      clearTimeout(timeoutId);

      const errorObj = error instanceof Error ? error : new Error(String(error));
      if (errorObj.name === 'AbortError') {
        throw new Error(`Remote agent timeout after ${this.config.timeout}ms`);
      }

      throw error;
    }
  }

  private async enrichData(
    template: any,
    data: Record<string, any>,
    context?: A2UIRequest['context']
  ): Promise<Record<string, any>> {
    let enrichedData = { ...data };

    if (this.llmService && context?.question) {
      try {
        const enriched = await this.llmService.chat([
          {
            role: 'user',
            content: `Enhance the following genetics visualization data with better descriptions and explanations based on this question: "${context.question}"\n\nData: ${JSON.stringify(data)}`
          }
        ], { maxTokens: 500 });

        if (enriched.content) {
          const parsed = this.parseLLMEnrichment(enriched.content);
          enrichedData = {
            ...enrichedData,
            ...parsed
          };
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        this.logger.warn(`Failed to enrich data with LLM: ${errorMessage}`);
      }
    }

    return enrichedData;
  }

  private parseLLMEnrichment(content: string): Record<string, any> {
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      this.logger.warn('Failed to parse LLM enrichment as JSON');
    }
    
    return {};
  }

  private validateDataAgainstSchema(template: any, data: Record<string, any>): boolean {
    if (!template.schema || !template.schema.properties) {
      return true;
    }

    const properties = template.schema.properties;
    
    for (const [key, prop] of Object.entries(properties as Record<string, any>)) {
      if (prop.required !== false && !(key in data)) {
        this.logger.warn(`Missing required field: ${key}`);
        return false;
      }

      if (key in data) {
        const value = data[key];
        const propType = prop.type;
        
        if (propType === 'array' && !Array.isArray(value)) {
          this.logger.warn(`Field ${key} should be array`);
          return false;
        }
        
        if (propType === 'object' && (typeof value !== 'object' || value === null)) {
          this.logger.warn(`Field ${key} should be object`);
          return false;
        }
        
        if (propType === 'string' && typeof value !== 'string') {
          this.logger.warn(`Field ${key} should be string`);
          return false;
        }
        
        if (propType === 'number' && typeof value !== 'number') {
          this.logger.warn(`Field ${key} should be number`);
          return false;
        }
        
        if (propType === 'boolean' && typeof value !== 'boolean') {
          this.logger.warn(`Field ${key} should be boolean`);
          return false;
        }
      }
    }

    return true;
  }

  private generateFallbackPayload(
    templateId: string,
    data: Record<string, any>
  ): A2UIPayload {
    this.logger.warn(`Generating fallback payload for template: ${templateId}`);

    const template = A2UITemplates.find(t => t.templateId === templateId);
    
    if (!template) {
      throw new Error(`Template not found for fallback: ${templateId}`);
    }

    try {
      return buildA2UIPayload(template, data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Fallback payload generation failed: ${errorMessage}`);
      
      const components: Record<string, A2UIComponent> = {
        'fallback': {
          type: 'card',
          id: 'fallback',
          properties: {},
          children: ['fallback_text']
        },
        'fallback_text': {
          type: 'text',
          id: 'fallback_text',
          properties: {
            content: `可视化数据生成失败。模板ID: ${templateId}`,
            variant: 'error'
          }
        }
      };

      return {
        version: '1.0',
        surface: {
          rootId: 'fallback',
          components
        },
        dataModel: {
          fallback: {
            content: `可视化数据生成失败。模板ID: ${templateId}`,
            variant: 'error'
          }
        }
      };
    }
  }

  private calculateBackoffDelay(attempt: number): number {
    const baseDelay = 1000;
    const maxDelay = 10000;
    const delay = baseDelay * Math.pow(2, attempt - 1);
    return Math.min(delay, maxDelay);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getAvailableTemplates(): Array<{
    templateId: string;
    visualizationType: string;
    complexity: string;
  }> {
    return A2UITemplates.map(t => ({
      templateId: t.templateId,
      visualizationType: t.visualizationType,
      complexity: t.complexity
    }));
  }

  private async generateWithLocalLLM(
    template: A2UITemplate,
    data: Record<string, any>,
    context?: A2UIRequest['context']
  ): Promise<A2UIPayload> {
    this.logger.log(`Generating A2UI with local LLM for template: ${template.templateId}`);

    try {
      const prompt = `你是一个A2UI（Agent-to-User Interface）可视化生成专家。请根据以下信息生成符合A2UI规范的JSON格式可视化内容。

## 模板信息
- 模板ID: ${template.templateId}
- 可视化类型: ${template.visualizationType}
- 复杂度: ${template.complexity}

## 用户问题
${context?.question || '无特定问题'}

## 原始数据
\`\`\`json
${JSON.stringify(data, null, 2)}
\`\`\`

## 任务要求
1. **保持模板结构**：严格按照模板的a2uiTemplate结构生成
2. **丰富数据内容**：基于用户问题，增强原始数据的描述、说明、标注等
3. **教育价值**：确保生成的内容有助于用户理解遗传学概念
4. **格式正确**：返回完整的JSON格式，可被解析为A2UIPayload

## 输出格式
请返回以下JSON格式（不要添加其他文本）：
\`\`\`json
{
  "type": "card",
  "id": "viz_[templateId]_[timestamp]",
  "children": [
    {
      "type": "[组件类型]",
      "id": "[组件ID]",
      "properties": {
        "[属性名]": "[属性值]",
        ...
      }
    }
  ],
  "metadata": {
    "generatedBy": "local-llm",
    "question": "[用户问题]",
    "enhancedAt": "[时间戳]"
  }
}
\`\`\``;

      const response = await this.llmService.chat([
        { role: 'user', content: prompt }
      ], { temperature: 0.3, maxTokens: 3000 });

      const jsonMatch = response.content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      const jsonContent = jsonMatch ? jsonMatch[1] : response.content;

      try {
        const a2uiPayload = JSON.parse(jsonContent) as A2UIPayload;

        if (!a2uiPayload.surface || !a2uiPayload.surface.components) {
          throw new Error('Generated A2UI payload missing surface components');
        }

        this.logger.log(`Successfully generated A2UI payload with local LLM: ${a2uiPayload.metadata?.templateId || a2uiPayload.surface.rootId}`);
        return a2uiPayload;

      } catch (parseError) {
        this.logger.warn('Failed to parse LLM response as A2UI, using fallback:', parseError);
        return buildA2UIPayload(template, data);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to generate A2UI with local LLM: ${errorMessage}`);
      
      return buildA2UIPayload(template, data);
    }
  }

  getTemplateById(templateId: string): any {
    return A2UITemplates.find(t => t.templateId === templateId);
  }

  getTemplateByVisualizationType(visualizationType: string): any {
    return A2UITemplates.find(t => t.visualizationType === visualizationType);
  }

  async healthCheck(): Promise<boolean> {
    if (!this.config.remoteUIAgentUrl) {
      return true;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${this.config.remoteUIAgentUrl}/health`, {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      
      return response.ok;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.warn(`Health check failed: ${errorMessage}`);
      return false;
    }
  }
}
