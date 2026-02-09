import { useState } from 'react';
import { Play, RotateCw, Lightbulb, CheckCircle, XCircle, Zap, Loader2 } from 'lucide-react';
import { quizApi, QuizQuestion, Difficulty } from '@/utils/api';

// 速通模式状态
enum SpeedModeState {
  IDLE = 'idle',
  LOADING = 'loading',
  ANSWERING = 'answering',
  EVALUATING = 'evaluating',
  SELF_ASSESS = 'self_assess',
  EXPLAINING = 'explaining',
}

// 遗传学知识点列表（用于轮询）
const GENETICS_TOPICS = [
  '孟德尔第一定律',
  '孟德尔第二定律',
  '伴性遗传',
  '连锁互换',
  '哈代-温伯格定律',
  '基因型与表型',
  '减数分裂',
  'DNA复制',
  '转录与翻译',
  '基因突变',
];

export default function SpeedModePage() {
  const [sessionState, setSessionState] = useState<SpeedModeState>(SpeedModeState.IDLE);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showSelfAssessment, setShowSelfAssessment] = useState(false);
  const [explanationLevel, setExplanationLevel] = useState(1);
  const [stats, setStats] = useState({ total: 0, correct: 0 });
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const startQuiz = async () => {
    setSessionState(SpeedModeState.LOADING);
    setError(null);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowSelfAssessment(false);
    setExplanationLevel(1);

    try {
      const topic = GENETICS_TOPICS[currentTopicIndex];
      const difficulty = stats.total < 5 ? 'easy' as Difficulty : stats.total < 15 ? 'medium' as Difficulty : 'hard' as Difficulty;

      const question = await quizApi.generate({
        topic,
        difficulty,
        userLevel: 'intermediate',
      });

      setCurrentQuestion(question as QuizQuestion);
      setSessionState(SpeedModeState.ANSWERING);
    } catch (err) {
      console.error('Failed to generate question:', err);
      setError('生成题目失败，请检查 API 配置');
      setSessionState(SpeedModeState.IDLE);
    }
  };

  const submitAnswer = async () => {
    if (!currentQuestion || !selectedAnswer) return;

    setSessionState(SpeedModeState.EVALUATING);
    setStats((prev) => ({ ...prev, total: prev.total + 1 }));

    try {
      const result = await quizApi.evaluate({
        question: currentQuestion.content,
        correctAnswer: currentQuestion.correctAnswer,
        userAnswer: selectedAnswer,
      });

      setIsCorrect(result.isCorrect);
      if (result.isCorrect) {
        setStats((prev) => ({ ...prev, correct: prev.correct + 1 }));
      }
      // 直接显示解析，不再需要先自评
      setSessionState(SpeedModeState.EXPLAINING);
      setShowSelfAssessment(true);
    } catch (err) {
      console.error('Failed to evaluate answer:', err);
      // 回退到客户端判断
      const correct = selectedAnswer === currentQuestion.correctAnswer;
      setIsCorrect(correct);
      if (correct) {
        setStats((prev) => ({ ...prev, correct: prev.correct + 1 }));
      }
      // 直接显示解析
      setSessionState(SpeedModeState.EXPLAINING);
      setShowSelfAssessment(true);
    }
  };

  const handleSelfAssessment = (errorType: 'low_level' | 'high_level') => {
    // 自评只是记录，不改变流程
    console.log('用户自评:', errorType);
  };

  const continueToNext = () => {
    setCurrentTopicIndex((prev) => (prev + 1) % GENETICS_TOPICS.length);
    setSessionState(SpeedModeState.QUESTIONING);
    setTimeout(() => {
      startQuiz();
    }, 500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* 顶部统计 */}
      <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div>
            <div className="text-2xl font-bold text-blue-600">{stats.correct}</div>
            <div className="text-sm text-gray-500">正确</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-gray-500">已答题</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-500">正确率</div>
          </div>
        </div>
        <button
          onClick={startQuiz}
          className="flex items-center space-x-2 btn-primary"
          disabled={sessionState === SpeedModeState.LOADING}
        >
          {sessionState === SpeedModeState.LOADING ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>生成中...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>{sessionState === SpeedModeState.IDLE ? '开始刷题' : '下一题'}</span>
            </>
          )}
        </button>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
          {error}
        </div>
      )}

      {/* 题目区域 */}
      {currentQuestion && sessionState !== SpeedModeState.LOADING && (
        <div className="bg-white rounded-xl shadow-sm p-8 animate-fade-in">
          {/* 题目标签 */}
          <div className="flex items-center space-x-2 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
              {currentQuestion.topic}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
              {currentQuestion.difficulty === 'easy' ? '简单' : currentQuestion.difficulty === 'medium' ? '中等' : '困难'}
            </span>
          </div>

          {/* 题目内容 */}
          <h2 className="text-xl font-semibold mb-6">{currentQuestion.content}</h2>

          {/* 选项 */}
          {sessionState === SpeedModeState.ANSWERING && (
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

          {/* 答案反馈 */}
          {isCorrect !== null && (
            <div className={`mb-6 p-4 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-center space-x-2 mb-2">
                {isCorrect ? (
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
              {!isCorrect && (
                <div className="text-sm text-gray-600">
                  正确答案：{currentQuestion.options?.find((o) => o.id === currentQuestion.correctAnswer)?.content}
                </div>
              )}
            </div>
          )}

          {/* 解析区域 */}
          {sessionState === SpeedModeState.EXPLAINING && currentQuestion.explanation && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-semibold mb-4">题目解析</h3>
              <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div key={level} className="border-l-2 border-blue-200 pl-3">
                    <div className="text-sm font-medium text-blue-600 mb-1">解析等级 {level}</div>
                    <div className="whitespace-pre-line text-gray-700 text-sm">
                      {currentQuestion.explanation[`level${level}` as keyof typeof currentQuestion.explanation]}
                    </div>
                  </div>
                ))}
              </div>

              {/* 自评区域（可选） */}
              {showSelfAssessment && !isCorrect && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                    <Lightbulb className="w-4 h-4 mr-2 text-yellow-600" />
                    这道题答错了，是什么原因呢？（可选）
                  </h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSelfAssessment('low_level')}
                      className="flex-1 py-2 px-3 bg-white rounded-lg border border-gray-200 hover:border-orange-300 transition-colors text-sm"
                    >
                      低级错误
                      <span className="block text-xs text-gray-400">笔误、手滑</span>
                    </button>
                    <button
                      onClick={() => handleSelfAssessment('high_level')}
                      className="flex-1 py-2 px-3 bg-white rounded-lg border border-gray-200 hover:border-red-300 transition-colors text-sm"
                    >
                      高级错误
                      <span className="block text-xs text-gray-400">概念不理解</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 操作按钮 */}
          {sessionState === SpeedModeState.ANSWERING && (
            <button
              onClick={submitAnswer}
              disabled={!selectedAnswer}
              className="w-full btn-primary py-3 text-lg"
            >
              提交答案
            </button>
          )}

          {sessionState === SpeedModeState.EXPLAINING && (
            <button onClick={continueToNext} className="w-full btn-primary py-3 text-lg flex items-center justify-center">
              <RotateCw className="w-5 h-5 mr-2" />
              继续下一题
            </button>
          )}
        </div>
      )}

      {/* 加载状态 */}
      {sessionState === SpeedModeState.LOADING && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-6" />
          <h2 className="text-xl font-semibold mb-2">AI 正在生成题目...</h2>
          <p className="text-gray-500">这可能需要几秒钟</p>
        </div>
      )}

      {/* 空状态 */}
      {sessionState === SpeedModeState.IDLE && !error && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Zap className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold mb-4">准备好开始刷题了吗？</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            AI 会根据你的水平生成题目，实时判断答案，提供分级解析，帮助你快速掌握遗传学知识
          </p>
          <button onClick={startQuiz} className="btn-primary text-lg px-8 py-3">
            开始刷题
          </button>
        </div>
      )}
    </div>
  );
}
