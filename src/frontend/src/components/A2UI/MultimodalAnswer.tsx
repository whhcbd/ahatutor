import React from 'react';
import { VisualizationSuggestion } from '@shared/types/agent.types';
import { MindMapVisualization } from '../Visualization';
import { parseA2UIDirectives, validateMindMapData } from '../../utils/a2ui-parser';
import type { MindMapData } from '../../types/mindmap.types';

export type AnswerMode = 'text' | 'visualization' | 'example' | 'combined';

export interface MultimodalContent {
  text: string;
  visualization?: VisualizationSuggestion;
  examples?: Array<{
    description: string;
    example: string;
  }>;
  explanation?: string;
}

interface MultimodalAnswerProps {
  content: MultimodalContent;
  onVisualizationSelect?: (visualization: VisualizationSuggestion) => void;
}

export function MultimodalAnswer({ content, onVisualizationSelect }: MultimodalAnswerProps) {
  const [activeMode, setActiveMode] = React.useState<AnswerMode>('combined');
  const [mindMapData, setMindMapData] = React.useState<MindMapData | null>(null);

  React.useEffect(() => {
    const { directives } = parseA2UIDirectives(content.text);
    const mindMapDirective = directives.find(d => d.type === 'MINDMAP');
    
    if (mindMapDirective) {
      const validation = validateMindMapData(mindMapDirective.content);
      if (validation.valid) {
        setMindMapData(mindMapDirective.content);
      } else {
        console.error('Invalid mind map data:', validation.errors);
      }
    } else {
      setMindMapData(null);
    }
  }, [content.text]);

  const getAnswerMode = (): AnswerMode => {
    const hasMindMap = mindMapData !== null;
    if (hasMindMap && content.examples && content.examples.length > 0) {
      return 'combined';
    } else if (hasMindMap) {
      return 'visualization';
    } else if (content.examples && content.examples.length > 0) {
      return 'example';
    }
    return 'text';
  };

  const recommendedMode = getAnswerMode();

  const renderTextContent = () => {
    const { directives, cleanedText } = parseA2UIDirectives(content.text);
    const mindMapDirective = directives.find(d => d.type === 'MINDMAP');
    
    return (
      <div className="prose max-w-none">
        {mindMapDirective && validateMindMapData(mindMapDirective.content).valid && (
          <div className="my-6">
            <MindMapVisualization
              data={mindMapDirective.content}
              config={{ width: 800, height: 500 }}
              onNodeClick={(node) => console.log('Node clicked:', node)}
              onNodeHover={(node) => console.log('Node hovered:', node)}
            />
          </div>
        )}
        <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
          {cleanedText}
        </div>
        {content.explanation && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">详细解析</h4>
            <p className="text-blue-800">{content.explanation}</p>
          </div>
        )}
      </div>
    );
  };

  const renderVisualization = () => {
    if (!content.visualization) return null;
    
    return (
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg">{content.visualization.title}</h3>
          <button
            onClick={() => onVisualizationSelect?.(content.visualization!)}
            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
          >
            查看完整可视化
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-3">{content.visualization.description}</p>
        <div className="bg-gray-50 rounded p-4 min-h-[200px] flex items-center justify-center">
          <div className="text-gray-400">可视化预览区域</div>
        </div>
      </div>
    );
  };

  const renderExamples = () => {
    if (!content.examples || content.examples.length === 0) return null;

    return (
      <div className="space-y-4">
        {content.examples.map((example, index) => (
          <div key={index} className="bg-white rounded-lg shadow border border-gray-200 p-4">
            <h4 className="font-semibold text-gray-800 mb-2">示例 {index + 1}</h4>
            <p className="text-sm text-gray-600 mb-3">{example.description}</p>
            <div className="bg-green-50 rounded p-3 border border-green-200">
              <code className="text-green-800">{example.example}</code>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderCombined = () => (
    <div className="space-y-6">
      {renderTextContent()}
      {content.visualization && (
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">可视化说明</h4>
          {renderVisualization()}
        </div>
      )}
      {content.examples && content.examples.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-800 mb-3">实例分析</h4>
          {renderExamples()}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center gap-2 flex-wrap">
        <span className="text-sm text-gray-600">最佳解释方式:</span>
        <button
          onClick={() => setActiveMode('text')}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${
            activeMode === 'text' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          文字解析
        </button>
        <button
          onClick={() => setActiveMode('visualization')}
          disabled={!content.visualization}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${
            activeMode === 'visualization'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } ${!content.visualization ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          可视化
        </button>
        <button
          onClick={() => setActiveMode('example')}
          disabled={!content.examples || content.examples.length === 0}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${
            activeMode === 'example'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } ${!content.examples ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          举例说明
        </button>
        <button
          onClick={() => setActiveMode('combined')}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${
            activeMode === 'combined'
              ? 'bg-purple-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          混合模式
        </button>
        {activeMode !== 'combined' && (
          <span className="text-xs text-gray-500 ml-2">
            (推荐: {recommendedMode === 'combined' ? '混合模式' : recommendedMode})
          </span>
        )}
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        {activeMode === 'text' && renderTextContent()}
        {activeMode === 'visualization' && renderVisualization()}
        {activeMode === 'example' && renderExamples()}
        {activeMode === 'combined' && renderCombined()}
      </div>
    </div>
  );
}

export function useMultimodalAnswer() {
  const selectBestAnswerMode = (content: MultimodalContent): AnswerMode => {
    const hasVisualization = !!content.visualization;
    const hasExamples = !!(content.examples && content.examples.length > 0);

    if (hasVisualization && hasExamples) {
      return 'combined';
    } else if (hasVisualization) {
      return 'visualization';
    } else if (hasExamples) {
      return 'example';
    }
    return 'text';
  };

  const generateMultimodalContent = (
    textAnswer: string,
    visualization?: VisualizationSuggestion,
    examples?: Array<{ description: string; example: string }>
  ): MultimodalContent => ({
    text: textAnswer,
    visualization,
    examples,
  });

  return {
    selectBestAnswerMode,
    generateMultimodalContent,
  };
}
