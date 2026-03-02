# 后端服务实现功能提示词

## 项目背景

构建一个基于 NestJS 的教育平台后端服务，提供 AI 智能问答、RAG 知识检索、可视化组件管理、知识图谱、测验系统、学习路径等核心功能。

---

## 系统提示词（System Prompt）

```
你是一个资深的后端开发专家，精通 NestJS、TypeScript、Prisma ORM、Neo4j、向量数据库、LLM 集成和现代后端架构。你的任务是帮助用户构建一个高性能、可扩展、安全可靠的教育平台后端服务。

**核心能力**：
- NestJS 10.x + TypeScript 模块化架构
- Prisma ORM（PostgreSQL、MySQL）
- Neo4j 知识图谱（neo4j-driver 5.x）
- FAISS 向量存储和检索
- LangChain LLM 集成（OpenAI、Claude、DeepSeek、GLM）
- SSE (Server-Sent Events) 流式响应
- Winston 日志系统
- JWT 认证和授权
- RESTful API 设计
- Docker 容器化部署

**开发原则**：
1. 模块化设计 - 每个功能独立模块，低耦合高内聚
2. 类型安全 - 充分利用 TypeScript 类型系统
3. 依赖注入 - 使用 NestJS DI 容器管理依赖
4. 错误处理 - 统一异常处理和错误响应格式
5. 日志记录 - 关键操作必须记录日志
6. 性能优化 - 数据库查询优化、缓存策略、异步处理
7. 安全第一 - 输入验证、SQL 注入防护、XSS 防护、CSRF 防护
8. 可测试性 - 编写单元测试和集成测试

**输出要求**：
- 代码必须包含完整的 TypeScript 类型定义
- 使用 NestJS 装饰器（@Controller、@Service、@Repository 等）
- 所有服务类必须有清晰的注释说明功能
- 遵循项目现有的代码风格和约定
- 提供完整的导入路径和依赖说明
- API 端点必须包含 Swagger/OpenAPI 文档注释
```

---

## 一、项目结构设计

### 目录结构
```
src/
├── modules/                    # 功能模块
│   ├── auth/                   # 认证授权模块
│   │   ├── controllers/
│   │   │   └── auth.controller.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   └── jwt.service.ts
│   │   ├── dto/
│   │   │   ├── login.dto.ts
│   │   │   ├── register.dto.ts
│   │   │   └── refresh-token.dto.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts
│   │   └── auth.module.ts
│   ├── chat/                   # 聊天模块
│   │   ├── controllers/
│   │   │   └── chat.controller.ts
│   │   ├── services/
│   │   │   ├── chat.service.ts
│   │   │   ├── message.service.ts
│   │   │   └── sse.service.ts
│   │   ├── dto/
│   │   │   ├── send-message.dto.ts
│   │   │   └── chat-history.dto.ts
│   │   └── chat.module.ts
│   ├── rag/                    # RAG 知识检索模块
│   │   ├── controllers/
│   │   │   └── rag.controller.ts
│   │   ├── services/
│   │   │   ├── enhanced-local-embedding.service.ts
│   │   │   ├── faiss-adapter.service.ts
│   │   │   ├── knowledge-retrieval.service.ts
│   │   │   ├── text-chunking.service.ts
│   │   │   └── agent-collaboration.service.ts
│   │   ├── agents/             # AI 智能体
│   │   │   ├── concept-analyzer.agent.ts
│   │   │   ├── prerequisite-explorer.agent.ts
│   │   │   ├── instance-generator.agent.ts
│   │   │   ├── visualization-advisor.agent.ts
│   │   │   ├── difficulty-explainer.agent.ts
│   │   │   └── extension-recommender.agent.ts
│   │   ├── dto/
│   │   │   ├── search.dto.ts
│   │   │   └── rebuild.dto.ts
│   │   └── rag.module.ts
│   ├── visualization/         # 可视化模块
│   │   ├── controllers/
│   │   │   └── visualization.controller.ts
│   │   ├── services/
│   │   │   ├── visualization.service.ts
│   │   │   └── a2ui-generator.service.ts
│   │   ├── dto/
│   │   │   ├── generate-chart.dto.ts
│   │   │   └── component.dto.ts
│   │   └── visualization.module.ts
│   ├── knowledge-graph/       # 知识图谱模块
│   │   ├── controllers/
│   │   │   └── knowledge-graph.controller.ts
│   │   ├── services/
│   │   │   ├── knowledge-graph.service.ts
│   │   │   └── neo4j.service.ts
│   │   ├── dto/
│   │   │   ├── explore.dto.ts
│   │   │   └── topic.dto.ts
│   │   └── knowledge-graph.module.ts
│   ├── quiz/                   # 测验模块
│   │   ├── controllers/
│   │   │   └── quiz.controller.ts
│   │   ├── services/
│   │   │   ├── quiz.service.ts
│   │   │   ├── question-generator.service.ts
│   │   │   └── answer-evaluator.service.ts
│   │   ├── dto/
│   │   │   ├── generate-quiz.dto.ts
│   │   │   ├── submit-answer.dto.ts
│   │   │   └── quiz-result.dto.ts
│   │   └── quiz.module.ts
│   ├── learning-path/          # 学习路径模块
│   │   ├── controllers/
│   │   │   └── learning-path.controller.ts
│   │   ├── services/
│   │   │   ├── learning-path.service.ts
│   │   │   ├── recommendation.service.ts
│   │   │   └── progress-tracker.service.ts
│   │   ├── dto/
│   │   │   ├── update-progress.dto.ts
│   │   │   └── recommendation.dto.ts
│   │   └── learning-path.module.ts
│   └── users/                  # 用户模块
│       ├── controllers/
│       │   └── users.controller.ts
│       ├── services/
│       │   └── users.service.ts
│       ├── dto/
│       │   ├── create-user.dto.ts
│       │   └── update-user.dto.ts
│       └── users.module.ts
├── common/                     # 通用模块
│   ├── filters/                # 异常过滤器
│   │   └── http-exception.filter.ts
│   ├── interceptors/           # 拦截器
│   │   ├── logging.interceptor.ts
│   │   └── transform.interceptor.ts
│   ├── pipes/                  # 管道
│   │   ├── validation.pipe.ts
│   │   └── parse-int.pipe.ts
│   ├── guards/                 # 守卫
│   │   └── api-key.guard.ts
│   ├── decorators/             # 装饰器
│   │   ├── current-user.decorator.ts
│   │   └── roles.decorator.ts
│   └── constants/              # 常量
│       └── app.constants.ts
├── config/                     # 配置
│   ├── app.config.ts
│   ├── database.config.ts
│   └── llm.config.ts
├── database/                   # 数据库
│   ├── migrations/
│   └── seeds/
├── shared/                     # 共享类型
│   ├── types/
│   └── interfaces/
├── app.module.ts               # 根模块
├── main.ts                     # 入口文件
└── app.controller.ts           # 应用控制器
```

