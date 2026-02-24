# 动态可视化生成系统设计方案

## 一、系统架构

### 1.1 整体流程

```
用户提问
    ↓
概念识别 & 知识点提取
    ↓
RAG检索（知识点内容）
    ↓
可视化模板RAG检索（可视化方案）
    ↓
综合Prompt构建
    ↓
AI生成（回答 + 动态可视化）
    ↓
输出（文本答案 + 可视化数据）
```

### 1.2 核心组件

1. **可视化模板数据库**：存储预定义的可视化模板
2. **可视化模板向量化**：对模板进行嵌入向量计算
3. **可视化模板检索服务**：基于向量相似度检索相关模板
4. **动态可视化生成Agent**：基于模板和知识点生成可视化

## 二、可视化模板数据结构

### 2.1 模板定义

```typescript
interface VisualizationTemplate {
  id: string;
  templateId: string;  // 模板唯一标识
  
  // 核心信息
  concept: string;        // 适用知识点
  conceptKeywords: string[];  // 知识点关键词（用于向量化）
  
  // 可视化类型
  vizType: VisualizationType;
  vizCategory: 'punnett' | 'chromosome' | 'molecular' | 'population' | 'chart';
  
  // 模板描述
  title: string;
  description: string;
  applicableScenarios: string[];  // 适用场景
  
  // 模板结构
  templateStructure: {
    type: 'dynamic' | 'hybrid';  // 动态生成或混合模式
    components: TemplateComponent[];
    parameters: TemplateParameter[];
  };
  
  // 数据生成规则
  dataGenerationRules: {
    extractionPattern: string;  // 从知识点中提取数据的正则模式
    computedFields: Array<{
      field: string;
      formula: string;
      variables: Record<string, string>;
    }>;
    fallbackDefaults: Record<string, any>;
  };
  
  // 样式和配置
  styling: {
    colorScheme: string[];
    layout: 'grid' | 'tree' | 'path' | 'network';
    interactionLevel: 'basic' | 'interactive' | 'animated';
  };
  
  // 教学辅助
  educationalAids: {
    keyPoints: string[];
    commonMistakes: string[];
    thinkingProcess: string[];
  };
  
  // 元数据
  metadata: {
    chapter: string;
    difficulty: 'basic' | 'intermediate' | 'advanced';
    prerequisites: string[];
    relatedConcepts: string[];
    tags: string[];
  };
}
```

### 2.2 模板组件

```typescript
interface TemplateComponent {
  id: string;
  type: 'element' | 'group' | 'connection' | 'annotation';
  componentType: 'chromosome' | 'gene' | 'cell' | 'arrow' | 'label' | 'chart';
  position: { x: number; y: number } | 'auto';
  properties: Record<string, any>;
  contentSource: 'static' | 'extracted' | 'computed';
  dataExtraction: {
    sourceField: string;
    transform?: string;
  };
}
```

### 2.3 模板参数

```typescript
interface TemplateParameter {
  name: string;
  type: 'string' | 'number' | 'array' | 'object';
  description: string;
  required: boolean;
  defaultValue?: any;
  extractionRules?: {
    pattern: string;
    examples: string[];
  };
}
```

## 三、可视化模板数据库设计

### 3.1 模板分类

#### 3.1.1 Punnett方格模板

