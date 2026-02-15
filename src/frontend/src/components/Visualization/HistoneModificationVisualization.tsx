import { useState } from 'react';

interface HistoneModificationVisualizationProps {
  data: any;
  colors?: Record<string, string>;
}

export function HistoneModificationVisualization({ data, colors }: HistoneModificationVisualizationProps) {
  const [activeTab, setActiveTab] = useState<'acetylation' | 'methylation' | 'phosphorylation' | 'code'>('acetylation');

  const defaultColors = {
    histone: colors?.histone || '#3B82F6',
    dna: colors?.dna || '#10B981',
    acetyl: colors?.acetyl || '#F59E0B',
    methyl: colors?.methyl || '#EF4444',
    phosphate: colors?.phosphate || '#8B5CF6',
  };

  const modificationTypes = [
    {
      id: 'acetylation',
      name: '乙酰化',
      effect: '激活基因表达',
      enzyme: 'HAT/HDAC',
      color: defaultColors.acetyl,
    },
    {
      id: 'methylation',
      name: '甲基化',
      effect: '激活或抑制',
      enzyme: 'HMT/HDM',
      color: defaultColors.methyl,
    },
    {
      id: 'phosphorylation',
      name: '磷酸化',
      effect: '影响染色质结构',
      enzyme: '激酶/磷酸酶',
      color: defaultColors.phosphate,
    },
    {
      id: 'code',
      name: '组蛋白密码',
      effect: '调控基因表达',
      enzyme: '多种酶',
      color: '#6D28D9',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {modificationTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setActiveTab(type.id as any)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === type.id
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {type.name}
          </button>
        ))}
      </div>

      {activeTab === 'acetylation' && (
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-amber-800">组蛋白乙酰化</h3>
            <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">激活基因表达</span>
          </div>
          
          <div className="flex justify-center">
            <svg width="600" height="400" viewBox="0 0 600 400">
              <defs>
                <marker id="arrow-amber" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L9,3 z" fill="#F59E0B"/>
                </marker>
              </defs>

              <text x="300" y="25" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1976D2">组蛋白乙酰化机制</text>

              <g transform="translate(50, 50)">
                <text x="120" y="15" textAnchor="middle" fontSize="12" fill="#666">未乙酰化</text>
                
                <g transform="translate(30, 30)">
                  <ellipse cx="60" cy="30" rx="50" ry="25" fill={defaultColors.histone} fillOpacity="0.3" stroke={defaultColors.histone} strokeWidth="2"/>
                  <text x="60" y="35" textAnchor="middle" fontSize="10" fill="#1D4ED8">H3</text>
                  
                  <line x1="10" y1="30" x2="-30" y2="30" stroke="#9CA3AF" strokeWidth="2"/>
                  <line x1="110" y1="30" x2="150" y2="30" stroke="#9CA3AF" strokeWidth="2"/>
                  
                  <text x="0" y="25" textAnchor="middle" fontSize="9" fill="#6B7280">+</text>
                  <text x="0" y="38" textAnchor="middle" fontSize="9" fill="#6B7280">NH3+</text>
                  
                  <text x="120" y="25" textAnchor="middle" fontSize="9" fill="#6B7280">+</text>
                  <text x="120" y="38" textAnchor="middle" fontSize="9" fill="#6B7280">NH3+</text>
                  
                  <text x="60" y="70" textAnchor="middle" fontSize="10" fill="#666">正电荷：强</text>
                  <text x="60" y="85" textAnchor="middle" fontSize="10" fill="#666">结合DNA：紧密</text>
                </g>
              </g>

              <path d="M175,100 L225,100" stroke="#F59E0B" strokeWidth="3" markerEnd="url(#arrow-amber)"/>
              <text x="200" y="90" textAnchor="middle" fontSize="10" fill="#B45309">HAT</text>

              <g transform="translate(250, 50)">
                <text x="120" y="15" textAnchor="middle" fontSize="12" fill="#666">乙酰化</text>
                
                <g transform="translate(30, 30)">
                  <ellipse cx="60" cy="30" rx="50" ry="25" fill={defaultColors.histone} fillOpacity="0.3" stroke={defaultColors.histone} strokeWidth="2"/>
                  <text x="60" y="35" textAnchor="middle" fontSize="10" fill="#1D4ED8">H3</text>
                  
                  <line x1="10" y1="30" x2="-30" y2="30" stroke="#9CA3AF" strokeWidth="2"/>
                  <line x1="110" y1="30" x2="150" y2="30" stroke="#9CA3AF" strokeWidth="2"/>
                  
                  <circle cx="0" cy="30" r="12" fill={defaultColors.acetyl} fillOpacity="0.4" stroke={defaultColors.acetyl} strokeWidth="2"/>
                  <text x="0" y="34" textAnchor="middle" fontSize="8" fill="#B45309">Ac</text>
                  
                  <circle cx="120" cy="30" r="12" fill={defaultColors.acetyl} fillOpacity="0.4" stroke={defaultColors.acetyl} strokeWidth="2"/>
                  <text x="120" y="34" textAnchor="middle" fontSize="8" fill="#B45309">Ac</text>
                  
                  <text x="60" y="70" textAnchor="middle" fontSize="10" fill={defaultColors.acetyl}>正电荷：中和</text>
                  <text x="60" y="85" textAnchor="middle" fontSize="10" fill={defaultColors.acetyl}>结合DNA：松散</text>
                </g>
              </g>

              <path d="M375,100 L425,100" stroke="#F59E0B" strokeWidth="3" markerEnd="url(#arrow-amber)"/>

              <g transform="translate(450, 50)">
                <text x="50" y="15" textAnchor="middle" fontSize="12" fill="#666">染色质开放</text>
                
                <g transform="translate(30, 30)">
                  <ellipse cx="40" cy="30" rx="35" ry="20" fill={defaultColors.histone} fillOpacity="0.3" stroke={defaultColors.histone} strokeWidth="2"/>
                  <text x="40" y="34" textAnchor="middle" fontSize="9" fill="#1D4ED8">H3</text>
                  
                  <path d="M5,30 Q-20,10 -40,30" stroke={defaultColors.dna} strokeWidth="3" fill="none"/>
                  <path d="M75,30 Q100,50 120,30" stroke={defaultColors.dna} strokeWidth="3" fill="none"/>
                  
                  <text x="40" y="65" textAnchor="middle" fontSize="10" fill={defaultColors.dna}>DNA松散</text>
                  <text x="40" y="80" textAnchor="middle" fontSize="10" fill={defaultColors.dna}>基因激活</text>
                </g>
              </g>

              <g transform="translate(50, 200)">
                <rect x="0" y="0" width="500" height="150" fill="white" stroke={defaultColors.acetyl} strokeWidth="2" rx="8"/>
                
                <text x="250" y="25" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#B45309">乙酰化与去乙酰化</text>
                
                <g transform="translate(20, 40)">
                  <rect x="0" y="0" width="230" height="90" fill="#FFFBEB" stroke="#F59E0B" strokeWidth="1" rx="4"/>
                  <text x="115" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#B45309">乙酰转移酶（HAT）</text>
                  <text x="115" y="45" textAnchor="middle" fontSize="9" fill="#666">• 添加乙酰基</text>
                  <text x="115" y="60" textAnchor="middle" fontSize="9" fill="#666">• 中和正电荷</text>
                  <text x="115" y="75" textAnchor="middle" fontSize="9" fill="#666">• 松开染色质</text>
                </g>
                
                <g transform="translate(250, 40)">
                  <rect x="0" y="0" width="230" height="90" fill="#FFFBEB" stroke="#F59E0B" strokeWidth="1" rx="4"/>
                  <text x="115" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#B45309">去乙酰化酶（HDAC）</text>
                  <text x="115" y="45" textAnchor="middle" fontSize="9" fill="#666">• 移除乙酰基</text>
                  <text x="115" y="60" textAnchor="middle" fontSize="9" fill="#666">• 恢复正电荷</text>
                  <text x="115" y="75" textAnchor="middle" fontSize="9" fill="#666">• 紧缩染色质</text>
                </g>
              </g>
            </svg>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-amber-800 mb-3">乙酰化特点</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">•</span>
                <span><strong>靶位点：</strong>主要发生在组蛋白H3和H4的赖氨酸残基</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">•</span>
                <span><strong>电荷效应：</strong>中和赖氨酸正电荷，减弱与DNA的相互作用</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">•</span>
                <span><strong>基因激活：</strong>通常与基因激活相关，使染色质松散</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">•</span>
                <span><strong>可逆性：</strong>HAT和HDAC动态调节乙酰化水平</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'methylation' && (
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-red-800">组蛋白甲基化</h3>
            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">激活或抑制</span>
          </div>
          
          <div className="flex justify-center">
            <svg width="600" height="400" viewBox="0 0 600 400">
              <text x="300" y="25" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1976D2">组蛋白甲基化的多样性</text>

              <g transform="translate(50, 50)">
                <rect x="0" y="0" width="240" height="300" fill="white" stroke={defaultColors.methyl} strokeWidth="2" rx="8"/>
                
                <text x="120" y="25" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#DC2626">激活性甲基化</text>
                
                <g transform="translate(20, 40)">
                  <ellipse cx="100" cy="40" rx="80" ry="40" fill={defaultColors.histone} fillOpacity="0.3" stroke={defaultColors.histone} strokeWidth="2"/>
                  <text x="100" y="45" textAnchor="middle" fontSize="12" fill="#1D4ED8">H3</text>
                  
                  <circle cx="40" cy="20" r="10" fill={defaultColors.methyl} fillOpacity="0.4" stroke={defaultColors.methyl} strokeWidth="2"/>
                  <text x="40" y="24" textAnchor="middle" fontSize="8" fill="#DC2626">me1</text>
                  
                  <circle cx="160" cy="20" r="10" fill={defaultColors.methyl} fillOpacity="0.4" stroke={defaultColors.methyl} strokeWidth="2"/>
                  <text x="160" y="24" textAnchor="middle" fontSize="8" fill="#DC2626">me3</text>
                </g>
                
                <g transform="translate(20, 130)">
                  <rect x="0" y="0" width="200" height="150" fill="#FEF2F2" stroke="#EF4444" strokeWidth="1" rx="4"/>
                  <text x="100" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#DC2626">激活位点</text>
                  <text x="100" y="45" textAnchor="middle" fontSize="9" fill="#666">• H3K4me3</text>
                  <text x="100" y="60" textAnchor="middle" fontSize="9" fill="#666">• H3K36me3</text>
                  <text x="100" y="75" textAnchor="middle" fontSize="9" fill="#666">• H3K79me3</text>
                  <text x="100" y="90" textAnchor="middle" fontSize="9" fill="#666">• H3K9me1/2</text>
                  <text x="100" y="105" textAnchor="middle" fontSize="9" fill="#666">• 标记转录起始区</text>
                  <text x="100" y="120" textAnchor="middle" fontSize="9" fill="#666">• 促进基因表达</text>
                </g>
              </g>

              <g transform="translate(310, 50)">
                <rect x="0" y="0" width="240" height="300" fill="white" stroke={defaultColors.methyl} strokeWidth="2" rx="8"/>
                
                <text x="120" y="25" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#DC2626">抑制性甲基化</text>
                
                <g transform="translate(20, 40)">
                  <ellipse cx="100" cy="40" rx="80" ry="40" fill={defaultColors.histone} fillOpacity="0.3" stroke={defaultColors.histone} strokeWidth="2"/>
                  <text x="100" y="45" textAnchor="middle" fontSize="12" fill="#1D4ED8">H3</text>
                  
                  <circle cx="40" cy="20" r="10" fill={defaultColors.methyl} fillOpacity="0.6" stroke={defaultColors.methyl} strokeWidth="2"/>
                  <text x="40" y="24" textAnchor="middle" fontSize="8" fill="#FFF">me3</text>
                  
                  <circle cx="160" cy="20" r="10" fill={defaultColors.methyl} fillOpacity="0.6" stroke={defaultColors.methyl} strokeWidth="2"/>
                  <text x="160" y="24" textAnchor="middle" fontSize="8" fill="#FFF">me3</text>
                  
                  <circle cx="100" cy="60" r="10" fill={defaultColors.methyl} fillOpacity="0.6" stroke={defaultColors.methyl} strokeWidth="2"/>
                  <text x="100" y="64" textAnchor="middle" fontSize="8" fill="#FFF">me3</text>
                </g>
                
                <g transform="translate(20, 130)">
                  <rect x="0" y="0" width="200" height="150" fill="#FEF2F2" stroke="#EF4444" strokeWidth="1" rx="4"/>
                  <text x="100" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#DC2626">抑制位点</text>
                  <text x="100" y="45" textAnchor="middle" fontSize="9" fill="#666">• H3K9me3</text>
                  <text x="100" y="60" textAnchor="middle" fontSize="9" fill="#666">• H3K27me3</text>
                  <text x="100" y="75" textAnchor="middle" fontSize="9" fill="#666">• H4K20me3</text>
                  <text x="100" y="90" textAnchor="middle" fontSize="9" fill="#666">• 标记异染色质</text>
                  <text x="100" y="105" textAnchor="middle" fontSize="9" fill="#666">• 抑制基因表达</text>
                  <text x="100" y="120" textAnchor="middle" fontSize="9" fill="#666">• 维持基因组稳定性</text>
                </g>
              </g>
            </svg>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-red-800 mb-3">甲基化特点</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span><strong>程度多样性：</strong>单甲基化（me1）、二甲基化（me2）、三甲基化（me3）</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span><strong>位点特异性：</strong>不同位点有不同效应（激活或抑制）</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span><strong>稳定性：</strong>比乙酰化更稳定，长期维持基因沉默</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span><strong>相互作用：</strong>与其他修饰协同作用（如与DNA甲基化）</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'phosphorylation' && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-purple-800">组蛋白磷酸化</h3>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">影响染色质结构</span>
          </div>
          
          <div className="flex justify-center">
            <svg width="600" height="350" viewBox="0 0 600 350">
              <text x="300" y="25" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1976D2">组蛋白磷酸化机制</text>

              <g transform="translate(100, 50)">
                <rect x="0" y="0" width="400" height="200" fill="white" stroke={defaultColors.phosphate} strokeWidth="2" rx="8"/>
                
                <text x="200" y="25" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#6D28D9">磷酸化与去磷酸化</text>
                
                <g transform="translate(30, 40)">
                  <rect x="0" y="0" width="170" height="140" fill="#F3E8FF" stroke="#8B5CF6" strokeWidth="1" rx="4"/>
                  <text x="85" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#6D28D9">激酶（添加磷酸）</text>
                  <text x="85" y="45" textAnchor="middle" fontSize="8" fill="#666">• 使用ATP</text>
                  <text x="85" y="60" textAnchor="middle" fontSize="8" fill="#666">• 添加PO4基团</text>
                  <text x="85" y="75" textAnchor="middle" fontSize="8" fill="#666">• 引入负电荷</text>
                  <text x="85" y="90" textAnchor="middle" fontSize="8" fill="#666">• 改变染色质结构</text>
                  <text x="85" y="105" textAnchor="middle" fontSize="8" fill="#666">• 影响其他修饰</text>
                </g>
                
                <g transform="translate(200, 40)">
                  <rect x="0" y="0" width="170" height="140" fill="#F3E8FF" stroke="#8B5CF6" strokeWidth="1" rx="4"/>
                  <text x="85" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#6D28D9">磷酸酶（移除磷酸）</text>
                  <text x="85" y="45" textAnchor="middle" fontSize="8" fill="#666">• 水解磷酸酯键</text>
                  <text x="85" y="60" textAnchor="middle" fontSize="8" fill="#666">• 释放无机磷酸</text>
                  <text x="85" y="75" textAnchor="middle" fontSize="8" fill="#666">• 恢复中性</text>
                  <text x="85" y="90" textAnchor="middle" fontSize="8" fill="#666">• 可逆调节</text>
                  <text x="85" y="105" textAnchor="middle" fontSize="8" fill="#666">• 动态平衡</text>
                </g>
              </g>

              <g transform="translate(50, 270)">
                <rect x="0" y="0" width="500" height="60" fill="white" stroke={defaultColors.phosphate} strokeWidth="2" rx="8"/>
                
                <text x="250" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#6D28D9">主要功能</text>
                
                <g transform="translate(20, 30)">
                  <text x="60" y="15" textAnchor="middle" fontSize="9" fill="#666">• 染色质凝集</text>
                </g>
                <g transform="translate(130, 30)">
                  <text x="60" y="15" textAnchor="middle" fontSize="9" fill="#666">• DNA损伤修复</text>
                </g>
                <g transform="translate(240, 30)">
                  <text x="60" y="15" textAnchor="middle" fontSize="9" fill="#666">• 染色体分离</text>
                </g>
                <g transform="translate(350, 30)">
                  <text x="60" y="15" textAnchor="middle" fontSize="9" fill="#666">• 转录调控</text>
                </g>
              </g>
            </svg>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-3">磷酸化特点</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span><strong>快速响应：</strong>磷酸化是快速、可逆的信号转导机制</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span><strong>电荷效应：</strong>添加负电荷，改变组蛋白与DNA的相互作用</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span><strong>协同作用：</strong>常与乙酰化、甲基化等修饰协同作用</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span><strong>细胞周期：</strong>在有丝分裂和DNA损伤修复中发挥重要作用</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'code' && (
        <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-indigo-800">组蛋白密码假说</h3>
          
          <div className="flex justify-center">
            <svg width="600" height="450" viewBox="0 0 600 450">
              <text x="300" y="25" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1976D2">组蛋白密码概念</text>

              <g transform="translate(50, 50)">
                <rect x="0" y="0" width="500" height="350" fill="white" stroke="#6D28D9" strokeWidth="2" rx="8"/>
                
                <text x="250" y="25" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#6D28D9">组蛋白密码：组合修饰调控基因表达</text>
                
                <g transform="translate(20, 40)">
                  <rect x="0" y="0" width="460" height="120" fill="#E0E7FF" stroke="#6366F1" strokeWidth="1" rx="4"/>
                  <text x="230" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#4338CA">核小体结构</text>
                  
                  <g transform="translate(30, 30)">
                    <ellipse cx="50" cy="25" rx="40" ry="20" fill={defaultColors.histone} fillOpacity="0.3" stroke={defaultColors.histone} strokeWidth="2"/>
                    <text x="50" y="29" textAnchor="middle" fontSize="9" fill="#1D4ED8">H3</text>
                    
                    <circle cx="20" cy="15" r="6" fill={defaultColors.acetyl} fillOpacity="0.4" stroke={defaultColors.acetyl} strokeWidth="1"/>
                    <text x="20" y="18" textAnchor="middle" fontSize="6" fill="#B45309">Ac</text>
                    
                    <circle cx="80" cy="15" r="6" fill={defaultColors.methyl} fillOpacity="0.4" stroke={defaultColors.methyl} strokeWidth="1"/>
                    <text x="80" y="18" textAnchor="middle" fontSize="6" fill="#DC2626">me3</text>
                    
                    <circle cx="50" cy="35" r="6" fill={defaultColors.phosphate} fillOpacity="0.4" stroke={defaultColors.phosphate} strokeWidth="1"/>
                    <text x="50" y="38" textAnchor="middle" fontSize="6" fill="#6D28D9">P</text>
                  </g>
                  
                  <g transform="translate(150, 30)">
                    <ellipse cx="50" cy="25" rx="40" ry="20" fill={defaultColors.histone} fillOpacity="0.3" stroke={defaultColors.histone} strokeWidth="2"/>
                    <text x="50" y="29" textAnchor="middle" fontSize="9" fill="#1D4ED8">H4</text>
                    
                    <circle cx="20" cy="15" r="6" fill={defaultColors.acetyl} fillOpacity="0.4" stroke={defaultColors.acetyl} strokeWidth="1"/>
                    <text x="20" y="18" textAnchor="middle" fontSize="6" fill="#B45309">Ac</text>
                    
                    <circle cx="80" cy="15" r="6" fill={defaultColors.methyl} fillOpacity="0.4" stroke={defaultColors.methyl} strokeWidth="1"/>
                    <text x="80" y="18" textAnchor="middle" fontSize="6" fill="#DC2626">me1</text>
                  </g>
                  
                  <g transform="translate(270, 30)">
                    <ellipse cx="50" cy="25" rx="40" ry="20" fill={defaultColors.histone} fillOpacity="0.3" stroke={defaultColors.histone} strokeWidth="2"/>
                    <text x="50" y="29" textAnchor="middle" fontSize="9" fill="#1D4ED8">H2A</text>
                    
                    <circle cx="50" cy="15" r="6" fill={defaultColors.phosphate} fillOpacity="0.4" stroke={defaultColors.phosphate} strokeWidth="1"/>
                    <text x="50" y="18" textAnchor="middle" fontSize="6" fill="#6D28D9">P</text>
                  </g>
                  
                  <g transform="translate(390, 30)">
                    <ellipse cx="50" cy="25" rx="40" ry="20" fill={defaultColors.histone} fillOpacity="0.3" stroke={defaultColors.histone} strokeWidth="2"/>
                    <text x="50" y="29" textAnchor="middle" fontSize="9" fill="#1D4ED8">H2B</text>
                    
                    <circle cx="20" cy="15" r="6" fill={defaultColors.acetyl} fillOpacity="0.4" stroke={defaultColors.acetyl} strokeWidth="1"/>
                    <text x="20" y="18" textAnchor="middle" fontSize="6" fill="#B45309">Ac</text>
                  </g>
                  
                  <path d="M30,55 Q230,75 430,55" stroke={defaultColors.dna} strokeWidth="3" fill="none"/>
                  <path d="M30,55 Q230,35 430,55" stroke={defaultColors.dna} strokeWidth="3" fill="none"/>
                  
                  <text x="230" y="95" textAnchor="middle" fontSize="9" fill="#666">DNA包裹在组蛋白八聚体上</text>
                  <text x="230" y="110" textAnchor="middle" fontSize="9" fill="#666">多种修饰形成"密码"</text>
                </g>
                
                <g transform="translate(20, 170)">
                  <rect x="0" y="0" width="140" height="160" fill="#F3E8FF" stroke="#8B5CF6" strokeWidth="1" rx="4"/>
                  <text x="70" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#6D28D9">修饰类型</text>
                  <text x="70" y="45" textAnchor="middle" fontSize="8" fill="#666">• 乙酰化</text>
                  <text x="70" y="60" textAnchor="middle" fontSize="8" fill="#666">• 甲基化</text>
                  <text x="70" y="75" textAnchor="middle" fontSize="8" fill="#666">• 磷酸化</text>
                  <text x="70" y="90" textAnchor="middle" fontSize="8" fill="#666">• 泛素化</text>
                  <text x="70" y="105" textAnchor="middle" fontSize="8" fill="#666">• SUMO化</text>
                  <text x="70" y="120" textAnchor="middle" fontSize="8" fill="#666">• ADP核糖基化</text>
                  <text x="70" y="135" textAnchor="middle" fontSize="8" fill="#666">• 柠檬酰化</text>
                </g>
                
                <g transform="translate(170, 170)">
                  <rect x="0" y="0" width="140" height="160" fill="#F3E8FF" stroke="#8B5CF6" strokeWidth="1" rx="4"/>
                  <text x="70" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#6D28D9">修饰程度</text>
                  <text x="70" y="45" textAnchor="middle" fontSize="8" fill="#666">• 单甲基化</text>
                  <text x="70" y="60" textAnchor="middle" fontSize="8" fill="#666">• 二甲基化</text>
                  <text x="70" y="75" textAnchor="middle" fontSize="8" fill="#666">• 三甲基化</text>
                  <text x="70" y="90" textAnchor="middle" fontSize="8" fill="#666">• 多磷酸化</text>
                  <text x="70" y="105" textAnchor="middle" fontSize="8" fill="#666">• 单/双乙酰化</text>
                  <text x="70" y="120" textAnchor="middle" fontSize="8" fill="#666">• 泛素链长度</text>
                </g>
                
                <g transform="translate(320, 170)">
                  <rect x="0" y="0" width="140" height="160" fill="#F3E8FF" stroke="#8B5CF6" strokeWidth="1" rx="4"/>
                  <text x="70" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#6D28D9">功能解读</text>
                  <text x="70" y="45" textAnchor="middle" fontSize="8" fill="#666">• 招募蛋白复合物</text>
                  <text x="70" y="60" textAnchor="middle" fontSize="8" fill="#666">• 改变染色质结构</text>
                  <text x="70" y="75" textAnchor="middle" fontSize="8" fill="#666">• 调控转录活性</text>
                  <text x="70" y="90" textAnchor="middle" fontSize="8" fill="#666">• 影响DNA修复</text>
                  <text x="70" y="105" textAnchor="middle" fontSize="8" fill="#666">• 调节细胞周期</text>
                  <text x="70" y="120" textAnchor="middle" fontSize="8" fill="#666">• 表观遗传记忆</text>
                </g>
              </g>
            </svg>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-indigo-800 mb-3">组蛋白密码要点</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 mt-1">•</span>
                <span><strong>组合编码：</strong>不同修饰的组合形成特定的"密码"信号</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 mt-1">•</span>
                <span><strong>读写擦：</strong>写入酶、读取蛋白、擦除酶动态调节</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 mt-1">•</span>
                <span><strong>交叉对话：</strong>不同修饰之间存在相互影响</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 mt-1">•</span>
                <span><strong>可遗传性：</strong>可通过细胞分裂遗传给子代</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