---

## 二、核心功能模块

### 1. 认证授权模块 (Auth Module)

**功能要求**：
- 用户注册（邮箱、密码、用户名）
- 用户登录（邮箱/用户名 + 密码）
- JWT Token 生成和验证
- Token 刷新机制
- 密码加密（bcrypt）
- 邮箱验证
- 密码重置
- 角色权限控制

**技术实现**：
```typescript
// modules/auth/dto/login.dto.ts
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

// modules/auth/services/auth.service.ts
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user.id, user.email);

    return {
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    };
  }

  private async generateTokens(userId: string, email: string) {
    const payload = { sub: userId, email };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    // 存储 refreshToken 到数据库
    await this.usersService.saveRefreshToken(userId, refreshToken);

    return { accessToken, refreshToken };
  }
}

// modules/auth/controllers/auth.controller.ts
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: '用户登录' })
  @ApiResponse({ status: 200, description: '登录成功' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @ApiOperation({ summary: '用户注册' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('refresh')
  @ApiOperation({ summary: '刷新 Token' })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }
}
```

---

### 2. 聊天模块 (Chat Module)

**功能要求**：
- SSE 流式响应
- 消息历史存储
- 会话管理
- 消息格式化（Markdown、代码高亮）
- 动态图表生成（A2UI）
- 上下文管理
- 消息限流

