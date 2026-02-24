# A2UI 语言规范 - 思维导图可视化

## 概述

A2UI (AI-to-User Interface) 是一种用于AI生成用户界面内容的描述语言。本规范定义了思维导图可视化的指令格式，使AI能够生成符合前端渲染规范的结构化数据。

## 基本语法结构

### 指令格式

```
[A2UI-MINDMAP]
  title: "思维导图标题"
  description: "思维导图描述"
  root: {
    id: "root-id",
    text: "根节点文本",
    type: "concept|principle|example|definition",
    color: "#颜色代码",
    children: [子节点列表]
  }
  layout: "radial|horizontal|vertical|tree"
  style: {
    nodeShape: "circle|rect|rounded|pill",
    edgeType: "solid|dashed|dotted",
    edgeWidth: 1-5,
    fontFamily: "字体名称",
    fontSize: 12-24
  }
  interactions: ["click|hover|zoom|drag|expand"]
  annotations: [注释列表]
[/A2UI-MINDMAP]
```

## 参数定义

### 1. 基础参数

#### title (必需)
思维导图的标题，用于显示在顶部

#### description (可选)
思维导图的简要说明，解释这个思维导图要表达什么内容

#### root (必需)
思维导图的根节点对象

### 2. 节点对象 (Node)

节点对象包含以下属性：

```typescript
interface MindMapNode {
  id: string;              // 唯一标识符
  text: string;            // 节点显示文本
  type: 'concept' | 'principle' | 'example' | 'definition' | 'process' | 'outcome';
  level: number;           // 层级深度（0为根节点）
  expanded: boolean;       // 是否展开子节点
  color?: string;          // 节点背景颜色（覆盖默认颜色）
  textColor?: string;      // 文本颜色
  borderColor?: string;    // 边框颜色
  children?: MindMapNode[]; // 子节点列表
  metadata?: {
    importance: 'low' | 'medium' | 'high';
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    relatedConcepts?: string[];
    examples?: string[];
  };
}
```

#### 节点类型 (type)

| 类型 | 说明 | 默认颜色 | 适用场景 |
|------|------|----------|----------|
| concept | 核心概念 | #4F46E5 | 表示主要知识点 |
| principle | 原理/定律 | #0891B2 | 表示基本原理 |
| example | 示例 | #059669 | 表示具体例子 |
| definition | 定义 | #7C3AED | 表示概念定义 |
| process | 过程 | #EA580C | 表示流程或步骤 |
| outcome | 结果 | #DC2626 | 表示结果或结论 |

### 3. 布局类型 (layout)

| 布局类型 | 说明 | 适用场景 |
|----------|------|----------|
| radial | 放射状布局 | 展示从中心向外扩散的概念关系 |
| horizontal | 水平树状布局 | 展示时间线或流程 |
| vertical | 垂直树状布局 | 展示层级关系 |
| tree | 标准树状布局 | 通用层级结构 |

### 4. 样式配置 (style)

```typescript
interface MindMapStyle {
  // 节点样式
  nodeShape: 'circle' | 'rect' | 'rounded' | 'pill';
  nodeWidth?: number;       // 节点宽度（仅矩形/圆角矩形）
  nodeHeight?: number;      // 节点高度
  borderRadius?: number;   // 圆角半径（仅圆角矩形）

  // 连线样式
  edgeType: 'solid' | 'dashed' | 'dotted';
  edgeWidth: number;
  edgeColor?: string;
  curved?: boolean;         // 是否使用曲线连接

  // 文本样式
  fontFamily: string;
  fontSize: number;
  fontWeight: 'normal' | 'bold' | 'lighter';

  // 间距配置
  levelSpacing?: number;    // 层级间距
  nodeSpacing?: number;     // 同级节点间距
}
```

### 5. 交互配置 (interactions)

支持以下交互功能：

| 交互类型 | 说明 | 实现效果 |
|----------|------|----------|
| click | 点击节点 | 显示节点详细信息 |
| hover | 悬停节点 | 高亮相关节点 |
| zoom | 缩放画布 | 鼠标滚轮或按钮缩放 |
| drag | 拖拽节点 | 调整节点位置 |
| expand | 展开/折叠 | 显示或隐藏子节点 |

