import React from 'react';
import { GraphNode, GraphEdge } from '../visualization/KnowledgeGraph';

export interface PathNode {
  id: string;
  name: string;
  type: string;
  mastery: number;
  level: number;
  estimatedTime?: number;
}

export interface LearningPath {
  id: string;
  name: string;
  description: string;
  nodes: PathNode[];
  totalEstimatedTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  completionPercentage: number;
}

interface LearningPathRecommenderProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  startNodeId?: string;
  targetNodeId?: string;
  onSelectPath?: (path: LearningPath) => void;
  onStartNode?: (nodeId: string) => void;
}

export function LearningPathRecommender({ 
  nodes, 
  edges,
  startNodeId,
  targetNodeId,
  onSelectPath,
  onStartNode
}: LearningPathRecommenderProps) {
  const [recommendedPaths, setRecommendedPaths] = React.useState<LearningPath[]>([]);

  React.useEffect(() => {
    const paths = generateLearningPaths(nodes, edges, startNodeId, targetNodeId);
    setRecommendedPaths(paths);
  }, [nodes, edges, startNodeId, targetNodeId]);

  const getDifficultyColor = (difficulty: LearningPath['difficulty']) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  const getDifficultyLabel = (difficulty: LearningPath['difficulty']) => {
    switch (difficulty) {
      case 'beginner':
        return '入门';
      case 'intermediate':
        return '进阶';
      case 'advanced':
        return '高级';
    }
  };

  const getMasteryColor = (mastery: number) => {
    if (mastery >= 80) return 'text-green-600';
    if (mastery >= 50) return 'text-yellow-600';
    if (mastery >= 20) return 'text-orange-600';
    return 'text-red-600';
  };

  const renderPathNodes = (path: LearningPath) => (
    <div className="flex items-center gap-2 overflow-x-auto py-2">
      {path.nodes.map((node, index) => (
        <React.Fragment key={node.id}>
          <div 
            className={`flex-shrink-0 p-3 rounded-lg border ${
              node.mastery >= 80 
                ? 'bg-green-50 border-green-200' 
                : node.mastery >= 50 
                ? 'bg-yellow-50 border-yellow-200'
                : 'bg-red-50 border-red-200'
            }`}
            onClick={() => onStartNode?.(node.id)}
            style={{ cursor: 'pointer' }}
          >
            <div className="font-medium text-sm">{node.name}</div>
            <div className={`text-xs mt-1 ${getMasteryColor(node.mastery)}`}>
              掌握度: {node.mastery}%
            </div>
            {node.estimatedTime && (
              <div className="text-xs text-gray-500 mt-1">
                {node.estimatedTime} 分钟
              </div>
            )}
          </div>
          {index < path.nodes.length - 1 && (
            <svg className="w-6 h-6 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          学习路径推荐
        </h3>
        <div className="flex items-center gap-2">
          {startNodeId && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
              起点: {nodes.find(n => n.id === startNodeId)?.name}
            </span>
          )}
          {targetNodeId && (
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
              目标: {nodes.find(n => n.id === targetNodeId)?.name}
            </span>
          )}
        </div>
      </div>

      {recommendedPaths.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p>暂无推荐的学习路径</p>
          <p className="text-sm mt-1">请选择起始节点或目标节点</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recommendedPaths.map((path) => (
            <div 
              key={path.id}
              className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                path.difficulty === 'beginner' 
                  ? 'bg-green-50 border-green-200' 
                  : path.difficulty === 'intermediate'
                  ? 'bg-yellow-50 border-yellow-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">{path.name}</h4>
                  <p className="text-sm text-gray-600">{path.description}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(path.difficulty)}`}>
                    {getDifficultyLabel(path.difficulty)}
                  </span>
                  <span className="text-sm text-gray-500">
                    预计 {path.totalEstimatedTime} 分钟
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">完成进度</span>
                  <span className="font-medium">{path.completionPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${path.completionPercentage}%`,
                      backgroundColor: path.completionPercentage >= 80 ? '#4ade80' :
                                     path.completionPercentage >= 50 ? '#fbbf24' : '#f87171'
                    }}
                  />
                </div>
              </div>

              {renderPathNodes(path)}

              <button
                onClick={() => onSelectPath?.(path)}
                className="mt-3 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors font-medium"
              >
                开始学习此路径
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function useLearningPathRecommender() {
  const findShortestPath = (
    nodes: GraphNode[],
    edges: GraphEdge[],
    startId: string,
    endId: string
  ): GraphNode[] | null => {
    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    const adjList = new Map<string, Array<{ id: string; weight: number }>>();

    nodes.forEach(node => {
      adjList.set(node.id, []);
    });

    edges.forEach(edge => {
      const sourceId = typeof edge.source === 'string' ? edge.source : edge.source.id;
      const targetId = typeof edge.target === 'string' ? edge.target : edge.target.id;

      if (edge.bidirectional) {
        adjList.get(sourceId)?.push({ id: targetId, weight: edge.weight });
        adjList.get(targetId)?.push({ id: sourceId, weight: edge.weight });
      } else {
        adjList.get(sourceId)?.push({ id: targetId, weight: edge.weight });
      }
    });

    const distances = new Map<string, number>();
    const previous = new Map<string, string | null>();
    const visited = new Set<string>();

    nodes.forEach(node => {
      distances.set(node.id, Infinity);
      previous.set(node.id, null);
    });

    distances.set(startId, 0);

    while (visited.size < nodes.length) {
      const current = [...distances.entries()]
        .filter(([id]) => !visited.has(id))
        .sort(([, a], [, b]) => a - b)[0];

      if (!current) break;
      if (current[1] === Infinity) break;

      const [currentId] = current;
      visited.add(currentId);

      if (currentId === endId) break;

      const neighbors = adjList.get(currentId) || [];
      for (const neighbor of neighbors) {
        const alt = current[1] + neighbor.weight;
        if (alt < (distances.get(neighbor.id) || Infinity)) {
          distances.set(neighbor.id, alt);
          previous.set(neighbor.id, currentId);
        }
      }
    }

    if (!previous.get(endId)) return null;

    const path: GraphNode[] = [];
    let current = endId;
    while (current !== null) {
      const node = nodeMap.get(current);
      if (node) path.unshift(node);
      current = previous.get(current) || '';
    }

    return path;
  };

  const generateLearningPaths = (
    nodes: GraphNode[],
    edges: GraphEdge[],
    startNodeId?: string,
    targetNodeId?: string
  ): LearningPath[] => {
    const paths: LearningPath[] = [];

    if (startNodeId && targetNodeId) {
      const shortestPath = findShortestPath(nodes, edges, startNodeId, targetNodeId);
      if (shortestPath) {
        paths.push(createLearningPath('最短路径', '基于知识图谱的最短学习路径', shortestPath, nodes));
      }
    }

    const lowMasteryNodes = nodes.filter(n => n.mastery < 50).sort((a, b) => a.mastery - b.mastery);
    if (lowMasteryNodes.length > 0) {
      const reviewPath = createLearningPath(
        '复习路径',
        '针对掌握度较低的知识点进行强化复习',
        lowMasteryNodes.slice(0, 5),
        nodes
      );
      paths.push(reviewPath);
    }

    const recommendedPath = nodes
      .filter(n => n.mastery >= 50 && n.mastery < 80)
      .sort((a, b) => a.level - b.level);

    if (recommendedPath.length > 0) {
      paths.push(createLearningPath(
        '推荐路径',
        '根据当前学习状态推荐的渐进式学习路径',
        recommendedPath.slice(0, 5),
        nodes
      ));
    }

    return paths;
  };

  const createLearningPath = (
    name: string,
    description: string,
    pathNodes: GraphNode[],
    allNodes: GraphNode[]
  ): LearningPath => {
    const nodes: PathNode[] = pathNodes.map(node => ({
      id: node.id,
      name: node.name,
      type: node.type,
      mastery: node.mastery,
      level: node.level,
      estimatedTime: Math.max(5, (100 - node.mastery) / 10),
    }));

    const totalEstimatedTime = nodes.reduce((sum, n) => sum + (n.estimatedTime || 0), 0);
    const avgMastery = nodes.reduce((sum, n) => sum + n.mastery, 0) / nodes.length;
    const avgLevel = nodes.reduce((sum, n) => sum + n.level, 0) / nodes.length;

    const difficulty: LearningPath['difficulty'] = avgLevel < 2 ? 'beginner' : avgLevel < 4 ? 'intermediate' : 'advanced';
    const completionPercentage = Math.round(avgMastery);

    return {
      id: `path-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      nodes,
      totalEstimatedTime,
      difficulty,
      completionPercentage,
    };
  };

  return {
    generateLearningPaths,
    findShortestPath,
    createLearningPath,
  };
}
