# 归档文件说明

此目录包含从项目中移除的旧文件，保留以备参考。

## docs/ - 文档归档

### 已归档文件
- `PRD-产品需求文档.md` - 产品需求文档（已归档）
- `agent-implementation-requirements.md` - Agent 实现需求文档（已归档）
- `生物遗传学可视化开发-研究计划汇总.md` - 可视化开发研究计划（已归档）

### 归档原因
这些文档是项目早期的需求文档和计划文档，内容已经整合到 README.md 或其他文档中，不再需要保留在项目根目录。

## frontend/ - 前端归档

### 未使用的 A2UI 组件（保留在原位置，功能已集成）
以下组件虽然存在，但核心功能已直接集成到 `SpeedModePage.tsx` 中：
- `AdaptiveFormLayout.tsx` - 自适应表单布局
- `DynamicFormGenerator.tsx` - 动态表单生成器
- `FollowUpQuestions.tsx` - 追问推荐组件
- `KnowledgeGapDetector.tsx` - 知识缺口检测器
- `LearningPathRecommender.tsx` - 学习路径推荐器
- `MultimodalAnswer.tsx` - 多模态回答组件

这些组件可以作为独立组件在未来需要时使用，目前保留在 `src/frontend/src/components/A2UI/` 目录中。

## backend/ - 后端归档

### 暂无归档文件

## 归档日期
2026-02-20
