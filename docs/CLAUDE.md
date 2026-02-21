# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在此代码库中工作时提供指导。

## 项目概述

AhaTutor 是一个基于 AI 的高等数学辅导系统，结合了 RAG（检索增强生成）和交互式 UI 组件。系统通过对话式交互提供数学辅导，并使用 A2UI 协议生成可视化、可交互的元素。

**技术栈：**
- 后端：FastAPI + LangChain + ChromaDB（向量数据库）
- 前端：Vue 3 + Vite + Pinia
- LLM：支持 OpenAI 兼容 API 和 Google Gemini（官方 API）
- 嵌入模型：HuggingFace text2vec-base-chinese 或 OpenAI embeddings

## 开发命令

### 后端设置和运行

```bash
# 进入后端目录
cd backend

# 创建虚拟环境（仅首次）
python -m venv venv

# 激活虚拟环境
# Windows:
venv\Scripts\activate.bat
# Unix/Mac:
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入你的 API 密钥

# 运行后端服务器
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# 访问 API 文档
# http://localhost:8000/docs
```

### 前端设置和运行

```bash
# 开发版前端（简单 UI）
cd frontend
npm install
npm run dev
# 访问 http://localhost:5173

# 生产版前端（Gemini 风格 UI，支持 A2UI）
cd production-frontend
npm install
npm run dev
# 访问 http://localhost:5173
```

### 快速启动（同时启动两个服务）

```bash
# Windows:
start.bat

# Unix/Mac:
./start.sh
```

## 架构设计

### 后端架构

**核心服务：**
- `app/services/rag_service.py` - 主要 RAG 逻辑，包含多轮对话、流式输出、层次化索引（L1/L2/L3）和 A2UI 协议支持
- `app/services/router_service.py` - 智能路由，决定何时使用 RAG 或直接调用 LLM
- `app/services/cache_service.py` - 性能优化，包含嵌入/检索/重写缓存
- `app/services/conversation_service.py` - 多轮对话管理
- `app/services/message_service.py` - 消息历史持久化
- `app/services/lock_service.py` - 会话级并发控制

**API 端点：**
- `/api/chat` - 主要聊天端点（支持单轮和多轮对话）
- `/api/chat/stream` - 流式聊天，使用 SSE（Server-Sent Events）
- `/api/upload` - 上传教材（PDF 或 Markdown）
- `/api/sessions/*` - 多轮对话的会话管理

**核心特性：**
1. **层次化向量索引**：三层索引（L1：章节级，L2：语义单元级，L3：精细片段级）以提升检索效果
2. **智能路由**：根据查询复杂度和对话上下文自动决定是否使用 RAG
3. **查询重写**：解决多轮对话中的指代消解问题
4. **缓存机制**：三层缓存（嵌入、查询重写、检索结果）提升性能
5. **A2UI 协议**：在回复中生成交互式 UI 组件（按钮、输入框、卡片等）

### 前端架构

**两个前端实现：**

