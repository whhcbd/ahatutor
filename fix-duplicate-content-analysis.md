# 重复内容问题诊断和修复方案

## 🔍 问题分析

### 问题表现
用户收到的回答中，以下内容出现了重复：

1. **examples（例子）** - 在textAnswer中出现，又在UI部分单独显示
2. **followUpQuestions（后续建议问题）** - 在textAnswer中出现，又在UI部分单独显示
3. **relatedConcepts（相关概念）** - 在textAnswer中出现，又在UI部分单独显示

### 根本原因

AI生成的结构化响应包含以下字段：
```typescript
{
  textAnswer: string,              // 文本回答
  examples: Array<{...}>,         // 例子（结构化）
  followUpQuestions: string[],     // 后续问题（结构化）
  relatedConcepts: string[]        // 相关概念（结构化）
}
```

**问题在于**：AI在生成 `textAnswer` 时，可能将 `examples`、`followUpQuestions`、`relatedConcepts` 的内容也包含在文本回答中，导致：

```
textAnswer: "基因组测序技术在个性化医疗中的应用非常广泛...
            例子：癌症治疗中的基因组测序应用...
            后续建议问题：个性化医疗如何改变现代医学实践？
            相关概念：疾病风险评估、药物反应预测..."

examples: [                    // UI单独显示
  { "title": "癌症治疗中的基因组测序应用", ... },
  { "title": "遗传性疾病的基因组测序诊断", ... }
]

followUpQuestions: [            // UI单独显示
  "个性化医疗如何改变现代医学实践？",
  ...
]

relatedConcepts: [              // UI单独显示
  "疾病风险评估",
  "药物反应预测",
  ...
]
```

### 问题代码位置

**后端生成响应**：`visual-designer.service.ts#L1263-1272`

```typescript
return {
  textAnswer: response.textAnswer,              // AI生成的文本
  visualization,
  examples: response.examples,                 // 结构化例子
  followUpQuestions: response.followUpQuestions, // 结构化后续问题
  relatedConcepts: response.relatedConcepts,     // 结构化相关概念
  learningPath,
  citations,
  sources,
};
```

**问题**：Prompt中没有明确告诉AI `textAnswer` 不应该包含 `examples`、`followUpQuestions`、`relatedConcepts`。

## 🔧 修复方案

### 方案1：修改Prompt（推荐）

在 `visual-designer.service.ts` 的Prompt中明确说明 `textAnswer` 不应包含其他字段的内容。

**位置**：`visual-designer.service.ts` 中的 `answerQuestion` 方法，大约在1040-1085行

**修改内容**：

```typescript
// 在Prompt的"核心要求"部分添加：

**核心要求：**
1. **严格基于参考资料回答**：所有答案必须来自上面的参考资料
2. **标注来源**：在每个关键点后用[参考资料N]标注
3. **明确章节**：在回答中明确说明答案来自课本的哪个章节

**回答格式要求（非常重要）：**
- `textAnswer`：只包含对问题的直接文字回答，**不要**在文本回答中单独列出"举例说明"、"后续建议问题"、"相关概念"等标题或内容
- `examples`：将具体的例子放在这个数组中，**不要**在textAnswer中重复
- `followUpQuestions`：将后续建议问题放在这个数组中，**不要**在textAnswer中重复
- `relatedConcepts`：将相关概念放在这个数组中，**不要**在textAnswer中重复

**示例格式：**

❌ 错误示例（textAnswer包含其他内容）：
```
基因组测序技术在个性化医疗中的应用非常广泛。
举例说明：
1. 癌症治疗中的基因组测序应用...
2. 遗传性疾病的基因组测序诊断...
后续建议问题：
1. 个性化医疗如何改变现代医学实践？
2. 基因组测序技术在罕见病诊断中的应用有哪些？
相关概念：
疾病风险评估、药物反应预测、遗传性疾病的诊断、癌症治疗、基因组测序
```

✅ 正确示例（textAnswer只包含核心回答）：
```
基因组测序技术在个性化医疗中的应用非常广泛。通过分析个体的基因组，可以预测个体患某些遗传性疾病的可能性，从而采取预防措施。此外，基因组测序还可以帮助医生了解患者对特定药物的反应，从而选择最合适的治疗方案。在癌症治疗中，测序可以帮助识别癌症中的基因突变，从而指导治疗策略，例如靶向治疗和免疫治疗[参考资料1]。
```

同时，examples、followUpQuestions、relatedConcepts应该分别填写：
```json
{
  "textAnswer": "基因组测序技术在个性化医疗中的应用非常广泛...",
  "examples": [
    {"title": "癌症治疗中的基因组测序应用", "description": "..."},
    {"title": "遗传性疾病的基因组测序诊断", "description": "..."}
  ],
  "followUpQuestions": [
    "个性化医疗如何改变现代医学实践？",
    "基因组测序技术在罕见病诊断中的应用有哪些？"
  ],
  "relatedConcepts": ["疾病风险评估", "药物反应预测", ...]
}
```
```

