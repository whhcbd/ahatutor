import { useState, useEffect, useCallback } from 'react';
import { Play, RotateCw, CheckCircle, XCircle, Zap, Loader2, BookOpen, Target, Bot, Eye } from 'lucide-react';
import { quizApi, QuizQuestion, AnswerEvaluationResult, ExplanationResult } from '@/utils/api-quiz';
import { agentApi } from '@/api/agent';
import { GENETICS_TOPICS } from '@/data/genetics-topics';
import { QuestionPanel } from '@/components/Visualization/QuestionPanel';
import { EditableVisualization } from '@/components/Visualization/EditableVisualization';
import type { VisualizationSuggestion } from '@shared/types/agent.types';

enum QuizState {
  CONFIG = 'config',
  ANSWERING = 'answering',
  EVALUATING = 'evaluating',
  EXPLAINING = 'explaining',
  SUMMARY = 'summary',
}

interface QuizAnswer {
  questionId: string;
  userAnswer: string;
  isCorrect?: boolean;
  evaluation?: AnswerEvaluationResult;
}

const TOPIC_CATEGORIES = [
  { name: '经典遗传学', topics: GENETICS_TOPICS.slice(0, 10) },
  { name: '分子遗传学', topics: GENETICS_TOPICS.slice(10, 20) },
  { name: '细胞遗传学', topics: GENETICS_TOPICS.slice(20, 26) },
  { name: '群体遗传学', topics: GENETICS_TOPICS.slice(26, 31) },
  { name: '应用遗传学', topics: GENETICS_TOPICS.slice(31, 37) },
  { name: '特殊遗传现象', topics: GENETICS_TOPICS.slice(37, 45) },
  { name: '遗传病相关', topics: GENETICS_TOPICS.slice(45, 55) },
  { name: '基因工程与生物技术', topics: GENETICS_TOPICS.slice(55, 67) },
  { name: '遗传学实验方法', topics: GENETICS_TOPICS.slice(67, 76) },
  { name: '数量遗传学', topics: GENETICS_TOPICS.slice(76, 84) },
  { name: '发育遗传学', topics: GENETICS_TOPICS.slice(84, 89) },
];

