import React, { useState, useEffect, useRef } from 'react';

interface CRISPRData {
  components?: Array<{ name: string; description: string; function: string }>;
  steps?: Array<{ step: number; name: string; description: string; details: string[] }>;
  repairMechanisms?: Array<{ name: string; description: string; outcome: string }>;
  annotations?: string[];
}

interface CRISPRVisualizationProps {
  data: CRISPRData;
  colors?: Record<string, string>;
}

export function CRISPRVisualization({ data, colors }: CRISPRVisualizationProps) {
  const [animationStep, setAnimationStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const defaultColors = {
    cas9: '#9C27B0',
    grna: '#2196F3',
    dna: '#4CAF50',
    target: '#F44336',
    cut: '#FF9800',
    nhej: '#9C27B0',
    hdr: '#00BCD4',
    template: '#7B1FA2',
  };

  const displayColors = { ...defaultColors, ...colors };

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setAnimationStep((prev) => (prev + 1) % 5);
      }, 2000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying]);

  const getStepContent = () => {
    switch (animationStep) {
      case 0:
        return (
          <g>
            <text x="450" y="35" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#333">
              步骤 1: gRNA-Cas9复合物形成
            </text>

            <text x="220" y="320" textAnchor="middle" fontSize="16" fill="#666">
              Cas9蛋白
            </text>
            <ellipse cx="220" cy="200" rx="75" ry="55" fill={displayColors.cas9} fillOpacity="0.3" stroke={displayColors.cas9} strokeWidth="4" filter="url(#glow)" />
            <text x="220" y="205" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#fff">Cas9</text>
            <text x="220" y="225" textAnchor="middle" fontSize="14" fill="#fff">HNH + RuvC</text>

            <text x="680" y="320" textAnchor="middle" fontSize="16" fill="#666">
              向导RNA (gRNA)
            </text>
            <path d="M680 150 Q630 90 580 90" fill="none" stroke={displayColors.grna} strokeWidth="5" />
            <path d="M580 90 L560 90" fill="none" stroke={displayColors.grna} strokeWidth="5" />
            <circle cx="560" cy="90" r="20" fill={displayColors.grna} />
            <text x="560" y="96" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#fff">crRNA</text>
            <circle cx="520" cy="90" r="16" fill="#1565C0" />
            <text x="520" y="96" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#fff">tracrRNA</text>

            <g>
              <line x1="295" y1="200" x2="520" y2="90" stroke={displayColors.grna} strokeWidth="3" strokeDasharray="6,6" markerEnd="url(#arrowhead)">
                <animate attributeName="stroke-dashoffset" from="24" to="0" dur="1s" repeatCount="indefinite" />
              </line>
              <text x="400" y="145" textAnchor="middle" fontSize="16" fill="#9C27B0">
                组装成RNP复合物
              </text>
            </g>
          </g>
        );
      case 1:
        return (
          <g>
            <text x="450" y="35" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#333">
              步骤 2: 识别目标DNA序列
            </text>

            <g transform="translate(80, 70)">
              <text x="370" y="-15" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#374151">
                目标DNA序列
              </text>
              
              <line x1="0" y1="50" x2="740" y2="50" stroke={displayColors.dna} strokeWidth="8" />
              <line x1="0" y1="75" x2="740" y2="75" stroke={displayColors.dna} strokeWidth="8" />
              
              <g>
                <line x1="0" y1="50" x2="60" y2="50" stroke="#333" strokeWidth="3" />
                <line x1="0" y1="75" x2="60" y2="75" stroke="#333" strokeWidth="3" />
                <line x1="30" y1="50" x2="30" y2="75" stroke="#333" strokeWidth="2" />
                <text x="30" y="42" textAnchor="middle" fontSize="14" fill="#666">ATGC</text>
              </g>
              
              <rect x="290" y="35" width="100" height="55" fill={displayColors.target} fillOpacity="0.4" stroke={displayColors.target} strokeWidth="4" rx="6" />
              <text x="340" y="68" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#fff">
                目标序列
              </text>
              
              <rect x="410" y="35" width="75" height="55" fill="#FFB74D" fillOpacity="0.4" stroke="#FFB74D" strokeWidth="3" rx="6" />
              <text x="447" y="68" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#fff">
                PAM(NGG)
              </text>

              <g transform="translate(620, 25)">
                <ellipse cx="0" cy="38" rx="50" ry="32" fill={displayColors.cas9} fillOpacity="0.3" stroke={displayColors.cas9} strokeWidth="3" />
                <text x="0" y="43" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#fff">Cas9</text>
                <path d="M-38 25 Q0 -12 38 25" fill="none" stroke={displayColors.grna} strokeWidth="4" />
                <text x="0" y="-12" textAnchor="middle" fontSize="14" fill="#2196F3">gRNA</text>
              </g>

              <line x1="580" y1="70" x2="620" y2="60" stroke="#666" strokeWidth="3" markerEnd="url(#arrowhead)" />
              <text x="600" y="55" textAnchor="middle" fontSize="14" fill="#9C27B0">
                扫描基因组
              </text>
            </g>
          </g>
        );
      case 2:
        return (
          <g>
            <text x="450" y="35" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#333">
              步骤 3: 产生双链断裂
            </text>

            <g transform="translate(120, 90)">
              <g>
                <line x1="0" y1="35" x2="180" y2="35" stroke={displayColors.dna} strokeWidth="8" />
                <line x1="210" y1="35" x2="660" y2="35" stroke={displayColors.dna} strokeWidth="8" />
                <line x1="0" y1="80" x2="180" y2="80" stroke={displayColors.dna} strokeWidth="8" />
                <line x1="210" y1="80" x2="660" y2="80" stroke={displayColors.dna} strokeWidth="8" />
                
                <line x1="170" y1="35" x2="170" y2="80" stroke="#333" strokeWidth="2" />
                <line x1="220" y1="35" x2="220" y2="80" stroke="#333" strokeWidth="2" />
                
                <rect x="140" y="15" width="110" height="85" fill={displayColors.target} fillOpacity="0.3" stroke={displayColors.target} strokeWidth="3" rx="6" />
                
                <ellipse cx="195" cy="58" rx="45" ry="38" fill={displayColors.cas9} fillOpacity="0.4" stroke={displayColors.cas9} strokeWidth="3" />
                <text x="195" y="63" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#fff">Cas9</text>

                <line x1="175" y1="40" x2="175" y2="75" stroke={displayColors.cut} strokeWidth="5" />
                <line x1="215" y1="40" x2="215" y2="75" stroke={displayColors.cut} strokeWidth="5" />
                
                <g>
                  <line x1="0" y1="35" x2="170" y2="35" stroke="#333" strokeWidth="3">
                    <animate attributeName="x2" values="170;175;170" dur="0.5s" repeatCount="indefinite" />
                  </line>
                  <line x1="0" y1="80" x2="170" y2="80" stroke="#333" strokeWidth="3">
                    <animate attributeName="x2" values="170;175;170" dur="0.5s" repeatCount="indefinite" />
                  </line>
                </g>

                <g>
                  <line x1="220" y1="35" x2="660" y2="35" stroke="#333" strokeWidth="3">
                    <animate attributeName="x1" values="220;215;220" dur="0.5s" repeatCount="indefinite" />
                  </line>
                  <line x1="220" y1="80" x2="660" y2="80" stroke="#333" strokeWidth="3">
                    <animate attributeName="x1" values="220;215;220" dur="0.5s" repeatCount="indefinite" />
                  </line>
                </g>

                <circle cx="175" cy="58" r="10" fill={displayColors.cut}>
                  <animate attributeName="r" values="10;14;10" dur="1s" repeatCount="indefinite" />
                </circle>
                <circle cx="215" cy="58" r="10" fill={displayColors.cut}>
                  <animate attributeName="r" values="10;14;10" dur="1s" repeatCount="indefinite" />
                </circle>

                <text x="195" y="125" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#DC2626">
                  双链断裂 (DSB)
                </text>
                <text x="195" y="148" textAnchor="middle" fontSize="14" fill="#666">
                  激活DNA修复机制
                </text>
              </g>
            </g>
          </g>
        );
      case 3:
        return (
          <g>
            <text x="450" y="35" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#333">
              步骤 4: 非同源末端连接 (NHEJ)
            </text>

            <g transform="translate(80, 80)">
              <text x="370" y="-10" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#374151">
                易错修复 - 基因敲除
              </text>

              <g>
                <line x1="0" y1="40" x2="210" y2="40" stroke={displayColors.dna} strokeWidth="8" />
                <line x1="260" y1="40" x2="740" y2="40" stroke={displayColors.dna} strokeWidth="8" />
                <line x1="0" y1="80" x2="210" y2="80" stroke={displayColors.dna} strokeWidth="8" />
                <line x1="260" y1="80" x2="740" y2="80" stroke={displayColors.dna} strokeWidth="8" />
                
                <line x1="210" y1="40" x2="210" y2="80" stroke="#333" strokeWidth="3" />
                <line x1="260" y1="40" x2="260" y2="80" stroke="#333" strokeWidth="3" />
                
                <g>
                  <text x="210" y="65" textAnchor="middle" fontSize="24" fill="#DC2626">⚡</text>
                </g>
                <g>
                  <text x="260" y="65" textAnchor="middle" fontSize="24" fill="#DC2626">⚡</text>
                </g>

                <g>
                  <line x1="210" y1="40" x2="240" y2="40" stroke={displayColors.nhej} strokeWidth="4">
                    <animate attributeName="x2" values="210;240;230;240" dur="1s" repeatCount="indefinite" />
                  </line>
                  <line x1="210" y1="80" x2="240" y2="80" stroke={displayColors.nhej} strokeWidth="4">
                    <animate attributeName="x2" values="210;240;230;240" dur="1s" repeatCount="indefinite" />
                  </line>
                </g>
                <g>
                  <line x1="260" y1="40" x2="240" y2="40" stroke={displayColors.nhej} strokeWidth="4">
                    <animate attributeName="x1" values="260;240;250;240" dur="1s" repeatCount="indefinite" />
                  </line>
                  <line x1="260" y1="80" x2="240" y2="80" stroke={displayColors.nhej} strokeWidth="4">
                    <animate attributeName="x1" values="260;240;250;240" dur="1s" repeatCount="indefinite" />
                  </line>
                </g>

                <line x1="240" y1="40" x2="240" y2="80" stroke="#333" strokeWidth="2" />

                <rect x="190" y="52" width="100" height="26" fill={displayColors.nhej} fillOpacity="0.3" rx="6" />
                <text x="240" y="71" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#fff">
                  插入/缺失
                </text>

                <text x="370" y="125" textAnchor="middle" fontSize="16" fill="#666">
                  结果: 产生移码突变，基因功能丧失
                </text>
              </g>
            </g>
          </g>
        );
      case 4:
        return (
          <g>
            <text x="450" y="35" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#333">
              步骤 5: 同源定向修复 (HDR)
            </text>

            <g transform="translate(60, 70)">
              <text x="390" y="-10" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#374151">
                精确修复 - 基因敲入/修正
              </text>

              <g>
                <line x1="0" y1="40" x2="170" y2="40" stroke={displayColors.dna} strokeWidth="7" />
                <line x1="0" y1="80" x2="170" y2="80" stroke={displayColors.dna} strokeWidth="7" />
                <line x1="350" y1="40" x2="780" y2="40" stroke={displayColors.dna} strokeWidth="7" />
                <line x1="350" y1="80" x2="780" y2="80" stroke={displayColors.dna} strokeWidth="7" />
                
                <line x1="170" y1="40" x2="170" y2="80" stroke="#333" strokeWidth="2" />
                <line x1="350" y1="40" x2="350" y2="80" stroke="#333" strokeWidth="2" />

                <g>
                  <path d="M170 30 L170 90" stroke="#333" strokeWidth="3" markerEnd="url(#arrowhead)" />
                </g>
                <g>
                  <path d="M350 30 L350 90" stroke="#333" strokeWidth="3" markerEnd="url(#arrowhead)" />
                </g>

                <g transform="translate(200, 42)">
                  <rect x="0" y="0" width="120" height="36" fill={displayColors.template} fillOpacity="0.3" stroke={displayColors.template} strokeWidth="3" rx="6" />
                  <text x="60" y="24" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#fff">
                    供体DNA模板
                  </text>
                </g>

                <g>
                  <line x1="170" y1="40" x2="205" y2="40" stroke={displayColors.hdr} strokeWidth="3" strokeDasharray="4,4">
                    <animate attributeName="x2" values="170;205;195;205" dur="1.2s" repeatCount="indefinite" />
                  </line>
                  <line x1="170" y1="80" x2="205" y2="80" stroke={displayColors.hdr} strokeWidth="3" strokeDasharray="4,4">
                    <animate attributeName="x2" values="170;205;195;205" dur="1.2s" repeatCount="indefinite" />
                  </line>
                </g>
                <g>
                  <line x1="350" y1="40" x2="315" y2="40" stroke={displayColors.hdr} strokeWidth="3" strokeDasharray="4,4">
                    <animate attributeName="x1" values="350;315;325;315" dur="1.2s" repeatCount="indefinite" />
                  </line>
                  <line x1="350" y1="80" x2="315" y2="80" stroke={displayColors.hdr} strokeWidth="3" strokeDasharray="4,4">
                    <animate attributeName="x1" values="350;315;325;315" dur="1.2s" repeatCount="indefinite" />
                  </line>
                </g>

                <g transform="translate(230, 0)">
                  <circle cx="30" cy="60" r="18" fill={displayColors.hdr}>
                    <animate attributeName="r" values="18;22;18" dur="1s" repeatCount="indefinite" />
                  </circle>
                  <text x="30" y="66" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#fff">+</text>
                </g>

                <rect x="200" y="105" width="140" height="30" fill={displayColors.hdr} fillOpacity="0.3" rx="6" />
                <text x="270" y="126" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#fff">
                  同源重组修复
                </text>

                <text x="565" y="125" textAnchor="middle" fontSize="16" fill="#666">
                  结果: 精确插入/修复序列，保留基因功能
                </text>
              </g>
            </g>
          </g>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">CRISPR-Cas9 基因编辑机制</h3>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            isPlaying
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {isPlaying ? '⏸ 暂停' : '▶ 播放动画'}
        </button>
      </div>

      <div className="mb-6">
        <div className="flex justify-between mb-2">
          {[0, 1, 2, 3, 4].map((step) => (
            <button
              key={step}
              onClick={() => setAnimationStep(step)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                animationStep === step
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              {step === 0 && '复合物形成'}
              {step === 1 && '识别目标'}
              {step === 2 && '切割DNA'}
              {step === 3 && 'NHEJ修复'}
              {step === 4 && 'HDR修复'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <svg viewBox="0 0 900 380" className="w-full h-auto" style={{minHeight: '300px'}}>
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
            </marker>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {getStepContent()}
        </svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.repairMechanisms && (
          <>
            <div
              className={`rounded-lg p-4 transition-all cursor-pointer ${
                animationStep === 3 ? 'bg-purple-100 ring-2 ring-purple-500' : 'bg-white'
              }`}
              onClick={() => setAnimationStep(3)}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center text-white text-xl">⚡</div>
                <h4 className="font-bold text-gray-800">非同源末端连接 (NHEJ)</h4>
              </div>
              <p className="text-sm text-gray-600">{data.repairMechanisms[0]?.description}</p>
              <div className="mt-2 bg-purple-50 rounded p-2">
                <div className="text-xs text-purple-700 font-medium">结果</div>
                <div className="text-sm text-gray-800">{data.repairMechanisms[0]?.outcome}</div>
              </div>
            </div>

            <div
              className={`rounded-lg p-4 transition-all cursor-pointer ${
                animationStep === 4 ? 'bg-cyan-100 ring-2 ring-cyan-500' : 'bg-white'
              }`}
              onClick={() => setAnimationStep(4)}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-lg bg-cyan-500 flex items-center justify-center text-white text-xl">🎯</div>
                <h4 className="font-bold text-gray-800">同源定向修复 (HDR)</h4>
              </div>
              <p className="text-sm text-gray-600">{data.repairMechanisms[1]?.description}</p>
              <div className="mt-2 bg-cyan-50 rounded p-2">
                <div className="text-xs text-cyan-700 font-medium">结果</div>
                <div className="text-sm text-gray-800">{data.repairMechanisms[1]?.outcome}</div>
              </div>
            </div>
          </>
        )}
      </div>

      {data.annotations && (
        <div className="mt-6 bg-yellow-50 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-800 mb-2">关键要点</h4>
          <ul className="space-y-1 text-sm text-yellow-700">
            {data.annotations.map((annotation, index) => (
              <li key={index}>• {annotation}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
