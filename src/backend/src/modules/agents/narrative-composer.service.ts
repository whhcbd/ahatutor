import { Injectable, Logger } from '@nestjs/common';
import { LLMService } from '../llm/llm.service';
import {
  NarrativeComposition,
  PrerequisiteNode,
  GeneticsEnrichment,
  ConceptAnalysis,
} from '@shared/types/agent.types';

/**
 * Agent 5: NarrativeComposer
 * "连接这些概念的故事是什么？"
 *
 * 职责：将零散知识点串联成完整的学习叙事
 * - 构建学习路径
 * - 设计讲解顺序
 * - 添加类比和记忆技巧
 * - 创造知识间的"桥梁"
 */

interface NarrativeStoryResponse {
  title: string;
  narrative: string;
  keyMoments?: string[];
  hooks?: string[];
}

interface LearningScriptResponse {
  script: string;
  estimatedTime: number;
  checkpoints: string[];
  discussionQuestions?: string[];
  takeaways?: string[];
}

@Injectable()
export class NarrativeComposerService {
  private readonly logger = new Logger(NarrativeComposerService.name);

  // 类比和隐喻库
  private readonly analogyLibrary = {
    基因: {
      analogy: '一本巨大的食谱书',
      explanation: 'DNA就像一本食谱书，每个基因是一道菜的食谱。有些食谱（显性基因）会被优先采用，有些（隐性基因）可能被搁置，但都完整保存在书中。',
      memoryTrick: 'DNA = Do Not Alter（不要改变）',
    },
    染色体: {
      analogy: '书架上的章节',
      explanation: '染色体就像书架上的不同章节，相关联的食谱（基因）被放在同一章节中。',
      memoryTrick: '23对染色体 = 23章教科书',
    },
    等位基因: {
      analogy: '同一道菜的不同版本',
      explanation: '等位基因就像同一道菜的多个版本——比如妈妈的食谱和爸爸的食谱略有不同。',
      memoryTrick: 'Allele = Alternative（替代版本）',
    },
    显性: {
      analogy: '大嗓门的厨师',
      explanation: '显性基因就像大嗓门的厨师，他的指令总是被听到和执行。',
      memoryTrick: '显性 = 先显示',
    },
    隐性: {
      analogy: '安静的厨师',
      explanation: '隐性基因就像安静的厨师，只有当没有大嗓门的厨师时，他的指令才会被听到。',
      memoryTrick: '隐性 = 隐藏着',
    },
    分离定律: {
      analogy: '洗牌',
      explanation: '基因分离就像洗牌——每张牌（基因）都是独立的，随机分配到新牌组（配子）中。',
      memoryTrick: '分离 = 分开给（分配给配子）',
    },
    伴性遗传: {
      analogy: '传家宝只传给特定性别的子女',
      explanation: '伴性遗传就像某些传家宝传统上只传给儿子或女儿，因为它放在Y染色体或X染色体上。',
      memoryTrick: '伴性 = 伙伴性别（与性别相关）',
    },
    连锁互换: {
      analogy: '邻居偶尔搬家',
      explanation: '连锁就像住得很近的邻居通常一起活动，互换就像偶尔有邻居互换房子。',
      memoryTrick: '连锁 = 连着一起',
    },
  };

  constructor(private readonly llmService: LLMService) {}

  /**
   * 创建学习叙事
   */
  async composeNarrative(
    concept: string,
    conceptAnalysis: ConceptAnalysis,
    prerequisiteTree: PrerequisiteNode,
    geneticsEnrichment: GeneticsEnrichment,
  ): Promise<NarrativeComposition> {
    this.logger.log(`Composing narrative for: ${concept}`);

    // 1. 从前置知识树生成学习路径
    const learningPath = this.generateLearningPath(prerequisiteTree);

    // 2. 确定讲解顺序
    const explanationOrder = this.determineExplanationOrder(
      concept,
      conceptAnalysis,
      geneticsEnrichment,
    );

    // 3. 创造连接故事
    const connectingStories = await this.createConnectingStories(
      learningPath,
      concept,
      geneticsEnrichment,
    );

    // 4. 确定难度递进模式
    const difficultyProgression = this.determineDifficultyProgression(
      conceptAnalysis.complexity,
      learningPath.length,
    );

    this.logger.log(`Narrative composed: ${learningPath.length} steps, ${difficultyProgression} progression`);

    return {
      learningPath,
      explanationOrder,
      connectingStories,
      difficultyProgression,
    };
  }

  /**
   * 从前置知识树生成学习路径
   */
  private generateLearningPath(prerequisiteTree: PrerequisiteNode): string[] {
    const path: string[] = [];

    // 后序遍历：从基础到目标
    const traverse = (node: PrerequisiteNode) => {
      node.prerequisites?.forEach(child => traverse(child));
      path.push(node.concept);
    };

    traverse(prerequisiteTree);
    return path;
  }

