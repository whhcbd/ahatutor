import { useState, useEffect } from 'react';
import { Eye, Sparkles, Filter } from 'lucide-react';
import { VisualDesignerView } from '../components/Visualization/VisualDesignerView';
import { QuestionPanel } from '../components/Visualization/QuestionPanel';
import { agentApi } from '../api/agent';

// 遗传学知识点列表 - 基于RAG知识库
const GENETICS_TOPICS = [
  // === 基础概念 ===
  '基因',
  '基因型与表型',
  '中心法则',
  '等位基因',
  '纯合子与杂合子',

  // === 孟德尔遗传学 ===
  '孟德尔定律',
  '孟德尔第一定律',
  '孟德尔第二定律',
  '伴性遗传',
  'X连锁遗传',
  '连锁互换',
  '显性与隐性遗传',
  '测交',
  '共显性',
  '不完全显性',

  // === 分子遗传学 ===
  '减数分裂',
  'DNA复制',
  '转录与翻译',
  '基因突变',
  '转录',
  '翻译',
  '核糖体',
  '乳糖操纵子',
  'DNA修复',
  '复制叉',
  '前导链',
  '后随链',
  'DNA聚合酶',
  '启动子',
  '剪接',
  '密码子',
  '基因调控',
  '表观遗传记忆',
  '基因表达调控',

  // === 染色体遗传学 ===
  'DNA双螺旋结构',
  '染色体',
  '有丝分裂',
  '染色体结构',
  '染色体畸变',
  '三体',
  '染色体结构畸变',
  '非整倍体',
  '核型',
  '多倍体',
  '罗伯逊易位',
  '联会',
  '同源重组',
  '染色体组型',

  // === 群体遗传学 ===
  '哈代-温伯格定律',
  '遗传漂变',
  '自然选择',
  '瓶颈效应',
  '奠基者效应',
  '基因流',
  '突变',

  // === 表观遗传学 ===
  'DNA甲基化',
  '组蛋白修饰',
  'RNA干扰',
  '染色质重塑',
  '非编码RNA',
  '基因组印记',

  // === 现代技术 ===
  'PCR技术',
  'CRISPR',
  '基因工程',
  '测序技术',
  '基因克隆',
  '载体系统',
];

// 按分类组织知识点
const TOPIC_CATEGORIES = [
  { name: '基础概念', topics: ['基因', '基因型与表型', '中心法则', '等位基因', '纯合子与杂合子'] },
  { name: '孟德尔遗传学', topics: ['孟德尔定律', '孟德尔第一定律', '孟德尔第二定律', '伴性遗传', 'X连锁遗传', '连锁互换', '显性与隐性遗传', '测交', '共显性', '不完全显性'] },
  { name: '分子遗传学', topics: ['减数分裂', 'DNA复制', '转录与翻译', '基因突变', '转录', '翻译', '核糖体', '乳糖操纵子', 'DNA修复', '复制叉', '前导链', '后随链', 'DNA聚合酶', '启动子', '剪接', '密码子', '基因调控', '表观遗传记忆', '基因表达调控'] },
  { name: '染色体遗传学', topics: ['DNA双螺旋结构', '染色体', '有丝分裂', '染色体结构', '染色体畸变', '三体', '染色体结构畸变', '非整倍体', '核型', '多倍体', '罗伯逊易位', '联会', '同源重组', '染色体组型'] },
  { name: '群体遗传学', topics: ['哈代-温伯格定律', '遗传漂变', '自然选择', '瓶颈效应', '奠基者效应', '基因流', '突变'] },
  { name: '表观遗传学', topics: ['DNA甲基化', '组蛋白修饰', 'RNA干扰', '染色质重塑', '非编码RNA', '基因组印记'] },
  { name: '现代技术', topics: ['PCR技术', 'CRISPR', '基因工程', '测序技术', '基因克隆', '载体系统'] },
];

