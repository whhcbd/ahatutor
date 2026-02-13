# 可视化问题汇总

## 问题描述
当前系统中存在大量可视化内容，其 `type: 'diagram'`，但前端只显示简单的"结构图示"占位符（一个方框和一个圆），没有起到实际的可视化效果。

## 需要解决的可视化列表

### 1. molecular-genetics.ts

| 名称 | 标题 | 当前状态 | 建议操作 |
|------|------|----------|----------|
| 减数分裂 | 减数分裂过程可视化 | 显示简单占位符 | 已有 MeiosisAnimation 组件 |
| DNA复制 | DNA半保留复制可视化 | 显示简单占位符 | 需要创建可视化组件 |
| 转录与翻译 | 中心法则：转录与翻译可视化 | 已有 CentralDogmaVisualization 组件 | 已解决 |
| 基因突变 | 基因突变类型与频率可视化 | 已有 ProbabilityDistribution 组件 | 已解决 |
| 转录 | 转录过程可视化 | 显示简单占位符 | 需要创建可视化组件 |
| 翻译 | 翻译过程可视化 | 显示简单占位符 | 需要创建可视化组件 |
| 核糖体 | 核糖体结构与功能可视化 | 显示简单占位符 | 需要创建可视化组件 |
| 乳糖操纵子 | 乳糖操纵子调控机制可视化 | 显示简单占位符 | 需要创建可视化组件 |
| DNA修复 | DNA修复机制可视化 | 显示简单占位符 | 需要创建可视化组件 |
| 复制叉 | DNA复制叉结构可视化 | 显示简单占位符 | 需要创建可视化组件 |
| 前导链 | 前导链合成可视化 | 显示简单占位符 | 需要创建可视化组件 |
| 后随链 | 后随链合成可视化 | 显示简单占位符 | 需要创建可视化组件 |
| DNA聚合酶 | DNA聚合酶结构与功能可视化 | 显示简单占位符 | 需要创建可视化组件 |
| 启动子 | 启动子结构可视化 | 显示简单占位符 | 需要创建可视化组件 |
| 剪接 | mRNA剪接过程可视化 | 显示简单占位符 | 需要创建可视化组件 |
| 密码子 | 遗传密码子可视化 | 已有 ProbabilityDistribution 组件 | 已解决 |
| 基因调控 | 真核生物基因调控可视化 | 显示简单占位符 | 需要创建可视化组件 |
| 表观遗传记忆 | 表观遗传记忆机制可视化 | 显示简单占位符 | 需要创建可视化组件 |

### 2. chromosomal-genetics.ts

| 名称 | 标题 | 当前状态 | 建议操作 |
|------|------|----------|----------|
| DNA双螺旋结构 | DNA双螺旋结构可视化 | 已有 GeneStructureVisualization 组件 | 已解决 |
| 染色体 | 染色体结构可视化 | 显示简单占位符 | 需要创建可视化组件 |
| 有丝分裂 | 有丝分裂过程可视化 | 显示简单占位符 | 需要创建可视化组件 |
| 染色体结构 | 染色体结构可视化 | 显示简单占位符 | 需要创建可视化组件 |
| 染色体畸变 | 染色体畸变类型可视化 | 显示简单占位符 | 需要创建可视化组件 |
| 三体 | 三体综合征可视化 | 显示简单占位符 | 需要创建可视化组件 |
| 染色体结构畸变 | 染色体结构畸变类型可视化 | 显示简单占位符 | 需要创建可视化组件 |

### 3. basic-concepts.ts

| 名称 | 标题 | 当前状态 | 建议操作 |
|------|------|----------|----------|
| 基因型与表型 | 基因型与表型关系可视化 | 已有 ProbabilityDistribution 组件 | 已解决 |
| 中心法则 | 中心法则可视化 | 已有 CentralDogmaVisualization 组件 | 已解决 |
| 基因 | 基因结构可视化 | 已有 GeneStructureVisualization 组件 | 已解决 |
| 等位基因 | 等位基因概念可视化 | 已有 AlleleVisualization 组件 | 已解决 |
| 纯合子与杂合子 | 纯合子与杂合子可视化 | 已有 HomozygousHeterozygousVisualization 组件 | 已解决 |

### 4. modern-techniques.ts

| 名称 | 标题 | 当前状态 | 建议操作 |
|------|------|----------|----------|
| PCR技术 | PCR技术原理可视化 | 显示简单占位符 | 需要创建可视化组件 |
| CRISPR | CRISPR-Cas9基因编辑可视化 | 已有 CRISPRVisualization 组件 | 已解决 |
| 基因工程 | 基因工程（重组DNA技术）可视化 | 显示简单占位符 | 需要创建可视化组件 |

### 5. population-genetics.ts

