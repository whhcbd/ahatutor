import React, { useState } from 'react';

interface TabContent {
  title: string;
  description: string;
}

const PromoterVisualization: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'structure' | 'elements' | 'binding'>('structure');

  const tabContents: Record<string, TabContent> = {
    structure: {
      title: '启动子结构',
      description: '启动子是DNA上位于基因转录起始位点上游的调控区域，RNA聚合酶和转录因子在此结合启动转录。'
    },
    elements: {
      title: '核心元件',
      description: '原核生物启动子包含-10区(TATA盒)和-35区，真核生物启动子包含TATA盒、CAAT盒和GC盒等元件。'
    },
    binding: {
      title: '结合机制',
      description: 'RNA聚合酶与转录因子协同结合启动子，识别保守序列并解开DNA双链，开始转录。'
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
        <h2 className="text-2xl font-bold mb-2" style={{ color: textColor }}>启动子 (Promoter) 结构与功能</h2>
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
          基本结构
        </button>
        <button
          onClick={() => setActiveTab('elements')}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'elements'
              ? 'bg-purple-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          核心元件
        </button>
        <button
          onClick={() => setActiveTab('binding')}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'binding'
              ? 'bg-green-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          结合机制
        </button>
      </div>

      <div className="relative">
        <svg width="100%" height="320" viewBox="0 0 900 320">
          {activeTab === 'structure' && (
            <>
              <text x="450" y="30" textAnchor="middle" fontSize="18" fontWeight="bold" fill={textColor}>
                启动子基本结构
              </text>

              <line x1="50" y1="200" x2="850" y2="200" stroke={textColor} strokeWidth="4" />

              <rect x="200" y="140" width="150" height="60" fill={primaryColor} fillOpacity="0.3} stroke={primaryColor} strokeWidth="2" rx="5" />
              <text x="275" y="175" textAnchor="middle" fontSize="12" fontWeight="bold" fill={primaryColor}>-35区</text>

              <rect x="400" y="140" width="150" height="60" fill={accentColor} fillOpacity="0.3" stroke={accentColor} strokeWidth="2" rx="5" />
              <text x="475" y="175" textAnchor="middle" fontSize="12" fontWeight="bold" fill={accentColor}>-10区 (TATA盒)</text>

              <text x="620" y="205" textAnchor="middle" fontSize="14" fontWeight="bold" fill={dangerColor}>转录起始位点 +1</text>
              <circle cx="620" cy="200" r="8" fill={dangerColor} />

              <text x="275" y="220" textAnchor="middle" fontSize="10" fill={textColor}>TTGACA</text>
              <text x="475" y="220" textAnchor="middle" fontSize="10" fill={textColor}>TATAAT</text>

              <rect x="640" y="180" width="200" height="40" fill={warningColor} fillOpacity="0.2} stroke={warningColor} strokeWidth="2" rx="5" />
              <text x="740" y="205" textAnchor="middle" fontSize="12" fill={warningColor}>结构基因</text>

              <path d="M 275 140 L 275 120 L 475 120 L 475 140" stroke={primaryColor} strokeWidth="2" fill="none" strokeDasharray="5,3" />
              <text x="375" y="115" textAnchor="middle" fontSize="11" fill={primaryColor}>启动子区域</text>

              <circle cx="275" cy="100" r="20" fill={primaryColor} fillOpacity="0.4} stroke={primaryColor} strokeWidth="2" />
              <text x="275" y="105" textAnchor="middle" fontSize="9" fill={primaryColor}>σ因子</text>

              <line x1="275" y1="80" x2="275" y2="100" stroke={primaryColor} strokeWidth="2" strokeDasharray="3,2" />

              <text x="450" y="280" textAnchor="middle" fontSize="14" fontWeight="bold" fill={textColor}>原核生物启动子结构</text>

              <rect x="150" y="240" width="600" height="50" fill={primaryColor} fillOpacity="0.1" stroke={primaryColor} strokeWidth="2" rx="10" />
              <text x="450" y="260" textAnchor="middle" fontSize="11" fill={textColor}>-35区：RNA聚合酶σ亚基识别区</text>
              <text x="450" y="280" textAnchor="middle" fontSize="11" fill={textColor}>-10区：DNA解链起始区，富含A-T碱基</text>
            </>
          )}

          {activeTab === 'elements' && (
            <>
              <text x="450" y="30" textAnchor="middle" fontSize="18" fontWeight="bold" fill={textColor}>
                启动子核心元件
              </text>

              <line x1="50" y1="220" x2="850" y2="220" stroke={textColor} strokeWidth="4" />

              <rect x="150" y="140" width="120" height="80" fill={primaryColor} fillOpacity="0.3} stroke={primaryColor} strokeWidth="2" rx="5" />
              <text x="210" y="165" textAnchor="middle" fontSize="12" fontWeight="bold" fill={primaryColor}>UP元件</text>
              <text x="210" y="185" textAnchor="middle" fontSize="10" fill={textColor}>AT富集区</text>
              <text x="210" y="200" textAnchor="middle" fontSize="9" fill={textColor}>-40~-50</text>

              <rect x="300" y="140" width="120" height="80" fill={accentColor} fillOpacity="0.3" stroke={accentColor} strokeWidth="2" rx="5" />
              <text x="360" y="165" textAnchor="middle" fontSize="12" fontWeight="bold" fill={accentColor}>-35区</text>
              <text x="360" y="185" textAnchor="middle" fontSize="10" fill={textColor}>TTGACA</text>
              <text x="360" y="200" textAnchor="middle" fontSize="9" fill={textColor}>σ因子识别</text>

              <rect x="450" y="140" width="120" height="80" fill={warningColor} fillOpacity="0.3} stroke={warningColor} strokeWidth="2" rx="5" />
              <text x="510" y="165" textAnchor="middle" fontSize="12" fontWeight="bold" fill={warningColor}>-10区</text>
              <text x="510" y="185" textAnchor="middle" fontSize="10" fill={textColor}>TATAAT</text>
              <text x="510" y="200" textAnchor="middle" fontSize="9" fill={textColor}>DNA解链</text>

              <text x="630" y="225" textAnchor="middle" fontSize="14" fontWeight="bold" fill={dangerColor}>+1</text>
              <circle cx="630" cy="220" r="8" fill={dangerColor} />

              <line x1="210" y1="140" x2="210" y2="110" stroke={primaryColor} strokeWidth="2" />
              <line x1="360" y1="140" x2="360" y2="110" stroke={accentColor} strokeWidth="2" />
              <line x1="510" y1="140" x2="510" y2="110" stroke={warningColor} strokeWidth="2" />

              <rect x="150" y="80" width="420" height="30" fill={lightColor} fillOpacity="0.5" stroke={textColor} strokeWidth="2" rx="5" />
              <text x="360" y="100" textAnchor="middle" fontSize="12" fontWeight="bold" fill={textColor}>启动子核心区域</text>

              <text x="450" y="280" textAnchor="middle" fontSize="14" fontWeight="bold" fill={textColor}>原核生物启动子元件</text>

              <rect x="100" y="240" width="700" height="60" fill={accentColor} fillOpacity="0.1} stroke={accentColor} strokeWidth="2" rx="10" />
              <text x="450" y="260" textAnchor="middle" fontSize="11" fontWeight="bold" fill={accentColor}>元件功能</text>
              <text x="150" y="280" textAnchor="middle" fontSize="10" fill={textColor}>UP元件：增强启动子活性</text>
              <text x="360" y="280" textAnchor="middle" fontSize="10" fill={textColor}>-35区：σ因子识别</text>
              <text x="510" y="280" textAnchor="middle" fontSize="10" fill={textColor}>-10区：DNA解链起始</text>
              <text x="700" y="280" textAnchor="middle" fontSize="10" fill={textColor}>+1：转录起始</text>
            </>
          )}

          {activeTab === 'binding' && (
            <>
              <text x="450" y="30" textAnchor="middle" fontSize="18" fontWeight="bold" fill={textColor}>
                RNA聚合酶结合机制
              </text>

              <line x1="50" y1="200" x2="850" y2="200" stroke={textColor} strokeWidth="4" />

              <rect x="250" y="140" width="150" height="60" fill={primaryColor} fillOpacity="0.3" stroke={primaryColor} strokeWidth="2" rx="5" />
              <text x="325" y="175" textAnchor="middle" fontSize="12" fontWeight="bold" fill={primaryColor}>-35区</text>

              <rect x="450" y="140" width="150" height="60" fill={accentColor} fillOpacity="0.3} stroke={accentColor} strokeWidth="2" rx="5" />
              <text x="525" y="175" textAnchor="middle" fontSize="12" fontWeight="bold" fill={accentColor}>-10区</text>

              <text x="670" y="205" textAnchor="middle" fontSize="14" fontWeight="bold" fill={dangerColor}>+1</text>
              <circle cx="670" cy="200" r="8" fill={dangerColor} />

              <circle cx="400" cy="80" r="50" fill={primaryColor} fillOpacity="0.2" stroke={primaryColor} strokeWidth="3" />
              <text x="400" y="75" textAnchor="middle" fontSize="12" fontWeight="bold" fill={primaryColor}>RNA聚合酶</text>
              <text x="400" y="90" textAnchor="middle" fontSize="10" fill={primaryColor}>全酶</text>

              <path d="M 370 110 L 320 140" stroke={primaryColor} strokeWidth="3" markerEnd="url(#arrow)" />
              <path d="M 430 110 L 525 140" stroke={primaryColor} strokeWidth="3" markerEnd="url(#arrow)" />

              <circle cx="380" cy="65" r="15" fill={warningColor} fillOpacity="0.8" stroke={warningColor} strokeWidth="2" />
              <text x="380" y="70" textAnchor="middle" fontSize="10" fill="white">σ</text>

              <text x="450" y="280" textAnchor="middle" fontSize="14" fontWeight="bold" fill={textColor}>结合过程</text>

              <rect x="150" y="240" width="600" height="50" fill={primaryColor} fillOpacity="0.1} stroke={primaryColor} strokeWidth="2" rx="10" />
              <text x="450" y="260" textAnchor="middle" fontSize="11" fill={textColor}>1. σ因子识别-35区和-10区保守序列</text>
              <text x="450" y="280" textAnchor="middle" fontSize="11" fill={textColor}>2. RNA聚合酶结合并解旋DNA，形成开放复合物</text>

              <defs>
                <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill={primaryColor} />
                </marker>
              </defs>

              <path d="M 670 200 L 720 180" stroke={dangerColor} strokeWidth="2" strokeDasharray="5,3" />
              <text x="740" y="185" fontSize="10" fill={dangerColor}>转录方向</text>
            </>
          )}
        </svg>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-bold text-blue-800 mb-2">-35区</h4>
          <p className="text-sm text-blue-700">RNA聚合酶σ亚基识别位点，保守序列为TTGACA</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="font-bold text-green-800 mb-2">-10区</h4>
          <p className="text-sm text-green-700">TATA盒，DNA解链起始区，保守序列为TATAAT</p>
        </div>
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <h4 className="font-bold text-red-800 mb-2">+1位点</h4>
          <p className="text-sm text-red-700">转录起始位点，RNA合成从此处开始</p>
        </div>
      </div>
    </div>
  );
};

export default PromoterVisualization;
