import type { A2UIPayload, A2UIComponent } from '@shared/types/a2ui.types';
import { A2UI_REGISTRY } from '../components/A2UI/registry';

export interface FallbackLevel {
  level: 0 | 1 | 2 | 3;
  name: string;
  description: string;
}

export interface FallbackStrategy {
  currentLevel: FallbackLevel;
  maxRetries: number;
  retryCount: number;
  enableAutomaticFallback: boolean;
  fallbackHistory: Array<{
    timestamp: number;
    fromLevel: number;
    toLevel: number;
    reason: string;
    componentId?: string;
  }>;
}

export const FALLBACK_LEVELS: ReadonlyArray<FallbackLevel> = [
  {
    level: 0,
    name: 'full',
    description: '完整功能：所有A2UI组件正常渲染'
  },
  {
    level: 1,
    name: 'simplified',
    description: '简化模式：使用简化模板或减少组件复杂度'
  },
  {
    level: 2,
    name: 'generic',
    description: '通用模式：使用通用可视化组件替代专用组件'
  },
  {
    level: 3,
    name: 'text_only',
    description: '纯文本模式：仅显示文本内容，不渲染可视化'
  }
] as const;

export class A2UIFallbackManager {
  private strategy: FallbackStrategy;
  private componentErrors: Map<string, { count: number; lastError: Error; timestamp: number }> = new Map();

  constructor(config?: Partial<FallbackStrategy>) {
    this.strategy = {
      currentLevel: FALLBACK_LEVELS[0],
      maxRetries: 3,
      retryCount: 0,
      enableAutomaticFallback: true,
      fallbackHistory: [],
      ...config
    };
  }

  getCurrentLevel(): FallbackLevel {
    return this.strategy.currentLevel;
  }

  setLevel(level: number, reason: string, componentId?: string): void {
    if (level < 0 || level >= FALLBACK_LEVELS.length) {
      throw new Error(`Invalid fallback level: ${level}`);
    }

    const newLevel = FALLBACK_LEVELS[level];
    const oldLevel = this.strategy.currentLevel.level;

    this.strategy.currentLevel = newLevel;
    this.strategy.fallbackHistory.push({
      timestamp: Date.now(),
      fromLevel: oldLevel,
      toLevel: level,
      reason,
      componentId
    });

    console.warn(`[A2UI Fallback] Level changed from ${oldLevel} to ${level}: ${reason}`);
  }

  handleComponentError(componentId: string, error: Error): boolean {
    const componentError = this.componentErrors.get(componentId) || {
      count: 0,
      lastError: error,
      timestamp: 0
    };

    componentError.count++;
    componentError.lastError = error;
    componentError.timestamp = Date.now();

    this.componentErrors.set(componentId, componentError);

    if (!this.strategy.enableAutomaticFallback) {
      return false;
    }

    const shouldFallback = this.shouldTriggerFallback(componentId, componentError);

    if (shouldFallback) {
      this.incrementLevel(componentId, error);
      return true;
    }

    return false;
  }

  private shouldTriggerFallback(componentId: string, error: { count: number; lastError: Error; timestamp: number }): boolean {
    const maxRetries = this.strategy.maxRetries;

    if (error.count >= maxRetries) {
      return true;
    }

    const isCriticalError = this.isCriticalError(error.lastError);
    if (isCriticalError && error.count >= 1) {
      return true;
    }

    const consecutiveErrors = this.getConsecutiveErrorCount(componentId, error.timestamp);
    if (consecutiveErrors >= 2) {
      return true;
    }

    return false;
  }

  private isCriticalError(error: Error): boolean {
    const criticalPatterns = [
      /Maximum call stack size exceeded/,
      /out of memory/i,
      /quota exceeded/i,
      /network error/i,
      /timeout/i
    ];

    return criticalPatterns.some(pattern => pattern.test(error.message));
  }

  private getConsecutiveErrorCount(componentId: string, currentTimestamp: number): number {
    const componentError = this.componentErrors.get(componentId);
    if (!componentError) {
      return 0;
    }

    const timeWindow = 5000;
    if (currentTimestamp - componentError.timestamp > timeWindow) {
      return 0;
    }

    return componentError.count;
  }

  private incrementLevel(componentId: string, error: Error): void {
    const currentLevel = this.strategy.currentLevel.level;
    const nextLevel = Math.min(currentLevel + 1, FALLBACK_LEVELS.length - 1);

    this.setLevel(
      nextLevel,
      `Component ${componentId} failed: ${error.message}`,
      componentId
    );

    this.strategy.retryCount++;
  }

  reset(componentId?: string): void {
    if (componentId) {
      this.componentErrors.delete(componentId);
    } else {
      this.componentErrors.clear();
    }

    this.strategy.retryCount = 0;
    this.strategy.currentLevel = FALLBACK_LEVELS[0];
    console.log('[A2UI Fallback] Reset to full functionality');
  }

  createFallbackPayload(originalPayload: A2UIPayload, componentId?: string): A2UIPayload {
    const level = this.strategy.currentLevel.level;

    switch (level) {
      case 0:
        return originalPayload;

      case 1:
        return this.createSimplifiedPayload(originalPayload, componentId);

      case 2:
        return this.createGenericPayload(originalPayload, componentId);

      case 3:
        return this.createTextOnlyPayload(originalPayload, componentId);

      default:
        return originalPayload;
    }
  }

