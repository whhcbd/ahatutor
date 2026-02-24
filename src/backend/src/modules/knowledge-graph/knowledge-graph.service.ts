import { Injectable, Logger, OnModuleInit, Optional } from '@nestjs/common';
import { LLMService } from '../llm/llm.service';
import { KnowledgeGraph, KnowledgeGraphNode, KnowledgeGraphEdge, KnowledgeGraphQuery, KnowledgeGraphNodeDetail } from '@shared/types/knowledge-graph.types';
import {  } from '@shared/types/agent.types';

@Injectable()
export class KnowledgeGraphService implements OnModuleInit {
  private readonly logger = new Logger(KnowledgeGraphService.name);
  private cachedGraph: KnowledgeGraph | null = null;
  private readonly COLORS = [
    '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', 
    '#6366F1', '#EF4444', '#14B8A6', '#F97316', '#06B6D4'
  ];

  constructor(
    private readonly llmService: LLMService,
  ) {}

  async onModuleInit() {
    this.logger.log('Knowledge Graph Service initialized (will build on demand)');
  }

  async buildKnowledgeGraph(): Promise<KnowledgeGraph> {
    if (this.cachedGraph) {
      return this.cachedGraph;
    }

    this.logger.log('Building knowledge graph from genetics topics...');

    try {
      const nodes = this.extractNodesFromTopics();
      const edges = this.generateEdges(nodes);
      const clusters = this.detectClusters(nodes);

      const graph: KnowledgeGraph = {
        nodes,
        edges,
        clusters,
      };

      this.cachedGraph = graph;
      this.logger.log(`Knowledge graph built: ${nodes.length} nodes, ${edges.length} edges`);
      return graph;
    } catch (error) {
      this.logger.error('Failed to build knowledge graph:', error);
      return { nodes: [], edges: [] };
    }
  }

  private extractNodesFromTopics(): KnowledgeGraphNode[] {
    const nodes: KnowledgeGraphNode[] = [];
    
    const geneticsTopics: string[] = [
      '孟德尔第一定律', '孟德尔第二定律', '伴性遗传', '连锁互换', '基因型与表型',
      '显性与隐性遗传', '不完全显性', '共显性', '复等位基因', '多基因遗传',
      'DNA复制', '转录与翻译', '基因突变', '染色体变异', '基因重组',
      '中心法则', '基因表达调控', '表观遗传学', 'RNA干扰', 'PCR技术',
      '减数分裂', '有丝分裂', '染色体结构', '核型分析', '染色体畸变',
      '单倍体与多倍体', '哈代-温伯格定律', '基因频率', '遗传漂变', '自然选择',
      '物种形成', '遗传咨询', '基因检测', '基因治疗', '转基因技术',
      '克隆技术', '人类基因组计划', '母系遗传', '基因组印记', '线粒体遗传',
      '限制性片段长度多态性', '嵌合体', '镶嵌现象', 'X染色体失活', '三体综合征',
      '常染色体显性遗传病', '常染色体隐性遗传病', 'X连锁显性遗传病', 'X连锁隐性遗传病',
      '唐氏综合征', '苯丙酮尿症', '白化病', '血友病', '色盲', '镰刀型细胞贫血症',
      '限制性内切酶', 'DNA连接酶', '质粒载体', '基因文库', 'DNA指纹技术',
      'Southern杂交', 'Northern杂交', 'Western杂交', '荧光原位杂交', '基因敲除技术',
      'CRISPR-Cas9技术', '干细胞技术', '孟德尔杂交实验', '测交实验', '果蝇遗传实验',
      '肺炎双球菌转化实验', '噬菌体侵染实验', 'DNA双螺旋模型', '格里菲斯实验',
      '艾弗里实验', '赫尔希-蔡斯实验', '数量性状', '质量性状', '遗传率',
      '广义遗传率', '狭义遗传率', '加性效应', '显性效应', '上位性效应',
      '同源异形基因', '发育调控基因', '细胞分化', '细胞凋亡', '胚胎发育遗传控制'
    ];

    const topicCategories = [
      { name: '经典遗传学', topics: geneticsTopics.slice(0, 10), difficulty: 'beginner' },
      { name: '分子遗传学', topics: geneticsTopics.slice(10, 20), difficulty: 'intermediate' },
      { name: '细胞遗传学', topics: geneticsTopics.slice(20, 26), difficulty: 'intermediate' },
      { name: '群体遗传学', topics: geneticsTopics.slice(26, 31), difficulty: 'advanced' },
      { name: '应用遗传学', topics: geneticsTopics.slice(31, 37), difficulty: 'intermediate' },
      { name: '特殊遗传现象', topics: geneticsTopics.slice(37, 45), difficulty: 'advanced' },
      { name: '遗传病相关', topics: geneticsTopics.slice(45, 55), difficulty: 'intermediate' },
      { name: '基因工程与生物技术', topics: geneticsTopics.slice(55, 67), difficulty: 'advanced' },
      { name: '遗传学实验方法', topics: geneticsTopics.slice(67, 76), difficulty: 'intermediate' },
      { name: '数量遗传学', topics: geneticsTopics.slice(76, 84), difficulty: 'advanced' },
      { name: '发育遗传学', topics: geneticsTopics.slice(84, 89), difficulty: 'advanced' },
    ];

    for (const category of topicCategories) {
      for (const topic of category.topics) {
        const node: KnowledgeGraphNode = {
          id: this.generateNodeId(topic),
          label: topic,
          category: category.name,
          description: this.generateDescription(topic, category.name),
          difficulty: category.difficulty as 'beginner' | 'intermediate' | 'advanced',
          importance: this.calculateTopicImportance(topic, category.name),
          metadata: {
            topics: [category.name],
          },
        };
        nodes.push(node);
      }
    }

    this.logger.log(`Extracted ${nodes.length} nodes from genetics topics`);
    return nodes;
  }

