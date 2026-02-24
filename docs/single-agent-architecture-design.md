# 单Agent架构设计文档

## 文档概述

本文档描述了AhaTutor项目从双Agent架构优化为单Agent架构的详细设计。该架构优化旨在简化系统复杂度、提升响应速度，同时保持原双Agent的所有功能。

**文档版本**: 1.0  
**创建日期**: 2026-02-23  
**架构类型**: 单Agent统一架构

---

## 1. 架构背景与目标

### 1.1 原双Agent架构

```
┌─────────────────┐         ┌─────────────────┐
│  Agent 1: 对话  │ ──────> │  Agent 2: UI    │
│  交互Agent      │         │  渲染Agent      │
└─────────────────┘         └─────────────────┘
       │                           │
       ├─ 用户意图识别              ├─ JSON模板填充
       ├─ 对话状态管理              ├─ A2UI生成
       ├─ 上下文维护                ├─ UI渲染指令
       └─ 知识检索                  └─ 响应格式化
```

**问题**:
- 两个Agent间通信开销大
- 状态同步复杂
- 资源重复占用
- 响应延迟累积

### 1.2 新单Agent架构

```
┌─────────────────────────────────────────┐
│      Unified Agent: AhaTutor Agent      │
├─────────────────────────────────────────┤
│  核心任务统一处理                       │
│  ├─ 对话交互逻辑                        │
│  ├─ 意图识别与状态管理                  │
│  ├─ 知识库检索与整合                    │
│  ├─ JSON模板填充                        │
│  ├─ A2UI内容生成                        │
│  └─ 本地渲染器调用                      │
└─────────────────────────────────────────┘
```

**优势**:
- ✅ 消除Agent间通信延迟
- ✅ 统一状态管理
- ✅ 资源高效利用
- ✅ 代码维护简化
- ✅ 响应速度提升30%+

---

## 2. 模块结构设计

### 2.1 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Layer                           │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  AI Chat UI  │  │  A2UI        │  │  State       │    │
│  │  Interface   │  │  Renderer     │  │  Management  │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
└────────────────────┬────────────────────────────────────────┘
                     │ SSE / HTTP
┌────────────────────┴────────────────────────────────────────┐
│                   Unified Agent Layer                       │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐   │
│  │         Agent Core (VisualDesignerService)          │   │
│  │  - 统一入口：answerQuestion()                      │   │
│  │  - 任务编排：协调所有子模块                         │   │
│  │  - 状态管理：对话上下文、渲染状态                   │   │
│  │  - 错误处理：统一异常捕获与恢复                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐             │
│  │  对话管理  │ │  意图识别  │ │  上下文    │             │
│  │  模块     │ │  模块     │ │  管理模块  │             │
│  └────────────┘ └────────────┘ └────────────┘             │
│                                                             │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐             │
│  │  知识检索  │ │  模板填充  │ │  A2UI生成  │             │
│  │  模块     │ │  模块     │ │  模块     │             │
│  └────────────┘ └────────────┘ └────────────┘             │
│                                                             │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐             │
│  │  流式输出  │ │  性能监控  │ │  缓存管理  │             │
│  │  模块     │ │  模块     │ │  模块     │             │
│  └────────────┘ └────────────┘ └────────────┘             │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────────┐
│                Supporting Services                          │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  LLM     │  │  RAG     │  │  Knowledge│  │  Vector  │  │
│  │  Service │  │  Service │  │  Graph   │  │  Search  │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  A2UI    │  │  Dynamic │  │  Stream  │  │  Cache   │  │
│  │  Adapter │  │  Viz Gen │  │  Handler │  │  Manager │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────────┐
│              Data & Infrastructure                         │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Redis   │  │  PostgreSQL│  │  Neo4j   │  │  Vector  │  │
│  │  Cache   │  │  Database │  │  KG      │  │  DB      │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 核心模块定义

#### 2.2.1 Agent Core (统一核心)

**类名**: `VisualDesignerService` (已存在，需重构)  
**职责**: 统一入口，协调所有子模块

```typescript
class VisualDesignerService {
  // 统一入口
  async answerQuestion(
    concept: string,
    question: string,
    options: {
      userLevel?: 'beginner' | 'intermediate' | 'advanced';
      enableVisualization?: boolean;
      enableStreaming?: boolean;
      conversationId?: string;
    }
  ): Promise<AgentResponse>;

  // 子模块引用
  private conversationManager: ConversationManager;
  private intentRecognizer: IntentRecognizer;
  private contextManager: ContextManager;
  private knowledgeRetriever: KnowledgeRetriever;
  private templateFiller: TemplateFiller;
  private a2uiGenerator: A2UIGenerator;
  private streamingHandler: StreamingHandler;
  private performanceMonitor: PerformanceMonitor;
  private cacheManager: CacheManager;
}
```

#### 2.2.2 ConversationManager (对话管理模块)

**职责**:
- 管理对话会话
- 处理多轮对话
- 维护对话历史

```typescript
class ConversationManager {
  createSession(userId: string): ConversationSession;
  getSession(sessionId: string): ConversationSession;
  addMessage(sessionId: string, message: ChatMessage): void;
  getHistory(sessionId: string, limit?: number): ChatMessage[];
  clearSession(sessionId: string): void;
  
  // 对话策略
  determineResponseType(context: ConversationContext): 'short' | 'detailed' | 'tutorial';
  generateFollowUpQuestions(context: ConversationContext): string[];
}
```

#### 2.2.3 IntentRecognizer (意图识别模块)

**职责**:
- 分析用户意图
- 分类请求类型
- 提取关键实体

