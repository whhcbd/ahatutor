# AhaTutor 项目实现提示词

## 项目概述

AhaTutor 是一个基于 AI 的智能教育辅导平台，专注于为学生提供个性化的学习体验和交互式学习工具。项目采用现代全栈技术栈，包含前端、后端和共享类型包，实现了完整的 AI 辅导、交互式可视化、知识图谱构建等功能。

## 核心功能需求

### 1. 前端系统
- React 18.3 + TypeScript 5.6 单页应用
- Vite 5.4 构建系统和开发服务器
- 响应式设计，支持桌面和移动设备
- 速通模式（Speed Mode）学习界面
- AI 聊天交互界面，支持 SSE 实时流式响应
- A2UI 动态组件渲染系统
- 交互式可视化组件（Punnett 方格、思维导图等）
- 知识图谱可视化
- 学习进度跟踪和分析
- 用户认证和授权

### 2. 后端系统
- NestJS 10 + TypeScript 5.6 模块化架构
- 智能代理管道系统（Agent Pipeline）
- 概念分析和知识图谱构建
- 可视化设计器和动态生成器
- SSE 流式响应服务
- RAG（检索增强生成）系统
- 多模态 AI 集成
- 学习路径规划和推荐
- 答案评估和反馈
- 模板匹配和 A2UI 适配器
- 组件目录服务

### 3. 共享类型和工具
- TypeScript 类型定义共享包
- 常量和枚举定义
- 工具函数和辅助方法
- 跨模块类型一致性保证

## 技术栈要求

### 前端
- React 18.3.1
- TypeScript 5.6.2
- Vite 5.4.8
- React DOM 18.3.1
- A2UI 组件系统
- Tailwind CSS 或类似样式方案
- React Router 6+
- Axios 或 Fetch API
- 现代 ESNext 模块系统

### 后端
- NestJS 10.3.2
- TypeScript 5.6.2
- Node.js 18+
- PostgreSQL (关系型数据库)
- Neo4j (知识图谱)
- FAISS (向量存储)
- Redis (缓存)
- Swagger/OpenAPI 文档
- Passport.js 认证

### 开发工具
- pnpm 8.15.1+ (或 npm 9+)
- Git 版本控制
- ESLint 和 Prettier
- Jest 和 Testing Library
- ts-node 用于开发运行
- Docker 用于容器化

## 项目架构设计

### 1. 目录结构

```
ahatutor/
├── README.md
├── package.json
├── pnpm-workspace.yaml     # 或 npm workspaces 配置
├── src/
│   ├── frontend/           # React 前端
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vite.config.ts
│   │   ├── index.html
│   │   └── src/
│   │       ├── main.tsx
│   │       ├── App.tsx
│   │       ├── pages/
│   │       │   ├── SpeedModePage.tsx
│   │       │   ├── ChatPage.tsx
│   │       │   └── ...
│   │       ├── components/
│   │       │   ├── A2UI/        # A2UI 组件
│   │       │   ├── Visualization/  # 可视化组件
│   │       │   └── ...
│   │       ├── services/
│   │       └── types/
│   ├── backend/            # NestJS 后端
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── nest-cli.json
│   │   └── src/
│   │       ├── main.ts
│   │       ├── app.module.ts
│   │       └── modules/
│   │           ├── agents/      # AI 代理模块
│   │           ├── auth/        # 认证模块
│   │           ├── users/       # 用户模块
│   │           ├── knowledge/   # 知识管理模块
│   │           └── ...
│   └── shared/             # 共享类型包
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           ├── index.ts
│           ├── types/
│           ├── constants/
│           └── utils/
└── .gitignore
```

### 2. 核心模块设计

#### 前端核心模块
- **SpeedModePage**: 速通模式主页面，包含问题展示、AI 回答、交互式可视化
- **A2UIRenderer**: 动态 A2UI 组件渲染器
- **Visualization Components**: 各种交互式可视化组件
- **ChatService**: 处理与后端的 SSE 连接
- **AuthService**: 用户认证和授权

#### 后端核心模块
- **AgentPipelineService**: AI 代理管道核心服务
- **ConceptAnalyzerService**: 概念分析和知识图谱构建
- **VisualDesignerService**: 可视化设计和模板生成
- **DynamicVizGeneratorService**: 动态可视化生成
- **StreamResponseService**: SSE 流式响应服务
- **A2UIAdapterService**: A2UI 组件适配服务
- **ComponentCatalogService**: 组件目录管理

## 关键功能实现细节

### 1. 速通模式实现
- 问题展示和用户输入界面
- AI 响应实时流式显示
- 交互式可视化动态渲染
- A2UI 模板支持
- 学习进度保存和加载

### 2. AI 聊天系统
- SSE (Server-Sent Events) 连接管理
- 实时流式响应处理
- 消息历史管理
- 多轮对话支持
- 错误处理和重连机制

### 3. 交互式可视化
- A2UI 组件注册表
- 动态组件加载和渲染
- 模板化可视化生成
- 变量替换和数据绑定
- 交互事件处理

### 4. 知识图谱
- 概念关系提取和构建
- Neo4j 图数据库集成
- 图谱可视化展示
- 知识路径分析

