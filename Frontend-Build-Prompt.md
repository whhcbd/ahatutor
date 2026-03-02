# 前端网页构建提示词

## 项目背景

构建一个类似 AhaTutor 的教育平台前端网页，提供可视化教学、AI 智能问答、学习路径、知识图谱等核心功能。

---

## 系统提示词（System Prompt）

```
你是一个专业的前端开发专家，精通 React 18.3、TypeScript、Vite、Tailwind CSS 和现代前端架构。你的任务是帮助用户构建一个功能完整、性能优秀的教育平台前端应用。

**核心能力**：
- React 18.3 + TypeScript 组件开发
- Vite 构建工具配置
- shadcn/ui 组件库集成
- Tailwind CSS 响应式设计
- Axios HTTP 客户端
- SSE (Server-Sent Events) 实时通信
- React Context + Hooks 状态管理
- React Router 路由管理
- 响应式设计和移动端适配

**开发原则**：
1. 组件化设计 - 创建可复用、可维护的组件
2. 类型安全 - 充分利用 TypeScript 类型系统
3. 性能优化 - 使用 React.memo、useMemo、useCallback 优化渲染
4. 响应式设计 - 确保在各种设备上良好显示
5. 可访问性 - 遵循 WCAG 2.1 AA 标准
6. 用户体验 - 提供流畅的交互和清晰的反馈

**输出要求**：
- 代码必须包含完整的 TypeScript 类型定义
- 所有组件必须有清晰的注释说明功能
- 使用函数式组件 + Hooks 模式
- 遵循项目现有的代码风格和约定
- 提供完整的导入路径和依赖说明
```

---

## 一、项目结构设计

### 目录结构
```
src/
├── assets/              # 静态资源
│   ├── images/
│   ├── icons/
│   └── fonts/
├── components/          # 可复用组件
│   ├── common/          # 通用组件
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── Loading.tsx
│   ├── layout/          # 布局组件
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   └── Navigation.tsx
│   ├── chat/            # 聊天相关组件
│   │   ├── ChatContainer.tsx
│   │   ├── ChatMessage.tsx
│   │   ├── ChatInput.tsx
│   │   └── StreamingResponse.tsx
│   ├── visualization/   # 可视化组件
│   │   ├── A2UIChartRenderer.tsx
│   │   ├── A2UIComponentMapper.tsx
│   │   └── [40+ genetics components]
│   ├── quiz/            # 测验组件
│   │   ├── QuizContainer.tsx
│   │   ├── QuestionCard.tsx
│   │   ├── AnswerOptions.tsx
│   │   └── ResultSummary.tsx
│   └── knowledge-graph/ # 知识图谱组件
│       ├── GraphVisualization.tsx
│       ├── NodeCard.tsx
│       └── ConnectionLine.tsx
├── pages/               # 页面组件
│   ├── Home.tsx
│   ├── Chat.tsx
│   ├── LearningPath.tsx
│   ├── KnowledgeGraph.tsx
│   ├── Quiz.tsx
│   ├── Visualization.tsx
│   └── UserProfile.tsx
├── hooks/               # 自定义 Hooks
│   ├── useChat.ts
│   ├── useAuth.ts
│   ├── useLearningPath.ts
│   ├── useSSE.ts
│   └── useDebounce.ts
├── services/            # API 服务
│   ├── api.ts           # Axios 实例配置
│   ├── chatService.ts
│   ├── ragService.ts
│   ├── visualizationService.ts
│   ├── quizService.ts
│   └── learningPathService.ts
├── stores/              # 状态管理
│   ├── AuthContext.tsx
│   ├── ChatContext.tsx
│   └── UIContext.tsx
├── types/               # TypeScript 类型定义
│   ├── chat.types.ts
│   ├── visualization.types.ts
│   ├── quiz.types.ts
│   └── common.types.ts
├── utils/               # 工具函数
│   ├── format.ts
│   ├── validation.ts
│   ├── constants.ts
│   └── helpers.ts
├── App.tsx              # 根组件
├── main.tsx             # 入口文件
└── vite-env.d.ts        # Vite 类型声明
```