```typescript
class IntentRecognizer {
  recognizeIntent(question: string, context: ConversationContext): IntentResult;
  
  // 意图类型
  enum IntentType {
    QUESTION_EXPLANATION = 'question_explanation',
    VISUALIZATION_REQUEST = 'visualization_request',
    CONCEPT_CONNECTION = 'concept_connection',
    EXAMPLE_REQUEST = 'example_request',
    PRACTICE_TEST = 'practice_test',
    CHITCHAT = 'chitchat'
  }
  
  // 实体提取
  extractEntities(question: string): Entity[];
  
  // 优先级判断
  determinePriority(intent: IntentResult, context: ConversationContext): number;
}
```

#### 2.2.4 ContextManager (上下文管理模块)

**职责**:
- 维护对话上下文
- 管理用户状态
- 追踪学习进度

```typescript
class ContextManager {
  updateContext(sessionId: string, update: Partial<ConversationContext>): void;
  getContext(sessionId: string): ConversationContext;
  
  // 上下文窗口管理
  addToWindow(sessionId: string, item: ContextItem): void;
  getWindow(sessionId: string): ContextItem[];
  
  // 学习状态追踪
  updateLearningProgress(userId: string, concept: string, progress: LearningProgress): void;
  getLearningProgress(userId: string): Map<string, LearningProgress>;
}
```

#### 2.2.5 KnowledgeRetriever (知识检索模块)

**职责**:
- RAG知识检索
- 知识图谱查询
- 向量搜索

```typescript
class KnowledgeRetriever {
  async retrieve(question: string, concept: string): Promise<RetrievalResult>;
  async searchVector(query: string, limit: number): Promise<VectorResult[]>;
  async queryKnowledgeGraph(concept: string): Promise<KGNode[]>;
  
  // 知识整合
  integrateResults(rag: RetrievalResult, kg: KGNode[], vector: VectorResult[]): IntegratedKnowledge;
  
  // 相关概念推荐
  suggestRelatedConcepts(concept: string, limit: number): Promise<ConceptSuggestion[]>;
}
```

#### 2.2.6 TemplateFiller (模板填充模块)

**职责**:
- 根据知识填充JSON模板
- 提取并整合知识内容
- 生成结构化数据

```typescript
class TemplateFiller {
  async fillTemplate(
    templateId: string,
    knowledge: IntegratedKnowledge,
    context: ConversationContext
  ): Promise<StructuredData>;
  
  // 模板管理
  getTemplate(concept: string): Template | undefined;
  validateData(template: Template, data: StructuredData): boolean;
  
  // 动态数据生成
  generatePunnettSquare(concept: string, question: string): PunnettSquareData;
  generateInheritancePath(concept: string, question: string): InheritancePathData;
  generateProbabilityDistribution(concept: string, question: string): ProbabilityDistributionData;
}
```

#### 2.2.7 A2UIGenerator (A2UI生成模块)

**职责**:
- 将结构化数据转换为A2UI
- 生成本地渲染器可识别的JSON
- 确保UI与数据一致性

```typescript
class A2UIGenerator {
  async generateA2UI(
    visualizationType: string,
    data: StructuredData,
    context: ConversationContext
  ): Promise<A2UIPayload>;
  
  // 本地LLM增强
  enhanceWithLLM(template: A2UITemplate, data: StructuredData, question: string): Promise<A2UIPayload>;
  
  // 模板选择
  selectTemplate(concept: string, question: string): A2UITemplate | undefined;
  
  // 降级策略
  generateFallback(templateId: string, data: StructuredData): A2UIPayload;
}
```

#### 2.2.8 StreamingHandler (流式输出模块)

**职责**:
- 处理SSE流式输出
- 智能内容分割
- 实时响应

```typescript
class StreamingHandler {
  async *streamResponse(question: string, context: ConversationContext): AsyncGenerator<StreamChunk>;
  
  // 内容处理
  splitContent(content: string, protectionRules: ProtectionRule[]): string[];
  processChunk(chunk: string, context: StreamContext): ProcessedChunk;
  
  // 流控制
  pauseStream(sessionId: string): void;
  resumeStream(sessionId: string): void;
  cancelStream(sessionId: string): void;
}
```

#### 2.2.9 PerformanceMonitor (性能监控模块)

**职责**:
- 监控系统性能
- 记录关键指标
- 性能优化建议

```typescript
class PerformanceMonitor {
  startMonitoring(sessionId: string): void;
  stopMonitoring(sessionId: string): PerformanceReport;
  
  // 指标记录
  recordMetric(sessionId: string, metric: Metric): void;
  getMetrics(sessionId: string): MetricsSnapshot;
  
  // 告警
  checkThresholds(metrics: MetricsSnapshot): Alert[];
  generateOptimizationSuggestions(report: PerformanceReport): Suggestion[];
}
```

#### 2.2.10 CacheManager (缓存管理模块)

**职责**:
- 管理多级缓存
- 缓存策略
- 缓存失效

```typescript
class CacheManager {
  // 缓存操作
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  invalidatePattern(pattern: string): Promise<void>;
  
  // 缓存策略
  shouldCache(request: AgentRequest): boolean;
  generateKey(request: AgentRequest): string;
  
  // 多级缓存
  getFromL1(key: string): Promise<any>;
  getFromL2(key: string): Promise<any>;
  warmup(pattern: string): Promise<void>;
}
```

---

## 3. 数据流转流程

### 3.1 完整请求处理流程

