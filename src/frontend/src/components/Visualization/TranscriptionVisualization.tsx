import { useState } from 'react';

interface TranscriptionVisualizationProps {
  data: any;
  colors?: Record<string, string>;
}

export function TranscriptionVisualization({ data, colors }: TranscriptionVisualizationProps) {
  const [activeTab, setActiveTab] = useState<'process' | 'components' | 'stages'>('process');
  const [currentStage, setCurrentStage] = useState(0);

  const defaultColors = {
    dnaStrand1: colors?.dnaStrand1 || '#3B82F6',
    dnaStrand2: colors?.dnaStrand2 || '#EF4444',
    rnaStrand: colors?.rnaStrand || '#8B5CF6',
    polymerase: colors?.polymerase || '#10B981',
    promoter: colors?.promoter || '#F59E0B',
  };

  const stages = data?.stages || [
    { name: '启动', description: 'RNA聚合酶识别启动子序列' },
    { name: '延伸', description: 'RNA链沿DNA模板延伸' },
    { name: '终止', description: 'RNA聚合酶到达终止子序列' },
  ];

  const components = data?.components || [
    { name: 'RNA聚合酶', role: '催化RNA合成' },
    { name: '启动子', role: 'RNA聚合酶结合位点' },
    { name: '终止子', role: '转录结束信号' },
    { name: 'DNA模板链', role: '转录的模板' },
    { name: 'mRNA', role: '转录产物' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('process')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'process'
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          转录过程
        </button>
        <button
          onClick={() => setActiveTab('components')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'components'
              ? 'bg-purple-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          关键组件
        </button>
        <button
          onClick={() => setActiveTab('stages')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'stages'
              ? 'bg-green-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          分步演示
        </button>
      </div>

      {activeTab === 'process' && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-blue-800">转录过程概述</h3>
          
          <div className="flex justify-center">
            <svg width="600" height="250" viewBox="0 0 600 250">
              <defs>
                <pattern id="dna-pattern" patternUnits="userSpaceOnUse" width="10" height="10">
                  <path d="M0,5 Q5,0 10,5 T20,5" fill="none" stroke="#3B82F6" strokeWidth="1" opacity="0.3"/>
                </pattern>
              </defs>

              <text x="300" y="25" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1976D2">转录过程示意图</text>

              <g transform="translate(50, 50)">
                <text x="250" y="15" textAnchor="middle" fontSize="12" fill="#666">DNA双链解旋</text>
                
                <g transform="translate(50, 30)">
                  <rect x="0" y="0" width="200" height="40" fill="#E3F2FD" stroke={defaultColors.dnaStrand1} strokeWidth="2" rx="4"/>
                  <text x="100" y="25" textAnchor="middle" fontSize="12" fontWeight="bold" fill={defaultColors.dnaStrand1}>DNA模板链</text>
                </g>
                
                <g transform="translate(300, 30)">
                  <rect x="0" y="0" width="200" height="40" fill="#FFEBEE" stroke={defaultColors.dnaStrand2} strokeWidth="2" rx="4"/>
                  <text x="100" y="25" textAnchor="middle" fontSize="12" fontWeight="bold" fill={defaultColors.dnaStrand2}>DNA非模板链</text>
                </g>
              </g>

              <g transform="translate(50, 110)">
                <text x="250" y="15" textAnchor="middle" fontSize="12" fill="#666">RNA聚合酶催化合成</text>
                
                <g transform="translate(150, 30)">
                  <ellipse cx="150" cy="30" rx="120" ry="40" fill={defaultColors.polymerase} fillOpacity="0.2" stroke={defaultColors.polymerase} strokeWidth="2"/>
                  <text x="150" y="35" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#059669">RNA聚合酶</text>
                </g>
                
                <g transform="translate(100, 80)">
                  <rect x="0" y="0" width="300" height="30" fill="#EDE9FE" stroke={defaultColors.rnaStrand} strokeWidth="2" rx="4"/>
                  <text x="150" y="20" textAnchor="middle" fontSize="12" fontWeight="bold" fill={defaultColors.rnaStrand}>mRNA正在合成 →</text>
                </g>
              </g>
            </svg>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-3">转录特点</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>方向性：</strong>RNA聚合酶沿DNA模板链3'→5'方向移动</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>RNA合成：</strong>新合成的RNA链为5'→3'方向</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>碱基配对：</strong>A-U, T-A, G-C</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>起始：</strong>RNA聚合酶识别并结合启动子</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>终止：</strong>RNA聚合酶到达终止子序列后释放</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'components' && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-purple-800">关键组件</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {components.map((comp: any, index: number) => (
              <div key={index} className="bg-white rounded-lg p-4 border-2 border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2">{comp.name}</h4>
                <p className="text-sm text-gray-700">{comp.role}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-3">组件功能</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span><strong>RNA聚合酶：</strong>负责解开DNA双链并催化RNA链的合成</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span><strong>启动子：</strong>转录起始的信号序列，决定转录开始的位置</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span><strong>终止子：</strong>转录结束的信号序列</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span><strong>转录因子：</strong>辅助RNA聚合酶识别启动子</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'stages' && (
        <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-green-800">分步演示</h3>
          
          <div className="flex justify-center gap-2 mb-4">
            {stages.map((_: any, index: number) => (
              <button
                key={index}
                onClick={() => setCurrentStage(index)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currentStage === index
                    ? 'bg-green-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                阶段 {index + 1}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-lg p-6 border-2 border-green-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {currentStage + 1}
              </div>
              <div>
                <h4 className="font-semibold text-green-800 text-lg">{stages[currentStage]?.name || '未知阶段'}</h4>
                <p className="text-gray-600">{stages[currentStage]?.description || '暂无描述'}</p>
              </div>
            </div>

            {currentStage === 0 && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <svg width="400" height="120" viewBox="0 0 400 120">
                    <text x="200" y="15" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1976D2">启动阶段</text>
                    
                    <rect x="50" y="30" width="300" height="60" fill="#FFF3E0" stroke={defaultColors.promoter} strokeWidth="3" rx="4"/>
                    <text x="200" y="55" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#E65100">启动子</text>
                    <text x="200" y="75" textAnchor="middle" fontSize="11" fill="#666">RNA聚合酶结合位点</text>
                  </svg>
                </div>
                <p className="text-sm text-gray-700 text-center">
                  RNA聚合酶识别并结合启动子序列，准备开始转录
                </p>
              </div>
            )}

            {currentStage === 1 && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <svg width="400" height="150" viewBox="0 0 400 150">
                    <text x="200" y="15" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1976D2">延伸阶段</text>
                    
                    <g transform="translate(50, 30)">
                      <rect x="0" y="0" width="300" height="20" fill="#E3F2FD" stroke={defaultColors.dnaStrand1} strokeWidth="2"/>
                      <text x="150" y="15" textAnchor="middle" fontSize="11" fill="#1976D2">DNA模板链</text>
                    </g>
                    
                    <g transform="translate(50, 60)">
                      <ellipse cx="150" cy="20" rx="80" ry="25" fill={defaultColors.polymerase} fillOpacity="0.2" stroke={defaultColors.polymerase} strokeWidth="2"/>
                      <text x="150" y="25" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#059669">RNA聚合酶</text>
                    </g>
                    
                    <g transform="translate(50, 100)">
                      <rect x="0" y="0" width="200" height="20" fill="#EDE9FE" stroke={defaultColors.rnaStrand} strokeWidth="2"/>
                      <text x="100" y="15" textAnchor="middle" fontSize="11" fill={defaultColors.rnaStrand}>新合成的mRNA →</text>
                    </g>
                  </svg>
                </div>
                <p className="text-sm text-gray-700 text-center">
                  RNA链沿DNA模板延伸，DNA双链在聚合酶前方解旋
                </p>
              </div>
            )}

            {currentStage === 2 && (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <svg width="400" height="150" viewBox="0 0 400 150">
                    <text x="200" y="15" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1976D2">终止阶段</text>
                    
                    <g transform="translate(50, 30)">
                      <rect x="0" y="0" width="300" height="40" fill="#E3F2FD" stroke={defaultColors.dnaStrand1} strokeWidth="2" rx="4"/>
                      <text x="150" y="25" textAnchor="middle" fontSize="12" fontWeight="bold" fill={defaultColors.dnaStrand1}>DNA模板链</text>
                    </g>
                    
                    <g transform="translate(50, 90)">
                      <rect x="0" y="0" width="280" height="30" fill="#EDE9FE" stroke={defaultColors.rnaStrand} strokeWidth="2" rx="4"/>
                      <text x="140" y="20" textAnchor="middle" fontSize="12" fontWeight="bold" fill={defaultColors.rnaStrand}>完整的mRNA分子</text>
                    </g>
                    
                    <text x="350" y="50" textAnchor="middle" fontSize="10" fill="#666">终止子</text>
                  </svg>
                </div>
                <p className="text-sm text-gray-700 text-center">
                  RNA聚合酶到达终止子序列，释放新合成的mRNA
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
