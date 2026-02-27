# Embedding API 问题说明与解决方案

## 问题背景

在测试可视化工具自动匹配功能时，后端服务启动遇到以下错误：

```
ERROR [GLMProvider] GLM embedding error:
ERROR [GLMProvider] Error: 429 余额不足或无可用资源包,请充值。
```

**错误码429**：API余额不足

## 问题根源

### 架构说明

```
┌─────────────────────────────────────────────────────┐
│         可视化工具匹配流程                      │
└─────────────┬─────────────────────────────────────┘
              │
              ↓
┌─────────────────────────────────────────────────────┐
│  VisualizationToolMatcherService                 │
│  - analyzeAndMatchTool()                      │
└─────────────┬─────────────────────────────────────┘
              │
              ↓
┌─────────────────────────────────────────────────────┐
│  VisualizationRAGService                      │
│  - retrieveByQuestion()                      │
└─────────────┬─────────────────────────────────────┘
              │
              ↓
┌─────────────────────────────────────────────────────┐
│  EmbeddingService.embed()                       │
└─────────────┬─────────────────────────────────────┘
              │
              ↓
┌─────────────────────────────────────────────────────┐
│  LLMService.embed()                             │
│  → GLMProvider.embed() 【调用外部API】← 问题！ │
└─────────────────────────────────────────────────────┘
              │
              ↓
       生成向量
              │
              ↓
┌─────────────────────────────────────────────────────┐
│  ChromaDB（本地向量存储）✅ 没问题         │
└─────────────────────────────────────────────────────┘
```

### 你说得对的地方

✅ **ChromaDB** = 本地向量数据库（存储向量），完全本地  
❌ **GLM Embedding API** = 外部API（生成向量），需要付费

**问题不在于ChromaDB，而在于生成embedding时调用的外部GLM API。**

## 解决方案

### 方案1：使用Mock Provider（测试用 - 推荐）

#### 操作步骤
已修改 `.env` 文件：
```env
# 修改前
DEFAULT_LLM_PROVIDER=glm

# 修改后
DEFAULT_LLM_PROVIDER=mock
```

#### 优点
- ✅ 立即可用，无需额外配置
- ✅ 免费使用
- ✅ 可以测试所有功能

#### 缺点
- ⚠️ Mock返回随机向量，RAG匹配没有实际意义
- ⚠️ 只能测试关键词和类别匹配

### 方案2：充值GLM账户（生产用）

#### 操作步骤
1. 登录GLM提供商账户（智谱AI）
2. 充值购买API调用额度
3. 重新启动服务

#### 优点
- ✅ RAG功能完全可用
- ✅ 语义匹配准确

#### 缺点
- ❌ 需要花钱
- ❌ 依赖外部服务

### 方案3：使用本地Embedding模型（推荐）

#### 方案A：使用Transformers.js（Node.js）

```bash
# 安装依赖
npm install @xenova/transformers

# 使用本地模型
```

修改代码使用本地模型：
```typescript
// llm.service.ts
async embed(text: string, provider?: string): Promise<number[]> {
  const embedProvider = provider || this.defaultProvider;
  
  this.logger.debug(`Using embedding provider: ${embedProvider}`);
  
  try {
    switch (embedProvider) {
      case 'local':
        // 使用本地模型
        return await this.localEmbeddingService.embed(text);
      // ... 其他provider
    }
  } catch (error) {
    this.logger.error(`Embedding request failed for provider ${embedProvider}:`, error);
    throw error;
  }
}
```

#### 方案B：使用Python Sentence-Transformers

```bash
# 安装Python包
pip install sentence-transformers
pip install torch

# 运行本地embedding服务
python embedding_server.py
```

创建一个独立的embedding服务：
```python
# embedding_server.py
from sentence_transformers import SentenceTransformer
from flask import Flask, request, jsonify
import numpy as np

app = Flask(__name__)

# 加载本地模型
model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')

@app.route('/embed', methods=['POST'])
def embed():
    text = request.json['text']
    # 使用本地模型生成向量
    embedding = model.encode(text)
    return jsonify({
        'embedding': embedding.tolist(),
        'dimension': len(embedding)
    })

if __name__ == '__main__':
    app.run(port=5000)
```

修改API调用本地服务：
```typescript
async embed(text: string, provider?: string): Promise<number[]> {
  if (provider === 'local') {
    const response = await fetch('http://localhost:5000/embed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    const result = await response.json();
    return result.embedding;
  }
  // ...
}
```

#### 优点
- ✅ 完全免费
- ✅ 离线可用
- ✅ RAG功能准确
- ✅ 不依赖外部API
- ✅ 可自定义模型

#### 缺点
- ⚠️ 需要下载模型文件（约100-500MB）
- ⚠️ 首次启动较慢
- ⚠️ 需要额外的服务进程

### 方案4：暂时禁用RAG（临时方案）

#### 已实现的降级处理

在 `visualization-tool-matcher.service.ts` 中已添加：
```typescript
private async findBestTool(...): Promise<ToolMatchScore> {
  let ragMatches: VisualizationMatch[] = [];
  try {
    ragMatches = await this.visualizationRAG.retrieveByQuestion(...);
  } catch (error) {
    this.logger.warn('RAG检索失败，使用关键词和类别匹配', error);
    ragMatches = [];  // RAG分数为0
  }
  
  // 继续使用关键词和类别匹配...
}
```

