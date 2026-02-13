# AhaTutor LLM API Key 使用说明

## 概览

AhaTutor 支持多个 LLM 提供商，所有 API Key 均通过环境变量配置，确保安全性和灵活性。

---

## 一、LLM 提供商配置

### 1. OpenAI

| 环境变量 | 用途 | 默认值 | 必需 |
|----------|------|--------|------|
| `OPENAI_API_KEY` | OpenAI API 认证 | - | 是 |
| `OPENAI_MODEL` | 聊天模型 | `gpt-4` | 否 |
| `OPENAI_EMBEDDING_MODEL` | 嵌入模型 | `text-embedding-3-small` | 否 |

**功能支持：** Chat、Embedding、Vision

**配置文件位置：** `src/backend/src/modules/llm/providers/openai.provider.ts`

---

### 2. Anthropic Claude

| 环境变量 | 用途 | 默认值 | 必需 |
|----------|------|--------|------|
| `ANTHROPIC_API_KEY` | Anthropic API 认证 | - | 是 |
| `ANTHROPIC_MODEL` | 聊天模型 | `claude-3-5-sonnet-20241022` | 否 |

**功能支持：** Chat、Vision

**配置文件位置：** `src/backend/src/modules/llm/providers/claude.provider.ts`

---

### 3. DeepSeek（国产）

| 环境变量 | 用途 | 默认值 | 必需 |
|----------|------|--------|------|
| `DEEPSEEK_API_KEY` | DeepSeek API 认证 | - | 是 |
| `DEEPSEEK_BASE_URL` | API 端点 | `https://api.deepseek.com` | 否 |
| `DEEPSEEK_MODEL` | 聊天模型 | `deepseek-chat` | 否 |

**功能支持：** Chat

**配置文件位置：** `src/backend/src/modules/llm/providers/deepseek.provider.ts`

---

### 4. GLM 智谱 AI（国产）

| 环境变量 | 用途 | 默认值 | 必需 |
|----------|------|--------|------|
| `GLM_API_KEY` | GLM API 认证 | - | 是 |
| `GLM_BASE_URL` | API 端点 | `https://open.bigmodel.cn/api/paas/v4` | 否 |
| `GLM_MODEL` | 聊天模型 | `glm-4-flash` | 否 |
| `GLM_EMBEDDING_MODEL` | 嵌入模型 | `embedding-2` | 否 |
| `GLM_VISION_MODEL` | 视觉模型 | `glm-4v` | 否 |

**功能支持：** Chat、Embedding、Vision

**配置文件位置：** `src/backend/src/modules/llm/providers/glm.provider.ts`

---

### 5. Mock Provider（开发测试）

| 环境变量 | 用途 | 默认值 | 必需 |
|----------|------|--------|------|
| `DEFAULT_LLM_PROVIDER` | 默认提供商 | `mock` | 否 |

**功能支持：** Chat、Embedding（模拟响应）

**配置文件位置：** `src/backend/src/modules/llm/providers/mock.provider.ts`

**说明：** Mock Provider 不需要 API Key，用于开发测试环境。

---

## 二、通用配置

| 环境变量 | 用途 | 默认值 | 说明 |
|----------|------|--------|------|
| `DEFAULT_LLM_PROVIDER` | 默认 LLM 提供商 | `mock` | 可选值：`openai`、`claude`、`deepseek`、`glm`、`mock` |

**配置文件位置：** `src/backend/src/modules/llm/llm.service.ts`

---

## 三、搜索服务 API Key（额外功能）

### Web Search Service

| 环境变量 | 用途 | 默认值 | 必需 |
|----------|------|--------|------|
| `TAVILY_API_KEY` | Tavily 搜索 API Key | - | 可选 |
| `BING_API_KEY` | Bing 搜索 API Key | - | 可选 |
| `SERPAPI_API_KEY` | SerpAPI 搜索 API Key | - | 可选 |
| `SERPAPI_ENGINE` | SerpAPI 搜索引擎 | `google` | 否 |
| `WEB_SEARCH_PROVIDER` | 默认搜索提供商 | `mock` | 否 |

**配置文件位置：** `src/backend/src/modules/agents/skills/web-search.service.ts`

---

## 四、环境变量配置示例

### `.env` 文件模板