```
┌─────────────┐
│   用户提问   │ "如何用Punnett方格分析多因素遗传？"
└──────┬──────┘
       │ HTTP POST /api/agents/answer
       ↓
┌───────────────────────────────────────────────────────────┐
│              1. 请求预处理 (Agent Core)                   │
├───────────────────────────────────────────────────────────┤
│  - 解析请求参数                                          │
│  - 获取或创建会话ID                                       │
│  - 初始化性能监控                                         │
│  - 检查缓存                                               │
└──────┬────────────────────────────────────────────────────┘
       │ 缓存命中？
       ├─ Yes → 返回缓存结果
       └─ No → 继续
       ↓
┌───────────────────────────────────────────────────────────┐
│            2. 意图识别 (IntentRecognizer)                 │
├───────────────────────────────────────────────────────────┤
│  输入: "如何用Punnett方格分析多因素遗传？"                │
│  输出: IntentResult {                                     │
│    type: IntentType.VISUALIZATION_REQUEST,               │
│    entities: [                                           │
│      { type: 'concept', value: 'Punnett方格' },        │
│      { type: 'topic', value: '多因素遗传' }            │
│    ],                                                   │
│    priority: 8,                                         │
│    confidence: 0.95                                     │
│  }                                                      │
└──────┬────────────────────────────────────────────────────┘
       ↓
┌───────────────────────────────────────────────────────────┐
│           3. 上下文更新 (ContextManager)                  │
├───────────────────────────────────────────────────────────┤
│  - 获取当前上下文                                         │
│  - 添加当前问题到上下文窗口                               │
│  - 更新用户学习状态                                       │
│  - 识别连续性问题模式                                     │
└──────┬────────────────────────────────────────────────────┘
       ↓
┌───────────────────────────────────────────────────────────┐
│         4. 知识检索 (KnowledgeRetriever)                 │
├───────────────────────────────────────────────────────────┤
│  4.1 RAG检索                                              │
│      └─ 检索多因素遗传相关文档片段                         │
│  4.2 知识图谱查询                                          │
│      └─ 查询"Punnett方格"节点和关系                        │
│  4.3 向量搜索                                              │
│      └─ 搜索相似问题答案                                   │
│  4.4 知识整合                                             │
│      └─ 合并所有来源，生成IntegratedKnowledge              │
└──────┬────────────────────────────────────────────────────┘
       ↓
┌───────────────────────────────────────────────────────────┐
│         5. 模板填充 (TemplateFiller)                     │
├───────────────────────────────────────────────────────────┤
│  输入: IntegratedKnowledge {                              │
│    ragDocuments: [...],                                   │
│    kgNodes: [...],                                        │
│    vectorResults: [...]                                   │
│  }                                                        │
│                                                           │
│  输出: StructuredData {                                   │
│    visualizationType: 'punnett_square',                  │
│    maleGametes: ['AB', 'Ab', 'aB', 'ab'],               │
│    femaleGametes: ['AB', 'Ab', 'aB', 'ab'],             │
│    parentalCross: { male: {...}, female: {...} },        │
│    offspring: [                                           │
│      { genotype: 'AABB', probability: 0.0625 },         │
│      ...                                                  │
│    ],                                                     │
│    explanations: [                                        │
│      "双杂合子杂交的9:3:3:1比例..."                       │
│    ]                                                      │
│  }                                                        │
└──────┬────────────────────────────────────────────────────┘
       ↓
┌───────────────────────────────────────────────────────────┐
│         6. A2UI生成 (A2UIGenerator)                      │
├───────────────────────────────────────────────────────────┤
│  6.1 选择模板                                             │
│      └─ templateId: 'punnett_square_v1'                  │
│  6.2 LLM增强                                              │
│      └─ 使用GLM生成详细的教学性内容                        │
│  6.3 生成A2UI Payload                                    │
│                                                           │
│  输出: A2UIPayload {                                     │
│    type: 'card',                                         │
│    id: 'viz_punnett_123456',                             │
│    children: [                                            │
│      {                                                    │
│        type: 'heading',                                  │
│        properties: {                                      │
│          level: 2,                                       │
│          text: 'Punnett方格 - 多因素遗传示例',           │
│          subtitle: 'AaBb × AaBb 杂交分析'                │
│        }                                                  │
│      },                                                   │
│      {                                                    │
│        type: 'punnett_grid',                             │
│        properties: { rows: [...], cols: [...], cells: [...] }│
│      },                                                   │
│      {                                                    │
│        type: 'probability_chart',                         │
│        properties: { distribution: [...] }                │
│      },                                                   │
│      {                                                    │
│        type: 'explanation',                              │
│        properties: {                                      │
│          title: '多因素遗传的遗传比例',                  │
│          content: '...',                                   │
│          keyPoints: [...]                                 │
│        }                                                  │
│      }                                                    │
│    ],                                                     │
│    metadata: {                                            │
│      generatedBy: 'local-llm',                           │
│      question: '如何用Punnett方格分析多因素遗传？',      │
│      enhancedAt: '2026-02-23T00:00:00Z'                 │
│    }                                                      │
│  }                                                        │
└──────┬────────────────────────────────────────────────────┘
       ↓
┌───────────────────────────────────────────────────────────┐
│        7. 生成文字答案 (LLM Service)                     │
├───────────────────────────────────────────────────────────┤
│  输入: 用户问题 + A2UI内容 + 知识检索结果                 │
│  输出: 详细文字解释                                       │
│                                                           │
│  "Punnett方格是分析多因素遗传的强大工具。当涉及两个或     │
│   更多个基因时，我们可以扩展Punnett方格来预测后代的各     │
│   种基因型和表型组合..."                                   │
└──────┬────────────────────────────────────────────────────┘
       ↓
┌───────────────────────────────────────────────────────────┐
│         8. 流式输出 (StreamingHandler)                  │
├───────────────────────────────────────────────────────────┤
│  - 如果启用流式输出，启动SSE流                            │
│  - 智能分割内容（保护数学公式、代码块）                    │
│  - 分批发送chunk到前端                                    │
└──────┬────────────────────────────────────────────────────┘
       ↓
┌───────────────────────────────────────────────────────────┐
│         9. 响应组装 (Agent Core)                         │
├───────────────────────────────────────────────────────────┤
│  AgentResponse {                                          │
│    answer: "详细文字解释...",                             │
│    visualization: A2UIPayload,                            │
│    sources: [...],                                       │
│    followUpQuestions: [...],                              │
│    learningPath: [...],                                   │
│    performance: PerformanceMetrics                        │
│  }                                                        │
└──────┬────────────────────────────────────────────────────┘
       ↓
┌───────────────────────────────────────────────────────────┐
│        10. 缓存更新 (CacheManager)                       │
├───────────────────────────────────────────────────────────┤
│  - 将响应缓存到L1/L2缓存                                  │
│  - 设置合理的TTL                                          │
│  - 记录缓存命中统计                                       │
└──────┬────────────────────────────────────────────────────┘
       ↓
┌───────────────────────────────────────────────────────────┐
│        11. 性能监控记录 (PerformanceMonitor)             │
├───────────────────────────────────────────────────────────┤
│  - 记录总处理时间                                          │
│  - 记录各模块耗时                                          │
│  - 检查性能阈值                                           │
│  - 生成性能报告                                           │
└──────┬────────────────────────────────────────────────────┘
       ↓
┌─────────────┐
│   返回响应   │ JSON / SSE
└─────────────┘
```

