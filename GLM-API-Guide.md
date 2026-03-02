# GLM 模型 API 申请和使用指南

## 一、GLM 模型简介

GLM（General Language Model）是由智谱 AI（Zhipu AI）开发的大语言模型系列，包括：
- **GLM-4** - 最新旗舰模型，支持长文本、多模态
- **GLM-3-Turbo** - 高性能模型，适合实时对话
- **GLM-3-Flash** - 轻量级模型，响应速度快
- **GLM-4V** - 多模态模型，支持图像理解
- **ChatGLM 系列** - 针对对话优化的模型

---

## 二、API 申请流程

### 1. 注册账号

**访问智谱 AI 开放平台**
```
https://open.bigmodel.cn/
```

**注册步骤**：
1. 点击右上角"注册"按钮
2. 填写手机号或邮箱
3. 完成验证码验证
4. 设置密码
5. 完成注册

### 2. 实名认证

**所需材料**：
- 个人用户：身份证信息
- 企业用户：营业执照、法人身份证

**认证流程**：
1. 登录后进入"个人中心"
2. 点击"实名认证"
3. 上传身份证照片或填写企业信息
4. 等待审核（通常 1-3 个工作日）

### 3. 创建 API Key

**步骤**：
1. 登录智谱 AI 开放平台
2. 进入"API Key 管理"
3. 点击"创建 API Key"
4. 设置 Key 名称（可选）
5. 点击确认生成
6. 复制保存 API Key（只显示一次）

**API Key 格式**：
```
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.xxxxxx
```

**注意**：
- API Key 只显示一次，请妥善保存
- 建议使用环境变量存储，不要硬编码在代码中
- 定期轮换 API Key 以提高安全性

### 4. 获取额度

**免费额度**：
- 新注册用户通常获得免费调用额度
- 具体额度以平台公告为准

**付费额度**：
1. 进入"充值中心"
2. 选择充值金额
3. 支付方式：支付宝、微信支付、企业转账
4. 充值成功后立即可用

**计费标准**（参考）：
| 模型 | 价格（元/千 tokens） |
|------|---------------------|
| GLM-4 | 0.05 |
| GLM-3-Turbo | 0.01 |
| GLM-3-Flash | 0.005 |
| GLM-4V | 0.1 |

---

## 三、API 请求标准格式

### 1. 请求端点

**基础 URL**：
```
https://open.bigmodel.cn/api/paas/v4/chat/completions
```

### 2. 请求头（Headers）

```http
Content-Type: application/json
Authorization: Bearer {your_api_key}
```

### 3. 请求体（Request Body）

#### 标准请求格式
```json
{
  "model": "glm-4",
  "messages": [
    {
      "role": "system",
      "content": "你是一个专业的教育助手"
    },
    {
      "role": "user",
      "content": "请解释一下孟德尔遗传定律"
    }
  ],
  "temperature": 0.7,
  "top_p": 0.9,
  "max_tokens": 2000,
  "stream": false
}
```

#### 参数说明

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| model | string | 是 | 模型名称（glm-4、glm-3-turbo、glm-3-flash） |
| messages | array | 是 | 消息数组，按对话顺序排列 |
| temperature | number | 否 | 控制随机性（0.0-2.0），默认 0.7 |
| top_p | number | 否 | 核采样（0.0-1.0），默认 0.9 |
| max_tokens | number | 否 | 最大生成 token 数，默认 2048 |
| stream | boolean | 否 | 是否流式输出，默认 false |

#### 消息格式

**系统消息（system）**
```json
{
  "role": "system",
  "content": "你是一个专业的遗传学教育助手"
}
```

**用户消息（user）**
```json
{
  "role": "user",
  "content": "请解释孟德尔第一定律"
}
```

**助手消息（assistant）**
```json
{
  "role": "assistant",
  "content": "孟德尔第一定律，又称分离定律，是..."
}
```

### 4. 完整请求示例

