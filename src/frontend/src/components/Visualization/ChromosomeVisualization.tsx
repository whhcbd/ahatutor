import { useState } from 'react';

interface ChromosomeVisualizationProps {
  data: any;
  colors?: Record<string, string>;
}

export function ChromosomeVisualization({ data, colors }: ChromosomeVisualizationProps) {
  const [activeTab, setActiveTab] = useState<'structure' | 'types' | 'function'>('structure');
  const [selectedChromosome, setSelectedChromosome] = useState(1);

  const defaultColors = {
    chromatid1: colors?.chromatid1 || '#3B82F6',
    chromatid2: colors?.chromatid2 || '#EF4444',
    centromere: colors?.centromere || '#F59E0B',
    telomere: colors?.telomere || '#10B981',
    sisterChromatids: colors?.sisterChromatids || '#8B5CF6',
  };

  const chromosomeTypes = data?.chromosomeTypes || [
    { name: '染色体', type: '常染色体', count: 22, pairs: 44 },
    { name: '性染色体', type: '性染色体', count: 2, pairs: 2 },
  ];

  const functions = data?.functions || [
    { name: 'DNA包装', description: '保护DNA免受损伤' },
    { name: '基因携带', description: '携带遗传信息' },
    { name: '细胞分裂', description: '确保遗传物质平均分配' },
    { name: '基因表达', description: '调控基因活性' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('structure')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'structure'
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          染色体结构
        </button>
        <button
          onClick={() => setActiveTab('types')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'types'
              ? 'bg-purple-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          染色体类型
        </button>
        <button
          onClick={() => setActiveTab('function')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'function'
              ? 'bg-green-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          染色体功能
        </button>
      </div>

      {activeTab === 'structure' && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-blue-800">染色体结构</h3>
          
          <div className="flex justify-center">
            <svg width="600" height="350" viewBox="0 0 600 350">
              <defs>
                <pattern id="dna-stripe" patternUnits="userSpaceOnUse" width="8" height="8">
                  <path d="M0,4 Q4,0 8,4 T16,4" fill="none" stroke="#3B82F6" strokeWidth="1" opacity="0.3"/>
                </pattern>
              </defs>

              <text x="300" y="25" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1976D2">染色体结构示意图</text>

              <g transform="translate(150, 50)">
                <text x="150" y="15" textAnchor="middle" fontSize="12" fill="#666">中期染色体结构</text>
                
                <g transform="translate(30, 30)">
                  <ellipse cx="120" cy="60" rx="25" ry="55" fill={defaultColors.chromatid1} fillOpacity="0.2" stroke={defaultColors.chromatid1} strokeWidth="2"/>
                  <text x="120" y="120" textAnchor="middle" fontSize="10" fill={defaultColors.chromatid1}>姐妹染色单体1</text>
                  
                  <ellipse cx="180" cy="60" rx="25" ry="55" fill={defaultColors.chromatid2} fillOpacity="0.2" stroke={defaultColors.chromatid2} strokeWidth="2"/>
                  <text x="180" y="120" textAnchor="middle" fontSize="10" fill={defaultColors.chromatid2}>姐妹染色单体2</text>
                  
                  <circle cx="150" cy="60" r="15" fill={defaultColors.centromere} fillOpacity="0.3" stroke={defaultColors.centromere} strokeWidth="3"/>
                  <text x="150" y="65" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#B45309">着丝粒</text>
                  
                  <circle cx="120" cy="15" r="8" fill={defaultColors.telomere} fillOpacity="0.3" stroke={defaultColors.telomere} strokeWidth="2"/>
                  <text x="120" y="8" textAnchor="middle" fontSize="8" fill="#059669">端粒</text>
                  
                  <circle cx="180" cy="15" r="8" fill={defaultColors.telomere} fillOpacity="0.3" stroke={defaultColors.telomere} strokeWidth="2"/>
                  <text x="180" y="8" textAnchor="middle" fontSize="8" fill="#059669">端粒</text>
                  
                  <g transform="translate(110, 20)">
                    <rect x="0" y="0" width="80" height="40" fill="url(#dna-stripe)" stroke="#3B82F6" strokeWidth="1" rx="2"/>
                    <text x="40" y="25" textAnchor="middle" fontSize="9" fill="#1976D2">DNA</text>
                  </g>
                  
                  <g transform="translate(130, 20)">
                    <rect x="0" y="0" width="80" height="40" fill="url(#dna-stripe)" stroke="#EF4444" strokeWidth="1" rx="2"/>
                    <text x="40" y="25" textAnchor="middle" fontSize="9" fill="#DC2626">DNA</text>
                  </g>
                </g>
              </g>

              <g transform="translate(50, 200)">
                <text x="250" y="15" textAnchor="middle" fontSize="12" fill="#666">各部分功能</text>
                
                <g transform="translate(0, 30)">
                  <rect x="0" y="0" width="150" height="60" fill="#E3F2FD" stroke={defaultColors.sisterChromatids} strokeWidth="2" rx="4"/>
                  <text x="75" y="25" textAnchor="middle" fontSize="12" fontWeight="bold" fill={defaultColors.sisterChromatids}>姐妹染色单体</text>
                  <text x="75" y="45" textAnchor="middle" fontSize="10" fill="#666">包含复制后的DNA</text>
                </g>
                
                <g transform="translate(170, 30)">
                  <rect x="0" y="0" width="150" height="60" fill="#FFF3E0" stroke={defaultColors.centromere} strokeWidth="2" rx="4"/>
                  <text x="75" y="25" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#E65100">着丝粒</text>
                  <text x="75" y="45" textAnchor="middle" fontSize="10" fill="#666">纺锤丝附着点</text>
                </g>

                <g transform="translate(340, 30)">
                  <rect x="0" y="0" width="100" height="60" fill="#D1FAE5" stroke={defaultColors.telomere} strokeWidth="2" rx="4"/>
                  <text x="50" y="25" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#059669">端粒</text>
                  <text x="50" y="45" textAnchor="middle" fontSize="10" fill="#666">保护DNA末端</text>
                </g>
              </g>
            </svg>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-3">结构组成</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>姐妹染色单体：</strong>由DNA复制产生的两条相同染色体</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>着丝粒：</strong>姐妹染色单体的连接点，纺锤丝附着处</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>端粒：</strong>染色体末端的保护结构，防止DNA降解</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>DNA：</strong>高度压缩的DNA分子，与组蛋白形成染色质</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'types' && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-purple-800">染色体类型</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {chromosomeTypes.map((type: any, index: number) => (
              <div key={index} className="bg-white rounded-lg p-6 border-2 border-purple-200">
                <h4 className="font-semibold text-purple-800 text-lg mb-3">{type.name}</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">类型：</span>
                    <span className="font-bold text-purple-700">{type.type}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">数量：</span>
                    <span className="font-bold text-purple-700">{type.count} 条</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">对数：</span>
                    <span className="font-bold text-purple-700">{type.pairs} 对</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-3">人类染色体组成</h4>
            <p className="text-sm text-gray-700 mb-3">
              人类正常体细胞含有 <strong>23对</strong> 染色体（46条），包括：
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span><strong>22对常染色体：</strong>编号1-22，按大小顺序排列</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span><strong>1对性染色体：</strong>XX（女性）或XY（男性）</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'function' && (
        <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-green-800">染色体功能</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            {functions.map((func: any, index: number) => (
              <div key={index} className="bg-white rounded-lg p-4 border-2 border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">{func.name}</h4>
                <p className="text-sm text-gray-700">{func.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-3">功能特点</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>DNA保护：</strong>防止DNA断裂和丢失</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>基因调控：</strong>通过染色质结构调控基因表达</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>细胞分裂：</strong>确保遗传物质平均分配给子细胞</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>重组发生：</strong>同源染色体之间可发生基因重组</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
