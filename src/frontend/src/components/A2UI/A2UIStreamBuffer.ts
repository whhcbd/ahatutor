import type { A2UIStreamingChunk, A2UIPayload } from '@shared/types/a2ui.types';

export class A2UIStreamBuffer {
  private messageQueue: A2UIStreamingChunk[] = [];
  private virtualView: A2UIPayload | null = null;
  private textChunks: string[] = [];
  private isBuffering: boolean = false;

  constructor(enableBuffering: boolean = true) {
    this.isBuffering = enableBuffering;
  }

  addChunk(chunk: A2UIStreamingChunk): void {
    this.messageQueue.push(chunk);
    
    if (this.isBuffering) {
      this.buildVirtualView();
    } else {
      this.immediateUpdate();
    }
  }

  private buildVirtualView(): void {
    const componentChunks = this.messageQueue.filter(c => c.type === 'component');

    if (componentChunks.length > 0) {
      const components: Record<string, any> = {};
      componentChunks.forEach(chunk => {
        if (chunk.component) {
          components[chunk.component.id] = chunk.component;
        }
      });

      this.virtualView = {
        version: '1.0',
        surface: {
          rootId: Object.keys(components)[0] || '',
          components
        },
        dataModel: {},
        metadata: {
          generatedAt: new Date().toISOString(),
          version: '1.0'
        }
      };
    }
  }

  private immediateUpdate(): void {
    for (const chunk of this.messageQueue) {
      if (chunk.type === 'text' && chunk.content) {
        this.textChunks.push(chunk.content);
      }
    }
    this.messageQueue = [];
  }

  hasAllChunks(): boolean {
    return this.messageQueue.some(c => c.type === 'component');
  }

  flush(): A2UIPayload | null {
    const view = this.virtualView;
    this.messageQueue = [];
    this.virtualView = null;
    return view;
  }

  getTextChunks(): string[] {
    return this.textChunks;
  }

  clearTextChunks(): void {
    this.textChunks = [];
  }

  getBufferedMessages(): A2UIStreamingChunk[] {
    return [...this.messageQueue];
  }

  setBuffering(enabled: boolean): void {
    this.isBuffering = enabled;
  }
}
