import apiClient from './api-client';

// LLM 相关类型
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatOptions {
  provider?: 'openai' | 'claude' | 'deepseek' | 'glm';
  temperature?: number;
  maxTokens?: number;
}

export interface ChatResponse {
  content: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

// 遗传学类型
export type Difficulty = 'easy' | 'medium' | 'hard';
export type UserLevel = 'beginner' | 'intermediate' | 'advanced';

export interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'fill_blank' | 'short_answer';
  difficulty: Difficulty;
  topic: string;
  content: string;
  options?: Array<{
    id: string;
    label: string;
    content: string;
  }>;
  correctAnswer: string;
  explanation: {
    level1: string;
    level2: string;
    level3: string;
    level4: string;
    level5: string;
  };
  tags: string[];
}

/**
 * LLM API 服务
 */
export const llmApi = {
  /**
   * 聊天对话
   */
  async chat(messages: ChatMessage[], options?: ChatOptions): Promise<ChatResponse> {
    try {
      const { data } = await apiClient.post<ChatResponse>('/llm/chat', {
        messages,
        ...options,
      });
      return data;
    } catch (error) {
      console.error('Error in chat API:', error);
      throw error;
    }
  },

  /**
   * 流式聊天
   */
  async *chatStream(messages: ChatMessage[], options?: ChatOptions, timeoutMs: number = 60000): AsyncGenerator<string> {
    const response = await fetch(`${apiClient.defaults.baseURL}/llm/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages, ...options }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No reader available');

    const decoder = new TextDecoder();
    let buffer = '';
    let chunksReceived = 0;
    const maxChunks = 10000; // 防止恶意或错误的流导致无限循环
    const startTime = Date.now();

    try {
      while (true) {
        // 超时检查
        if (Date.now() - startTime > timeoutMs) {
          console.warn('Stream timeout reached, closing connection');
          break;
        }

        const { done, value } = await reader.read();
        if (done) break;

        chunksReceived++;
        if (chunksReceived > maxChunks) {
          console.warn('Max chunks limit reached, closing connection');
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') return;
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) yield parsed.content;
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }
    } finally {
      // 确保读取器被正确关闭
      reader.cancel().catch(console.error);
    }
  },

  /**
   * 获取嵌入向量
   */
  async embed(text: string, provider?: string): Promise<number[]> {
    try {
      const { data } = await apiClient.post<{ embedding: number[] }>('/llm/embed', {
        text,
        provider,
      });
      return data.embedding;
    } catch (error) {
      console.error('Error in embed API:', error);
      throw error;
    }
  },
};

/**
 * Agent API 服务
 */
export const agentApi = {
  /**
   * 执行六 Agent 流水线
   */
  async executePipeline(params: {
    concept: string;
    userLevel?: UserLevel;
    learningGoal?: string;
    focusAreas?: string[];
  }) {
    const { data } = await apiClient.post('/agent/pipeline', params);
    return data;
  },

  /**
   * 分析概念
   */
  async analyze(concept: string, userLevel?: UserLevel) {
    const { data } = await apiClient.post('/agent/analyze', null, {
      params: { concept, userLevel },
    });
    return data;
  },

  /**
   * 探索前置知识
   */
  async explore(concept: string, maxDepth?: number) {
    const { data } = await apiClient.post('/agent/explore', {
      concept,
      maxDepth,
    });
    return data;
  },

  /**
   * 丰富遗传学知识
   */
  async enrich(concept: string) {
    const { data } = await apiClient.post('/agent/enrich', null, {
      params: { concept },
    });
    return data;
  },
};

/**
 * 题目 API 服务
 */
export const quizApi = {
  /**
   * 生成题目
   */
  async generate(params: {
    topic: string;
    difficulty: Difficulty;
    count?: number;
    userLevel?: UserLevel;
  }): Promise<QuizQuestion | QuizQuestion[]> {
    const { data } = await apiClient.post<QuizQuestion | QuizQuestion[]>('/agent/quiz/generate', params);
    return data;
  },

  /**
   * 评估答案
   */
  async evaluate(params: {
    question: string;
    correctAnswer: string;
    userAnswer: string;
  }) {
    const { data } = await apiClient.post('/agent/quiz/evaluate', params);
    return data;
  },

  /**
   * 生成相似题（举一反三）
   */
  async similar(params: {
    question: string;
    topic: string;
    userAnswer: string;
    errorType: 'low_level' | 'high_level';
    count?: number;
  }): Promise<QuizQuestion[]> {
    const { data } = await apiClient.post<QuizQuestion[]>('/agent/quiz/similar', params);
    return data;
  },
};

export default {
  llm: llmApi,
  agent: agentApi,
  quiz: quizApi,
};
