import { useState } from 'react';
import { BookOpen, Sparkles, MessageSquare } from 'lucide-react';
import { NarrativeComposerView, InteractiveFlowView } from '../components/Visualization/NarrativeComposerView';

// 遗传学知识点列表
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

type ViewMode = 'narrative' | 'interactive';

export default function NarrativePage() {
  const [selectedConcept, setSelectedConcept] = useState('伴性遗传');
  const [userLevel, setUserLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [viewMode, setViewMode] = useState<ViewMode>('narrative');

  return (
    <div className="max-w-7xl mx-auto">
      {/* 顶部标题 */}
      <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-purple-100 rounded-lg">
            <BookOpen className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">学习叙事</h1>
            <p className="text-gray-600">通过故事化讲解，让知识点更容易理解和记忆</p>
          </div>
        </div>
      </div>

      {/* 控制面板 */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="grid md:grid-cols-3 gap-6">
          {/* 概念选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">选择概念</label>
            <select
              value={selectedConcept}
              onChange={(e) => setSelectedConcept(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {GENETICS_TOPICS.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>

          {/* 难度选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">你的水平</label>
            <div className="flex gap-2">
              {[
                { value: 'beginner', label: '初学者' },
                { value: 'intermediate', label: '进阶' },
                { value: 'advanced', label: '高级' },
              ].map((level) => (
                <button
                  key={level.value}
                  onClick={() => setUserLevel(level.value as any)}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm transition-colors ${
                    userLevel === level.value
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          {/* 视图模式 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">展示模式</label>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('narrative')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm transition-colors ${
                  viewMode === 'narrative'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="flex items-center justify-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  学习叙事
                </span>
              </button>
              <button
                onClick={() => setViewMode('interactive')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm transition-colors ${
                  viewMode === 'interactive'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="flex items-center justify-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  互动流程
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 内容展示区域 */}
      <div className="bg-white rounded-xl shadow-sm p-8">
        {viewMode === 'narrative' ? (
          <NarrativeView
            key={`${selectedConcept}-${userLevel}-narrative`}
            concept={selectedConcept}
            userLevel={userLevel}
          />
        ) : (
          <InteractiveView
            key={`${selectedConcept}-${userLevel}-interactive`}
            concept={selectedConcept}
            userLevel={userLevel}
          />
        )}
      </div>
    </div>
  );
}

// 学习叙事视图
function NarrativeView({ concept, userLevel }: { concept: string; userLevel: 'beginner' | 'intermediate' | 'advanced' }) {
  return <NarrativeComposerView concept={concept} userLevel={userLevel} />;
}

// 互动流程视图
function InteractiveView({ concept, userLevel }: { concept: string; userLevel: 'beginner' | 'intermediate' | 'advanced' }) {
  return <InteractiveFlowView concept={concept} userLevel={userLevel} />;
}
