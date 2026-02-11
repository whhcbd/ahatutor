import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Loader2, Sparkles } from 'lucide-react';
import { agentApi } from '../../api/agent';
import type { VisualizationSuggestion } from '@shared/types/agent.types';

interface QuestionPanelProps {
  concept: string;
  userLevel?: 'beginner' | 'intermediate' | 'advanced';
  onNewVisualization?: (visualization: VisualizationSuggestion) => void;
  className?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  visualization?: VisualizationSuggestion;
  followUpQuestions?: string[];
  relatedConcepts?: string[];
  timestamp: Date;
}

/**
 * 提问面板组件
 * 允许用户基于当前学习的概念提出问题，并获取可视化的回答
 */
export function QuestionPanel({
  concept,
  userLevel = 'intermediate',
  onNewVisualization,
  className = '',
}: QuestionPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 发送问题
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // 构建对话历史（最近5条）
      const conversationHistory = messages
        .slice(-5)
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await agentApi.askVisualizationQuestion({
        concept,
        question: userMessage.content,
        userLevel,
        conversationHistory,
      });

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.textAnswer,
        visualization: response.visualization,
        followUpQuestions: response.followUpQuestions,
        relatedConcepts: response.relatedConcepts,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // 如果返回了新的可视化，触发回调
      if (response.visualization && onNewVisualization) {
        onNewVisualization(response.visualization);
      }
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: '抱歉，我遇到了一些问题。请稍后再试。',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // 点击后续问题
  const handleFollowUpClick = (question: string) => {
    setInputValue(question);
    // 自动发送
    setTimeout(() => {
      setInputValue(question);
      // 这里会触发上面的发送逻辑
    }, 100);
  };

  // 键盘事件处理
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      {/* 头部 */}
      <div
        className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-gray-800">智能问答</h3>
          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
            {concept}
          </span>
        </div>
        <button
          className={`transform transition-transform ${isCollapsed ? '-rotate-90' : 'rotate-0'}`}
        >
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* 内容区域 */}
      {!isCollapsed && (
        <div className="flex flex-col h-[500px]">
          {/* 消息列表 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                <Sparkles className="w-12 h-12 mb-3 text-blue-400" />
                <p className="font-medium">有问题尽管问！</p>
                <p className="text-sm mt-1">
                  我会尽力用可视化的方式帮您理解"{concept}"
                </p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                    {/* 后续问题建议 */}
                    {message.followUpQuestions && message.followUpQuestions.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs font-medium opacity-70">您可能还想了解：</p>
                        {message.followUpQuestions.map((q, i) => (
                          <button
                            key={i}
                            onClick={() => handleFollowUpClick(q)}
                            className="block w-full text-left text-xs bg-white bg-opacity-20 hover:bg-opacity-30 rounded px-2 py-1 transition-colors"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* 相关概念 */}
                    {message.relatedConcepts && message.relatedConcepts.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs font-medium opacity-70">相关概念：</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {message.relatedConcepts.map((c, i) => (
                            <span
                              key={i}
                              className="text-xs bg-white bg-opacity-20 rounded px-2 py-0.5"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-2 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                  <span className="text-sm text-gray-500">思考中...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 输入区域 */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`关于"${concept}"您想了解什么？`}
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">发送</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              提示：您可以询问概念的定义、原理、应用例子等
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * 简化版提问组件
 * 只显示输入框，不显示对话历史
 */
export function QuickAskInput({
  concept,
  userLevel = 'intermediate',
  onAnswer,
  className = '',
}: {
  concept: string;
  userLevel?: 'beginner' | 'intermediate' | 'advanced';
  onAnswer: (answer: {
    text: string;
    visualization?: VisualizationSuggestion;
  }) => void;
  className?: string;
}) {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!inputValue.trim() || isLoading) return;

    const question = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await agentApi.askVisualizationQuestion({
        concept,
        question,
        userLevel,
      });

      onAnswer({
        text: response.textAnswer,
        visualization: response.visualization,
      });
    } catch (error) {
      onAnswer({
        text: '抱歉，我遇到了一些问题。请稍后再试。',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={`关于"${concept}"您想了解什么？`}
        disabled={isLoading}
        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
      <button
        onClick={handleSubmit}
        disabled={isLoading || !inputValue.trim()}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}
