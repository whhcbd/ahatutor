import { Injectable } from '@nestjs/common';
import { Neo4jService } from './neo4j.service';
import { v4 as uuidv4 } from 'uuid';

/**
 * 图谱构建服务
 * 从 Agent 返回的知识树构建 Neo4j 图谱
 */
@Injectable()
export class GraphBuilderService {
  constructor(private readonly neo4j: Neo4jService) {}

  /**
   * 从 PrerequisiteExplorer Agent 的结果构建知识树
   */
  async buildFromAgentTree(data: {
    concept: string;
    tree: any;
    domain?: string;
  }): Promise<{
    rootId: string;
    nodesCreated: number;
    edgesCreated: number;
  }> {
    if (!this.neo4j.isConnected()) {
      throw new Error('Neo4j is not connected');
    }

    const { concept, tree, domain = 'genetics' } = data;

    // 创建根节点
    const rootId = uuidv4();
    await this.neo4j.createNode('KnowledgeNode', {
      id: rootId,
      name: concept,
      type: 'CONCEPT',
      level: 0,
      domain,
      createdAt: new Date().toISOString(),
    });

    let nodesCreated = 1;
    let edgesCreated = 0;

    // 递归创建节点和关系
    await this.buildTreeRecursive(tree, rootId, 1, domain);

    return {
      rootId,
      nodesCreated,
      edgesCreated,
    };
  }

  /**
   * 递归构建树
   */
  private async buildTreeRecursive(
    nodeData: any,
    parentId: string,
    level: number,
    domain: string,
  ): Promise<void> {
    if (!nodeData) return;

    const nodeName = nodeData.concept || nodeData.name;
    if (!nodeName) return;

    // 检查节点是否已存在
    const existing = await this.neo4j.run(
      `
      MATCH (n:KnowledgeNode {name: $name, domain: $domain})
      RETURN n
      `,
      { name: nodeName, domain },
    );

    let nodeId: string;

    if (existing.length > 0) {
      const node = existing[0]['n'] as any;
      nodeId = node.properties.id;
    } else {
      // 创建新节点
      nodeId = uuidv4();
      await this.neo4j.createNode('KnowledgeNode', {
        id: nodeId,
        name: nodeName,
        type: nodeData.isFoundation ? 'FOUNDATION' : 'CONCEPT',
        level,
        domain,
        description: nodeData.description,
        isFoundation: nodeData.isFoundation || false,
        createdAt: new Date().toISOString(),
      });
    }

    // 创建 PREREQUISITE 关系（从父节点指向子节点）
    // 表示：要理解父节点，需要先掌握子节点
    const existingRelation = await this.neo4j.run(
      `
      MATCH (from {id: $parentId})-[r:PREREQUISITE]->(to {id: $nodeId})
      RETURN r
      `,
      { parentId, nodeId },
    );

    if (existingRelation.length === 0) {
      await this.neo4j.createEdge(parentId, nodeId, 'PREREQUISITE', {
        weight: 1 / level,
      });
    }

    // 递归处理子节点
    if (nodeData.prerequisites && Array.isArray(nodeData.prerequisites)) {
      for (const child of nodeData.prerequisites) {
        await this.buildTreeRecursive(child, nodeId, level + 1, domain);
      }
    }
  }

  /**
   * 从知识树类型定义构建图谱
   */
  async buildFromKnowledgeTree(tree: {
    id: string;
    name: string;
    nodes: Map<string, any>;
  }): Promise<void> {
    if (!this.neo4j.isConnected()) {
      throw new Error('Neo4j is not connected');
    }

    // 创建所有节点
    for (const [nodeId, node] of Object.entries(tree.nodes)) {
      await this.neo4j.createNode('KnowledgeNode', {
        id: nodeId,
        name: node.name,
        type: node.type,
        level: node.level,
        status: node.status,
        mastery: node.mastery,
        domain: tree.name,
        ...node.metadata,
      });
    }

    // 创建所有关系
    for (const [nodeId, node] of Object.entries(tree.nodes)) {
      // 创建前置关系
      for (const prereqId of node.prerequisites || []) {
        await this.neo4j.createEdge(nodeId, prereqId, 'PREREQUISITE');
      }

      // 创建父子关系
      for (const childId of node.children || []) {
        await this.neo4j.createEdge(nodeId, childId, 'CONTAINS');
      }
    }
  }

  /**
   * 清空图谱
   */
  async clearGraph(domain?: string): Promise<void> {
    if (domain) {
      await this.neo4j.run(
        `
        MATCH (n:KnowledgeNode {domain: $domain})
        DETACH DELETE n
        `,
        { domain },
      );
    } else {
      await this.neo4j.run('MATCH (n) DETACH DELETE n');
    }
  }
}
