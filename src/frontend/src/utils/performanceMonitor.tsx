import React from 'react';

export interface PerformanceMetrics {
  renderTime: number;
  componentCount: number;
  fps: number;
  memoryUsage: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  } | null;
  networkMetrics: {
    requestCount: number;
    totalSize: number;
    averageTime: number;
  };
  timestamp: number;
}

export interface PerformanceThreshold {
  renderTime: number;
  fps: number;
  memoryUsage: number;
}

export class A2UIPerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private startTime: number = 0;
  private frameCount: number = 0;
  private fpsUpdateInterval: number = 1000;
  private lastFPSUpdate: number = 0;
  private currentFPS: number = 0;
  private requestCount: number = 0;
  private totalRequestSize: number = 0;
  private totalRequestTime: number = 0;
  private observer: PerformanceObserver | null = null;
  private isMonitoring: boolean = false;
  private thresholds: PerformanceThreshold = {
    renderTime: 100,
    fps: 30,
    memoryUsage: 100 * 1024 * 1024
  };

  constructor(thresholds?: Partial<PerformanceThreshold>) {
    if (thresholds) {
      this.thresholds = { ...this.thresholds, ...thresholds };
    }
  }

  start(): void {
    if (this.isMonitoring) {
      return;
    }

    this.isMonitoring = true;
    this.startTime = performance.now();
    this.frameCount = 0;
    this.lastFPSUpdate = performance.now();
    this.currentFPS = 0;

    this.setupNetworkMonitoring();
    this.startFPSMonitoring();

    console.log('[A2UI Performance] Monitoring started');
  }

  stop(): void {
    if (!this.isMonitoring) {
      return;
    }

    this.isMonitoring = false;

    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    console.log('[A2UI Performance] Monitoring stopped');
  }

  private setupNetworkMonitoring(): void {
    if (!('PerformanceObserver' in window)) {
      return;
    }

    try {
      this.observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: PerformanceEntry) => {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming;
            this.requestCount++;
            this.totalRequestSize += this.estimateSize(resourceEntry);
            this.totalRequestTime += resourceEntry.duration;
          }
        });
      });

      this.observer.observe({ entryTypes: ['resource'] });
    } catch (error) {
      console.warn('[A2UI Performance] Failed to setup network monitoring:', error);
    }
  }

  private estimateSize(entry: PerformanceResourceTiming): number {
    if (entry.transferSize) {
      return entry.transferSize;
    }

    if (entry.encodedBodySize) {
      return entry.encodedBodySize;
    }

    return 0;
  }

  private startFPSMonitoring(): void {
    const measureFPS = () => {
      if (!this.isMonitoring) {
        return;
      }

      const now = performance.now();
      this.frameCount++;

      if (now - this.lastFPSUpdate >= this.fpsUpdateInterval) {
        const delta = now - this.lastFPSUpdate;
        this.currentFPS = Math.round((this.frameCount * 1000) / delta);

        this.frameCount = 0;
        this.lastFPSUpdate = now;
      }

      requestAnimationFrame(measureFPS);
    };

    requestAnimationFrame(measureFPS);
  }

  measureRender(componentCount: number): PerformanceMetrics {
    const endTime = performance.now();
    const renderTime = endTime - this.startTime;

    const memoryUsage = this.getMemoryUsage();

    const metrics: PerformanceMetrics = {
      renderTime,
      componentCount,
      fps: this.currentFPS,
      memoryUsage,
      networkMetrics: {
        requestCount: this.requestCount,
        totalSize: this.totalRequestSize,
        averageTime: this.requestCount > 0 ? this.totalRequestTime / this.requestCount : 0
      },
      timestamp: Date.now()
    };

    this.metrics.push(metrics);
    this.startTime = endTime;

    this.checkThresholds(metrics);

    return metrics;
  }

  private getMemoryUsage(): PerformanceMetrics['memoryUsage'] {
    if (!('performance' in window) || !('memory' in (window.performance as any))) {
      return null;
    }

    const memory = (window.performance as any).memory;

    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit
    };
  }

  private checkThresholds(metrics: PerformanceMetrics): void {
    const warnings: string[] = [];

    if (metrics.renderTime > this.thresholds.renderTime) {
      warnings.push(`Render time (${metrics.renderTime.toFixed(2)}ms) exceeds threshold (${this.thresholds.renderTime}ms)`);
    }

    if (metrics.fps > 0 && metrics.fps < this.thresholds.fps) {
      warnings.push(`FPS (${metrics.fps}) below threshold (${this.thresholds.fps})`);
    }

    if (metrics.memoryUsage) {
      const usageMB = metrics.memoryUsage.usedJSHeapSize / (1024 * 1024);
      const thresholdMB = this.thresholds.memoryUsage / (1024 * 1024);
      
      if (usageMB > thresholdMB) {
        warnings.push(`Memory usage (${usageMB.toFixed(2)}MB) exceeds threshold (${thresholdMB.toFixed(2)}MB)`);
      }
    }

    if (warnings.length > 0) {
      console.warn('[A2UI Performance] Threshold warnings:', warnings);
      this.reportPerformanceIssue(warnings, metrics);
    }
  }

  private reportPerformanceIssue(warnings: string[], metrics: PerformanceMetrics): void {
    const issue = {
      warnings,
      metrics: {
        renderTime: metrics.renderTime,
        fps: metrics.fps,
        componentCount: metrics.componentCount,
        memoryUsage: metrics.memoryUsage ? {
          usedMB: metrics.memoryUsage.usedJSHeapSize / (1024 * 1024),
          totalMB: metrics.memoryUsage.totalJSHeapSize / (1024 * 1024),
          limitMB: metrics.memoryUsage.jsHeapSizeLimit / (1024 * 1024)
        } : null,
        networkMetrics: metrics.networkMetrics
      },
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    try {
      fetch('/api/a2ui/performance-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(issue),
      }).catch(error => {
        console.error('[A2UI Performance] Failed to report issue:', error);
      });
    } catch (error) {
      console.error('[A2UI Performance] Failed to report issue:', error);
    }
  }

  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  getLatestMetrics(): PerformanceMetrics | null {
    return this.metrics.length > 0 ? this.metrics[this.metrics.length - 1] : null;
  }

  getAverageMetrics(): {
    renderTime: number;
    fps: number;
    componentCount: number;
  } | null {
    if (this.metrics.length === 0) {
      return null;
    }

    const sum = this.metrics.reduce((acc, metrics) => ({
      renderTime: acc.renderTime + metrics.renderTime,
      fps: acc.fps + (metrics.fps > 0 ? metrics.fps : 0),
      componentCount: acc.componentCount + metrics.componentCount
    }), { renderTime: 0, fps: 0, componentCount: 0 });

    const count = this.metrics.length;

    return {
      renderTime: sum.renderTime / count,
      fps: sum.fps / count,
      componentCount: sum.componentCount / count
    };
  }

  clearMetrics(): void {
    this.metrics = [];
    this.requestCount = 0;
    this.totalRequestSize = 0;
    this.totalRequestTime = 0;
    console.log('[A2UI Performance] Metrics cleared');
  }

  generateReport(): string {
    const lines: string[] = [];
    lines.push('=== A2UI Performance Report ===');
    lines.push(`Monitoring Duration: ${((Date.now() - this.startTime) / 1000).toFixed(2)}s`);
    lines.push('');

    if (this.metrics.length > 0) {
      const latest = this.metrics[this.metrics.length - 1];
      const average = this.getAverageMetrics()!;

      lines.push('--- Latest Metrics ---');
      lines.push(`  Render Time: ${latest.renderTime.toFixed(2)}ms`);
      lines.push(`  FPS: ${latest.fps}`);
      lines.push(`  Component Count: ${latest.componentCount}`);
      lines.push(`  Network Requests: ${latest.networkMetrics.requestCount}`);
      lines.push(`  Total Network Size: ${(latest.networkMetrics.totalSize / 1024).toFixed(2)}KB`);
      lines.push('');

      lines.push('--- Average Metrics ---');
      lines.push(`  Render Time: ${average.renderTime.toFixed(2)}ms`);
      lines.push(`  FPS: ${average.fps.toFixed(1)}`);
      lines.push(`  Component Count: ${average.componentCount.toFixed(1)}`);

      if (latest.memoryUsage) {
        lines.push('');
        lines.push('--- Memory Usage ---');
        lines.push(`  Used: ${(latest.memoryUsage.usedJSHeapSize / (1024 * 1024)).toFixed(2)}MB`);
        lines.push(`  Total: ${(latest.memoryUsage.totalJSHeapSize / (1024 * 1024)).toFixed(2)}MB`);
        lines.push(`  Limit: ${(latest.memoryUsage.jsHeapSizeLimit / (1024 * 1024)).toFixed(2)}MB`);
      }

      lines.push('');
      lines.push('--- Thresholds ---');
      lines.push(`  Render Time: ${this.thresholds.renderTime}ms`);
      lines.push(`  FPS: ${this.thresholds.fps}`);
      lines.push(`  Memory: ${(this.thresholds.memoryUsage / (1024 * 1024)).toFixed(2)}MB`);
    } else {
      lines.push('No metrics available yet');
    }

    return lines.join('\n');
  }

  updateThresholds(thresholds: Partial<PerformanceThreshold>): void {
    this.thresholds = { ...this.thresholds, ...thresholds };
    console.log('[A2UI Performance] Thresholds updated:', this.thresholds);
  }

  getThresholds(): PerformanceThreshold {
    return { ...this.thresholds };
  }

  isMonitoringActive(): boolean {
    return this.isMonitoring;
  }
}

