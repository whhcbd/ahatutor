# Agent 实现需求文档

> 基于会议纪要的 MVP 版本：遗传学可视化学习平台

---

## 项目背景

**项目名称**: AhaTutor（学科可视化交互解答平台）

**核心目标**: 打造一个"自然语言输入 + AI理解 + 实时可视化 + 交互探索"的学科学习平台，实现真正的"顿悟时刻"(Aha Moment)

**MVP学科**: 遗传学

---

## 一、MVP 核心功能

### 1.1 RAG 向量数据库 - 基本问答

**目标**: 针对特定教材内容实现基本问答能力

**初始资料**:
- 📁 MinerU 输出目录：`C:\Users\16244\MinerU\遗传学【十二五国家级规划教材】 (刘祖洞) (Z-Library).pdf-67861eba-47ec-4d36-a3f5-199a29829b24\`
- 📄 推荐使用 `full.md`（已解析的 Markdown，1.4MB，适合 RAG）
- 📷 图片资源：`images/` 目录
- 📋 结构化数据：`content_list.json`、`layout.json`
- 📦 原始 PDF：`*_origin.pdf`（22.6MB，备选）
- 📘 LaTeX 源码：`MinerU_latex_*.zip`（20MB，学术渲染）

**技术要求**:
- RAG 框架集成
- LLM 能力：
  - 流式输出
  - 多轮对话
  - 多模态支持（图像理解）

### 1.2 速通模式 - 沉浸式刷题

**两种学习路径**:

#### 路径 A：引导式学习
- 用户主动发问知识点
- AI 进行引导式讲解和问答

#### 路径 B：沉浸式刷题

```
┌─────────────────────────────────────────────────────────────┐
│                    沉浸式刷题流程                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. AI 出题                                                  │
│     ↓                                                        │
│  2. 用户回答                                                 │
│     ↓                                                        │
│  3. AI 判断                                                 │
│     ├── 对 → 继续出题（返回1）                               │
│     └── 错 → 用户自评                                        │
│         ├── 低级错误（笔误、马虎）→ AI 标记，继续            │
│         └── 高级错误（知识性）→ 进入解答模式                 │
│                                                              │
│  4. 解答模式                                                 │
│     ├── AI 给出题目解析（分等级，可设置）                    │
│     │   - 默认从最简练开始                                   │
│     ├── 用户可追问                                           │
│     └── 用户点击 pass 按钮继续下一题                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 1.3 双模式设计

#### 模式一：短时记忆模式（速通模式）

**目标用户**: 考前突击、快速复习、即时答疑

**核心特点**:
- 客制化刷题
- 一站式互动解答（追问）
- 快速反馈
- 聚焦当前问题解决

#### 模式二：长时记忆模式（深度模式）

**目标用户**: 系统学习、深度研究、长期规划

**核心特点**:
- 专题式学习
- 知识图谱导航（基于反向知识树自动构建）
- 艾宾浩斯遗忘曲线复习计划
- 学习进度追踪
- 知识掌握度评估

**核心创新：反向知识树**

参考 Math-To-Manim 项目的核心思想，深度模式采用"反向递归分解"策略自动构建学习路径：

```
用户输入："解释伴性遗传"
  ↓
🌳 反向递归分解：
  "理解伴性遗传前需要先懂什么？"
    → 伴性遗传前需要：孟德尔定律、性染色体
      → 孟德尔定律前需要：基因型/表型、分离定律
        → 基因型前需要：基因概念、染色体基础 ✓
  ↓
🎯 从基础向上构建知识图谱
```

**遗传学知识树示例**：
```
伴性遗传 [目标]
├─ 孟德尔定律
│   ├─ 基因型/表型
│   │   ├─ 基因概念 [基础]
│   │   └─ 显隐性 [基础]
│   └─ 分离定律
│       └─ 减数分裂 [基础]
├─ 染色体
│   ├─ 性染色体 [基础]
│   └─ 常染色体 [基础]
└─ 性状遗传
    └─ 显隐性性状 [基础]
```

**核心优势**：
- ✅ 不跳过概念
- ✅ 逻辑递进
- ✅ 从基础到目标
- ✅ 递归发现依赖关系
- ✅ 零训练数据，纯递归推理

### 1.4 错题管理与举一反三

**错题管理**
- 拍照上传错题（调用设备相机）
- 手动图片上传
- AI 自动识别题目内容（Vision API）
- 支持手动编辑题目
- 错题分类存储（按科目/知识点/错误类型）
- 个人错题库管理

**举一反三**
- 基于错题自动生成相似题
- 变式训练（改变条件/问法）
- 知识点巩固练习
- 一键加入复习计划

### 1.5 智能组卷

**组卷方式**
- 错题组卷：选择单一或多个错题生成试卷
- 知识点组卷：按指定知识点范围生成
- 时间段组卷：按复习时间范围生成
- 自定义组卷：根据难度和数量要求生成

