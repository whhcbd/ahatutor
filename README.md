# AhaTutor - 遗传学可视化交互解答平台

> 基于 AI 的遗传学学习平台，实现"自然语言输入 + AI理解 + 实时可视化 + 交互探索"，打造真正的"顿悟时刻"(Aha Moment)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB)](https://react.dev/)
[![NestJS](https://img.shields.io/badge/NestJS-10-E0234E)](https://nestjs.com/)

---

## 项目概述

**AhaTutor** 是一个创新的学科学习平台，通过六 Agent 协作流水线，将复杂的概念转化为：

- **可视化知识图谱** - 一眼看穿概念关系
- **生动学习叙事** - 故事化讲解，记忆深刻
- **智能题目生成** - 精准练习，举一反三
- **联网资源推荐** - 最新资讯，扩展视野

**MVP 学科**: 遗传学（含 89 个预置知识点）

---

## 快速开始

````bash
# 1. 安装依赖
pnpm install

# 2. 配置环境变量（见下方说明）

# 3. 启动开发服务器（同时启动前后端）
pnpm dev

访问 http://localhost:5173

**或分终端启动：**

```bash
# 终端1 - 后端 (端口 3001)
cd src/backend && pnpm start:dev

# 终端2 - 前端 (端口 5173)
cd src/frontend && pnpm dev
````

### 环境变量配置

复制根目录的 `.env.example` 为 `.env`，然后配置以下关键项：

```bash
# LLM 配置（至少配置一个）
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
DEEPSEEK_API_KEY=your_deepseek_api_key_here
GLM_API_KEY=your_glm_api_key_here
DEFAULT_LLM_PROVIDER=openai

# 图数据库（Neo4j）
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=ahatutor123

# 缓存（Redis）
REDIS_HOST=localhost
REDIS_PORT=6379

# 前端配置
VITE_API_BASE_URL=http://localhost:3001
```

---

## 核心功能

### 1. 速通模式

考前突击、快速复习、即时答疑

```
AI 出题 → 用户回答 → AI 判断 → 分级解析 → 继续下一题
```

**预置 89 个遗传学知识点**，涵盖：

- 经典遗传学（孟德尔定律、伴性遗传、连锁互换...）
- 分子遗传学（DNA复制、中心法则、表观遗传学...）
- 细胞遗传学（减数分裂、染色体结构...）
- 群体遗传学（哈代-温伯格定律、遗传漂变...）
- 基因工程（CRISPR-Cas9、基因治疗...）
- 遗传病相关（唐氏综合征、血友病、色盲...）

### 2. 深度模式

系统学习、深度研究、长期规划

```
用户输入："解释伴性遗传"
    ↓
反向递归分解："理解伴性遗传前需要先懂什么？"
    → 孟德尔定律、性染色体
    → 基因型/表型、分离定律
    → 基因概念、染色体基础 ✓
    ↓
从基础向上构建学习路径
```

### 3. 错题管理

- 拍照上传错题
- OCR 自动识别
- 举一反三变式练习
- 错题分类存储

### 4. 学情报告

- 日/周/专题报告
- 薄弱点分析
- 知识点掌握度雷达图

---

## 六 Agent 协作流水线

```
用户输入 "伴性遗传"
    ↓
┌─────────────────────────────────────────┐
│ Agent 1: ConceptAnalyzer                │
│ "这真正在问什么？"                        │
│ → 结构化概念分析                          │
└──────────────┬──────────────────────────┘
               ↓
┌─────────────────────────────────────────┐
│ Agent 2: PrerequisiteExplorer           │
│ "理解这个前需要先懂什么？"                 │
│ → 遗传学知识树                           │
└──────────────┬──────────────────────────┘
               ↓
┌─────────────────────────────────────────┐
│ Agent 3: GeneticsEnricher               │
│ "精确的遗传学原理是什么？"                 │
│ → 公式、定律、实验、例子                   │
└──────────────┬──────────────────────────┘
               ↓
┌─────────────────────────────────────────┐
│ Agent 4: VisualDesigner                 │
│ "如何展示这个概念？"                       │
│ → 知识图谱、动画设计                       │
└──────────────┬──────────────────────────┘
               ↓
┌─────────────────────────────────────────┐
│ Agent 5: NarrativeComposer              │
│ "连接这些概念的故事是什么？"               │
│ → 学习路径、讲解顺序                       │
└──────────────┬──────────────────────────┘
               ↓
┌─────────────────────────────────────────┐
│ Agent 6: QuizGenerator                  │
│ "如何生成题目和评估？"                    │
│ → 选择题、填空题、分级解析                 │
└──────────────┬──────────────────────────┘
               ↓
         完整的学习体验
```

---

## 技术栈

| 层级       | 技术                                                                                |
| ---------- | ----------------------------------------------------------------------------------- |
| **前端**   | React 18, TypeScript 5.5, Vite 5, TailwindCSS, D3.js, ECharts, Framer Motion, KaTeX |
| **后端**   | NestJS 10, TypeScript 5.5                                                           |
| **AI**     | OpenAI (GPT-4), Claude, DeepSeek, GLM (智谱 AI)                                     |
| **数据库** | Neo4j (知识图谱), Pinecone/Weaviate (向量检索), Redis (缓存), PostgreSQL (关系数据) |
| **存储**   | MinIO (对象存储)                                                                    |

---

## 项目结构

```
ahatutor/
├── src/
│   ├── frontend/                    # React 前端
│   │   └── src/
│   │       ├── api/                 # API 客户端
│   │       ├── components/          # 组件
│   │       │   ├── Layout/          # 布局
│   │       │   └── Visualization/   # 可视化组件
│   │       ├── data/                # 数据文件
│   │       │   └── genetics-topics.ts  # 89个遗传学知识点
│   │       ├── pages/               # 页面
│   │       │   ├── HomePage.tsx     # 首页
│   │       │   ├── SpeedModePage.tsx    # 速通模式
│   │       │   ├── DepthModePage.tsx    # 深度模式
│   │       │   ├── MistakeBookPage.tsx  # 错题本
│   │       │   └── ReportPage.tsx       # 学情报告
│   │       └── utils/               # 工具函数
│   │
│   ├── backend/                     # NestJS 后端
│   │   └── src/
│   │       ├── modules/
│   │       │   ├── agents/          # 六 Agent 流水线
│   │       │   │   ├── skills/      # 联网搜索、资源推荐
│   │       │   │   └── data/        # 可视化数据
│   │       │   ├── knowledge-base/  # 遗传学知识库
│   │       │   │   └── data/        # 8个领域知识数据
│   │       │   ├── knowledge-graph/ # 知识图谱 (Neo4j)
│   │       │   ├── llm/             # LLM 多管道
│   │       │   │   └── providers/   # 4个LLM适配器
│   │       │   ├── rag/             # 检索增强生成
│   │       │   ├── mistake/         # 错题管理
│   │       │   └── report/          # 学情报告
│   │       └── shared/              # 配置
│   │
│   └── shared/                      # 前后端共享
│       ├── types/                   # 类型定义
│       │   ├── agent.types.ts
│       │   ├── genetics.types.ts
│       │   └── ...
│       └── constants/
│
├── prompts/                         # AI 提示词模板
├── data/                            # 数据存储
├── docker-compose.yml
└── package.json
```

---

## API 接口

### Agent 流水线

```bash
# 完整流水线
POST /agent/pipeline
{ "concept": "伴性遗传", "userLevel": "intermediate" }

# 快速分析
GET /agent/quick?concept=伴性遗传

# 可视化设计
POST /agent/visualize

# 学习叙事
POST /agent/narrative
```

### 知识图谱

```bash
# 获取概念关系
GET /graph/nodes?concept=伴性遗传

# 学习路径
GET /graph/path?from=基因&to=伴性遗传
```

### 题目生成

```bash
# 生成题目
POST /quiz/generate
{ "topic": "孟德尔第一定律", "difficulty": "medium" }

# 评估答案
POST /quiz/evaluate
{ "question": "...", "userAnswer": "A" }
```

---

## 开发命令

```bash
# 开发
pnpm dev              # 同时启动前后端
pnpm dev:frontend     # 仅前端
pnpm dev:backend      # 仅后端

# 构建
pnpm build

# 代码检查
pnpm lint

# 测试
pnpm test
```

---

## 开发路线图

### Phase 1: 核心功能 (已完成 75%)

- [x] 项目基础架构 (Monorepo, Docker, 环境配置)
- [x] 前端基础 (React + Vite + TailwindCSS)
- [x] 后端基础 (NestJS + TypeScript)
- [x] LLM 多管道架构 (OpenAI/Claude/DeepSeek/GLM)
- [x] 六 Agent 流水线 (4/6 完成)
  - [x] Agent 1: ConceptAnalyzer - 概念分析
  - [x] Agent 2: PrerequisiteExplorer - 前置知识探索
  - [x] Agent 3: GeneticsEnricher - 遗传学知识丰富
  - [ ] Agent 4: VisualDesigner - 可视化设计
  - [ ] Agent 5: NarrativeComposer - 叙事作曲
  - [x] Agent 6: QuizGenerator - 题目生成
- [x] 遗传学知识库 (8个领域, 89个知识点)
- [x] Prompt 模板库 (7个模板)
- [x] 共享类型定义

### Phase 2: 优化 (进行中)

- [x] 前端页面完善 (速通模式UI + 交互逻辑)
- [x] 性能优化 (代码分割、懒加载、React Query缓存)
- [x] 错误处理优化 (ErrorBoundary, Toast通知系统)
- [x] UI 组件库 (Button, Card, Modal, Loading等)

### Phase 3: 高级功能 (计划中)

- [ ] RAG 服务 (文档上传、解析、向量化、检索)
- [ ] 知识图谱服务 (Neo4j集成、路径查找、D3可视化)
- [ ] 错题管理 (OCR识别、举一反三、错题本)
- [ ] 学情报告 (数据分析、图表生成、雷达图)
- [ ] 用户认证系统 (JWT、权限管理)
- [ ] 学习进度持久化 (数据库集成)

---

## 项目文档

- [开发指南](docs/development-guide.md) - 详细的开发规范和 API 设计
- [项目进度](docs/project-progress.md) - 当前进度和下一步计划
- [Agent 实现要求](agent-implementation-requirements.md) - Agent 实现规范

## 贡献指南

欢迎贡献！请遵循以下步骤：

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交变更 (`git commit -m 'feat: add some amazing feature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

### 提交规范

```
feat: 新功能
fix: 修复
docs: 文档
style: 格式
refactor: 重构
test: 测试
chore: 构建
```

## 常见问题

### Q: 如何添加新的遗传学知识点？

A: 在 `src/backend/src/modules/knowledge-base/data/` 下添加对应领域的数据文件，并在 `knowledge-base.service.ts` 中导入。

### Q: 如何添加新的 LLM 提供商？

A: 在 `src/backend/src/modules/llm/providers/` 下创建新的 provider 类，实现统一的 LLM 接口。

### Q: Docker 服务启动失败怎么办？

A: 检查端口占用情况，确保 3001、5173、6379、7687、5432 等端口未被占用。

### Q: 如何联系维护者？

A: 请提交 Issue 或发送邮件至项目维护者。

## 许可证

MIT License

---

**让每一次学习都成为"顿悟时刻"**
