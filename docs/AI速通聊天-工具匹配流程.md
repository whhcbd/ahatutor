# AI速通聊天工具匹配流程详解

## 概述

用户在AI速通聊天中提问时，系统通过**RAG检索 + Embedding相似度匹配**来动态选择合适的A2UI可视化模板，并生成回答。

---

## 完整流程

### 步骤1：用户提问

**端点**: `POST /agent/visualize/ask`

**请求体**:
```json
{
  "concept": "孟德尔第一定律",
  "question": "Aa x Aa 杂交的后代基因型比例是多少？",
  "userLevel": "intermediate",
  "conversationHistory": []
}
```

---

### 步骤2：VisualDesignerService 处理

**文件**: `src/backend/src/modules/agents/visual-designer.service.ts`

**入口方法**: `answerQuestion(concept, question, userLevel, conversationHistory)`

**核心逻辑**:
```typescript
async answerQuestion(
  concept: string,
  question: string,
  userLevel: 'beginner' | 'intermediate' | 'advanced',
  conversationHistory: Array<{ role: string; content: string }>
): Promise<{ type: string; title: string; ... }> {
  // 1. 生成动态可视化
  const dynamicResult = await this.dynamicVizGenerator.generateDynamicVisualization({
    question,
    concept,
    userLevel
  });

  // 2. 返回D3.js渲染配置
  return {
    type: dynamicResult.visualizationData.type || 'punnett_square',
    title: dynamicResult.visualizationData.title || `动态可视化：${concept}`,
    description: dynamicResult.visualizationData.description || '基于 AI 动态生成的可视化',
    data: dynamicResult.visualizationData.data,
    colors: this.getDefaultColors(dynamicResult.visualizationData.type || 'punnett_square'),
    elements: dynamicResult.visualizationData.elements || [],
    interactions: ['hover', 'click'],
  };
}
```

---

### 步骤3：DynamicVizGeneratorService 匹配模板

**文件**: `src/backend/src/modules/agents/dynamic-viz-generator.service.ts`

**核心方法**: `generateDynamicVisualization(input: DynamicVizInput)`

#### 3.1 提取核心概念

```typescript
private async extractConcept(question: string): Promise<string> {
  const prompt = `从以下问题中提取核心遗传学概念（不超过10个字）：\n${question}`;
  const response = await this.llmService.chat([
    { role: 'user', content: prompt }
  ], { temperature: 0.1 });
  return response.content.trim();
}
```

**示例**:
- 输入: "Aa x Aa 杂交的后代基因型比例是多少？"
- 输出: "孟德尔第一定律"

#### 3.2 RAG检索相关知识

```typescript
const ragResult = await this.ragService.query({
  query: question,
  topK: 5,
  threshold: 0.6
});
```

**检索来源**:
- **Fine-grained RAG**: `data/external/genetics-rag/`（预生成的教科书向量）
- **知识库概念**: `knowledge-base/data/`（硬编码的51个概念）

**返回示例**:
```json
{
  "results": [
    {
      "id": "chunk_fine_123",
      "content": "孟德尔第一定律（分离定律）是指...",
      "score": 0.85,
      "metadata": {
        "chapter": "Genetics",
        "level": 1
      }
    }
  ]
}
```

#### 3.3 检索A2UI模板