```typescript
const PUNNETT_SQUARE_TEMPLATES = [
  {
    templateId: 'punnett-monohybrid-basic',
    concept: '孟德尔第一定律',
    conceptKeywords: ['孟德尔', '分离定律', '单基因杂交', '显隐性', '基因型', '表型'],
    vizType: 'punnett_square',
    vizCategory: 'punnett',
    
    title: '单基因杂交Punnett方格',
    description: '展示一对等位基因杂交后代的基因型和表型分布',
    applicableScenarios: [
      '单基因杂交预测',
      '显隐性遗传分析',
      '基因型表型比例计算'
    ],
    
    templateStructure: {
      type: 'dynamic',
      components: [
        {
          id: 'male-gametes',
          type: 'group',
          componentType: 'cell',
          position: 'auto',
          properties: { orientation: 'top' },
          contentSource: 'extracted',
          dataExtraction: {
            sourceField: 'maleGametes',
          }
        },
        {
          id: 'female-gametes',
          type: 'group',
          componentType: 'cell',
          position: 'auto',
          properties: { orientation: 'left' },
          contentSource: 'extracted',
          dataExtraction: {
            sourceField: 'femaleGametes',
          }
        },
        {
          id: 'offspring-grid',
          type: 'group',
          componentType: 'grid',
          position: 'auto',
          properties: { rows: 2, columns: 2 },
          contentSource: 'extracted',
          dataExtraction: {
            sourceField: 'offspring',
          }
        }
      ],
      parameters: [
        {
          name: 'maleGametes',
          type: 'array',
          description: '雄配子基因型',
          required: true,
          extractionRules: {
            pattern: '\\b[A-Z][a-z]?\\b',
            examples: ['A', 'a']
          }
        },
        {
          name: 'femaleGametes',
          type: 'array',
          description: '雌配子基因型',
          required: true,
          extractionRules: {
            pattern: '\\b[A-Z][a-z]?\\b',
            examples: ['A', 'a']
          }
        },
        {
          name: 'offspring',
          type: 'array',
          description: '后代表型分布',
          required: true,
        }
      ]
    },
    
    dataGenerationRules: {
      extractionPattern: '(?:配子|杂交|后代).*?([A-Z][a-z])',
      computedFields: [
        {
          field: 'phenotypeRatios',
          formula: 'count_by_phenotype(offspring)',
          variables: { 'offspring': 'offspring' }
        }
      ],
      fallbackDefaults: {
        maleGametes: ['A', 'a'],
        femaleGametes: ['A', 'a'],
        offspring: [
          { genotype: 'AA', phenotype: '显性', probability: 0.25 },
          { genotype: 'Aa', phenotype: '显性', probability: 0.5 },
          { genotype: 'aa', phenotype: '隐性', probability: 0.25 }
        ]
      }
    },
    
    styling: {
      colorScheme: ['#10B981', '#EF4444', '#3B82F6'],
      layout: 'grid',
      interactionLevel: 'basic'
    },
    
    educationalAids: {
      keyPoints: [
        '配子形成时等位基因分离',
        '受精时雌雄配子随机结合',
        'F2代出现3:1表型比例'
      ],
      commonMistakes: [
        '认为F1代全部是显性个体',
        '忽略基因型和表型的区别',
        '错误计算概率'
      ],
      thinkingProcess: [
        '第一步：确定亲本的基因型',
        '第二步：写出可能的配子类型',
        '第三步：绘制Punnett方格',
        '第四步：统计后代基因型和表型',
        '第五步：计算各表型的概率'
      ]
    },
    
    metadata: {
      chapter: '第二章 孟德尔定律',
      difficulty: 'basic',
      prerequisites: ['等位基因', '配子'],
      relatedConcepts: ['孟德尔第二定律', '显隐性关系'],
      tags: ['经典遗传', '杂交', '概率']
    }
  }
];
```

#### 3.1.2 染色体行为模板

```typescript
const CHROMOSOME_BEHAVIOR_TEMPLATES = [
  {
    templateId: 'meiosis-prophase-i',
    concept: '减数分裂前期I',
    conceptKeywords: ['减数分裂', '前期', '同源染色体', '联会', '四分体'],
    vizType: 'chromosome_behavior',
    vizCategory: 'chromosome',
    
    title: '减数分裂前期I染色体行为',
    description: '展示同源染色体配对和联会过程',
    applicableScenarios: [
      '减数分裂过程学习',
      '同源染色体行为分析',
      '联会和交叉过程'
    ],
    
    templateStructure: {
      type: 'dynamic',
      components: [
        {
          id: 'cell-nucleus',
          type: 'element',
          componentType: 'cell',
          position: { x: 50, y: 50 },
          properties: { radius: 40, phase: 'prophase-i' },
          contentSource: 'static'
        },
        {
          id: 'homologous-pairs',
          type: 'group',
          componentType: 'chromosome',
          position: 'auto',
          properties: { state: 'pairing' },
          contentSource: 'extracted',
          dataExtraction: {
            sourceField: 'chromosomePairs',
            transform: 'pair_homologous'
          }
        }
      ],
      parameters: [
        {
          name: 'chromosomePairs',
          type: 'array',
          description: '同源染色体对数',
          required: true,
          defaultValue: 23,
          extractionRules: {
            pattern: '\\d+对同源染色体',
            examples: ['23对', '4对']
          }
        },
        {
          name: 'crossoverFrequency',
          type: 'number',
          description: '交叉频率',
          required: false,
          defaultValue: 0.1
        }
      ]
    },
    
    dataGenerationRules: {
      extractionPattern: '同源染色体\\s*(\\d+)\\s*对',
      computedFields: [],
      fallbackDefaults: {
        chromosomePairs: Array.from({ length: 23 }, (_, i) => ({
          id: `pair-${i}`,
          homologous1: { id: `chr${i * 2}a`, genes: [] },
          homologous2: { id: `chr${i * 2}b`, genes: [] }
        })),
        crossoverFrequency: 0.1
      }
    },
    
    styling: {
      colorScheme: ['#8B5CF6', '#EC4899', '#3B82F6'],
      layout: 'network',
      interactionLevel: 'animated'
    },
    
    educationalAids: {
      keyPoints: [
        '同源染色体在前期I配对',
        '联会形成四分体',
        '非姐妹染色单体可能交叉',
        '同源染色体分离发生在中期I'
      ],
      commonMistakes: [
        '混淆姐妹染色单体和非姐妹染色单体',
        '认为交叉发生在任何阶段',
        '忽略染色体数目变化'
      ],
      thinkingProcess: [
        '识别减数分裂阶段',
        '观察同源染色体状态',
        '确定是否发生交叉',
        '分析染色体分离模式'
      ]
    },
    
    metadata: {
      chapter: '第四章 染色体',
      difficulty: 'intermediate',
      prerequisites: ['有丝分裂', '染色体结构'],
      relatedConcepts: ['减数分裂中期', '减数分裂后期'],
      tags: ['细胞分裂', '减数分裂', '染色体行为']
    }
  }
];
```

