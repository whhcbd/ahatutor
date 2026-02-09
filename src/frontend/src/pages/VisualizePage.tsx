import { useState } from 'react';
import { Eye, Sparkles, Loader2 } from 'lucide-react';
import { VisualDesignerView } from '../components/Visualization/VisualDesignerView';

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

export default function VisualizePage() {
  const [selectedConcept, setSelectedConcept] = useState('伴性遗传');
  const [userLevel, setUserLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');

  return (
    <div className="max-w-7xl mx-auto">
      {/* 顶部标题 */}
      <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Eye className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">概念可视化</h1>
            <p className="text-gray-600">将抽象的遗传学概念转化为直观的可视化展示</p>
          </div>
        </div>
      </div>

      {/* 控制面板 */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="grid md:grid-cols-2 gap-6">
          {/* 概念选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">选择概念</label>
            <select
              value={selectedConcept}
              onChange={(e) => setSelectedConcept(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                    userLevel === level.value
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 可视化展示区域 */}
      <div className="bg-white rounded-xl shadow-sm p-8">
        <VisualizeView
          key={`${selectedConcept}-${userLevel}`}
          concept={selectedConcept}
          userLevel={userLevel}
        />
      </div>
    </div>
  );
}

// 内部组件，处理 key 变化时的重新加载
function VisualizeView({ concept, userLevel }: { concept: string; userLevel: 'beginner' | 'intermediate' | 'advanced' }) {
  return (
    <VisualDesignerView
      concept={concept}
      userLevel={userLevel}
      onNodeClick={(node) => console.log('点击节点:', node)}
    />
  );
}
