import { useState, useEffect } from 'react';
import {
  BarChart3,
  Sparkles,
  Calendar,
  TrendingUp,
  Download,
} from 'lucide-react';
import ReactECharts from 'echarts-for-react';

// API 基础 URL
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

type ReportType = 'daily' | 'weekly' | 'topic' | 'mistake' | 'progress';

export default function ReportPage() {
  const [selectedType, setSelectedType] = useState<ReportType>('daily');
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 获取报告数据
  const fetchReport = async (type: ReportType) => {
    setLoading(true);
    try {
      const endpoint = type === 'daily' ? '/report/daily' :
                       type === 'weekly' ? '/report/weekly' :
                       type === 'mistake' ? '/report/mistake' :
                       type === 'progress' ? '/report/progress' :
                       '/report/daily';

      const response = await fetch(`${API_BASE}${endpoint}`);
      if (!response.ok) throw new Error('Failed to fetch report');

      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport(selectedType);
  }, [selectedType]);

  // 获取图表配置
  const getAccuracyChartOption = () => ({
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: reportData?.dailyTrend?.map((d: any) => d.date) || ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    },
    yAxis: { type: 'value', max: 100 },
    series: [{
      name: '正确率',
      type: 'line',
      data: reportData?.dailyTrend?.map((d: any) => d.accuracy) || [75, 80, 85, 78, 82, 88, 90],
      smooth: true,
      itemStyle: { color: '#3b82f6' },
      areaStyle: { color: 'rgba(59, 130, 246, 0.1)' },
    }],
  });

  const getPieChartOption = () => ({
    tooltip: { trigger: 'item' },
    legend: { bottom: '5%', left: 'center' },
    series: [{
      name: '错误类型',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2,
      },
      label: { show: false },
      emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold' } },
      data: [
        { value: 10, name: '低级错误', itemStyle: { color: '#fbbf24' } },
        { value: 15, name: '高级错误', itemStyle: { color: '#f87171' } },
      ],
    }],
  });

  const getBarChartOption = () => ({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    xAxis: { type: 'category', data: ['伴性遗传', '连锁互换', '孟德尔定律', '基因突变', '染色体变异'] },
    yAxis: { type: 'value' },
    series: [{
      name: '错题数',
      type: 'bar',
      data: [8, 6, 4, 3, 2],
      itemStyle: {
        color: (params: any) => {
          const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];
          return colors[params.dataIndex];
        },
      },
    }],
  });

  const getRadarChartOption = () => ({
    tooltip: {},
    radar: {
      indicator: [
        { name: '遗传学', max: 100 },
        { name: '细胞生物学', max: 100 },
        { name: '进化论', max: 100 },
        { name: '生态学', max: 100 },
        { name: '分子生物学', max: 100 },
      ],
    },
    series: [{
      name: '知识点掌握度',
      type: 'radar',
      data: [{
        value: [80, 65, 70, 55, 75],
        name: '当前水平',
        areaStyle: { color: 'rgba(139, 92, 246, 0.3)' },
        itemStyle: { color: '#8b5cf6' },
      }],
    }],
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">学情报告</h1>
              <p className="text-gray-600">分析学习情况，发现薄弱环节</p>
            </div>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>导出报告</span>
          </button>
        </div>
      </div>

      {/* 报告类型选择 */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <button
          onClick={() => setSelectedType('daily')}
          className={`p-6 rounded-xl transition-all ${
            selectedType === 'daily'
              ? 'bg-blue-50 border-2 border-blue-500 shadow-sm'
              : 'bg-white border-2 border-transparent hover:border-gray-300'
          }`}
        >
          <Calendar className={`w-8 h-8 mb-3 ${selectedType === 'daily' ? 'text-blue-600' : 'text-gray-400'}`} />
          <h3 className="font-semibold mb-1">日报告</h3>
          <p className="text-sm text-gray-500">当日学习情况</p>
        </button>
        <button
          onClick={() => setSelectedType('weekly')}
          className={`p-6 rounded-xl transition-all ${
            selectedType === 'weekly'
              ? 'bg-blue-50 border-2 border-blue-500 shadow-sm'
              : 'bg-white border-2 border-transparent hover:border-gray-300'
          }`}
        >
          <TrendingUp className={`w-8 h-8 mb-3 ${selectedType === 'weekly' ? 'text-blue-600' : 'text-gray-400'}`} />
          <h3 className="font-semibold mb-1">周报告</h3>
          <p className="text-sm text-gray-500">一周学习总结</p>
        </button>
        <button
          onClick={() => setSelectedType('topic')}
          className={`p-6 rounded-xl transition-all ${
            selectedType === 'topic'
              ? 'bg-blue-50 border-2 border-blue-500 shadow-sm'
              : 'bg-white border-2 border-transparent hover:border-gray-300'
          }`}
        >
          <BarChart3 className={`w-8 h-8 mb-3 ${selectedType === 'topic' ? 'text-blue-600' : 'text-gray-400'}`} />
          <h3 className="font-semibold mb-1">专题报告</h3>
          <p className="text-sm text-gray-500">知识点掌握情况</p>
        </button>
        <button
          onClick={() => setSelectedType('mistake')}
          className={`p-6 rounded-xl transition-all ${
            selectedType === 'mistake'
              ? 'bg-blue-50 border-2 border-blue-500 shadow-sm'
              : 'bg-white border-2 border-transparent hover:border-gray-300'
          }`}
        >
          <Sparkles className={`w-8 h-8 mb-3 ${selectedType === 'mistake' ? 'text-blue-600' : 'text-gray-400'}`} />
          <h3 className="font-semibold mb-1">错题报告</h3>
          <p className="text-sm text-gray-500">错题分析总结</p>
        </button>
      </div>

      {/* 报告内容 */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">正在生成报告...</p>
        </div>
      ) : reportData ? (
        <div className="space-y-6">
          {/* 概览卡片 */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="text-sm text-gray-500 mb-1">总题数</div>
              <div className="text-2xl font-bold">{reportData.summary?.totalQuestions || 0}</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="text-sm text-gray-500 mb-1">正确数</div>
              <div className="text-2xl font-bold text-green-600">
                {reportData.summary?.correctAnswers || 0}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="text-sm text-gray-500 mb-1">正确率</div>
              <div className="text-2xl font-bold text-blue-600">
                {reportData.summary?.accuracy || 0}%
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="text-sm text-gray-500 mb-1">学习时长</div>
              <div className="text-2xl font-bold text-purple-600">
                {reportData.summary?.studyTime || 0} 分钟
              </div>
            </div>
          </div>

          {/* 图表区域 */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* 正确率趋势图 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold mb-4">正确率趋势</h3>
              <ReactECharts option={getAccuracyChartOption()} style={{ height: '300px' }} />
            </div>

            {/* 错误类型分布 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold mb-4">错误类型分布</h3>
              <ReactECharts option={getPieChartOption()} style={{ height: '300px' }} />
            </div>

            {/* 薄弱知识点 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold mb-4">薄弱知识点</h3>
              <ReactECharts option={getBarChartOption()} style={{ height: '300px' }} />
            </div>

            {/* 知识点掌握度雷达图 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold mb-4">知识点掌握度</h3>
              <ReactECharts option={getRadarChartOption()} style={{ height: '300px' }} />
            </div>
          </div>

          {/* AI 分析和建议 */}
          {reportData.aiAnalysis && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold mb-4">AI 分析与建议</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">薄弱环节</h4>
                  <div className="flex flex-wrap gap-2">
                    {reportData.aiAnalysis.weakPoints?.map((point: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                        {point}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">学习建议</h4>
                  <ul className="space-y-2">
                    {reportData.aiAnalysis.recommendations?.map((rec: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-blue-500 mt-1">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">优先复习</h4>
                  <div className="flex flex-wrap gap-2">
                    {reportData.aiAnalysis.priority?.map((item: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-4">开始学习后生成报告</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            完成一些题目后，系统将自动生成学情报告，包括正确率统计、薄弱点分析、错误类型分布等
          </p>
        </div>
      )}
    </div>
  );
}
