import { useState } from 'react';
import { Play, RotateCw, CheckCircle, XCircle, Zap, Loader2, ChevronUp, ChevronDown, MessageCircle, BookOpen, Target } from 'lucide-react';
import { quizApi, QuizQuestion, AnswerEvaluationResult, ExplanationResult } from '@/utils/api-quiz';
import { GENETICS_TOPICS } from '@/data/genetics-topics';

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
  const [explanationLevel, setExplanationLevel] = useState(1);
  const [explanation, setExplanation] = useState<ExplanationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

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

      setQuestions(generatedQuestions as QuizQuestion[]);
      setQuizState(QuizState.ANSWERING);
    } catch (err) {
      console.error('Failed to generate questions:', err);
      setError('生成题目失败，请检查 API 配置');
      setQuizState(QuizState.CONFIG);
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!currentQuestion || !selectedAnswer) return;

    setQuizState(QuizState.EVALUATING);

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
      const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
      setEvaluation({
        isCorrect,
        confidence: 1.0,
        reason: isCorrect ? '答案正确' : `答案错误，正确答案是 ${currentQuestion.correctAnswer}`,
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

  const changeExplanationLevel = async (newLevel: number) => {
    if (!currentQuestion || !selectedAnswer) return;

    try {
      const result = await quizApi.getExplanation({
        question: currentQuestion,
        userAnswer: selectedAnswer,
        level: newLevel,
        previousLevel: explanationLevel,
      });

      setExplanation(result);
      setExplanationLevel(newLevel);
    } catch (err) {
      console.error('Failed to get explanation:', err);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setEvaluation(null);
      setExplanation(null);
      setExplanationLevel(1);
      setQuizState(QuizState.ANSWERING);
    } else {
      setQuizState(QuizState.SUMMARY);
    }
  };

  const skipQuestion = () => {
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
    setExplanation(null);
    setExplanationLevel(1);
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
                {[5, 10, 20, 50].map((count) => (
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
                {currentQuestion.topic}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                {currentQuestion.difficulty === 'easy' ? '简单' : currentQuestion.difficulty === 'medium' ? '中等' : '困难'}
              </span>
            </div>

            <h2 className="text-xl font-semibold mb-6">{currentQuestion.content}</h2>

            {quizState === QuizState.ANSWERING && (
              <div className="space-y-3 mb-6">
                {currentQuestion.options?.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedAnswer(option.id)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedAnswer === option.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="font-medium">{option.label}. </span>
                    {option.content}
                  </button>
                ))}
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
                    正确答案：{currentQuestion.options?.find((o) => o.id === currentQuestion.correctAnswer)?.content}
                  </div>
                )}
              </div>
            )}

            {quizState === QuizState.EXPLAINING && (
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">题目解析</h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => changeExplanationLevel(Math.max(1, explanationLevel - 1))}
                      disabled={explanationLevel <= 1}
                      className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="简化解析"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-medium px-2 py-1 bg-blue-100 text-blue-600 rounded">
                      等级 {explanationLevel}
                    </span>
                    <button
                      onClick={() => changeExplanationLevel(Math.min(5, explanationLevel + 1))}
                      disabled={explanationLevel >= 5}
                      className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="详细解析"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  {explanation ? (
                    <div className="text-gray-700 text-sm leading-relaxed">
                      <p className="whitespace-pre-line">{explanation.explanation}</p>
                    </div>
                  ) : (
                    <div className="text-gray-700 text-sm leading-relaxed space-y-3">
                      {[1, 2, 3, 4, 5].map((level) => {
                        const levelContent = evaluation?.explanation?.[`level${level}` as keyof typeof evaluation.explanation];
                        if (!levelContent) return null;
                        return (
                          <p key={level} className={level === explanationLevel ? '' : 'hidden'}>
                            {levelContent}
                          </p>
                        );
                      })}
                    </div>
                  )}
                </div>

                {explanation?.followUpQuestions && explanation.followUpQuestions.length > 0 && (
                  <div className="mt-4">
                    <button
                      className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>相关问题</span>
                    </button>
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
