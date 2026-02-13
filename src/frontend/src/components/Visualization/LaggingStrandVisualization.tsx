import { useState } from 'react';
import type { VisualizationData } from '../types';

interface LaggingStrandData extends VisualizationData {
  synthesisRate?: string;
  fragmentLength?: string;
  direction?: string;
  description?: string;
}

export function LaggingStrandVisualization({ data, colors = {} }: { data?: LaggingStrandData; colors?: Record<string, string> }) {
  const [activeTab, setActiveTab] = useState<'synthesis' | 'fragments' | 'comparison'>('synthesis');

  const primaryColor = colors.primary || '#3B82F6';
  const secondaryColor = colors.secondary || '#10B981';
  const accentColor = colors.accent || '#F59E0B';
  const dangerColor = colors.danger || '#EF4444';
  const backgroundColor = colors.background || '#F3F4F6';
  const textColor = colors.text || '#1F2937';

  const synthesisRate = data?.synthesisRate || '不连续合成';
  const fragmentLength = data?.fragmentLength || '1000-2000 bp';
  const direction = data?.direction || '5\' → 3\'';
  const description = data?.description || '后随链是DNA复制时，通过冈崎片段不连续合成的DNA新链';

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-lg" style={{ backgroundColor }}>
    <h2 className="text-2xl font-bold mb-4 text-center" style={{ color: textColor }}>后随链合成</h2>
    
    <div className="mb-6 text-center">
      <p className="text-sm" style={{ color: textColor }}>{description}</p>
    </div>

    <div className="flex gap-2 mb-6">
      <button
        onClick={() => setActiveTab('synthesis')}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          activeTab === 'synthesis' ? 'text-white' : 'text-gray-600 hover:bg-gray-100'
        }`}
        style={activeTab === 'synthesis' ? { backgroundColor: primaryColor } : {}}
      >
        合成过程
      </button>
      <button
        onClick={() => setActiveTab('fragments')}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          activeTab === 'fragments' ? 'text-white' : 'text-gray-600 hover:bg-gray-100'
        }`}
        style={activeTab === 'fragments' ? { backgroundColor: primaryColor } : {}}
      >
        冈崎片段
      </button>
      <button
        onClick={() => setActiveTab('comparison')}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          activeTab === 'comparison' ? 'text-white' : 'text-gray-600 hover:bg-gray-100'
        }`}
        style={activeTab === 'comparison' ? { backgroundColor: primaryColor } : {}}
      >
        对比总结
      </button>
    </div>

    <div className="border rounded-lg p-6 bg-gray-50">
      {activeTab === 'synthesis' && (
        <div>
          <svg viewBox="0 0 800 400" className="w-full h-auto mb-4">
            <defs>
              <marker id="arrowhead2" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill={dangerColor} />
              </marker>
            </defs>

            <rect x="50" y="50" width="700" height="300" fill="white" stroke="#E5E7EB" strokeWidth="2" rx="8" />

            <text x="400" y="80" textAnchor="middle" fontSize="16" fontWeight="bold" fill={textColor}>
              后随链不连续合成过程
            </text>

            <g transform="translate(100, 120)">
              <line x1="0" y1="20" x2="550" y2="20" stroke="#6B7280" strokeWidth="3" />
              <text x="280" y="50" textAnchor="middle" fontSize="12" fill="#6B7280">模板链 (5' → 3')</text>

              <g>
                <line x1="500" y1="0" x2="440" y2="0" stroke={dangerColor} strokeWidth="4" />
                <line x1="410" y1="0" x2="350" y2="0" stroke={dangerColor} strokeWidth="4" />
                <line x1="320" y1="0" x2="260" y2="0" stroke={dangerColor} strokeWidth="4" />
                <line x1="230" y1="0" x2="170" y2="0" stroke={dangerColor} strokeWidth="4" />
                <line x1="140" y1="0" x2="80" y2="0" stroke={dangerColor} strokeWidth="4" />
                <text x="275" y="-15" textAnchor="middle" fontSize="14" fontWeight="bold" fill={dangerColor}>冈崎片段 (5' → 3')</text>
              </g>

              <g transform="translate(520, 5)">
                <ellipse cx="0" cy="0" rx="35" ry="20" fill={accentColor} fillOpacity="0.3" stroke={accentColor} strokeWidth="2" />
                <text x="0" y="4" textAnchor="middle" fontSize="10" fill={accentColor}>DNA聚合酶</text>
              </g>

              <g transform="translate(100, 80)">
                <rect x="0" y="0" width="450" height="120" fill={dangerColor} fillOpacity="0.05" stroke={dangerColor} strokeWidth="1" rx="4" />
                <text x="225" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill={dangerColor}>不连续合成流程</text>
                
                <g transform="translate(20, 35)">
                  <circle cx="10" cy="10" r="8" fill={accentColor} />
                  <text x="25" y="14" fontSize="10" fill={textColor}>1. 引物合成: 引物酶合成RNA引物</text>
                </g>
                <g transform="translate(20, 55)">
                  <circle cx="10" cy="10" r="8" fill={accentColor} />
                  <text x="25" y="14" fontSize="10" fill={textColor}>2. 片段延伸: DNA聚合酶合成冈崎片段</text>
                </g>
                <g transform="translate(20, 75)">
                  <circle cx="10" cy="10" r="8" fill={accentColor} />
                  <text x="25" y="14" fontSize="10" fill={textColor}>3. 引物切除: RNase H切除RNA引物</text>
                </g>
                <g transform="translate(20, 95)">
                  <circle cx="10" cy="10" r="8" fill={accentColor} />
                  <text x="25" y="14" fontSize="10" fill={textColor}>4. 片段连接: DNA连接酶连接片段</text>
                </g>
              </g>

              <g transform="translate(430, 80)">
                <rect x="0" y="0" width="120" height="120" fill={secondaryColor} fillOpacity="0.1" stroke={secondaryColor} strokeWidth="1" rx="4" />
                <text x="60" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill={secondaryColor}>关键酶</text>
                <text x="10" y="45" fontSize="9" fill={textColor}>• 引物酶</text>
                <text x="10" y="65" fontSize="9" fill={textColor}>• DNA聚合酶</text>
                <text x="10" y="85" fontSize="9" fill={textColor}>• RNase H</text>
                <text x="10" y="105" fontSize="9" fill={textColor}>• DNA连接酶</text>
              </g>
            </g>
          </svg>

          <div className="mt-4 p-4 bg-red-50 rounded-lg">
            <h3 className="font-bold mb-2" style={{ color: dangerColor }}>合成过程特点</h3>
            <ul className="text-sm space-y-1" style={{ color: textColor }}>
              <li>• DNA聚合酶必须沿着模板链的5'→3'方向移动</li>
              <li>• 合成方向与复制叉移动方向相反</li>
              <li>• 需要多个引物,每个冈崎片段一个</li>
              <li>• 需要DNA连接酶连接相邻片段</li>
              <li>• 合成速度相对较慢,需要更多酶参与</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'fragments' && (
        <div>
          <svg viewBox="0 0 800 400" className="w-full h-auto mb-4">
            <rect x="50" y="50" width="700" height="300" fill="white" stroke="#E5E7EB" strokeWidth="2" rx="8" />

            <text x="400" y="80" textAnchor="middle" fontSize="16" fontWeight="bold" fill={textColor}>
              冈崎片段详情
            </text>

            <g transform="translate(100, 110)">
              <text x="300" y="0" textAnchor="middle" fontSize="14" fill={textColor}>冈崎片段结构</text>

              <g transform="translate(50, 30)">
                <line x1="0" y1="40" x2="500" y2="40" stroke="#6B7280" strokeWidth="2" />
                <text x="250" y="65" textAnchor="middle" fontSize="10" fill="#6B7280">模板链 (5' → 3')</text>

                <g>
                  <rect x="450" y="20" width="40" height="15" fill={accentColor} fillOpacity="0.5" />
                  <text x="470" y="32" textAnchor="middle" fontSize="8" fill="#FFF">引物</text>
                  <line x1="450" y1="15" x2="380" y2="15" stroke={dangerColor} strokeWidth="3" />
                  <text x="415" y="10" textAnchor="middle" fontSize="9" fill={dangerColor}>片段1</text>

                  <rect x="340" y="20" width="40" height="15" fill={accentColor} fillOpacity="0.5" />
                  <text x="360" y="32" textAnchor="middle" fontSize="8" fill="#FFF">引物</text>
                  <line x1="340" y1="15" x2="270" y2="15" stroke={dangerColor} strokeWidth="3" />
                  <text x="305" y="10" textAnchor="middle" fontSize="9" fill={dangerColor}>片段2</text>

                  <rect x="230" y="20" width="40" height="15" fill={accentColor} fillOpacity="0.5" />
                  <text x="250" y="32" textAnchor="middle" fontSize="8" fill="#FFF">引物</text>
                  <line x1="230" y1="15" x2="160" y2="15" stroke={dangerColor} strokeWidth="3" />
                  <text x="195" y="10" textAnchor="middle" fontSize="9" fill={dangerColor}>片段3</text>

                  <rect x="120" y="20" width="40" height="15" fill={accentColor} fillOpacity="0.5" />
                  <text x="140" y="32" textAnchor="middle" fontSize="8" fill="#FFF">引物</text>
                  <line x1="120" y1="15" x2="50" y2="15" stroke={dangerColor} strokeWidth="3" />
                  <text x="85" y="10" textAnchor="middle" fontSize="9" fill={dangerColor}>片段4</text>

                  <g>
                    <line x1="380" y1="15" x2="380" y2="5" stroke={secondaryColor} strokeWidth="2" />
                    <line x1="270" y1="15" x2="270" y2="5" stroke={secondaryColor} strokeWidth="2" />
                    <line x1="160" y1="15" x2="160" y2="5" stroke={secondaryColor} strokeWidth="2" />
                    <text x="380" y="2" textAnchor="middle" fontSize="8" fill={secondaryColor}>连接</text>
                    <text x="270" y="2" textAnchor="middle" fontSize="8" fill={secondaryColor}>连接</text>
                    <text x="160" y="2" textAnchor="middle" fontSize="8" fill={secondaryColor}>连接</text>
                  </g>
                </g>
              </g>

              <g transform="translate(50, 120)">
                <rect x="0" y="0" width="280" height="130" fill={dangerColor} fillOpacity="0.05" stroke={dangerColor} strokeWidth="1" rx="4" />
                <text x="140" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill={dangerColor}>冈崎片段特征</text>
                <text x="10" y="45" fontSize="10" fill={textColor}>• 长度: {fragmentLength}</text>
                <text x="10" y="65" fontSize="10" fill={textColor}>• 真核生物: 100-200 bp</text>
                <text x="10" y="85" fontSize="10" fill={textColor}>• 原核生物: 1000-2000 bp</text>
                <text x="10" y="105" fontSize="10" fill={textColor}>• 方向: 5' → 3'</text>
              </g>

              <g transform="translate(340, 120)">
                <rect x="0" y="0" width="210" height="130" fill={secondaryColor} fillOpacity="0.1" stroke={secondaryColor} strokeWidth="1" rx="4" />
                <text x="105" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill={secondaryColor}>发现历史</text>
                <text x="10" y="45" fontSize="9" fill={textColor}>1968年由日本科学家</text>
                <text x="10" y="65" fontSize="9" fill={textColor}>冈崎令治和冈崎恒子发现</text>
                <text x="10" y="85" fontSize="9" fill={textColor}>故名"冈崎片段"</text>
                <text x="10" y="105" fontSize="9" fill={textColor}>这是不连续DNA复制的</text>
                <text x="10" y="118" fontSize="9" fill={textColor}>关键证据</text>
              </g>
            </g>
          </svg>

          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-bold mb-2" style={{ color: accentColor }}>为什么需要冈崎片段?</h3>
            <ul className="text-sm space-y-1" style={{ color: textColor }}>
              <li>• DNA聚合酶只能沿5'→3'方向合成DNA</li>
              <li>• 后随链的模板链方向为5'→3',与复制叉移动方向相反</li>
              <li>• DNA聚合酶必须离开复制叉,反向移动才能合成</li>
              <li>• 这导致必须分段合成,形成冈崎片段</li>
              <li>• 最后通过DNA连接酶将片段连接成完整的链</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'comparison' && (
        <div>
          <svg viewBox="0 0 800 400" className="w-full h-auto mb-4">
            <rect x="50" y="50" width="700" height="300" fill="white" stroke="#E5E7EB" strokeWidth="2" rx="8" />

            <text x="400" y="80" textAnchor="middle" fontSize="16" fontWeight="bold" fill={textColor}>
              前导链 vs 后随链对比
            </text>

            <g transform="translate(80, 110)">
              <text x="150" y="0" textAnchor="middle" fontSize="13" fontWeight="bold" fill={primaryColor}>前导链</text>
              <text x="450" y="0" textAnchor="middle" fontSize="13" fontWeight="bold" fill={dangerColor}>后随链</text>

              <g transform="translate(0, 30)">
                <rect x="0" y="0" width="280" height="230" fill={primaryColor} fillOpacity="0.05" stroke={primaryColor} strokeWidth="2" rx="4" />
                
                <g transform="translate(20, 30)">
                  <line x1="0" y1="20" x2="240" y2="20" stroke="#6B7280" strokeWidth="2" />
                  <line x1="0" y1="0" x2="220" y2="0" stroke={primaryColor} strokeWidth="3" />
                  <text x="120" y="45" textAnchor="middle" fontSize="9" fill="#6B7280">模板</text>
                  <text x="120" y="-5" textAnchor="middle" fontSize="9" fontWeight="bold" fill={primaryColor}>连续</text>
                </g>

                <g transform="translate(20, 100)">
                  <text x="0" y="0" fontSize="10" fontWeight="bold" fill={primaryColor}>优势</text>
                  <text x="0" y="20" fontSize="9" fill={textColor}>✓ 合成速度快</text>
                  <text x="0" y="40" fontSize="9" fill={textColor}>✓ 只需一条引物</text>
                  <text x="0" y="60" fontSize="9" fill={textColor}>✓ 不需要连接酶</text>
                  <text x="0" y="80" fontSize="9" fill={textColor}>✓ 机制简单</text>
                </g>

                <g transform="translate(20, 200)">
                  <text x="0" y="0" fontSize="9" fill="#6B7280">合成方式: 连续</text>
                </g>
              </g>

              <g transform="translate(300, 30)">
                <rect x="0" y="0" width="280" height="230" fill={dangerColor} fillOpacity="0.05" stroke={dangerColor} strokeWidth="2" rx="4" />
                
                <g transform="translate(20, 30)">
                  <line x1="0" y1="20" x2="240" y2="20" stroke="#6B7280" strokeWidth="2" />
                  <g>
                    <line x1="220" y1="0" x2="180" y2="0" stroke={dangerColor} strokeWidth="2" />
                    <line x1="150" y1="0" x2="110" y2="0" stroke={dangerColor} strokeWidth="2" />
                    <line x1="80" y1="0" x2="40" y2="0" stroke={dangerColor} strokeWidth="2" />
                  </g>
                  <text x="120" y="45" textAnchor="middle" fontSize="9" fill="#6B7280">模板</text>
                  <text x="120" y="-5" textAnchor="middle" fontSize="9" fontWeight="bold" fill={dangerColor}>不连续</text>
                </g>

                <g transform="translate(20, 100)">
                  <text x="0" y="0" fontSize="10" fontWeight="bold" fill={dangerColor}>特点</text>
                  <text x="0" y="20" fontSize="9" fill={textColor}>• 冈崎片段合成</text>
                  <text x="0" y="40" fontSize="9" fill={textColor}>• 需多个引物</text>
                  <text x="0" y="60" fontSize="9" fill={textColor}>• 需DNA连接酶</text>
                  <text x="0" y="80" fontSize="9" fill={textColor}>• 机制较复杂</text>
                </g>

                <g transform="translate(20, 200)">
                  <text x="0" y="0" fontSize="9" fill="#6B7280">合成方式: 不连续</text>
                </g>
              </g>
            </g>
          </svg>

          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <h3 className="font-bold mb-2" style={{ color: secondaryColor }}>总结</h3>
            <p className="text-sm" style={{ color: textColor }}>
              前导链和后随链虽然合成方式不同,但最终都产生完整的DNA分子。
              后随链的不连续合成是DNA复制机制的重要特征,体现了生物系统的精妙适应性。
              冈崎片段的发现为理解DNA复制机制提供了关键证据。
            </p>
          </div>
        </div>
      )}
    </div>

    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <span className="font-medium" style={{ color: dangerColor }}>合成方式:</span>
          <span className="ml-2" style={{ color: textColor }}>{synthesisRate}</span>
        </div>
        <div>
          <span className="font-medium" style={{ color: dangerColor }}>片段长度:</span>
          <span className="ml-2" style={{ color: textColor }}>{fragmentLength}</span>
        </div>
        <div>
          <span className="font-medium" style={{ color: dangerColor }}>合成方向:</span>
          <span className="ml-2" style={{ color: textColor }}>{direction}</span>
        </div>
      </div>
    </div>
  </div>
  );
}
