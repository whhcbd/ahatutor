import { useState } from 'react';
import { BookOpen, MessageSquare } from 'lucide-react';
import { NarrativeComposerView, InteractiveFlowView } from '../components/Visualization/NarrativeComposerView';

// 遗传学知识点列表 - 基于RAG知识库
const GENETICS_TOPICS = [
  // === 孟德尔遗传学 ===
  '孟德尔定律',
  '孟德尔第一定律',
  '孟德尔第二定律',
  '伴性遗传',
  'X连锁遗传',
  'Y连锁遗传',
  '连锁互换',
  '交叉互换',
  '联会',
  '四分体',
  '质量性状',
  '数量性状',
  '多基因遗传',
  '从性遗传',
  '限性遗传',

  // === 染色体遗传学 ===
  '减数分裂',
  '染色体畸变',
  '非整倍体',
  '三体',
  '单体',
  '染色体结构畸变',
  '缺失',
  '重复',
  '倒位',
  '易位',

  // === 分子遗传学 ===
  'DNA复制',
  'DNA半保留复制',
  '复制叉',
  '前导链',
  '后随链',
  '冈崎片段',
  'DNA聚合酶',
  'DNA连接酶',
  '转录与翻译',
  '中心法则',
  '转录',
  '翻译',
  'RNA聚合酶',
  '启动子',
  '增强子',
  '沉默子',
  '转录因子',
  '剪接',
  '内含子',
  '外显子',
  '可变剪接',
  '多聚腺苷酸化',
  "5'帽子",
  '遗传密码',
  '密码子',
  '反密码子',
  '起始密码子',
  '终止密码子',
  '蛋白质合成',
  '核糖体',
  '基因表达',
  '基因调控',
  '操纵子',
  '乳糖操纵子',
  '基因突变',
  '点突变',
  '移码突变',
  '同义突变',
  '错义突变',
  '无义突变',
  'DNA修复',

  // === 群体遗传学 ===
  '哈代-温伯格定律',
  '基因频率',
  '基因型频率',
  '遗传平衡',
  '遗传漂变',
  '奠基者效应',
  '瓶颈效应',
  '基因流',
  '自然选择',
  '定向选择',
  '稳定选择',
  '破坏性选择',
  '适合度',
  '选择系数',

  // === 表观遗传学 ===
  '表观遗传学',
  'DNA甲基化',
  '组蛋白修饰',
  '染色质重塑',
];

// 按分类组织知识点，便于显示
const TOPIC_CATEGORIES = [
  { name: '孟德尔遗传学', topics: ['孟德尔定律', '孟德尔第一定律', '孟德尔第二定律', '伴性遗传', 'X连锁遗传', 'Y连锁遗传', '连锁互换', '交叉互换', '联会', '四分体', '质量性状', '数量性状', '多基因遗传', '从性遗传', '限性遗传'] },
  { name: '染色体遗传学', topics: ['减数分裂', '染色体畸变', '非整倍体', '三体', '单体', '染色体结构畸变', '缺失', '重复', '倒位', '易位'] },
  { name: '分子遗传学', topics: ['DNA复制', 'DNA半保留复制', '复制叉', '前导链', '后随链', '冈崎片段', 'DNA聚合酶', 'DNA连接酶', '转录与翻译', '中心法则', '转录', '翻译', 'RNA聚合酶', '启动子', '增强子', '沉默子', '转录因子', '剪接', '内含子', '外显子', '可变剪接', '多聚腺苷酸化', "5'帽子", '遗传密码', '密码子', '反密码子', '起始密码子', '终止密码子', '蛋白质合成', '核糖体', '基因表达', '基因调控', '操纵子', '乳糖操纵子', '基因突变', '点突变', '移码突变', '同义突变', '错义突变', '无义突变', 'DNA修复'] },
  { name: '群体遗传学', topics: ['哈代-温伯格定律', '基因频率', '基因型频率', '遗传平衡', '遗传漂变', '奠基者效应', '瓶颈效应', '基因流', '自然选择', '定向选择', '稳定选择', '破坏性选择', '适合度', '选择系数'] },
  { name: '表观遗传学', topics: ['表观遗传学', 'DNA甲基化', '组蛋白修饰', '染色质重塑'] },
];

