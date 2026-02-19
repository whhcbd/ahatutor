import { useState } from 'react';
import { VisualizationColors } from '../../constants/visualization-colors';

interface DNAReplicationVisualizationProps {
  data: any;
  colors?: Record<string, string>;
}

export function DNAReplicationVisualization({ data, colors }: DNAReplicationVisualizationProps) {
  const [activeTab, setActiveTab] = useState<'principle' | 'process' | 'semiconservative'>('principle');
  const [currentStep, setCurrentStep] = useState(0);

  const defaultColors = {
    parentalStrand1: colors?.parentalStrand1 || VisualizationColors.gene,
    parentalStrand2: colors?.parentalStrand2 || VisualizationColors.affected,
    newStrand1: colors?.newStrand1 || VisualizationColors.normal,
    newStrand2: colors?.newStrand2 || VisualizationColors.hover,
    origin: colors?.origin || VisualizationColors.nodePrinciple,
  };

  const steps = data?.steps || [
    { name: '解旋', description: 'DNA双链在复制起点解旋' },
    { name: '复制', description: 'DNA聚合酶沿模板链合成新链' },
    { name: '完成', description: '形成两个DNA双螺旋分子' },
  ];

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
          半保留复制原理
        </button>
        <button
          onClick={() => setActiveTab('process')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'process'
              ? 'bg-purple-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          复制过程
        </button>
        <button
          onClick={() => setActiveTab('semiconservative')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'semiconservative'
              ? 'bg-green-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          实验证据
        </button>
      </div>

      {activeTab === 'principle' && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-blue-800">半保留复制原理</h3>
          
          <div className="flex justify-center">
            <svg width="600" height="300" viewBox="0 0 600 300">
              <defs>
                <pattern id="dna-strand" patternUnits="userSpaceOnUse" width="10" height="10">
                  <path d="M0,5 Q5,0 10,5 T20,5" fill="none" stroke="#3B82F6" strokeWidth="1.5" opacity="0.4"/>
                </pattern>
              </defs>

              <text x="300" y="25" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1976D2">半保留复制示意图</text>

              <g transform="translate(50, 50)">
                <text x="250" y="15" textAnchor="middle" fontSize="12" fill="#666">亲代DNA分子</text>
                
                <g transform="translate(100, 30)">
                  <rect x="0" y="0" width="300" height="50" fill="url(#dna-strand)" stroke={defaultColors.parentalStrand1} strokeWidth="2" rx="4"/>
                  <text x="150" y="30" textAnchor="middle" fontSize="12" fontWeight="bold" fill={defaultColors.parentalStrand1}>亲代DNA双链</text>
                </g>
              </g>

              <g transform="translate(50, 150)">
                <text x="250" y="15" textAnchor="middle" fontSize="12" fill="#666">复制后的子代DNA分子</text>
                
                <g transform="translate(50, 30)">
                  <rect x="0" y="0" width="200" height="40" fill="url(#dna-strand)" stroke={defaultColors.newStrand1} strokeWidth="2" rx="4"/>
                  <text x="100" y="25" textAnchor="middle" fontSize="10" fill={defaultColors.newStrand1}>新DNA分子1</text>
                  <text x="100" y="65" textAnchor="middle" fontSize="9" fill="#666">1条亲代链 + 1条新链</text>
                </g>
                
                <g transform="translate(300, 30)">
                  <rect x="0" y="0" width="200" height="40" fill="url(#dna-strand)" stroke={defaultColors.newStrand2} strokeWidth="2" rx="4"/>
                  <text x="100" y="25" textAnchor="middle" fontSize="10" fill={defaultColors.newStrand2}>新DNA分子2</text>
                  <text x="100" y="65" textAnchor="middle" fontSize="9" fill="#666">1条亲代链 + 1条新链</text>
                </g>
              </g>

              <g transform="translate(50, 260)">
                <text x="500" y="15" textAnchor="middle" fontSize="11" fill="#666">总DNA分子数：2个（各含1条亲代链和1条新链）</text>
              </g>
            </svg>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-3">半保留复制特点</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>保留一半：</strong>每个子代DNA分子保留一条亲代链</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>合成一半：</strong>每个子代DNA分子包含一条新合成的链</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>准确性：</strong>新链以亲代链为模板，确保遗传信息准确复制</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>连续性：</strong>在多个复制起点同时进行，提高复制效率</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'process' && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-purple-800">复制过程</h3>
          
          <div className="flex justify-center gap-2 mb-4">
            {steps.map((_: any, index: number) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currentStep === index
                    ? 'bg-purple-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                阶段 {index + 1}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-lg p-6 border-2 border-purple-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {currentStep + 1}
              </div>
              <div>
                <h4 className="font-semibold text-purple-800 text-lg">{steps[currentStep]?.name}</h4>
                <p className="text-gray-600">{steps[currentStep]?.description}</p>
              </div>
            </div>

            {currentStep === 0 && (
              <div className="flex justify-center">
                <svg width="400" height="150" viewBox="0 0 400 150">
                  <text x="200" y="15" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1976D2">阶段1：解旋</text>
                  
                  <g transform="translate(50, 30)">
                    <rect x="0" y="0" width="100" height="60" fill="url(#dna-strand)" stroke={defaultColors.parentalStrand1} strokeWidth="2" rx="4"/>
                  </g>
                  <g transform="translate(160, 30)">
                    <rect x="0" y="0" width="100" height="60" fill="url(#dna-strand)" stroke={defaultColors.parentalStrand2} strokeWidth="2" rx="4"/>
                  </g>
                  
                  <circle cx="155" cy="60" r="15" fill={defaultColors.origin} fillOpacity="0.3" stroke={defaultColors.origin} strokeWidth="2"/>
                  <text x="155" y="120" textAnchor="middle" fontSize="10" fill="#666">复制起点</text>
                  
                  <path d="M155,45 Q155,30 170,20" stroke="#666" strokeWidth="1" fill="none" strokeDasharray="3,3"/>
                  <path d="M155,75 Q155,90 170,100" stroke="#666" strokeWidth="1" fill="none" strokeDasharray="3,3"/>
                </svg>
              </div>
            )}

            {currentStep === 1 && (
              <div className="flex justify-center">
                <svg width="400" height="150" viewBox="0 0 400 150">
                  <text x="200" y="15" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1976D2">阶段2：复制</text>
                  
                  <g transform="translate(30, 30)">
                    <rect x="0" y="0" width="80" height="50" fill="url(#dna-strand)" stroke={defaultColors.parentalStrand1} strokeWidth="2" rx="4"/>
                  </g>
                  <g transform="translate(30, 30)">
                    <rect x="0" y="10" width="80" height="40" fill="url(#dna-strand)" stroke={defaultColors.newStrand1} strokeWidth="1.5" rx="3"/>
                  </g>
                  
                  <g transform="translate(180, 30)">
                    <rect x="0" y="0" width="80" height="50" fill="url(#dna-strand)" stroke={defaultColors.parentalStrand2} strokeWidth="2" rx="4"/>
                  </g>
                  <g transform="translate(180, 30)">
                    <rect x="0" y="10" width="80" height="40" fill="url(#dna-strand)" stroke={defaultColors.newStrand2} strokeWidth="1.5" rx="3"/>
                  </g>
                  
                  <text x="200" y="120" textAnchor="middle" fontSize="10" fill="#666">DNA聚合酶沿模板链合成新链</text>
                </svg>
              </div>
            )}

            {currentStep === 2 && (
              <div className="flex justify-center">
                <svg width="400" height="150" viewBox="0 0 400 150">
                  <text x="200" y="15" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1976D2">阶段3：完成</text>
                  
                  <g transform="translate(40, 30)">
                    <rect x="0" y="0" width="150" height="50" fill="url(#dna-strand)" stroke={defaultColors.newStrand1} strokeWidth="2" rx="4"/>
                    <text x="75" y="30" textAnchor="middle" fontSize="11" fill={defaultColors.newStrand1}>子代DNA 1</text>
                  </g>
                  
                  <g transform="translate(210, 30)">
                    <rect x="0" y="0" width="150" height="50" fill="url(#dna-strand)" stroke={defaultColors.newStrand2} strokeWidth="2" rx="4"/>
                    <text x="75" y="30" textAnchor="middle" fontSize="11" fill={defaultColors.newStrand2}>子代DNA 2</text>
                  </g>
                  
                  <text x="200" y="120" textAnchor="middle" fontSize="10" fill="#666">形成两个完整的DNA双螺旋分子</text>
                </svg>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'semiconservative' && (
        <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-green-800">Meselson-Stahl实验证据</h3>
          
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-3">实验设计</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>使用含重氮（¹⁵N）的大肠杆菌培养</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>转移到含轻氮（¹⁴N）的培养基中</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>通过密度梯度离心分析DNA</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-3">实验结果</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>第一代：</strong>DNA密度介于重氮和轻氮之间（杂合）</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>第二代：</strong>DNA密度为中等和轻氮各占一半</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>结论：</strong>支持半保留复制模式，排除全保留和分散复制</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
