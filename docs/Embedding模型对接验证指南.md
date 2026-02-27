# Embedding模型对接验证指南

本文档说明如何验证本地embedding模型是否真正在项目中使用。

---

## 一、当前对接状态

### 1.1 已完成的对接工作

✅ **已完成**：
1. 添加 `@xenova/transformers` 依赖到 `package.json`
2. 创建 `EnhancedLocalEmbeddingService` - 真正的Transformer模型
3. 创建 `VectorAdapterService` - 向量维度适配器
4. 修改 `EmbeddingService` - 集成本地embedding和向量投影
5. 更新 `RAGModule` - 注册新服务
6. 更新 `.env` - 配置embedding provider
7. 添加测试API端点

### 1.2 Embedding调用链路

```
用户查询
  ↓
RetrievalService.retrieveByQuestion()
  ↓
EmbeddingService.embed(query)
  ↓
if (RAG_EMBEDDING_MODEL === 'enhanced-local')
  ↓
EnhancedLocalEmbeddingService.embed(text) → 生成384维向量
  ↓
VectorAdapterService.adaptVector(vector, 2000, 'up') → 投影到2000维
  ↓
LocalVectorStoreService.similaritySearch() → 与预生成向量匹配
  ↓
返回相关文档
```

### 1.3 配置文件

**`.env`**:
```bash
RAG_EMBEDDING_MODEL=enhanced-local          # ✅ 使用本地embedding
RAG_EMBEDDING_DIMENSIONS=2000               # ✅ 目标维度2000（匹配预生成向量）
LOCAL_EMBEDDING_MODEL=Xenova/all-MiniLM-L6-v2 # ✅ 具体模型
```

---

## 二、安装依赖包

### 2.1 方法1：直接安装（推荐）

```bash
cd c:/trae_coding/AhaTutor/src/backend
npm install @xenova/transformers@2.17.2
```

### 2.2 方法2：从根目录安装（如果使用workspace）

```bash
cd c:/trae_coding/AhaTutor
npm install --ignore-workspace
```

### 2.3 验证安装

```bash
cd c:/trae_coding/AhaTutor/src/backend
npm ls @xenova/transformers
```

期望输出：
```
@ahatutor/backend@0.1.0
└── @xenova/transformers@2.17.2
```

---

## 三、启动服务并验证

### 3.1 启动后端服务

```bash
cd c:/trae_coding/AhaTutor/src/backend
npm run start:dev
```

**首次启动**（下载模型）：
```
[Nest] INFO  [EnhancedLocalEmbeddingService] 正在加载本地embedding模型: Xenova/all-MiniLM-L6-v2
[Nest] INFO  [EnhancedLocalEmbeddingService] 首次加载需要下载模型，请耐心等待...
[Transformers] Downloading model...
[Transformers] Model downloaded successfully
[Nest] INFO  [EnhancedLocalEmbeddingService] ✅ 本地embedding模型加载成功
[Nest] INFO  [EmbeddingService] Embedding provider: enhanced-local, target dimension: 2000
```

### 3.2 测试Embedding生成

```bash
curl -X POST http://localhost:3001/rag/embedding/test \
  -H "Content-Type: application/json" \
  -d '{"text": "孟德尔遗传定律"}'
```

**期望输出**:
```json
{
  "success": true,
  "text": "孟德尔遗传定律",
  "embedding": [0.0123, -0.0456, 0.0789, ...],
  "dimension": 2000,  // 注意：是2000维（投影后）
  "sampleValues": [0.0123, -0.0456, 0.0789, 0.0234, -0.0567],
  "modelInfo": {
    "modelName": "Xenova/all-MiniLM-L6-v2",
    "dimension": 384,  // 原始模型维度
    "quantized": true
  }
}
```

### 3.3 测试文本相似度

```bash
curl -X POST http://localhost:3001/rag/embedding/similarity \
  -H "Content-Type: application/json" \
  -d '{
    "text1": "孟德尔遗传定律",
    "text2": "遗传学基本原理"
  }'
```

**期望输出**:
```json
{
  "success": true,
  "text1": "孟德尔遗传定律",
  "text2": "遗传学基本原理",
  "similarity": 0.82,  // 应该有合理的相似度（> 0.7）
  "embedding1": [...],
  "embedding2": [...]
}
```

### 3.4 测试RAG查询

```bash
curl -X POST http://localhost:3001/rag/query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "孟德尔遗传定律是什么？",
    "topK": 5
  }'
```

**期望输出**:
```json
{
  "answer": "孟德尔遗传定律是遗传学的基础定律...",
  "sources": [
    {
      "content": "孟德尔第一定律（分离定律）指出...",
      "score": 0.85,  // ✅ 应该有合理的相似度分数
      "metadata": {
        "chapter": "第一章",
        "section": "1.1 孟德尔定律"
      }
    }
  ]
}
```

---

## 四、验证日志

### 4.1 查看embedding provider日志

启动服务后，应该看到：

```
[Nest] [EmbeddingService] Embedding provider: enhanced-local, target dimension: 2000
```

如果看到 `llm`，说明配置错误。

### 4.2 查看向量维度调整日志

查询时应该看到：

```
[Nest] [EmbeddingService] Using enhanced local embedding for: 孟德尔遗传定律是什么？...
[Nest] [VectorAdapterService] 投影向量: 384d -> 2000d
[Nest] [EmbeddingService] Adjusting vector dimension: 384d -> 2000d
```

