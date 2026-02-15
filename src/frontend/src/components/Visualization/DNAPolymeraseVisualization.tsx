import { useState } from 'react';
import type { VisualizationData } from '../types';

interface DNAPolymeraseData extends VisualizationData {
  types?: string[];
  activities?: string[];
  direction?: string;
  description?: string;
}

export function DNAPolymeraseVisualization({ data, colors = {} }: { data?: DNAPolymeraseData; colors?: Record<string, string> }) {
  const [activeTab, setActiveTab] = useState<'structure' | 'process' | 'types'>('structure');

  const primaryColor = colors.primary || '#3B82F6';
  const secondaryColor = colors.secondary || '#10B981';
  const accentColor = colors.accent || '#F59E0B';
  const dangerColor = colors.danger || '#EF4444';
  const warningColor = colors.warning || '#F97316';
  const backgroundColor = colors.background || '#F3F4F6';
  const textColor = colors.text || '#1F2937';

  const polymeraseTypes = data?.types || ['DNA聚合酶I', 'DNA聚合酶II', 'DNA聚合酶III'];
  const enzymeActivities = data?.activities || ["5'->3'聚合酶活性", "3'->5'外切酶活性", "5'->3'外切酶活性"];
  const direction = data?.direction || "5'->3'方向合成";
  const description = data?.description || 'DNA聚合酶是DNA复制过程中的关键酶,负责以DNA为模板合成新的DNA链';

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-lg" style={{ backgroundColor }}>
      <h2 className="text-2xl font-bold mb-4 text-center" style={{ color: textColor }}>DNA聚合酶</h2>
      
      <div className="mb-6 text-center">
        <p className="text-sm" style={{ color: textColor }}>{description}</p>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('structure')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'structure' ? 'text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
          style={activeTab === 'structure' ? { backgroundColor: primaryColor } : {}}
        >
          酶结构
        </button>
        <button
          onClick={() => setActiveTab('process')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'process' ? 'text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
          style={activeTab === 'process' ? { backgroundColor: primaryColor } : {}}
        >
          延伸过程
        </button>
        <button
          onClick={() => setActiveTab('types')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'types' ? 'text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}
          style={activeTab === 'types' ? { backgroundColor: primaryColor } : {}}
        >
          聚合酶类型
        </button>
      </div>

      <div className="border rounded-lg p-6 bg-gray-50">
        {activeTab === 'structure' && (
          <div>
            <svg viewBox="0 0 800 400" className="w-full h-auto mb-4">
              <rect x="50" y="50" width="700" height="300" fill="white" stroke="#E5E7EB" strokeWidth="2" rx="8" />

              <text x="400" y="80" textAnchor="middle" fontSize="16" fontWeight="bold" fill={textColor}>
                DNA聚合酶结构
              </text>

              <g transform="translate(200, 110)">
                <circle cx="250" cy="120" r="80" fill={primaryColor} fillOpacity="0.2" stroke={primaryColor} strokeWidth="3" />
                
                <text x="250" y="60" textAnchor="middle" fontSize="12" fontWeight="bold" fill={primaryColor}>DNA聚合酶</text>
                
                <circle cx="200" cy="100" r="25" fill={accentColor} fillOpacity="0.8" stroke={accentColor} strokeWidth="2" />
                <text x="200" y="105" textAnchor="middle" fontSize="8" fill="white">拇指区</text>
                
                <circle cx="300" cy="100" r="25" fill={accentColor} fillOpacity="0.8" stroke={accentColor} strokeWidth="2" />
                <text x="300" y="105" textAnchor="middle" fontSize="8" fill="white">手指区</text>
                
                <rect x="210" y="160" width="80" height="50" fill={dangerColor} fillOpacity="0.4" stroke={dangerColor} strokeWidth="2" rx="5" />
                <text x="250" y="190" textAnchor="middle" fontSize="8" fill="white">手掌区</text>
                
                <text x="150" y="225" fontSize="10" fill={textColor}>• 拇指区: 结合DNA</text>
                <text x="150" y="245" fontSize="10" fill={textColor}>• 手指区: 结合dNTP</text>
                <text x="150" y="265" fontSize="10" fill={textColor}>• 手掌区: 催化活性中心</text>
              </g>
            </svg>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-bold mb-2" style={{ color: primaryColor }}>酶结构</h3>
              <ul className="text-sm space-y-1" style={{ color: textColor }}>
                <li>• DNA聚合酶具有类似手掌的结构,包含拇指、手指和手掌三个区域</li>
                <li>• 拇指区负责结合DNA模板和新合成的DNA链</li>
                <li>• 手指区负责结合脱氧核糖核苷酸(dNTP)</li>
                <li>• 手掌区包含催化活性中心,负责磷酸二酯键的形成</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'process' && (
          <div>
            <svg viewBox="0 0 800 400" className="w-full h-auto mb-4">
              <rect x="50" y="50" width="700" height="300" fill="white" stroke="#E5E7EB" strokeWidth="2" rx="8" />

              <text x="400" y="80" textAnchor="middle" fontSize="16" fontWeight="bold" fill={textColor}>
                DNA链延伸过程
              </text>

              <g transform="translate(80, 110)">
                <g transform="translate(0, 0)">
                  <text x="150" y="0" textAnchor="middle" fontSize="12" fontWeight="bold" fill={textColor}>1. 结合</text>
                  
                  <rect x="50" y="20" width="200" height="60" fill={primaryColor} fillOpacity="0.1" stroke={primaryColor} strokeWidth="2" rx="10" />
                  
                  <line x1="70" y1="50" x2="160" y2="50" stroke={secondaryColor} strokeWidth="4" />
                  <line x1="70" y1="50" x2="160" y2="50" stroke={textColor} strokeWidth="4" strokeDasharray="5,5" />
                  
                  <circle cx="180" cy="50" r="20" fill={accentColor} fillOpacity="0.4" stroke={accentColor} strokeWidth="2" />
                  <text x="180" y="54" textAnchor="middle" fontSize="7" fill={accentColor}>酶</text>
                  
                  <text x="70" y="105" fontSize="8" fill={textColor}>• 酶结合到DNA</text>
                </g>

                <g transform="translate(230, 0)">
                  <text x="150" y="0" textAnchor="middle" fontSize="12" fontWeight="bold" fill={textColor}>2. dNTP进入</text>
                  
                  <rect x="50" y="20" width="200" height="60" fill={primaryColor} fillOpacity="0.1" stroke={primaryColor} strokeWidth="2" rx="10" />
                  
                  <line x1="70" y1="50" x2="160" y2="50" stroke={secondaryColor} strokeWidth="4" />
                  <line x1="70" y1="50" x2="160" y2="50" stroke={textColor} strokeWidth="4" strokeDasharray="5,5" />
                  
                  <circle cx="180" cy="50" r="20" fill={accentColor} fillOpacity="0.4" stroke={accentColor} strokeWidth="2" />
                  <text x="180" y="54" textAnchor="middle" fontSize="7" fill={accentColor}>酶</text>
                  
                  <rect x="160" y="30" width="40" height="20" fill={dangerColor} fillOpacity="0.4" stroke={dangerColor} strokeWidth="2" rx="3" />
                  <text x="180" y="43" textAnchor="middle" fontSize="6" fill="white">dNTP</text>
                  
                  <path d="M 150 40 L 155 40 L 155 45" fill={accentColor} fillOpacity="0.4" stroke={accentColor} strokeWidth="2" />
                  
                  <text x="70" y="105" fontSize="8" fill={textColor}>• dNTP进入活性中心</text>
                </g>

                <g transform="translate(460, 0)">
                  <text x="150" y="0" textAnchor="middle" fontSize="12" fontWeight="bold" fill={textColor}>3. 延伸</text>
                  
                  <rect x="50" y="20" width="200" height="60" fill={primaryColor} fillOpacity="0.1" stroke={primaryColor} strokeWidth="2" rx="10" />
                  
                  <line x1="70" y1="50" x2="190" y2="50" stroke={secondaryColor} strokeWidth="4" />
                  <line x1="70" y1="50" x2="190" y2="50" stroke={textColor} strokeWidth="4" strokeDasharray="5,5" />
                  
                  <circle cx="210" cy="50" r="20" fill={accentColor} fillOpacity="0.4" stroke={accentColor} strokeWidth="2" />
                  <text x="210" y="54" textAnchor="middle" fontSize="7" fill={accentColor}>酶</text>
                  
                  <rect x="100" y="240" width="700" height="60" fill={primaryColor} fillOpacity="0.1" stroke={primaryColor} strokeWidth="2" rx="10" />
                  <text x="450" y="275" textAnchor="middle" fontSize="14" fill={primaryColor}>{direction}</text>
                </g>
              </g>
            </svg>

            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <h3 className="font-bold mb-2" style={{ color: secondaryColor }}>延伸过程</h3>
              <ul className="text-sm space-y-1" style={{ color: textColor }}>
                <li>• {direction},每个dNTP的添加使DNA链延长一个核苷酸</li>
                <li>• dNTP必须与模板碱基互补配对才能被酶接受</li>
                <li>• 磷酸二酯键形成释放焦磷酸(PPi)</li>
                <li>• 镁离子(Mg2+)作为辅助因子参与催化反应</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'types' && (
          <div>
            <svg viewBox="0 0 800 400" className="w-full h-auto mb-4">
              <rect x="50" y="50" width="700" height="300" fill="white" stroke="#E5E7EB" strokeWidth="2" rx="8" />

              <text x="400" y="80" textAnchor="middle" fontSize="16" fontWeight="bold" fill={textColor}>
                DNA聚合酶类型
              </text>

              <g transform="translate(80, 110)">
                <g transform="translate(20, 20)">
                  <rect x="0" y="0" width="180" height="200" fill={primaryColor} fillOpacity="0.05" stroke={primaryColor} strokeWidth="2" rx="4" />
                  <text x="90" y="25" textAnchor="middle" fontSize="12" fontWeight="bold" fill={primaryColor}>DNA聚合酶I</text>
                  
                  <text x="10" y="55" fontSize="9" fill={textColor}>• 修复酶</text>
                  <text x="10" y="75" fontSize="9" fill={textColor}>• 5'-&gt;3'聚合</text>
                  <text x="10" y="95" fontSize="9" fill={textColor}>• 3'-&gt;5'外切</text>
                  <text x="10" y="115" fontSize="9" fill={textColor}>• 5'-&gt;3'外切</text>
                  <text x="10" y="135" fontSize="9" fill={textColor}>• 切除RNA引物</text>
                  <text x="10" y="155" fontSize="9" fill={textColor}>• 填补缺口</text>
                  
                  <rect x="10" y="170" width="160" height="20" fill={primaryColor} fillOpacity="0.2" rx="3" />
                  <text x="90" y="184" textAnchor="middle" fontSize="8" fill={primaryColor}>DNA修复与引物切除</text>
                </g>

                <g transform="translate(220, 20)">
                  <rect x="0" y="0" width="180" height="200" fill={secondaryColor} fillOpacity="0.1" stroke={secondaryColor} strokeWidth="2" rx="4" />
                  <text x="90" y="25" textAnchor="middle" fontSize="12" fontWeight="bold" fill={secondaryColor}>DNA聚合酶II</text>
                  
                  <text x="10" y="55" fontSize="9" fill={textColor}>• SOS修复</text>
                  <text x="10" y="75" fontSize="9" fill={textColor}>• 5'-&gt;3'聚合</text>
                  <text x="10" y="95" fontSize="9" fill={textColor}>• 3'-&gt;5'外切</text>
                  <text x="10" y="115" fontSize="9" fill={textColor}>• 缺乏校对能力</text>
                  <text x="10" y="135" fontSize="9" fill={textColor}>• 错误率较高</text>
                  <text x="10" y="155" fontSize="9" fill={textColor}>• 应急修复</text>
                  
                  <rect x="10" y="170" width="160" height="20" fill={secondaryColor} fillOpacity="0.2" rx="3" />
                  <text x="90" y="184" textAnchor="middle" fontSize="8" fill={secondaryColor}>SOS应急修复</text>
                </g>

                <g transform="translate(420, 20)">
                  <rect x="0" y="0" width="180" height="200" fill={accentColor} fillOpacity="0.1" stroke={accentColor} strokeWidth="2" rx="4" />
                  <text x="90" y="25" textAnchor="middle" fontSize="12" fontWeight="bold" fill={accentColor}>DNA聚合酶III</text>
                  
                  <text x="10" y="55" fontSize="9" fill={textColor}>• 主要复制酶</text>
                  <text x="10" y="75" fontSize="9" fill={textColor}>• 5'-&gt;3'聚合</text>
                  <text x="10" y="95" fontSize="9" fill={textColor}>• 3'-&gt;5'外切</text>
                  <text x="10" y="115" fontSize="9" fill={textColor}>• 高速合成</text>
                  <text x="10" y="135" fontSize="9" fill={textColor}>• 高保真性</text>
                  <text x="10" y="155" fontSize="9" fill={textColor}>• 复制核心</text>
                  
                  <rect x="10" y="170" width="160" height="20" fill={accentColor} fillOpacity="0.2" rx="3" />
                  <text x="90" y="184" textAnchor="middle" fontSize="8" fill={accentColor}>DNA复制的主要酶</text>
                </g>
              </g>
            </svg>

            <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-bold mb-2" style={{ color: accentColor }}>聚合酶类型</h3>
              <ul className="text-sm space-y-1" style={{ color: textColor }}>
                <li>• DNA聚合酶I: 主要参与DNA修复和RNA引物切除</li>
                <li>• DNA聚合酶II: 参与SOS应急修复,错误率较高</li>
                <li>• DNA聚合酶III: 是DNA复制的主要酶,具有高速和高保真性</li>
                <li>• 不同聚合酶具有不同的酶活性和功能特点</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium" style={{ color: primaryColor }}>酶类型:</span>
            <span className="ml-2" style={{ color: textColor }}>{polymeraseTypes.join(', ')}</span>
          </div>
          <div>
            <span className="font-medium" style={{ color: primaryColor }}>酶活性:</span>
            <span className="ml-2" style={{ color: textColor }}>{enzymeActivities.join(', ')}</span>
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