/**
 * LLM 配置
 */

export interface LLMConfig {
  provider: 'openai' | 'claude' | 'deepseek' | 'kimi';
  apiKey: string;
  model: string;
  baseURL?: string;
  temperature?: number;
  maxTokens?: number;
}

export const LLM_CONFIGS: Record<string, Omit<LLMConfig, 'apiKey'>> = {
  openai: {
    provider: 'openai',
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2000,
  },
  claude: {
    provider: 'claude',
    model: 'claude-3-5-sonnet-20241022',
    temperature: 0.7,
    maxTokens: 2000,
  },
  deepseek: {
    provider: 'deepseek',
    model: 'deepseek-chat',
    baseURL: 'https://api.deepseek.com',
    temperature: 0.7,
    maxTokens: 2000,
  },
  kimi: {
    provider: 'kimi',
    model: 'moonshot-v1-128k',
    baseURL: 'https://api.moonshot.cn',
    temperature: 0.7,
    maxTokens: 2000,
  },
};

export function getLLMConfig(provider: string, apiKey: string): LLMConfig {
  const baseConfig = LLM_CONFIGS[provider];
  if (!baseConfig) {
    throw new Error(`Unknown LLM provider: ${provider}`);
  }
  return {
    ...baseConfig,
    apiKey,
  };
}