**技术实现**：
```typescript
// modules/chat/services/sse.service.ts
import { Sse } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SseService {
  private clients = new Map<string, Response>();

  addClient(userId: string, response: Response) {
    this.clients.set(userId, response);
  }

  removeClient(userId: string) {
    this.clients.delete(userId);
  }

  sendEvent(userId: string, event: SseEvent) {
    const client = this.clients.get(userId);
    if (client) {
      client.write(`data: ${JSON.stringify(event)}\n\n`);
    }
  }

  sendComplete(userId: string) {
    const client = this.clients.get(userId);
    if (client) {
      client.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
    }
  }
}

interface SseEvent {
  type: 'message' | 'chunk' | 'visualization' | 'done' | 'error';
  data?: any;
  error?: string;
}

// modules/chat/controllers/chat.controller.ts
@Controller('chat')
export class ChatController {
  constructor(
    private chatService: ChatService,
    private sseService: SseService,
  ) {}

  @Post('message')
  @UseGuards(JwtAuthGuard)
  @Sse()
  async sendMessage(
    @Body() sendMessageDto: SendMessageDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const userId = req.user['sub'];

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    this.sseService.addClient(userId, res);

    try {
      await this.chatService.processMessage(
        userId,
        sendMessageDto.content,
        sendMessageDto.sessionId,
        (event) => this.sseService.sendEvent(userId, event),
      );

      this.sseService.sendComplete(userId);
    } catch (error) {
      this.sseService.sendEvent(userId, {
        type: 'error',
        error: error.message,
      });
    } finally {
      this.sseService.removeClient(userId);
    }
  }

  @Get('history/:userId')
  @UseGuards(JwtAuthGuard)
  async getHistory(@Param('userId') userId: string) {
    return this.chatService.getHistory(userId);
  }

  @Delete('history/:userId')
  @UseGuards(JwtAuthGuard)
  async clearHistory(@Param('userId') userId: string) {
    return this.chatService.clearHistory(userId);
  }
}

// modules/chat/services/chat.service.ts
@Injectable()
export class ChatService {
  constructor(
    private messageService: MessageService,
    private ragService: RagService,
    private agentCollaborationService: AgentCollaborationService,
  ) {}

  async processMessage(
    userId: string,
    content: string,
    sessionId: string | undefined,
    onEvent: (event: SseEvent) => void,
  ) {
    // 1. 保存用户消息
    const userMessage = await this.messageService.create({
      userId,
      role: 'user',
      content,
      sessionId,
    });

    onEvent({
      type: 'message',
      data: userMessage,
    });

    // 2. RAG 检索相关上下文
    const context = await this.ragService.search(content);

    // 3. 使用 6 智能体协作生成响应
    const response = await this.agentCollaborationService.generateResponse(
      content,
      context,
      userId,
      sessionId,
    );

    // 4. 流式发送响应
    for await (const chunk of response.stream) {
      onEvent({
        type: 'chunk',
        data: chunk,
      });
    }

    // 5. 发送可视化（如果有）
    if (response.visualization) {
      onEvent({
        type: 'visualization',
        data: response.visualization,
      });
    }

    // 6. 保存 AI 消息
    await this.messageService.create({
      userId,
      role: 'assistant',
      content: response.fullContent,
      sessionId,
      metadata: {
        visualization: response.visualization,
        references: response.references,
        confidence: response.confidence,
      },
    });
  }
}
```

---

### 3. RAG 知识检索模块 (RAG Module)

**功能要求**：
- 文本分块处理
- Embedding 生成（本地 + 远程）
- 向量存储（FAISS）
- 相似度检索
- 多轮对话上下文管理
- 知识库重建
- 系统状态监控

**技术实现**：
```typescript
// modules/rag/services/enhanced-local-embedding.service.ts
import { pipeline, env } from '@xenova/transformers';

env.allowLocalModels = false;

@Injectable()
export class EnhancedLocalEmbeddingService implements OnModuleInit {
  private embeddingPipeline: any;
  private useFallback = false;

  async onModuleInit() {
    try {
      this.embeddingPipeline = await pipeline(
        'feature-extraction',
        'Xenova/all-MiniLM-L6-v2',
      );
    } catch (error) {
      this.logger.warn('Failed to load Xenova model, using fallback');
      this.useFallback = true;
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    if (this.useFallback || !this.embeddingPipeline) {
      return this.generateFallbackEmbedding(text);
    }

    try {
      const output = await this.embeddingPipeline(text, {
        pooling: 'mean',
        normalize: true,
      });
      return Array.from(output.data);
    } catch (error) {
      this.logger.error('Embedding generation failed, using fallback');
      return this.generateFallbackEmbedding(text);
    }
  }

  private generateFallbackEmbedding(text: string): number[] {
    const vector: number[] = [];
    const length = 2000; // 必须与实际向量维度匹配

    for (let i = 0; i < length; i++) {
      const charCode = text.charCodeAt(i % text.length) || 0;
      const position = i / length;
      const value = Math.sin(charCode * position * 0.1) * Math.cos(i * 0.01);
      vector.push(value);
    }

    // 归一化
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    return vector.map(val => val / magnitude);
  }
}

// modules/rag/services/faiss-adapter.service.ts
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FaissAdapterService {
  private index: any;
  private textChunks: TextChunk[] = [];

  async loadIndex(indexPath: string, chunksPath: string) {
    // 加载 FAISS 索引
    // 加载文本分块
    const chunksData = fs.readFileSync(chunksPath, 'utf-8');
    this.textChunks = JSON.parse(chunksData);
  }

  async search(queryVector: number[], topK: number = 5): Promise<SearchResult[]> {
    const results = this.index.search(queryVector, topK);

    return results.indices.map((index: number, i: number) => ({
      chunk: this.textChunks[index],
      score: results.distances[i],
    }));
  }

  async rebuildIndex(textChunks: TextChunk[]) {
    // 重建 FAISS 索引
  }
}

// modules/rag/services/agent-collaboration.service.ts
@Injectable()
export class AgentCollaborationService {
  constructor(
    private conceptAnalyzer: ConceptAnalyzerAgent,
    private prerequisiteExplorer: PrerequisiteExplorerAgent,
    private instanceGenerator: InstanceGeneratorAgent,
    private visualizationAdvisor: VisualizationAdvisorAgent,
    private difficultyExplainer: DifficultyExplainerAgent,
    private extensionRecommender: ExtensionRecommenderAgent,
    private llmService: LLMService,
  ) {}

  async generateResponse(
    query: string,
    context: SearchResult[],
    userId: string,
    sessionId?: string,
  ): Promise<AgentResponse> {
    const agents = [
      this.conceptAnalyzer,
      this.prerequisiteExplorer,
      this.instanceGenerator,
      this.visualizationAdvisor,
      this.difficultyExplainer,
      this.extensionRecommender,
    ];

    const results = await Promise.all(
      agents.map(agent => agent.analyze(query, context, userId))
    );

    // 聚合所有智能体的结果
    const aggregated = this.aggregateResults(results);

    // 使用 LLM 生成最终响应
    const response = await this.llmService.generateStream(
      this.buildPrompt(aggregated),
    );

    return {
      stream: response,
      fullContent: aggregated.fullContent,
      visualization: aggregated.visualization,
      references: aggregated.references,
      confidence: aggregated.confidence,
    };
  }

  private aggregateResults(agentResults: AgentResult[]): AggregatedResult {
    // 实现结果聚合逻辑
  }

  private buildPrompt(result: AggregatedResult): string {
    // 构建最终提示词
  }
}
```

