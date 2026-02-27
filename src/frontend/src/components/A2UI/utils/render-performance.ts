export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = window.setTimeout(later, wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      window.setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export interface BatchUpdateOptions {
  batchSize?: number;
  batchDelay?: number;
  maxWaitTime?: number;
}

export class BatchUpdater<T> {
  private batch: T[] = [];
  private batchTimer: number | null = null;
  private startTime: number = 0;
  private options: Required<BatchUpdateOptions>;
  private flushCallback: ((items: T[]) => void) | null = null;

  constructor(
    callback: (items: T[]) => void,
    options: BatchUpdateOptions = {}
  ) {
    this.flushCallback = callback;
    this.options = {
      batchSize: options.batchSize ?? 10,
      batchDelay: options.batchDelay ?? 16,
      maxWaitTime: options.maxWaitTime ?? 100,
    };
  }

  add(item: T): void {
    this.batch.push(item);
    this.startTime = Date.now();
    
    if (this.batch.length >= this.options.batchSize) {
      this.flush();
    } else {
      this.scheduleFlush();
    }
  }

  addAll(items: T[]): void {
    this.batch.push(...items);
    this.startTime = Date.now();
    
    if (this.batch.length >= this.options.batchSize) {
      this.flush();
    } else {
      this.scheduleFlush();
    }
  }

  flush(): void {
    if (this.batch.length === 0) {
      return;
    }

    const items = [...this.batch];
    this.batch = [];
    
    if (this.batchTimer !== null) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }

    this.flushCallback?.(items);
  }

  private scheduleFlush(): void {
    if (this.batchTimer !== null) {
      return;
    }

    const elapsedTime = Date.now() - this.startTime;
    const remainingTime = Math.max(
      0,
      this.options.maxWaitTime - elapsedTime
    );

    this.batchTimer = window.setTimeout(() => {
      this.flush();
    }, Math.min(remainingTime, this.options.batchDelay));
  }

  clear(): void {
    this.batch = [];
    if (this.batchTimer !== null) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }
  }

  get size(): number {
    return this.batch.length;
  }

  destroy(): void {
    this.clear();
    this.flushCallback = null;
  }
}

export class RenderScheduler {
  private pendingUpdates: Set<string> = new Set();
  private scheduledRender: boolean = false;
  private renderCallback: (() => void) | null = null;
  private frameId: number | null = null;

  constructor(renderCallback: () => void) {
    this.renderCallback = renderCallback;
  }

  requestRender(surfaceId?: string): void {
    if (surfaceId) {
      this.pendingUpdates.add(surfaceId);
    }

    if (!this.scheduledRender) {
      this.scheduledRender = true;
      this.frameId = requestAnimationFrame(() => {
        this.executeRender();
      });
    }
  }

  private executeRender(): void {
    this.scheduledRender = false;
    this.frameId = null;

    try {
      this.renderCallback?.();
    } finally {
      this.pendingUpdates.clear();
    }
  }

  cancelRender(): void {
    if (this.frameId !== null) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
    this.scheduledRender = false;
    this.pendingUpdates.clear();
  }

  hasPendingUpdate(surfaceId: string): boolean {
    return this.pendingUpdates.has(surfaceId);
  }

  getPendingSurfaceIds(): string[] {
    return Array.from(this.pendingUpdates);
  }

  destroy(): void {
    this.cancelRender();
    this.renderCallback = null;
  }
}

export interface PerformanceMetrics {
  renderCount: number;
  averageRenderTime: number;
  lastRenderTime: number;
  maxRenderTime: number;
  bufferFlushCount: number;
  averageBufferSize: number;
}

export class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    renderCount: 0,
    averageRenderTime: 0,
    lastRenderTime: 0,
    maxRenderTime: 0,
    bufferFlushCount: 0,
    averageBufferSize: 0,
  };

  private renderTimes: number[] = [];
  private bufferSizes: number[] = [];
  private maxRenderHistory: number = 50;

  recordRender(renderTime: number): void {
    this.metrics.renderCount++;
    this.metrics.lastRenderTime = renderTime;
    this.metrics.maxRenderTime = Math.max(
      this.metrics.maxRenderTime,
      renderTime
    );

    this.renderTimes.push(renderTime);
    if (this.renderTimes.length > this.maxRenderHistory) {
      this.renderTimes.shift();
    }

    this.metrics.averageRenderTime =
      this.renderTimes.reduce((a, b) => a + b, 0) / this.renderTimes.length;
  }

  recordBufferFlush(bufferSize: number): void {
    this.metrics.bufferFlushCount++;

    this.bufferSizes.push(bufferSize);
    if (this.bufferSizes.length > this.maxRenderHistory) {
      this.bufferSizes.shift();
    }

    this.metrics.averageBufferSize =
      this.bufferSizes.reduce((a, b) => a + b, 0) / this.bufferSizes.length;
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  reset(): void {
    this.metrics = {
      renderCount: 0,
      averageRenderTime: 0,
      lastRenderTime: 0,
      maxRenderTime: 0,
      bufferFlushCount: 0,
      averageBufferSize: 0,
    };
    this.renderTimes = [];
    this.bufferSizes = [];
  }
}