**试卷参数**
- 题型选择（选择/填空/简答）
- 难度等级（简单/中等/困难）
- 题目数量
- 时间限制（可选）

### 1.6 学情报告

**一键生成学情报告**
- 薄弱点分析图表
- 错误原因统计（低级/高级错误占比）
- 知识点掌握度雷达图
- 学习进度时间线
- 复习建议和计划

**报告类型**
- 日报告：当日学习情况
- 周报告：一周学习总结
- 专题报告：某知识点的掌握情况
- 错题报告：错题分析总结

### 1.7 可视化数据库

**速通模式可视化**
- 学习进度追踪
- 正确率统计
- 薄弱点标记
- 错题趋势图

**深度模式可视化**
- 知识图谱展示
- 知识点关联关系
- 学习路径推荐
- 艾宾浩斯复习计划可视化
- 学情报告仪表板

### 1.8 Agent + Skills

**联网搜索**
- 实时检索最新遗传学资讯
- 补充教材外知识

**资源推荐**
- 根据学习进度推荐相关资源
- 视频教程、文献推荐

### 1.9 六 Agent 协作流水线（核心创新）

参考 Math-To-Manim 项目的六 Agent 架构，遗传学学习平台采用专业化 Agent 分工：

```
用户输入
    ↓
┌─────────────────────────────────────────┐
│ Agent 1: ConceptAnalyzer                │
│ "这真正在问什么？"                        │
└──────────────┬──────────────────────────┘
               ↓
┌─────────────────────────────────────────┐
│ Agent 2: PrerequisiteExplorer ⭐         │
│ "理解这个前需要先懂什么？"                 │
│ (递归构建遗传学知识树)                     │
└──────────────┬──────────────────────────┘
               ↓
┌─────────────────────────────────────────┐
│ Agent 3: GeneticsEnricher               │
│ "精确的遗传学原理是什么？"                 │
└──────────────┬──────────────────────────┘
               ↓
┌─────────────────────────────────────────┐
│ Agent 4: VisualDesigner                 │
│ "如何展示这个概念？"                       │
└──────────────┬──────────────────────────┘
               ↓
┌─────────────────────────────────────────┐
│ Agent 5: NarrativeComposer              │
│ "连接这些概念的故事是什么？"               │
└──────────────┬──────────────────────────┘
               ↓
┌─────────────────────────────────────────┐
│ Agent 6: QuizGenerator                  │
│ "如何生成题目和评估？"                    │
└──────────────┬──────────────────────────┘
               ↓
         学习内容 / 题目 / 报告
```

**Agent 职责说明**：

| Agent | 核心问题 | 输出 |
|-------|----------|------|
| **ConceptAnalyzer** | "这真正在问什么？" | 结构化概念分析（领域、复杂度、可视化潜力） |
| **PrerequisiteExplorer** | "理解这个前需要先懂什么？" | 遗传学知识树（递归分解到基础概念） |
| **GeneticsEnricher** | "精确的遗传学原理是什么？" | 遗传学公式、定律、实验、例子 |
| **VisualDesigner** | "如何展示这个概念？" | 知识图谱可视化、动画设计、颜色方案 |
| **NarrativeComposer** | "连接这些概念的故事是什么？" | 学习路径、讲解顺序、知识点串联 |
| **QuizGenerator** | "如何生成题目和评估？" | 选择题、填空题、解析、等级系统 |

### 1.10 三重 LLM 管道架构

不绑定单一模型，用户可根据需求选择：

| 管道 | 技术栈 | 适用场景 | 优势 |
|------|--------|----------|------|
| **Pipeline 1: OpenAI** | OpenAI SDK | 通用场景、生产使用 | GPT-4 最稳定、代码生成质量高 |
| **Pipeline 2: Claude** | Anthropic SDK | 复杂推理、长文本 | 递归推理能力强、上下文管理优秀 |
| **Pipeline 3: 国产模型** | DeepSeek/Kimi/Qwen | 成本优化、本地化 | API 价格更低、中文理解更好 |

**配置示例**：
```typescript
// 用户可选择使用的 LLM
const llmConfig = {
  provider: 'openai' | 'claude' | 'deepseek',
  model: 'gpt-4' | 'claude-3-5-sonnet-20241022' | 'deepseek-chat',
  apiKey: userProvidedKey
};
```

---

## 二、技术架构设计原则

### 2.1 混合架构：RAG + ToolUse

参考行业最佳实践，遗传学学习平台采用混合架构：

| 场景类型 | 技术选型 | 理由 | 参考竞品 |
|---------|----------|------|----------|
| **遗传学计算** | 规则引擎/API调用 | 追求100%准确，LLM会算错 | Wolfram、Desmos |
| **概念解释** | LLM + RAG | 需要自然语言理解和解释 | ChatGPT、Monica |
| **动态可视化** | LLM + Code Agent | 将文字转化为动态图表/动画 | ManimML、Napkin.ai |

### 2.2 知识库搭建方式对比

#### 方案 A：Curated CMS（人工编排）
**代表产品**: Brilliant、PhET

