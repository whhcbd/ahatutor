import { useEffect, useState, useCallback, useMemo } from 'react';
import { agentApi } from '../../api/agent';
import type { VisualizationSuggestion, PunnettSquareData, InheritancePathData, ProbabilityDistributionData, MeiosisAnimationData, ChromosomeBehaviorData, TestCrossData, ThreePointTestCrossData } from '@shared/types/agent.types';
import { KnowledgeGraph } from './KnowledgeGraph';
import { PunnettSquare } from './PunnettSquare';
import { InheritancePath } from './InheritancePath';
import { ProbabilityDistribution } from './ProbabilityDistribution';
import { MeiosisAnimation } from './MeiosisAnimation';
import { ChromosomeBehavior } from './ChromosomeBehavior';
import { CRISPRVisualization } from './CRISPRVisualization';
import { GeneStructureVisualization } from './GeneStructureVisualization';
import { CentralDogmaVisualization } from './CentralDogmaVisualization';
import { AlleleVisualization } from './AlleleVisualization';
import { HomozygousHeterozygousVisualization } from './HomozygousHeterozygousVisualization';
import { XLinkedInheritance } from './XLinkedInheritance';
import { TestCrossVisualization } from './TestCrossVisualization';
import { TranscriptionVisualization } from './TranscriptionVisualization';
import { TranslationVisualization } from './TranslationVisualization';
import { ChromosomeVisualization } from './ChromosomeVisualization';
import { MitosisVisualization } from './MitosisVisualization';
import { DNAReplicationVisualization } from './DNAReplicationVisualization';
import { ReplicationForkVisualization } from './ReplicationForkVisualization';
import { LeadingStrandVisualization } from './LeadingStrandVisualization';
import { LaggingStrandVisualization } from './LaggingStrandVisualization';
import { DNAPolymeraseVisualization } from './DNAPolymeraseVisualization';
import { DNARepairVisualization } from './DNARepairVisualization';
import { GeneRegulationVisualization } from './GeneRegulationVisualization';
import { EpigeneticMemoryVisualization } from './EpigeneticMemoryVisualization';
import { ChromosomalAberrationVisualization } from './ChromosomalAberrationVisualization';
import { TrisomyVisualization } from './TrisomyVisualization';
import { GeneEngineeringVisualization } from './GeneEngineeringVisualization';
import { GeneCloningVisualization } from './GeneCloningVisualization';
import { VectorSystemVisualization } from './VectorSystemVisualization';
import { PCRVisualization } from './PCRVisualization';
import { UnderstandingInsights } from './UnderstandingInsights';
import { DNAHelixVisualization } from './DNAHelixVisualization';
import { ChromosomeDetailedVisualization, ChromosomeAberrationVisualization } from './ChromosomeDetailedVisualization';
import { MitosisProcessVisualization } from './MitosisProcessVisualization';
import { TrisomyDetailedVisualization, AneuploidyVisualization } from './TrisomyDetailedVisualization';
import { SynapsisVisualization, HomologousRecombinationVisualization } from './RecombinationVisualization';
import { KaryotypeVisualization, RobertsonTranslocationVisualization } from './KaryotypeVisualization';
import { DNAMethylationVisualization, HistoneModificationVisualization, RNAInterferenceVisualization, ChromatinRemodelingVisualization as EpigeneticChromatinVisualization, NoncodingRNAVisualization, GenomicImprintingVisualization } from './EpigeneticsVisualization';
import { MutationVisualization } from './MutationVisualization';
import { PedigreeChart } from './PedigreeChart';
import { ThreePointTestCross } from './ThreePointTestCross';
import { TestCross } from './TestCross';

interface VisualDesignerViewProps {
  concept: string;
  useHardcoded?: boolean;
  onNodeClick?: (node: any) => void;
}

const visualizationCache = new Map<string, {
  visualization: VisualizationSuggestion;
  d3Config: Record<string, unknown>;
  graphData?: {
    nodes: Array<{
      id: string;
      label: string;
      level: number;
      isFoundation: boolean;
    }>;
    links: Array<{ source: string; target: string }>;
  };
}>();

/**
 * VisualDesigner 可视化展示组件
 *
 * 支持的可视化类型:
 * - knowledge_graph: 知识图谱力导向图
 * - punnett_square: Punnett 方格（杂交棋盘）
 * - inheritance_path: 遗传路径图（伴性遗传等）
 * - probability_distribution: 概率分布图
 * - animation: 动画演示
 * - chart: 统计图表
 * - diagram: 结构图示
 */