| 名称 | 标题 | 当前状态 | 建议操作 |
|------|------|----------|----------|
| 哈代-温伯格定律 | 哈代-温伯格平衡可视化 | 已有 ProbabilityDistribution 组件 | 已解决 |
| 遗传漂变 | 遗传漂变可视化 | 已有 ProbabilityDistribution 组件 | 已解决 |
| 自然选择 | 自然选择类型可视化 | 已有 ProbabilityDistribution 组件 | 已解决 |
| 瓶颈效应 | 瓶颈效应可视化 | 已有 InheritancePath 组件 | 已解决 |
| 奠基者效应 | 奠基者效应可视化 | 已有 InheritancePath 组件 | 已解决 |

### 6. epigenetics.ts

| 名称 | 标题 | 当前状态 | 建议操作 |
|------|------|----------|----------|
| DNA甲基化 | DNA甲基化机制可视化 | 显示简单占位符 | 需要创建可视化组件 |
| 组蛋白修饰 | 组蛋白修饰可视化 | 显示简单占位符 | 需要创建可视化组件 |
| RNA干扰 | RNA干扰机制可视化 | 显示简单占位符 | 需要创建可视化组件 |
| 染色质重塑 | 染色质重塑复合物可视化 | 显示简单占位符 | 需要创建可视化组件 |

## 统计

### 已解决的可视化 (14个)
1. 转录与翻译 - CentralDogmaVisualization
2. 基因突变 - ProbabilityDistribution
3. 基因型与表型 - ProbabilityDistribution
4. 中心法则 - CentralDogmaVisualization
5. 基因 - GeneStructureVisualization
6. 等位基因 - AlleleVisualization
7. 纯合子与杂合子 - HomozygousHeterozygousVisualization
8. CRISPR - CRISPRVisualization
9. 哈代-温伯格定律 - ProbabilityDistribution
10. 遗传漂变 - ProbabilityDistribution
11. 自然选择 - ProbabilityDistribution
12. 瓶颈效应 - InheritancePath
13. 奠基者效应 - InheritancePath
14. 密码子 - ProbabilityDistribution

### 需要创建的可视化组件 (22个)

#### 高优先级（核心概念）
1. **TranscriptionVisualization** - 转录过程可视化
2. **TranslationVisualization** - 翻译过程可视化
3. **ChromosomeVisualization** - 染色体结构可视化
4. **MitosisVisualization** - 有丝分裂过程可视化

#### 中优先级（重要概念）
5. **DNAReplicationVisualization** - DNA半保留复制可视化
6. **ReplicationForkVisualization** - DNA复制叉结构可视化
7. **LeadingStrandVisualization** - 前导链合成可视化
8. **LaggingStrandVisualization** - 后随链合成可视化
9. **DNAPolymeraseVisualization** - DNA聚合酶结构与功能可视化
10. **PromoterVisualization** - 启动子结构可视化
11. **SplicingVisualization** - mRNA剪接过程可视化
12. **RibosomeVisualization** - 核糖体结构与功能可视化
13. **LacOperonVisualization** - 乳糖操纵子调控机制可视化
14. **DNARepairVisualization** - DNA修复机制可视化
15. **GeneRegulationVisualization** - 真核生物基因调控可视化
16. **EpigeneticMemoryVisualization** - 表观遗传记忆机制可视化
17. **ChromosomalAberrationVisualization** - 染色体畸变类型可视化
18. **TrisomyVisualization** - 三体综合征可视化

#### 低优先级（扩展概念）
19. **DNAMethylationVisualization** - DNA甲基化机制可视化
20. **HistoneModificationVisualization** - 组蛋白修饰可视化
21. **RNAInterferenceVisualization** - RNA干扰机制可视化
22. **ChromatinRemodelingVisualization** - 染色质重塑复合物可视化
23. **GeneEngineeringVisualization** - 基因工程（重组DNA技术）可视化
24. **PCRVisualization** - PCR技术原理可视化

## 实施计划

### 第一阶段（高优先级）
创建核心概念的可视化组件，这些是最常用的基础概念：
- TranscriptionVisualization
- TranslationVisualization
- ChromosomeVisualization
- MitosisVisualization

### 第二阶段（中优先级）
创建重要概念的可视化组件，补充核心概念：
- DNAReplicationVisualization
- ReplicationForkVisualization
- LeadingStrandVisualization
- LaggingStrandVisualization
- DNAPolymeraseVisualization
- PromoterVisualization
- SplicingVisualization
- RibosomeVisualization
- LacOperonVisualization
- DNARepairVisualization

### 第三阶段（低优先级）
创建扩展概念的可视化组件：
- GeneRegulationVisualization
- EpigeneticMemoryVisualization
- ChromosomalAberrationVisualization
- TrisomyVisualization
- DNAMethylationVisualization
- HistoneModificationVisualization
- RNAInterferenceVisualization
- ChromatinRemodelingVisualization
- GeneEngineeringVisualization
- PCRVisualization
