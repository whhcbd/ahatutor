import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import type {
  ChatMessage,
  ChatMessageTextPart,
  ChatOptions,
  LLMResponse,
} from '../llm.service';

@Injectable()
export class MockProvider {
  private readonly logger = new Logger(MockProvider.name);

  async chat(
    messages: ChatMessage[],
    _options?: ChatOptions,
  ): Promise<LLMResponse> {
    this.logger.debug('Mock LLM chat request');

    await this.simulateDelay(500);

    const lastUserMessage = messages
      .filter((m) => m.role === 'user')
      .pop();

    if (!lastUserMessage) {
      throw new Error('No user message found');
    }

    const content = lastUserMessage.content;
    const contentText = typeof content === 'string' 
      ? content 
      : content.find((part): part is ChatMessageTextPart => part.type === 'text')?.text || '';

    const responseText = this.generateMockResponse(contentText);

    return {
      content: responseText,
      model: 'mock-model-v1',
      usage: {
        promptTokens: 100,
        completionTokens: 150,
        totalTokens: 250,
      },
    };
  }

  async *chatStream(
    messages: ChatMessage[],
    options?: ChatOptions,
  ): AsyncGenerator<string, void, unknown> {
    this.logger.debug('Mock LLM chat stream request');

    const response = await this.chat(messages, options);

    const chunks = this.splitIntoChunks(response.content, 10);

    for (const chunk of chunks) {
      await this.simulateDelay(100);
      yield chunk;
    }
  }

  async embed(_text: string): Promise<number[]> {
    this.logger.debug('Mock embedding request');

    await this.simulateDelay(50);

    const embeddingSize = 1536;

    const embedding = Array(embeddingSize)
      .fill(0)
      .map(() => Math.random() * 2 - 1);

    this.normalizeEmbedding(embedding);

    return embedding;
  }

  private generateMockResponse(content: string): string {
    const contentLower = content.toLowerCase();

    if (contentLower.includes('生成题目') || contentLower.includes('quiz')) {
      return JSON.stringify({
        id: uuidv4(),
        type: 'multiple_choice',
        difficulty: 'medium',
        topic: '遗传学',
        content: '下列哪项是孟德尔第一定律的正确表述？',
        options: [
          { id: 'A', label: 'A', content: '性状分离是独立进行的' },
          { id: 'B', label: 'B', content: '显性性状和隐性性状的分离比是 3:1' },
          { id: 'C', label: 'C', content: '配子形成时成对的遗传因子彼此分离' },
          { id: 'D', label: 'D', content: '所有选项都正确' },
        ],
        correctAnswer: 'D',
        explanation: {
          level1: '孟德尔第一定律，即分离定律，指出生物体在形成配子时，成对的遗传因子彼此分离，分别进入不同的配子中',
          level2: '这意味着一对等位基因在减数分裂时分离到不同的配子中，独立传递给后代',
          level3: '例如：对于基因型 Aa 的个体，产生配子时 A 和 a 分离，配子类型为 A 或 a',
          level4: '这是遗传学的基础定律之一，解释了性状如何在代际间传递',
          level5: '分离定律是理解遗传现象的关键，为后续的基因互作和连锁定律打下基础',
        },
        tags: ['孟德尔定律', '遗传学基础'],
      });
    }

    if (contentLower.includes('分析') || contentLower.includes('analyze')) {
      return JSON.stringify({
        concept: content.match(/分析(.*)/)?.[1] || '遗传学',
        definition: '遗传学是研究生物遗传和变异规律的科学',
        difficulty: 'intermediate',
        relatedConcepts: ['孟德尔定律', '基因', '染色体'],
        learningObjectives: ['理解遗传学基本概念', '掌握孟德尔定律'],
        commonMisconceptions: [
          '认为遗传是随机融合而非粒子分离',
          '忽视环境因素对表型的影响',
        ],
      });
    }

    if (contentLower.includes('评估') || contentLower.includes('evaluate')) {
      return JSON.stringify({
        isCorrect: contentLower.includes('正确'),
        confidence: 0.85,
        reason: '根据孟德尔第一定律分析，答案符合分离定律的表述',
        needsSelfAssessment: false,
        explanation: {
          level1: '孟德尔第一定律是遗传学的基本定律',
          level2: '该定律描述了遗传因子在配子形成时的行为',
          level3: '理解这个定律对于学习遗传学至关重要',
        },
      });
    }

    if (contentLower.includes('推荐') || contentLower.includes('recommend')) {
      return JSON.stringify({
        resources: [
          {
            id: uuidv4(),
            title: '遗传学基础教程',
            type: 'video',
            url: 'https://example.com/video1',
            description: '适合初学者的遗传学入门视频',
            difficulty: 'beginner',
            duration: 1800,
          },
          {
            id: uuidv4(),
            title: 'Mendel\'s Laws of Inheritance',
            type: 'article',
            url: 'https://example.com/article1',
            description: '孟德尔定律的详细英文解释',
            difficulty: 'intermediate',
            readTime: 10,
          },
        ],
      });
    }

    if (contentLower.includes('可视化') || contentLower.includes('visualize')) {
      return JSON.stringify({
        type: 'concept-map',
        title: '遗传学概念图',
        config: {
          type: 'force-directed-graph',
          nodes: [
            { id: '1', label: '遗传学', group: 'main' },
            { id: '2', label: '孟德尔定律', group: 'laws' },
            { id: '3', label: '分离定律', group: 'laws' },
            { id: '4', label: '自由组合定律', group: 'laws' },
            { id: '5', label: '基因', group: 'concepts' },
            { id: '6', label: '染色体', group: 'concepts' },
          ],
          links: [
            { source: '1', target: '2' },
            { source: '2', target: '3' },
            { source: '2', target: '4' },
            { source: '1', target: '5' },
            { source: '1', target: '6' },
          ],
        },
      });
    }

    return JSON.stringify({
      response: '这是一个模拟的响应。实际使用时请配置真实的 LLM API Key。',
      originalQuery: content,
    });
  }

  private splitIntoChunks(text: string, chunkCount: number): string[] {
    const totalLength = text.length;
    const chunkSize = Math.ceil(totalLength / chunkCount);
    const chunks: string[] = [];

    for (let i = 0; i < totalLength; i += chunkSize) {
      chunks.push(text.slice(i, i + chunkSize));
    }

    return chunks;
  }

  private simulateDelay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private normalizeEmbedding(embedding: number[]): void {
    let sum = 0;
    for (let i = 0; i < embedding.length; i++) {
      sum += embedding[i] * embedding[i];
    }
    const norm = Math.sqrt(sum) || 1;
    for (let i = 0; i < embedding.length; i++) {
      embedding[i] /= norm;
    }
  }
}
