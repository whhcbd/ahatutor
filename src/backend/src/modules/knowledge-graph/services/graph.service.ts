import { Injectable, Logger } from '@nestjs/common';
import { Neo4jService } from './neo4j.service';
import { GraphBuilderService } from './graph-builder.service';
import { PathFinderService } from './path-finder.service';
import {
  CreateNodeDto,
  CreateEdgeDto,
  GetPathDto,
  GraphQueryDto,
} from '../dto/graph.dto';

/**
 * 知识图谱服务
 * 协调图谱操作的统一入口
 */
@Injectable()
export class GraphService {
  private readonly logger = new Logger(GraphService.name);
  constructor(
    private readonly neo4j: Neo4jService,
    private readonly graphBuilder: GraphBuilderService,
    private readonly pathFinder: PathFinderService,
  ) {}

  /**
   * 创建知识节点
   */
  async createNode(dto: CreateNodeDto) {
    if (!this.neo4j.isConnected()) {
      this.logger.warn('Neo4j is not connected, cannot create node');
      return null;
    }

    const nodeId = `node_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

    const node = await this.neo4j.createNode('KnowledgeNode', {
      id: nodeId,
      ...dto,
      createdAt: new Date().toISOString(),
    });

    return node;
  }

  /**
   * 获取节点
   */
  async getNode(id: string) {
    if (!this.neo4j.isConnected()) {
      this.logger.warn('Neo4j is not connected, cannot get node');
      return null;
    }
    return this.neo4j.getNode(id);
  }

  /**
   * 搜索节点
   */
  async searchNodes(query: string) {
    if (!this.neo4j.isConnected()) {
      this.logger.warn('Neo4j is not connected, cannot search nodes');
      return [];
    }
    return this.neo4j.searchNodes(query);
  }

  /**
   * 获取节点关系
   */
  async getNodeRelations(id: string, direction: 'incoming' | 'outgoing' | 'both') {
    if (!this.neo4j.isConnected()) {
      this.logger.warn('Neo4j is not connected, cannot get node relations');
      return { incoming: [], outgoing: [] };
    }
    return this.neo4j.getNodeRelations(id, direction);
  }

  /**
   * 删除节点
   */
  async deleteNode(id: string) {
    if (!this.neo4j.isConnected()) {
      this.logger.warn('Neo4j is not connected, cannot delete node');
      return;
    }
    return this.neo4j.deleteNode(id);
  }

  /**
   * 创建关系
   */
  async createEdge(dto: CreateEdgeDto) {
    if (!this.neo4j.isConnected()) {
      this.logger.warn('Neo4j is not connected, cannot create edge');
      return null;
    }
    const edge = await this.neo4j.createEdge(
      dto.from,
      dto.to,
      dto.type,
      { weight: dto.weight },
    );
    return edge;
  }

  /**
   * 删除关系
   */
  async deleteEdge(id: string) {
    if (!this.neo4j.isConnected()) {
      this.logger.warn('Neo4j is not connected, cannot delete edge');
      return;
    }
    return this.neo4j.deleteEdge(id);
  }

  /**
   * 查找学习路径
   */
  async findPath(dto: GetPathDto) {
    switch (dto.algorithm) {
      case 'shortest':
        return this.pathFinder.findShortestPath(dto.from, dto.to);
      case 'breadth':
      case 'depth':
        const paths = await this.pathFinder.findAllPaths(dto.from, dto.to);
        return paths[0] || [];
      default:
        return this.pathFinder.findShortestPath(dto.from, dto.to);
    }
  }

  /**
   * 获取图谱数据（用于前端 D3.js 可视化）
   */
  async getGraphData(dto: GraphQueryDto) {
    if (!this.neo4j.isConnected()) {
      return { nodes: [], edges: [] };
    }

    let cypher = 'MATCH (n:KnowledgeNode)';
    const params: Record<string, any> = {};

    if (dto.domain) {
      cypher += ' WHERE n.domain = $domain';
      params.domain = dto.domain;
    }

    if (dto.root) {
      const depth = dto.depth ?? 2;
      const depthStr = depth.toString();
      cypher = `MATCH (root:KnowledgeNode {id: $root}) MATCH (root)<-[:PREREQUISITE*0..${depthStr}]-(n:KnowledgeNode) ${dto.domain ? 'WHERE n.domain = $domain' : ''} RETURN DISTINCT n`;
      params.root = dto.root;
    } else {
      cypher += ' RETURN n LIMIT 100';
    }

    const nodeResults = await this.neo4j.run(cypher, params);
    const nodeIds = new Set(nodeResults.map((r) => {
      const node = r['n'] as any;
      return node.properties.id;
    }));

    // 获取节点之间的关系
    const edgeCypher = 'MATCH (a:KnowledgeNode)-[r:PREREQUISITE]->(b:KnowledgeNode) WHERE a.id IN $nodeIds AND b.id IN $nodeIds RETURN a.id as from, b.id as to, r.weight as weight';

    const edgeResults = await this.neo4j.run(edgeCypher, { nodeIds: Array.from(nodeIds) });

    // 转换为 D3.js 格式
    const nodes = nodeResults.map((r) => {
      const node = r['n'] as any;
      const props = node.properties || {};
      return {
        id: props.id,
        name: props.name,
        type: props.type,
        level: props.level || 0,
        mastery: props.mastery || 0,
        group: props.level || 0,
      };
    });

    const edges = edgeResults.map((r) => ({
      source: r['from'],
      target: r['to'],
      weight: r['weight'] ?? 1,
    }));

    return { nodes, edges };
  }

  /**
   * 获取图谱统计信息
   */
  async getStats() {
    if (!this.neo4j.isConnected()) {
      return {
        totalNodes: 0,
        totalEdges: 0,
        nodeTypes: {},
        connected: false,
      };
    }

    const stats = await this.neo4j.getStats();
    return {
      ...stats,
      connected: true,
    };
  }

  /**
   * 从 Agent 结果构建知识树
   */
  async buildFromAgent(data: { concept: string; tree: any }) {
    return this.graphBuilder.buildFromAgentTree(data);
  }

  /**
   * 获取学习路径
   */
  async getLearningPath(targetConcept: string) {
    return this.pathFinder.getLearningPath(targetConcept);
  }

  /**
   * 检查是否可以学习某个节点
   */
  async canLearn(nodeId: string, masteredNodes: string[] = []) {
    return this.pathFinder.canLearn(nodeId, masteredNodes);
  }

  /**
   * 获取相关节点推荐
   */
  async getRelatedNodes(nodeId: string, limit: number = 5) {
    return this.pathFinder.getRelatedNodes(nodeId, limit);
  }
}