---

## 二、核心功能模块

### 1. 主页 (Home Page)

**功能要求**：
- 欢迎横幅，展示平台核心价值
- 快速导航卡片（AI 聊天、可视化学习、测验、知识图谱）
- 热门主题推荐
- 学习进度概览
- 最近访问记录

**技术实现**：
```typescript
// components/layout/Home.tsx
interface HomeProps {
  userId: string;
}

interface HomeData {
  popularTopics: Topic[];
  recentAccess: RecentAccess[];
  learningProgress: LearningProgress;
}
```

**UI 组件**：
- HeroBanner - 英雄横幅
- FeatureCard - 功能卡片
- TopicCarousel - 主题轮播
- ProgressDashboard - 进度仪表板

---

### 2. AI 聊天模块 (Chat Module)

**功能要求**：
- 实时聊天界面（消息列表、输入框、发送按钮）
- SSE 流式响应支持
- 消息气泡样式（用户消息、AI 消息、系统消息）
- Markdown 渲染支持（代码高亮、数学公式）
- 动态图表渲染（A2UI 组件）
- 聊天历史记录
- 清空对话功能
- 消息复制功能
- 打字机效果动画

**技术实现**：
```typescript
// hooks/useChat.ts
interface UseChatReturn {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (content: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  streamResponse: (messageId: string) => EventSource;
}

// types/chat.types.ts
interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    visualization?: A2UIComponent;
    references?: string[];
    confidence?: number;
  };
}
```

**关键组件**：
- ChatContainer - 聊天容器
- ChatMessage - 消息气泡
- StreamingResponse - 流式响应处理
- MarkdownRenderer - Markdown 渲染器
- A2UIChartRenderer - 动态图表渲染

**SSE 实现**：
```typescript
// hooks/useSSE.ts
export function useSSE(endpoint: string, onMessage: (data: any) => void) {
  const [eventSource, setEventSource] = useState<EventSource | null>(null);

  const connect = useCallback(() => {
    const es = new EventSource(endpoint);
    es.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };
    setEventSource(es);
  }, [endpoint, onMessage]);

  const disconnect = useCallback(() => {
    eventSource?.close();
    setEventSource(null);
  }, [eventSource]);

  return { connect, disconnect };
}
```

---

### 3. 可视化学习模块 (Visualization Module)

**功能要求**：
- 40+ 遗传学可视化组件展示
- 组件分类导航（孟德尔遗传、染色体分析、DNA 复制等）
- 交互式演示（参数调整、动画控制）
- 组件说明文字
- 相关主题链接
- 收藏功能
- 分享功能

**技术实现**：
```typescript
// types/visualization.types.ts
interface VisualizationComponent {
  id: string;
  name: string;
  category: string;
  description: string;
  component: React.ComponentType<any>;
  parameters?: ComponentParameter[];
  relatedTopics?: string[];
}

interface ComponentParameter {
  name: string;
  type: 'number' | 'boolean' | 'select' | 'range';
  defaultValue: any;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
}
```

**组件示例 - 孟德尔第一定律**：
```typescript
// components/visualization/MendelFirstLaw.tsx
interface MendelFirstLawProps {
  parent1: 'AA' | 'Aa' | 'aa';
  parent2: 'AA' | 'Aa' | 'aa';
  dominantTrait: string;
  recessiveTrait: string;
  showAnimation?: boolean;
}

export function MendelFirstLaw({
  parent1,
  parent2,
  dominantTrait,
  recessiveTrait,
  showAnimation = true
}: MendelFirstLawProps) {
  // 实现分离定律可视化
}
```

---

### 4. 测验模块 (Quiz Module)