export default function VisualizePage() {
  const [selectedConcept, setSelectedConcept] = useState('孟德尔第一定律');
  const [useHardcoded, setUseHardcoded] = useState(true);
  const [hardcodedConcepts, setHardcodedConcepts] = useState<Array<{
    concept: string;
    title: string;
    type: string;
    description: string;
  }>>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);

  // 获取硬编码概念列表并预加载
  useEffect(() => {
    agentApi.getHardcodedConcepts().then(async (concepts) => {
      setHardcodedConcepts(concepts);
      // 预加载前几个常用概念的数据
      const quickLoadConcepts = ['孟德尔第一定律', '孟德尔第二定律', '伴性遗传'].slice(0, 3);
      for (const concept of quickLoadConcepts) {
        try {
          await agentApi.designVisualization(concept, {
            includeEnrichment: false,
            includePrerequisites: false,
          });
        } catch (err) {
          console.log(`Preload failed for ${concept}:`, err);
        }
      }
    }).catch(console.error);
  }, []);

  // 过滤出硬编码的概念
  const hardcodedConceptNames = hardcodedConcepts.map(c => c.concept);
  const quickLoadConcepts = GENETICS_TOPICS.filter(t => hardcodedConceptNames.includes(t));

  // 根据选择的分类过滤主题
  const filteredTopics = selectedCategory === 'all'
    ? GENETICS_TOPICS
    : TOPIC_CATEGORIES.find(c => c.name === selectedCategory)?.topics || [];

  return (
    <div className="max-w-7xl mx-auto">
      {/* 顶部标题 */}
      <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">概念可视化</h1>
              <p className="text-gray-600">将抽象的遗传学概念转化为直观的可视化展示</p>
              <p className="text-sm text-blue-600 mt-1">共 {GENETICS_TOPICS.length} 个遗传学知识点</p>
            </div>
          </div>
          <button
            onClick={() => setShowCategoryFilter(!showCategoryFilter)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              showCategoryFilter ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm">分类筛选</span>
          </button>
        </div>
      </div>

      {/* 分类筛选栏 */}
      {showCategoryFilter && (
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              全部 ({GENETICS_TOPICS.length})
            </button>
            {TOPIC_CATEGORIES.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  selectedCategory === category.name
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name} ({category.topics.length})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 控制面板 */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="grid md:grid-cols-4 gap-6">
          {/* 快速加载开关 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">加载模式</label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="quickLoad"
                checked={useHardcoded}
                onChange={(e) => setUseHardcoded(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="quickLoad" className="flex items-center gap-1 cursor-pointer">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <span className="text-sm">快速加载</span>
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {useHardcoded ? `使用预置内容 (${quickLoadConcepts.length}个)` : '使用AI生成'}
            </p>
          </div>

          {/* 概念选择 */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              选择概念
              {selectedCategory !== 'all' && (
                <span className="text-xs text-blue-600 ml-2">
                  ({TOPIC_CATEGORIES.find(c => c.name === selectedCategory)?.name || '全部'})
                </span>
              )}
            </label>
            <select
              value={selectedConcept}
              onChange={(e) => setSelectedConcept(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {filteredTopics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                  {useHardcoded && hardcodedConceptNames.includes(topic) && ' ⚡'}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* 知识点概览卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
        {TOPIC_CATEGORIES.map((category) => {
          // 计算该分类中可快速加载的概念数量
          const quickLoadCount = category.topics.filter(t => hardcodedConceptNames.includes(t)).length;
          return (
            <div
              key={category.name}
              className={`bg-white rounded-lg shadow-sm p-4 text-center cursor-pointer transition-colors ${
                selectedCategory === category.name ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedCategory(category.name)}
            >
              <div className="flex items-center justify-center gap-1">
                <span className="text-2xl font-bold text-blue-600">{category.topics.length}</span>
                {quickLoadCount > 0 && (
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full">⚡ {quickLoadCount}</span>
                )}
              </div>
              <div className="text-xs text-gray-600">{category.name}</div>
            </div>
          );
        })}
      </div>

      {/* 主要内容区域 - 两列布局 */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* 左侧：可视化展示区域 */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-8">
            <VisualizeView
              key={`${selectedConcept}-${useHardcoded}`}
              concept={selectedConcept}
              useHardcoded={useHardcoded}
            />
          </div>
        </div>

        {/* 右侧：提问面板 */}
        <div className="lg:col-span-1">
          <QuestionPanel
            concept={selectedConcept}
            className="sticky top-4"
          />
        </div>
      </div>
    </div>
  );
}

// 内部组件，处理 key 变化时的重新加载
interface VisualizeViewProps {
  concept: string;
  useHardcoded: boolean;
}

function VisualizeView({ concept, useHardcoded }: VisualizeViewProps) {
  return (
    <VisualDesignerView
      concept={concept}
      useHardcoded={useHardcoded}
      onNodeClick={(node) => console.log('点击节点:', node)}
    />
  );
}
