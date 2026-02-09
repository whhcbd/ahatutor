# AhaTutor 开发指南

## 项目结构

```
ahatutor/
├── src/
│   ├── frontend/          # React + Vite 前端
│   │   ├── src/
│   │   │   ├── components/    # UI 组件
│   │   │   ├── pages/         # 页面组件
│   │   │   ├── stores/        # Zustand 状态管理
│   │   │   └── styles/        # 样式文件
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   ├── backend/           # NestJS 后端
│   │   ├── src/
│   │   │   ├── modules/      # 功能模块
│   │   │   │   ├── llm/          # LLM 服务
│   │   │   │   │   └── providers/   # OpenAI/Claude/DeepSeek
│   │   │   │   └── agents/       # 六 Agent 架构
│   │   │   │       ├── agent-pipeline.service.ts
│   │   │   │       ├── concept-analyzer.service.ts
│   │   │   │       ├── prerequisite-explorer.service.ts
│   │   │   │       ├── genetics-enricher.service.ts
│   │   │   │       └── quiz-generator.service.ts
│   │   │   │   ├── rag/          # RAG 服务 (待实现)
│   │   │   │   └── services/     # 业务服务 (待实现)
│   │   │   ├── shared/       # 共享配置
│   │   │   ├── main.ts
│   │   │   └── app.module.ts
│   │   └── package.json
│   │
│   └── shared/            # 前后端共享类型
│       ├── types/            # TypeScript 类型定义
│       └── constants/        # 常量定义
│
├── prompts/               # Prompt 模板
├── documents/             # 教材文档
├── data/                  # 数据持久化
├── docs/                  # 文档
├── docker-compose.yml     # 开发环境
├── package.json           # 根 package.json
└── README.md
```

## 快速开始

### 1. 环境准备

```bash
# 克隆项目
cd ahatutor

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入 API Keys
```

### 2. 启动开发环境

```bash
# 启动 Docker 服务（Redis, Neo4j, PostgreSQL, MinIO）
docker-compose up -d

# 启动前端和后端
npm run dev
```

### 3. 访问应用

- 前端: http://localhost:5173
- 后端 API: http://localhost:3001
- API 文档: http://localhost:3001/api/docs

## 核心功能实现状态

### ✅ 已完成

#### 项目基础
- [x] 项目目录结构
- [x] 前端 React + Vite 项目初始化
- [x] 后端 NestJS 项目初始化
- [x] 共享类型定义
- [x] Docker 开发环境配置

#### 前端
- [x] 基础布局组件
- [x] 首页
- [x] 速通模式页面（UI + 交互逻辑）
- [x] 深度模式页面（占位）
- [x] 错题本页面（占位）
- [x] 学情报告页面（占位）

#### 后端
- [x] LLM 多管道架构（OpenAI/Claude/DeepSeek）
- [x] 六 Agent 协作流水线
  - [x] Agent 1: ConceptAnalyzer - 概念分析
  - [x] Agent 2: PrerequisiteExplorer - 前置知识探索（核心创新）
  - [x] Agent 3: GeneticsEnricher - 遗传学知识丰富
  - [x] Agent 6: QuizGenerator - 题目生成

#### Prompt 模板
- [x] 出题 Prompt
- [x] 答案判断 Prompt
- [x] 前置知识探索 Prompt
- [x] 遗传学知识丰富 Prompt
- [x] 举一反三 Prompt
- [x] 学情报告 Prompt
- [x] 概念分析 Prompt

### 🔄 进行中

#### 六 Agent 架构（待完成）
- [ ] Agent 4: VisualDesigner - 可视化设计
- [ ] Agent 5: NarrativeComposer - 叙事作曲

### ⏳ 待实现

#### 后端模块
- [ ] RAG 服务（文档上传、解析、向量化）
- [ ] 知识图谱服务（Neo4j 集成）
- [ ] 错题管理服务
- [ ] 学情报告服务
- [ ] OCR/Vision 服务
- [ ] 认证授权服务

#### 前端功能
- [ ] 速通模式完整流程（对接后端 API）
- [ ] 深度模式知识图谱可视化
- [ ] 错题上传和 OCR 识别
- [ ] 学情报告图表展示

#### 数据持久化
- [ ] Redis 缓存集成
- [ ] Neo4j 图数据库集成
- [ ] PostgreSQL 关系数据库集成
- [ ] Pinecone/Weaviate 向量数据库集成

## API 设计

### LLM 服务

#### 聊天接口
```
POST /api/llm/chat
{
  "messages": [
    { "role": "user", "content": "解释伴性遗传" }
  ],
  "provider": "openai",
  "temperature": 0.7
}
```

#### 流式聊天
```
POST /api/llm/stream
{
  "messages": [...],
  "provider": "claude"
}
```

### Agent 服务

#### 执行流水线
```
POST /api/agent/pipeline
{
  "concept": "伴性遗传",
  "userLevel": "intermediate",
  "focusAreas": ["quiz"]
}
```

#### 探索前置知识
```
POST /api/agent/explore
{
  "concept": "伴性遗传",
  "maxDepth": 3
}
```

### 题目服务

#### 生成题目
```
POST /api/quiz/generate
{
  "topic": "孟德尔第一定律",
  "difficulty": "medium",
  "count": 5
}
```

#### 提交答案
```
POST /api/quiz/submit
{
  "questionId": "quiz_123",
  "userAnswer": "A"
}
```

## 开发规范

### 代码风格
- TypeScript 严格模式
- ESLint + Prettier
- 函数式组件优先
- 服务层与控制器分离

### Git 提交规范
```
feat: 新功能
fix: 修复
docs: 文档
style: 格式
refactor: 重构
test: 测试
chore: 构建
```

### 分支策略
- `main`: 生产环境
- `develop`: 开发环境
- `feature/*`: 功能分支
- `fix/*`: 修复分支

## 环境变量说明

```bash
# 应用配置
NODE_ENV=development
PORT=3001
FRONTEND_PORT=5173

# LLM 配置
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
DEEPSEEK_API_KEY=sk-...
DEFAULT_LLM_PROVIDER=openai

# 向量数据库
PINECONE_API_KEY=...
PINECONE_INDEX_NAME=ahatutor

# 图数据库
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=ahatutor123

# 缓存
REDIS_HOST=localhost
REDIS_PORT=6379
```

## 部署

### Docker 部署
```bash
docker-compose up -d
```

### 构建生产版本
```bash
npm run build
```

## 常见问题

### Q: 如何添加新的 LLM 提供商？
A: 在 `src/backend/src/modules/llm/providers/` 下创建新的 provider 类，实现相同的接口。

### Q: 如何修改 Prompt 模板？
A: 编辑 `prompts/` 目录下的 `.md` 文件，或在代码中直接修改。

### Q: 如何扩展新的遗传学知识点？
A: 目前是动态生成，未来可以添加预定义的知识库。

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交变更
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT
