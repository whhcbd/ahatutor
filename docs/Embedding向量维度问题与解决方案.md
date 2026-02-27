# Embedding向量维度问题与解决方案

---

## 问题分析

### 当前向量维度情况

| 数据源 | 维度 | 生成方式 | 状态 |
|--------|------|----------|------|
| `vectors_fine_grained.json` | **2000** | GLM embedding-2 API | ❌ 预生成 |
| `all-MiniLM-L6-v2` | **384** | Xenova本地模型 | ✅ 新增 |
| `all-mpnet-base-v2` | **768** | Xenova本地模型 | ✅ 可用 |
| `MockProvider` | **1536** | 随机生成 | ⚠️ 测试用 |

### 问题现象

当使用本地embedding模型时：
```typescript
// LocalVectorStoreService.cosineSimilarity() 第179行
if (vec1.length !== vec2.length) {
  return 0;  // ❌ 维度不匹配直接返回0！
}
```

**结果**：
- 查询向量（384维）≠ 预生成向量（2000维）
- 相似度 = 0
- RAG检索失败

---

## 解决方案

### 方案1：重新生成所有向量（推荐）

**优点**：
- ✅ 完全适配本地模型
- ✅ 性能最优
- ✅ 语义准确

**缺点**：
- ⚠️ 需要时间（约30分钟）
- ⚠️ 需要足够的磁盘空间

#### 实施步骤

1. **创建重新生成脚本**

```typescript
// src/backend/scripts/regenerate-vectors.ts
import { EnhancedLocalEmbeddingService } from '../src/modules/rag/services/enhanced-local-embedding.service';
import * as fs from 'fs';
import * as path from 'path';

interface ChunkData {
  id: string;
  content: string;
  chapter?: string;
  section?: string;
  subsection?: string;
}

async function regenerateVectors() {
  console.log('🚀 开始重新生成向量...\n');

  // 1. 加载embedding模型
  const embedding = new EnhancedLocalEmbeddingService();
  await embedding.initialize();
  
  const modelInfo = embedding.getModelInfo();
  console.log(`使用模型: ${modelInfo.modelName}`);
  console.log(`向量维度: ${modelInfo.dimension}\n`);

  // 2. 加载chunks
  const chunksPath = path.join(process.cwd(), 'data', 'external', 'genetics-rag', 'chunks_fine_grained_simplified.json');
  const chunks: ChunkData[] = JSON.parse(fs.readFileSync(chunksPath, 'utf-8'));
  console.log(`加载了 ${chunks.length} 个chunks\n`);

  // 3. 批量生成向量
  const batchSize = 32;
  const allVectors: Array<{ id: string; vector: number[] }> = [];

  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);
    const vectors = await embedding.embedBatch(batch.map(c => c.content));

    for (let j = 0; j < batch.length; j++) {
      allVectors.push({
        id: batch[j].id,
        vector: vectors[j]
      });
    }

    const progress = Math.min(i + batchSize, chunks.length);
    console.log(`进度: ${progress}/${chunks.length} (${Math.round(progress / chunks.length * 100)}%)`);
  }

  // 4. 保存向量
  const outputPath = path.join(process.cwd(), 'data', 'external', 'genetics-rag', `vectors_local_${modelInfo.dimension}d.json`);
  fs.writeFileSync(outputPath, JSON.stringify(allVectors, null, 2));

  console.log(`\n✅ 完成！生成了 ${allVectors.length} 个向量`);
  console.log(`📁 保存到: ${outputPath}`);
  console.log(`📊 向量维度: ${modelInfo.dimension}`);
}

regenerateVectors().catch(console.error);
```

2. **运行脚本**

```bash
cd c:/trae_coding/AhaTutor/src/backend
npx ts-node scripts/regenerate-vectors.ts
```

3. **更新配置**

```bash
# .env
RAG_VECTORS_FILE=c:/trae_coding/AhaTutor/data/external/genetics-rag/vectors_local_384d.json
RAG_EMBEDDING_DIMENSIONS=384
```

4. **重启服务**

```bash
npm run start:dev
```

---

### 方案2：降维投影（临时方案）

**优点**：
- ✅ 无需重新生成向量
- ✅ 快速实施

**缺点**：
- ❌ 语义精度降低
- ❌ 需要额外计算

#### 实施步骤

创建一个降维服务，将384维向量投影到2000维：

```typescript
// src/modules/rag/services/vector-adapter.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class VectorAdapterService {
  /**
   * 将低维向量投影到高维
   * 使用简单的重复填充策略
   */
  projectUp(lowDimVector: number[], targetDim: number): number[] {
    const result = new Array(targetDim).fill(0);
    
    for (let i = 0; i < targetDim; i++) {
      result[i] = lowDimVector[i % lowDimVector.length];
    }
    
    return result;
  }

  /**
   * 将高维向量降维到低维
   * 使用平均池化
   */
  projectDown(highDimVector: number[], targetDim: number): number[] {
    const result = new Array(targetDim).fill(0);
    const chunkSize = Math.ceil(highDimVector.length / targetDim);
    
    for (let i = 0; i < targetDim; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, highDimVector.length);
      let sum = 0;
      
      for (let j = start; j < end; j++) {
        sum += highDimVector[j];
      }
      
      result[i] = sum / (end - start);
    }
    
    return result;
  }
}
```

