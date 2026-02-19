import { useState } from 'react';
import { VisualizationColors } from '../../constants/visualization-colors';

interface DNAMethylationVisualizationProps {
  data: any;
  colors?: Record<string, string>;
}

export function DNAMethylationVisualization({ data, colors }: DNAMethylationVisualizationProps) {
  const [activeTab, setActiveTab] = useState<'mechanism' | 'effects' | 'inheritance'>('mechanism');

  const defaultColors = {
    unmethylated: colors?.unmethylated || VisualizationColors.dominant,
    methylated: colors?.methylated || VisualizationColors.affected,
    methyl: colors?.methyl || VisualizationColors.hover,
    dna: colors?.dna || VisualizationColors.gene,
    enzyme: colors?.enzyme || VisualizationColors.nodePrinciple,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('mechanism')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'mechanism'
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          甲基化机制
        </button>
        <button
          onClick={() => setActiveTab('effects')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'effects'
              ? 'bg-green-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          生物学效应
        </button>
        <button
          onClick={() => setActiveTab('inheritance')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'inheritance'
              ? 'bg-purple-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          遗传与重编程
        </button>
      </div>

      {activeTab === 'mechanism' && (
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-blue-800">DNA甲基化机制</h3>
          
          <div className="flex justify-center">
            <svg width="600" height="400" viewBox="0 0 600 400">
              <defs>
                <marker id="arrow-blue" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L9,3 z" fill="#3B82F6"/>
                </marker>
              </defs>

              <text x="300" y="25" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1976D2">DNA甲基化过程示意图</text>

              <g transform="translate(50, 50)">
                <text x="100" y="15" textAnchor="middle" fontSize="12" fill="#666">步骤1：DNA结构</text>
                
                <g transform="translate(30, 30)">
                  <g transform="translate(0, 0)">
                    <rect x="0" y="0" width="20" height="50" fill={defaultColors.unmethylated} fillOpacity="0.3" stroke={defaultColors.unmethylated} strokeWidth="2" rx="4"/>
                    <text x="10" y="30" textAnchor="middle" fontSize="10" fill="#065F46">C</text>
                  </g>
                  <g transform="translate(25, 0)">
                    <rect x="0" y="0" width="20" height="50" fill={defaultColors.unmethylated} fillOpacity="0.3" stroke={defaultColors.unmethylated} strokeWidth="2" rx="4"/>
                    <text x="10" y="30" textAnchor="middle" fontSize="10" fill="#065F46">C</text>
                  </g>
                  <g transform="translate(50, 0)">
                    <rect x="0" y="0" width="20" height="50" fill={defaultColors.unmethylated} fillOpacity="0.3" stroke={defaultColors.unmethylated} strokeWidth="2" rx="4"/>
                    <text x="10" y="30" textAnchor="middle" fontSize="10" fill="#065F46">G</text>
                  </g>
                  <g transform="translate(75, 0)">
                    <rect x="0" y="0" width="20" height="50" fill={defaultColors.unmethylated} fillOpacity="0.3" stroke={defaultColors.unmethylated} strokeWidth="2" rx="4"/>
                    <text x="10" y="30" textAnchor="middle" fontSize="10" fill="#065F46">G</text>
                  </g>
                  <text x="57" y="70" textAnchor="middle" fontSize="10" fill={defaultColors.unmethylated}>未甲基化</text>
                </g>
              </g>

              <path d="M175,100 L225,100" stroke="#3B82F6" strokeWidth="3" markerEnd="url(#arrow-blue)"/>
              <text x="200" y="90" textAnchor="middle" fontSize="10" fill="#3B82F6">SAM</text>

              <g transform="translate(250, 50)">
                <text x="100" y="15" textAnchor="middle" fontSize="12" fill="#666">步骤2：甲基化酶作用</text>
                
                <g transform="translate(30, 30)">
                  <g transform="translate(0, 0)">
                    <rect x="0" y="0" width="20" height="50" fill={defaultColors.methylated} fillOpacity="0.3" stroke={defaultColors.methylated} strokeWidth="2" rx="4"/>
                    <text x="10" y="30" textAnchor="middle" fontSize="10" fill="#DC2626">C</text>
                    <circle cx="10" cy="5" r="6" fill={defaultColors.methyl} fillOpacity="0.8"/>
                    <text x="10" y="8" textAnchor="middle" fontSize="8" fill="#FFF">CH3</text>
                  </g>
                  <g transform="translate(25, 0)">
                    <rect x="0" y="0" width="20" height="50" fill={defaultColors.unmethylated} fillOpacity="0.3" stroke={defaultColors.unmethylated} strokeWidth="2" rx="4"/>
                    <text x="10" y="30" textAnchor="middle" fontSize="10" fill="#065F46">C</text>
                  </g>
                  <g transform="translate(50, 0)">
                    <rect x="0" y="0" width="20" height="50" fill={defaultColors.unmethylated} fillOpacity="0.3" stroke={defaultColors.unmethylated} strokeWidth="2" rx="4"/>
                    <text x="10" y="30" textAnchor="middle" fontSize="10" fill="#065F46">G</text>
                  </g>
                  <g transform="translate(75, 0)">
                    <rect x="0" y="0" width="20" height="50" fill={defaultColors.unmethylated} fillOpacity="0.3" stroke={defaultColors.unmethylated} strokeWidth="2" rx="4"/>
                    <text x="10" y="30" textAnchor="middle" fontSize="10" fill="#065F46">G</text>
                  </g>
                  
                  <ellipse cx="10" cy="-15" rx="20" ry="15" fill={defaultColors.enzyme} fillOpacity="0.4" stroke={defaultColors.enzyme} strokeWidth="2"/>
                  <text x="10" y="-12" textAnchor="middle" fontSize="8" fill="#6D28D9">DNMT</text>
                  
                  <text x="57" y="70" textAnchor="middle" fontSize="10" fill={defaultColors.methylated}>部分甲基化</text>
                </g>
              </g>

              <path d="M375,100 L425,100" stroke="#3B82F6" strokeWidth="3" markerEnd="url(#arrow-blue)"/>

              <g transform="translate(450, 50)">
                <text x="50" y="15" textAnchor="middle" fontSize="12" fill="#666">步骤3：完全甲基化</text>
                
                <g transform="translate(30, 30)">
                  <g transform="translate(0, 0)">
                    <rect x="0" y="0" width="20" height="50" fill={defaultColors.methylated} fillOpacity="0.3" stroke={defaultColors.methylated} strokeWidth="2" rx="4"/>
                    <text x="10" y="30" textAnchor="middle" fontSize="10" fill="#DC2626">C</text>
                    <circle cx="10" cy="5" r="6" fill={defaultColors.methyl} fillOpacity="0.8"/>
                    <text x="10" y="8" textAnchor="middle" fontSize="8" fill="#FFF">CH3</text>
                  </g>
                  <g transform="translate(25, 0)">
                    <rect x="0" y="0" width="20" height="50" fill={defaultColors.methylated} fillOpacity="0.3" stroke={defaultColors.methylated} strokeWidth="2" rx="4"/>
                    <text x="10" y="30" textAnchor="middle" fontSize="10" fill="#DC2626">C</text>
                    <circle cx="10" cy="5" r="6" fill={defaultColors.methyl} fillOpacity="0.8"/>
                    <text x="10" y="8" textAnchor="middle" fontSize="8" fill="#FFF">CH3</text>
                  </g>
                  <g transform="translate(50, 0)">
                    <rect x="0" y="0" width="20" height="50" fill={defaultColors.methylated} fillOpacity="0.3" stroke={defaultColors.methylated} strokeWidth="2" rx="4"/>
                    <text x="10" y="30" textAnchor="middle" fontSize="10" fill="#DC2626">G</text>
                    <circle cx="10" cy="5" r="6" fill={defaultColors.methyl} fillOpacity="0.8"/>
                    <text x="10" y="8" textAnchor="middle" fontSize="8" fill="#FFF">CH3</text>
                  </g>
                  <g transform="translate(75, 0)">
                    <rect x="0" y="0" width="20" height="50" fill={defaultColors.methylated} fillOpacity="0.3" stroke={defaultColors.methylated} strokeWidth="2" rx="4"/>
                    <text x="10" y="30" textAnchor="middle" fontSize="10" fill="#DC2626">G</text>
                    <circle cx="10" cy="5" r="6" fill={defaultColors.methyl} fillOpacity="0.8"/>
                    <text x="10" y="8" textAnchor="middle" fontSize="8" fill="#FFF">CH3</text>
                  </g>
                  <text x="57" y="70" textAnchor="middle" fontSize="10" fill={defaultColors.methylated}>完全甲基化</text>
                </g>
              </g>

              <g transform="translate(50, 180)">
                <rect x="0" y="0" width="500" height="180" fill="white" stroke={defaultColors.methylated} strokeWidth="2" rx="8"/>
                
                <text x="250" y="25" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#DC2626">CpG位点与甲基化</text>
                
                <g transform="translate(20, 40)">
                  <rect x="0" y="0" width="220" height="120" fill="#FEF2F2" stroke="#EF4444" strokeWidth="1" rx="4"/>
                  <text x="110" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#DC2626">CpG二核苷酸</text>
                  <text x="110" y="45" textAnchor="middle" fontSize="9" fill="#666">5'-CG-3'</text>
                  <text x="110" y="60" textAnchor="middle" fontSize="9" fill="#666">3'-GC-5'</text>
                  <text x="110" y="80" textAnchor="middle" fontSize="9" fill="#666">• 胞嘧啶C是甲基化</text>
                  <text x="110" y="95" textAnchor="middle" fontSize="9" fill="#666">  的主要位点</text>
                  <text x="110" y="110" textAnchor="middle" fontSize="9" fill="#666">• 常出现在基因启动子</text>
                </g>
                
                <g transform="translate(260, 40)">
                  <rect x="0" y="0" width="220" height="120" fill="#FEF2F2" stroke="#EF4444" strokeWidth="1" rx="4"/>
                  <text x="110" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#DC2626">甲基转移酶（DNMT）</text>
                  <text x="110" y="45" textAnchor="middle" fontSize="9" fill="#666">• DNMT1：维持甲基化</text>
                  <text x="110" y="60" textAnchor="middle" fontSize="9" fill="#666">• DNMT3a/b：从头甲基化</text>
                  <text x="110" y="75" textAnchor="middle" fontSize="9" fill="#666">• 使用SAM作为甲基供体</text>
                  <text x="110" y="90" textAnchor="middle" fontSize="9" fill="#666">• 形成稳定的甲基化模式</text>
                  <text x="110" y="105" textAnchor="middle" fontSize="9" fill="#666">  并可遗传给子细胞</text>
                </g>
              </g>
            </svg>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-3">甲基化特点</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>CpG位点：</strong>胞嘧啶-鸟嘌呤二核苷酸是主要甲基化位点</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>表观遗传标记：</strong>不改变DNA序列但影响基因表达</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>可逆性：</strong>可被去甲基化酶（TET）逆转</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>稳定性：</strong>可通过细胞分裂遗传给子代</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'effects' && (
        <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-green-800">DNA甲基化的生物学效应</h3>
          
          <div className="flex justify-center">
            <svg width="600" height="350" viewBox="0 0 600 350">
              <text x="300" y="25" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1976D2">甲基化对基因表达的影响</text>

              <g transform="translate(50, 50)">
                <rect x="0" y="0" width="240" height="250" fill="white" stroke={defaultColors.unmethylated} strokeWidth="2" rx="8"/>
                
                <text x="120" y="25" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#065F46">未甲基化</text>
                
                <g transform="translate(20, 40)">
                  <rect x="0" y="0" width="200" height="40" fill="#E0F2FE" stroke="#3B82F6" strokeWidth="1" rx="4"/>
                  <text x="100" y="25" textAnchor="middle" fontSize="10" fill="#1976D2">启动子区域</text>
                </g>
                
                <g transform="translate(20, 90)">
                  <g transform="translate(0, 0)">
                    <rect x="0" y="0" width="15" height="30" fill={defaultColors.unmethylated} fillOpacity="0.3" stroke={defaultColors.unmethylated} strokeWidth="1" rx="3"/>
                  </g>
                  <g transform="translate(20, 0)">
                    <rect x="0" y="0" width="15" height="30" fill={defaultColors.unmethylated} fillOpacity="0.3" stroke={defaultColors.unmethylated} strokeWidth="1" rx="3"/>
                  </g>
                  <g transform="translate(40, 0)">
                    <rect x="0" y="0" width="15" height="30" fill={defaultColors.unmethylated} fillOpacity="0.3" stroke={defaultColors.unmethylated} strokeWidth="1" rx="3"/>
                  </g>
                  <g transform="translate(60, 0)">
                    <rect x="0" y="0" width="15" height="30" fill={defaultColors.unmethylated} fillOpacity="0.3" stroke={defaultColors.unmethylated} strokeWidth="1" rx="3"/>
                  </g>
                  <g transform="translate(80, 0)">
                    <rect x="0" y="0" width="15" height="30" fill={defaultColors.unmethylated} fillOpacity="0.3" stroke={defaultColors.unmethylated} strokeWidth="1" rx="3"/>
                  </g>
                </g>
                
                <g transform="translate(20, 130)">
                  <ellipse cx="50" cy="20" rx="35" ry="18" fill="#3B82F6" fillOpacity="0.4" stroke="#3B82F6" strokeWidth="2"/>
                  <text x="50" y="24" textAnchor="middle" fontSize="9" fill="#1D4ED8">转录因子</text>
                  <text x="50" y="35" textAnchor="middle" fontSize="8" fill="#1D4ED8">结合</text>
                </g>
                
                <g transform="translate(20, 170)">
                  <rect x="0" y="0" width="200" height="25" fill="#BBF7D0" stroke="#10B981" strokeWidth="1" rx="4"/>
                  <text x="100" y="17" textAnchor="middle" fontSize="10" fill="#065F46">基因表达：活跃</text>
                </g>
                
                <g transform="translate(20, 205)">
                  <text x="100" y="15" textAnchor="middle" fontSize="9" fill="#666">→ mRNA产生</text>
                  <text x="100" y="30" textAnchor="middle" fontSize="9" fill="#666">→ 蛋白质合成</text>
                </g>
              </g>

              <g transform="translate(310, 50)">
                <rect x="0" y="0" width="240" height="250" fill="white" stroke={defaultColors.methylated} strokeWidth="2" rx="8"/>
                
                <text x="120" y="25" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#DC2626">甲基化</text>
                
                <g transform="translate(20, 40)">
                  <rect x="0" y="0" width="200" height="40" fill="#FEE2E2" stroke="#EF4444" strokeWidth="1" rx="4"/>
                  <text x="100" y="25" textAnchor="middle" fontSize="10" fill="#DC2626">启动子区域</text>
                </g>
                
                <g transform="translate(20, 90)">
                  <g transform="translate(0, 0)">
                    <rect x="0" y="0" width="15" height="30" fill={defaultColors.methylated} fillOpacity="0.3" stroke={defaultColors.methylated} strokeWidth="1" rx="3"/>
                    <circle cx="7" cy="-5" r="5" fill={defaultColors.methyl} fillOpacity="0.8"/>
                  </g>
                  <g transform="translate(20, 0)">
                    <rect x="0" y="0" width="15" height="30" fill={defaultColors.methylated} fillOpacity="0.3" stroke={defaultColors.methylated} strokeWidth="1" rx="3"/>
                    <circle cx="7" cy="-5" r="5" fill={defaultColors.methyl} fillOpacity="0.8"/>
                  </g>
                  <g transform="translate(40, 0)">
                    <rect x="0" y="0" width="15" height="30" fill={defaultColors.methylated} fillOpacity="0.3" stroke={defaultColors.methylated} strokeWidth="1" rx="3"/>
                    <circle cx="7" cy="-5" r="5" fill={defaultColors.methyl} fillOpacity="0.8"/>
                  </g>
                  <g transform="translate(60, 0)">
                    <rect x="0" y="0" width="15" height="30" fill={defaultColors.methylated} fillOpacity="0.3" stroke={defaultColors.methylated} strokeWidth="1" rx="3"/>
                    <circle cx="7" cy="-5" r="5" fill={defaultColors.methyl} fillOpacity="0.8"/>
                  </g>
                  <g transform="translate(80, 0)">
                    <rect x="0" y="0" width="15" height="30" fill={defaultColors.methylated} fillOpacity="0.3" stroke={defaultColors.methylated} strokeWidth="1" rx="3"/>
                    <circle cx="7" cy="-5" r="5" fill={defaultColors.methyl} fillOpacity="0.8"/>
                  </g>
                </g>
                
                <g transform="translate(20, 130)">
                  <ellipse cx="50" cy="20" rx="35" ry="18" fill="#EF4444" fillOpacity="0.2" stroke="#EF4444" strokeWidth="2" strokeDasharray="4,2"/>
                  <text x="50" y="18" textAnchor="middle" fontSize="8" fill="#DC2626">转录因子</text>
                  <text x="50" y="28" textAnchor="middle" fontSize="8" fill="#DC2626">被阻断</text>
                  <path d="M30,5 L50,-5 L70,5" stroke="#EF4444" strokeWidth="2" fill="none"/>
                </g>
                
                <g transform="translate(20, 170)">
                  <rect x="0" y="0" width="200" height="25" fill="#FECACA" stroke="#EF4444" strokeWidth="1" rx="4"/>
                  <text x="100" y="17" textAnchor="middle" fontSize="10" fill="#DC2626">基因表达：沉默</text>
                </g>
                
                <g transform="translate(20, 205)">
                  <text x="100" y="15" textAnchor="middle" fontSize="9" fill="#666">→ 无mRNA</text>
                  <text x="100" y="30" textAnchor="middle" fontSize="9" fill="#666">→ 无蛋白质</text>
                </g>
              </g>
            </svg>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-3">生物学效应</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium text-gray-800 mb-2">正常生理功能</h5>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• 基因印记</li>
                  <li>• X染色体失活</li>
                  <li>• 细胞分化</li>
                  <li>• 基因组稳定性</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-gray-800 mb-2">异常病理效应</h5>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• 癌症发生</li>
                  <li>• 遗传疾病</li>
                  <li>• 衰老相关</li>
                  <li>• 神经精神疾病</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'inheritance' && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-purple-800">甲基化的遗传与重编程</h3>
          
          <div className="flex justify-center">
            <svg width="600" height="400" viewBox="0 0 600 400">
              <text x="300" y="25" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1976D2">甲基化的遗传与重编程</text>

              <g transform="translate(50, 50)">
                <rect x="0" y="0" width="120" height="100" fill="white" stroke={defaultColors.methylated} strokeWidth="2" rx="4"/>
                <text x="60" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#6D28D9">亲代细胞</text>
                <g transform="translate(20, 35)">
                  <rect x="0" y="0" width="20" height="40" fill={defaultColors.methylated} fillOpacity="0.3" stroke={defaultColors.methylated} strokeWidth="2" rx="4"/>
                  <circle cx="10" cy="-5" r="5" fill={defaultColors.methyl} fillOpacity="0.8"/>
                  <rect x="30" y="0" width="20" height="40" fill={defaultColors.methylated} fillOpacity="0.3" stroke={defaultColors.methylated} strokeWidth="2" rx="4"/>
                  <circle cx="40" cy="-5" r="5" fill={defaultColors.methyl} fillOpacity="0.8"/>
                  <rect x="60" y="0" width="20" height="40" fill={defaultColors.methylated} fillOpacity="0.3" stroke={defaultColors.methylated} strokeWidth="2" rx="4"/>
                  <circle cx="70" cy="-5" r="5" fill={defaultColors.methyl} fillOpacity="0.8"/>
                </g>
                <text x="60" y="90" textAnchor="middle" fontSize="9" fill="#666">甲基化</text>
              </g>

              <path d="M170,100 L230,100" stroke="#8B5CF6" strokeWidth="3" markerEnd="url(#arrow-blue)"/>
              <text x="200" y="90" textAnchor="middle" fontSize="10" fill="#6D28D9">DNA复制</text>

              <g transform="translate(240, 50)">
                <rect x="0" y="0" width="120" height="100" fill="white" stroke={defaultColors.methylated} strokeWidth="2" rx="4"/>
                <text x="60" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#6D28D9">子代DNA</text>
                <g transform="translate(20, 35)">
                  <rect x="0" y="0" width="20" height="40" fill={defaultColors.methylated} fillOpacity="0.3" stroke={defaultColors.methylated} strokeWidth="2" rx="4"/>
                  <circle cx="10" cy="-5" r="5" fill={defaultColors.methyl} fillOpacity="0.8"/>
                  <rect x="30" y="0" width="20" height="40" fill={defaultColors.unmethylated} fillOpacity="0.3" stroke={defaultColors.unmethylated} strokeWidth="2" rx="4"/>
                  <rect x="60" y="0" width="20" height="40" fill={defaultColors.methylated} fillOpacity="0.3" stroke={defaultColors.methylated} strokeWidth="2" rx="4"/>
                  <circle cx="70" cy="-5" r="5" fill={defaultColors.methyl} fillOpacity="0.8"/>
                </g>
                <text x="60" y="90" textAnchor="middle" fontSize="9" fill="#666">半保留</text>
              </g>

              <path d="M360,100 L420,100" stroke="#8B5CF6" strokeWidth="3" markerEnd="url(#arrow-blue)"/>
              <text x="390" y="90" textAnchor="middle" fontSize="10" fill="#6D28D9">DNMT1</text>

              <g transform="translate(430, 50)">
                <rect x="0" y="0" width="120" height="100" fill="white" stroke={defaultColors.methylated} strokeWidth="2" rx="4"/>
                <text x="60" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#6D28D9">子代细胞</text>
                <g transform="translate(20, 35)">
                  <rect x="0" y="0" width="20" height="40" fill={defaultColors.methylated} fillOpacity="0.3" stroke={defaultColors.methylated} strokeWidth="2" rx="4"/>
                  <circle cx="10" cy="-5" r="5" fill={defaultColors.methyl} fillOpacity="0.8"/>
                  <rect x="30" y="0" width="20" height="40" fill={defaultColors.methylated} fillOpacity="0.3" stroke={defaultColors.methylated} strokeWidth="2" rx="4"/>
                  <circle cx="40" cy="-5" r="5" fill={defaultColors.methyl} fillOpacity="0.8"/>
                  <rect x="60" y="0" width="20" height="40" fill={defaultColors.methylated} fillOpacity="0.3" stroke={defaultColors.methylated} strokeWidth="2" rx="4"/>
                  <circle cx="70" cy="-5" r="5" fill={defaultColors.methyl} fillOpacity="0.8"/>
                </g>
                <text x="60" y="90" textAnchor="middle" fontSize="9" fill="#666">完全甲基化</text>
              </g>

              <g transform="translate(50, 180)">
                <rect x="0" y="0" width="500" height="180" fill="white" stroke={defaultColors.methylated} strokeWidth="2" rx="8"/>
                
                <text x="250" y="25" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#6D28D9">表观遗传重编程</text>
                
                <g transform="translate(20, 40)">
                  <rect x="0" y="0" width="150" height="120" fill="#F3E8FF" stroke="#8B5CF6" strokeWidth="1" rx="4"/>
                  <text x="75" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#6D28D9">生殖细胞</text>
                  <text x="75" y="45" textAnchor="middle" fontSize="9" fill="#666">• 去甲基化</text>
                  <text x="75" y="60" textAnchor="middle" fontSize="9" fill="#666">• 重置甲基化</text>
                  <text x="75" y="75" textAnchor="middle" fontSize="9" fill="#666">• 建立新模式</text>
                  <text x="75" y="90" textAnchor="middle" fontSize="9" fill="#666">• 防止表观遗传</text>
                  <text x="75" y="105" textAnchor="middle" fontSize="9" fill="#666">  累积</text>
                </g>
                
                <g transform="translate(175, 40)">
                  <rect x="0" y="0" width="150" height="120" fill="#F3E8FF" stroke="#8B5CF6" strokeWidth="1" rx="4"/>
                  <text x="75" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#6D28D9">早期胚胎</text>
                  <text x="75" y="45" textAnchor="middle" fontSize="9" fill="#666">• 父本去甲基化</text>
                  <text x="75" y="60" textAnchor="middle" fontSize="9" fill="#666">• 母本逐渐去</text>
                  <text x="75" y="75" textAnchor="middle" fontSize="9" fill="#666">  甲基化</text>
                  <text x="75" y="90" textAnchor="middle" fontSize="9" fill="#666">• 植入前建立</text>
                  <text x="75" y="105" textAnchor="middle" fontSize="9" fill="#666">  新模式</text>
                </g>
                
                <g transform="translate(330, 40)">
                  <rect x="0" y="0" width="150" height="120" fill="#F3E8FF" stroke="#8B5CF6" strokeWidth="1" rx="4"/>
                  <text x="75" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#6D28D9">体细胞</text>
                  <text x="75" y="45" textAnchor="middle" fontSize="9" fill="#666">• 维持甲基化</text>
                  <text x="75" y="60" textAnchor="middle" fontSize="9" fill="#666">• DNMT1作用</text>
                  <text x="75" y="75" textAnchor="middle" fontSize="9" fill="#666">• 稳定遗传</text>
                  <text x="75" y="90" textAnchor="middle" fontSize="9" fill="#666">• 环境影响</text>
                  <text x="75" y="105" textAnchor="middle" fontSize="9" fill="#666">• 年龄相关变化</text>
                </g>
              </g>
            </svg>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-3">重编程要点</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span><strong>生殖细胞重编程：</strong>配子形成时去除大部分甲基化标记</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span><strong>胚胎重编程：</strong>受精后父本基因组主动去甲基化，母本被动去甲基化</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span><strong>印记基因：</strong>部分基因保留亲代特异性甲基化模式</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span><strong>体细胞维持：</strong>DNMT1确保甲基化模式在细胞分裂中遗传</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
