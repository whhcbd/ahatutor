import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { VisualizationColors, getMasteryColor } from '../../constants/visualization-colors';
import { ConceptDetailPanel } from './ConceptDetailPanel';

export interface GraphNode {
  id: string;
  name: string;
  type: string;
  level: number;
  mastery: number;
  group: number;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface GraphEdge {
  source: string | GraphNode;
  target: string | GraphNode;
  weight: number;
  bidirectional?: boolean;
  relationType?: 'prerequisite' | 'related' | 'derived' | 'example';
}

interface KnowledgeGraphProps {
  data: {
    nodes: GraphNode[];
    edges: GraphEdge[];
  };
  onNodeClick?: (node: GraphNode) => void;
  onJumpToVisualization?: (concept: string) => void;
  width?: number;
  height?: number;
}

/**
 * 知识图谱 D3.js 力导向图可视化组件
 */
export function KnowledgeGraph({
  data,
  onNodeClick,
  onJumpToVisualization,
  width = 800,
  height = 600,
}: KnowledgeGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const onNodeClickRef = useRef(onNodeClick);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  // 获取相关概念
  const getRelatedConcepts = (node: GraphNode): string[] => {
    const relatedEdges = data.edges.filter(
      (edge) => 
        (typeof edge.source === 'string' ? edge.source : edge.source.id) === node.id ||
        (typeof edge.target === 'string' ? edge.target : edge.target.id) === node.id
    );
    const relatedIds = relatedEdges.flatMap(edge => [
      typeof edge.source === 'string' ? edge.source : edge.source.id,
      typeof edge.target === 'string' ? edge.target : edge.target.id
    ]);
    return data.nodes
      .filter(n => relatedIds.includes(n.id) && n.id !== node.id)
      .map(n => n.name)
      .slice(0, 5);
  };

  // 保持 onNodeClick 引用最新
  useEffect(() => {
    onNodeClickRef.current = onNodeClick;
  }, [onNodeClick]);

  useEffect(() => {
    if (!data.nodes.length || !svgRef.current) return;

    // 清除之前的内容
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);
    const g = svg.append('g');

    // 添加缩放功能
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // 创建力导向模拟
    const simulation = d3
      .forceSimulation(data.nodes as d3.SimulationNodeDatum[])
      .force('link', d3.forceLink(data.edges as any)
        .id((d: any) => d.id)
        .distance((d: any) => 100 - (d.weight || 1) * 20)
      )
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(30));

    // 创建箭头标记
    const defs = svg.append('defs');
    
    // 正向箭头
    defs.append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 20)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 8)
      .attr('markerHeight', 8)
      .append('path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', '#999');

    // 反向箭头（用于双向关系）
    defs.append('marker')
      .attr('id', 'arrowhead-reverse')
      .attr('viewBox', '-10 -5 10 10')
      .attr('refX', -10)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 8)
      .attr('markerHeight', 8)
      .append('path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', '#999');

    // 关系类型颜色
    const getEdgeColor = (edge: GraphEdge): string => {
      switch (edge.relationType) {
        case 'prerequisite':
          return '#FF5722';
        case 'related':
          return '#4CAF50';
        case 'derived':
          return '#2196F3';
        case 'example':
          return '#FF9800';
        default:
          return '#999';
      }
    };

    // 绘制连线
    const link = g
      .append('g')
      .selectAll('line')
      .data(data.edges)
      .join('line')
      .attr('stroke', (d) => getEdgeColor(d as GraphEdge))
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', (d) => Math.sqrt(d.weight || 1) * 2)
      .attr('marker-end', 'url(#arrowhead)')
      .attr('marker-start', (d) => (d.bidirectional ? 'url(#arrowhead-reverse)' : ''));

    // 绘制节点
    const node = g
      .append('g')
      .selectAll('g')
      .data(data.nodes)
      .join('g')
      .attr('class', 'node')
      .call(d3.drag<SVGGElement, GraphNode>()
        .on('start', dragStarted)
        .on('drag', dragged)
        .on('end', dragEnded) as any
      );

    // 节点圆圈
    node
      .append('circle')
      .attr('r', (d) => 15 + d.mastery / 10)
      .attr('fill', (d) => getNodeColor(d))
      .attr('stroke', (d) => getNodeStroke(d))
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseover', function(_event, d) {
        setHoveredNode(d);
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 25 + d.mastery / 10);
      })
      .on('mouseout', function(_event, d) {
        setHoveredNode(null);
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 15 + d.mastery / 10);
      })
      .on('click', (_event, d) => {
        setSelectedNode(d);
        setHoveredNode(d);
        onNodeClick?.(d);
      });

    // 节点标签
    node
      .append('text')
      .text((d) => d.name)
      .attr('x', 0)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', '#333')
      .style('pointer-events', 'none');

    // 更新位置
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    // 拖拽函数
    function dragStarted(event: d3.D3DragEvent<SVGGElement, GraphNode, any>, d: GraphNode) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, GraphNode, any>, d: GraphNode) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragEnded(event: d3.D3DragEvent<SVGGElement, GraphNode, any>, d: GraphNode) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    const svgElement = svgRef.current;
    return () => {
      // 停止模拟
      simulation.stop();

      // 移除所有事件监听器和DOM元素
      if (svgElement) {
        d3.select(svgElement).selectAll('*').remove();
      }
    };
  }, [data, width, height, selectedNode]);

  // 获取节点颜色
  function getNodeColor(node: GraphNode): string {
    return getMasteryColor(node.mastery);
  }

  // 获取节点边框颜色
  function getNodeStroke(node: GraphNode): string {
    switch (node.type) {
      case 'CONCEPT':
        return VisualizationColors.nodeConcept;
      case 'PRINCIPLE':
        return VisualizationColors.nodePrinciple;
      case 'FORMULA':
        return VisualizationColors.nodeFormula;
      default:
        return VisualizationColors.nodeDefault;
    }
  }

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={{ border: '1px solid #e5e7eb', borderRadius: '8px', background: '#f9fafb' }}
      />
      <ConceptDetailPanel
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
        onJumpToVisualization={onJumpToVisualization}
        relatedConcepts={selectedNode ? getRelatedConcepts(selectedNode) : []}
      />
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow border border-gray-200 text-xs">
        <div className="font-semibold mb-2">图例</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <span>已掌握 (80%+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <span>学习中 (50-79%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-400"></div>
            <span>初步了解 (20-49%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <span>未开始 (&lt;20%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 简化版知识图谱组件（静态展示）
 */
export function KnowledgeGraphSimple({
  nodes,
  edges,
}: {
  nodes: GraphNode[];
  edges: GraphEdge[];
}) {
  return (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center">
      <KnowledgeGraph data={{ nodes, edges }} width={600} height={400} />
    </div>
  );
}
