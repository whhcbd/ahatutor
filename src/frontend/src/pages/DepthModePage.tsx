import { useState, useEffect, useCallback } from 'react';
import { Network, BookOpen, ChevronRight, ChevronDown, CheckCircle, Circle, Play, Loader2, ArrowRight } from 'lucide-react';
import { deepApi } from '@/utils/api';
import type { PrerequisiteNode } from '@shared/types/agent.types';

type Step = 'input' | 'exploring' | 'learning' | 'complete';

interface ConceptNode extends PrerequisiteNode {
  definition?: string;
  principles?: string[];
  examples?: string[];
  isCompleted?: boolean;
}

interface NarrativeSection {
  title: string;
  content: string;
  keyConcepts?: string[];
}

interface LearningPathNode {
  id: string;
  name: string;
  level: number;
  isFoundation: boolean;
  isCompleted: boolean;
}

export default function DepthModePage() {
  const [step, setStep] = useState<Step>('input');
  const [searchQuery, setSearchQuery] = useState('');
  const [isExploring, setIsExploring] = useState(false);
  const [tree, setTree] = useState<ConceptNode | null>(null);
  const [learningPath, setLearningPath] = useState<LearningPathNode[]>([]);
  const [currentNodeIndex, setCurrentNodeIndex] = useState(0);
  const [conceptData, setConceptData] = useState<any>(null);
  const [narrative, setNarrative] = useState<any>(null);
  const [interactiveFlow, setInteractiveFlow] = useState<any>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [completedNodes, setCompletedNodes] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const currentNode = learningPath[currentNodeIndex];

  const toggleNodeExpansion = useCallback((concept: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(concept)) {
        newSet.delete(concept);
      } else {
        newSet.add(concept);
      }
      return newSet;
    });
  }, []);

  const explorePrerequisites = async () => {
    if (!searchQuery.trim()) return;

    setIsExploring(true);
    setError(null);
    try {
      const result = await deepApi.explorePrerequisites(searchQuery, 3);
      setTree(result);

      const path = result.learningPath || [];
      const pathNodes = path.map((name: string, index: number) => {
        const isFoundation = name === result.tree?.isFoundation;
        return {
          id: `node-${index}`,
          name,
          level: index,
          isFoundation,
          isCompleted: false,
        };
      });
      setLearningPath(pathNodes);
      setStep('learning');
      setCurrentNodeIndex(0);
      if (pathNodes.length > 0) {
        loadConceptData(pathNodes[0].name);
        loadInteractiveFlow(pathNodes[0].name);
      }
    } catch (err) {
      console.error('Error exploring prerequisites:', err);
      setError('探索失败，请检查 API 配置');
    } finally {
      setIsExploring(false);
    }
  };

  const loadConceptData = async (concept: string) => {
    try {
      const [conceptAnalysis, enrichment, narrativeData] = await Promise.all([
        deepApi.analyzeConcept(concept),
        deepApi.enrichConcept(concept),
        deepApi.composeNarrative(concept),
      ]);

      setConceptData({
        analysis: conceptAnalysis,
        enrichment,
      });
      setNarrative(narrativeData);
    } catch (err) {
      console.error('Error loading concept data:', err);
    }
  };

  const loadInteractiveFlow = async (concept: string) => {
    try {
      const flow = await deepApi.generateInteractiveFlow(concept);
      setInteractiveFlow(flow);
    } catch (err) {
      console.error('Error loading interactive flow:', err);
    }
  };

  const markNodeComplete = (nodeId: string) => {
    setCompletedNodes((prev) => new Set([...prev, nodeId]));
    setLearningPath((prev) =>
      prev.map((node) =>
        node.id === nodeId ? { ...node, isCompleted: true } : node
      )
    );

    if (currentNodeIndex < learningPath.length - 1) {
      setCurrentNodeIndex((prev) => prev + 1);
      loadConceptData(learningPath[currentNodeIndex + 1].name);
      loadInteractiveFlow(learningPath[currentNodeIndex + 1].name);
    } else {
      setStep('complete');
    }
  };

  const jumpToNode = (index: number) => {
    setCurrentNodeIndex(index);
    loadConceptData(learningPath[index].name);
    loadInteractiveFlow(learningPath[index].name);
  };

  const renderTree = (node: ConceptNode, level: number = 0): JSX.Element => {
    const isExpanded = expandedNodes.has(node.concept);
    const hasChildren = node.prerequisites && node.prerequisites.length > 0;

    return (
      <div key={node.concept} className={`${level > 0 ? 'ml-6 border-l-2 border-purple-200 pl-4' : ''}`}>
        <div
          className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
            completedNodes.has(node.concept)
              ? 'bg-green-50 text-green-700'
              : isExpanded
              ? 'bg-purple-50 text-purple-700'
              : 'hover:bg-gray-50'
          }`}
          onClick={() => hasChildren && toggleNodeExpansion(node.concept)}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )
          ) : null}
          {completedNodes.has(node.concept) ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <Circle className="w-4 h-4" />
          )}
          <span className="font-medium">{node.concept}</span>
          {node.isFoundation && (
            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">基础</span>
          )}
        </div>
        {isExpanded && hasChildren && (
          <div className="mt-1">
            {node.prerequisites!.map((prereq) => renderTree(prereq, level + 1))}
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (tree) {
      const allNodes = new Set<string>();
      const collectNodes = (node: ConceptNode) => {
        allNodes.add(node.concept);
        if (node.prerequisites) {
          node.prerequisites.forEach(collectNodes);
        }
      };
      collectNodes(tree);
      setExpandedNodes(allNodes);
    }
  }, [tree]);

  return (
    <div className="max-w-7xl mx-auto">
      {step === 'input' && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Network className="w-10 h-10 text-purple-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">深度学习模式</h1>
              <p className="text-gray-600">
                系统学习、深度研究、长期规划
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  你想学习什么概念？
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && explorePrerequisites()}
                  placeholder="例如：伴性遗传、孟德尔定律、基因突变..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  disabled={isExploring}
                />
              </div>

              <button
                onClick={explorePrerequisites}
                disabled={isExploring || !searchQuery.trim()}
                className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isExploring ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>探索中...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    <span>开始深度学习</span>
                  </>
                )}
              </button>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
                  {error}
                </div>
              )}
            </div>

            <div className="mt-8 pt-8 border-t border-gray-100">
              <h3 className="font-semibold mb-4">学习特色</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                  <h4 className="font-medium mb-2">反向递归分解</h4>
                  <p className="text-sm text-gray-600">从目标概念逆向追踪前置知识</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
                  <h4 className="font-medium mb-2">渐进式学习路径</h4>
                  <p className="text-sm text-gray-600">从基础到目标的科学学习顺序</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-100">
                  <h4 className="font-medium mb-2">长期记忆巩固</h4>
                  <p className="text-sm text-gray-600">艾宾浩斯遗忘曲线复习计划</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 'exploring' && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
        </div>
      )}

      {step === 'learning' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{currentNode?.name}</h2>
                    <p className="text-sm text-gray-500">
                      学习进度：{currentNodeIndex + 1} / {learningPath.length}
                    </p>
                  </div>
                </div>
                {currentNode?.isFoundation && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                    基础概念
                  </span>
                )}
              </div>

              {conceptData?.enrichment?.definition && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h3 className="font-semibold mb-2">定义</h3>
                  <p className="text-gray-700">{conceptData.enrichment.definition}</p>
                </div>
              )}

              {narrative?.narrative?.sections && (
                <div className="space-y-4">
                  <h3 className="font-semibold">学习内容</h3>
                  {narrative.narrative.sections.map((section: NarrativeSection, index: number) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">{section.title}</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">{section.content}</p>
                      {section.keyConcepts && section.keyConcepts.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {section.keyConcepts.map((concept: string, i: number) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs"
                            >
                              {concept}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {conceptData?.enrichment?.principles && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-3">核心原理</h3>
                  <ul className="space-y-2">
                    {conceptData.enrichment.principles.map((principle: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-purple-600 mt-1">•</span>
                        <span className="text-gray-700">{principle}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {conceptData?.enrichment?.examples && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-3">实例</h3>
                  <div className="space-y-3">
                    {conceptData.enrichment.examples.map((example: any, index: number) => (
                      <div key={index} className="p-4 bg-green-50 rounded-lg border border-green-100">
                        <h4 className="font-medium text-green-800 mb-1">{example.name}</h4>
                        <p className="text-sm text-green-700">{example.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {interactiveFlow?.flow?.steps && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-3">互动学习步骤</h3>
                  <div className="space-y-3">
                    {interactiveFlow.flow.steps.map((stepData: any, index: number) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border ${
                          stepData.type === 'quiz'
                            ? 'bg-orange-50 border-orange-200'
                            : 'bg-blue-50 border-blue-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-6 h-6 flex items-center justify-center bg-white rounded-full text-sm font-medium">
                            {index + 1}
                          </span>
                          <span className="font-medium">{stepData.title}</span>
                        </div>
                        <p className="text-sm text-gray-700">{stepData.instruction}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => markNodeComplete(currentNode?.id || '')}
                  className="flex-1 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>完成学习</span>
                </button>
                {currentNodeIndex < learningPath.length - 1 && (
                  <button
                    onClick={() => jumpToNode(currentNodeIndex + 1)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                  >
                    <span>下一节</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Network className="w-5 h-5 text-purple-600" />
                知识树
              </h3>
              <div className="max-h-[400px] overflow-y-auto">
                {tree && renderTree(tree)}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                学习路径
              </h3>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {learningPath.map((node, index) => (
                  <button
                    key={node.id}
                    onClick={() => jumpToNode(index)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                      index === currentNodeIndex
                        ? 'bg-purple-100 border border-purple-300'
                        : node.isCompleted
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-medium ${
                        node.isCompleted
                          ? 'bg-green-600 text-white'
                          : index === currentNodeIndex
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {node.isCompleted ? '✓' : index + 1}
                    </span>
                    <span className="flex-1 text-sm">{node.name}</span>
                    {node.isFoundation && (
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                        基础
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-lg mb-4">学习进度</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">已完成</span>
                  <span className="font-medium">
                    {completedNodes.size} / {learningPath.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all"
                    style={{ width: `${(completedNodes.size / learningPath.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 'complete' && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">学习完成！</h2>
            <p className="text-gray-600 mb-8">
              恭喜你完成了关于"{searchQuery}"的深度学习之旅。
            </p>
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-3xl font-bold text-purple-600">{learningPath.length}</div>
                  <div className="text-sm text-gray-500">学习节点</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600">{completedNodes.size}</div>
                  <div className="text-sm text-gray-500">已完成</div>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setStep('input');
                setTree(null);
                setLearningPath([]);
                setCompletedNodes(new Set());
                setSearchQuery('');
              }}
              className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              继续学习其他概念
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