  private generateDescription(topic: string, category: string): string {
    const descriptions: Record<string, string> = {
      '孟德尔定律': '孟德尔定律是遗传学的基本定律，包括分离定律和自由组合定律',
      '基因': '基因是遗传的基本单位，控制生物体的性状表现',
      '染色体': '染色体是细胞核内携带遗传信息的结构',
      'DNA': 'DNA是脱氧核糖核酸，是主要的遗传物质',
      'RNA': 'RNA是核糖核酸，参与蛋白质合成过程',
      '伴性遗传': '伴性遗传是指性状的遗传与性别相关联',
      '连锁互换': '连锁互换是指同一染色体上的基因在遗传过程中一起传递或发生交换',
      '基因突变': '基因突变是指基因结构的改变',
      '染色体变异': '染色体变异是指染色体结构和数目的改变',
    };

    return descriptions[topic] || `${topic}是${category}中的重要概念，与遗传学研究密切相关`;
  }

  private calculateTopicImportance(topic: string, category: string): number {
    let importance = 0.5;

    const importantKeywords = ['定律', '原理', '基础', '核心', '重要', '机制', '过程', '结构'];
    for (const keyword of importantKeywords) {
      if (topic.includes(keyword)) {
        importance += 0.2;
      }
    }

    if (category === '经典遗传学' || category === '分子遗传学') {
      importance += 0.1;
    }

    return Math.min(1, importance);
  }