```
特点：
- 教研团队编写课程大纲
- 知识点拆解为交互式模块
- 知识被硬编码进程序
- 追求100%准确性

优势：
✅ 内容质量高
✅ 计算结果绝对准确
✅ 用户体验稳定

劣势：
❌ 开发成本高
❌ 扩展性差
❌ 需要大量人工投入
```

#### 方案 B：RAG（检索增强生成）
**代表产品**: Napkin.ai、Gamma.app、ManimML

```
特点：
- 高度依赖 LLM
- 向量数据库存储知识
- 实时检索+生成

优势：
✅ 扩展性强
✅ 开发成本较低
✅ 可处理开放式问题

劣势：
❌ LLM 可能产生幻觉
❌ 计算可能出错
❌ 依赖检索质量
```

### 2.3 我们的混合方案

**核心原则**: 用对工具，用对场景

```
用户提问："解释伴性遗传"
     ↓
┌─────────────────────────────────────┐
│ 1. RAG 层：检索知识库              │
│    获取准确的定义、定律、实例       │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│ 2. LLM 层：生成解释文本            │
│    通俗易懂的讲解、类比            │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│ 3. 规则引擎层：遗传学计算          │
│    Punnett Square、概率计算        │
│    ❌ 不用 LLM 做计算！             │
└──────────────┬──────────────────────┘
               ↓
┌─────────────────────────────────────┐
│ 4. Code Agent 层：动态可视化       │
│    生成 ECharts/D3.js 代码          │
│    渲染知识图谱、动画               │
└──────────────┬──────────────────────┘
               ↓
         完整的学习体验
```

### 2.4 遗传学计算引擎（规则引擎）

**不用 LLM 做计算的原因**：
- LLM 会算错：`Aa × Aa` 可能算成 `1:3` 而不是 `3:1`
- 遗传学计算是确定性的数学问题
- 需要保证100%准确

**计算引擎示例**：
```typescript
// 遗传学规则引擎
class GeneticsCalculator {
  // Punnett Square 计算 - 确定性算法
  static punnettSquare(parent1: string, parent2: string): PunnettResult {
    // 不用 LLM，直接计算
    const gametes1 = this.getGametes(parent1);
    const gametes2 = this.getGametes(parent2);
    const combinations = this.cross(gametes1, gametes2);
    return {
      genotypes: this.countGenotypes(combinations),
      phenotypes: this.countPhenotypes(combinations),
      ratios: this.calculateRatios(combinations)
    };
  }

  // 概率计算 - 确定性算法
  static probability(genotype: string, parents: string[]): number {
    // 使用贝叶斯公式精确计算
    // 不用 LLM 估算
  }
}
```

### 2.5 Code Agent 层：动态可视化

**参考 ManimML 的思路**：

```typescript
// Code Agent 示例
class VisualizationAgent {
  async generateVisualization(concept: string): Promise<VizResult> {
    // 1. 识别可视化类型
    const vizType = await this.identifyType(concept);
    // → "知识图谱" / "染色体动画" / "概率图表"

    // 2. 检索代码模板（Code RAG）
    const template = await this.codeRAG.retrieve(vizType, concept);

    // 3. LLM 填充模板
    const code = await this.llm.fillTemplate(template, { concept });

    // 4. 执行渲染
    return await this.renderer.execute(code);
  }
}
```

---

## 三、交互流程设计

### 3.1 速通模式状态机

```typescript
type SpeedModeState =
  | 'idle'           // 空闲，等待开始
  | 'questioning'    // AI 出题中
  | 'answering'      // 等待用户回答
  | 'evaluating'     // AI 评判中
  | 'self_assess'    // 用户自评中
  | 'explaining'     // 解答模式中
  | 'continuing';    // 继续下一题

interface SpeedModeSession {
  state: SpeedModeState;
  currentQuestion?: Question;
  userAnswer?: string;
  isCorrect?: boolean;
  errorType?: 'low_level' | 'high_level';
  explanationLevel: number;  // 解析等级：1-5
  mistakes: Mistake[];       // 错误记录
}
```

### 2.2 解析等级系统

| 等级 | 描述 | 示例 |
|------|------|------|
| 1 | 最简练 | "Aa × aa → 1/2 Aa, 1/2 aa" |
| 2 | 简要解释 | "显性纯合子与隐性纯合子杂交，后代为杂合子" |
| 3 | 标准解析 | 包含基因型、表型、比例的完整说明 |
| 4 | 详细讲解 | 添加原理说明和注意事项 |
| 5 | 教学级解析 | 从基础概念开始，完整推导过程 |

### 2.3 用户自评界面

当 AI 判断为错误时，弹出自评选项：

