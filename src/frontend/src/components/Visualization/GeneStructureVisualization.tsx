import React, { useState } from 'react';

interface GeneStructureData {
  structure: Array<{ name: string; description: string; position: string }>;
  regulatory: Array<{ name: string; description: string; feature: string }>;
  processing: Array<{ step: number; process: string; description: string }>;
}

interface GeneStructureVisualizationProps {
  data: GeneStructureData;
  colors?: Record<string, string>;
}

export function GeneStructureVisualization({ data, colors }: GeneStructureVisualizationProps) {
  const [activeTab, setActiveTab] = useState<'structure' | 'regulatory' | 'splicing' | 'processing'>('structure');
  const [currentStep, setCurrentStep] = useState(0);
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);

  const defaultColors = {
    promoter: '#2196F3',
    exon: '#4CAF50',
    intron: '#FF9800',
    terminator: '#F44336',
    utr: '#9C27B0',
    enhancer: '#7B1FA2',
    silencer: '#FF5252',
    insulator: '#607D8B',
    background: '#f8fafc',
    text: '#1e293b',
  };

  const displayColors = { ...defaultColors, ...colors };

  const getElementDetails = (elementId: string) => {
    const elementMap: Record<string, { name: string; description: string; details?: string; sequence?: string }> = {
      'enhancer': {
        name: '增强子',
        description: '激活转录的调控元件，可远距离作用',
        details: '位于基因上游或下游，甚至在内含子中',
        sequence: '特定转录因子结合序列'
      },
      'promoter': {
        name: '启动子',
        description: 'RNA聚合酶结合位点，决定转录起始',
        details: '包含TATA盒、CAAT盒等核心元件',
        sequence: 'TATAAA'
      },
      'utr5': {
        name: '5\' 非翻译区',
        description: '不翻译成蛋白质的mRNA序列',
        details: '参与翻译调控和mRNA稳定性',
        sequence: '上游非编码区'
      },
      'exon1': {
        name: '外显子1',
        description: '编码蛋白质的序列，保留在成熟mRNA中',
        details: '包含遗传密码子',
        sequence: 'ATG...'
      },
      'intron1': {
        name: '内含子1',
        description: '不编码蛋白质的序列，转录后通过剪接切除',
        details: '包含GT-AG剪接位点',
        sequence: 'GT...AG'
      },
      'exon2': {
        name: '外显子2',
        description: '编码蛋白质的序列，保留在成熟mRNA中',
        details: '包含遗传密码子',
        sequence: '编码序列'
      },
      'intron2': {
        name: '内含子2',
        description: '不编码蛋白质的序列，转录后通过剪接切除',
        details: '包含GT-AG剪接位点',
        sequence: 'GT...AG'
      },
      'exon3': {
        name: '外显子3',
        description: '编码蛋白质的序列，保留在成熟mRNA中',
        details: '包含终止密码子',
        sequence: '...TAA'
      },
      'utr3': {
        name: '3\' 非翻译区',
        description: '不翻译成蛋白质的mRNA序列',
        details: '参与翻译调控和mRNA稳定性',
        sequence: '下游非编码区'
      },
      'terminator': {
        name: '终止子',
        description: '转录终止信号，阻止RNA聚合酶继续转录',
        details: '包含终止子序列',
        sequence: '终止信号'
      },
      'silencer': {
        name: '沉默子',
        description: '抑制转录的调控元件',
        details: '结合阻遏蛋白，降低转录活性',
        sequence: '特定转录因子结合序列'
      },
      'insulator': {
        name: '绝缘子',
        description: '阻断增强子或沉默子的作用',
        details: '形成边界，隔离基因调控区域',
        sequence: 'CTCF结合位点'
      },
      'cap': {
        name: '5\'帽',
        description: 'mRNA的5\'端修饰结构',
        details: '保护mRNA，促进翻译起始',
        sequence: 'm7GpppN'
      },
      'polyA': {
        name: 'PolyA尾',
        description: 'mRNA的3\'端多聚腺苷酸尾巴',
        details: '保护mRNA，促进翻译和核输出',
        sequence: 'AAA...'
      },
    };
    return elementMap[elementId];
  };

  const geneElements = [
    { id: 'enhancer', name: '增强子', color: displayColors.enhancer, width: 80, y: 60 },
    { id: 'promoter', name: '启动子', color: displayColors.promoter, width: 100, y: 100 },
    { id: 'utr5', name: '5\' UTR', color: displayColors.utr, width: 60, y: 100 },
    { id: 'exon1', name: '外显子1', color: displayColors.exon, width: 120, y: 100 },
    { id: 'intron1', name: '内含子1', color: displayColors.intron, width: 80, y: 100 },
    { id: 'exon2', name: '外显子2', color: displayColors.exon, width: 100, y: 100 },
    { id: 'intron2', name: '内含子2', color: displayColors.intron, width: 70, y: 100 },
    { id: 'exon3', name: '外显子3', color: displayColors.exon, width: 90, y: 100 },
    { id: 'utr3', name: '3\' UTR', color: displayColors.utr, width: 60, y: 100 },
    { id: 'terminator', name: '终止子', color: displayColors.terminator, width: 80, y: 100 },
  ];

  const splicingSteps = [
    {
      title: '步骤1: 转录产生前体mRNA',
      description: 'RNA聚合酶转录DNA，产生包含外显子和内含子的前体mRNA（pre-mRNA）',
      showElements: ['enhancer', 'promoter', 'utr5', 'exon1', 'intron1', 'exon2', 'intron2', 'exon3', 'utr3'],
      highlight: 'promoter',
      showPreMRNA: true,
      showSplicing: false,
      showMatureMRNA: false
    },
    {
      title: '步骤2: 剪接体识别剪接位点',
      description: '剪接体识别内含子5\'端（GT）和3\'端（AG）剪接位点',
      showElements: ['enhancer', 'promoter', 'utr5', 'exon1', 'intron1', 'exon2', 'intron2', 'exon3', 'utr3'],
      highlight: 'intron1',
      showPreMRNA: true,
      showSplicing: true,
      splicingPhase: 'recognition',
      showMatureMRNA: false
    },
    {
      title: '步骤3: 剪接反应 - 切除内含子1',
      description: '剪接体切除内含子1，外显子1和外显子2连接',
      showElements: ['enhancer', 'promoter', 'utr5', 'exon1', 'intron1', 'exon2', 'intron2', 'exon3', 'utr3'],
      highlight: 'intron1',
      showPreMRNA: true,
      showSplicing: true,
      splicingPhase: 'splice1',
      showMatureMRNA: false
    },
    {
      title: '步骤4: 剪接反应 - 切除内含子2',
      description: '剪接体切除内含子2，外显子2和外显子3连接',
      showElements: ['enhancer', 'promoter', 'utr5', 'exon1', 'intron1', 'exon2', 'intron2', 'exon3', 'utr3'],
      highlight: 'intron2',
      showPreMRNA: true,
      showSplicing: true,
      splicingPhase: 'splice2',
      showMatureMRNA: false
    },
    {
      title: '步骤5: 5\'加帽和3\'加尾',
      description: '5\'端添加m7G帽，3\'端添加polyA尾，形成成熟mRNA',
      showElements: ['enhancer', 'promoter', 'utr5', 'exon1', 'exon2', 'exon3', 'utr3'],
      highlight: 'exon1',
      showPreMRNA: false,
      showSplicing: false,
      showMatureMRNA: true
    },
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">基因结构可视化</h3>
        <p className="text-gray-600">展示真核生物基因的基本结构和功能元件</p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => { setActiveTab('structure'); setCurrentStep(0); }}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'structure'
              ? 'bg-blue-600 text-white'
              : 'bg-white hover:bg-gray-100 text-gray-700'
          }`}
        >
          基因结构
        </button>
        <button
          onClick={() => { setActiveTab('regulatory'); setCurrentStep(0); }}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'regulatory'
              ? 'bg-purple-600 text-white'
              : 'bg-white hover:bg-gray-100 text-gray-700'
          }`}
        >
          调控元件
        </button>
        <button
          onClick={() => { setActiveTab('splicing'); setCurrentStep(0); }}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'splicing'
              ? 'bg-orange-600 text-white'
              : 'bg-white hover:bg-gray-100 text-gray-700'
          }`}
        >
          剪接过程
        </button>
        <button
          onClick={() => { setActiveTab('processing'); setCurrentStep(0); }}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'processing'
              ? 'bg-green-600 text-white'
              : 'bg-white hover:bg-gray-100 text-gray-700'
          }`}
        >
          加工过程
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        {activeTab === 'structure' && (
          <div>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg font-semibold text-gray-800">基因线性结构图</h4>
                <div className="flex gap-4 text-sm flex-wrap">
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: displayColors.enhancer }}></div>
                    <span>增强子</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: displayColors.promoter }}></div>
                    <span>启动子</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: displayColors.exon }}></div>
                    <span>外显子</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: displayColors.intron }}></div>
                    <span>内含子</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: displayColors.utr }}></div>
                    <span>UTR</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: displayColors.terminator }}></div>
                    <span>终止子</span>
                  </div>
                </div>
              </div>

              <svg viewBox="0 0 900 280" className="w-full" style={{ minHeight: '250px' }}>
                <defs>
                  <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L9,3 z" fill="#666" />
                  </marker>
                  <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.2" />
                  </filter>
                </defs>

                <text x="450" y="30" textAnchor="middle" fontSize="20" fontWeight="bold" fill={displayColors.text}>
                  5&apos; → 3&apos; 转录方向
                </text>

                <line x1="50" y1="50" x2="850" y2="50" stroke="#ddd" strokeWidth="1" strokeDasharray="5,5" />

                <text x="60" y="70" fontSize="14" fontWeight="bold" fill="#666">调控区</text>
                <text x="400" y="70" fontSize="14" fontWeight="bold" fill="#666">转录区</text>
                <text x="800" y="70" fontSize="14" fontWeight="bold" fill="#666">终止区</text>

                <line x1="130" y1="75" x2="130" y2="180" stroke="#ccc" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="750" y1="75" x2="750" y2="180" stroke="#ccc" strokeWidth="1" strokeDasharray="3,3" />

                <g transform="translate(0, 20)">
                  {geneElements.map((element, index) => {
                    const x = 80 + index * 85;
                    const details = getElementDetails(element.id);
                    const isHovered = hoveredElement === element.id;

                    return (
                      <g key={element.id}>
                        <rect
                          x={x}
                          y={element.y}
                          width={element.width}
                          height={40}
                          fill={element.color}
                          fillOpacity={isHovered ? 0.8 : 0.6}
                          stroke={element.color}
                          strokeWidth={isHovered ? 3 : 2}
                          rx={6}
                          filter="url(#shadow)"
                          onMouseEnter={() => setHoveredElement(element.id)}
                          onMouseLeave={() => setHoveredElement(null)}
                          style={{ cursor: 'pointer' }}
                        />
                        <text
                          x={x + element.width / 2}
                          y={element.y + 25}
                          textAnchor="middle"
                          fontSize={element.width > 60 ? 14 : 12}
                          fontWeight="bold"
                          fill="#fff"
                        >
                          {element.name}
                        </text>

                        {element.id === 'promoter' && (
                          <>
                            <path
                              d="M80 140 L80 100"
                              stroke="#666"
                              strokeWidth="2"
                              markerEnd="url(#arrow)"
                            />
                            <text x="75" y="155" textAnchor="end" fontSize="12" fill="#666">
                              RNA聚合酶结合
                            </text>
                          </>
                        )}

                        {element.id === 'exon1' && (
                          <>
                            <line x1={x + element.width / 2} y1={element.y + 40} x2={x + element.width / 2} y2={150} stroke="#4CAF50" strokeWidth="2" />
                            <circle cx={x + element.width / 2} cy={150} r="4" fill="#4CAF50" />
                          </>
                        )}

                        {element.id === 'exon2' && (
                          <>
                            <line x1={x + element.width / 2} y1={element.y + 40} x2={x + element.width / 2} y2={150} stroke="#4CAF50" strokeWidth="2" />
                            <circle cx={x + element.width / 2} cy={150} r="4" fill="#4CAF50" />
                          </>
                        )}

                        {element.id === 'exon3' && (
                          <>
                            <line x1={x + element.width / 2} y1={element.y + 40} x2={x + element.width / 2} y2={150} stroke="#4CAF50" strokeWidth="2" />
                            <circle cx={x + element.width / 2} cy={150} r="4" fill="#4CAF50" />
                          </>
                        )}
                      </g>
                    );
                  })}

                  <line x1="80" y1="160" x2="830" y2="160" stroke="#4CAF50" strokeWidth="2" />

                  <text x="455" y="180" textAnchor="middle" fontSize="14" fill="#4CAF50" fontWeight="bold">
                    成熟 mRNA（剪接后外显子连接）
                  </text>

                  <path d="M330 150 Q360 130 390 150" stroke="#FF9800" strokeWidth="2" fill="none" strokeDasharray="4,4" />
                  <text x="360" y="125" textAnchor="middle" fontSize="11" fill="#FF9800">剪接切除</text>

                  <path d="M530 150 Q560 130 590 150" stroke="#FF9800" strokeWidth="2" fill="none" strokeDasharray="4,4" />
                  <text x="560" y="125" textAnchor="middle" fontSize="11" fill="#FF9800">剪接切除</text>
                </g>

                {hoveredElement && getElementDetails(hoveredElement) && (
                  <foreignObject x="20" y="20" width="200" height="100">
                    <div style={{
                      backgroundColor: 'white',
                      border: `2px solid ${hoveredElement === 'enhancer' ? displayColors.enhancer : hoveredElement === 'promoter' ? displayColors.promoter : hoveredElement === 'exon1' || hoveredElement === 'exon2' || hoveredElement === 'exon3' ? displayColors.exon : hoveredElement === 'intron1' || hoveredElement === 'intron2' ? displayColors.intron : hoveredElement === 'utr5' || hoveredElement === 'utr3' ? displayColors.utr : displayColors.terminator}`,
                      borderRadius: '8px',
                      padding: '8px',
                      fontSize: '11px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                    }}>
                      <strong style={{ fontSize: '13px' }}>{getElementDetails(hoveredElement).name}</strong>
                      <p style={{ margin: '4px 0', color: '#666' }}>{getElementDetails(hoveredElement).description}</p>
                      {getElementDetails(hoveredElement).details && (
                        <p style={{ margin: '0', color: '#666', fontSize: '10px' }}>{getElementDetails(hoveredElement).details}</p>
                      )}
                      {getElementDetails(hoveredElement).sequence && (
                        <p style={{ margin: '4px 0 0 0', color: displayColors.text, fontFamily: 'monospace', fontWeight: 'bold', fontSize: '10px' }}>{getElementDetails(hoveredElement).sequence}</p>
                      )}
                    </div>
                  </foreignObject>
                )}
              </svg>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.structure.map((item, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <h6 className="font-semibold text-gray-800 mb-2">{item.name}</h6>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <p className="text-xs text-gray-500 mt-2">{item.position}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'regulatory' && (
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">调控元件</h4>
            <svg viewBox="0 0 800 350" className="w-full" style={{ minHeight: '300px' }}>
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <text x="400" y="30" textAnchor="middle" fontSize="20" fontWeight="bold" fill={displayColors.text}>
                基因调控网络
              </text>

              <g transform="translate(400, 80)">
                <ellipse cx="0" cy="0" rx="120" ry="40" fill={displayColors.promoter} fillOpacity="0.2" stroke={displayColors.promoter} strokeWidth="2" />
                <text x="0" y="5" textAnchor="middle" fontSize="16" fontWeight="bold" fill={displayColors.promoter}>启动子区域</text>
                <text x="0" y="25" textAnchor="middle" fontSize="12" fill="#666">RNA聚合酶结合</text>
              </g>

              <g
                onMouseEnter={() => setHoveredElement('enhancer')}
                onMouseLeave={() => setHoveredElement(null)}
                style={{ cursor: 'pointer' }}
                transform="translate(150, 180)"
              >
                <rect x="-60" y="-25" width="120" height="50" fill={displayColors.enhancer} fillOpacity="0.2" stroke={displayColors.enhancer} strokeWidth={hoveredElement === 'enhancer' ? 3 : 2} rx="8" />
                <text x="0" y="5" textAnchor="middle" fontSize="14" fontWeight="bold" fill={displayColors.enhancer}>增强子</text>
                <text x="0" y="25" textAnchor="middle" fontSize="11" fill="#666">激活转录</text>
              </g>

              <g
                onMouseEnter={() => setHoveredElement('silencer')}
                onMouseLeave={() => setHoveredElement(null)}
                style={{ cursor: 'pointer' }}
                transform="translate(650, 180)"
              >
                <rect x="-60" y="-25" width="120" height="50" fill={displayColors.silencer} fillOpacity="0.2" stroke={displayColors.silencer} strokeWidth={hoveredElement === 'silencer' ? 3 : 2} rx="8" />
                <text x="0" y="5" textAnchor="middle" fontSize="14" fontWeight="bold" fill={displayColors.silencer}>沉默子</text>
                <text x="0" y="25" textAnchor="middle" fontSize="11" fill="#666">抑制转录</text>
              </g>

              <g
                onMouseEnter={() => setHoveredElement('insulator')}
                onMouseLeave={() => setHoveredElement(null)}
                style={{ cursor: 'pointer' }}
                transform="translate(400, 280)"
              >
                <rect x="-70" y="-25" width="140" height="50" fill={displayColors.insulator} fillOpacity="0.2" stroke={displayColors.insulator} strokeWidth={hoveredElement === 'insulator' ? 3 : 2} rx="8" />
                <text x="0" y="5" textAnchor="middle" fontSize="14" fontWeight="bold" fill={displayColors.insulator}>绝缘子</text>
                <text x="0" y="25" textAnchor="middle" fontSize="11" fill="#666">阻断作用</text>
              </g>

              <path d="M210 205 Q280 120 300 80" stroke={displayColors.enhancer} strokeWidth="2" fill="none" markerEnd="url(#arrow)" strokeDasharray="4,4" />
              <text x="240" y="140" fontSize="11" fill={displayColors.enhancer} transform="rotate(-20 240 140)">激活</text>

              <path d="M590 205 Q520 120 500 80" stroke="#FF5252" strokeWidth="2" fill="none" markerEnd="url(#arrow)" strokeDasharray="4,4" />
              <text x="560" y="140" fontSize="11" fill="#FF5252" transform="rotate(20 560 140)">抑制</text>

              <line x1="330" y1="255" x2="350" y2="120" stroke={displayColors.insulator} strokeWidth="2" strokeDasharray="3,3" />
              <text x="320" y="200" fontSize="11" fill={displayColors.insulator}>边界</text>

              {hoveredElement && getElementDetails(hoveredElement) && hoveredElement !== 'promoter' && (
                <foreignObject x="20" y="20" width="200" height="90">
                  <div style={{
                    backgroundColor: 'white',
                    border: `2px solid ${hoveredElement === 'enhancer' ? displayColors.enhancer : hoveredElement === 'silencer' ? displayColors.silencer : displayColors.insulator}`,
                    borderRadius: '8px',
                    padding: '8px',
                    fontSize: '11px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                  }}>
                    <strong style={{ fontSize: '13px' }}>{getElementDetails(hoveredElement).name}</strong>
                    <p style={{ margin: '4px 0', color: '#666' }}>{getElementDetails(hoveredElement).description}</p>
                    {getElementDetails(hoveredElement).details && (
                      <p style={{ margin: '0', color: '#666', fontSize: '10px' }}>{getElementDetails(hoveredElement).details}</p>
                    )}
                  </div>
                </foreignObject>
              )}
            </svg>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.regulatory.map((item, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <h6 className="font-semibold text-gray-800 mb-2">{item.name}</h6>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <div className="mt-2 px-2 py-1 bg-blue-100 rounded inline-block">
                    <span className="text-xs text-blue-700">{item.feature}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'splicing' && (
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">RNA剪接过程</h4>
            
            <div className="mb-6 p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    currentStep === 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-orange-500 text-white hover:bg-orange-600'
                  }`}
                >
                  ← 上一步
                </button>
                <span className="text-sm text-gray-600">步骤 {currentStep + 1} / {splicingSteps.length}</span>
                <button
                  onClick={() => setCurrentStep(Math.min(splicingSteps.length - 1, currentStep + 1))}
                  disabled={currentStep === splicingSteps.length - 1}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    currentStep === splicingSteps.length - 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-orange-500 text-white hover:bg-orange-600'
                  }`}
                >
                  下一步 →
                </button>
              </div>
              
              <h5 className="font-bold text-orange-700 mb-2">{splicingSteps[currentStep].title}</h5>
              <p className="text-sm text-gray-700">{splicingSteps[currentStep].description}</p>
            </div>

            <svg viewBox="0 0 800 400" className="w-full" style={{ minHeight: '350px' }}>
              <defs>
                <marker id="arrowDown" markerWidth="10" markerHeight="10" refX="5" refY="9" orient="auto">
                  <path d="M0,0 L10,5 L5,10 z" fill="#666" />
                </marker>
              </defs>

              <text x="400" y="30" textAnchor="middle" fontSize="18" fontWeight="bold" fill={displayColors.text}>
                RNA剪接过程可视化
              </text>

              {splicingSteps[currentStep].showPreMRNA && (
                <g transform="translate(50, 60)">
                  <text x="350" y="15" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#666">前体 mRNA (pre-mRNA)</text>
                  
                  <g transform="translate(0, 30)">
                    {geneElements.filter(e => e.id !== 'enhancer' && e.id !== 'promoter' && e.id !== 'terminator').map((element, index) => {
                      const x = 80 + index * 85;
                      const isHighlighted = splicingSteps[currentStep].highlight === element.id;
                      const isIntron = element.id.includes('intron');
                      const shouldShow = splicingSteps[currentStep].showElements.includes(element.id);
                      
                      if (!shouldShow) return null;

                      return (
                        <g key={element.id}>
                          <rect
                            x={x}
                            y={0}
                            width={element.width}
                            height={40}
                            fill={element.color}
                            fillOpacity={isHighlighted ? 0.8 : 0.6}
                            stroke={element.color}
                            strokeWidth={isHighlighted ? 3 : 2}
                            rx={6}
                            opacity={isIntron && splicingSteps[currentStep].showSplicing && splicingSteps[currentStep].splicingPhase !== 'recognition' ? 0.3 : 1}
                          />
                          <text
                            x={x + element.width / 2}
                            y={25}
                            textAnchor="middle"
                            fontSize={element.width > 60 ? 14 : 12}
                            fontWeight="bold"
                            fill="#fff"
                            opacity={isIntron && splicingSteps[currentStep].showSplicing && splicingSteps[currentStep].splicingPhase !== 'recognition' ? 0.3 : 1}
                          >
                            {element.name}
                          </text>

                          {isHighlighted && splicingSteps[currentStep].showSplicing && splicingSteps[currentStep].splicingPhase === 'recognition' && (
                            <>
                              <circle cx={x + 10} cy={-15} r="15" fill="#FF9800" opacity="0.7" />
                              <text x={x + 10} y="-11" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fff">GT</text>
                              <circle cx={x + element.width - 10} cy={-15} r="15" fill="#FF9800" opacity="0.7" />
                              <text x={x + element.width - 10} y="-11" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#fff">AG</text>
                            </>
                          )}
                        </g>
                      );
                    })}
                  </g>

                  {splicingSteps[currentStep].showSplicing && splicingSteps[currentStep].splicingPhase === 'recognition' && (
                    <text x="350" y="-25" textAnchor="middle" fontSize="12" fill="#FF9800" fontWeight="bold">剪接体识别GT-AG剪接位点</text>
                  )}
                </g>
              )}

              {splicingSteps[currentStep].showPreMRNA && splicingSteps[currentStep].showSplicing && (
                <g transform="translate(50, 160)">
                  <text x="350" y="0" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#666">剪接反应</text>
                  
                  {splicingSteps[currentStep].splicingPhase === 'splice1' && (
                    <g transform="translate(0, 20)">
                      <path d="M370 10 L370 50" stroke="#FF9800" strokeWidth="2" markerEnd="url(#arrowDown)" />
                      <text x="370" y="70" textAnchor="middle" fontSize="11" fill="#FF9800">切除内含子1</text>
                    </g>
                  )}

                  {splicingSteps[currentStep].splicingPhase === 'splice2' && (
                    <g transform="translate(0, 20)">
                      <path d="M590 10 L590 50" stroke="#FF9800" strokeWidth="2" markerEnd="url(#arrowDown)" />
                      <text x="590" y="70" textAnchor="middle" fontSize="11" fill="#FF9800">切除内含子2</text>
                    </g>
                  )}
                </g>
              )}

              {splicingSteps[currentStep].showMatureMRNA && (
                <g transform="translate(50, 200)">
                  <text x="350" y="0" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#4CAF50">成熟 mRNA</text>
                  
                  <g transform="translate(0, 20)">
                    <g
                      onMouseEnter={() => setHoveredElement('cap')}
                      onMouseLeave={() => setHoveredElement(null)}
                      style={{ cursor: 'pointer' }}
                    >
                      <circle cx="50" cy="20" r="25" fill="#9C27B0" fillOpacity={hoveredElement === 'cap' ? 0.8 : 0.5} stroke="#9C27B0" strokeWidth={hoveredElement === 'cap' ? 3 : 2} />
                      <text x="50" y="25" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#fff">5&apos;帽</text>
                    </g>

                    {geneElements.filter(e => e.id.includes('exon') || e.id.includes('utr')).map((element, index) => {
                      const x = 90 + index * 85;
                      const isHighlighted = splicingSteps[currentStep].highlight === element.id;

                      return (
                        <g key={element.id}>
                          <rect
                            x={x}
                            y={0}
                            width={element.width}
                            height={40}
                            fill={element.color}
                            fillOpacity={isHighlighted ? 0.8 : 0.6}
                            stroke={element.color}
                            strokeWidth={isHighlighted ? 3 : 2}
                            rx={6}
                          />
                          <text
                            x={x + element.width / 2}
                            y={25}
                            textAnchor="middle"
                            fontSize={element.width > 60 ? 14 : 12}
                            fontWeight="bold"
                            fill="#fff"
                          >
                            {element.name}
                          </text>
                        </g>
                      );
                    })}

                    <g
                      onMouseEnter={() => setHoveredElement('polyA')}
                      onMouseLeave={() => setHoveredElement(null)}
                      style={{ cursor: 'pointer' }}
                    >
                      <circle cx="720" cy="20" r="25" fill="#9C27B0" fillOpacity={hoveredElement === 'polyA' ? 0.8 : 0.5} stroke="#9C27B0" strokeWidth={hoveredElement === 'polyA' ? 3 : 2} />
                      <text x="720" y="25" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#fff">PolyA</text>
                    </g>
                  </g>

                  <line x1="90" y1="70" x2="690" y2="70" stroke="#4CAF50" strokeWidth="2" />
                  <text x="390" y="90" textAnchor="middle" fontSize="12" fill="#4CAF50" fontWeight="bold">外显子连接形成连续编码序列</text>
                </g>
              )}

              {hoveredElement && getElementDetails(hoveredElement) && (
                <foreignObject x="20" y="320" width="200" height="70">
                  <div style={{
                    backgroundColor: 'white',
                    border: `2px solid ${hoveredElement === 'cap' || hoveredElement === 'polyA' ? displayColors.utr : '#666'}`,
                    borderRadius: '8px',
                    padding: '8px',
                    fontSize: '11px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                  }}>
                    <strong style={{ fontSize: '13px' }}>{getElementDetails(hoveredElement).name}</strong>
                    <p style={{ margin: '4px 0', color: '#666' }}>{getElementDetails(hoveredElement).description}</p>
                    {getElementDetails(hoveredElement).sequence && (
                      <p style={{ margin: '0', color: displayColors.text, fontFamily: 'monospace', fontWeight: 'bold', fontSize: '10px' }}>{getElementDetails(hoveredElement).sequence}</p>
                    )}
                  </div>
                </foreignObject>
              )}
            </svg>
          </div>
        )}

        {activeTab === 'processing' && (
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">基因表达加工过程</h4>
            <svg viewBox="0 0 800 400" className="w-full" style={{ minHeight: '350px' }}>
              <defs>
                <marker id="arrowDown2" markerWidth="10" markerHeight="10" refX="5" refY="9" orient="auto">
                  <path d="M0,0 L10,5 L5,10 z" fill="#666" />
                </marker>
              </defs>

              <text x="400" y="30" textAnchor="middle" fontSize="20" fontWeight="bold" fill={displayColors.text}>
                从DNA到蛋白质
              </text>

              <g transform="translate(100, 60)">
                <rect x="0" y="0" width="200" height="50" fill="#2196F3" fillOpacity="0.2" stroke="#2196F3" strokeWidth="2" rx="6" />
                <text x="100" y="20" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#2196F3">步骤 1: 转录</text>
                <text x="100" y="40" textAnchor="middle" fontSize="11" fill="#666">DNA → 前体mRNA</text>
              </g>

              <line x1="200" y1="110" x2="200" y2="140" stroke="#666" strokeWidth="2" markerEnd="url(#arrowDown2)" />

              <g transform="translate(100, 150)">
                <rect x="0" y="0" width="200" height="50" fill="#FF9800" fillOpacity="0.2" stroke="#FF9800" strokeWidth="2" rx="6" />
                <text x="100" y="20" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#FF9800">步骤 2: 剪接</text>
                <text x="100" y="40" textAnchor="middle" fontSize="11" fill="#666">切除内含子，连接外显子</text>
              </g>

              <line x1="200" y1="200" x2="200" y2="230" stroke="#666" strokeWidth="2" markerEnd="url(#arrowDown2)" />

              <g transform="translate(100, 240)">
                <rect x="0" y="0" width="200" height="50" fill="#9C27B0" fillOpacity="0.2" stroke="#9C27B0" strokeWidth="2" rx="6" />
                <text x="100" y="20" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#9C27B0">步骤 3: 加帽加尾</text>
                <text x="100" y="40" textAnchor="middle" fontSize="11" fill="#666">5&apos;加m7G帽，3&apos;加polyA尾</text>
              </g>

              <line x1="200" y1="290" x2="200" y2="320" stroke="#666" strokeWidth="2" markerEnd="url(#arrowDown2)" />

              <g transform="translate(100, 330)">
                <rect x="0" y="0" width="200" height="50" fill="#4CAF50" fillOpacity="0.2" stroke="#4CAF50" strokeWidth="2" rx="6" />
                <text x="100" y="20" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#4CAF50">步骤 4: 翻译</text>
                <text x="100" y="40" textAnchor="middle" fontSize="11" fill="#666">成熟mRNA → 蛋白质</text>
              </g>

              <g transform="translate(400, 100)">
                <rect x="0" y="0" width="350" height="280" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" rx="8" />
                <text x="175" y="30" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#334155">关键概念</text>

                <g transform="translate(20, 50)">
                  <circle cx="10" cy="10" r="8" fill={displayColors.enhancer} />
                  <text x="25" y="15" fontSize="13" fill="#334155">真核基因含内含子</text>
                </g>

                <g transform="translate(20, 90)">
                  <circle cx="10" cy="10" r="8" fill={displayColors.exon} />
                  <text x="25" y="15" fontSize="13" fill="#334155">外显子编码蛋白质</text>
                </g>

                <g transform="translate(20, 130)">
                  <circle cx="10" cy="10" r="8" fill={displayColors.intron} />
                  <text x="25" y="15" fontSize="13" fill="#334155">内含子被剪接切除</text>
                </g>

                <g transform="translate(20, 170)">
                  <circle cx="10" cy="10" r="8" fill={displayColors.utr} />
                  <text x="25" y="15" fontSize="13" fill="#334155">UTR参与调控翻译</text>
                </g>

                <g transform="translate(20, 210)">
                  <circle cx="10" cy="10" r="8" fill={displayColors.promoter} />
                  <text x="25" y="15" fontSize="13" fill="#334155">启动子决定转录起始</text>
                </g>

                <g transform="translate(20, 250)">
                  <circle cx="10" cy="10" r="8" fill={displayColors.terminator} />
                  <text x="25" y="15" fontSize="13" fill="#334155">终止子结束转录</text>
                </g>
              </g>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