### 3.2 错误处理流程

```
┌─────────────┐
│   模块出错   │
└──────┬──────┘
       │
       ↓
┌───────────────────────────────────────────────────────────┐
│            1. 错误捕获 (Agent Core)                       │
├───────────────────────────────────────────────────────────┤
│  try {                                                   │
│    result = await module.execute();                       │
│  } catch (error) {                                       │
│    errorHandler.handle(error, context);                   │
│  }                                                        │
└──────┬────────────────────────────────────────────────────┘
       │
       ↓
┌───────────────────────────────────────────────────────────┐
│          2. 错误分类 (ErrorHandler)                       │
├───────────────────────────────────────────────────────────┤
│  错误类型:                                                │
│  - RECOVERABLE: 可恢复错误，尝试重试                       │
│  - DEGRADABLE: 可降级错误，提供简化版本                    │
│  - CRITICAL: 严重错误，需要人工干预                        │
│  - TEMPORARY: 临时错误，稍后重试                          │
└──────┬────────────────────────────────────────────────────┘
       │
       ├─ RECOVERABLE → 重试机制
       ├─ DEGRADABLE → 降级策略
       ├─ CRITICAL → 错误报告 + 用户提示
       └─ TEMPORARY → 指数退避重试
       │
       ↓
┌───────────────────────────────────────────────────────────┐
│          3. 恢复策略执行                                │
├───────────────────────────────────────────────────────────┤
│  3.1 重试机制                                             │
│      - 最多重试3次                                         │
│      - 指数退避 (100ms, 300ms, 900ms)                    │
│      - 仅对幂等操作                                       │
│                                                           │
│  3.2 降级策略                                             │
│      - LLM调用失败 → 使用硬编码模板                        │
│      - RAG检索失败 → 仅使用知识图谱                        │
│      - A2UI生成失败 → 返回纯文本答案                       │
│      - 可视化失败 → 提供静态图片替代                       │
│                                                           │
│  3.3 错误报告                                             │
│      - 记录到日志系统                                     │
│      - 发送到监控平台                                     │
│      - 生成错误追踪ID                                     │
│                                                           │
│  3.4 用户提示                                             │
│      - 友好错误消息                                       │
│      - 提供解决方案                                       │
│      - 建议替代操作                                       │
└──────┬────────────────────────────────────────────────────┘
       │
       ↓
┌───────────────────────────────────────────────────────────┐
│          4. 恢复后继续                                  │
├───────────────────────────────────────────────────────────┤
│  - 记录错误和恢复方式                                     │
│  - 更新性能监控指标                                       │
│  - 继续处理请求                                           │
│  - 返回部分结果或降级结果                                 │
└──────┬────────────────────────────────────────────────────┘
       ↓
┌─────────────┐
│   返回响应   │
└─────────────┘
```

---

## 4. 接口规范

### 4.1 核心接口定义

#### 4.1.1 AgentResponse

```typescript
interface AgentResponse {
  // 唯一标识
  id: string;
  
  // 会话信息
  sessionId: string;
  timestamp: Date;
  
  // 答案内容
  answer: string;
  
  // A2UI可视化
  visualization?: A2UIPayload;
  
  // 知识来源
  sources: Source[];
  
  // 后续问题建议
  followUpQuestions?: string[];
  
  // 学习路径
  learningPath?: LearningStep[];
  
  // 元数据
  metadata: {
    intent: IntentResult;
    concepts: string[];
    processingTime: number;
    usedCache: boolean;
    degraded: boolean;
  };
  
  // 性能指标
  performance: PerformanceMetrics;
}
```

#### 4.1.2 AgentRequest