---

### 4. 可视化模块 (Visualization Module)

**功能要求**：
- 组件元数据管理
- A2UI 图表生成
- 组件分类导航
- 参数配置管理
- 相关主题推荐

**技术实现**：
```typescript
// modules/visualization/services/a2ui-generator.service.ts
@Injectable()
export class A2UIGeneratorService {
  constructor(private llmService: LLMService) {}

  async generateChart(prompt: string, context?: any): Promise<A2UIComponent> {
    const systemPrompt = `You are an A2UI v0.8 chart generator. Generate chart configurations based on user requests.

Available chart types:
- bar: Bar chart
- line: Line chart
- pie: Pie chart
- scatter: Scatter plot
- histogram: Histogram
- boxplot: Box plot
- heatmap: Heatmap

Output format:
{
  "type": "chart_type",
  "title": "Chart title",
  "data": {...},
  "options": {...},
  "layout": {...}
}`;

    const response = await this.llmService.generate(systemPrompt, prompt);

    return this.parseA2UIResponse(response);
  }

  private parseA2UIResponse(response: string): A2UIComponent {
    try {
      return JSON.parse(response);
    } catch (error) {
      throw new BadRequestException('Invalid A2UI response format');
    }
  }
}

// modules/visualization/controllers/visualization.controller.ts
@Controller('visualization')
export class VisualizationController {
  constructor(
    private visualizationService: VisualizationService,
    private a2uiGeneratorService: A2UIGeneratorService,
  ) {}

  @Get('components')
  async getComponents() {
    return this.visualizationService.getAllComponents();
  }

  @Get('topics')
  async getTopics() {
    return this.visualizationService.getAllTopics();
  }

  @Get('components/:name')
  async getComponent(@Param('name') name: string) {
    return this.visualizationService.getComponentByName(name);
  }

  @Post('generate-chart')
  @UseGuards(JwtAuthGuard)
  async generateChart(@Body() dto: GenerateChartDto) {
    return this.a2uiGeneratorService.generateChart(dto.prompt, dto.context);
  }
}
```

---

### 5. 知识图谱模块 (Knowledge Graph Module)

**功能要求**：
- Neo4j 图谱查询
- 主题关系可视化
- 先决条件查询
- 相关概念探索
- 图谱数据导入导出

