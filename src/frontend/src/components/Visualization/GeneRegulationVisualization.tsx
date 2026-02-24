import { useState } from 'react';

interface GeneRegulationData {
  components?: string[];
  mechanisms?: string[];
  function?: string;
  description?: string;
}

export function GeneRegulationVisualization({ data, colors = {} }: { data?: GeneRegulationData; colors?: Record<string, string> }) {
  const [activeTab, setActiveTab] = useState<'elements' | 'factors' | 'epigenetic'>('elements');

  const primaryColor = colors.primary || '#3B82F6';
  const secondaryColor = colors.secondary || '#10B981';
  const accentColor = colors.accent || '#F59E0B';
  const dangerColor = colors.danger || '#EF4444';
  const backgroundColor = colors.background || '#F3F4F6';
  const textColor = colors.text || '#1F2937';

  const regulationComponents = data?.components || ['顺式作用元件', '反式作用因子', '表观遗传修饰'];
  const regulationMechanisms = data?.mechanisms || ['转录激活', '转录抑制', '增强子作用'];
  const func = data?.function || '精确控制基因表达的时间和空间';
  const description = data?.description || '真核生物基因调控是一个复杂的多层次系统,确保基因在正确的时间和地点表达';

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-lg" style={{ backgroundColor }}>
    <h2 className="text-2xl font-bold mb-4 text-center" style={{ color: textColor }}>真核生物基因调控</h2>
    
    <div className="mb-6 text-center">
      <p className="text-sm" style={{ color: textColor }}>{description}</p>
    </div>

    <div className="flex gap-2 mb-6">
      <button
        onClick={() => setActiveTab('elements')}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          activeTab === 'elements' ? 'text-white' : 'text-gray-600 hover:bg-gray-100'
        }`}
        style={activeTab === 'elements' ? { backgroundColor: primaryColor } : {}}
      >
        顺式作用元件
      </button>
      <button
        onClick={() => setActiveTab('factors')}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          activeTab === 'factors' ? 'text-white' : 'text-gray-600 hover:bg-gray-100'
        }`}
        style={activeTab === 'factors' ? { backgroundColor: primaryColor } : {}}
      >
        反式作用因子
      </button>
      <button
        onClick={() => setActiveTab('epigenetic')}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          activeTab === 'epigenetic' ? 'text-white' : 'text-gray-600 hover:bg-gray-100'
        }`}
        style={activeTab === 'epigenetic' ? { backgroundColor: primaryColor } : {}}
      >
        表观遗传调控
      </button>
    </div>

    <div className="border rounded-lg p-6 bg-gray-50">
      {activeTab === 'elements' && (
        <div>
          <svg viewBox="0 0 800 400" className="w-full h-auto mb-4">
            <rect x="50" y="50" width="700" height="300" fill="white" stroke="#E5E7EB" strokeWidth="2" rx="8" />

            <text x="400" y="80" textAnchor="middle" fontSize="16" fontWeight="bold" fill={textColor}>
              顺式作用元件
            </text>

            <g transform="translate(80, 110)">
              <text x="320" y="0" textAnchor="middle" fontSize="14" fill={textColor}>基因调控元件</text>

              <g transform="translate(50, 30)">
                <line x1="0" y1="60" x2="540" y2="60" stroke="#6B7280" strokeWidth="3" />
                <text x="270" y="85" textAnchor="middle" fontSize="10" fill="#6B7280">DNA双链</text>

                <g>
                  <rect x="20" y="35" width="100" height="30" fill={accentColor} fillOpacity="0.3" stroke={accentColor} strokeWidth="2" rx="3" />
                  <text x="70" y="55" textAnchor="middle" fontSize="10" fontWeight="bold" fill={accentColor}>增强子</text>
                  <text x="70" y="100" textAnchor="middle" fontSize="8" fill={accentColor}>增强转录</text>
                </g>

                <g>
                  <rect x="140" y="35" width="80" height="30" fill={primaryColor} fillOpacity="0.3" stroke={primaryColor} strokeWidth="2" rx="3" />
                  <text x="180" y="55" textAnchor="middle" fontSize="10" fontWeight="bold" fill={primaryColor}>启动子</text>
                  <text x="180" y="100" textAnchor="middle" fontSize="8" fill={primaryColor}>起始位点</text>
                </g>

                <g>
                  <rect x="240" y="35" width="80" height="30" fill={dangerColor} fillOpacity="0.3" stroke={dangerColor} strokeWidth="2" rx="3" />
                  <text x="280" y="55" textAnchor="middle" fontSize="10" fontWeight="bold" fill={dangerColor}>沉默子</text>
                  <text x="280" y="100" textAnchor="middle" fontSize="8" fill={dangerColor}>抑制转录</text>
                </g>

                <g>
                  <rect x="340" y="35" width="100" height="30" fill={secondaryColor} fillOpacity="0.3" stroke={secondaryColor} strokeWidth="2" rx="3" />
                  <text x="390" y="55" textAnchor="middle" fontSize="10" fontWeight="bold" fill={secondaryColor}>绝缘子</text>
                  <text x="390" y="100" textAnchor="middle" fontSize="8" fill={secondaryColor}>阻隔增强子</text>
                </g>

                <g>
                  <rect x="460" y="35" width="60" height="30" fill={primaryColor} fillOpacity="0.4" stroke={primaryColor} strokeWidth="2" rx="3" />
                  <text x="490" y="55" textAnchor="middle" fontSize="10" fontWeight="bold" fill={primaryColor}>基因</text>
                  <text x="490" y="100" textAnchor="middle" fontSize="8" fill={primaryColor}>编码序列</text>
                </g>

                <g transform="translate(70, 120)">
                  <ellipse cx="0" cy="15" rx="30" ry="15" fill={accentColor} fillOpacity="0.4" stroke={accentColor} strokeWidth="1" />
                  <text x="0" y="18" textAnchor="middle" fontSize="7" fill={accentColor}>激活因子</text>
                  <line x1="0" y1="0" x2="0" y2="-45" stroke={accentColor} strokeWidth="1" strokeDasharray="3,2" />
                </g>

                <g transform="translate(180, 120)">
                  <ellipse cx="0" cy="15" rx="25" ry="12" fill={primaryColor} fillOpacity="0.4" stroke={primaryColor} strokeWidth="1" />
                  <text x="0" y="18" textAnchor="middle" fontSize="7" fill={primaryColor}>通用因子</text>
                  <line x1="0" y1="0" x2="0" y2="-45" stroke={primaryColor} strokeWidth="1" strokeDasharray="3,2" />
                </g>

                <g transform="translate(280, 120)">
                  <ellipse cx="0" cy="15" rx="25" ry="12" fill={dangerColor} fillOpacity="0.4" stroke={dangerColor} strokeWidth="1" />
                  <text x="0" y="18" textAnchor="middle" fontSize="7" fill={dangerColor}>抑制因子</text>
                  <line x1="0" y1="0" x2="0" y2="-45" stroke={dangerColor} strokeWidth="1" strokeDasharray="3,2" />
                </g>
              </g>
            </g>
          </svg>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-bold mb-2" style={{ color: primaryColor }}>顺式作用元件</h3>
            <ul className="text-sm space-y-1" style={{ color: textColor }}>
              <li>• 增强子: 远距离增强基因转录,可位于基因上游或下游</li>
              <li>• 启动子: 位于转录起始点附近,是RNA聚合酶结合位点</li>
              <li>• 沉默子: 抑制基因转录的DNA序列</li>
              <li>• 绝缘子: 阻断增强子对基因的激活作用</li>
              <li>• 这些元件通过结合转录因子来调控基因表达</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'factors' && (
        <div>
          <svg viewBox="0 0 800 400" className="w-full h-auto mb-4">
            <rect x="50" y="50" width="700" height="300" fill="white" stroke="#E5E7EB" strokeWidth="2" rx="8" />

            <text x="400" y="80" textAnchor="middle" fontSize="16" fontWeight="bold" fill={textColor}>
              反式作用因子
            </text>

            <g transform="translate(80, 110)">
              <text x="320" y="0" textAnchor="middle" fontSize="14" fill={textColor}>转录因子类型</text>

              <g transform="translate(20, 30)">
                <rect x="0" y="0" width="200" height="200" fill={primaryColor} fillOpacity="0.05" stroke={primaryColor} strokeWidth="1" rx="4" />
                <text x="100" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill={primaryColor}>通用转录因子</text>
                
                <text x="10" y="50" fontSize="9" fill={textColor}>• TFIIA、TFIIB</text>
                <text x="10" y="70" fontSize="9" fill={textColor}>• TFIID (TBP+TAFs)</text>
                <text x="10" y="90" fontSize="9" fill={textColor}>• TFIIE、TFIIF</text>
                <text x="10" y="110" fontSize="9" fill={textColor}>• TFIIH (激酶活性)</text>
                <text x="10" y="130" fontSize="9" fill={textColor}>• 组成转录起始复合物</text>
                <text x="10" y="150" fontSize="9" fill={textColor}>• 基本转录必需</text>
                <text x="10" y="170" fontSize="9" fill="#6B7280">• 结合TATA框</text>
              </g>

              <g transform="translate(240, 30)">
                <rect x="0" y="0" width="200" height="200" fill={accentColor} fillOpacity="0.1" stroke={accentColor} strokeWidth="1" rx="4" />
                <text x="100" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill={accentColor}>特异性转录因子</text>
                
                <text x="10" y="50" fontSize="9" fill={textColor}>• 激活因子</text>
                <text x="10" y="70" fontSize="9" fill={textColor}>• 抑制因子</text>
                <text x="10" y="90" fontSize="9" fill={textColor}>• 结合增强子/沉默子</text>
                <text x="10" y="110" fontSize="9" fill={textColor}>• 含DNA结合结构域</text>
                <text x="10" y="130" fontSize="9" fill={textColor}>• 含转录激活域</text>
                <text x="10" y="150" fontSize="9" fill={textColor}>• 响应细胞信号</text>
                <text x="10" y="170" fontSize="9" fill="#6B7280">• 组织/发育特异性</text>
              </g>

              <g transform="translate(460, 30)">
                <rect x="0" y="0" width="200" height="200" fill={secondaryColor} fillOpacity="0.1" stroke={secondaryColor} strokeWidth="1" rx="4" />
                <text x="100" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill={secondaryColor}>中介因子</text>
                
                <text x="10" y="50" fontSize="9" fill={textColor}>• Mediator复合物</text>
                <text x="10" y="70" fontSize="9" fill={textColor}>• ~30种蛋白质</text>
                <text x="10" y="90" fontSize="9" fill={textColor}>• 连接特异性因子</text>
                <text x="10" y="110" fontSize="9" fill={textColor}>• 传递激活信号</text>
                <text x="10" y="130" fontSize="9" fill={textColor}>• 调节RNA聚合酶</text>
                <text x="10" y="150" fontSize="9" fill={textColor}>• 整合调控信息</text>
                <text x="10" y="170" fontSize="9" fill="#6B7280">• 必需调控因子</text>
              </g>
            </g>
          </svg>

          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-bold mb-2" style={{ color: accentColor }}>转录因子</h3>
            <ul className="text-sm space-y-1" style={{ color: textColor }}>
              <li>• 通用转录因子: 组成转录起始复合物,是基础转录必需的</li>
              <li>• 特异性转录因子: 响应细胞内外信号,结合调控元件激活或抑制转录</li>
              <li>• 中介因子: 作为桥梁,连接特异性转录因子和通用转录装置</li>
              <li>• 转录因子通过结构域识别DNA序列或与其他蛋白相互作用</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'epigenetic' && (
        <div>
          <svg viewBox="0 0 800 400" className="w-full h-auto mb-4">
            <rect x="50" y="50" width="700" height="300" fill="white" stroke="#E5E7EB" strokeWidth="2" rx="8" />

            <text x="400" y="80" textAnchor="middle" fontSize="16" fontWeight="bold" fill={textColor}>
              表观遗传调控
            </text>

            <g transform="translate(80, 110)">
              <g transform="translate(20, 20)">
                <rect x="0" y="0" width="180" height="200" fill={primaryColor} fillOpacity="0.05" stroke={primaryColor} strokeWidth="1" rx="4" />
                <text x="90" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill={primaryColor}>DNA甲基化</text>
                
                <text x="10" y="50" fontSize="9" fill={textColor}>• CpG岛甲基化</text>
                <text x="10" y="70" fontSize="9" fill={textColor}>• 通常抑制转录</text>
                <text x="10" y="90" fontSize="9" fill={textColor}>• DNMT酶催化</text>
                <text x="10" y="110" fontSize="9" fill={textColor}>• 可遗传</text>
                <text x="10" y="130" fontSize="9" fill={textColor}>• 稳定基因沉默</text>
                <text x="10" y="150" fontSize="9" fill={textColor}>• 亲本印记</text>
                <text x="10" y="170" fontSize="9" fill="#6B7280">• X染色体失活</text>
              </g>

              <g transform="translate(220, 20)">
                <rect x="0" y="0" width="180" height="200" fill={accentColor} fillOpacity="0.1" stroke={accentColor} strokeWidth="1" rx="4" />
                <text x="90" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill={accentColor}>组蛋白修饰</text>
                
                <text x="10" y="50" fontSize="9" fill={textColor}>• 乙酰化: 激活</text>
                <text x="10" y="70" fontSize="9" fill={textColor}>• 甲基化: 双向</text>
                <text x="10" y="90" fontSize="9" fill={textColor}>• 磷酸化: 激活</text>
                <text x="10" y="110" fontSize="9" fill={textColor}>• 泛素化: 抑制</text>
                <text x="10" y="130" fontSize="9" fill={textColor}>• HAT/HDAC酶</text>
                <text x="10" y="150" fontSize="9" fill={textColor}>• 染色质重塑</text>
                <text x="10" y="170" fontSize="9" fill="#6B7280">• 组蛋白密码</text>
              </g>

              <g transform="translate(420, 20)">
                <rect x="0" y="0" width="180" height="200" fill={secondaryColor} fillOpacity="0.1" stroke={secondaryColor} strokeWidth="1" rx="4" />
                <text x="90" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill={secondaryColor}>非编码RNA</text>
                
                <text x="10" y="50" fontSize="9" fill={textColor}>• miRNA: 抑制翻译</text>
                <text x="10" y="70" fontSize="9" fill={textColor}>• siRNA: 沉默转录</text>
                <text x="10" y="90" fontSize="9" fill={textColor}>• lncRNA: 多功能</text>
                <text x="10" y="110" fontSize="9" fill={textColor}>• 引导染色质修饰</text>
                <text x="10" y="130" fontSize="9" fill={textColor}>• 转录后调控</text>
                <text x="10" y="150" fontSize="9" fill={textColor}>• 细胞特异性</text>
                <text x="10" y="170" fontSize="9" fill="#6B7280">• 发育调控</text>
              </g>
            </g>
          </svg>

          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <h3 className="font-bold mb-2" style={{ color: secondaryColor }}>表观遗传调控</h3>
            <ul className="text-sm space-y-1" style={{ color: textColor }}>
              <li>• {func},不改变DNA序列的调控方式</li>
              <li>• DNA甲基化: 通常抑制基因转录,与基因沉默相关</li>
              <li>• 组蛋白修饰: 乙酰化、甲基化等修饰影响染色质结构和基因表达</li>
              <li>• 非编码RNA: miRNA、siRNA、lncRNA等在转录和转录后水平调控基因</li>
              <li>• 表观遗传调控具有可逆性和可遗传性</li>
            </ul>
          </div>
        </div>
      )}
    </div>

    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <span className="font-medium" style={{ color: primaryColor }}>调控元件:</span>
          <span className="ml-2" style={{ color: textColor }}>{regulationComponents.join(', ')}</span>
        </div>
        <div>
          <span className="font-medium" style={{ color: primaryColor }}>调控机制:</span>
          <span className="ml-2" style={{ color: textColor }}>{regulationMechanisms.join(', ')}</span>
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