```
┌─────────────────────────────────────┐
│         答案错误，请选择原因          │
├─────────────────────────────────────┤
│                                     │
│  ○ 低级错误                         │
│     - 笔误/手滑                     │
│     - 鋻别字                        │
│     - 计算失误                      │
│                                     │
│  ○ 高级错误（知识性）               │
│     - 概念不理解                    │
│     - 原理不清楚                    │
│     - 方法不掌握                    │
│                                     │
│  [继续刷题]    [进入解答模式]       │
└─────────────────────────────────────┘
```

---

## 三、技术实现要求

### 3.1 RAG 框架实现

```typescript
// RAG 服务核心接口
interface RAGService {
  // 文档处理
  uploadDocument(file: File): Promise<void>;
  parseDocument(filePath: string): Promise<DocumentChunk[]>;
  vectorizeChunks(chunks: DocumentChunk[]): Promise<void>;

  // 检索
  query(question: string, options?: QueryOptions): Promise<QueryResult[]>;
  hybridQuery(question: string): Promise<QueryResult[]>;

  // 对话
  chat(messages: Message[], stream: boolean): AsyncGenerator<string>;
}
```

### 3.2 LLM 集成要求

**OpenAI API 集成**
- Chat Completions API（对话）
- Embeddings API（向量化）
- Vision API（多模态）

**流式输出实现**
```typescript
async function* streamChat(messages: Message[]): AsyncGenerator<string> {
  const stream = await openai.chat.completions.create({
    messages,
    stream: true,
    // ...
  });

  for await (const chunk of stream) {
    yield chunk.choices[0]?.delta?.content || '';
  }
}
```

### 3.3 提示词工程

**出题 Prompt 模板**
```typescript
const QUIZ_GENERATION_PROMPT = `
你是一位遗传学教师，请根据以下知识点出一道选择题：

知识点：{topic}
难度：{difficulty}
用户水平：{userLevel}

要求：
1. 题目要考查核心概念
2. 4个选项，只有一个正确
3. 不要涉及超纲内容
4. 返回 JSON 格式

返回格式：
{
  "question": "题目内容",
  "options": ["A", "B", "C", "D"],
  "correctAnswer": 0,
  "explanation": {
    "level1": "最简练解析",
    "level2": "简要解释",
    "level3": "标准解析",
    "level4": "详细讲解",
    "level5": "教学级解析"
  }
}
`;
```

**判断 Prompt 模板**
```typescript
const ANSWER_EVALUATION_PROMPT = `
请判断以下答案是否正确：

题目：{question}
正确答案：{correctAnswer}
用户答案：{userAnswer}

要求：
1. 严格判断对错
2. 对于模糊答案，倾向于判错（让用户自评）
3. 返回 JSON 格式

返回格式：
{
  "isCorrect": true/false,
  "confidence": 0-1,
  "reason": "判断理由"
}
`;
```

**举一反三 Prompt 模板**
```typescript
const SIMILAR_QUESTION_PROMPT = `
基于以下错题，生成3道相似题用于巩固练习：

原题：{question}
考点：{topic}
用户错误：{userAnswer}
错误类型：{errorType}

要求：
1. 保持相同知识点和难度
2. 改变题目条件和数值
3. 可以改变问法但考点不变
4. 返回 JSON 格式

返回格式：
{
  "similarQuestions": [
    {
      "question": "变式题1",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0,
      "explanation": "解析"
    }
  ]
}
`;
```

**学情报告 Prompt 模板**
```typescript
const LEARNING_REPORT_PROMPT = `
基于用户学习数据生成学情报告：

用户数据：
{learningData}

包含内容：
- 总题数、正确数、正确率
- 各知识点掌握度
- 错误类型分布（低级/高级）
- 薄弱点分析
- 复习建议

要求：
1. 返回 A2UI 格式的界面结构
2. 包含图表组件展示数据
3. 提供具体可行的复习建议
`;
```

**前置知识探索 Prompt 模板**（核心创新）
```typescript
const PREREQUISITE_EXPLORER_PROMPT = `
你是一位遗传学教育专家。请分析以下遗传学概念，找出理解它所需的前置知识。

目标概念：{concept}

请递归思考："要理解 {concept}，学生必须先掌握什么？"

要求：
1. 列出 3-5 个直接前置概念
2. 对每个前置概念，继续思考它的前置知识
3. 递归深度：{maxDepth} 层
4. 停止条件：达到高中生物学基础水平

返回格式：
{
  "concept": "伴性遗传",
  "prerequisites": [
    {
      "concept": "孟德尔定律",
      "prerequisites": [
        {
          "concept": "基因型/表型",
          "prerequisites": [
            { "concept": "基因", "isFoundation": true },
            { "concept": "显隐性", "isFoundation": true }
          ]
        },
        {
          "concept": "分离定律",
          "prerequisites": [
            { "concept": "减数分裂", "isFoundation": true }
          ]
        }
      ]
    },
    {
      "concept": "性染色体",
      "prerequisites": [
        { "concept": "染色体", "isFoundation": true }
      ]
    }
  ]
}
`;
```

**遗传学知识丰富 Prompt 模板**
```typescript
const GENETICS_ENRICHER_PROMPT = `
你是一位遗传学教师。请为以下遗传学概念添加详细的教学内容。

