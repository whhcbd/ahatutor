import type { MindMapStyle, MindMapNode, MindMapLayout } from '../types/mindmap.types';

export const NODE_TYPE_COLORS = {
  concept: '#4F46E5',
  principle: '#0891B2',
  example: '#059669',
  definition: '#7C3AED',
  process: '#EA580C',
  outcome: '#DC2626',
  application: '#16A34A',
  limitation: '#991B1B',
};

export const NODE_TEXT_COLORS = {
  light: '#FFFFFF',
  dark: '#1F2937',
};

export const EDGE_TYPE_COLORS = {
  solid: '#6B7280',
  dashed: '#9CA3AF',
  dotted: '#D1D5DB',
};

export const DEFAULT_MINDMAP_STYLE: MindMapStyle = {
  nodeShape: 'rounded',
  nodeWidth: 120,
  nodeHeight: 40,
  borderRadius: 8,
  edgeType: 'solid',
  edgeWidth: 2,
  edgeColor: EDGE_TYPE_COLORS.solid,
  curved: true,
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontSize: 14,
  fontWeight: 'normal',
  levelSpacing: 80,
  nodeSpacing: 20,
};

export const MINDMAP_LAYOUTS: Record<MindMapLayout, {
  name: string;
  description: string;
  icon: string;
}> = {
  radial: {
    name: '放射状',
    description: '从中心向外扩散的布局',
    icon: '🌐',
  },
  horizontal: {
    name: '水平树状',
    description: '从左到右的树状布局',
    icon: '🌳',
  },
  vertical: {
    name: '垂直树状',
    description: '从上到下的树状布局',
    icon: '🌲',
  },
  tree: {
    name: '标准树状',
    description: '经典的层级树状布局',
    icon: '🎯',
  },
};

export const NODE_SHAPES = {
  circle: {
    name: '圆形',
    description: '圆形节点',
    icon: '⭕',
  },
  rect: {
    name: '矩形',
    description: '矩形节点',
    icon: '⬜',
  },
  rounded: {
    name: '圆角矩形',
    description: '圆角矩形节点',
    icon: '🔲',
  },
  pill: {
    name: '胶囊形',
    description: '胶囊形节点',
    icon: '💊',
  },
};

export const INTERACTION_TYPES = {
  click: {
    name: '点击',
    description: '点击节点查看详情',
    icon: '👆',
  },
  hover: {
    name: '悬停',
    description: '悬停高亮相关节点',
    icon: '✨',
  },
  zoom: {
    name: '缩放',
    description: '缩放画布查看细节',
    icon: '🔍',
  },
  drag: {
    name: '拖拽',
    description: '拖拽节点调整位置',
    icon: '🖱️',
  },
  expand: {
    name: '展开/折叠',
    description: '展开或折叠子节点',
    icon: '📂',
  },
};

export const getNodeTypeColor = (type: string): string => {
  return NODE_TYPE_COLORS[type as keyof typeof NODE_TYPE_COLORS] || NODE_TYPE_COLORS.concept;
};

export const getNodeTypeTextColor = (backgroundColor: string): string => {
  if (!backgroundColor) return NODE_TEXT_COLORS.dark;
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? NODE_TEXT_COLORS.dark : NODE_TEXT_COLORS.light;
};

export const createDefaultNode = (
  id: string,
  text: string,
  type: MindMapNode['type'] = 'concept',
  level: number = 0
): MindMapNode => ({
  id,
  text,
  type,
  level,
  expanded: true,
  color: getNodeTypeColor(type),
  textColor: getNodeTypeTextColor(getNodeTypeColor(type)),
});

export const MINDMAP_THEME_TEMPLATES = {
  biological: {
    name: '生物学主题',
    description: '适合生物学概念的配色方案',
    style: {
      ...DEFAULT_MINDMAP_STYLE,
      nodeShape: 'rounded',
      edgeColor: '#2E7D32',
      levelSpacing: 90,
    } as MindMapStyle,
    customColors: {
      concept: '#1565C0',
      principle: '#00897B',
      example: '#6B21A8',
      definition: '#EF4444',
      process: '#F59E0B',
      outcome: '#059669',
    },
  },
  genetics: {
    name: '遗传学主题',
    description: '适合遗传学概念的配色方案',
    style: {
      ...DEFAULT_MINDMAP_STYLE,
      nodeShape: 'pill',
      edgeColor: '#7C3AED',
      curved: true,
    } as MindMapStyle,
    customColors: {
      concept: '#4F46E5',
      principle: '#0891B2',
      example: '#059669',
      definition: '#7C3AED',
      process: '#EA580C',
      outcome: '#DC2626',
    },
  },
  minimal: {
    name: '简约主题',
    description: '简洁明快的配色方案',
    style: {
      ...DEFAULT_MINDMAP_STYLE,
      nodeShape: 'rect',
      edgeWidth: 1,
      edgeColor: '#9CA3AF',
      levelSpacing: 70,
    } as MindMapStyle,
    customColors: {
      concept: '#374151',
      principle: '#4B5563',
      example: '#6B7280',
      definition: '#6B7280',
      process: '#6B7280',
      outcome: '#6B7280',
    },
  },
  vibrant: {
    name: '鲜艳主题',
    description: '色彩鲜艳醒目的配色方案',
    style: {
      ...DEFAULT_MINDMAP_STYLE,
      nodeShape: 'rounded',
      edgeWidth: 3,
      edgeColor: '#8B5CF6',
      levelSpacing: 100,
    } as MindMapStyle,
    customColors: {
      concept: '#EC4899',
      principle: '#8B5CF6',
      example: '#06B6D4',
      definition: '#F59E0B',
      process: '#EF4444',
      outcome: '#10B981',
    },
  },
};

export const MINDMAP_SIZE_PRESETS = {
  small: {
    name: '小型',
    fontSize: 12,
    nodeWidth: 100,
    nodeHeight: 35,
    levelSpacing: 60,
    nodeSpacing: 15,
  },
  medium: {
    name: '中型',
    fontSize: 14,
    nodeWidth: 120,
    nodeHeight: 40,
    levelSpacing: 80,
    nodeSpacing: 20,
  },
  large: {
    name: '大型',
    fontSize: 16,
    nodeWidth: 140,
    nodeHeight: 45,
    levelSpacing: 100,
    nodeSpacing: 25,
  },
};

export const applyThemeToNode = (
  node: MindMapNode,
  theme: keyof typeof MINDMAP_THEME_TEMPLATES
): MindMapNode => {
  const template = MINDMAP_THEME_TEMPLATES[theme];
  const customColor = template.customColors[node.type as keyof typeof template.customColors];
  
  return {
    ...node,
    color: customColor || node.color,
    textColor: getNodeTypeTextColor(customColor || node.color || '#ffffff'),
  };
};

export const applySizePreset = (
  style: MindMapStyle,
  preset: keyof typeof MINDMAP_SIZE_PRESETS
): MindMapStyle => {
  const size = MINDMAP_SIZE_PRESETS[preset];
  return {
    ...style,
    ...size,
  };
};
