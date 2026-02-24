# 动态可视化生成系统 - 实施指南

## 📋 目录

1. [已完成的工作](#已完成的工作)
2. [后续实施步骤](#后续实施步骤)
3. [集成到现有系统](#集成到现有系统)
4. [测试验证](#测试验证)
5. [性能优化](#性能优化)

---

## 已完成的工作

### 1. 核心设计文档 ✅

**文件：** [dynamic-visualization-rag-design.md](dynamic-visualization-rag-design.md)

包含：
- 系统架构设计
- 可视化模板数据结构
- Prompt设计方案
- API端点设计
- 前端集成方案
- 实施步骤规划

### 2. 后端服务实现 ✅

**文件：** `src/backend/src/modules/agents/dynamic-viz-generator.service.ts`

核心功能：
```typescript
class DynamicVizGeneratorService {
  async generateDynamicVisualization(input: DynamicVizInput): Promise<DynamicVizResponse>
  
  private async extractConcept(question: string): Promise<string>
  private async retrieveVisualizationTemplates(concept: string, question: string)
  private cosineSimilarity(a: number[], b: number[]): number
  private buildGenerationPrompt(input): string
}
```

### 3. 可视化模板库 ✅

**文件：** `src/backend/src/modules/agents/data/visualization-templates.data.ts`

已包含3个核心模板：
- `punnett-monohybrid-basic` - 孟德尔第一定律Punnett方格
- `meiosis-prophase-i` - 减数分裂前期I染色体行为
- `probability-binomial` - 二项分布概率图

### 4. 类型定义 ✅

**文件：** `src/shared/types/dynamic-viz.types.ts`

共享类型定义：
```typescript
export interface VisualizationTemplate
export interface VisualizationTemplateMatch
export interface DynamicVizInput
export interface DynamicVizResponse
export interface Citation
```

### 5. 前端组件 ✅

**文件：** `src/frontend/src/components/DynamicVisualizationGenerator.tsx`

React组件，包含：
- 用户水平选择
- 动态可视化生成
- 结果展示（文本回答 + 可视化 + 教育辅助）
- 重新生成功能

---

## 后续实施步骤

### 步骤1：更新Agent模块和控制器

#### 1.1 更新 `agent.module.ts`

在 `src/backend/src/modules/agents/agent.module.ts` 中：

```typescript
import { DynamicVizGeneratorService } from './dynamic-viz-generator.service';
import { VISUALIZATION_TEMPLATES } from './data/visualization-templates.data';

@Module({})
export class AgentModule {
  static register(): DynamicModule {
    return {
      module: AgentModule,
      imports: [LLMModule.register()],
      controllers: [AgentController],
      providers: [
        // ... 现有服务
        DynamicVizGeneratorService,
        {
          provide: 'VISUALIZATION_TEMPLATES',
          useValue: VISUALIZATION_TEMPLATES
        }
      ],
      exports: [
        // ... 现有导出
        DynamicVizGeneratorService,
      ],
      global: true,
    };
  }
}
```

#### 1.2 更新 `agent.controller.ts`

在 `src/backend/src/modules/agents/agent.controller.ts` 中：

```typescript
import { DynamicVizGeneratorService } from './dynamic-viz-generator.service';
import type { DynamicVizInput, DynamicVizResponse } from '@shared/types/dynamic-viz.types';

class DynamicVizInputDto {
  @ApiProperty({ description: '用户问题' })
  @IsString()
  question!: string;

  @ApiProperty({ description: '概念（可选）', required: false })
  @IsOptional()
  @IsString()
  concept?: string;

  @ApiProperty({ description: '用户水平', enum: ['beginner', 'intermediate', 'advanced'], required: false })
  @IsOptional()
  @IsEnum(['beginner', 'intermediate', 'advanced'] as const)
  userLevel?: 'beginner' | 'intermediate' | 'advanced';

  @ApiProperty({ description: '对话历史', required: false })
  @IsOptional()
  @IsArray()
  conversationHistory?: Array<{ role: string; content: string }>;
}

@ApiTags('Agent')
@Controller('agent')
export class AgentController {
  private readonly logger = new Logger(AgentController.name);

  constructor(
    // ... 现有依赖
    @Optional() private readonly dynamicVizGenerator: DynamicVizGeneratorService,
    @Inject('VISUALIZATION_TEMPLATES') private readonly vizTemplates: any[],
  ) {}

  @Post('dynamic-viz/generate')
  @ApiOperation({ summary: '生成动态可视化' })
  async generateDynamicVisualization(@Body() dto: DynamicVizInputDto): Promise<DynamicVizResponse> {
    if (!this.dynamicVizGenerator) {
      return {
        visualizationApplicable: false,
        applicableReason: 'DynamicVizGenerator service is not available'
      };
    }

    this.dynamicVizGenerator.setTemplates(this.vizTemplates);
    
    return await this.dynamicVizGenerator.generateDynamicVisualization({
      question: dto.question,
      concept: dto.concept,
      userLevel: dto.userLevel || 'intermediate',
      conversationHistory: dto.conversationHistory
    });
  }

  @Post('dynamic-viz/templates/search')
  @ApiOperation({ summary: '搜索可视化模板' })
  async searchVisualizationTemplates(
    @Body() dto: { concept?: string; question?: string; topK?: number; threshold?: number }
  ): Promise<any[]> {
    if (!this.dynamicVizGenerator) {
      return [];
    }

    this.dynamicVizGenerator.setTemplates(this.vizTemplates);

    const topK = dto.topK || 3;
    const threshold = dto.threshold || 0.6;

    if (dto.concept) {
      return await this.dynamicVizGenerator.retrieveByConcept(dto.concept, topK, threshold);
    } else if (dto.question) {
      return await this.dynamicVizGenerator.retrieveByQuestion(dto.question, topK, threshold);
    }

    return [];
  }
}
```

### 步骤2：更新前端API客户端

在 `src/frontend/src/api/agent.ts` 中添加：

```typescript
import type { 
  DynamicVizInput, 
  DynamicVizResponse,
  VisualizationTemplateMatch 
} from '@shared/types/dynamic-viz.types';

class AgentApiClient {
  // ... 现有方法

  async generateDynamicVisualization(
    input: DynamicVizInput
  ): Promise<DynamicVizResponse> {
    return this.request<DynamicVizResponse>(
      '/agent/dynamic-viz/generate',
      {
        method: 'POST',
        body: JSON.stringify(input)
      }
    );
  }

  async searchVisualizationTemplates(
    input: { concept?: string; question?: string; topK?: number; threshold?: number }
  ): Promise<VisualizationTemplateMatch[]> {
    return this.request<VisualizationTemplateMatch[]>(
      '/agent/dynamic-viz/templates/search',
      {
        method: 'POST',
        body: JSON.stringify(input)
      }
    );
  }
}

export const agentApi = new AgentApiClient();
```

### 步骤3：集成到现有页面

#### 3.1 在问答页面集成

在 `src/frontend/src/pages/DepthModePage.tsx` 中：

```typescript
import { DynamicVisualizationGenerator } from '../components/DynamicVisualizationGenerator';

const DepthModePage = () => {
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentConcept, setCurrentConcept] = useState('');

  // ... 现有逻辑

  return (
    <div className="space-y-6">
      {/* ... 现有UI */}
      
      {currentQuestion && (
        <DynamicVisualizationGenerator
          question={currentQuestion}
          concept={currentConcept}
        />
      )}
    </div>
  );
};
```

#### 3.2 在可视化页面集成

在 `src/frontend/src/pages/VisualizePage.tsx` 中：

```typescript
import { DynamicVisualizationGenerator } from '../components/DynamicVisualizationGenerator';

const VisualizePage = () => {
  const [selectedConcept, setSelectedConcept] = useState('');
  const [userQuestion, setUserQuestion] = useState('');

  return (
    <div className="space-y-6">
      {/* ... 现有UI */}
      
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">💬 智能问答与可视化</h3>
        <div className="space-y-4">
          <textarea
            value={userQuestion}
            onChange={(e) => setUserQuestion(e.target.value)}
            placeholder="请输入您的问题..."
            className="w-full h-32 px-4 py-2 border border-gray-300 rounded-md"
          />
          
          {userQuestion && (
            <DynamicVisualizationGenerator
              question={userQuestion}
              concept={selectedConcept}
            />
          )}
        </div>
      </div>
    </div>
  );
};
```

### 步骤4：扩展可视化模板库

#### 4.1 添加更多模板

在 `visualization-templates.data.ts` 中继续添加：

```typescript
export const VISUALIZATION_TEMPLATES = [
  // ... 现有模板
  
  {
    templateId: 'dna-replication',
    concept: 'DNA复制',
    conceptKeywords: ['DNA复制', '半保留复制', '复制叉', 'DNA聚合酶', '冈崎片段'],
    vizType: 'dna_replication',
    vizCategory: 'molecular',
    title: 'DNA半保留复制过程',
    description: '展示DNA复制过程中的前导链和后随链合成',
    applicableScenarios: [
      'DNA复制过程学习',
      '前导链后随链区别',
      'DNA聚合酶作用机制'
    ],
    templateStructure: {
      type: 'dynamic',
      components: [
        {
          id: 'dna-double-helix',
          type: 'element',
          componentType: 'dna',
          position: 'auto',
          properties: { state: 'unwinding' },
          contentSource: 'static'
        },
        {
          id: 'replication-fork',
          type: 'element',
          componentType: 'fork',
          position: 'auto',
          properties: { direction: 'bidirectional' },
          contentSource: 'static'
        },
        {
          id: 'leading-strand',
          type: 'group',
          componentType: 'strand',
          position: 'auto',
          properties: { synthesis: 'continuous' },
          contentSource: 'extracted',
          dataExtraction: { sourceField: 'leadingStrandData' }
        },
        {
          id: 'lagging-strand',
          type: 'group',
          componentType: 'strand',
          position: 'auto',
          properties: { synthesis: 'discontinuous' },
          contentSource: 'extracted',
          dataExtraction: { sourceField: 'laggingStrandData' }
        }
      ],
      parameters: [
        {
          name: 'leadingStrandData',
          type: 'array',
          description: '前导链合成数据',
          required: true
        },
        {
          name: 'laggingStrandData',
          type: 'array',
          description: '后随链合成数据（冈崎片段）',
          required: true
        }
      ]
    },
    dataGenerationRules: {
      extractionPattern: '(?:前导链|后随链|冈崎片段)',
      fallbackDefaults: {
        leadingStrandData: [
          { nucleotide: 'A', complement: 'T', position: 1 },
          { nucleotide: 'G', complement: 'C', position: 2 },
          { nucleotide: 'C', complement: 'G', position: 3 }
        ],
        laggingStrandData: [
          { fragment: 1, nucleotides: ['T', 'T', 'C', 'G'] },
          { fragment: 2, nucleotides: ['G', 'G', 'C', 'T'] }
        ]
      }
    },
    styling: {
      colorScheme: ['#3B82F6', '#8B5CF6', '#10B981'],
      layout: 'linear',
      interactionLevel: 'animated'
    },
    educationalAids: {
      keyPoints: [
        'DNA复制是半保留复制',
        '前导链连续合成，后随链不连续合成',
        '后随链通过冈崎片段合成',
        '需要DNA聚合酶等多种酶参与'
      ],
      commonMistakes: [
        '认为两条链都是连续合成',
        '混淆前导链和后随链的方向',
        '忽略冈崎片段的存在'
      ],
      thinkingProcess: [
        '识别DNA双螺旋结构',
        '确定复制起始点',
        '观察前导链和后随链的合成方式',
        '理解冈崎片段的形成过程'
      ]
    },
    metadata: {
      chapter: '第三章 分子遗传学',
      difficulty: 'intermediate',
      prerequisites: ['DNA结构', '碱基配对'],
      relatedConcepts: ['DNA修复', '转录', '翻译'],
      tags: ['DNA', '复制', '分子遗传']
    }
  },
  
  // 继续添加更多模板...
];
```

### 步骤5：向量化可视化模板

创建脚本 `scripts/vectorize-viz-templates.ts`：

```typescript
import { VISUALIZATION_TEMPLATES } from '../src/backend/src/modules/agents/data/visualization-templates.data';
import { LLMService } from '../src/backend/src/modules/llm/llm.service';
import * as fs from 'fs';

async function vectorizeTemplates() {
  const llmService = new LLMService();
  
  console.log('开始向量化可视化模板...');
  
  for (const template of VISUALIZATION_TEMPLATES) {
    const textToEmbed = [
      template.concept,
      ...template.conceptKeywords,
      template.title,
      template.description,
      ...template.applicableScenarios,
      ...template.educationalAids.keyPoints
    ].join(' ');
    
    try {
      const vector = await llmService.embed(textToEmbed);
      template.vector = vector;
      console.log(`✓ 已向量化模板: ${template.templateId}`);
    } catch (error) {
      console.error(`✗ 向量化失败: ${template.templateId}`, error);
    }
    
    // 避免API限流
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // 保存带向量的模板
  const outputPath = '../data/external/genetics-rag/visualization-templates-with-vectors.json';
  fs.writeFileSync(outputPath, JSON.stringify(VISUALIZATION_TEMPLATES, null, 2));
  console.log(`\n已保存带向量的模板到: ${outputPath}`);
}

vectorizeTemplates().catch(console.error);
```

运行脚本：
```bash
npm run build
node dist/scripts/vectorize-viz-templates.ts
```

---

## 集成到现有系统

### 与现有RAG系统集成

`DynamicVizGeneratorService` 已经集成了现有的 `RAGService`：

```typescript
const ragResult = await this.ragService.retrieve(question, {
  topK: 5,
  threshold: 0.6
});
const knowledgeContent = ragResult.context;
```

### 与现有可视化系统共存

现有系统使用硬编码可视化数据，新系统提供动态生成能力：

```typescript
// 优先使用硬编码（如果存在）
const hardcodedViz = getHardcodedVisualization(concept);
if (hardcodedViz) {
  return hardcodedViz;
}

// 否则使用动态生成
const dynamicViz = await this.dynamicVizGenerator.generateDynamicVisualization(...);
```

### 混合模式

可以在 `VisualDesignerService` 中集成：

```typescript
async designVisualization(
  concept: string,
  options: DesignVizOptions
): Promise<VisualizationSuggestion> {
  // 1. 优先尝试硬编码
  const hardcodedViz = getHardcodedVisualization(concept);
  if (hardcodedViz) {
    return hardcodedViz;
  }
  
  // 2. 使用动态生成
  const dynamicViz = await this.dynamicVizGenerator.generateDynamicVisualization({
    question: `解释${concept}`,
    concept,
    userLevel: options.userLevel || 'intermediate'
  });
  
  if (dynamicViz.visualizationApplicable) {
    return {
      type: dynamicViz.visualizationData.type,
      title: dynamicViz.visualizationData.title,
      description: dynamicViz.visualizationData.description,
      data: dynamicViz.visualizationData,
      insights: dynamicViz.educationalAids
    };
  }
  
  // 3. 都不行，返回默认建议
  return this.getDefaultVisualization(concept);
}
```

---

## 测试验证

### 单元测试

创建 `src/backend/src/modules/agents/dynamic-viz-generator.service.spec.ts`：

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { DynamicVizGeneratorService } from './dynamic-viz-generator.service';
import { LLMService } from '../llm/llm.service';
import { RAGService } from '../rag/services/rag.service';

describe('DynamicVizGeneratorService', () => {
  let service: DynamicVizGeneratorService;
  let llmService: jest.Mocked<LLMService>;
  let ragService: jest.Mocked<RAGService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DynamicVizGeneratorService,
        {
          provide: LLMService,
          useValue: {
            embed: jest.fn(),
            chat: jest.fn(),
            structuredChat: jest.fn(),
          }
        },
        {
          provide: RAGService,
          useValue: {
            retrieve: jest.fn(),
          }
        }
      ],
    }).compile();

    service = module.get<DynamicVizGeneratorService>(DynamicVizGeneratorService);
    llmService = module.get(LLMService);
    ragService = module.get(RAGService);
  });

  describe('generateDynamicVisualization', () => {
    it('should generate visualization for appropriate questions', async () => {
      // Mock implementations
      llmService.embed.mockResolvedValue([0.1, 0.2, 0.3]);
      ragService.retrieve.mockResolvedValue({
        results: [],
        context: '孟德尔第一定律的相关知识...'
      });
      llmService.structuredChat.mockResolvedValue({
        visualizationApplicable: true,
        applicableReason: '问题涉及孟德尔第一定律，适合用Punnett方格可视化',
        selectedTemplate: {
          templateId: 'punnett-monohybrid-basic',
          reason: '最适合的模板'
        },
        // ... 其他响应数据
      });

      const result = await service.generateDynamicVisualization({
        question: '孟德尔第一定律的内容是什么？',
        concept: '孟德尔第一定律',
        userLevel: 'intermediate'
      });

      expect(result.visualizationApplicable).toBe(true);
      expect(result.selectedTemplate?.templateId).toBe('punnett-monohybrid-basic');
    });

    it('should return text-only answer for non-visualizable questions', async () => {
      // Mock implementations
      llmService.embed.mockResolvedValue([0.1, 0.2, 0.3]);
      ragService.retrieve.mockResolvedValue({
        results: [],
        context: '相关知识点...'
      });
      llmService.structuredChat.mockResolvedValue({
        visualizationApplicable: false,
        applicableReason: '这个问题不适合可视化处理',
        textAnswer: {
          mainAnswer: '纯文本回答...'
        }
      });

      const result = await service.generateDynamicVisualization({
        question: '遗传学的历史是什么？',
        concept: '遗传学历史',
        userLevel: 'intermediate'
      });

      expect(result.visualizationApplicable).toBe(false);
      expect(result.textAnswer?.mainAnswer).toBeDefined();
    });
  });

  describe('cosineSimilarity', () => {
    it('should calculate correct similarity', () => {
      const a = [1, 2, 3];
      const b = [1, 2, 3];
      expect(service['cosineSimilarity'](a, b)).toBe(1);
    });

    it('should return 0 for orthogonal vectors', () => {
      const a = [1, 0, 0];
      const b = [0, 1, 0];
      expect(service['cosineSimilarity'](a, b)).toBe(0);
    });
  });
});
```

### 集成测试

创建测试脚本 `scripts/test-dynamic-viz.ts`：

```typescript
import { agentApi } from '../src/frontend/src/api/agent';