概念：{concept}

请添加：
1. **核心定义**：用简洁的语言定义这个概念
2. **遗传学定律/原理**：相关的遗传学定律（如孟德尔定律、哈代-温伯格定律等）
3. **关键公式**：遗传学计算公式（如基因型频率、表型比例等）
4. **典型实例**：经典的遗传学实例（如豌豆实验、果蝇实验等）
5. **常见误区**：学生容易混淆的概念
6. **可视化建议**：如何用图表/动画展示这个概念

要求：
- 使用准确的遗传学术语
- 公式使用 LaTeX 格式
- 实例要经典且易于理解
- 返回 JSON 格式

返回格式：
{
  "concept": "伴性遗传",
  "definition": "...",
  "principles": ["孟德尔第一定律", "..."],
  "formulas": {
    "key": "基因型频率计算",
    "latex": "P + Q = 1",
    "variables": { "P": "显性基因频率", "Q": "隐性基因频率" }
  },
  "examples": [
    {
      "name": "红绿色盲遗传",
      "description": "..."
    }
  ],
  "misconceptions": ["...", "..."],
  "visualization": {
    "type": "知识图谱节点",
    "elements": ["染色体", "基因", "性状"],
    "colors": { "male": "BLUE", "female": "PINK" }
  }
}
`;
```

---

## 四、技术栈

### 前端层
- **框架**: React 18 + TypeScript 5.5
- **构建工具**: Vite 5.4
- **状态管理**: Zustand 4.5 / Redux Toolkit
- **动画**: Framer Motion 11.3 / GSAP
- **代码沙箱**: iframe + postMessage（安全执行 AI 生成的可视化代码）
- **AI UI**: **@zhama/a2ui** - A2UI 协议 React 实现（AI 动态生成 UI）

### 可视化组件
- **D3.js**: 数据可视化、力导向图（知识图谱）
- **Rough.js**: 手绘风格几何图形
- **KaTeX**: 数学公式渲染（遗传学概率公式、基因型表示）
- **ECharts**: 备选图表库（学情报告统计图表）

### 后端层
- **框架**: Node.js + NestJS（推荐）/ Python + FastAPI
- **TypeScript**: 类型安全

### 数据存储
- **向量数据库**: Pinecone / Weaviate（RAG 检索）
- **图数据库**: Neo4j（知识图谱存储与查询）
- **缓存**: Redis（常见问题缓存、会话管理）

### AI 层
- **LLM 接入**:
  - OpenAI GPT-4 / Anthropic Claude
  - Azure OpenAI（国内部署备选）
- **RAG 框架**: LangChain / LlamaIndex
- **Graph RAG**: Microsoft GraphRAG
- **OpenAI SDK**: Chat + Embeddings + Vision

### 文档解析
- pdf-parse（PDF 教材解析）
- mammoth（Word 文档解析）
- pptxgenjs（PPTX 解析）

### A2UI 组件库（AI 动态生成）
- Card、Button、Text、List、TextField
- Tabs、Modal、Checkbox
- Chart、Image、Video、Audio

### 3.4 A2UI 动态界面生成

**核心优势**: AI 不再只输出文本，而是直接输出结构化数据自动渲染交互界面

**应用场景**:

##### 速通模式 - AI 动态生成题目卡片
```typescript
// AI 返回的 A2UI 结构
{
  "type": "Card",
  "properties": {
    "child": {
      "type": "Column",
      "properties": {
        "children": [
          {
            "id": "question",
            "type": "Text",
            "properties": {
              "text": { "literal": "豌豆高茎(D)对矮茎(d)为显性，杂合子自交后代表现型比例？" },
              "usageHint": { "literal": "h3" }
            }
          },
          {
            "id": "options",
            "type": "Column",
            "properties": {
              "children": [
                { "type": "Checkbox", "properties": { "label": "A. 3:1" } },
                { "type": "Checkbox", "properties": { "label": "B. 1:1" } },
                { "type": "Checkbox", "properties": { "label": "C. 1:2:1" } },
                { "type": "Checkbox", "properties": { "label": "D. 9:3:3:1" } }
              ]
            }
          },
          {
            "id": "submit",
            "type": "Button",
            "properties": {
              "child": { "type": "Text", "properties": { "text": { "literal": "提交答案" } } },
              "action": { "type": "postback", "payload": "submit_answer" }
            }
          }
        ]
      }
    }
  }
}
```

##### 自评弹窗 - AI 动态生成
```typescript
{
  "type": "Modal",
  "properties": {
    "title": { "literal": "答案错误，请选择原因" },
    "child": {
      "type": "Column",
      "properties": {
        "children": [
          {
            "type": "Tabs",
            "properties": {
              "tabs": [
                { "label": "低级错误", "content": "笔误、手滑、计算失误" },
                { "label": "高级错误", "content": "概念不理解、原理不清楚" }
              ]
            }
          },
          {
            "type": "Button",
            "properties": {
              "child": { "type": "Text", "properties": { "text": { "literal": "继续刷题" } } },
              "action": { "type": "postback", "payload": "continue_quiz" }
            }
          }
        ]
      }
    }
  }
}
```

