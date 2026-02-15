# 可视化问题汇总

## 问题描述

当前系统中存在大量可视化内容，其 `type: 'diagram'`，但前端只显示简单的"结构图示"占位符（一个方框和一个圆），没有起到实际的可视化效果。

## 需要解决的可视化列表

### 1. molecular-genetics.ts

| 名称         | 标题                       | 当前状态                                | 建议操作 |
| ------------ | -------------------------- | --------------------------------------- | -------- |
| 减数分裂     | 减数分裂过程可视化         | 已有 MeiosisAnimation 组件              | 已解决   |
| DNA复制      | DNA半保留复制可视化        | 已有 DNAReplicationVisualization 组件   | 已解决   |
| 转录与翻译   | 中心法则：转录与翻译可视化 | 已有 CentralDogmaVisualization 组件     | 已解决   |
| 基因突变     | 基因突变类型与频率可视化   | 已有 ProbabilityDistribution 组件       | 已解决   |
| 转录         | 转录过程可视化             | 已有 TranscriptionVisualization 组件    | 已解决   |
| 翻译         | 翻译过程可视化             | 已有 TranslationVisualization 组件      | 已解决   |
| 核糖体       | 核糖体结构与功能可视化     | 已有 RibosomeVisualization 组件         | 已解决   |
| 乳糖操纵子   | 乳糖操纵子调控机制可视化   | 已有 LacOperonVisualization 组件        | 已解决   |
| DNA修复      | DNA修复机制可视化          | 已有 DNARepairVisualization 组件        | 已解决   |
| 复制叉       | DNA复制叉结构可视化        | 已有 ReplicationForkVisualization 组件  | 已解决   |
| 前导链       | 前导链合成可视化           | 已有 LeadingStrandVisualization 组件    | 已解决   |
| 后随链       | 后随链合成可视化           | 已有 LaggingStrandVisualization 组件    | 已解决   |
| DNA聚合酶    | DNA聚合酶结构与功能可视化  | 已有 DNAPolymeraseVisualization 组件    | 已解决   |
| 启动子       | 启动子结构可视化           | 已有 PromoterVisualization 组件         | 已解决   |
| 剪接         | mRNA剪接过程可视化         | 已有 SplicingVisualization 组件         | 已解决   |
| 密码子       | 遗传密码子可视化           | 已有 ProbabilityDistribution 组件       | 已解决   |
| 基因调控     | 真核生物基因调控可视化     | 已有 GeneRegulationVisualization 组件   | 已解决   |
| 表观遗传记忆 | 表观遗传记忆机制可视化     | 已有 EpigeneticMemoryVisualization 组件 | 已解决   |

### 2. chromosomal-genetics.ts

| 名称           | 标题                     | 当前状态                                     | 建议操作 |
| -------------- | ------------------------ | -------------------------------------------- | -------- |
| DNA双螺旋结构  | DNA双螺旋结构可视化      | 已有 GeneStructureVisualization 组件         | 已解决   |
| 染色体         | 染色体结构可视化         | 已有 ChromosomeVisualization 组件            | 已解决   |
| 有丝分裂       | 有丝分裂过程可视化       | 已有 MitosisVisualization 组件               | 已解决   |
| 染色体结构     | 染色体结构可视化         | 已有 ChromosomeVisualization 组件            | 已解决   |
| 染色体畸变     | 染色体畸变类型可视化     | 已有 ChromosomalAberrationVisualization 组件 | 已解决   |
| 三体           | 三体综合征可视化         | 已有 TrisomyVisualization 组件               | 已解决   |
| 染色体结构畸变 | 染色体结构畸变类型可视化 | 已有 ChromosomalAberrationVisualization 组件 | 已解决   |

### 3. basic-concepts.ts

| 名称           | 标题                   | 当前状态                                      | 建议操作 |
| -------------- | ---------------------- | --------------------------------------------- | -------- |
| 基因型与表型   | 基因型与表型关系可视化 | 已有 ProbabilityDistribution 组件             | 已解决   |
| 中心法则       | 中心法则可视化         | 已有 CentralDogmaVisualization 组件           | 已解决   |
| 基因           | 基因结构可视化         | 已有 GeneStructureVisualization 组件          | 已解决   |
| 等位基因       | 等位基因概念可视化     | 已有 AlleleVisualization 组件                 | 已解决   |
| 纯合子与杂合子 | 纯合子与杂合子可视化   | 已有 HomozygousHeterozygousVisualization 组件 | 已解决   |

### 4. modern-techniques.ts

| 名称     | 标题                          | 当前状态                               | 建议操作 |
| -------- | ----------------------------- | -------------------------------------- | -------- |
| PCR技术  | PCR技术原理可视化             | 已有 PCRVisualization 组件             | 已解决   |
| CRISPR   | CRISPR-Cas9基因编辑可视化     | 已有 CRISPRVisualization 组件          | 已解决   |
| 基因工程 | 基因工程（重组DNA技术）可视化 | 已有 GeneEngineeringVisualization 组件 | 已解决   |
| 基因克隆 | 基因克隆技术可视化            | 已有 GeneCloningVisualization 组件     | 已解决   |
| 载体系统 | 基因载体系统可视化            | 已有 VectorSystemVisualization 组件    | 已解决   |

