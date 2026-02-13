import { useCallback, useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { agentApi, NarrativeComposition } from '../../api/agent';

interface NarrativeComposerViewProps {
  concept: string;
  userLevel?: 'beginner' | 'intermediate' | 'advanced';
}

/**
 * NarrativeComposer 学习叙事展示组件
 *
 * 展示:
 * - 学习路径
 * - 讲解顺序
 * - 连接故事
 * - 难度递进模式
 */
export function NarrativeComposerView({
  concept,
  userLevel,
}: NarrativeComposerViewProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    narrative: NarrativeComposition;
    treeText: string;
  } | null>(null);

  const loadNarrative = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await agentApi.composeNarrative(concept, userLevel);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load narrative');
    } finally {
      setLoading(false);
    }
  }, [concept, userLevel]);

  useEffect(() => {
    loadNarrative();
  }, [loadNarrative]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">正在构建学习叙事...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center text-red-500">
          <p className="mb-4">叙事构建失败</p>
          <button
            onClick={loadNarrative}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  const { narrative, treeText } = data || {};

  if (!narrative) {
    return <div className="text-center text-gray-500 p-8">叙事数据加载中...</div>;
  }

  return (
    <div className="space-y-6">
      {/* 难度递进模式标签 */}
      <div className="flex items-center gap-2">
        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
          {getProgressionLabel(narrative.difficultyProgression || 'sequential')}
        </span>
        <span className="text-sm text-gray-500">
          共 {narrative.learningPath?.length || 0} 个学习步骤
        </span>
      </div>

      {/* 学习路径 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">🎯 学习路径</h3>
        <div className="flex flex-wrap items-center gap-2">
          {narrative.learningPath.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </div>
                <span className="ml-2 px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium">
                  {step}
                </span>
              </div>
              {index < narrative.learningPath.length - 1 && (
                <span className="mx-2 text-purple-300">→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 讲解顺序 */}
      {narrative.explanationOrder && narrative.explanationOrder.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📚 讲解顺序</h3>
          <ol className="space-y-2">
            {narrative.explanationOrder.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold mr-3">
                  {index + 1}
                </span>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* 连接故事 */}
      {narrative.connectingStories && narrative.connectingStories.length > 0 && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg shadow-sm border border-purple-200 p-6">
          <h3 className="text-lg font-semibold text-purple-800 mb-4">📖 连接故事</h3>
          <div className="space-y-3">
            {narrative.connectingStories.map((story, index) => {
              // 检查是否是特殊格式的故事（类比、解释、记忆技巧）
              if (story.startsWith('📖')) {
                return (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-gray-700">{story.replace('📖 ', '')}</p>
                  </div>
                );
              }
              if (story.startsWith('   ')) {
                return (
                  <p key={index} className="text-gray-600 text-sm ml-4">
                    {story.trim()}
                  </p>
                );
              }
              if (story.startsWith('   💡')) {
                return (
                  <div key={index} className="bg-yellow-100 rounded-lg p-3 ml-4">
                    <p className="text-yellow-800 text-sm font-medium">
                      {story.trim()}
                    </p>
                  </div>
                );
              }
              if (story.startsWith('📚')) {
                return (
                  <h4 key={index} className="font-semibold text-purple-700 mt-4">
                    {story}
                  </h4>
                );
              }
              return (
                <p key={index} className="text-gray-700">
                  {story}
                </p>
              );
            })}
          </div>
        </div>
      )}

      {/* 知识树文本表示 */}
      {treeText && (
        <details className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <summary className="cursor-pointer text-lg font-semibold text-gray-800 mb-4">
            🌳 知识树结构
          </summary>
          <pre className="text-sm text-gray-600 whitespace-pre-wrap font-mono bg-gray-50 p-4 rounded-lg overflow-x-auto">
            {treeText}
          </pre>
        </details>
      )}
    </div>
  );
}

// ==================== Interactive Flow Component ====================

interface InteractiveFlowViewProps {
  concept: string;
  userLevel?: 'beginner' | 'intermediate' | 'advanced';
}

/**
 * 互动式学习流程组件
 */
