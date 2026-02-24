import { useState } from 'react';

interface DNARepairData {
  types?: string[];
  enzymes?: string[];
  function?: string;
  description?: string;
}

export function DNARepairVisualization({ data, colors = {} }: { data?: DNARepairData; colors?: Record<string, string> }) {
  const [activeTab, setActiveTab] = useState<'mechanisms' | 'nucleotide' | 'types'>('mechanisms');

  const primaryColor = colors.primary || '#3B82F6';
  const secondaryColor = colors.secondary || '#10B981';
  const accentColor = colors.accent || '#F59E0B';
  const dangerColor = colors.danger || '#EF4444';
  const backgroundColor = colors.background || '#F3F4F6';
  const textColor = colors.text || '#1F2937';

  const repairTypes = data?.types || ['直接修复', '切除修复', '重组修复'];
  const repairEnzymes = data?.enzymes || ['光复活酶', '糖基化酶', '连接酶'];
  const func = data?.function || '修复DNA损伤,维持基因组稳定性';
  const description = data?.description || 'DNA修复机制是细胞维持基因组完整性和稳定性的重要系统,能够识别和修复各种类型的DNA损伤';

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-lg" style={{ backgroundColor }}>
    <h2 className="text-2xl font-bold mb-4 text-center" style={{ color: textColor }}>DNA修复机制</h2>
    
    <div className="mb-6 text-center">
      <p className="text-sm" style={{ color: textColor }}>{description}</p>
    </div>

    <div className="flex gap-2 mb-6">
      <button
        onClick={() => setActiveTab('mechanisms')}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          activeTab === 'mechanisms' ? 'text-white' : 'text-gray-600 hover:bg-gray-100'
        }`}
        style={activeTab === 'mechanisms' ? { backgroundColor: primaryColor } : {}}
      >
        修复机制
      </button>
      <button
        onClick={() => setActiveTab('nucleotide')}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          activeTab === 'nucleotide' ? 'text-white' : 'text-gray-600 hover:bg-gray-100'
        }`}
        style={activeTab === 'nucleotide' ? { backgroundColor: primaryColor } : {}}
      >
        核苷酸切除修复
      </button>
      <button
        onClick={() => setActiveTab('types')}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          activeTab === 'types' ? 'text-white' : 'text-gray-600 hover:bg-gray-100'
        }`}
        style={activeTab === 'types' ? { backgroundColor: primaryColor } : {}}
      >
        修复类型
      </button>
    </div>

    <div className="border rounded-lg p-6 bg-gray-50">
      {activeTab === 'mechanisms' && (
        <div>
          <svg viewBox="0 0 800 400" className="w-full h-auto mb-4">
            <rect x="50" y="50" width="700" height="300" fill="white" stroke="#E5E7EB" strokeWidth="2" rx="8" />

            <text x="400" y="80" textAnchor="middle" fontSize="16" fontWeight="bold" fill={textColor}>
              DNA修复机制
            </text>

            <g transform="translate(80, 110)">
              <text x="320" y="0" textAnchor="middle" fontSize="14" fill={textColor}>主要修复途径</text>

              <g transform="translate(20, 30)">
                <rect x="0" y="0" width="180" height="200" fill={primaryColor} fillOpacity="0.05" stroke={primaryColor} strokeWidth="2" rx="4" />
                <text x="90" y="25" textAnchor="middle" fontSize="12" fontWeight="bold" fill={primaryColor}>直接修复</text>
                
                <text x="10" y="55" fontSize="9" fill={textColor}>• 光复活修复</text>
                <text x="10" y="75" fontSize="9" fill={textColor}>• O6-甲基鸟嘌呤修复</text>
                <text x="10" y="95" fontSize="9" fill={textColor}>• 单步骤修复</text>
                <text x="10" y="115" fontSize="9" fill={textColor}>• 不切除损伤碱基</text>
                <text x="10" y="135" fontSize="9" fill={textColor}>• 特定损伤类型</text>
                <text x="10" y="155" fontSize="9" fill={textColor}>• 速度快效率高</text>
                
                <rect x="10" y="170" width="160" height="20" fill={primaryColor} fillOpacity="0.2" rx="3" />
                <text x="90" y="184" textAnchor="middle" fontSize="8" fill={primaryColor}>光复活酶、甲基转移酶</text>
              </g>

              <g transform="translate(220, 30)">
                <rect x="0" y="0" width="180" height="200" fill={secondaryColor} fillOpacity="0.1" stroke={secondaryColor} strokeWidth="2" rx="4" />
                <text x="90" y="25" textAnchor="middle" fontSize="12" fontWeight="bold" fill={secondaryColor}>切除修复</text>
                
                <text x="10" y="55" fontSize="9" fill={textColor}>• 碱基切除修复(BER)</text>
                <text x="10" y="75" fontSize="9" fill={textColor}>• 核苷酸切除修复(NER)</text>
                <text x="10" y="95" fontSize="9" fill={textColor}>• 错配修复(MMR)</text>
                <text x="10" y="115" fontSize="9" fill={textColor}>• 切除损伤片段</text>
                <text x="10" y="135" fontSize="9" fill={textColor}>• 填补正常碱基</text>
                <text x="10" y="155" fontSize="9" fill={textColor}>• DNA聚合酶参与</text>
                
                <rect x="10" y="170" width="160" height="20" fill={secondaryColor} fillOpacity="0.2" rx="3" />
                <text x="90" y="184" textAnchor="middle" fontSize="8" fill={secondaryColor}>糖基化酶、外切酶</text>
              </g>

              <g transform="translate(420, 30)">
                <rect x="0" y="0" width="180" height="200" fill={accentColor} fillOpacity="0.1" stroke={accentColor} strokeWidth="2" rx="4" />
                <text x="90" y="25" textAnchor="middle" fontSize="12" fontWeight="bold" fill={accentColor}>重组修复</text>
                
                <text x="10" y="55" fontSize="9" fill={textColor}>• 同源重组</text>
                <text x="10" y="75" fontSize="9" fill={textColor}>• 非同源末端连接</text>
                <text x="10" y="95" fontSize="9" fill={textColor}>• 双链断裂修复</text>
                <text x="10" y="115" fontSize="9" fill={textColor}>• 严重损伤修复</text>
                <text x="10" y="135" fontSize="9" fill={textColor}>• 使用姐妹染色单体</text>
                <text x="10" y="155" fontSize="9" fill={textColor}>• RecA/RAD51蛋白</text>
                
                <rect x="10" y="170" width="160" height="20" fill={accentColor} fillOpacity="0.2" rx="3" />
                <text x="90" y="184" textAnchor="middle" fontSize="8" fill={accentColor}>RecA、RAD51、Ku70/80</text>
              </g>
            </g>
          </svg>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-bold mb-2" style={{ color: primaryColor }}>修复机制</h3>
            <ul className="text-sm space-y-1" style={{ color: textColor }}>
              <li>• 直接修复: 直接逆转损伤,如光复活酶修复嘧啶二聚体</li>
              <li>• 切除修复: 切除损伤的碱基或核苷酸,再填补正常序列</li>
              <li>• 重组修复: 利用同源DNA序列修复双链断裂等严重损伤</li>
              <li>• 不同类型的DNA损伤由不同的修复途径处理</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'nucleotide' && (
        <div>
          <svg viewBox="0 0 800 400" className="w-full h-auto mb-4">
            <rect x="50" y="50" width="700" height="300" fill="white" stroke="#E5E7EB" strokeWidth="2" rx="8" />

            <text x="400" y="80" textAnchor="middle" fontSize="16" fontWeight="bold" fill={textColor}>
              核苷酸切除修复(NER)
            </text>

            <g transform="translate(80, 110)">
              <g transform="translate(20, 20)">
                <rect x="0" y="0" width="150" height="130" fill={dangerColor} fillOpacity="0.05" stroke={dangerColor} strokeWidth="1" rx="4" />
                <text x="75" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill={dangerColor}>1. 损伤识别</text>
                
                <g transform="translate(20, 35)">
                  <line x1="0" y1="20" x2="110" y2="20" stroke="#6B7280" strokeWidth="2" />
                  <rect x="40" y="5" width="30" height="20" fill={dangerColor} fillOpacity="0.4" stroke={dangerColor} strokeWidth="1" />
                  <text x="55" y="18" textAnchor="middle" fontSize="7" fill={dangerColor}>损伤</text>
                  <ellipse cx="55" cy="0" rx="20" ry="10" fill={accentColor} fillOpacity="0.4" stroke={accentColor} strokeWidth="1" />
                  <text x="55" y="3" textAnchor="middle" fontSize="6" fill={accentColor}>识别</text>
                </g>
                <text x="10" y="85" fontSize="8" fill={textColor}>• XPC-HR23B识别</text>
                <text x="10" y="100" fontSize="8" fill={textColor}>• TFIIH复合物结合</text>
              </g>

              <g transform="translate(190, 20)">
                <rect x="0" y="0" width="150" height="130" fill={accentColor} fillOpacity="0.1" stroke={accentColor} strokeWidth="1" rx="4" />
                <text x="75" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill={accentColor}>2. 解链切除</text>
                
                <g transform="translate(20, 35)">
                  <line x1="0" y1="20" x2="110" y2="20" stroke="#6B7280" strokeWidth="2" />
                  <line x1="0" y1="10" x2="40" y2="10" stroke={secondaryColor} strokeWidth="2" />
                  <line x1="70" y1="10" x2="110" y2="10" stroke={secondaryColor} strokeWidth="2" />
                  <rect x="40" y="5" width="30" height="20" fill={dangerColor} fillOpacity="0.2" />
                  <ellipse cx="55" cy="15" rx="15" ry="12" fill={accentColor} fillOpacity="0.4" stroke={accentColor} strokeWidth="1" />
                  <text x="55" y="18" textAnchor="middle" fontSize="6" fill={accentColor}>解链</text>
                </g>
                <text x="10" y="85" fontSize="8" fill={textColor}>• DNA解链</text>
                <text x="10" y="100" fontSize="8" fill={textColor}>• 内切酶切除</text>
              </g>

              <g transform="translate(360, 20)">
                <rect x="0" y="0" width="150" height="130" fill={primaryColor} fillOpacity="0.05" stroke={primaryColor} strokeWidth="1" rx="4" />
                <text x="75" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill={primaryColor}>3. 合成连接</text>
                
                <g transform="translate(20, 35)">
                  <line x1="0" y1="20" x2="110" y2="20" stroke="#6B7280" strokeWidth="2" />
                  <rect x="0" y="15" width="50" height="10" fill={secondaryColor} fillOpacity="0.6" />
                  <rect x="60" y="15" width="50" height="10" fill={secondaryColor} fillOpacity="0.6" />
                  <ellipse cx="55" cy="0" rx="20" ry="12" fill={primaryColor} fillOpacity="0.4" stroke={primaryColor} strokeWidth="1" />
                  <text x="55" y="3" textAnchor="middle" fontSize="6" fill={primaryColor}>聚合</text>
                </g>
                <text x="10" y="85" fontSize="8" fill={textColor}>• DNA聚合酶合成</text>
                <text x="10" y="100" fontSize="8" fill={textColor}>• DNA连接酶封闭</text>
              </g>

              <g transform="translate(530, 20)">
                <rect x="0" y="0" width="150" height="130" fill={secondaryColor} fillOpacity="0.1" stroke={secondaryColor} strokeWidth="1" rx="4" />
                <text x="75" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill={secondaryColor}>修复完成</text>
                
                <g transform="translate(20, 35)">
                  <line x1="0" y1="20" x2="110" y2="20" stroke={secondaryColor} strokeWidth="3" />
                  <text x="55" y="0" textAnchor="middle" fontSize="8" fill={secondaryColor}>✓ 恢复完整</text>
                </g>
                <text x="10" y="85" fontSize="8" fill={textColor}>• DNA恢复完整</text>
                <text x="10" y="100" fontSize="8" fill={textColor}>• 基因组稳定</text>
              </g>
            </g>
          </svg>

          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <h3 className="font-bold mb-2" style={{ color: secondaryColor }}>核苷酸切除修复</h3>
            <ul className="text-sm space-y-1" style={{ color: textColor }}>
              <li>• {func},修复嘧啶二聚体、碱基加合物等大损伤</li>
              <li>• 识别复合物检测DNA损伤,解链形成修复泡</li>
              <li>• 内切酶切除包含损伤的24-32核苷酸片段</li>
              <li>• DNA聚合酶填补缺口,DNA连接酶封闭切口</li>
              <li>• NER缺陷可导致着色性干皮病等疾病</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'types' && (
        <div>
          <svg viewBox="0 0 800 400" className="w-full h-auto mb-4">
            <rect x="50" y="50" width="700" height="300" fill="white" stroke="#E5E7EB" strokeWidth="2" rx="8" />

            <text x="400" y="80" textAnchor="middle" fontSize="16" fontWeight="bold" fill={textColor}>
              DNA损伤类型与修复
            </text>

            <g transform="translate(80, 110)">
              <g transform="translate(20, 20)">
                <rect x="0" y="0" width="200" height="200" fill={dangerColor} fillOpacity="0.05" stroke={dangerColor} strokeWidth="1" rx="4" />
                <text x="100" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill={dangerColor}>紫外线损伤</text>
                
                <text x="10" y="50" fontSize="9" fill={textColor}>• 嘧啶二聚体形成</text>
                <text x="10" y="70" fontSize="9" fill={textColor}>• 阻碍DNA复制转录</text>
                <text x="10" y="95" fontSize="9" fill={textColor}>• 修复: NER</text>
                <text x="10" y="115" fontSize="9" fill={textColor}>• 光复活(直接)</text>
                <text x="10" y="135" fontSize="9" fill={textColor}>• 核苷酸切除(通用)</text>
                <text x="10" y="160" fontSize="9" fill={textColor}>• 缺陷: 着色性干皮病</text>
              </g>

              <g transform="translate(240, 20)">
                <rect x="0" y="0" width="200" height="200" fill={accentColor} fillOpacity="0.1" stroke={accentColor} strokeWidth="1" rx="4" />
                <text x="100" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill={accentColor}>碱基损伤</text>
                
                <text x="10" y="50" fontSize="9" fill={textColor}>• 脱氨、烷基化</text>
                <text x="10" y="70" fontSize="9" fill={textColor}>• 氧化损伤</text>
                <text x="10" y="95" fontSize="9" fill={textColor}>• 修复: BER</text>
                <text x="10" y="115" fontSize="9" fill={textColor}>• 糖基化酶切除</text>
                <text x="10" y="135" fontSize="9" fill={textColor}>• AP内切酶切口</text>
                <text x="10" y="160" fontSize="9" fill={textColor}>• 聚合酶连接酶修复</text>
              </g>

              <g transform="translate(460, 20)">
                <rect x="0" y="0" width="200" height="200" fill={primaryColor} fillOpacity="0.05" stroke={primaryColor} strokeWidth="1" rx="4" />
                <text x="100" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill={primaryColor}>双链断裂</text>
                
                <text x="10" y="50" fontSize="9" fill={textColor}>• 电离辐射</text>
                <text x="10" y="70" fontSize="9" fill={textColor}>• 复制叉崩溃</text>
                <text x="10" y="95" fontSize="9" fill={textColor}>• 修复: HR/NHEJ</text>
                <text x="10" y="115" fontSize="9" fill={textColor}>• 同源重组(精确)</text>
                <text x="10" y="135" fontSize="9" fill={textColor}>• 非同源连接(快速)</text>
                <text x="10" y="160" fontSize="9" fill={textColor}>• 缺陷: 癌症易感性</text>
              </g>
            </g>
          </svg>

          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-bold mb-2" style={{ color: accentColor }}>损伤类型</h3>
            <p className="text-sm" style={{ color: textColor }}>
              DNA损伤类型多样,包括紫外线引起的嘧啶二聚体、化学物质导致的碱基损伤、辐射引起的双链断裂等。
              不同类型的损伤由专门的修复途径处理,修复缺陷与多种遗传性疾病和癌症相关。
            </p>
          </div>
        </div>
      )}
    </div>

    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <span className="font-medium" style={{ color: primaryColor }}>修复类型:</span>
          <span className="ml-2" style={{ color: textColor }}>{repairTypes.join(', ')}</span>
        </div>
        <div>
          <span className="font-medium" style={{ color: primaryColor }}>关键酶:</span>
          <span className="ml-2" style={{ color: textColor }}>{repairEnzymes.join(', ')}</span>
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