import { useState } from 'react';

interface TestCrossVisualizationProps {
  data: any;
  colors?: Record<string, string>;
}

export function TestCrossVisualization({ data, colors }: TestCrossVisualizationProps) {
  const [activeTab, setActiveTab] = useState<'principle' | 'comparison' | 'application'>('principle');
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);

  const defaultColors = {
    dominant: colors?.dominant || '#4CAF50',
    recessive: colors?.recessive || '#FF9800',
    heterozygous: colors?.heterozygous || '#2196F3',
    unknown: colors?.unknown || '#9C27B0',
  };

  const testCrosses = data?.testCrosses || [];
  const applications = data?.applications || [];
  const advantages = data?.advantages || [];
  const limitations = data?.limitations || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('principle')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'principle'
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          测交原理
        </button>
        <button
          onClick={() => setActiveTab('comparison')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'comparison'
              ? 'bg-purple-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          对比分析
        </button>
        <button
          onClick={() => setActiveTab('application')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'application'
              ? 'bg-green-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          实际应用
        </button>
      </div>

      {activeTab === 'principle' && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-blue-800">测交原理</h3>
          
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-3">什么是测交？</h4>
            <p className="text-gray-700 leading-relaxed">
              测交是将<strong>未知基因型</strong>的个体与<strong>隐性纯合子</strong>进行杂交，
              通过观察后代的表型比例来推断待测个体的基因型。
            </p>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-3">为什么用隐性纯合子？</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>隐性纯合子只产生一种配子（a），不会影响后代表型的观察</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>后代的表型直接反映待测个体产生的配子类型</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>可以准确区分显性纯合子和杂合子</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-3">测交模式</h4>
            <div className="flex justify-center">
              <svg width="400" height="200" viewBox="0 0 400 200">
                <text x="200" y="20" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1976D2">测交杂交模式</text>
                
                <text x="100" y="60" textAnchor="middle" fontSize="12" fill="#666">待测个体</text>
                <text x="100" y="80" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#9C27B0">A?</text>
                
                <text x="200" y="70" textAnchor="middle" fontSize="20" fill="#666">×</text>
                
                <text x="300" y="60" textAnchor="middle" fontSize="12" fill="#666">隐性纯合子</text>
                <text x="300" y="80" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#FF9800">aa</text>
                
                <line x1="100" y1="95" x2="100" y2="110" stroke="#666" strokeWidth="1" strokeDasharray="4"/>
                <line x1="300" y1="95" x2="300" y2="110" stroke="#666" strokeWidth="1" strokeDasharray="4"/>
                <line x1="100" y1="110" x2="300" y2="110" stroke="#666" strokeWidth="1" strokeDasharray="4"/>
                <line x1="200" y1="110" x2="200" y2="125" stroke="#666" strokeWidth="1" strokeDasharray="4"/>
                
                <text x="200" y="145" textAnchor="middle" fontSize="12" fill="#666">测交后代</text>
                <text x="200" y="165" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1976D2">Aa 或 aa</text>
              </svg>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'comparison' && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-purple-800">对比分析</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            {testCrosses.map((test: any, index: number) => (
              <div key={index} className="bg-white rounded-lg p-4 border-2 border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-3">{test.name}</h4>
                
                <div className="flex justify-center mb-4">
                  <svg width="250" height="180" viewBox="0 0 250 180">
                    <text x="125" y="20" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#7C3AED">{test.cross}</text>
                    
                    <g transform="translate(50, 40)">
                      <rect x="0" y="0" width="50" height="40" fill="#E8EAF6" stroke="#9C27B0" strokeWidth="2" rx="4"/>
                      <text x="25" y="25" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#9C27B0">{test.parentGenotype}</text>
                      <text x="25" y="55" textAnchor="middle" fontSize="10" fill="#666">待测</text>
                    </g>
                    
                    <text x="125" y="65" textAnchor="middle" fontSize="18" fill="#666">×</text>
                    
                    <g transform="translate(150, 40)">
                      <rect x="0" y="0" width="50" height="40" fill="#FFF3E0" stroke="#FF9800" strokeWidth="2" rx="4"/>
                      <text x="25" y="25" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#FF9800">{test.testerGenotype}</text>
                      <text x="25" y="55" textAnchor="middle" fontSize="10" fill="#666">隐性</text>
                    </g>
                    
                    <line x1="125" y1="95" x2="125" y2="110" stroke="#666" strokeWidth="1" strokeDasharray="4"/>
                    
                    <g transform="translate(25, 115)">
                      <rect x="0" y="0" width="200" height="50" fill={test.parentGenotype === 'AA' ? '#E8F5E9' : '#E3F2FD'} stroke={test.parentGenotype === 'AA' ? '#4CAF50' : '#2196F3'} strokeWidth="2" rx="4"/>
                      <text x="100" y="20" textAnchor="middle" fontSize="12" fontWeight="bold" fill={test.parentGenotype === 'AA' ? '#2E7D32' : '#1565C0'}>{test.offspringRatio}</text>
                      <text x="100" y="38" textAnchor="middle" fontSize="11" fill="#666">{test.offspringPhenotype}</text>
                    </g>
                    
                    <g transform="translate(50, 170)">
                      <text x="75" y="0" textAnchor="middle" fontSize="10" fill="#7C3AED" fontWeight="bold">结论: {test.conclusion}</text>
                    </g>
                  </svg>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-3">关键区别</h4>
            <table className="w-full text-sm">
              <thead className="bg-purple-100">
                <tr>
                  <th className="px-4 py-2 text-left">特征</th>
                  <th className="px-4 py-2 text-left">显性纯合子 (AA)</th>
                  <th className="px-4 py-2 text-left">杂合子 (Aa)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-2 font-medium">配子类型</td>
                  <td className="px-4 py-2">只有 A</td>
                  <td className="px-4 py-2">A 和 a (各1/2)</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2 font-medium">测交后代</td>
                  <td className="px-4 py-2">全部 Aa</td>
                  <td className="px-4 py-2">1/2 Aa : 1/2 aa</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2 font-medium">后代表型</td>
                  <td className="px-4 py-2">全部显性</td>
                  <td className="px-4 py-2">1/2 显性 : 1/2 隐性</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium">鉴定结果</td>
                  <td className="px-4 py-2 text-green-600">显性纯合子</td>
                  <td className="px-4 py-2 text-blue-600">杂合子</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'application' && (
        <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-green-800">实际应用</h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            {applications.map((app: any, index: number) => (
              <div key={index} className="bg-white rounded-lg p-4 border-2 border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">{app.scenario}</h4>
                <p className="text-sm text-gray-700 mb-2">{app.description}</p>
                <p className="text-xs text-green-600">示例: {app.example}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border-2 border-green-300">
              <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">✓</span>
                优势
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                {advantages.map((adv: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg p-4 border-2 border-orange-300">
              <h4 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm">!</span>
                限制
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                {limitations.map((limit: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span>{limit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-3">应用要点</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>选择合适的测试者：</strong>确保隐性纯合子基因型正确</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>观察足够数量的后代：</strong>样本量越大，结果越可靠</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>注意环境影响：</strong>表型可能受环境因素影响，需综合判断</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>结合其他方法：</strong>可结合分子标记等现代技术提高准确性</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