export default function SpeedModePage() {
  const [quizState, setQuizState] = useState<QuizState>(QuizState.CONFIG);
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState(10);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'mixed'>('medium');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Map<string, QuizAnswer>>(new Map());
  const [evaluation, setEvaluation] = useState<AnswerEvaluationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [aiVisualization, setAiVisualization] = useState<VisualizationSuggestion | null>(null);
  const [personalizedVisualizations, setPersonalizedVisualizations] = useState<Record<string, VisualizationSuggestion>>({});
  const [isGeneratingAiExplanation, setIsGeneratingAiExplanation] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(true);

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = answers.size;
  const correctCount = Array.from(answers.values()).filter((a) => a.isCorrect).length;

  const startQuiz = async () => {
    if (selectedTopics.length === 0) {
      setError('请至少选择一个知识点');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnswers(new Map());
    setCurrentQuestionIndex(0);

    try {
      const generatedQuestions = await quizApi.generateQuestions({
        topics: selectedTopics,
        difficulty,
        count: questionCount,
        userLevel: 'intermediate',
      });

      if (!generatedQuestions || generatedQuestions.length === 0) {
        setError('生成题目失败，未能生成任何题目。请重试。');
        setQuizState(QuizState.CONFIG);
        return;
      }

      setQuestions(generatedQuestions as QuizQuestion[]);
      setQuizState(QuizState.ANSWERING);
    } catch (err) {
      console.error('Failed to generate questions:', err);
      setError('生成题目失败，请检查 API 配置或重试');
      setQuizState(QuizState.CONFIG);
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!currentQuestion || !selectedAnswer) return;

    setQuizState(QuizState.EVALUATING);

    console.log('Submitting answer:', {
      question: currentQuestion,
      userAnswer: selectedAnswer,
    });

    try {
      const result = await quizApi.evaluateV2({
        question: currentQuestion,
        userAnswer: selectedAnswer,
        explanationLevel: 1,
      });

      setEvaluation(result);
      setAnswers((prev) => {
        const newMap = new Map(prev);
        newMap.set(currentQuestion.id, {
          questionId: currentQuestion.id,
          userAnswer: selectedAnswer,
          isCorrect: result.isCorrect,
          evaluation: result,
        });
        return newMap;
      });

      setQuizState(QuizState.EXPLAINING);
    } catch (err) {
      console.error('Failed to evaluate answer:', err);
      const correctAnswerText = Array.isArray(currentQuestion.correctAnswer) 
        ? currentQuestion.correctAnswer.join(', ') 
        : currentQuestion.correctAnswer;
      const isCorrect = Array.isArray(currentQuestion.correctAnswer)
        ? currentQuestion.correctAnswer.includes(selectedAnswer)
        : selectedAnswer === currentQuestion.correctAnswer;
      setEvaluation({
        isCorrect,
        confidence: 1.0,
        reason: isCorrect ? '答案正确' : `答案错误，正确答案是 ${correctAnswerText}`,
        needsSelfAssessment: false,
      });
      setAnswers((prev) => {
        const newMap = new Map(prev);
        newMap.set(currentQuestion.id, {
          questionId: currentQuestion.id,
          userAnswer: selectedAnswer,
          isCorrect,
        });
        return newMap;
      });
      setQuizState(QuizState.EXPLAINING);
    }
  };

  const generateAiExplanation = useCallback(async () => {
    if (!currentQuestion) return;

    setIsGeneratingAiExplanation(true);
    setAiExplanation(null);
    setAiVisualization(null);

    try {
      const questionText = `${currentQuestion.content}\n\n选项：\n${currentQuestion.options?.map(o => `${o.label}. ${o.content}`).join('\n')}\n\n用户答案：${selectedAnswer}\n\n正确答案：${currentQuestion.correctAnswer}`;

      const response = await agentApi.askVisualizationQuestion({
        concept: currentQuestion.topic,
        question: `请详细解释这道题的答案：\n\n${questionText}`,
        userLevel: difficulty === 'easy' ? 'beginner' : difficulty === 'hard' ? 'advanced' : 'intermediate',
        conversationHistory: [],
      });

      console.log('AI response:', response);
      console.log('Has visualization:', !!response.visualization);
      console.log('Has personalized:', !!personalizedVisualizations[currentQuestion.id]);

      setAiExplanation(response.textAnswer);
      if (currentQuestion && personalizedVisualizations[currentQuestion.id]) {
        setAiVisualization(personalizedVisualizations[currentQuestion.id]);
      } else {
        setAiVisualization(response.visualization || null);
      }
      setShowAiPanel(true);
    } catch (err) {
      console.error('Failed to generate AI explanation:', err);
      setAiExplanation('生成AI解析失败，请稍后重试。');
    } finally {
      setIsGeneratingAiExplanation(false);
    }
  }, [currentQuestion, selectedAnswer, difficulty, personalizedVisualizations]);

  useEffect(() => {
    console.log('useEffect triggered:', { quizState, currentQuestion, aiExplanation, isGeneratingAiExplanation });
    if (quizState === QuizState.EXPLAINING && currentQuestion && !aiExplanation && !isGeneratingAiExplanation) {
      console.log('Generating AI explanation...');
      generateAiExplanation();
    }
  }, [quizState, currentQuestionIndex, currentQuestion, selectedAnswer, difficulty, personalizedVisualizations, generateAiExplanation, aiExplanation, isGeneratingAiExplanation]);

  useEffect(() => {
    const saved = localStorage.getItem('personalizedVisualizations');
    if (saved) {
      try {
        setPersonalizedVisualizations(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load personalized visualizations:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('personalizedVisualizations', JSON.stringify(personalizedVisualizations));
  }, [personalizedVisualizations]);

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setEvaluation(null);
      setAiExplanation(null);
      setAiVisualization(null);
      setShowAiPanel(false);
      setQuizState(QuizState.ANSWERING);
    } else {
      setQuizState(QuizState.SUMMARY);
    }
  };

  const skipQuestion = () => {
    if (!currentQuestion) return;
    
    setAnswers((prev) => {
      const newMap = new Map(prev);
      newMap.set(currentQuestion.id, {
        questionId: currentQuestion.id,
        userAnswer: 'skipped',
        isCorrect: false,
      });
      return newMap;
    });
    nextQuestion();
  };

  const jumpToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    setSelectedAnswer(null);
    setEvaluation(null);
    setQuizState(QuizState.ANSWERING);
  };

  const restartQuiz = () => {
    setQuizState(QuizState.CONFIG);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedTopics([]);
    setAnswers(new Map());
    setError(null);
  };

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) => {
      if (prev.includes(topic)) {
        return prev.filter((t) => t !== topic);
      }
      return [...prev, topic];
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {quizState === QuizState.CONFIG && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">速通模式</h1>
            <p className="text-gray-600 max-w-lg mx-auto">
              选择知识点和难度，AI 一次性生成题目，连续答题巩固知识
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              选择知识点
            </h3>
            <div className="space-y-4">
              {TOPIC_CATEGORIES.map((category) => (
                <div key={category.name}>
                  <button
                    onClick={() => {
                      if (selectedTopics.length === 0 && category.topics.every((t) => !selectedTopics.includes(t))) {
                        toggleTopic(category.topics[0]);
                      }
                    }}
                    className="w-full text-left px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    {category.name} ({category.topics.length})
                  </button>
                  <div className="ml-4 mt-2 space-y-1">
                    {category.topics.map((topic) => (
                      <button
                        key={topic}
                        onClick={() => toggleTopic(topic)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          selectedTopics.includes(topic)
                            ? 'bg-blue-100 text-blue-700 border border-blue-300'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {selectedTopics.includes(topic) ? '✓ ' : ''}
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-lg mb-4">题目数量</h3>
              <div className="grid grid-cols-4 gap-2">
                {[1, 5, 10, 20].map((count) => (
                  <button
                    key={count}
                    onClick={() => setQuestionCount(count)}
                    className={`py-3 rounded-lg font-medium transition-colors ${
                      questionCount === count
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-lg mb-4">难度选择</h3>
              <div className="grid grid-cols-2 gap-2">
                {(['easy', 'medium', 'hard', 'mixed'] as const).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className={`py-3 rounded-lg font-medium transition-colors ${
                      difficulty === diff
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {diff === 'easy' && '简单'}
                    {diff === 'medium' && '中等'}
                    {diff === 'hard' && '困难'}
                    {diff === 'mixed' && '混合'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between bg-blue-50 rounded-xl p-4">
            <div>
              <div className="text-sm text-blue-600">
                已选择 {selectedTopics.length} 个知识点
              </div>
              <div className="text-lg font-bold text-blue-800">
                共 {questionCount} 道题
              </div>
            </div>
            <button
              onClick={startQuiz}
              disabled={selectedTopics.length === 0 || isLoading}
              className="btn-primary px-8 py-3 text-lg flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>生成中...</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  <span>开始答题</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
              {error}
            </div>
          )}
        </div>
      )}

      {(quizState === QuizState.ANSWERING || quizState === QuizState.EVALUATING || quizState === QuizState.EXPLAINING) && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">题目 {currentQuestionIndex + 1} / {questions.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-600">{correctCount} 正确</span>
              </div>
              <div>
                <span className="text-gray-700">
                  正确率: {answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0}%
                </span>
              </div>
            </div>
            <button
              onClick={() => jumpToQuestion(0)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
            >
              查看所有题目
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-8">
            <div className="flex items-center space-x-2 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                {currentQuestion?.topic || ''}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                {currentQuestion?.difficulty === 'easy' ? '简单' : currentQuestion?.difficulty === 'medium' ? '中等' : '困难'}
              </span>
            </div>

            <h2 className="text-xl font-semibold mb-6">{currentQuestion?.content || ''}</h2>

            {(quizState === QuizState.ANSWERING || quizState === QuizState.EVALUATING || quizState === QuizState.EXPLAINING) && currentQuestion?.options && (
              <div className="space-y-3 mb-6">
                {currentQuestion.options.map((option) => {
                  const isCorrect = Array.isArray(currentQuestion.correctAnswer)
                    ? currentQuestion.correctAnswer.includes(option.id)
                    : option.id === currentQuestion.correctAnswer;
                  const isSelected = selectedAnswer === option.id;
                  const showResult = quizState === QuizState.EVALUATING || quizState === QuizState.EXPLAINING;
                  const isAnswering = quizState === QuizState.ANSWERING;

                  const OptionComponent = isAnswering ? 'button' : 'div';

                  return (
                    <OptionComponent
                      key={option.id}
                      onClick={isAnswering ? () => setSelectedAnswer(option.id) : undefined}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        !showResult && isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : showResult && isCorrect
                          ? 'border-green-500 bg-green-50'
                          : showResult && isSelected && !isCorrect
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200'
                      } ${isAnswering ? 'hover:border-gray-300 cursor-pointer' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">{option.label}. </span>
                          {option.content}
                        </div>
                        {showResult && isCorrect && (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        )}
                        {showResult && isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                    </OptionComponent>
                  );
                })}
              </div>
            )}

            {evaluation && (
              <div className={`mb-6 p-4 rounded-lg ${evaluation.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-center space-x-2 mb-2">
                  {evaluation.isCorrect ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-600">回答正确！</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-600" />
                      <span className="font-semibold text-red-600">回答错误</span>
                    </>
                  )}
                </div>
                <div className="text-sm text-gray-600">{evaluation.reason}</div>
                {!evaluation.isCorrect && (
                  <div className="text-sm text-gray-600 mt-1">
                    正确答案：{currentQuestion?.options?.filter((o) => 
                      Array.isArray(currentQuestion?.correctAnswer)
                        ? currentQuestion?.correctAnswer.includes(o.id)
                        : o.id === currentQuestion?.correctAnswer
                    ).map(o => o.content).join(', ')}
                  </div>
                )}
              </div>
            )}

            {quizState === QuizState.EXPLAINING && (
              <div className="border-t border-gray-200 pt-6 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-purple-700">AI 智能解析</h3>
                  </div>
                  <button
                    onClick={() => setShowAiPanel(!showAiPanel)}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    {showAiPanel ? '收起' : '展开'}
                  </button>
                </div>

                {showAiPanel && (
                  <div className="space-y-4">
                    {isGeneratingAiExplanation ? (
                      <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                        <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
                        <span className="text-sm text-purple-700">AI 正在生成详细解析...</span>
                      </div>
                    ) : (
                      <>
                        <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                          <div className="text-base text-gray-700 leading-relaxed whitespace-pre-line">
                            {aiExplanation}
                          </div>
                        </div>

                        {aiVisualization && currentQuestion && (
                          <div className="mt-4">
                            <div className="flex items-center gap-2 mb-3">
                              <Eye className="w-4 h-4 text-blue-600" />
                              <span className="text-xs font-medium text-blue-600">相关可视化</span>
                            </div>
                            <EditableVisualization
                              visualization={aiVisualization}
                              onSave={(editedViz) => {
                                if (currentQuestion) {
                                  setPersonalizedVisualizations(prev => ({
                                    ...prev,
                                    [currentQuestion.id]: editedViz
                                  }));
                                  setAiVisualization(editedViz);
                                }
                              }}
                              isEditable={true}
                            />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {quizState === QuizState.ANSWERING && (
              <div className="flex gap-3">
                <button
                  onClick={submitAnswer}
                  disabled={!selectedAnswer}
                  className="flex-1 btn-primary py-3 text-lg"
                >
                  提交答案
                </button>
                <button
                  onClick={skipQuestion}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700"
                >
                  跳过
                </button>
              </div>
            )}

            {quizState === QuizState.EXPLAINING && (
              <button onClick={nextQuestion} className="w-full btn-primary py-3 text-lg flex items-center justify-center">
                {currentQuestionIndex < questions.length - 1 ? (
                  <>
                    <RotateCw className="w-5 h-5 mr-2" />
                    下一题
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    查看总结
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {quizState === QuizState.SUMMARY && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">答题完成！</h1>
            <p className="text-gray-600 mb-8">
              共完成 {questions.length} 道题目
            </p>

            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-3xl font-bold text-blue-600">{correctCount}</div>
                <div className="text-sm text-gray-600">正确</div>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <div className="text-3xl font-bold text-red-600">{answeredCount - correctCount}</div>
                <div className="text-sm text-gray-600">错误</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-3xl font-bold text-green-600">
                  {answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0}%
                </div>
                <div className="text-sm text-gray-600">正确率</div>
              </div>
            </div>

            <div className="space-y-3">
              <button onClick={restartQuiz} className="w-full btn-primary py-3 text-lg flex items-center justify-center gap-2">
                <RotateCw className="w-5 h-5" />
                再来一次
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-bold text-lg mb-4">答题详情</h3>
            <div className="space-y-2">
              {questions.map((question, index) => {
                const answer = answers.get(question.id);
                return (
                  <button
                    key={question.id}
                    onClick={() => jumpToQuestion(index)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                      answer?.isCorrect === true
                        ? 'border-green-300 bg-green-50'
                        : answer?.isCorrect === false
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">第 {index + 1} 题</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs">
                          {question.topic}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {answer?.userAnswer === 'skipped' ? (
                          <span className="text-gray-500 text-sm">已跳过</span>
                        ) : answer?.isCorrect === true ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : answer?.isCorrect === false ? (
                          <XCircle className="w-5 h-5 text-red-600" />
                        ) : null}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
