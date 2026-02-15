import { useState } from 'react';

interface RNAInterferenceVisualizationProps {
  data: any;
  colors?: Record<string, string>;
}

export function RNAInterferenceVisualization({ data, colors }: RNAInterferenceVisualizationProps) {
  const [activeTab, setActiveTab] = useState<'mirna' | 'sirna' | 'mechanism' | 'applications'>('mirna');

  const defaultColors = {
    mrna: colors?.mrna || '#10B981',
    sirna: colors?.sirna || '#EF4444',
    mirna: colors?.mirna || '#F59E0B',
    risc: colors?.risc || '#3B82F6',
    target: colors?.target || '#8B5CF6',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('mirna')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'mirna'
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          miRNA机制
        </button>
        <button
          onClick={() => setActiveTab('sirna')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'sirna'
              ? 'bg-green-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          siRNA机制
        </button>
        <button
          onClick={() => setActiveTab('mechanism')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'mechanism'
              ? 'bg-purple-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          作用机制
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'applications'
              ? 'bg-orange-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          应用
        </button>
      </div>

      {activeTab === 'mirna' && (
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-amber-800">miRNA（微RNA）机制</h3>
          
          <div className="flex justify-center">
            <svg width="600" height="400" viewBox="0 0 600 400">
              <defs>
                <marker id="arrow-amber" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L9,3 z" fill="#F59E0B"/>
                </marker>
              </defs>

              <text x="300" y="25" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1976D2">miRNA生物合成与作用</text>

              <g transform="translate(50, 50)">
                <text x="100" y="15" textAnchor="middle" fontSize="12" fill="#666">步骤1：转录</text>
                
                <g transform="translate(30, 30)">
                  <path d="M0,30 Q70,0 140,30" stroke={defaultColors.mirna} strokeWidth="3" fill="none"/>
                  <path d="M0,30 Q70,60 140,30" stroke={defaultColors.mirna} strokeWidth="3" fill="none"/>
                  <text x="70" y="45" textAnchor="middle" fontSize="10" fill="#B45309">pri-miRNA</text>
                  <text x="70" y="60" textAnchor="middle" fontSize="9" fill="#666">（初级转录本）</text>
                </g>
              </g>

              <path d="M200,80 L240,80" stroke="#F59E0B" strokeWidth="3" markerEnd="url(#arrow-amber)"/>

              <g transform="translate(250, 50)">
                <text x="100" y="15" textAnchor="middle" fontSize="12" fill="#666">步骤2：加工</text>
                
                <g transform="translate(30, 30)">
                  <ellipse cx="70" cy="25" rx="60" ry="20" fill={defaultColors.mirna} fillOpacity="0.3" stroke={defaultColors.mirna} strokeWidth="2"/>
                  <text x="70" y="20" textAnchor="middle" fontSize="10" fill="#B45309">pre-miRNA</text>
                  <text x="70" y="35" textAnchor="middle" fontSize="9" fill="#666">（发夹结构）</text>
                  
                  <ellipse cx="70" cy="-10" rx="25" ry="12" fill="#3B82F6" fillOpacity="0.3" stroke="#3B82F6" strokeWidth="2"/>
                  <text x="70" y="-7" textAnchor="middle" fontSize="8" fill="#1D4ED8">Drosha</text>
                </g>
              </g>

              <path d="M400,80 L440,80" stroke="#F59E0B" strokeWidth="3" markerEnd="url(#arrow-amber)"/>

              <g transform="translate(450, 50)">
                <text x="50" y="15" textAnchor="middle" fontSize="12" fill="#666">步骤3：成熟</text>
                
                <g transform="translate(20, 30)">
                  <path d="M0,25 Q30,5 60,25" stroke={defaultColors.mirna} strokeWidth="3" fill="none"/>
                  <path d="M0,25 Q30,45 60,25" stroke={defaultColors.mirna} strokeWidth="3" fill="none"/>
                  <text x="30" y="30" textAnchor="middle" fontSize="9" fill="#B45309">miRNA</text>
                  
                  <ellipse cx="30" cy="-5" rx="20" ry="10" fill="#3B82F6" fillOpacity="0.3" stroke="#3B82F6" strokeWidth="2"/>
                  <text x="30" y="-2" textAnchor="middle" fontSize="7" fill="#1D4ED8">Dicer</text>
                </g>
              </g>

              <path d="M530,80 L530,120" stroke="#F59E0B" strokeWidth="3" markerEnd="url(#arrow-amber)"/>

              <g transform="translate(50, 140)">
                <text x="100" y="15" textAnchor="middle" fontSize="12" fill="#666">步骤4：RISC装载</text>
                
                <g transform="translate(30, 30)">
                  <ellipse cx="70" cy="30" rx="60" ry="25" fill={defaultColors.risc} fillOpacity="0.3" stroke={defaultColors.risc} strokeWidth="2"/>
                  <text x="70" y="25" textAnchor="middle" fontSize="10" fill="#1D4ED8">RISC</text>
                  <text x="70" y="40" textAnchor="middle" fontSize="9" fill="#666">（RNA诱导沉默复合物）</text>
                  
                  <path d="M40,30 Q55,15 70,30" stroke={defaultColors.mirna} strokeWidth="2" fill="none"/>
                  <text x="55" y="22" textAnchor="middle" fontSize="8" fill="#B45309">miRNA</text>
                </g>
              </g>

              <path d="M200,200 L240,200" stroke="#F59E0B" strokeWidth="3" markerEnd="url(#arrow-amber)"/>

              <g transform="translate(250, 140)">
                <text x="100" y="15" textAnchor="middle" fontSize="12" fill="#666">步骤5：靶标识别</text>
                
                <g transform="translate(30, 30)">
                  <path d="M0,25 Q70,0 140,25" stroke={defaultColors.mrna} strokeWidth="3" fill="none"/>
                  <path d="M0,25 Q70,50 140,25" stroke={defaultColors.mrna} strokeWidth="3" fill="none"/>
                  <text x="70" y="30" textAnchor="middle" fontSize="10" fill="#059669">靶mRNA</text>
                  
                  <path d="M70,25 Q55,10 40,25" stroke={defaultColors.mirna} strokeWidth="2" fill="none"/>
                  <rect x="40" y="20" width="35" height="10" fill={defaultColors.mirna} fillOpacity="0.4" stroke={defaultColors.mirna} strokeWidth="1" rx="2"/>
                  <text x="57" y="28" textAnchor="middle" fontSize="7" fill="#B45309">互补</text>
                </g>
              </g>

              <path d="M400,200 L440,200" stroke="#F59E0B" strokeWidth="3" markerEnd="url(#arrow-amber)"/>

              <g transform="translate(450, 140)">
                <text x="50" y="15" textAnchor="middle" fontSize="12" fill="#666">步骤6：沉默</text>
                
                <g transform="translate(20, 30)">
                  <path d="M0,25 Q30,5 60,25" stroke={defaultColors.mrna} strokeDasharray="4,2" strokeWidth="2" fill="none"/>
                  <path d="M0,25 Q30,45 60,25" stroke={defaultColors.mrna} strokeDasharray="4,2" strokeWidth="2" fill="none"/>
                  <text x="30" y="40" textAnchor="middle" fontSize="9" fill="#666">抑制翻译</text>
                  <text x="30" y="55" textAnchor="middle" fontSize="9" fill="#666">或降解</text>
                </g>
              </g>

              <g transform="translate(50, 250)">
                <rect x="0" y="0" width="500" height="120" fill="white" stroke={defaultColors.mirna} strokeWidth="2" rx="8"/>
                
                <text x="250" y="25" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#B45309">miRNA特点</text>
                
                <g transform="translate(20, 40)">
                  <rect x="0" y="0" width="150" height="60" fill="#FFFBEB" stroke="#F59E0B" strokeWidth="1" rx="4"/>
                  <text x="75" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#B45309">不完全互补</text>
                  <text x="75" y="40" textAnchor="middle" fontSize="8" fill="#666">通常与靶mRNA</text>
                  <text x="75" y="52" textAnchor="middle" fontSize="8" fill="#666">不完全配对</text>
                </g>
                
                <g transform="translate(175, 40)">
                  <rect x="0" y="0" width="150" height="60" fill="#FFFBEB" stroke="#F59E0B" strokeWidth="1" rx="4"/>
                  <text x="75" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#B45309">抑制翻译</text>
                  <text x="75" y="40" textAnchor="middle" fontSize="8" fill="#666">主要抑制蛋白</text>
                  <text x="75" y="52" textAnchor="middle" fontSize="8" fill="#666">合成</text>
                </g>
                
                <g transform="translate(330, 40)">
                  <rect x="0" y="0" width="150" height="60" fill="#FFFBEB" stroke="#F59E0B" strokeWidth="1" rx="4"/>
                  <text x="75" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#B45309">多个靶标</text>
                  <text x="75" y="40" textAnchor="middle" fontSize="8" fill="#666">一个miRNA可</text>
                  <text x="75" y="52" textAnchor="middle" fontSize="8" fill="#666">调控多个基因</text>
                </g>
              </g>
            </svg>
          </div>
        </div>
      )}

      {activeTab === 'sirna' && (
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-red-800">siRNA（小干扰RNA）机制</h3>
          
          <div className="flex justify-center">
            <svg width="600" height="350" viewBox="0 0 600 350">
              <text x="300" y="25" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1976D2">siRNA作用机制</text>

              <g transform="translate(50, 50)">
                <text x="100" y="15" textAnchor="middle" fontSize="12" fill="#666">dsRNA</text>
                
                <g transform="translate(30, 30)">
                  <path d="M0,25 Q70,0 140,25" stroke={defaultColors.sirna} strokeWidth="3" fill="none"/>
                  <path d="M0,25 Q70,50 140,25" stroke={defaultColors.sirna} strokeWidth="3" fill="none"/>
                  <text x="70" y="30" textAnchor="middle" fontSize="10" fill="#DC2626">双链RNA</text>
                </g>
              </g>

              <path d="M200,80 L240,80" stroke="#EF4444" strokeWidth="3" markerEnd="url(#arrow-amber)"/>

              <g transform="translate(250, 50)">
                <text x="100" y="15" textAnchor="middle" fontSize="12" fill="#666">Dicer切割</text>
                
                <g transform="translate(30, 30)">
                  <ellipse cx="70" cy="-10" rx="25" ry="12" fill="#3B82F6" fillOpacity="0.3" stroke="#3B82F6" strokeWidth="2"/>
                  <text x="70" y="-7" textAnchor="middle" fontSize="8" fill="#1D4ED8">Dicer</text>
                  
                  <path d="M20,25 Q45,10 70,25" stroke={defaultColors.sirna} strokeWidth="3" fill="none"/>
                  <path d="M20,25 Q45,40 70,25" stroke={defaultColors.sirna} strokeWidth="3" fill="none"/>
                  <text x="45" y="30" textAnchor="middle" fontSize="9" fill="#DC2626">siRNA</text>
                  
                  <text x="70" y="55" textAnchor="middle" fontSize="8" fill="#666">21-23 nt</text>
                </g>
              </g>

              <path d="M400,80 L440,80" stroke="#EF4444" strokeWidth="3" markerEnd="url(#arrow-amber)"/>

              <g transform="translate(450, 50)">
                <text x="50" y="15" textAnchor="middle" fontSize="12" fill="#666">RISC装载</text>
                
                <g transform="translate(20, 30)">
                  <ellipse cx="30" cy="30" rx="30" ry="20" fill={defaultColors.risc} fillOpacity="0.3" stroke={defaultColors.risc} strokeWidth="2"/>
                  <text x="30" y="35" textAnchor="middle" fontSize="9" fill="#1D4ED8">RISC</text>
                  
                  <path d="M15,20 Q22,10 30,20" stroke={defaultColors.sirna} strokeWidth="2" fill="none"/>
                </g>
              </g>

              <path d="M530,80 L530,130" stroke="#EF4444" strokeWidth="3" markerEnd="url(#arrow-amber)"/>

              <g transform="translate(50, 150)">
                <text x="250" y="15" textAnchor="middle" fontSize="12" fill="#666">靶mRNA降解</text>
                
                <g transform="translate(80, 30)">
                  <ellipse cx="100" cy="30" rx="80" ry="25" fill={defaultColors.risc} fillOpacity="0.2" stroke={defaultColors.risc} strokeWidth="2"/>
                  <text x="100" y="25" textAnchor="middle" fontSize="10" fill="#1D4ED8">RISC-siRNA</text>
                  
                  <path d="M30,30 Q65,10 100,30 Q135,50 170,30" stroke={defaultColors.mrna} strokeWidth="3" fill="none"/>
                  <path d="M30,30 Q65,50 100,30 Q135,10 170,30" stroke={defaultColors.mrna} strokeWidth="3" fill="none"/>
                  <text x="100" y="60" textAnchor="middle" fontSize="9" fill="#059669">靶mRNA</text>
                  
                  <path d="M100,30 Q85,15 70,30" stroke={defaultColors.sirna} strokeWidth="2" fill="none"/>
                  <text x="85" y="22" textAnchor="middle" fontSize="8" fill="#DC2626">siRNA</text>
                  
                  <text x="100" y="5" textAnchor="middle" fontSize="8" fill="#666">完全互补</text>
                </g>
              </g>

              <g transform="translate(50, 240)">
                <rect x="0" y="0" width="500" height="90" fill="white" stroke={defaultColors.sirna} strokeWidth="2" rx="8"/>
                
                <text x="250" y="20" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#DC2626">siRNA特点</text>
                
                <g transform="translate(20, 30)">
                  <rect x="0" y="0" width="155" height="45" fill="#FEF2F2" stroke="#EF4444" strokeWidth="1" rx="4"/>
                  <text x="77" y="15" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#DC2626">完全互补</text>
                  <text x="77" y="32" textAnchor="middle" fontSize="8" fill="#666">与靶mRNA完全配对</text>
                </g>
                
                <g transform="translate(175, 30)">
                  <rect x="0" y="0" width="155" height="45" fill="#FEF2F2" stroke="#EF4444" strokeWidth="1" rx="4"/>
                  <text x="77" y="15" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#DC2626">降解mRNA</text>
                  <text x="77" y="32" textAnchor="middle" fontSize="8" fill="#666">切割并降解靶标</text>
                </g>
                
                <g transform="translate(330, 30)">
                  <rect x="0" y="0" width="150" height="45" fill="#FEF2F2" stroke="#EF4444" strokeWidth="1" rx="4"/>
                  <text x="75" y="15" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#DC2626">高度特异性</text>
                  <text x="75" y="32" textAnchor="middle" fontSize="8" fill="#666">只靶向特定序列</text>
                </g>
              </g>
            </svg>
          </div>
        </div>
      )}

      {activeTab === 'mechanism' && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-purple-800">RNA干扰的作用机制</h3>
          
          <div className="flex justify-center">
            <svg width="600" height="350" viewBox="0 0 600 350">
              <text x="300" y="25" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1976D2">RNA干扰核心机制</text>

              <g transform="translate(50, 50)">
                <rect x="0" y="0" width="500" height="250" fill="white" stroke={defaultColors.risc} strokeWidth="2" rx="8"/>
                
                <text x="250" y="25" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#6D28D9">RISC复合物组装</text>
                
                <g transform="translate(20, 40)">
                  <rect x="0" y="0" width="230" height="90" fill="#F3E8FF" stroke="#8B5CF6" strokeWidth="1" rx="4"/>
                  <text x="115" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#6D28D9">步骤1：双链RNA装载</text>
                  <text x="115" y="45" textAnchor="middle" fontSize="8" fill="#666">• siRNA/miRNA双链</text>
                  <text x="115" y="60" textAnchor="middle" fontSize="8" fill="#666">• 结合到Ago2蛋白</text>
                  <text x="115" y="75" textAnchor="middle" fontSize="8" fill="#666">• 形成前RISC复合物</text>
                </g>
                
                <g transform="translate(250, 40)">
                  <rect x="0" y="0" width="230" height="90" fill="#F3E8FF" stroke="#8B5CF6" strokeWidth="1" rx="4"/>
                  <text x="115" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#6D28D9">步骤2：乘客链去除</text>
                  <text x="115" y="45" textAnchor="middle" fontSize="8" fill="#666">• 保留引导链</text>
                  <text x="115" y="60" textAnchor="middle" fontSize="8" fill="#666">• 降解乘客链</text>
                  <text x="115" y="75" textAnchor="middle" fontSize="8" fill="#666">• 形成成熟RISC</text>
                </g>
                
                <g transform="translate(20, 140)">
                  <rect x="0" y="0" width="230" height="90" fill="#F3E8FF" stroke="#8B5CF6" strokeWidth="1" rx="4"/>
                  <text x="115" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#6D28D9">步骤3：靶标识别</text>
                  <text x="115" y="45" textAnchor="middle" fontSize="8" fill="#666">• 引导链与mRNA配对</text>
                  <text x="115" y="60" textAnchor="middle" fontSize="8" fill="#666">• 识别互补序列</text>
                  <text x="115" y="75" textAnchor="middle" fontSize="8" fill="#666">• 形成三元复合物</text>
                </g>
                
                <g transform="translate(250, 140)">
                  <rect x="0" y="0" width="230" height="90" fill="#F3E8FF" stroke="#8B5CF6" strokeWidth="1" rx="4"/>
                  <text x="115" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#6D28D9">步骤4：基因沉默</text>
                  <text x="115" y="45" textAnchor="middle" fontSize="8" fill="#666">• 切割mRNA（siRNA）</text>
                  <text x="115" y="60" textAnchor="middle" fontSize="8" fill="#666">• 抑制翻译（miRNA）</text>
                  <text x="115" y="75" textAnchor="middle" fontSize="8" fill="#666">• 调控基因表达</text>
                </g>
              </g>
            </svg>
          </div>
        </div>
      )}

      {activeTab === 'applications' && (
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-orange-800">RNA干扰的应用</h3>
          
          <div className="flex justify-center">
            <svg width="600" height="400" viewBox="0 0 600 400">
              <text x="300" y="25" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1976D2">RNA干扰的应用领域</text>

              <g transform="translate(50, 50)">
                <rect x="0" y="0" width="500" height="320" fill="white" stroke={defaultColors.sirna} strokeWidth="2" rx="8"/>
                
                <text x="250" y="25" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#DC2626">主要应用</text>
                
                <g transform="translate(20, 40)">
                  <rect x="0" y="0" width="230" height="130" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1" rx="4"/>
                  <text x="115" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#B45309">功能基因组学研究</text>
                  <text x="115" y="45" textAnchor="middle" fontSize="8" fill="#666">• 基因功能鉴定</text>
                  <text x="115" y="60" textAnchor="middle" fontSize="8" fill="#666">• 基因敲低</text>
                  <text x="115" y="75" textAnchor="middle" fontSize="8" fill="#666">• 信号通路研究</text>
                  <text x="115" y="90" textAnchor="middle" fontSize="8" fill="#666">• 药物靶点验证</text>
                  <text x="115" y="105" textAnchor="middle" fontSize="8" fill="#666">• 高通量筛选</text>
                </g>
                
                <g transform="translate(250, 40)">
                  <rect x="0" y="0" width="230" height="130" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1" rx="4"/>
                  <text x="115" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1D4ED8">基因治疗</text>
                  <text x="115" y="45" textAnchor="middle" fontSize="8" fill="#666">• 癌症治疗</text>
                  <text x="115" y="60" textAnchor="middle" fontSize="8" fill="#666">• 病毒感染</text>
                  <text x="115" y="75" textAnchor="middle" fontSize="8" fill="#666">• 遗传疾病</text>
                  <text x="115" y="90" textAnchor="middle" fontSize="8" fill="#666">• 自身免疫病</text>
                  <text x="115" y="105" textAnchor="middle" fontSize="8" fill="#666">• 神经退行性疾病</text>
                </g>
                
                <g transform="translate(20, 180)">
                  <rect x="0" y="0" width="230" height="130" fill="#D1FAE5" stroke="#10B981" strokeWidth="1" rx="4"/>
                  <text x="115" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#059669">农业应用</text>
                  <text x="115" y="45" textAnchor="middle" fontSize="8" fill="#666">• 抗虫作物</text>
                  <text x="115" y="60" textAnchor="middle" fontSize="8" fill="#666">• 抗病毒作物</text>
                  <text x="115" y="75" textAnchor="middle" fontSize="8" fill="#666">• 改善品质</text>
                  <text x="115" y="90" textAnchor="middle" fontSize="8" fill="#666">• 延长保鲜</text>
                  <text x="115" y="105" textAnchor="middle" fontSize="8" fill="#666">• 营养强化</text>
                </g>
                
                <g transform="translate(250, 180)">
                  <rect x="0" y="0" width="230" height="130" fill="#F3E8FF" stroke="#8B5CF6" strokeWidth="1" rx="4"/>
                  <text x="115" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#6D28D9">诊断与检测</text>
                  <text x="115" y="45" textAnchor="middle" fontSize="8" fill="#666">• 疾病诊断</text>
                  <text x="115" y="60" textAnchor="middle" fontSize="8" fill="#666">• 生物标志物</text>
                  <text x="115" y="75" textAnchor="middle" fontSize="8" fill="#666">• 病毒检测</text>
                  <text x="115" y="90" textAnchor="middle" fontSize="8" fill="#666">• 药物响应</text>
                  <text x="115" y="105" textAnchor="middle" fontSize="8" fill="#666">• 预后评估</text>
                </g>
              </g>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
