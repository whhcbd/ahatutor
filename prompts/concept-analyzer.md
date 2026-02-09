# 概念分析 Prompt 模板

分析以下遗传学概念：

**用户输入**: {input}
**用户水平**: {userLevel}

## 任务说明

请分析用户真正在问什么，提取关键信息：

1. **核心概念**：用户想了解的主要概念是什么？
2. **领域分类**：属于遗传学的哪个分支？
3. **复杂度评估**：这个概念的难度等级？
4. **可视化潜力**：这个概念适合用什么方式可视化？
5. **关键术语**：涉及的重要术语有哪些？

## 返回格式

```json
{
  "input": "解释伴性遗传",
  "coreConcept": "伴性遗传",
  "domain": "遗传学",
  "subDomain": "分子遗传学",
  "complexity": "intermediate",
  "visualizationPotential": 0.85,
  "suggestedVisualizations": [
    "家系图（Pedigree Chart）",
    "Punnett Square",
    "染色体图示"
  ],
  "keyTerms": [
    "性染色体",
    "X连锁",
    "Y连锁",
    "隐性遗传",
    "显性遗传"
  ],
  "relatedConcepts": [
    "孟德尔定律",
    "染色体",
    "基因"
  ]
}
```

## 复杂度分级

- **basic**: 基础概念（如基因、染色体）
- **intermediate**: 中级概念（如孟德尔定律、伴性遗传）
- **advanced**: 高级概念（如连锁互换、哈代-温伯格定律）

## 可视化类型

| 可视化类型 | 适用场景 | 示例 |
|-----------|---------|------|
| 家系图 | 伴性遗传、系谱分析 | 红绿色盲遗传家系 |
| Punnett Square | 基因型组合预测 | Aa × Aa 的后代 |
| 染色体图示 | 染色体结构、连锁互换 | 染色体交换示意图 |
| 知识图谱 | 概念关系展示 | 遗传学知识树 |
| 流程图 | 过程展示 | 减数分裂过程 |
| 柱状图/饼图 | 数据展示 | 基因型频率分布 |

## 示例

### 示例 1：简单概念

**输入**: 什么是基因？

**输出**:
```json
{
  "input": "什么是基因？",
  "coreConcept": "基因",
  "domain": "遗传学",
  "subDomain": "分子遗传学",
  "complexity": "basic",
  "visualizationPotential": 0.7,
  "suggestedVisualizations": [
    "DNA双螺旋结构",
    "基因在染色体上的位置",
    "基因表达流程图"
  ],
  "keyTerms": [
    "DNA",
    "遗传信息",
    "蛋白质合成"
  ],
  "relatedConcepts": [
    "染色体",
    "DNA",
    "RNA"
  ]
}
```

### 示例 2：复杂概念

**输入**: 解释伴性遗传，并举例说明

**输出**:
```json
{
  "input": "解释伴性遗传，并举例说明",
  "coreConcept": "伴性遗传",
  "domain": "遗传学",
  "subDomain": "分子遗传学",
  "complexity": "intermediate",
  "visualizationPotential": 0.95,
  "suggestedVisualizations": [
    "家系图（展示多代遗传模式）",
    "Punnett Square（计算后代概率）",
    "性染色体图示（展示基因位置）"
  ],
  "keyTerms": [
    "性染色体",
    "X连锁遗传",
    "Y连锁遗传",
    "隐性遗传",
    "携带者"
  ],
  "relatedConcepts": [
    "孟德尔定律",
    "染色体",
    "基因型/表型"
  ],
  "requiresExample": true,
  "suggestedExamples": [
    "红绿色盲（X连锁隐性遗传）",
    "血友病（X连锁隐性遗传）",
    "外耳道多毛症（Y连锁遗传）"
  ]
}
```

### 示例 3：计算问题

**输入**: 红绿色盲是X连锁隐性遗传，如果母亲是携带者(X^BX^b)，父亲正常(X^BY)，他们的儿子患色盲的概率是多少？

**输出**:
```json
{
  "input": "红绿色盲是X连锁隐性遗传，如果母亲是携带者(X^BX^b)，父亲正常(X^BY)，他们的儿子患色盲的概率是多少？",
  "coreConcept": "伴性遗传概率计算",
  "domain": "遗传学",
  "subDomain": "分子遗传学",
  "complexity": "intermediate",
  "visualizationPotential": 0.9,
  "suggestedVisualizations": [
    "Punnett Square（展示配子组合）",
    "家系图（展示遗传模式）"
  ],
  "keyTerms": [
    "X连锁隐性遗传",
    "携带者",
    "概率计算"
  ],
  "relatedConcepts": [
    "伴性遗传",
    "孟德尔定律",
    "减数分裂"
  ],
  "requiresCalculation": true,
  "calculationType": "punnett_square",
  "parent1": "X^BX^b",
  "parent2": "X^BY"
}
```
