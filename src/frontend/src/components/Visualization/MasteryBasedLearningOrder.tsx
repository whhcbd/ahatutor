import React, { useMemo } from 'react';
import { GraphNode, GraphEdge } from './KnowledgeGraph';
import { getMasteryColor } from '../../constants/visualization-colors';

export interface LearningOrderItem {
  id: string;
  name: string;
  type: string;
  mastery: number;
  level: number;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: number;
  prerequisites: string[];
}

interface MasteryBasedLearningOrderProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  currentTopic?: string;
  onSelectTopic?: (topicId: string) => void;
  onStartLearning?: (topicId: string) => void;
}

export function MasteryBasedLearningOrder({ 
  nodes, 
  edges,
  currentTopic,
  onSelectTopic,
  onStartLearning 
}: MasteryBasedLearningOrderProps) {
  const learningOrder = useMemo(() => {
    return calculateLearningOrder(nodes, edges, currentTopic);
  }, [nodes, edges, currentTopic]);

  const getPriorityColor = (priority: LearningOrderItem['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getPriorityLabel = (priority: LearningOrderItem['priority']) => {
    switch (priority) {
      case 'high':
        return '高优先级';
      case 'medium':
        return '中优先级';
      case 'low':
        return '低优先级';
    }
  };

  const getActionLabel = (mastery: number) => {
    if (mastery < 20) return '开始学习';
    if (mastery < 50) return '继续学习';
    if (mastery < 80) return '强化练习';
    return '复习巩固';
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          基于掌握度的学习顺序
        </h3>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
            {learningOrder.length} 个知识点
          </span>
          {currentTopic && (
            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
              当前: {currentTopic}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {learningOrder.map((item, index) => (
          <div 
            key={item.id}
            className={`p-4 rounded-lg border transition-all ${
              item.id === currentTopic
                ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-100'
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: getMasteryColor(item.mastery) }}>
                  {index + 1}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-gray-800">{item.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                    {getPriorityLabel(item.priority)}
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    等级 {item.level}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">掌握度:</span>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full"
                        style={{
                          width: `${item.mastery}%`,
                          backgroundColor: getMasteryColor(item.mastery)
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium ml-2">{item.mastery}%</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    预计 {item.estimatedTime} 分钟
                  </div>
                </div>

                {item.prerequisites.length > 0 && (
                  <div className="mb-3">
                    <span className="text-xs text-gray-500 mb-1 block">前置知识:</span>
                    <div className="flex flex-wrap gap-1">
                      {item.prerequisites.map((prereq, idx) => {
                        const prereqNode = nodes.find(n => n.id === prereq);
                        return (
                          <button
                            key={idx}
                            onClick={() => onSelectTopic?.(prereq)}
                            className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs hover:bg-purple-100 transition-colors"
                          >
                            {prereqNode?.name || prereq}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => onStartLearning?.(item.id)}
                    className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                      item.mastery < 50
                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                        : item.mastery < 80
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-gray-500 hover:bg-gray-600 text-white'
                    }`}
                  >
                    {getActionLabel(item.mastery)}
                  </button>
                  {item.id !== currentTopic && (
                    <button
                      onClick={() => onSelectTopic?.(item.id)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                      查看详情
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-2">
          <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-blue-800">
            学习顺序基于当前掌握度动态计算，优先推荐掌握度较低且前置知识已满足的知识点。
          </p>
        </div>
      </div>
    </div>
  );
}

export function calculateLearningOrder(
  nodes: GraphNode[],
  edges: GraphEdge[],
  currentTopic?: string
): LearningOrderItem[] {
  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  const adjacencyList = new Map<string, string[]>();

  nodes.forEach(node => {
    adjacencyList.set(node.id, []);
  });

  edges.forEach(edge => {
    const sourceId = typeof edge.source === 'string' ? edge.source : edge.source.id;
    const targetId = typeof edge.target === 'string' ? edge.target : edge.target.id;
    
    adjacencyList.get(targetId)?.push(sourceId);
  });

  const getPrerequisites = (nodeId: string): string[] => {
    return adjacencyList.get(nodeId) || [];
  };

  const arePrerequisitesSatisfied = (nodeId: string, completed: Set<string>): boolean => {
    const prereqs = getPrerequisites(nodeId);
    return prereqs.every(prereq => completed.has(prereq));
  };

  const calculatePriority = (node: GraphNode, completed: Set<string>): 'high' | 'medium' | 'low' => {
    if (!arePrerequisitesSatisfied(node.id, completed)) {
      return 'low';
    }

    if (node.mastery < 30) {
      return 'high';
    } else if (node.mastery < 60) {
      return 'medium';
    }
    return 'low';
  };

  const calculateEstimatedTime = (node: GraphNode): number => {
    const baseTime = 30;
    const masteryFactor = (100 - node.mastery) / 100;
    const levelFactor = node.level * 0.5;
    return Math.round(baseTime * masteryFactor + levelFactor * 5);
  };

  const sorted: LearningOrderItem[] = [];
  const completed = new Set<string>();
  const remaining = new Set(nodes.map(n => n.id));

  while (remaining.size > 0) {
    const available = [...remaining].filter(id => arePrerequisitesSatisfied(id, completed));

    if (available.length === 0) {
      available.push(...remaining);
    }

    available.sort((a, b) => {
      const nodeA = nodeMap.get(a)!;
      const nodeB = nodeMap.get(b)!;

      const priorityA = calculatePriority(nodeA, completed);
      const priorityB = calculatePriority(nodeB, completed);

      const priorityOrder = { high: 1, medium: 2, low: 3 };
      if (priorityOrder[priorityA] !== priorityOrder[priorityB]) {
        return priorityOrder[priorityA] - priorityOrder[priorityB];
      }

      if (nodeA.mastery !== nodeB.mastery) {
        return nodeA.mastery - nodeB.mastery;
      }

      return nodeA.level - nodeB.level;
    });

    const nextNodeId = available[0];
    const nextNode = nodeMap.get(nextNodeId)!;

    sorted.push({
      id: nextNode.id,
      name: nextNode.name,
      type: nextNode.type,
      mastery: nextNode.mastery,
      level: nextNode.level,
      priority: calculatePriority(nextNode, completed),
      estimatedTime: calculateEstimatedTime(nextNode),
      prerequisites: getPrerequisites(nextNode.id),
    });

    completed.add(nextNodeId);
    remaining.delete(nextNodeId);
  }

  return sorted;
}

export function useMasteryBasedLearningOrder() {
  const updateLearningOrder = (
    nodes: GraphNode[],
    edges: GraphEdge[],
    currentTopic?: string
  ): LearningOrderItem[] => {
    return calculateLearningOrder(nodes, edges, currentTopic);
  };

  const getRecommendations = (order: LearningOrderItem[], limit = 5): LearningOrderItem[] => {
    return order
      .filter(item => item.priority === 'high')
      .slice(0, limit);
  };

  return {
    calculateLearningOrder,
    updateLearningOrder,
    getRecommendations,
  };
}