```typescript
private async retrieveVisualizationTemplates(
  concept: string,
  question: string
): Promise<VisualizationTemplateMatch[]> {
  const topK = 3;
  const threshold = 0.6;

  // 1. 生成概念的embedding
  const conceptEmbedding = await this.llmService.embed(concept);
  
  // 2. 生成问题的embedding
  const questionEmbedding = await this.llmService.embed(question);
  
  // 3. 计算每个模板的相似度
  const matches = await Promise.all(this.templates.map(async (template) => {
    const templateEmbedding = await this.llmService.embed(
      `${template.concept} ${template.conceptKeywords.join(' ')}`
    );
    
    // 计算概念相似度
    const conceptSimilarity = this.cosineSimilarity(conceptEmbedding, templateEmbedding);
    
    // 计算问题相似度
    const questionSimilarity = this.cosineSimilarity(questionEmbedding, templateEmbedding);
    
    // 综合相似度：70%概念 + 30%问题
    const combinedSimilarity = conceptSimilarity * 0.7 + questionSimilarity * 0.3;
    
    return {
      template,
      similarity: combinedSimilarity,
      matchReason: `概念相似度: ${conceptSimilarity.toFixed(2)}, 问题相似度: ${questionSimilarity.toFixed(2)}`
    };
  }));
  
  // 4. 过滤并排序
  return matches
    .filter(m => m.similarity >= threshold)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);
}
```

**模板来源**: `src/backend/src/modules/agents/data/a2ui-templates.data.ts`

**示例模板匹配**:
```json
[
  {
    "template": {
      "templateId": "punnett_square_v1",
      "concept": "孟德尔定律",
      "conceptKeywords": ["孟德尔", "第一定律", "分离", "杂交", "基因型"],
      "vizType": "punnett_square",
      "vizCategory": "核心工具",
      "title": "庞氏方格",
      "description": "单基因/两基因杂交预测工具",
      "applicableScenarios": ["单基因杂交", "两基因杂交", "基因型预测"]
    },
    "similarity": 0.92,
    "matchReason": "概念相似度: 0.95, 问题相似度: 0.85"
  },
  {
    "template": {
      "templateId": "pedigree_chart_v1",
      "concept": "遗传病分析",
      "conceptKeywords": ["系谱", "家系", "遗传病", "家族"],
      "vizType": "pedigree_chart",
      "vizCategory": "核心工具",
      "title": "家系表",
      "description": "人类遗传病分析工具",
      "applicableScenarios": ["系谱图分析", "遗传病诊断", "携带者识别"]
    },
    "similarity": 0.85,
    "matchReason": "概念相似度: 0.88, 问题相似度: 0.78"
  }
]
```

#### 3.4 LLM生成最终回答

```typescript
const prompt = this.buildGenerationPrompt({
  question,
  concept: conceptText,
  knowledgeContent,  // RAG检索的内容
  recommendedTemplates,  // 匹配的模板
  userLevel
});

const response = await this.llmService.structuredChat<DynamicVizResponse>(
  [{ role: 'user', content: prompt }],
  DYNAMIC_VIZ_RESPONSE_SCHEMA,
  { temperature: 0.3 }
);
```

**Prompt构建**:
```
基于用户问题："${question}"

提取的核心概念：${conceptText}

相关知识（RAG检索）：
${knowledgeContent}

推荐的A2UI模板：
1. punnett_square_v1 (相似度: 0.92)
   - 庞氏方格
   - 单基因/两基因杂交预测工具
   - 适用场景：单基因杂交, 两基因杂交, 基因型预测

2. pedigree_chart_v1 (相似度: 0.85)
   - 家系表
   - 人类遗传病分析工具
   - 适用场景：系谱图分析, 遗传病诊断, 携带者识别

请选择最合适的模板，并生成回答。
```