### 6. 注释 (annotations)

```typescript
interface Annotation {
  nodeId: string;          // 关联的节点ID
  text: string;            // 注释内容
  position: 'top' | 'bottom' | 'left' | 'right';
  style?: {
    color?: string;
    backgroundColor?: string;
    fontSize?: number;
  };
}
```

## 使用规则

### 规则1: 层级限制
- 最大层级深度不超过 6 层
- 每个节点的直接子节点数量建议不超过 8 个

### 规则2: 节点ID规范
- 节点ID必须全局唯一
- 使用 kebab-case 命名，例如: `mendel-first-law`
- 包含层级信息，例如: `concept-1-2` 表示第1层第2个节点

### 规则3: 颜色使用
- 优先使用预定义的节点类型颜色
- 自定义颜色应使用十六进制格式（#RRGGBB）
- 确保文本与背景颜色对比度足够（WCAG AA标准）

### 规则4: 文本长度
- 节点文本长度建议不超过 20 个字符
- 超长文本应使用省略号处理
- 完整内容通过 hover 或 click 查看详细信息

### 规则5: 响应式设计
- 默认配置应适配移动端显示
- 支持自动调整布局以适应屏幕大小

## 完整示例

### 示例1: 孟德尔遗传定律

```
[A2UI-MINDMAP]
  title: "孟德尔遗传定律"
  description: "展示孟德尔第一和第二遗传定律的关系"
  root: {
    id: "mendel-laws",
    text: "孟德尔定律",
    type: "concept",
    level: 0,
    expanded: true,
    children: [
      {
        id: "first-law",
        text: "分离定律",
        type: "principle",
        level: 1,
        expanded: true,
        children: [
          {
            id: "first-law-def",
            text: "基因分离",
            type: "definition",
            level: 2
          },
          {
            id: "first-law-process",
            text: "减数分裂",
            type: "process",
            level: 2
          },
          {
            id: "first-law-example",
            text: "豌豆杂交",
            type: "example",
            level: 2
          }
        ]
      },
      {
        id: "second-law",
        text: "自由组合定律",
        type: "principle",
        level: 1,
        expanded: true,
        children: [
          {
            id: "second-law-def",
            text: "独立分配",
            type: "definition",
            level: 2
          },
          {
            id: "second-law-process",
            text: "非同源染色体",
            type: "process",
            level: 2
          },
          {
            id: "second-law-example",
            text: "两对性状",
            type: "example",
            level: 2
          }
        ]
      }
    ]
  }
  layout: "radial"
  style: {
    nodeShape: "rounded",
    edgeType: "solid",
    edgeWidth: 2,
    fontFamily: "Arial",
    fontSize: 14
  }
  interactions: ["click", "hover", "zoom", "drag", "expand"]
  annotations: [
    {
      nodeId: "first-law",
      text: "适用于一对相对性状",
      position: "bottom"
    },
    {
      nodeId: "second-law",
      text: "适用于两对或以上相对性状",
      position: "bottom"
    }
  ]
[/A2UI-MINDMAP]
```

### 示例2: DNA复制过程

