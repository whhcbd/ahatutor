# RAG内容处理指南

## 概述

本指南说明如何处理教科书文件中的图片和习题内容，并将其整合到RAG向量数据库中。

## 功能说明

### 1. 图片处理与OCR

- 自动识别文档中的所有图片
- 使用GLM-OCR API提取图片中的文本
- 为非文本图片生成详细描述
- 添加完整的上下文关联信息（页码、章节、段落位置等）
- 按照RAG系统标准进行格式转换与数据清洗

### 2. 习题提取与去重

- 从文档中精准提取每章末尾的习题
- 识别题型（选择题、填空题、计算题、论述题等）
- 提取答案和解析
- 自动去重，避免数据冗余
- 按照刷题模式的JSON格式存储

### 3. 数据质量控制

- OCR文本提取准确率验证（错误率需低于0.5%）
- 习题内容完整性检查
- 格式一致性校验
- 生成详细的质量报告

### 4. RAG数据库更新

- 将处理后的图片信息转换为RAG文档格式
- 将提取的习题转换为RAG文档格式
- 自动去重，确保数据唯一性
- 备份现有数据库，防止数据丢失

## 文件说明

### 核心脚本

- `scripts/process-images-ocr.ts` - 图片OCR处理和描述生成
- `scripts/extract-exercises.ts` - 习题提取和去重
- `scripts/quality-control.ts` - 数据质量控制
- `scripts/update-rag-database.ts` - RAG数据库更新
- `scripts/process-rag-content.ts` - 主执行脚本（协调所有步骤）

### 配置文件

- GLM-OCR API密钥配置在脚本中：`f44157a142064157934401d5e24375ec.64V3q3g98k7gaJYS`

### 输出文件

- `docs/reference/processed/processed-images.json` - 处理后的图片数据
- `docs/reference/exercises/exercises.json` - 提取的习题数据
- `docs/reference/exercises/statistics.json` - 习题统计信息
- `docs/reference/quality-reports/` - 质量检查报告
- `data/genetics-rag-final.json` - 更新后的RAG数据库
- `data/genetics-rag-backup-*.json` - RAG数据库备份

## 使用方法

### 安装依赖

```bash
cd scripts
npm install
```

### 执行完整流程

执行所有处理步骤（推荐）：

```bash
npx ts-node process-rag-content.ts --all
```

### 分步骤执行

如果需要分步执行，可以使用以下选项：

```bash
# 仅处理图片
npx ts-node process-rag-content.ts --images

# 仅提取习题
npx ts-node process-rag-content.ts --exercises

# 仅运行质量检查
npx ts-node process-rag-content.ts --quality

# 仅更新RAG数据库
npx ts-node process-rag-content.ts --update-rag

# 组合执行（处理图片和习题，运行质量检查）
npx ts-node process-rag-content.ts --images --exercises --quality
```

### 选项说明

- `--images` - 处理图片（OCR和描述生成）
- `--exercises` - 提取习题
- `--quality` - 运行质量检查
- `--update-rag` - 更新RAG数据库
- `--remove-exercises` - 从RAG数据库移除现有习题
- `--all` - 执行所有步骤
- `--help` - 显示帮助信息

## 数据格式

### 图片数据格式

```typescript
{
  id: string;                    // 唯一标识符
  filename: string;              // 文件名
  path: string;                  // 图片路径
  pageNumber?: number;           // 页码
  chapter?: string;              // 所属章节
  section?: string;              // 所属小节
  context?: string;              // 上下文文本
  ocrText?: string;             // OCR识别的文本
  description?: string;           // 图片描述
  imageType: 'text' | 'chart' | 'diagram' | 'illustration' | 'photo' | 'other';
}
```

### 习题数据格式

```typescript
{
  id: string;                    // 唯一标识符
  chapter: string;              // 章节名称
  chapterNumber: number;         // 章节编号
  question: string;             // 题目内容
  type: 'choice' | 'fill' | 'calculation' | 'essay' | 'multiple' | 'other';
  options?: string[];           // 选项（选择题）
  answer?: string;              // 答案
  explanation?: string;         // 解析
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];               // 标签
  metadata: {
    originalLine: number;       // 原始行号
    pageNumber?: number;        // 页码
    hasImage?: boolean;         // 是否包含图片
    relatedTopics?: string[];   // 相关主题
  };
}
```

