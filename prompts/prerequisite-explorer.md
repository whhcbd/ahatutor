# 前置知识探索 Prompt 模板（核心创新）

你是一位遗传学教育专家。请分析以下遗传学概念，找出理解它所需的前置知识。

**目标概念**: {concept}
**递归深度**: {maxDepth} 层
**停止条件**: 达到高中生物学基础水平

## 任务说明

请递归思考："要理解 {concept}，学生必须先掌握什么？"

1. 列出 3-5 个直接前置概念
2. 对每个前置概念，继续思考它的前置知识
3. 递归分解，直到达到基础概念
4. 构建完整的知识依赖树

## 返回格式

```json
{
  "concept": "伴性遗传",
  "prerequisites": [
    {
      "concept": "孟德尔定律",
      "prerequisites": [
        {
          "concept": "基因型/表型",
          "prerequisites": [
            { "concept": "基因", "isFoundation": true },
            { "concept": "显隐性", "isFoundation": true }
          ]
        },
        {
          "concept": "分离定律",
          "prerequisites": [
            { "concept": "减数分裂", "isFoundation": true }
          ]
        }
      ]
    },
    {
      "concept": "性染色体",
      "prerequisites": [
        { "concept": "染色体", "isFoundation": true }
      ]
    },
    {
      "concept": "性状遗传",
      "prerequisites": [
        { "concept": "显隐性性状", "isFoundation": true }
      ]
    }
  ]
}
```

## 遗传学基础概念参考

以下是遗传学的基础概念（达到这些概念时停止递归）：

### 基础概念（isFoundation = true）
- 基因（Gene）
- 染色体（Chromosome）
- DNA
- RNA
- 显性/隐性
- 减数分裂
- 有丝分裂
- 细胞核
- 性状（Trait）

### 中级概念
- 基因型/表型
- 等位基因
- 纯合子/杂合子
- 配子
- 性染色体/常染色体

### 高级概念
- 孟德尔定律
- 伴性遗传
- 连锁互换
- 哈代-温伯格定律

## 示例

### 输入
**目标概念**: 伴性遗传
**递归深度**: 3 层

### 输出
```json
{
  "concept": "伴性遗传",
  "description": "位于性染色体上的基因所控制的性状的遗传方式",
  "prerequisites": [
    {
      "concept": "孟德尔定律",
      "level": 1,
      "prerequisites": [
        {
          "concept": "基因型与表型",
          "level": 2,
          "prerequisites": [
            {
              "concept": "基因",
              "isFoundation": true,
              "description": "遗传的基本单位，控制生物性状的DNA片段"
            },
            {
              "concept": "显性与隐性",
              "isFoundation": true,
              "description": "等位基因在杂合状态下表现出来的性状为显性，不表现出来的为隐性"
            }
          ]
        },
        {
          "concept": "分离定律",
          "level": 2,
          "prerequisites": [
            {
              "concept": "减数分裂",
              "isFoundation": true,
              "description": "产生配子时，同源染色体分离，等位基因分离"
            }
          ]
        }
      ]
    },
    {
      "concept": "性染色体",
      "level": 1,
      "prerequisites": [
        {
          "concept": "染色体",
          "isFoundation": true,
          "description": "细胞核内携带遗传信息的线状结构"
        }
      ]
    },
    {
      "concept": "性状遗传方式",
      "level": 1,
      "prerequisites": [
        {
          "concept": "显隐性性状",
          "isFoundation": true,
          "description": "性状分为显性性状和隐性性状"
        }
      ]
    }
  ]
}
```

## 知识树可视化

上述示例可以表示为以下知识树：

```
伴性遗传 [目标 - Level 0]
├─ 孟德尔定律 [Level 1]
│   ├─ 基因型与表型 [Level 2]
│   │   ├─ 基因 [基础 ✓]
│   │   └─ 显性与隐性 [基础 ✓]
│   └─ 分离定律 [Level 2]
│       └─ 减数分裂 [基础 ✓]
├─ 性染色体 [Level 1]
│   └─ 染色体 [基础 ✓]
└─ 性状遗传方式 [Level 1]
    └─ 显隐性性状 [基础 ✓]
```

## 核心优势

- ✅ 不跳过概念
- ✅ 逻辑递进
- ✅ 从基础到目标
- ✅ 递归发现依赖关系
- ✅ 零训练数据，纯递归推理
