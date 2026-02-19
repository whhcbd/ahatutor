/**
 * 可视化交互方式标准
 * 定义统一的交互行为和反馈
 */

export type InteractionType = 'hover' | 'click' | 'zoom' | 'drag' | 'select' | 'doubleClick' | 'scroll' | 'pinch';

export type InteractionMode = 'none' | 'select' | 'zoom' | 'pan' | 'edit' | 'measure';

export interface InteractionConfig {
  enabled: InteractionType[];
  mode: InteractionMode;
  tooltips?: boolean;
  animations?: boolean;
  hapticFeedback?: boolean;
}

export interface InteractionHandlers {
  onHover?: (target: unknown, data: unknown) => void;
  onClick?: (target: unknown, data: unknown) => void;
  onDoubleClick?: (target: unknown, data: unknown) => void;
  onZoom?: (scale: number, center: { x: number; y: number }) => void;
  onDrag?: (dx: number, dy: number, data: unknown) => void;
  onSelect?: (target: unknown, data: unknown) => void;
  onDeselect?: (target: unknown) => void;
}

export const InteractionPresets: Record<string, InteractionConfig> = {
  default: {
    enabled: ['hover', 'click', 'zoom'],
    mode: 'select',
    tooltips: true,
    animations: true,
  },
  knowledgeGraph: {
    enabled: ['hover', 'click', 'zoom', 'drag'],
    mode: 'pan',
    tooltips: true,
    animations: true,
  },
  chart: {
    enabled: ['hover', 'click', 'zoom'],
    mode: 'select',
    tooltips: true,
    animations: true,
  },
  diagram: {
    enabled: ['hover', 'click', 'zoom'],
    mode: 'select',
    tooltips: true,
    animations: true,
  },
  animation: {
    enabled: ['hover', 'click'],
    mode: 'none',
    tooltips: false,
    animations: true,
  },
  editable: {
    enabled: ['hover', 'click', 'drag', 'doubleClick'],
    mode: 'edit',
    tooltips: true,
    animations: false,
  },
} as const;

export const InteractionFeedback = {
  hover: {
    cursor: 'pointer',
    scale: 1.05,
    opacity: 0.9,
    duration: 200,
  },
  click: {
    scale: 0.95,
    duration: 100,
  },
  select: {
    borderWidth: 3,
    borderColor: '#FF5722',
    boxShadow: '0 0 10px rgba(255, 87, 34, 0.5)',
  },
  drag: {
    cursor: 'grabbing',
    opacity: 0.8,
  },
} as const;

export function getInteractionConfig(type: string): InteractionConfig {
  return InteractionPresets[type] || InteractionPresets.default;
}

export function getInteractionFeedback(type: InteractionType) {
  return InteractionFeedback[type] || {};
}
