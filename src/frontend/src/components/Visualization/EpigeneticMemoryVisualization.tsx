import { useState } from 'react';
import type { VisualizationData } from '../types';

interface EpigeneticMemoryData extends VisualizationData {
  mechanisms?: string[];
  examples?: string[];
  function?: string;
  description?: string;
}

export function EpigeneticMemoryVisualization({ data, colors = {} }: { data?: EpigeneticMemoryData; colors?: Record<string, string> }) {
  const [activeTab, setActiveTab] = useState<'mechanism' | 'inheritance' | 'examples'>('mechanism');

  const primaryColor = colors.primary || '#3B82F6';
  const secondaryColor = colors.secondary || '#10B981';
  const accentColor = colors.accent || '#F59E0B';
  const dangerColor = colors.danger || '#EF4444';
  const backgroundColor = colors.background || '#F3F4F6';
  const textColor = colors.text || '#1F2937';

  const memoryMechanisms = data?.mechanisms || ['DNA甲基化', '组蛋白修饰', '染色质重塑'];
  const memoryExamples = data?.examples || ['亲本印记', 'X染色体失活', '细胞记忆'];
  const func = data?.function || '记忆基因表达模式,在细胞分裂中传递';
  const description = data?.description || '表观遗传记忆是指表观遗传修饰(如DNA甲基化、组蛋白修饰)在细胞分裂中稳定遗传的现象';

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-lg" style={{ backgroundColor }}>
    <h2 className="text-2xl font-bold mb-4 text-center" style={{ color: textColor }}>表观遗传记忆机制</h2>
    
    <div className="mb-6 text-center">
      <p className="text-sm" style={{ color: textColor }}>{description}</p>
    </div>

    <div className="flex gap-2 mb-6">
      <button
        onClick={() => setActiveTab('mechanism')}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          activeTab === 'mechanism' ? 'text-white' : 'text-gray-600 hover:bg-gray-100'
        }`}
        style={activeTab === 'mechanism' ? { backgroundColor: primaryColor } : {}}
      >
        记忆机制
      </button>
      <button
        onClick={() => setActiveTab('inheritance')}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          activeTab === 'inheritance' ? 'text-white' : 'text-gray-600 hover:bg-gray-100'
        }`}
        style={activeTab === 'inheritance' ? { backgroundColor: primaryColor } : {}}
      >
        遗传过程
      </button>
      <button
        onClick={() => setActiveTab('examples')}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          activeTab === 'examples' ? 'text-white' : 'text-gray-600 hover:bg-gray-100'
        }`}
        style={activeTab === 'examples' ? { backgroundColor: primaryColor } : {}}
      >
        生物学实例
      </button>
    </div>

    <div className="border rounded-lg p-6 bg-gray-50">
      {activeTab === 'mechanism' && (
        <div>
          <svg viewBox="0 0 800 400" className="w-full h-auto mb-4">
            <rect x="50" y="50" width="700" height="300" fill="white" stroke="#E5E7EB" strokeWidth="2" rx="8" />

            <text x="400" y="80" textAnchor="middle" fontSize="16" fontWeight="bold" fill={textColor}>
              表观遗传记忆机制
            </text>

            <g transform="translate(80, 110)">
              <text x="320" y="0" textAnchor="middle" fontSize="14" fill={textColor}>记忆建立</text>

              <g transform="translate(20, 30)">
                <rect x="0" y="0" width="150" height="180" fill={primaryColor} fillOpacity="0.05" stroke={primaryColor} strokeWidth="1" rx="4" />
                <text x="75" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill={primaryColor}>信号识别</text>
                
                <g transform="translate(15, 35)">
                  <circle cx="25" cy="20" r="18" fill={accentColor} fillOpacity="0.4" stroke={accentColor} strokeWidth="1" />
                  <text x="25" y="23" textAnchor="middle" fontSize="7" fill={accentColor}>信号</text>
                  <line x1="43" y1="20" x2="80" y2="20" stroke={primaryColor} strokeWidth="2" markerEnd="url(#arrowhead)" />
                  <circle cx="95" cy="20" r="18" fill={primaryColor} fillOpacity="0.4" stroke={primaryColor} strokeWidth="1" />
                  <text x="95" y="23" textAnchor="middle" fontSize="7" fill={primaryColor}>受体</text>
                </g>
                <text x="15" y="90" fontSize="8" fill={textColor}>• 环境信号刺激</text>
                <text x="15" y="110" fontSize="8" fill={textColor}>• 信号转导激活</text>
                <text x="15" y="130" fontSize="8" fill={textColor}>• 转录因子激活</text>
                <text x="15" y="150" fontSize="8" fill={textColor}>• 调控酶激活</text>
                <text x="15" y="165" fontSize="8" fill="#6B7280">• 启动表观修饰</text>
              </g>

              <g transform="translate(190, 30)">
                <rect x="0" y="0" width="150" height="180" fill={secondaryColor} fillOpacity="0.1" stroke={secondaryColor} strokeWidth="1" rx="4" />
                <text x="75" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill={secondaryColor}>修饰写入</text>
                
                <g transform="translate(15, 35)">
                  <line x1="0" y1="20" x2="120" y2="20" stroke="#6B7280" strokeWidth="2" />
                  <circle cx="30" cy="10" r="10" fill={accentColor} />
                  <text x="30" y="13" textAnchor="middle" fontSize="6" fill="white">C</text>
                  <circle cx="60" cy="10" r="10" fill={accentColor} />
                  <text x="60" y="13" textAnchor="middle" fontSize="6" fill="white">G</text>
                  <circle cx="90" cy="10" r="10" fill={accentColor} />
                  <text x="90" y="13" textAnchor="middle" fontSize="6" fill="white">A</text>
                  <circle cx="120" cy="10" r="10" fill={accentColor} />
                  <text x="120" y="13" textAnchor="middle" fontSize="6" fill="white">T</text>
                  
                  <ellipse cx="75" cy="35" rx="25" ry="12" fill={secondaryColor} fillOpacity="0.4" stroke={secondaryColor} strokeWidth="1" />
                  <text x="75" y="38" textAnchor="middle" fontSize="7" fill={secondaryColor}>写入酶</text>
                </g>
                <text x="15" y="90" fontSize="8" fill={textColor}>• DNMT甲基化DNA</text>
                <text x="15" y="110" fontSize="8" fill={textColor}>• HAT乙酰化组蛋白</text>
                <text x="15" y="130" fontSize="8" fill={textColor}>• 特定位点修饰</text>
                <text x="15" y="150" fontSize="8" fill={textColor}>• 建立表观标记</text>
                <text x="15" y="165" fontSize="8" fill="#6B7280">• 形成记忆印记</text>
              </g>

              <g transform="translate(360, 30)">
                <rect x="0" y="0" width="150" height="180" fill={dangerColor} fillOpacity="0.05" stroke={dangerColor} strokeWidth="1" rx="4" />
                <text x="75" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill={dangerColor}>染色质重塑</text>
                
                <g transform="translate(15, 35)">
                  <g>
                    <circle cx="20" cy="25" r="12" fill={dangerColor} fillOpacity="0.3" />
                    <circle cx="20" cy="25" r="6" fill={dangerColor} fillOpacity="0.5" />
                    <circle cx="50" cy="25" r="12" fill={dangerColor} fillOpacity="0.3" />
                    <circle cx="50" cy="25" r="6" fill={dangerColor} fillOpacity="0.5" />
                    <circle cx="80" cy="25" r="12" fill={dangerColor} fillOpacity="0.3" />
                    <circle cx="80" cy="25" r="6" fill={dangerColor} fillOpacity="0.5" />
                  </g>
                  <line x1="20" y1="15" x2="20" y2="5" stroke={dangerColor} strokeWidth="1" />
                  <line x1="50" y1="15" x2="50" y2="5" stroke={dangerColor} strokeWidth="1" />
                  <line x1="80" y1="15" x2="80" y2="5" stroke={dangerColor} strokeWidth="1" />
                  <ellipse cx="50" cy="50" rx="30" ry="15" fill={dangerColor} fillOpacity="0.3" stroke={dangerColor} strokeWidth="1" />
                  <text x="50" y="53" textAnchor="middle" fontSize="7" fill={dangerColor}>重塑酶</text>
                </g>
                <text x="15" y="90" fontSize="8" fill={textColor}>• ATP依赖重塑</text>
                <text x="15" y="110" fontSize="8" fill={textColor}>• 改变染色质结构</text>
                <text x="15" y="130" fontSize="8" fill={textColor}>• 稳定表观状态</text>
                <text x="15" y="150" fontSize="8" fill={textColor}>• 锁定基因状态</text>
                <text x="15" y="165" fontSize="8" fill="#6B7280">• 防止随机反转</text>
              </g>

              <g transform="translate(530, 30)">
                <rect x="0" y="0" width="150" height="180" fill={accentColor} fillOpacity="0.1" stroke={accentColor} strokeWidth="1" rx="4" />
                <text x="75" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill={accentColor}>记忆稳定</text>
                
                <g transform="translate(15, 35)">
                  <line x1="0" y1="20" x2="120" y2="20" stroke={accentColor} strokeWidth="3" />
                  <rect x="10" y="5" width="25" height="30" fill={accentColor} fillOpacity="0.6" rx="3" />
                  <rect x="45" y="5" width="25" height="30" fill={accentColor} fillOpacity="0.6" rx="3" />
                  <rect x="80" y="5" width="25" height="30" fill={accentColor} fillOpacity="0.6" rx="3" />
                  <text x="60" y="55" textAnchor="middle" fontSize="8" fill={accentColor}>稳定维持</text>
                </g>
                <text x="15" y="90" fontSize="8" fill={textColor}>• 正反馈维持</text>
                <text x="15" y="110" fontSize="8" fill={textColor}>• 保护酶结合</text>
                <text x="15" y="130" fontSize="8" fill={textColor}>• 阻止擦除酶</text>
                <text x="15" y="150" fontSize="8" fill={textColor}>• 长期稳定维持</text>
                <text x="15" y="165" fontSize="8" fill="#6B7280">• 细胞分裂传递</text>
              </g>
            </g>
          </svg>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-bold mb-2" style={{ color: primaryColor }}>记忆机制</h3>
            <ul className="text-sm space-y-1" style={{ color: textColor }}>
              <li>• 信号识别: 环境信号通过受体和信号转导通路激活表观调控酶</li>
              <li>• 修饰写入: DNMT和HAT等酶在特定位点添加DNA甲基化或组蛋白修饰</li>
              <li>• 染色质重塑: ATP依赖的染色质重塑复合物改变染色质结构</li>
              <li>• 记忆稳定: 正反馈回路和保护蛋白稳定表观状态</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'inheritance' && (
        <div>
          <svg viewBox="0 0 800 400" className="w-full h-auto mb-4">
            <rect x="50" y="50" width="700" height="300" fill="white" stroke="#E5E7EB" strokeWidth="2" rx="8" />

            <text x="400" y="80" textAnchor="middle" fontSize="16" fontWeight="bold" fill={textColor}>
              表观遗传记忆遗传
            </text>

            <g transform="translate(100, 110)">
              <g transform="translate(20, 20)">
                <rect x="0" y="0" width="180" height="180" fill={primaryColor} fillOpacity="0.05" stroke={primaryColor} strokeWidth="1" rx="4" />
                <text x="90" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill={primaryColor}>亲代细胞</text>
                
                <g transform="translate(20, 35)">
                  <line x1="0" y1="20" x2="140" y2="20" stroke="#6B7280" strokeWidth="2" />
                  <rect x="10" y="5" width="20" height="20" fill={accentColor} fillOpacity="0.6" rx="2" />
                  <rect x="40" y="5" width="20" height="20" fill={accentColor} fillOpacity="0.6" rx="2" />
                  <rect x="70" y="5" width="20" height="20" fill={accentColor} fillOpacity="0.6" rx="2" />
                  <rect x="100" y="5" width="20" height="20" fill={accentColor} fillOpacity="0.6" rx="2" />
                  <circle cx="20" cy="0" r="6" fill={dangerColor} />
                  <circle cx="50" cy="0" r="6" fill={dangerColor} />
                  <circle cx="80" cy="0" r="6" fill={dangerColor} />
                  <circle cx="110" cy="0" r="6" fill={dangerColor} />
                  <text x="70" y="50" textAnchor="middle" fontSize="8" fill={accentColor}>表观标记</text>
                </g>
                <text x="15" y="85" fontSize="8" fill={textColor}>• 稳定的DNA甲基化</text>
                <text x="15" y="105" fontSize="8" fill={textColor}>• 组蛋白修饰模式</text>
                <text x="15" y="125" fontSize="8" fill={textColor}>• 染色质结构状态</text>
                <text x="15" y="145" fontSize="8" fill={textColor}>• 表观遗传印记</text>
                <text x="15" y="160" fontSize="8" fill="#6B7280">• 准备分裂</text>
              </g>

              <g transform="translate(220, 20)">
                <rect x="0" y="0" width="160" height="180" fill={secondaryColor} fillOpacity="0.1" stroke={secondaryColor} strokeWidth="1" rx="4" />
                <text x="80" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill={secondaryColor}>DNA复制</text>
                
                <g transform="translate(15, 35)">
                  <line x1="0" y1="40" x2="130" y2="40" stroke="#6B7280" strokeWidth="2" />
                  <line x1="0" y1="0" x2="130" y2="0" stroke="#6B7280" strokeWidth="2" />
                  
                  <line x1="65" y1="0" x2="65" y2="40" stroke={secondaryColor} strokeWidth="2" />
                  
                  <rect x="25" y="-10" width="30" height="15" fill={accentColor} fillOpacity="0.6" rx="2" />
                  <rect x="25" y="35" width="30" height="15" fill={accentColor} fillOpacity="0.6" rx="2" />
                  <rect x="105" y="-10" width="30" height="15" fill={accentColor} fillOpacity="0.6" rx="2" />
                  <rect x="105" y="35" width="30" height="15" fill={accentColor} fillOpacity="0.6" rx="2" />
                  
                  <circle cx="40" cy="-18" r="5" fill={dangerColor} />
                  <circle cx="40" cy="58" r="5" fill={dangerColor} />
                  <circle cx="120" cy="-18" r="5" fill={dangerColor} />
                  <circle cx="120" cy="58" r="5" fill={dangerColor} />
                  
                  <ellipse cx="65" cy="80" rx="25" ry="12" fill={secondaryColor} fillOpacity="0.3" stroke={secondaryColor} strokeWidth="1" />
                  <text x="65" y="83" textAnchor="middle" fontSize="7" fill={secondaryColor}>DNMT1</text>
                </g>
                <text x="15" y="115" fontSize="8" fill={textColor}>• 半保留复制</text>
                <text x="15" y="135" fontSize="8" fill={textColor}>• 甲基化维持酶</text>
                <text x="15" y="155" fontSize="8" fill={textColor}>• 拷贝标记到子链</text>
              </g>

              <g transform="translate(400, 20)">
                <rect x="0" y="0" width="280" height="180" fill={accentColor} fillOpacity="0.1" stroke={accentColor} strokeWidth="1" rx="4" />
                <text x="140" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill={accentColor}>子代细胞</text>
                
                <g transform="translate(20, 35)">
                  <line x1="0" y1="20" x2="240" y2="20" stroke="#6B7280" strokeWidth="2" />
                  <rect x="10" y="5" width="25" height="20" fill={accentColor} fillOpacity="0.6" rx="2" />
                  <rect x="45" y="5" width="25" height="20" fill={accentColor} fillOpacity="0.6" rx="2" />
                  <rect x="80" y="5" width="25" height="20" fill={accentColor} fillOpacity="0.6" rx="2" />
                  <rect x="115" y="5" width="25" height="20" fill={accentColor} fillOpacity="0.6" rx="2" />
                  <rect x="150" y="5" width="25" height="20" fill={accentColor} fillOpacity="0.6" rx="2" />
                  <rect x="185" y="5" width="25" height="20" fill={accentColor} fillOpacity="0.6" rx="2" />
                  <rect x="220" y="5" width="25" height="20" fill={accentColor} fillOpacity="0.6" rx="2" />
                  
                  <circle cx="22" cy="0" r="6" fill={dangerColor} />
                  <circle cx="57" cy="0" r="6" fill={dangerColor} />
                  <circle cx="92" cy="0" r="6" fill={dangerColor} />
                  <circle cx="127" cy="0" r="6" fill={dangerColor} />
                  <circle cx="162" cy="0" r="6" fill={dangerColor} />
                  <circle cx="197" cy="0" r="6" fill={dangerColor} />
                  <circle cx="232" cy="0" r="6" fill={dangerColor} />
                  
                  <text x="120" y="50" textAnchor="middle" fontSize="8" fill={accentColor}>表观标记遗传</text>
                </g>
                <text x="15" y="85" fontSize="8" fill={textColor}>• 表观标记保持</text>
                <text x="15" y="105" fontSize="8" fill={textColor}>• 相同基因表达</text>
                <text x="15" y="125" fontSize="8" fill={textColor}>• 细胞身份维持</text>
                <text x="15" y="145" fontSize="8" fill={textColor}>• 分化状态稳定</text>
                <text x="15" y="160" fontSize="8" fill="#6B7280">• 表观记忆继承</text>
              </g>
            </g>
          </svg>

          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <h3 className="font-bold mb-2" style={{ color: secondaryColor }}>遗传过程</h3>
            <ul className="text-sm space-y-1" style={{ color: textColor }}>
              <li>• DNA复制时,表观标记通过维持酶(DNMT1)拷贝到新合成的DNA链</li>
              <li>• 组蛋白修饰通过读者-写入器机制在子代细胞中重建</li>
              <li>• 染色质结构状态通过重塑复合物在分裂后重建</li>
              <li>• 这种表观遗传记忆确保细胞在分裂后维持其分化状态</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'examples' && (
        <div>
          <svg viewBox="0 0 800 400" className="w-full h-auto mb-4">
            <rect x="50" y="50" width="700" height="300" fill="white" stroke="#E5E7EB" strokeWidth="2" rx="8" />

            <text x="400" y="80" textAnchor="middle" fontSize="16" fontWeight="bold" fill={textColor}>
              表观遗传记忆实例
            </text>

            <g transform="translate(80, 110)">
              <g transform="translate(20, 20)">
                <rect x="0" y="0" width="200" height="200" fill={primaryColor} fillOpacity="0.05" stroke={primaryColor} strokeWidth="1" rx="4" />
                <text x="100" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill={primaryColor}>亲本印记</text>
                
                <text x="10" y="50" fontSize="9" fill={textColor}>• 部分基因仅表达</text>
                <text x="10" y="70" fontSize="9" fill={textColor}>  父源或母源等位基因</text>
                <text x="10" y="95" fontSize="9" fill={textColor}>• 精子/卵子中差异</text>
                <text x="10" y="115" fontSize="9" fill={textColor}>  甲基化建立</text>
                <text x="10" y="140" fontSize="9" fill={textColor}>• 发育中维持印记</text>
                <text x="10" y="160" fontSize="9" fill={textColor}>• 失活非表达等位基因</text>
                <text x="10" y="180" fontSize="9" fill="#6B7280">• Prader-Willi综合征</text>
              </g>

              <g transform="translate(240, 20)">
                <rect x="0" y="0" width="200" height="200" fill={dangerColor} fillOpacity="0.05" stroke={dangerColor} strokeWidth="1" rx="4" />
                <text x="100" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill={dangerColor}>X染色体失活</text>
                
                <text x="10" y="50" fontSize="9" fill={textColor}>• 雌性哺乳动物</text>
                <text x="10" y="70" fontSize="9" fill={textColor}>  失活一条X染色体</text>
                <text x="10" y="95" fontSize="9" fill={textColor}>• Xist RNA介导沉默</text>
                <text x="10" y="115" fontSize="9" fill={textColor}>• 表观修饰建立</text>
                <text x="10" y="140" fontSize="9" fill={textColor}>• 所有子代细胞继承</text>
                <text x="10" y="160" fontSize="9" fill={textColor}>• 剂量补偿机制</text>
                <text x="10" y="180" fontSize="9" fill="#6B7280">• 雌性嵌合现象</text>
              </g>

              <g transform="translate(460, 20)">
                <rect x="0" y="0" width="200" height="200" fill={secondaryColor} fillOpacity="0.1" stroke={secondaryColor} strokeWidth="1" rx="4" />
                <text x="100" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill={secondaryColor}>细胞记忆</text>
                
                <text x="10" y="50" fontSize="9" fill={textColor}>• 环境暴露影响</text>
                <text x="10" y="70" fontSize="9" fill={textColor}>• 建立表观标记</text>
                <text x="10" y="95" fontSize="9" fill={textColor}>• 记忆维持数代</text>
                <text x="10" y="115" fontSize="9" fill={textColor}>• 影响后代性状</text>
                <text x="10" y="140" fontSize="9" fill={textColor}>• 荷兰饥荒研究</text>
                <text x="10" y="160" fontSize="9" fill={textColor}>• 可逆但稳定</text>
                <text x="10" y="180" fontSize="9" fill="#6B7280">• 表观遗传效应</text>
              </g>
            </g>
          </svg>

          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-bold mb-2" style={{ color: accentColor }}>生物学实例</h3>
            <ul className="text-sm space-y-1" style={{ color: textColor }}>
              <li>• 亲本印记: 基因根据亲本来源选择性表达,如IGF2基因仅父源表达</li>
              <li>• X染色体失活: 雌性哺乳动物通过表观遗传机制沉默一条X染色体</li>
              <li>• 细胞记忆: 环境暴露建立的表观标记可影响后代多代的性状</li>
              <li>• 这些实例展示了表观遗传记忆在发育和适应中的重要作用</li>
            </ul>
          </div>
        </div>
      )}
    </div>

    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <span className="font-medium" style={{ color: primaryColor }}>记忆机制:</span>
          <span className="ml-2" style={{ color: textColor }}>{memoryMechanisms.join(', ')}</span>
        </div>
        <div>
          <span className="font-medium" style={{ color: primaryColor }}>生物学实例:</span>
          <span className="ml-2" style={{ color: textColor }}>{memoryExamples.join(', ')}</span>
        </div>
        <div>
          <span className="font-medium" style={{ color: primaryColor }}>主要功能:</span>
          <span className="ml-2" style={{ color: textColor }}>{func}</span>
        </div>
      </div>
    </div>
  </div>
  );
}
