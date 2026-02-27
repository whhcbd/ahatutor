# RAG数据文件位置清单

## 一、RAG知识库可视化硬编码数据（静态数据）

这些是预定义的遗传学概念数据，**不需要向量化**，使用静态Map存储。

### 1. 基本概念

**路径**: `c:\trae_coding\AhaTutor\src\backend\src\modules\knowledge-base\data\basic-concepts.ts`
**模块**: BASIC_CONCEPTS
**概念数**: 约10个
**示例概念**:

- 基因
- 染色体
- DNA
- RNA
- 细胞
- 核
- 细胞质
- 细胞膜
- 细胞壁
- 细胞核

### 2. 孟德尔遗传学

**路径**: `c:\trae_coding\AhaTutor\src\backend\src\modules\knowledge-base\data\mendelian-genetics.ts`
**模块**: MENDELIAN_GENETICS
**概念数**: 9个
**示例概念**:

- 孟德尔第一定律（分离定律）
- 孟德尔第二定律（自由组合定律）
- 伴性遗传
- 连锁互换
- 显性与隐性遗传
- X连锁遗传
- 基因型与表型
- 测交
- 共显性
- 不完全显性

### 3. 分子遗传学

**路径**: `c:\trae_coding\AhaTutor\src\backend\src\modules\knowledge-base\data\molecular-genetics.ts`
**模块**: MOLECULAR_GENETICS
**概念数**: 8个
**示例概念**:

- DNA复制
- 转录
- 翻译
- 基因结构
- 中心法则
- CRISPR
- 基因调控
- 密码子
- 操纵子

### 4. 染色体遗传学

**路径**: `c:\trae_coding\AhaTutor\src\backend\src\modules\knowledge-base\data\chromosomal-genetics.ts`
**模块**: CHROMOSOMAL_GENETICS
**概念数**: 6个
**示例概念**:

- 减数分裂
- 有丝分裂
- 染色体行为
- 同源染色体
- 交叉互换
- 核型

### 5. 群体遗传学

**路径**: `c:\trae_coding\AhaTutor\src\backend\src\modules\knowledge-base\data\population-genetics.ts`
**模块**: POPULATION_GENETICS
**概念数**: 7个
**示例概念**:

- 哈代-温伯格定律
- 孟德尔比例
- 基因频率
- 遗传漂变
- 选择
- 迁移
- 非随机交配

### 6. 现代技术

**路径**: `c:\trae_coding\AhaTutor\src\backend\src\modules\knowledge-base\data\modern-techniques.ts`
**模块**: MODERN_TECHNIQUES
**概念数**: 6个
**示例概念**:

- CRISPR
- 基因编辑
- PCR
- 凝胶电泳
- 克隆
- 转基因

### 7. 表观遗传学

**路径**: `c:\trae_coding\AhaTutor\src\backend\src\modules\knowledge-base\data\epigenetics.ts`
**模块**: EPIGENETICS
**概念数**: 5个
**示例概念**:

- DNA甲基化
- 组蛋白修饰
- 表观遗传
- 染色质重塑
- 基因印记

---

## 二、RAG可视化硬编码数据（用于工具推荐）

这些是可视化工具的预定义数据，**需要向量化**（但当前失败），使用内存存储。

### 主文件

**路径**: `c:\trae_coding\AhaTutor\src\backend\src\modules\agents\data\hardcoded-visualizations.data.ts`
**作用**: 整合所有模块的可视化数据

**结构**:

```typescript
import { MENDELIAN_GENETICS } from "./modules/mendelian-genetics";
import { MOLECULAR_GENETICS } from "./modules/molecular-genetics";
import { CHROMOSOMAL_GENETICS } from "./modules/chromosomal-genetics";
import { POPULATION_GENETICS } from "./modules/population-genetics";
import { MODERN_TECHNIQUES } from "./modules/modern-techniques";
import { EPIGENETICS } from "./modules/epigenetics";
import { BASIC_CONCEPTS } from "./modules/basic-concepts";

export const HARDCODED_VISUALIZATIONS: Record<
  string,
  Omit<VisualizationSuggestion, "insights">
> = {
  ...BASIC_CONCEPTS,
  ...MENDELIAN_GENETICS,
  ...MOLECULAR_GENETICS,
  ...CHROMOSOMAL_GENETICS,
  ...POPULATION_GENETICS,
  ...MODERN_TECHNIQUES,
  ...EPIGENETICS,
};
```

### 子模块文件（同知识库）

所有子模块与知识库相同：

1. `modules/basic-concepts.ts`
2. `modules/mendelian-genetics.ts`
3. `modules/molecular-genetics.ts`
4. `modules/chromosomal-genetics.ts`
5. `modules/population-genetics.ts`
6. `modules/modern-techniques.ts`
7. `modules/epigenetics.ts`

