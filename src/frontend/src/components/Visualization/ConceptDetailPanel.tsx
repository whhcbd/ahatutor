import { GraphNode } from './KnowledgeGraph';

interface ConceptDetailPanelProps {
  node: GraphNode | null;
  onClose?: () => void;
  onJumpToVisualization?: (concept: string) => void;
  relatedConcepts?: string[];
}

export function ConceptDetailPanel({ node, onClose, onJumpToVisualization, relatedConcepts = [] }: ConceptDetailPanelProps) {
  if (!node) return null;

  return (
    <div className="absolute top-4 right-4 bg-white p-5 rounded-lg shadow-lg border border-gray-200 max-w-sm w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-lg">{node.name}</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-lg"
          >
            ✕
          </button>
        )}
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-gray-600 w-20">类型:</span>
          <span className="font-medium">{node.type}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-600 w-20">等级:</span>
          <span className="font-medium">{node.level}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-gray-600 w-20">掌握度:</span>
          <div className="flex-1 flex items-center gap-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full"
                style={{
                  width: `${node.mastery}%`,
                  backgroundColor: node.mastery >= 80 ? '#4ade80' : 
                                 node.mastery >= 50 ? '#fbbf24' : 
                                 node.mastery >= 20 ? '#fb923c' : '#f87171'
                }}
              />
            </div>
            <span className="font-medium w-12 text-right">{node.mastery}%</span>
          </div>
        </div>

        {relatedConcepts.length > 0 && (
          <div>
            <div className="text-gray-600 mb-2">相关概念:</div>
            <div className="flex flex-wrap gap-1">
              {relatedConcepts.map((concept, index) => (
                <button
                  key={index}
                  onClick={() => onJumpToVisualization?.(concept)}
                  className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 transition-colors"
                >
                  {concept}
                </button>
              ))}
            </div>
          </div>
        )}

        {onJumpToVisualization && (
          <button
            onClick={() => onJumpToVisualization(node.name)}
            className="w-full mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            跳转到可视化
          </button>
        )}
      </div>
    </div>
  );
}