#### cURL 示例
```bash
curl -X POST "https://open.bigmodel.cn/api/paas/v4/chat/completions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_api_key" \
  -d '{
    "model": "glm-4",
    "messages": [
      {
        "role": "system",
        "content": "你是一个专业的遗传学教育助手"
      },
      {
        "role": "user",
        "content": "请解释孟德尔第一定律"
      }
    ],
    "temperature": 0.7,
    "top_p": 0.9,
    "max_tokens": 2000
  }'
```

#### Node.js 示例
```typescript
import axios from 'axios';

interface GLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GLMRequest {
  model: string;
  messages: GLMMessage[];
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
  stream?: boolean;
}

interface GLMResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class GLMService {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
  }

  async chat(request: GLMRequest): Promise<GLMResponse> {
    const response = await axios.post<GLMResponse>(
      this.baseUrl,
      request,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        timeout: 30000,
      }
    );

    return response.data;
  }

  async generate(prompt: string, systemPrompt?: string): Promise<string> {
    const messages: GLMMessage[] = [];

    if (systemPrompt) {
      messages.push({
        role: 'system',
        content: systemPrompt,
      });
    }

    messages.push({
      role: 'user',
      content: prompt,
    });

    const response = await this.chat({
      model: 'glm-4',
      messages,
      temperature: 0.7,
      max_tokens: 2000,
    });

    return response.choices[0].message.content;
  }
}

// 使用示例
const glmService = new GLMService(process.env.GLM_API_KEY);

const response = await glmService.generate(
  '请解释孟德尔第一定律',
  '你是一个专业的遗传学教育助手'
);

console.log(response);
```

#### Python 示例
```python
import requests
import json
from typing import List, Dict, Optional

class GLMService:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://open.bigmodel.cn/api/paas/v4/chat/completions"

    def chat(
        self,
        model: str,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        top_p: float = 0.9,
        max_tokens: int = 2000,
        stream: bool = False,
    ) -> Dict:
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}",
        }

        data = {
            "model": model,
            "messages": messages,
            "temperature": temperature,
            "top_p": top_p,
            "max_tokens": max_tokens,
            "stream": stream,
        }

        response = requests.post(
            self.base_url,
            headers=headers,
            json=data,
            timeout=30
        )

        response.raise_for_status()
        return response.json()

    def generate(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        model: str = "glm-4"
    ) -> str:
        messages = []

        if system_prompt:
            messages.append({
                "role": "system",
                "content": system_prompt
            })

        messages.append({
            "role": "user",
            "content": prompt
        })

        response = self.chat(model, messages)
        return response["choices"][0]["message"]["content"]

# 使用示例
glm_service = GLMService(api_key="your_api_key")

response = glm_service.generate(
    prompt="请解释孟德尔第一定律",
    system_prompt="你是一个专业的遗传学教育助手",
    model="glm-4"
)

print(response)
```

---

## 四、API 响应标准格式

### 1. 成功响应

```json
{
  "id": "chat-123456789",
  "object": "chat.completion",
  "created": 1234567890,
  "model": "glm-4",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "孟德尔第一定律，又称分离定律，是遗传学的基本定律之一..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 150,
    "completion_tokens": 500,
    "total_tokens": 650
  }
}
```

### 2. 流式响应（stream: true）

**响应格式**：
```
data: {"id":"chat-123456789","object":"chat.completion.chunk","created":1234567890,"model":"glm-4","choices":[{"index":0,"delta":{"role":"assistant","content":"孟德尔"},"finish_reason":null}]}

data: {"id":"chat-123456789","object":"chat.completion.chunk","created":1234567890,"model":"glm-4","choices":[{"index":0,"delta":{"content":"第一"},"finish_reason":null}]}

data: {"id":"chat-123456789","object":"chat.completion.chunk","created":1234567890,"model":"glm-4","choices":[{"index":0,"delta":{"content":"定律"},"finish_reason":null}]}

data: [DONE]
```

