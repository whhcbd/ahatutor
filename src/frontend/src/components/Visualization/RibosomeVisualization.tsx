import { useState } from 'react';

interface RibosomeData {
  type?: string;
  subunits?: string[];
  function?: string;
  description?: string;
}

export function RibosomeVisualization({ data, colors = {} }: { data?: RibosomeData; colors?: Record<string, string> }) {
  const [activeTab, setActiveTab] = useState<'structure' | 'function' | 'types'>('structure');

  const primaryColor = colors.primary || '#3B82F6';
  const secondaryColor = colors.secondary || '#10B981';
  const accentColor = colors.accent || '#F59E0B';
  const dangerColor = colors.danger || '#EF4444';
  const backgroundColor = colors.background || '#F3F4F6';
  const textColor = colors.text || '#1F2937';

  const ribosomeType = data?.type || '真核生物80S核糖体';
  const subunits = data?.subunits || ['大亚基', '小亚基'];
  const func = data?.function || '合成蛋白质';
  const description = data?.description || '核糖体是细胞内负责蛋白质合成的细胞器,由大亚基和小亚基组成';

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-lg" style={{ backgroundColor }}>
    <h2 className="text-2xl font-bold mb-4 text-center" style={{ color: textColor }}>核糖体结构与功能</h2>
    
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
        结构组成
      </button>
      <button
        onClick={() => setActiveTab('function')}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          activeTab === 'function' ? 'text-white' : 'text-gray-600 hover:bg-gray-100'
        }`}
        style={activeTab === 'function' ? { backgroundColor: primaryColor } : {}}
      >
        翻译过程
      </button>
      <button
        onClick={() => setActiveTab('types')}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          activeTab === 'types' ? 'text-white' : 'text-gray-600 hover:bg-gray-100'
        }`}
        style={activeTab === 'types' ? { backgroundColor: primaryColor } : {}}
      >
        类型比较
      </button>
    </div>

    <div className="border rounded-lg p-6 bg-gray-50">
      {activeTab === 'structure' && (
        <div>
          <svg viewBox="0 0 800 400" className="w-full h-auto mb-4">
            <rect x="50" y="50" width="700" height="300" fill="white" stroke="#E5E7EB" strokeWidth="2" rx="8" />

            <text x="400" y="80" textAnchor="middle" fontSize="16" fontWeight="bold" fill={textColor}>
              核糖体结构 (80S)
            </text>

            <g transform="translate(150, 120)">
              <text x="250" y="0" textAnchor="middle" fontSize="14" fill={textColor}>核糖体结构</text>

              <g transform="translate(50, 30)">
                <ellipse cx="100" cy="30" rx="80" ry="25" fill={primaryColor} fillOpacity="0.4" stroke={primaryColor} strokeWidth="2" />
                <text x="100" y="35" textAnchor="middle" fontSize="11" fontWeight="bold" fill={primaryColor}>小亚基 (40S)</text>
                
                <g transform="translate(80, 60)">
                  <ellipse cx="20" cy="15" rx="15" ry="12" fill={accentColor} fillOpacity="0.4" stroke={accentColor} strokeWidth="1" />
                  <text x="20" y="18" textAnchor="middle" fontSize="8" fill={accentColor}>A位点</text>
                </g>

                <g transform="translate(130, 60)">
                  <ellipse cx="20" cy="15" rx="15" ry="12" fill={secondaryColor} fillOpacity="0.4" stroke={secondaryColor} strokeWidth="1" />
                  <text x="20" y="18" textAnchor="middle" fontSize="8" fill={secondaryColor}>P位点</text>
                </g>

                <g transform="translate(180, 60)">
                  <ellipse cx="20" cy="15" rx="15" ry="12" fill={dangerColor} fillOpacity="0.4" stroke={dangerColor} strokeWidth="1" />
                  <text x="20" y="18" textAnchor="middle" fontSize="8" fill={dangerColor}>E位点</text>
                </g>
              </g>

              <g transform="translate(50, 130)">
                <ellipse cx="100" cy="25" rx="85" ry="30" fill={secondaryColor} fillOpacity="0.4" stroke={secondaryColor} strokeWidth="2" />
                <text x="100" y="30" textAnchor="middle" fontSize="11" fontWeight="bold" fill={secondaryColor}>大亚基 (60S)</text>
                <text x="100" y="50" textAnchor="middle" fontSize="9" fill="#6B7280">肽基转移酶中心</text>
              </g>

              <g transform="translate(320, 30)">
                <rect x="0" y="0" width="220" height="180" fill={primaryColor} fillOpacity="0.05" stroke={primaryColor} strokeWidth="1" rx="4" />
                <text x="110" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill={primaryColor}>核糖体组成</text>
                
                <text x="10" y="50" fontSize="9" fill={textColor}>• rRNA: 结构和催化核心</text>
                <text x="10" y="75" fontSize="9" fill={textColor}>• 蛋白质: 辅助和调节</text>
                <text x="10" y="100" fontSize="9" fill={textColor}>• 真核: 4种rRNA + ~80种蛋白</text>
                <text x="10" y="125" fontSize="9" fill={textColor}>• 原核: 3种rRNA + ~50种蛋白</text>
                <text x="10" y="150" fontSize="9" fill="#6B7280">• 沉降系数: 80S (真核)</text>
              </g>
            </g>
          </svg>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-bold mb-2" style={{ color: primaryColor }}>结构特点</h3>
            <ul className="text-sm space-y-1" style={{ color: textColor }}>
              <li>• 由大小两个亚基组成,可分离和重新组装</li>
              <li>• 小亚基含有A、P、E三个tRNA结合位点</li>
              <li>• 大亚基含有肽基转移酶活性中心,催化肽键形成</li>
              <li>• rRNA构成核糖体的核心结构和催化功能</li>
              <li>• 蛋白质主要起辅助和调节作用</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'function' && (
        <div>
          <svg viewBox="0 0 800 400" className="w-full h-auto mb-4">
            <rect x="50" y="50" width="700" height="300" fill="white" stroke="#E5E7EB" strokeWidth="2" rx="8" />

            <text x="400" y="80" textAnchor="middle" fontSize="16" fontWeight="bold" fill={textColor}>
              翻译过程
            </text>

            <g transform="translate(80, 110)">
              <text x="320" y="0" textAnchor="middle" fontSize="14" fill={textColor}>蛋白质合成循环</text>

              <g transform="translate(20, 30)">
                <rect x="0" y="0" width="160" height="100" fill={dangerColor} fillOpacity="0.05" stroke={dangerColor} strokeWidth="1" rx="4" />
                <text x="80" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill={dangerColor}>起始</text>
                <text x="10" y="45" fontSize="8" fill={textColor}>• 小亚基结合mRNA</text>
                <text x="10" y="65" fontSize="8" fill={textColor}>• 起始tRNA结合P位点</text>
                <text x="10" y="85" fontSize="8" fill={textColor}>• 大亚基组装</text>
              </g>

              <g transform="translate(190, 30)">
                <rect x="0" y="0" width="160" height="100" fill={accentColor} fillOpacity="0.1" stroke={accentColor} strokeWidth="1" rx="4" />
                <text x="80" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill={accentColor}>延伸</text>
                <text x="10" y="45" fontSize="8" fill={textColor}>• 氨酰tRNA进入A位点</text>
                <text x="10" y="65" fontSize="8" fill={textColor}>• 肽键形成</text>
                <text x="10" y="85" fontSize="8" fill={textColor}>• 移位反应</text>
              </g>

              <g transform="translate(360, 30)">
                <rect x="0" y="0" width="160" height="100" fill={primaryColor} fillOpacity="0.05" stroke={primaryColor} strokeWidth="1" rx="4" />
                <text x="80" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill={primaryColor}>终止</text>
                <text x="10" y="45" fontSize="8" fill={textColor}>• 终止密码子进入A位点</text>
                <text x="10" y="65" fontSize="8" fill={textColor}>• 释放因子结合</text>
                <text x="10" y="85" fontSize="8" fill={textColor}>• 多肽链释放</text>
              </g>

              <g transform="translate(0, 150)">
                <rect x="0" y="0" width="520" height="110" fill={secondaryColor} fillOpacity="0.1" stroke={secondaryColor} strokeWidth="1" rx="4" />
                <text x="260" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill={secondaryColor}>tRNA位点功能</text>
                
                <g transform="translate(20, 35)">
                  <circle cx="15" cy="10" r="12" fill={accentColor} fillOpacity="0.4" stroke={accentColor} strokeWidth="1" />
                  <text x="15" y="14" textAnchor="middle" fontSize="8" fill={accentColor}>A</text>
                  <text x="35" y="14" fontSize="8" fill={textColor}>氨酰位点: 接受新tRNA</text>
                </g>
                
                <g transform="translate(180, 35)">
                  <circle cx="15" cy="10" r="12" fill={secondaryColor} fillOpacity="0.4" stroke={secondaryColor} strokeWidth="1" />
                  <text x="15" y="14" textAnchor="middle" fontSize="8" fill={secondaryColor}>P</text>
                  <text x="35" y="14" fontSize="8" fill={textColor}>肽酰位点: 携带多肽链</text>
                </g>
                
                <g transform="translate(340, 35)">
                  <circle cx="15" cy="10" r="12" fill={dangerColor} fillOpacity="0.4" stroke={dangerColor} strokeWidth="1" />
                  <text x="15" y="14" textAnchor="middle" fontSize="8" fill={dangerColor}>E</text>
                  <text x="35" y="14" fontSize="8" fill={textColor}>退出位点: tRNA离开</text>
                </g>
              </g>
            </g>
          </svg>

          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <h3 className="font-bold mb-2" style={{ color: secondaryColor }}>翻译过程</h3>
            <ul className="text-sm space-y-1" style={{ color: textColor }}>
              <li>• {func},以mRNA为模板合成蛋白质</li>
              <li>• 起始: 核糖体组装到mRNA的起始密码子</li>
              <li>• 延伸: 氨酰tRNA依次进入A位点,肽键形成,移位</li>
              <li>• 终止: 遇到终止密码子,多肽链释放,核糖体解离</li>
              <li>• 每个密码子编码一个氨基酸,连续合成多肽链</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'types' && (
        <div>
          <svg viewBox="0 0 800 400" className="w-full h-auto mb-4">
            <rect x="50" y="50" width="700" height="300" fill="white" stroke="#E5E7EB" strokeWidth="2" rx="8" />

            <text x="400" y="80" textAnchor="middle" fontSize="16" fontWeight="bold" fill={textColor}>
              真核 vs 原核核糖体
            </text>

            <g transform="translate(100, 110)">
              <g transform="translate(20, 20)">
                <rect x="0" y="0" width="280" height="200" fill={primaryColor} fillOpacity="0.05" stroke={primaryColor} strokeWidth="2" rx="4" />
                <text x="140" y="25" textAnchor="middle" fontSize="13" fontWeight="bold" fill={primaryColor}>真核生物核糖体</text>
                
                <text x="10" y="55" fontSize="10" fill={textColor}>• 沉降系数: 80S</text>
                <text x="10" y="80" fontSize="10" fill={textColor}>• 小亚基: 40S (18S rRNA + 33蛋白)</text>
                <text x="10" y="105" fontSize="10" fill={textColor}>• 大亚基: 60S (28S/5.8S/5S rRNA + 49蛋白)</text>
                <text x="10" y="130" fontSize="10" fill={textColor}>• 定位: 细胞质、线粒体、叶绿体</text>
                <text x="10" y="155" fontSize="10" fill={textColor}>• 起始: 需要10+起始因子</text>
                <text x="10" y="180" fontSize="9" fill="#6B7280">• 起始密码子: AUG (帽依赖)</text>
              </g>

              <g transform="translate(320, 20)">
                <rect x="0" y="0" width="280" height="200" fill={dangerColor} fillOpacity="0.05" stroke={dangerColor} strokeWidth="2" rx="4" />
                <text x="140" y="25" textAnchor="middle" fontSize="13" fontWeight="bold" fill={dangerColor}>原核生物核糖体</text>
                
                <text x="10" y="55" fontSize="10" fill={textColor}>• 沉降系数: 70S</text>
                <text x="10" y="80" fontSize="10" fill={textColor}>• 小亚基: 30S (16S rRNA + 21蛋白)</text>
                <text x="10" y="105" fontSize="10" fill={textColor}>• 大亚基: 50S (23S/5S rRNA + 31蛋白)</text>
                <text x="10" y="130" fontSize="10" fill={textColor}>• 定位: 细胞质</text>
                <text x="10" y="155" fontSize="10" fill={textColor}>• 起始: 需要3个起始因子</text>
                <text x="10" y="180" fontSize="9" fill="#6B7280">• 起始密码子: AUG/GUG/UUG (SD序列)</text>
              </g>
            </g>
          </svg>

          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-bold mb-2" style={{ color: accentColor }}>类型比较</h3>
            <p className="text-sm" style={{ color: textColor }}>
              真核生物和原核生物核糖体在结构、组成和翻译机制上有显著差异。
              抗生素可选择性抑制原核核糖体而不影响真核核糖体,这是抗生素治疗的基础。
            </p>
          </div>
        </div>
      )}
    </div>

    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <span className="font-medium" style={{ color: primaryColor }}>核糖体类型:</span>
          <span className="ml-2" style={{ color: textColor }}>{ribosomeType}</span>
        </div>
        <div>
          <span className="font-medium" style={{ color: primaryColor }}>亚基组成:</span>
          <span className="ml-2" style={{ color: textColor }}>{subunits.join(' + ')}</span>
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
