import { useState } from 'react';
import { VisualizationColors } from '../../constants/visualization-colors';

interface ChromosomalAberrationVisualizationProps {
  colors?: Record<string, string>;
}

export function ChromosomalAberrationVisualization({ colors }: ChromosomalAberrationVisualizationProps) {
  const [activeTab, setActiveTab] = useState<'deletion' | 'duplication' | 'inversion' | 'translocation'>('deletion');

  const defaultColors = {
    normal: colors?.normal || VisualizationColors.dominant,
    aberration: colors?.aberration || VisualizationColors.affected,
    highlight: colors?.highlight || VisualizationColors.hover,
    marker: colors?.marker || VisualizationColors.nodePrinciple,
  };

  const aberrationTypes = [
    {
      id: 'deletion',
      name: '缺失',
      description: '染色体片段丢失',
      example: '猫叫综合征（5号染色体短臂缺失）',
      severity: '严重',
    },
    {
      id: 'duplication',
      name: '重复',
      description: '染色体片段重复出现',
      example: 'Charcot-Marie-Tooth病（17号染色体重复）',
      severity: '中等',
    },
    {
      id: 'inversion',
      name: '倒位',
      description: '染色体片段发生180°翻转',
      example: '血友病A（X染色体倒位）',
      severity: '轻微',
    },
    {
      id: 'translocation',
      name: '易位',
      description: '染色体片段交换位置',
      example: '慢性粒细胞白血病（9号和22号易位）',
      severity: '严重',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {aberrationTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setActiveTab(type.id as any)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === type.id
                ? 'bg-red-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {type.name}
          </button>
        ))}
      </div>

      {activeTab === 'deletion' && (
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-red-800">缺失</h3>
            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">严重</span>
          </div>
          
          <div className="flex justify-center">
            <svg width="600" height="300" viewBox="0 0 600 300">
              <defs>
                <marker id="arrow-red" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L9,3 z" fill="#EF4444"/>
                </marker>
              </defs>

              <text x="300" y="25" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1976D2">染色体缺失示意图</text>

              <g transform="translate(50, 50)">
                <text x="250" y="15" textAnchor="middle" fontSize="12" fill="#666">正常染色体</text>
                
                <g transform="translate(30, 30)">
                  <rect x="0" y="20" width="100" height="30" fill={defaultColors.normal} fillOpacity="0.3" stroke={defaultColors.normal} strokeWidth="2" rx="4"/>
                  <rect x="100" y="20" width="80" height="30" fill={defaultColors.normal} fillOpacity="0.5" stroke={defaultColors.normal} strokeWidth="2" rx="4"/>
                  <rect x="180" y="20" width="80" height="30" fill={defaultColors.normal} fillOpacity="0.7" stroke={defaultColors.normal} strokeWidth="2" rx="4"/>
                  <rect x="260" y="20" width="80" height="30" fill={defaultColors.normal} fillOpacity="0.5" stroke={defaultColors.normal} strokeWidth="2" rx="4"/>
                  <rect x="340" y="20" width="80" height="30" fill={defaultColors.normal} fillOpacity="0.3" stroke={defaultColors.normal} strokeWidth="2" rx="4"/>
                  
                  <text x="210" y="75" textAnchor="middle" fontSize="10" fill={defaultColors.normal}>A - B - C - D - E</text>
                </g>
              </g>

              <g transform="translate(50, 150)">
                <text x="250" y="15" textAnchor="middle" fontSize="12" fill="#666">缺失染色体</text>
                
                <g transform="translate(30, 30)">
                  <rect x="0" y="20" width="100" height="30" fill={defaultColors.normal} fillOpacity="0.3" stroke={defaultColors.normal} strokeWidth="2" rx="4"/>
                  <rect x="100" y="20" width="80" height="30" fill={defaultColors.normal} fillOpacity="0.5" stroke={defaultColors.normal} strokeWidth="2" rx="4"/>
                  
                  <rect x="180" y="20" width="80" height="30" fill={defaultColors.aberration} fillOpacity="0.3" stroke={defaultColors.aberration} strokeWidth="2" strokeDasharray="5,3" rx="4"/>
                  <text x="220" y="40" textAnchor="middle" fontSize="10" fill="#EF4444">缺失</text>
                  
                  <rect x="180" y="20" width="80" height="30" fill="none" stroke={defaultColors.aberration} strokeWidth="2" strokeDasharray="5,3" rx="4"/>
                  
                  <rect x="260" y="20" width="80" height="30" fill={defaultColors.normal} fillOpacity="0.5" stroke={defaultColors.normal} strokeWidth="2" rx="4"/>
                  <rect x="340" y="20" width="80" height="30" fill={defaultColors.normal} fillOpacity="0.3" stroke={defaultColors.normal} strokeWidth="2" rx="4"/>
                  
                  <line x1="140" y1="35" x2="180" y2="35" stroke={defaultColors.aberration} strokeWidth="3" markerEnd="url(#arrow-red)"/>
                  <line x1="260" y1="35" x2="220" y2="35" stroke={defaultColors.aberration} strokeWidth="3" markerEnd="url(#arrow-red)"/>
                  
                  <text x="170" y="75" textAnchor="middle" fontSize="10" fill={defaultColors.normal}>A - B - D - E</text>
                </g>
              </g>

              <g transform="translate(450, 100)">
                <rect x="0" y="0" width="120" height="80" fill="white" stroke={defaultColors.aberration} strokeWidth="2" rx="4"/>
                <text x="60" y="25" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#DC2626">基因丢失</text>
                <text x="60" y="45" textAnchor="middle" fontSize="9" fill="#666">片段C缺失</text>
                <text x="60" y="60" textAnchor="middle" fontSize="9" fill="#666">导致遗传缺陷</text>
              </g>
            </svg>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-red-800 mb-3">缺失特点</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span><strong>片段丢失：</strong>染色体的一部分被完全移除</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span><strong>基因缺失：</strong>丢失的片段可能包含重要基因</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span><strong>表型效应：</strong>通常导致严重的遗传疾病</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span><strong>典型案例：</strong>猫叫综合征（5p-）</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'duplication' && (
        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-orange-800">重复</h3>
            <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">中等</span>
          </div>
          
          <div className="flex justify-center">
            <svg width="600" height="300" viewBox="0 0 600 300">
              <defs>
                <marker id="arrow-orange" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L9,3 z" fill="#F59E0B"/>
                </marker>
              </defs>

              <text x="300" y="25" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1976D2">染色体重复示意图</text>

              <g transform="translate(50, 50)">
                <text x="250" y="15" textAnchor="middle" fontSize="12" fill="#666">正常染色体</text>
                
                <g transform="translate(30, 30)">
                  <rect x="0" y="20" width="100" height="30" fill={defaultColors.normal} fillOpacity="0.3" stroke={defaultColors.normal} strokeWidth="2" rx="4"/>
                  <rect x="100" y="20" width="80" height="30" fill={defaultColors.normal} fillOpacity="0.5" stroke={defaultColors.normal} strokeWidth="2" rx="4"/>
                  <rect x="180" y="20" width="80" height="30" fill={defaultColors.normal} fillOpacity="0.7" stroke={defaultColors.normal} strokeWidth="2" rx="4"/>
                  <rect x="260" y="20" width="80" height="30" fill={defaultColors.normal} fillOpacity="0.5" stroke={defaultColors.normal} strokeWidth="2" rx="4"/>
                  <rect x="340" y="20" width="80" height="30" fill={defaultColors.normal} fillOpacity="0.3" stroke={defaultColors.normal} strokeWidth="2" rx="4"/>
                  
                  <text x="210" y="75" textAnchor="middle" fontSize="10" fill={defaultColors.normal}>A - B - C - D - E</text>
                </g>
              </g>

              <g transform="translate(50, 150)">
                <text x="250" y="15" textAnchor="middle" fontSize="12" fill="#666">重复染色体</text>
                
                <g transform="translate(30, 30)">
                  <rect x="0" y="20" width="100" height="30" fill={defaultColors.normal} fillOpacity="0.3" stroke={defaultColors.normal} strokeWidth="2" rx="4"/>
                  <rect x="100" y="20" width="80" height="30" fill={defaultColors.normal} fillOpacity="0.5" stroke={defaultColors.normal} strokeWidth="2" rx="4"/>
                  
                  <rect x="180" y="20" width="80" height="30" fill={defaultColors.normal} fillOpacity="0.7" stroke={defaultColors.normal} strokeWidth="2" rx="4"/>
                  
                  <rect x="260" y="20" width="80" height="30" fill={defaultColors.highlight} fillOpacity="0.6" stroke={defaultColors.highlight} strokeWidth="3" rx="4"/>
                  <text x="300" y="40" textAnchor="middle" fontSize="9" fill="#B45309">C'</text>
                  
                  <rect x="340" y="20" width="80" height="30" fill={defaultColors.normal} fillOpacity="0.5" stroke={defaultColors.normal} strokeWidth="2" rx="4"/>
                  
                  <line x1="180" y1="10" x2="260" y2="10" stroke={defaultColors.highlight} strokeWidth="2" markerEnd="url(#arrow-orange)"/>
                  
                  <text x="230" y="75" textAnchor="middle" fontSize="10" fill={defaultColors.normal}>A - B - C - C' - D - E</text>
                </g>
              </g>

              <g transform="translate(450, 100)">
                <rect x="0" y="0" width="120" height="80" fill="white" stroke={defaultColors.highlight} strokeWidth="2" rx="4"/>
                <text x="60" y="25" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#B45309">基因重复</text>
                <text x="60" y="45" textAnchor="middle" fontSize="9" fill="#666">片段C复制</text>
                <text x="60" y="60" textAnchor="middle" fontSize="9" fill="#666">剂量效应</text>
              </g>
            </svg>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-orange-800 mb-3">重复特点</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                <span><strong>片段复制：</strong>染色体的一部分被复制并插入</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                <span><strong>剂量效应：</strong>基因拷贝数增加，影响表达水平</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                <span><strong>表型多样性：</strong>可能导致多种遗传异常</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                <span><strong>典型案例：</strong>Charcot-Marie-Tooth病（17p12重复）</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'inversion' && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-purple-800">倒位</h3>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">轻微</span>
          </div>
          
          <div className="flex justify-center">
            <svg width="600" height="300" viewBox="0 0 600 300">
              <defs>
                <marker id="arrow-purple" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L9,3 z" fill="#8B5CF6"/>
                </marker>
              </defs>

              <text x="300" y="25" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1976D2">染色体倒位示意图</text>

              <g transform="translate(50, 50)">
                <text x="250" y="15" textAnchor="middle" fontSize="12" fill="#666">正常染色体</text>
                
                <g transform="translate(30, 30)">
                  <rect x="0" y="20" width="100" height="30" fill={defaultColors.normal} fillOpacity="0.3" stroke={defaultColors.normal} strokeWidth="2" rx="4"/>
                  <rect x="100" y="20" width="80" height="30" fill={defaultColors.normal} fillOpacity="0.5" stroke={defaultColors.normal} strokeWidth="2" rx="4"/>
                  <rect x="180" y="20" width="80" height="30" fill={defaultColors.normal} fillOpacity="0.7" stroke={defaultColors.normal} strokeWidth="2" rx="4"/>
                  <rect x="260" y="20" width="80" height="30" fill={defaultColors.normal} fillOpacity="0.5" stroke={defaultColors.normal} strokeWidth="2" rx="4"/>
                  <rect x="340" y="20" width="80" height="30" fill={defaultColors.normal} fillOpacity="0.3" stroke={defaultColors.normal} strokeWidth="2" rx="4"/>
                  
                  <text x="210" y="75" textAnchor="middle" fontSize="10" fill={defaultColors.normal}>A - B - C - D - E</text>
                </g>
              </g>

              <g transform="translate(50, 150)">
                <text x="250" y="15" textAnchor="middle" fontSize="12" fill="#666">倒位染色体</text>
                
                <g transform="translate(30, 30)">
                  <rect x="0" y="20" width="100" height="30" fill={defaultColors.normal} fillOpacity="0.3" stroke={defaultColors.normal} strokeWidth="2" rx="4"/>
                  
                  <rect x="100" y="20" width="80" height="30" fill={defaultColors.marker} fillOpacity="0.6" stroke={defaultColors.marker} strokeWidth="3" rx="4"/>
                  <text x="140" y="40" textAnchor="middle" fontSize="9" fill="#6D28D9">D</text>
                  
                  <rect x="180" y="20" width="80" height="30" fill={defaultColors.marker} fillOpacity="0.6" stroke={defaultColors.marker} strokeWidth="3" rx="4"/>
                  <text x="220" y="40" textAnchor="middle" fontSize="9" fill="#6D28D9">C</text>
                  
                  <rect x="260" y="20" width="80" height="30" fill={defaultColors.normal} fillOpacity="0.5" stroke={defaultColors.normal} strokeWidth="2" rx="4"/>
                  <rect x="340" y="20" width="80" height="30" fill={defaultColors.normal} fillOpacity="0.3" stroke={defaultColors.normal} strokeWidth="2" rx="4"/>
                  
                  <path d="M100,10 Q140,0 180,10" stroke={defaultColors.marker} strokeWidth="2" fill="none" markerEnd="url(#arrow-purple)"/>
                  
                  <text x="190" y="75" textAnchor="middle" fontSize="10" fill={defaultColors.normal}>A - D - C - B - E</text>
                </g>
              </g>

              <g transform="translate(450, 100)">
                <rect x="0" y="0" width="120" height="80" fill="white" stroke={defaultColors.marker} strokeWidth="2" rx="4"/>
                <text x="60" y="25" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#6D28D9">片段倒位</text>
                <text x="60" y="45" textAnchor="middle" fontSize="9" fill="#666">C-D片段</text>
                <text x="60" y="60" textAnchor="middle" fontSize="9" fill="#666">180°翻转</text>
              </g>
            </svg>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-3">倒位特点</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span><strong>片段翻转：</strong>染色体片段发生180°旋转</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span><strong>基因顺序：</strong>基因顺序改变但基因本身不变</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span><strong>减数分裂：</strong>可能影响同源染色体配对</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span><strong>典型案例：</strong>血友病A（Xq28倒位）</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'translocation' && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-blue-800">易位</h3>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">严重</span>
          </div>
          
          <div className="flex justify-center">
            <svg width="600" height="350" viewBox="0 0 600 350">
              <defs>
                <marker id="arrow-blue" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L9,3 z" fill="#3B82F6"/>
                </marker>
              </defs>

              <text x="300" y="25" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1976D2">染色体易位示意图</text>

              <g transform="translate(50, 50)">
                <text x="100" y="15" textAnchor="middle" fontSize="12" fill="#666">正常9号染色体</text>
                
                <g transform="translate(20, 30)">
                  <rect x="0" y="20" width="80" height="30" fill={defaultColors.normal} fillOpacity="0.3" stroke={defaultColors.normal} strokeWidth="2" rx="4"/>
                  <rect x="80" y="20" width="60" height="30" fill="#3B82F6" fillOpacity="0.6" stroke="#3B82F6" strokeWidth="2" rx="4"/>
                  <text x="110" y="40" textAnchor="middle" fontSize="9" fill="#1D4ED8">ABL</text>
                  <rect x="140" y="20" width="60" height="30" fill={defaultColors.normal} fillOpacity="0.3" stroke={defaultColors.normal} strokeWidth="2" rx="4"/>
                  
                  <text x="100" y="75" textAnchor="middle" fontSize="10" fill={defaultColors.normal}>9号</text>
                </g>
              </g>

              <g transform="translate(320, 50)">
                <text x="100" y="15" textAnchor="middle" fontSize="12" fill="#666">正常22号染色体</text>
                
                <g transform="translate(20, 30)">
                  <rect x="0" y="20" width="80" height="30" fill={defaultColors.normal} fillOpacity="0.3" stroke={defaultColors.normal} strokeWidth="2" rx="4"/>
                  <rect x="80" y="20" width="60" height="30" fill="#EF4444" fillOpacity="0.6" stroke="#EF4444" strokeWidth="2" rx="4"/>
                  <text x="110" y="40" textAnchor="middle" fontSize="9" fill="#DC2626">BCR</text>
                  <rect x="140" y="20" width="60" height="30" fill={defaultColors.normal} fillOpacity="0.3" stroke={defaultColors.normal} strokeWidth="2" rx="4"/>
                  
                  <text x="100" y="75" textAnchor="middle" fontSize="10" fill={defaultColors.normal}>22号</text>
                </g>
              </g>

              <g transform="translate(50, 180)">
                <text x="250" y="15" textAnchor="middle" fontSize="12" fill="#666">易位后染色体</text>
                
                <g transform="translate(20, 30)">
                  <rect x="0" y="20" width="80" height="30" fill={defaultColors.normal} fillOpacity="0.3" stroke={defaultColors.normal} strokeWidth="2" rx="4"/>
                  <rect x="80" y="20" width="60" height="30" fill="#EF4444" fillOpacity="0.6" stroke="#EF4444" strokeWidth="3" rx="4"/>
                  <text x="110" y="40" textAnchor="middle" fontSize="9" fill="#DC2626">BCR</text>
                  <rect x="140" y="20" width="60" height="30" fill={defaultColors.normal} fillOpacity="0.3" stroke={defaultColors.normal} strokeWidth="2" rx="4"/>
                  
                  <text x="100" y="75" textAnchor="middle" fontSize="10" fill={defaultColors.normal}>9号(der9)</text>
                </g>
                
                <g transform="translate(220, 30)">
                  <rect x="0" y="20" width="80" height="30" fill={defaultColors.normal} fillOpacity="0.3" stroke={defaultColors.normal} strokeWidth="2" rx="4"/>
                  <rect x="80" y="20" width="60" height="30" fill="#3B82F6" fillOpacity="0.6" stroke="#3B82F6" strokeWidth="3" rx="4"/>
                  <text x="110" y="40" textAnchor="middle" fontSize="9" fill="#1D4ED8">ABL</text>
                  <rect x="140" y="20" width="60" height="30" fill={defaultColors.normal} fillOpacity="0.3" stroke={defaultColors.normal} strokeWidth="2" rx="4"/>
                  
                  <text x="100" y="75" textAnchor="middle" fontSize="10" fill={defaultColors.normal}>22号(der22)</text>
                </g>

                <path d="M100,10 Q160,-20 220,10" stroke="#8B5CF6" strokeWidth="2" fill="none" markerEnd="url(#arrow-blue)"/>
                <path d="M280,10 Q220,-20 160,10" stroke="#8B5CF6" strokeWidth="2" fill="none" markerEnd="url(#arrow-blue)"/>
              </g>

              <g transform="translate(480, 100)">
                <rect x="0" y="0" width="100" height="100" fill="white" stroke="#8B5CF6" strokeWidth="2" rx="4"/>
                <text x="50" y="25" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#6D28D9">易位</text>
                <text x="50" y="45" textAnchor="middle" fontSize="9" fill="#666">9和22号</text>
                <text x="50" y="60" textAnchor="middle" fontSize="9" fill="#666">染色体</text>
                <text x="50" y="75" textAnchor="middle" fontSize="9" fill="#666">片段交换</text>
                <text x="50" y="90" textAnchor="middle" fontSize="9" fill="#666">t(9;22)</text>
              </g>
            </svg>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-3">易位特点</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>片段交换：</strong>两条非同源染色体交换片段</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>类型：</strong>相互易位、罗伯逊易位等</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>融合基因：</strong>可能产生新的融合基因</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>典型案例：</strong>慢性粒细胞白血病（费城染色体）</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
        <h4 className="font-semibold text-gray-800 mb-3">畸变影响</h4>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h5 className="font-medium text-red-700 mb-2">严重影响</h5>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• 发育迟缓</li>
              <li>• 智力障碍</li>
              <li>• 多种畸形</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h5 className="font-medium text-orange-700 mb-2">中等影响</h5>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• 特定症状</li>
              <li>• 代谢异常</li>
              <li>• 器官功能受损</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h5 className="font-medium text-green-700 mb-2">轻微影响</h5>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• 携带者无症状</li>
              <li>• 生育能力正常</li>
              <li>• 后代可能受影响</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