#### Node.js 流式响应处理
```typescript
import axios from 'axios';
import { Readable } from 'stream';

async function chatStream(request: GLMRequest): Promise<AsyncIterable<string>> {
  const response = await axios.post<Readable>(
    this.baseUrl,
    { ...request, stream: true },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      responseType: 'stream',
    }
  );

  const stream = response.data;

  return (async function* () {
    for await (const chunk of stream) {
      const lines = chunk.toString().split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);

          if (data === '[DONE]') {
            return;
          }

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices[0]?.delta?.content;
            if (content) {
              yield content;
            }
          } catch (error) {
            // 忽略解析错误
          }
        }
      }
    }
  })();
}

// 使用示例
for await (const chunk of await chatStream({
  model: 'glm-4',
  messages: [{ role: 'user', content: '请解释孟德尔第一定律' }],
})) {
  process.stdout.write(chunk);
}
```

### 3. 错误响应

```json
{
  "error": {
    "code": "invalid_api_key",
    "message": "Invalid API key provided",
    "param": null,
    "type": "invalid_request_error"
  }
}
```

#### 常见错误码

| 错误码 | 说明 | 解决方案 |
|--------|------|----------|
| invalid_api_key | API Key 无效 | 检查 API Key 是否正确 |
| insufficient_quota | 额度不足 | 充值或等待额度恢复 |
| rate_limit_exceeded | 请求过于频繁 | 降低请求频率或升级套餐 |
| invalid_model | 模型名称错误 | 检查模型名称拼写 |
| context_length_exceeded | 上下文超长 | 减少 messages 数量或 max_tokens |
| server_error | 服务器错误 | 稍后重试 |

---

## 五、在 NestJS 中集成 GLM

### 1. 创建 GLM 服务模块

```typescript
// src/modules/llm/providers/glm.provider.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

interface GLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GLMConfig {
  apiKey: string;
  baseUrl?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

@Injectable()
export class GLMProvider {
  private client: AxiosInstance;
  private config: GLMConfig;

  constructor(private configService: ConfigService) {
    this.config = {
      apiKey: this.configService.get('GLM_API_KEY'),
      baseUrl: this.configService.get('GLM_BASE_URL', 'https://open.bigmodel.cn/api/paas/v4/chat/completions'),
      model: this.configService.get('GLM_MODEL', 'glm-4'),
      temperature: this.configService.get('GLM_TEMPERATURE', 0.7),
      maxTokens: this.configService.get('GLM_MAX_TOKENS', 2000),
    };

    this.client = axios.create({
      baseURL: this.config.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      timeout: 60000,
    });
  }

  async generate(prompt: string, systemPrompt?: string): Promise<string> {
    const messages: GLMMessage[] = [];

    if (systemPrompt) {
      messages.push({
        role: 'system',
        content: systemPrompt,
      });
    }

    messages.push({
      role: 'user',
      content: prompt,
    });

    const response = await this.client.post('', {
      model: this.config.model,
      messages,
      temperature: this.config.temperature,
      max_tokens: this.config.maxTokens,
    });

    return response.data.choices[0].message.content;
  }

  async generateStream(
    prompt: string,
    systemPrompt?: string,
  ): Promise<AsyncIterable<string>> {
    const messages: GLMMessage[] = [];

    if (systemPrompt) {
      messages.push({
        role: 'system',
        content: systemPrompt,
      });
    }

    messages.push({
      role: 'user',
      content: prompt,
    });

    const response = await this.client.post('', {
      model: this.config.model,
      messages,
      temperature: this.config.temperature,
      max_tokens: this.config.maxTokens,
      stream: true,
    }, {
      responseType: 'stream',
    });

    const stream = response.data;

    return (async function* () {
      for await (const chunk of stream) {
        const lines = chunk.toString().split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);

            if (data === '[DONE]') {
              return;
            }

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content;
              if (content) {
                yield content;
              }
            } catch (error) {
              // 忽略解析错误
            }
          }
        }
      }
    })();
  }

  async chat(messages: GLMMessage[]): Promise<string> {
    const response = await this.client.post('', {
      model: this.config.model,
      messages,
      temperature: this.config.temperature,
      max_tokens: this.config.maxTokens,
    });

    return response.data.choices[0].message.content;
  }
}
```

