# 分析脚本

本目录包含用于分析和验证项目数据的脚本。

## 脚本说明

### 内容分析
- `analyze-hardcoded-content.js` - 分析硬编码内容
- `analyze-real-hardcoded.js` - 分析真实硬编码数据
- `analyze-visualization-hardcoded.js` - 分析可视化硬编码数据

### 章节验证
- `check-chapters.js` - 检查章节结构
- `check-chapter-field.js` - 检查章节字段
- `check-chunk-details.js` - 检查分块详情

### 数据验证
- `check-full-md-structure.js` - 检查完整 Markdown 结构
- `comprehensive-chapter-verification.js` - 综合章节验证
- `detailed-content-verification.js` - 详细内容验证
- `debug-chapters.js` - 调试章节问题
- `deep-check-chapter12.js` - 深度检查第12章
- `direct-chunk-inspection.js` - 直接分块检查
- `final-verification.js` - 最终验证
- `inspect-chunk-structure.js` - 检查分块结构
- `verify-chapters.js` - 验证章节
- `verify-chapters2.js` - 验证章节（版本2）

### 报告生成
- `comprehensive-chapter-verification-report.json` - 综合章节验证报告
- `detailed-content-verification-report.json` - 详细内容验证报告
- `final-hardcoded-report.json` - 最终硬编码报告
- `hardcoded-content-analysis.json` - 硬编码内容分析
- `real-hardcoded-analysis.json` - 真实硬编码分析
- `visualization-hardcoded-analysis.json` - 可视化硬编码分析

## 使用方法

运行脚本需要 Node.js 环境：

```bash
node scripts/analyze/analyze-hardcoded-content.js
```

## 注意事项

- 这些脚本主要用于开发和调试阶段
- 部分脚本可能需要特定的环境变量或配置
- 报告文件为 JSON 格式，可手动查看或使用其他工具分析