---

## 三、A2UI动态可视化模板（标准JSON格式）

这些是用于前端渲染的可视化工具模板，**不需要向量化**，通过API动态传递数据。

### 主文件

**路径**: `c:\trae_coding\AhaTutor\src\backend\src\modules\agents\data\a2ui-templates.data.ts`
**作用**: 定义所有A2UI可视化工具的schema和默认值
**工具数**: 13个

### A2UI模板列表

| 模板ID                        | 可视化类型               | 类别     | 复杂度 |
| ----------------------------- | ------------------------ | -------- | ------ |
| `punnett_square_v1`           | punnett_square           | 核心工具 | low    |
| `pedigree_chart_v1`           | pedigree_chart           | 核心工具 | medium |
| `three_point_test_cross_v1`   | three_point_test_cross   | 核心工具 | high   |
| `test_cross_v1`               | test_cross               | 核心工具 | low    |
| `probability_distribution_v1` | probability_distribution | 核心工具 | medium |
| `chi_square_test_v1`          | chi_square_test          | 重要方法 | medium |
| `bacterial_conjugation_v1`    | bacterial_conjugation    | 重要方法 | medium |
| `quantitative_traits_v1`      | quantitative_traits      | 重要方法 | high   |
| `chromosome_aberration_v1`    | chromosome_aberration    | 重要方法 | high   |
| `meiosis_animation_v1`        | meiosis_animation        | 原理演示 | high   |
| `chromosome_behavior_v1`      | chromosome_behavior      | 原理演示 | medium |
| `dna_replication_v1`          | diagram                  | 原理演示 | high   |
| `crispr_v1`                   | diagram                  | 实验技术 | high   |

### 数据结构示例

```typescript
{
  templateId: 'punnett_square_v1',
  visualizationType: 'punnett_square',
  category: '核心工具',
  complexity: 'low',
  description: '单基因/两基因杂交预测工具',
  schema: {
    type: 'object',
    properties: {
      parent1: { type: 'string' },
      parent2: { type: 'string' },
      title: { type: 'string' }
    },
    required: ['parent1', 'parent2']
  },
  defaultValues: {
    parent1: 'Aa',
    parent2: 'Aa',
    title: '庞氏方格'
  }
}
```

---

## 四、外部预生成RAG数据（遗传学教科书）

**路径**: `c:\trae_coding\AhaTutor\src\backend\data\external\genetics-rag\`
**来源**: `c:\trae_coding\AhaTutor\docs\reference\full.md`（遗传学教科书）分块产生
**原文件**: 刘祖洞《遗传学》（第4版）
**配置**: `src/backend/src/shared/config/rag.config.ts`

### 4.1 分块数据文件

**文件名**: `chunks_fine_grained_simplified.json`
**大小**: 1514KB
**状态**: ✅ 存在（外部预生成数据）
**数据来源**: 由 `full.md` 通过文档分块脚本生成
**结构**:

```json
{
  "id": "chunk_fine_0",
  "content": "...",
  "chapter": "Genetics",
  "level": 1,
  "chunkType": "chapter"
}
```

**示例内容**:

- chunk_fine_0: 内容提要（介绍第4版教材的修订）
- chunk_fine_1: 遗传学/刘祖洞等著（图书信息）
- chunk_fine_2: YICHUANXUE（图书在版编目数据）
- chunk_fine_3+: 各章节内容

### 4.2 向量数据文件

**文件名**: `vectors_fine_grained.json`
**状态**: ✅ 存在（外部预生成数据）
**结构**:

```json
{
  "id": "chunk_fine_0",
  "vector": [0.123, -0.456, ...],  // ← 2000维向量
  "metadata": {
    "chapter": "Genetics",
    "section": "...",
    "subsection": "...",
    "level": 1,
    "chunkType": "chapter"
  }
}
```

**向量维度**: 2000（由 `RAG_EMBEDDING_DIMENSIONS` 配置）

### 4.3 加载服务

**文件**: `src/backend/src/modules/rag/services/local-vector-store.service.ts`

**初始化过程**:

```typescript
async onModuleInit() {
  const basePath = 'data/external/genetics-rag';

  // 加载分块数据
  const chunksData = JSON.parse(fs.readFileSync(chunksPath, 'utf-8'));

  // 加载向量数据
  const vectorsData = JSON.parse(fs.readFileSync(vectorsPath, 'utf-8'));

  // 存入内存Map
  for (const chunk of chunksData) {
    this.chunks.set(chunk.id, chunk);
  }

  for (const vectorData of vectorsData) {
    this.vectors.set(vectorData.id, vectorData.vector);
  }
}
```

**日志输出**:

```
🔄 Loading fine-grained RAG data...
   Base path: c:/trae_coding/ahatutor/data/external/genetics-rag
   Chunks: ...chunks_fine_grained_simplified.json
   Vectors: ...vectors_fine_grained.json
