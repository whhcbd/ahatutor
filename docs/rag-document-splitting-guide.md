# RAG 文档分块指南

## 概述

AHA Tutor 的 RAG 系统现在支持两种文档处理模式：

1. **内存分块模式**（默认）- 在内存中分块后直接存入向量数据库
2. **文件拆分模式**（新增）- 先将大 MD 拆分成多个小 MD 文件，再向量化

---

## 两种模式对比

| 维度 | 内存分块模式 | 文件拆分模式 |
|-----|------------|------------|
| **可读性** | ❌ 不便查看分块结果 | ✅ 每个文件都是独立的 MD |
| **调试** | ❌ 难以查看具体分块内容 | ✅ 可以直接打开文件查看 |
| **知识管理** | ❌ 知识结构不直观 | ✅ 文件结构反映知识层级 |
| **增量更新** | ❌ 更新一个章节需要重新分块 | ✅ 只需更新对应的小文件 |
| **版本控制** | ⚠️ 只能追踪大文件变化 | ✅ 每个小文件独立追踪 |
| **性能** | ✅ 无文件 I/O，速度快 | ⚠️ 需要读取多个文件 |
| **存储** | ✅ 只存储向量数据 | ⚠️ 需要额外存储 MD 文件 |
| **灵活性** | ✅ 可动态调整分块策略 | ⚠️ 文件结构相对固定 |

---

## 使用文件拆分模式

### 1. API 调用示例

```typescript
import { DocumentIndexingService } from './modules/rag/services/document-indexing.service';

const documentIndexingService = app.get(DocumentIndexingService);

const result = await documentIndexingService.index({
  filePath: '/path/to/genetics-textbook.md',
  saveChunksToFile: true,  // 启用文件拆分模式
  chunkStrategy: 'headers',  // 分块策略
  metadata: {
    title: '遗传学（第4版）',
    author: '刘祖洞',
    type: 'textbook',
  },
});

console.log(`创建了 ${result.data.chunksCreated} 个分块`);
console.log(`文件保存在: ./data/split-docs`);
```

### 2. 分块策略

#### headers（推荐用于教材）
按 Markdown 标题结构分块，保持语义完整性。

```typescript
chunkStrategy: 'headers'
```

**生成的文件结构示例**:
```
data/split-docs/
├── genetics-textbook-chunk-0.md        # 第一章内容
├── genetics-textbook-chunk-1.md        # 第二章内容
├── genetics-textbook-chunk-2.md        # 第三章第一节
├── genetics-textbook-chunk-3.md        # 第三章第二节
└── ...
```

**每个文件包含**:
```markdown
# 第一章 遗传学绪论

---
**Chunk ID:** genetics-textbook_chunk_0
**Document ID:** genetics-textbook
---

遗传学是研究生物遗传和变异规律的科学...

（实际内容）
```

#### paragraphs
按段落分块，适合非结构化文档。

```typescript
chunkStrategy: 'paragraphs'
```

#### sentences
按句子分块，适合精细检索。

```typescript
chunkStrategy: 'sentences'
```

---

### 3. 自定义文件名模式

可以通过环境变量或配置修改文件名模式：

```typescript
const result = await documentIndexingService.index({
  filePath: '/path/to/genetics-textbook.md',
  saveChunksToFile: true,
  chunkStrategy: 'headers',
  // 默认模式: `{documentId}-chunk-{index}.md`
  // 可用变量: {documentId}, {index}, {chapter}, {section}
});
```

**自定义示例**:
```typescript
// 在 document-splitter.service.ts 中修改
filenamePattern: '{chapter}-{section}-chunk-{index}.md'
```

生成的文件名示例:
```
data/split-docs/
├── 遗传学绪论-遗传学发展-chunk-0.md
├── 孟德尔定律-分离定律-chunk-1.md
└── ...
```

---

## 文件拆分服务

### DocumentSplitterService

新增的服务类，提供灵活的文档拆分功能。

```typescript
import { DocumentSplitterService } from './modules/rag/services/document-splitter.service';

const splitterService = app.get(DocumentSplitterService);

const result = await splitterService.splitMarkdownFile(
  '/path/to/genetics-textbook.md',
  {
    outputDir: './data/split-docs',      // 输出目录
    chunkSize: 2000,                      // 块大小（字符）
    chunkOverlap: 200,                     // 重叠大小
    strategy: 'headers',                   // 分块策略
    saveToFile: true,                      // 是否保存文件
    filenamePattern: '{documentId}-chunk-{index}.md',
  },
);

console.log(`生成了 ${result.chunks.length} 个分块`);
console.log(`保存了 ${result.files.length} 个文件`);
```

### 批量处理

```typescript
const filePaths = [
  '/path/to/chapter1.md',
  '/path/to/chapter2.md',
  '/path/to/chapter3.md',
];

const results = await splitterService.batchSplitFiles(
  filePaths,
  {
    strategy: 'headers',
    saveToFile: true,
  },
);

results.forEach((result, filePath) => {
  console.log(`${filePath}: ${result.chunks.length} chunks`);
});
```

---

## 推荐使用场景

### 适合使用文件拆分模式：

1. **教材和参考书**
   - 知识结构清晰，按章节组织
   - 需要频繁更新内容
   - 需要便于查阅和维护

