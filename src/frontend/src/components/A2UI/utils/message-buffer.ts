import { A2UIMessage } from '@shared/types/a2ui.types';

export interface BufferedMessage {
  message: A2UIMessage;
  timestamp: number;
  surfaceId: string;
  priority: 'high' | 'normal' | 'low';
}

export interface BufferConfig {
  maxBufferSize?: number;
  flushInterval?: number;
  enableAutoFlush?: boolean;
}

export class MessageBuffer {
  private buffer: BufferedMessage[] = [];
  private flushTimer: number | null = null;
  private config: Required<BufferConfig>;

  constructor(config: BufferConfig = {}) {
    this.config = {
      maxBufferSize: config.maxBufferSize ?? 100,
      flushInterval: config.flushInterval ?? 50,
      enableAutoFlush: config.enableAutoFlush ?? true,
    };

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

    this.buffer.push(bufferedMessage);

    if (this.buffer.length >= this.config.maxBufferSize) {
      this.flush();
    }
  }

  flush(): BufferedMessage[] {
    const messages = [...this.buffer];
    this.buffer = [];
    return messages.sort(this.sortByPriority);
  }

  peek(): BufferedMessage[] {
    return [...this.buffer].sort(this.sortByPriority);
  }

  clear(): void {
    this.buffer = [];
  }

  get size(): number {
    return this.buffer.length;
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
    this.flushTimer = window.setInterval(() => {
      if (this.buffer.length > 0) {
        this.flush();
      }
    }, this.config.flushInterval);
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
  }
}