  private generateEdges(nodes: KnowledgeGraphNode[]): KnowledgeGraphEdge[] {
    const edges: KnowledgeGraphEdge[] = [];
    const edgeIdSet = new Set<string>();

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const nodeA = nodes[i];
        const nodeB = nodes[j];

        if (this.shouldConnect(nodeA, nodeB)) {
          const edgeId = this.generateEdgeId(nodeA.id, nodeB.id);
          if (!edgeIdSet.has(edgeId)) {
            const edgeType = this.determineEdgeType(nodeA, nodeB);
            const edge: KnowledgeGraphEdge = {
              id: edgeId,
              source: nodeA.id,
              target: nodeB.id,
              type: edgeType,
              weight: this.calculateEdgeWeight(nodeA, nodeB),
              description: this.generateEdgeDescription(edgeType, nodeA.label, nodeB.label),
            };
            edges.push(edge);
            edgeIdSet.add(edgeId);
          }
        }
      }
    }

    this.logger.log(`Generated ${edges.length} edges`);
    
    if (edges.length === 0 && nodes.length > 1) {
      this.logger.warn('No edges generated, creating minimum connections');
      return this.ensureMinimumConnections(nodes);
    }
    
    return edges;
  }

  private ensureMinimumConnections(nodes: KnowledgeGraphNode[]): KnowledgeGraphEdge[] {
    const edges: KnowledgeGraphEdge[] = [];
    const edgeIdSet = new Set<string>();
    
    for (let i = 0; i < nodes.length - 1; i++) {
      const nodeA = nodes[i];
      const nodeB = nodes[i + 1];
      const edgeId = this.generateEdgeId(nodeA.id, nodeB.id);
      const edge: KnowledgeGraphEdge = {
        id: edgeId,
        source: nodeA.id,
        target: nodeB.id,
        type: 'related',
        weight: 0.5,
        description: `${nodeA.label} - ${nodeB.label}`,
      };
      edges.push(edge);
      edgeIdSet.add(edgeId);
    }
    
    return edges;
  }

  private shouldConnect(nodeA: KnowledgeGraphNode, nodeB: KnowledgeGraphNode): boolean {
    if (nodeA.category === nodeB.category) {
      return Math.random() < 0.5;
    }
    return Math.random() < 0.2;
  }

  private determineEdgeType(nodeA: KnowledgeGraphNode, nodeB: KnowledgeGraphNode): 'prerequisite' | 'related' | 'causal' | 'hierarchical' {
    const prerequisiteCategories = ['经典遗传学', '分子遗传学'];
    const advancedCategories = ['基因工程与生物技术', '发育遗传学', '数量遗传学'];

    if (prerequisiteCategories.includes(nodeA.category) && advancedCategories.includes(nodeB.category)) {
      return 'prerequisite';
    }
    if (nodeA.category === nodeB.category) {
      return 'related';
    }
    if (advancedCategories.includes(nodeA.category) || advancedCategories.includes(nodeB.category)) {
      return 'causal';
    }
    return 'related';
  }

  private calculateEdgeWeight(nodeA: KnowledgeGraphNode, nodeB: KnowledgeGraphNode): number {
    let weight = 0.5;

    if (nodeA.category === nodeB.category) {
      weight += 0.2;
    }

    weight += (nodeA.importance + nodeB.importance) / 4;

    return Math.min(1, Math.max(0.1, weight));
  }

  private generateEdgeDescription(
    type: string, 
    sourceLabel: string, 
    targetLabel: string
  ): string {
    const descriptions = {
      prerequisite: `${sourceLabel} 是 ${targetLabel} 的前置知识`,
      related: `${sourceLabel} 与 ${targetLabel} 相关`,
      causal: `${sourceLabel} 影响 ${targetLabel}`,
      hierarchical: `${targetLabel} 属于 ${sourceLabel}`,
    };
    return descriptions[type as keyof typeof descriptions] || `${sourceLabel} - ${targetLabel}`;
  }

  private detectClusters(nodes: KnowledgeGraphNode[]) {
    const categoryMap = new Map<string, KnowledgeGraphNode[]>();
    
    for (const node of nodes) {
      if (!categoryMap.has(node.category)) {
        categoryMap.set(node.category, []);
      }
      categoryMap.get(node.category)!.push(node);
    }

    const clusters = Array.from(categoryMap.entries()).map(([category, nodesInCategory], index) => ({
      id: `cluster-${index}`,
      name: category,
      nodes: nodesInCategory.map(n => n.id),
      color: this.COLORS[index % this.COLORS.length],
    }));

    return clusters;
  }

  async queryGraph(query: KnowledgeGraphQuery): Promise<KnowledgeGraph> {
    const fullGraph = await this.buildKnowledgeGraph();
    
    let filteredNodes = [...fullGraph.nodes];
    let filteredEdges = [...fullGraph.edges];

    if (query.rootConcept) {
      const rootNode = filteredNodes.find(n => n.label === query.rootConcept);
      if (rootNode) {
        const relatedNodeIds = this.getRelatedNodes(rootNode.id, filteredEdges, query.depth || 2);
        filteredNodes = filteredNodes.filter(n => relatedNodeIds.has(n.id));
        filteredEdges = filteredEdges.filter(e => 
          relatedNodeIds.has(e.source) && relatedNodeIds.has(e.target)
        );
      }
    }

    if (query.categories && query.categories.length > 0) {
      filteredNodes = filteredNodes.filter(n => query.categories!.includes(n.category));
    }

    if (query.difficulty && query.difficulty !== 'all') {
      filteredNodes = filteredNodes.filter(n => n.difficulty === query.difficulty);
    }

    const filteredNodeIds = new Set(filteredNodes.map(n => n.id));
    filteredEdges = filteredEdges.filter(e => 
      filteredNodeIds.has(e.source) && filteredNodeIds.has(e.target)
    );

    return {
      nodes: filteredNodes,
      edges: filteredEdges,
      clusters: fullGraph.clusters,
    };
  }

  private getRelatedNodes(rootNodeId: string, edges: KnowledgeGraphEdge[], maxDepth: number): Set<string> {
    const visited = new Set<string>([rootNodeId]);
    const queue: Array<[string, number]> = [[rootNodeId, 0]];

    while (queue.length > 0) {
      const [nodeId, depth] = queue.shift()!;
      
      if (depth >= maxDepth) continue;

      const connectedEdges = edges.filter(e => e.source === nodeId || e.target === nodeId);
      for (const edge of connectedEdges) {
        const connectedNodeId = edge.source === nodeId ? edge.target : edge.source;
        if (!visited.has(connectedNodeId)) {
          visited.add(connectedNodeId);
          queue.push([connectedNodeId, depth + 1]);
        }
      }
    }

    return visited;
  }

  async getNodeDetail(nodeId: string): Promise<KnowledgeGraphNodeDetail | null> {
    const graph = await this.buildKnowledgeGraph();
    const node = graph.nodes.find(n => n.id === nodeId);
    
    if (!node) {
      return null;
    }

    const connections = graph.edges
      .filter(e => e.source === nodeId || e.target === nodeId)
      .map(edge => {
        const connectedNodeId = edge.source === nodeId ? edge.target : edge.source;
        const connectedNode = graph.nodes.find(n => n.id === connectedNodeId);
        return {
          node: connectedNode!,
          edge,
        };
      });

    return {
      node,
      connections,
      relatedContent: [],
    };
  }

  private generateNodeId(topic: string): string {
    return `node-${topic.replace(/\s+/g, '-')}`;
  }

  private generateEdgeId(sourceId: string, targetId: string): string {
    return `edge-${sourceId}-${targetId}`;
  }

  async clearCache(): Promise<void> {
    this.cachedGraph = null;
    this.logger.log('Knowledge graph cache cleared');
  }

  async getGraphStats() {
    const graph = await this.buildKnowledgeGraph();
    return {
      totalNodes: graph.nodes.length,
      totalEdges: graph.edges.length,
      totalClusters: graph.clusters?.length || 0,
      categories: [...new Set(graph.nodes.map(n => n.category))],
      difficulties: {
        beginner: graph.nodes.filter(n => n.difficulty === 'beginner').length,
        intermediate: graph.nodes.filter(n => n.difficulty === 'intermediate').length,
        advanced: graph.nodes.filter(n => n.difficulty === 'advanced').length,
      },
    };
  }
}
