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
  const [activeTab, setActiveTab] = useState<'structure' | 'regulatory' | 'processing'>('structure');
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);

  const defaultColors = {
    promoter: '#2196F3',
    exon: '#4CAF50',
    intron: '#FF9800',
    terminator: '#F44336',
    utr: '#9C27B0',
    enhancer: '#7B1FA2',
    background: '#f8fafc',
    text: '#1e293b',
  };

  const displayColors = { ...defaultColors, ...colors };

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

  const getGeneDetails = (elementId: string) => {
    const elementMap: Record<string, { name: string; description: string; position: string }> = {
      enhancer: { name: '增强子', description: '激活转录的调控元件，可远距离作用', position: '基因上游' },
      promoter: { name: '启动子', description: 'RNA聚合酶结合位点，决定转录起始', position: '基因起始位置' },
      utr5: { name: '5\' 非翻译区', description: '不翻译成蛋白质的mRNA序列，参与翻译调控', position: '转录起始位点上游' },
      exon1: { name: '外显子1', description: '编码蛋白质的序列，保留在成熟mRNA中', position: '基因主体' },
      intron1: { name: '内含子1', description: '不编码蛋白质的序列，转录后通过剪接切除', position: '基因主体' },
      exon2: { name: '外显子2', description: '编码蛋白质的序列，保留在成熟mRNA中', position: '基因主体' },
      intron2: { name: '内含子2', description: '不编码蛋白质的序列，转录后通过剪接切除', position: '基因主体' },
      exon3: { name: '外显子3', description: '编码蛋白质的序列，保留在成熟mRNA中', position: '基因主体' },
      utr3: { name: '3\' 非翻译区', description: '不翻译成蛋白质的mRNA序列，参与翻译调控', position: '转录终止位点下游' },
      terminator: { name: '终止子', description: '转录终止信号，阻止RNA聚合酶继续转录', position: '基因下游' },
    };
    return elementMap[elementId];
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">基因结构可视化</h3>
        <p className="text-gray-600">展示真核生物基因的基本结构和功能元件</p>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('structure')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'structure'
              ? 'bg-blue-600 text-white'
              : 'bg-white hover:bg-gray-100 text-gray-700'
          }`}
        >
          基因结构
        </button>
        <button
          onClick={() => setActiveTab('regulatory')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'regulatory'
              ? 'bg-blue-600 text-white'
              : 'bg-white hover:bg-gray-100 text-gray-700'
          }`}
        >
          调控元件
        </button>
        <button
          onClick={() => setActiveTab('processing')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'processing'
              ? 'bg-blue-600 text-white'
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
                <div className="flex gap-4 text-sm">
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
                    const details = getGeneDetails(element.id);
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

                <text x="860" y="110" fontSize="16" fill={displayColors.terminator} fontWeight="bold">
                  TATA
                </text>
                <text x="860" y="130" fontSize="12" fill="#666">
                  转录终止
                </text>
              </svg>
            </div>

            {hoveredElement && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <h5 className="font-semibold text-gray-800 mb-1">{getGeneDetails(hoveredElement)?.name}</h5>
                <p className="text-sm text-gray-600">{getGeneDetails(hoveredElement)?.description}</p>
                <p className="text-xs text-gray-500 mt-1">位置: {getGeneDetails(hoveredElement)?.position}</p>
              </div>
            )}

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

              <g transform="translate(150, 180)">
                <rect x="-60" y="-25" width="120" height="50" fill={displayColors.enhancer} fillOpacity="0.2" stroke={displayColors.enhancer} strokeWidth="2" rx="8" />
                <text x="0" y="5" textAnchor="middle" fontSize="14" fontWeight="bold" fill={displayColors.enhancer}>增强子</text>
                <text x="0" y="25" textAnchor="middle" fontSize="11" fill="#666">激活转录</text>
              </g>

              <g transform="translate(650, 180)">
                <rect x="-60" y="-25" width="120" height="50" fill="#FF5252" fillOpacity="0.2" stroke="#FF5252" strokeWidth="2" rx="8" />
                <text x="0" y="5" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#FF5252">沉默子</text>
                <text x="0" y="25" textAnchor="middle" fontSize="11" fill="#666">抑制转录</text>
              </g>

              <g transform="translate(400, 280)">
                <rect x="-70" y="-25" width="140" height="50" fill="#607D8B" fillOpacity="0.2" stroke="#607D8B" strokeWidth="2" rx="8" />
                <text x="0" y="5" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#607D8B">绝缘子</text>
                <text x="0" y="25" textAnchor="middle" fontSize="11" fill="#666">阻断作用</text>
              </g>

              <path d="M210 205 Q280 120 300 80" stroke={displayColors.enhancer} strokeWidth="2" fill="none" markerEnd="url(#arrow)" strokeDasharray="4,4" />
              <text x="240" y="140" fontSize="11" fill={displayColors.enhancer} transform="rotate(-20 240 140)">激活</text>

              <path d="M590 205 Q520 120 500 80" stroke="#FF5252" strokeWidth="2" fill="none" markerEnd="url(#arrow)" strokeDasharray="4,4" />
              <text x="560" y="140" fontSize="11" fill="#FF5252" transform="rotate(20 560 140)">抑制</text>

              <line x1="330" y1="255" x2="350" y2="120" stroke="#607D8B" strokeWidth="2" strokeDasharray="3,3" />
              <text x="320" y="200" fontSize="11" fill="#607D8B">边界</text>
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

        {activeTab === 'processing' && (
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">基因表达加工过程</h4>
            <svg viewBox="0 0 800 400" className="w-full" style={{ minHeight: '350px' }}>
              <defs>
                <marker id="arrowDown" markerWidth="10" markerHeight="10" refX="5" refY="9" orient="auto">
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

              <line x1="200" y1="110" x2="200" y2="140" stroke="#666" strokeWidth="2" markerEnd="url(#arrowDown)" />

              <g transform="translate(100, 150)">
                <rect x="0" y="0" width="200" height="50" fill="#FF9800" fillOpacity="0.2" stroke="#FF9800" strokeWidth="2" rx="6" />
                <text x="100" y="20" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#FF9800">步骤 2: 剪接</text>
                <text x="100" y="40" textAnchor="middle" fontSize="11" fill="#666">切除内含子，连接外显子</text>
              </g>

              <line x1="200" y1="200" x2="200" y2="230" stroke="#666" strokeWidth="2" markerEnd="url(#arrowDown)" />

              <g transform="translate(100, 240)">
                <rect x="0" y="0" width="200" height="50" fill="#9C27B0" fillOpacity="0.2" stroke="#9C27B0" strokeWidth="2" rx="6" />
                <text x="100" y="20" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#9C27B0">步骤 3: 加帽加尾</text>
                <text x="100" y="40" textAnchor="middle" fontSize="11" fill="#666">5&apos;加m7G帽，3&apos;加polyA尾</text>
              </g>

              <line x1="200" y1="290" x2="200" y2="320" stroke="#666" strokeWidth="2" markerEnd="url(#arrowDown)" />

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
