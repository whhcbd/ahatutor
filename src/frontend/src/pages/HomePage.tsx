import { Link } from 'react-router-dom';
import { Zap, Network, BookX, BarChart3, Sparkles, Target, BookOpen } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: '速通模式',
    description: '沉浸式刷题体验，AI 出题、智能判断、分级解析，快速掌握知识点',
    path: '/speed',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Network,
    title: '深度模式',
    description: '反向知识树自动构建，知识图谱导航，艾宾浩斯复习计划',
    path: '/depth',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: BookX,
    title: '错题管理',
    description: '拍照上传错题，OCR 智能识别，举一反三变式训练',
    path: '/mistakes',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: BarChart3,
    title: '学情报告',
    description: '日/周/专题报告，薄弱点分析，智能复习建议',
    path: '/report',
    color: 'from-green-500 to-emerald-500',
  },
];

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium">
          <Sparkles className="w-4 h-4" />
          <span>AI 驱动的遗传学学习平台</span>
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          实现真正的顿悟时刻
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          自然语言输入 + AI 理解 + 实时可视化 + 交互探索
          <br />
          让遗传学学习变得简单有趣
        </p>
        <div className="flex items-center justify-center space-x-4">
          <Link to="/speed" className="btn-primary text-lg px-8 py-3">
            开始学习
          </Link>
          <Link to="/depth" className="btn-secondary text-lg px-8 py-3">
            探索知识图谱
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-12">核心功能</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.path}
                to={feature.path}
                className="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                <div className="relative p-8">
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${feature.color} text-white mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
        <h2 className="text-3xl font-bold text-center mb-12">工作原理</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Target className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold">1. 提出问题</h3>
            <p className="text-gray-600">自然语言输入你想学习的遗传学概念</p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold">2. AI 分析</h3>
            <p className="text-gray-600">六 Agent 协作，构建知识图谱，生成学习路径</p>
          </div>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto">
              <BookOpen className="w-8 h-8 text-pink-600" />
            </div>
            <h3 className="text-lg font-semibold">3. 交互学习</h3>
            <p className="text-gray-600">可视化展示，刷题练习，实现顿悟时刻</p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: '遗传学知识点', value: '100+' },
          { label: 'AI Agent', value: '6' },
          { label: '题目解析等级', value: '5' },
          { label: '复习间隔', value: '8' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {stat.value}
            </div>
            <div className="text-gray-600 mt-2">{stat.label}</div>
          </div>
        ))}
      </section>
    </div>
  );
}
