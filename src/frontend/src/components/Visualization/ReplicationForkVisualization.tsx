import { useState } from 'react';

interface ReplicationForkVisualizationProps {
  data: any;
  colors?: Record<string, string>;
}

export function ReplicationForkVisualization({ data, colors }: ReplicationForkVisualizationProps) {
  const [activeTab, setActiveTab] = useState<'structure' | 'components' | 'direction'>('structure');

  const defaultColors = {
    templateStrand: colors?.templateStrand || '#3B82F6',
    newStrand: colors?.newStrand || '#10B981',
    helicase: colors?.helicase || '#EF4444',
    polymerase: colors?.polymerase || '#F59E0B',
    ssb: colors?.ssb || '#8B5CF6',
  };

  const components = data?.components || [
    { name: '解旋酶', role: '解开DNA双螺旋' },
    { name: '单链结合蛋白', role: '稳定单链DNA' },
    { name: 'DNA聚合酶', role: '合成新DNA链' },
    { name: '引物酶', role: '合成RNA引物' },
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
          复制叉结构
        </button>
        <button
          onClick={() => setActiveTab('components')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'components'
              ? 'bg-purple-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          关键酶类
        </button>
        <button
          onClick={() => setActiveTab('direction')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'direction'
              ? 'bg-green-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          复制方向
        </button>
      </div>

      {activeTab === 'structure' && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-blue-800">复制叉结构</h3>
          
          <div className="flex justify-center">
            <svg width="600" height="350" viewBox="0 0 600 350">
              <text x="300" y="25" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1976D2">DNA复制叉示意图</text>

              <g transform="translate(100, 60)">
                <path d="M50,100 Q200,50 350,100" stroke={defaultColors.templateStrand} strokeWidth="3" fill="none"/>
                <path d="M50,100 Q200,150 350,100" stroke={defaultColors.templateStrand} strokeWidth="3" fill="none"/>
                
                <path d="M50,100 Q200,70 350,100" stroke={defaultColors.newStrand} strokeWidth="2" fill="none" strokeDasharray="5,3"/>
                <path d="M50,100 Q200,130 350,100" stroke={defaultColors.newStrand} strokeWidth="2" fill="none" strokeDasharray="5,3"/>
                
                <ellipse cx="200" cy="100" rx="50" ry="30" fill={defaultColors.helicase} fillOpacity="0.2" stroke={defaultColors.helicase} strokeWidth="2"/>
                <text x="200" y="105" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#991B1B">解旋酶</text>
                
                <ellipse cx="280" cy="70" rx="30" ry="20" fill={defaultColors.polymerase} fillOpacity="0.2" stroke={defaultColors.polymerase} strokeWidth="2"/>
                <text x="280" y="75" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#B45309">DNA聚合酶</text>
                
                <ellipse cx="280" cy="130" rx="30" ry="20" fill={defaultColors.ssb} fillOpacity="0.2" stroke={defaultColors.ssb} strokeWidth="2"/>
                <text x="280" y="135" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#5B21B6">SSB蛋白</text>
                
                <circle cx="50" cy="100" r="8" fill="#10B981" fillOpacity="0.3" stroke="#10B981" strokeWidth="2"/>
                <text x="50" y="85" textAnchor="middle" fontSize="9" fill="#666">5'</text>
                
                <circle cx="350" cy="100" r="8" fill="#3B82F6" fillOpacity="0.3" stroke="#3B82F6" strokeWidth="2"/>
                <text x="350" y="85" textAnchor="middle" fontSize="9" fill="#666">3'</text>
              </g>

              <g transform="translate(100, 220)">
                <text x="200" y="15" textAnchor="middle" fontSize="12" fill="#666">图例说明</text>
                
                <rect x="0" y="30" width="180" height="40" fill="#E3F2FD" stroke={defaultColors.templateStrand} strokeWidth="2" rx="4"/>
                <text x="90" y="55" textAnchor="middle" fontSize="11" fontWeight="bold" fill={defaultColors.templateStrand}>模板DNA链</text>
                
                <rect x="200" y="30" width="180" height="40" fill="#D1FAE5" stroke={defaultColors.newStrand} strokeWidth="2" rx="4"/>
                <text x="290" y="55" textAnchor="middle" fontSize="11" fontWeight="bold" fill={defaultColors.newStrand}>新合成的DNA链</text>
              </g>
            </svg>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-3">复制叉特点</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>Y形结构：</strong>解旋酶形成Y形结构推进复制</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>双向复制：</strong>从复制起点向两个方向同时进行</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>连续复制：</strong>前导链连续合成，后随链分段合成</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>协同作用：</strong>多种酶协同完成DNA复制</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'components' && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-purple-800">关键酶类</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            {components.map((comp: any, index: number) => (
              <div key={index} className="bg-white rounded-lg p-4 border-2 border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2">{comp.name}</h4>
                <p className="text-sm text-gray-700">{comp.role}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-3">酶的作用机制</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span><strong>解旋酶：</strong>切断氢键，解开DNA双螺旋</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span><strong>SSB蛋白：</strong>结合单链DNA，防止重新退火</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span><strong>引物酶：</strong>合成RNA引物，为DNA聚合酶提供3'-OH</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span><strong>DNA聚合酶：</strong>沿5'→3'方向合成新DNA链</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span><strong>DNA连接酶：</strong>连接冈崎片段，形成连续DNA链</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'direction' && (
        <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-green-800">复制方向</h3>
          
          <div className="flex justify-center">
            <svg width="600" height="300" viewBox="0 0 600 300">
              <text x="300" y="25" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1976D2">复制方向示意图</text>

              <g transform="translate(50, 50)">
                <text x="250" y="15" textAnchor="middle" fontSize="12" fill="#666">复制起点</text>
                <circle cx="250" cy="50" r="20" fill="#F59E0B" fillOpacity="0.3" stroke="#F59E0B" strokeWidth="2"/>
                <text x="250" y="55" textAnchor="middle" fontSize="10" fill="#B45309">起点</text>
              </g>

              <g transform="translate(50, 100)">
                <path d="M250,50 Q200,80 100,150" stroke={defaultColors.templateStrand} strokeWidth="3" fill="none"/>
                <path d="M250,50 Q200,120 100,150" stroke={defaultColors.templateStrand} strokeWidth="3" fill="none"/>
                <path d="M250,50 Q200,95 100,150" stroke={defaultColors.newStrand} strokeWidth="2" fill="none" strokeDasharray="5,3"/>
                
                <path d="M250,50 Q300,80 400,150" stroke={defaultColors.templateStrand} strokeWidth="3" fill="none"/>
                <path d="M250,50 Q300,120 400,150" stroke={defaultColors.templateStrand} strokeWidth="3" fill="none"/>
                <path d="M250,50 Q300,95 400,150" stroke={defaultColors.newStrand} strokeWidth="2" fill="none" strokeDasharray="5,3"/>
                
                <text x="100" y="180" textAnchor="middle" fontSize="11" fill="#666">复制叉1</text>
                <text x="400" y="180" textAnchor="middle" fontSize="11" fill="#666">复制叉2</text>
                
                <text x="50" y="200" textAnchor="middle" fontSize="10" fill="#666">← 5'→3'</text>
                <text x="450" y="200" textAnchor="middle" fontSize="10" fill="#666">5'→3' →</text>
              </g>
            </svg>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-3">方向性说明</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>双向复制：</strong>从一个复制起点向两个相反方向进行</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>合成方向：</strong>DNA聚合酶只能从5'向3'方向合成</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>前导链：</strong>沿复制叉移动方向连续合成</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>后随链：</strong>与复制叉移动方向相反，分段合成</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
