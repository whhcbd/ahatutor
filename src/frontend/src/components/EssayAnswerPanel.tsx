import { useState, useEffect, useCallback, useRef } from 'react';
import { Save, FileText, AlignLeft, List, Quote, Type, Bold, Italic, Underline, CheckCircle, AlertCircle } from 'lucide-react';

interface EssayAnswerPanelProps {
  questionText: string;
  initialAnswer?: string;
  onSave: (answer: string) => void;
  onCancel: () => void;
  wordLimit?: number;
  autoSaveDelay?: number;
}

export default function EssayAnswerPanel({
  questionText,
  initialAnswer = '',
  onSave,
  onCancel,
  wordLimit = 2000,
  autoSaveDelay = 3000
}: EssayAnswerPanelProps) {
  const [answer, setAnswer] = useState(initialAnswer);
  const [wordCount, setWordCount] = useState(0);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
  const [showToolbar, setShowToolbar] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setWordCount(answer.length);
  }, [answer]);

  useEffect(() => {
    if (initialAnswer) {
      setAnswer(initialAnswer);
    }
  }, [initialAnswer]);

  const autoSaveRef = useRef<NodeJS.Timeout>();
  
  const triggerAutoSave = useCallback(() => {
    setIsAutoSaving(true);
    setTimeout(() => {
      onSave(answer);
      setLastSavedTime(new Date());
      setIsAutoSaving(false);
    }, 500);
  }, [answer, onSave]);

  useEffect(() => {
    if (autoSaveRef.current) {
      clearTimeout(autoSaveRef.current);
    }
    autoSaveRef.current = setTimeout(() => {
      triggerAutoSave();
    }, autoSaveDelay);
    
    return () => {
      if (autoSaveRef.current) {
        clearTimeout(autoSaveRef.current);
      }
    };
  }, [answer, triggerAutoSave, autoSaveDelay]);

  const handleSave = useCallback(() => {
    onSave(answer);
    setLastSavedTime(new Date());
  }, [answer, onSave]);

  const formatText = useCallback((format: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    
    let formattedText = '';
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText || '粗体文本'}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText || '斜体文本'}*`;
        break;
      case 'underline':
        formattedText = `__${selectedText || '下划线文本'}__`;
        break;
      case 'list':
        formattedText = `\n- ${selectedText || '列表项'}`;
        break;
      case 'quote':
        formattedText = `\n> ${selectedText || '引用文本'}`;
        break;
      case 'indent':
        formattedText = `\n  ${selectedText || '缩进文本'}`;
        break;
      case 'alignLeft':
      case 'alignCenter':
      case 'alignRight':
        formattedText = selectedText;
        break;
      default:
        return;
    }

    const newText = text.substring(0, start) + formattedText + text.substring(end);
    setAnswer(newText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + formattedText.length, start + formattedText.length);
    }, 0);
  }, []);

  const handleWordLimitCheck = useCallback(() => {
    if (wordCount > wordLimit) {
      setAnswer(answer.substring(0, wordLimit));
    }
  }, [answer, wordCount, wordLimit]);

  const wordCountColor = wordCount > wordLimit * 0.9 ? 'text-red-600' : wordCount > wordLimit * 0.7 ? 'text-yellow-600' : 'text-gray-600';
  const progressPercent = Math.min((wordCount / wordLimit) * 100, 100);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">论述题回答</h2>
        <p className="text-gray-600 text-sm mb-4">{questionText}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${wordCountColor}`}>
              <Type className="w-4 h-4" />
              <span className="text-sm font-medium">
                {wordCount} / {wordLimit} 字
              </span>
            </div>
            {isAutoSaving && (
              <div className="flex items-center gap-2 text-blue-600">
                <Save className="w-4 h-4 animate-pulse" />
                <span className="text-sm">自动保存中...</span>
              </div>
            )}
            {lastSavedTime && !isAutoSaving && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">
                  已保存 {lastSavedTime.toLocaleTimeString()}
                </span>
              </div>
            )}
          </div>
          
          <button
            onClick={() => setShowToolbar(!showToolbar)}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
          >
            {showToolbar ? '隐藏工具栏' : '显示工具栏'}
          </button>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${wordCount > wordLimit ? 'bg-red-600' : wordCount > wordLimit * 0.7 ? 'bg-yellow-600' : 'bg-blue-600'}`}
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {showToolbar && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => formatText('bold')}
              className="px-3 py-2 bg-white hover:bg-gray-100 border border-gray-300 rounded flex items-center gap-2 text-sm"
              title="粗体"
            >
              <Bold className="w-4 h-4" />
              <span>粗体</span>
            </button>
            <button
              onClick={() => formatText('italic')}
              className="px-3 py-2 bg-white hover:bg-gray-100 border border-gray-300 rounded flex items-center gap-2 text-sm"
              title="斜体"
            >
              <Italic className="w-4 h-4" />
              <span>斜体</span>
            </button>
            <button
              onClick={() => formatText('underline')}
              className="px-3 py-2 bg-white hover:bg-gray-100 border border-gray-300 rounded flex items-center gap-2 text-sm"
              title="下划线"
            >
              <Underline className="w-4 h-4" />
              <span>下划线</span>
            </button>
            <div className="w-px bg-gray-300 mx-1"></div>
            <button
              onClick={() => formatText('list')}
              className="px-3 py-2 bg-white hover:bg-gray-100 border border-gray-300 rounded flex items-center gap-2 text-sm"
              title="列表"
            >
              <List className="w-4 h-4" />
              <span>列表</span>
            </button>
            <button
              onClick={() => formatText('quote')}
              className="px-3 py-2 bg-white hover:bg-gray-100 border border-gray-300 rounded flex items-center gap-2 text-sm"
              title="引用"
            >
              <Quote className="w-4 h-4" />
              <span>引用</span>
            </button>
            <button
              onClick={() => formatText('indent')}
              className="px-3 py-2 bg-white hover:bg-gray-100 border border-gray-300 rounded flex items-center gap-2 text-sm"
              title="缩进"
            >
              <AlignLeft className="w-4 h-4" />
              <span>缩进</span>
            </button>
          </div>
        </div>
      )}

      <textarea
        ref={textareaRef}
        value={answer}
        onChange={(e) => {
          setAnswer(e.target.value);
          handleWordLimitCheck();
        }}
        placeholder="请输入您的详细回答..."
        className="w-full min-h-[300px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
        style={{
          fontSize: '16px',
          lineHeight: '1.6'
        }}
      />

      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium"
        >
          取消
        </button>
        <button
          onClick={handleSave}
          disabled={wordCount === 0}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <FileText className="w-5 h-5" />
          提交回答
        </button>
      </div>

      {wordCount > wordLimit * 0.8 && (
        <div className="mt-4 flex items-start gap-2 bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-800">
            {wordCount > wordLimit ? (
              <>
                字数超出限制！请将回答控制在 {wordLimit} 字以内。
              </>
            ) : (
              <>
                字数接近上限，建议精简内容。当前字数：{wordCount} / {wordLimit}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}