### 5. population-genetics.ts

| 名称            | 标题                  | 当前状态                          | 建议操作 |
| --------------- | --------------------- | --------------------------------- | -------- |
| 哈代-温伯格定律 | 哈代-温伯格平衡可视化 | 已有 ProbabilityDistribution 组件 | 已解决   |
| 遗传漂变        | 遗传漂变可视化        | 已有 ProbabilityDistribution 组件 | 已解决   |
| 自然选择        | 自然选择类型可视化    | 已有 ProbabilityDistribution 组件 | 已解决   |
| 瓶颈效应        | 瓶颈效应可视化        | 已有 InheritancePath 组件         | 已解决   |
| 奠基者效应      | 奠基者效应可视化      | 已有 InheritancePath 组件         | 已解决   |

### 6. epigenetics.ts

| 名称       | 标题                   | 当前状态                                   | 建议操作 |
| ---------- | ---------------------- | ------------------------------------------ | -------- |
| DNA甲基化  | DNA甲基化机制可视化    | 已有 DNAMethylationVisualization 组件      | 已解决   |
| 组蛋白修饰 | 组蛋白修饰可视化       | 已有 HistoneModificationVisualization 组件 | 已解决   |
| RNA干扰    | RNA干扰机制可视化      | 已有 RNAInterferenceVisualization 组件     | 已解决   |
| 染色质重塑 | 染色质重塑复合物可视化 | 已有 ChromatinRemodelingVisualization 组件 | 已解决   |

## 统计

### 已解决的可视化 (40个)

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
15. TranscriptionVisualization - 转录过程可视化
16. TranslationVisualization - 翻译过程可视化
17. ChromosomeVisualization - 染色体结构可视化
18. MitosisVisualization - 有丝分裂过程可视化
19. DNAReplicationVisualization - DNA半保留复制可视化
20. ReplicationForkVisualization - DNA复制叉结构可视化
21. LeadingStrandVisualization - 前导链合成可视化
22. LaggingStrandVisualization - 后随链合成可视化
23. DNAPolymeraseVisualization - DNA聚合酶结构与功能可视化
24. PromoterVisualization - 启动子结构可视化
25. SplicingVisualization - mRNA剪接过程可视化
26. RibosomeVisualization - 核糖体结构与功能可视化
27. LacOperonVisualization - 乳糖操纵子调控机制可视化
28. DNARepairVisualization - DNA修复机制可视化
29. GeneRegulationVisualization - 真核生物基因调控可视化
30. EpigeneticMemoryVisualization - 表观遗传记忆机制可视化
31. ChromosomalAberrationVisualization - 染色体畸变类型可视化
32. TrisomyVisualization - 三体综合征可视化
33. DNAMethylationVisualization - DNA甲基化机制可视化
34. HistoneModificationVisualization - 组蛋白修饰可视化
35. RNAInterferenceVisualization - RNA干扰机制可视化
36. ChromatinRemodelingVisualization - 染色质重塑复合物可视化
37. GeneEngineeringVisualization - 基因工程（重组DNA技术）可视化
38. PCRVisualization - PCR技术原理可视化
39. VectorSystemVisualization - 基因载体系统可视化
    40.- ✅ GeneCloningVisualization - 基因克隆技术可视化

---

## 可视化改进计划 (2026-02-14)

### 问题分析

虽然所有可视化组件已创建，但用户反馈指出部分组件的可视化效果不够理想：

**问题：** 很多可视化内容都使用相同的简单结构（svg、div、div），这种结构无法有效帮助用户理解遗传学概念。

### 需要改进的组件清单

以下组件虽然已有实现，但可视化过于简单，需要改进：

#### 高优先级改进

| 组件名称               | 当前问题                                | 改进方向                                                                                                                                                            | 状态   |
| ---------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| PromoterVisualization  | 三个标签页，但SVG主要是简单的矩形和线条 | 1. 添加更详细的启动子结构图（TATA框、CAAT框等）<br>2. 增加转录因子结合的动态过程<br>3. 添加交互式元素（悬停显示功能）<br>4. 展示RNA聚合酶结合的步骤                 | 待改进 |
| LacOperonVisualization | 三个标签页，但基因只是简单矩形表示      | 1. 展示乳糖操纵子的完整结构（启动子、操纵子、结构基因）<br>2. 添加诱导状态和阻遏状态的对比<br>3. 增加lac阻遏蛋白和cAMP-CRP的动态结合<br>4. 添加动画效果展示调控过程 | 待改进 |

#### 中优先级改进