**功能要求**：
- 选择主题生成测验
- 多种题型（选择题、判断题、填空题）
- 答题进度显示
- 即时反馈（正确/错误提示）
- 答案解析
- 成绩统计
- 错题收藏
- 重新测验功能

**技术实现**：
```typescript
// types/quiz.types.ts
interface Quiz {
  id: string;
  topicId: string;
  topicName: string;
  questions: Question[];
  createdAt: Date;
}

interface Question {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'fill_blank';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface QuizResult {
  quizId: string;
  userId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  answers: UserAnswer[];
  completedAt: Date;
}
```

**关键组件**：
- QuizContainer - 测验容器
- QuestionCard - 问题卡片
- AnswerOptions - 答案选项
- ProgressIndicator - 进度指示器
- ResultSummary - 结果汇总
- ExplanationPanel - 解析面板

---

### 5. 学习路径模块 (Learning Path Module)

**功能要求**：
- 个性化学习路径推荐
- 主题依赖关系可视化
- 学习进度追踪
- 完成度百分比
- 下一步建议
- 学习时间统计
- 成就系统（徽章、证书）

**技术实现**：
```typescript
// types/learning-path.types.ts
interface LearningPath {
  userId: string;
  currentLevel: number;
  completedTopics: string[];
  recommendedTopics: string[];
  prerequisites: Prerequisite[];
  totalProgress: number;
  estimatedTimeRemaining: number;
}

interface Prerequisite {
  topicId: string;
  requiredTopics: string[];
  status: 'completed' | 'in_progress' | 'locked';
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress: number;
  requirement: string;
}
```

---

### 6. 知识图谱模块 (Knowledge Graph Module)

**功能要求**：
- 交互式知识图谱可视化
- 节点点击查看详情
- 关系连线显示
- 图谱缩放和平移
- 搜索节点功能
- 筛选功能（按类别、难度）
- 导出图谱功能

**技术实现**：
```typescript
// types/knowledge-graph.types.ts
interface GraphNode {
  id: string;
  label: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  x: number;
  y: number;
  size?: number;
  color?: string;
}

interface GraphEdge {
  source: string;
  target: string;
  type: 'prerequisite' | 'related' | 'extends';
  weight?: number;
}

interface KnowledgeGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
```

**使用技术**：
- D3.js 或 React-Flow 进行图谱渲染
- Force-directed graph 布局算法
- Canvas 或 SVG 渲染

---

### 7. 用户档案模块 (User Profile Module)

**功能要求**：
- 用户信息展示（头像、用户名、邮箱）
- 学习统计（总学习时间、完成主题、测验成绩）
- 成就展示（徽章、证书）
- 学习历史记录
- 设置页面（主题切换、语言设置、通知偏好）
- 账户管理（修改密码、删除账户）

---

## 三、UI/UX 设计规范

### 设计系统

**颜色主题**：
```typescript
// utils/constants.ts
export const THEME = {
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#0f172a',
    },
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    neutral: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['Fira Code', 'monospace'],
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
  },
};
```

**响应式断点**：
```typescript
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};
```

---

### 通用组件设计

**Button 组件**：
```typescript
// components/common/Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  fullWidth = false,
  children,
  disabled,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-all',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        {
          'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500':
            variant === 'primary',
          'bg-neutral-200 text-neutral-900 hover:bg-neutral-300 focus:ring-neutral-500':
            variant === 'secondary',
          'bg-transparent text-neutral-700 hover:bg-neutral-100 focus:ring-neutral-500':
            variant === 'ghost',
          'bg-error-600 text-white hover:bg-error-700 focus:ring-error-500':
            variant === 'danger',
        },
        {
          'h-8 px-3 text-sm': size === 'sm',
          'h-10 px-4 text-base': size === 'md',
          'h-12 px-6 text-lg': size === 'lg',
        },
        { 'w-full': fullWidth },
        { 'opacity-50 cursor-not-allowed': disabled || loading },
        className
      )}
      {...props}
    >
      {loading && <Loading size={size} />}
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
}
```