export function VisualDesignerView({
  concept,
  useHardcoded = true,
  onNodeClick,
}: VisualDesignerViewProps) {
  const [loading, setLoading] = useState(true);
  const [usingHardcoded, setUsingHardcoded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    visualization: VisualizationSuggestion;
    d3Config: Record<string, unknown>;
    graphData?: {
      nodes: Array<{
        id: string;
        label: string;
        level: number;
        isFoundation: boolean;
      }>;
      links: Array<{ source: string; target: string }>;
    };
  } | null>(null);

  const cacheKey = useMemo(() => `${concept}-${useHardcoded}`, [concept, useHardcoded]);

  const loadVisualization = useCallback(async () => {
    const cached = visualizationCache.get(cacheKey);
    if (cached) {
      setData(cached);
      setLoading(false);
      setUsingHardcoded(useHardcoded);
      return;
    }

    setLoading(true);
    setError(null);

    // 如果启用硬编码优先，先尝试获取硬编码概念列表
    if (useHardcoded) {
      setUsingHardcoded(true);
      try {
        const hardcodedConcepts = await agentApi.getHardcodedConcepts();
        const conceptNames = hardcodedConcepts.map(c => c.concept);

        if (conceptNames.includes(concept)) {
          const result = await agentApi.designVisualization(concept, {
            includeEnrichment: false,
            includePrerequisites: false,
          });

          visualizationCache.set(cacheKey, result);
          setData(result);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.log('Failed to load hardcoded data, falling back to AI generation:', err);
      }
    }

    setUsingHardcoded(false);
    try {
      const result = await agentApi.designVisualization(concept, {
        includeEnrichment: true,
        includePrerequisites: true,
      });
      visualizationCache.set(cacheKey, result);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load visualization');
    } finally {
      setLoading(false);
    }
  }, [concept, useHardcoded, cacheKey]);

  useEffect(() => {
    loadVisualization();
  }, [loadVisualization]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {usingHardcoded ? '⚡ 能快速加载' : '正在生成可视化方案...'}
          </p>
          {!usingHardcoded && (
            <p className="text-sm text-gray-500 mt-2">AI生成需要几秒钟，请稍候</p>
          )}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center text-red-500">
          <p className="mb-4">可视化生成失败</p>
          <button
            onClick={loadVisualization}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  const { visualization, d3Config, graphData } = data || {};

  if (!visualization) {
    return <div className="text-center text-gray-500 p-8">可视化数据加载中...</div>;
  }

  return (
    <div className="space-y-6">
      {/* 标题和描述 */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          {visualization.title && (
            <h3 className="text-xl font-bold text-gray-800">{visualization.title}</h3>
          )}
          {usingHardcoded && (
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
              ⚡ 快速加载
            </span>
          )}
        </div>
        {visualization.description && (
          <p className="text-gray-600 text-sm">{visualization.description}</p>
        )}
      </div>

      {/* 可视化类型标签 */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
          {getVisualizationTypeLabel(visualization.type)}
        </span>
        {visualization.layout && (
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
            布局: {getLayoutLabel(visualization.layout)}
          </span>
        )}
      </div>

      {/* 可视化渲染区域 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 overflow-hidden">
        {renderVisualization(visualization, d3Config, graphData, onNodeClick)}
      </div>

      {/* 理解提示 */}
      {visualization.insights && visualization.insights.length > 0 && (
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-6">
          <UnderstandingInsights insights={visualization.insights} />
        </div>
      )}

      {/* 交互提示 */}
      {visualization.interactions && visualization.interactions.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          {visualization.interactions.map((interaction) => (
            <span
              key={interaction}
              className="px-3 py-1 bg-green-50 text-green-700 rounded text-sm"
            >
              {getInteractionLabel(interaction)}
            </span>
          ))}
        </div>
      )}

      {/* 注释 */}
      {visualization.annotations && visualization.annotations.length > 0 && (
        <div className="bg-yellow-50 rounded-lg p-4">
          <h4 className="font-semibold text-sm text-yellow-800 mb-2">注释说明</h4>
          <ul className="space-y-1 text-sm text-yellow-700">
            {visualization.annotations.map((annotation, index) => (
              <li key={index}>• {annotation}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ==================== Helper Functions ====================

export function renderVisualization(
  visualization: VisualizationSuggestion,
  d3Config: Record<string, unknown>,
  graphData?: {
    nodes: Array<{
      id: string;
      label: string;
      level: number;
      isFoundation: boolean;
    }>;
    links: Array<{ source: string; target: string }>;
  },
  onNodeClick?: (node: any) => void
) {
  console.log('=== renderVisualization called ===');
  console.log('Visualization type:', visualization?.type);
  console.log('Visualization data:', visualization?.data);
  console.log('Visualization title:', visualization?.title);
  console.log('Has data:', !!visualization?.data);
  console.log('Data keys:', visualization?.data ? Object.keys(visualization.data) : 'N/A');
  console.log('==========================');

  if (visualization.type === 'diagram' && visualization.data && 'components' in visualization.data) {
    return <CRISPRVisualization data={visualization.data as any} colors={visualization.colors} />;
  }

  switch (visualization.type) {
    case 'knowledge_graph':
      if (graphData) {
        const nodes = graphData.nodes.map((n) => ({
          id: n.id,
          name: n.label,
          type: n.isFoundation ? 'FOUNDATION' : 'CONCEPT',
          level: n.level,
          mastery: 50,
          group: n.level,
        }));

        const edges = graphData.links.map((l) => ({
          source: l.source,
          target: l.target,
          weight: 1,
        }));

        return <KnowledgeGraph data={{ nodes, edges }} onNodeClick={onNodeClick} />;
      }
      return <div className="h-96 flex items-center justify-center text-gray-500">暂无图谱数据</div>;

    case 'punnett_square':
      if (visualization.title === '测交原理可视化') {
        return <TestCrossVisualization data={visualization.data as any} colors={visualization.colors} />;
      }
      if (visualization.data) {
        return <PunnettSquare data={visualization.data as PunnettSquareData} colors={visualization.colors} />;
      }
      return <PunnettSquarePlaceholder />;

    case 'inheritance_path':
      if (visualization.title === 'X连锁遗传（性染色体遗传）可视化') {
        return <XLinkedInheritance data={visualization.data as any} colors={visualization.colors} />;
      }
      if (visualization.data) {
        return <InheritancePath data={visualization.data as InheritancePathData} colors={visualization.colors} />;
      }
      return <InheritancePathPlaceholder />;

    case 'probability_distribution':
      if (visualization.data) {
        return <ProbabilityDistribution data={visualization.data as ProbabilityDistributionData} colors={visualization.colors} />;
      }
      return <ProbabilityDistributionPlaceholder />;

    case 'meiosis_animation':
      if (visualization.data) {
        return <MeiosisAnimation data={visualization.data as MeiosisAnimationData} colors={visualization.colors} />;
      }
      return <MeiosisAnimationPlaceholder />;

    case 'chromosome_behavior':
      if (visualization.data) {
        return <ChromosomeBehavior data={visualization.data as ChromosomeBehaviorData} colors={visualization.colors} />;
      }
      return <ChromosomeBehaviorPlaceholder />;

    case 'pedigree_chart':
      return renderPedigreeChart(visualization);

    case 'test_cross':
      if (visualization.data) {
        return <TestCross data={visualization.data as unknown as TestCrossData} colors={visualization.colors} />;
      }
      return <div className="h-96 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-4">🧪</div>
          <p>测交数据加载中...</p>
        </div>
      </div>;

    case 'three_point_test_cross':
      if (visualization.data) {
        return <ThreePointTestCross data={visualization.data as unknown as ThreePointTestCrossData} colors={visualization.colors} />;
      }
      return <div className="h-96 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-4">🧬</div>
          <p>三点测交数据加载中...</p>
        </div>
      </div>;

    case 'animation':
      return renderAnimation(visualization, d3Config);

    case 'chart':
      return renderChart(visualization, d3Config);

    case 'diagram':
      return renderDiagram(visualization, d3Config);

    default:
      return <div className="h-96 flex items-center justify-center text-gray-500">未知可视化类型</div>;
  }
}

// ==================== Placeholder Components ====================

function PunnettSquarePlaceholder() {
  return (
    <div className="flex items-center justify-center h-96 text-gray-500">
      <div className="text-center">
        <div className="text-4xl mb-4">🧬</div>
        <p>Punnett 方格数据加载中...</p>
      </div>
    </div>
  );
}

function InheritancePathPlaceholder() {
  return (
    <div className="flex items-center justify-center h-96 text-gray-500">
      <div className="text-center">
        <div className="text-4xl mb-4">👨‍👩‍👧‍👦</div>
        <p>遗传路径数据加载中...</p>
      </div>
    </div>
  );
}

function ProbabilityDistributionPlaceholder() {
  return (
    <div className="flex items-center justify-center h-96 text-gray-500">
      <div className="text-center">
        <div className="text-4xl mb-4">📊</div>
        <p>概率分布数据加载中...</p>
      </div>
    </div>
  );
}

function MeiosisAnimationPlaceholder() {
  return (
    <div className="flex items-center justify-center h-96 text-gray-500">
      <div className="text-center">
        <div className="text-4xl mb-4">🔄</div>
        <p>减数分裂动画数据加载中...</p>
      </div>
    </div>
  );
}

function ChromosomeBehaviorPlaceholder() {
  return (
    <div className="flex items-center justify-center h-96 text-gray-500">
      <div className="text-center">
        <div className="text-4xl mb-4">🧬</div>
        <p>染色体行为数据加载中...</p>
      </div>
    </div>
  );
}

// ==================== Legacy Render Functions ====================

function renderPedigreeChart(visualization: VisualizationSuggestion) {
  if (visualization.data) {
    return <PedigreeChart data={visualization.data as any} colors={visualization.colors} />;
  }
  return (
    <div className="h-96 flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
      <div className="text-center">
        <div className="text-6xl mb-4">👨‍👩‍👧‍👦</div>
        <p className="text-gray-700 font-medium">系谱图</p>
        <p className="text-sm text-gray-500 mt-2">展示家族遗传关系和性状传递</p>
      </div>
    </div>
  );
}

function renderAnimation(visualization: VisualizationSuggestion, _config: Record<string, unknown>) {
  const duration = visualization.animationConfig?.duration || 5000;

  return (
    <div className="h-96 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="text-center">
        <div className="animate-pulse mb-4">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white text-4xl">DNA</span>
          </div>
        </div>
        <p className="text-gray-600">动画演示 ({(duration / 1000).toFixed(1)}秒)</p>
        {visualization.animationConfig?.autoplay && (
          <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 rounded text-sm">自动播放</span>
        )}
      </div>
    </div>
  );
}

function renderChart(visualization: VisualizationSuggestion, _config: Record<string, unknown>) {
  return (
    <div className="h-96 flex items-center justify-center">
      <div className="text-center">
        <div className="grid grid-cols-3 gap-4 mb-6">
          {visualization.colors &&
            Object.entries(visualization.colors).map(([key, value]) => (
              <div key={key} className="text-center">
                <div
                  className="w-16 h-16 mx-auto rounded-lg mb-2"
                  style={{ backgroundColor: value as string }}
                />
                <p className="text-sm text-gray-600">{key}</p>
              </div>
            ))}
        </div>
        <p className="text-gray-500">图表组件</p>
        <p className="text-xs text-gray-400 mt-2">需要集成 ECharts/Recharts</p>
      </div>
    </div>
  );
}

function renderDiagram(visualization: VisualizationSuggestion, _config: Record<string, unknown>) {
  if (visualization.title === '转录过程可视化') {
    return <TranscriptionVisualization data={visualization.data as any} colors={visualization.colors} />;
  }
  
  if (visualization.title === '翻译过程可视化') {
    return <TranslationVisualization data={visualization.data as any} colors={visualization.colors} />;
  }
  
  if (visualization.title === '染色体结构可视化') {
    return <ChromosomeVisualization data={visualization.data as any} colors={visualization.colors} />;
  }
  
  if (visualization.title === '有丝分裂过程可视化') {
    return <MitosisVisualization data={visualization.data as any} />;
  }
  
  if (visualization.title === 'DNA复制过程可视化') {
    return <DNAReplicationVisualization data={visualization.data as any} colors={visualization.colors} />;
  }
  
  if (visualization.title === '复制叉结构可视化') {
    return <ReplicationForkVisualization data={visualization.data as any} colors={visualization.colors} />;
  }
  
  if (visualization.title === '前导链合成可视化') {
    return <LeadingStrandVisualization data={visualization.data as any} colors={visualization.colors} />;
  }
  
  if (visualization.title === '后随链合成可视化') {
    return <LaggingStrandVisualization data={visualization.data as any} colors={visualization.colors} />;
  }
  
  if (visualization.title === 'DNA聚合酶结构与功能可视化') {
    return <DNAPolymeraseVisualization data={visualization.data as any} colors={visualization.colors} />;
  }
  
  if (visualization.title === 'DNA修复机制可视化') {
    return <DNARepairVisualization data={visualization.data as any} colors={visualization.colors} />;
  }
  
  if (visualization.title === '真核生物基因调控可视化') {
    return <GeneRegulationVisualization data={visualization.data as any} colors={visualization.colors} />;
  }
  
  if (visualization.title === '等位基因概念可视化') {
    return <AlleleVisualization colors={visualization.colors} />;
  }
  
  if (visualization.title === '纯合子与杂合子可视化') {
    return <HomozygousHeterozygousVisualization colors={visualization.colors} />;
  }
  
  if (visualization.title === '中心法则可视化' || visualization.title === '中心法则：转录与翻译可视化') {
    return <CentralDogmaVisualization colors={visualization.colors} />;
  }
  
  if (visualization.title === '基因结构可视化' && visualization.data && 'structure' in visualization.data) {
    return <GeneStructureVisualization data={visualization.data as any} colors={visualization.colors} />;
  }
  
  if (visualization.title === '表观遗传记忆可视化') {
    return <EpigeneticMemoryVisualization data={visualization.data as any} colors={visualization.colors} />;
  }
  
  if (visualization.title === '染色体畸变类型可视化') {
    return <ChromosomalAberrationVisualization colors={visualization.colors} />;
  }
  
  if (visualization.title === '三体综合征可视化') {
    return <TrisomyVisualization colors={visualization.colors} />;
  }
  
  if (visualization.title === 'DNA甲基化可视化') {
    return <DNAMethylationVisualization data={visualization.data as any} colors={visualization.colors} />;
  }

  if (visualization.title === '组蛋白修饰可视化') {
    return <HistoneModificationVisualization data={visualization.data as any} colors={visualization.colors} />;
  }

  if (visualization.title === 'RNA干扰可视化') {
    return <RNAInterferenceVisualization data={visualization.data as any} colors={visualization.colors} />;
  }

  if (visualization.title === '染色质重塑可视化') {
    return <EpigeneticChromatinVisualization data={visualization.data as any} colors={visualization.colors} />;
  }

  if (visualization.title === '基因工程可视化') {
    return <GeneEngineeringVisualization colors={visualization.colors} />;
  }
  
  if (visualization.title === '基因克隆技术可视化') {
    return <GeneCloningVisualization colors={visualization.colors} />;
  }
  
  if (visualization.title === '基因载体系统可视化') {
    return <VectorSystemVisualization colors={visualization.colors} />;
  }
  
  if (visualization.title === 'PCR技术可视化') {
    return <PCRVisualization colors={visualization.colors} />;
  }

  if (visualization.title === 'DNA双螺旋结构可视化') {
    return <DNAHelixVisualization data={visualization.data as any} colors={visualization.colors} />;
  }

  if (visualization.title === '染色体结构可视化' && visualization.data && 'parts' in visualization.data) {
    return <ChromosomeDetailedVisualization data={visualization.data as any} colors={visualization.colors} />;
  }

  if (visualization.title === '染色体结构可视化' && visualization.data && 'structure' in visualization.data) {
    return <ChromosomeDetailedVisualization data={visualization.data as any} colors={visualization.colors} />;
  }

  if (visualization.title === '有丝分裂过程可视化') {
    return <MitosisProcessVisualization data={visualization.data as any} colors={visualization.colors} />;
  }

  if (visualization.title === '染色体畸变类型可视化') {
    return <ChromosomeAberrationVisualization data={visualization.data as any} colors={visualization.colors} />;
  }

  if (visualization.title === '三体综合征可视化') {
    return <TrisomyDetailedVisualization data={visualization.data as any} colors={visualization.colors} />;
  }

  if (visualization.title === '非整倍体类型可视化') {
    return <AneuploidyVisualization data={visualization.data as any} colors={visualization.colors} />;
  }

  if (visualization.title === '减数分裂联会可视化') {
    return <SynapsisVisualization data={visualization.data as any} colors={visualization.colors} />;
  }

  if (visualization.title === '同源重组机制可视化') {
    return <HomologousRecombinationVisualization data={visualization.data as any} colors={visualization.colors} />;
  }

  if (visualization.title === '人类核型分析可视化') {
    return <KaryotypeVisualization data={visualization.data as any} colors={visualization.colors} />;
  }

  if (visualization.title === '染色体组型分析可视化') {
    return <KaryotypeVisualization data={visualization.data as any} colors={visualization.colors} />;
  }

  if (visualization.title === '罗伯逊易位机制可视化') {
    return <RobertsonTranslocationVisualization data={visualization.data as any} colors={visualization.colors} />;
  }

  if (visualization.title === 'DNA甲基化机制可视化') {
    return <DNAMethylationVisualization data={visualization.data as any} colors={visualization.colors} />;
  }

  if (visualization.title === '组蛋白修饰可视化') {
    return <HistoneModificationVisualization data={visualization.data as any} colors={visualization.colors} />;
  }

  if (visualization.title === 'RNA干扰机制可视化') {
    return <RNAInterferenceVisualization data={visualization.data as any} colors={visualization.colors} />;
  }

  if (visualization.title === '染色质重塑复合物可视化') {
    return <EpigeneticChromatinVisualization data={visualization.data as any} colors={visualization.colors} />;
  }

  if (visualization.title === '非编码RNA功能可视化') {
    return <NoncodingRNAVisualization data={visualization.data as any} colors={visualization.colors} />;
  }

  if (visualization.title === '基因组印记机制可视化') {
    return <GenomicImprintingVisualization data={visualization.data as any} colors={visualization.colors} />;
  }

  if (visualization.title === '基因突变类型与机制可视化') {
    return <MutationVisualization data={visualization.data as any} colors={visualization.colors} />;
  }

  return (
    <div className="h-96 flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <svg width="200" height="200" viewBox="0 0 200 200" className="mx-auto">
          <rect x="50" y="50" width="100" height="100" fill="none" stroke="#3b82f6" strokeWidth="2" />
          <circle cx="100" cy="100" r="30" fill="#3b82f6" fillOpacity="0.2" />
          <text x="100" y="180" textAnchor="middle" fontSize="12" fill="#666">
            {visualization.elements?.[0] || 'Diagram'}
          </text>
        </svg>
        <p className="text-gray-500 mt-4">结构图示</p>
      </div>
    </div>
  );
}

// ==================== Label Functions ====================

function getVisualizationTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    knowledge_graph: '知识图谱',
    punnett_square: 'Punnett 方格',
    inheritance_path: '遗传路径图',
    probability_distribution: '概率分布',
    pedigree_chart: '系谱图',
    meiosis_animation: '减数分裂动画',
    chromosome_behavior: '染色体行为',
    animation: '动画演示',
    chart: '统计图表',
    diagram: '结构图示',
  };
  return labels[type] || type;
}

function getLayoutLabel(layout: string): string {
  const labels: Record<string, string> = {
    force: '力导向',
    hierarchical: '层次布局',
    circular: '环形布局',
    grid: '网格布局',
  };
  return labels[layout] || layout;
}

function getInteractionLabel(interaction: string): string {
  const labels: Record<string, string> = {
    click: '点击交互',
    hover: '悬停提示',
    zoom: '缩放',
    drag: '拖拽',
    select: '选择',
  };
  return labels[interaction] || interaction;
}

// ==================== Standalone Component ====================

interface VisualizationViewerProps {
  visualization: VisualizationSuggestion;
  graphData?: {
    nodes: Array<{
      id: string;
      label: string;
      level: number;
      isFoundation: boolean;
    }>;
    links: Array<{ source: string; target: string }>;
  };
  isHardcoded?: boolean;
}

/**
 * 独立的可视化查看器组件
 * 直接接受已生成的可视化数据
 */
export function VisualizationViewer({
  visualization,
  graphData,
  isHardcoded = false,
}: VisualizationViewerProps) {
  return (
    <div className="space-y-6">
      {/* 标题和描述 */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          {visualization.title && (
            <h3 className="text-xl font-bold text-gray-800">{visualization.title}</h3>
          )}
          {isHardcoded && (
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
              ⚡ 快速加载
            </span>
          )}
        </div>
        {visualization.description && (
          <p className="text-gray-600 text-sm">{visualization.description}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
          {getVisualizationTypeLabel(visualization.type)}
        </span>
        {visualization.layout && (
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
            布局: {getLayoutLabel(visualization.layout)}
          </span>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {renderVisualization(visualization, {}, graphData)}
      </div>

      {/* 理解提示 */}
      {visualization.insights && visualization.insights.length > 0 && (
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-6">
          <UnderstandingInsights insights={visualization.insights} />
        </div>
      )}
    </div>
  );
}
