import React, { useState } from 'react';

interface TabContent {
  title: string;
  description: string;
}

const DNAPolymeraseVisualization: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'structure' | 'elongation' | 'proofreading'>('structure');

  const tabContents: Record<string, TabContent> = {
    structure: {
      title: 'DNA聚合酶结构',
      description: 'DNA聚合酶是DNA复制的关键酶，具有聚合酶活性和3'→5'外切酶活性，负责DNA合成和校对。'
    },
    elongation: {
      title: '延伸过程',
      description: 'DNA聚合酶沿模板链移动，按碱基配对规则（A-T, G-C）合成新DNA链，合成方向为5'→3'。'
    },
    proofreading: {
      title: '校对机制',
      description: 'DNA聚合酶具有3'→5'外切酶活性，当检测到错配碱基时，会切除并重新合成，保证复制准确性。'
    }
  };

  const primaryColor = '#3B82F6';
  const accentColor = '#10B981';
  const dangerColor = '#EF4444';
  const warningColor = '#F59E0B';
  const textColor = '#1F2937';
  const lightColor = '#E5E7EB';

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2" style={{ color: textColor }}>DNA聚合酶 (DNA Polymerase) 结构与功能</h2>
        <p className="text-gray-600">{tabContents[activeTab].description}</p>
      </div>

      <div className="flex gap-4 mb-6 flex-wrap">
        <button
          onClick={() => setActiveTab('structure')}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'structure'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          酶结构
        </button>
        <button
          onClick={() => setActiveTab('elongation')}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'elongation'
              ? 'bg-purple-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          延伸过程
        </button>
        <button
          onClick={() => setActiveTab('proofreading')}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'proofreading'
              ? 'bg-green-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          校对机制
        </button>
      </div>

      <div className="relative">
        <svg width="100%" height="320" viewBox="0 0 900 320">
          {activeTab === 'structure' && (
            <>
              <text x="450" y="30" textAnchor="middle" fontSize="18" fontWeight="bold" fill={textColor}>
                DNA聚合酶结构
              </text>

              <circle cx="450" cy="120" r="80" fill={primaryColor} fillOpacity="0.2} stroke={primaryColor} strokeWidth="3" />
              <text x="450" y="115" textAnchor="middle" fontSize="14" fontWeight="bold" fill={primaryColor}>DNA聚合酶</text>
              <text x="450" y="135" textAnchor="middle" fontSize="12" fill={primaryColor}>全酶</text>

              <circle cx="400" cy="100" r="25" fill={accentColor} fillOpacity="0.8} stroke={accentColor} strokeWidth="2" />
              <text x="400" y="105" textAnchor="middle" fontSize="10" fill="white">α</text>

              <circle cx="500" cy="100" r="25" fill={accentColor} fillOpacity="0.8} stroke={accentColor} strokeWidth="2" />
              <text x="500" y="105" textAnchor="middle" fontSize="10" fill="white">ε</text>

              <circle cx="450" cy="60" r="20" fill={warningColor} fillOpacity="0.8" stroke={warningColor} strokeWidth="2" />
              <text x="450" y="65" textAnchor="middle" fontSize="9" fill="white">θ</text>

              <rect x="410" y="160" width="80" height="50" fill={dangerColor} fillOpacity="0.4} stroke={dangerColor} strokeWidth="2" rx="5" />
              <text x="450" y="185" textAnchor="middle" fontSize="10" fill={dangerColor}>活性中心</text>
              <text x="450" y="200" textAnchor="middle" fontSize="9" fill={dangerColor}>Mg2+</text>

              <text x="450" y="260" textAnchor="middle" fontSize="14" fontWeight="bold" fill={textColor}>大肠杆菌DNA聚合酶III</text>

              <rect x="150" y="230" width="600" height="60" fill={primaryColor} fillOpacity="0.1} stroke={primaryColor} strokeWidth="2" rx="10" />
              <text x="450" y="250" textAnchor="middle" fontSize="11" fontWeight="bold" fill={primaryColor}>亚基组成</text>
              <text x="250" y="280" textAnchor="middle" fontSize="10" fill={textColor}>α：聚合酶活性</text>
              <text x="450" y="280" textAnchor="middle" fontSize="10" fill={textColor}>ε：3'→5'外切酶(校对)</text>
              <text x="650" y="280" textAnchor="middle" fontSize="10" fill={textColor}>θ：稳定性</text>

              <line x1="400" y1="125" x2="450" y2="150" stroke={textColor} strokeWidth="2" />
              <line x1="500" y1="125" x2="450" y2="150" stroke={textColor} strokeWidth="2" />
            </>
          )}

          {activeTab === 'elongation' && (
            <>
              <text x="450" y="30" textAnchor="middle" fontSize="18" fontWeight="bold" fill={textColor}>
                DNA延伸过程
              </text>

              <path d="M 100 150 L 800 150" stroke={textColor} strokeWidth="4" />
              <path d="M 100 200 L 800 200" stroke={textColor} strokeWidth="4" />

              <text x="50" y="155" fontSize="12" fill={textColor}>5'</text>
              <text x="820" y="155" fontSize="12" fill={textColor}>3'</text>
              <text x="50" y="205" fontSize="12" fill={textColor}>3'</text>
              <text x="820" y="205" fontSize="12" fill={textColor}>5'</text>

              <circle cx="300" cy="175" r="60" fill={primaryColor} fillOpacity="0.2} stroke={primaryColor} strokeWidth="3" />
              <text x="300" y="170" textAnchor="middle" fontSize="12" fontWeight="bold" fill={primaryColor}>DNA聚合酶</text>
              <text x="300" y="190" textAnchor="middle" fontSize="10" fill={primaryColor}>III全酶</text>

              <circle cx="300" cy="175" r="10" fill={dangerColor} />

              <line x1="250" y1="175" x2="220" y2="175" stroke={accentColor} strokeWidth="4" />
              <line x1="350" y1="175" x2="380" y2="175" stroke={accentColor} strokeWidth="4" />

              <rect x="380" y="165" width="60" height="20" fill={accentColor} fillOpacity="0.4} stroke={accentColor} strokeWidth="2" rx="3" />
              <text x="410" y="180" textAnchor="middle" fontSize="10" fill="white">新链</text>

              <path d="M 450 160 L 480 175 L 450 190" fill={accentColor} fillOpacity="0.4} stroke={accentColor} strokeWidth="2" />
              <text x="460" y="180" textAnchor="middle" fontSize="9" fill={accentColor}>NTP</text>

              <rect x="500" y="140" width="100" height="70" fill={warningColor} fillOpacity="0.2" stroke={warningColor} strokeWidth="2" rx="5" />
              <text x="550" y="165" textAnchor="middle" fontSize="11" fill={warningColor}>碱基配对</text>
              <text x="550" y="185" textAnchor="middle" fontSize="10" fill={warningColor}>A-T, G-C</text>
              <text x="550" y="200" textAnchor="middle" fontSize="10" fill={warningColor}>氢键</text>

              <text x="450" y="280" textAnchor="middle" fontSize="14" fontWeight="bold" fill={textColor}>延伸机制</text>

              <rect x="150" y="240" width="600" height="50" fill={primaryColor} fillOpacity="0.1" stroke={primaryColor} strokeWidth="2" rx="10" />
              <text x="450" y="260" textAnchor="middle" fontSize="11" fill={textColor}>1. NTP进入活性中心，与模板碱基配对</text>
              <text x="450" y="280" textAnchor="middle" fontSize="11" fill={textColor}>2. 形成磷酸二酯键，聚合酶向前移动</text>

              <path d="M 380 140 L 380 120" stroke={accentColor} strokeWidth="2" strokeDasharray="5,3" />
              <text x="380" y="110" textAnchor="middle" fontSize="10" fill={accentColor}>5'→3'方向</text>
            </>
          )}

          {activeTab === 'proofreading' && (
            <>
              <text x="450" y="30" textAnchor="middle" fontSize="18" fontWeight="bold" fill={textColor}>
                校对机制
              </text>

              <path d="M 100 150 L 800 150" stroke={textColor} strokeWidth="4" />
              <path d="M 100 200 L 800 200" stroke={textColor} strokeWidth="4" />

              <circle cx="300" cy="175" r="60" fill={primaryColor} fillOpacity="0.2} stroke={primaryColor} strokeWidth="3" />
              <text x="300" y="170" textAnchor="middle" fontSize="12" fontWeight="bold" fill={primaryColor}>DNA聚合酶</text>
              <text x="300" y="190" textAnchor="middle" fontSize="10" fill={primaryColor}>III全酶</text>

              <circle cx="380" cy="175" r="12" fill={dangerColor} />
              <text x="380" y="180" textAnchor="middle" fontSize="10" fill="white">!</text>

              <path d="M 395 175 L 450 175" stroke={dangerColor} strokeWidth="3" strokeDasharray="5,3" />
              <rect x="450" y="160" width="80" height="30" fill={dangerColor} fillOpacity="0.4" stroke={dangerColor} strokeWidth="2" rx="5" />
              <text x="490" y="180" textAnchor="middle" fontSize="10" fill="white">错配碱基</text>

              <path d="M 490 160 L 490 130" stroke={dangerColor} strokeWidth="2" />
              <path d="M 490 130 L 520 130" stroke={dangerColor} strokeWidth="2" markerEnd="url(#arrow)" />

              <rect x="520" y="110" width="120" height="40" fill={warningColor} fillOpacity="0.3} stroke={warningColor} strokeWidth="2" rx="5" />
              <text x="580" y="130" textAnchor="middle" fontSize="10" fill={warningColor}>3'→5'外切酶</text>
              <text x="580" y="145" textAnchor="middle" fontSize="9" fill={warningColor}>切除错配</text>

              <path d="M 580 110 L 580 90" stroke={accentColor} strokeWidth="2" />
              <circle cx="580" cy="75" r="20" fill={accentColor} fillOpacity="0.6" stroke={accentColor} strokeWidth="2" />
              <text x="580" y="80" textAnchor="middle" fontSize="9" fill="white">重新合成</text>

              <text x="450" y="280" textAnchor="middle" fontSize="14" fontWeight="bold" fill={textColor}>校对过程</text>

              <rect x="100" y="240" width="700" height="60" fill={accentColor} fillOpacity="0.1" stroke={accentColor} strokeWidth="2" rx="10" />
              <text x="450" y="260" textAnchor="middle" fontSize="11" fontWeight="bold" fill={accentColor}>步骤</text>
              <text x="200" y="280" textAnchor="middle" fontSize="10" fill={textColor}>1. 检测错配碱基</text>
              <text x="400" y="280" textAnchor="middle" fontSize="10" fill={textColor}>2. 3'→5'外切酶切除</text>
              <text x="600" y="280" textAnchor="middle" fontSize="10" fill={textColor}>3. 重新合成正确碱基</text>

              <defs>
                <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill={dangerColor} />
                </marker>
              </defs>
            </>
          )}
        </svg>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-bold text-blue-800 mb-2">聚合酶活性</h4>
          <p className="text-sm text-blue-700">按5'→3'方向合成DNA，催化磷酸二酯键形成</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="font-bold text-green-800 mb-2">外切酶活性</h4>
          <p className="text-sm text-green-700">3'→5'外切酶切除错配碱基，保证复制准确性</p>
        </div>
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <h4 className="font-bold text-red-800 mb-2">校对机制</h4>
          <p className="text-sm text-red-700">实时检测错配，切除并重新合成正确碱基</p>
        </div>
      </div>
    </div>
  );
};

export default DNAPolymeraseVisualization;
