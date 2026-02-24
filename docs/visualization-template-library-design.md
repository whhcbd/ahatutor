# 生物遗传学可视化模板库设计方案

## 概述

为解决动态可视化依赖LLM生成复杂JSON结构的不稳定性问题，预设计并开发生物遗传学领域常用的标准化可视化模板库。

## 设计原则

1. **模块化设计**：每个模板独立，可组合使用
2. **参数化配置**：通过参数调整模板内容，无需重新设计
3. **标准化接口**：统一的数据格式和API接口
4. **可扩展性**：易于添加新的模板类型
5. **智能匹配**：根据问题自动选择合适的模板

## 模板分类体系

### 第一类：遗传系谱图

#### 1.1 基础系谱图模板
```typescript
interface PedigreeTemplate {
  type: 'pedigree';
  pattern: 'autosomal_dominant' | 'autosomal_recessive' | 'x_linked_dominant' | 'x_linked_recessive' | 'y_linked';
  generations: number; // 世代数（2-4）
  individualsPerGeneration: number[]; // 每代个体数
  affectedPattern: string[]; // 受影响个体模式
  carrierPattern?: string[]; // 携带者模式
  title: string;
  description: string;
  annotations: string[];
}
```

#### 1.2 复杂系谱图模板
- 双基因遗传系谱
- 外显率不完全系谱
- 遗传异质性系谱

### 第二类：染色体可视化

#### 2.1 染色体结构图
```typescript
interface ChromosomeTemplate {
  type: 'chromosome_structure';
  organism: 'human' | 'drosophila' | 'arabidopsis' | 'maize' | 'custom';
  chromosomeNumber: number;
  centromereType: 'metacentric' | 'submetacentric' | 'acrocentric' | 'telocentric';
  showBands: boolean;
  showGenes: boolean;
  genes?: GeneAnnotation[];
  title: string;
  description: string;
}
```

#### 2.2 减数分裂过程图
```typescript
interface MeiosisTemplate {
  type: 'meiosis_process';
  organism: string;
  stages: ('interphase' | 'prophase_I' | 'metaphase_I' | 'anaphase_I' | 'telophase_I' | 
           'prophase_II' | 'metaphase_II' | 'anaphase_II' | 'telophase_II')[];
  showCrossover: boolean;
  showGametes: boolean;
  title: string;
  description: string;
}
```

#### 2.3 染色体畸变图
- 结构变异（缺失、重复、倒位、易位）
- 数目变异（整倍体、非整倍体）

### 第三类：分子遗传学图表

#### 3.1 基因结构图
```typescript
interface GeneStructureTemplate {
  type: 'gene_structure';
  geneName: string;
  organism: string;
  exons: { start: number; end: number; sequence?: string }[];
  introns: { start: number; end: number; size: number }[];
  promoter: { start: number; end: number; elements: string[] };
  enhancers?: { position: string; sequence: string }[];
  utr: { five_prime: number; three_prime: number };
  showScale: boolean;
  title: string;
  description: string;
}
```

#### 3.2 DNA复制过程图
```typescript
interface DNAReplicationTemplate {
  type: 'dna_replication';
  stage: 'initiation' | 'elongation' | 'termination' | 'complete';
  showLeadingStrand: boolean;
  showLaggingStrand: boolean;
  showOkazakiFragments: boolean;
  showEnzymes: ('helicase' | 'primase' | 'polymerase' | 'ligase' | 'ssb')[];
  annotations: {
    forkStructure?: string;
    leadingStrandSynthesis?: string;
    laggingStrandSynthesis?: string;
    okazakiFragments?: string;
  };
  title: string;
  description: string;
}
```

#### 3.3 突变类型示意图
- 点突变（转换、颠换）
- 插入/缺失
- 移码突变
- 三核苷酸重复扩增

### 第四类：遗传分析工具

#### 4.1 Punnett方格表
```typescript
interface PunnettSquareTemplate {
  type: 'punnett_square';
  crossType: 'monohybrid' | 'dihybrid' | 'testcross' | 'backcross';
  parent1Genotype: string;
  parent2Genotype: string;
  traits: {
    name: string;
    alleles: { dominant: string; recessive: string };
    dominance: 'complete' | 'incomplete' | 'codominance';
  }[];
  showRatios: boolean;
  showPhenotypes: boolean;
  title: string;
  description: string;
}
```

