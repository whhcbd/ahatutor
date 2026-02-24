import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { A2UIPayload } from '@shared/types/a2ui.types';
import { A2UIRenderer } from './A2UIRenderer';
import { useA2UIStore } from '../../stores/a2uiStore';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  a2uiPayload?: A2UIPayload;
  metadata?: {
    sources?: Array<{
      documentId: string;
      title: string;
      chapter?: string;
      section?: string;
    }>;
    citations?: Array<{
      chunkId: string;
      content: string;
      chapter?: string;
      section?: string;
    }>;
    learningPath?: Array<{
      id: string;
      name: string;
      level: number;
    }>;
    examples?: Array<{
      title: string;
      description: string;
    }>;
    followUpQuestions?: string[];
    relatedConcepts?: string[];
  };
}

export interface AIConversationFlowProps {
  concept: string;
  userLevel?: 'beginner' | 'intermediate' | 'advanced';
  onMessageSend: (question: string, history: ChatMessage[]) => Promise<{
    textAnswer: string;
    a2uiPayload?: A2UIPayload;
    examples?: Array<{ title: string; description: string }>;
    followUpQuestions?: string[];
    relatedConcepts?: string[];
    sources?: Array<{
      documentId: string;
      title: string;
      chapter?: string;
      section?: string;
    }>;
    citations?: Array<{
      chunkId: string;
      content: string;
      chapter?: string;
      section?: string;
    }>;
    learningPath?: Array<{
      id: string;
      name: string;
      level: number;
    }>;
  }>;
  initialMessages?: ChatMessage[];
  showSources?: boolean;
  showLearningPath?: boolean;
  maxHistoryLength?: number;
  enableA2UI?: boolean;
}

export function AIConversationFlow({
  concept,
  userLevel = 'intermediate',
  onMessageSend,
  initialMessages = [],
  showSources = true,
  showLearningPath = true,
  maxHistoryLength = 20,
  enableA2UI = true
}: AIConversationFlowProps): React.ReactElement {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { startStreaming, completeStreaming } = useA2UIStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = useCallback(async (question: string) => {
    if (!question.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: question,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      if (enableA2UI) {
        startStreaming();
      }

      const response = await onMessageSend(question, messages);

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: response.textAnswer,
        timestamp: Date.now(),
        a2uiPayload: response.a2uiPayload,
        metadata: {
          sources: response.sources,
          citations: response.citations,
          learningPath: response.learningPath,
          examples: response.examples,
          followUpQuestions: response.followUpQuestions,
          relatedConcepts: response.relatedConcepts
        }
      };

      setMessages(prev => {
        const updated = [...prev, assistantMessage];
        return updated.length > maxHistoryLength
          ? updated.slice(updated.length - maxHistoryLength)
          : updated;
      });

      if (enableA2UI) {
        completeStreaming();
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);

      const errorResponse: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: `抱歉，我遇到了一些问题：${errorMessage}。请稍后重试。`,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, errorResponse]);

      if (enableA2UI) {
        completeStreaming();
      }
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, onMessageSend, maxHistoryLength, enableA2UI, startStreaming, completeStreaming]);

  const handleQuickQuestion = useCallback((question: string) => {
    handleSendMessage(question);
  }, [handleSendMessage]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  }, [inputValue, handleSendMessage]);

  return (
    <div className="ai-conversation-flow">
      <div className="conversation-header">
        <h2>{concept}</h2>
        <div className="user-level">
          当前水平: {userLevel === 'beginner' ? '初学者' : userLevel === 'intermediate' ? '中级' : '高级'}
        </div>
      </div>

      <div className="messages-container">
        {messages.length === 0 && (
          <div className="empty-state">
            <p>开始学习{concept}吧！提出你的第一个问题。</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.role}`}
          >
            <div className="message-content">
              <div className="message-text">
                {message.content}
              </div>

              {message.a2uiPayload && enableA2UI && (
                <div className="a2ui-visualization">
                  <A2UIRenderer payload={message.a2uiPayload} />
                </div>
              )}

              {message.metadata?.examples && message.metadata.examples.length > 0 && (
                <div className="examples-section">
                  <h4>举例说明</h4>
                  {message.metadata.examples.map((example, index) => (
                    <div key={index} className="example">
                      <strong>{example.title}</strong>
                      <p>{example.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {showSources && message.metadata?.sources && message.metadata.sources.length > 0 && (
                <div className="sources-section">
                  <h4>参考来源</h4>
                  <ul>
                    {message.metadata.sources.map((source, index) => (
                      <li key={index}>
                        {source.title}
                        {source.chapter && ` - ${source.chapter}`}
                        {source.section && ` (${source.section})`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {showLearningPath && message.metadata?.learningPath && message.metadata.learningPath.length > 0 && (
                <div className="learning-path-section">
                  <h4>学习路径</h4>
                  <div className="learning-path">
                    {message.metadata.learningPath.map((node, index) => (
                      <div key={node.id} className={`learning-node level-${node.level}`}>
                        <span className="node-name">{node.name}</span>
                        {index < message.metadata!.learningPath!.length - 1 && (
                          <span className="arrow">→</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {message.metadata?.followUpQuestions && message.metadata.followUpQuestions.length > 0 && (
                <div className="follow-up-section">
                  <h4>继续学习</h4>
                  <div className="quick-questions">
                    {message.metadata.followUpQuestions.map((question, index) => (
                      <button
                        key={index}
                        className="quick-question-btn"
                        onClick={() => handleQuickQuestion(question)}
                        disabled={isLoading}
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="message-timestamp">
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="message assistant loading">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form className="input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={`询问关于${concept}的问题...`}
          disabled={isLoading}
          className="message-input"
        />
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="send-button"
        >
          {isLoading ? '发送中...' : '发送'}
        </button>
      </form>
    </div>
  );
}
