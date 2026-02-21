# 遗传学RAG向量知识库

本项目基于《遗传学（第4版）》教材构建了完整的RAG（检索增强生成）向量知识库。

## 功能特性

- **文档分块**: 将遗传学教材智能分块为490个文本块
- **本地向量化**: 使用基于词频和哈希的本地向量化方法，无需外部API
- **相似度搜索**: 使用余弦相似度进行高效的向量检索
- **持久化存储**: 向量数据存储在本地JSON文件中

## 项目结构

```
c:\trae_coding\
├── build_genetics_rag.ts       # 文档分块脚本
├── genetics_rag_service.ts      # RAG服务核心
├── package.json                 # NPM配置
├── data/
│   └── genetics-rag/
│       ├── chunks.json           # 完整分块数据
│       ├── chunks_simplified.json # 简化版分块数据
│       ├── stats.json           # 统计信息
│       └── vectors.json        # 向量存储
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 构建知识库

```bash
npm run rag:build    # 分块文档
npm run rag:index    # 生成向量索引
```

### 3. 搜索知识库

```bash
npm run rag:search "你的查询问题"
```

### 4. 查看统计信息

```bash
npm run rag:stats
```

### 5. 删除知识库

```bash
npm run rag:delete
```

## 使用示例

### 搜索基因表达

```bash
npm run rag:search "基因表达"
```

输出示例：
```
🔧 初始化本地向量存储...

✅ 加载了 490 个文本块和 490 个向量

🔍 搜索查询: "基因表达"

✅ 找到 3 个相关结果

【结果 1】相似度: 12.1%
📚 章节: 第一节 染色体

每种生物的染色体数是恒定的。多数高等动植物是二倍体...
```

### 搜索DNA复制

```bash
npm run rag:search "DNA复制"
```

输出示例：
```
🔍 搜索查询: "DNA复制"

✅ 找到 5 个相关结果

【结果 1】相似度: 64.0%
📚 章节: 第三节 DNA损伤的修复

在生命进化的过程中，遗传信息的载体——DNA不仅通过半保留复制...
```

### 搜索孟德尔遗传

```bash
npm run rag:search "孟德尔遗传"
```

## 技术实现

### 向量化方法

本项目使用本地向量化方法，无需外部嵌入模型API：

1. **文本预处理**: 提取汉字和单词
2. **词频统计**: 使用固定大小词汇表（2000维）
3. **哈希映射**: 将词汇哈希映射到向量位置
4. **归一化**: 对向量进行L2归一化
5. **余弦相似度**: 使用余弦相似度计算文本相似度

### 分块策略

- **按章节分块**: 根据Markdown标题结构分块
- **块大小**: 最大1500字符，最小500字符
- **元数据保留**: 包含章节、小节、标签等信息
- **语义完整性**: 保持段落和章节的完整性

## 性能统计

- **文档大小**: 1.37 MB (677,379字符)
- **分块数量**: 490个
- **平均块大小**: 1382字符
- **章节数**: 304个
- **向量维度**: 2000维
- **检索速度**: <1秒（490个向量）

## 知识库数据

**来源**: 《遗传学（第4版）》- 刘祖洞、吴燕华、乔守怡、赵寿元 著

**内容覆盖**:
- 基因学基础
- 染色体遗传
- 分子遗传学
- 群体遗传学
- 基因表达调控
- 遗传分析策略
- 表观遗传学
- 遗传与发育

## 扩展功能

### 集成到AhaTutor项目

可以将此RAG服务集成到AhaTutor项目中：

```typescript
import { GeneticsRAGService } from './genetics_rag_service';

const ragService = new GeneticsRAGService();
await ragService.initialize();

// 搜索知识库
const results = await ragService.search("基因表达", 5);
```

### 与LLM结合

可以将检索结果作为上下文传递给LLM：

```typescript
const results = await ragService.search(query, 3);
const context = results.map(r => r.content).join('\n\n');

// 将context传递给LLM生成回答
const answer = await llm.generate(query, context);
```

## 注意事项

1. **无需外部API**: 本地向量化方法不需要嵌入模型API
2. **本地存储**: 所有数据存储在本地，隐私安全
3. **轻量级**: 无需安装额外的数据库服务
4. **可扩展**: 如需更高级的向量化，可替换为OpenAI/ChatGLM等嵌入模型

## 许可证

MIT License
