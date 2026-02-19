/**
 * 可视化响应式布局规则
 * 定义不同屏幕尺寸下的布局适配
 */

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type LayoutMode = 'mobile' | 'tablet' | 'desktop';

export interface BreakpointConfig {
  min: number;
  max: number;
  mode: LayoutMode;
}

export interface LayoutRules {
  container: {
    maxWidth: number;
    padding: number;
    margin: string;
  };
  grid: {
    columns: number;
    gap: number;
  };
  typography: {
    fontSize: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
    };
    lineHeight: number;
  };
  visualization: {
    minWidth: number;
    minHeight: number;
    aspectRatio: number;
  };
}

export const Breakpoints: Record<Breakpoint, BreakpointConfig> = {
  xs: { min: 0, max: 639, mode: 'mobile' },
  sm: { min: 640, max: 767, mode: 'mobile' },
  md: { min: 768, max: 1023, mode: 'tablet' },
  lg: { min: 1024, max: 1279, mode: 'desktop' },
  xl: { min: 1280, max: Infinity, mode: 'desktop' },
} as const;

export const LayoutPresets: Record<LayoutMode, LayoutRules> = {
  mobile: {
    container: {
      maxWidth: 640,
      padding: 16,
      margin: '0 auto',
    },
    grid: {
      columns: 1,
      gap: 16,
    },
    typography: {
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        md: '1rem',
        lg: '1.125rem',
      },
      lineHeight: 1.5,
    },
    visualization: {
      minWidth: 300,
      minHeight: 200,
      aspectRatio: 16 / 9,
    },
  },
  tablet: {
    container: {
      maxWidth: 768,
      padding: 24,
      margin: '0 auto',
    },
    grid: {
      columns: 2,
      gap: 20,
    },
    typography: {
      fontSize: {
        xs: '0.875rem',
        sm: '1rem',
        md: '1.125rem',
        lg: '1.25rem',
      },
      lineHeight: 1.6,
    },
    visualization: {
      minWidth: 400,
      minHeight: 300,
      aspectRatio: 4 / 3,
    },
  },
  desktop: {
    container: {
      maxWidth: 1280,
      padding: 32,
      margin: '0 auto',
    },
    grid: {
      columns: 3,
      gap: 24,
    },
    typography: {
      fontSize: {
        xs: '1rem',
        sm: '1.125rem',
        md: '1.25rem',
        lg: '1.5rem',
      },
      lineHeight: 1.7,
    },
    visualization: {
      minWidth: 600,
      minHeight: 400,
      aspectRatio: 16 / 10,
    },
  },
} as const;

export function getBreakpoint(width: number): Breakpoint {
  if (width < 640) return 'xs';
  if (width < 768) return 'sm';
  if (width < 1024) return 'md';
  if (width < 1280) return 'lg';
  return 'xl';
}

export function getLayoutMode(width: number): LayoutMode {
  const breakpoint = getBreakpoint(width);
  return Breakpoints[breakpoint].mode;
}

export function getLayoutRules(width: number): LayoutRules {
  const mode = getLayoutMode(width);
  return LayoutPresets[mode];
}

export const ResponsiveClasses = {
  container: 'w-full mx-auto px-4 md:px-6 lg:px-8',
  grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6',
  text: 'text-sm md:text-base lg:text-lg',
  visualization: 'min-w-[300px] md:min-w-[400px] lg:min-w-[600px] min-h-[200px] md:min-h-[300px] lg:min-h-[400px]',
} as const;
