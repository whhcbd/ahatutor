import { useState } from 'react';
import { UnderstandingInsight } from '@shared/types/agent.types';
import { Lightbulb, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';

interface UnderstandingInsightsProps {
  insights: UnderstandingInsight[];
}

/**
 * 理解提示组件
 * 帮助用户从可视化中学习，提供关键知识点、常见错误理解等
 */
export function UnderstandingInsights({ insights }: UnderstandingInsightsProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [revealedAnswers, setRevealedAnswers] = useState<Set<number>>(new Set());

  if (!insights || insights.length === 0) {
    return null;
  }

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const revealAnswer = (index: number) => {
    setRevealedAnswers((prev) => new Set(prev).add(index));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
        <Lightbulb className="w-5 h-5 text-yellow-500" />
        <span>理解提示</span>
      </div>

      <div className="space-y-3">
        {insights.map((insight, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden"
          >
            {/* 可展开的头部 */}
            <button
              onClick={() => toggleExpand(index)}
              className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <span className="font-medium text-gray-800 text-left">
                  {insight.keyPoint}
                </span>
              </div>
              {expandedIndex === index ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {/* 展开内容 */}
            {expandedIndex === index && (
              <div className="px-4 py-3 bg-white space-y-3">
                {/* 可视化连接 */}
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">
                      如何理解
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {insight.visualConnection}
                    </p>
                  </div>
                </div>

                {/* 常见错误 */}
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">
                      常见误解
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {insight.commonMistake}
                    </p>
                  </div>
                </div>

                {/* 自检问题 */}
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-blue-800 mb-1">
                        自检问题
                      </div>
                      <p className="text-sm text-blue-700 mb-2">
                        {insight.checkQuestion}
                      </p>
                      {!revealedAnswers.has(index) && (
                        <button
                          onClick={() => revealAnswer(index)}
                          className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                        >
                          显示提示
                        </button>
                      )}
                      {revealedAnswers.has(index) && (
                        <div className="flex items-center gap-2 text-sm text-green-700">
                          <CheckCircle className="w-4 h-4" />
                          <span>
                            试着回顾上方的可视化，找到支持答案的证据
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 全部展开/收起按钮 */}
      <div className="flex justify-center pt-2">
        <button
          onClick={() =>
            setExpandedIndex(expandedIndex === null ? 0 : null)
          }
          className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
        >
          {expandedIndex === null ? '展开全部提示' : '收起全部提示'}
        </button>
      </div>
    </div>
  );
}

/**
 * 紧凑版理解提示组件（用于侧边栏或卡片）
 */
export function UnderstandingInsightsCompact({ insights }: UnderstandingInsightsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!insights || insights.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
        <Lightbulb className="w-4 h-4 text-yellow-500" />
        <span>关键理解</span>
      </div>

      {/* 标签导航 */}
      <div className="flex flex-wrap gap-2">
        {insights.map((insight, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              activeIndex === index
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {insight.keyPoint}
          </button>
        ))}
      </div>

      {/* 活动内容 */}
      {insights[activeIndex] && (
        <div className="text-sm space-y-2">
          <p className="text-gray-700">{insights[activeIndex].visualConnection}</p>
          <p className="text-red-600 text-xs">
            避免：{insights[activeIndex].commonMistake}
          </p>
        </div>
      )}
    </div>
  );
}
