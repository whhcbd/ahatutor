import React, { useState } from 'react';

interface TabContent {
  title: string;
  description: string;
}

const SplicingVisualization: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'structure' | 'step1' | 'step2' | 'final'>('structure');

  const tabContents: Record<string, TabContent> = {
    structure: {
      title: '基因结构',
      description: '真核生物基因由外显子和内含子交替排列组成。外显子包含编码信息，内含子需要在转录后被剪接去除。'
    },
    step1: {
      title: '第一步：剪接体组装',
      description: '剪接体在内含子两端边界处组装，识别5\'剪接位点（GU）和3\'剪接位点（AG）。'
    },
    step2: {
      title: '第二步：内含子套索形成',
      description: '内含子5\'端与分支点（A）结合形成套索结构，外显子两端靠近。'
    },
    final: {
      title: '最终：成熟mRNA',
      description: '内含子被去除，外显子连接形成成熟mRNA，用于蛋白质翻译。'
    }
  };

  const primaryColor = '#3B82F6';
  const accentColor = '#10B981';
  const dangerColor = '#EF4444';
  const warningColor = '#F59E0B';
  const textColor = '#1F2937';
  const intronColor = '#9CA3AF';

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2" style={{ color: textColor }}>RNA剪接 (RNA Splicing) 过程</h2>
        <p className="text-gray-600">{tabContents[activeTab].description}</p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setActiveTab('structure')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'structure'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          基因结构
        </button>
        <button
          onClick={() => setActiveTab('step1')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'step1'
              ? 'bg-purple-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          步骤1
        </button>
        <button
          onClick={() => setActiveTab('step2')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'step2'
              ? 'bg-orange-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          步骤2
        </button>
        <button
          onClick={() => setActiveTab('final')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'final'
              ? 'bg-green-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          成熟mRNA
        </button>
      </div>

      <div className="relative">
        <svg width="100%" height="320" viewBox="0 0 900 320">
          {activeTab === 'structure' && (
            <>
              <text x="450" y="30" textAnchor="middle" fontSize="18" fontWeight="bold" fill={textColor}>
                真核生物基因结构
              </text>

              <text x="450" y="280" textAnchor="middle" fontSize="14" fontWeight="bold" fill={textColor}>
                DNA转录产生前体mRNA (pre-mRNA)
              </text>

              <rect x="50" y="80" width="120" height="40" fill={primaryColor} fillOpacity="0.6} stroke={primaryColor} strokeWidth="2" rx="5" />
              <text x="110" y="105" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">外显子 1</text>

              <rect x="180" y="80" width="150" height="40" fill={intronColor} fillOpacity="0.6} stroke={intronColor} strokeWidth="2" rx="5" />
              <text x="255" y="105" textAnchor="middle" fontSize="12" fill="white">内含子 1</text>

              <rect x="340" y="80" width="120" height="40" fill={primaryColor} fillOpacity="0.6" stroke={primaryColor} strokeWidth="2" rx="5" />
              <text x="400" y="105" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">外显子 2</text>

              <rect x="470" y="80" width="150" height="40" fill={intronColor} fillOpacity="0.6" stroke={intronColor} strokeWidth="2" rx="5" />
              <text x="545" y="105" textAnchor="middle" fontSize="12" fill="white">内含子 2</text>

              <rect x="630" y="80" width="120" height="40" fill={primaryColor} fillOpacity="0.6} stroke={primaryColor} strokeWidth="2" rx="5" />
              <text x="690" y="105" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">外显子 3</text>

              <line x1="50" y1="100" x2="750" y2="100" stroke={textColor} strokeWidth="2" />

              <text x="50" y="150" fontSize="14" fill={textColor}>5' 端</text>
              <text x="730" y="150" fontSize="14" fill={textColor}>3' 端</text>

              <path d="M 50 100 L 50 180 L 750 180 L 750 100" stroke={textColor} strokeWidth="1" fill="none" strokeDasharray="5,3" />

              <rect x="50" y="180" width="120" height="40" fill={primaryColor} fillOpacity="0.6} stroke={primaryColor} strokeWidth="2" rx="5" />
              <rect x="180" y="180" width="150" height="40" fill={intronColor} fillOpacity="0.6} stroke={intronColor} strokeWidth="2" rx="5" />
              <rect x="340" y="180" width="120" height="40" fill={primaryColor} fillOpacity="0.6} stroke={primaryColor} strokeWidth="2" rx="5" />
              <rect x="470" y="180" width="150" height="40" fill={intronColor} fillOpacity="0.6} stroke={intronColor} strokeWidth="2" rx="5" />
              <rect x="630" y="180" width="120" height="40" fill={primaryColor} fillOpacity="0.6} stroke={primaryColor} strokeWidth="2" rx="5" />

              <text x="175" y="90" textAnchor="middle" fontSize="10" fill={dangerColor}>GU</text>
              <text x="465" y="90" textAnchor="middle" fontSize="10" fill={dangerColor}>GU</text>
              <text x="325" y="90" textAnchor="middle" fontSize="10" fill={dangerColor}>AG</text>
              <text x="615" y="90" textAnchor="middle" fontSize="10" fill={dangerColor}>AG</text>
            </>
          )}

          {activeTab === 'step1' && (
            <>
              <text x="450" y="30" textAnchor="middle" fontSize="18" fontWeight="bold" fill={textColor}>
                剪接体组装与识别
              </text>

              <rect x="50" y="80" width="120" height="40" fill={primaryColor} fillOpacity="0.6} stroke={primaryColor} strokeWidth="2" rx="5" />
              <text x="110" y="105" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">外显子 1</text>

              <rect x="180" y="80" width="150" height="40" fill={intronColor} fillOpacity="0.6} stroke={intronColor} strokeWidth="2" rx="5" />
              <text x="255" y="105" textAnchor="middle" fontSize="12" fill="white">内含子 1</text>

              <rect x="340" y="80" width="120" height="40" fill={primaryColor} fillOpacity="0.6} stroke={primaryColor} strokeWidth="2" rx="5" />
              <text x="400" y="105" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">外显子 2</text>

              <rect x="470" y="80" width="150" height="40" fill={intronColor} fillOpacity="0.6} stroke={intronColor} strokeWidth="2" rx="5" />
              <text x="545" y="105" textAnchor="middle" fontSize="12" fill="white">内含子 2</text>

              <rect x="630" y="80" width="120" height="40" fill={primaryColor} fillOpacity="0.6} stroke={primaryColor} strokeWidth="2" rx="5" />
              <text x="690" y="105" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">外显子 3</text>

              <circle cx="175" cy="60" r="25" fill={warningColor} fillOpacity="0.8" stroke={warningColor} strokeWidth="2" />
              <text x="175" y="65" textAnchor="middle" fontSize="10" fill="white">U1</text>

              <circle cx="325" cy="60" r="25" fill={accentColor} fillOpacity="0.8" stroke={accentColor} strokeWidth="2" />
              <text x="325" y="65" textAnchor="middle" fontSize="10" fill="white">U2</text>

              <circle cx="465" cy="60" r="25" fill={warningColor} fillOpacity="0.8" stroke={warningColor} strokeWidth="2" />
              <text x="465" y="65" textAnchor="middle" fontSize="10" fill="white">U1</text>

              <circle cx="615" cy="60" r="25" fill={accentColor} fillOpacity="0.8" stroke={accentColor} strokeWidth="2" />
              <text x="615" y="65" textAnchor="middle" fontSize="10" fill="white">U2</text>

              <line x1="175" y1="85" x2="175" y2="75" stroke={warningColor} strokeWidth="2" />
              <line x1="325" y1="85" x2="325" y2="75" stroke={accentColor} strokeWidth="2" />
              <line x1="465" y1="85" x2="465" y2="75" stroke={warningColor} strokeWidth="2" />
              <line x1="615" y1="85" x2="615" y2="75" stroke={accentColor} strokeWidth="2" />

              <text x="175" y="150" textAnchor="middle" fontSize="10" fill={dangerColor}>5' 剪接位点 (GU)</text>
              <text x="325" y="150" textAnchor="middle" fontSize="10" fill={dangerColor}>分支点 (A)</text>
              <text x="465" y="150" textAnchor="middle" fontSize="10" fill={dangerColor}>5' 剪接位点 (GU)</text>
              <text x="615" y="150" textAnchor="middle" fontSize="10" fill={dangerColor}>3' 剪接位点 (AG)</text>

              <rect x="150" y="180" width="600" height="80" fill={primaryColor} fillOpacity="0.1} stroke={primaryColor} strokeWidth="2" rx="10" />
              <text x="450" y="205" textAnchor="middle" fontSize="12" fontWeight="bold" fill={primaryColor}>剪接体组装</text>
              <text x="450" y="225" textAnchor="middle" fontSize="11" fill={textColor}>U1识别5'剪接位点(GU)</text>
              <text x="450" y="245" textAnchor="middle" fontSize="11" fill={textColor}>U2识别分支点(A)</text>
            </>
          )}

          {activeTab === 'step2' && (
            <>
              <text x="450" y="30" textAnchor="middle" fontSize="18" fontWeight="bold" fill={textColor}>
                内含子套索形成与外显子连接
              </text>

              <rect x="50" y="100" width="120" height="40" fill={primaryColor} fillOpacity="0.6} stroke={primaryColor} strokeWidth="2" rx="5" />
              <text x="110" y="125" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">外显子 1</text>

              <path d="M 170 120 Q 255 60 340 120" fill="none" stroke={dangerColor} strokeWidth="3" />
              <path d="M 170 120 Q 200 80 255 80 Q 310 80 340 120" fill={dangerColor} fillOpacity="0.2} stroke={dangerColor} strokeWidth="2" />

              <circle cx="255" cy="80" r="15" fill={warningColor} fillOpacity="0.9} stroke={warningColor} strokeWidth="2" />
              <text x="255" y="85" textAnchor="middle" fontSize="10" fill="white">A</text>

              <text x="255" y="50" textAnchor="middle" fontSize="11" fill={dangerColor}>套索结构</text>

              <rect x="340" y="100" width="120" height="40" fill={primaryColor} fillOpacity="0.6" stroke={primaryColor} strokeWidth="2" rx="5" />
              <text x="400" y="125" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">外显子 2</text>

              <rect x="470" y="100" width="150" height="40" fill={intronColor} fillOpacity="0.4" stroke={intronColor} strokeWidth="2" rx="5" strokeDasharray="5,3" />
              <text x="545" y="125" textAnchor="middle" fontSize="12" fill={intronColor}>内含子 2</text>

              <rect x="630" y="100" width="120" height="40" fill={primaryColor} fillOpacity="0.6" stroke={primaryColor} strokeWidth="2" rx="5" />
              <text x="690" y="125" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">外显子 3</text>

              <path d="M 170 120 L 340 120" stroke={accentColor} strokeWidth="3" markerEnd="url(#arrowhead)" />

              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill={accentColor} />
                </marker>
              </defs>

              <text x="255" y="170" textAnchor="middle" fontSize="11" fill={accentColor}>外显子 1 与外显子 2 连接</text>

              <rect x="150" y="190" width="600" height="100" fill={dangerColor} fillOpacity="0.1} stroke={dangerColor} strokeWidth="2" rx="10" />
              <text x="450" y="215" textAnchor="middle" fontSize="12" fontWeight="bold" fill={dangerColor}>套索形成机制</text>
              <text x="450" y="240" textAnchor="middle" fontSize="11" fill={textColor}>内含子5'端磷酸基团与分支点腺嘌呤(A)的2'-OH结合</text>
              <text x="450" y="260" textAnchor="middle" fontSize="11" fill={textColor}>形成2'-5'磷酸二酯键，形成套索结构</text>
              <text x="450" y="280" textAnchor="middle" fontSize="11" fill={textColor}>外显子两端靠近，准备连接</text>
            </>
          )}

          {activeTab === 'final' && (
            <>
              <text x="450" y="30" textAnchor="middle" fontSize="18" fontWeight="bold" fill={accentColor}>
                成熟mRNA形成
              </text>

              <text x="450" y="60" textAnchor="middle" fontSize="14" fill={accentColor}>
                内含子已被剪接去除
              </text>

              <rect x="50" y="100" width="270" height="40" fill={primaryColor} fillOpacity="0.6" stroke={primaryColor} strokeWidth="2" rx="5" />
              <text x="185" y="125" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">外显子 1</text>
              <text x="325" y="125" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">外显子 2</text>

              <rect x="330" y="100" width="120" height="40" fill={primaryColor} fillOpacity="0.6" stroke={primaryColor} strokeWidth="2" rx="5" />
              <text x="390" y="125" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">外显子 3</text>

              <rect x="460" y="100" width="120" height="40" fill={primaryColor} fillOpacity="0.6" stroke={primaryColor} strokeWidth="2" rx="5" />
              <text x="520" y="125" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">外显子 4</text>

              <rect x="590" y="100" width="120" height="40" fill={primaryColor} fillOpacity="0.6" stroke={primaryColor} strokeWidth="2" rx="5" />
              <text x="650" y="125" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">外显子 5</text>

              <circle cx="320" cy="120" r="10" fill={accentColor} fillOpacity="0.8} stroke={accentColor} strokeWidth="2" />
              <circle cx="455" cy="120" r="10" fill={accentColor} fillOpacity="0.8} stroke={accentColor} strokeWidth="2" />
              <circle cx="585" cy="120" r="10" fill={accentColor} fillOpacity="0.8} stroke={accentColor} strokeWidth="2" />

              <text x="50" y="170" fontSize="14" fill={textColor}>5' 帽子</text>
              <circle cx="30" cy="120" r="15" fill={warningColor} fillOpacity="0.8" stroke={warningColor} strokeWidth="2" />
              <text x="30" y="125" textAnchor="middle" fontSize="10" fill="white">5'</text>

              <text x="700" y="170" fontSize="14" fill={textColor}>3' Poly-A尾</text>
              <rect x="720" y="105" width="80" height="30" fill={warningColor} fillOpacity="0.8" stroke={warningColor} strokeWidth="2" rx="5" />
              <text x="760" y="125" textAnchor="middle" fontSize="10" fill="white">Poly-A</text>

              <rect x="150" y="190" width="600" height="80" fill={accentColor} fillOpacity="0.1" stroke={accentColor} strokeWidth="2" rx="10" />
              <text x="450" y="215" textAnchor="middle" fontSize="12" fontWeight="bold" fill={accentColor}>成熟mRNA</text>
              <text x="450" y="240" textAnchor="middle" fontSize="11" fill={textColor}>所有外显子通过3'-5'磷酸二酯键连接</text>
              <text x="450" y="260" textAnchor="middle" fontSize="11" fill={textColor}>内含子以套索形式被降解</text>
            </>
          )}
        </svg>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-bold text-blue-800 mb-2">外显子 (Exon)</h4>
          <p className="text-sm text-blue-700">基因中最终保留在成熟mRNA中的序列，编码蛋白质</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-bold text-gray-800 mb-2">内含子 (Intron)</h4>
          <p className="text-sm text-gray-700">基因中在剪接过程中被去除的非编码序列</p>
        </div>
      </div>
    </div>
  );
};

export default SplicingVisualization;
