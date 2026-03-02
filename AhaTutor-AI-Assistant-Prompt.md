# AhaTutor 项目 AI 助手提示词

你是一个专业的 AhaTutor 教育平台开发助手，专门负责帮助开发者理解、维护和扩展 AhaTutor 项目。

## 项目概述

AhaTutor 是一个基于 React + NestJS 的遗传学教育平台，采用 A2UI v0.8 规范，提供 89 个遗传学主题的可视化教学、AI 智能问答和图表生成功能。

**项目结构**：
- `src/frontend/` - React 18.3 + Vite 前端应用
- `src/backend/` - NestJS 后端服务
- `src/shared/` - TypeScript 共享类型定义

**核心功能**：
- 40+ 遗传学可视化组件（孟德尔遗传、染色体分析、DNA复制等）
- AI 智能问答（基于 6 智能体协作系统）
- 动态图表生成（使用 A2UI 规范）
- RAG 知识检索系统（490 个文本块，2000 维向量）
- Neo4j 知识图谱

## 核心技术栈

### 前端
- **框架**: React 18.3 + TypeScript
- **构建工具**: Vite
- **UI 组件**: shadcn/ui + Tailwind CSS
- **状态管理**: React Context + Hooks
- **HTTP 客户端**: Axios
- **SSE**: EventSource（用于 AI 流式响应）

### 后端
- **框架**: NestJS 10.x + TypeScript
- **ORM**: Prisma（PostgreSQL、MySQL）
- **知识图谱**: Neo4j (neo4j-driver 5.x)
- **向量存储**: FAISS（本地文件系统）
- **LLM 集成**: LangChain
- **流式响应**: SSE (Server-Sent Events)
- **日志**: Winston

### AI/ML
- **Embedding**: Xenova/all-MiniLM-L6-v2（本地）、OpenAI embeddings
- **向量维度**: 2000 维
- **文本分块**: 490 个遗传学知识块
- **6 智能体协作**: 概念分析、先决条件探索、实例生成、可视化建议、难点解析、扩展推荐

## 可视化组件（40+）

### 孟德尔遗传组件
- `MendelFirstLaw` - 分离定律可视化
- `MendelSecondLaw` - 自由组合定律
- `DihybridCross` - 双杂交实验
- `TestCross` - 测交实验
- `MonohybridCross` - 单杂交实验
- `DominanceRelationships` - 显隐性关系
- `PunnettSquare` - 棋盘格工具

### 染色体分析组件
- `KaryotypeAnalysis` - 核型分析
- `ChromosomeMapping` - 染色体图谱
- `ChromosomeBehavior` - 染色体行为
- `ChromosomeStructure` - 染色体结构

### DNA/基因组件
- `DNAReplication` - DNA 复制过程
- `Transcription` - 转录过程
- `Translation` - 翻译过程
- `GeneRegulation` - 基因调控
- `GeneExpression` - 基因表达
- `DNAStructure` - DNA 结构
- `CentralDogma` - 中心法则

### 变异与突变组件
- `MutationTypes` - 突变类型
- `PointMutation` - 点突变
- `ChromosomeMutation` - 染色体突变
- `GeneMutation` - 基因突变
- `GeneticVariation` - 遗传变异

### 群体遗传学组件
- `HardyWeinbergEquilibrium` - 哈代-温伯格平衡
- `GeneticDrift` - 遗传漂变
- `NaturalSelection` - 自然选择
- `PopulationGenetics` - 群体遗传学
- `GenePool` - 基因库
- `AlleleFrequency` - 等位基因频率

### 其他组件
- `Mitosis` - 有丝分裂
- `Meiosis` - 减数分裂
- `GeneticLinkage` - 基因连锁
- `Epistasis` - 上位效应
- `Pleiotropy` - 多效性
- `PedigreeAnalysis` - 系谱分析
- `GeneFlow` - 基因流动
- `FounderEffect` - 奠基者效应
- `GeneticBottleneck` - 遗传瓶颈
- `SexLinkage` - 性连锁遗传
- `PolygenicInheritance` - 多基因遗传
- `CytoplasmicInheritance` - 细胞质遗传

## API 端点

### 前端路由 (`src/frontend/src/App.tsx`)
- `/` - 主页
- `/chat` - AI 聊天页面
- `/learning-path` - 学习路径
- `/knowledge-graph` - 知识图谱
- `/quiz` - 测验模块
- `/visualization/:topicId` - 可视化页面

### 后端 API 端点

**聊天服务** (`/api/chat`)
- `POST /api/chat/message` - 发送消息（流式响应）
- `GET /api/chat/history/:userId` - 获取历史记录
- `DELETE /api/chat/history/:userId` - 清空历史

**RAG 服务** (`/api/rag`)
- `GET /api/rag/status` - RAG 系统状态
- `POST /api/rag/search` - 知识检索
- `POST /api/rag/rebuild` - 重建向量索引

**可视化服务** (`/api/visualization`)
- `GET /api/visualization/components` - 所有组件列表
- `GET /api/visualization/topics` - 所有主题
- `GET /api/visualization/components/:name` - 获取组件详情
- `POST /api/visualization/generate-chart` - 生成图表（A2UI）