  /**
   * 确定讲解顺序
   */
  private determineExplanationOrder(
    concept: string,
    conceptAnalysis: ConceptAnalysis,
    geneticsEnrichment: GeneticsEnrichment,
  ): string[] {
    const order: string[] = [];

    // 1. 从核心定义开始
    order.push(`${concept}的定义`);

    // 2. 添加关键原理
    order.push(...geneticsEnrichment.principles.slice(0, 2));

    // 3. 添加经典实例
    if (geneticsEnrichment.examples.length > 0) {
      order.push(`实例：${geneticsEnrichment.examples[0].name}`);
    }

    // 4. 添加常见误区（如果有）
    if (geneticsEnrichment.misconceptions.length > 0) {
      order.push(`常见误区提醒`);
    }

    // 5. 根据复杂度决定是否添加高级内容
    if (conceptAnalysis.complexity === 'advanced' || conceptAnalysis.complexity === 'intermediate') {
      order.push('实际应用');
    }

    return order;
  }

  /**
   * 创造连接故事
   */
  private async createConnectingStories(
    learningPath: string[],
    targetConcept: string,
    geneticsEnrichment: GeneticsEnrichment,
  ): Promise<string[]> {
    const stories: string[] = [];

    // 1. 添加预定义的类比
    for (const concept of learningPath) {
      const analogy = this.analogyLibrary[concept as keyof typeof this.analogyLibrary];
      if (analogy) {
        stories.push(`📖 ${concept}：${analogy.analogy}`);
        stories.push(`   ${analogy.explanation}`);
        stories.push(`   💡 记忆技巧：${analogy.memoryTrick}`);
        stories.push('');
      }
    }

    // 2. 使用 LLM 生成连接故事
    const generatedStories = await this.generateStoriesWithLLM(
      learningPath,
      targetConcept,
      geneticsEnrichment,
    );

    stories.push(...generatedStories);

    return stories;
  }

  /**
   * 使用 LLM 生成连接故事
   */
  private async generateStoriesWithLLM(
    learningPath: string[],
    targetConcept: string,
    geneticsEnrichment: GeneticsEnrichment,
  ): Promise<string[]> {
    if (learningPath.length < 2) {
      return [];
    }

    const prompt = `你是一位擅长讲故事的科学教育家。请为以下学习路径创作一个连贯的叙事，将各个概念自然地连接起来。

学习路径: ${learningPath.join(' → ')}

目标概念: ${targetConcept}

关键原理: ${geneticsEnrichment.principles.join(', ')}

经典实例: ${geneticsEnrichment.examples.map(e => e.name).join(', ')}

要求：
1. 创作一个引人入胜的故事，像小说一样有起伏
2. 将科学概念自然地融入故事中
3. 使用类比和隐喻来降低理解难度
4. 故事应该有"发现"的元素，让学生感到探索的乐趣
5. 控制在 300-500 字
6. 使用生动的语言和具体例子

返回 JSON 格式：
{
  "title": "故事标题",
  "narrative": "完整的故事文本",
  "keyMoments": ["关键时刻1", "关键时刻2", ...],
  "hooks": ["吸引学生的钩子1", "钩子2", ...]
}`;

    const schema = {
      type: 'object',
      properties: {
        title: { type: 'string' },
        narrative: { type: 'string' },
        keyMoments: {
          type: 'array',
          items: { type: 'string' }
        },
        hooks: {
          type: 'array',
          items: { type: 'string' }
        }
      },
      required: ['title', 'narrative']
    };

    try {
      const response = await this.llmService.structuredChat<NarrativeStoryResponse>(
        [{ role: 'user', content: prompt }],
        schema,
        { temperature: 0.8 }  // 较高的温度以获得更有创意的故事
      );

      const stories: string[] = [];
      stories.push(`📚 ${response.title}`);
      stories.push(response.narrative);

      if (response.keyMoments && response.keyMoments.length > 0) {
        stories.push('');
        stories.push('🎯 关键时刻：');
        response.keyMoments.forEach(moment => {
          stories.push(`   • ${moment}`);
        });
      }

      if (response.hooks && response.hooks.length > 0) {
        stories.push('');
        stories.push('🪝 探索钩子：');
        response.hooks.forEach(hook => {
          stories.push(`   • ${hook}`);
        });
      }

      return stories;
    } catch (error) {
      this.logger.error('Failed to generate stories with LLM:', error);
      return [];
    }
  }

  /**
   * 确定难度递进模式
   */
  private determineDifficultyProgression(
    complexity: 'basic' | 'intermediate' | 'advanced',
    pathLength: number,
  ): 'linear' | 'spiral' | 'hierarchical' {
    // 螺旋式：概念会反复出现，每次深入一点
    // 适合复杂的主题
    if (complexity === 'advanced' && pathLength > 5) {
      return 'spiral';
    }

    // 分层式：先掌握基础，再进入下一层
    // 适合有明确层级的主题
    if (pathLength > 4) {
      return 'hierarchical';
    }

    // 线性式：直线前进，一环扣一环
    // 适合简单或中等复杂度的主题
    return 'linear';
  }

