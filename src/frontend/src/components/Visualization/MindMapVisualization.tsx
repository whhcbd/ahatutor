import React, { useRef, useState, useEffect, useCallback } from 'react';
import type { MindMapProps, MindMapState, MindMapNode as MindMapNodeType } from '../../types/mindmap.types';
import { DEFAULT_MINDMAP_STYLE, MINDMAP_LAYOUTS, getNodeTypeColor, getNodeTypeTextColor } from '../../constants/mindmap-styles';

interface MindMapEdge {
  source: MindMapNodeType;
  target: MindMapNodeType;
  path: string;
}

export function MindMapVisualization({ data, config = {}, onNodeClick, onNodeHover, onNodeExpand, onNodeCollapse }: MindMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<MindMapState>({
    scale: 1,
    translateX: 0,
    translateY: 0,
    hoveredNode: null,
    selectedNode: null,
    isDragging: false,
    dragNode: null,
  });
  const [nodes, setNodes] = useState<Map<string, MindMapNodeType>>(new Map());
  const [edges, setEdges] = useState<MindMapEdge[]>([]);
  const [dimensions, setDimensions] = useState({ width: config.width || 800, height: config.height || 600 });

  const style = { ...DEFAULT_MINDMAP_STYLE, ...data.style };
  const hasInteraction = (type: string) => data.interactions.includes(type as any);

  useEffect(() => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      setDimensions({ width: clientWidth, height: clientHeight });
    }
  }, [config.width, config.height]);

  useEffect(() => {
    const { layoutNodes, layoutEdges } = calculateLayout(data.root, data.layout, dimensions, style);
    setNodes(layoutNodes);
    setEdges(layoutEdges);
  }, [data.root, data.layout, dimensions, style]);

  const calculateLayout = useCallback((
    root: MindMapNodeType,
    layoutType: string,
    dims: { width: number; height: number },
    nodeStyle: any
  ) => {
    const nodeMap = new Map<string, MindMapNodeType>();
    const edgeList: MindMapEdge[] = [];
    const levelSpacing = nodeStyle.levelSpacing || 80;
    const nodeSpacing = nodeStyle.nodeSpacing || 20;

    function traverseNode(node: MindMapNodeType, level: number, parent?: MindMapNodeType) {
      const nodeCopy = { ...node, level };
      nodeMap.set(node.id, nodeCopy);

      if (parent) {
        const path = calculateEdgePath(parent, nodeCopy, nodeStyle);
        edgeList.push({
          source: parent,
          target: nodeCopy,
          path,
        });
      }

      if (node.children && nodeCopy.expanded) {
        node.children.forEach((child, _index) => {
          traverseNode(child, level + 1, nodeCopy);
        });
      }
    }

    traverseNode(root, 0);

    const positions = calculateNodePositions(nodeMap, layoutType, dims, levelSpacing, nodeSpacing);
    positions.forEach((pos, id) => {
      const node = nodeMap.get(id);
      if (node) {
        node.x = pos.x;
        node.y = pos.y;
      }
    });

    return { layoutNodes: nodeMap, layoutEdges: edgeList };
  }, []);

  const calculateNodePositions = useCallback((
    nodeMap: Map<string, MindMapNodeType>,
    layoutType: string,
    dims: { width: number; height: number },
    levelSpacing: number,
    nodeSpacing: number
  ): Map<string, { x: number; y: number }> => {
    const positions = new Map<string, { x: number; y: number }>();
    const root = Array.from(nodeMap.values()).find(n => n.level === 0);
    if (!root) return positions;

    if (layoutType === 'radial') {
      return calculateRadialLayout(nodeMap, dims, levelSpacing);
    } else if (layoutType === 'horizontal') {
      return calculateHorizontalLayout(nodeMap, dims, levelSpacing, nodeSpacing);
    } else if (layoutType === 'vertical') {
      return calculateVerticalLayout(nodeMap, dims, levelSpacing, nodeSpacing);
    } else {
      return calculateTreeLayout(nodeMap, dims, levelSpacing, nodeSpacing);
    }
  }, []);

  const calculateRadialLayout = useCallback((
    nodeMap: Map<string, MindMapNodeType>,
    dims: { width: number; height: number },
    levelSpacing: number
  ): Map<string, { x: number; y: number }> => {
    const positions = new Map<string, { x: number; y: number }>();
    const root = Array.from(nodeMap.values()).find(n => n.level === 0);
    if (!root) return positions;

    const centerX = dims.width / 2;
    const centerY = dims.height / 2;

    positions.set(root.id, { x: centerX, y: centerY });

    const nodesByLevel = new Map<number, MindMapNodeType[]>();
    nodeMap.forEach(node => {
      if (!nodesByLevel.has(node.level)) {
        nodesByLevel.set(node.level, []);
      }
      nodesByLevel.get(node.level)!.push(node);
    });

    for (let level = 1; level <= Math.max(...Array.from(nodesByLevel.keys())); level++) {
      const levelNodes = nodesByLevel.get(level) || [];
      const angleStep = (2 * Math.PI) / levelNodes.length;
      const radius = level * levelSpacing;

      levelNodes.forEach((node, index) => {
        const angle = angleStep * index - Math.PI / 2;
        positions.set(node.id, {
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle),
        });
      });
    }

    return positions;
  }, []);

  const calculateHorizontalLayout = useCallback((
    nodeMap: Map<string, MindMapNodeType>,
    dims: { width: number; height: number },
    levelSpacing: number,
    nodeSpacing: number
  ): Map<string, { x: number; y: number }> => {
    const positions = new Map<string, { x: number; y: number }>();
    const root = Array.from(nodeMap.values()).find(n => n.level === 0);
    if (!root) return positions;

    const nodesByLevel = new Map<number, MindMapNodeType[]>();
    nodeMap.forEach(node => {
      if (!nodesByLevel.has(node.level)) {
        nodesByLevel.set(node.level, []);
      }
      nodesByLevel.get(node.level)!.push(node);
    });

    const maxLevel = Math.max(...Array.from(nodesByLevel.keys()));
    const startY = dims.height / 2;

    for (let level = 0; level <= maxLevel; level++) {
      const levelNodes = nodesByLevel.get(level) || [];
      const x = 100 + level * levelSpacing;
      const levelHeight = levelNodes.length * nodeSpacing;
      const startYLevel = startY - levelHeight / 2;

      levelNodes.forEach((node, index) => {
        positions.set(node.id, {
          x,
          y: startYLevel + index * nodeSpacing,
        });
      });
    }

    return positions;
  }, []);

  const calculateVerticalLayout = useCallback((
    nodeMap: Map<string, MindMapNodeType>,
    dims: { width: number; height: number },
    levelSpacing: number,
    nodeSpacing: number
  ): Map<string, { x: number; y: number }> => {
    const positions = new Map<string, { x: number; y: number }>();
    const root = Array.from(nodeMap.values()).find(n => n.level === 0);
    if (!root) return positions;

    const nodesByLevel = new Map<number, MindMapNodeType[]>();
    nodeMap.forEach(node => {
      if (!nodesByLevel.has(node.level)) {
        nodesByLevel.set(node.level, []);
      }
      nodesByLevel.get(node.level)!.push(node);
    });

    const maxLevel = Math.max(...Array.from(nodesByLevel.keys()));
    const startX = dims.width / 2;

    for (let level = 0; level <= maxLevel; level++) {
      const levelNodes = nodesByLevel.get(level) || [];
      const y = 80 + level * levelSpacing;
      const levelWidth = levelNodes.length * nodeSpacing;
      const startXLevel = startX - levelWidth / 2;

      levelNodes.forEach((node, index) => {
        positions.set(node.id, {
          x: startXLevel + index * nodeSpacing,
          y,
        });
      });
    }

    return positions;
  }, []);

  const calculateTreeLayout = useCallback((
    nodeMap: Map<string, MindMapNodeType>,
    dims: { width: number; height: number },
    levelSpacing: number,
    nodeSpacing: number
  ): Map<string, { x: number; y: number }> => {
    return calculateVerticalLayout(nodeMap, dims, levelSpacing, nodeSpacing);
  }, []);

  const calculateEdgePath = useCallback((source: MindMapNodeType, target: MindMapNodeType, nodeStyle: any): string => {
    if (!source.x || !source.y || !target.x || !target.y) return '';
    
    if (nodeStyle.curved) {
      const midX = (source.x + target.x) / 2;
      const midY = (source.y + target.y) / 2;
      return `M ${source.x} ${source.y} Q ${midX} ${midY} ${target.x} ${target.y}`;
    } else {
      return `M ${source.x} ${source.y} L ${target.x} ${target.y}`;
    }
  }, []);

  const handleZoom = useCallback((delta: number) => {
    if (!hasInteraction('zoom')) return;
    setState(prev => ({
      ...prev,
      scale: Math.max(0.1, Math.min(4, prev.scale + delta * 0.1)),
    }));
  }, [hasInteraction]);

  const handlePan = useCallback((dx: number, dy: number) => {
    setState(prev => ({
      ...prev,
      translateX: prev.translateX + dx,
      translateY: prev.translateY + dy,
    }));
  }, []);

  const handleNodeClick = useCallback((node: MindMapNodeType) => {
    if (!hasInteraction('click')) return;
    setState(prev => ({
      ...prev,
      selectedNode: node === prev.selectedNode ? null : node,
    }));
    onNodeClick?.(node);
  }, [hasInteraction, onNodeClick]);

  const handleNodeHover = useCallback((node: MindMapNodeType | null) => {
    if (!hasInteraction('hover')) return;
    setState(prev => ({ ...prev, hoveredNode: node }));
    onNodeHover?.(node);
  }, [hasInteraction, onNodeHover]);

  const handleNodeToggle = useCallback((node: MindMapNodeType) => {
    if (!hasInteraction('expand')) return;
    const newState = !node.expanded;
    const updatedNode = { ...node, expanded: newState };
    
    const updateNodeInTree = (n: MindMapNodeType): MindMapNodeType => {
      if (n.id === node.id) {
        return updatedNode;
      }
      if (n.children) {
        return { ...n, children: n.children.map(updateNodeInTree) };
      }
      return n;
    };

    const updatedRoot = updateNodeInTree(data.root);
    const { layoutNodes, layoutEdges } = calculateLayout(updatedRoot, data.layout, dimensions, style);
    setNodes(layoutNodes);
    setEdges(layoutEdges);

    if (newState) {
      onNodeExpand?.(node);
    } else {
      onNodeCollapse?.(node);
    }
  }, [hasInteraction, data.root, data.layout, dimensions, style, calculateLayout, onNodeExpand, onNodeCollapse]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    handleZoom(e.deltaY > 0 ? -1 : 1);
  }, [handleZoom]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0 && e.target === svgRef.current) {
      setState(prev => ({ ...prev, isDragging: true }));
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (state.isDragging) {
      handlePan(e.movementX, e.movementY);
    }
  }, [state.isDragging, handlePan]);

  const handleMouseUp = useCallback(() => {
    setState(prev => ({ ...prev, isDragging: false, dragNode: null }));
  }, []);

  const renderNode = useCallback((node: MindMapNodeType) => {
    if (!node.x || !node.y) return null;

    const color = node.color || getNodeTypeColor(node.type);
    const textColor = node.textColor || getNodeTypeTextColor(color);
    const borderColor = node.borderColor || style.edgeColor;
    const isSelected = state.selectedNode?.id === node.id;
    const isHovered = state.hoveredNode?.id === node.id;
    const hasChildren = node.children && node.children.length > 0;

    const nodeWidth = style.nodeWidth || 120;
    const nodeHeight = style.nodeHeight || 40;
    const borderRadius = style.borderRadius || 8;

    let nodeShape: JSX.Element;
    if (style.nodeShape === 'circle') {
      const radius = Math.min(nodeWidth, nodeHeight) / 2;
      nodeShape = (
        <circle
          cx={node.x}
          cy={node.y}
          r={radius}
          fill={color}
          stroke={borderColor}
          strokeWidth={isSelected ? 3 : 1}
          style={{
            cursor: hasInteraction('click') ? 'pointer' : 'default',
            filter: isHovered ? 'brightness(1.1)' : 'none',
          }}
        />
      );
    } else if (style.nodeShape === 'rect') {
      nodeShape = (
        <rect
          x={node.x - nodeWidth / 2}
          y={node.y - nodeHeight / 2}
          width={nodeWidth}
          height={nodeHeight}
          fill={color}
          stroke={borderColor}
          strokeWidth={isSelected ? 3 : 1}
          style={{
            cursor: hasInteraction('click') ? 'pointer' : 'default',
            filter: isHovered ? 'brightness(1.1)' : 'none',
          }}
        />
      );
    } else if (style.nodeShape === 'pill') {
      nodeShape = (
        <rect
          x={node.x - nodeWidth / 2}
          y={node.y - nodeHeight / 2}
          width={nodeWidth}
          height={nodeHeight}
          rx={nodeHeight / 2}
          ry={nodeHeight / 2}
          fill={color}
          stroke={borderColor}
          strokeWidth={isSelected ? 3 : 1}
          style={{
            cursor: hasInteraction('click') ? 'pointer' : 'default',
            filter: isHovered ? 'brightness(1.1)' : 'none',
          }}
        />
      );
    } else {
      nodeShape = (
        <rect
          x={node.x - nodeWidth / 2}
          y={node.y - nodeHeight / 2}
          width={nodeWidth}
          height={nodeHeight}
          rx={borderRadius}
          ry={borderRadius}
          fill={color}
          stroke={borderColor}
          strokeWidth={isSelected ? 3 : 1}
          style={{
            cursor: hasInteraction('click') ? 'pointer' : 'default',
            filter: isHovered ? 'brightness(1.1)' : 'none',
          }}
        />
      );
    }

    return (
      <g
        key={node.id}
        onClick={() => handleNodeClick(node)}
        onMouseEnter={() => handleNodeHover(node)}
        onMouseLeave={() => handleNodeHover(null)}
      >
        {nodeShape}
        <text
          x={node.x}
          y={node.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={textColor}
          fontSize={style.fontSize}
          fontWeight={style.fontWeight}
          fontFamily={style.fontFamily}
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          {node.text.length > 20 ? `${node.text.slice(0, 20)}...` : node.text}
        </text>
        {hasChildren && hasInteraction('expand') && (
          <g
            onClick={(e) => {
              e.stopPropagation();
              handleNodeToggle(node);
            }}
            style={{ cursor: 'pointer' }}
          >
            <circle
              cx={node.x + nodeWidth / 2 - 5}
              cy={node.y - nodeHeight / 2 + 5}
              r={8}
              fill="#fff"
              stroke="#333"
              strokeWidth={1}
            />
            <text
              x={node.x + nodeWidth / 2 - 5}
              y={node.y - nodeHeight / 2 + 5}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={12}
              fontWeight="bold"
            >
              {node.expanded ? '-' : '+'}
            </text>
          </g>
        )}
      </g>
    );
  }, [state.selectedNode, state.hoveredNode, style, hasInteraction, handleNodeClick, handleNodeHover, handleNodeToggle, getNodeTypeColor, getNodeTypeTextColor]);

  const renderEdge = useCallback((edge: MindMapEdge) => {
    const edgeStyle = {
      stroke: style.edgeColor,
      strokeWidth: style.edgeWidth,
      strokeDasharray: style.edgeType === 'dashed' ? '5,5' : style.edgeType === 'dotted' ? '2,2' : 'none',
      fill: 'none',
    };

    return (
      <path
        key={`${edge.source.id}-${edge.target.id}`}
        d={edge.path}
        {...edgeStyle}
      />
    );
  }, [style]);

  const renderAnnotation = useCallback((annotation: any) => {
    const node = nodes.get(annotation.nodeId);
    if (!node || !node.x || !node.y) return null;

    const offset = 30;
    let x = node.x;
    let y = node.y;

    switch (annotation.position) {
      case 'top':
        y -= offset;
        break;
      case 'bottom':
        y += offset;
        break;
      case 'left':
        x -= offset;
        break;
      case 'right':
        x += offset;
        break;
    }

    return (
      <g key={`annotation-${annotation.nodeId}`}>
        <rect
          x={x - 60}
          y={y - 15}
          width={120}
          height={30}
          rx={4}
          fill={annotation.style?.backgroundColor || '#FEF3C7'}
          stroke={annotation.style?.color || '#F59E0B'}
          strokeWidth={1}
        />
        <text
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={annotation.style?.fontSize || 10}
          fill={annotation.style?.color || '#92400E'}
        >
          {annotation.text}
        </text>
      </g>
    );
  }, [nodes]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-white border border-gray-200 rounded-lg"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        style={{ cursor: state.isDragging ? 'grabbing' : 'grab' }}
      >
        <g transform={`translate(${state.translateX}, ${state.translateY}) scale(${state.scale})`}>
          {edges.map(renderEdge)}
          {Array.from(nodes.values()).map(renderNode)}
          {data.annotations?.map(renderAnnotation)}
        </g>
      </svg>
      
      <div className="absolute top-4 right-4 bg-white p-2 rounded-lg shadow border border-gray-200 flex flex-col gap-2">
        {hasInteraction('zoom') && (
          <>
            <button
              onClick={() => handleZoom(1)}
              className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded"
              title="放大"
            >
              +
            </button>
            <button
              onClick={() => handleZoom(-1)}
              className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded"
              title="缩小"
            >
              -
            </button>
            <button
              onClick={() => setState(prev => ({ ...prev, scale: 1, translateX: 0, translateY: 0 }))}
              className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded"
              title="重置视图"
            >
              ⟲
            </button>
          </>
        )}
      </div>

      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow border border-gray-200 text-sm">
        <div className="font-semibold mb-2">{data.title}</div>
        {data.description && (
          <div className="text-gray-600 text-xs">{data.description}</div>
        )}
        <div className="mt-2 text-xs text-gray-500">
          布局: {MINDMAP_LAYOUTS[data.layout].name}
        </div>
      </div>

      {state.selectedNode && (
        <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow border border-gray-200 max-w-xs">
          <div className="font-semibold mb-2">{state.selectedNode.text}</div>
          <div className="text-sm text-gray-600">
            类型: {state.selectedNode.type}
          </div>
          {state.selectedNode.metadata && (
            <div className="mt-2 text-xs">
              <div>重要性: {state.selectedNode.metadata.importance}</div>
              <div>难度: {state.selectedNode.metadata.difficulty}</div>
            </div>
          )}
          <button
            onClick={() => setState(prev => ({ ...prev, selectedNode: null }))}
            className="mt-2 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
          >
            关闭
          </button>
        </div>
      )}
    </div>
  );
}