| 组件名称                            | 当前问题                             | 改进方向                                                                                                            | 状态   |
| ----------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------- | ------ |
| TestCrossVisualization              | 虽然有三个标签页，但杂交模式图较简单 | 1. 添加更多测交实例（不同性状）<br>2. 增加后代表型比例的可视化<br>3. 添加基因型推断的交互演示                       | 待改进 |
| HomozygousHeterozygousVisualization | 结构较详细，但可以更生动             | 1. 添加染色体配对的动画效果<br>2. 增加更多实际例子（豌豆、果蝇等）<br>3. 改进视觉比喻（用更形象的方式表示等位基因） | 待改进 |

#### 低优先级改进（可选）

| 组件名称                   | 当前问题                                 | 改进方向                                                                               | 状态   |
| -------------------------- | ---------------------------------------- | -------------------------------------------------------------------------------------- | ------ |
| ChromosomeVisualization    | 虽然有三个标签页，但染色体结构可以更精细 | 1. 添加染色带模式的可视化<br>2. 增加不同类型染色体的对比<br>3. 添加染色体异常的图示    | 待改进 |
| GeneStructureVisualization | 已有较详细的结构图，但可增加更多细节     | 1. 添加更详细的外显子/内含子边界标记<br>2. 增加剪接位点的标注<br>3. 添加可变剪接的示例 | 待改进 |

### 改进原则

所有改进应遵循以下原则：

1. **更详细的机制图解**
   - 像染色质重塑组件那样，分步骤展示生物过程
   - 使用更复杂的SVG图形，而不是简单的矩形和圆形
   - 添加标注和说明文字

2. **更多的交互元素**
   - 悬停显示解释信息（使用foreignObject）
   - 点击切换不同状态
   - 拖拽或缩放功能（如果适用）

3. **动画效果**
   - 展示动态过程（如转录、翻译、调控）
   - 使用CSS动画或SVG动画
   - 添加状态转换的过渡效果

4. **更好的视觉比喻**
   - 使用更形象的方式表示抽象概念
   - 添加图标和符号增强理解
   - 使用颜色和形状区分不同元素

### 改进计划

#### 第一阶段：高优先级组件

1. 改进 PromoterVisualization 组件
2. 改进 LacOperonVisualization 组件

#### 第二阶段：中优先级组件

3. 改进 TestCrossVisualization 组件
4. 改进 HomozygousHeterozygousVisualization 组件

#### 第三阶段：低优先级组件（可选）

5. 改进 ChromosomeVisualization 组件
6. 改进 GeneStructureVisualization 组件

### 参考示例

以下组件可以作为改进的参考：

- **ChromatinRemodelingVisualization** - 优秀的多步骤机制图解，4个标签页展示不同重塑复合物
- **GeneCloningVisualization** - 7个详细的标签页，覆盖基因克隆的完整流程
- **EpigeneticMemoryVisualization** - 复杂的调控网络图解
- **AlleleVisualization** - 良好的交互式元素（悬停显示解释）

---

### 需要创建的可视化组件 (0个)

✅ 所有可视化组件已完成！但部分组件需要改进以提升用户体验

## 完成情况

### 高优先级（核心概念）- 已完成

- ✅ TranscriptionVisualization - 转录过程可视化
- ✅ TranslationVisualization - 翻译过程可视化
- ✅ ChromosomeVisualization - 染色体结构可视化
- ✅ MitosisVisualization - 有丝分裂过程可视化

### 中优先级（重要概念）- 已完成

- ✅ DNAReplicationVisualization - DNA半保留复制可视化
- ✅ ReplicationForkVisualization - DNA复制叉结构可视化
- ✅ LeadingStrandVisualization - 前导链合成可视化
- ✅ LaggingStrandVisualization - 后随链合成可视化
- ✅ DNAPolymeraseVisualization - DNA聚合酶结构与功能可视化
- ✅ PromoterVisualization - 启动子结构可视化
- ✅ SplicingVisualization - mRNA剪接过程可视化
- ✅ RibosomeVisualization - 核糖体结构与功能可视化
- ✅ LacOperonVisualization - 乳糖操纵子调控机制可视化
- ✅ DNARepairVisualization - DNA修复机制可视化
- ✅ GeneRegulationVisualization - 真核生物基因调控可视化
- ✅ EpigeneticMemoryVisualization - 表观遗传记忆机制可视化
- ✅ ChromosomalAberrationVisualization - 染色体畸变类型可视化
- ✅ TrisomyVisualization - 三体综合征可视化

### 低优先级（扩展概念）- 已完成

- ✅ DNAMethylationVisualization - DNA甲基化机制可视化
- ✅ HistoneModificationVisualization - 组蛋白修饰可视化
- ✅ RNAInterferenceVisualization - RNA干扰机制可视化
- ✅ ChromatinRemodelingVisualization - 染色质重塑复合物可视化
- ✅ GeneEngineeringVisualization - 基因工程（重组DNA技术）可视化
- ✅ PCRVisualization - PCR技术原理可视化
- ✅ VectorSystemVisualization - 基因载体系统可视化
- ✅ GeneCloningVisualization - 基因克隆技术可视化