```typescript
interface AgentRequest {
  // 用户问题
  question: string;
  
  // 概念
  concept: string;
  
  // 用户级别
  userLevel?: 'beginner' | 'intermediate' | 'advanced';
  
  // 选项
  options: {
    enableVisualization?: boolean;
    enableStreaming?: boolean;
    maxTokens?: number;
    temperature?: number;
    includeSources?: boolean;
    includeFollowUp?: boolean;
  };
  
  // 会话ID
  sessionId?: string;
  
  // 用户ID
  userId?: string;
}
```

#### 4.1.3 IntentResult

```typescript
interface IntentResult {
  type: IntentType;
  entities: Entity[];
  priority: number;
  confidence: number;
  suggestedVisualization?: VisualizationType;
}
```

#### 4.1.4 ConversationContext

```typescript
interface ConversationContext {
  sessionId: string;
  userId?: string;
  
  // 对话历史
  history: ChatMessage[];
  
  // 上下文窗口
  contextWindow: ContextItem[];
  
  // 当前主题
  currentTopic?: string;
  
  // 学习进度
  learningProgress: Map<string, LearningProgress>;
  
  // 用户偏好
  userPreferences: UserPreferences;
}
```

#### 4.1.5 IntegratedKnowledge

```typescript
interface IntegratedKnowledge {
  // RAG检索结果
  ragDocuments: RetrievalResult[];
  
  // 知识图谱节点
  kgNodes: KGNode[];
  
  // 向量搜索结果
  vectorResults: VectorResult[];
  
  // 整合的摘要
  summary: string;
  
  // 相关概念
  relatedConcepts: ConceptSuggestion[];
  
  // 评分
  confidence: number;
}
```

### 4.2 模块间通信接口

#### 4.2.1 IntentRecognizer → ContextManager

```typescript
interface IntentToContext {
  sessionId: string;
  intent: IntentResult;
  question: string;
  timestamp: Date;
}

// ContextManager.updateContext(intent: IntentToContext)
```

#### 4.2.2 ContextManager → KnowledgeRetriever

```typescript
interface ContextToKnowledge {
  sessionId: string;
  context: ConversationContext;
  question: string;
  concept: string;
}

// KnowledgeRetriever.retrieve(...)
```

#### 4.2.3 KnowledgeRetriever → TemplateFiller

```typescript
interface KnowledgeToTemplate {
  knowledge: IntegratedKnowledge;
  intent: IntentResult;
  question: string;
}

// TemplateFiller.fillTemplate(...)
```

#### 4.2.4 TemplateFiller → A2UIGenerator

```typescript
interface TemplateToA2UI {
  templateId: string;
  data: StructuredData;
  knowledge: IntegratedKnowledge;
  context: ConversationContext;
}

// A2UIGenerator.generateA2UI(...)
```

#### 4.2.5 A2UIGenerator → StreamingHandler

```typescript
interface A2UIToStream {
  a2uiPayload: A2UIPayload;
  answer: string;
  sessionId: string;
}

// StreamingHandler.streamResponse(...)
```

---

## 5. 错误处理机制

### 5.1 错误分类体系

```typescript
enum ErrorCategory {
  // 可恢复错误
  RECOVERABLE = 'recoverable',
  
  // 可降级错误
  DEGRADABLE = 'degradable',
  
  // 严重错误
  CRITICAL = 'critical',
  
  // 临时错误
  TEMPORARY = 'temporary'
}

enum ErrorModule {
  INTENT_RECOGNIZER = 'intent_recognizer',
  KNOWLEDGE_RETRIEVER = 'knowledge_retriever',
  TEMPLATE_FILLER = 'template_filler',
  A2UI_GENERATOR = 'a2ui_generator',
  LLM_SERVICE = 'llm_service',
  STREAMING_HANDLER = 'streaming_handler',
  CACHE_MANAGER = 'cache_manager'
}

interface AgentError {
  code: string;
  category: ErrorCategory;
  module: ErrorModule;
  message: string;
  details?: any;
  timestamp: Date;
  stackTrace?: string;
  recoverable: boolean;
}
```

### 5.2 错误处理策略

#### 5.2.1 重试机制

```typescript
class RetryStrategy {
  async executeWithRetry<T>(
    fn: () => Promise<T>,
    options: {
      maxRetries?: number;
      backoffMultiplier?: number;
      initialDelay?: number;
      retryableErrors?: string[];
    }
  ): Promise<T> {
    const {
      maxRetries = 3,
      backoffMultiplier = 3,
      initialDelay = 100,
      retryableErrors = ['TEMPORARY', 'NETWORK_ERROR']
    } = options;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        if (attempt === maxRetries) throw error;
        
        if (!this.isRetryable(error, retryableErrors)) {
          throw error;
        }
        
        const delay = initialDelay * Math.pow(backoffMultiplier, attempt - 1);
        await this.sleep(delay);
      }
    }
    
    throw new Error('Max retries exceeded');
  }
  
  private isRetryable(error: any, retryableErrors: string[]): boolean {
    return retryableErrors.includes(error.category) || 
           retryableErrors.includes(error.code);
  }
  
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

#### 5.2.2 降级策略

```typescript
class FallbackStrategy {
  async executeWithFallback<T>(
    primaryFn: () => Promise<T>,
    fallbackFns: Array<() => Promise<T>>,
    context: any
  ): Promise<T> {
    try {
      return await primaryFn();
    } catch (error) {
      this.logger.warn(`Primary function failed, trying fallback: ${error.message}`);
      
      for (const fallbackFn of fallbackFns) {
        try {
          const result = await fallbackFn();
          this.logger.log('Fallback succeeded');
          return result;
        } catch (fallbackError) {
          this.logger.warn(`Fallback failed: ${fallbackError.message}`);
        }
      }
      
      throw new Error('All fallbacks failed');
    }
  }
  
