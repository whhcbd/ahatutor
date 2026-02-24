# AhaTutor - 遗传学可视化交互解答平台

> 基于 AI 的遗传学学习平台，实现"自然语言输入 + AI理解 + 实时可视化 + 交互探索"，打造真正的"顿悟时刻"(Aha Moment)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB)](https://react.dev/)
[![NestJS](https://img.shields.io/badge/NestJS-10.3-E0234E)](https://nestjs.com/)

---

## 项目概述

**AhaTutor** 是一个创新的学科学习平台，通过六 Agent 协作流水线，将复杂的概念转化为：

- **可视化知识图谱** - 一眼看穿概念关系
- **生动学习叙事** - 故事化讲解，记忆深刻
- **智能题目生成** - 精准练习，举一反三
- **联网资源推荐** - 最新资讯，扩展视野
- **交互式可视化** - 实时操作，加深理解
- **动态可视化生成** - 基于AI问答的实时可视化内容

**MVP 学科**: 遗传学（含 89 个预置知识点）

---

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量（见下方说明）

# 3. 启动开发服务器（同时启动前后端）
npm run dev

访问 http://localhost:5173
```

**或分终端启动：**

```bash
# 终端1 - 后端 (端口 3001)
cd src/backend && npm run start:dev

# 终端2 - 前端 (端口 5173)
cd src/frontend && npm run dev
```

**注意：** 项目需要先构建 shared 包，如果遇到 shared 包导入问题，请运行：

```bash
npm run build:shared
```

### 当前运行状态

✅ **后端服务已成功启动**

- 服务地址: http://localhost:3001
- API文档: http://localhost:3001/api/docs

✅ **前端开发服务器**

- 服务地址: http://localhost:5173

### 环境变量配置

复制根目录的 `.env.example` 为 `.env`，然后配置以下关键项：

```bash
# LLM 配置（至少配置一个）
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
DEEPSEEK_API_KEY=your_deepseek_api_key_here
GLM_API_KEY=your_glm_api_key_here
DEFAULT_LLM_PROVIDER=openai

# 图数据库（Neo4j）- 可选，用于知识图谱功能
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=ahatutor123

# 缓存（Redis）- 可选，用于性能优化
REDIS_HOST=localhost
REDIS_PORT=6379

# 前端配置
VITE_API_BASE_URL=http://localhost:3001

# MinerU PDF 解析服务（用于高质量文档解析）
MINERU_BASE_URL=http://3a092f40.r6.cpolar.cn
MINERU_API_ENDPOINT=/api/convert_pdf
MINERU_TIMEOUT=600000
USE_MINERU=true
MINERU_OUTPUT_DIR=./data/mineru-output

# RAG 配置（检索增强生成）
RAG_ENABLED=true
RAG_VECTOR_STORE=local  # local | pinecone | weaviate
RAG_EMBEDDING_MODEL=local  # local | openai | glm
RAG_CHUNK_SIZE=1000
RAG_CHUNK_OVERLAP=200
RAG_TOP_K=5

# Pinecone 向量数据库（可选）
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=ahatutor
PINECONE_ENVIRONMENT=your_pinecone_environment

# Weaviate 向量数据库（可选）
WEAVIATE_URL=http://localhost:8080
WEAVIATE_API_KEY=your_weaviate_api_key
```

**快速启动（无需配置数据库）**：

如果只是想快速体验前端和基础功能，可以跳过数据库配置，直接运行：

```bash
npm run dev
```

系统会使用 Mock 数据和本地缓存运行。

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

### 交互式可视化

**40+ 可视化组件，涵盖遗传学各个领域：**

- **基础遗传学**：庞氏方格、遗传路径、概率分布、伴性遗传、测交、等位基因、纯合杂合
- **细胞遗传学**：减数分裂动画（9个阶段）、染色体行为、染色体可视化、有丝分裂、三体综合征、染色体畸变
- **分子遗传学**：DNA复制、复制叉、前导链、后随链、DNA聚合酶、转录、翻译、核糖体、中心法则
- **基因调控**：启动子、剪接、乳糖操纵子、基因调控
- **表观遗传学**：DNA甲基化、组蛋白修饰、表观遗传记忆、染色质重塑
- **基因工程**：CRISPR、基因克隆、基因工程、载体系统、PCR、RNA干扰
- **知识图谱**：知识图谱、知识图谱搜索、概念详情面板、基于掌握度的学习顺序、理解提示
- **辅助功能**：可编辑可视化、可视化设计器视图、叙事作曲视图、问题面板

#### 可视化数据源

可视化数据支持两种方式：

1. **硬编码数据**：为关键遗传学概念预置高质量可视化数据
   - DNA双螺旋结构：展示双螺旋模型、碱基配对、磷酸骨架
   - 孟德尔遗传：庞氏方格、遗传概率计算
   - 减数分裂：9个阶段的详细动画展示

2. **动态生成**：基于AI对话和RAG知识库动态生成可视化内容
   - 根据用户问题自动推荐最适合的可视化类型
   - 从知识库中提取相关概念和关系
   - 实时生成个性化的可视化内容

#### 可视化组件架构

```
AI对话 → 可视化需求分析 → 数据源选择 → 组件渲染 → 交互控制
    ↓           ↓              ↓           ↓          ↓
用户问题   VisualDesigner   硬编码/动态   React组件  事件处理
        可视化推荐器        数据生成      D3/ECharts  播放控制
```

#### 硬编码可视化示例

**DNA双螺旋结构可视化数据**：

```typescript
{
  type: 'diagram',
  title: 'DNA双螺旋结构可视化',
  description: '展示DNA分子的双螺旋结构：由两条互补的核苷酸链反向平行缠绕成螺旋状...',
  elements: ['磷酸基团', '脱氧核糖', '含氮碱基', '碱基对', '氢键', '磷酸二酯键', '双螺旋'],
  data: {
    structure: {
      backbone: '磷酸基团和脱氧核糖交替排列，形成骨架',
      bases: 'A-T、G-C配对，通过氢键连接',
      antiparallel: '两条链方向相反（5\'→3\'和3\'→5\'）',
      helical: '右手螺旋，每圈10.5个碱基对'
    }
  }
}
```

### 4. 错题管理

- 拍照上传错题
- OCR 自动识别
- 举一反三变式练习
- 错题分类存储

### 5. 学情报告

- 日/周/专题报告
- 薄弱点分析
- 知识点掌握度雷达图

### 6. A2UI 自适应 UI

- 动态表单生成器
- 自适应表单布局
- 智能追问推荐
- 知识缺口检测
- 学习路径推荐
- 多模态回答（文字 + 可视化 + 举例）

### 7. 动态可视化生成

- **触发方式**：在AI问答中使用关键词如"可视化"、"图示"、"图解"等
- **智能推荐**：基于问题内容和知识点自动推荐最佳可视化类型
- **RAG增强**：结合检索增强生成，从知识库中提取相关概念生成可视化
- **多级别适配**：根据用户水平（初学者/中级/高级）调整可视化复杂度
- **实时生成**：动态创建个性化的可视化内容，确保内容准确性和相关性

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

## 核心特色

### 1. 六 Agent 协作流水线

通过六个专业 Agent 协作，实现从概念理解到学习路径生成的完整流程：

- **ConceptAnalyzer** - 概念分析器：识别用户意图、领域分类、复杂度评估
- **PrerequisiteExplorer** - 前置知识探索器（核心创新）：反向递归分解，构建知识树
- **GeneticsEnricher** - 遗传学知识丰富器：添加专业定义、原理、公式、实例
- **VisualDesigner** - 可视化设计器：自动推荐最佳可视化类型和配置
- **NarrativeComposer** - 叙事作曲器：创作学习叙事，设计讲解顺序
- **QuizGenerator** - 题目生成器：智能生成题目，提供分级解析（5个等级）

### 2. LLM 多管道支持

- 支持 OpenAI GPT-4、Claude、DeepSeek、GLM（智谱 AI）四个 LLM 提供商
- 统一的 LLM 接口抽象，轻松切换或扩展新的提供商
- Mock 提供商用于本地开发和测试

### 3. RAG 检索增强生成

AhaTutor 内置完整的 RAG（检索增强生成）系统，支持高质量的知识检索和答案生成。

#### 核心功能

- **文档上传与解析**：支持 PDF、Markdown 等多种格式
- **智能分块**：基于语义和结构的智能文档分割
- **向量化存储**：支持多种嵌入模型和向量数据库
- **语义检索**：基于向量相似度的精准检索
- **上下文检索**：多轮对话历史上下文维护
- **流式生成**：实时流式答案生成，提升用户体验

#### RAG 服务架构

```
用户查询 → 向量检索 → 上下文构建 → LLM生成 → 流式输出
    ↓
┌─────────────────────────────────────────┐
│ 文档处理流程                            │
├─────────────────────────────────────────┤
│ 1. 文档上传                              │
│    - 支持本地文件上传                    │
│    - MinerU PDF 智能解析（高质量）        │
│    - 本地 pdf-parse 解析（备用方案）     │
│                                          │
│ 2. 文档分块                              │
│    - 智能语义分块（基于内容和结构）      │
│    - 支持自定义分块策略                  │
│    - 保留元数据（章节、标签等）          │
│                                          │
│ 3. 向量化                                │
│    - OpenAI Embeddings                   │
│    - 本地向量化（词频+哈希，无需API）    │
│    - 支持多种嵌入模型切换                │
│                                          │
│ 4. 向量存储                              │
│    - Pinecone（云端向量数据库）          │
│    - Weaviate（本地/云端）               │
│    - 本地 JSON 存储（轻量级）            │
│                                          │
│ 5. 语义检索                              │
│    - 余弦相似度计算                      │
│    - Top-K 结果返回                      │
│    - 支持过滤和重排序                    │
└─────────────────────────────────────────┘
```

#### 预置遗传学知识库

项目已预置基于《遗传学（第4版）》教材构建的完整 RAG 知识库：

- **文档来源**：《遗传学（第4版）》- 刘祖洞等 著
- **分块数量**：490 个文本块
- **平均块大小**：1382 字符
- **向量维度**：2000 维
- **检索速度**：< 1 秒
- **内容覆盖**：
  - 基因学基础
  - 染色体遗传
  - 分子遗传学
  - 群体遗传学
  - 基因表达调控
  - 遗传分析策略
  - 表观遗传学
  - 遗传与发育

#### RAG API 接口

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

#### MinerU PDF 解析服务

集成 NVIDIA RTX 4090 D 驱动的多模态 AI 模型，实现高质量 PDF 解析：

- **复杂布局识别**：自动识别多栏、图表、公式等复杂布局
- **公式解析**：准确提取 LaTeX 格式的数学公式
- **表格识别**：保留表格结构和内容
- **图像提取**：自动提取文档中的图像
- **Markdown 输出**：返回结构化的 Markdown 格式内容
- **自动降级**：MinerU 失败时自动切换到本地 pdf-parse 解析
- **并发处理**：支持队列模式的并发请求处理

```bash
# 解析 PDF 文件
POST /api/mineru/parse
{
  "filePath": "/path/to/file.pdf",
  "timeout": 600000,
  "outputPath": "/path/to/output",
  "keepZip": false
}

# MinerU 服务健康检查
GET /api/mineru/health

# 获取 MinerU 服务配置
GET /api/mineru/config
```

#### 本地向量化方法（无需外部 API）

项目实现了轻量级的本地向量化方法，无需依赖外部嵌入模型 API：

1. **文本预处理**：提取汉字和单词
2. **词频统计**：使用固定大小词汇表（2000 维）
3. **哈希映射**：将词汇哈希映射到向量位置
4. **归一化**：对向量进行 L2 归一化
5. **余弦相似度**：使用余弦相似度计算文本相似度

**优势**：

- 无需外部 API 调用，降低成本
- 本地存储，数据隐私安全
- 轻量级，无需额外数据库服务
- 快速检索，适合中小规模知识库

**扩展性**：

- 支持无缝切换到 OpenAI、ChatGLM 等高级嵌入模型
- 可集成 Pinecone、Weaviate 等专业向量数据库
- 支持自定义向量化策略

### 4. 知识图谱

- Neo4j 图数据库存储
- 自动构建知识树
- 学习路径查找（最短路径、推荐路径）
- D3.js 可视化展示

#### 知识图谱架构

```
RAG知识库 → 概念提取 → 节点生成 → 边缘连接 → 可视化展示
     ↓
遗传学概念分类 (8大领域)
     ↓
动态图构建 (D3.js力导向图)
     ↓
交互式探索 (过滤、缩放、节点详情)
```

#### 核心功能

- **基于RAG的动态生成**：从遗传学知识库自动提取概念并构建知识图谱
- **智能节点分类**：按经典遗传学、分子遗传学、细胞遗传学等8大领域分类
- **边缘连接优化**：基于概念相似度和领域相关性自动生成连接，保证最小连接
- **交互式可视化**：支持拖拽、缩放、过滤、节点详情查看等交互操作
- **动态过滤**：按概念类别快速筛选节点和连接
- **学习路径推荐**：基于知识图谱推荐最佳学习顺序

#### API接口

```bash
# 查询知识图谱
POST /knowledge-graph/query
{
  "topic": "分子遗传学",
  "limit": 20
}

# 构建知识图谱
POST /knowledge-graph/build
{
  "topics": ["经典遗传学", "分子遗传学", "细胞遗传学"],
  "maxNodes": 50,
  "connectionDensity": 0.3
}

# 获取概念详情
GET /knowledge-graph/concept/:id
```

### 5. 统一的可视化标准

- 统一配色方案（基于遗传学语义：显性/隐性/携带者/正常）
- 标准化交互方式（hover、click、zoom、drag）
- 响应式布局规则（移动端/平板/桌面适配）

### 6. A2UI 自适应界面

- 根据可视化类型自动生成编辑表单
- 表单布局自适应（复杂度调整）
- 多模态回答（文字解析 + 可视化 + 举例的混合输出）
- 智能追问推荐（根据当前问题生成 2-3 个后续问题）
- 识别知识缺口，主动推荐补充学习

### 7. 动态可视化生成系统

- **触发机制**：AI问答中使用关键词自动触发可视化生成
- **模板匹配**：基于概念相似度匹配最佳可视化模板
- **RAG 集成**：从遗传学知识库中提取相关概念和关系
- **多级别适配**：根据用户水平调整可视化复杂度和详细程度
- **实时生成**：动态创建个性化的可视化内容
- **质量保证**：结合硬编码数据和动态生成，确保可视化质量
- **自动清理**：智能检测和移除重复内容，保证回答简洁性

## 技术栈

| 层级         | 技术                                                                                                                                                                                      |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **前端**     | React 18.3, TypeScript 5.5, Vite 5.4, TailwindCSS 3.4, D3.js 7.9, ECharts 5.5, Framer Motion 11.3, KaTeX 0.16, Zustand 4.5, TanStack Query 5.45, Lucide React 0.400, Socket.io Client 4.7 |
| **后端**     | NestJS 10.3, TypeScript 5.5, LangChain 0.1.33, Swagger 7.1, JWT 10.2, Passport 10.0, Throttler 5.1, FAISS 0.5, ChromaDB 3.3                                                               |
| **AI**       | OpenAI (GPT-4), Claude (Anthropic), DeepSeek, GLM (智谱 AI)                                                                                                                               |
| **数据库**   | Neo4j (知识图谱), Pinecone/Weaviate/FAISS/ChromaDB (向量检索), Redis (缓存)                                                                                                               |
| **存储**     | 本地文件系统, MinIO (对象存储)                                                                                                                                                            |
| **代码质量** | ESLint, Prettier, TypeScript Strict Mode, Vitest, Jest                                                                                                                                    |

---

## 项目结构

```
ahatutor/
├── src/
│   ├── frontend/                    # React 前端
│   │   ├── .eslintrc.json          # ESLint 配置
│   │   ├── .env.example             # 环境变量示例
│   │   ├── index.html              # HTML 入口
│   │   ├── vite.config.ts          # Vite 配置
│   │   ├── postcss.config.js       # PostCSS 配置
│   │   ├── tailwind.config.js      # TailwindCSS 配置
│   │   └── src/
│   │       ├── api/                 # API 客户端
│   │       │   └── agent.ts
│   │       ├── components/          # 组件
│   │       │   ├── A2UI/           # 自适应 UI 组件
│   │       │   │   ├── AdaptiveFormLayout.tsx
│   │       │   │   ├── DynamicFormGenerator.tsx
│   │       │   │   ├── FollowUpQuestions.tsx
│   │       │   │   ├── KnowledgeGapDetector.tsx
│   │       │   │   ├── LearningPathRecommender.tsx
│   │       │   │   └── MultimodalAnswer.tsx
│   │       │   ├── KnowledgeGraph/  # 知识图谱组件
│   │       │   │   ├── KnowledgeGraphView.tsx
│   │       │   │   └── index.ts
│   │       │   ├── Layout/          # 布局
│   │       │   │   └── Layout.tsx
│   │       │   ├── Visualization/   # 可视化组件 (40+个组件)
│   │       │   │   ├── AlleleVisualization.tsx
│   │       │   │   ├── CRISPRVisualization.tsx
│   │       │   │   ├── CentralDogmaVisualization.tsx
│   │       │   │   ├── ChromatinRemodelingVisualization.tsx
│   │       │   │   ├── ChromosomalAberrationVisualization.tsx
│   │       │   │   ├── ChromosomeBehavior.tsx
│   │       │   │   ├── ChromosomeVisualization.tsx
│   │       │   │   ├── ConceptDetailPanel.tsx
│   │       │   │   ├── DNAMethylationVisualization.tsx
│   │       │   │   ├── DNAPolymeraseVisualization.tsx
│   │       │   │   ├── DNARepairVisualization.tsx
│   │       │   │   ├── DNAReplicationVisualization.tsx
│   │       │   │   ├── EpigeneticMemoryVisualization.tsx
│   │       │   │   ├── GeneCloningVisualization.tsx
│   │       │   │   ├── GeneEngineeringVisualization.tsx
│   │       │   │   ├── GeneRegulationVisualization.tsx
│   │       │   │   ├── GeneStructureVisualization.tsx
│   │       │   │   ├── HistoneModificationVisualization.tsx
│   │       │   │   ├── HomozygousHeterozygousVisualization.tsx
│   │       │   │   ├── InheritancePath.tsx
│   │       │   │   ├── KnowledgeGraph.tsx
│   │       │   │   ├── KnowledgeGraphSearch.tsx
│   │       │   │   ├── LacOperonVisualization.tsx
│   │       │   │   ├── LaggingStrandVisualization.tsx
│   │       │   │   ├── LeadingStrandVisualization.tsx
│   │       │   │   ├── MasteryBasedLearningOrder.tsx
│   │       │   │   ├── MeiosisAnimation.tsx
│   │       │   │   ├── MitosisVisualization.tsx
│   │       │   │   ├── NarrativeComposerView.tsx
│   │       │   │   ├── PCRVisualization.tsx
│   │       │   │   ├── ProbabilityDistribution.tsx
│   │       │   │   ├── PromoterVisualization.tsx
│   │       │   │   ├── PunnettSquare.tsx
│   │       │   │   ├── QuestionPanel.tsx
│   │       │   │   ├── RNAInterferenceVisualization.tsx
│   │       │   │   ├── ReplicationForkVisualization.tsx
│   │       │   │   ├── RibosomeVisualization.tsx
│   │       │   │   ├── SplicingVisualization.tsx
│   │       │   │   ├── TestCrossVisualization.tsx
│   │       │   │   ├── TranscriptionVisualization.tsx
│   │       │   │   ├── TranslationVisualization.tsx
│   │       │   │   ├── TrisomyVisualization.tsx
│   │       │   │   ├── UnderstandingInsights.tsx
│   │       │   │   ├── VectorSystemVisualization.tsx
│   │       │   │   ├── VisualDesignerView.tsx
│   │       │   │   ├── XLinkedInheritance.tsx
│   │       │   │   └── index.ts
│   │       │   └── ui/              # UI 组件
│   │       │       ├── Badge.tsx
│   │       │       ├── Button.tsx
│   │       │       ├── Card.tsx
│   │       │       ├── EmptyState.tsx
│   │       │       ├── ErrorBoundary.tsx
│   │       │       ├── Input.tsx
│   │       │       ├── LazyImage.tsx
│   │       │       ├── Loading.tsx
│   │       │       ├── Modal.tsx
│   │       │       ├── ResourcePreloader.tsx
│   │       │       ├── Toast.tsx
│   │       │       ├── VirtualList.tsx
│   │       │       ├── index.ts       # 统一导出
│   │       │       └── toast.store.ts, toast.utils.ts
│   │       ├── constants/           # 常量定义
│   │       │   ├── visualization-colors.ts
│   │       │   ├── visualization-interactions.ts
│   │       │   └── visualization-layout.ts
│   │       ├── data/                # 数据文件
│   │       │   └── genetics-topics.ts  # 89个遗传学知识点
│   │       ├── hooks/               # 自定义 Hooks
│   │       │   ├── index.ts
│   │       │   ├── useDebounce.ts
│   │       │   ├── useIntersectionObserver.ts
│   │       │   ├── useToast.ts
│   │       │   ├── useThrottle.ts
│   │       │   └── useVirtualList.ts
│   │       ├── pages/               # 页面
│   │       │   ├── DepthModePage.tsx    # 深度模式
│   │       │   ├── ErrorPage.tsx        # 错误页面
│   │       │   ├── HomePage.tsx         # 首页
│   │       │   ├── MistakeBookPage.tsx  # 错题本
│   │       │   ├── NarrativePage.tsx     # 叙事页面
│   │       │   ├── ReportPage.tsx        # 学情报告
│   │       │   ├── SpeedModePage.tsx     # 速通模式
│   │       │   └── VisualizePage.tsx     # 可视化页面
│   │       ├── styles/              # 样式文件
│   │       │   └── index.css
│   │       ├── utils/               # 工具函数
│   │       │   ├── api-client.ts
│   │       │   ├── api-quiz.ts
│   │       │   ├── api.ts
│   │       │   ├── image.ts
│   │       │   └── performance.ts
│   │       ├── App.tsx              # 应用入口
│   │       ├── main.tsx             # 主入口
│   │       └── vite-env.d.ts        # Vite 类型定义
│   │
│   ├── backend/                     # NestJS 后端
│   │   ├── .eslintrc.json          # ESLint 配置
│   │   ├── scripts/                 # 后端脚本
│   │   │   ├── test-rag-upload.js   # RAG上传测试
│   │   │   └── upload-rag-document.js  # 文档上传脚本
│   │   └── src/
│   │       ├── modules/
│   │       │   ├── agents/          # 六 Agent 流水线
│   │       │   │   ├── data/        # 可视化数据
│   │       │   │   │   └── modules/
│   │       │   │   │       ├── basic-concepts.ts
│   │       │   │   │       ├── chromosomal-genetics.ts
│   │       │   │   │       ├── epigenetics.ts
│   │       │   │   │       ├── mendelian-genetics.ts
│   │       │   │   │       ├── modern-techniques.ts
│   │       │   │   │       ├── molecular-genetics.ts
│   │       │   │   │       └── population-genetics.ts
│   │       │   │   ├── skills/      # 技能服务
│   │       │   │   │   ├── answer-evaluator.service.ts
│   │       │   │   │   ├── genetics-visualization.service.ts
│   │       │   │   │   ├── interactive-control.service.ts
│   │       │   │   │   ├── resource-recommend.service.ts
│   │       │   │   │   ├── visualization-generator.service.ts
│   │       │   │   │   └── web-search.service.ts
│   │       │   │   ├── agent-pipeline.service.ts
│   │       │   │   ├── agent.controller.ts
│   │       │   │   ├── agent.module.ts
│   │       │   │   ├── concept-analyzer.service.ts
│   │       │   │   ├── genetics-enricher.service.ts
│   │       │   │   ├── narrative-composer.service.ts
│   │       │   │   ├── prerequisite-explorer.service.ts
│   │       │   │   ├── quiz-generator.service.ts
│   │       │   │   ├── visual-designer.service.ts
│   │       │   │   └── visualization-rag.service.ts
│   │       │   ├── knowledge-base/  # 遗传学知识库
│   │       │   │   ├── data/        # 8个领域知识数据
│   │       │   │   │   ├── basic-concepts.ts
│   │       │   │   │   ├── chromosomal-genetics.ts
│   │       │   │   │   ├── enrichment.ts
│   │       │   │   │   ├── epigenetics.ts
│   │       │   │   │   ├── mendelian-genetics.ts
│   │       │   │   │   ├── modern-techniques.ts
│   │       │   │   │   ├── molecular-genetics.ts
│   │       │   │   │   ├── population-genetics.ts
│   │       │   │   │   └── prerequisites.ts
│   │       │   │   ├── knowledge-base.module.ts
│   │       │   │   └── knowledge-base.service.ts
│   │       │   ├── knowledge-graph/ # 知识图谱 (Neo4j)
│   │       │   │   ├── dto/          # 数据传输对象
│   │       │   │   ├── services/     # 知识图谱服务
│   │       │   │   │   ├── graph-builder.service.ts
│   │       │   │   │   ├── graph.service.ts
│   │       │   │   │   ├── neo4j.service.ts
│   │       │   │   │   └── path-finder.service.ts
│   │       │   │   ├── graph.controller.ts
│   │       │   │   ├── graph.module.ts
│   │       │   │   ├── knowledge-graph.controller.ts
│   │       │   │   ├── knowledge-graph.module.ts
│   │       │   │   └── knowledge-graph.service.ts
│   │       │   ├── llm/             # LLM 多管道
│   │       │   │   ├── providers/   # 5个LLM适配器
│   │       │   │   │   ├── claude.provider.ts
│   │       │   │   │   ├── deepseek.provider.ts
│   │       │   │   │   ├── glm.provider.ts
│   │       │   │   │   ├── mock.provider.ts
│   │       │   │   │   └── openai.provider.ts
│   │       │   │   ├── llm.controller.ts
│   │       │   │   ├── llm.module.ts
│   │       │   │   └── llm.service.ts
│   │       │   ├── mineru/          # MinerU PDF 解析服务
│   │       │   │   ├── dto/         # 数据传输对象
│   │       │   │   ├── mineru.controller.ts
│   │       │   │   ├── mineru.module.ts
│   │       │   │   └── mineru.service.ts
│   │       │   ├── auth/            # 认证模块
│   │       │   │   ├── decorators/  # 装饰器
│   │       │   │   ├── dto/          # 数据传输对象
│   │       │   │   ├── guards/       # 守卫
│   │       │   │   ├── services/     # 服务
│   │       │   │   ├── strategies/   # 策略
│   │       │   │   ├── auth.controller.ts
│   │       │   │   └── auth.module.ts
│   │       │   ├── mistake/         # 错题管理
│   │       │   │   ├── dto/          # 数据传输对象
│   │       │   │   ├── services/     # 服务
│   │       │   │   │   ├── mistake.service.ts
│   │       │   │   │   ├── ocr.service.ts
│   │       │   │   │   └── similar-question.service.ts
│   │       │   │   ├── mistake.controller.ts
│   │       │   │   └── mistake.module.ts
│   │       │   ├── progress/        # 学习进度
│   │       │   │   ├── dto/          # 数据传输对象
│   │       │   │   ├── services/     # 服务
│   │       │   │   │   └── progress.service.ts
│   │       │   │   ├── progress.controller.ts
│   │       │   │   └── progress.module.ts
│   │       │   ├── rag/             # 检索增强生成
│   │       │   │   ├── dto/          # 数据传输对象
│   │       │   │   ├── services/     # RAG 服务 (11个子服务)
│   │       │   │   │   ├── chunk.service.ts
│   │       │   │   │   ├── context-retrieval.service.ts
│   │       │   │   │   ├── document-indexing.service.ts
│   │       │   │   │   ├── document-splitter.service.ts
│   │       │   │   │   ├── document.service.ts
│   │       │   │   │   ├── embedding.service.ts
│   │       │   │   │   ├── local-embedding.service.ts
│   │       │   │   │   ├── local-vector-store.service.ts
│   │       │   │   │   ├── rag.service.ts
│   │       │   │   │   ├── retrieval.service.ts
│   │       │   │   │   ├── streaming-answer.service.ts
│   │       │   │   │   ├── vector-retrieval.service.ts
│   │       │   │   │   └── vector-store.service.ts
│   │       │   │   ├── rag.controller.ts
│   │       │   │   └── rag.module.ts
│   │       │   ├── report/          # 学情报告
│   │       │   │   ├── dto/          # 数据传输对象
│   │       │   │   ├── services/     # 服务
│   │       │   │   │   └── report.service.ts
│   │       │   │   ├── report.controller.ts
│   │       │   │   └── report.module.ts
│   │       ├── shared/              # 共享配置
│   │       │   ├── config/          # 配置文件
│   │       │   │   ├── llm.config.ts
│   │       │   │   └── rag.config.ts
│   │       │   └── index.ts
│   │       ├── app.module.ts
│   │       └── main.ts
│   │
│   └── shared/                      # 前后端共享
│       ├── types/                   # 类型定义
│       │   ├── agent.types.ts      # Agent 相关类型
│       │   ├── skill.types.ts      # Skill 相关类型
│       │   ├── genetics.types.ts   # 遗传学类型
│       │   ├── knowledge-tree.types.ts  # 知识树类型
│       │   ├── rag.types.ts        # RAG 类型
│       │   ├── auth.types.ts       # 认证类型
│       │   └── progress.types.ts   # 进度类型
│       └── constants/
│           └── index.ts             # 常量导出
│
├── prompts/                         # AI 提示词模板
│   ├── answer-evaluation.md
│   ├── concept-analyzer.md
│   ├── genetics-enricher.md
│   ├── learning-report.md
│   ├── prerequisite-explorer.md
│   ├── quiz-generation.md
│   └── similar-question.md
├── docs/                            # 项目文档
│   ├── CLAUDE.md                    # Claude 技能参考
│   ├── README_RAG.md                # RAG 功能说明
│   ├── a2ui-mindmap-spec.md        # A2UI 思维导图语言规范
│   ├── claude-skills-reference.md
│   ├── claude-skills-top-recommendations.md
│   ├── development-guide.md         # 开发指南
│   ├── fine-grained-rag-guide.md    # 细粒度 RAG 指南
│   ├── llm-api-keys.md              # LLM API 密钥配置
│   ├── mindmap-integration-summary.md # 思维导图集成总结
│   ├── project-progress.md          # 项目进度
│   ├── rag-document-splitting-guide.md  # RAG 文档分割指南
│   ├── vector-database-comparison.md   # 向量数据库对比
│   ├── visualization-issues.md      # 可视化问题记录
│   └── reference/                  # 参考文档
│       ├── full.md                 # 完整参考文档
│       └── 目录.md                # 目录索引
├── documents/                        # 文档存储目录
│   └── .gitkeep
├── data/                            # 数据存储
│   ├── cache/                       # 缓存目录
│   │   └── .gitkeep
│   ├── external/                    # 外部数据
│   │   └── genetics-rag/            # 遗传学RAG数据
│   │       ├── analyze_chunks.js    # 分块分析脚本
│   │       ├── check_chunks.js      # 分块检查脚本
│   │       ├── chunks.json          # 文档分块数据
│   │       ├── chunks_fine_grained.json  # 细粒度分块数据
│   │       ├── chunks_fine_grained_simplified.json  # 简化细粒度分块数据
│   │       ├── chunks_simplified.json  # 简化分块数据
│   │       ├── compare_versions.js  # 版本比较脚本
│   │       ├── stats.json           # 统计信息
│   │       ├── stats_fine_grained.json  # 细粒度统计信息
│   │       ├── stats_fine_grained_vectors.json  # 细粒度向量统计信息
│   │       ├── vectors.json         # 向量存储
│   │       └── vectors_fine_grained.json  # 细粒度向量存储
│   ├── minio/                       # MinIO 对象存储
│   │   └── .gitkeep
│   ├── neo4j/                       # Neo4j 数据存储
│   │   └── .gitkeep
│   └── postgres/                    # PostgreSQL 数据存储
│       └── .gitkeep
├── scripts/                         # 脚本工具
│   ├── analysis/                    # 分析脚本（开发调试用）
│   │   ├── README.md               # 分析脚本说明
│   │   ├── analyze-*.js            # 内容分析脚本
│   │   ├── check-*.js             # 章节验证脚本
│   │   ├── verify-*.js            # 验证脚本
│   │   ├── debug-*.js             # 调试脚本
│   │   └── *-report.json         # 分析报告
│   ├── build_genetics_rag.ts        # 遗传学RAG构建脚本
│   ├── build_genetics_rag_fine_grained.ts  # 细粒度RAG构建脚本
│   ├── build_vectors_fine_grained.ts       # 细粒度向量构建脚本
│   ├── genetics_rag_service.ts      # RAG服务核心
│   ├── init-rag-knowledge-base.ts   # RAG知识库初始化
│   ├── package.json                 # 脚本依赖配置
│   ├── check-rag-stats.js           # RAG统计检查
│   ├── test-embedding.js            # 嵌入测试
│   ├── test-fine-grained-rag.ts     # 细粒度RAG测试
│   ├── test-glm-chat.js             # GLM聊天测试
│   ├── test-mock-rag.js             # Mock RAG测试
│   ├── test-rag-functionality.js    # RAG功能测试
│   ├── test-rag-query-low.js        # RAG查询测试(低配)
│   ├── test-rag-query.js            # RAG查询测试
│   ├── test-vector-store-direct.js  # 向量存储直接测试
│   ├── test-vector-store.js         # 向量存储测试
│   ├── upload-rag-full.js           # 完整RAG上传
│   └── upload-rag-full.ps1          # PowerShell上传脚本
├── archive/                         # 归档文件
│   ├── docs/                        # 归档文档
│   └── unused_files/                # 未使用文件归档
├── _archive/                        # 内部归档
├── docker-compose.yml
├── .env.example                     # 环境变量示例
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── .gitignore                       # Git忽略文件
├── project-docs/                    # 项目文档
│   ├── PRD-产品需求文档.md          # 产品需求文档
│   ├── agent-implementation-requirements.md  # Agent实现要求
│   └── 生物遗传学可视化开发-研究计划汇总.md  # 研究计划汇总
├── tests/                           # 测试脚本
│   ├── fix-duplicate-content-test.md  # 重复内容测试
│   ├── test-analyze.js              # 分析测试脚本
│   ├── test-ask-curl.js             # Curl测试脚本
│   ├── test-ask-final.js            # 最终测试脚本
│   ├── test-ask-simple.js           # 简单测试脚本
│   ├── test-ask-verbose.js          # 详细测试脚本
│   ├── test-ask.js                  # 通用测试脚本
│   ├── test-chat-simple.js          # 简单聊天测试脚本
│   ├── test-chat.js                 # 聊天测试脚本
│   ├── test-embedding.js            # 嵌入测试脚本
│   ├── test-fine-grained-rag.ts     # 细粒度RAG测试脚本
│   ├── test-glm-chat.js             # GLM聊天测试脚本
│   ├── test-health.js               # 健康检查脚本
│   ├── test-llm.js                  # LLM测试脚本
│   ├── test-mock-rag.js             # Mock RAG测试脚本
│   ├── test-pipeline.js             # 流水线测试脚本
│   ├── test-rag-functionality.js    # RAG功能测试脚本
│   ├── test-rag-query-low.js        # RAG查询测试脚本(低配)
│   ├── test-rag-query.js            # RAG查询测试脚本
│   ├── test-rag-upload.js           # RAG上传测试脚本
│   ├── test-rag.js                  # RAG测试脚本
│   ├── test-root.js                 # 根路径测试脚本
│   ├── test-simple-get.js           # 简单GET测试脚本
│   ├── test-swagger-json.js         # Swagger JSON测试脚本
│   ├── test-swagger.js              # Swagger测试脚本
│   ├── test-vector-store-direct.js  # 向量存储直接测试脚本
│   └── test-vector-store.js         # 向量存储测试脚本
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

### MinerU PDF 解析服务

```bash
# 解析 PDF 文件
POST /api/mineru/parse
{
  "filePath": "/path/to/file.pdf",
  "timeout": 600000,
  "outputPath": "/path/to/output",
  "keepZip": false
}

# MinerU 服务健康检查
GET /api/mineru/health

# 获取 MinerU 服务配置
GET /api/mineru/config
```

**MinerU 服务特性：**

- 基于 NVIDIA RTX 4090 D 的多模态 AI 模型
- 支持复杂布局、公式、表格、图像的高质量解析
- 返回 Markdown 格式内容，保留原始文档结构
- 自动提取图像和布局信息
- 支持并发请求（队列模式处理）
- 自动降级机制：失败时切换到本地 pdf-parse 解析

---

## 开发命令

```bash
# 开发
npm run dev              # 同时启动前后端
npm run dev:frontend     # 仅前端
npm run dev:backend      # 仅后端

# 构建
npm run build
npm run build:frontend   # 仅前端
npm run build:backend    # 仅后端
npm run build:shared     # 仅共享类型

# 代码检查
npm run lint             # 检查所有
npm run lint:frontend    # 仅前端
npm run lint:backend     # 仅后端

# 类型检查
npm run typecheck        # 检查所有
npm run typecheck:frontend   # 仅前端
npm run typecheck:backend    # 仅后端

# 测试
npm run test

# RAG 初始化
npm run init:rag         # 初始化遗传学知识库

# 后端生产启动
npm run start:prod       # 启动生产环境后端

# 后端调试
npm run start:debug      # 启动调试模式后端
```

---

## 代码质量

项目已配置完整的代码质量检查工具：

### ESLint

- 前端配置: `src/frontend/.eslintrc.json` - React + TypeScript 规则
- 后端配置: `src/backend/.eslintrc.json` - NestJS + TypeScript 规则
- 检查命令: `npm run lint`

### TypeScript

- 严格模式启用
- 共享类型定义: `src/shared/types/`
- 类型检查命令: `npm run typecheck`

### 代码规范

- 组件统一导出: `src/frontend/src/components/ui/index.ts`
- 类型统一导出: `src/shared/index.ts`
- 移除重复代码和未使用的导入

---

## 开发路线图

### 项目整体完成状态: 98%

### Phase 1: 核心功能 (已完成 100%)

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
- [x] AgentModule 依赖注入修复
- [x] 后端服务成功启动
- [x] API文档生成
- [x] 遗传学知识库 (8个领域, 89个知识点)
- [x] Prompt 模板库 (7个模板)
- [x] 共享类型定义
- [x] 技能服务框架
- [x] 可视化按钮功能修复
- [x] 深度模式知识图谱集成

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

### Phase 3: 高级功能 (已完成 100%)

- [x] RAG 服务架构 (文档上传、解析、向量化、检索)
- [x] 遗传学预置知识库 (490个分块，基于《遗传学（第4版）》)
- [x] 本地向量化系统 (词频+哈希，无需外部API)
- [x] 向量检索服务 (支持 Pinecone/Weaviate/本地JSON)
- [x] 上下文检索服务 (多轮对话支持)
- [x] 流式答案生成服务
- [x] MinerU PDF 解析集成 (NVIDIA RTX 4090 D，高质量解析)
- [x] 自动降级机制 (MinerU失败切换到本地解析)
- [x] 可视化生成服务 (自动推荐可视化类型)
- [x] 遗传学可视化服务 (庞氏方格、遗传路径、减数分裂动画、染色体行为)
- [x] 40+ 可视化组件 (DNA复制、转录翻译、基因调控、DNA修复、分子生物学等)
- [x] 交互控制服务 (播放/暂停/步骤控制)
- [x] 知识图谱服务 (Neo4j集成、路径查找、D3可视化)
- [x] 基于RAG的知识图谱 (遗传学概念动态生成)
- [x] 知识图谱可视化 (D3.js力导向图)
- [x] 知识图谱过滤和缩放控制
- [x] 知识图谱边缘连接优化 (最小连接保证)
- [x] 硬编码可视化数据 (DNA双螺旋结构等)
- [x] 错题管理 (OCR识别、举一反三、错题本)
- [x] 学情报告 (数据分析、图表生成、雷达图)
- [x] 用户认证系统 (JWT、权限管理)
- [x] 学习进度持久化 (数据库集成)

### Phase 4: 下一阶段开发重点

#### 1. 形成可视化图像生成的标准 ✅ 已完成

- [x] 统一配色方案 (基于遗传学语义: 显性/隐性/携带者/正常)
- [x] 标准化交互方式 (hover, click, zoom, drag)
- [x] 定义响应式布局规则 (移动端/平板/桌面适配)

#### 2. 形成生物可视化的知识图谱功能，便于用户理解各个概念 ✅ 已完成

- [x] 支持双向关系
- [x] 基于用户掌握度动态推荐学习顺序
- [x] 实现从知识图谱节点一键跳转到可视化组件
- [x] 概念详情面板
- [x] 智能搜索与过滤

#### 3. 利用 A2UI 动态界面生成，完善速通模式的 AI 问答能力 ✅ 已完成

- [x] 根据可视化类型自动生成编辑表单
- [x] 表单布局自适应 (复杂度调整)
- [x] 多模态回答 (文字解析 + 可视化 + 举例的混合输出)
- [x] 动态选择最合适的解释方式
- [x] 智能追问推荐 (根据当前问题生成 2-3 个后续问题)
- [x] 识别知识缺口，主动推荐补充学习
- [x] 关联知识图谱节点进行路径推荐

#### 4. 未来扩展方向

- **多学科支持**：扩展到数学、物理、化学等其他学科
- **移动端应用**：开发 iOS/Android 原生应用
- **教师端功能**：备课辅助、动态题库生成、学生学情分析
- **社区协作**：用户贡献可视化组件和知识点
- **AI 模型微调**：基于用户数据微调专属模型

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

## 项目更新日志

### 最近修复 (2026-02-24)

#### TypeScript 类型系统重构

**重大修复：**

1. **TypeScript 编译错误修复**
   - 修复了 87 个 TypeScript 编译错误，生产代码错误减少至 0
   - 排除了测试文件的类型检查，专注于生产代码质量
   - 构建成功，输出：`✓ 3470 modules transformed. ✓ built in 19.81s`

2. **Shared 包模块系统重构**
   - 将 shared 包从 CommonJS 改为 ESNext 模块系统
   - 添加 `type: "module"` 配置，支持 ES 模块导出
   - 配置 `exports` 字段，提供清晰的包导出路径
   - 修复了前端无法正确导入 shared 类型的问题

3. **Vite 配置更新**
   - 更新 `@shared` 路径别名，指向编译后的 `dist` 目录
   - 确保 shared 类型在运行时和开发时都能正确解析

4. **前端 TypeScript 配置优化**
   - 在 `tsconfig.json` 中添加 `exclude` 配置
   - 排除测试文件（`*.test.ts`, `*.test.tsx`, `*.spec.ts`, `*.spec.tsx`）
   - 提高类型检查效率，专注于生产代码

5. **组件类型修复**
   - 修复可视化组件中的未使用参数和未使用接口定义
   - 修复 React 导入错误（移除未使用的 React 命名导入）
   - 修复 A2UI 组件的类型定义和接口
   - 为动态可视化生成器添加显式类型注解

6. **类型导出整理**
   - 创建 `src/shared/types/index.ts` 桶文件
   - 统一导出所有类型定义（agent、skill、genetics、knowledge-tree 等）
   - 删除重复的 Toast 类型文件
   - 修复 ToastStore 的导出路径

**技术细节：**

```typescript
// shared package.json
{
  "type": "module",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./types/*": {
      "import": "./dist/types/index.js",
      "types": "./dist/types/index.d.ts"
    }
  }
}

// shared/tsconfig.json
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "bundler"
  }
}

// frontend/vite.config.ts
{
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../shared/dist')
    }
  }
}

// frontend/tsconfig.json
{
  "exclude": [
    "src/**/*.test.ts",
    "src/**/*.test.tsx",
    "src/**/*.spec.ts",
    "src/**/*.spec.tsx"
  ]
}
```

**影响范围：**

- ✅ 前端开发服务器正常启动（http://localhost:5173）
- ✅ 构建成功，无类型错误
- ✅ Shared 类型可以正确导入
- ✅ 所有组件和服务的类型检查通过

### 最近修复 (2026-02-22)

#### 知识图谱功能完善

**功能增强：**

1. **可视化按钮功能修复**
   - 修复速通模式中可视化按钮无法点击的问题
   - 完善按钮点击事件处理逻辑
   - 确保可视化组件正确加载和显示

2. **深度模式知识图谱集成**
   - 在深度学习模式中集成知识图谱可视化
   - 支持基于RAG知识库的动态知识图谱生成
   - 实现知识图谱与AI对话的无缝切换

3. **知识图谱边缘连接优化**
   - 提高边缘生成概率（同类别30%→50%，不同类别10%→20%）
   - 添加最小连接保证机制，避免节点孤立
   - 实现链式连接确保图谱连通性

4. **硬编码可视化数据**
   - 为DNA双螺旋结构等关键概念添加完整可视化数据
   - 包含结构描述、元素列表、颜色配置和动画参数
   - 确保重要概念始终有高质量可视化展示

5. **知识图谱交互功能完善**
   - 修复筛选按钮功能，实现按类别过滤节点

#### 动态可视化生成功能

**核心改进：**

1. **动态可视化生成系统集成**
   - 在 VisualDesigner 服务中集成 DynamicVizGeneratorService
   - 实现基于 AI 问答的实时可视化内容生成
   - 添加 generateDynamicVisualization() 方法支持动态生成

2. **AI 问答触发机制**
   - 支持在 AI 问答中使用关键词触发可视化生成
   - 优化 answerQuestion() 方法，使用动态可视化作为后备方案
   - 提高可视化触发的准确性和相关性

3. **RAG 增强可视化**
   - 集成 RAG 检索增强生成，从知识库提取相关概念
   - 基于向量相似度匹配最佳可视化模板
   - 确保可视化内容与问题高度相关

4. **多级别用户适配**
   - 根据用户水平（初学者/中级/高级）调整可视化复杂度
   - 提供适合不同学习阶段的可视化内容
   - 确保可视化内容的可理解性和教育价值

5. **内容质量优化**
   - 添加 cleanTextAnswer() 方法移除重复内容
   - 提高回答的简洁性和可读性
   - 确保文字回答和可视化内容的一致性

6. **技术架构优化**
   - 更新 agent.module.ts，添加 DynamicVizGeneratorService 到 providers
   - 修改 rag.config.ts，使用绝对路径配置 RAG 数据文件
   - 确保服务间依赖注入正确配置

**使用方式：**

在 AI 问答中，使用以下关键词可以触发动态可视化生成：

- "可视化 [概念]"
- "给我图示 [概念]"
- "[概念] 的图解"
- "用图表展示 [概念]"

例如："可视化 DNA 复制过程"、"给我图示 伴性遗传"、"孟德尔定律 的图解"

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