**LLM返回结构**:
```json
{
  "visualizationApplicable": true,
  "applicableReason": "用户问题涉及孟德尔杂交，适合使用庞氏方格工具",
  "selectedTemplate": {
    "templateId": "punnett_square_v1",
    "reason": "相似度最高(0.92)，且完全匹配用户问题场景"
  },
  "extractedData": {
    "parent1": "Aa",
    "parent2": "Aa",
    "title": "庞氏方格",
    "showGenotype": true,
    "showPhenotype": true
  },
  "visualizationData": {
    "type": "punnett_square",
    "title": "庞氏方格 - Aa x Aa",
    "description": "基于AI动态生成的可视化",
    "data": { ... },
    "elements": [ ... ]
  },
  "textAnswer": {
    "mainAnswer": "Aa x Aa 杂交的后代基因型比例为：1 AA : 2 Aa : 1 aa",
    "keyPoints": [
      "根据孟德尔第一定律（分离定律）",
      "杂合子(Aa)自交时，配子各为A和a",
      "A和a结合的概率各为1/2",
      "后代基因型比例为1:2:1（AA:Aa:aa）"
    ],
    "examples": [
      "如果用户问：Bb x Bb",
      "答案：1 BB : 2 Bb : 1 bb"
    ],
    "commonMistakes": [
      "不要忘记配子的概率是相等的",
      "注意显隐性关系，Aa是显性，aa是隐性"
    ],
    "citations": [
      {
        "source": "Fine-grained RAG",
        "chunkId": "chunk_fine_45",
        "relevance": 0.85
      },
      {
        "source": "Knowledge Base",
        "concept": "孟德尔第一定律",
        "relevance": 0.78
      }
    ]
  },
  "educationalAids": {
    "hints": ["可以画个简单的图帮助理解", "记住显隐性的表示方法"],
    "resources": ["https://...", "https://..."],
    "relatedConcepts": ["孟德尔第二定律", "伴性遗传"]
  }
}
```

---

## 关键判断逻辑

### 1. 概念提取

**方法**: LLM直接提取
**输入**: 用户问题
**输出**: 核心概念（10字以内）
**示例**:
```
问题: "Aa x Aa 杂交的后代基因型比例是多少？"
→ 概念: "孟德尔第一定律"
```

### 2. RAG知识检索

**数据源**:
- Fine-grained RAG（教科书向量，2000维）
- Knowledge Base（硬编码概念，Map存储）

**检索算法**: 余弦相似度
**返回**: Top 5个最相关内容（score > 0.6）

### 3. 模板匹配

**匹配策略**: Embedding相似度 + 关键词覆盖

**评分公式**:
```typescript
combinedSimilarity = (conceptSimilarity * 0.7) + (questionSimilarity * 0.3)
```

**过滤条件**:
- 相似度 >= 0.6
- 返回Top 3个模板

**排序**: 按相似度降序

### 4. LLM选择和生成

**LLM角色**: 根据以下因素选择最合适的模板
- 相似度分数
- 用户问题语境
- 用户水平
- 适用场景匹配

**生成内容**:
- 选择哪个模板
- 为什么选择
- 提取的数据
- 文字回答
- 教学辅助信息
- 引用来源

---

## 为什么A2UI模板不需要向量化

### 原因分析

**A2UI模板文件**: `a2ui-templates.data.ts`（13个静态模板）

**不是预向量化的原因**:

1. **模板是Schema定义**：
   - 定义数据结构
   - 定义默认值
   - 定义验证规则
   - 不需要语义表示

2. **动态匹配而非静态检索**：
   - 系统在运行时动态计算相似度
   - 每次提问都会重新匹配
   - 根据用户问题实时选择

3. **两阶段Embedding**：
   ```
   阶段1（概念提取）：
     概念 → embedding（用于模板匹配）
   
   阶段2（模板匹配）：
     概念embedding vs 模板embedding → 相似度
   ```

4. **RAG提供上下文**：
   - RAG返回相关教科书内容
   - LLM结合上下文选择模板
   - 不是直接用模板embedding检索

### 对比说明

| 项目 | 是否预向量化 | 原因 |
|------|-----------|------|
| **教科书向量** | ✅ 是 | 静态数据，预生成embedding |
| **知识库概念** | ❌ 否 | Map存储，字符串匹配 |
| **A2UI模板** | ❌ 否 | 动态匹配，实时embedding |

---

## 完整调用链路

```
用户问题
   ↓
[端点] POST /agent/visualize/ask
   ↓
[服务1] VisualDesignerService.answerQuestion()
   ↓
   ├─ [服务2] DynamicVizGeneratorService.generateDynamicVisualization()
   │   ├─ [LLM] extractConcept() → 提取概念
   │   ├─ [RAG] query() → 检索知识
   │   ├─ [LLM] embed() × 2 → 生成embedding
   │   ├─ [算法] cosineSimilarity() → 计算相似度
   │   ├─ [匹配] retrieveVisualizationTemplates() → 匹配模板
   │   └─ [LLM] structuredChat() → 生成最终回答
   ↓
返回D3.js配置
   ↓
前端A2UI渲染
```