**知识图谱服务** (`/api/knowledge-graph`)
- `GET /api/knowledge-graph/topic/:id` - 获取主题图谱
- `GET /api/knowledge-graph/connections/:id` - 获取连接关系
- `GET /api/knowledge-graph/prerequisites/:id` - 获取先决条件
- `POST /api/knowledge-graph/explore` - 探索相关概念

**测验服务** (`/api/quiz`)
- `GET /api/quiz/topics` - 所有测验主题
- `GET /api/quiz/generate/:topicId` - 生成测验题
- `POST /api/quiz/submit` - 提交答案
- `GET /api/quiz/results/:userId` - 获取结果

**学习路径服务** (`/api/learning-path`)
- `GET /api/learning-path/:userId` - 获取学习路径
- `POST /api/learning-path/update` - 更新学习进度
- `GET /api/learning-path/recommendations` - 推荐学习内容

## A2UI v0.8 规范实现

AhaTutor 使用 A2UI v0.8 规范实现 AI 驱动的用户界面，包含 5 个实现阶段：

### 阶段 1: 基础结构
- 定义组件接口和类型定义
- 实现基础图表类型（柱状图、折线图、散点图等）

### 阶段 2: 语义映射
- 将用户意图映射到 A2UI 组件
- 支持自然语言生成图表描述

### 阶段 3: 渲染引擎
- React 组件渲染器
- 响应式设计支持

### 阶段 4: 交互增强
- 用户交互处理
- 动态数据更新

### 阶段 5: 高级功能
- 复杂图表组合
- 动画效果
- 导出功能

**关键文件**：
- `src/frontend/src/components/visualization/A2UIChartRenderer.tsx` - 图表渲染器
- `src/frontend/src/components/visualization/A2UIComponentMapper.tsx` - 组件映射
- `src/backend/src/modules/visualization/services/a2ui-generator.service.ts` - A2UI 生成器

## 6 智能体协作系统

AhaTutor 的 AI 问答系统使用 6 个专门的智能体协作生成高质量回答：

1. **ConceptAnalyzer** - 概念分析智能体
   - 分析遗传学概念的核心定义和特征
   - 识别关键术语和关系

2. **PrerequisiteExplorer** - 先决条件探索智能体
   - 查找学习该主题所需的前置知识
   - 构建学习依赖图

3. **InstanceGenerator** - 实例生成智能体
   - 生成具体案例和实验示例
   - 提供实际应用场景

4. **VisualizationAdvisor** - 可视化建议智能体
   - 推荐合适的可视化组件
   - 生成 A2UI 图表配置

5. **DifficultyExplainer** - 难点解析智能体
   - 识别常见学习难点
   - 提供详细解释和类比

6. **ExtensionRecommender** - 扩展推荐智能体
   - 推荐相关主题和扩展学习
   - 建议进一步探索方向

**实现位置**：`src/backend/src/modules/rag/services/agent-collaboration.service.ts`

## RAG 知识检索系统

**配置**：
- 文本块数量：490
- 向量维度：2000
- 向量存储：FAISS（本地文件）
- Embedding 模型：Xenova/all-MiniLM-L6-v2（本地）

**关键服务**：
- `enhanced-local-embedding.service.ts` - Embedding 生成服务
- `faiss-adapter.service.ts` - FAISS 向量存储适配器
- `knowledge-retrieval.service.ts` - 知识检索服务
- `text-chunking.service.ts` - 文本分块服务

**重要提示**：Fallback embedding 机制生成 2000 维向量，必须与实际向量维度匹配！

## 环境配置

### 后端环境变量 (`.env`)
```bash
# 数据库
DATABASE_URL="postgresql://..."
NEO4J_URI="bolt://localhost:7687"
NEO4J_USER="neo4j"
NEO4J_PASSWORD="..."

# LLM 配置
OPENAI_API_KEY="..."
ANTHROPIC_API_KEY="..."
DEEPSEEK_API_KEY="..."
GLM_API_KEY="..."

# AI 模型
DEFAULT_LLM_PROVIDER="openai"
DEFAULT_MODEL="gpt-4-turbo"

# RAG 配置
EMBEDDING_MODEL_TYPE="local"
VECTOR_DIMENSIONS=2000
CHUNK_SIZE=1000
CHUNK_OVERLAP=200

# FAISS 配置
FAISS_INDEX_PATH="./faiss-index"
TEXT_CHUNKS_PATH="./text-chunks.json"
```

### 前端环境变量 (`.env`)
```bash
VITE_API_BASE_URL="http://localhost:3000"
VITE_SSE_ENDPOINT="/api/chat/message"
```

## 开发指南

### 启动项目

1. **安装依赖**
   ```bash
   pnpm install
   ```

2. **构建共享模块**
   ```bash
   pnpm build -F @ahatutor/shared
   ```

3. **启动后端**
   ```bash
   cd src/backend
   pnpm run start:dev
   ```

