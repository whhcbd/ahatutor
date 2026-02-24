# 细粒度 RAG 使用指南

## 概述

已成功构建细粒度的遗传学 RAG 向量知识库，按照《遗传学（第4版）》的目录章节结构进行分块。

## 对比数据

| 指标 | 旧版本 | 新版本 | 改进 |
|--------|--------|--------|------|
| Chunks 数量 | 490 | 778 | +58.8% |
| 平均块大小 | 1281 字符 | 791 字符 | -38.3% |
| 章节覆盖 | - | 317 个 | ✓ |
| 块类型 | 单一 | 3种分类 | ✓ |

## 生成文件

### 1. Chunks 文件
- **chunks_fine_grained.json**: 完整的 chunk 数据（778个）
- **chunks_fine_grained_simplified.json**: 简化版，用于向量化和检索

### 2. 向量文件
- **vectors_fine_grained.json**: 778 个 2000 维向量

### 3. 统计文件
- **stats_fine_grained.json**: 分块统计信息
- **stats_fine_grained_vectors.json**: 向量化统计信息

## 核心改进

### 1. 按章节结构分块
- 保持章节内容的完整性
- 支持多级标题（章/节/小节）
- 每个 chunk 包含完整的上下文

### 2. 更细粒度
- 平均块大小从 1281 字符降至 791 字符
- 更精准的语义检索
- 提高检索相关性

### 3. 丰富的元数据
```typescript
{
  chapter: string;      // 章节名称
  section?: string;     // 小节名称
  subsection?: string;  // 子节名称
  level: number;       // 层级 (1=章, 2=节, 3=小节)
  chunkType: 'chapter' | 'section' | 'content'; // 块类型
  tags: string[];      // 13个分类标签
}
```

### 4. 改进的标签提取
- 13 个分类：基因、染色体、遗传、突变、表达、复制、重组、细胞、群体、表观、进化、技术
- 更精准的语义匹配
- 支持章节号提取

## 使用方法

### 重新构建 RAG

```bash
cd scripts

# 1. 生成细粒度 chunks
npx tsx build_genetics_rag_fine_grained.ts

# 2. 生成向量
npx tsx build_vectors_fine_grained.ts

# 3. 对比版本
cd ../data/external/genetics-rag
node compare_versions.js
```

### 更新配置

在 `.env` 文件中添加或修改：

```bash
# 使用细粒度 RAG 数据
RAG_CHUNKS_FILE=data/external/genetics-rag/chunks_fine_grained_simplified.json
RAG_VECTORS_FILE=data/external/genetics-rag/vectors_fine_grained.json

# 分块参数（可选）
RAG_CHUNK_SIZE=700
RAG_CHUNK_OVERLAP=200
RAG_TOP_K=5
```

### API 调用示例

```typescript
// 查询 RAG
POST /agent/skills/rag/retrieve
{
  "query": "孟德尔分离定律的内容是什么？",
  "topK": 5,
  "filters": {
    "chapter": "孟德尔定律",
    "level": 1
  }
}

// 带上下文的检索
POST /agent/skills/rag/context
{
  "currentQuery": "这个定律有什么例外吗？",
  "conversationHistory": [...],
  "previousContext": [...],
  "topK": 3
}
```

## 检索效果提升

### 1. 更精准的匹配
- 细粒度 chunks 提供更聚焦的内容
- 减少无关信息的干扰
- 提高答案的相关性

### 2. 更好的上下文理解
- 按章节分块保持语义完整性
- 多轮对话时能准确追踪上下文
- 支持章节级别的过滤

### 3. 更快的检索速度
- 778 个 chunks，检索速度 < 1 秒
- 本地向量化，无需外部 API
- 适合中小规模知识库

## 扩展建议

### 1. 增加更多文档
```bash
# 添加新文档到构建脚本
# 重新运行分块和向量化
npx tsx build_genetics_rag_fine_grained.ts
```

### 2. 调整分块参数
在 `build_genetics_rag_fine_grained.ts` 中修改：
```typescript
const MAX_CHUNK_SIZE = 700;  // 最大块大小
const MIN_CHUNK_SIZE = 400;  // 最小块大小
```

### 3. 使用高级嵌入模型
如需更精准的语义匹配，可以：
- 集成 OpenAI Embeddings API
- 使用 Sentence-Transformers 本地模型
- 集成 Pinecone/Weaviate 云端向量数据库

## 故障排除

### 问题：检索结果不相关
**解决方案**：
1. 调整 `RAG_TOP_K` 参数（增加检索数量）
2. 检查查询关键词是否在标签中
3. 考虑使用高级嵌入模型

### 问题：检索速度慢
**解决方案**：
1. 检查向量文件大小（应在 15MB 左右）
2. 使用简化版 chunks 文件
3. 考虑使用 Pinecone 云端服务

### 问题：chunks 数量不足
**解决方案**：
1. 减小 `MAX_CHUNK_SIZE` 参数
2. 添加更多文档
3. 调整分块策略

## 性能指标

- **总 chunks**: 778
- **总字符数**: 677,379
- **平均块大小**: 791 字符
- **词汇表大小**: 2,742 词
- **向量维度**: 2,000
- **检索速度**: < 1 秒
- **文件大小**: chunks 1.49 MB + vectors 14.94 MB

## 总结

细粒度 RAG 知识库已完成构建，相比旧版本有以下改进：

✓ **数量增加 58.8%**：490 → 778 个 chunks
✓ **粒度提升 38.3%**：平均块大小降至 791 字符
✓ **按章节分块**：保持内容完整性
✓ **丰富元数据**：支持章节/小节/子节三级结构
✓ **改进标签**：13 个分类标签，更精准的语义匹配
✓ **更快检索**：本地向量化，检索速度 < 1 秒

建议立即更新配置使用细粒度 RAG 数据，以获得更好的检索效果！
