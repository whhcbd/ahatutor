import { useEffect, useState } from 'react';
import { agentApi, VisualizationSuggestion } from '../../api/agent';
import { KnowledgeGraph } from './KnowledgeGraph';

interface VisualDesignerViewProps {
  concept: string;
  userLevel?: 'beginner' | 'intermediate' | 'advanced';
  onNodeClick?: (node: any) => void;
}

/**
 * VisualDesigner 可视化展示组件
 *
 * 支持:
 * - knowledge_graph: 知识图谱力导向图
 * - animation: 动画演示
 * - chart: 统计图表
 * - diagram: 结构图示
 */
export function VisualDesignerView({
  concept,
  userLevel,
  onNodeClick,
}: VisualDesignerViewProps) {
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    loadVisualization();
  }, [concept, userLevel]);

  const loadVisualization = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await agentApi.designVisualization(concept, {
        includeEnrichment: true,
        includePrerequisites: true,
      });
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load visualization');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">正在生成可视化方案...</p>
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

  const { visualization, d3Config, graphData } = data;

  return (
    <div className="space-y-6">
      {/* 可视化类型标签 */}
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

      {/* 可视化渲染区域 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {renderVisualization(visualization, d3Config, graphData, onNodeClick)}
      </div>

      {/* 交互提示 */}
      {visualization.interactions && visualization.interactions.length > 0 && (
        <div className="flex flex-wrap gap-2">
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

      {/* 元素说明 */}
      {visualization.elements && visualization.elements.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-sm text-gray-700 mb-2">包含元素</h4>
          <div className="flex flex-wrap gap-2">
            {visualization.elements.map((element) => (
              <span
                key={element}
                className="px-2 py-1 bg-white border border-gray-300 rounded text-sm text-gray-600"
              >
                {element}
              </span>
            ))}
          </div>
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

function renderVisualization(
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
  switch (visualization.type) {
    case 'knowledge_graph':
      if (graphData) {
        const nodes = graphData.nodes.map((n) => ({
          id: n.id,
          name: n.label,
          type: n.isFoundation ? 'FOUNDATION' : 'CONCEPT',
          level: n.level,
          mastery: 50, // 默认值，可以从后端获取
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

function renderAnimation(visualization: VisualizationSuggestion, config: Record<string, unknown>) {
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

function renderChart(visualization: VisualizationSuggestion, config: Record<string, unknown>) {
  // 这里可以集成 ECharts 或 Recharts
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

function renderDiagram(visualization: VisualizationSuggestion, config: Record<string, unknown>) {
  return (
    <div className="h-96 flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <svg width="200" height="200" viewBox="0 0 200 200" className="mx-auto">
          {/* 简单的示例图 */}
          <rect x="50" y="50" width="100" height="100" fill="none" stroke="#3b82f6" strokeWidth="2" />
          <circle cx="100" cy="100" r="30" fill="#3b82f6" fillOpacity="0.2" />
          <text x="100" y="180" textAnchor="middle" className="text-xs">
            {visualization.elements[0] || 'Diagram'}
          </text>
        </svg>
        <p className="text-gray-500 mt-4">结构图示</p>
      </div>
    </div>
  );
}

function getVisualizationTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    knowledge_graph: '知识图谱',
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
}

/**
 * 独立的可视化查看器组件
 * 直接接受已生成的可视化数据
 */
export function VisualizationViewer({
  visualization,
  graphData,
}: VisualizationViewerProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
          {getVisualizationTypeLabel(visualization.type)}
        </span>
        {visualization.layout && (
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
            {getLayoutLabel(visualization.layout)}
          </span>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {renderVisualization(visualization, {}, graphData)}
      </div>

      {visualization.elements && visualization.elements.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-sm text-gray-700 mb-2">包含元素</h4>
          <div className="flex flex-wrap gap-2">
            {visualization.elements.map((element) => (
              <span
                key={element}
                className="px-2 py-1 bg-white border border-gray-300 rounded text-sm text-gray-600"
              >
                {element}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
