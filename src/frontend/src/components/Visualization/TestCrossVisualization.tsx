import { useState } from 'react';

interface TestCrossVisualizationProps {
  data: any;
  colors?: Record<string, string>;
}

export function TestCrossVisualization({ data, colors }: TestCrossVisualizationProps) {
  const [activeTab, setActiveTab] = useState<'principle' | 'process' | 'comparison' | 'application'>('principle');
  const [currentStep, setCurrentStep] = useState(0);
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);

  const defaultColors = {
    dominant: colors?.dominant || '#4CAF50',
    recessive: colors?.recessive || '#FF9800',
    heterozygous: colors?.heterozygous || '#2196F3',
    unknown: colors?.unknown || '#9C27B0',
  };

  const getElementDetails = (elementId: string) => {
    const elementMap: Record<string, { name: string; description: string; details?: string }> = {
      'unknown-parent': {
        name: '待测个体',
        description: '基因型未知的显性表型个体',
        details: '表现显性性状，但基因型可能是AA或Aa'
      },
      'tester': {
        name: '隐性纯合子',
        description: '基因型为aa的测试者',
        details: '只产生一种配子a，不会影响后代表型观察'
      },
      'gamete-A': {
        name: '配子A',
        description: '含显性基因A的配子',
        details: '由AA或Aa个体产生'
      },
      'gamete-a': {
        name: '配子a',
        description: '含隐性基因a的配子',
        details: '由aa或Aa个体产生'
      },
      'offspring-Aa': {
        name: '后代Aa',
        description: '杂合子个体',
        details: '表现显性性状，基因型为Aa'
      },
      'offspring-aa': {
        name: '后代aa',
        description: '隐性纯合子个体',
        details: '表现隐性性状，基因型为aa'
      },
      'meiosis': {
        name: '减数分裂',
        description: '产生配子的过程',
        details: '染色体减半，形成单倍体配子'
      },
      'fertilization': {
        name: '受精作用',
        description: '配子结合形成受精卵',
        details: '恢复二倍体染色体数目'
      },
      'phenotype-dominant': {
        name: '显性表型',
        description: '表现显性性状的个体',
        details: '由A或Aa基因型决定'
      },
      'phenotype-recessive': {
        name: '隐性表型',
        description: '表现隐性性状的个体',
        details: '仅由aa基因型决定'
      },
      'meiosis-1': {
        name: '减数分裂I',
        description: '同源染色体分离',
        details: '染色体数目减半'
      },
      'meiosis-2': {
        name: '减数分裂II',
        description: '姐妹染色单体分离',
        details: '形成4个单倍体配子'
      },
    };
    return elementMap[elementId];
  };

  const testCrossSteps = [
    {
      title: '步骤1: 选择待测个体',
      description: '选择表现显性性状但基因型未知的个体作为待测对象',
      showElements: ['unknown-parent'],
      highlight: 'unknown-parent'
    },
    {
      title: '步骤2: 选择隐性纯合子',
      description: '选择已知的隐性纯合子（aa）作为测试者',
      showElements: ['unknown-parent', 'tester'],
      highlight: 'tester'
    },
    {
      title: '步骤3: 杂交配子形成',
      description: '通过减数分裂，待测个体和隐性纯合子各自产生配子',
      showElements: ['unknown-parent', 'tester', 'meiosis'],
      highlight: 'meiosis'
    },
    {
      title: '步骤4: 受精作用',
      description: '配子结合形成受精卵，发育成后代个体',
      showElements: ['unknown-parent', 'tester', 'meiosis', 'fertilization'],
      highlight: 'fertilization'
    },
    {
      title: '步骤5: 观察后代表型',
      description: '观察并统计后代的表型及其比例',
      showElements: ['unknown-parent', 'tester', 'meiosis', 'fertilization', 'phenotype-dominant', 'phenotype-recessive'],
      highlight: 'phenotype-dominant'
    },
    {
      title: '步骤6: 推断基因型',
      description: '根据后代表型比例推断待测个体的基因型',
      showElements: ['unknown-parent', 'tester', 'meiosis', 'fertilization', 'phenotype-dominant', 'phenotype-recessive', 'offspring-Aa', 'offspring-aa'],
      highlight: 'unknown-parent'
    },
  ];

  const testCrosses = data?.testCrosses || [];
  const applications = data?.applications || [];
  const advantages = data?.advantages || [];
  const limitations = data?.limitations || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => { setActiveTab('principle'); setCurrentStep(0); }}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'principle'
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          测交原理
        </button>
        <button
          onClick={() => { setActiveTab('process'); setCurrentStep(0); }}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'process'
              ? 'bg-purple-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          测交过程
        </button>
        <button
          onClick={() => { setActiveTab('comparison'); setCurrentStep(0); }}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'comparison'
              ? 'bg-green-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          对比分析
        </button>
        <button
          onClick={() => { setActiveTab('application'); setCurrentStep(0); }}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'application'
              ? 'bg-orange-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          实际应用
        </button>
      </div>

      {activeTab === 'principle' && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-blue-800">测交原理</h3>
          
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-3">什么是测交？</h4>
            <p className="text-gray-700 leading-relaxed">
              测交是将<strong>未知基因型</strong>的个体与<strong>隐性纯合子</strong>进行杂交，
              通过观察后代的表型比例来推断待测个体的基因型。
            </p>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-3">为什么用隐性纯合子？</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>隐性纯合子只产生一种配子（a），不会影响后代表型的观察</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>后代的表型直接反映待测个体产生的配子类型</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>可以准确区分显性纯合子和杂合子</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-3">测交模式</h4>
            <div className="flex justify-center">
              <svg width="500" height="250" viewBox="0 0 500 250">
                <text x="250" y="20" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1976D2">测交杂交模式</text>
                
                <g
                  onMouseEnter={() => setHoveredElement('unknown-parent')}
                  onMouseLeave={() => setHoveredElement(null)}
                  style={{ cursor: 'pointer' }}
                >
                  <text x="125" y="60" textAnchor="middle" fontSize="12" fill="#666">待测个体</text>
                  <rect x="85" y="70" width="80" height="50" fill={defaultColors.unknown} fillOpacity="0.2" stroke={defaultColors.unknown} strokeWidth="2" rx="5"/>
                  <text x="125" y="100" textAnchor="middle" fontSize="18" fontWeight="bold" fill={defaultColors.unknown}>A?</text>
                </g>
                
                <text x="250" y="95" textAnchor="middle" fontSize="20" fill="#666">×</text>
                
                <g
                  onMouseEnter={() => setHoveredElement('tester')}
                  onMouseLeave={() => setHoveredElement(null)}
                  style={{ cursor: 'pointer' }}
                >
                  <text x="375" y="60" textAnchor="middle" fontSize="12" fill="#666">隐性纯合子</text>
                  <rect x="335" y="70" width="80" height="50" fill={defaultColors.recessive} fillOpacity="0.2" stroke={defaultColors.recessive} strokeWidth="2" rx="5"/>
                  <text x="375" y="100" textAnchor="middle" fontSize="18" fontWeight="bold" fill={defaultColors.recessive}>aa</text>
                </g>
                
                <line x1="125" y1="130" x2="125" y2="145" stroke="#666" strokeWidth="2" strokeDasharray="4"/>
                <line x1="375" y1="130" x2="375" y2="145" stroke="#666" strokeWidth="2" strokeDasharray="4"/>
                <line x1="125" y1="145" x2="375" y2="145" stroke="#666" strokeWidth="2" strokeDasharray="4"/>
                <line x1="250" y1="145" x2="250" y2="160" stroke="#666" strokeWidth="2" strokeDasharray="4"/>
                
                <text x="250" y="180" textAnchor="middle" fontSize="12" fill="#666">测交后代</text>
                
                <g
                  onMouseEnter={() => setHoveredElement('offspring-Aa')}
                  onMouseLeave={() => setHoveredElement(null)}
                  style={{ cursor: 'pointer' }}
                >
                  <rect x="180" y="190" width="70" height="45" fill={defaultColors.heterozygous} fillOpacity="0.2" stroke={defaultColors.heterozygous} strokeWidth="2" rx="5"/>
                  <text x="215" y="220" textAnchor="middle" fontSize="16" fontWeight="bold" fill={defaultColors.heterozygous}>Aa</text>
                </g>
                
                <text x="260" y="217" textAnchor="middle" fontSize="14" fill="#666">或</text>
                
                <g
                  onMouseEnter={() => setHoveredElement('offspring-aa')}
                  onMouseLeave={() => setHoveredElement(null)}
                  style={{ cursor: 'pointer' }}
                >
                  <rect x="270" y="190" width="70" height="45" fill={defaultColors.recessive} fillOpacity="0.2" stroke={defaultColors.recessive} strokeWidth="2" rx="5"/>
                  <text x="305" y="220" textAnchor="middle" fontSize="16" fontWeight="bold" fill={defaultColors.recessive}>aa</text>
                </g>

                {hoveredElement && getElementDetails(hoveredElement) && (
                  <foreignObject x="30" y="20" width="150" height="80">
                    <div style={{
                      backgroundColor: 'white',
                      border: `2px solid ${hoveredElement === 'unknown-parent' ? defaultColors.unknown : hoveredElement === 'tester' ? defaultColors.recessive : hoveredElement === 'offspring-Aa' ? defaultColors.heterozygous : defaultColors.recessive}`,
                      borderRadius: '8px',
                      padding: '8px',
                      fontSize: '11px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                    }}>
                      <strong>{getElementDetails(hoveredElement).name}</strong>
                      <p style={{ margin: '4px 0', color: '#666' }}>{getElementDetails(hoveredElement).description}</p>
                    </div>
                  </foreignObject>
                )}
              </svg>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'process' && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-purple-800">测交过程</h3>
          
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-3">步骤控制</h4>
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currentStep === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-purple-500 text-white hover:bg-purple-600'
                }`}
              >
                ← 上一步
              </button>
              <span className="text-sm text-gray-600">步骤 {currentStep + 1} / {testCrossSteps.length}</span>
              <button
                onClick={() => setCurrentStep(Math.min(testCrossSteps.length - 1, currentStep + 1))}
                disabled={currentStep === testCrossSteps.length - 1}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currentStep === testCrossSteps.length - 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-purple-500 text-white hover:bg-purple-600'
                }`}
              >
                下一步 →
              </button>
            </div>
            
            <div className="mb-4">
              <h5 className="font-bold text-purple-700 mb-2">{testCrossSteps[currentStep].title}</h5>
              <p className="text-sm text-gray-700">{testCrossSteps[currentStep].description}</p>
            </div>

            <div className="flex justify-center">
              <svg width="600" height="350" viewBox="0 0 600 350">
                <text x="300" y="20" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#7C3AED">测交过程示意图</text>

                <g
                  onMouseEnter={() => setHoveredElement('unknown-parent')}
                  onMouseLeave={() => setHoveredElement(null)}
                  style={{ cursor: 'pointer', opacity: testCrossSteps[currentStep].showElements.includes('unknown-parent') ? 1 : 0.3 }}
                >
                  <text x="150" y="60" textAnchor="middle" fontSize="12" fill="#666">待测个体</text>
                  <rect x="110" y="70" width="80" height="50" fill={defaultColors.unknown} fillOpacity={testCrossSteps[currentStep].highlight === 'unknown-parent' ? 0.4 : 0.2} stroke={defaultColors.unknown} strokeWidth={testCrossSteps[currentStep].highlight === 'unknown-parent' ? 3 : 2} rx="5"/>
                  <text x="150" y="100" textAnchor="middle" fontSize="18" fontWeight="bold" fill={defaultColors.unknown}>A?</text>
                </g>

                <text x="300" y="95" textAnchor="middle" fontSize="20" fill="#666">×</text>

                <g
                  onMouseEnter={() => setHoveredElement('tester')}
                  onMouseLeave={() => setHoveredElement(null)}
                  style={{ cursor: 'pointer', opacity: testCrossSteps[currentStep].showElements.includes('tester') ? 1 : 0.3 }}
                >
                  <text x="450" y="60" textAnchor="middle" fontSize="12" fill="#666">隐性纯合子</text>
                  <rect x="410" y="70" width="80" height="50" fill={defaultColors.recessive} fillOpacity={testCrossSteps[currentStep].highlight === 'tester' ? 0.4 : 0.2} stroke={defaultColors.recessive} strokeWidth={testCrossSteps[currentStep].highlight === 'tester' ? 3 : 2} rx="5"/>
                  <text x="450" y="100" textAnchor="middle" fontSize="18" fontWeight="bold" fill={defaultColors.recessive}>aa</text>
                </g>

                <g
                  onMouseEnter={() => setHoveredElement('meiosis')}
                  onMouseLeave={() => setHoveredElement(null)}
                  style={{ cursor: 'pointer', opacity: testCrossSteps[currentStep].showElements.includes('meiosis') ? 1 : 0.3 }}
                >
                  <line x1="150" y1="130" x2="150" y2="150" stroke="#666" strokeWidth="2" strokeDasharray="4"/>
                  <line x1="450" y1="130" x2="450" y2="150" stroke="#666" strokeWidth="2" strokeDasharray="4"/>
                  <rect x="120" y="150" width="120" height="60" fill="#F3E5F5" stroke={testCrossSteps[currentStep].highlight === 'meiosis' ? '#9C27B0' : '#BA68C8'} strokeWidth={testCrossSteps[currentStep].highlight === 'meiosis' ? 3 : 2} rx="5"/>
                  <text x="180" y="175" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#7C3AED">减数分裂</text>
                  <text x="180" y="195" textAnchor="middle" fontSize="10" fill="#666">产生配子</text>
                  
                  <rect x="360" y="150" width="120" height="60" fill="#F3E5F5" stroke={testCrossSteps[currentStep].highlight === 'meiosis' ? '#9C27B0' : '#BA68C8'} strokeWidth={testCrossSteps[currentStep].highlight === 'meiosis' ? 3 : 2} rx="5"/>
                  <text x="420" y="175" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#7C3AED">减数分裂</text>
                  <text x="420" y="195" textAnchor="middle" fontSize="10" fill="#666">产生配子</text>
                </g>

                <g
                  style={{ opacity: testCrossSteps[currentStep].showElements.includes('meiosis') ? 1 : 0.3 }}
                >
                  <line x1="180" y1="220" x2="180" y2="240" stroke="#666" strokeWidth="2" strokeDasharray="4"/>
                  <line x1="420" y1="220" x2="420" y2="240" stroke="#666" strokeWidth="2" strokeDasharray="4"/>
                  
                  <text x="180" y="255" textAnchor="middle" fontSize="12" fill="#666">配子</text>
                  <text x="180" y="275" textAnchor="middle" fontSize="14" fontWeight="bold" fill={defaultColors.unknown}>A/a</text>
                  
                  <text x="420" y="255" textAnchor="middle" fontSize="12" fill="#666">配子</text>
                  <text x="420" y="275" textAnchor="middle" fontSize="14" fontWeight="bold" fill={defaultColors.recessive}>a</text>
                </g>

                <g
                  onMouseEnter={() => setHoveredElement('fertilization')}
                  onMouseLeave={() => setHoveredElement(null)}
                  style={{ cursor: 'pointer', opacity: testCrossSteps[currentStep].showElements.includes('fertilization') ? 1 : 0.3 }}
                >
                  <line x1="180" y1="285" x2="420" y2="285" stroke="#666" strokeWidth="2" strokeDasharray="4"/>
                  <line x1="300" y1="285" x2="300" y2="300" stroke="#666" strokeWidth="2" strokeDasharray="4"/>
                  <ellipse cx="300" cy="320" rx="60" ry="25" fill={testCrossSteps[currentStep].highlight === 'fertilization' ? '#E1BEE7' : '#F3E5F5'} stroke={testCrossSteps[currentStep].highlight === 'fertilization' ? '#9C27B0' : '#BA68C8'} strokeWidth={testCrossSteps[currentStep].highlight === 'fertilization' ? 3 : 2}/>
                  <text x="300" y="325" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#7C3AED">受精作用</text>
                </g>

                <g
                  style={{ opacity: testCrossSteps[currentStep].showElements.includes('offspring-Aa') || testCrossSteps[currentStep].showElements.includes('offspring-aa') ? 1 : 0.3 }}
                >
                  <g
                    onMouseEnter={() => setHoveredElement('offspring-Aa')}
                    onMouseLeave={() => setHoveredElement(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    <rect x="220" y="200" width="70" height="45" fill={defaultColors.heterozygous} fillOpacity="0.2" stroke={defaultColors.heterozygous} strokeWidth="2" rx="5"/>
                    <text x="255" y="228" textAnchor="middle" fontSize="14" fontWeight="bold" fill={defaultColors.heterozygous}>Aa</text>
                  </g>
                  
                  <g
                    onMouseEnter={() => setHoveredElement('offspring-aa')}
                    onMouseLeave={() => setHoveredElement(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    <rect x="310" y="200" width="70" height="45" fill={defaultColors.recessive} fillOpacity="0.2" stroke={defaultColors.recessive} strokeWidth="2" rx="5"/>
                    <text x="345" y="228" textAnchor="middle" fontSize="14" fontWeight="bold" fill={defaultColors.recessive}>aa</text>
                  </g>
                </g>

                {hoveredElement && getElementDetails(hoveredElement) && (
                  <foreignObject x="30" y="20" width="150" height="80">
                    <div style={{
                      backgroundColor: 'white',
                      border: `2px solid ${hoveredElement === 'unknown-parent' ? defaultColors.unknown : hoveredElement === 'tester' ? defaultColors.recessive : hoveredElement === 'offspring-Aa' ? defaultColors.heterozygous : defaultColors.recessive}`,
                      borderRadius: '8px',
                      padding: '8px',
                      fontSize: '11px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                    }}>
                      <strong>{getElementDetails(hoveredElement).name}</strong>
                      <p style={{ margin: '4px 0', color: '#666' }}>{getElementDetails(hoveredElement).description}</p>
                      {getElementDetails(hoveredElement).details && (
                        <p style={{ margin: '0', color: '#666', fontSize: '10px' }}>{getElementDetails(hoveredElement).details}</p>
                      )}
                    </div>
                  </foreignObject>
                )}
              </svg>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'comparison' && (
        <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-green-800">对比分析</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            {testCrosses.map((test: any, index: number) => (
              <div key={index} className="bg-white rounded-lg p-4 border-2 border-green-200">
                <h4 className="font-semibold text-green-800 mb-3">{test.name}</h4>
                
                <div className="flex justify-center mb-4">
                  <svg width="280" height="200" viewBox="0 0 280 200">
                    <text x="140" y="20" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#388E3C">{test.cross}</text>
                    
                    <g transform="translate(50, 40)">
                      <rect x="0" y="0" width="50" height="40" fill="#E8EAF6" stroke="#9C27B0" strokeWidth="2" rx="4"/>
                      <text x="25" y="25" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#9C27B0">{test.parentGenotype}</text>
                      <text x="25" y="55" textAnchor="middle" fontSize="10" fill="#666">待测</text>
                    </g>
                    
                    <text x="140" y="65" textAnchor="middle" fontSize="18" fill="#666">×</text>
                    
                    <g transform="translate(180, 40)">
                      <rect x="0" y="0" width="50" height="40" fill="#FFF3E0" stroke="#FF9800" strokeWidth="2" rx="4"/>
                      <text x="25" y="25" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#FF9800">{test.testerGenotype}</text>
                      <text x="25" y="55" textAnchor="middle" fontSize="10" fill="#666">隐性</text>
                    </g>
                    
                    <line x1="140" y1="95" x2="140" y2="110" stroke="#666" strokeWidth="1" strokeDasharray="4"/>
                    
                    <g transform="translate(25, 115)">
                      <rect x="0" y="0" width="230" height="55" fill={test.parentGenotype === 'AA' ? '#E8F5E9' : '#E3F2FD'} stroke={test.parentGenotype === 'AA' ? '#4CAF50' : '#2196F3'} strokeWidth="2" rx="4"/>
                      <text x="115" y="22" textAnchor="middle" fontSize="12" fontWeight="bold" fill={test.parentGenotype === 'AA' ? '#2E7D32' : '#1565C0'}>{test.offspringRatio}</text>
                      <text x="115" y="40" textAnchor="middle" fontSize="11" fill="#666">{test.offspringPhenotype}</text>
                    </g>
                    
                    <g transform="translate(40, 180)">
                      <text x="100" y="0" textAnchor="middle" fontSize="10" fill="#388E3C" fontWeight="bold">结论: {test.conclusion}</text>
                    </g>
                  </svg>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-3">关键区别</h4>
            <table className="w-full text-sm">
              <thead className="bg-green-100">
                <tr>
                  <th className="px-4 py-2 text-left">特征</th>
                  <th className="px-4 py-2 text-left">显性纯合子 (AA)</th>
                  <th className="px-4 py-2 text-left">杂合子 (Aa)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-2 font-medium">配子类型</td>
                  <td className="px-4 py-2">只有 A</td>
                  <td className="px-4 py-2">A 和 a (各1/2)</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2 font-medium">测交后代</td>
                  <td className="px-4 py-2">全部 Aa</td>
                  <td className="px-4 py-2">1/2 Aa : 1/2 aa</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2 font-medium">后代表型</td>
                  <td className="px-4 py-2">全部显性</td>
                  <td className="px-4 py-2">1/2 显性 : 1/2 隐性</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium">鉴定结果</td>
                  <td className="px-4 py-2 text-green-600">显性纯合子</td>
                  <td className="px-4 py-2 text-blue-600">杂合子</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'application' && (
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-orange-800">实际应用</h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            {applications.map((app: any, index: number) => (
              <div key={index} className="bg-white rounded-lg p-4 border-2 border-orange-200">
                <h4 className="font-semibold text-orange-800 mb-2">{app.scenario}</h4>
                <p className="text-sm text-gray-700 mb-2">{app.description}</p>
                <p className="text-xs text-orange-600">示例: {app.example}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border-2 border-green-300">
              <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">✓</span>
                优势
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                {advantages.map((adv: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg p-4 border-2 border-orange-300">
              <h4 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm">!</span>
                限制
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                {limitations.map((limit: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span>{limit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-orange-800 mb-3">应用要点</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                <span><strong>选择合适的测试者：</strong>确保隐性纯合子基因型正确</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                <span><strong>观察足够数量的后代：</strong>样本量越大，结果越可靠</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                <span><strong>注意环境影响：</strong>表型可能受环境因素影响，需综合判断</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                <span><strong>结合其他方法：</strong>可结合分子标记等现代技术提高准确性</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