### 方案2：后端去重处理

在返回响应前，检查并移除 `textAnswer` 中的重复内容。

**位置**：`visual-designer.service.ts#L1263` 之前

```typescript
private cleanTextAnswer(
  textAnswer: string,
  examples?: Array<{ title: string; description: string }>,
  followUpQuestions?: string[],
  relatedConcepts?: string[]
): string {
  if (!textAnswer) return textAnswer;

  let cleanedAnswer = textAnswer;

  // 移除"举例说明"部分
  if (examples && examples.length > 0) {
    const examplePatterns = [
      /举例说明[：:][\s\S]*?(?=\n\n|\n(?=[一二三四五六七八九十])|$)/g,
      /例子[：:][\s\S]*?(?=\n\n|\n(?=[一二三四五六七八九十])|$)/g,
    ];
    examplePatterns.forEach(pattern => {
      cleanedAnswer = cleanedAnswer.replace(pattern, '');
    });
  }

  // 移除"后续建议问题"部分
  if (followUpQuestions && followUpQuestions.length > 0) {
    const questionPatterns = [
      /后续建议问题[：:][\s\S]*?(?=\n\n|\n(?=[一二三四五六七八九十])|$)/g,
      /您可能还想了解[：:][\s\S]*?(?=\n\n|\n(?=[一二三四五六七八九十])|$)/g,
    ];
    questionPatterns.forEach(pattern => {
      cleanedAnswer = cleanedAnswer.replace(pattern, '');
    });
  }

  // 移除"相关概念"部分
  if (relatedConcepts && relatedConcepts.length > 0) {
    const conceptPatterns = [
      /相关概念[：:][\s\S]*?(?=\n\n|\n(?=[一二三四五六七八九十])|$)/g,
    ];
    conceptPatterns.forEach(pattern => {
      cleanedAnswer = cleanedAnswer.replace(pattern, '');
    });
  }

  // 清理多余的空行
  cleanedAnswer = cleanedAnswer.replace(/\n{3,}/g, '\n\n').trim();

  return cleanedAnswer;
}
```

**使用方法**：

```typescript
return {
  textAnswer: this.cleanTextAnswer(
    response.textAnswer,
    response.examples,
    response.followUpQuestions,
    response.relatedConcepts
  ),
  visualization,
  examples: response.examples,
  followUpQuestions: response.followUpQuestions,
  relatedConcepts: response.relatedConcepts,
  learningPath,
  citations,
  sources,
};
```

### 方案3：前端过滤（辅助方案）

在前端显示前，检查并过滤重复内容。

**位置**：前端组件中处理响应的地方