  // 具体降级场景
  async getVisualization(concept: string, question: string): Promise<A2UIPayload> {
    const primary = () => this.a2uiGenerator.generateA2UI(concept, question);
    
    const fallbacks = [
      // 降级1: 使用硬编码模板
      () => this.getHardcodedVisualization(concept),
      
      // 降级2: 生成简化版A2UI
      () => this.generateSimplifiedA2UI(concept, question),
      
      // 降级3: 返回纯文本
      () => this.generateTextOnlyResponse(concept, question)
    ];
    
    return this.executeWithFallback(primary, fallbacks, { concept, question });
  }
}
```

#### 5.2.3 错误报告

```typescript
class ErrorReporter {
  async report(error: AgentError, context: any): Promise<string> {
    const errorId = this.generateErrorId();
    
    // 1. 记录到日志
    this.logger.error(`[${errorId}] ${error.message}`, {
      error,
      context,
      stackTrace: error.stackTrace
    });
    
    // 2. 发送到监控系统
    await this.sendToMonitoring(error, context);
    
    // 3. 通知开发团队（严重错误）
    if (error.category === ErrorCategory.CRITICAL) {
      await this.alertTeam(error, errorId);
    }
    
    return errorId;
  }
  
  private generateErrorId(): string {
    return `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private async sendToMonitoring(error: AgentError, context: any): Promise<void> {
    // 发送到Sentry/DataDog等
  }
  
  private async alertTeam(error: AgentError, errorId: string): Promise<void> {
    // 发送Slack/邮件通知
  }
}
```

### 5.3 错误恢复矩阵

| 模块 | 错误场景 | 恢复策略 | 用户体验 |
|------|---------|---------|---------|
| IntentRecognizer | LLM调用失败 | 使用规则引擎降级 | 正常响应，精度略降 |
| KnowledgeRetriever | RAG检索失败 | 仅使用知识图谱 | 正常响应，来源减少 |
| TemplateFiller | 模板匹配失败 | 生成通用模板 | 正常响应，内容通用 |
| A2UIGenerator | LLM增强失败 | 使用基础模板 | 正常响应，内容简化 |
| LLMService | API超时 | 重试 + 使用备用模型 | 响应稍慢 |
| StreamingHandler | SSE断开 | 自动重连 | 短暂中断 |
| CacheManager | 缓存失效 | 直接计算 | 响应稍慢 |

---

## 6. 性能优化策略

### 6.1 缓存策略

#### 6.1.1 多级缓存架构

```
L1 Cache: 内存缓存 (Redis)
    ↓ 命中率: 40%
    TTL: 5分钟
    
L2 Cache: 分布式缓存 (Redis Cluster)
    ↓ 命中率: 30%
    TTL: 1小时
    
L3 Cache: CDN缓存 (静态资源)
    ↓ 命中率: 20%
    TTL: 1天

Database: 原始数据
```

#### 6.1.2 缓存Key设计

```typescript
class CacheKeyGenerator {
  generateQuestionCacheKey(request: AgentRequest): string {
    const hash = this.hash(JSON.stringify({
      question: request.question,
      concept: request.concept,
      userLevel: request.userLevel,
      options: request.options
    }));
    
    return `agent:question:${hash}`;
  }
  
  generateA2UICacheKey(concept: string, templateId: string): string {
    return `agent:a2ui:${concept}:${templateId}`;
  }
  
  generateKnowledgeCacheKey(concept: string): string {
    return `agent:knowledge:${concept}`;
  }
  
  private hash(data: string): string {
    // 使用SHA256或MurmurHash
    return crypto.createHash('sha256').update(data).digest('hex');
  }
}
```

#### 6.1.3 缓存预热

```typescript
class CacheWarmup {
  async warmupPopularConcepts(): Promise<void> {
    const popularConcepts = await this.getPopularConcepts();
    
    for (const concept of popularConcepts) {
      try {
        // 预加载知识
        await this.knowledgeRetriever.retrieve(concept, '');
        
        // 预加载A2UI模板
        await this.a2uiGenerator.generateA2UI(concept, {});
        
        this.logger.log(`Warmed up: ${concept}`);
      } catch (error) {
        this.logger.warn(`Failed to warmup ${concept}: ${error.message}`);
      }
    }
  }
}
```

### 6.2 并发处理

#### 6.2.1 并行任务执行

```typescript
class ParallelExecutor {
  async executeInParallel<T>(
    tasks: Array<() => Promise<T>>,
    options: {
      maxConcurrency?: number;
      failFast?: boolean;
    } = {}
  ): Promise<T[]> {
    const { maxConcurrency = 5, failFast = false } = options;
    
    const results: T[] = [];
    const errors: Error[] = [];
    
    const chunks = this.chunk(tasks, maxConcurrency);
    
    for (const chunk of chunks) {
      const promises = chunk.map(task => 
        task().catch(error => {
          if (failFast) throw error;
          errors.push(error);
          return null;
        })
      );
      
      const chunkResults = await Promise.all(promises);
      results.push(...chunkResults);
    }
    
    if (errors.length > 0 && !failFast) {
      this.logger.warn(`${errors.length} tasks failed`);
    }
    
    return results.filter(r => r !== null) as T[];
  }
  
  private chunk<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}
```

#### 6.2.2 应用场景

```typescript
// 在Agent Core中
async processRequest(request: AgentRequest): Promise<AgentResponse> {
  const parallelExecutor = new ParallelExecutor();
  
  // 并行执行独立任务
  const [intent, context, cachedResponse] = await parallelExecutor.executeInParallel([
    () => this.intentRecognizer.recognizeIntent(request.question, {}),
    () => this.contextManager.getContext(request.sessionId || ''),
    () => this.cacheManager.get<AgentResponse>(this.generateCacheKey(request))
  ]);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // 继续处理...
}
```

### 6.3 流式输出优化

#### 6.3.1 智能分块

```typescript
class SmartChunker {
  splitForStreaming(content: string, maxSize: number = 500): string[] {
    const chunks: string[] = [];
    let current = '';
    
    const sentences = content.split(/([.!?。！？])/);
    
    for (let i = 0; i < sentences.length; i += 2) {
      const sentence = sentences[i] + (sentences[i + 1] || '');
      
      // 检查是否是受保护的内容（数学公式、代码块）
      if (this.isProtectedContent(sentence)) {
        chunks.push(current + sentence);
        current = '';
      } else if (current.length + sentence.length > maxSize) {
        chunks.push(current);
        current = sentence;
      } else {
        current += sentence;
      }
    }
    
    if (current) chunks.push(current);
    
    return chunks;
  }
  
  private isProtectedContent(text: string): boolean {
    return text.includes('$$') || text.includes('```') || text.includes('\\[');
  }
}
```

#### 6.3.2 流控制

```typescript
class StreamController {
  private activeStreams: Map<string, AbortController> = new Map();
  