2. **团队协作项目**
   - 多人共同维护知识库
   - 需要版本控制追踪
   - 需要代码审查

3. **知识管理系统**
   - 需要可视化的知识结构
   - 需要增量更新
   - 需要便于调试和验证

### 适合使用内存分块模式：

1. **临时文档**
   - 一次性索引
   - 不需要长期维护
   - 追求处理速度

2. **动态内容**
   - 内容频繁变化
   - 不需要保留历史版本
   - 自动化处理流程

3. **性能敏感场景**
   - 大规模批量处理
   - 实时性要求高
   - 存储空间有限

---

## 实际使用示例

### 处理遗传学教材

```typescript
// 处理完整的遗传学教材
const result = await documentIndexingService.index({
  filePath: 'C:/Users/16244/MinerU/遗传学【十二五国家级规划教材】 (刘祖洞) (Z-Library).pdf-67861eba-47ec-4d36-a3f5-199a29829b24/full.md',
  saveChunksToFile: true,
  chunkStrategy: 'headers',
  documentId: 'genetics-textbook-4th-edition',
  metadata: {
    title: '遗传学（第4版）',
    author: '刘祖洞、吴燕华、乔守怡、赵寿元',
    publisher: '高等教育出版社',
    year: '2021',
    type: 'textbook',
    topics: ['遗传学', '生物学', '教材'],
  },
});

console.log('处理结果:', result);
```

### 生成的文件结构

```
data/split-docs/
├── genetics-textbook-4th-edition-chunk-0.md        # 遗传学绪论
├── genetics-textbook-4th-edition-chunk-1.md        # 孟德尔定律
├── genetics-textbook-4th-edition-chunk-2.md        # 遗传的细胞学基础
├── genetics-textbook-4th-edition-chunk-3.md        # 连锁与交换
├── genetics-textbook-4th-edition-chunk-4.md        # 性别决定与伴性遗传
└── ...（更多章节）
```

### 查看分块内容

可以直接打开任何生成的 MD 文件查看：

```bash
# 查看某个分块
cat data/split-docs/genetics-textbook-4th-edition-chunk-1.md
```

### 增量更新

如果某个章节需要更新，只需：

1. 编辑对应的分块文件
2. 重新索引该文件
3. 向量数据库会自动更新

```typescript
// 只重新索引更新的章节
await documentIndexingService.index({
  filePath: 'data/split-docs/genetics-textbook-4th-edition-chunk-1.md',
  saveChunksToFile: false,  // 不再拆分，直接使用
  documentId: 'genetics-textbook-4th-edition-chunk-1',
});
```

---

## 配置选项

### 默认配置

```typescript
{
  outputDir: './data/split-docs',      // 输出目录
  chunkSize: 2000,                      // 块大小（字符）
  chunkOverlap: 200,                     // 重叠大小
  strategy: 'headers',                   // 分块策略
  saveToFile: true,                      // 是否保存文件
  filenamePattern: '{documentId}-chunk-{index}.md',
}
```

### 调整块大小

根据文档类型调整：

- **技术文档**: 1000-1500 字符
- **教材**: 2000-3000 字符
- **论文**: 1500-2500 字符

```typescript
{
  chunkSize: 2500,  // 更大的块
  chunkOverlap: 300, // 更大的重叠
}
```

---

## 故障排除

### 问题：文件未生成

**检查**:
1. 确保 `saveChunksToFile: true`
2. 检查输出目录权限
3. 查看日志输出

**解决**:
```typescript
const result = await documentIndexingService.index({
  filePath: '/path/to/file.md',
  saveChunksToFile: true,
  chunkStrategy: 'headers',
});

console.log('生成的文件:', result.data?.files);
```

### 问题：分块质量不佳

**解决**:
1. 尝试不同的分块策略
2. 调整块大小和重叠
3. 确保文档格式规范

```typescript
// 尝试按段落分块
{
  chunkStrategy: 'paragraphs',
  chunkSize: 1500,
  chunkOverlap: 150,
}
```

### 问题：向量检索不准确

**解决**:
1. 检查分块内容是否完整
2. 增加重叠大小以保持上下文
3. 考虑使用 `headers` 策略保持语义完整性

---

## 最佳实践

### 1. 选择合适的分块策略

- **结构化文档**（教材、论文）→ `headers`
- **非结构化文档**（文章、报告）→ `paragraphs`
- **需要精细检索** → `sentences`

### 2. 保持适当的重叠

- 一般文档: 10-20% 重叠
- 技术文档: 15-25% 重叠
- 教材: 20-30% 重叠

### 3. 定期维护

- 定期检查生成的文件
- 清理无用的分块文件
- 更新过时的内容

### 4. 版本控制

将生成的分块文件纳入版本控制：

```bash
git add data/split-docs/
git commit -m "Add split documents for genetics textbook"
```

---

## 总结

文件拆分模式提供了更好的可读性、可维护性和可调试性，特别适合教材类文档的处理。结合内存分块模式，可以根据具体场景选择最合适的方案。

**推荐配置**:
- **教材**: 文件拆分模式 + headers 策略
- **论文**: 文件拆分模式 + paragraphs 策略
- **临时文档**: 内存分块模式

---

*最后更新: 2026-02-18*