1. **frontend/** - 基础 Vue 3 应用，用于开发/测试
   - 简单的消息列表 UI
   - Markdown + KaTeX 渲染
   - 基础聊天功能

2. **production-frontend/** - 生产级 Gemini 风格 UI
   - 现代化、精致的界面，灵感来自 Google Gemini
   - 完整的 A2UI 组件渲染支持
   - 会话管理
   - 流式响应显示
   - 使用 Pinia 进行状态管理

**A2UI 协议：**
系统使用 A2UI（自适应代理 UI）在聊天回复中生成交互式组件。组件在 `<a2ui_surface>` 标签内以 JSON 格式定义，包括：
- Card、Paper、Box 容器
- Text、Code、Badge 显示元素
- Button、NumberInput 交互元素
- Group 布局组件

### 数据库结构

**SQLite 数据库**（`data/conversations.db`）：
- `conversations` - 会话元数据（id、title、created_at、updated_at）
- `messages` - 消息历史（id、conversation_id、role、parts 为 JSON、timestamp）

### 向量数据库

**ChromaDB** 包含三个独立的集合：
- `vector_db_l1/` - 章节级块（2500 字符，200 重叠）
- `vector_db_l2/` - 语义单元级块（1000 字符，150 重叠）
- `vector_db/`（L3）- 精细片段级块（500 字符，100 重叠）

## 配置说明

### 环境变量（.env）

**必需配置：**
- `API_PROVIDER` - "relay"（OpenAI 兼容）或 "official"（Gemini）
- `OPENAI_API_KEY` / `GEMINI_API_KEY` - LLM API 密钥
- `OPENAI_BASE_URL` - API 端点（中转站模式使用）
- `LLM_MODEL` - 模型名称（如 "gpt-3.5-turbo"、"gemini-2.0-flash-exp"）

**可选配置：**
- `EMBEDDING_MODEL` - HuggingFace 模型（默认："shibing624/text2vec-base-chinese"）
- `USE_OPENAI_EMBEDDINGS` - 使用 OpenAI 嵌入模型而非本地模型
- `ENABLE_MULTI_TURN` - 启用多轮对话支持（默认：true）
- `ENABLE_*_CACHE` - 启用各种缓存层（默认：true）
- `*_CACHE_SIZE` / `*_CACHE_TTL` - 缓存配置

### 聊天模式

- **quick**（速通模式）- 快速、简洁的回答（检索 3 个结果）
- **deep**（深度模式）- 详细的解释和推导过程（检索 5 个结果）

### 智能路由

当 `enable_router=true` 时，系统自动决定：
- **direct** - 简单问题直接回答，不使用 RAG
- **context_only** - 追问类问题仅使用对话历史
- **rag** - 复杂问题需要检索教材内容

## 重要实现细节

### 多轮对话流程

1. 客户端通过 `/api/sessions` 创建会话
2. 客户端发送消息时携带 `session_id` 到 `/api/chat` 或 `/api/chat/stream`
3. 后端从数据库加载对话历史
4. 系统应用查询重写解决指代问题（如 "它" → "导数"）
5. 根据路由决策执行 RAG 检索或直接调用 LLM
6. 响应保存到数据库，使用会话锁进行并发控制

### 流式响应格式

SSE 事件使用 JSON 格式：
```json
{"type": "chunk", "content": "文本片段"}
{"type": "done", "sources": [...], "role": "model"}
{"type": "error", "message": "错误描述"}
```

### A2UI 响应结构

响应包含两部分：
1. 自然语言解释（Markdown 格式，支持 LaTeX 公式）
2. 交互式 UI（`<a2ui_surface>` 标签内的 JSON）

示例：
```
导数的定义是...

<a2ui_surface>[{"beginRendering":{"surfaceId":"quiz1","root":"card"}},{"surfaceUpdate":{"surfaceId":"quiz1","components":[...]}}]</a2ui_surface>
```

### 文档加载

- **PDF**：通过 PyPDFLoader 加载，带元数据分块
- **Markdown**：通过 TextLoader 加载，支持批量目录加载
- **层次化索引**：使用 `/api/upload` 自动构建 L1/L2/L3 索引

### 元数据增强

每个文本块包含：
- `content_type` - definition（定义）、theorem（定理）、example（例题）、proof（证明）、exercise（习题）、general（一般）
- `file_category` - content（正文）、exercise（习题）、answer（答案）
- `has_formula` - 布尔值，表示是否包含 LaTeX 公式
- `level` - L1、L2 或 L3（层次化索引级别）
- `textbook`、`chapter`、`source` - 文档元数据

## 常见开发任务

### 添加新的 API 端点

1. 在 `backend/app/api/chat.py` 中定义路由，或创建新的路由文件
2. 添加 Pydantic 模型用于请求/响应验证
3. 在相应的服务文件中实现业务逻辑
4. 如果创建了新文件，在 `backend/app/main.py` 中注册路由

### 修改 RAG 行为

- **检索逻辑**：编辑 `rag_service.py` 中的方法，如 `search_similar()`、`hybrid_search()`
- **提示词工程**：修改 `rag_service.py` 中的 `_build_a2ui_system_prompt()`
- **分块策略**：调整 `CHUNK_CONFIG` 字典或 `RecursiveCharacterTextSplitter` 参数

### 添加前端组件

- **基础组件**：添加到 `production-frontend/src/components/base/`
- **功能组件**：添加到 `production-frontend/src/components/features/`
- **A2UI 渲染器**：扩展 `MessageItem.vue` 组件的渲染逻辑

### 测试流式响应

使用生产版前端或用 curl 测试：
```bash
curl -N -X POST http://localhost:8000/api/chat/stream \
  -H "Content-Type: application/json" \
  -d '{"message":"什么是导数","mode":"quick"}'
```

## 故障排查

### 后端无法启动
- 检查虚拟环境是否已激活
- 验证 `.env` 文件是否存在且包含有效的 API 密钥
- 确保端口 8000 未被占用

### 前端构建错误
- 删除 `node_modules` 和 `package-lock.json`，重新安装
- 检查 Node.js 版本兼容性（需要 Node 16+）

### RAG 无返回结果
- 验证向量数据库是否存在于 `backend/vector_db/`
- 检查是否已通过 `/api/upload` 上传教材
- 通过 API 文档检查 ChromaDB 集合数量

### 流式输出不工作
- 确保设置了 `Content-Type: text/event-stream` 头
- 检查 `backend/app/main.py` 中的 CORS 配置
- 验证客户端是否正确处理 SSE 格式

### 会话冲突（409 错误）
- 会话被另一个请求锁定
- 等待前一个请求完成或实现重试逻辑
- 检查 `session_lock_manager` 超时设置