然后在 `EmbeddingService` 中使用：

```typescript
// src/modules/rag/services/embedding.service.ts
constructor(
  private readonly llmService: LLMService,
  private readonly localEmbedding: EnhancedLocalEmbeddingService,
  private readonly vectorAdapter: VectorAdapterService,  // 新增
  private readonly configService: ConfigService,
) {}

async embed(text: string): Promise<number[]> {
  const embedding = await this.localEmbedding.embed(text);
  
  // 如果需要降维到2000
  const targetDim = parseInt(this.configService.get('rag.embeddingDimensions') || '2000');
  if (embedding.length !== targetDim) {
    return this.vectorAdapter.projectUp(embedding, targetDim);
  }
  
  return embedding;
}
```

---

### 方案3：使用2000维本地模型（最理想）

如果有2000维的本地模型，可以直接使用。目前Xenova没有提供2000维的通用模型，但可以：

1. **使用GLM API重新生成向量**（需要余额）
2. **等待Xenova支持更高维度模型**
3. **训练自己的模型**

---

## 推荐实施步骤

### 阶段1：快速验证（使用方案2）

1. 实现 `VectorAdapterService`
2. 修改 `EmbeddingService` 使用投影
3. 测试RAG检索是否工作

**预计时间**: 30分钟

### 阶段2：完整迁移（使用方案1）

1. 运行 `regenerate-vectors.ts`
2. 更新配置文件
3. 重启服务
4. 验证检索质量

**预计时间**: 1-2小时

---

## 验证方法

### 测试RAG检索

```bash
# 1. 测试embedding生成
curl -X POST http://localhost:3001/rag/embedding/test \
  -H "Content-Type: application/json" \
  -d '{"text": "孟德尔遗传定律"}'

# 期望输出:
{
  "success": true,
  "dimension": 384,  # 本地模型维度
  ...
}

# 2. 测试RAG查询
curl -X POST http://localhost:3001/rag/query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "孟德尔遗传定律是什么？",
    "topK": 5
  }'

# 期望输出:
{
  "answer": "...",
  "sources": [
    {
      "content": "孟德尔第一定律（分离定律）...",
      "score": 0.85,  # 应该有合理的相似度分数
      "metadata": {...}
    }
  ]
}
```

### 检查日志

```bash
# 查看embedding provider日志
# 应该看到: "Embedding provider: enhanced-local"
# 以及: "Using enhanced local embedding for: ..."

# 查看RAG检索日志
# 应该看到有效的相似度分数（> 0.7），而不是全部为0
```

---

## 当前配置状态

### .env 配置

```bash
# 当前配置（有问题）
RAG_EMBEDDING_MODEL=enhanced-local
LOCAL_EMBEDDING_MODEL=Xenova/all-MiniLM-L6-v2
RAG_EMBEDDING_DIMENSIONS=768  # ❌ 与预生成向量2000不匹配

# 推荐配置（方案2：降维投影）
RAG_EMBEDDING_MODEL=enhanced-local
LOCAL_EMBEDDING_MODEL=Xenova/all-MiniLM-L6-v2
RAG_EMBEDDING_DIMENSIONS=2000  # ✅ 与预生成向量匹配

# 推荐配置（方案1：重新生成向量）
RAG_VECTORS_FILE=c:/trae_coding/AhaTutor/data/external/genetics-rag/vectors_local_384d.json
RAG_EMBEDDING_DIMENSIONS=384
```

---

## 故障排查

### 问题1：所有相似度分数都是0

**原因**：向量维度不匹配

**检查**：
```bash
# 查看日志，应该看到警告
grep "向量维度不匹配" logs/backend.log

# 查看实际维度
curl -X POST http://localhost:3001/rag/embedding/test | jq '.dimension'
```

**解决**：
- 方案1：重新生成向量
- 方案2：使用向量投影

### 问题2：RAG检索结果为空

**原因**：
1. 向量维度不匹配
2. 阈值设置过高
3. 向量文件路径错误

**检查**：
```bash
# 检查向量文件是否存在
ls -lh data/external/genetics-rag/vectors*.json

# 检查配置
grep RAG_VECTORS_FILE .env
grep RAG_EMBEDDING_DIMENSIONS .env

# 降低阈值测试
# .env: RAG_THRESHOLD=0.5
```

### 问题3：模型加载失败

**错误信息**：
```
Failed to initialize local embedding model: Failed to fetch model
```

**解决**：
1. 检查网络连接
2. 检查缓存目录权限
3. 手动下载模型到 `~/.cache/huggingface/hub/`

---

## 总结

| 方案 | 难度 | 时间 | 效果 | 推荐度 |
|------|------|------|------|--------|
| 重新生成向量 | 中 | 1-2h | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 降维投影 | 低 | 30min | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| 使用2000维模型 | 高 | - | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

**推荐路径**：
1. **短期**：使用方案2（降维投影）快速验证
2. **长期**：使用方案1（重新生成向量）获得最佳效果

---

## 相关文件

- [本地Embedding模型使用指南.md](./本地Embedding模型使用指南.md)
- [RAG数据文件位置清单.md](./RAG数据文件位置清单.md)
- `src/backend/src/modules/rag/services/embedding.service.ts`
- `src/backend/src/modules/rag/services/enhanced-local-embedding.service.ts`
- `src/backend/src/modules/rag/services/local-vector-store.service.ts`
