export type MindMapLayout = 'radial' | 'horizontal' | 'vertical' | 'tree';
export type MindMapNodeShape = 'circle' | 'rect' | 'rounded' | 'pill';
export type MindMapEdgeType = 'solid' | 'dashed' | 'dotted';
export type MindMapFontWeight = 'normal' | 'bold' | 'lighter';

export type MindMapNodeType = 'concept' | 'principle' | 'example' | 'definition' | 'process' | 'outcome';

export interface MindMapNodeMetadata {
  importance: 'low' | 'medium' | 'high';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  relatedConcepts?: string[];
  examples?: string[];
}

export interface MindMapNode {
  id: string;
  text: string;
  type: MindMapNodeType;
  level: number;
  expanded: boolean;
  color?: string;
  textColor?: string;
  borderColor?: string;
  children?: MindMapNode[];
  metadata?: MindMapNodeMetadata;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

export interface MindMapStyle {
  nodeShape: MindMapNodeShape;
  nodeWidth?: number;
  nodeHeight?: number;
  borderRadius?: number;
  edgeType: MindMapEdgeType;
  edgeWidth: number;
  edgeColor?: string;
  curved?: boolean;
  fontFamily: string;
  fontSize: number;
  fontWeight: MindMapFontWeight;
  levelSpacing?: number;
  nodeSpacing?: number;
}

export type MindMapInteraction = 'click' | 'hover' | 'zoom' | 'drag' | 'expand';

export interface Annotation {
  nodeId: string;
  text: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  style?: {
    color?: string;
    backgroundColor?: string;
    fontSize?: number;
  };
}

export interface MindMapData {
  title: string;
  description?: string;
  root: MindMapNode;
  layout: MindMapLayout;
  style: MindMapStyle;
  interactions: MindMapInteraction[];
  annotations?: Annotation[];
}

export interface MindMapConfig {
  width: number;
  height: number;
  theme?: string;
  sizePreset?: 'small' | 'medium' | 'large';
}

export interface MindMapProps {
  data: MindMapData;
  config?: Partial<MindMapConfig>;
  onNodeClick?: (node: MindMapNode) => void;
  onNodeHover?: (node: MindMapNode | null) => void;
  onNodeExpand?: (node: MindMapNode) => void;
  onNodeCollapse?: (node: MindMapNode) => void;
}

export interface MindMapState {
  scale: number;
  translateX: number;
  translateY: number;
  hoveredNode: MindMapNode | null;
  selectedNode: MindMapNode | null;
  isDragging: boolean;
  dragNode: MindMapNode | null;
}

export interface LayoutResult {
  nodes: Map<string, { x: number; y: number }>;
  edges: Array<{
    source: string;
    target: string;
    path: string;
  }>;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface A2UIMindMapDirective {
  type: 'A2UI-MINDMAP';
  content: MindMapData;
}