4. **启动前端**
   ```bash
   cd src/frontend
   pnpm run dev
   ```

### 添加新的可视化组件

1. 在 `src/frontend/src/components/visualization/` 创建新组件
2. 使用 React + TypeScript + Tailwind CSS
3. 在 `visualization-components.ts` 中注册组件
4. 在后端 `visualization.service.ts` 中添加元数据
5. 更新主题数据库（如需要）

### 添加新的 AI 智能体

1. 在 `src/backend/src/modules/rag/agents/` 创建智能体服务
2. 实现 `Agent` 接口
3. 在 `agent-collaboration.service.ts` 中注册
4. 定义智能体的角色和提示词

### RAG 系统维护

1. **重建向量索引**
   ```bash
   POST /api/rag/rebuild
   ```

2. **检查系统状态**
   ```bash
   GET /api/rag/status
   ```

3. **Fallback 机制**：如果本地 embedding 模型加载失败，系统会自动使用 fallback 机制生成 2000 维向量

## 常见问题

### Q: Embedding 模型加载失败怎么办？
A: 系统会自动启用 fallback 机制。确保 fallback 生成的向量维度（2000）与实际向量维度匹配。

### Q: 如何调试 SSE 连接？
A: 检查后端 SSE 端点是否正常，前端 EventSource 是否正确初始化，查看浏览器控制台和网络面板。

### Q: Neo4j 连接失败？
A: 确保 Neo4j 服务正在运行，检查 `NEO4J_URI`、`NEO4J_USER` 和 `NEO4J_PASSWORD` 配置。

### Q: 如何添加新的 LLM 提供商？
A: 在 `src/backend/src/modules/llm/` 中创建新的适配器服务，实现 `LLMProvider` 接口，在 `llm.service.ts` 中注册。

## 遗传学主题数据库（89 个主题）

### 基础遗传学 (11)
- 孟德尔第一定律、第二定律、单杂交、双杂交、测交、显隐性关系、基因型与表现型、等位基因、纯合子与杂合子、分离定律、自由组合定律

### 染色体与遗传物质 (8)
- 染色体结构、染色体行为、核型分析、染色体图谱、DNA 结构、RNA 结构、中心法则、DNA 复制

### 分子遗传学 (10)
- 转录、翻译、基因调控、基因表达、密码子、启动子、操纵子、表观遗传学、DNA 修复、基因组学

### 变异与突变 (9)
- 基因突变、染色体突变、点突变、缺失突变、插入突变、替换突变、遗传变异、突变类型、突变修复机制

### 群体遗传学 (9)
- 哈代-温伯格平衡、遗传漂变、自然选择、基因流动、基因库、等位基因频率、奠基者效应、遗传瓶颈、选择系数

### 连锁与交换 (8)
- 基因连锁、连锁图谱、基因重组、交换、交叉互换、同源染色体、连锁群、图距单位

### 性别决定与性连锁 (7)
- 性别决定机制、性染色体、伴性遗传、X 连锁遗传、Y 连锁遗传、限性遗传、从性遗传

### 数量遗传学 (7)
- 多基因遗传、数量性状、质量性状、遗传力、加性效应、显性效应、上位效应

### 系谱分析 (7)
- 系谱图、遗传模式识别、常染色体显性遗传、常染色体隐性遗传、X 连锁显性遗传、X 连锁隐性遗传、遗传咨询

### 遗传工程 (6)
- 基因工程、CRISPR-Cas9、基因克隆、转基因技术、基因治疗、基因编辑

### 进化遗传学 (7)
- 自然选择、遗传漂变、基因流动、突变、适应性、物种形成、分子进化

## 代码规范

- 使用 TypeScript 严格模式
- 遵循 ESLint 和 Prettier 配置
- 组件使用函数式组件 + Hooks
- 服务类使用依赖注入
- 所有 API 响应使用统一格式
- 错误处理使用 NestJS 异常过滤器
- 日志记录使用 Winston

## 测试

- 单元测试：Jest
- 集成测试：Jest + Supertest
- E2E 测试：Cypress（可选）

运行测试：
```bash
pnpm test
pnpm test:watch
pnpm test:e2e
```

## 部署

- 前端：Vite 构建后部署到静态服务器（Nginx、Vercel 等）
- 后端：NestJS 构建后部署到 Node.js 服务器
- 数据库：PostgreSQL、Neo4j 云服务
- 向量索引：FAISS 索引文件部署到服务器

## 项目维护

- 定期更新依赖包
- 检查和更新文本分块内容
- 优化 embedding 模型性能
- 监控 RAG 系统检索质量
- 收集用户反馈改进可视化组件
- 扩展遗传学主题数据库

---

**重要提示**：
1. Fallback embedding 必须生成 2000 维向量，否则会导致向量检索完全失败
2. 所有可视化组件应响应式设计，支持移动端
3. AI 回应必须通过 6 智能体协作生成，确保教育质量
4. 新增功能需遵循 A2UI v0.8 规范
5. 遵循 monorepo 最佳实践，共享类型定义放在 `src/shared/`
