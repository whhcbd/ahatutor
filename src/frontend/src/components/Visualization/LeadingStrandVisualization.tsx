import { useState } from 'react';
import type { VisualizationData } from '../types';

interface LeadingStrandData extends VisualizationData {
  synthesisRate?: string;
  direction?: string;
  nucleotidesPerSecond?: number;
  description?: string;
}

export function LeadingStrandVisualization({ data, colors = {} }: { data?: LeadingStrandData; colors?: Record<string, string> }) {
  const [activeTab, setActiveTab] = useState<'synthesis' | 'direction' | 'comparison'>('synthesis');

  const primaryColor = colors.primary || '#3B82F6';
  const secondaryColor = colors.secondary || '#10B981';
  const accentColor = colors.accent || '#F59E0B';
  const dangerColor = colors.danger || '#EF4444';
  const backgroundColor = colors.background || '#F3F4F6';
  const textColor = colors.text || '#1F2937';

  const synthesisRate = data?.synthesisRate || '连续合成';
  const direction = data?.direction || '5\' → 3\'';
  const nucleotidesPerSecond = data?.nucleotidesPerSecond || 1000;
  const description = data?.description || '前导链是DNA复制时，沿着复制叉移动方向连续合成的DNA新链';

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-lg" style={{ backgroundColor }}>
    <h2 className="text-2xl font-bold mb-4 text-center" style={{ color: textColor }}>前导链合成</h2>
    
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
        onClick={() => setActiveTab('direction')}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          activeTab === 'direction' ? 'text-white' : 'text-gray-600 hover:bg-gray-100'
        }`}
        style={activeTab === 'direction' ? { backgroundColor: primaryColor } : {}}
      >
        合成方向
      </button>
      <button
        onClick={() => setActiveTab('comparison')}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          activeTab === 'comparison' ? 'text-white' : 'text-gray-600 hover:bg-gray-100'
        }`}
        style={activeTab === 'comparison' ? { backgroundColor: primaryColor } : {}}
      >
        前导链 vs 后随链
      </button>
    </div>

    <div className="border rounded-lg p-6 bg-gray-50">
      {activeTab === 'synthesis' && (
        <div>
          <svg viewBox="0 0 800 400" className="w-full h-auto mb-4">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill={primaryColor} />
              </marker>
              <linearGradient id="leadingGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={primaryColor} stopOpacity="0.3" />
                <stop offset="100%" stopColor={primaryColor} stopOpacity="1" />
              </linearGradient>
              <linearGradient id="laggingGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={dangerColor} stopOpacity="0.3" />
                <stop offset="100%" stopColor={dangerColor} stopOpacity="1" />
              </linearGradient>
            </defs>

            <rect x="50" y="50" width="700" height="300" fill="white" stroke="#E5E7EB" strokeWidth="2" rx="8" />

            <text x="400" y="80" textAnchor="middle" fontSize="16" fontWeight="bold" fill={textColor}>
              前导链连续合成过程
            </text>

            <g transform="translate(100, 120)">
              <line x1="0" y1="20" x2="550" y2="20" stroke="#6B7280" strokeWidth="3" />
              <text x="280" y="50" textAnchor="middle" fontSize="12" fill="#6B7280">模板链 (3' → 5')</text>

              <g>
                <line x1="50" y1="0" x2="150" y2="0" stroke={primaryColor} strokeWidth="4" strokeOpacity="0.6" />
                <line x1="150" y1="0" x2="250" y2="0" stroke={primaryColor} strokeWidth="4" strokeOpacity="0.7" />
                <line x1="250" y1="0" x2="350" y2="0" stroke={primaryColor} strokeWidth="4" strokeOpacity="0.8" />
                <line x1="350" y1="0" x2="450" y2="0" stroke={primaryColor} strokeWidth="4" strokeOpacity="0.9" />
                <line x1="450" y1="0" x2="500" y2="0" stroke={primaryColor} strokeWidth="4" />
                <text x="275" y="-15" textAnchor="middle" fontSize="14" fontWeight="bold" fill={primaryColor}>前导链 (5' → 3')</text>
              </g>

              <g transform="translate(0, 80)">
                <ellipse cx="300" cy="0" rx="80" ry="40" fill={accentColor} fillOpacity="0.3" stroke={accentColor} strokeWidth="2" />
                <text x="300" y="5" textAnchor="middle" fontSize="12" fontWeight="bold" fill={accentColor}>DNA 聚合酶</text>
              </g>

              <g transform="translate(200, 140)">
                <circle cx="0" cy="0" r="8" fill={primaryColor} />
                <circle cx="30" cy="0" r="8" fill={primaryColor} />
                <circle cx="60" cy="0" r="8" fill={primaryColor} />
                <circle cx="90" cy="0" r="8" fill={primaryColor} />
                <circle cx="120" cy="0" r="8" fill={primaryColor} />
                <circle cx="150" cy="0" r="8" fill={primaryColor} />
                <text x="75" y="25" textAnchor="middle" fontSize="11" fill={primaryColor}>核苷酸添加</text>
              </g>

              <g transform="translate(380, 140)">
                <text x="0" y="0" fontSize="11" fill={textColor}>合成速率:</text>
                <text x="0" y="20" fontSize="12" fontWeight="bold" fill={primaryColor}>{nucleotidesPerSecond} 核苷酸/秒</text>
              </g>
            </g>
          </svg>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-bold mb-2" style={{ color: primaryColor }}>合成过程特点</h3>
            <ul className="text-sm space-y-1" style={{ color: textColor }}>
              <li>• DNA聚合酶沿着复制叉移动方向连续添加核苷酸</li>
              <li>• 合成方向与复制叉移动方向一致 (5' → 3')</li>
              <li>• 只需要一条引物链</li>
              <li>• 合成速度快且连续，无需片段拼接</li>
              <li>• 不需要DNA连接酶进行连接</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'direction' && (
        <div>
          <svg viewBox="0 0 800 400" className="w-full h-auto mb-4">
            <rect x="50" y="50" width="700" height="300" fill="white" stroke="#E5E7EB" strokeWidth="2" rx="8" />

            <text x="400" y="80" textAnchor="middle" fontSize="16" fontWeight="bold" fill={textColor}>
              前导链合成方向
            </text>

            <g transform="translate(100, 120)">
              <text x="250" y="0" textAnchor="middle" fontSize="14" fill={textColor}>DNA双链结构</text>

              <g transform="translate(50, 40)">
                <line x1="0" y1="0" x2="400" y2="0" stroke="#6B7280" strokeWidth="3" markerEnd="url(#arrowhead)" />
                <text x="10" y="-10" fontSize="12" fill="#6B7280">3'</text>
                <text x="390" y="-10" fontSize="12" fill="#6B7280">5'</text>
                <text x="200" y="20" textAnchor="middle" fontSize="11" fill="#6B7280">模板链 (3' → 5')</text>
              </g>

              <g transform="translate(50, 100)">
                <line x1="0" y1="0" x2="400" y2="0" stroke={primaryColor} strokeWidth="4" markerEnd="url(#arrowhead)" />
                <text x="10" y="-10" fontSize="12" fontWeight="bold" fill={primaryColor}>5'</text>
                <text x="390" y="-10" fontSize="12" fontWeight="bold" fill={primaryColor}>3'</text>
                <text x="200" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill={primaryColor}>前导链 (5' → 3') 新合成</text>
              </g>

              <g transform="translate(500, 40)">
                <rect x="0" y="0" width="150" height="100" fill={primaryColor} fillOpacity="0.1" stroke={primaryColor} strokeWidth="2" rx="4" />
                <text x="75" y="25" textAnchor="middle" fontSize="12" fontWeight="bold" fill={primaryColor}>关键要点</text>
                <text x="10" y="50" fontSize="10" fill={textColor}>1. 方向: 5' → 3'</text>
                <text x="10" y="70" fontSize="10" fill={textColor}>2. 连续合成</text>
                <text x="10" y="90" fontSize="10" fill={textColor}>3. 沿复制叉方向</text>
              </g>

              <g transform="translate(0, 180)">
                <line x1="0" y1="20" x2="500" y2="20" stroke="#6B7280" strokeWidth="2" strokeDasharray="5,5" />
                <polygon points="500,15 510,20 500,25" fill="#6B7280" />
                <text x="250" y="50" textAnchor="middle" fontSize="12" fill="#6B7280">复制叉移动方向</text>
              </g>
            </g>
          </svg>

          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <h3 className="font-bold mb-2" style={{ color: secondaryColor }}>为什么只能 5' → 3' 合成?</h3>
            <ul className="text-sm space-y-1" style={{ color: textColor }}>
              <li>• DNA聚合酶只能在核苷酸的3'羟基上添加新的核苷酸</li>
              <li>• 3'端提供游离的羟基(-OH)用于磷酸二酯键的形成</li>
              <li>• 5'端的磷酸基团已经被用于连接,不能接受新核苷酸</li>
              <li>• 这是DNA合成的基本化学限制,所有生物都遵循</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'comparison' && (
        <div>
          <svg viewBox="0 0 800 400" className="w-full h-auto mb-4">
            <rect x="50" y="50" width="700" height="300" fill="white" stroke="#E5E7EB" strokeWidth="2" rx="8" />

            <text x="400" y="80" textAnchor="middle" fontSize="16" fontWeight="bold" fill={textColor}>
              前导链 vs 后随链
            </text>

            <g transform="translate(80, 110)">
              <text x="150" y="0" textAnchor="middle" fontSize="13" fontWeight="bold" fill={primaryColor}>前导链</text>
              <text x="450" y="0" textAnchor="middle" fontSize="13" fontWeight="bold" fill={dangerColor}>后随链</text>

              <g transform="translate(0, 20)">
                <line x1="0" y1="20" x2="300" y2="20" stroke="#6B7280" strokeWidth="2" />
                <text x="150" y="50" textAnchor="middle" fontSize="10" fill="#6B7280">模板链 (3' → 5')</text>

                <line x1="0" y1="0" x2="280" y2="0" stroke={primaryColor} strokeWidth="3" />
                <text x="140" y="-10" textAnchor="middle" fontSize="10" fontWeight="bold" fill={primaryColor}>连续合成 (5' → 3')</text>

                <ellipse cx="150" cy="35" rx="40" ry="20" fill={accentColor} fillOpacity="0.3" />
                <text x="150" y="40" textAnchor="middle" fontSize="9" fill={accentColor}>聚合酶</text>
              </g>

              <g transform="translate(300, 20)">
                <line x1="0" y1="20" x2="300" y2="20" stroke="#6B7280" strokeWidth="2" />
                <text x="150" y="50" textAnchor="middle" fontSize="10" fill="#6B7280">模板链 (5' → 3')</text>

                <g>
                  <line x1="260" y1="0" x2="220" y2="0" stroke={dangerColor} strokeWidth="3" />
                  <line x1="190" y1="0" x2="150" y2="0" stroke={dangerColor} strokeWidth="3" />
                  <line x1="120" y1="0" x2="80" y2="0" stroke={dangerColor} strokeWidth="3" />
                  <line x1="50" y1="0" x2="10" y2="0" stroke={dangerColor} strokeWidth="3" />
                  <text x="135" y="-10" textAnchor="middle" fontSize="10" fontWeight="bold" fill={dangerColor}>冈崎片段 (5' → 3')</text>
                </g>

                <ellipse cx="280" cy="35" rx="40" ry="20" fill={accentColor} fillOpacity="0.3" />
                <text x="280" y="40" textAnchor="middle" fontSize="9" fill={accentColor}>聚合酶</text>
              </g>

              <g transform="translate(0, 100)">
                <rect x="0" y="0" width="280" height="150" fill={primaryColor} fillOpacity="0.05" stroke={primaryColor} strokeWidth="1" rx="4" />
                <text x="140" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill={primaryColor}>前导链特点</text>
                <text x="10" y="45" fontSize="9" fill={textColor}>✓ 连续合成</text>
                <text x="10" y="65" fontSize="9" fill={textColor}>✓ 方向与复制叉一致</text>
                <text x="10" y="85" fontSize="9" fill={textColor}>✓ 只需一条引物</text>
                <text x="10" y="105" fontSize="9" fill={textColor}>✓ 不需要连接酶</text>
                <text x="10" y="125" fontSize="9" fill={textColor}>✓ 合成速度快</text>
              </g>

              <g transform="translate(300, 100)">
                <rect x="0" y="0" width="280" height="150" fill={dangerColor} fillOpacity="0.05" stroke={dangerColor} strokeWidth="1" rx="4" />
                <text x="140" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill={dangerColor}>后随链特点</text>
                <text x="10" y="45" fontSize="9" fill={textColor}>✗ 不连续合成</text>
                <text x="10" y="65" fontSize="9" fill={textColor}>✗ 方向与复制叉相反</text>
                <text x="10" y="85" fontSize="9" fill={textColor}>✗ 需多条引物</text>
                <text x="10" y="105" fontSize="9" fill={textColor}>✗ 需要DNA连接酶</text>
                <text x="10" y="125" fontSize="9" fill={textColor}>✗ 合成速度相对慢</text>
              </g>
            </g>
          </svg>

          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-bold mb-2" style={{ color: accentColor }}>对比总结</h3>
            <p className="text-sm" style={{ color: textColor }}>
              前导链和后随链虽然合成方式不同,但都是由相同的DNA聚合酶催化,遵循相同的5'→3'合成方向。
              这种不对称的复制方式确保了DNA双链能够高效准确地复制。
            </p>
          </div>
        </div>
      )}
    </div>

    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-medium" style={{ color: primaryColor }}>合成方式:</span>
          <span className="ml-2" style={{ color: textColor }}>{synthesisRate}</span>
        </div>
        <div>
          <span className="font-medium" style={{ color: primaryColor }}>合成方向:</span>
          <span className="ml-2" style={{ color: textColor }}>{direction}</span>
        </div>
      </div>
    </div>
  </div>
  );
}