##### 解析等级展示 - AI 动态生成
```typescript
{
  "type": "Tabs",
  "properties": {
    "tabs": [
      { "label": "简练", "content": { "literal": "3:1" } },
      { "label": "解释", "content": { "literal": "显性:隐性 = 3:1" } },
      { "label": "详细", "content": { "literal": "Dd × Dd → DD:Dd:dd = 1:2:1，表现型为高茎:矮茎 = 3:1" } }
    ]
  }
}
```

##### 深度模式 - 知识图谱节点卡片
```typescript
{
  "type": "Card",
  "properties": {
    "child": {
      "type": "Column",
      "properties": {
        "children": [
          { "type": "Text", "properties": { "text": { "literal": "孟德尔第一定律" } } },
          { "type": "Text", "properties": { "text": { "literal": "掌握度: 80%" } } },
          { "type": "Button", "properties": { "child": { "type": "Text", "properties": { "text": { "literal": "开始复习" } } } } }
        ]
      }
    }
  }
}
```

##### 错题上传界面
```typescript
{
  "type": "Card",
  "properties": {
    "title": { "literal": "上传错题" },
    "child": {
      "type": "Column",
      "properties": {
        "children": [
          {
            "type": "Button",
            "properties": {
              "child": { "type": "Text", "properties": { "text": { "literal": "📷 拍照上传" } } },
              "action": { "type": "postback", "payload": "open_camera" }
            }
          },
          {
            "type": "Button",
            "properties": {
              "child": { "type": "Text", "properties": { "text": { "literal": "📁 选择图片" } } },
              "action": { "type": "postback", "payload": "select_image" }
            }
          },
          {
            "type": "TextField",
            "properties": {
              "placeholder": { "literal": "或手动输入题目内容..." }
            }
          },
          {
            "type": "Button",
            "properties": {
              "child": { "type": "Text", "properties": { "text": { "literal": "AI 识别并保存" } } },
              "action": { "type": "postback", "payload": "analyze_and_save" }
            }
          }
        ]
      }
    }
  }
}
```

##### 举一反三练习界面
```typescript
{
  "type": "Modal",
  "properties": {
    "title": { "literal": "举一反三 - 变式练习" },
    "child": {
      "type": "Column",
      "properties": {
        "children": [
          {
            "type": "Text",
            "properties": {
              "text": { "literal": "基于你的错题，AI 生成了3道相似题：" }
            }
          },
          {
            "type": "Tabs",
            "properties": {
              "tabs": [
                {
                  "label": "变式1",
                  "content": {
                    "type": "Card",
                    "properties": {
                      "child": {
                        "type": "Column",
                        "properties": {
                          "children": [
                            { "type": "Text", "properties": { "text": { "literal": "题目内容..." } } },
                            { "type": "TextField", "properties": { "placeholder": { "literal": "你的答案" } } },
                            { "type": "Button", "properties": { "child": { "type": "Text", "properties": { "text": { "literal": "提交" } } } } }
                          ]
                        }
                      }
                    }
                  }
                },
                { "label": "变式2", "content": { "literal": "..." } },
                { "label": "变式3", "content": { "literal": "..." } }
              ]
            }
          }
        ]
      }
    }
  }
}
```

##### 学情报告界面
```typescript
{
  "type": "Card",
  "properties": {
    "title": { "literal": "📊 学情报告" },
    "child": {
      "type": "Column",
      "properties": {
        "children": [
          {
            "type": "Column",
            "properties": {
              "children": [
                { "type": "Text", "properties": { "text": { "literal": "今日学习概览" } } },
                { "type": "Text", "properties": { "text": { "literal": "总题数: 20 | 正确: 16 | 正确率: 80%" } } }
              ]
            }
          },
          {
            "type": "Chart",
            "properties": {
              "type": { "literal": "pie" },
              "data": {
                "labels": ["正确", "错误"],
                "values": [16, 4]
              }
            }
          },
          {
            "type": "Tabs",
            "properties": {
              "tabs": [
                {
                  "label": "薄弱点",
                  "content": {
                    "type": "List",
                    "properties": {
                      "items": [
                        { "type": "Text", "properties": { "text": { "literal": "🔴 伴性遗传 - 掌握度 60%" } } },
                        { "type": "Text", "properties": { "text": { "literal": "🟡 连锁互换 - 掌握度 75%" } } }
                      ]
                    }
                  }
                },
                {
                  "label": "错误分析",
                  "content": {
                    "type": "Chart",
                    "properties": {
                      "type": { "literal": "bar" },
                      "data": {
                        "labels": ["低级错误", "高级错误"],
                        "values": [2, 2]
                      }
                    }
                  }
                }
              ]
            }
          },
          {
            "type": "Button",
            "properties": {
              "child": { "type": "Text", "properties": { "text": { "literal": "生成复习计划" } } },
              "action": { "type": "postback", "payload": "generate_review_plan" }
            }
          }
        ]
      }
    }
  }
}
```

