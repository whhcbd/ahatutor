import React, { useState } from 'react';

interface TabContent {
  title: string;
  description: string;
}

const PromoterVisualization: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'prokaryotic' | 'eukaryotic' | 'binding' | 'comparison'>('prokaryotic');
  const [currentStep, setCurrentStep] = useState(0);
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);

  const tabContents: Record<string, TabContent> = {
    prokaryotic: {
      title: '原核生物启动子',
      description: '原核生物启动子包含-10区(TATA盒)、-35区和UP元件，RNA聚合酶σ亚基识别这些保守序列。'
    },
    eukaryotic: {
      title: '真核生物启动子',
      description: '真核生物启动子更复杂，包含TATA盒、CAAT盒、GC盒等元件，需要多种转录因子协同作用。'
    },
    binding: {
      title: '结合过程',
      description: 'RNA聚合酶与转录因子按特定顺序结合启动子，逐步形成转录起始复合物。'
    },
    comparison: {
      title: '原核 vs 真核',
      description: '对比原核生物和真核生物启动子的结构差异和调控特点。'
    }
  };

  const bindingSteps = [
    {
      name: '步骤1：转录因子结合',
      description: '通用转录因子（TFIID）首先结合TATA盒，为其他转录因子结合提供基础。'
    },
    {
      name: '步骤2：复合物组装',
      description: '其他转录因子（TFIIA、TFIIB、TFIIE、TFIIF、TFIIH）依次结合，形成前起始复合物。'
    },
    {
      name: '步骤3：RNA聚合酶结合',
      description: 'RNA聚合酶II结合到前起始复合物，形成完整的转录起始复合物。'
    },
    {
      name: '步骤4：开放复合物形成',
      description: 'TFIIH解旋DNA双链，RNA聚合酶开始转录。'
    }
  ];

  const primaryColor = '#3B82F6';
  const accentColor = '#10B981';
  const dangerColor = '#EF4444';
  const warningColor = '#F59E0B';
  const purpleColor = '#8B5CF6';
  const textColor = '#1F2937';
  const lightColor = '#E5E7EB';

  const getElementDetails = (elementId: string) => {
    const elementMap: Record<string, { name: string; description: string; sequence?: string }> = {
      'tata-box': { name: 'TATA盒', description: '真核启动子核心元件，位于转录起始点上游-30~-25bp处，结合TFIID', sequence: 'TATAAA' },
      'caat-box': { name: 'CAAT盒', description: '真核启动子上游元件，位于-80~-70bp处，增强转录活性', sequence: 'GGCCAATCT' },
      'gc-box': { name: 'GC盒', description: '真核启动子上游元件，富含GC序列，结合SP1转录因子', sequence: 'GGGCGG' },
      'minus10': { name: '-10区 (TATA盒)', description: '原核启动子核心元件，DNA解链起始区', sequence: 'TATAAT' },
      'minus35': { name: '-35区', description: '原核启动子σ因子识别区，决定启动子强度', sequence: 'TTGACA' },
      'up-element': { name: 'UP元件', description: '原核启动子AT富集区，增强启动子活性', sequence: 'AT-rich' },
      'tfs': { name: '转录因子', description: '识别并结合启动子DNA序列的蛋白质' },
      'rna-pol': { name: 'RNA聚合酶', description: '催化RNA合成的酶，在启动子处启动转录' },
      'tss': { name: '转录起始位点 (+1)', description: 'RNA合成的起始位置' },
      'sigma': { name: 'σ因子', description: '原核RNA聚合酶的识别亚基，识别启动子序列' }
    };
    return elementMap[elementId];
  };

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2" style={{ color: textColor }}>启动子 (Promoter) 结构与功能</h2>
        <p className="text-gray-600">{tabContents[activeTab].description}</p>
      </div>

      <div className="flex gap-3 mb-6 flex-wrap">
        <button
          onClick={() => setActiveTab('prokaryotic')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'prokaryotic'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          原核启动子
        </button>
        <button
          onClick={() => setActiveTab('eukaryotic')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'eukaryotic'
              ? 'bg-purple-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          真核启动子
        </button>
        <button
          onClick={() => setActiveTab('binding')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'binding'
              ? 'bg-green-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          结合过程
        </button>
        <button
          onClick={() => setActiveTab('comparison')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'comparison'
              ? 'bg-orange-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          对比分析
        </button>
      </div>

      <div className="relative">
        <svg width="100%" height="450" viewBox="0 0 900 450">
          {activeTab === 'prokaryotic' && (
            <>
              <text x="450" y="30" textAnchor="middle" fontSize="18" fontWeight="bold" fill={textColor}>
                原核生物启动子结构
              </text>

              <line x1="50" y1="280" x2="850" y2="280" stroke={textColor} strokeWidth="4" />
              <text x="50" y="300" fontSize="12" fill="#666">5'</text>
              <text x="850" y="300" fontSize="12" fill="#666">3'</text>

              <g
                onMouseEnter={() => setHoveredElement('up-element')}
                onMouseLeave={() => setHoveredElement(null)}
                style={{ cursor: 'pointer' }}
              >
                <rect x="120" y="200" width="100" height="60" fill={warningColor} fillOpacity="0.3" stroke={warningColor} strokeWidth="2" rx="5" />
                <text x="170" y="225" textAnchor="middle" fontSize="12" fontWeight="bold" fill={warningColor}>UP元件</text>
                <text x="170" y="245" textAnchor="middle" fontSize="10" fill={textColor}>-40~-50</text>
                <text x="170" y="265" textAnchor="middle" fontSize="9" fill="#666">AT-rich</text>
              </g>

              <g
                onMouseEnter={() => setHoveredElement('minus35')}
                onMouseLeave={() => setHoveredElement(null)}
                style={{ cursor: 'pointer' }}
              >
                <rect x="250" y="200" width="120" height="60" fill={primaryColor} fillOpacity="0.4" stroke={primaryColor} strokeWidth="3" rx="5" />
                <text x="310" y="225" textAnchor="middle" fontSize="13" fontWeight="bold" fill={primaryColor}>-35区</text>
                <text x="310" y="245" textAnchor="middle" fontSize="10" fill={textColor}>TTGACA</text>
                <text x="310" y="265" textAnchor="middle" fontSize="9" fill="#666">σ识别</text>
              </g>

              <g
                onMouseEnter={() => setHoveredElement('minus10')}
                onMouseLeave={() => setHoveredElement(null)}
                style={{ cursor: 'pointer' }}
              >
                <rect x="400" y="200" width="120" height="60" fill={accentColor} fillOpacity="0.4" stroke={accentColor} strokeWidth="3" rx="5" />
                <text x="460" y="225" textAnchor="middle" fontSize="13" fontWeight="bold" fill={accentColor}>-10区</text>
                <text x="460" y="245" textAnchor="middle" fontSize="10" fill={textColor}>TATAAT</text>
                <text x="460" y="265" textAnchor="middle" fontSize="9" fill="#666">DNA解链</text>
              </g>

              <g
                onMouseEnter={() => setHoveredElement('tss')}
                onMouseLeave={() => setHoveredElement(null)}
                style={{ cursor: 'pointer' }}
              >
                <text x="580" y="290" textAnchor="middle" fontSize="16" fontWeight="bold" fill={dangerColor}>+1</text>
                <circle cx="580" cy="280" r="10" fill={dangerColor} />
                <text x="580" y="310" textAnchor="middle" fontSize="10" fill={dangerColor}>转录起始</text>
              </g>

              <rect x="600" y="260" width="200" height="40" fill={lightColor} fillOpacity="0.5" stroke={textColor} strokeWidth="2" rx="5" />
              <text x="700" y="285" textAnchor="middle" fontSize="12" fill={textColor}>结构基因</text>

              <g
                onMouseEnter={() => setHoveredElement('sigma')}
                onMouseLeave={() => setHoveredElement(null)}
                style={{ cursor: 'pointer' }}
              >
                <circle cx="380" cy="100" r="35" fill={primaryColor} fillOpacity="0.2" stroke={primaryColor} strokeWidth="2" />
                <text x="380" y="95" textAnchor="middle" fontSize="11" fontWeight="bold" fill={primaryColor}>RNA聚合酶</text>
                <text x="380" y="110" textAnchor="middle" fontSize="9" fill={primaryColor}>σ因子</text>
                <circle cx="365" cy="85" r="15" fill={warningColor} fillOpacity="0.6" stroke={warningColor} strokeWidth="2" />
                <text x="365" y="90" textAnchor="middle" fontSize="10" fill="white">σ</text>
              </g>

              <path d="M 350 120 L 310 200" stroke={primaryColor} strokeWidth="2" strokeDasharray="4,4" />
              <path d="M 410 120 L 460 200" stroke={primaryColor} strokeWidth="2" strokeDasharray="4,4" />

              <rect x="120" y="330" width="600" height="80" fill={primaryColor} fillOpacity="0.05" stroke={primaryColor} strokeWidth="1" rx="10" />
              <text x="420" y="355" textAnchor="middle" fontSize="13" fontWeight="bold" fill={primaryColor}>原核启动子特点</text>
              <text x="160" y="380" textAnchor="middle" fontSize="10" fill={textColor}>UP元件：增强活性</text>
              <text x="310" y="380" textAnchor="middle" fontSize="10" fill={textColor}>-35区：σ识别(强度)</text>
              <text x="460" y="380" textAnchor="middle" fontSize="10" fill={textColor}>-10区：DNA解链</text>
              <text x="600" y="380" textAnchor="middle" fontSize="10" fill={textColor}>+1：转录起始</text>
              <text x="700" y="380" textAnchor="middle" fontSize="10" fill={textColor}>结构基因：编码区</text>

              {hoveredElement && getElementDetails(hoveredElement) && (
                <foreignObject x="680" y="50" width="200" height="100">
                  <div style={{
                    backgroundColor: 'white',
                    border: `2px solid ${primaryColor}`,
                    borderRadius: '8px',
                    padding: '10px',
                    fontSize: '11px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                  }}>
                    <strong>{getElementDetails(hoveredElement).name}</strong>
                    <p style={{ margin: '5px 0', color: '#666' }}>{getElementDetails(hoveredElement).description}</p>
                    {getElementDetails(hoveredElement).sequence && (
                      <p style={{ margin: '0', color: primaryColor, fontFamily: 'monospace', fontWeight: 'bold' }}>
                        {getElementDetails(hoveredElement).sequence}
                      </p>
                    )}
                  </div>
                </foreignObject>
              )}
            </>
          )}

          {activeTab === 'eukaryotic' && (
            <>
              <text x="450" y="30" textAnchor="middle" fontSize="18" fontWeight="bold" fill={textColor}>
                真核生物启动子结构
              </text>

              <line x1="50" y1="280" x2="850" y2="280" stroke={textColor} strokeWidth="4" />
              <text x="50" y="300" fontSize="12" fill="#666">5'</text>
              <text x="850" y="300" fontSize="12" fill="#666">3'</text>

              <g
                onMouseEnter={() => setHoveredElement('gc-box')}
                onMouseLeave={() => setHoveredElement(null)}
                style={{ cursor: 'pointer' }}
              >
                <rect x="100" y="200" width="100" height="60" fill={purpleColor} fillOpacity="0.3" stroke={purpleColor} strokeWidth="2" rx="5" />
                <text x="150" y="225" textAnchor="middle" fontSize="11" fontWeight="bold" fill={purpleColor}>GC盒</text>
                <text x="150" y="245" textAnchor="middle" fontSize="9" fill={textColor}>GGGCGG</text>
                <text x="150" y="265" textAnchor="middle" fontSize="9" fill="#666">-110~-90</text>
              </g>

              <g
                onMouseEnter={() => setHoveredElement('caat-box')}
                onMouseLeave={() => setHoveredElement(null)}
                style={{ cursor: 'pointer' }}
              >
                <rect x="220" y="200" width="100" height="60" fill={warningColor} fillOpacity="0.3" stroke={warningColor} strokeWidth="2" rx="5" />
                <text x="270" y="225" textAnchor="middle" fontSize="11" fontWeight="bold" fill={warningColor}>CAAT盒</text>
                <text x="270" y="245" textAnchor="middle" fontSize="9" fill={textColor}>GGCCAATCT</text>
                <text x="270" y="265" textAnchor="middle" fontSize="9" fill="#666">-80~-70</text>
              </g>

              <g
                onMouseEnter={() => setHoveredElement('tata-box')}
                onMouseLeave={() => setHoveredElement(null)}
                style={{ cursor: 'pointer' }}
              >
                <rect x="350" y="200" width="120" height="60" fill={primaryColor} fillOpacity="0.4" stroke={primaryColor} strokeWidth="3" rx="5" />
                <text x="410" y="225" textAnchor="middle" fontSize="13" fontWeight="bold" fill={primaryColor}>TATA盒</text>
                <text x="410" y="245" textAnchor="middle" fontSize="10" fill={textColor}>TATAAA</text>
                <text x="410" y="265" textAnchor="middle" fontSize="9" fill="#666">-30~-25</text>
              </g>

              <g
                onMouseEnter={() => setHoveredElement('tss')}
                onMouseLeave={() => setHoveredElement(null)}
                style={{ cursor: 'pointer' }}
              >
                <text x="530" y="290" textAnchor="middle" fontSize="16" fontWeight="bold" fill={dangerColor}>+1</text>
                <circle cx="530" cy="280" r="10" fill={dangerColor} />
                <text x="530" y="310" textAnchor="middle" fontSize="10" fill={dangerColor}>转录起始</text>
              </g>

              <rect x="550" y="260" width="200" height="40" fill={lightColor} fillOpacity="0.5" stroke={textColor} strokeWidth="2" rx="5" />
              <text x="650" y="285" textAnchor="middle" fontSize="12" fill={textColor}>结构基因</text>

              <g
                onMouseEnter={() => setHoveredElement('tfs')}
                onMouseLeave={() => setHoveredElement(null)}
                style={{ cursor: 'pointer' }}
              >
                <circle cx="150" cy="100" r="25" fill={warningColor} fillOpacity="0.3" stroke={warningColor} strokeWidth="2" />
                <text x="150" y="95" textAnchor="middle" fontSize="9" fontWeight="bold" fill={warningColor}>TFIIA</text>
                
                <circle cx="210" cy="100" r="25" fill={accentColor} fillOpacity="0.3" stroke={accentColor} strokeWidth="2" />
                <text x="210" y="95" textAnchor="middle" fontSize="9" fontWeight="bold" fill={accentColor}>TFIIB</text>
                
                <circle cx="270" cy="100" r="25" fill={primaryColor} fillOpacity="0.3" stroke={primaryColor} strokeWidth="2" />
                <text x="270" y="95" textAnchor="middle" fontSize="9" fontWeight="bold" fill={primaryColor}>TFIID</text>
                
                <circle cx="330" cy="100" r="25" fill={purpleColor} fillOpacity="0.3" stroke={purpleColor} strokeWidth="2" />
                <text x="330" y="95" textAnchor="middle" fontSize="9" fontWeight="bold" fill={purpleColor}>TFIIE</text>
                
                <circle cx="390" cy="100" r="25" fill={dangerColor} fillOpacity="0.3" stroke={dangerColor} strokeWidth="2" />
                <text x="390" y="95" textAnchor="middle" fontSize="9" fontWeight="bold" fill={dangerColor}>TFIIF</text>
                
                <circle cx="450" cy="100" r="25" fill={warningColor} fillOpacity="0.3" stroke={warningColor} strokeWidth="2" />
                <text x="450" y="95" textAnchor="middle" fontSize="9" fontWeight="bold" fill={warningColor}>TFIIH</text>
              </g>

              <path d="M 270 125 L 410 200" stroke={primaryColor} strokeWidth="2" strokeDasharray="4,4" />
              <path d="M 450 125 L 530 200" stroke={primaryColor} strokeWidth="2" strokeDasharray="4,4" />

              <rect x="100" y="330" width="700" height="80" fill={purpleColor} fillOpacity="0.05" stroke={purpleColor} strokeWidth="1" rx="10" />
              <text x="450" y="355" textAnchor="middle" fontSize="13" fontWeight="bold" fill={purpleColor}>真核启动子特点</text>
              <text x="150" y="380" textAnchor="middle" fontSize="10" fill={textColor}>GC盒：SP1结合，增强转录</text>
              <text x="270" y="380" textAnchor="middle" fontSize="10" fill={textColor}>CAAT盒：增强活性</text>
              <text x="410" y="380" textAnchor="middle" fontSize="10" fill={textColor}>TATA盒：TFIID结合核心</text>
              <text x="530" y="380" textAnchor="middle" fontSize="10" fill={textColor}>+1：转录起始</text>
              <text x="700" y="380" textAnchor="middle" fontSize="10" fill={textColor}>需要多种转录因子</text>

              {hoveredElement && getElementDetails(hoveredElement) && (
                <foreignObject x="680" y="50" width="200" height="100">
                  <div style={{
                    backgroundColor: 'white',
                    border: `2px solid ${purpleColor}`,
                    borderRadius: '8px',
                    padding: '10px',
                    fontSize: '11px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                  }}>
                    <strong>{getElementDetails(hoveredElement).name}</strong>
                    <p style={{ margin: '5px 0', color: '#666' }}>{getElementDetails(hoveredElement).description}</p>
                    {getElementDetails(hoveredElement).sequence && (
                      <p style={{ margin: '0', color: purpleColor, fontFamily: 'monospace', fontWeight: 'bold' }}>
                        {getElementDetails(hoveredElement).sequence}
                      </p>
                    )}
                  </div>
                </foreignObject>
              )}
            </>
          )}

          {activeTab === 'binding' && (
            <>
              <text x="450" y="30" textAnchor="middle" fontSize="18" fontWeight="bold" fill={textColor}>
                RNA聚合酶结合过程 (真核)
              </text>

              <div className="flex justify-center gap-2 mb-4">
                {bindingSteps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`px-3 py-1 rounded text-sm ${
                      currentStep === index
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <rect x="150" y="50" width="600" height="40" fill={lightColor} fillOpacity="0.3" stroke={textColor} strokeWidth="1" rx="5" />
              <text x="450" y="75" textAnchor="middle" fontSize="12" fontWeight="bold" fill={textColor}>
                {bindingSteps[currentStep].name}
              </text>

              <line x1="50" y1="280" x2="850" y2="280" stroke={textColor} strokeWidth="4" />

              <g
                onMouseEnter={() => setHoveredElement('tata-box')}
                onMouseLeave={() => setHoveredElement(null)}
                style={{ cursor: 'pointer' }}
              >
                <rect x="300" y="200" width="120" height="60" fill={primaryColor} fillOpacity="0.4" stroke={primaryColor} strokeWidth="3" rx="5" />
                <text x="360" y="225" textAnchor="middle" fontSize="13" fontWeight="bold" fill={primaryColor}>TATA盒</text>
                <text x="360" y="245" textAnchor="middle" fontSize="10" fill={textColor}>TATAAA</text>
              </g>

              <g
                onMouseEnter={() => setHoveredElement('tss')}
                onMouseLeave={() => setHoveredElement(null)}
                style={{ cursor: 'pointer' }}
              >
                <text x="480" y="290" textAnchor="middle" fontSize="16" fontWeight="bold" fill={dangerColor}>+1</text>
                <circle cx="480" cy="280" r="10" fill={dangerColor} />
              </g>

              {currentStep === 0 && (
                <>
                  <circle cx="360" cy="120" r="30" fill={primaryColor} fillOpacity="0.3" stroke={primaryColor} strokeWidth="3" />
                  <text x="360" y="115" textAnchor="middle" fontSize="11" fontWeight="bold" fill={primaryColor}>TFIID</text>
                  <text x="360" y="130" textAnchor="middle" fontSize="9" fill={primaryColor}>识别TATA</text>
                  <path d="M 360 150 L 360 200" stroke={primaryColor} strokeWidth="3" />
                </>
              )}

              {currentStep === 1 && (
                <>
                  <circle cx="280" cy="120" r="25" fill={warningColor} fillOpacity="0.3" stroke={warningColor} strokeWidth="2" />
                  <text x="280" y="115" textAnchor="middle" fontSize="9" fontWeight="bold" fill={warningColor}>TFIIA</text>
                  
                  <circle cx="340" cy="120" r="25" fill={accentColor} fillOpacity="0.3" stroke={accentColor} strokeWidth="2" />
                  <text x="340" y="115" textAnchor="middle" fontSize="9" fontWeight="bold" fill={accentColor}>TFIIB</text>
                  
                  <circle cx="400" cy="120" r="25" fill={primaryColor} fillOpacity="0.3" stroke={primaryColor} strokeWidth="2" />
                  <text x="400" y="115" textAnchor="middle" fontSize="9" fontWeight="bold" fill={primaryColor}>TFIID</text>
                  
                  <circle cx="460" cy="120" r="25" fill={purpleColor} fillOpacity="0.3" stroke={purpleColor} strokeWidth="2" />
                  <text x="460" y="115" textAnchor="middle" fontSize="9" fontWeight="bold" fill={purpleColor}>TFIIE</text>
                  
                  <circle cx="520" cy="120" r="25" fill={dangerColor} fillOpacity="0.3" stroke={dangerColor} strokeWidth="2" />
                  <text x="520" y="115" textAnchor="middle" fontSize="9" fontWeight="bold" fill={dangerColor}>TFIIF</text>
                  
                  <path d="M 280 145 L 320 200" stroke={warningColor} strokeWidth="2" strokeDasharray="3,3" />
                  <path d="M 340 145 L 340 200" stroke={accentColor} strokeWidth="2" strokeDasharray="3,3" />
                  <path d="M 400 145 L 380 200" stroke={primaryColor} strokeWidth="2" strokeDasharray="3,3" />
                </>
              )}

              {currentStep === 2 && (
                <>
                  <g
                    onMouseEnter={() => setHoveredElement('rna-pol')}
                    onMouseLeave={() => setHoveredElement(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    <ellipse cx="450" cy="140" rx="120" ry="50" fill={primaryColor} fillOpacity="0.2" stroke={primaryColor} strokeWidth="3" />
                    <text x="450" y="135" textAnchor="middle" fontSize="12" fontWeight="bold" fill={primaryColor}>RNA聚合酶 II</text>
                    <text x="450" y="150" textAnchor="middle" fontSize="10" fill={primaryColor}>Pol II</text>
                  </g>
                  
                  <circle cx="350" cy="120" r="20" fill={warningColor} fillOpacity="0.4" stroke={warningColor} strokeWidth="1" />
                  <text x="350" y="125" textAnchor="middle" fontSize="8" fill={warningColor}>TFIIA</text>
                  
                  <circle cx="390" cy="120" r="20" fill={accentColor} fillOpacity="0.4" stroke={accentColor} strokeWidth="1" />
                  <text x="390" y="125" textAnchor="middle" fontSize="8" fill={accentColor}>TFIIB</text>
                  
                  <circle cx="430" cy="120" r="20" fill={primaryColor} fillOpacity="0.4" stroke={primaryColor} strokeWidth="1" />
                  <text x="430" y="125" textAnchor="middle" fontSize="8" fill={primaryColor}>TFIID</text>
                  
                  <circle cx="470" cy="120" r="20" fill={purpleColor} fillOpacity="0.4" stroke={purpleColor} strokeWidth="1" />
                  <text x="470" y="125" textAnchor="middle" fontSize="8" fill={purpleColor}>TFIIE</text>
                  
                  <circle cx="510" cy="120" r="20" fill={dangerColor} fillOpacity="0.4" stroke={dangerColor} strokeWidth="1" />
                  <text x="510" y="125" textAnchor="middle" fontSize="8" fill={dangerColor}>TFIIF</text>
                  
                  <circle cx="550" cy="120" r="20" fill={warningColor} fillOpacity="0.4" stroke={warningColor} strokeWidth="1" />
                  <text x="550" y="125" textAnchor="middle" fontSize="8" fill={warningColor}>TFIIH</text>
                  
                  <path d="M 450 190 L 360 200" stroke={primaryColor} strokeWidth="3" />
                </>
              )}

              {currentStep === 3 && (
                <>
                  <ellipse cx="450" cy="140" rx="140" ry="55" fill={primaryColor} fillOpacity="0.2" stroke={primaryColor} strokeWidth="3" />
                  <text x="450" y="135" textAnchor="middle" fontSize="12" fontWeight="bold" fill={primaryColor}>开放复合物</text>
                  <text x="450" y="150" textAnchor="middle" fontSize="10" fill={primaryColor}>DNA已解旋</text>
                  
                  <path d="M 360 200 Q 420 180 480 200" stroke={textColor} strokeWidth="3" fill="none" />
                  <text x="420" y="175" textAnchor="middle" fontSize="10" fill="#666">解旋</text>
                  
                  <path d="M 480 200 L 520 200" stroke={accentColor} strokeWidth="3" markerEnd="url(#arrow)" />
                  <text x="540" y="205" fontSize="10" fill={accentColor}>转录开始</text>
                  
                  <defs>
                    <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill={accentColor} />
                    </marker>
                  </defs>
                </>
              )}

              <rect x="100" y="330" width="700" height="80" fill={accentColor} fillOpacity="0.05" stroke={accentColor} strokeWidth="1" rx="10" />
              <text x="450" y="355" textAnchor="middle" fontSize="13" fontWeight="bold" fill={accentColor}>当前步骤说明</text>
              <text x="450" y="380" textAnchor="middle" fontSize="11" fill={textColor}>{bindingSteps[currentStep].description}</text>

              {hoveredElement && getElementDetails(hoveredElement) && (
                <foreignObject x="680" y="220" width="200" height="100">
                  <div style={{
                    backgroundColor: 'white',
                    border: `2px solid ${accentColor}`,
                    borderRadius: '8px',
                    padding: '10px',
                    fontSize: '11px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                  }}>
                    <strong>{getElementDetails(hoveredElement).name}</strong>
                    <p style={{ margin: '5px 0', color: '#666' }}>{getElementDetails(hoveredElement).description}</p>
                    {getElementDetails(hoveredElement).sequence && (
                      <p style={{ margin: '0', color: accentColor, fontFamily: 'monospace', fontWeight: 'bold' }}>
                        {getElementDetails(hoveredElement).sequence}
                      </p>
                    )}
                  </div>
                </foreignObject>
              )}
            </>
          )}

          {activeTab === 'comparison' && (
            <>
              <text x="450" y="30" textAnchor="middle" fontSize="18" fontWeight="bold" fill={textColor}>
                原核 vs 真核启动子对比
              </text>

              <g transform="translate(50, 60)">
                <rect x="0" y="0" width="380" height="350" fill={primaryColor} fillOpacity="0.05" stroke={primaryColor} strokeWidth="2" rx="10" />
                <text x="190" y="30" textAnchor="middle" fontSize="16" fontWeight="bold" fill={primaryColor}>原核生物启动子</text>
                
                <text x="20" y="60" fontSize="12" fontWeight="bold" fill={textColor}>特点:</text>
                <text x="20" y="85" fontSize="11" fill={textColor}>• 结构简单，元件较少</text>
                <text x="20" y="105" fontSize="11" fill={textColor}>• 直接结合RNA聚合酶</text>
                <text x="20" y="125" fontSize="11" fill={textColor}>• σ因子识别启动子</text>
                <text x="20" y="145" fontSize="11" fill={textColor}>• -35区和-10区为核心</text>
                <text x="20" y="165" fontSize="11" fill={textColor}>• 不需要转录因子</text>
                
                <text x="20" y="200" fontSize="12" fontWeight="bold" fill={textColor}>核心元件:</text>
                <rect x="20" y="220" width="100" height="35" fill={primaryColor} fillOpacity="0.2" stroke={primaryColor} strokeWidth="1" rx="3" />
                <text x="70" y="242" textAnchor="middle" fontSize="10" fill={primaryColor}>-35区 TTGACA</text>
                
                <rect x="130" y="220" width="100" height="35" fill={accentColor} fillOpacity="0.2" stroke={accentColor} strokeWidth="1" rx="3" />
                <text x="180" y="242" textAnchor="middle" fontSize="10" fill={accentColor}>-10区 TATAAT</text>
                
                <rect x="240" y="220" width="100" height="35" fill={warningColor} fillOpacity="0.2" stroke={warningColor} strokeWidth="1" rx="3" />
                <text x="290" y="242" textAnchor="middle" fontSize="10" fill={warningColor}>UP元件 AT-rich</text>
                
                <text x="20" y="290" fontSize="12" fontWeight="bold" fill={textColor}>优势:</text>
                <text x="20" y="315" fontSize="11" fill={textColor}>• 转录起始快速</text>
                <text x="20" y="335" fontSize="11" fill={textColor}>• 调控相对简单</text>
              </g>

              <g transform="translate(470, 60)">
                <rect x="0" y="0" width="380" height="350" fill={purpleColor} fillOpacity="0.05" stroke={purpleColor} strokeWidth="2" rx="10" />
                <text x="190" y="30" textAnchor="middle" fontSize="16" fontWeight="bold" fill={purpleColor}>真核生物启动子</text>
                
                <text x="20" y="60" fontSize="12" fontWeight="bold" fill={textColor}>特点:</text>
                <text x="20" y="85" fontSize="11" fill={textColor}>• 结构复杂，元件众多</text>
                <text x="20" y="105" fontSize="11" fill={textColor}>• 需要多种转录因子</text>
                <text x="20" y="125" fontSize="11" fill={textColor}>• 分步组装复合物</text>
                <text x="20" y="145" fontSize="11" fill={textColor}>• TATA盒为核心</text>
                <text x="20" y="165" fontSize="11" fill={textColor}>• 调控精细复杂</text>
                
                <text x="20" y="200" fontSize="12" fontWeight="bold" fill={textColor}>核心元件:</text>
                <rect x="20" y="220" width="90" height="35" fill={purpleColor} fillOpacity="0.2" stroke={purpleColor} strokeWidth="1" rx="3" />
                <text x="65" y="242" textAnchor="middle" fontSize="9" fill={purpleColor}>GC盒 GGGCGG</text>
                
                <rect x="120" y="220" width="90" height="35" fill={warningColor} fillOpacity="0.2" stroke={warningColor} strokeWidth="1" rx="3" />
                <text x="165" y="242" textAnchor="middle" fontSize="9" fill={warningColor}>CAAT盒</text>
                
                <rect x="220" y="220" width="90" height="35" fill={primaryColor} fillOpacity="0.2" stroke={primaryColor} strokeWidth="1" rx="3" />
                <text x="265" y="242" textAnchor="middle" fontSize="9" fill={primaryColor}>TATA盒</text>
                
                <text x="20" y="290" fontSize="12" fontWeight="bold" fill={textColor}>优势:</text>
                <text x="20" y="315" fontSize="11" fill={textColor}>• 调控精细</text>
                <text x="20" y="335" fontSize="11" fill={textColor}>• 可响应多种信号</text>
              </g>

              <rect x="150" y="420" width="600" height="30" fill={lightColor} fillOpacity="0.3" stroke={textColor} strokeWidth="1" rx="5" />
              <text x="450" y="440" textAnchor="middle" fontSize="11" fill={textColor}>
                真核生物启动子更复杂但调控更精细，原核生物启动子简单但调控相对快速
              </text>
            </>
          )}
        </svg>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-bold text-blue-800 mb-2">-35区</h4>
          <p className="text-sm text-blue-700">σ因子识别，决定启动子强度</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="font-bold text-green-800 mb-2">-10区</h4>
          <p className="text-sm text-green-700">DNA解链起始区</p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <h4 className="font-bold text-purple-800 mb-2">TATA盒</h4>
          <p className="text-sm text-purple-700">真核核心元件，结合TFIID</p>
        </div>
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <h4 className="font-bold text-red-800 mb-2">+1位点</h4>
          <p className="text-sm text-red-700">转录起始位点</p>
        </div>
      </div>
    </div>
  );
};

export { PromoterVisualization };