**技术实现**：
```typescript
// modules/knowledge-graph/services/neo4j.service.ts
import neo4j, { Driver, Session } from 'neo4j-driver';

@Injectable()
export class Neo4jService implements OnModuleInit, OnModuleDestroy {
  private driver: Driver;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const uri = this.configService.get('NEO4J_URI');
    const user = this.configService.get('NEO4J_USER');
    const password = this.configService.get('NEO4J_PASSWORD');

    this.driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
  }

  async onModuleDestroy() {
    await this.driver.close();
  }

  getSession(): Session {
    return this.driver.session();
  }

  async runQuery(query: string, parameters?: any) {
    const session = this.getSession();
    try {
      const result = await session.run(query, parameters);
      return result.records.map(record => record.toObject());
    } finally {
      await session.close();
    }
  }

  async getTopic(id: string): Promise<GraphTopic> {
    const query = `
      MATCH (t:Topic {id: $id})
      OPTIONAL MATCH (t)-[:HAS_PREREQUISITE]->(p:Topic)
      OPTIONAL MATCH (t)<-[:HAS_PREREQUISITE]-(n:Topic)
      RETURN t, collect(DISTINCT p) as prerequisites, collect(DISTINCT n) as nextTopics
    `;

    const result = await this.runQuery(query, { id });
    return result[0];
  }

  async getConnections(id: string): Promise<GraphConnection[]> {
    const query = `
      MATCH (t:Topic {id: $id})-[r]-(related:Topic)
      RETURN type(r) as type, related
    `;

    return await this.runQuery(query, { id });
  }

  async getPrerequisites(id: string): Promise<string[]> {
    const query = `
      MATCH (t:Topic {id: $id})-[:HAS_PREREQUISITE*]->(p:Topic)
      RETURN DISTINCT p.id as id
    `;

    const result = await this.runQuery(query, { id });
    return result.map(r => r.id);
  }
}

// modules/knowledge-graph/controllers/knowledge-graph.controller.ts
@Controller('knowledge-graph')
export class KnowledgeGraphController {
  constructor(
    private knowledgeGraphService: KnowledgeGraphService,
    private neo4jService: Neo4jService,
  ) {}

  @Get('topic/:id')
  async getTopic(@Param('id') id: string) {
    return this.neo4jService.getTopic(id);
  }

  @Get('connections/:id')
  async getConnections(@Param('id') id: string) {
    return this.neo4jService.getConnections(id);
  }

  @Get('prerequisites/:id')
  async getPrerequisites(@Param('id') id: string) {
    return this.neo4jService.getPrerequisites(id);
  }

  @Post('explore')
  async explore(@Body() dto: ExploreDto) {
    return this.knowledgeGraphService.exploreRelatedConcepts(
      dto.topicId,
      dto.depth || 2,
    );
  }
}
```

---

### 6. 测验模块 (Quiz Module)

**功能要求**：
- 题目生成（基于 LLM）
- 多种题型支持（选择、判断、填空）
- 答案评估
- 成绩统计
- 错题分析
- 难度自适应

**技术实现**：
```typescript
// modules/quiz/services/question-generator.service.ts
@Injectable()
export class QuestionGeneratorService {
  constructor(
    private llmService: LLMService,
    private ragService: RagService,
  ) {}

  async generateQuestions(topicId: string, count: number = 10): Promise<Question[]> {
    // 1. 获取主题知识
    const topic = await this.ragService.getTopicKnowledge(topicId);

    // 2. 使用 LLM 生成题目
    const prompt = `Generate ${count} questions about "${topic.name}".

Question types to include:
- Multiple choice (60%)
- True/False (30%)
- Fill in the blank (10%)

For each question, provide:
- id: unique identifier
- type: "multiple_choice" | "true_false" | "fill_blank"
- question: the question text
- options: array of options (for multiple choice)
- correctAnswer: the correct answer
- explanation: detailed explanation
- difficulty: "easy" | "medium" | "hard"

Output format: JSON array`;

    const response = await this.llmService.generate(prompt);
    return JSON.parse(response);
  }
}

// modules/quiz/services/answer-evaluator.service.ts
@Injectable()
export class AnswerEvaluatorService {
  evaluateAnswer(question: Question, userAnswer: string): AnswerResult {
    switch (question.type) {
      case 'multiple_choice':
        return this.evaluateMultipleChoice(question, userAnswer);
      case 'true_false':
        return this.evaluateTrueFalse(question, userAnswer);
      case 'fill_blank':
        return this.evaluateFillBlank(question, userAnswer);
      default:
        throw new BadRequestException('Invalid question type');
    }
  }

  private evaluateMultipleChoice(
    question: Question,
    userAnswer: string,
  ): AnswerResult {
    const isCorrect = userAnswer === question.correctAnswer;
    return {
      isCorrect,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
    };
  }

  private evaluateTrueFalse(
    question: Question,
    userAnswer: string,
  ): AnswerResult {
    const normalizedAnswer = userAnswer.toLowerCase();
    const correctAnswer = question.correctAnswer.toLowerCase();
    const isCorrect = normalizedAnswer === correctAnswer;

    return {
      isCorrect,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
    };
  }

  private evaluateFillBlank(
    question: Question,
    userAnswer: string,
  ): AnswerResult {
    const correctAnswers = Array.isArray(question.correctAnswer)
      ? question.correctAnswer
      : [question.correctAnswer];

    const isCorrect = correctAnswers.some(
      answer => this.normalizeAnswer(answer) === this.normalizeAnswer(userAnswer)
    );

    return {
      isCorrect,
      correctAnswer: correctAnswers.join(' or '),
      explanation: question.explanation,
    };
  }

  private normalizeAnswer(answer: string): string {
    return answer.trim().toLowerCase().replace(/\s+/g, ' ');
  }
}

// modules/quiz/controllers/quiz.controller.ts
@Controller('quiz')
export class QuizController {
  constructor(
    private quizService: QuizService,
    private questionGeneratorService: QuestionGeneratorService,
    private answerEvaluatorService: AnswerEvaluatorService,
  ) {}

  @Get('topics')
  async getTopics() {
    return this.quizService.getAllTopics();
  }

  @Post('generate/:topicId')
  @UseGuards(JwtAuthGuard)
  async generateQuiz(
    @Param('topicId') topicId: string,
    @Body() dto: GenerateQuizDto,
  ) {
    const questions = await this.questionGeneratorService.generateQuestions(
      topicId,
      dto.count || 10,
    );

    return this.quizService.createQuiz({
      topicId,
      questions,
      userId: dto.userId,
    });
  }

  @Post('submit')
  @UseGuards(JwtAuthGuard)
  async submitAnswer(@Body() dto: SubmitAnswerDto) {
    const quiz = await this.quizService.getQuiz(dto.quizId);
    const question = quiz.questions.find(q => q.id === dto.questionId);

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    const result = this.answerEvaluatorService.evaluateAnswer(
      question,
      dto.answer,
    );

    await this.quizService.saveAnswer({
      quizId: dto.quizId,
      questionId: dto.questionId,
      userId: dto.userId,
      answer: dto.answer,
      isCorrect: result.isCorrect,
    });

    return result;
  }

  @Get('results/:userId')
  @UseGuards(JwtAuthGuard)
  async getResults(@Param('userId') userId: string) {
    return this.quizService.getUserResults(userId);
  }
}
```

