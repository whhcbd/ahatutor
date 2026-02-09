# 举一反三 Prompt 模板

基于以下错题，生成3道相似题用于巩固练习：

**原题**: {question}
**考点**: {topic}
**用户错误**: {userAnswer}
**错误类型**: {errorType}

## 任务说明

1. 保持相同知识点和难度
2. 改变题目条件和数值
3. 可以改变问法但考点不变
4. 返回 JSON 格式

## 返回格式

```json
{
  "similarQuestions": [
    {
      "id": "sq_001",
      "question": "变式题1的题目内容",
      "options": [
        {"id": "A", "label": "A", "content": "选项内容"},
        {"id": "B", "label": "B", "content": "选项内容"},
        {"id": "C", "label": "C", "content": "选项内容"},
        {"id": "D", "label": "D", "content": "选项内容"}
      ],
      "correctAnswer": "A",
      "explanation": {
        "level1": "最简练解析",
        "level2": "简要解释",
        "level3": "标准解析",
        "level4": "详细讲解",
        "level5": "教学级解析"
      },
      "variation": "说明这道题是如何变式的（如：改变数值、改变情景、改变问法等）"
    }
  ]
}
```

## 变式方法

1. **数值变化**：改变题目中的数值但保持原理相同
2. **情景变化**：改变题目背景但保持考点相同
3. **问法变化**：从不同角度考查同一知识点
4. **逆向提问**：从结果推导原因
5. **条件变化**：增加或减少条件，考查边界情况

## 示例

### 输入
**原题**: 豌豆高茎(D)对矮茎(d)为显性，杂合子自交后代表现型比例是多少？
**考点**: 孟德尔第一定律
**用户错误**: B. 1:1
**错误类型**: high_level

### 输出
```json
{
  "similarQuestions": [
    {
      "id": "sq_001",
      "question": "豌豆圆粒(R)对皱粒(r)为显性，杂合子自交后代表现型比例是多少？",
      "options": [
        {"id": "A", "label": "A", "content": "3:1"},
        {"id": "B", "label": "B", "content": "1:1"},
        {"id": "C", "label": "C", "content": "1:2:1"},
        {"id": "D", "label": "D", "content": "9:3:3:1"}
      ],
      "correctAnswer": "A",
      "explanation": {
        "level1": "3:1",
        "level2": "圆粒:皱粒 = 3:1",
        "level3": "Rr × Rr → RR:Rr:rr = 1:2:1，表现型为圆粒:皱粒 = 3:1",
        "level4": "根据孟德尔分离定律，杂合子自交，显性性状与隐性性状的表现型比例始终为3:1，无论具体是什么性状",
        "level5": "完整推导过程..."
      },
      "variation": "数值变化：将高茎/矮茎替换为圆粒/皱粒，考查同样的分离定律原理"
    },
    {
      "id": "sq_002",
      "question": "已知某性状由一对等位基因控制，显性纯合子与隐性纯合子杂交，F1自交，F2中显性性状占多少比例？",
      "options": [
        {"id": "A", "label": "A", "content": "1/4"},
        {"id": "B", "label": "B", "content": "1/2"},
        {"id": "C", "label": "C", "content": "3/4"},
        {"id": "D", "label": "D", "content": "全部"}
      ],
      "correctAnswer": "C",
      "explanation": {
        "level1": "3/4",
        "level2": "显性:隐性 = 3:1，显性占3/4",
        "level3": "AA × aa → Aa，Aa × Aa → AA:Aa:aa = 1:2:1，显性(AA+Aa)占3/4",
        "level4": "这是考查对分离定律的理解，杂合子自交，显性性状始终占3/4",
        "level5": "完整推导过程..."
      },
      "variation": "问法变化：从具体的"多少比例"改为"占多少比例"，并使用遗传学术语"
    },
    {
      "id": "sq_003",
      "question": "孟德尔用豌豆进行杂交实验，F1自交得到的F2中，与亲本性状不同的个体占多少？",
      "options": [
        {"id": "A", "label": "A", "content": "1/4"},
        {"id": "B", "label": "B", "content": "1/2"},
        {"id": "C", "label": "C", "content": "3/4"},
        {"id": "D", "label": "D", "content": "无法确定"}
      ],
      "correctAnswer": "A",
      "explanation": {
        "level1": "1/4",
        "level2": "只有隐性纯合子与显性亲本不同，占1/4",
        "level3": "亲本为AA和aa，F1为Aa，F2为AA:Aa:aa=1:2:1，只有aa与亲本AA不同，占1/4",
        "level4": "这是一道逆向思考题，考查对分离定律结果的理解",
        "level5": "完整推导过程..."
      },
      "variation": "逆向提问：从"表现型比例"改为"与亲本不同的个体比例"，需要思考哪些基因型与亲本相同"
    }
  ]
}
```