### RAG文档格式

```typescript
{
  id: string;                    // 文档ID
  content: string;              // 文档内容
  metadata: {
    type: 'text' | 'image' | 'exercise';
    chapter?: string;              // 所属章节
    chapterNumber?: number;        // 章节编号
    section?: string;             // 所属小节
    pageNumber?: number;          // 页码
    difficulty?: string;          // 难度（习题）
    tags?: string[];             // 标签
    imageType?: string;          // 图片类型
    exerciseType?: string;       // 习题类型
    createdAt: string;           // 创建时间
  };
  embedding?: number[];          // 向量嵌入（后续生成）
}
```

## 质量控制标准

### OCR质量标准

- 错误率必须低于 0.5%
- 图片描述长度必须在 50-500 字之间
- 必须包含完整的上下文信息

### 习题质量标准

- 题目不能为空
- 题目长度必须在 5-1000 字之间
- 选择题必须有 2-6 个选项
- 必须包含章节信息
- 必须包含难度等级
- 必须包含相关标签

### 数据完整性标准

- 所有图片必须有唯一ID
- 所有习题必须有唯一ID
- 重复习题必须合并标签
- 缺失字段必须标记为警告

## 质量报告

质量报告包含以下信息：

### 图片质量

- 总图片数
- 处理成功的图片数
- OCR成功数
- OCR失败数
- 平均置信度
- 问题列表

### 习题质量

- 总习题数
- 有效习题数
- 无效习题数
- 重复习题数
- 缺少答案的习题数
- 问题列表

### 总体评分

- 通过/未通过状态
- 0-100 分评分
- 总结说明

## 常见问题

### Q1: OCR API调用失败怎么办？

A: 检查API密钥是否正确，确保网络连接正常。API密钥：`f44157a142064157934401d5e24375ec.64V3q3g98k7gaJYS`

### Q2: 图片描述生成不准确怎么办？

A: 质量检查会标记描述过短的图片，可以手动修正描述内容，然后重新运行。

### Q3: 习题提取不完整怎么办？

A: 检查文档格式是否符合预期。习题应该以`# 习题`开头，答案以`习题答案`开头。

### Q4: 如何验证处理结果？

A: 运行质量检查步骤，查看生成的质量报告。报告会列出所有问题和建议。

### Q5: 如何回滚到之前的RAG数据库？

A: 处理脚本会自动备份现有数据库。备份文件位于`data/genetics-rag-backup-*.json`，可以恢复。

### Q6: 习题去重后数量减少了很多，正常吗？

A: 正常。去重算法会识别内容相似的习题并合并，确保数据质量。查看统计报告了解去重详情。

## 集成到现有系统

### 图片信息检索

处理后的图片信息可以通过RAG系统检索，AI可以：

- 根据图片描述回答相关问题
- 结合上下文解释图表含义
- 提供图片的详细说明

### 习题刷题功能

提取的习题可以直接用于刷题功能：

- 按章节浏览习题
- 按难度筛选习题
- 按标签搜索习题
- 在线答题和查看答案

### 数据质量监控

建议定期运行质量检查：

```bash
npx ts-node quality-control.ts
```

确保持续保持高质量的数据。

## 注意事项

1. **API密钥安全**：不要将API密钥提交到版本控制系统
2. **数据备份**：处理前会自动备份现有数据库
3. **渐进处理**：对于大型文档，可以分步骤处理
4. **质量优先**：质量检查未通过时，不要更新到RAG数据库
5. **手动审核**：重要数据更新前，建议人工审核处理结果

## 技术支持

如遇到问题，请查看：

- 质量报告文件了解详细问题
- 控制台输出的日志信息
- 生成的JSON数据文件

## 更新日志

- **v1.0.0** (2026-02-22)
  - 初始版本
  - 支持图片OCR处理
  - 支持习题提取和去重
  - 支持数据质量控制
  - 支持RAG数据库更新