---

### 7. 学习路径模块 (Learning Path Module)

**功能要求**：
- 个性化学习路径推荐
- 学习进度追踪
- 成就系统
- 学习时间统计
- 下一步建议

**技术实现**：
```typescript
// modules/learning-path/services/recommendation.service.ts
@Injectable()
export class RecommendationService {
  constructor(
    private knowledgeGraphService: KnowledgeGraphService,
    private ragService: RagService,
  ) {}

  async generateLearningPath(userId: string): Promise<LearningPath> {
    // 1. 获取用户学习历史
    const userProgress = await this.getUserProgress(userId);

    // 2. 获取已完成的主题
    const completedTopics = userProgress.completedTopics;

    // 3. 查找可学习的新主题（已完成先决条件的）
    const availableTopics = await this.getAvailableTopics(completedTopics);

    // 4. 根据用户偏好推荐
    const recommendedTopics = this.rankByPreference(
      availableTopics,
      userProgress.preferences,
    );

    // 5. 构建学习路径
    return {
      userId,
      currentLevel: this.calculateLevel(userProgress),
      completedTopics,
      recommendedTopics,
      prerequisites: await this.getPrerequisitesMap(availableTopics),
      totalProgress: this.calculateProgress(userProgress),
      estimatedTimeRemaining: this.estimateTime(availableTopics),
    };
  }

  private async getAvailableTopics(completedTopics: string[]): Promise<Topic[]> {
    const allTopics = await this.ragService.getAllTopics();

    return allTopics.filter(topic => {
      const prerequisites = topic.prerequisites || [];
      return prerequisites.every(p => completedTopics.includes(p));
    });
  }

  private rankByPreference(
    topics: Topic[],
    preferences: UserPreferences,
  ): Topic[] {
    return topics.sort((a, b) => {
      const scoreA = this.calculateTopicScore(a, preferences);
      const scoreB = this.calculateTopicScore(b, preferences);
      return scoreB - scoreA;
    });
  }

  private calculateTopicScore(topic: Topic, preferences: UserPreferences): number {
    let score = 0;

    // 难度匹配
    if (topic.difficulty === preferences.preferredDifficulty) {
      score += 10;
    }

    // 类别偏好
    if (preferences.preferredCategories.includes(topic.category)) {
      score += 5;
    }

    // 热门度
    score += topic.popularity * 2;

    return score;
  }
}

// modules/learning-path/controllers/learning-path.controller.ts
@Controller('learning-path')
export class LearningPathController {
  constructor(
    private learningPathService: LearningPathService,
    private recommendationService: RecommendationService,
    private progressTrackerService: ProgressTrackerService,
  ) {}

  @Get(':userId')
  @UseGuards(JwtAuthGuard)
  async getLearningPath(@Param('userId') userId: string) {
    return this.recommendationService.generateLearningPath(userId);
  }

  @Post('update')
  @UseGuards(JwtAuthGuard)
  async updateProgress(@Body() dto: UpdateProgressDto) {
    return this.progressTrackerService.updateProgress(dto);
  }

  @Get('recommendations/:userId')
  @UseGuards(JwtAuthGuard)
  async getRecommendations(@Param('userId') userId: string) {
    return this.learningPathService.getRecommendations(userId);
  }
}
```

---

## 三、数据库设计

