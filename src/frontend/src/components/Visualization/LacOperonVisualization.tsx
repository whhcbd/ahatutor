import React, { useState } from 'react';

interface TabContent {
  title: string;
  description: string;
}

const LacOperonVisualization: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'structure' | 'induced' | 'repressed' | 'mechanism'>('structure');
  const [currentStep, setCurrentStep] = useState(0);
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);

  const getElementDetails = (elementId: string) => {
    const elementMap: Record<string, { name: string; description: string; function?: string; location?: string }> = {
      'laci-gene': { 
        name: 'lacI 基因', 
        description: '编码阻遏蛋白，位于操纵子上游，独立表达', 
        function: '持续表达产生阻遏蛋白，调控下游基因表达',
        location: '操纵子上游约300bp'
      },
      'promoter': { 
        name: '启动子 (P)', 
        description: 'RNA聚合酶结合位点，-10和-35区域，控制转录起始', 
        function: 'RNA聚合酶识别并结合，启动转录',
        location: '-35到+1区域'
      },
      'operator': { 
        name: '操纵基因 (O)', 
        description: '阻遏蛋白结合位点，21bp的回文序列', 
        function: '阻遏蛋白结合后阻止RNA聚合酶通过',
        location: '启动子下游，部分重叠'
      },
      'crp-site': { 
        name: 'CRP结合位点', 
        description: 'cAMP-CRP复合物结合位点，位于-61.5位置', 
        function: '正调控因子，增强RNA聚合酶结合效率',
        location: '启动子上游'
      },
      'lacZ': { 
        name: 'lacZ 基因', 
        description: '编码β-半乳糖苷酶，长度3063bp，分解乳糖为葡萄糖和半乳糖', 
        function: '水解乳糖，同时也产生诱导物',
        location: '操纵子第一个结构基因'
      },
      'lacY': { 
        name: 'lacY 基因', 
        description: '编码透性酶，长度1254bp，转运乳糖进入细胞', 
        function: '促进乳糖摄取，增加诱导物浓度',
        location: '操纵子第二个结构基因'
      },
      'lacA': { 
        name: 'lacA 基因', 
        description: '编码硫代半乳糖苷转乙酰酶，长度627bp，功能尚不完全明确', 
        function: '可能参与乳糖代谢产物的解毒',
        location: '操纵子第三个结构基因'
      },
      'repressor': { 
        name: 'lac阻遏蛋白', 
        description: '四聚体蛋白，每个亚基360个氨基酸，共约150kDa', 
        function: '结合操纵基因阻遏转录，或结合诱导物失活'
      },
      'inducer': { 
        name: '诱导物 (异乳糖)', 
        description: '乳糖的异构体，由β-半乳糖苷酶转化产生', 
        function: '结合阻遏蛋白，改变其构象，从操纵基因解离'
      },
      'crp': { 
        name: 'cAMP-CRP复合物', 
        description: 'CRP蛋白结合cAMP形成的二聚体，约45kDa', 
        function: '正调控因子，结合DNA后增强转录效率'
      },
      'cAMP': { 
        name: 'cAMP', 
        description: '环腺苷酸，葡萄糖缺乏时浓度升高', 
        function: '作为第二信使，结合CRP形成活性复合物'
      },
      'rnAP': { 
        name: 'RNA聚合酶', 
        description: '大肠杆菌RNA聚合酶，σ70因子识别启动子', 
        function: '合成mRNA，转录结构基因'
      }
    };
    return elementMap[elementId];
  };

  const tabContents: Record<string, TabContent> = {
    structure: {
      title: '乳糖操纵子结构',
      description: '乳糖操纵子由启动子(P)、操纵基因(O)、CRP结合位点和三个结构基因(lacZ、lacY、lacA)组成。阻遏蛋白基因(lacI)位于操纵子上游独立表达。'
    },
    induced: {
      title: '诱导状态',
      description: '当乳糖存在时，乳糖转化为诱导物，结合阻遏蛋白使其从操纵基因上解离。同时葡萄糖缺乏时cAMP浓度升高，形成cAMP-CRP复合物增强转录。RNA聚合酶可以高效转录结构基因。'
    },
    repressed: {
      title: '阻遏状态',
      description: '当环境中没有乳糖时，阻遏蛋白结合到操纵基因上，阻止RNA聚合酶转录。当葡萄糖丰富时，cAMP浓度低，无法形成正调控复合物，结构基因表达被完全关闭。'
    },
    mechanism: {
      title: '调控机制详解',
      description: '乳糖操纵子通过负调控（阻遏蛋白）和正调控（cAMP-CRP）的双重机制实现精确调控，确保只在需要时表达相关基因。'
    }
  };

  const regulationSteps = [
    {
      title: '步骤1: 无乳糖状态',
      description: '阻遏蛋白结合操纵基因，RNA聚合酶无法启动转录',
      showElements: ['repressor', 'operator']
    },
    {
      title: '步骤2: 乳糖进入细胞',
      description: '透性酶将乳糖转运进入细胞',
      showElements: ['lacY']
    },
    {
      title: '步骤3: 形成诱导物',
      description: 'β-半乳糖苷酶将乳糖转化为异乳糖（诱导物）',
      showElements: ['lacZ', 'inducer']
    },
    {
      title: '步骤4: 阻遏蛋白失活',
      description: '诱导物结合阻遏蛋白，使其从操纵基因解离',
      showElements: ['inducer', 'repressor']
    },
    {
      title: '步骤5: 正调控激活',
      description: '葡萄糖缺乏时cAMP升高，形成cAMP-CRP复合物结合CRP位点',
      showElements: ['cAMP', 'crp', 'crp-site']
    },
    {
      title: '步骤6: 转录激活',
      description: 'RNA聚合酶结合启动子，高效转录结构基因',
      showElements: ['rnAP', 'promoter']
    }
  ];

  const primaryColor = '#3B82F6';
  const accentColor = '#10B981';
  const dangerColor = '#EF4444';
  const warningColor = '#F59E0B';
  const textColor = '#1F2937';
  const lightColor = '#E5E7EB';
  const purpleColor = '#8B5CF6';

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2" style={{ color: textColor }}>乳糖操纵子 (Lac Operon) 调控机制</h2>
        <p className="text-gray-600">{tabContents[activeTab].description}</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => setActiveTab('structure')}
          className={`px-5 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'structure'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          结构组成
        </button>
        <button
          onClick={() => setActiveTab('induced')}
          className={`px-5 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'induced'
              ? 'bg-green-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          诱导状态
        </button>
        <button
          onClick={() => setActiveTab('repressed')}
          className={`px-5 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'repressed'
              ? 'bg-red-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          阻遏状态
        </button>
        <button
          onClick={() => setActiveTab('mechanism')}
          className={`px-5 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'mechanism'
              ? 'bg-purple-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          调控机制
        </button>
      </div>

      {activeTab === 'mechanism' && (
        <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <h4 className="font-bold text-purple-800 mb-3">调控过程步骤</h4>
          <div className="flex gap-2 mb-4">
            {regulationSteps.map((_step, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                  currentStep === index
                    ? 'bg-purple-500 text-white'
                    : 'bg-white text-purple-700 hover:bg-purple-100'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <div className="bg-white p-3 rounded border border-purple-300">
            <p className="font-semibold text-purple-800">{regulationSteps[currentStep].title}</p>
            <p className="text-sm text-purple-700 mt-1">{regulationSteps[currentStep].description}</p>
          </div>
        </div>
      )}

      <div className="relative">
        <svg width="100%" height="400" viewBox="0 0 1000 400">
          <defs>
            <linearGradient id="dnaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: primaryColor }} />
              <stop offset="100%" style={{ stopColor: accentColor }} />
            </linearGradient>
            <linearGradient id="repressorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: dangerColor }} />
              <stop offset="100%" style={{ stopColor: '#DC2626' }} />
            </linearGradient>
            <linearGradient id="crpGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: purpleColor }} />
              <stop offset="100%" style={{ stopColor: '#7C3AED' }} />
            </linearGradient>
            <filter id="shadow">
              <feDropShadow dx="2" dy="2" stdDeviation="2" floodOpacity="0.2" />
            </filter>
          </defs>

          {hoveredElement && getElementDetails(hoveredElement) && (
            <foreignObject x="780" y="20" width="200" height="140">
              <div style={{
                backgroundColor: 'white',
                border: `2px solid ${primaryColor}`,
                borderRadius: '8px',
                padding: '12px',
                fontSize: '11px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
                fontFamily: 'system-ui, sans-serif'
              }}>
                <div style={{ fontWeight: 'bold', color: primaryColor, marginBottom: '6px', fontSize: '13px' }}>
                  {getElementDetails(hoveredElement).name}
                </div>
                <div style={{ color: '#666', lineHeight: '1.5' }}>
                  {getElementDetails(hoveredElement).description}
                </div>
                {getElementDetails(hoveredElement).function && (
                  <div style={{ marginTop: '8px', color: '#888', fontSize: '10px' }}>
                    <strong>功能:</strong> {getElementDetails(hoveredElement).function}
                  </div>
                )}
                {getElementDetails(hoveredElement).location && (
                  <div style={{ marginTop: '4px', color: '#888', fontSize: '10px' }}>
                    <strong>位置:</strong> {getElementDetails(hoveredElement).location}
                  </div>
                )}
              </div>
            </foreignObject>
          )}

          {activeTab === 'structure' && (
            <>
              <text x="500" y="35" textAnchor="middle" fontSize="18" fontWeight="bold" fill={textColor}>
                乳糖操纵子完整结构
              </text>

              <line x1="80" y1="280" x2="920" y2="280" stroke={textColor} strokeWidth="4" />
              <line x1="80" y1="300" x2="920" y2="300" stroke={textColor} strokeWidth="4" />

              <g
                onMouseEnter={() => setHoveredElement('laci-gene')}
                onMouseLeave={() => setHoveredElement(null)}
                style={{ cursor: 'pointer' }}
              >
                <rect x="80" y="230" width="70" height="50" fill={warningColor} fillOpacity="0.3" stroke={warningColor} strokeWidth="2" rx="5" filter="url(#shadow)" />
                <text x="115" y="260" textAnchor="middle" fontSize="12" fontWeight="bold" fill={warningColor}>lacI</text>
              </g>

              <g
                onMouseEnter={() => setHoveredElement('crp-site')}
                onMouseLeave={() => setHoveredElement(null)}
                style={{ cursor: 'pointer' }}
              >
                <rect x="170" y="230" width="60" height="50" fill={purpleColor} fillOpacity="0.3" stroke={purpleColor} strokeWidth="2" rx="5" filter="url(#shadow)" />
                <text x="200" y="260" textAnchor="middle" fontSize="12" fontWeight="bold" fill={purpleColor}>CRP</text>
              </g>

              <g
                onMouseEnter={() => setHoveredElement('promoter')}
                onMouseLeave={() => setHoveredElement(null)}
                style={{ cursor: 'pointer' }}
              >
                <rect x="250" y="230" width="70" height="50" fill={primaryColor} fillOpacity="0.3" stroke={primaryColor} strokeWidth="2" rx="5" filter="url(#shadow)" />
                <text x="285" y="260" textAnchor="middle" fontSize="12" fontWeight="bold" fill={primaryColor}>P</text>
              </g>

              <g
                onMouseEnter={() => setHoveredElement('operator')}
                onMouseLeave={() => setHoveredElement(null)}
                style={{ cursor: 'pointer' }}
              >
                <rect x="340" y="230" width="70" height="50" fill={dangerColor} fillOpacity="0.3" stroke={dangerColor} strokeWidth="2" rx="5" filter="url(#shadow)" />
                <text x="375" y="260" textAnchor="middle" fontSize="12" fontWeight="bold" fill={dangerColor}>O</text>
              </g>

              <g
                onMouseEnter={() => setHoveredElement('lacZ')}
                onMouseLeave={() => setHoveredElement(null)}
                style={{ cursor: 'pointer' }}
              >
                <rect x="430" y="230" width="100" height="50" fill={accentColor} fillOpacity="0.3" stroke={accentColor} strokeWidth="2" rx="5" filter="url(#shadow)" />
                <text x="480" y="260" textAnchor="middle" fontSize="12" fontWeight="bold" fill={accentColor}>lacZ</text>
              </g>

              <g
                onMouseEnter={() => setHoveredElement('lacY')}
                onMouseLeave={() => setHoveredElement(null)}
                style={{ cursor: 'pointer' }}
              >
                <rect x="550" y="230" width="80" height="50" fill={accentColor} fillOpacity="0.3" stroke={accentColor} strokeWidth="2" rx="5" filter="url(#shadow)" />
                <text x="590" y="260" textAnchor="middle" fontSize="12" fontWeight="bold" fill={accentColor}>lacY</text>
              </g>

              <g
                onMouseEnter={() => setHoveredElement('lacA')}
                onMouseLeave={() => setHoveredElement(null)}
                style={{ cursor: 'pointer' }}
              >
                <rect x="650" y="230" width="70" height="50" fill={accentColor} fillOpacity="0.3" stroke={accentColor} strokeWidth="2" rx="5" filter="url(#shadow)" />
                <text x="685" y="260" textAnchor="middle" fontSize="12" fontWeight="bold" fill={accentColor}>lacA</text>
              </g>

              <text x="500" y="320" textAnchor="middle" fontSize="12" fill="#666">操纵子 DNA</text>

              <rect x="250" y="210" width="160" height="20" fill={primaryColor} fillOpacity="0.1" stroke={primaryColor} strokeWidth="1" rx="3" />
              <text x="330" y="224" textAnchor="middle" fontSize="10" fill={primaryColor}>转录起始区</text>

              <g
                onMouseEnter={() => setHoveredElement('repressor')}
                onMouseLeave={() => setHoveredElement(null)}
                style={{ cursor: 'pointer' }}
              >
                <rect x="330" y="100" width="90" height="60" fill="url(#repressorGradient)" stroke={dangerColor} strokeWidth="2" rx="8" filter="url(#shadow)" />
                <text x="375" y="125" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">lac阻遏蛋白</text>
                <text x="375" y="142" textAnchor="middle" fontSize="9" fill="white">四聚体</text>
              </g>

              <path d="M 375 160 L 375 200" stroke={dangerColor} strokeWidth="2" strokeDasharray="4,2" />

              <rect x="160" y="90" width="90" height="80" fill={lightColor} fillOpacity="0.5" stroke={textColor} strokeWidth="1" rx="5" />
              <text x="205" y="115" textAnchor="middle" fontSize="11" fontWeight="bold" fill={textColor}>lacI表达</text>
              <text x="205" y="135" textAnchor="middle" fontSize="9" fill="#666">独立启动子</text>
              <text x="205" y="150" textAnchor="middle" fontSize="9" fill="#666">持续表达</text>

              <line x1="250" y1="130" x2="330" y2="130" stroke={textColor} strokeWidth="1.5" strokeDasharray="3,2" />

              <g transform="translate(750, 80)">
                <rect x="0" y="0" width="200" height="160" fill={lightColor} fillOpacity="0.3" stroke={textColor} strokeWidth="1" rx="8" />
                <text x="100" y="25" textAnchor="middle" fontSize="13" fontWeight="bold" fill={textColor}>结构基因功能</text>
                <text x="100" y="50" textAnchor="middle" fontSize="10" fill={accentColor} fontWeight="bold">lacZ: β-半乳糖苷酶</text>
                <text x="100" y="68" textAnchor="middle" fontSize="9" fill="#666">分解乳糖</text>
                <text x="100" y="88" textAnchor="middle" fontSize="10" fill={accentColor} fontWeight="bold">lacY: 透性酶</text>
                <text x="100" y="106" textAnchor="middle" fontSize="9" fill="#666">转运乳糖</text>
                <text x="100" y="126" textAnchor="middle" fontSize="10" fill={accentColor} fontWeight="bold">lacA: 转乙酰酶</text>
                <text x="100" y="144" textAnchor="middle" fontSize="9" fill="#666">功能未知</text>
              </g>
            </>
          )}

          {activeTab === 'induced' && (
            <>
              <text x="500" y="35" textAnchor="middle" fontSize="18" fontWeight="bold" fill={accentColor}>
                诱导状态 - 乳糖存在，葡萄糖缺乏
              </text>

              <line x1="80" y1="280" x2="920" y2="280" stroke={textColor} strokeWidth="4" />
              <line x1="80" y1="300" x2="920" y2="300" stroke={textColor} strokeWidth="4" />

              <g
                onMouseEnter={() => setHoveredElement('laci-gene')}
                onMouseLeave={() => setHoveredElement(null)}
                style={{ cursor: 'pointer' }}
              >
                <rect x="80" y="230" width="70" height="50" fill={warningColor} fillOpacity="0.2" stroke={warningColor} strokeWidth="1" rx="5" />
                <text x="115" y="260" textAnchor="middle" fontSize="12" fill={warningColor}>lacI</text>
              </g>

              <rect x="170" y="230" width="60" height="50" fill={purpleColor} fillOpacity="0.3" stroke={purpleColor} strokeWidth="2" rx="5" />
              <text x="200" y="260" textAnchor="middle" fontSize="12" fontWeight="bold" fill={purpleColor}>CRP</text>

              <rect x="250" y="230" width="70" height="50" fill={primaryColor} fillOpacity="0.3" stroke={primaryColor} strokeWidth="2" rx="5" />
              <text x="285" y="260" textAnchor="middle" fontSize="12" fontWeight="bold" fill={primaryColor}>P</text>

              <rect x="340" y="230" width="70" height="50" fill={lightColor} fillOpacity="0.3" stroke={textColor} strokeWidth="1" rx="5" />
              <text x="375" y="260" textAnchor="middle" fontSize="12" fill={textColor}>O</text>

              <g
                onMouseEnter={() => setHoveredElement('lacZ')}
                onMouseLeave={() => setHoveredElement(null)}
                style={{ cursor: 'pointer' }}
              >
                <rect x="430" y="230" width="100" height="50" fill={accentColor} fillOpacity="0.6" stroke={accentColor} strokeWidth="3" rx="5" filter="url(#shadow)" />
                <text x="480" y="260" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">lacZ</text>
              </g>

              <g
                onMouseEnter={() => setHoveredElement('lacY')}
                onMouseLeave={() => setHoveredElement(null)}
                style={{ cursor: 'pointer' }}
              >
                <rect x="550" y="230" width="80" height="50" fill={accentColor} fillOpacity="0.6" stroke={accentColor} strokeWidth="3" rx="5" filter="url(#shadow)" />
                <text x="590" y="260" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">lacY</text>
              </g>

              <g
                onMouseEnter={() => setHoveredElement('lacA')}
                onMouseLeave={() => setHoveredElement(null)}
                style={{ cursor: 'pointer' }}
              >
                <rect x="650" y="230" width="70" height="50" fill={accentColor} fillOpacity="0.6" stroke={accentColor} strokeWidth="3" rx="5" filter="url(#shadow)" />
                <text x="685" y="260" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">lacA</text>
              </g>

              <g
                onMouseEnter={() => setHoveredElement('crp')}
                onMouseLeave={() => setHoveredElement(null)}
                style={{ cursor: 'pointer' }}
              >
                <ellipse cx="200" cy="140" rx="50" ry="35" fill="url(#crpGradient)" stroke={purpleColor} strokeWidth="2" filter="url(#shadow)" />
                <text x="200" y="135" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">cAMP-CRP</text>
                <text x="200" y="152" textAnchor="middle" fontSize="9" fill="white">复合物</text>
              </g>

              <path d="M 200 175 L 200 220" stroke={purpleColor} strokeWidth="2" />
              <circle cx="200" cy="220" r="5" fill={purpleColor} />

              <g
                onMouseEnter={() => setHoveredElement('rnAP')}
                onMouseLeave={() => setHoveredElement(null)}
                style={{ cursor: 'pointer' }}
              >
                <ellipse cx="320" cy="150" rx="55" ry="40" fill={primaryColor} fillOpacity="0.8" stroke={primaryColor} strokeWidth="3" filter="url(#shadow)" />
                <text x="320" y="145" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">RNA聚合酶</text>
                <text x="320" y="162" textAnchor="middle" fontSize="9" fill="white">σ70</text>
              </g>

              <path d="M 320 190 L 320 220" stroke={primaryColor} strokeWidth="2" />
              <circle cx="320" cy="220" r="5" fill={primaryColor} />

              <g
                onMouseEnter={() => setHoveredElement('inducer')}
                onMouseLeave={() => setHoveredElement(null)}
                style={{ cursor: 'pointer' }}
              >
                <circle cx="100" cy="120" r="25" fill={accentColor} fillOpacity="0.6" stroke={accentColor} strokeWidth="2" />
                <text x="100" y="125" textAnchor="middle" fontSize="9" fill="white">诱导物</text>
              </g>

              <g
                onMouseEnter={() => setHoveredElement('repressor')}
                onMouseLeave={() => setHoveredElement(null)}
                style={{ cursor: 'pointer' }}
              >
                <rect x="120" y="95" width="70" height="50" fill={warningColor} fillOpacity="0.4" stroke={warningColor} strokeWidth="2" rx="5" />
                <text x="155" y="120" textAnchor="middle" fontSize="10" fill="white">阻遏蛋白</text>
                <text x="155" y="135" textAnchor="middle" fontSize="8" fill="white">失活</text>
              </g>

              <path d="M 140 145 L 125 130" stroke={accentColor} strokeWidth="2" />

              <path d="M 400 200 L 420 225" stroke={primaryColor} strokeWidth="2" strokeDasharray="4,2" />
              <text x="430" y="220" fontSize="11" fontWeight="bold" fill={accentColor}>→ 转录活跃 →</text>

              <rect x="450" y="320" width="300" height="30" fill={accentColor} fillOpacity="0.1" stroke={accentColor} strokeWidth="2" rx="5" />
              <text x="600" y="340" textAnchor="middle" fontSize="11" fontWeight="bold" fill={accentColor}>基因表达开启 - 高效转录</text>

              <g transform="translate(760, 60)">
                <rect x="0" y="0" width="200" height="130" fill={accentColor} fillOpacity="0.1" stroke={accentColor} strokeWidth="1" rx="8" />
                <text x="100" y="25" textAnchor="middle" fontSize="12" fontWeight="bold" fill={accentColor}>诱导条件</text>
                <text x="20" y="50" fontSize="10" fill="#666">✓ 乳糖存在</text>
                <text x="20" y="70" fontSize="10" fill="#666">✓ 诱导物结合阻遏蛋白</text>
                <text x="20" y="90" fontSize="10" fill="#666">✓ 阻遏蛋白从O位点解离</text>
                <text x="20" y="110" fontSize="10" fill="#666">✓ cAMP-CRP增强转录</text>
              </g>
            </>
          )}

          {activeTab === 'repressed' && (
            <>
              <text x="500" y="35" textAnchor="middle" fontSize="18" fontWeight="bold" fill={dangerColor}>
                阻遏状态 - 无乳糖或葡萄糖丰富
              </text>

              <line x1="80" y1="280" x2="920" y2="280" stroke={textColor} strokeWidth="4" />
              <line x1="80" y1="300" x2="920" y2="300" stroke={textColor} strokeWidth="4" />

              <g
                onMouseEnter={() => setHoveredElement('laci-gene')}
                onMouseLeave={() => setHoveredElement(null)}
                style={{ cursor: 'pointer' }}
              >
                <rect x="80" y="230" width="70" height="50" fill={warningColor} fillOpacity="0.3" stroke={warningColor} strokeWidth="2" rx="5" filter="url(#shadow)" />
                <text x="115" y="260" textAnchor="middle" fontSize="12" fontWeight="bold" fill={warningColor}>lacI</text>
              </g>

              <rect x="170" y="230" width="60" height="50" fill={lightColor} fillOpacity="0.2" stroke={textColor} strokeWidth="1" rx="5" />
              <text x="200" y="260" textAnchor="middle" fontSize="12" fill={textColor}>CRP</text>

              <rect x="250" y="230" width="70" height="50" fill={lightColor} fillOpacity="0.2" stroke={textColor} strokeWidth="1" rx="5" />
              <text x="285" y="260" textAnchor="middle" fontSize="12" fill={textColor}>P</text>

              <g
                onMouseEnter={() => setHoveredElement('operator')}
                onMouseLeave={() => setHoveredElement(null)}
                style={{ cursor: 'pointer' }}
              >
                <rect x="340" y="230" width="70" height="50" fill={dangerColor} fillOpacity="0.5" stroke={dangerColor} strokeWidth="3" rx="5" filter="url(#shadow)" />
                <text x="375" y="260" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">O</text>
              </g>

              <rect x="430" y="230" width="100" height="50" fill={lightColor} fillOpacity="0.2" stroke={textColor} strokeWidth="1" rx="5" />
              <text x="480" y="260" textAnchor="middle" fontSize="12" fill={textColor}>lacZ</text>

              <rect x="550" y="230" width="80" height="50" fill={lightColor} fillOpacity="0.2" stroke={textColor} strokeWidth="1" rx="5" />
              <text x="590" y="260" textAnchor="middle" fontSize="12" fill={textColor}>lacY</text>

              <rect x="650" y="230" width="70" height="50" fill={lightColor} fillOpacity="0.2" stroke={textColor} strokeWidth="1" rx="5" />
              <text x="685" y="260" textAnchor="middle" fontSize="12" fill={textColor}>lacA</text>

              <g
                onMouseEnter={() => setHoveredElement('repressor')}
                onMouseLeave={() => setHoveredElement(null)}
                style={{ cursor: 'pointer' }}
              >
                <rect x="320" y="110" width="110" height="70" fill="url(#repressorGradient)" stroke={dangerColor} strokeWidth="3" rx="8" filter="url(#shadow)" />
                <text x="375" y="140" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">lac阻遏蛋白</text>
                <text x="375" y="160" textAnchor="middle" fontSize="10" fill="white">结合状态</text>
              </g>

              <path d="M 375 180 L 375 220" stroke={dangerColor} strokeWidth="3" />
              <path d="M 360 220 L 390 220" stroke={dangerColor} strokeWidth="3" />
              <path d="M 365 215 L 395 215" stroke={dangerColor} strokeWidth="2" />

              <text x="500" y="150" textAnchor="middle" fontSize="14" fontWeight="bold" fill={dangerColor}>
                ✗ 转录受阻
              </text>
              <text x="500" y="175" textAnchor="middle" fontSize="11" fill={dangerColor}>
                阻遏蛋白阻断RNA聚合酶
              </text>

              <rect x="330" y="185" width="90" height="15" fill={dangerColor} fillOpacity="0.2" stroke={dangerColor} strokeWidth="1" rx="3" />
              <text x="375" y="196" textAnchor="middle" fontSize="9" fill={dangerColor}>结合位点</text>

              <rect x="430" y="320" width="300" height="30" fill={dangerColor} fillOpacity="0.1" stroke={dangerColor} strokeWidth="2" rx="5" />
              <text x="580" y="340" textAnchor="middle" fontSize="11" fontWeight="bold" fill={dangerColor}>基因表达关闭</text>

              <g transform="translate(760, 60)">
                <rect x="0" y="0" width="200" height="130" fill={dangerColor} fillOpacity="0.1" stroke={dangerColor} strokeWidth="1" rx="8" />
                <text x="100" y="25" textAnchor="middle" fontSize="12" fontWeight="bold" fill={dangerColor}>阻遏条件</text>
                <text x="20" y="50" fontSize="10" fill="#666">✗ 无乳糖</text>
                <text x="20" y="70" fontSize="10" fill="#666">✗ 无诱导物</text>
                <text x="20" y="90" fontSize="10" fill="#666">✗ 阻遏蛋白结合O位点</text>
                <text x="20" y="110" fontSize="10" fill="#666">✗ RNA聚合酶无法通过</text>
              </g>

              <g transform="translate(80, 80)">
                <rect x="0" y="0" width="140" height="70" fill={lightColor} fillOpacity="0.3" stroke={textColor} strokeWidth="1" rx="5" />
                <text x="70" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill={textColor}>葡萄糖丰富时</text>
                <text x="15" y="40" fontSize="9" fill="#666">• cAMP浓度低</text>
                <text x="15" y="55" fontSize="9" fill="#666">• CRP不结合DNA</text>
              </g>
            </>
          )}

          {activeTab === 'mechanism' && (
            <>
              <text x="500" y="35" textAnchor="middle" fontSize="18" fontWeight="bold" fill={purpleColor}>
                调控机制可视化
              </text>

              <line x1="80" y1="280" x2="920" y2="280" stroke={textColor} strokeWidth="4" />
              <line x1="80" y1="300" x2="920" y2="300" stroke={textColor} strokeWidth="4" />

              <rect x="80" y="230" width="70" height="50" fill={warningColor} fillOpacity="0.3" stroke={warningColor} strokeWidth="2" rx="5" />
              <text x="115" y="260" textAnchor="middle" fontSize="12" fontWeight="bold" fill={warningColor}>lacI</text>

              <rect x="170" y="230" width="60" height="50" fill={purpleColor} fillOpacity="0.3" stroke={purpleColor} strokeWidth="2" rx="5" />
              <text x="200" y="260" textAnchor="middle" fontSize="12" fontWeight="bold" fill={purpleColor}>CRP</text>

              <rect x="250" y="230" width="70" height="50" fill={primaryColor} fillOpacity="0.3" stroke={primaryColor} strokeWidth="2" rx="5" />
              <text x="285" y="260" textAnchor="middle" fontSize="12" fontWeight="bold" fill={primaryColor}>P</text>

              <rect x="340" y="230" width="70" height="50" fill={dangerColor} fillOpacity="0.3" stroke={dangerColor} strokeWidth="2" rx="5" />
              <text x="375" y="260" textAnchor="middle" fontSize="12" fontWeight="bold" fill={dangerColor}>O</text>

              <rect x="430" y="230" width="100" height="50" fill={accentColor} fillOpacity="0.3" stroke={accentColor} strokeWidth="2" rx="5" />
              <text x="480" y="260" textAnchor="middle" fontSize="12" fontWeight="bold" fill={accentColor}>lacZ</text>

              <rect x="550" y="230" width="80" height="50" fill={accentColor} fillOpacity="0.3" stroke={accentColor} strokeWidth="2" rx="5" />
              <text x="590" y="260" textAnchor="middle" fontSize="12" fontWeight="bold" fill={accentColor}>lacY</text>

              <rect x="650" y="230" width="70" height="50" fill={accentColor} fillOpacity="0.3" stroke={accentColor} strokeWidth="2" rx="5" />
              <text x="685" y="260" textAnchor="middle" fontSize="12" fontWeight="bold" fill={accentColor}>lacA</text>

              {currentStep >= 0 && (
                <g
                  onMouseEnter={() => setHoveredElement('repressor')}
                  onMouseLeave={() => setHoveredElement(null)}
                  style={{ cursor: 'pointer' }}
                >
                  <rect x="320" y="110" width="110" height="70" fill={currentStep >= 3 ? warningColor : 'url(#repressorGradient)'} fillOpacity="0.6" stroke={dangerColor} strokeWidth={currentStep >= 3 ? 1 : 3} rx="8" filter="url(#shadow)" />
                  <text x="375" y="140" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">阻遏蛋白</text>
                  <text x="375" y="160" textAnchor="middle" fontSize="9" fill={currentStep >= 3 ? 'white' : 'white'}>{currentStep >= 3 ? '失活' : '结合'}</text>
                </g>
              )}

              {currentStep >= 1 && (
                <>
                  <circle cx="150" cy="85" r="18" fill={accentColor} fillOpacity="0.6" stroke={accentColor} strokeWidth="2" />
                  <text x="150" y="90" textAnchor="middle" fontSize="8" fill="white">乳糖</text>
                  <path d="M 150 103 L 180 125" stroke={accentColor} strokeWidth="2" />
                </>
              )}

              {currentStep >= 2 && (
                <>
                  <circle cx="195" cy="140" r="15" fill={accentColor} fillOpacity="0.6" stroke={accentColor} strokeWidth="2" />
                  <text x="195" y="144" textAnchor="middle" fontSize="7" fill="white">诱导物</text>
                </>
              )}

              {currentStep >= 3 && currentStep < 6 && (
                <>
                  <path d="M 210 145 L 320 145" stroke={accentColor} strokeWidth="2" strokeDasharray="4,2" />
                </>
              )}

              {currentStep >= 4 && (
                <>
                  <ellipse cx="200" cy="60" rx="45" ry="25" fill="url(#crpGradient)" stroke={purpleColor} strokeWidth="2" filter="url(#shadow)" />
                  <text x="200" y="58" textAnchor="middle" fontSize="9" fontWeight="bold" fill="white">cAMP-CRP</text>
                  <path d="M 200 85 L 200 220" stroke={purpleColor} strokeWidth="2" />
                  <circle cx="200" cy="220" r="6" fill={purpleColor} />
                </>
              )}

              {currentStep >= 5 && (
                <>
                  <ellipse cx="320" cy="150" rx="55" ry="40" fill={primaryColor} fillOpacity="0.8" stroke={primaryColor} strokeWidth="3" filter="url(#shadow)" />
                  <text x="320" y="145" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">RNA聚合酶</text>
                  <text x="320" y="162" textAnchor="middle" fontSize="9" fill="white">σ70</text>
                  <path d="M 320 190 L 320 220" stroke={primaryColor} strokeWidth="2" />
                  <circle cx="320" cy="220" r="5" fill={primaryColor} />
                  
                  <path d="M 400 200 L 420 225" stroke={accentColor} strokeWidth="2" strokeDasharray="4,2" />
                  <text x="430" y="220" fontSize="11" fontWeight="bold" fill={accentColor}>→ 转录 →</text>
                  
                  <rect x="430" y="230" width="100" height="50" fill={accentColor} fillOpacity="0.6" stroke={accentColor} strokeWidth="3" rx="5" />
                  <rect x="550" y="230" width="80" height="50" fill={accentColor} fillOpacity="0.6" stroke={accentColor} strokeWidth="3" rx="5" />
                  <rect x="650" y="230" width="70" height="50" fill={accentColor} fillOpacity="0.6" stroke={accentColor} strokeWidth="3" rx="5" />
                  <text x="480" y="260" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">lacZ</text>
                  <text x="590" y="260" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">lacY</text>
                  <text x="685" y="260" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">lacA</text>
                </>
              )}

              {currentStep < 3 && (
                <>
                  <path d="M 375 180 L 375 220" stroke={dangerColor} strokeWidth="3" />
                  <path d="M 360 220 L 390 220" stroke={dangerColor} strokeWidth="3" />
                  <path d="M 365 215 L 395 215" stroke={dangerColor} strokeWidth="2" />
                  
                  <rect x="340" y="230" width="70" height="50" fill={dangerColor} fillOpacity="0.5" stroke={dangerColor} strokeWidth="3" rx="5" />
                  <text x="375" y="260" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">O</text>
                  
                  <text x="500" y="150" textAnchor="middle" fontSize="13" fontWeight="bold" fill={dangerColor}>转录受阻</text>
                </>
              )}

              <g transform="translate(760, 60)">
                <rect x="0" y="0" width="200" height="200" fill={lightColor} fillOpacity="0.3" stroke={textColor} strokeWidth="1" rx="8" />
                <text x="100" y="25" textAnchor="middle" fontSize="12" fontWeight="bold" fill={textColor}>双重调控机制</text>
                <text x="20" y="50" fontSize="10" fill={dangerColor} fontWeight="bold">负调控 (阻遏蛋白)</text>
                <text x="20" y="70" fontSize="9" fill="#666">• 无诱导物时结合O</text>
                <text x="20" y="85" fontSize="9" fill="#666">• 阻止RNA聚合酶</text>
                <text x="20" y="100" fontSize="9" fill="#666">• 诱导物使其解离</text>
                <text x="20" y="125" fontSize="10" fill={purpleColor} fontWeight="bold">正调控 (cAMP-CRP)</text>
                <text x="20" y="145" fontSize="9" fill="#666">• 葡萄糖缺乏时激活</text>
                <text x="20" y="160" fontSize="9" fill="#666">• 结合CRP位点</text>
                <text x="20" y="175" fontSize="9" fill="#666">• 增强转录效率</text>
              </g>
            </>
          )}
        </svg>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-bold text-blue-800 mb-2">启动子 (P)</h4>
          <p className="text-sm text-blue-700">RNA聚合酶结合位点，-35和-10区域</p>
        </div>
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <h4 className="font-bold text-red-800 mb-2">操纵基因 (O)</h4>
          <p className="text-sm text-red-700">阻遏蛋白结合位点，负调控</p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <h4 className="font-bold text-purple-800 mb-2">CRP位点</h4>
          <p className="text-sm text-purple-700">cAMP-CRP结合位点，正调控</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="font-bold text-green-800 mb-2">结构基因</h4>
          <p className="text-sm text-green-700">lacZ、lacY、lacA编码代谢酶</p>
        </div>
      </div>
    </div>
  );
};

export { LacOperonVisualization };