  private createSimplifiedPayload(originalPayload: A2UIPayload, failedComponentId?: string): A2UIPayload {
    const components = { ...originalPayload.surface.components };

    Object.entries(components).forEach(([componentId, component]) => {
      if (failedComponentId && componentId !== failedComponentId) {
        return;
      }

      const simplifiedProps = this.simplifyComponentProperties(component.type, component.properties);
      components[componentId] = {
        ...component,
        properties: simplifiedProps
      };
    });

    return {
      version: originalPayload.version,
      surface: {
        rootId: originalPayload.surface.rootId,
        components
      },
      dataModel: originalPayload.dataModel,
      metadata: {
        ...originalPayload.metadata,
        fallbackLevel: 1 as any,
        fallbackReason: 'Simplified mode: reduced complexity'
      }
    };
  }

  private createGenericPayload(originalPayload: A2UIPayload, failedComponentId?: string): A2UIPayload {
    const components = { ...originalPayload.surface.components };

    Object.entries(components).forEach(([componentId, component]) => {
      if (failedComponentId && componentId !== failedComponentId) {
        return;
      }

      const genericComponent = this.getGenericComponent(component.type);
      components[componentId] = {
        ...component,
        type: genericComponent.type,
        properties: {
          ...component.properties,
          ...genericComponent.defaultProps
        }
      };
    });

    return {
      version: originalPayload.version,
      surface: {
        rootId: originalPayload.surface.rootId,
        components
      },
      dataModel: originalPayload.dataModel,
      metadata: {
        ...originalPayload.metadata,
        fallbackLevel: 2 as any,
        fallbackReason: 'Generic mode: using generic components'
      }
    };
  }

  private createTextOnlyPayload(originalPayload: A2UIPayload, failedComponentId?: string): A2UIPayload {
    const components = { ...originalPayload.surface.components };

    Object.entries(components).forEach(([componentId, component]) => {
      if (failedComponentId && componentId !== failedComponentId) {
        return;
      }

      const textContent = this.extractTextFromComponent(component);
      components[componentId] = {
        type: 'text',
        id: componentId + '_text',
        properties: {
          content: textContent,
          variant: 'body'
        }
      };
    });

    return {
      version: originalPayload.version,
      surface: {
        rootId: originalPayload.surface.rootId,
        components
      },
      dataModel: originalPayload.dataModel,
      metadata: {
        ...originalPayload.metadata,
        fallbackLevel: 3 as any,
        fallbackReason: 'Text-only mode: visualization disabled'
      }
    };
  }

  private simplifyComponentProperties(componentType: string, properties: Record<string, any>): Record<string, any> {
    const simplified: Record<string, any> = { ...properties };

    switch (componentType) {
      case 'ahatutor-knowledge-graph':
        simplified.nodes = simplified.nodes?.slice(0, 10) || [];
        simplified.links = simplified.links?.slice(0, 15) || [];
        simplified.interactive = false;
        break;

      case 'ahatutor-meiosis-animation':
        simplified.stages = simplified.stages?.slice(0, 4) || [];
        simplified.controls = {
          ...simplified.controls,
          autoplay: false,
          speed: 0.5
        };
        break;

      case 'ahatutor-punnett-square':
        simplified.interactive = false;
        simplified.showLabels = true;
        break;

      default:
        break;
    }

    return simplified;
  }

  private getGenericComponent(componentType: string): { type: string; defaultProps: Record<string, any> } {
    const componentRegistry = A2UI_REGISTRY[componentType];

    if (componentRegistry?.defaultProps) {
      return {
        type: componentType,
        defaultProps: { ...componentRegistry.defaultProps }
      };
    }

    return {
      type: 'text',
      defaultProps: {
        content: `无法显示 ${componentType} 可视化`,
        variant: 'error'
      }
    };
  }

  private extractTextFromComponent(component: A2UIComponent): string {
    const { properties } = component;

    if (component.type === 'text') {
      return properties.content || '';
    }

    if (properties.title) {
      let text = `${properties.title}\n`;
      
      if (properties.description) {
        text += `${properties.description}\n`;
      }

      if (properties.data && typeof properties.data === 'object') {
        Object.entries(properties.data).forEach(([key, value]) => {
          text += `${key}: ${JSON.stringify(value)}\n`;
        });
      }

      return text;
    }

    return JSON.stringify(properties, null, 2);
  }

  getFallbackHistory(): FallbackStrategy['fallbackHistory'] {
    return [...this.strategy.fallbackHistory];
  }

  getStrategy(): FallbackStrategy {
    return { ...this.strategy };
  }

  setStrategy(strategy: Partial<FallbackStrategy>): void {
    this.strategy = {
      ...this.strategy,
      ...strategy
    };
  }

  shouldRetry(componentId: string): boolean {
    const componentError = this.componentErrors.get(componentId);
    if (!componentError) {
      return true;
    }

    return componentError.count < this.strategy.maxRetries;
  }
}

export function createFallbackManager(config?: Partial<FallbackStrategy>): A2UIFallbackManager {
  return new A2UIFallbackManager(config);
}

export function getFallbackLevel(level: number): FallbackLevel | undefined {
  return FALLBACK_LEVELS.find(l => l.level === level);
}
