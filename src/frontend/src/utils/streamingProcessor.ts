import type { A2UIStreamingChunk } from '@shared/types/a2ui.types';

export interface StreamingProcessorConfig {
  enableSmartSplit: boolean;
  enableMathProtection: boolean;
  enableCodeBlockProtection: boolean;
  chunkSize: number;
  flushInterval: number;
}

export class StreamingProcessor {
  private buffer: string = '';
  private chunks: A2UIStreamingChunk[] = [];
  private chunkIndex: number = 0;
  private config: StreamingProcessorConfig;
  private flushTimer: ReturnType<typeof setTimeout> | null = null;
  private pendingFlush: boolean = false;

  constructor(config: Partial<StreamingProcessorConfig> = {}) {
    this.config = {
      enableSmartSplit: true,
      enableMathProtection: true,
      enableCodeBlockProtection: true,
      chunkSize: 100,
      flushInterval: 50,
      ...config
    };
  }

  process(chunk: string): A2UIStreamingChunk[] {
    this.buffer += chunk;
    this.pendingFlush = true;

    if (this.flushTimer === null) {
      this.flushTimer = setTimeout(() => {
        this.flush();
      }, this.config.flushInterval);
    }

    return this.chunks;
  }

  private flush(): void {
    if (!this.pendingFlush || this.buffer.length === 0) {
      return;
    }

    const textChunks = this.smartSplit(this.buffer);

    textChunks.forEach((text, index) => {
      this.chunks.push({
        type: 'text',
        content: text,
        chunkIndex: this.chunkIndex + index,
        totalChunks: this.chunks.length + textChunks.length
      });
    });

    this.chunkIndex += textChunks.length;
    this.buffer = '';
    this.pendingFlush = false;

    if (this.flushTimer !== null) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
  }

  private smartSplit(text: string): string[] {
    if (!this.config.enableSmartSplit) {
      return [text];
    }

    const chunks: string[] = [];
    let remaining = text;
    let currentChunk = '';

    while (remaining.length > 0) {
      const chunkSize = Math.min(this.config.chunkSize, remaining.length);
      const candidate = remaining.slice(0, chunkSize);

      if (this.isSafeSplit(candidate)) {
        currentChunk += candidate;
        remaining = remaining.slice(chunkSize);

        if (currentChunk.length >= this.config.chunkSize) {
          chunks.push(currentChunk);
          currentChunk = '';
        }
      } else {
        const safeIndex = this.findSafeSplitIndex(candidate);
        if (safeIndex > 0) {
          currentChunk += remaining.slice(0, safeIndex);
          remaining = remaining.slice(safeIndex);
          chunks.push(currentChunk);
          currentChunk = '';
        } else {
          currentChunk += remaining.slice(0, 1);
          remaining = remaining.slice(1);
        }
      }
    }

    if (currentChunk.length > 0) {
      chunks.push(currentChunk);
    }

    return chunks;
  }

  private isSafeSplit(candidate: string): boolean {
    if (this.config.enableMathProtection && this.isInMathBlock(candidate)) {
      return false;
    }

    if (this.config.enableCodeBlockProtection && this.isInCodeBlock(candidate)) {
      return false;
    }

    if (candidate.length < this.config.chunkSize) {
      return true;
    }

    const lastChar = candidate[candidate.length - 1];
    const safeChars = [' ', '\n', '.', ',', ';', ':', '!', '?', ')', ']', '}', '>'];
    return safeChars.includes(lastChar);
  }

  private findSafeSplitIndex(text: string): number {
    for (let i = text.length - 1; i >= 0; i--) {
      const char = text[i];
      const safeChars = [' ', '\n', '.', ',', ';', ':', '!', '?', ')', ']', '}', '>'];
      
      if (safeChars.includes(char)) {
        return i + 1;
      }
    }

    return 0;
  }

  private isInMathBlock(text: string): boolean {
    const mathPattern = /\$\$[\s\S]*?\$\$/g;
    const matches = text.match(mathPattern);
    
    if (!matches) {
      return false;
    }

    const lastMatch = matches[matches.length - 1];
    const lastDollarIndex = text.lastIndexOf('$$');
    
    return lastDollarIndex > text.indexOf(lastMatch) + lastMatch.length;
  }

  private isInCodeBlock(text: string): boolean {
    const codePattern = /```[\s\S]*?```/g;
    const matches = text.match(codePattern);
    
    if (!matches) {
      return false;
    }

    const lastMatch = matches[matches.length - 1];
    const lastBacktickIndex = text.lastIndexOf('```');
    
    return lastBacktickIndex > text.indexOf(lastMatch) + lastMatch.length;
  }

  complete(): void {
    this.flush();

    if (this.flushTimer !== null) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
  }

  getChunks(): A2UIStreamingChunk[] {
    return [...this.chunks];
  }

  reset(): void {
    this.buffer = '';
    this.chunks = [];
    this.chunkIndex = 0;
    this.pendingFlush = false;

    if (this.flushTimer !== null) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
  }

  updateConfig(config: Partial<StreamingProcessorConfig>): void {
    this.config = {
      ...this.config,
      ...config
    };
  }

  getConfig(): StreamingProcessorConfig {
    return { ...this.config };
  }
}

export function createStreamingProcessor(config?: Partial<StreamingProcessorConfig>): StreamingProcessor {
  return new StreamingProcessor(config);
}

export async function processStreamAsync(
  stream: AsyncIterable<string>,
  config?: Partial<StreamingProcessorConfig>
): Promise<A2UIStreamingChunk[]> {
  const processor = createStreamingProcessor(config);
  const allChunks: A2UIStreamingChunk[] = [];

  for await (const chunk of stream) {
    const chunks = processor.process(chunk);
    allChunks.push(...chunks);
  }

  processor.complete();
  allChunks.push(...processor.getChunks());

  return allChunks;
}

export class A2UIStreamDecoder {
  private textDecoder = new TextDecoder();
  private buffer = '';

  decode(chunk: Uint8Array): string[] {
    const decoded = this.textDecoder.decode(chunk, { stream: true });
    this.buffer += decoded;

    const lines = this.buffer.split('\n');
    this.buffer = lines.pop() || '';

    return lines.filter(line => line.trim().length > 0);
  }

  flush(): string {
    const remaining = this.buffer;
    this.buffer = '';
    return remaining;
  }

  reset(): void {
    this.buffer = '';
  }
}

export function parseSSEChunk(line: string): A2UIStreamingChunk | null {
  if (!line.startsWith('data: ')) {
    return null;
  }

  const data = line.slice(6);
  
  try {
    const parsed = JSON.parse(data);
    
    if (parsed.type === 'text' || parsed.type === 'component' || parsed.type === 'metadata') {
      return parsed as A2UIStreamingChunk;
    }
    
    return null;
  } catch (error) {
    console.warn('[SSE] Failed to parse chunk:', error);
    return null;
  }
}

export class SSEStreamProcessor {
  private decoder = new A2UIStreamDecoder();
  private processor: StreamingProcessor;

  constructor(config?: Partial<StreamingProcessorConfig>) {
    this.processor = new StreamingProcessor(config);
  }

  async *process(reader: ReadableStreamDefaultReader<Uint8Array>): AsyncGenerator<A2UIStreamingChunk> {
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          if (buffer.trim()) {
            const chunk = parseSSEChunk(buffer);
            if (chunk) {
              yield chunk;
            }
          }
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const chunk = parseSSEChunk(line);
          if (chunk) {
            yield chunk;
          }
        }
      }
    } finally {
      this.processor.complete();
    }
  }

  reset(): void {
    this.decoder.reset();
    this.processor.reset();
  }
}
