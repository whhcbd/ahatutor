import { useState } from 'react';
import { VisualizationColors } from '../../constants/visualization-colors';

interface ChromatinRemodelingVisualizationProps {
  colors?: Record<string, string>;
}

export function ChromatinRemodelingVisualization({ colors }: ChromatinRemodelingVisualizationProps) {
  const [activeTab, setActiveTab] = useState<'swi-snf' | 'iswi' | 'chd' | 'ino80'>('swi-snf');

  const defaultColors = {
    histone: colors?.histone || VisualizationColors.gene,
    dna: colors?.dna || VisualizationColors.dominant,
    complex: colors?.complex || VisualizationColors.hover,
    atp: colors?.atp || VisualizationColors.affected,
    nucleosome: colors?.nucleosome || VisualizationColors.nodePrinciple,
  };

  const remodelingComplexes = [
    {
      id: 'swi-snf',
      name: 'SWI/SNF家族',
      description: '染色质重塑因子',
      mechanism: '滑动、弹出',
      examples: ['BRG1', 'BRM'],
    },
    {
      id: 'iswi',
      name: 'ISWI家族',
      description: 'ATP依赖性染色质重塑',
      mechanism: '核小体间距调整',
      examples: ['SNF2H', 'SNF2L'],
    },
    {
      id: 'chd',
      name: 'CHD家族',
      description: '染色质解旋酶DNA结合',
      mechanism: '重塑、招募',
      examples: ['CHD1', 'CHD4'],
    },
    {
      id: 'ino80',
      name: 'INO80家族',
      description: '染色质重塑复合物',
      mechanism: '交换、重组',
      examples: ['INO80', 'SWR1'],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {remodelingComplexes.map((complex) => (
          <button
            key={complex.id}
            onClick={() => setActiveTab(complex.id as any)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === complex.id
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {complex.name}
          </button>
        ))}
      </div>

      {activeTab === 'swi-snf' && (
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-blue-800">SWI/SNF染色质重塑复合物</h3>
          
          <div className="flex justify-center">
            <svg width="600" height="400" viewBox="0 0 600 400">
              <defs>
                <marker id="arrow-blue" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L9,3 z" fill="#3B82F6"/>
                </marker>
              </defs>

              <text x="300" y="25" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1976D2">SWI/SNF复合物作用机制</text>

              <g transform="translate(50, 50)">
                <text x="120" y="15" textAnchor="middle" fontSize="12" fill="#666">初始状态</text>
                
                <g transform="translate(30, 30)">
                  <ellipse cx="60" cy="30" rx="50" ry="25" fill={defaultColors.nucleosome} fillOpacity="0.3" stroke={defaultColors.nucleosome} strokeWidth="2"/>
                  <text x="60" y="35" textAnchor="middle" fontSize="10" fill="#6D28D9">H2A/H2B/H3/H4</text>
                  
                  <path d="M10,30 Q-20,10 -40,30" stroke={defaultColors.dna} strokeWidth="3" fill="none"/>
                  <path d="M110,30 Q140,50 160,30" stroke={defaultColors.dna} strokeWidth="3" fill="none"/>
                  
                  <text x="60" y="70" textAnchor="middle" fontSize="10" fill="#666">核小体紧密包装</text>
                </g>
              </g>

              <path d="M200,100 L240,100" stroke="#3B82F6" strokeWidth="3" markerEnd="url(#arrow-blue)"/>
              <text x="220" y="90" textAnchor="middle" fontSize="10" fill="#1D4ED8">ATP</text>

              <g transform="translate(250, 50)">
                <text x="120" y="15" textAnchor="middle" fontSize="12" fill="#666">SWI/SNF结合</text>
                
                <g transform="translate(30, 30)">
                  <ellipse cx="60" cy="30" rx="50" ry="25" fill={defaultColors.nucleosome} fillOpacity="0.3" stroke={defaultColors.nucleosome} strokeWidth="2"/>
                  <text x="60" y="35" textAnchor="middle" fontSize="10" fill="#6D28D9">H2A/H2B/H3/H4</text>
                  
                  <ellipse cx="60" cy="-20" rx="40" ry="15" fill={defaultColors.complex} fillOpacity="0.4" stroke={defaultColors.complex} strokeWidth="2"/>
                  <text x="60" y="-16" textAnchor="middle" fontSize="8" fill="#B45309">SWI/SNF</text>
                  
                  <path d="M10,30 Q-20,10 -40,30" stroke={defaultColors.dna} strokeWidth="3" fill="none"/>
                  <path d="M110,30 Q140,50 160,30" stroke={defaultColors.dna} strokeWidth="3" fill="none"/>
                  
                  <text x="60" y="70" textAnchor="middle" fontSize="10" fill="#666">复合物结合</text>
                </g>
              </g>

              <path d="M400,100 L440,100" stroke="#3B82F6" strokeWidth="3" markerEnd="url(#arrow-blue)"/>

              <g transform="translate(450, 50)">
                <text x="50" y="15" textAnchor="middle" fontSize="12" fill="#666">重塑后</text>
                
                <g transform="translate(30, 30)">
                  <ellipse cx="40" cy="30" rx="35" ry="20" fill={defaultColors.nucleosome} fillOpacity="0.3" stroke={defaultColors.nucleosome} strokeWidth="2"/>
                  <text x="40" y="34" textAnchor="middle" fontSize="9" fill="#6D28D9">组蛋白</text>
                  
                  <path d="M5,30 Q-15,15 -35,30" stroke={defaultColors.dna} strokeWidth="3" fill="none"/>
                  <path d="M75,30 Q95,15 115,30" stroke={defaultColors.dna} strokeWidth="3" fill="none"/>
                  
                  <text x="40" y="65" textAnchor="middle" fontSize="10" fill={defaultColors.dna}>DNA松散</text>
                  <text x="40" y="80" textAnchor="middle" fontSize="10" fill={defaultColors.dna}>可转录</text>
                </g>
              </g>

              <g transform="translate(50, 180)">
                <rect x="0" y="0" width="500" height="180" fill="white" stroke={defaultColors.complex} strokeWidth="2" rx="8"/>
                
                <text x="250" y="25" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#B45309">SWI/SNF复合物组成与功能</text>
                
                <g transform="translate(20, 40)">
                  <rect x="0" y="0" width="155" height="120" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1" rx="4"/>
                  <text x="77" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#B45309">核心亚基</text>
                  <text x="77" y="45" textAnchor="middle" fontSize="8" fill="#666">• BRG1/BRM</text>
                  <text x="77" y="60" textAnchor="middle" fontSize="8" fill="#666">  （ATP酶）</text>
                  <text x="77" y="75" textAnchor="middle" fontSize="8" fill="#666">• BAF155</text>
                  <text x="77" y="90" textAnchor="middle" fontSize="8" fill="#666">• BAF170</text>
                  <text x="77" y="105" textAnchor="middle" fontSize="8" fill="#666">• BAF47</text>
                </g>
                
                <g transform="translate(175, 40)">
                  <rect x="0" y="0" width="155" height="120" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1" rx="4"/>
                  <text x="77" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#B45309">作用机制</text>
                  <text x="77" y="45" textAnchor="middle" fontSize="8" fill="#666">• 核小体滑动</text>
                  <text x="77" y="60" textAnchor="middle" fontSize="8" fill="#666">• 组蛋白交换</text>
                  <text x="77" y="75" textAnchor="middle" fontSize="8" fill="#666">• H2A/H2B弹出</text>
                  <text x="77" y="90" textAnchor="middle" fontSize="8" fill="#666">• 染色质开放</text>
                  <text x="77" y="105" textAnchor="middle" fontSize="8" fill="#666">• 基因激活</text>
                </g>
                
                <g transform="translate(330, 40)">
                  <rect x="0" y="0" width="150" height="120" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1" rx="4"/>
                  <text x="75" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#B45309">生物学功能</text>
                  <text x="75" y="45" textAnchor="middle" fontSize="8" fill="#666">• 基因表达调控</text>
                  <text x="75" y="60" textAnchor="middle" fontSize="8" fill="#666">• 细胞分化</text>
                  <text x="75" y="75" textAnchor="middle" fontSize="8" fill="#666">• DNA损伤修复</text>
                  <text x="75" y="90" textAnchor="middle" fontSize="8" fill="#666">• 肿瘤抑制</text>
                  <text x="75" y="105" textAnchor="middle" fontSize="8" fill="#666">• 发育调控</text>
                </g>
              </g>
            </svg>
          </div>
        </div>
      )}

      {activeTab === 'iswi' && (
        <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-green-800">ISWI染色质重塑复合物</h3>
          
          <div className="flex justify-center">
            <svg width="600" height="350" viewBox="0 0 600 350">
              <text x="300" y="25" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1976D2">ISWI复合物：核小体间距调整</text>

              <g transform="translate(50, 50)">
                <text x="120" y="15" textAnchor="middle" fontSize="12" fill="#666">不规则间距</text>
                
                <g transform="translate(30, 30)">
                  <ellipse cx="50" cy="20" rx="35" ry="18" fill={defaultColors.nucleosome} fillOpacity="0.3" stroke={defaultColors.nucleosome} strokeWidth="2"/>
                  <ellipse cx="120" cy="40" rx="35" ry="18" fill={defaultColors.nucleosome} fillOpacity="0.3" stroke={defaultColors.nucleosome} strokeWidth="2"/>
                  <ellipse cx="180" cy="25" rx="35" ry="18" fill={defaultColors.nucleosome} fillOpacity="0.3" stroke={defaultColors.nucleosome} strokeWidth="2"/>
                  
                  <path d="M15,20 Q-10,5 -35,20" stroke={defaultColors.dna} strokeWidth="2" fill="none"/>
                  <path d="M85,20 Q100,10 120,40" stroke={defaultColors.dna} strokeWidth="2" fill="none"/>
                  <path d="M155,40 Q170,25 180,25" stroke={defaultColors.dna} strokeWidth="2" fill="none"/>
                  <path d="M215,25 Q240,40 260,25" stroke={defaultColors.dna} strokeWidth="2" fill="none"/>
                </g>
              </g>

              <path d="M200,100 L240,100" stroke="#10B981" strokeWidth="3" markerEnd="url(#arrow-blue)"/>

              <g transform="translate(250, 50)">
                <text x="120" y="15" textAnchor="middle" fontSize="12" fill="#666">ISWI调节</text>
                
                <g transform="translate(30, 30)">
                  <ellipse cx="50" cy="30" rx="35" ry="18" fill={defaultColors.nucleosome} fillOpacity="0.3" stroke={defaultColors.nucleosome} strokeWidth="2"/>
                  <ellipse cx="50" cy="-10" rx="25" ry="12" fill={defaultColors.complex} fillOpacity="0.4" stroke={defaultColors.complex} strokeWidth="2"/>
                  <text x="50" y="-6" textAnchor="middle" fontSize="8" fill="#B45309">ISWI</text>
                  
                  <path d="M15,30 Q-10,15 -35,30" stroke={defaultColors.dna} strokeWidth="2" fill="none"/>
                  <path d="M85,30 Q110,45 135,30" stroke={defaultColors.dna} strokeWidth="2" fill="none"/>
                </g>
              </g>

              <path d="M400,100 L440,100" stroke="#10B981" strokeWidth="3" markerEnd="url(#arrow-blue)"/>

              <g transform="translate(450, 50)">
                <text x="50" y="15" textAnchor="middle" fontSize="12" fill="#666">规则间距</text>
                
                <g transform="translate(30, 30)">
                  <ellipse cx="40" cy="30" rx="30" ry="15" fill={defaultColors.nucleosome} fillOpacity="0.3" stroke={defaultColors.nucleosome} strokeWidth="2"/>
                  <ellipse cx="90" cy="30" rx="30" ry="15" fill={defaultColors.nucleosome} fillOpacity="0.3" stroke={defaultColors.nucleosome} strokeWidth="2"/>
                  <ellipse cx="140" cy="30" rx="30" ry="15" fill={defaultColors.nucleosome} fillOpacity="0.3" stroke={defaultColors.nucleosome} strokeWidth="2"/>
                  
                  <path d="M10,30 Q-10,15 -30,30" stroke={defaultColors.dna} strokeWidth="2" fill="none"/>
                  <path d="M70,30 Q80,30 90,30" stroke={defaultColors.dna} strokeWidth="2" fill="none"/>
                  <path d="M120,30 Q130,30 140,30" stroke={defaultColors.dna} strokeWidth="2" fill="none"/>
                  <path d="M170,30 Q190,45 210,30" stroke={defaultColors.dna} strokeWidth="2" fill="none"/>
                </g>
              </g>

              <g transform="translate(50, 180)">
                <rect x="0" y="0" width="500" height="140" fill="white" stroke="#10B981" strokeWidth="2" rx="8"/>
                
                <text x="250" y="25" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#059669">ISWI复合物特点</text>
                
                <g transform="translate(20, 40)">
                  <rect x="0" y="0" width="155" height="80" fill="#D1FAE5" stroke="#10B981" strokeWidth="1" rx="4"/>
                  <text x="77" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#059669">核心亚基</text>
                  <text x="77" y="40" textAnchor="middle" fontSize="8" fill="#666">• SNF2H</text>
                  <text x="77" y="55" textAnchor="middle" fontSize="8" fill="#666">• SNF2L</text>
                  <text x="77" y="70" textAnchor="middle" fontSize="8" fill="#666">• ACF1</text>
                </g>
                
                <g transform="translate(175, 40)">
                  <rect x="0" y="0" width="155" height="80" fill="#D1FAE5" stroke="#10B981" strokeWidth="1" rx="4"/>
                  <text x="77" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#059669">主要功能</text>
                  <text x="77" y="40" textAnchor="middle" fontSize="8" fill="#666">• 核小体间距</text>
                  <text x="77" y="55" textAnchor="middle" fontSize="8" fill="#666">• 染色质组装</text>
                  <text x="77" y="70" textAnchor="middle" fontSize="8" fill="#666">• 基因抑制</text>
                </g>
                
                <g transform="translate(330, 40)">
                  <rect x="0" y="0" width="150" height="80" fill="#D1FAE5" stroke="#10B981" strokeWidth="1" rx="4"/>
                  <text x="75" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#059669">生物学作用</text>
                  <text x="75" y="40" textAnchor="middle" fontSize="8" fill="#666">• 异染色质形成</text>
                  <text x="75" y="55" textAnchor="middle" fontSize="8" fill="#666">• DNA复制</text>
                  <text x="75" y="70" textAnchor="middle" fontSize="8" fill="#666">• 染色体结构</text>
                </g>
              </g>
            </svg>
          </div>
        </div>
      )}

      {activeTab === 'chd' && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-purple-800">CHD染色质重塑复合物</h3>
          
          <div className="flex justify-center">
            <svg width="600" height="350" viewBox="0 0 600 350">
              <text x="300" y="25" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1976D2">CHD复合物：染色质解旋酶DNA结合</text>

              <g transform="translate(50, 50)">
                <rect x="0" y="0" width="500" height="240" fill="white" stroke={defaultColors.nucleosome} strokeWidth="2" rx="8"/>
                
                <text x="250" y="25" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#6D28D9">CHD复合物结构</text>
                
                <g transform="translate(20, 40)">
                  <rect x="0" y="0" width="460" height="80" fill="#F3E8FF" stroke="#8B5CF6" strokeWidth="1" rx="4"/>
                  
                  <g transform="translate(10, 10)">
                    <rect x="0" y="0" width="100" height="60" fill="#DDD6FE" stroke="#7C3AED" strokeWidth="1" rx="2"/>
                    <text x="50" y="20" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#5B21B6">染色质结构域</text>
                    <text x="50" y="40" textAnchor="middle" fontSize="8" fill="#666">（Chromodomain）</text>
                    <text x="50" y="52" textAnchor="middle" fontSize="7" fill="#666">识别甲基化</text>
                  </g>
                  
                  <g transform="translate(120, 10)">
                    <rect x="0" y="0" width="100" height="60" fill="#DDD6FE" stroke="#7C3AED" strokeWidth="1" rx="2"/>
                    <text x="50" y="20" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#5B21B6">解旋酶结构域</text>
                    <text x="50" y="40" textAnchor="middle" fontSize="8" fill="#666">（Helicase）</text>
                    <text x="50" y="52" textAnchor="middle" fontSize="7" fill="#666">ATP水解</text>
                  </g>
                  
                  <g transform="translate(230, 10)">
                    <rect x="0" y="0" width="100" height="60" fill="#DDD6FE" stroke="#7C3AED" strokeWidth="1" rx="2"/>
                    <text x="50" y="20" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#5B21B6">DNA结合域</text>
                    <text x="50" y="40" textAnchor="middle" fontSize="8" fill="#666">（SANT）</text>
                    <text x="50" y="52" textAnchor="middle" fontSize="7" fill="#666">结合组蛋白</text>
                  </g>
                  
                  <g transform="translate(340, 10)">
                    <rect x="0" y="0" width="100" height="60" fill="#DDD6FE" stroke="#7C3AED" strokeWidth="1" rx="2"/>
                    <text x="50" y="20" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#5B21B6">结构域连接</text>
                    <text x="50" y="40" textAnchor="middle" fontSize="8" fill="#666">（BRK）</text>
                    <text x="50" y="52" textAnchor="middle" fontSize="7" fill="#666">柔性连接</text>
                  </g>
                </g>
                
                <g transform="translate(20, 130)">
                  <rect x="0" y="0" width="140" height="90" fill="#F3E8FF" stroke="#8B5CF6" strokeWidth="1" rx="4"/>
                  <text x="70" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#5B21B6">亚家族</text>
                  <text x="70" y="40" textAnchor="middle" fontSize="8" fill="#666">• CHD1/2</text>
                  <text x="70" y="55" textAnchor="middle" fontSize="8" fill="#666">• CHD3/4 (Mi-2)</text>
                  <text x="70" y="70" textAnchor="middle" fontSize="8" fill="#666">• CHD5-9</text>
                </g>
                
                <g transform="translate(170, 130)">
                  <rect x="0" y="0" width="140" height="90" fill="#F3E8FF" stroke="#8B5CF6" strokeWidth="1" rx="4"/>
                  <text x="70" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#5B21B6">功能</text>
                  <text x="70" y="40" textAnchor="middle" fontSize="8" fill="#666">• 染色质重塑</text>
                  <text x="70" y="55" textAnchor="middle" fontSize="8" fill="#666">• 转录调控</text>
                  <text x="70" y="70" textAnchor="middle" fontSize="8" fill="#666">• DNA修复</text>
                </g>
                
                <g transform="translate(320, 130)">
                  <rect x="0" y="0" width="140" height="90" fill="#F3E8FF" stroke="#8B5CF6" strokeWidth="1" rx="4"/>
                  <text x="70" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#5B21B6">疾病关联</text>
                  <text x="70" y="40" textAnchor="middle" fontSize="8" fill="#666">• 神经发育</text>
                  <text x="70" y="55" textAnchor="middle" fontSize="8" fill="#666">• 免疫疾病</text>
                  <text x="70" y="70" textAnchor="middle" fontSize="8" fill="#666">• 癌症</text>
                </g>
              </g>
            </svg>
          </div>
        </div>
      )}

      {activeTab === 'ino80' && (
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-orange-800">INO80染色质重塑复合物</h3>
          
          <div className="flex justify-center">
            <svg width="600" height="350" viewBox="0 0 600 350">
              <text x="300" y="25" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1976D2">INO80复合物：组蛋白变体交换</text>

              <g transform="translate(50, 50)">
                <text x="100" y="15" textAnchor="middle" fontSize="12" fill="#666">常规核小体</text>
                
                <g transform="translate(30, 30)">
                  <ellipse cx="70" cy="30" rx="50" ry="25" fill={defaultColors.nucleosome} fillOpacity="0.3" stroke={defaultColors.nucleosome} strokeWidth="2"/>
                  <text x="50" y="25" textAnchor="middle" fontSize="8" fill="#6D28D9">H3/H4</text>
                  <text x="90" y="25" textAnchor="middle" fontSize="8" fill="#6D28D9">H2A/H2B</text>
                  
                  <path d="M20,30 Q-10,10 -40,30" stroke={defaultColors.dna} strokeWidth="3" fill="none"/>
                  <path d="M120,30 Q150,50 180,30" stroke={defaultColors.dna} strokeWidth="3" fill="none"/>
                </g>
              </g>

              <path d="M200,100 L240,100" stroke="#F97316" strokeWidth="3" markerEnd="url(#arrow-blue)"/>
              <text x="220" y="90" textAnchor="middle" fontSize="10" fill="#C2410C">INO80</text>

              <g transform="translate(250, 50)">
                <text x="100" y="15" textAnchor="middle" fontSize="12" fill="#666">H2A.Z交换</text>
                
                <g transform="translate(30, 30)">
                  <ellipse cx="70" cy="30" rx="50" ry="25" fill={defaultColors.nucleosome} fillOpacity="0.3" stroke={defaultColors.nucleosome} strokeWidth="2"/>
                  <text x="50" y="25" textAnchor="middle" fontSize="8" fill="#6D28D9">H3/H4</text>
                  <text x="90" y="25" textAnchor="middle" fontSize="8" fill="#F97316">H2A.Z</text>
                  
                  <path d="M20,30 Q-10,10 -40,30" stroke={defaultColors.dna} strokeWidth="3" fill="none"/>
                  <path d="M120,30 Q150,50 180,30" stroke={defaultColors.dna} strokeWidth="3" fill="none"/>
                  
                  <ellipse cx="70" cy="-10" rx="30" ry="12" fill={defaultColors.complex} fillOpacity="0.4" stroke={defaultColors.complex} strokeWidth="2"/>
                  <text x="70" y="-6" textAnchor="middle" fontSize="8" fill="#B45309">INO80</text>
                </g>
              </g>

              <g transform="translate(50, 180)">
                <rect x="0" y="0" width="500" height="140" fill="white" stroke="#F97316" strokeWidth="2" rx="8"/>
                
                <text x="250" y="25" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#C2410C">INO80/SWR1复合物</text>
                
                <g transform="translate(20, 40)">
                  <rect x="0" y="0" width="155" height="80" fill="#FFEDD5" stroke="#F97316" strokeWidth="1" rx="4"/>
                  <text x="77" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#C2410C">核心功能</text>
                  <text x="77" y="40" textAnchor="middle" fontSize="8" fill="#666">• H2A.Z/H2A交换</text>
                  <text x="77" y="55" textAnchor="middle" fontSize="8" fill="#666">• 染色质重塑</text>
                  <text x="77" y="70" textAnchor="middle" fontSize="8" fill="#666">• DNA修复</text>
                </g>
                
                <g transform="translate(175, 40)">
                  <rect x="0" y="0" width="155" height="80" fill="#FFEDD5" stroke="#F97316" strokeWidth="1" rx="4"/>
                  <text x="77" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#C2410C">主要亚基</text>
                  <text x="77" y="40" textAnchor="middle" fontSize="8" fill="#666">• INO80</text>
                  <text x="77" y="55" textAnchor="middle" fontSize="8" fill="#666">• SWR1</text>
                  <text x="77" y="70" textAnchor="middle" fontSize="8" fill="#666">• ARP4-6</text>
                </g>
                
                <g transform="translate(330, 40)">
                  <rect x="0" y="0" width="150" height="80" fill="#FFEDD5" stroke="#F97316" strokeWidth="1" rx="4"/>
                  <text x="75" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#C2410C">生物学作用</text>
                  <text x="75" y="40" textAnchor="middle" fontSize="8" fill="#666">• 转录激活</text>
                  <text x="75" y="55" textAnchor="middle" fontSize="8" fill="#666">• DNA损伤修复</text>
                  <text x="75" y="70" textAnchor="middle" fontSize="8" fill="#666">• 端粒维持</text>
                </g>
              </g>
            </svg>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
        <h4 className="font-semibold text-gray-800 mb-3">染色质重塑的共同特点</h4>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h5 className="font-medium text-blue-700 mb-2">ATP依赖</h5>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• 水解ATP提供能量</li>
              <li>• 重塑染色质结构</li>
              <li>• 动态调节</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h5 className="font-medium text-green-700 mb-2">调控基因表达</h5>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• 开放染色质</li>
              <li>• 调节转录因子结合</li>
              <li>• 表观遗传调控</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h5 className="font-medium text-purple-700 mb-2">疾病关联</h5>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• 癌症发生</li>
              <li>• 发育异常</li>
              <li>• 神经疾病</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