#### 4.2 连锁图
```typescript
interface LinkageMapTemplate {
  type: 'linkage_map';
  chromosome: number;
  genes: {
    name: string;
    position: number; // cM
    alleles: string[];
  }[];
  recombinationRates: {
    gene1: string;
    gene2: string;
    rate: number; // %
  }[];
  showScale: boolean;
  title: string;
  description: string;
}
```

#### 4.3 遗传图谱
- 分子遗传标记图
- 物理图谱
- 基因定位图

### 第五类：基因表达调控图

#### 5.1 操纵子模型图
```typescript
interface OperonTemplate {
  type: 'operon';
  organism: 'e_coli' | 'custom';
  operonType: 'lac' | 'trp' | 'ara' | 'custom';
  genes: {
    name: string;
    function: string;
    length: number;
  }[];
  regulatoryElements: {
    promoter: string;
    operator: string;
    repressor?: string;
    activator?: string;
    inducer?: string;
  };
  state: 'repressed' | 'induced' | 'basal';
  showInteractions: boolean;
  title: string;
  description: string;
}
```

#### 5.2 启动子结构图
- TATA框
- CAAT框
- GC框
- 增强子/沉默子

#### 5.3 表观遗传调控图
- DNA甲基化模式
- 组蛋白修饰
- 染色质状态

## 智能匹配系统

### 问题分析流程

1. **概念识别**：识别问题中的核心遗传学概念
2. **工具匹配**：根据概念选择合适的可视化工具
3. **参数提取**：从问题中提取模板需要的参数
4. **模板调用**：使用参数化模板生成可视化
5. **结果展示**：返回结构化的可视化数据

### 匹配规则示例

```typescript
interface TemplateMatchingRules {
  keywords: string[];
  templateType: string;
  requiredParameters: string[];
  optionalParameters: string[];
  examples: string[];
}

const MATCHING_RULES: TemplateMatchingRules[] = [
  {
    keywords: ['系谱', '家系', '遗传病', '显性', '隐性', '携带者'],
    templateType: 'pedigree',
    requiredParameters: ['pattern', 'generations'],
    optionalParameters: ['affectedPattern', 'carrierPattern'],
    examples: ['血友病系谱', '亨廷顿舞蹈病家系', '囊性纤维化遗传']
  },
  {
    keywords: ['Punnett', '杂交', '配子', '基因型', '表型', '分离比'],
    templateType: 'punnett_square',
    requiredParameters: ['crossType', 'parent1Genotype', 'parent2Genotype'],
    optionalParameters: ['showRatios', 'showPhenotypes'],
    examples: ['孟德尔杂交实验', '单基因杂交', '双基因杂交']
  },
  {
    keywords: ['冈崎片段', 'DNA复制', '后随链', '前导链', '复制叉'],
    templateType: 'dna_replication',
    requiredParameters: ['stage'],
    optionalParameters: ['showOkazakiFragments', 'showEnzymes'],
    examples: ['冈崎片段合成', 'DNA半保留复制', '复制叉结构']
  }
];
```

## 模板实现架构

### 目录结构
```
src/backend/src/modules/agents/visualization-templates/
├── core/
│   ├── template-base.interface.ts
│   ├── template-renderer.service.ts
│   └── template-matcher.service.ts
├── genetic-pedigree/
│   ├── pedigree-template.interface.ts
│   ├── pedigree-renderer.ts
│   └── pedigree-data.ts
├── chromosome/
│   ├── chromosome-template.interface.ts
│   ├── chromosome-renderer.ts
│   └── chromosome-data.ts
├── molecular-genetics/
│   ├── dna-replication-template.interface.ts
│   ├── dna-replication-renderer.ts
│   └── dna-replication-data.ts
├── genetic-analysis/
│   ├── punnett-square-template.interface.ts
│   ├── punnett-square-renderer.ts
│   └── punnett-square-data.ts
├── gene-expression/
│   ├── operon-template.interface.ts
│   ├── operon-renderer.ts
│   └── operon-data.ts
└── index.ts
```