  /**
   * 生成详细的学习脚本
   */
  async generateLearningScript(
    narrative: NarrativeComposition,
    targetConcept: string,
    userLevel: 'beginner' | 'intermediate' | 'advanced' = 'intermediate',
  ): Promise<{
    script: string;
    estimatedTime: number;
    checkpoints: string[];
  }> {
    const prompt = `基于以下叙事结构，生成一个详细的讲解脚本。

学习路径: ${narrative.learningPath.join(' → ')}
讲解顺序: ${narrative.explanationOrder.join(' → ')}
难度递进: ${narrative.difficultyProgression}

目标概念: ${targetConcept}
用户水平: ${userLevel}

连接故事:
${narrative.connectingStories.join('\n')}

要求：
1. 生成一个完整的讲解脚本，可以直接用于视频录制或课堂讲解
2. 包含开场白、主体内容、总结
3. 标注关键的时间点和检查点（checkpoints）
4. 估算每个部分的时长
5. 使用生动有趣的语言
6. 在适当位置提出思考问题，保持学生参与度

返回 JSON 格式：
{
  "script": "完整的讲解脚本，用\\n\\n分隔段落",
  "estimatedTime": 总时长（分钟）,
  "checkpoints": ["检查点1", "检查点2", ...],
  "discussionQuestions": ["讨论问题1", "讨论问题2", ...],
  "takeaways": ["核心要点1", "核心要点2", ...]
}`;

    const schema = {
      type: 'object',
      properties: {
        script: { type: 'string' },
        estimatedTime: { type: 'number' },
        checkpoints: {
          type: 'array',
          items: { type: 'string' }
        },
        discussionQuestions: {
          type: 'array',
          items: { type: 'string' }
        },
        takeaways: {
          type: 'array',
          items: { type: 'string' }
        }
      },
      required: ['script', 'estimatedTime', 'checkpoints']
    };

    try {
      const response = await this.llmService.structuredChat<LearningScriptResponse>(
        [{ role: 'user', content: prompt }],
        schema,
        { temperature: 0.7 }
      );

      return {
        script: response.script,
        estimatedTime: response.estimatedTime,
        checkpoints: response.checkpoints,
      };
    } catch (error) {
      this.logger.error('Failed to generate learning script:', error);
      throw error;
    }
  }

  /**
   * 生成互动式学习流程
   */
  async generateInteractiveFlow(
    narrative: NarrativeComposition,
  ): Promise<Array<{
    step: number;
    title: string;
    content: string;
    type: 'explanation' | 'question' | 'activity' | 'assessment';
    interaction?: string;
  }>> {
    const flow: Array<{
      step: number;
      title: string;
      content: string;
      type: 'explanation' | 'question' | 'activity' | 'assessment';
      interaction?: string;
    }> = [];

    let stepNumber = 1;

    // 为学习路径中的每个概念创建一个步骤
    for (const concept of narrative.learningPath) {
      // 添加解释步骤
      const analogy = this.analogyLibrary[concept as keyof typeof this.analogyLibrary];

      flow.push({
        step: stepNumber++,
        title: `理解${concept}`,
        content: analogy
          ? `${concept}就像${analogy.analogy}。${analogy.explanation}`
          : `让我们来了解${concept}的核心概念。`,
        type: 'explanation',
        interaction: 'click_to_reveal',
      });

      // 添加互动问题
      if (analogy) {
        flow.push({
          step: stepNumber++,
          title: '快速记忆',
          content: `记住${concept}的技巧：${analogy.memoryTrick}`,
          type: 'question',
          interaction: 'flashcard',
        });
      }
    }

    // 添加综合评估
    flow.push({
      step: stepNumber,
      title: '知识综合',
      content: '现在让我们把所有概念联系起来，看看它们是如何共同工作的。',
      type: 'assessment',
      interaction: 'quiz',
    });

    return flow;
  }

  /**
   * 扁平化知识树为可读的层级结构
   */
  flattenTreeToString(prerequisiteTree: PrerequisiteNode, indent = 0): string {
    const lines: string[] = [];
    const prefix = '  '.repeat(indent);
    const marker = prerequisiteTree.isFoundation ? '📦' : '📚';

    lines.push(`${prefix}${marker} ${prerequisiteTree.concept} (Level ${prerequisiteTree.level})`);

    if (prerequisiteTree.prerequisites) {
      for (const child of prerequisiteTree.prerequisites) {
        lines.push(this.flattenTreeToString(child, indent + 1));
      }
    }

    return lines.join('\n');
  }
}
