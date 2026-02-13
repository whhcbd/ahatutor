import { useState } from 'react';

interface MitosisVisualizationProps {
  data: any;
  colors?: Record<string, string>;
}

export function MitosisVisualization({ data, colors }: MitosisVisualizationProps) {
  const [activeTab, setActiveTab] = useState<'stages' | 'comparison' | 'significance'>('stages');
  const [currentStage, setCurrentStage] = useState(0);

  const defaultColors = {
    prophase: colors?.prophase || '#EF4444',
    metaphase: colors?.metaphase || '#F59E0B',
    anaphase: colors?.anaphase || '#10B981',
    telophase: colors?.telophase || '#3B82F6',
    cytokinesis: colors?.cytokinesis || '#8B5CF6',
  };

  const stages = data?.stages || [
    {
      name: '前期',
      description: '染色体凝缩，核膜开始解体',
      keyEvents: ['染色体凝缩', '核膜解体', '纺锤体形成'],
    },
    {
      name: '中期',
      description: '染色体排列在细胞中央',
      keyEvents: ['染色体排列', '着丝粒附着纺锤丝', '形成赤道板'],
    },
    {
      name: '后期',
      description: '姐妹染色单体分离并向两极移动',
      keyEvents: ['着丝粒分裂', '染色单体分离', '向两极移动'],
    },
    {
      name: '末期',
      description: '两组染色体到达细胞两极，核膜重新形成',
      keyEvents: ['核膜重新形成', '染色体解旋', '纺锤体解体'],
    },
    {
      name: '胞质分裂',
      description: '细胞质分裂，形成两个子细胞',
      keyEvents: ['细胞膜内陷', '形成两个子细胞', '细胞质分裂'],
    },
  ];

  const comparisonData = data?.comparison || [
    { phase: '有丝分裂', type: '体细胞分裂', result: '2个相同子细胞' },
    { phase: '减数分裂', type: '生殖细胞分裂', result: '4个不同配子' },
  ];

  const significance = data?.significance || [
    { point: '遗传物质均分', description: '确保子细胞获得相同遗传信息' },
    { point: '维持物种稳定', description: '保持染色体数目恒定' },
    { point: '生物体生长', description: '促进组织生长和修复' },
    { point: '无性繁殖', description: '单细胞生物的繁殖方式' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('stages')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'stages'
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          分期演示
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
          onClick={() => setActiveTab('significance')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'significance'
              ? 'bg-green-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          生物学意义
        </button>
      </div>

      {activeTab === 'stages' && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-blue-800">有丝分裂分期</h3>
          
          <div className="flex justify-center gap-2 mb-4">
            {stages.map((_: any, index: number) => (
              <button
                key={index}
                onClick={() => setCurrentStage(index)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currentStage === index
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {stages[index]?.name}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-lg p-6 border-2 border-blue-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {currentStage + 1}
              </div>
              <div>
                <h4 className="font-semibold text-blue-800 text-lg">{stages[currentStage]?.name}</h4>
                <p className="text-gray-600">{stages[currentStage]?.description}</p>
              </div>
            </div>

            <div className="flex justify-center">
              <svg width="500" height="300" viewBox="0 0 500 300">
                <text x="250" y="20" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1976D2">{stages[currentStage]?.name}</text>

                {currentStage === 0 && (
                  <g transform="translate(100, 40)">
                    <ellipse cx="150" cy="120" rx="120" ry="100" fill="#FEE2E2" stroke="#EF4444" strokeWidth="2"/>
                    <text x="150" y="60" textAnchor="middle" fontSize="11" fill="#666">细胞核</text>
                    
                    <g transform="translate(80, 90)">
                      <ellipse cx="35" cy="30" rx="12" ry="20" fill="#EF4444" fillOpacity="0.3" stroke="#EF4444" strokeWidth="2"/>
                      <text x="35" y="60" textAnchor="middle" fontSize="9" fill="#666">染色体</text>
                    </g>
                    <g transform="translate(140, 90)">
                      <ellipse cx="35" cy="30" rx="12" ry="20" fill="#EF4444" fillOpacity="0.3" stroke="#EF4444" strokeWidth="2"/>
                    </g>
                    <g transform="translate(200, 90)">
                      <ellipse cx="35" cy="30" rx="12" ry="20" fill="#EF4444" fillOpacity="0.3" stroke="#EF4444" strokeWidth="2"/>
                    </g>
                    
                    <g transform="translate(250, 100)">
                      <line x1="0" y1="0" x2="30" y2="-40" stroke="#F59E0B" strokeWidth="2"/>
                      <line x1="0" y1="0" x2="30" y2="40" stroke="#F59E0B" strokeWidth="2"/>
                      <circle cx="0" cy="0" r="5" fill="#F59E0B"/>
                      <text x="15" y="-50" textAnchor="middle" fontSize="9" fill="#666">纺锤体</text>
                    </g>
                  </g>
                )}

                {currentStage === 1 && (
                  <g transform="translate(100, 40)">
                    <ellipse cx="150" cy="120" rx="120" ry="100" fill="#FFF3E0" stroke="#F59E0B" strokeWidth="2"/>
                    
                    <g transform="translate(100, 80)">
                      <ellipse cx="50" cy="40" rx="15" ry="25" fill="#F59E0B" fillOpacity="0.3" stroke="#F59E0B" strokeWidth="2"/>
                      <text x="50" y="75" textAnchor="middle" fontSize="9" fill="#666">染色体</text>
                    </g>
                    <g transform="translate(180, 80)">
                      <ellipse cx="50" cy="40" rx="15" ry="25" fill="#F59E0B" fillOpacity="0.3" stroke="#F59E0B" strokeWidth="2"/>
                    </g>
                    <g transform="translate(260, 80)">
                      <ellipse cx="50" cy="40" rx="15" ry="25" fill="#F59E0B" fillOpacity="0.3" stroke="#F59E0B" strokeWidth="2"/>
                    </g>
                    
                    <text x="150" y="230" textAnchor="middle" fontSize="10" fill="#666">染色体排列在中央赤道板上</text>
                  </g>
                )}

                {currentStage === 2 && (
                  <g transform="translate(100, 40)">
                    <ellipse cx="150" cy="120" rx="120" ry="100" fill="#D1FAE5" stroke="#10B981" strokeWidth="2"/>
                    
                    <g transform="translate(60, 80)">
                      <ellipse cx="40" cy="40" rx="12" ry="20" fill="#10B981" fillOpacity="0.3" stroke="#10B981" strokeWidth="2"/>
                      <text x="40" y="75" textAnchor="middle" fontSize="9" fill="#666">染色单体</text>
                    </g>
                    <g transform="translate(200, 80)">
                      <ellipse cx="40" cy="40" rx="12" ry="20" fill="#10B981" fillOpacity="0.3" stroke="#10B981" strokeWidth="2"/>
                    </g>
                    
                    <text x="150" y="230" textAnchor="middle" fontSize="10" fill="#666">姐妹染色单体分离向两极移动</text>
                  </g>
                )}

                {currentStage === 3 && (
                  <g transform="translate(100, 40)">
                    <ellipse cx="80" cy="120" rx="60" ry="50" fill="#E3F2FD" stroke="#3B82F6" strokeWidth="2"/>
                    <ellipse cx="220" cy="120" rx="60" ry="50" fill="#E3F2FD" stroke="#3B82F6" strokeWidth="2"/>
                    
                    <text x="80" y="60" textAnchor="middle" fontSize="10" fill="#666">新核膜</text>
                    <text x="220" y="60" textAnchor="middle" fontSize="10" fill="#666">新核膜</text>
                    
                    <g transform="translate(60, 150)">
                      <ellipse cx="20" cy="15" rx="8" ry="12" fill="#3B82F6" fillOpacity="0.3" stroke="#3B82F6" strokeWidth="1.5"/>
                    </g>
                    <g transform="translate(200, 150)">
                      <ellipse cx="20" cy="15" rx="8" ry="12" fill="#3B82F6" fillOpacity="0.3" stroke="#3B82F6" strokeWidth="1.5"/>
                    </g>
                    
                    <text x="150" y="230" textAnchor="middle" fontSize="10" fill="#666">核膜重新形成，染色体解旋</text>
                  </g>
                )}

                {currentStage === 4 && (
                  <g transform="translate(100, 40)">
                    <ellipse cx="70" cy="120" rx="55" ry="45" fill="#EDE9FE" stroke="#8B5CF6" strokeWidth="2"/>
                    <ellipse cx="230" cy="120" rx="55" ry="45" fill="#EDE9FE" stroke="#8B5CF6" strokeWidth="2"/>
                    
                    <text x="70" y="60" textAnchor="middle" fontSize="10" fill="#666">子细胞1</text>
                    <text x="230" y="60" textAnchor="middle" fontSize="10" fill="#666">子细胞2</text>
                    
                    <text x="150" y="230" textAnchor="middle" fontSize="10" fill="#666">胞质分裂完成，形成两个子细胞</text>
                  </g>
                )}
              </svg>
            </div>

            <div className="mt-4">
              <h5 className="font-semibold text-blue-800 mb-2">关键事件：</h5>
              <ul className="space-y-1 text-sm text-gray-700">
                {(stages[currentStage]?.keyEvents || []).map((event: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span>{event}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'comparison' && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-purple-800">有丝分裂 vs 减数分裂</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-purple-100">
                <tr>
                  <th className="px-4 py-2 text-left">特征</th>
                  <th className="px-4 py-2 text-left">有丝分裂</th>
                  <th className="px-4 py-2 text-left">减数分裂</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-2 font-medium">分裂类型</td>
                  <td className="px-4 py-2">1次分裂</td>
                  <td className="px-4 py-2">2次连续分裂</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2 font-medium">分裂细胞</td>
                  <td className="px-4 py-2">体细胞</td>
                  <td className="px-4 py-2">生殖细胞</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2 font-medium">子细胞数目</td>
                  <td className="px-4 py-2 text-blue-600">2个</td>
                  <td className="px-4 py-2 text-purple-600">4个</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2 font-medium">子细胞特性</td>
                  <td className="px-4 py-2 text-blue-600">与亲代相同</td>
                  <td className="px-4 py-2 text-purple-600">各不相同</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2 font-medium">染色体数目</td>
                  <td className="px-4 py-2 text-blue-600">保持不变 (2n)</td>
                  <td className="px-4 py-2 text-purple-600">减半 (n)</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium">基因重组</td>
                  <td className="px-4 py-2 text-blue-600">不发生</td>
                  <td className="px-4 py-2 text-purple-600">发生（减数分裂I）</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'significance' && (
        <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-green-800">生物学意义</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            {significance.map((item: any, index: number) => (
              <div key={index} className="bg-white rounded-lg p-4 border-2 border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">{item.point}</h4>
                <p className="text-sm text-gray-700">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-3">实际应用</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>组织生长：</strong>促进个体生长和发育</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>组织修复：</strong>替换受损或衰老的细胞</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>无性繁殖：</strong>单细胞生物的繁殖方式</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>克隆技术：</strong>利用有丝分裂原理进行细胞克隆</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
