import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface StreamChunk {
  type: 'skeleton' | 'surface' | 'dataModel' | 'beginRender' | 'chunk' | 'data' | 'done' | 'error';
  id: string;
  timestamp: number;
  data: any;
  error?: string;
}

export interface StreamSkeleton {
  templateId?: string;
  visualizationType?: string;
  structure: any;
  metadata: {
    concept: string;
    question: string;
    userLevel: string;
    timestamp: number;
  };
}

export interface StreamData {
  textAnswer?: string;
  visualization?: any;
  a2uiTemplate?: {
    templateId: string;
    surface?: any;
    dataModel?: any;
    a2uiTemplate?: any;
    parameters?: Record<string, any>;
    schema?: any;
  };
  examples?: Array<{
    title: string;
    description: string;
  }>;
  followUpQuestions?: string[];
  relatedConcepts?: string[];
  citations?: Array<{ chunkId: string; content: string; chapter?: string; section?: string }>;
  sources?: Array<{ documentId: string; title: string; chapter?: string; section?: string }>;
  streamingProgress?: number;
}

@Injectable()
export class StreamResponseService implements OnModuleInit {
  private readonly logger = new Logger(StreamResponseService.name);

  onModuleInit() {
    this.logger.log('StreamResponseService initialized');
  }

  createStreamResponse(
    answerFn: () => Promise<any>,
    options: {
      chunkSize?: number;
      enableSkeleton?: boolean;
      enableProgressiveData?: boolean;
    } = {}
  ): Observable<StreamChunk> {
    const {
      chunkSize = 50,
      enableSkeleton = true,
      enableProgressiveData = true
    } = options;

    return new Observable<StreamChunk>((subscriber) => {
      this.executeStreamResponse(answerFn, subscriber, {
        chunkSize,
        enableSkeleton,
        enableProgressiveData
      }).catch((error) => {
        subscriber.error(error);
      });

      return () => {
        this.logger.debug('Stream subscription closed');
      };
    });
  }

  private async executeStreamResponse(
    answerFn: () => Promise<any>,
    subscriber: any,
    options: {
      chunkSize: number;
      enableSkeleton: boolean;
      enableProgressiveData: boolean;
    }
  ): Promise<void> {
    try {
      const response = await answerFn();
      const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      if (options.enableSkeleton && response.a2uiTemplate?.surface) {
        this.sendSkeleton(subscriber, response, messageId);
        this.sendSurface(subscriber, response.a2uiTemplate.surface, messageId);
      }

      if (response.a2uiTemplate?.dataModel) {
        this.sendDataModel(subscriber, response.a2uiTemplate.dataModel, messageId);
      }

      if (response.textAnswer) {
        await this.streamTextChunks(subscriber, response.textAnswer, messageId, options.chunkSize);
      }

      if (options.enableProgressiveData && response.a2uiTemplate) {
        this.sendA2UIData(subscriber, response.a2uiTemplate, messageId);
      }

      this.sendBeginRender(subscriber, messageId);

      this.sendDone(subscriber, messageId, response);
    } catch (error) {
      this.sendError(subscriber, error);
    }
  }

  private sendSkeleton(subscriber: any, response: any, messageId: string): void {
    const skeleton: StreamSkeleton = {
      templateId: response.a2uiTemplate?.templateId,
      visualizationType: response.a2uiTemplate?.a2uiTemplate?.type,
      structure: this.extractSkeletonStructure(response.a2uiTemplate?.a2uiTemplate),
      metadata: {
        concept: response.concept || 'unknown',
        question: response.question || 'unknown',
        userLevel: response.userLevel || 'intermediate',
        timestamp: Date.now()
      }
    };

    subscriber.next({
      type: 'skeleton',
      id: messageId,
      timestamp: Date.now(),
      data: skeleton
    });

    this.logger.debug(`Sent skeleton for ${skeleton.templateId}`);
  }

