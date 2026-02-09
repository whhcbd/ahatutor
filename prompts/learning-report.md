# 学情报告生成 Prompt 模板

基于用户学习数据生成学情报告：

**用户数据**:
```json
{learningData}
```

**报告类型**: {reportType} (daily/weekly/subject/mistake)

## 任务说明

基于用户的学习数据，生成包含以下内容的学情报告：

1. **学习概览**：总题数、正确数、正确率、学习时长
2. **知识点掌握度**：各知识点的掌握情况（0-100%）
3. **薄弱点分析**：需要加强的知识点
4. **错误类型分布**：低级错误 vs 高级错误
5. **复习建议**：针对性的复习计划

## 返回格式

```json
{
  "summary": {
    "totalQuestions": 20,
    "correctAnswers": 16,
    "accuracy": 0.8,
    "timeSpent": 45,
    "timeSpentUnit": "minutes"
  },
  "topicMastery": [
    {
      "topic": "孟德尔第一定律",
      "mastery": 90,
      "questionsCount": 8,
      "accuracy": 0.9,
      "lastStudied": "2024-01-15T10:30:00Z"
    },
    {
      "topic": "伴性遗传",
      "mastery": 60,
      "questionsCount": 5,
      "accuracy": 0.6,
      "lastStudied": "2024-01-15T11:00:00Z"
    }
  ],
  "weakTopics": [
    "伴性遗传",
    "连锁互换"
  ],
  "errorDistribution": {
    "lowLevelErrors": 2,
    "highLevelErrors": 2,
    "byTopic": {
      "孟德尔第一定律": {"low": 1, "high": 0},
      "伴性遗传": {"low": 0, "high": 2},
      "连锁互换": {"low": 1, "high": 0}
    }
  },
  "recommendations": [
    {
      "type": "review",
      "topic": "伴性遗传",
      "priority": "high",
      "action": "建议复习伴性遗传的基本原理，特别是X连锁隐性遗传的计算方法",
      "resources": ["教材第5章", "相关视频教程"]
    },
    {
      "type": "practice",
      "topic": "连锁互换",
      "priority": "medium",
      "action": "建议多做连锁互换相关的计算题，重点掌握重组率的计算",
      "resources": ["习题集第3单元"]
    }
  ],
  "charts": [
    {
      "type": "pie",
      "title": "正确率分布",
      "data": {
        "labels": ["正确", "错误"],
        "values": [16, 4]
      }
    },
    {
      "type": "bar",
      "title": "知识点掌握度",
      "data": {
        "labels": ["孟德尔第一定律", "伴性遗传", "连锁互换"],
        "values": [90, 60, 75]
      }
    },
    {
      "type": "radar",
      "title": "能力雷达图",
      "data": {
        "labels": ["概念理解", "计算能力", "应用能力", "分析能力"],
        "values": [85, 70, 75, 80]
      }
    }
  ]
}
```

## 报告类型说明

### 日报告 (daily)
- 当日学习概览
- 当日薄弱知识点
- 明日复习建议

### 周报告 (weekly)
- 一周学习趋势
- 知识点掌握度变化
- 下周学习计划

### 专题报告 (subject)
- 某知识点的详细分析
- 相关错题总结
- 深度学习建议

### 错题报告 (mistake)
- 错题分类统计
- 错误原因分析
- 举一反三练习建议

## 示例

### 输入
```json
{
  "date": "2024-01-15",
  "questions": [
    {"topic": "孟德尔第一定律", "correct": true, "errorType": null},
    {"topic": "伴性遗传", "correct": false, "errorType": "high_level"},
    {"topic": "孟德尔第一定律", "correct": true, "errorType": null},
    {"topic": "连锁互换", "correct": false, "errorType": "low_level"}
  ],
  "timeSpent": 45
}
```

### 输出
```json
{
  "summary": {
    "totalQuestions": 4,
    "correctAnswers": 2,
    "accuracy": 0.5,
    "timeSpent": 45,
    "timeSpentUnit": "minutes"
  },
  "topicMastery": [
    {
      "topic": "孟德尔第一定律",
      "mastery": 100,
      "questionsCount": 2,
      "accuracy": 1.0,
      "lastStudied": "2024-01-15T10:30:00Z"
    },
    {
      "topic": "伴性遗传",
      "mastery": 0,
      "questionsCount": 1,
      "accuracy": 0.0,
      "lastStudied": "2024-01-15T10:35:00Z"
    },
    {
      "topic": "连锁互换",
      "mastery": 0,
      "questionsCount": 1,
      "accuracy": 0.0,
      "lastStudied": "2024-01-15T10:40:00Z"
    }
  ],
  "weakTopics": ["伴性遗传", "连锁互换"],
  "errorDistribution": {
    "lowLevelErrors": 1,
    "highLevelErrors": 1,
    "byTopic": {
      "孟德尔第一定律": {"low": 0, "high": 0},
      "伴性遗传": {"low": 0, "high": 1},
      "连锁互换": {"low": 1, "high": 0}
    }
  },
  "recommendations": [
    {
      "type": "review",
      "topic": "伴性遗传",
      "priority": "high",
      "action": "伴性遗传是高级错误，需要重新学习基本概念。建议复习教材第5章，理解X连锁遗传的计算方法。",
      "resources": ["教材第5章", "伴性遗传视频教程"]
    },
    {
      "type": "practice",
      "topic": "连锁互换",
      "priority": "medium",
      "action": "连锁互换是低级错误，可能是计算失误。建议多做几道练习题，注意计算细节。",
      "resources": ["习题集第3单元"]
    }
  ],
  "charts": [
    {
      "type": "pie",
      "title": "今日正确率",
      "data": {
        "labels": ["正确", "错误"],
        "values": [2, 2]
      }
    }
  ]
}
```