Loading XXXX chunks and XXXX vectors...
✅ Loaded XXXX chunks
✅ Loaded XXXX vectors
First vector length: 2000
✅ Fine-grained RAG system initialized!
```

### 4.4 配置参数

**配置文件**: `src/backend/src/shared/config/rag.config.ts`

| 参数                     | 默认值                              | 说明              |
| ------------------------ | ----------------------------------- | ----------------- |
| RAG_CHUNKS_FILE          | chunks_fine_grained_simplified.json | 分块数据文件      |
| RAG_VECTORS_FILE         | vectors_fine_grained.json           | 向量数据文件      |
| RAG_CHUNK_SIZE           | 700                                 | 分块大小          |
| RAG_CHUNK_OVERLAP        | 200                                 | 重叠大小          |
| RAG_TOP_K                | 5                                   | 检索返回前K个结果 |
| RAG_THRESHOLD            | 0.7                                 | 相似度阈值        |
| RAG_DATA_SOURCE          | local                               | 数据源类型        |
| RAG_VECTOR_STORE_TYPE    | local                               | 向量存储类型      |
| RAG_EMBEDDING_MODEL      | local                               | embedding模型     |
| RAG_EMBEDDING_DIMENSIONS | 2000                                | 向量维度          |

---

## 五、文档分块知识库（从full.md分块产生的）

**路径**: `c:\trae_coding\AhaTutor\src\backend\data\split-docs\`
**来源**: `c:\trae_coding\AhaTutor\docs\reference\full.md`（遗传学教科书）
**分块配置**:

- Chunk大小: 2000字符
- 重叠: 200字符
- 策略: headers（按标题分块）
- 文件命名: `{documentId}-chunk-{index}.md`

**存储格式**:

```markdown
# {documentId}-chunk-0.md

**Document ID:** {documentId}
**Chunk Index:** 0

[分块内容...]
```

**当前状态**: ❌ **目录不存在**（从未运行过分块脚本）

**分块脚本**: `src/backend/src/modules/rag/services/document-splitter.service.ts`

**使用方法**:

```typescript
// 调用分块服务
await documentSplitter.splitMarkdownFile("docs/reference/full.md", {
  outputDir: "./data/split-docs",
  chunkSize: 2000,
  chunkOverlap: 200,
  strategy: "headers",
  saveToFile: true,
});
```

---

## 五、ChromaDB向量存储（动态数据）

**路径**: `c:\trae_coding\AhaTutor\data\chroma\`
**存储内容**: 用户上传的文档向量（如果成功生成过embedding）

**当前状态**: ❌ **很可能为空**（因为Embedding API从未成功过）

**数据结构**（如果存在）：

- Collection: `document_chunks`
- 数据项:
  - ID: 文档块ID
  - Metadata: { documentId, pageNumber, chapter, section, tags }
  - Embedding: 1536维向量
  - Document: 文档块内容

---

## 五、FAISS向量存储（动态数据）

**路径**: `c:\trae_coding\AhaTutor\data\faiss\index`
**存储内容**: 用户上传的文档向量（FAISS格式）

**当前状态**: ❌ **很可能为空**（因为Embedding API从未成功过）

**数据结构**（如果存在）:

- FAISS索引文件
- 包含所有文档块的向量表示

---

## 六、其他相关数据文件

### 1. 前置知识数据

**路径**: `c:\trae_coding\AhaTutor\src\backend\src\modules\knowledge-base\data\prerequisites.ts`
**作用**: 定义概念之间的前置关系树

### 2. 遗传学丰富内容数据

**路径**: `c:\trae_coding\AhaTutor\src\backend\src\modules\knowledge-base\data\enrichment.ts`
**作用**: 为概念添加详细的遗传学解释和例子

### 3. 组件目录数据

**路径**: `c:\trae_coding\AhaTutor\src\backend\src\modules\agents\component-catalog.data.ts`
**作用**: 定义前端可用的可视化组件

### 4. 模板匹配规则

**路径**: `c:\trae_coding\AhaTutor\src\backend\src\modules\agents\template-matcher.data.ts`
**作用**: 定义概念到可视化类型的匹配规则

---

## 七、数据流程图

```
┌─────────────────────────────────────────────────────────────────┐
│                    用户提问                              │
└─────────────┬─────────────────────────────────────────────┘
              │
              ↓