  private extractSkeletonStructure(a2uiTemplate: any): any {
    if (!a2uiTemplate) {
      return null;
    }

    const extractStructure = (node: any): any => {
      if (!node || typeof node !== 'object') {
        return null;
      }

      if (Array.isArray(node)) {
        return node.map(extractStructure);
      }

      const skeleton: any = {
        type: node.type,
        id: node.id
      };

      if (node.children && Array.isArray(node.children)) {
        skeleton.children = node.children.map(extractStructure);
      }

      if (node.properties) {
        skeleton.hasProperties = true;
      }

      return skeleton;
    };

    return extractStructure(a2uiTemplate);
  }

  private async streamTextChunks(
    subscriber: any,
    text: string,
    messageId: string,
    chunkSize: number
  ): Promise<void> {
    const chunks = this.splitTextIntoChunks(text, chunkSize);
    const totalChunks = chunks.length;

    for (let i = 0; i < chunks.length; i++) {
      subscriber.next({
        type: 'chunk',
        id: messageId,
        timestamp: Date.now(),
        data: {
          chunk: chunks[i],
          index: i,
          total: totalChunks,
          progress: ((i + 1) / totalChunks) * 100
        }
      });

      await this.delay(30);
    }

    this.logger.debug(`Streamed ${totalChunks} text chunks`);
  }

  private splitTextIntoChunks(text: string, size: number): string[] {
    const chunks: string[] = [];
    let currentChunk = '';
    const sentences = text.split(/([。！？.\n])/);

    for (let i = 0; i < sentences.length; i += 2) {
      const sentence = sentences[i] + (sentences[i + 1] || '');
      
      if (currentChunk.length + sentence.length > size && currentChunk.length > 0) {
        chunks.push(currentChunk);
        currentChunk = '';
      }
      
      currentChunk += sentence;
    }

    if (currentChunk.length > 0) {
      chunks.push(currentChunk);
    }

    return chunks;
  }

  private sendSurface(subscriber: any, surface: any, messageId: string): void {
    subscriber.next({
      type: 'surface',
      id: messageId,
      timestamp: Date.now(),
      data: surface
    });

    this.logger.debug('Sent surface component tree (flat structure)');
  }

  private sendDataModel(subscriber: any, dataModel: Record<string, any>, messageId: string): void {
    subscriber.next({
      type: 'dataModel',
      id: messageId,
      timestamp: Date.now(),
      data: dataModel
    });

    this.logger.debug('Sent data model');
  }

  private sendBeginRender(subscriber: any, messageId: string): void {
    subscriber.next({
      type: 'beginRender',
      id: messageId,
      timestamp: Date.now(),
      data: {
        action: 'begin',
        timestamp: Date.now()
      }
    });

    this.logger.debug('Sent begin render signal');
  }

  private sendA2UIData(subscriber: any, a2uiTemplate: any, messageId: string): void {
    subscriber.next({
      type: 'data',
      id: messageId,
      timestamp: Date.now(),
      data: {
        a2uiTemplate: a2uiTemplate
      }
    });

    this.logger.debug('Sent A2UI template data');
  }

  private sendDone(subscriber: any, messageId: string, response: any): void {
    const finalData: Partial<StreamData> = {};

    if (response.examples) {
      finalData.examples = response.examples;
    }

    if (response.followUpQuestions) {
      finalData.followUpQuestions = response.followUpQuestions;
    }

    if (response.relatedConcepts) {
      finalData.relatedConcepts = response.relatedConcepts;
    }

    subscriber.next({
      type: 'done',
      id: messageId,
      timestamp: Date.now(),
      data: finalData
    });

    subscriber.complete();

    this.logger.log(`Stream completed for message ${messageId}`);
  }

  private sendError(subscriber: any, error: any): void {
    subscriber.next({
      type: 'error',
      id: `err_${Date.now()}`,
      timestamp: Date.now(),
      data: null,
      error: error.message || 'Unknown error occurred'
    });

    subscriber.error(error);

    this.logger.error('Stream error:', error);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  formatForSSE(chunk: StreamChunk): string {
    const data = JSON.stringify(chunk);
    return `data: ${data}\n\n`;
  }
}