### 2. 创建 LLM 服务接口

```typescript
// src/modules/llm/interfaces/llm-provider.interface.ts
export interface LLMProvider {
  generate(prompt: string, systemPrompt?: string): Promise<string>;
  generateStream(prompt: string, systemPrompt?: string): Promise<AsyncIterable<string>>;
  chat(messages: Array<{ role: string; content: string }>): Promise<string>;
}
```

### 3. 创建 LLM 服务工厂

```typescript
// src/modules/llm/services/llm.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GLMProvider } from '../providers/glm.provider';
import { LLMProvider } from '../interfaces/llm-provider.interface';

@Injectable()
export class LLMService {
  private provider: LLMProvider;

  constructor(
    private configService: ConfigService,
    private glmProvider: GLMProvider,
  ) {
    const defaultProvider = this.configService.get('DEFAULT_LLM_PROVIDER', 'openai');

    switch (defaultProvider) {
      case 'glm':
        this.provider = glmProvider;
        break;
      default:
        this.provider = glmProvider;
    }
  }

  async generate(prompt: string, systemPrompt?: string): Promise<string> {
    return this.provider.generate(prompt, systemPrompt);
  }

  async generateStream(
    prompt: string,
    systemPrompt?: string,
  ): Promise<AsyncIterable<string>> {
    return this.provider.generateStream(prompt, systemPrompt);
  }

  async chat(messages: Array<{ role: string; content: string }>): Promise<string> {
    return this.provider.chat(messages);
  }
}
```

### 4. 环境变量配置

```bash
# .env
GLM_API_KEY=your_glm_api_key_here
GLM_BASE_URL=https://open.bigmodel.cn/api/paas/v4/chat/completions
GLM_MODEL=glm-4
GLM_TEMPERATURE=0.7
GLM_MAX_TOKENS=2000
DEFAULT_LLM_PROVIDER=glm
```

---

## 六、最佳实践

### 1. 错误处理

```typescript
async function safeGenerate(prompt: string): Promise<string | null> {
  try {
    return await glmService.generate(prompt);
  } catch (error) {
    if (error.response?.status === 401) {
      console.error('API Key 无效');
    } else if (error.response?.status === 429) {
      console.error('请求过于频繁，请稍后重试');
      // 实现重试逻辑
    } else {
      console.error('GLM API 调用失败:', error.message);
    }
    return null;
  }
}
```

### 2. 重试机制

```typescript
async function generateWithRetry(
  prompt: string,
  maxRetries: number = 3,
  delay: number = 1000,
): Promise<string> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await glmService.generate(prompt);
    } catch (error) {
      if (i === maxRetries - 1) {
        throw error;
      }

      if (error.response?.status === 429) {
        // 指数退避
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      } else {
        throw error;
      }
    }
  }
  throw new Error('Max retries exceeded');
}
```

### 3. Token 计数和限制

```typescript
function estimateTokens(text: string): number {
  // 简单估算：中文字符约 1.5 tokens，英文单词约 1 token
  const chineseChars = text.match(/[\u4e00-\u9fa5]/g)?.length || 0;
  const englishWords = text.match(/[a-zA-Z]+/g)?.length || 0;
  return Math.ceil(chineseChars * 1.5 + englishWords);
}

async function generateWithTokenLimit(
  prompt: string,
  maxTokens: number = 4000,
): Promise<string> {
  const promptTokens = estimateTokens(prompt);

  if (promptTokens > maxTokens) {
    throw new Error('提示词过长，超过 token 限制');
  }

  const maxCompletionTokens = maxTokens - promptTokens;

  return await glmService.generate(prompt, undefined, {
    max_tokens: maxCompletionTokens,
  });
}
```

