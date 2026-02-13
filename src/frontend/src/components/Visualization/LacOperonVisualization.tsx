import React, { useState } from 'react';

interface TabContent {
  title: string;
  description: string;
}

const LacOperonVisualization: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'structure' | 'induced' | 'repressed'>('structure');

  const tabContents: Record<string, TabContent> = {
    structure: {
      title: '乳糖操纵子结构',
      description: '乳糖操纵子由启动子(P)、操纵基因(O)和三个结构基因(lacZ、lacY、lacA)组成。阻遏蛋白基因(lacI)位于操纵子上游。'
    },
    induced: {
      title: '诱导状态',
      description: '当乳糖存在时，乳糖转化为诱导物，结合阻遏蛋白使其从操纵基因上解离，RNA聚合酶可以转录结构基因。'
    },
    repressed: {
      title: '阻遏状态',
      description: '当环境中没有乳糖时，阻遏蛋白结合到操纵基因上，阻止RNA聚合酶转录，结构基因表达被关闭。'
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
        <h2 className="text-2xl font-bold mb-2" style={{ color: textColor }}>乳糖操纵子 (Lac Operon) 调控机制</h2>
        <p className="text-gray-600">{tabContents[activeTab].description}</p>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('structure')}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'structure'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          结构组成
        </button>
        <button
          onClick={() => setActiveTab('induced')}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'induced'
              ? 'bg-green-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          诱导状态
        </button>
        <button
          onClick={() => setActiveTab('repressed')}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'repressed'
              ? 'bg-red-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          阻遏状态
        </button>
      </div>

      <div className="relative">
        <svg width="100%" height="300" viewBox="0 0 900 300">
          <defs>
            <linearGradient id="dnaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: primaryColor }} />
              <stop offset="100%" style={{ stopColor: accentColor }} />
            </linearGradient>
          </defs>

          {activeTab === 'structure' && (
            <>
              <text x="450" y="30" textAnchor="middle" fontSize="18" fontWeight="bold" fill={textColor}>
                乳糖操纵子基本结构
              </text>

              <text x="150" y="280" textAnchor="middle" fontSize="12" fill={textColor}>
                lacI 基因
              </text>

              <text x="300" y="280" textAnchor="middle" fontSize="12" fill={textColor}>
                启动子 P
              </text>

              <text x="450" y="280" textAnchor="middle" fontSize="12" fill={textColor}>
                操纵基因 O
              </text>

              <text x="600" y="280" textAnchor="middle" fontSize="12" fill={textColor}>
                lacZ 基因
              </text>

              <text x="750" y="280" textAnchor="middle" fontSize="12" fill={textColor}>
                lacY 基因
              </text>

              <rect x="120" y="200" width="60" height="50" fill={warningColor} fillOpacity="0.3" stroke={warningColor} strokeWidth="2" rx="5" />

              <rect x="270" y="200" width="60" height="50" fill={primaryColor} fillOpacity="0.3" stroke={primaryColor} strokeWidth="2" rx="5" />

              <rect x="420" y="200" width="60" height="50" fill={dangerColor} fillOpacity="0.3" stroke={dangerColor} strokeWidth="2" rx="5" />

              <rect x="570" y="200" width="60" height="50" fill={accentColor} fillOpacity="0.3" stroke={accentColor} strokeWidth="2" rx="5" />

              <rect x="720" y="200" width="60" height="50" fill={accentColor} fillOpacity="0.3" stroke={accentColor} strokeWidth="2" rx="5" />

              <line x1="120" y1="225" x2="780" y2="225" stroke={textColor} strokeWidth="4" />

              <circle cx="450" cy="100" r="30" fill={dangerColor} fillOpacity="0.4} stroke={dangerColor} strokeWidth="2" />
              <text x="450" y="105" textAnchor="middle" fontSize="10" fill="white">阻遏蛋白</text>

              <line x1="450" y1="130" x2="450" y2="190" stroke={dangerColor} strokeWidth="2" strokeDasharray="5,3" />

              <rect x="200" y="140" width="500" height="40" fill={primaryColor} fillOpacity="0.1} stroke={primaryColor} strokeWidth="1" rx="5" />
              <text x="450" y="165" textAnchor="middle" fontSize="12" fill={primaryColor}>操纵子控制区</text>
            </>
          )}

          {activeTab === 'induced' && (
            <>
              <text x="450" y="30" textAnchor="middle" fontSize="18" fontWeight="bold" fill={accentColor}>
                诱导状态 - 乳糖存在
              </text>

              <text x="150" y="280" textAnchor="middle" fontSize="12" fill={textColor}>
                lacI
              </text>

              <text x="300" y="280" textAnchor="middle" fontSize="12" fill={textColor}>
                P
              </text>

              <text x="450" y="280" textAnchor="middle" fontSize="12" fill={textColor}>
                O
              </text>

              <text x="600" y="280" textAnchor="middle" fontSize="12" fill={textColor}>
                lacZ
              </text>

              <text x="750" y="280" textAnchor="middle" fontSize="12" fill={textColor}>
                lacY
              </text>

              <rect x="120" y="200" width="60" height="50" fill={warningColor} fillOpacity="0.3" stroke={warningColor} strokeWidth="2" rx="5" />

              <rect x="270" y="200" width="60" height="50" fill={primaryColor} fillOpacity="0.3" stroke={primaryColor} strokeWidth="2" rx="5" />

              <rect x="420" y="200" width="60" height="50" fill={lightColor} fillOpacity="0.3" stroke={textColor} strokeWidth="1" rx="5" />

              <rect x="570" y="200" width="60" height="50" fill={accentColor} fillOpacity="0.6" stroke={accentColor} strokeWidth="3" rx="5" />

              <rect x="720" y="200" width="60" height="50" fill={accentColor} fillOpacity="0.6" stroke={accentColor} strokeWidth="3" rx="5" />

              <line x1="120" y1="225" x2="780" y2="225" stroke={textColor} strokeWidth="4" />

              <circle cx="150" cy="80" r="30" fill={warningColor} fillOpacity="0.4" stroke={warningColor} strokeWidth="2" />
              <text x="150" y="85" textAnchor="middle" fontSize="9" fill="white">阻遏蛋白</text>

              <circle cx="220" cy="80" r="25" fill={accentColor} fillOpacity="0.6} stroke={accentColor} strokeWidth="2" />
              <text x="220" y="85" textAnchor="middle" fontSize="9" fill="white">诱导物</text>

              <line x1="180" y1="80" x2="195" y2="80" stroke={textColor} strokeWidth="2" />

              <text x="550" y="150" textAnchor="middle" fontSize="14" fontWeight="bold" fill={accentColor}>
                → 转录进行中 →
              </text>

              <path d="M 450 180 L 550 160 L 580 225 L 500 250 Z" fill={primaryColor} fillOpacity="0.4} stroke={primaryColor} strokeWidth="2" />
              <text x="520" y="205" textAnchor="middle" fontSize="10" fill={primaryColor}>RNA聚合酶</text>

              <text x="635" y="280" textAnchor="middle" fontSize="10" fill={accentColor}>β-半乳糖苷酶</text>

              <text x="785" y="280" textAnchor="middle" fontSize="10" fill={accentColor}>透性酶</text>

              <rect x="200" y="260" width="500" height="30" fill={accentColor} fillOpacity="0.1" stroke={accentColor} strokeWidth="1" rx="5" />
              <text x="450" y="280" textAnchor="middle" fontSize="11" fill={accentColor}>基因表达开启</text>
            </>
          )}

          {activeTab === 'repressed' && (
            <>
              <text x="450" y="30" textAnchor="middle" fontSize="18" fontWeight="bold" fill={dangerColor}>
                阻遏状态 - 无乳糖
              </text>

              <text x="150" y="280" textAnchor="middle" fontSize="12" fill={textColor}>
                lacI
              </text>

              <text x="300" y="280" textAnchor="middle" fontSize="12" fill={textColor}>
                P
              </text>

              <text x="450" y="280" textAnchor="middle" fontSize="12" fill={textColor}>
                O
              </text>

              <text x="600" y="280" textAnchor="middle" fontSize="12" fill={textColor}>
                lacZ
              </text>

              <text x="750" y="280" textAnchor="middle" fontSize="12" fill={textColor}>
                lacY
              </text>

              <rect x="120" y="200" width="60" height="50" fill={warningColor} fillOpacity="0.3} stroke={warningColor} strokeWidth="2" rx="5" />

              <rect x="270" y="200" width="60" height="50" fill={lightColor} fillOpacity="0.3} stroke={textColor} strokeWidth="1" rx="5" />

              <rect x="420" y="200" width="60" height="50" fill={lightColor} fillOpacity="0.3} stroke={textColor} strokeWidth="1" rx="5" />

              <rect x="570" y="200" width="60" height="50" fill={lightColor} fillOpacity="0.3} stroke={textColor} strokeWidth="1" rx="5" />

              <rect x="720" y="200" width="60" height="50" fill={lightColor} fillOpacity="0.3} stroke={textColor} strokeWidth="1" rx="5" />

              <line x1="120" y1="225" x2="780" y2="225" stroke={textColor} strokeWidth="4" />

              <circle cx="150" cy="80" r="30" fill={warningColor} fillOpacity="0.4} stroke={warningColor} strokeWidth="2" />
              <text x="150" y="85" textAnchor="middle" fontSize="9" fill="white">阻遏蛋白</text>

              <rect x="420" y="160" width="60" height="50" fill={dangerColor} fillOpacity="0.5} stroke={dangerColor} strokeWidth="3" rx="5" />

              <line x1="180" y1="90" x2="430" y2="175" stroke={dangerColor} strokeWidth="3" />

              <text x="450" y="150" textAnchor="middle" fontSize="12" fontWeight="bold" fill={dangerColor}>
                ✗ 转录受阻
              </text>

              <text x="450" y="170" textAnchor="middle" fontSize="11" fill={dangerColor}>
                RNA聚合酶无法结合
              </text>

              <text x="450" y="270" textAnchor="middle" fontSize="11" fill={dangerColor}>
                基因表达关闭
              </text>

              <rect x="380" y="190" width="140" height="25" fill={dangerColor} fillOpacity="0.1" stroke={dangerColor} strokeWidth="1" rx="5" />
              <text x="450" y="208" textAnchor="middle" fontSize="10" fill={dangerColor}>阻遏蛋白结合位点</text>

              <path d="M 450 140 L 430 145 L 470 145 Z" fill={dangerColor} />
            </>
          )}
        </svg>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-bold text-blue-800 mb-2">启动子 (P)</h4>
          <p className="text-sm text-blue-700">RNA聚合酶结合位点，控制转录起始</p>
        </div>
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <h4 className="font-bold text-red-800 mb-2">操纵基因 (O)</h4>
          <p className="text-sm text-red-700">阻遏蛋白结合位点，调控基因表达</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="font-bold text-green-800 mb-2">结构基因</h4>
          <p className="text-sm text-green-700">lacZ、lacY、lacA编码相关酶</p>
        </div>
      </div>
    </div>
  );
};

export default LacOperonVisualization;