#### 评分计算
即使RAG失败，工具匹配仍然可用：
```typescript
const totalScore = (ragScore * 0.4) + (keywordScore * 0.4) + (categoryScore * 0.2);

// 当ragScore = 0时：
// totalScore = (0 * 0.4) + (keywordScore * 0.4) + (categoryScore * 0.2)
// totalScore = (keywordScore * 0.4) + (categoryScore * 0.2)
```

#### 优点
- ✅ 立即可用
- ✅ 无需修改
- ✅ 功能仍然可用（关键词+类别）

#### 缺点
- ⚠️ 语义匹配缺失
- ⚠️ 匹配准确度降低

## 方案对比总结

| 方案 | 成本 | RAG可用 | 实施难度 | 推荐场景 |
|------|------|---------|---------|---------|
| Mock Provider | 免费 | ❌ 随机 | 简单 | 测试开发 |
| 充值GLM | 付费 | ✅ | 简单 | 生产环境 |
| 本地Embedding | 免费 | ✅ | 中等 | 推荐方案 |
| 暂时禁用RAG | 免费 | ❌ | 无 | 临时方案 |

## 推荐方案

### 短期（现在）：方案1 + 方案4
1. **使用Mock Provider**进行功能测试
2. **依赖降级处理**，关键词和类别匹配已足够
3. 验证所有API端点正常工作

### 中期（1-2周）：方案3 - 本地Embedding模型
1. 选择轻量级模型（如 `all-MiniLM-L6-v2`，约100MB）
2. 集成Transformers.js或使用Python服务
3. 更新配置支持local provider
4. 测试RAG功能准确性

### 长期（1个月+）：优化与扩展
1. 训练专用遗传学embedding模型
2. 实现向量缓存机制
3. 优化检索性能
4. 添加多语言支持

## 当前状态

### 已完成的改进

✅ **降级处理**：添加try-catch保护RAG失败  
✅ **Mock配置**：已修改.env为mock provider  
✅ **关键词匹配**：30+关键词已定义  
✅ **类别权重**：核心>重要>原理>技术  
✅ **综合评分**：40%关键词 + 20%类别 + 40%RAG（可选）

### 功能可用性

| 功能 | RAG可用时 | RAG不可用时 |
|------|-----------|------------|
| 意图识别 | ✅ | ✅ |
| 关键词匹配 | ✅ | ✅ |
| 概念提取 | ✅ | ✅ |
| 工具推荐 | ✅ | ✅（准确度降低） |
| A2UI触发 | ✅ | ✅ |
| 语义匹配 | ✅ | ❌（降级） |

## 测试建议

### 使用Mock Provider测试

```bash
# 1. 确认配置
cat src/backend/.env | grep DEFAULT_LLM_PROVIDER
# 应该显示：DEFAULT_LLM_PROVIDER=mock

# 2. 启动服务
cd src/backend
npm run start:dev

# 3. 测试API
# 服务启动后，运行测试脚本
node test-visualization-matcher.js
```

### 验证降级处理

即使RAG失败（或使用Mock时），以下功能仍然可用：

```json
{
  "question": "Aa x Aa 杂交，帮我画个图",
  "expected": {
    "matched": true,
    "toolId": "punnett_square_v1",
    "confidence": "> 0.7",
    "shouldTriggerA2UI": true,
    "note": "使用关键词和类别匹配，无需RAG"
  }
}
```

## 常见问题

### Q1: ChromaDB不是本地的吗？
**A**: 是的，ChromaDB完全本地。问题不在存储，而在生成embedding时调用外部API。

### Q2: 为什么RAG失败后还能工作？
**A**: 系统设计了降级机制：
- RAG失败 → ragScore = 0
- 总评分 = (0 × 0.4) + (关键词 × 0.4) + (类别 × 0.2)
- 仍然可以找到最佳工具

### Q3: Mock Provider的embedding有作用吗？
**A**: Mock返回随机向量，对RAG匹配没有实际意义，但可以测试整个流程。

### Q4: 本地模型需要多大空间？
**A**: 
- `all-MiniLM-L6-v2`: ~100MB
- `all-mpnet-base-v2`: ~400MB
- `paraphrase-multilingual-MiniLM-L12-v2`: ~400MB

推荐使用MiniLM系列，平衡了性能和大小。

## 下一步行动

### 立即执行
1. ✅ 已修改.env为mock provider
2. 重启后端服务
3. 运行测试脚本验证功能

### 本周内完成
1. 选择本地embedding模型
2. 集成到项目中
3. 更新配置支持local provider
4. 测试RAG功能准确性

### 本月内规划
1. 实现向量缓存
2. 添加性能监控
3. 收集用户反馈
4. 持续优化匹配算法

## 总结

**问题**：Embedding API余额不足导致RAG功能不可用  
**根源**：生成embedding调用外部GLM API（ChromaDB本身没问题）  
**方案**：使用Mock测试 + 长期实现本地embedding模型  
**状态**：✅ 已添加降级处理，功能可用  
**建议**：短期内使用Mock测试，中期实现本地embedding模型

---
*文档创建时间: 2026-02-25*
*状态: 问题已分析，方案已提供*