**Card 组件**：
```typescript
// components/common/Card.tsx
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, hover = false, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-xl shadow-sm border border-neutral-200',
        'p-6 transition-all duration-200',
        {
          'hover:shadow-md hover:-translate-y-1 cursor-pointer': hover,
        },
        className
      )}
    >
      {children}
    </div>
  );
}
```

**Modal 组件**：
```typescript
// components/common/Modal.tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        className={cn(
          'relative bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto',
          {
            'w-full max-w-md': size === 'sm',
            'w-full max-w-lg': size === 'md',
            'w-full max-w-2xl': size === 'lg',
            'w-full max-w-4xl': size === 'xl',
          }
        )}
      >
        <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-neutral-900">{title}</h2>
            <button
              onClick={onClose}
              className="text-neutral-500 hover:text-neutral-700 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
```

---

## 四、路由配置

```typescript
// App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './stores/AuthContext';
import { ChatProvider } from './stores/ChatContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ChatProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/visualization/:topicId" element={<Visualization />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/quiz/:topicId" element={<QuizDetail />} />
            <Route path="/learning-path" element={<LearningPath />} />
            <Route path="/knowledge-graph" element={<KnowledgeGraph />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ChatProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
```

---

## 五、状态管理

**AuthContext**：
```typescript
// stores/AuthContext.tsx
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 检查本地存储的 token
    const token = localStorage.getItem('auth_token');
    if (token) {
      // 验证 token 并获取用户信息
      fetchUser();
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    // 实现登录逻辑
  };

  const logout = async () => {
    // 实现登出逻辑
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}
```

**ChatContext**：
```typescript
// stores/ChatContext.tsx
interface ChatContextType {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (content: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  currentSession: string;
}

export const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSession, setCurrentSession] = useState('');

  const sendMessage = async (content: string) => {
    setIsLoading(true);
    try {
      // 发送消息到后端
      // 处理 SSE 流式响应
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{ messages, isLoading, sendMessage, clearHistory, currentSession }}
    >
      {children}
    </ChatContext.Provider>
  );
}
```

---

## 六、API 服务层

**Axios 配置**：
```typescript
// services/api.ts
import axios, { AxiosInstance, AxiosError } from 'axios';

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // 处理未授权
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

**聊天服务**：
```typescript
// services/chatService.ts
import apiClient from './api';

export const chatService = {
  sendMessage: (content: string, sessionId?: string) =>
    apiClient.post('/api/chat/message', { content, sessionId }),

  getHistory: (userId: string) =>
    apiClient.get(`/api/chat/history/${userId}`),

  clearHistory: (userId: string) =>
    apiClient.delete(`/api/chat/history/${userId}`),
};
```

**可视化服务**：
```typescript
// services/visualizationService.ts
import apiClient from './api';

export const visualizationService = {
  getComponents: () => apiClient.get('/api/visualization/components'),

  getTopics: () => apiClient.get('/api/visualization/topics'),

  getComponent: (name: string) =>
    apiClient.get(`/api/visualization/components/${name}`),

  generateChart: (prompt: string) =>
    apiClient.post('/api/visualization/generate-chart', { prompt }),
};
```

---

## 七、性能优化策略

### 1. 代码分割
```typescript
// 懒加载路由组件
import { lazy, Suspense } from 'react';

const Chat = lazy(() => import('./pages/Chat'));
const Visualization = lazy(() => import('./pages/Visualization'));
const Quiz = lazy(() => import('./pages/Quiz'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/chat" element={<Chat />} />
        <Route path="/visualization/:topicId" element={<Visualization />} />
        <Route path="/quiz" element={<Quiz />} />
      </Routes>
    </Suspense>
  );
}
```

### 2. 组件优化
```typescript
import { memo, useMemo, useCallback } from 'react';

// 使用 React.memo 避免不必要的重新渲染
export const ChatMessage = memo(({ message }: ChatMessageProps) => {
  // ...
});

