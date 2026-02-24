/**
 * 性能监控工具
 */

// 性能指标收集
export class PerformanceMonitor {
  private marks: Map<string, number> = new Map();
  private measures: Map<string, number[]> = new Map();

  /**
   * 标记一个时间点
   */
  mark(name: string): void {
    this.marks.set(name, performance.now());
  }

  /**
   * 测量两个标记之间的时间差
   */
  measure(name: string, startMark: string, endMark: string): number {
    const start = this.marks.get(startMark);
    const end = this.marks.get(endMark);

    if (start === undefined || end === undefined) {
      console.warn(`Marks ${startMark} or ${endMark} not found`);
      return 0;
    }

    const duration = end - start;

    if (!this.measures.has(name)) {
      this.measures.set(name, []);
    }
    this.measures.get(name)!.push(duration);

    return duration;
  }

  /**
   * 获取某个测量的统计数据
   */
  getStats(name: string) {
    const measures = this.measures.get(name);
    if (!measures || measures.length === 0) {
      return null;
    }

    const sorted = [...measures].sort((a, b) => a - b);
    return {
      count: measures.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      avg: measures.reduce((sum, val) => sum + val, 0) / measures.length,
      median: sorted[Math.floor(sorted.length / 2)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)],
    };
  }

  /**
   * 清除所有标记和测量
   */
  clear(): void {
    this.marks.clear();
    this.measures.clear();
  }

  /**
   * 打印性能报告
   */
  report(): void {
    console.group('Performance Report');
    for (const [name] of this.measures) {
      const stats = this.getStats(name);
      console.log(`${name}:`, stats);
    }
    console.groupEnd();
  }
}

// 全局性能监控实例
export const perfMonitor = new PerformanceMonitor();

/**
 * 测量异步函数执行时间
 */
export async function measureAsync<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = performance.now();
  try {
    return await fn();
  } finally {
    const duration = performance.now() - start;
    if (!perfMonitor['measures'].has(name)) {
      perfMonitor['measures'].set(name, []);
    }
    perfMonitor['measures'].get(name)!.push(duration);
  }
}

/**
 * 测量同步函数执行时间
 */
export function measureSync<T>(name: string, fn: () => T): T {
  const start = performance.now();
  try {
    return fn();
  } finally {
    const duration = performance.now() - start;
    if (!perfMonitor['measures'].has(name)) {
      perfMonitor['measures'].set(name, []);
    }
    perfMonitor['measures'].get(name)!.push(duration);
  }
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * 请求空闲回调执行任务
 */
export function requestIdleCallback(
  callback: (deadline: { didTimeout: boolean; timeRemaining: () => number }) => void,
  timeout?: number
): number {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    return (window as any).requestIdleCallback(callback, { timeout });
  }

  // 降级方案：使用 setTimeout
  return setTimeout(() => {
    callback({
      didTimeout: false,
      timeRemaining: () => 0,
    });
  }, 1) as unknown as number;
}

/**
 * 取消空闲回调
 */
export function cancelIdleCallback(id: number): void {
  if (typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
    (window as any).cancelIdleCallback(id);
  } else {
    clearTimeout(id);
  }
}

/**
 * 批量更新 - 将多个状态更新合并为一次
 */
export function batchUpdates(updates: (() => void)[]): void {
  if (typeof window !== 'undefined' && 'unstable_batchedUpdates' in (window as any)) {
    (window as any).unstable_batchedUpdates(() => {
      updates.forEach(update => update());
    });
  } else {
    updates.forEach(update => update());
  }
}

/**
 * Web Worker 管理器
 */
export class WorkerManager {
  private workers: Map<string, Worker> = new Map();

  /**
   * 获取或创建 Worker
   */
  getWorker(key: string, workerCreator: () => Worker): Worker {
    if (!this.workers.has(key)) {
      this.workers.set(key, workerCreator());
    }
    return this.workers.get(key)!;
  }

  /**
   * 终止并移除 Worker
   */
  removeWorker(key: string): void {
    const worker = this.workers.get(key);
    if (worker) {
      worker.terminate();
      this.workers.delete(key);
    }
  }

  /**
   * 清理所有 Workers
   */
  terminateAll(): void {
    for (const [, worker] of this.workers) {
      worker.terminate();
    }
    this.workers.clear();
  }
}

export const workerManager = new WorkerManager();