┌─────────────────────────────────────────────────────────────────┐
│  VisualizationToolMatcherService                      │
│  1. analyzeAndMatchTool()                          │
│     ↓                                              │
│  2. analyzeIntent() → 关键词/概念/置信度          │
│     ↓                                              │
│  3. findBestTool()                                │
│     ├─ RAG检索 (VisualizationRAG)                   │
│     │   ↓                                          │
│     │   retrieveByQuestion()                            │
│     │   ↓                                          │
│     │   llmService.generateEmbedding() 【失败】         │
│     │   ↓                                          │
│     │   内存数组embeddings[] (硬编码数据) 【空】        │
│     │   ↓                                          │
│     │   cosineSimilarity()                              │
│     │                                                │
│     ├─ 关键词匹配 (getTypeKeywords)                    │
│     │   ↓                                              │
│     │   30+关键词映射                                    │
│     │                                                │
│     └─ 类别权重 (categoryScore)                     │
│         ↓                                              │
│     综合评分 = RAG×0.4 + 关键词×0.4 + 类别×0.2  │
└─────────────┬─────────────────────────────────────────────┘
              │
              ↓
┌─────────────────────────────────────────────────────────────────┐
│  API响应                                          │
│  - matched: boolean                                 │
│  - toolId: string                                  │
│  - confidence: number                                │
│  - shouldTriggerA2UI: boolean                         │
│  - suggestedParameters: JSON                            │
└─────────────┬─────────────────────────────────────────────┘
              │
              ↓
┌─────────────────────────────────────────────────────────────────┐
│  A2UI前端                                       │
│  - 根据toolId加载组件                              │
│  - 使用suggestedParameters渲染                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 八、数据文件总览表

| 文件路径                                       | 类型     | 是否向量化 | 当前状态       | 用途 |
| ---------------------------------------------- | -------- | ---------- | -------------- | ---- |
| `knowledge-base/data/*.ts` (7个文件)           | 静态Map  | ✅ 有数据  | RAG知识库概念  |
| `agents/data/hardcoded-visualizations.data.ts` | 内存数组 | ❌ 空的    | 可视化工具推荐 |
| `agents/data/a2ui-templates.data.ts`           | 不需要   | ✅ 有数据  | 前端A2UI模板   |
| `agents/data/modules/*.ts` (7个子文件)         | 内存数组 | ❌ 空的    | 可视化工具定义 |
| `data/chroma/`                                 | ChromaDB | ❌ 空的    | 文档向量存储   |
| `data/faiss/`                                  | FAISS    | ❌ 空的    | 文档向量存储   |

---

## 九、需要向量化才能使用的部分

### 1. 可视化工具RAG（51个概念）

**文件**: `agents/data/hardcoded-visualizations.data.ts`
**需要向量化**: ✅ 是
**向量化方法**:

```typescript
// visualization-rag.service.ts
for (const concept of concepts) {
  const viz = getHardcodedVisualization(concept);
  const embedding = await this.llmService.generateEmbedding(searchKey);
  // ↑ 调用Embedding API
  this.embeddings.push({ concept, embedding, ... });
}
```

**当前状态**: ❌ embedding失败，RAG分数为0

### 2. 文档RAG（用户上传的文档）

**存储**: ChromaDB / FAISS
**需要向量化**: ✅ 是
**向量化方法**:

```typescript
// vector-store.service.ts
const embeddings = await this.embeddings.embedDocuments(documents);
await chromaCollection.add({ ids, metadatas, documents, embeddings });
// ↑ 调用Embedding API
```

**当前状态**: ❌ embedding失败，ChromaDB为空

### 3. 知识库概念（51个概念）

**文件**: `knowledge-base/data/*.ts`
**需要向量化**: ❌ 否
**说明**: 静态数据，使用Map存储，字符串匹配查询，无需embedding

---

## 十、总结

### 静态数据（无需向量化）✅

1. **RAG知识库概念**: 51个遗传学概念
2. **A2UI可视化模板**: 13个工具定义

### 动态数据（需要向量化）❌

1. **可视化工具RAG**: 51个概念
2. **文档RAG**: 用户上传的文档

### 当前状态

- ✅ **静态数据可用**：知识库概念、A2UI模板
- ❌ **向量存储为空**：ChromaDB、FAISS、可视化RAG内存数组
- ⚠️ **工具匹配降级**：依赖关键词+类别，RAG分数为0

### 解决方案

1. **短期**: 使用mock provider测试（已完成）
2. **中期**: 实现本地embedding模型
3. **长期**: 向量化51个概念，提升匹配准确度

---

_文档创建时间: 2026-02-25_
_数据来源: 代码分析和文件路径扫描_
