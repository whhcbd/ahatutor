import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import neo4j, { Driver, Session } from 'neo4j-driver';

/**
 * Neo4j 服务
 * 封装 Neo4j 数据库连接和基本操作
 */
@Injectable()
export class Neo4jService implements OnModuleInit, OnModuleDestroy {
  private driver: Driver | null = null;
  private readonly uri: string;
  private readonly user: string;
  private readonly password: string;

  constructor() {
    this.uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
    this.user = process.env.NEO4J_USER || 'neo4j';
    this.password = process.env.NEO4J_PASSWORD || 'password';
  }

  async onModuleInit() {
    try {
      this.driver = neo4j.driver(
        this.uri,
        neo4j.auth.basic(this.user, this.password),
      );

      // 测试连接
      const session = this.driver.session();
      try {
        await session.run('RETURN 1');
        console.log('Neo4j connection established successfully');
      } finally {
        await session.close();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn('Neo4j connection failed:', message);
      console.warn('Knowledge graph features will be limited');
      this.driver = null;
    }
  }

  async onModuleDestroy() {
    if (this.driver) {
      await this.driver.close();
    }
  }

  /**
   * 获取会话
   */
  getSession(): Session | null {
    if (!this.driver) return null;
    return this.driver.session();
  }

  /**
   * 执行 Cypher 查询
   */
  async run(cypher: string, params: Record<string, any> = {}): Promise<Record<string, any>[]> {
    const session = this.getSession();
    if (!session) {
      throw new Error('Neo4j is not connected');
    }

    try {
      const result = await session.run(cypher, params);
      return result.records.map((record) => record.toObject());
    } finally {
      await session.close();
    }
  }

  /**
   * 创建节点
   */
  async createNode(
    label: string,
    properties: Record<string, any>,
  ): Promise<Record<string, any> | null> {
    const cypher = `CREATE (n:${label} $props) RETURN n`;
    const result = await this.run(cypher, { props: properties });
    return result[0]?.n || null;
  }

  /**
   * 获取节点
   */
  async getNode(id: string): Promise<Record<string, any> | null> {
    const cypher = 'MATCH (n {id: $id}) RETURN n';
    const result = await this.run(cypher, { id });
    return result[0]?.n || null;
  }

  /**
   * 更新节点
   */
  async updateNode(
    id: string,
    properties: Record<string, any>,
  ): Promise<Record<string, any> | null> {
    const cypher = 'MATCH (n {id: $id}) SET n += $props RETURN n';
    const result = await this.run(cypher, { id, props: properties });
    return result[0]?.n || null;
  }

  /**
   * 删除节点
   */
  async deleteNode(id: string): Promise<boolean> {
    const cypher = 'MATCH (n {id: $id}) DETACH DELETE n RETURN count(n) as deleted';
    const result = await this.run(cypher, { id });
    return (result[0]?.deleted ?? 0) > 0;
  }

  /**
   * 创建关系
   */
  async createEdge(
    fromId: string,
    toId: string,
    type: string,
    properties: Record<string, any> = {},
  ): Promise<Record<string, any> | null> {
    // Build cypher query dynamically
    const cypher = `MATCH (from {id: $fromId}) MATCH (to {id: $toId}) CREATE (from)-[r:${type} $props]->(to) RETURN r`;
    const result = await this.run(cypher, {
      fromId,
      toId,
      props: properties,
    });
    return result[0]?.r || null;
  }

  /**
   * 删除关系
   */
  async deleteEdge(id: string): Promise<boolean> {
    const cypher = 'MATCH ()-[r {id: $id}]-() DELETE r RETURN count(r) as deleted';
    const result = await this.run(cypher, { id });
    return (result[0]?.deleted ?? 0) > 0;
  }

  /**
   * 获取节点的所有关系
   */
  async getNodeRelations(
    id: string,
    direction: 'incoming' | 'outgoing' | 'both' = 'both',
  ): Promise<Array<{ from: any; relationship: any; to: any }>> {
    let directionPattern = '-';
    if (direction === 'incoming') directionPattern = '<-';
    if (direction === 'outgoing') directionPattern = '-';

    const cypher = `MATCH (n {id: $id})${directionPattern}[r]-(m) RETURN n as from, r as relationship, m as to`;
    const result = await this.run(cypher, { id });
    return result as any;
  }

  /**
   * 搜索节点
   */
  async searchNodes(query: string, limit = 10): Promise<Record<string, any>[]> {
    const cypher = 'MATCH (n) WHERE n.name CONTAINS $query OR n.description CONTAINS $query RETURN n LIMIT $limit';
    const result = await this.run(cypher, { query, limit });
    return result.map((r) => r.n);
  }

  /**
   * 获取图谱统计信息
   */
  async getStats(): Promise<{
    totalNodes: number;
    totalEdges: number;
    nodeTypes: Record<string, number>;
  }> {
    const nodeCountCypher = 'MATCH (n) RETURN count(n) as count';
    const edgeCountCypher = 'MATCH ()-[r]->() RETURN count(r) as count';
    const nodeTypesCypher = 'MATCH (n) RETURN n.type as type, count(n) as count';

    const [nodeResult, edgeResult, typeResult] = await Promise.all([
      this.run(nodeCountCypher),
      this.run(edgeCountCypher),
      this.run(nodeTypesCypher),
    ]);

    const nodeTypes: Record<string, number> = {};
    for (const row of typeResult) {
      const type = row.type as string | undefined;
      const count = row.count as number | undefined;
      nodeTypes[type || 'unknown'] = count ?? 0;
    }

    return {
      totalNodes: (nodeResult[0]?.count as number | undefined) ?? 0,
      totalEdges: (edgeResult[0]?.count as number | undefined) ?? 0,
      nodeTypes,
    };
  }

  /**
   * 检查连接状态
   */
  isConnected(): boolean {
    return this.driver !== null;
  }
}