// 使用 useMemo 缓存计算结果
const processedContent = useMemo(() => {
  return markdownToHtml(message.content);
}, [message.content]);

// 使用 useCallback 缓存函数引用
const handleClick = useCallback(() => {
  onReply(message.id);
}, [message.id, onReply]);
```

### 3. 虚拟滚动
```typescript
// 对于长列表使用 react-window 或 react-virtualized
import { FixedSizeList } from 'react-window';

function MessageList({ messages }: MessageListProps) {
  return (
    <FixedSizeList
      height={600}
      itemCount={messages.length}
      itemSize={100}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          <ChatMessage message={messages[index]} />
        </div>
      )}
    </FixedSizeList>
  );
}
```

---

## 八、测试策略

### 单元测试
```typescript
// 使用 React Testing Library
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('ChatMessage', () => {
  it('renders message content correctly', () => {
    const message = {
      id: '1',
      role: 'user' as const,
      content: 'Hello, world!',
      timestamp: new Date(),
    };
    render(<ChatMessage message={message} />);
    expect(screen.getByText('Hello, world!')).toBeInTheDocument();
  });

  it('calls onReply when reply button is clicked', async () => {
    const onReply = vi.fn();
    const message = {
      id: '1',
      role: 'assistant' as const,
      content: 'Test message',
      timestamp: new Date(),
    };
    render(<ChatMessage message={message} onReply={onReply} />);

    fireEvent.click(screen.getByText('回复'));
    await waitFor(() => expect(onReply).toHaveBeenCalledWith('1'));
  });
});
```

---

## 九、部署配置

### Vite 配置
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@stores': path.resolve(__dirname, './src/stores'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        },
      },
    },
  },
});
```

---

## 十、环境变量

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:3000
VITE_SSE_ENDPOINT=/api/chat/message
VITE_ENABLE_DEBUG=true

# .env.production
VITE_API_BASE_URL=https://api.example.com
VITE_SSE_ENDPOINT=/api/chat/message
VITE_ENABLE_DEBUG=false
```

---

## 使用提示词的最佳实践

### 1. 渐进式开发
从简单的功能开始，逐步添加复杂功能：
- Level 1: 基础页面布局和导航
- Level 2: 核心功能实现（聊天、可视化）
- Level 3: 高级功能（知识图谱、学习路径）
- Level 4: 优化和完善（性能、测试、部署）

### 2. 模块化开发
每次只专注于一个模块的开发：
1. 先完成通用组件
2. 再实现页面组件
3. 最后集成状态管理和 API

### 3. 迭代优化
- 先实现 MVP（最小可行产品）
- 收集用户反馈
- 持续优化和迭代

### 4. 示例驱动
在提示词中包含代码示例，帮助 AI 理解期望的输出格式：
```typescript
// 期望的组件结构示例
export function ExampleComponent({ prop1, prop2 }: ExampleProps) {
  return (
    <div className="...">
      {/* 组件实现 */}
    </div>
  );
}
```

---

## 常见问题处理

### Q: 如何处理 SSE 连接断开？
A: 实现自动重连机制：
```typescript
const reconnect = useCallback(() => {
  setTimeout(() => {
    if (!eventSource || eventSource.readyState === EventSource.CLOSED) {
      connect();
    }
  }, 3000);
}, [connect]);
```

### Q: 如何优化大量组件的性能？
A: 使用虚拟滚动和懒加载：
```typescript
import { lazy, Suspense } from 'react';
import { FixedSizeList } from 'react-window';

const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

### Q: 如何处理路由权限？
A: 使用受保护路由组件：
```typescript
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}
```

---

**总结**：这个提示词提供了构建一个完整教育平台前端应用所需的所有关键信息，包括项目结构、核心功能、技术实现、UI 设计规范、状态管理、API 集成、性能优化和部署配置。按照这个提示词，你可以系统地开发出一个功能完整、性能优秀的前端应用。
