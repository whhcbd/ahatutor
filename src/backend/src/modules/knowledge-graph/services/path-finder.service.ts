import { Injectable } from '@nestjs/common';
import { Neo4jService } from './neo4j.service';

/**
 * 路径查找服务
 * 在知识图谱中查找学习路径
 */
@Injectable()
export class PathFinderService {
  constructor(private readonly neo4j: Neo4jService) {}

  /**
   * 查找最短路径
   */
  async findShortestPath(from: string, to: string): Promise<string[]> {
    const cypher = `MATCH path = shortestPath((start:KnowledgeNode {name: $from})<-[:PREREQUISITE*]-(end:KnowledgeNode {name: $to})) RETURN [node in nodes(path) | node.id] as nodeIds ORDER BY length(path) LIMIT 1`;
    const result = await this.neo4j.run(cypher, { from, to });
    const nodeIds = result[0]?.['nodeIds'];
    return Array.isArray(nodeIds) ? nodeIds : [];
  }

  /**
   * 查找所有路径（按深度优先）
   */
  async findAllPaths(
    from: string,
    to: string,
    maxDepth: number = 10,
  ): Promise<string[][]> {
    const maxDepthStr = maxDepth.toString();
    const cypher = `MATCH path = (start:KnowledgeNode {name: $from})<-[:PREREQUISITE*0..${maxDepthStr}]-(end:KnowledgeNode {name: $to}) RETURN [node in nodes(path) | node.id] as nodeIds ORDER BY length(path)`;
    const result = await this.neo4j.run(cypher, { from, to });
    return result.map((r) => {
      const nodeIds = r['nodeIds'];
      return Array.isArray(nodeIds) ? nodeIds : [];
    });
  }

  /**
   * 获取学习路径（从基础到目标）
   * 返回从目标节点递归向下找到所有基础节点的路径
   */
  async getLearningPath(targetConcept: string): Promise<{
    path: Array<{ id: string; name: string; level: number }>;
    totalNodes: number;
    estimatedTime: number;
  }> {
    const cypher = `MATCH path = (target:KnowledgeNode {name: $target})<-[:PREREQUISITE*]-(foundation:KnowledgeNode) WHERE foundation.isFoundation = true OR NOT ()<-[:PREREQUISITE]-(foundation) WITH target, foundation, path ORDER BY length(path) ASC WITH target, collect(DISTINCT foundation) as foundations MATCH path = (target)<-[:PREREQUISITE*]-(f) WHERE f in foundations UNWIND nodes(path) as node RETURN DISTINCT node.id as id, node.name as name, node.level as level ORDER BY level, name`;

    const result = await this.neo4j.run(cypher, { target: targetConcept });

    const path = result.map((r) => ({
      id: r['id'] as string,
      name: r['name'] as string,
      level: (r['level'] as number | undefined) ?? 0,
    }));

    // 估算学习时间（每个节点 15 分钟）
    const estimatedTime = path.length * 15;

    return {
      path,
      totalNodes: path.length,
      estimatedTime,
    };
  }

  /**
   * 获取子图（以某节点为根）
   */
  async getSubgraph(
    rootId: string,
    maxDepth: number = 3,
  ): Promise<{
    nodes: Array<any>;
    edges: Array<any>;
  }> {
    const maxDepthStr = maxDepth.toString();
    const cypher = `MATCH (root:KnowledgeNode {id: $rootId}) MATCH (root)<-[:PREREQUISITE*0..${maxDepthStr}]-(descendant:KnowledgeNode) WITH root, collect(DISTINCT descendant) as descendants UNWIND descendants as d OPTIONAL MATCH (d)<-[r:PREREQUISITE]-(related:KnowledgeNode) WHERE related in descendants RETURN DISTINCT d as node, collect(DISTINCT {from: related.id, to: d.id, type: 'PREREQUISITE'}) as edges`;

    const result = await this.neo4j.run(cypher, { rootId });

    const nodes = result.map((r) => r['node']);
    const edges = result.flatMap((r) => {
      const edgeArray = r['edges'];
      return Array.isArray(edgeArray) ? edgeArray : [];
    }).filter((e: any) => e?.from);

    return { nodes, edges };
  }

  /**
   * 获取相关节点推荐
   */
  async getRelatedNodes(
    nodeId: string,
    limit: number = 5,
  ): Promise<Array<{ id: string; name: string; relation: string }>> {
    const cypher = 'MATCH (n:KnowledgeNode {id: $nodeId}) MATCH (n)-[r:PREREQUISITE|RELATED]-(related:KnowledgeNode) RETURN related.id as id, related.name as name, type(r) as relation LIMIT $limit';
    const result = await this.neo4j.run(cypher, { nodeId, limit });
    return result.map((r) => ({
      id: r['id'] as string,
      name: r['name'] as string,
      relation: r['relation'] as string,
    }));
  }

  /**
   * 检查节点是否可以学习（前置条件是否满足）
   */
  async canLearn(nodeId: string, masteredNodes: string[] = []): Promise<{
    canLearn: boolean;
    missingPrerequisites: string[];
  }> {
    const cypher = 'MATCH (n:KnowledgeNode {id: $nodeId}) MATCH (n)<-[:PREREQUISITE]-(prereq:KnowledgeNode) RETURN prereq.id as id, prereq.name as name';

    const result = await this.neo4j.run(cypher, { nodeId });
    const prerequisites = result.map((r) => r['id'] as string);

    const missing = prerequisites.filter((id) => !masteredNodes.includes(id));

    return {
      canLearn: missing.length === 0,
      missingPrerequisites: missing,
    };
  }
}