#### 3.1.3 概率分布模板

```typescript
const PROBABILITY_DISTRIBUTION_TEMPLATES = [
  {
    templateId: 'probability-binomial',
    concept: '二项分布',
    conceptKeywords: ['二项分布', '概率', '分布', '独立事件', '重复试验'],
    vizType: 'probability_distribution',
    vizCategory: 'chart',
    
    title: '二项分布概率图',
    description: '展示多次独立重复试验的概率分布',
    applicableScenarios: [
      '遗传概率计算',
      '独立事件分析',
      '多次重复试验'
    ],
    
    templateStructure: {
      type: 'dynamic',
      components: [
        {
          id: 'chart-axis',
          type: 'element',
          componentType: 'chart',
          position: 'auto',
          properties: { chartType: 'bar' },
          contentSource: 'extracted',
          dataExtraction: {
            sourceField: 'distributionData'
          }
        }
      ],
      parameters: [
        {
          name: 'n',
          type: 'number',
          description: '试验次数',
          required: true,
          extractionRules: {
            pattern: '\\d+\\s*(?:次|次试验)',
            examples: ['4次', '10次试验']
          }
        },
        {
          name: 'p',
          type: 'number',
          description: '成功概率',
          required: true,
          defaultValue: 0.5
        },
        {
          name: 'distributionData',
          type: 'array',
          description: '概率分布数据',
          required: true
        }
      ]
    },
    
    dataGenerationRules: {
      extractionPattern: '(\\d+)\\s*(?:次|次试验).*?概率.*?([0-9.]+)',
      computedFields: [
        {
          field: 'distributionData',
          formula: 'binomial_distribution(n, p)',
          variables: { 'n': 'n', 'p': 'p' }
        }
      ],
      fallbackDefaults: {
        n: 4,
        p: 0.25,
        distributionData: [
          { outcome: '4个显性', probability: 0.0039 },
          { outcome: '3个显性', probability: 0.0625 },
          { outcome: '2个显性', probability: 0.1875 },
          { outcome: '1个显性', probability: 0.3125 },
          { outcome: '0个显性', probability: 0.4336 }
        ]
      }
    },
    
    styling: {
      colorScheme: ['#F59E0B', '#10B981', '#3B82F6'],
      layout: 'grid',
      interactionLevel: 'interactive'
    },
    
    educationalAids: {
      keyPoints: [
        '二项分布适用于n次独立重复试验',
        '每次试验只有成功/失败两种结果',
        '成功概率p保持不变',
        '公式：(n choose k) * p^k * (1-p)^(n-k)'
      ],
      commonMistakes: [
        '忽略试验的独立性条件',
        '错误计算组合数',
        '混淆成功和失败的概率'
      ],
      thinkingProcess: [
        '确定试验次数n',
        '确定成功概率p',
        '应用二项分布公式',
        '计算各结果概率'
      ]
    },
    
    metadata: {
      chapter: '第二章 孟德尔定律',
      difficulty: 'intermediate',
      prerequisites: ['概率基础', '组合数学'],
      relatedConcepts: ['正态分布', '泊松分布'],
      tags: ['概率', '分布', '统计学']
    }
  }
];
```

