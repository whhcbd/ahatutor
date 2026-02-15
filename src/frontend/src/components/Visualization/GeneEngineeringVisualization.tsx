import { useState } from 'react';

interface GeneEngineeringVisualizationProps {
  data: any;
  colors?: Record<string, string>;
}

export function GeneEngineeringVisualization({ data, colors }: GeneEngineeringVisualizationProps) {
  const [activeTab, setActiveTab] = useState<'cloning' | 'vector' | 'expression' | 'applications'>('cloning');

  const defaultColors = {
    dna: colors?.dna || '#10B981',
    insert: colors?.insert || '#3B82F6',
    vector: colors?.vector || '#F59E0B',
    enzyme: colors?.enzyme || '#EF4444',
    promoter: colors?.promoter || '#8B5CF6',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('cloning')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'cloning'
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          基因克隆
        </button>
        <button
          onClick={() => setActiveTab('vector')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'vector'
              ? 'bg-green-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          载体系统
        </button>
        <button
          onClick={() => setActiveTab('expression')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'expression'
              ? 'bg-purple-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          基因表达
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

      {activeTab === 'cloning' && (
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-blue-800">基因克隆流程</h3>
          
          <div className="flex justify-center">
            <svg width="600" height="450" viewBox="0 0 600 450">
              <defs>
                <marker id="arrow-blue" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L9,3 z" fill="#3B82F6"/>
                </marker>
              </defs>

              <text x="300" y="25" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1976D2">基因克隆步骤</text>

              <g transform="translate(50, 50)">
                <text x="100" y="15" textAnchor="middle" fontSize="12" fill="#666">步骤1：DNA提取</text>
                
                <g transform="translate(30, 30)">
                  <rect x="0" y="0" width="140" height="60" fill="white" stroke={defaultColors.dna} strokeWidth="2" rx="4"/>
                  <text x="70" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#059669">目标基因</text>
                  <text x="70" y="40" textAnchor="middle" fontSize="8" fill="#666">从供体生物</text>
                  <text x="70" y="52" textAnchor="middle" fontSize="8" fill="#666">提取DNA</text>
                </g>
              </g>

              <path d="M150,120 L190,120" stroke="#3B82F6" strokeWidth="3" markerEnd="url(#arrow-blue)"/>

              <g transform="translate(200, 50)">
                <text x="100" y="15" textAnchor="middle" fontSize="12" fill="#666">步骤2：限制酶切</text>
                
                <g transform="translate(30, 30)">
                  <rect x="0" y="0" width="140" height="60" fill="white" stroke={defaultColors.enzyme} strokeWidth="2" rx="4"/>
                  <text x="70" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#DC2626">限制酶</text>
                  <text x="70" y="40" textAnchor="middle" fontSize="8" fill="#666">EcoRI, BamHI等</text>
                  <text x="70" y="52" textAnchor="middle" fontSize="8" fill="#666">产生粘性末端</text>
                </g>
              </g>

              <path d="M350,120 L390,120" stroke="#3B82F6" strokeWidth="3" markerEnd="url(#arrow-blue)"/>

              <g transform="translate(400, 50)">
                <text x="100" y="15" textAnchor="middle" fontSize="12" fill="#666">步骤3：连接载体</text>
                
                <g transform="translate(30, 30)">
                  <rect x="0" y="0" width="140" height="60" fill="white" stroke={defaultColors.vector} strokeWidth="2" rx="4"/>
                  <text x="70" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#B45309">DNA连接酶</text>
                  <text x="70" y="40" textAnchor="middle" fontSize="8" fill="#666">T4 DNA Ligase</text>
                  <text x="70" y="52" textAnchor="middle" fontSize="8" fill="#666">连接基因与载体</text>
                </g>
              </g>

              <path d="M500,120 L500,160" stroke="#3B82F6" strokeWidth="3" markerEnd="url(#arrow-blue)"/>

              <g transform="translate(50, 180)">
                <text x="250" y="15" textAnchor="middle" fontSize="12" fill="#666">步骤4：转化与筛选</text>
                
                <g transform="translate(30, 30)">
                  <rect x="0" y="0" width="200" height="100" fill="white" stroke={defaultColors.dna} strokeWidth="2" rx="4"/>
                  <text x="100" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#059669">重组质粒</text>
                  
                  <g transform="translate(20, 35)">
                    <ellipse cx="80" cy="25" rx="70" ry="20" fill={defaultColors.vector} fillOpacity="0.3" stroke={defaultColors.vector} strokeWidth="2"/>
                    <text x="80" y="30" textAnchor="middle" fontSize="9" fill="#B45309">载体DNA</text>
                    
                    <rect x="50" y="15" width="60" height="20" fill={defaultColors.insert} fillOpacity="0.4" stroke={defaultColors.insert} strokeWidth="1" rx="2"/>
                    <text x="80" y="28" textAnchor="middle" fontSize="7" fill="#1D4ED8">插入基因</text>
                  </g>
                </g>
                
                <g transform="translate(250, 30)">
                  <rect x="0" y="0" width="200" height="100" fill="white" stroke={defaultColors.dna} strokeWidth="2" rx="4"/>
                  <text x="100" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#059669">转化宿主</text>
                  
                  <g transform="translate(40, 35)">
                    <ellipse cx="60" cy="25" rx="45" ry="35" fill="#10B981" fillOpacity="0.2" stroke="#10B981" strokeWidth="2"/>
                    <text x="60" y="30" textAnchor="middle" fontSize="9" fill="#059669">E.coli</text>
                    
                    <ellipse cx="60" cy="15" rx="15" ry="8" fill={defaultColors.vector} fillOpacity="0.4" stroke={defaultColors.vector} strokeWidth="1"/>
                    <text x="60" y="18" textAnchor="middle" fontSize="6" fill="#B45309">质粒</text>
                  </g>
                </g>
              </g>

              <path d="M300,330 L300,370" stroke="#3B82F6" strokeWidth="3" markerEnd="url(#arrow-blue)"/>

              <g transform="translate(50, 380)">
                <rect x="0" y="0" width="500" height="50" fill="white" stroke={defaultColors.dna} strokeWidth="2" rx="4"/>
                <text x="250" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#059669">步骤5：扩增与验证</text>
                <text x="250" y="38" textAnchor="middle" fontSize="8" fill="#666">培养扩增 · PCR验证 · 测序分析</text>
              </g>
            </svg>
          </div>
        </div>
      )}

      {activeTab === 'vector' && (
        <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-green-800">载体系统</h3>
          
          <div className="flex justify-center">
            <svg width="600" height="400" viewBox="0 0 600 400">
              <text x="300" y="25" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1976D2">质粒载体结构</text>

              <g transform="translate(200, 60)">
                <ellipse cx="100" cy="100" rx="90" ry="90" fill={defaultColors.vector} fillOpacity="0.2" stroke={defaultColors.vector} strokeWidth="3"/>
                
                <g transform="translate(100, 50)">
                  <circle cx="0" cy="0" r="20" fill={defaultColors.promoter} fillOpacity="0.4" stroke={defaultColors.promoter} strokeWidth="2"/>
                  <text x="0" y="4" textAnchor="middle" fontSize="9" fill="#6D28D9">启动子</text>
                  <text x="0" y="15" textAnchor="middle" fontSize="7" fill="#6D28D9">Promoter</text>
                </g>
                
                <g transform="translate(160, 80)">
                  <circle cx="0" cy="0" r="18" fill={defaultColors.insert} fillOpacity="0.4" stroke={defaultColors.insert} strokeWidth="2"/>
                  <text x="0" y="4" textAnchor="middle" fontSize="8" fill="#1D4ED8">MCS</text>
                  <text x="0" y="14" textAnchor="middle" fontSize="6" fill="#1D4ED8">克隆位点</text>
                </g>
                
                <g transform="translate(140, 140)">
                  <circle cx="0" cy="0" r="18" fill={defaultColors.promoter} fillOpacity="0.4" stroke={defaultColors.promoter} strokeWidth="2"/>
                  <text x="0" y="4" textAnchor="middle" fontSize="8" fill="#6D28D9">Term</text>
                  <text x="0" y="14" textAnchor="middle" fontSize="6" fill="#6D28D9">终止子</text>
                </g>
                
                <g transform="translate(50, 130)">
                  <circle cx="0" cy="0" r="20" fill={defaultColors.enzyme} fillOpacity="0.4" stroke={defaultColors.enzyme} strokeWidth="2"/>
                  <text x="0" y="4" textAnchor="middle" fontSize="8" fill="#DC2626">Ori</text>
                  <text x="0" y="15" textAnchor="middle" fontSize="7" fill="#DC2626">复制起点</text>
                </g>
                
                <g transform="translate(60, 60)">
                  <circle cx="0" cy="0" r="18" fill="#10B981" fillOpacity="0.4" stroke="#10B981" strokeWidth="2"/>
                  <text x="0" y="4" textAnchor="middle" fontSize="8" fill="#059669">Amp^R</text>
                  <text x="0" y="14" textAnchor="middle" fontSize="6" fill="#059669">抗性</text>
                </g>
              </g>

              <g transform="translate(50, 280)">
                <rect x="0" y="0" width="500" height="100" fill="white" stroke={defaultColors.vector} strokeWidth="2" rx="8"/>
                
                <text x="250" y="20" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#B45309">载体主要元件</text>
                
                <g transform="translate(10, 30)">
                  <rect x="0" y="0" width="120" height="60" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1" rx="4"/>
                  <text x="60" y="20" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#B45309">复制起点（Ori）</text>
                  <text x="60" y="40" textAnchor="middle" fontSize="8" fill="#666">质粒自主复制</text>
                  <text x="60" y="52" textAnchor="middle" fontSize="8" fill="#666">必需元件</text>
                </g>
                
                <g transform="translate(135, 30)">
                  <rect x="0" y="0" width="120" height="60" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1" rx="4"/>
                  <text x="60" y="20" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#B45309">筛选标记</text>
                  <text x="60" y="40" textAnchor="middle" fontSize="8" fill="#666">抗生素抗性</text>
                  <text x="60" y="52" textAnchor="middle" fontSize="8" fill="#666">筛选转化子</text>
                </g>
                
                <g transform="translate(260, 30)">
                  <rect x="0" y="0" width="115" height="60" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1" rx="4"/>
                  <text x="57" y="20" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#B45309">多克隆位点（MCS）</text>
                  <text x="57" y="40" textAnchor="middle" fontSize="8" fill="#666">多个酶切位点</text>
                  <text x="57" y="52" textAnchor="middle" fontSize="8" fill="#666">插入外源基因</text>
                </g>
                
                <g transform="translate(380, 30)">
                  <rect x="0" y="0" width="110" height="60" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1" rx="4"/>
                  <text x="55" y="20" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#B45309">表达元件</text>
                  <text x="55" y="40" textAnchor="middle" fontSize="8" fill="#666">启动子/终止子</text>
                  <text x="55" y="52" textAnchor="middle" fontSize="8" fill="#666">调控基因表达</text>
                </g>
              </g>
            </svg>
          </div>
        </div>
      )}

      {activeTab === 'expression' && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-purple-800">基因表达系统</h3>
          
          <div className="flex justify-center">
            <svg width="600" height="350" viewBox="0 0 600 350">
              <text x="300" y="25" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1976D2">原核与真核表达系统</text>

              <g transform="translate(50, 50)">
                <rect x="0" y="0" width="240" height="250" fill="white" stroke={defaultColors.dna} strokeWidth="2" rx="8"/>
                
                <text x="120" y="25" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#059669">原核表达（E.coli）</text>
                
                <g transform="translate(20, 40)">
                  <rect x="0" y="0" width="200" height="90" fill="#D1FAE5" stroke="#10B981" strokeWidth="1" rx="4"/>
                  <text x="100" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#059669">优点</text>
                  <text x="100" y="40" textAnchor="middle" fontSize="8" fill="#666">• 快速繁殖</text>
                  <text x="100" y="55" textAnchor="middle" fontSize="8" fill="#666">• 高产蛋白</text>
                  <text x="100" y="70" textAnchor="middle" fontSize="8" fill="#666">• 成本低廉</text>
                  <text x="100" y="85" textAnchor="middle" fontSize="8" fill="#666">• 易于操作</text>
                </g>
                
                <g transform="translate(20, 140)">
                  <rect x="0" y="0" width="200" height="90" fill="#FEE2E2" stroke="#EF4444" strokeWidth="1" rx="4"/>
                  <text x="100" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#DC2626">缺点</text>
                  <text x="100" y="40" textAnchor="middle" fontSize="8" fill="#666">• 无翻译后修饰</text>
                  <text x="100" y="55" textAnchor="middle" fontSize="8" fill="#666">• 包含体形成</text>
                  <text x="100" y="70" textAnchor="middle" fontSize="8" fill="#666">• 蛋白活性低</text>
                  <text x="100" y="85" textAnchor="middle" fontSize="8" fill="#666">• 毒性蛋白难表达</text>
                </g>
              </g>

              <g transform="translate(310, 50)">
                <rect x="0" y="0" width="240" height="250" fill="white" stroke={defaultColors.dna} strokeWidth="2" rx="8"/>
                
                <text x="120" y="25" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#059669">真核表达（酵母/哺乳动物）</text>
                
                <g transform="translate(20, 40)">
                  <rect x="0" y="0" width="200" height="90" fill="#D1FAE5" stroke="#10B981" strokeWidth="1" rx="4"/>
                  <text x="100" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#059669">优点</text>
                  <text x="100" y="40" textAnchor="middle" fontSize="8" fill="#666">• 翻译后修饰</text>
                  <text x="100" y="55" textAnchor="middle" fontSize="8" fill="#666">• 蛋白活性高</text>
                  <text x="100" y="70" textAnchor="middle" fontSize="8" fill="#666">• 正确折叠</text>
                  <text x="100" y="85" textAnchor="middle" fontSize="8" fill="#666">• 分泌表达</text>
                </g>
                
                <g transform="translate(20, 140)">
                  <rect x="0" y="0" width="200" height="90" fill="#FEE2E2" stroke="#EF4444" strokeWidth="1" rx="4"/>
                  <text x="100" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#DC2626">缺点</text>
                  <text x="100" y="40" textAnchor="middle" fontSize="8" fill="#666">• 培养条件复杂</text>
                  <text x="100" y="55" textAnchor="middle" fontSize="8" fill="#666">• 表达量较低</text>
                  <text x="100" y="70" textAnchor="middle" fontSize="8" fill="#666">• 成本较高</text>
                  <text x="100" y="85" textAnchor="middle" fontSize="8" fill="#666">• 培养周期长</text>
                </g>
              </g>
            </svg>
          </div>
        </div>
      )}

      {activeTab === 'applications' && (
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-orange-800">基因工程的应用</h3>
          
          <div className="flex justify-center">
            <svg width="600" height="400" viewBox="0 0 600 400">
              <text x="300" y="25" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1976D2">基因工程应用领域</text>

              <g transform="translate(50, 50)">
                <rect x="0" y="0" width="500" height="320" fill="white" stroke={defaultColors.insert} strokeWidth="2" rx="8"/>
                
                <text x="250" y="25" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1D4ED8">主要应用</text>
                
                <g transform="translate(20, 40)">
                  <rect x="0" y="0" width="150" height="130" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1" rx="4"/>
                  <text x="75" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1D4ED8">医学</text>
                  <text x="75" y="45" textAnchor="middle" fontSize="8" fill="#666">• 基因治疗</text>
                  <text x="75" y="60" textAnchor="middle" fontSize="8" fill="#666">• 疫苗开发</text>
                  <text x="75" y="75" textAnchor="middle" fontSize="8" fill="#666">• 药物生产</text>
                  <text x="75" y="90" textAnchor="middle" fontSize="8" fill="#666">• 诊断试剂</text>
                  <text x="75" y="105" textAnchor="middle" fontSize="8" fill="#666">• 基因检测</text>
                </g>
                
                <g transform="translate(175, 40)">
                  <rect x="0" y="0" width="150" height="130" fill="#D1FAE5" stroke="#10B981" strokeWidth="1" rx="4"/>
                  <text x="75" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#059669">农业</text>
                  <text x="75" y="45" textAnchor="middle" fontSize="8" fill="#666">• 转基因作物</text>
                  <text x="75" y="60" textAnchor="middle" fontSize="8" fill="#666">• 抗虫抗病</text>
                  <text x="75" y="75" textAnchor="middle" fontSize="8" fill="#666">• 抗除草剂</text>
                  <text x="75" y="90" textAnchor="middle" fontSize="8" fill="#666">• 营养强化</text>
                  <text x="75" y="105" textAnchor="middle" fontSize="8" fill="#666">• 生物农药</text>
                </g>
                
                <g transform="translate(330, 40)">
                  <rect x="0" y="0" width="150" height="130" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1" rx="4"/>
                  <text x="75" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#B45309">工业</text>
                  <text x="75" y="45" textAnchor="middle" fontSize="8" fill="#666">• 酶制剂</text>
                  <text x="75" y="60" textAnchor="middle" fontSize="8" fill="#666">• 生物燃料</text>
                  <text x="75" y="75" textAnchor="middle" fontSize="8" fill="#666">• 生物材料</text>
                  <text x="75" y="90" textAnchor="middle" fontSize="8" fill="#666">• 食品添加剂</text>
                  <text x="75" y="105" textAnchor="middle" fontSize="8" fill="#666">• 环境修复</text>
                </g>
                
                <g transform="translate(20, 180)">
                  <rect x="0" y="0" width="150" height="120" fill="#F3E8FF" stroke="#8B5CF6" strokeWidth="1" rx="4"/>
                  <text x="75" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#6D28D9">科研</text>
                  <text x="75" y="45" textAnchor="middle" fontSize="8" fill="#666">• 基因功能研究</text>
                  <text x="75" y="60" textAnchor="middle" fontSize="8" fill="#666">• 蛋白表达</text>
                  <text x="75" y="75" textAnchor="middle" fontSize="8" fill="#666">• 疾病模型</text>
                  <text x="75" y="90" textAnchor="middle" fontSize="8" fill="#666">• 药物筛选</text>
                  <text x="75" y="105" textAnchor="middle" fontSize="8" fill="#666">• 基因编辑</text>
                </g>
                
                <g transform="translate(175, 180)">
                  <rect x="0" y="0" width="150" height="120" fill="#FEE2E2" stroke="#EF4444" strokeWidth="1" rx="4"/>
                  <text x="75" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#DC2626">环境</text>
                  <text x="75" y="45" textAnchor="middle" fontSize="8" fill="#666">• 污染降解</text>
                  <text x="75" y="60" textAnchor="middle" fontSize="8" fill="#666">• 重金属吸附</text>
                  <text x="75" y="75" textAnchor="middle" fontSize="8" fill="#666">• 废物处理</text>
                  <text x="75" y="90" textAnchor="middle" fontSize="8" fill="#666">• 生态修复</text>
                  <text x="75" y="105" textAnchor="middle" fontSize="8" fill="#666">• 生物监测</text>
                </g>
                
                <g transform="translate(330, 180)">
                  <rect x="0" y="0" width="150" height="120" fill="#F0ABFC" stroke="#D946EF" strokeWidth="1" rx="4"/>
                  <text x="75" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#A21CAF">新兴应用</text>
                  <text x="75" y="45" textAnchor="middle" fontSize="8" fill="#666">• 合成生物学</text>
                  <text x="75" y="60" textAnchor="middle" fontSize="8" fill="#666">• 基因驱动</text>
                  <text x="75" y="75" textAnchor="middle" fontSize="8" fill="#666">• 定向进化</text>
                  <text x="75" y="90" textAnchor="middle" fontSize="8" fill="#666">• 细胞工厂</text>
                  <text x="75" y="105" textAnchor="middle" fontSize="8" fill="#666">• 基因存储</text>
                </g>
              </g>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