```
[A2UI-MINDMAP]
  title: "DNA复制过程"
  description: "展示DNA复制的主要步骤和关键酶"
  root: {
    id: "dna-replication",
    text: "DNA复制",
    type: "concept",
    level: 0,
    expanded: true,
    children: [
      {
        id: "initiation",
        text: "起始阶段",
        type: "process",
        level: 1,
        children: [
          {
            id: "origin",
            text: "复制起点",
            type: "concept",
            level: 2
          },
          {
            id: "helicase",
            text: "解旋酶",
            type: "principle",
            level: 2
          },
          {
            id: "ssb",
            text: "单链结合蛋白",
            type: "principle",
            level: 2
          }
        ]
      },
      {
        id: "elongation",
        text: "延伸阶段",
        type: "process",
        level: 1,
        children: [
          {
            id: "primase",
            text: "引物酶",
            type: "principle",
            level: 2
          },
          {
            id: "dna-polymerase",
            text: "DNA聚合酶",
            type: "principle",
            level: 2,
            children: [
              {
                id: "leading-strand",
                text: "前导链",
                type: "process",
                level: 3
              },
              {
                id: "lagging-strand",
                text: "后随链",
                type: "process",
                level: 3
              }
            ]
          }
        ]
      },
      {
        id: "termination",
        text: "终止阶段",
        type: "process",
        level: 1,
        children: [
          {
            id: "telomere",
            text: "端粒",
            type: "concept",
            level: 2
          },
          {
            id: "telomerase",
            text: "端粒酶",
            type: "principle",
            level: 2
          }
        ]
      }
    ]
  }
  layout: "vertical"
  style: {
    nodeShape: "pill",
    edgeType: "solid",
    edgeWidth: 2,
    curved: true,
    fontFamily: "Arial",
    fontSize: 13
  }
  interactions: ["click", "hover", "zoom", "expand"]
[/A2UI-MINDMAP]
```

## AI 输出格式

当AI判断需要生成思维导图时，应在回答中嵌入以下格式的指令：

```markdown
## 可视化说明

为了更好地理解这个概念，我为你生成了一个思维导图：

[A2UI-MINDMAP]
  // ... 配置内容
[/A2UI-MINDMAP]

这个思维导图展示了概念之间的层级关系。你可以：
- 点击节点查看详细信息
- 拖拽节点调整布局
- 使用滚轮缩放查看
- 点击节点右上角的 +/- 按钮展开或折叠子节点
```

## 错误处理

### 常见错误

1. **节点ID重复**: 系统会自动为重复ID添加后缀
2. **层级过深**: 自动折叠超过6层的子节点
3. **文本过长**: 自动截断超长文本并添加省略号
4. **颜色无效**: 回退到默认颜色

### 验证规则

前端渲染时进行以下验证：

```typescript
function validateMindMap(data: MindMapData): ValidationResult {
  const errors: string[] = [];
  
  // 验证根节点
  if (!data.root) errors.push('缺少根节点');
  
  // 验证节点ID唯一性
  const ids = new Set();
  function checkNode(node: MindMapNode) {
    if (ids.has(node.id)) errors.push(`重复的节点ID: ${node.id}`);
    ids.add(node.id);
    node.children?.forEach(checkNode);
  }
  checkNode(data.root);
  
  // 验证层级深度
  let maxDepth = 0;
  function checkDepth(node: MindMapNode, depth: number) {
    if (depth > maxDepth) maxDepth = depth;
    node.children?.forEach(child => checkDepth(child, depth + 1));
  }
  checkDepth(data.root, 0);
  if (maxDepth > 6) errors.push(`层级深度超过限制: ${maxDepth}`);
  
  return {
    valid: errors.length === 0,
    errors
  };
}
```

## 扩展性

### 自定义节点类型

如需添加新的节点类型，在 `MindMapNode.type` 中添加新类型，并定义对应的颜色和样式：

```typescript
// 在配置中添加
const NODE_TYPE_COLORS: Record<string, string> = {
  concept: '#4F46E5',
  principle: '#0891B2',
  example: '#059669',
  definition: '#7C3AED',
  process: '#EA580C',
  outcome: '#DC2626',
  // 添加新类型
  application: '#16A34A',
  limitation: '#991B1B'
};
```

### 自定义布局算法

支持添加新的布局算法：

```typescript
interface LayoutAlgorithm {
  name: string;
  calculate: (nodes: MindMapNode[], width: number, height: number) => LayoutResult;
}

// 示例：添加螺旋布局
const spiralLayout: LayoutAlgorithm = {
  name: 'spiral',
  calculate: (nodes, width, height) => {
    // 计算螺旋布局
  }
};
```

## 最佳实践

1. **保持简洁**: 每个思维导图聚焦一个核心概念
2. **层次清晰**: 使用颜色和形状区分不同类型的节点
3. **交互友好**: 提供直观的交互反馈和提示
4. **可访问性**: 确保颜色对比度和文本大小符合无障碍标准
5. **性能优化**: 控制节点总数，避免渲染性能问题