---

## 配置参数

### RAG配置（`rag.config.ts`）

| 参数 | 默认值 | 说明 |
|--------|--------|------|
| RAG_TOP_K | 5 | 返回前K个结果 |
| RAG_THRESHOLD | 0.6 | 相似度阈值 |
| RAG_DATA_SOURCE | local | 数据源类型 |
| RAG_EMBEDDING_MODEL | local | embedding模型 |

### 模板匹配配置

| 参数 | 默认值 | 说明 |
|--------|--------|------|
| topK | 3 | 返回前K个模板 |
| threshold | 0.6 | 相似度阈值 |
| conceptWeight | 0.7 | 概念相似度权重 |
| questionWeight | 0.3 | 问题相似度权重 |

### LLM配置

| 参数 | 默认值 | 说明 |
|--------|--------|------|
| temperature | 0.3 | 生成温度 |
| maxTokens | - | 最大token数 |

---

## 示例场景

### 场景1：孟德尔杂交问题

**用户提问**: "Aa x Aa 杂交的后代基因型比例是多少？"

**处理流程**:
1. ✅ 提取概念: "孟德尔第一定律"
2. ✅ RAG检索: 返回5个相关教科书段落
3. ✅ 模板匹配: punnett_square_v1 (相似度: 0.92)
4. ✅ LLM选择: 选择punnett_square_v1
5. ✅ 生成数据: parent1="Aa", parent2="Aa"
6. ✅ 返回配置: D3.js渲染配置

**返回**:
```json
{
  "type": "punnett_square",
  "title": "庞氏方格 - Aa x Aa",
  "data": { "parent1": "Aa", "parent2": "Aa", ... },
  "colors": { "dominant": "#4CAF50", "recessive": "#FF9800", ... }
}
```

### 场景2：系谱图分析

**用户提问**: "这个家系图中，显性遗传还是隐性遗传？"

**处理流程**:
1. ✅ 提取概念: "遗传病分析"
2. ✅ RAG检索: 返回相关系谱图知识
3. ✅ 模板匹配: pedigree_chart_v1 (相似度: 0.88)
4. ✅ LLM选择: 选择pedigree_chart_v1
5. ✅ 生成数据: 系谱数据结构
6. ✅ 返回配置: D3.js渲染配置

**返回**:
```json
{
  "type": "pedigree_chart",
  "title": "家系表 - 遗传病分析",
  "data": { "generations": [...], "individuals": [...] },
  "colors": { "affected": "#F44336", "carrier": "#FFB74D", ... }
}
```

---

## 总结

### 核心机制

1. **概念提取**: LLM从用户问题中提取核心概念
2. **知识检索**: RAG从教科书和知识库检索相关内容
3. **动态匹配**: 使用embedding相似度实时匹配A2UI模板
4. **LLM选择**: 根据综合因素选择最合适的模板
5. **数据生成**: LLM提取参数并生成可视化数据
6. **配置返回**: 返回D3.js渲染配置给前端

### 为什么A2UI模板不需要预向量化

- ✅ **静态定义**: 模板是schema和配置，不是内容
- ✅ **动态匹配**: 运行时实时计算embedding相似度
- ✅ **两阶段embedding**: 概念和问题分别生成，与模板比对
- ✅ **RAG辅助**: 用RAG检索的知识辅助LLM决策
- ✅ **灵活性**: 可以轻松添加/修改模板，无需重新向量化

这种设计使得系统具有很高的灵活性和准确性！

---

*文档创建时间: 2026-02-25*
*用途: 解释AI速通聊天中工具匹配和A2UI调用的完整流程*
