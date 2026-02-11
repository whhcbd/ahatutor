import { useState, useEffect } from 'react';
import {
  BarChart3,
  Sparkles,
  Calendar,
  TrendingUp,
  Download,
  FileText,
  AlertCircle,
} from 'lucide-react';
import ReactECharts from 'echarts-for-react';

// API 基础 URL
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

type ReportType = 'daily' | 'weekly' | 'topic' | 'mistake' | 'progress';

// 模拟报告数据
const mockReportData = {
  daily: {
    summary: {
      totalQuestions: 25,
      correctAnswers: 20,
      accuracy: 80,
      studyTime: 45,
    },
    dailyTrend: [
      { date: '08:00', accuracy: 75 },
      { date: '10:00', accuracy: 80 },
      { date: '12:00', accuracy: 85 },
      { date: '14:00', accuracy: 78 },
      { date: '16:00', accuracy: 82 },
      { date: '18:00', accuracy: 88 },
      { date: '20:00', accuracy: 90 },
    ],
    aiAnalysis: {
      weakPoints: ['伴性遗传', '基因突变'],
      recommendations: [
        '建议加强伴性遗传相关知识点的练习',
        '注意基因突变的类型和特点',
        '继续保持良好的学习节奏',
      ],
      priority: ['伴性遗传', '连锁互换'],
    },
  },
  weekly: {
    summary: {
      totalQuestions: 150,
      correctAnswers: 120,
      accuracy: 80,
      studyTime: 320,
    },
    dailyTrend: [
      { date: '周一', accuracy: 72 },
      { date: '周二', accuracy: 75 },
      { date: '周三', accuracy: 78 },
      { date: '周四', accuracy: 82 },
      { date: '周五', accuracy: 85 },
      { date: '周六', accuracy: 88 },
      { date: '周日', accuracy: 90 },
    ],
    aiAnalysis: {
      weakPoints: ['细胞分裂', '遗传规律'],
      recommendations: [
        '本周学习表现稳步提升',
        '建议复习细胞分裂相关内容',
        '继续保持学习热情',
      ],
      priority: ['细胞分裂', '染色体变异'],
    },
  },
  topic: {
    summary: {
      totalQuestions: 200,
      correctAnswers: 155,
      accuracy: 78,
      studyTime: 480,
    },
    dailyTrend: [
      { date: '孟德尔定律', accuracy: 85 },
      { date: '伴性遗传', accuracy: 72 },
      { date: '连锁互换', accuracy: 68 },
      { date: '基因突变', accuracy: 80 },
      { date: '染色体变异', accuracy: 85 },
    ],
    aiAnalysis: {
      weakPoints: ['连锁互换', '伴性遗传'],
      recommendations: [
        '连锁互换是薄弱环节，建议重点学习',
        '伴性遗传题目需要多练习',
        '孟德尔定律掌握较好',
      ],
      priority: ['连锁互换', '伴性遗传', '基因突变'],
    },
  },
  mistake: {
    summary: {
      totalQuestions: 45,
      correctAnswers: 15,
      accuracy: 33,
      studyTime: 90,
    },
    dailyTrend: [
      { date: '低级错误', accuracy: 40 },
      { date: '高级错误', accuracy: 60 },
    ],
    aiAnalysis: {
      weakPoints: ['计算错误', '概念混淆'],
      recommendations: [
        '注意计算过程中的细节',
        '加强对基础概念的理解',
        '建议多做错题回顾',
      ],
      priority: ['伴性遗传', '基因互作'],
    },
  },
  progress: {
    summary: {
      totalQuestions: 500,
      correctAnswers: 400,
      accuracy: 80,
      studyTime: 1200,
    },
    dailyTrend: [
      { date: '第1周', accuracy: 65 },
      { date: '第2周', accuracy: 70 },
      { date: '第3周', accuracy: 75 },
      { date: '第4周', accuracy: 80 },
    ],
    aiAnalysis: {
      weakPoints: ['综合应用'],
      recommendations: [
        '学习进步明显，继续保持',
        '需要加强综合应用能力',
        '建议尝试更复杂的题目',
      ],
      priority: ['综合应用', '实验设计'],
    },
  },
};

export default function ReportPage() {
  const [selectedType, setSelectedType] = useState<ReportType>('daily');
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  // 获取报告数据
  const fetchReport = async (type: ReportType) => {
    setLoading(true);
    try {
      const endpoint = type === 'daily' ? '/api/report/daily' :
                       type === 'weekly' ? '/api/report/weekly' :
                       type === 'mistake' ? '/api/report/mistake' :
                       type === 'progress' ? '/api/report/progress' :
                       '/api/report/topic';

      const response = await fetch(`${API_BASE}${endpoint}`);
      if (!response.ok) throw new Error('Failed to fetch report');

      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error('Error fetching report:', error);
      // 使用模拟数据
      setReportData(mockReportData[type]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport(selectedType);
  }, [selectedType]);

  // 导出报告为 PDF
  const handleExportReport = async () => {
    setExporting(true);
    try {
      // 使用 html2canvas + jsPDF 导出
      const element = document.getElementById('report-content');
      if (!element) {
        throw new Error('找不到报告内容');
      }

      // 动态加载导出库
      const { default: html2canvas } = await import('html2canvas');
      const { default: jsPDF } = await import('jspdf');

      // 将内容转换为 canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const imgWidth = 210; // A4 宽度 (mm)
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`AhaTutor-${selectedType}-report-${new Date().toLocaleDateString('zh-CN')}.pdf`);

    } catch (error) {
      console.error('Export error:', error);
      // 降级方案：打印页面
      window.print();
    } finally {
      setExporting(false);
    }
  };

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
        { value: reportData?.summary?.totalQuestions - reportData?.summary?.correctAnswers || 10, name: '错误题数', itemStyle: { color: '#fbbf24' } },
        { value: reportData?.summary?.correctAnswers || 15, name: '正确题数', itemStyle: { color: '#22c55e' } },
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

  const reportTypeNames: Record<ReportType, string> = {
    daily: '日报告',
    weekly: '周报告',
    topic: '专题报告',
    mistake: '错题报告',
    progress: '进度报告',
  };

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
          <button
            onClick={handleExportReport}
            disabled={exporting || !reportData}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exporting ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                <span>导出中...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>导出报告</span>
              </>
            )}
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
      <div id="report-content">
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">正在生成报告...</p>
          </div>
        ) : reportData ? (
          <div className="space-y-6">
            {/* 报告标题 */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8" />
                <div>
                  <h2 className="text-2xl font-bold">{reportTypeNames[selectedType]}</h2>
                  <p className="text-blue-100">生成时间: {new Date().toLocaleString('zh-CN')}</p>
                </div>
              </div>
            </div>

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

              {/* 正确/错误分布 */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold mb-4">答题分布</h3>
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
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  AI 分析与建议
                </h3>
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
            <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-12 h-12 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold mb-4">暂无报告数据</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              完成一些题目后，系统将自动生成学情报告，包括正确率统计、薄弱点分析、错误类型分布等
            </p>
          </div>
        )}
      </div>

      {/* 打印样式 */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #report-content,
          #report-content * {
            visibility: visible;
          }
          #report-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          button {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
