import { Injectable, Logger } from '@nestjs/common';
import { LLMService } from '../llm/llm.service';
import { KnowledgeBaseService } from '../knowledge-base/knowledge-base.service';
import { PrerequisiteNode } from '@shared/types/agent.types';

/**
 * Agent 2: PrerequisiteExplorer
 * "理解这个前需要先懂什么？"
 *
 * 职责：递归构建遗传学知识树
 * 这是 AhaTutor 的核心创新功能
 *
 * 优化：优先从知识库获取，仅对未知概念调用 AI
 */
@Injectable()
export class PrerequisiteExplorerService {
  private readonly logger = new Logger(PrerequisiteExplorerService.name);

  // 遗传学基础概念（停止递归的条件）
  private readonly FOUNDATION_CONCEPTS = new Set([
    '基因', '染色体', 'DNA', 'RNA', '显性', '隐性',
    '减数分裂', '有丝分裂', '细胞核', '性状',
    '配子', '等位基因', '纯合子', '杂合子',
  ]);

  constructor(
    private readonly llmService: LLMService,
    private readonly knowledgeBase: KnowledgeBaseService,
  ) {}

  /**
   * 探索概念的前置知识（核心功能）
   *
   * @param concept 目标概念
   * @param maxDepth 递归深度（默认 3 层）
   * @returns 前置知识树
   */
  async explorePrerequisites(concept: string, maxDepth: number = 3): Promise<PrerequisiteNode> {
    this.logger.log(`Exploring prerequisites for: "${concept}" (max depth: ${maxDepth})`);

    // 1. 首先尝试从知识库获取
    const kbPrerequisites = this.knowledgeBase.getPrerequisites(concept);
    if (kbPrerequisites) {
      this.logger.log(`✅ Found prerequisites in knowledge base for: ${concept}`);
      // 如果知识库数据是完整的，直接返回
      if (kbPrerequisites.prerequisites && kbPrerequisites.prerequisites.length > 0) {
        this.logger.log(`Prerequisite exploration complete: ${concept} has ${this.countNodes(kbPrerequisites)} nodes (from KB)`);
        return kbPrerequisites;
      }
    }

    // 2. 知识库未找到或不完整，使用递归探索
    const result = await this.recursiveExplore(concept, 0, maxDepth);

    this.logger.log(`Prerequisite exploration complete: ${concept} has ${this.countNodes(result)} nodes`);

    return result;
  }

  /**
   * 递归探索前置知识
   */
  private async recursiveExplore(
    concept: string,
    currentDepth: number,
    maxDepth: number
  ): Promise<PrerequisiteNode> {
    // 检查是否为基础概念
    if (this.isFoundationConcept(concept)) {
      return {
        concept,
        isFoundation: true,
        level: currentDepth,
      };
    }

    // 达到最大深度，停止递归
    if (currentDepth >= maxDepth) {
      return {
        concept,
        isFoundation: false,
        level: currentDepth,
      };
    }

    // 先从知识库获取前置知识
    let prerequisites: string[] = [];
    const kbPrerequisites = this.knowledgeBase.getPrerequisites(concept);
    if (kbPrerequisites?.prerequisites) {
      // 提取前置概念名称
      prerequisites = kbPrerequisites.prerequisites.map(p => p.concept);
      this.logger.log(`✅ Using KB prerequisites for ${concept}: ${prerequisites.join(', ')}`);
    } else {
      // 知识库未找到，询问 LLM
      prerequisites = await this.getPrerequisitesFromLLM(concept);
    }

    // 递归探索每个前置概念
    const exploredPrerequisites = await Promise.all(
      prerequisites.map(async (prereq) => {
        return await this.recursiveExplore(prereq, currentDepth + 1, maxDepth);
      })
    );

    return {
      concept,
      isFoundation: false,
      level: currentDepth,
      prerequisites: exploredPrerequisites,
    };
  }

  /**
   * 从 LLM 获取直接前置知识（仅当知识库未找到时使用）
   */
  private async getPrerequisitesFromLLM(concept: string): Promise<string[]> {
    this.logger.log(`🤖 Calling AI for prerequisites of: ${concept}`);

    const prompt = `你是一位遗传学教育专家。

请回答：要理解"${concept}"，学生必须先掌握哪些概念？

要求：
1. 列出 3-5 个直接前置概念
2. 只列直接前置，不要列出间接前置
3. 返回 JSON 格式：{"prerequisites": ["概念1", "概念2", ...]}

注意：如果"${concept}"是基础概念（如：基因、染色体、DNA），返回空数组。`;

    try {
      const response = await this.llmService.structuredChat<{
        prerequisites: string[];
      }>(
        [{ role: 'user', content: prompt }],
        {
          type: 'object',
          properties: {
            prerequisites: {
              type: 'array',
              items: { type: 'string' }
            }
          }
        },
        { temperature: 0.3 }
      );

      return response.prerequisites || [];
    } catch (error) {
      this.logger.error(`Failed to get prerequisites for ${concept}:`, error);
      return [];
    }
  }

  /**
   * 判断是否为基础概念
   */
  private isFoundationConcept(concept: string): boolean {
    return this.FOUNDATION_CONCEPTS.has(concept);
  }

  /**
   * 计算知识树中的节点数量
   */
  private countNodes(node: PrerequisiteNode): number {
    let count = 1;
    if (node.prerequisites) {
      for (const prereq of node.prerequisites) {
        count += this.countNodes(prereq);
      }
    }
    return count;
  }

  /**
   * 将知识树扁平化为学习路径
   * 返回从基础到目标的节点序列
   */
  flattenToLearningPath(tree: PrerequisiteNode): string[] {
    const path: string[] = [];

    // 后序遍历：先访问子节点，再访问父节点
    // 这样可以得到从基础到目标的路径
    const postOrder = (node: PrerequisiteNode) => {
      if (node.prerequisites) {
        for (const prereq of node.prerequisites) {
          postOrder(prereq);
        }
      }
      if (!path.includes(node.concept)) {
        path.push(node.concept);
      }
    };

    postOrder(tree);
    return path;
  }

  /**
   * 生成知识树的文本表示
   */
  toString(tree: PrerequisiteNode, indent: number = 0): string {
    const prefix = '  '.repeat(indent);
    let result = `${prefix}${tree.concept}`;

    if (tree.isFoundation) {
      result += ' [基础 ✓]';
    }

    result += '\n';

    if (tree.prerequisites) {
      for (const prereq of tree.prerequisites) {
        result += this.toString(prereq, indent + 1);
      }
    }

    return result;
  }

  /**
   * 获取指定层级的所有节点
   */
  getNodesAtLevel(tree: PrerequisiteNode, level: number): string[] {
    const nodes: string[] = [];

    const traverse = (node: PrerequisiteNode) => {
      if (node.level === level) {
        nodes.push(node.concept);
      }
      if (node.prerequisites) {
        for (const prereq of node.prerequisites) {
          traverse(prereq);
        }
      }
    };

    traverse(tree);
    return nodes;
  }
}
