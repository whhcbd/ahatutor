# AhaTutor - 遗传学可视化交互解答平台

> 基于 AI 的遗传学学习平台，实现"自然语言输入 + AI理解 + 实时可视化 + 交互探索"，打造真正的"顿悟时刻"(Aha Moment)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB)](https://react.dev/)
[![NestJS](https://img.shields.io/badge/NestJS-10-E0234E)](https://nestjs.com/)

---

## 项目概述

**AhaTutor** 是一个创新的学科学习平台，通过六 Agent 协作流水线，将复杂的概念转化为：

- **可视化知识图谱** - 一眼看穿概念关系
- **生动学习叙事** - 故事化讲解，记忆深刻
- **智能题目生成** - 精准练习，举一反三
- **联网资源推荐** - 最新资讯，扩展视野
- **交互式可视化** - 实时操作，加深理解

**MVP 学科**: 遗传学（含 89 个预置知识点）

---

## 快速开始

```bash
# 1. 安装依赖
pnpm install

# 2. 配置环境变量（见下方说明）

# 3. 启动开发服务器（同时启动前后端）
pnpm dev

访问 http://localhost:5173
```

**或分终端启动：**

```bash
# 终端1 - 后端 (端口 3001)
cd src/backend && pnpm start:dev

# 终端2 - 前端 (端口 5173)
cd src/frontend && pnpm dev
```

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

# 向量数据库（二选一）
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=ahatutor
# 或
WEAVIATE_URL=http://localhost:8080
WEAVIATE_API_KEY=your_weaviate_api_key

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

### 3. 交互式可视化

- **庞氏方格** - 交互式杂交实验模拟
- **遗传路径** - 多代遗传追踪可视化
- **减数分裂动画** - 分步演示减数分裂过程 (✅ 已实现)
- **染色体行为** - 染色体在减数分裂中的动态展示 (✅ 已实现)

### 4. 错题管理

- 拍照上传错题
- OCR 自动识别
- 举一反三变式练习
- 错题分类存储

### 5. 学情报告

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

| 层级         | 技术                                                                                |
| ------------ | ----------------------------------------------------------------------------------- |
| **前端**     | React 18, TypeScript 5.9, Vite 5, TailwindCSS, D3.js, ECharts, Framer Motion, KaTeX |
| **后端**     | NestJS 10, TypeScript 5.9                                                           |
| **AI**       | OpenAI (GPT-4), Claude, DeepSeek, GLM (智谱 AI)                                     |
| **数据库**   | Neo4j (知识图谱), Pinecone/Weaviate (向量检索), Redis (缓存), PostgreSQL (关系数据) |
| **存储**     | MinIO (对象存储)                                                                    |
| **代码质量** | ESLint, Prettier, TypeScript Strict Mode                                            |

---

## 项目结构

```
ahatutor/
├── src/
│   ├── frontend/                    # React 前端
│   │   ├── .eslintrc.json          # ESLint 配置
│   │   ├── vite.config.ts          # Vite 配置
│   │   └── src/
│   │       ├── api/                 # API 客户端
│   │       ├── components/          # 组件
│   │       │   ├── Layout/          # 布局
│   │       │   ├── Visualization/   # 可视化组件
│   │       │   │   ├── KnowledgeGraph.tsx
│   │       │   │   ├── VisualDesignerView.tsx
│   │       │   │   └── NarrativeComposerView.tsx
│   │       │   └── ui/              # UI 组件
│   │       │       ├── Button.tsx, Card.tsx, Modal.tsx
│   │       │       ├── Toast.tsx, toast.store.ts, toast.utils.ts
│   │       │       └── index.ts    # 统一导出
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
│   │   ├── .eslintrc.json          # ESLint 配置
│   │   └── src/
│   │       ├── modules/
│   │       │   ├── agents/          # 六 Agent 流水线
│   │       │   │   ├── skills/      # 技能服务
│   │       │   │   │   ├── web-search.service.ts
│   │       │   │   │   ├── resource-recommend.service.ts
│   │       │   │   │   ├── visualization-generator.service.ts
│   │       │   │   │   ├── genetics-visualization.service.ts
│   │       │   │   │   └── interactive-control.service.ts
│   │       │   │   └── data/        # 可视化数据
│   │       │   ├── knowledge-base/  # 遗传学知识库
│   │       │   │   └── data/        # 8个领域知识数据
│   │       │   ├── knowledge-graph/ # 知识图谱 (Neo4j)
│   │       │   ├── llm/             # LLM 多管道
│   │       │   │   └── providers/   # 4个LLM适配器
│   │       │   ├── rag/             # 检索增强生成
│   │       │   │   └── services/    # RAG 服务
│   │       │   ├── mistake/         # 错题管理
│   │       │   └── report/          # 学情报告
│   │       └── shared/              # 配置
│   │
│   └── shared/                      # 前后端共享
│       ├── types/                   # 类型定义
│       │   ├── agent.types.ts      # Agent 相关类型
│       │   ├── skill.types.ts      # Skill 相关类型
│       │   ├── genetics.types.ts   # 遗传学类型
│       │   ├── knowledge-tree.types.ts  # 知识树类型
│       │   └── rag.types.ts        # RAG 类型
│       └── constants/
│           └── index.ts             # 常量导出
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

### 技能服务

```bash
# 可视化生成 - 自动推荐可视化类型
POST /agent/skills/visualization/generate
{
  "concept": "孟德尔第一定律",
  "userLevel": "intermediate",
  "focusAreas": ["原理", "例子"]
}

# 遗传学可视化 - 生成遗传学专用可视化
POST /agent/skills/visualization/genetics
{
  "type": "punnett_square",
  "concept": "伴性遗传",
  "parameters": {
    "parent1Genotypes": ["X^A X^a"],
    "parent2Genotypes": ["X^A Y"]
  }
}

# 交互控制 - 控制可视化播放/暂停/步骤
POST /agent/skills/visualization/control
{
  "config": {...},
  "action": "play",
  "step": 2
}
```

### RAG 服务

```bash
# 向量检索
POST /agent/skills/rag/retrieve
{
  "query": "什么是孟德尔分离定律？",
  "topK": 5,
  "filters": { "topic": "遗传学" }
}

# 上下文检索（多轮对话）
POST /agent/skills/rag/context
{
  "currentQuery": "这个定律有什么例外吗？",
  "conversationHistory": [...],
  "previousContext": [...],
  "topK": 3
}

# 流式答案生成
POST /agent/skills/rag/stream
{
  "query": "解释分离定律",
  "context": [...],
  "conversationHistory": [...],
  "mode": "answer",
  "style": "detailed"
}
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
pnpm build:frontend   # 仅前端
pnpm build:backend    # 仅后端
pnpm build:shared     # 仅共享类型

# 代码检查
pnpm lint             # 检查所有
pnpm lint:frontend    # 仅前端
pnpm lint:backend     # 仅后端

# 类型检查
pnpm typecheck        # 检查所有
pnpm typecheck:frontend   # 仅前端
pnpm typecheck:backend    # 仅后端

# 测试
pnpm test
```

---

## 代码质量

项目已配置完整的代码质量检查工具：

### ESLint

- 前端配置: `src/frontend/.eslintrc.json` - React + TypeScript 规则
- 后端配置: `src/backend/.eslintrc.json` - NestJS + TypeScript 规则
- 检查命令: `pnpm lint`

### TypeScript

- 严格模式启用
- 共享类型定义: `src/shared/types/`
- 类型检查命令: `pnpm typecheck`

### 代码规范

- 组件统一导出: `src/frontend/src/components/ui/index.ts`
- 类型统一导出: `src/shared/index.ts`
- 移除重复代码和未使用的导入

---

## 开发路线图

### Phase 1: 核心功能 (已完成 90%)

- [x] 项目基础架构 (Monorepo, Docker, 环境配置)
- [x] 前端基础 (React + Vite + TailwindCSS)
- [x] 后端基础 (NestJS + TypeScript)
- [x] LLM 多管道架构 (OpenAI/Claude/DeepSeek/GLM)
- [x] 六 Agent 流水线 (6/6 完成)
  - [x] Agent 1: ConceptAnalyzer - 概念分析
  - [x] Agent 2: PrerequisiteExplorer - 前置知识探索
  - [x] Agent 3: GeneticsEnricher - 遗传学知识丰富
  - [x] Agent 4: VisualDesigner - 可视化设计
  - [x] Agent 5: NarrativeComposer - 叙事作曲
  - [x] Agent 6: QuizGenerator - 题目生成
- [x] 遗传学知识库 (8个领域, 89个知识点)
- [x] Prompt 模板库 (7个模板)
- [x] 共享类型定义
- [x] 技能服务框架

### Phase 2: 优化 (已完成 98%)

- [x] 前端页面完善 (速通模式UI + 交互逻辑)
- [x] 性能优化 (代码分割、懒加载、React Query缓存)
- [x] 错误处理优化 (ErrorBoundary, Toast通知系统)
- [x] UI 组件库 (Button, Card, Modal, Loading等)
- [x] TypeScript 类型检查修复
- [x] ESLint 配置和代码质量优化
- [x] Toast 组件模块化重构
- [x] 减数分裂动画组件 (分步展示9个阶段)
- [x] 染色体行为组件 (展示分离/重组/自由组合)

### Phase 3: 高级功能 (进行中 65%)

- [x] RAG 服务架构 (文档上传、解析、向量化、检索)
- [x] 向量检索服务 (支持 Pinecone/Weaviate)
- [x] 上下文检索服务 (多轮对话支持)
- [x] 流式答案生成服务
- [x] 可视化生成服务 (自动推荐可视化类型)
- [x] 遗传学可视化服务 (庞氏方格、遗传路径、减数分裂动画、染色体行为)
- [x] 交互控制服务 (播放/暂停/步骤控制)
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

### Q: 如何配置向量数据库？

A: 在 `.env` 文件中配置 Pinecone 或 Weaviate 的连接信息，系统会自动选择可用的向量数据库。

### Q: 如何联系维护者？

A: 请提交 Issue 或发送邮件至项目维护者。

## 许可证

MIT License

---

**让每一次学习都成为"顿悟时刻"**
