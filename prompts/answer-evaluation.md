# 答案判断 Prompt 模板

请判断以下答案是否正确：

**题目**: {question}
**正确答案**: {correctAnswer}
**用户答案**: {userAnswer}

## 要求

1. 严格判断对错
2. 对于模糊答案，倾向于判错（让用户自评）
3. 返回 JSON 格式

## 判断标准

- **完全正确**: 用户答案与正确答案完全一致
- **同义正确**: 用户答案与正确答案意思相同（如 "3:1" 和 "3比1"）
- **错误**: 用户答案与正确答案不一致
- **模糊**: 无法确定用户答案是否正确

## 返回格式

```json
{
  "isCorrect": true/false,
  "confidence": 0-1,
  "reason": "判断理由",
  "needsSelfAssessment": true/false
}
```

## 示例

### 示例 1：完全正确

**题目**: 豌豆高茎(D)对矮茎(d)为显性，杂合子自交后代表现型比例是多少？
**正确答案**: A. 3:1
**用户答案**: A

**输出**:
```json
{
  "isCorrect": true,
  "confidence": 1.0,
  "reason": "用户选择了正确答案A",
  "needsSelfAssessment": false
}
```

### 示例 2：同义正确

**题目**: 豌豆高茎(D)对矮茎(d)为显性，杂合子自交后代表现型比例是多少？
**正确答案**: A. 3:1
**用户答案**: 3比1

**输出**:
```json
{
  "isCorrect": true,
  "confidence": 0.95,
  "reason": "用户答案"3比1"与正确答案"3:1"意思相同",
  "needsSelfAssessment": false
}
```

### 示例 3：错误

**题目**: 豌豆高茎(D)对矮茎(d)为显性，杂合子自交后代表现型比例是多少？
**正确答案**: A. 3:1
**用户答案**: B

**输出**:
```json
{
  "isCorrect": false,
  "confidence": 1.0,
  "reason": "用户选择了错误答案B（1:1），正确答案应为A（3:1）",
  "needsSelfAssessment": false
}
```

### 示例 4：模糊

**题目**: 豌豆高茎(D)对矮茎(d)为显性，杂合子自交后代表现型比例是多少？
**正确答案**: A. 3:1
**用户答案**: 3:1:1

**输出**:
```json
{
  "isCorrect": false,
  "confidence": 0.3,
  "reason": "用户答案"3:1:1"格式不正确，可能是笔误，需要用户自评",
  "needsSelfAssessment": true
}
```