## 四、可视化模板向量化

### 4.1 向量化策略

```typescript
async function vectorizeVisualizationTemplate(template: VisualizationTemplate): Promise<number[]> {
  const textToEmbed = [
    template.concept,
    ...template.conceptKeywords,
    template.title,
    template.description,
    ...template.applicableScenarios,
    ...template.educationalAids.keyPoints
  ].join(' ');
  
  return await llmService.embed(textToEmbed);
}
```

### 4.2 批量向量化

```typescript
async function batchVectorizeTemplates(templates: VisualizationTemplate[]): Promise<void> {
  const batchSize = 20;
  for (let i = 0; i < templates.length; i += batchSize) {
    const batch = templates.slice(i, i + batchSize);
    const embeddings = await Promise.all(
      batch.map(template => vectorizeVisualizationTemplate(template))
    );
    
    // 保存向量数据
    embeddings.forEach((embedding, index) => {
      batch[index].vector = embedding;
    });
    
    await delay(100); // 避免API限流
  }
}
```

## 五、可视化模板检索服务

### 5.1 检索服务接口

```typescript
interface VisualizationTemplateRAGService {
  // 基于概念检索模板
  retrieveByConcept(
    concept: string,
    topK?: number,
    threshold?: number
  ): Promise<VisualizationTemplateMatch[]>;
  
  // 基于问题检索模板
  retrieveByQuestion(
    question: string,
    topK?: number,
    threshold?: number
  ): Promise<VisualizationTemplateMatch[]>;
  
  // 混合检索（概念 + 问题）
  retrieveByCombined(
    concept: string,
    question: string,
    topK?: number,
    threshold?: number
  ): Promise<VisualizationTemplateMatch[]>;
  
  // 重新索引模板
  reindexTemplates(templates: VisualizationTemplate[]): Promise<void>;
}

interface VisualizationTemplateMatch {
  template: VisualizationTemplate;
  similarity: number;
  matchReason: string;
}
```

### 5.2 检索实现

```typescript
async function retrieveByConcept(
  concept: string,
  topK: number = 3,
  threshold: number = 0.7
): Promise<VisualizationTemplateMatch[]> {
  // 1. 生成查询向量
  const queryEmbedding = await llmService.embed(concept);
  
  // 2. 计算相似度
  const matches = allTemplates.map(template => ({
    template,
    similarity: cosineSimilarity(queryEmbedding, template.vector || []),
    matchReason: `概念"${concept}"与模板"${template.concept}"相似`
  }));
  
  // 3. 过滤和排序
  const filtered = matches
    .filter(m => m.similarity >= threshold)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);
  
  return filtered;
}

async function retrieveByCombined(
  concept: string,
  question: string,
  topK: number = 3,
  threshold: number = 0.7
): Promise<VisualizationTemplateMatch[]> {
  // 1. 生成组合查询向量
  const combinedText = `${concept} ${question}`;
  const queryEmbedding = await llmService.embed(combinedText);
  
  // 2. 混合相似度计算
  const matches = allTemplates.map(template => {
    const conceptSimilarity = cosineSimilarity(
      await llmService.embed(concept),
      template.vector || []
    );
    const questionSimilarity = cosineSimilarity(
      await llmService.embed(question),
      template.vector || []
    );
    
    return {
      template,
      similarity: (conceptSimilarity * 0.7 + questionSimilarity * 0.3),
      matchReason: `概念相似度: ${conceptSimilarity.toFixed(2)}, 问题相似度: ${questionSimilarity.toFixed(2)}`
    };
  });
  
  // 3. 排序和过滤
  return matches
    .filter(m => m.similarity >= threshold)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);
}
```

## 六、动态可视化生成Agent

### 6.1 Prompt设计

```typescript
const DYNAMIC_VIZ_GENERATION_PROMPT = `
你是一个遗传学可视化生成专家。请基于提供的知识点、问题信息和可视化模板，生成适合的可视化内容。

## 输入信息

### 1. 知识点内容
${knowledgeContent}

### 2. 用户问题
${userQuestion}