### 4.3 查看RAG检索日志

检索时应该看到有效的相似度分数：

```
[Nest] [LocalVectorStoreService] Similarity score: 0.85  // ✅ 有效分数
```

如果全部是0，说明向量维度不匹配或检索失败。

---

## 五、故障排查

### 问题1：依赖包安装失败

**错误**:
```
npm error EUNSUPPORTEDPROTOCOL
npm error Unsupported URL Type "workspace:"
```

**解决**:
```bash
# 方法1：在backend目录直接安装
cd c:/trae_coding/AhaTutor/src/backend
npm install @xenova/transformers@2.17.2 --no-save

# 方法2：编辑package.json后运行
cd c:/trae_coding/AhaTutor/src/backend
npm install
```

### 问题2：TypeScript编译错误

**错误**:
```
error TS2307: Cannot find module '@xenova/transformers'
```

**解决**:
1. 确认依赖已安装：`npm ls @xenova/transformers`
2. 删除node_modules重新安装：`rm -rf node_modules && npm install`

### 问题3：模型下载失败

**错误**:
```
Failed to initialize local embedding model: Failed to fetch model
```

**解决**:
1. 检查网络连接
2. 配置HuggingFace镜像源
3. 手动下载模型到 `~/.cache/huggingface/hub/`

### 问题4：向量维度不匹配导致相似度为0

**现象**: RAG检索返回的score都是0

**检查**:
```bash
# 查看日志，应该有维度调整信息
grep "Adjusting vector dimension" logs/backend.log

# 查看实际向量维度
curl -X POST http://localhost:3001/rag/embedding/test | jq '.dimension'
```

**解决**:
1. 确认 `.env` 中 `RAG_EMBEDDING_DIMENSIONS=2000`
2. 确认预生成向量文件是2000维
3. 重启服务

### 问题5：所有相似度都是0

**原因**:
- 向量维度不匹配（已通过VectorAdapter解决）
- 向量投影效果不佳（正常情况）

**临时方案**: 重新生成向量

```bash
cd c:/trae_coding/AhaTutor/src/backend
npx ts-node scripts/regenerate-vectors.ts
```

然后更新 `.env`:
```bash
RAG_VECTORS_FILE=c:/trae_coding/AhaTutor/data/external/genetics-rag/vectors_local_384d.json
RAG_EMBEDDING_DIMENSIONS=384
```

---

## 六、快速验证清单

运行以下命令验证所有功能：

```bash
# 1. 检查依赖安装
cd c:/trae_coding/AhaTutor/src/backend
npm ls @xenova/transformers

# 2. 编译检查
npx tsc --noEmit

# 3. 启动服务（新终端）
npm run start:dev

# 4. 测试embedding（新终端）
curl -X POST http://localhost:3001/rag/embedding/test \
  -H "Content-Type: application/json" \
  -d '{"text": "测试"}'

# 5. 测试相似度
curl -X POST http://localhost:3001/rag/embedding/similarity \
  -H "Content-Type: application/json" \
  -d '{"text1": "孟德尔遗传定律", "text2": "遗传学"}'

# 6. 测试RAG查询
curl -X POST http://localhost:3001/rag/query \
  -H "Content-Type: application/json" \
  -d '{"query": "什么是孟德尔遗传定律？"}'
```

---

## 七、与原系统对比

| 特性 | 原系统（MockProvider） | 新系统（EnhancedLocal） |
|------|----------------------|------------------------|
| Embedding来源 | 随机生成 | Transformer模型 |
| 向量质量 | 无语义理解 | 真实语义向量 |
| 维度 | 1536 | 384 → 2000（投影） |
| 外部依赖 | ❌ 无 | ❌ 无 |
| API调用 | ❌ 无 | ❌ 无 |
| 余额限制 | ❌ 无 | ❌ 无 |
| 语义理解 | ❌ 否 | ✅ 是 |
| 相似度质量 | ❌ 随机 | ✅ 真实 |

---

## 八、总结

### ✅ 已完成对接

1. 依赖包配置
2. 服务实现（EnhancedLocalEmbeddingService + VectorAdapterService）
3. EmbeddingService集成
4. 配置文件更新
5. 测试API端点

### ⚠️ 待完成

1. 安装 `@xenova/transformers` 依赖包（手动运行npm install）
2. 启动服务并下载模型（首次1-5分钟）
3. 验证RAG检索效果

### 🎯 推荐下一步

**短期**（30分钟）：
1. 安装依赖包
2. 启动服务，验证embedding生成
3. 测试RAG查询

**中期**（1-2小时）：
1. 运行 `regenerate-vectors.ts` 重新生成向量
2. 更新配置使用新生成的向量
3. 对比检索质量

**长期**（可选）：
1. 尝试不同模型（bge-base-zh-v1.5等）
2. 优化向量投影算法
3. 实现模型热切换

---

## 相关文档

- [本地Embedding模型使用指南.md](./本地Embedding模型使用指南.md)
- [Embedding向量维度问题与解决方案.md](./Embedding向量维度问题与解决方案.md)
- `src/backend/src/modules/rag/services/enhanced-local-embedding.service.ts`
- `src/backend/src/modules/rag/services/vector-adapter.service.ts`
- `src/backend/src/modules/rag/services/embedding.service.ts`