async function testDynamicVisualization() {
  console.log('=== 动态可视化生成测试 ===\n');

  const testCases = [
    {
      name: '孟德尔第一定律',
      question: '孟德尔第一定律的内容是什么？',
      concept: '孟德尔第一定律',
      expectedViz: true
    },
    {
      name: '减数分裂',
      question: '减数分裂前期I发生了什么？',
      concept: '减数分裂前期I',
      expectedViz: true
    },
    {
      name: '遗传学历史',
      question: '遗传学的历史发展是什么？',
      concept: '遗传学历史',
      expectedViz: false
    }
  ];

  for (const testCase of testCases) {
    console.log(`测试: ${testCase.name}`);
    console.log(`问题: ${testCase.question}`);
    
    try {
      const result = await agentApi.generateDynamicVisualization({
        question: testCase.question,
        concept: testCase.concept,
        userLevel: 'intermediate'
      });

      console.log(`可视化适用: ${result.visualizationApplicable}`);
      console.log(`原因: ${result.applicableReason}`);
      
      if (result.selectedTemplate) {
        console.log(`选择模板: ${result.selectedTemplate.templateId}`);
        console.log(`选择原因: ${result.selectedTemplate.reason}`);
      }
      
      if (result.textAnswer) {
        console.log(`回答预览: ${result.textAnswer.mainAnswer.substring(0, 100)}...`);
      }
      
      const passed = result.visualizationApplicable === testCase.expectedViz;
      console.log(`✓ 测试通过\n`);
    } catch (error) {
      console.error(`✗ 测试失败:`, error.message);
    }
  }

  console.log('=== 测试完成 ===');
}

