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
      const questionBank = [
        {
          topic: '孟德尔第一定律',
          difficulty: 'easy',
          content: '下列哪项是孟德尔第一定律的核心内容？',
          options: [
            { id: 'A', label: 'A', content: '显性和隐性性状同时表达' },
            { id: 'B', label: 'B', content: '配子形成时成对的遗传因子彼此分离' },
            { id: 'C', label: 'C', content: '不同性状的遗传相互独立' },
            { id: 'D', label: 'D', content: '基因位于染色体上' },
          ],
          correctAnswer: 'B',
          explanation: {
            level1: '孟德尔第一定律（分离定律）指出：在生物体形成配子时，成对的遗传因子彼此分离',
            level2: '这意味着等位基因在减数分裂过程中分离到不同的配子中',
            level3: '例如基因型为 Aa 的个体，产生的配子只有 A 或 a，比例为 1:1',
            level4: '这是遗传学最基础的定律，解释了性状如何在代际间传递',
            level5: '理解分离定律对于掌握遗传学后续的复杂现象至关重要'
          },
          tags: ['孟德尔定律', '分离定律']
        },
        {
          topic: '孟德尔第二定律',
          difficulty: 'medium',
          content: '孟德尔第二定律（自由组合定律）主要描述的是什么？',
          options: [
            { id: 'A', label: 'A', content: '同一对等位基因的分离' },
            { id: 'B', label: 'B', content: '不同对等位基因在配子形成时的自由组合' },
            { id: 'C', label: 'C', content: '显性性状对隐性性状的掩盖' },
            { id: 'D', label: 'D', content: '基因突变的随机性' },
          ],
          correctAnswer: 'B',
          explanation: {
            level1: '孟德尔第二定律指出：控制不同性状的遗传因子在配子形成时自由组合',
            level2: '这意味着不同对等位基因的分离是相互独立的',
            level3: '例如双杂合子 AaBb 可以产生 AB、Ab、aB、ab 四种配子，比例为 1:1:1:1',
            level4: '这个定律适用于位于不同染色体上的基因',
            level5: '自由组合定律为生物多样性的遗传基础提供了理论解释'
          },
          tags: ['孟德尔定律', '自由组合定律']
        },
        {
          topic: '基因型与表现型',
          difficulty: 'easy',
          content: '基因型为 Aa 的个体，其表现型取决于什么？',
          options: [
            { id: 'A', label: 'A', content: '只取决于基因型' },
            { id: 'B', label: 'B', content: '只取决于环境因素' },
            { id: 'C', label: 'C', content: '取决于基因型和环境的共同作用' },
            { id: 'D', label: 'D', content: '取决于随机变异' },
          ],
          correctAnswer: 'C',
          explanation: {
            level1: '表现型是基因型和环境共同作用的结果',
            level2: '基因型提供了遗传基础，但环境会影响基因的表达',
            level3: '例如：同样是高茎豌豆，不同生长条件下的高度可能不同',
            level4: '这解释了为什么同卵双胞胎在某些性状上会有差异',
            level5: '理解基因型与表现型的关系对于研究遗传学和表观遗传学都很重要'
          },
          tags: ['基因型', '表现型']
        },
        {
          topic: '测交',
          difficulty: 'medium',
          content: '测交的主要目的是什么？',
          options: [
            { id: 'A', label: 'A', content: '获得纯合子后代' },
            { id: 'B', label: 'B', content: '检验未知个体的基因型' },
            { id: 'C', label: 'C', content: '增加遗传变异' },
            { id: 'D', label: 'D', content: '提高产量' },
          ],
          correctAnswer: 'B',
          explanation: {
            level1: '测交是将待测个体与隐性纯合子杂交，以检验其基因型',
            level2: '通过观察后代表型比例，可以推断待测个体的基因型',
            level3: '例如：Aa × aa → 1Aa:1aa，而 AA × aa → 全部 Aa',
            level4: '这是遗传学实验中常用的方法，用于确定基因的显隐性关系',
            level5: '测交原理在现代遗传学研究中仍有广泛应用'
          },
          tags: ['测交', '遗传实验']
        },
        {
          topic: '伴性遗传',
          difficulty: 'hard',
          content: '红绿色盲是一种伴X隐性遗传病，若父亲正常、母亲携带者，他们生出色盲儿子的概率是多少？',
          options: [
            { id: 'A', label: 'A', content: '0%' },
            { id: 'B', label: 'B', content: '25%' },
            { id: 'C', label: 'C', content: '50%' },
            { id: 'D', label: 'D', content: '75%' },
          ],
          correctAnswer: 'B',
          explanation: {
            level1: '父亲正常：X^B Y；母亲携带者：X^B X^b。生出儿子：X^B Y（正常）或 X^b Y（色盲），各占50%',
            level2: '但题目问的是"色盲儿子"，需要同时满足两个条件：儿子(50%)且色盲(50%)，所以是 25%',
            level3: '伴性遗传的基因位于性染色体上，遗传方式与性别相关',
            level4: '理解伴性遗传对于分析家族遗传病模式很重要',
            level5: '伴X隐性遗传病在男性中发病率远高于女性，因为男性只有一条X染色体'
          },
          tags: ['伴性遗传', 'X染色体']
        }
      ];

      let selectedQuestion = questionBank[0];
      if (contentLower.includes('孟德尔第一') || contentLower.includes('分离')) {
        selectedQuestion = questionBank[0];
      } else if (contentLower.includes('孟德尔第二') || contentLower.includes('自由组合')) {
        selectedQuestion = questionBank[1];
      } else if (contentLower.includes('基因型') || contentLower.includes('表现型')) {
        selectedQuestion = questionBank[2];
      } else if (contentLower.includes('测交')) {
        selectedQuestion = questionBank[3];
      } else if (contentLower.includes('伴性') || contentLower.includes('色盲')) {
        selectedQuestion = questionBank[4];
      } else {
        const randomIndex = Math.floor(Math.random() * questionBank.length);
        selectedQuestion = questionBank[randomIndex];
      }

      return JSON.stringify({
        id: uuidv4(),
        type: 'multiple_choice',
        difficulty: selectedQuestion.difficulty,
        topic: selectedQuestion.topic,
        content: selectedQuestion.content,
        options: selectedQuestion.options,
        correctAnswer: selectedQuestion.correctAnswer,
        explanation: selectedQuestion.explanation,
        tags: selectedQuestion.tags
      });
    }

    if (contentLower.includes('解释这道题的答案') || contentLower.includes('解释') || contentLower.includes('explain')) {
      return JSON.stringify({
        textAnswer: '孟德尔第一定律，也称为分离定律，是遗传学的基本定律之一。它指出在生物体的细胞中，控制同一性状的遗传因子成对存在，且不相融合。在形成配子（生殖细胞）时，成对的遗传因子彼此分离，分别进入不同的配子中，随配子遗传给后代。\n\n这个定律的核心要点是：\n1. 遗传因子成对存在\n2. 在配子形成时分离\n3. 独立传递给后代\n\n理解这个定律的关键在于认识到，虽然我们在个体中看到的可能是显性性状，但隐性基因并没有消失，它只是被显性基因掩盖了，在形成配子时会再次显现出来。',
        visualization: {
          type: 'punnett_square',
          title: '孟德尔分离定律杂交棋盘',
          description: '展示 Aa × Aa 杂交的配子分离和后代基因型分布',
          elements: ['亲本配子', '杂交棋盘', '后代基因型', '表型比例'],
          colors: {
            '显性纯合': '#4CAF50',
            '杂合子': '#FFC107',
            '隐性纯合': '#F44336',
            '配子': '#2196F3'
          },
          layout: 'grid',
          interactions: ['hover', 'click'],
          annotations: [
            '配子形成时，A 和 a 分离',
            '后代比例为 1AA:2Aa:1aa',
            '表型比例为 3:1（显性:隐性）'
          ],
          data: {
            maleGametes: ['A', 'a'],
            femaleGametes: ['A', 'a'],
            parentalCross: {
              male: { genotype: 'Aa', phenotype: '杂合子（高茎）' },
              female: { genotype: 'Aa', phenotype: '杂合子（高茎）' }
            },
            offspring: [
              { genotype: 'AA', phenotype: '显性纯合（高茎）', probability: 0.25 },
              { genotype: 'Aa', phenotype: '杂合子（高茎）', probability: 0.5 },
              { genotype: 'aa', phenotype: '隐性纯合（矮茎）', probability: 0.25 },
            ],
            description: '单因子杂交：Aa × Aa → 1AA:2Aa:1aa，表型比为3:1'
          }
        },
        followUpQuestions: [
          '孟德尔第二定律是什么？',
          '为什么有时性状分离比不是 3:1？',
          '这个定律在实际育种中如何应用？'
        ],
        relatedConcepts: ['孟德尔第二定律', '基因型', '表现型']
      });
    }

    if (contentLower.includes('生成') && contentLower.includes('punnett') || contentLower.includes('杂交棋盘')) {
      return JSON.stringify({
        maleGametes: ['A', 'a'],
        femaleGametes: ['A', 'a'],
        parentalCross: {
          male: { genotype: 'Aa', phenotype: '杂合子（高茎）' },
          female: { genotype: 'Aa', phenotype: '杂合子（高茎）' }
        },
        offspring: [
          { genotype: 'AA', phenotype: '显性纯合（高茎）', probability: 0.25 },
          { genotype: 'Aa', phenotype: '杂合子（高茎）', probability: 0.5 },
          { genotype: 'aa', phenotype: '隐性纯合（矮茎）', probability: 0.25 },
        ],
        description: '单因子杂交：Aa × Aa → 1AA:2Aa:1aa，表型比为3:1'
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

    if (contentLower.includes('你是遗传学教育专家') || contentLower.includes('用户问题：') || contentLower.includes('请提供：')) {
      const questionMatch = content.match(/用户问题：(.+)/);
      const userQuestion = questionMatch ? questionMatch[1].trim() : content;

      const response = {
        textAnswer: `你好！我是你的遗传学 AI 助教。我可以帮助你理解各种遗传学概念，包括孟德尔定律、基因型与表现型、伴性遗传等。\n\n针对你的问题："${userQuestion}"，我需要更多具体信息来提供详细回答。请尝试提出更具体的遗传学问题，例如：\n\n1. 什么是孟德尔分离定律？\n2. 基因如何影响生物的表型？\n3. 伴性遗传有什么特点？\n4. DNA复制的过程是怎样的？\n5. 减数分裂和有丝分裂有什么区别？`,
        needVisualization: false,
        followUpQuestions: ['孟德尔分离定律是什么？', '基因如何影响生物的表型？', '伴性遗传有什么特点？'],
        relatedConcepts: ['孟德尔定律', '基因型', '表现型', '伴性遗传']
      };

      return JSON.stringify(response);
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