---

## 五、目录结构

```
ahatutor/
├── src/
│   ├── frontend/                    # 前端代码 (React + Vite)
│   │   ├── components/
│   │   │   ├── SpeedMode/           # 速通模式
│   │   │   │   ├── QuestionCard.tsx     # 题目卡片
│   │   │   │   ├── AnswerInput.tsx      # 回答输入
│   │   │   │   ├── SelfAssess.tsx       # 自评弹窗
│   │   │   │   ├── Explanation.tsx      # 解析展示
│   │   │   │   └── SimilarQuestion.tsx  # 举一反三
│   │   │   ├── DepthMode/           # 深度模式
│   │   │   │   ├── KnowledgeGraph/      # 知识图谱
│   │   │   │   │   ├── GraphVisualization.tsx  # D3.js 力导向图
│   │   │   │   │   ├── NodeCard.tsx            # 节点卡片
│   │   │   │   │   └── LearningPath.tsx        # 学习路径
│   │   │   │   └── ReviewPlan/          # 复习计划
│   │   │   ├── MistakeBook/         # 错题本
│   │   │   │   ├── UploadMistake.tsx    # 错题上传
│   │   │   │   ├── MistakeList.tsx      # 错题列表
│   │   │   │   └── MistakeDetail.tsx    # 错题详情
│   │   │   ├── Report/              # 学情报告
│   │   │   │   ├── DailyReport.tsx      # 日报告
│   │   │   │   ├── WeeklyReport.tsx     # 周报告
│   │   │   │   └── SubjectReport.tsx    # 专题报告
│   │   │   ├── QuizGenerator/       # 智能组卷
│   │   │   │   ├── QuizConfig.tsx       # 组卷配置
│   │   │   │   └── QuizPreview.tsx      # 试卷预览
│   │   │   ├── Visualization/       # 可视化组件
│   │   │   │   ├── CodeSandbox.tsx      # 代码沙箱执行器
│   │   │   │   ├── FormulaRenderer.tsx  # KaTeX 公式渲染
│   │   │   │   └── GraphRenderer.tsx    # D3.js 图表渲染
│   │   │   └── KnowledgeBase/       # 知识库管理
│   │   ├── stores/
│   │   │   ├── speed-mode-store.ts
│   │   │   ├── chat-store.ts
│   │   │   ├── knowledge-store.ts
│   │   │   ├── mistake-store.ts        # 错题本状态
│   │   │   └── report-store.ts         # 报告状态
│   │   ├── prompts/                 # Prompt 模板
│   │   │   ├── quiz-generation.ts
│   │   │   ├── answer-evaluation.ts
│   │   │   ├── explanation.ts
│   │   │   ├── similar-question.ts     # 举一反三
│   │   │   ├── report-generation.ts    # 学情报告
│   │   │   ├── prerequisite-explorer.ts # 前置知识探索
│   │   │   └── genetics-enricher.ts     # 遗传学知识丰富
│   │   └── App.tsx
│   │
│   ├── backend/                     # 后端代码 (NestJS)
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── rag/                 # RAG 服务 (LangChain)
│   │   │   │   │   ├── vector-store.service.ts    # Pinecone/Weaviate
│   │   │   │   │   ├── retriever.service.ts       # GraphRAG 检索
│   │   │   │   │   └── graph-rag.service.ts       # Microsoft GraphRAG
│   │   │   │   ├── llm/                 # LLM 服务
│   │   │   │   │   ├── providers/            # LLM 提供商
│   │   │   │   │   │   ├── openai.service.ts    # OpenAI 接口
│   │   │   │   │   │   ├── claude.service.ts    # Claude 接口
│   │   │   │   │   │   └── index.ts
│   │   │   │   │   ├── stream.service.ts       # 流式输出
│   │   │   │   │   └── chat.service.ts         # 对话管理
│   │   │   │   ├── agents/              # 六 Agent 协作流水线
│   │   │   │   │   ├── concept-analyzer.service.ts     # Agent 1: 概念分析
│   │   │   │   │   ├── prerequisite-explorer.service.ts # Agent 2: 前置探索
│   │   │   │   │   ├── genetics-enricher.service.ts     # Agent 3: 知识丰富
│   │   │   │   │   ├── visual-designer.service.ts       # Agent 4: 视觉设计
│   │   │   │   │   ├── narrative-composer.service.ts    # Agent 5: 叙事作曲
│   │   │   │   │   ├── quiz-generator.service.ts        # Agent 6: 题目生成
│   │   │   │   │   ├── pipeline.service.ts              # Agent 流水线编排
│   │   │   │   │   └── knowledge-tree.service.ts        # 知识树数据结构
│   │   │   │   ├── knowledge-graph/      # 知识图谱 (Neo4j)
│   │   │   │   │   ├── neo4j.service.ts          # Neo4j 连接
│   │   │   │   │   ├── graph-builder.service.ts  # 图构建
│   │   │   │   │   └── path-finder.service.ts    # 路径查找
│   │   │   │   ├── parser/              # 文档解析
│   │   │   │   │   ├── pdf.service.ts
│   │   │   │   │   ├── word.service.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── skills/              # Agent Skills
│   │   │   │   │   ├── web-search.service.ts
│   │   │   │   │   └── resource-recommend.service.ts
│   │   │   │   ├── services/            # 业务服务
│   │   │   │   │   ├── mistake.service.ts     # 错题管理服务
│   │   │   │   │   ├── quiz.service.ts        # 组卷服务
│   │   │   │   │   └── report.service.ts      # 报告生成服务
│   │   │   │   ├── vision/              # 图像识别
│   │   │   │   │   ├── ocr.service.ts          # OCR 文字识别
│   │   │   │   │   └── image-analyzer.service.ts # 题目图片分析
│   │   │   │   └── cache/               # Redis 缓存
│   │   │   │       └── cache.service.ts
│   │   │   ├── shared/                  # 共享代码
│   │   │   │   ├── types/
│   │   │   │   │   ├── agent.types.ts
│   │   │   │   │   ├── knowledge-tree.types.ts
│   │   │   │   │   └── genetics.types.ts
│   │   │   │   └── utils/
│   │   │   │       ├── llm.util.ts
│   │   │   │       └── tree.util.ts
│   │   │   ├── main.ts
│   │   │   └── app.module.ts
│   │   └── test/
│   │
│   └── shared/                      # 前后端共享代码
│       ├── types/
│       └── constants/
│
├── public/
├── documents/                       # 教材文档目录
├── prompts/                         # Prompt 模板（可编辑）
├── data/                            # 数据持久化
│   ├── neo4j/                       # Neo4j 知识图谱数据
│   └── cache/                       # Redis 缓存数据
├── docker-compose.yml               # 本地开发环境
└── package.json
```

