import { useState } from 'react';

export interface FollowUpQuestion {
  id: string;
  question: string;
  category: 'deepen' | 'related' | 'application';
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface FollowUpQuestionsProps {
  questions: FollowUpQuestion[];
  onSelectQuestion?: (question: string) => void;
  maxQuestions?: number;
}

export function FollowUpQuestions({ 
  questions, 
  onSelectQuestion,
  maxQuestions = 3 
}: FollowUpQuestionsProps) {
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);

  const displayedQuestions = questions.slice(0, maxQuestions);

  const getCategoryColor = (category: FollowUpQuestion['category']) => {
    switch (category) {
      case 'deepen':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'related':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'application':
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getCategoryLabel = (category: FollowUpQuestion['category']) => {
    switch (category) {
      case 'deepen':
        return '深入理解';
      case 'related':
        return '相关知识';
      case 'application':
        return '实际应用';
    }
  };

  const getDifficultyLabel = (difficulty?: FollowUpQuestion['difficulty']) => {
    if (!difficulty) return '';
    switch (difficulty) {
      case 'easy':
        return '简单';
      case 'medium':
        return '中等';
      case 'hard':
        return '困难';
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        推荐追问
      </h3>
      <div className="space-y-3">
        {displayedQuestions.map((item, index) => (
          <button
            key={item.id}
            onClick={() => {
              setSelectedQuestion(item.question);
              onSelectQuestion?.(item.question);
            }}
            className={`w-full text-left p-4 rounded-lg border transition-all ${
              selectedQuestion === item.question
                ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-200'
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-gray-800 font-medium mb-2">
                  {index + 1}. {item.question}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                    {getCategoryLabel(item.category)}
                  </span>
                  {item.difficulty && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      {getDifficultyLabel(item.difficulty)}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex-shrink-0">
                <svg 
                  className={`w-5 h-5 transition-colors ${
                    selectedQuestion === item.question ? 'text-blue-500' : 'text-gray-400'
                  }`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>
      {questions.length > maxQuestions && (
        <button 
          className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          查看更多问题 ({questions.length - maxQuestions})
        </button>
      )}
    </div>
  );
}

export function useFollowUpQuestions() {
  const generateFollowUpQuestions = (
    currentQuestion: string,
    topic: string,
    userLevel?: 'beginner' | 'intermediate' | 'advanced'
  ): FollowUpQuestion[] => {
    const baseQuestions: FollowUpQuestion[] = [
      {
        id: 'deepen-1',
        question: `为什么${topic}的${currentQuestion}会有这样的表现？`,
        category: 'deepen',
        difficulty: userLevel === 'beginner' ? 'easy' : 'medium',
      },
      {
        id: 'related-1',
        question: `${topic}与其他相关概念有什么区别和联系？`,
        category: 'related',
        difficulty: 'medium',
      },
      {
        id: 'application-1',
        question: `在实际问题中如何应用${topic}的${currentQuestion}？`,
        category: 'application',
        difficulty: userLevel === 'advanced' ? 'hard' : 'medium',
      },
    ];

    if (userLevel === 'beginner') {
      return baseQuestions.filter(q => q.difficulty !== 'hard');
    }

    return baseQuestions;
  };

  const categorizeQuestion = (question: string): FollowUpQuestion['category'] => {
    if (question.includes('为什么') || question.includes('如何') || question.includes('为什么')) {
      return 'deepen';
    }
    if (question.includes('区别') || question.includes('联系') || question.includes('关系')) {
      return 'related';
    }
    if (question.includes('实际') || question.includes('应用') || question.includes('例子')) {
      return 'application';
    }
    return 'related';
  };

  const prioritizeQuestions = (
    questions: FollowUpQuestion[],
    _userLevel?: 'beginner' | 'intermediate' | 'advanced'
  ): FollowUpQuestion[] => {
    const categoryOrder: Record<FollowUpQuestion['category'], number> = {
      deepen: 1,
      related: 2,
      application: 3,
    };

    const difficultyOrder: Record<Exclude<FollowUpQuestion['difficulty'], undefined>, number> = {
      easy: 1,
      medium: 2,
      hard: 3,
    };

    return questions.sort((a, b) => {
      const categoryDiff = categoryOrder[a.category] - categoryOrder[b.category];
      if (categoryDiff !== 0) return categoryDiff;

      const aDifficulty = a.difficulty || 'medium';
      const bDifficulty = b.difficulty || 'medium';
      const difficultyDiff = difficultyOrder[aDifficulty] - difficultyOrder[bDifficulty];
      if (difficultyDiff !== 0) return difficultyDiff;

      return 0;
    });
  };

  return {
    generateFollowUpQuestions,
    categorizeQuestion,
    prioritizeQuestions,
  };
}