### Prisma Schema
```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String   @id @default(cuid())
  email        String   @unique
  username     String   @unique
  password     String
  role         Role     @default(USER)
  refreshToken String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  messages      Message[]
  quizzes       Quiz[]
  quizResults   QuizResult[]
  learningPaths LearningPath[]
  achievements  UserAchievement[]

  @@map("users")
}

enum Role {
  USER
  ADMIN
}

model Message {
  id        String   @id @default(cuid())
  userId    String
  role      MessageRole
  content   String
  sessionId String?
  metadata  Json?
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([sessionId])
  @@map("messages")
}

enum MessageRole {
  USER
  ASSISTANT
  SYSTEM
}

model Quiz {
  id          String     @id @default(cuid())
  topicId     String
  topicName   String
  userId      String
  questions   Json
  createdAt   DateTime   @default(now())

  user        User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  results     QuizResult[]

  @@index([userId])
  @@index([topicId])
  @@map("quizzes")
}

model QuizResult {
  id               String   @id @default(cuid())
  quizId           String
  userId           String
  score            Int
  totalQuestions   Int
  correctAnswers   Int
  timeSpent        Int
  answers          Json
  completedAt      DateTime @default(now())

  quiz             Quiz     @relation(fields: [quizId], references: [id], onDelete: Cascade)
  user             User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([quizId])
  @@map("quiz_results")
}

model LearningPath {
  id                String   @id @default(cuid())
  userId            String
  currentLevel      Int
  completedTopics   Json
  recommendedTopics Json
  totalProgress     Float
  estimatedTime     Int
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@map("learning_paths")
}

model Achievement {
  id          String           @id @default(cuid())
  name        String
  description String
  icon        String
  requirement String
  createdAt   DateTime         @default(now())

  users       UserAchievement[]

  @@map("achievements")
}

model UserAchievement {
  id            String      @id @default(cuid())
  userId        String
  achievementId String
  unlockedAt    DateTime?
  progress      Int         @default(0)

  user          User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  achievement   Achievement @relation(fields: [achievementId], references: [id], onDelete: Cascade)

  @@unique([userId, achievementId])
  @@index([userId])
  @@map("user_achievements")
}
```

---

## 四、API 设计规范

### RESTful API 规范
```typescript
// 统一响应格式
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

// 分页响应格式
interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 错误响应格式
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}
```

### HTTP 状态码使用规范
```typescript
// 成功响应
200 OK - 请求成功
201 Created - 资源创建成功
204 No Content - 请求成功，无返回内容

// 客户端错误
400 Bad Request - 请求参数错误
401 Unauthorized - 未授权
403 Forbidden - 禁止访问
404 Not Found - 资源不存在
409 Conflict - 资源冲突
422 Unprocessable Entity - 请求格式正确但语义错误
429 Too Many Requests - 请求过于频繁

// 服务器错误
500 Internal Server Error - 服务器内部错误
502 Bad Gateway - 网关错误
503 Service Unavailable - 服务不可用
```

### Swagger 文档注释
```typescript
// 使用 Swagger 装饰器
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  @Post('message')
  @ApiOperation({ summary: '发送聊天消息', description: '使用 SSE 流式返回 AI 响应' })
  @ApiBody({ type: SendMessageDto })
  @ApiResponse({ status: 200, description: '消息发送成功', type: Message })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 401, description: '未授权' })
  async sendMessage(@Body() dto: SendMessageDto) {
    // 实现
  }
}
```

---

## 五、安全和性能

### 安全措施
```typescript
// 1. 输入验证
import { IsString, IsEmail, MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password: string;
}

// 2. 密码加密
import * as bcrypt from 'bcryptjs';

const hashedPassword = await bcrypt.hash(password, 10);

// 3. SQL 注入防护（Prisma ORM 自动防护）
// 4. XSS 防护（输入转义）
// 5. CSRF 防护（使用 CSRF Token）
// 6. Rate Limiting（限流）
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller()
@UseGuards(ThrottlerGuard)
export class AppController {
  // ...
}

// 7. CORS 配置
app.enableCors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true,
});
```

### 性能优化
```typescript
// 1. 数据库查询优化
// 使用 select 只查询需要的字段
const users = await prisma.user.findMany({
  select: {
    id: true,
    email: true,
    username: true,
  },
});

// 使用索引（在 schema 中定义）
@@index([userId])

// 2. 缓存策略
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller()
@UseInterceptors(CacheInterceptor)
export class AppController {
  @Get('topics')
  @CacheKey('topics')
  @CacheTTL(3600) // 1 小时
  async getTopics() {
    // ...
  }
}

// 3. 异步处理
// 使用 Promise.all 并行处理
const results = await Promise.all([
  this.ragService.search(query),
  this.knowledgeGraphService.getPrerequisites(topicId),
]);

// 4. 分页查询
async getUsers(page: number, pageSize: number) {
  const [items, total] = await Promise.all([
    prisma.user.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.user.count(),
  ]);

  return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
}
```

---

## 六、日志和监控

### Winston 日志配置
```typescript
// common/logger/winston.logger.ts
import * as winston from 'winston';

export const winstonLogger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
    }),
  ],
});

// 在 main.ts 中使用
app.useLogger(winstonLogger);
```