### 核心服务设计

#### TemplateRendererService
```typescript
@Injectable()
export class TemplateRendererService {
  async render(template: VisualizationTemplate): Promise<VisualizationData> {
    const renderer = this.getRenderer(template.type);
    return await renderer.render(template);
  }

  private getRenderer(type: string): TemplateRenderer {
    // 根据类型获取对应的渲染器
  }
}
```

#### TemplateMatcherService
```typescript
@Injectable()
export class TemplateMatcherService {
  async matchTemplate(question: string, concept: string): Promise<MatchedTemplate | null> {
    const analysis = await this.analyzeQuestion(question, concept);
    const templateType = this.selectTemplateType(analysis);
    
    if (!templateType) return null;
    
    const parameters = this.extractParameters(question, analysis, templateType);
    
    return {
      templateType,
      templateId: this.selectBestTemplate(templateType, analysis),
      parameters,
      confidence: analysis.confidence
    };
  }

  private analyzeQuestion(question: string, concept: string): QuestionAnalysis {
    // 使用NLP或规则匹配分析问题
  }
}
```

## 数据存储方案

### 模板数据存储
- JSON格式存储预定义模板
- 支持动态加载和热更新
- 版本控制和变更追踪

### 参数数据库
- 存储常见问题的参数映射
- 支持模糊匹配和相似度计算
- 用户反馈驱动的优化

## API设计

### 模板查询API
```typescript
POST /api/agent/visualize/template/match
Request: {
  question: string;
  concept?: string;
  context?: string;
}
Response: {
  matched: boolean;
  template?: {
    type: string;
    id: string;
    name: string;
    description: string;
    requiredParameters: string[];
    optionalParameters: string[];
    examples: string[];
  };
  confidence: number;
}
```

### 模板渲染API
```typescript
POST /api/agent/visualize/template/render
Request: {
  templateType: string;
  templateId: string;
  parameters: Record<string, any>;
  options?: {
    showAnnotations: boolean;
    showLegend: boolean;
    animationEnabled: boolean;
  };
}
Response: {
  visualization: VisualizationData;
  metadata: {
    templateUsed: string;
    renderTime: number;
    cacheHit: boolean;
  };
}
```

## 实施计划

### 第一阶段：核心模板（优先级高）
1. Punnett方格表
2. 遗传系谱图
3. DNA复制过程图
4. 基因结构图

### 第二阶段：扩展模板
1. 连锁图/遗传图谱
2. 染色体可视化
3. 减数分裂过程图
4. 操纵子模型图

### 第三阶段：高级功能
1. 动画效果
2. 交互功能
3. 自定义参数
4. 模板组合

## 优势分析

### 对比LLM动态生成
| 特性 | LLM动态生成 | 模板库方案 |
|------|-------------|-----------|
| 响应速度 | 慢（需要生成复杂JSON） | 快（直接调用模板） |
| 准确性 | 不稳定 | 高（预验证） |
| 可维护性 | 困难 | 容易 |
| 可扩展性 | 受限 | 强 |
| 专业性 | 一般 | 高 |
| 成本 | 高（API调用） | 低 |

### 对比硬编码可视化
| 特性 | 硬编码 | 模板库方案 |
|------|--------|-----------|
| 灵活性 | 低 | 高（参数化） |
| 覆盖范围 | 有限 | 广（模板组合） |
| 定制能力 | 无 | 强 |
| 维护成本 | 中 | 低 |

## 结论

通过预设计标准化可视化模板库，可以：

1. **提高可靠性**：避免LLM生成不稳定的问题
2. **提升专业性**：使用专业设计的可视化模板
3. **降低成本**：减少对LLM API的依赖
4. **增强可维护性**：模块化设计便于维护和扩展
5. **改善用户体验**：快速响应，准确展示

这个方案结合了硬编码的可靠性和动态生成的灵活性，是解决当前动态可视化问题的最佳方案。
