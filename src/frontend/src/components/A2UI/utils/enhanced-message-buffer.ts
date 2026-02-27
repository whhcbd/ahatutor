import { A2UIMessage } from '@shared/types/a2ui.types';
import { BufferedMessage, BufferConfig } from './message-buffer';
import { BatchUpdater, RenderScheduler, PerformanceMonitor, debounce } from './render-performance';

export interface EnhancedBufferConfig extends BufferConfig {
  enableBatching?: boolean;
  batchSize?: number;
  enablePerformanceMonitoring?: boolean;
  enableRenderScheduling?: boolean;
}

export class EnhancedMessageBuffer {
  private buffer: BufferedMessage[] = [];
  private flushTimer: number | null = null;
  private config: Required<EnhancedBufferConfig>;
  
  private batchUpdater: BatchUpdater<BufferedMessage>;
  private renderScheduler: RenderScheduler;
  private performanceMonitor: PerformanceMonitor;
  
  private onFlushCallback: ((messages: BufferedMessage[]) => void) | null = null;
  private onRenderCallback: (() => void) | null = null;

  constructor(
    onFlush: (messages: BufferedMessage[]) => void,
    onRender: () => void,
    config: EnhancedBufferConfig = {}
  ) {
    this.config = {
      maxBufferSize: config.maxBufferSize ?? 100,
      flushInterval: config.flushInterval ?? 50,
      enableAutoFlush: config.enableAutoFlush ?? true,
      enableBatching: config.enableBatching ?? true,
      batchSize: config.batchSize ?? 10,
      enablePerformanceMonitoring: config.enablePerformanceMonitoring ?? true,
      enableRenderScheduling: config.enableRenderScheduling ?? true,
    };

    this.onFlushCallback = onFlush;
    this.onRenderCallback = onRender;

    this.batchUpdater = new BatchUpdater<BufferedMessage>(
      this.handleBatchFlush.bind(this),
      {
        batchSize: this.config.batchSize,
        batchDelay: this.config.flushInterval,
        maxWaitTime: 200,
      }
    );

    this.renderScheduler = new RenderScheduler(
      this.handleScheduledRender.bind(this)
    );

    this.performanceMonitor = new PerformanceMonitor();

    if (this.config.enableAutoFlush) {
      this.startAutoFlush();
    }
  }

  add(message: A2UIMessage, priority: 'high' | 'normal' | 'low' = 'normal'): void {
    const surfaceId = this.extractSurfaceId(message);
    
    const bufferedMessage: BufferedMessage = {
      message,
      timestamp: Date.now(),
      surfaceId,
      priority,
    };

    if (this.config.enableBatching) {
      this.batchUpdater.add(bufferedMessage);
    } else {
      this.buffer.push(bufferedMessage);
      this.checkFlushCondition();
    }

    if (this.config.enableRenderScheduling) {
      this.renderScheduler.requestRender(surfaceId);
    }
  }

  addAll(messages: A2UIMessage[]): void {
    const bufferedMessages = messages.map(msg => ({
      message: msg,
      timestamp: Date.now(),
      surfaceId: this.extractSurfaceId(msg),
      priority: 'normal' as const,
    }));

    if (this.config.enableBatching) {
      this.batchUpdater.addAll(bufferedMessages);
    } else {
      this.buffer.push(...bufferedMessages);
      this.checkFlushCondition();
    }

    if (this.config.enableRenderScheduling) {
      const surfaceIds = new Set(bufferedMessages.map(m => m.surfaceId));
      surfaceIds.forEach(id => this.renderScheduler.requestRender(id));
    }
  }

  flush(): BufferedMessage[] {
    const startTime = performance.now();
    
    const messages = [...this.buffer];
    this.buffer = [];
    const sortedMessages = messages.sort(this.sortByPriority);
    
    if (this.config.enablePerformanceMonitoring) {
      this.performanceMonitor.recordBufferFlush(messages.length);
      const flushTime = performance.now() - startTime;
      this.performanceMonitor.recordRender(flushTime);
    }

    this.onFlushCallback?.(sortedMessages);
    
    return sortedMessages;
  }

  peek(): BufferedMessage[] {
    return [...this.buffer].sort(this.sortByPriority);
  }

  clear(): void {
    this.buffer = [];
    this.batchUpdater.clear();
  }

  get size(): number {
    return this.buffer.length + this.batchUpdater.size;
  }

  get surfaceCount(): number {
    const surfaceIds = new Set(this.buffer.map(msg => msg.surfaceId));
    return surfaceIds.size;
  }

  getMessagesBySurface(surfaceId: string): BufferedMessage[] {
    return this.buffer
      .filter(msg => msg.surfaceId === surfaceId)
      .sort(this.sortByPriority);
  }

  getHighPriorityMessages(): BufferedMessage[] {
    return this.buffer
      .filter(msg => msg.priority === 'high')
      .sort((a, b) => a.timestamp - b.timestamp);
  }

  getPerformanceMetrics() {
    return this.performanceMonitor.getMetrics();
  }

  resetPerformanceMetrics(): void {
    this.performanceMonitor.reset();
  }

  private handleBatchFlush(items: BufferedMessage[]): void {
    this.buffer.push(...items);
    this.checkFlushCondition();
  }

  private handleScheduledRender(): void {
    this.onRenderCallback?.();
  }

  private checkFlushCondition(): void {
    if (this.buffer.length >= this.config.maxBufferSize) {
      this.flush();
    }
  }

  private sortByPriority = (a: BufferedMessage, b: BufferedMessage): number => {
    const priorityOrder = { high: 0, normal: 1, low: 2 };
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    
    if (priorityDiff !== 0) {
      return priorityDiff;
    }
    
    return a.timestamp - b.timestamp;
  };

  private extractSurfaceId(message: A2UIMessage): string {
    if ('surfaceUpdate' in message) {
      return message.surfaceUpdate.surfaceId;
    }
    if ('dataModelUpdate' in message) {
      return message.dataModelUpdate.surfaceId;
    }
    if ('beginRendering' in message) {
      return message.beginRendering.surfaceId;
    }
    if ('deleteSurface' in message) {
      return message.deleteSurface.surfaceId;
    }
    return 'unknown';
  }

  private startAutoFlush(): void {
    const flush = debounce(() => {
      if (this.buffer.length > 0) {
        this.flush();
      }
    }, this.config.flushInterval);

    this.flushTimer = window.setInterval(flush, this.config.flushInterval);
  }

  stopAutoFlush(): void {
    if (this.flushTimer !== null) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
  }

  destroy(): void {
    this.stopAutoFlush();
    this.clear();
    this.batchUpdater.destroy();
    this.renderScheduler.destroy();
    this.onFlushCallback = null;
    this.onRenderCallback = null;
  }
}
