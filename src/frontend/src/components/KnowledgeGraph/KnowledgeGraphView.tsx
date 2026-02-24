import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { ZoomIn, ZoomOut, RotateCcw, Filter, X } from 'lucide-react';
import type { KnowledgeGraph, KnowledgeGraphNode } from '@shared/types/knowledge-graph.types';

interface KnowledgeGraphViewProps {
  graph: KnowledgeGraph;
  onNodeClick?: (node: KnowledgeGraphNode) => void;
  onNodeHover?: (node: KnowledgeGraphNode | null) => void;
  width?: number;
  height?: number;
}

export function KnowledgeGraphView({
  graph,
  onNodeClick,
  onNodeHover,
  width = 800,
  height = 600,
}: KnowledgeGraphViewProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<KnowledgeGraphNode | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterDifficulty, setFilterDifficulty] = useState<string | null>(null);
  const transformRef = useRef<d3.ZoomTransform>(d3.zoomIdentity);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  useEffect(() => {
    if (!svgRef.current || !graph.nodes.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const container = svg.append('g');

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        container.attr('transform', event.transform);
        transformRef.current = event.transform;
      });

    zoomBehaviorRef.current = zoom;
    svg.call(zoom);

    const categories = [...new Set(graph.nodes.map(n => n.category))];
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(categories);

    let filteredNodes = graph.nodes;
    let filteredEdges = graph.edges;

    if (filterCategory) {
      filteredNodes = filteredNodes.filter(n => n.category === filterCategory);
      const nodeIds = new Set(filteredNodes.map(n => n.id));
      filteredEdges = filteredEdges.filter(e => nodeIds.has(e.source) && nodeIds.has(e.target));
    }

    if (filterDifficulty) {
      filteredNodes = filteredNodes.filter(n => n.difficulty === filterDifficulty);
      const nodeIds = new Set(filteredNodes.map(n => n.id));
      filteredEdges = filteredEdges.filter(e => nodeIds.has(e.source) && nodeIds.has(e.target));
    }

    const simulation = d3.forceSimulation(filteredNodes as any)
      .force('link', d3.forceLink(filteredEdges as any)
        .id((d: any) => d.id)
        .distance(100)
        .strength(0.5))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(30));

    const edges = container.append('g')
      .selectAll('line')
      .data(filteredEdges)
      .enter()
      .append('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', (d: any) => d.weight * 3);

    const nodeGroups = container.append('g')
      .selectAll('g')
      .data(filteredNodes)
      .enter()
      .append('g')
      .attr('cursor', 'pointer')
      .call(d3.drag<SVGGElement, any>()
        .on('start', dragStarted)
        .on('drag', dragged)
        .on('end', dragEnded) as any);

    nodeGroups.append('circle')
      .attr('r', (d: any) => 10 + d.importance * 15)
      .attr('fill', (d: any) => colorScale(d.category) as string)
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    nodeGroups.append('text')
      .text((d: any) => d.label)
      .attr('x', (d: any) => 12 + d.importance * 15)
      .attr('y', 5)
      .attr('font-size', 12)
      .attr('fill', '#333')
      .style('pointer-events', 'none');

    nodeGroups
      .on('click', (event, d: any) => {
        event.stopPropagation();
        setSelectedNode(d);
        onNodeClick?.(d);
      })
      .on('mouseover', (event, d: any) => {
        d3.select(event.currentTarget).select('circle')
          .attr('stroke', '#666')
          .attr('stroke-width', 4);
        onNodeHover?.(d);
      })
      .on('mouseout', (event) => {
        d3.select(event.currentTarget).select('circle')
          .attr('stroke', '#fff')
          .attr('stroke-width', 2);
        onNodeHover?.(null);
      });

    simulation.on('tick', () => {
      edges
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      nodeGroups
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragStarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragEnded(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    svg.on('click', () => {
      setSelectedNode(null);
      onNodeHover?.(null);
    });

    return () => {
      simulation.stop();
    };
  }, [graph, width, height, onNodeClick, onNodeHover, filterCategory, filterDifficulty]);

  const handleZoomIn = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      const svg = d3.select(svgRef.current);
      svg.transition().duration(300).call(zoomBehaviorRef.current.scaleBy, 1.3);
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      const svg = d3.select(svgRef.current);
      svg.transition().duration(300).call(zoomBehaviorRef.current.scaleBy, 0.7);
    }
  };

  const handleReset = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      const svg = d3.select(svgRef.current);
      svg.transition().duration(500).call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
    }
  };

  const categories = [...new Set(graph.nodes.map(n => n.category))];
  const difficulties = ['beginner', 'intermediate', 'advanced'];

  const difficultyLabels = {
    beginner: '初级',
    intermediate: '中级',
    advanced: '高级',
  };

  return (
    <div className="relative w-full h-full bg-gray-50 rounded-lg overflow-hidden">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="w-full h-full"
      />

      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors"
          title="放大"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors"
          title="缩小"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={handleReset}
          className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors"
          title="重置视图"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md p-4 max-w-xs">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-gray-600" />
          <span className="font-medium text-sm">筛选</span>
        </div>

        <div className="space-y-2">
          <div>
            <div className="text-xs text-gray-600 mb-1">分类</div>
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setFilterCategory(null)}
                className={`px-2 py-1 text-xs rounded ${
                  filterCategory === null
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                全部
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-2 py-1 text-xs rounded ${
                    filterCategory === cat
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat.substring(0, 4)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-600 mb-1">难度</div>
            <div className="flex gap-1">
              <button
                onClick={() => setFilterDifficulty(null)}
                className={`px-2 py-1 text-xs rounded ${
                  filterDifficulty === null
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                全部
              </button>
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  onClick={() => setFilterDifficulty(diff)}
                  className={`px-2 py-1 text-xs rounded ${
                    filterDifficulty === diff
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {difficultyLabels[diff as keyof typeof difficultyLabels]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3">
        <div className="text-xs text-gray-600 mb-2">图例</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-xs">分子遗传学</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-xs">细胞遗传学</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-xs">经典遗传学</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-xs">群体遗传学</span>
          </div>
        </div>
      </div>

      {selectedNode && (
        <div className="absolute top-4 right-16 bg-white rounded-lg shadow-md p-4 max-w-sm">
          <button
            onClick={() => setSelectedNode(null)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="mb-2">
            <h3 className="font-bold text-lg">{selectedNode.label}</h3>
            <span className="text-sm text-gray-600">{selectedNode.category}</span>
          </div>
          {selectedNode.description && (
            <p className="text-sm text-gray-700 mb-2">{selectedNode.description}</p>
          )}
          <div className="flex gap-2 text-xs">
            <span className={`px-2 py-1 rounded ${
              selectedNode.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
              selectedNode.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {difficultyLabels[selectedNode.difficulty]}
            </span>
            <span className="px-2 py-1 bg-blue-100 text-blue-700">
              重要度: {Math.round(selectedNode.importance * 100)}%
            </span>
          </div>
        </div>
      )}

      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-md p-3">
        <div className="flex items-center gap-4 text-xs text-gray-600">
          <span>节点: {graph.nodes.length}</span>
          <span>连线: {graph.edges.length}</span>
          <span>分类: {categories.length}</span>
        </div>
      </div>
    </div>
  );
}