### 3. 推荐的可视化模板
${recommendedTemplates.map(t => `
**模板 ${t.templateId}: ${t.title}**
- 适用概念: ${t.concept}
- 相似度: ${t.similarity.toFixed(2)}
- 描述: ${t.description}
- 适用场景: ${t.applicableScenarios.join(', ')}
- 模板结构: ${JSON.stringify(t.templateStructure, null, 2)}
- 数据生成规则: ${JSON.stringify(t.dataGenerationRules, null, 2)}
- 教学要点: ${t.educationalAids.keyPoints.join(', ')}
`).join('\n')}

## 任务要求

### 第一步：评估可视化适用性
分析用户问题是否适合可视化处理，考虑：
1. 问题是否涉及具体遗传学概念或过程？
2. 是否可以通过图形、动画或图表帮助理解？
3. 可视化是否能提供比纯文本更好的解释？

如果适合，选择最佳模板；如果不适合，说明原因。

### 第二步：选择和调整模板
从推荐的模板中选择最合适的，并根据具体问题进行调整：
- 提取模板需要的参数值
- 从知识点内容中获取相关数据
- 应用数据生成规则
- 调整模板结构以适应具体问题

### 第三步：生成可视化数据
基于选择的模板和提取的数据，生成完整的可视化数据：
1. 实现所有必需的组件
2. 设置正确的参数值
3. 应用样式配置
4. 生成教育辅助信息

### 第四步：回答用户问题
基于知识点内容和可视化数据，生成对用户问题的准确回答：
1. 直接回答问题的核心
2. 引用知识点中的关键信息
3. 结合可视化进行解释
4. 提供相关的教学要点

## 输出格式

请严格按照以下JSON格式输出：

\`\`\`json
{
  "visualizationApplicable": boolean,
  "applicableReason": string,
  "selectedTemplate": {
    "templateId": string,
    "reason": string
  },
  "extractedData": {
    [parameterName]: any
  },
  "visualizationData": {
    "type": VisualizationType,
    "title": string,
    "description": string,
    "elements": [...],
    "parameters": {...},
    "styling": {...},
    "animationConfig": {...}
  },
  "textAnswer": {
    "mainAnswer": string,
    "keyPoints": string[],
    "examples": string[],
    "commonMistakes": string[]
  },
  "educationalAids": {
    "keyPoints": string[],
    "visualConnection": string,
    "commonMistakes": string[],
    "thinkingProcess": string[]
  },
  "citations": [
    {
      "chunkId": string,
      "content": string,
      "chapter": string,
      "section": string
    }
  ]
}
\`\`\`

## 重要要求

1. **严格基于输入内容**：不要使用知识点之外的信息
2. **模板适配**：确保生成的可视化数据符合所选模板的结构
3. **数据准确性**：从知识点中准确提取数据，正确应用生成规则
4. **教学价值**：生成的内容要有助于学生理解概念
5. **格式规范**：严格遵循JSON输出格式，确保可解析
`;
```

### 6.2 Agent实现

```typescript
class DynamicVizGeneratorAgent {
  constructor(
    private templateRAG: VisualizationTemplateRAGService,
    private llm: LLMService,
    private rag: RAGService
  ) {}
  
  async generateDynamicVisualization(
    question: string,
    concept: string,
    options: DynamicVizOptions
  ): Promise<DynamicVizResponse> {
    // 1. RAG检索知识点内容
    const ragResult = await this.rag.retrieve(question, {
      topK: 5,
      filters: { concept }
    });
    
    const knowledgeContent = ragResult.context;
    
    // 2. 检索可视化模板
    const templateMatches = await this.templateRAG.retrieveByCombined(
      concept,
      question,
      { topK: 3, threshold: 0.6 }
    );
    
    // 3. 构建Prompt
    const prompt = this.buildPrompt({
      question,
      concept,
      knowledgeContent,
      recommendedTemplates: templateMatches
    });
    
    // 4. 调用LLM生成
    const response = await this.llm.structuredChat<DynamicVizResponse>(
      [{ role: 'user', content: prompt }],
      DYNAMIC_VIZ_RESPONSE_SCHEMA,
      { temperature: 0.3 }
    );
    
    return response;
  }
  