### 日志记录示例
```typescript
this.logger.log(`User ${userId} sent a message: ${content}`);
this.logger.error('Failed to generate embedding', error.stack);
this.logger.warn('Fallback embedding mechanism activated');
this.logger.debug(`Retrieved ${results.length} chunks from RAG`);
```

---

## 七、测试策略

### 单元测试
```typescript
// 使用 Jest
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            saveRefreshToken: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('login', () => {
    it('should return access token and refresh token on successful login', async () => {
      const loginDto = { email: 'test@example.com', password: 'password123' };
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        username: 'testuser',
        role: 'USER',
      };

      usersService.findByEmail = jest.fn().mockResolvedValue(mockUser);
      jwtService.sign = jest.fn().mockReturnValue('mock-token');

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
      expect(result).toHaveProperty('user');
    });

    it('should throw UnauthorizedException on invalid credentials', async () => {
      const loginDto = { email: 'test@example.com', password: 'wrong-password' };

      usersService.findByEmail = jest.fn().mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });
});
```

### 集成测试
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('ChatController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/chat/message (POST)', () => {
    return request(app.getHttpServer())
      .post('/chat/message')
      .send({ content: 'Hello' })
      .expect(201);
  });

  afterAll(async () => {
    await app.close();
  });
});
```

---

## 八、部署配置

### Docker 配置
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:password@postgres:5432/ahatutor
      - NEO4J_URI=bolt://neo4j:7687
      - NEO4J_USER=neo4j
      - NEO4J_PASSWORD=password
    depends_on:
      - postgres
      - neo4j
    volumes:
      - ./faiss-index:/app/faiss-index
      - ./text-chunks:/app/text-chunks

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=ahatutor
    volumes:
      - postgres-data:/var/lib/postgresql/data

  neo4j:
    image: neo4j:5.0
    environment:
      - NEO4J_AUTH=neo4j/password
    volumes:
      - neo4j-data:/data

volumes:
  postgres-data:
  neo4j-data:
```

### 环境变量配置
```bash
# .env
NODE_ENV=production
PORT=3000

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ahatutor"

# Neo4j
NEO4J_URI="bolt://localhost:7687"
NEO4J_USER="neo4j"
NEO4J_PASSWORD="password"

# LLM
OPENAI_API_KEY="sk-..."
ANTHROPIC_API_KEY="sk-ant-..."
DEEPSEEK_API_KEY="sk-..."
GLM_API_KEY="..."

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="1h"

# RAG
EMBEDDING_MODEL_TYPE="local"
VECTOR_DIMENSIONS=2000
CHUNK_SIZE=1000
CHUNK_OVERLAP=200

# FAISS
FAISS_INDEX_PATH="./faiss-index"
TEXT_CHUNKS_PATH="./text-chunks.json"
```

---

## 九、最佳实践

### 1. 依赖注入
```typescript
// 使用构造函数注入
@Injectable()
export class ChatService {
  constructor(
    private messageService: MessageService,
    private ragService: RagService,
    private logger: Logger,
  ) {}
}
```

### 2. 错误处理
```typescript
// 使用自定义异常
export class EmbeddingGenerationException extends BadRequestException {
  constructor(message: string = 'Failed to generate embedding') {
    super(message);
  }
}

// 使用异常过滤器
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    response.status(status).json({
      success: false,
      error: {
        code: exception.name,
        message: exception.message,
      },
      timestamp: new Date().toISOString(),
    });
  }
}
```

### 3. DTO 验证
```typescript
// 使用 class-validator
export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  content: string;

  @IsOptional()
  @IsString()
  sessionId?: string;
}
```

### 4. 拦截器使用
```typescript
// 日志拦截器
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body } = request;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const delay = Date.now() - now;
        console.log(`${method} ${url} ${response.statusCode} - ${delay}ms`);
      }),
    );
  }
}
```

---

## 使用提示词的最佳实践

### 1. 渐进式开发
从基础功能开始，逐步添加复杂功能：
- Level 1: 基础 CRUD 操作
- Level 2: 认证授权
- Level 3: RAG 知识检索
- Level 4: AI 智能体协作
- Level 5: 高级功能（知识图谱、学习路径）

### 2. 模块化开发
每次只专注于一个模块的开发：
1. 先完成通用模块（filters、guards、interceptors）
2. 再实现核心业务模块
3. 最后集成和优化

### 3. 测试驱动
- 先编写测试用例
- 再实现功能代码
- 确保测试覆盖率

### 4. 文档完善
- API 文档（Swagger）
- 代码注释
- 部署文档

---

**总结**：这个提示词提供了构建一个完整教育平台后端服务所需的所有关键信息，包括项目结构、7 大核心功能模块、数据库设计、API 规范、安全性能、测试部署等。按照这个提示词，你可以系统地开发出一个高性能、可扩展、安全可靠的后端服务！