### 5. RAG 系统
- 文档嵌入和向量存储
- 相似度搜索和检索
- 上下文增强生成
- FAISS 向量索引

## 技术实现要求

### 1. 模块系统配置
- 共享包使用 ESNext 模块系统
- 前端使用 ESNext 模块系统
- 后端使用 CommonJS 或 ESNext 模块系统
- 确保模块间正确导入和导出
- TypeScript 路径别名配置

### 2. TypeScript 配置
- 严格模式编译
- 路径别名设置
- 类型定义完整性
- 模块解析配置
- 编译目标和模块设置

### 3. 开发和部署
- 开发服务器配置（前端: 5173, 后端: 3001）
- 热模块替换（HMR）支持
- 构建优化和代码分割
- 环境变量配置
- Docker 容器化支持

### 4. 测试要求
- 单元测试覆盖率 ≥ 80%
- 集成测试关键功能
- 端到端测试核心流程
- 类型检查和 linting

## 数据模型设计

### 1. 核心实体
- **User**: 用户信息和学习进度
- **ChatSession**: 聊天会话和消息历史
- **Concept**: 知识点和概念
- **Visualization**: 可视化配置和模板
- **LearningPath**: 学习路径和推荐
- **Assessment**: 评估和反馈

### 2. API 设计
- RESTful API 设计规范
- SSE 端点用于实时响应
- WebSocket 用于双向通信
- 认证和授权中间件
- 错误处理和日志记录

## 实现步骤

### 1. 项目初始化
- 创建 monorepo 项目结构
- 配置 package.json 和工作区
- 设置 TypeScript 配置文件
- 初始化 Git 仓库

### 2. 共享包开发
- 创建类型定义
- 实现工具函数
- 配置模块导出
- 构建共享包

### 3. 后端实现
- 创建 NestJS 项目结构
- 实现核心模块和服务
- 配置数据库连接
- 实现 API 端点
- 集成 AI 服务

### 4. 前端实现
- 创建 React + Vite 项目
- 实现页面和组件
- 配置路由和状态管理
- 实现与后端的通信
- 开发交互式可视化组件

### 5. 集成和测试
- 集成前端和后端
- 测试核心功能
- 性能优化
- 安全性检查

### 6. 部署和文档
- 编写部署脚本
- 创建 Docker 配置
- 更新 README.md 文档
- 准备生产环境配置

## 关键技术难点

1. **SSE 实时通信**: 确保前端能够正确处理后端的流式响应，包括连接管理、错误处理和重连机制

2. **A2UI 动态渲染**: 实现灵活的组件注册表和动态加载系统，支持不同类型的可视化组件

3. **知识图谱构建**: 从用户输入和学习内容中提取概念关系，构建和更新知识图谱

4. **RAG 系统优化**: 确保向量检索的准确性和效率，提高 AI 回答的相关性

5. **模块系统集成**: 解决前端、后端和共享包之间的模块系统差异，确保类型安全和正确导入

6. **性能优化**: 优化前端渲染性能，特别是在处理复杂可视化和实时数据流时

7. **安全性**: 实现安全的用户认证和授权，保护用户数据和系统资源

## 成功标准

1. **功能完整性**: 实现所有核心功能，包括速通模式、AI 聊天、交互式可视化等

2. **技术正确性**: 使用指定的技术栈，遵循最佳实践，确保代码质量和可维护性

3. **性能表现**: 系统响应迅速，可视化渲染流畅，AI 回答生成及时

4. **类型安全**: 所有 TypeScript 类型检查通过，无编译错误

5. **部署就绪**: 系统可以成功部署到生产环境，配置合理

6. **文档完整**: README.md 和其他文档完整，包含安装、运行和开发说明

7. **测试覆盖**: 关键功能有充分的测试覆盖，确保系统稳定性

## 注意事项

1. **代码质量**: 遵循 TypeScript 和 React 最佳实践，保持代码整洁和可维护

2. **类型定义**: 确保共享类型包的类型定义准确完整，前端和后端使用一致的类型

3. **错误处理**: 实现全面的错误处理，包括网络错误、API 错误和用户输入错误

4. **安全性**: 注意 SQL 注入、XSS 攻击等安全问题，实现适当的防护措施

5. **可扩展性**: 设计系统时考虑未来功能扩展，使用模块化和可插拔的架构

6. **兼容性**: 确保代码在不同浏览器和环境中正常运行

7. **性能监控**: 实现基本的性能监控和日志记录，便于问题排查

## 开发命令

### 开发环境启动
```bash
# 安装依赖
npm install

# 构建共享包
cd src/shared
npm run build

# 启动后端开发服务器
cd ../backend
npm run dev

# 启动前端开发服务器
cd ../frontend
npm run dev
```

### 构建和部署
```bash
# 构建所有项目
npm run build:all

# 运行测试
npm run test

# 生产环境启动
npm run start:prod
```

## 总结

AhaTutor 项目是一个复杂但功能强大的智能教育平台，结合了现代前端和后端技术，实现了 AI 驱动的个性化学习体验。通过本提示词，AI 应该能够理解项目的整体架构和核心功能，并按照技术要求实现完整的系统。

项目的成功实现将为学生提供一个智能、交互式的学习平台，帮助他们更有效地掌握知识和技能。