### 4. 请求限流

```typescript
import pLimit from 'p-limit';

const limiter = pLimit(5); // 最多 5 个并发请求

async function batchGenerate(prompts: string[]): Promise<string[]> {
  const results = await Promise.all(
    prompts.map(prompt =>
      limiter(() => glmService.generate(prompt))
    )
  );

  return results;
}
```

---

## 七、监控和日志

### 1. 请求日志

```typescript
@Injectable()
export class GLMLoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body } = request;

    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: (response) => {
          const duration = Date.now() - startTime;
          console.log({
            type: 'GLM_API_REQUEST',
            method,
            url,
            model: body.model,
            promptTokens: body.messages?.reduce((sum: number, m: any) => sum + estimateTokens(m.content), 0),
            completionTokens: response.usage?.completion_tokens,
            duration,
            timestamp: new Date().toISOString(),
          });
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          console.error({
            type: 'GLM_API_ERROR',
            method,
            url,
            error: error.message,
            status: error.response?.status,
            duration,
            timestamp: new Date().toISOString(),
          });
        },
      }),
    );
  }
}
```

### 2. 使用统计

```typescript
@Injectable()
export class GLMUsageService {
  private usage = new Map<string, UsageStats>();

  recordUsage(model: string, tokens: number) {
    const stats = this.usage.get(model) || {
      totalRequests: 0,
      totalTokens: 0,
      lastUsed: new Date(),
    };

    stats.totalRequests++;
    stats.totalTokens += tokens;
    stats.lastUsed = new Date();

    this.usage.set(model, stats);
  }

  getUsage(model: string): UsageStats {
    return this.usage.get(model) || {
      totalRequests: 0,
      totalTokens: 0,
      lastUsed: new Date(),
    };
  }

  getAllUsage(): Map<string, UsageStats> {
    return this.usage;
  }

  calculateCost(model: string): number {
    const stats = this.getUsage(model);
    const pricePer1kTokens = this.getPricePer1kTokens(model);
    return (stats.totalTokens / 1000) * pricePer1kTokens;
  }

  private getPricePer1kTokens(model: string): number {
    const prices: Record<string, number> = {
      'glm-4': 0.05,
      'glm-3-turbo': 0.01,
      'glm-3-flash': 0.005,
    };
    return prices[model] || 0.05;
  }
}

interface UsageStats {
  totalRequests: number;
  totalTokens: number;
  lastUsed: Date;
}
```

---

## 八、常见问题

### Q1: 如何获取 GLM API Key？
A: 访问 https://open.bigmodel.cn/，注册并实名认证后，在"API Key 管理"页面创建。

### Q2: GLM API 有免费额度吗？
A: 新注册用户通常有免费额度，具体以平台公告为准。额度用完后需要充值。

### Q3: 如何处理 API 限流？
A: 实现重试机制和请求限流，使用指数退避策略。

### Q4: GLM 支持流式输出吗？
A: 支持，设置 `stream: true` 参数即可。

### Q5: 如何估算 token 消耗？
A: 中文字符约 1.5 tokens，英文单词约 1 token。可以使用 API 响应中的 `usage` 字段查看实际消耗。

### Q6: GLM 和 OpenAI API 兼容吗？
A: GLM API 兼容 OpenAI API 格式，可以很容易地切换。

---

## 九、联系方式

- **官网**: https://open.bigmodel.cn/
- **文档**: https://open.bigmodel.cn/dev/api
- **技术支持**: support@bigmodel.cn
- **社区**: https://github.com/THUDM

---

**总结**：本文档提供了 GLM 模型 API 的完整申请流程、请求和响应格式、代码集成示例、最佳实践等。按照这个文档，你可以轻松地在项目中集成和使用 GLM 模型。