```bash
# ==================== LLM 配置（至少配置一个）====================

# OpenAI 配置
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4
OPENAI_EMBEDDING_MODEL=text-embedding-3-small

# Anthropic Claude 配置
ANTHROPIC_API_KEY=your_anthropic_api_key_here
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022

# DeepSeek 配置（国产模型）
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-chat

# GLM 配置（智谱 AI）
GLM_API_KEY=your_glm_api_key_here
GLM_BASE_URL=https://open.bigmodel.cn/api/paas/v4
GLM_MODEL=glm-4-flash
GLM_EMBEDDING_MODEL=embedding-2
GLM_VISION_MODEL=glm-4v

# 默认 LLM 提供商
DEFAULT_LLM_PROVIDER=glm

# ==================== 搜索服务配置（可选）====================

# Tavily 搜索
TAVILY_API_KEY=your_tavily_api_key_here

# Bing 搜索
BING_API_KEY=your_bing_api_key_here

# SerpAPI 搜索
SERPAPI_API_KEY=your_serpapi_api_key_here
SERPAPI_ENGINE=google
WEB_SEARCH_PROVIDER=mock
```

---

## 五、API Key 获取方式

| 提供商 | 获取地址 | 说明 |
|--------|----------|------|
| OpenAI | https://platform.openai.com/api-keys | 需要国外信用卡 |
| Anthropic | https://console.anthropic.com/settings/keys | 需要国外信用卡 |
| DeepSeek | https://platform.deepseek.com/ | 国产模型，支持国内支付 |
| GLM 智谱 | https://open.bigmodel.cn/ | 国产模型，支持国内支付 |
| Tavily | https://tavily.com/ | 搜索 API，有免费额度 |
| Bing | https://www.microsoft.com/en-us/bing/apis/bing-web-search-api | 需要 Azure 账户 |
| SerpAPI | https://serpapi.com/ | 搜索 API，有免费额度 |

---

## 六、代码中使用 API Key 的位置

```
src/backend/src/modules/llm/
├── llm.service.ts           # LLM 服务入口，读取 DEFAULT_LLM_PROVIDER
├── providers/
│   ├── openai.provider.ts    # 读取 OPENAI_API_KEY, OPENAI_MODEL
│   ├── claude.provider.ts    # 读取 ANTHROPIC_API_KEY, ANTHROPIC_MODEL
│   ├── deepseek.provider.ts  # 读取 DEEPSEEK_API_KEY, DEEPSEEK_MODEL
│   ├── glm.provider.ts       # 读取 GLM_API_KEY, GLM_MODEL, GLM_EMBEDDING_MODEL
│   └── mock.provider.ts     # 无需 API Key，开发测试用
```

```
src/backend/src/modules/agents/skills/
└── web-search.service.ts    # 读取 TAVILY_API_KEY, BING_API_KEY, SERPAPI_API_KEY
```

---

## 七、安全注意事项

1. **不要提交 `.env` 文件到版本控制系统**
   - `.env` 文件已在 `.gitignore` 中

2. **使用 `.env.example` 作为配置模板**
   - 只包含变量名和示例值，不包含真实 Key

3. **生产环境使用环境变量**
   - 将 API Key 配置在服务器环境变量中

4. **定期轮换 API Key**
   - 定期更换 API Key 以提高安全性

5. **限制 API Key 权限**
   - 为不同的环境使用不同的 Key

---

## 八、快速开始

### 开发环境（使用 Mock Provider）

无需配置任何 API Key，默认使用 Mock Provider：

```bash
# 后端已自动使用 mock provider
cd src/backend
pnpm start:dev
```

### 生产环境（使用真实 API Key）

```bash
# 复制配置模板
cp .env.example .env

# 编辑 .env 文件，添加你的 API Key
# 设置 DEFAULT_LLM_PROVIDER 为你选择的提供商

# 启动服务
cd src/backend
pnpm start:dev
```

---

## 九、故障排查

| 问题 | 解决方案 |
|------|----------|
| API 请求超时 | 检查 API Key 是否正确，或切换到 Mock Provider |
| "API Key not set" 警告 | 检查 `.env` 文件是否正确配置 |
| 嵌入请求失败 | OpenAI、GLM 支持嵌入，Claude、DeepSeek 会回退到 OpenAI |
| 搜索功能不可用 | 配置对应的搜索 API Key 或使用 Mock 模式 |