---

## 六、开发优先级

### 第一阶段（MVP 核心）

**目标**: 实现基本的速通模式

1. RAG 基础框架
   - 文档上传和解析
   - 向量化存储
   - 基本问答

2. 速通模式基本流程
   - AI 出题
   - 用户回答
   - AI 判断
   - 解答模式

3. 简单 UI
   - 题目展示
   - 答案输入
   - 解析展示

### 第二阶段（错题管理与组卷）

1. 错题管理
   - 错题上传（拍照/图片/手动）
   - OCR 题目识别
   - 错题分类存储
   - 错题列表展示

2. 举一反三
   - 基于错题生成相似题
   - 变式训练
   - 一键加入复习

3. 智能组卷
   - 错题组卷
   - 知识点组卷
   - 自定义组卷

### 第三阶段（学情报告与可视化）

1. 学情报告
   - 日报告生成
   - 薄弱点分析
   - 复习建议

2. 速通模式可视化
   - 学习进度
   - 正确率
   - 薄弱点分析

3. 深度模式
   - 知识图谱
   - 关联知识点推荐
   - 艾宾浩斯复习计划

### 第四阶段（体验优化与扩展）

1. 多轮对话优化
   - 会话历史管理
   - 上下文理解

2. Agent Skills
   - 联网搜索
   - 资源推荐

3. 多模态增强
   - 手写答案识别
   - 图片题目自动批改

---

## 七、验收标准

### 功能验收

**RAG 与问答**
- [ ] 能上传 PDF/Word 教材并成功解析
- [ ] 能基于教材内容回答基本问题

**速通模式**
- [ ] 速通模式完整流程可运行
- [ ] AI 判断准确率 > 80%
- [ ] 解答等级系统正常工作
- [ ] 多轮对话上下文正确
- [ ] 错误记录和统计正确

**错题管理**
- [ ] 拍照上传错题功能正常
- [ ] OCR 识别准确率 > 85%
- [ ] 错题分类存储正确
- [ ] 举一反三生成的题目质量合格

**智能组卷**
- [ ] 各种组卷方式正常工作
- [ ] 试卷难度分布合理
- [ ] 题目无重复

**学情报告**
- [ ] 日报告自动生成
- [ ] 薄弱点分析准确
- [ ] 图表展示正确

### 性能验收

- [ ] 出题响应时间 < 3s
- [ ] 流式输出延迟 < 500ms
- [ ] 文档解析进度可见
- [ ] OCR 识别时间 < 5s
- [ ] 报告生成时间 < 3s

### 用户体验验收

- [ ] 界面简洁清晰
- [ ] 操作流程顺畅
- [ ] 错误提示友好
- [ ] A2UI 界面渲染正常
- [ ] 移动端适配良好

---

*文档版本: MVP-v2 (已对齐 PRD v1.0 标准)*
*更新日期: 2026-02-08*
*对齐内容: 技术栈、产品名称、架构设计*