  private buildPrompt(input: PromptInput): string {
    return DYNAMIC_VIZ_GENERATION_PROMPT
      .replace('${knowledgeContent}', input.knowledgeContent)
      .replace('${userQuestion}', input.question)
      .replace('${recommendedTemplates}', 
        JSON.stringify(input.recommendedTemplates, null, 2)
      );
  }
}
```

## 七、API端点设计

### 7.1 新增控制器方法

```typescript
@Post('dynamic-viz/generate')
async generateDynamicVisualization(
  @Body() input: DynamicVizInput
): Promise<DynamicVizResponse> {
  return await this.dynamicVizGenerator.generateDynamicVisualization(
    input.question,
    input.concept,
    {
      userLevel: input.userLevel,
      conversationHistory: input.conversationHistory,
      includeEducationalAids: true
    }
  );
}

@Post('dynamic-viz/templates/search')
async searchVisualizationTemplates(
  @Body() input: TemplateSearchInput
): Promise<VisualizationTemplateMatch[]> {
  if (input.concept) {
    return await this.templateRAG.retrieveByConcept(
      input.concept,
      input.topK,
      input.threshold
    );
  } else if (input.question) {
    return await this.templateRAG.retrieveByQuestion(
      input.question,
      input.topK,
      input.threshold
    );
  }
}
```

### 7.2 请求/响应类型

```typescript
interface DynamicVizInput {
  question: string;
  concept?: string;
  userLevel?: 'beginner' | 'intermediate' | 'advanced';
  conversationHistory?: ChatMessage[];
}

interface DynamicVizResponse {
  visualizationApplicable: boolean;
  applicableReason: string;
  selectedTemplate?: {
    templateId: string;
    reason: string;
  };
  extractedData?: Record<string, any>;
  visualizationData?: VisualizationData;
  textAnswer?: {
    mainAnswer: string;
    keyPoints: string[];
    examples: string[];
    commonMistakes: string[];
  };
  educationalAids?: {
    keyPoints: string[];
    visualConnection: string;
    commonMistakes: string[];
    thinkingProcess: string[];
  };
  citations?: Citation[];
}
```

## 八、前端集成

### 8.1 API客户端方法

```typescript
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
```

### 8.2 组件集成示例

```typescript
const DynamicVizGenerator = ({ question, concept }) => {
  const [response, setResponse] = useState<DynamicVizResponse | null>(null);
  const [loading, setLoading] = useState(false);
  
  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await agentApi.generateDynamicVisualization({
        question,
        concept: concept || 'auto-detect',
        userLevel: 'intermediate'
      });
      setResponse(result);
    } catch (error) {
      console.error('生成失败:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <Button onClick={handleGenerate} disabled={loading}>
        {loading ? '生成中...' : '生成可视化'}
      </Button>
      
      {response?.visualizationApplicable && (
        <div>
          <div className="answer-section">
            <Markdown>{response.textAnswer?.mainAnswer}</Markdown>
          </div>
          
          <div className="viz-section">
            <VisualizationRenderer 
              data={response.visualizationData}
              templateId={response.selectedTemplate?.templateId}
            />
          </div>
          
          <div className="educational-section">
            <EducationalAids aids={response.educationalAids} />
          </div>
        </div>
      )}
      
      {response?.visualizationApplicable === false && (
        <div className="text-answer-section">
          <Markdown>{response.applicableReason}</Markdown>
          <Markdown>{response.textAnswer?.mainAnswer}</Markdown>
        </div>
      )}
    </div>
  );
};
```

## 九、实施步骤

### 阶段一：基础建设（1-2周）
1. 设计和实现可视化模板数据结构
2. 创建核心模板库（10-20个常用模板）
3. 实现模板向量化服务
4. 构建模板存储和检索系统

### 阶段二：Agent开发（2-3周）
1. 设计动态可视化生成Prompt
2. 实现动态可视化生成Agent
3. 集成RAG检索和模板检索
4. 测试和优化Prompt效果

### 阶段三：API集成（1周）
1. 添加新的控制器端点
2. 实现前端API客户端
3. 更新类型定义

### 阶段四：前端实现（2-3周）
1. 开发可视化渲染器
2. 实现动态可视化生成界面
3. 集成教育辅助组件
4. 测试和优化用户体验

### 阶段五：测试和优化（1-2周）
1. 单元测试和集成测试
2. 性能优化
3. 用户体验测试
4. 文档编写

## 十、优势总结

1. **灵活性**：可以动态生成各种场景的可视化
2. **可扩展性**：通过添加新模板支持更多知识点
3. **准确性**：基于RAG的模板检索确保匹配度
4. **教学价值**：模板包含教育辅助信息，提升学习效果
5. **混合模式**：结合硬编码质量和AI生成的灵活性
