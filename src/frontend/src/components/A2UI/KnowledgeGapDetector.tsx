export interface KnowledgeGap {
  id: string;
  concept: string;
  type: 'missing' | 'weak' | 'misunderstanding';
  severity: 'low' | 'medium' | 'high';
  description: string;
  suggestedTopics: string[];
  recommendedAction: 'review' | 'learn' | 'practice';
}

interface KnowledgeGapDetectorProps {
  gaps: KnowledgeGap[];
  onSelectGap?: (gap: KnowledgeGap) => void;
  onDismissGap?: (gapId: string) => void;
}

export function KnowledgeGapDetector({ 
  gaps, 
  onSelectGap,
  onDismissGap 
}: KnowledgeGapDetectorProps) {
  const getSeverityColor = (severity: KnowledgeGap['severity']) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getTypeLabel = (type: KnowledgeGap['type']) => {
    switch (type) {
      case 'missing':
        return '知识缺失';
      case 'weak':
        return '掌握薄弱';
      case 'misunderstanding':
        return '理解偏差';
    }
  };

  const getActionLabel = (action: KnowledgeGap['recommendedAction']) => {
    switch (action) {
      case 'review':
        return '复习';
      case 'learn':
        return '学习';
      case 'practice':
        return '练习';
    }
  };

  const getActionButtonStyle = (action: KnowledgeGap['recommendedAction']) => {
    switch (action) {
      case 'review':
        return 'bg-purple-500 hover:bg-purple-600 text-white';
      case 'learn':
        return 'bg-blue-500 hover:bg-blue-600 text-white';
      case 'practice':
        return 'bg-green-500 hover:bg-green-600 text-white';
    }
  };

  const sortedGaps = [...gaps].sort((a, b) => {
    const severityOrder = { high: 0, medium: 1, low: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });

  if (gaps.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          知识缺口分析
        </h3>
        <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
          {gaps.length} 个缺口
        </span>
      </div>

      <div className="space-y-3">
        {sortedGaps.map((gap) => (
          <div 
            key={gap.id}
            className={`p-4 rounded-lg border transition-all ${
              gap.severity === 'high' 
                ? 'bg-red-50 border-red-200' 
                : gap.severity === 'medium'
                ? 'bg-yellow-50 border-yellow-200'
                : 'bg-blue-50 border-blue-200'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-gray-800">{gap.concept}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(gap.severity)}`}>
                    {gap.severity === 'high' ? '高' : gap.severity === 'medium' ? '中' : '低'}
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {getTypeLabel(gap.type)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{gap.description}</p>
                
                {gap.suggestedTopics.length > 0 && (
                  <div className="mb-3">
                    <span className="text-xs text-gray-500 mb-1 block">建议学习:</span>
                    <div className="flex flex-wrap gap-1">
                      {gap.suggestedTopics.map((topic, index) => (
                        <button
                          key={index}
                          onClick={() => onSelectGap?.(gap)}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 transition-colors"
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => onSelectGap?.(gap)}
                  className={`px-3 py-2 rounded text-sm font-medium transition-colors ${getActionButtonStyle(gap.recommendedAction)}`}
                >
                  {getActionLabel(gap.recommendedAction)}
                </button>
                <button
                  onClick={() => onDismissGap?.(gap.id)}
                  className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  忽略
                </button>
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
            识别知识缺口有助于个性化学习路径，建议优先处理高优先级的缺口。
          </p>
        </div>
      </div>
    </div>
  );
}

export function useKnowledgeGapDetector() {
  const detectKnowledgeGaps = (
    userAnswers: Array<{ question: string; isCorrect: boolean; confidence?: number }>,
    currentTopic: string,
    relatedTopics: string[],
    masteryLevels: Record<string, number>
  ): KnowledgeGap[] => {
    const gaps: KnowledgeGap[] = [];

    const incorrectAnswers = userAnswers.filter(a => !a.isCorrect);
    const lowConfidenceAnswers = userAnswers.filter(a => (a.confidence || 0) < 0.5);

    if (incorrectAnswers.length > 0) {
      gaps.push({
        id: `incorrect-${Date.now()}`,
        concept: currentTopic,
        type: 'misunderstanding',
        severity: incorrectAnswers.length > 2 ? 'high' : 'medium',
        description: `在 ${currentTopic} 相关问题中回答错误 ${incorrectAnswers.length} 次`,
        suggestedTopics: [currentTopic, ...relatedTopics.slice(0, 2)],
        recommendedAction: 'review',
      });
    }

    if (lowConfidenceAnswers.length > 0) {
      gaps.push({
        id: `confidence-${Date.now()}`,
        concept: currentTopic,
        type: 'weak',
        severity: lowConfidenceAnswers.length > 2 ? 'high' : 'medium',
        description: `在 ${currentTopic} 相关问题中信心不足 ${lowConfidenceAnswers.length} 次`,
        suggestedTopics: [currentTopic],
        recommendedAction: 'practice',
      });
    }

    const lowMasteryTopics = relatedTopics.filter(topic => {
      const mastery = masteryLevels[topic];
      return mastery !== undefined && mastery < 50;
    });

    lowMasteryTopics.forEach(topic => {
      gaps.push({
        id: `mastery-${topic}-${Date.now()}`,
        concept: topic,
        type: 'missing',
        severity: masteryLevels[topic] < 20 ? 'high' : 'medium',
        description: `${topic} 的掌握度为 ${masteryLevels[topic]}%，需要补充学习`,
        suggestedTopics: [topic],
        recommendedAction: 'learn',
      });
    });

    return gaps;
  };

  const prioritizeGaps = (gaps: KnowledgeGap[]): KnowledgeGap[] => {
    const typePriority = { missing: 1, weak: 2, misunderstanding: 3 };
    const severityPriority = { high: 1, medium: 2, low: 3 };

    return gaps.sort((a, b) => {
      const severityDiff = severityPriority[a.severity] - severityPriority[b.severity];
      if (severityDiff !== 0) return severityDiff;

      const typeDiff = typePriority[a.type] - typePriority[b.type];
      if (typeDiff !== 0) return typeDiff;

      return 0;
    });
  };

  const recommendLearningPath = (gaps: KnowledgeGap[]): string[] => {
    const sortedGaps = prioritizeGaps(gaps);
    const path: string[] = [];
    const seen = new Set<string>();

    for (const gap of sortedGaps) {
      for (const topic of gap.suggestedTopics) {
        if (!seen.has(topic)) {
          path.push(topic);
          seen.add(topic);
        }
      }
    }

    return path;
  };

  return {
    detectKnowledgeGaps,
    prioritizeGaps,
    recommendLearningPath,
  };
}