testDynamicVisualization().catch(console.error);
```

---

## 性能优化

### 1. 模板向量缓存

```typescript
class DynamicVizGeneratorService {
  private templateVectorsCache: Map<string, number[]> = new Map();
  
  private async getTemplateVector(template: VisualizationTemplate): Promise<number[]> {
    if (this.templateVectorsCache.has(template.templateId)) {
      return this.templateVectorsCache.get(template.templateId)!;
    }
    
    const vector = await this.llmService.embed(
      `${template.concept} ${template.conceptKeywords.join(' ')}`
    );
    
    this.templateVectorsCache.set(template.templateId, vector);
    return vector;
  }
}
```

### 2. 批量向量化

```typescript
async function batchVectorizeTemplates(templates: VisualizationTemplate[]): Promise<void> {
  const batchSize = 10;
  for (let i = 0; i < templates.length; i += batchSize) {
    const batch = templates.slice(i, i + batchSize);
    await Promise.all(
      batch.map(template => this.getTemplateVector(template))
    );
  }
}
```

### 3. 响应缓存

```typescript
class DynamicVizGeneratorService {
  private responseCache: Map<string, DynamicVizResponse> = new Map();
  
  async generateDynamicVisualization(input: DynamicVizInput): Promise<DynamicVizResponse> {
    const cacheKey = this.getCacheKey(input);
    
    if (this.responseCache.has(cacheKey)) {
      return this.responseCache.get(cacheKey)!;
    }
    
    const result = await this.generateInternal(input);
    this.responseCache.set(cacheKey, result);
    
    return result;
  }
  
  private getCacheKey(input: DynamicVizInput): string {
    return `${input.question}-${input.concept}-${input.userLevel}`;
  }
}
```

---

## 总结

### 已完成 ✅

1. 系统设计文档
2. 后端服务实现
3. 可视化模板库（3个核心模板）
4. 共享类型定义
5. 前端React组件
6. 实施指南

### 待完成 📋

1. 更新Agent模块和控制器
2. 更新前端API客户端
3. 集成到现有页面
4. 扩展可视化模板库
5. 向量化可视化模板
6. 单元测试和集成测试
7. 性能优化

### 预期效果 🎯

- 用户提出问题后，系统自动判断是否适合可视化
- 基于RAG检索知识点内容和可视化模板
- AI动态生成符合模板结构的可视化数据
- 提供文本回答、可视化展示和教育辅助
- 支持重新生成和不同用户水平

### 核心优势 💪

1. **灵活性** - 不受硬编码限制，可动态生成各种场景的可视化
2. **准确性** - 基于向量相似度精确匹配最合适的模板
3. **可扩展性** - 通过添加新模板轻松支持更多知识点
4. **教学价值** - 模板包含教育辅助信息，提升学习效果
5. **混合模式** - 结合硬编码质量和AI生成的灵活性
