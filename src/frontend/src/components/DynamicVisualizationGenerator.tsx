import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { agentApi } from '../api/agent';

interface DynamicVisualizationGeneratorProps {
  question: string;
  concept?: string;
}

export const DynamicVisualizationGenerator: React.FC<DynamicVisualizationGeneratorProps> = ({
  question,
  concept
}) => {
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLevel, setUserLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await agentApi.designVisualization(
        question,
        {
          includeEnrichment: true,
          includePrerequisites: true
        }
      );
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败');
      console.error('动态可视化生成失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  if (!response) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">动态可视化生成</h3>
          
          <div>
            <label className="block text-sm font-medium mb-2">用户水平</label>
            <select
              value={userLevel}
              onChange={(e) => setUserLevel(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="beginner">初学者</option>
              <option value="intermediate">中级</option>
              <option value="advanced">高级</option>
            </select>
          </div>

          <div className="bg-blue-50 p-4 rounded-md">
            <p className="text-sm text-gray-700">
              <strong>问题：</strong> {question}
            </p>
            {concept && (
              <p className="text-sm text-gray-700 mt-2">
                <strong>概念：</strong> {concept}
              </p>
            )}
          </div>

          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full"
          >
            {loading ? '生成中...' : '生成动态可视化'}
          </Button>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md">
              {error}
            </div>
          )}
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">动态可视化生成结果</h3>
          <Button
            onClick={handleRegenerate}
            disabled={loading}
            variant="secondary"
            size="sm"
          >
            {loading ? '生成中...' : '重新生成'}
          </Button>
        </div>

        <div className="mb-4">
          <span className={`px-3 py-1 rounded-full text-sm ${
            response.visualizationApplicable
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {response.visualizationApplicable ? '✓ 适合可视化' : 'ℹ 文本回答'}
          </span>
          <p className="text-sm text-gray-600 mt-2">{response.applicableReason}</p>
        </div>

        {response.selectedTemplate && (
          <div className="bg-blue-50 p-3 rounded-md mb-4">
            <p className="text-sm font-medium">选择模板：{response.selectedTemplate.templateId}</p>
            <p className="text-sm text-gray-600">{response.selectedTemplate.reason}</p>
          </div>
        )}
      </Card>

      {response.textAnswer && (
        <Card className="p-6">
          <h4 className="font-semibold mb-3">💡 核心回答</h4>
          <div className="prose max-w-none">
            <p>{response.textAnswer.mainAnswer}</p>
            
            {response.textAnswer.keyPoints && response.textAnswer.keyPoints.length > 0 && (
              <div className="mt-4">
                <h5 className="font-medium mb-2">关键要点：</h5>
                <ul className="list-disc pl-5 space-y-1">
                  {response.textAnswer.keyPoints.map((point: string, index: number) => (
                    <li key={index} className="text-sm">{point}</li>
                  ))}
                </ul>
              </div>
            )}

            {response.textAnswer.examples && response.textAnswer.examples.length > 0 && (
              <div className="mt-4">
                <h5 className="font-medium mb-2">举例说明：</h5>
                <ul className="list-disc pl-5 space-y-1">
                  {response.textAnswer.examples.map((example: string, index: number) => (
                    <li key={index} className="text-sm">{example}</li>
                  ))}
                </ul>
              </div>
            )}

            {response.textAnswer.commonMistakes && response.textAnswer.commonMistakes.length > 0 && (
              <div className="mt-4 bg-yellow-50 p-3 rounded-md">
                <h5 className="font-medium mb-2 text-yellow-800">⚠️ 常见错误：</h5>
                <ul className="list-disc pl-5 space-y-1">
                  {response.textAnswer.commonMistakes.map((mistake: string, index: number) => (
                    <li key={index} className="text-sm text-yellow-700">{mistake}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Card>
      )}

      {response.visualizationApplicable && response.visualizationData && (
        <Card className="p-6">
          <h4 className="font-semibold mb-3">📊 动态可视化</h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium mb-2">{response.visualizationData.title || '可视化图表'}</p>
            {response.visualizationData.description && (
              <p className="text-sm text-gray-600 mb-4">{response.visualizationData.description}</p>
            )}
            
            <div className="bg-white rounded border border-gray-200 p-4 min-h-[300px] flex items-center justify-center">
              <p className="text-gray-400 text-sm">
                可视化组件渲染区域
                <br />
                <span className="text-xs">类型: {response.visualizationData.type}</span>
              </p>
            </div>
          </div>
        </Card>
      )}

      {response.educationalAids && (
        <Card className="p-6">
          <h4 className="font-semibold mb-3">🎓 学习辅助</h4>
          
          {response.educationalAids.keyPoints && response.educationalAids.keyPoints.length > 0 && (
            <div className="mb-4">
              <h5 className="font-medium mb-2">学习要点：</h5>
              <ul className="list-disc pl-5 space-y-1">
                {response.educationalAids.keyPoints.map((point: string, index: number) => (
                  <li key={index} className="text-sm">{point}</li>
                ))}
              </ul>
            </div>
          )}

          {response.educationalAids.visualConnection && (
            <div className="mb-4">
              <h5 className="font-medium mb-2">👁️ 可视化理解：</h5>
              <p className="text-sm text-gray-700">{response.educationalAids.visualConnection}</p>
            </div>
          )}

          {response.educationalAids.thinkingProcess && response.educationalAids.thinkingProcess.length > 0 && (
            <div className="mb-4">
              <h5 className="font-medium mb-2">💭 思考过程：</h5>
              <ol className="list-decimal pl-5 space-y-1">
                {response.educationalAids.thinkingProcess.map((step: string, index: number) => (
                  <li key={index} className="text-sm">{step}</li>
                ))}
              </ol>
            </div>
          )}

          {response.educationalAids.commonMistakes && response.educationalAids.commonMistakes.length > 0 && (
            <div className="bg-yellow-50 p-3 rounded-md">
              <h5 className="font-medium mb-2 text-yellow-800">⚠️ 常见错误：</h5>
              <ul className="list-disc pl-5 space-y-1">
                {response.educationalAids.commonMistakes.map((mistake: string, index: number) => (
                  <li key={index} className="text-sm text-yellow-700">{mistake}</li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      )}

      {response.citations && response.citations.length > 0 && (
        <Card className="p-6">
          <h4 className="font-semibold mb-3">📚 参考来源</h4>
          <ul className="space-y-2">
            {response.citations.map((citation: any, index: number) => (
              <li key={index} className="text-sm">
                <span className="font-medium">[{index + 1}]</span> {citation.chapter} - {citation.section}
                <p className="text-gray-600 mt-1 truncate">{citation.content}</p>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
};