  async *streamResponse(
    sessionId: string,
    generator: AsyncGenerator<string>
  ): AsyncGenerator<string> {
    const controller = new AbortController();
    this.activeStreams.set(sessionId, controller);
    
    try {
      for await (const chunk of generator) {
        if (controller.signal.aborted) {
          break;
        }
        yield chunk;
      }
    } finally {
      this.activeStreams.delete(sessionId);
    }
  }
  
  pauseStream(sessionId: string): void {
    const controller = this.activeStreams.get(sessionId);
    if (controller) {
      // 实现暂停逻辑
    }
  }
  
  resumeStream(sessionId: string): void {
    const controller = this.activeStreams.get(sessionId);
    if (controller) {
      // 实现恢复逻辑
    }
  }
  
  cancelStream(sessionId: string): void {
    const controller = this.activeStreams.get(sessionId);
    if (controller) {
      controller.abort();
    }
  }
}
```

### 6.4 数据库优化

#### 6.4.1 查询优化

```typescript
class OptimizedQueries {
  // 批量查询
  async batchGetConcepts(conceptIds: string[]): Promise<Concept[]> {
    const query = `
      SELECT * FROM concepts 
      WHERE id = ANY($1)
    `;
    return this.db.query(query, [conceptIds]);
  }
  
  // 分页查询
  async getPaginatedHistory(
    sessionId: string,
    page: number,
    limit: number
  ): Promise<ChatMessage[]> {
    const offset = (page - 1) * limit;
    const query = `
      SELECT * FROM chat_messages
      WHERE session_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;
    return this.db.query(query, [sessionId, limit, offset]);
  }
  
  // 索引提示
  async searchWithIndex(term: string): Promise<SearchResult[]> {
    const query = `
      SELECT * FROM knowledge_base
      WHERE content @@ plainto_tsquery('english', $1)
      AND category IN ('genetics', 'biology')
      LIMIT 10
    `;
    return this.db.query(query, [term]);
  }
}
```

#### 6.4.2 连接池管理

```typescript
class ConnectionPoolManager {
  private pool: Pool;
  
  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000
    });
  }
  
  async query(text: string, params?: any[]): Promise<any> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(text, params);
      return result.rows;
    } finally {
      client.release();
    }
  }
}
```

### 6.5 监控与调优

#### 6.5.1 性能指标

```typescript
interface PerformanceMetrics {
  // 总体指标
  totalProcessingTime: number;
  
  // 模块耗时
  intentRecognitionTime: number;
  knowledgeRetrievalTime: number;
  templateFillingTime: number;
  a2uiGenerationTime: number;
  
  // 资源使用
  memoryUsage: number;
  cpuUsage: number;
  
  // 缓存指标
  cacheHitRate: number;
  cacheMissRate: number;
  
  // 错误指标
  errorCount: number;
  errorRate: number;
  
  // 用户指标
  responseTime: number;
  userSatisfaction: number;
}
```

#### 6.5.2 自动调优

```typescript
class AutoTuner {
  async tuneParameters(): Promise<void> {
    const metrics = await this.performanceMonitor.getAverageMetrics();
    
    // 调整缓存TTL
    if (metrics.cacheHitRate < 0.4) {
      this.increaseCacheTTL();
    }
    
    // 调整并发数
    if (metrics.responseTime > 2000) {
      this.increaseConcurrency();
    }
    
    // 调整批处理大小
    if (metrics.cpuUsage > 0.8) {
      this.decreaseBatchSize();
    }
  }
  
  private increaseCacheTTL(): void {
    const currentTTL = this.cacheConfig.ttl;
    this.cacheConfig.ttl = currentTTL * 1.5;
    this.logger.log(`Increased cache TTL to ${this.cacheConfig.tTL}`);
  }
}
```

---

## 7. 部署与运维

### 7.1 容器化部署

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist

EXPOSE 3001

CMD ["node", "dist/main.js"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    depends_on:
      - redis
      - postgres
    restart: always
    
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: always
    
  postgres:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=${DB_NAME}
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always

volumes:
  redis_data:
  postgres_data:
```

### 7.2 监控配置

```typescript
// prometheus.config.ts
import { register, Counter, Histogram, Gauge } from 'prom-client';

export const metrics = {
  // 请求计数
  requestCounter: new Counter({
    name: 'agent_requests_total',
    help: 'Total number of agent requests',
    labelNames: ['concept', 'intent_type', 'status']
  }),
  
  // 请求耗时
  requestDuration: new Histogram({
    name: 'agent_request_duration_seconds',
    help: 'Agent request duration in seconds',
    labelNames: ['module'],
    buckets: [0.1, 0.5, 1, 2, 5, 10]
  }),
  
  // 缓存命中率
  cacheHitRate: new Gauge({
    name: 'agent_cache_hit_rate',
    help: 'Cache hit rate'
  }),
  
  // 活跃会话数
  activeSessions: new Gauge({
    name: 'agent_active_sessions',
    help: 'Number of active sessions'
  })
};

register.registerMetric(metrics.requestCounter);
register.registerMetric(metrics.requestDuration);
register.registerMetric(metrics.cacheHitRate);
register.registerMetric(metrics.activeSessions);
```

### 7.3 日志管理

```typescript
// logger.config.ts
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

export const loggerConfig = WinstonModule.createLogger({
  transports: [
    // 控制台输出
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          return `${timestamp} [${level}]: ${message} ${JSON.stringify(meta)}`;
        })
      )
    }),
    