```typescript
const filterDuplicateContent = (
  textAnswer: string,
  examples?: Array<{ title: string; description: string }>,
  followUpQuestions?: string[],
  relatedConcepts?: string[]
): { textAnswer: string; hasDuplicates: boolean } => {
  if (!textAnswer) return { textAnswer, hasDuplicates: false };

  let hasDuplicates = false;

  // 检查是否包含"举例说明"
  if (examples && examples.length > 0) {
    const exampleKeywords = ['举例说明', '例子', '例如'];
    hasDuplicates = hasDuplicates || exampleKeywords.some(keyword =>
      textAnswer.includes(keyword)
    );
  }

  // 检查是否包含"后续建议问题"
  if (followUpQuestions && followUpQuestions.length > 0) {
    const questionKeywords = ['后续建议问题', '您可能还想了解', '相关问题'];
    hasDuplicates = hasDuplicates || questionKeywords.some(keyword =>
      textAnswer.includes(keyword)
    );
  }

  // 检查是否包含"相关概念"
  if (relatedConcepts && relatedConcepts.length > 0) {
    const conceptKeywords = ['相关概念', '相关知识点'];
    hasDuplicates = hasDuplicates || relatedConcepts.some(concept =>
      textAnswer.includes(concept)
    );
  }

  if (!hasDuplicates) {
    return { textAnswer, hasDuplicates: false };
  }

  // 移除重复内容
  let cleanedAnswer = textAnswer;

  // 移除"举例说明"部分
  const exampleSectionPattern = /(?:举例说明|例子)[：:][\s\S]*?(?=\n\n|\n(?=[一二三四五六七八九十])|$)/g;
  cleanedAnswer = cleanedAnswer.replace(exampleSectionPattern, '');

  // 移除"后续建议问题"部分
  const questionSectionPattern = /(?:后续建议问题|您可能还想了解)[：:][\s\S]*?(?=\n\n|\n(?=[一二三四五六七八九十])|$)/g;
  cleanedAnswer = cleanedAnswer.replace(questionSectionPattern, '');

  // 移除"相关概念"部分
  const conceptSectionPattern = /相关概念[：:][\s\S]*?(?=\n\n|\n(?=[一二三四五六七八九十])|$)/g;
  cleanedAnswer = cleanedAnswer.replace(conceptSectionPattern, '');

  // 清理多余的空行
  cleanedAnswer = cleanedAnswer.replace(/\n{3,}/g, '\n\n').trim();

  return { textAnswer: cleanedAnswer, hasDuplicates: true };
};

// 使用
const { textAnswer: cleanedText, hasDuplicates } = filterDuplicateContent(
  response.textAnswer,
  response.examples,
  response.followUpQuestions,
  response.relatedConcepts
);

if (hasDuplicates) {
  console.warn('检测到重复内容，已自动过滤');
}
```

## 📋 推荐实施方案

### 阶段1：快速修复（立即生效）
使用**方案2**（后端去重），不需要修改Prompt，立即解决重复问题。

### 阶段2：根本解决（长期优化）
使用**方案1**（修改Prompt），从源头避免AI生成重复内容。

### 阶段3：双重保障（可选）
同时使用**方案3**（前端过滤），作为最后的保障。

## 🧪 测试验证

修复后，测试以下场景：

1. **正常场景**：AI不生成重复内容
2. **重复场景**：AI生成重复内容，后端/前端自动过滤
3. **边界场景**：部分字段缺失，不影响过滤逻辑

## 📊 预期效果

### 修复前
```
textAnswer: "基因组测序技术在个性化医疗中的应用非常广泛...
            举例说明：
            1. 癌症治疗中的基因组测序应用...
            2. 遗传性疾病的基因组测序诊断...
            后续建议问题：
            1. 个性化医疗如何改变现代医学实践？
            相关概念：
            疾病风险评估、药物反应预测..."

UI显示：
[文本回答部分] - 包含examples、followUpQuestions、relatedConcepts
[例子部分] - 重复显示examples
[后续问题部分] - 重复显示followUpQuestions
[相关概念部分] - 重复显示relatedConcepts
```

### 修复后
```
textAnswer: "基因组测序技术在个性化医疗中的应用非常广泛。通过分析个体的基因组，可以预测个体患某些遗传性疾病的可能性，从而采取预防措施。此外，基因组测序还可以帮助医生了解患者对特定药物的反应，从而选择最合适的治疗方案..."

UI显示：
[文本回答部分] - 只包含核心回答
[例子部分] - 显示examples
[后续问题部分] - 显示followUpQuestions
[相关概念部分] - 显示relatedConcepts
```

## ✅ 总结

**问题原因**：AI在生成 `textAnswer` 时，将 `examples`、`followUpQuestions`、`relatedConcepts` 的内容也包含在文本中，导致与结构化字段重复。

**解决方案**：
1. **修改Prompt**（推荐）：从源头避免AI生成重复内容
2. **后端去重**（快速）：在返回响应前过滤重复内容
3. **前端过滤**（辅助）：在显示前再次检查和过滤

**推荐步骤**：
1. 立即实施方案2（后端去重）
2. 后续优化方案1（修改Prompt）
3. 可选添加方案3（前端过滤）