type ViewMode = 'narrative' | 'interactive';

export default function NarrativePage() {
  const [selectedConcept, setSelectedConcept] = useState('伴性遗传');
  const [viewMode, setViewMode] = useState<ViewMode>('narrative');
  const [showAllTopics, setShowAllTopics] = useState(false);

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
            <p className="text-sm text-purple-600 mt-1">共 {GENETICS_TOPICS.length} 个遗传学知识点</p>
          </div>
        </div>
      </div>

      {/* 控制面板 */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="grid md:grid-cols-4 gap-6">
          {/* 概念选择 */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              选择概念
              <button
                onClick={() => setShowAllTopics(!showAllTopics)}
                className="ml-2 text-xs text-purple-600 hover:text-purple-700"
              >
                {showAllTopics ? '收起分类' : '查看全部分类'}
              </button>
            </label>
            {showAllTopics ? (
              // 分类显示
              <div className="space-y-3 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {TOPIC_CATEGORIES.map((category) => (
                  <div key={category.name}>
                    <div className="text-xs font-semibold text-gray-500 mb-1">{category.name}</div>
                    <select
                      value={selectedConcept}
                      onChange={(e) => {
                        setSelectedConcept(e.target.value);
                        setShowAllTopics(false);
                      }}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {category.topics.map((topic) => (
                        <option key={topic} value={topic}>
                          {topic}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            ) : (
              // 简洁下拉选择
              <select
                value={selectedConcept}
                onChange={(e) => setSelectedConcept(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <optgroup label="孟德尔遗传学">
                  {TOPIC_CATEGORIES[0].topics.map((topic) => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </optgroup>
                <optgroup label="染色体遗传学">
                  {TOPIC_CATEGORIES[1].topics.map((topic) => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </optgroup>
                <optgroup label="分子遗传学">
                  {TOPIC_CATEGORIES[2].topics.slice(0, 15).map((topic) => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                  <option disabled>--- 更多分子遗传学概念 ---</option>
                  {TOPIC_CATEGORIES[2].topics.slice(15).map((topic) => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </optgroup>
                <optgroup label="群体遗传学">
                  {TOPIC_CATEGORIES[3].topics.map((topic) => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </optgroup>
                <optgroup label="表观遗传学">
                  {TOPIC_CATEGORIES[4].topics.map((topic) => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </optgroup>
              </select>
            )}
          </div>

          {/* 视图模式 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">展示模式</label>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('narrative')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm transition-colors ${
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
                className={`flex-1 py-2 px-3 rounded-lg text-sm transition-colors ${
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

      {/* 知识点概览卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
        {TOPIC_CATEGORIES.map((category) => (
          <div key={category.name} className="bg-white rounded-lg shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{category.topics.length}</div>
            <div className="text-xs text-gray-600">{category.name}</div>
          </div>
        ))}
      </div>

      {/* 内容展示区域 */}
      <div className="bg-white rounded-xl shadow-sm p-8">
        {viewMode === 'narrative' ? (
          <NarrativeView
            key={`${selectedConcept}-narrative`}
            concept={selectedConcept}
          />
        ) : (
          <InteractiveView
            key={`${selectedConcept}-interactive`}
            concept={selectedConcept}
          />
        )}
      </div>
    </div>
  );
}

// 学习叙事视图
function NarrativeView({ concept }: { concept: string }) {
  return <NarrativeComposerView concept={concept} />;
}

// 互动流程视图
function InteractiveView({ concept }: { concept: string }) {
  return <InteractiveFlowView concept={concept} />;
}