    // 文件日志（按天轮转）
    new winston.transports.DailyRotateFile({
      filename: 'logs/agent-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    }),
    
    // 错误日志
    new winston.transports.DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',
      maxFiles: '30d',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    })
  ]
});
```

---

## 8. 测试策略

### 8.1 单元测试

```typescript
// intent-recognizer.spec.ts
describe('IntentRecognizer', () => {
  let recognizer: IntentRecognizer;
  
  beforeEach(() => {
    recognizer = new IntentRecognizer(llmService);
  });
  
  describe('recognizeIntent', () => {
    it('should recognize visualization request', async () => {
      const result = await recognizer.recognizeIntent(
        '如何用Punnett方格分析多因素遗传？',
        {}
      );
      
      expect(result.type).toBe(IntentType.VISUALIZATION_REQUEST);
      expect(result.entities).toHaveLength(2);
      expect(result.confidence).toBeGreaterThan(0.8);
    });
    
    it('should extract entities correctly', async () => {
      const result = await recognizer.recognizeIntent(
        '什么是孟德尔第一定律？',
        {}
      );
      
      expect(result.entities).toContainEqual(
        expect.objectContaining({
          type: 'concept',
          value: '孟德尔第一定律'
        })
      );
    });
  });
});
```

### 8.2 集成测试

```typescript
// agent.integration.spec.ts
describe('Agent Integration', () => {
  let agent: VisualDesignerService;
  
  beforeAll(async () => {
    agent = await createTestAgent();
  });
  
  describe('end-to-end flow', () => {
    it('should process complete request', async () => {
      const response = await agent.answerQuestion(
        '遗传学',
        '如何用Punnett方格分析多因素遗传？',
        { userLevel: 'intermediate' }
      );
      
      expect(response).toHaveProperty('answer');
      expect(response).toHaveProperty('visualization');
      expect(response).toHaveProperty('sources');
      expect(response.performance.totalProcessingTime).toBeLessThan(5000);
    });
  });
});
```

### 8.3 性能测试

```typescript
// performance.spec.ts
describe('Performance Tests', () => {
  it('should handle 100 concurrent requests', async () => {
    const requests = Array(100).fill(null).map((_, i) => 
      agent.answerQuestion(
        '遗传学',
        `测试问题 ${i}`,
        {}
      )
    );
    
    const startTime = Date.now();
    const results = await Promise.all(requests);
    const duration = Date.now() - startTime;
    
    expect(results).toHaveLength(100);
    expect(duration).toBeLessThan(10000); // 平均每请求 < 100ms
  });
});
```

---

## 9. 迁移计划

### 9.1 阶段1：架构重构 (2周)

- [ ] 重构VisualDesignerService为统一Agent Core
- [ ] 创建新的子模块类
- [ ] 实现模块间接口
- [ ] 编写单元测试

### 9.2 阶段2：功能迁移 (3周)

- [ ] 迁移对话管理逻辑
- [ ] 迁移意图识别逻辑
- [ ] 迁移知识检索逻辑
- [ ] 迁移A2UI生成逻辑

### 9.3 阶段3：优化与测试 (2周)

- [ ] 实现性能优化
- [ ] 实现错误处理机制
- [ ] 编写集成测试
- [ ] 性能基准测试

### 9.4 阶段4：部署与监控 (1周)

- [ ] 准备部署配置
- [ ] 配置监控告警
- [ ] 灰度发布
- [ ] 全量发布

---

## 10. 总结

本单Agent架构设计实现了：

✅ **统一协调**: 所有功能在单一Agent中统一管理  
✅ **高效通信**: 消除Agent间通信开销  
✅ **状态管理**: 统一的上下文和状态管理  
✅ **错误恢复**: 多层次的错误处理和降级策略  
✅ **性能优化**: 多级缓存、并行处理、流式输出  
✅ **可维护性**: 清晰的模块边界和接口定义  
✅ **可扩展性**: 易于添加新功能模块  
✅ **可观测性**: 完善的监控和日志系统

**预期收益**:
- 响应速度提升 30%+
- 代码维护成本降低 40%
- 系统资源占用减少 25%
- 开发效率提升 20%

---

**文档维护者**: 开发团队  
**审核者**: 架构师  
**最后更新**: 2026-02-23