export function InteractiveFlowView({
  concept,
  userLevel,
}: InteractiveFlowViewProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    narrative: NarrativeComposition;
    flow: Array<{
      step: number;
      title: string;
      content: string;
      type: 'explanation' | 'question' | 'activity' | 'assessment';
      interaction?: string;
    }>;
  } | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  const loadFlow = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await agentApi.generateInteractiveFlow(concept, userLevel);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load flow');
    } finally {
      setLoading(false);
    }
  }, [concept, userLevel]);

  useEffect(() => {
    loadFlow();
  }, [loadFlow]);

  // Reset details view when step changes
  useEffect(() => {
    setShowDetails(false);
  }, [currentStep]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600">正在生成互动流程...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center text-red-500">
          <p className="mb-4">流程生成失败</p>
          <button
            onClick={loadFlow}
            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  const { flow } = data || {};

  if (!flow || flow.length === 0) {
    return <div className="text-center text-gray-500 p-8">流程数据加载中...</div>;
  }

  const currentFlowItem = flow[currentStep] || flow[0];

  return (
    <div className="space-y-6">
      {/* 进度条 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            步骤 {currentStep + 1} / {flow.length}
          </span>
          <span className="text-sm text-gray-500">{getStepTypeLabel(currentFlowItem?.type || 'concept')}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / flow.length) * 100}%` }}
          />
        </div>
      </div>

      {/* 当前步骤内容 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 min-h-[300px]">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-semibold ${getStepColor(currentFlowItem.type)}`}>
            {getStepIcon(currentFlowItem.type)}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{currentFlowItem.title}</h3>
            <p className="text-gray-700 leading-relaxed">{currentFlowItem.content}</p>

            {currentFlowItem.interaction === 'flashcard' && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">💡 点击卡片查看答案</p>
              </div>
            )}

            {currentFlowItem.interaction === 'click_to_reveal' && (
              <div className="mt-4">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="w-full flex items-center justify-between p-4 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  <span className="text-indigo-700 font-medium">
                    {showDetails ? '收起详细内容' : '点击查看详细内容'}
                  </span>
                  {showDetails ? (
                    <ChevronUp className="w-5 h-5 text-indigo-700" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-indigo-700" />
                  )}
                </button>
                {showDetails && (
                  <div className="mt-3 p-4 bg-white border border-indigo-100 rounded-lg">
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-semibold text-indigo-900 mb-2">详细讲解</h4>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {currentFlowItem.content}
                        </p>
                      </div>
                      {currentFlowItem.type === 'explanation' && (
                        <div>
                          <h4 className="text-sm font-semibold text-indigo-900 mb-2">关键要点</h4>
                          <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                            <li>理解核心概念的定义和原理</li>
                            <li>掌握相关的公式和计算方法</li>
                            <li>了解实际应用场景和例子</li>
                          </ul>
                        </div>
                      )}
                      {currentFlowItem.type === 'question' && (
                        <div>
                          <h4 className="text-sm font-semibold text-indigo-900 mb-2">思考提示</h4>
                          <p className="text-sm text-gray-700">
                            试着回忆刚才学过的内容，分析这个问题涉及的知识点。
                          </p>
                        </div>
                      )}
                      {currentFlowItem.type === 'activity' && (
                        <div>
                          <h4 className="text-sm font-semibold text-indigo-900 mb-2">活动说明</h4>
                          <p className="text-sm text-gray-700">
                            按照步骤完成练习，有助于加深对知识点的理解。
                          </p>
                        </div>
                      )}
                      {currentFlowItem.type === 'assessment' && (
                        <div>
                          <h4 className="text-sm font-semibold text-indigo-900 mb-2">评估标准</h4>
                          <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                            <li>知识点理解是否准确</li>
                            <li>能否正确应用相关原理</li>
                            <li>是否掌握解题方法</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 导航按钮 */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← 上一步
        </button>
        <button
          onClick={() => setCurrentStep(Math.min(flow.length - 1, currentStep + 1))}
          disabled={currentStep === flow.length - 1}
          className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentStep === flow.length - 1 ? '完成' : '下一步 →'}
        </button>
      </div>

      {/* 步骤指示器 */}
      <div className="flex justify-center gap-2">
        {flow.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentStep(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentStep
                ? 'bg-indigo-500 scale-125'
                : index < currentStep
                ? 'bg-indigo-300'
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ==================== Helper Functions ====================

function getProgressionLabel(progression: string): string {
  const labels: Record<string, string> = {
    linear: '线性递进',
    spiral: '螺旋上升',
    hierarchical: '分层学习',
  };
  return labels[progression] || progression;
}

function getStepTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    explanation: '讲解',
    question: '问题',
    activity: '活动',
    assessment: '评估',
  };
  return labels[type] || type;
}

function getStepColor(type: string): string {
  const colors: Record<string, string> = {
    explanation: 'bg-blue-500',
    question: 'bg-yellow-500',
    activity: 'bg-green-500',
    assessment: 'bg-purple-500',
  };
  return colors[type] || 'bg-gray-500';
}

function getStepIcon(type: string): string {
  const icons: Record<string, string> = {
    explanation: '📖',
    question: '❓',
    activity: '✏️',
    assessment: '📝',
  };
  return icons[type] || '📍';
}

// ==================== Standalone Component ====================

interface NarrativeViewerProps {
  narrative: NarrativeComposition;
}

/**
 * 独立的叙事查看器组件
 * 直接接受已生成的叙事数据
 */
export function NarrativeViewer({ narrative }: NarrativeViewerProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
          {getProgressionLabel(narrative.difficultyProgression)}
        </span>
        <span className="text-sm text-gray-500">
          共 {narrative.learningPath.length} 个学习步骤
        </span>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">🎯 学习路径</h3>
        <div className="flex flex-wrap items-center gap-2">
          {narrative.learningPath.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </div>
                <span className="ml-2 px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium">
                  {step}
                </span>
              </div>
              {index < narrative.learningPath.length - 1 && (
                <span className="mx-2 text-purple-300">→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {narrative.connectingStories && narrative.connectingStories.length > 0 && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg shadow-sm border border-purple-200 p-6">
          <h3 className="text-lg font-semibold text-purple-800 mb-4">📖 连接故事</h3>
          <div className="space-y-2 text-gray-700">
            {narrative.connectingStories.map((story, index) => (
              <p key={index}>{story}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