export function createPerformanceMonitor(thresholds?: Partial<PerformanceThreshold>): A2UIPerformanceMonitor {
  return new A2UIPerformanceMonitor(thresholds);
}

export function withPerformanceMonitoring<P extends object>(
  Component: React.ComponentType<P>,
  monitor: A2UIPerformanceMonitor,
  componentName?: string
): React.ComponentType<P> {
  return function WithPerformanceMonitoringWrapper(props: P) {
    const renderStart = React.useRef<number>(0);
    const componentCount = React.useRef<number>(0);

    React.useEffect(() => {
      renderStart.current = performance.now();
      componentCount.current = 1;

      return () => {
        if (monitor.isMonitoringActive()) {
          const metrics = monitor.measureRender(componentCount.current);
          console.log(`[A2UI Performance] ${componentName || 'Component'} rendered:`, metrics);
        }
      };
    }, []);

    return React.createElement(Component, props);
  };
}

export function usePerformanceMonitor(thresholds?: Partial<PerformanceThreshold>): {
  monitor: A2UIPerformanceMonitor;
  start: () => void;
  stop: () => void;
  measureRender: (componentCount: number) => PerformanceMetrics;
  getMetrics: () => PerformanceMetrics[];
  getReport: () => string;
} {
  const monitorRef = React.useRef<A2UIPerformanceMonitor | null>(null);

  React.useEffect(() => {
    if (!monitorRef.current) {
      monitorRef.current = createPerformanceMonitor(thresholds);
      monitorRef.current.start();
    }

    return () => {
      monitorRef.current?.stop();
    };
  }, [thresholds]);

  return {
    monitor: monitorRef.current!,
    start: () => monitorRef.current?.start(),
    stop: () => monitorRef.current?.stop(),
    measureRender: (componentCount: number) => monitorRef.current?.measureRender(componentCount) as PerformanceMetrics,
    getMetrics: () => monitorRef.current?.getMetrics() || [],
    getReport: () => monitorRef.current?.generateReport() || 'No metrics available'
  };
}
