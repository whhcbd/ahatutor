import { useState } from 'react';

interface GeneCloningVisualizationProps {
  data: any;
  colors?: Record<string, string>;
}

export function GeneCloningVisualization({ data, colors }: GeneCloningVisualizationProps) {
  const [activeTab, setActiveTab] = useState<'workflow' | 'geneAcquisition' | 'vector' | 'transformation' | 'screening' | 'expression' | 'purification'>('workflow');

  const defaultColors = {
    gene: colors?.gene || '#4CAF50',
    vector: colors?.vector || '#2196F3',
    transformation: colors?.transformation || '#FF9800',
    screening: colors?.screening || '#9C27B0',
    expression: colors?.expression || '#F44336',
    purification: colors?.purification || '#7B1FA2',
    dna: '#2196F3',
    protein: '#FF9800',
  };

  const tabs = [
    { id: 'workflow' as const, label: '完整流程' },
    { id: 'geneAcquisition' as const, label: '目的基因获取' },
    { id: 'vector' as const, label: '载体构建' },
    { id: 'transformation' as const, label: '转化/转染' },
    { id: 'screening' as const, label: '克隆筛选' },
    { id: 'expression' as const, label: '表达系统' },
    { id: 'purification' as const, label: '蛋白纯化' },
  ];

  return (
    <div className="w-full p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">基因克隆技术可视化</h3>
        <p className="text-gray-600">展示基因克隆的完整流程：从目的基因获取到重组蛋白表达和纯化的全过程</p>
      </div>

      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        {activeTab === 'workflow' && (
          <div>
            <h4 className="text-lg font-semibold mb-4">基因克隆完整流程</h4>
            
            <div className="flex justify-center mb-6">
              <svg width="800" height="400" viewBox="0 0 800 400">
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
                  </marker>
                </defs>
                
                <g transform="translate(50, 50)">
                  <rect x="0" y="0" width="120" height="80" fill={defaultColors.gene} fillOpacity="0.6" rx="10" />
                  <text x="60" y="35" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">目的基因获取</text>
                  <text x="60" y="55" textAnchor="middle" fontSize="10" fill="white">PCR/酶切/合成</text>
                </g>
                
                <line x1="170" y1="90" x2="210" y2="90" stroke="#666" strokeWidth="2" markerEnd="url(#arrowhead)" />
                
                <g transform="translate(220, 50)">
                  <rect x="0" y="0" width="120" height="80" fill={defaultColors.vector} fillOpacity="0.6" rx="10" />
                  <text x="60" y="35" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">载体构建</text>
                  <text x="60" y="55" textAnchor="middle" fontSize="10" fill="white">酶切连接</text>
                </g>
                
                <line x1="340" y1="90" x2="380" y2="90" stroke="#666" strokeWidth="2" markerEnd="url(#arrowhead)" />
                
                <g transform="translate(390, 50)">
                  <rect x="0" y="0" width="120" height="80" fill={defaultColors.transformation} fillOpacity="0.6" rx="10" />
                  <text x="60" y="35" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">转化/转染</text>
                  <text x="60" y="55" textAnchor="middle" fontSize="10" fill="white">导入宿主</text>
                </g>
                
                <line x1="510" y1="90" x2="550" y2="90" stroke="#666" strokeWidth="2" markerEnd="url(#arrowhead)" />
                
                <g transform="translate(560, 50)">
                  <rect x="0" y="0" width="120" height="80" fill={defaultColors.screening} fillOpacity="0.6" rx="10" />
                  <text x="60" y="35" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">克隆筛选</text>
                  <text x="60" y="55" textAnchor="middle" fontSize="10" fill="white">鉴定验证</text>
                </g>
                
                <line x1="680" y1="90" x2="720" y2="90" stroke="#666" strokeWidth="2" markerEnd="url(#arrowhead)" />
                
                <g transform="translate(130, 180)">
                  <rect x="0" y="0" width="120" height="80" fill={defaultColors.expression} fillOpacity="0.6" rx="10" />
                  <text x="60" y="35" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">蛋白表达</text>
                  <text x="60" y="55" textAnchor="middle" fontSize="10" fill="white">诱导表达</text>
                </g>
                
                <line x1="250" y1="220" x2="290" y2="220" stroke="#666" strokeWidth="2" markerEnd="url(#arrowhead)" />
                
                <g transform="translate(300, 180)">
                  <rect x="0" y="0" width="120" height="80" fill={defaultColors.purification} fillOpacity="0.6" rx="10" />
                  <text x="60" y="35" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">蛋白纯化</text>
                  <text x="60" y="55" textAnchor="middle" fontSize="10" fill="white">层析分离</text>
                </g>
                
                <line x1="560" y1="130" x2="560" y2="170" stroke="#666" strokeWidth="2" markerEnd="url(#arrowhead)" />
                
                <line x1="420" y1="130" x2="420" y2="170" stroke="#666" strokeWidth="2" markerEnd="url(#arrowhead)" />
                <line x1="420" y1="220" x2="480" y2="220" stroke="#666" strokeWidth="2" />
                <line x1="480" y1="220" x2="480" y2="260" stroke="#666" strokeWidth="2" markerEnd="url(#arrowhead)" />
                
                <g transform="translate(440, 280)">
                  <rect x="0" y="0" width="140" height="60" fill="#4CAF50" fillOpacity="0.6" rx="10" />
                  <text x="70" y="25" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">重组蛋白</text>
                  <text x="70" y="45" textAnchor="middle" fontSize="10" fill="white">获得目的产物</text>
                </g>
                
                <g transform="translate(250, 320)">
                  <text fontSize="11" fill="#666">
                    <tspan x="0" dy="0">步骤1-5：基因克隆与载体构建</tspan>
                    <tspan x="0" dy="20">步骤6-7：蛋白表达与纯化</tspan>
                  </text>
                </g>
              </svg>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-semibold mb-2">基因获取</h5>
                <p>• PCR扩增</p>
                <p>• 限制酶切</p>
                <p>• 化学合成</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-semibold mb-2">载体构建</h5>
                <p>• 酶切连接</p>
                <p>• Gateway克隆</p>
                <p>• Gibson组装</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-semibold mb-2">转化筛选</h5>
                <p>• 抗生素筛选</p>
                <p>• 蓝白斑筛选</p>
                <p>• 测序验证</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'geneAcquisition' && (
          <div>
            <h4 className="text-lg font-semibold mb-4">目的基因获取</h4>
            
            <div className="flex justify-center mb-6">
              <svg width="600" height="350" viewBox="0 0 600 350">
                <g transform="translate(50, 30)">
                  <rect x="0" y="0" width="150" height="100" fill={defaultColors.gene} fillOpacity="0.6" rx="10" />
                  <text x="75" y="45" textAnchor="middle" fontSize="14" fill="white" fontWeight="bold">PCR扩增</text>
                  <text x="75" y="70" textAnchor="middle" fontSize="10" fill="white">使用特异性引物</text>
                  <text x="75" y="85" textAnchor="middle" fontSize="9" fill="white">扩增目标基因</text>
                </g>
                
                <g transform="translate(230, 30)">
                  <rect x="0" y="0" width="150" height="100" fill={defaultColors.gene} fillOpacity="0.6" rx="10" />
                  <text x="75" y="45" textAnchor="middle" fontSize="14" fill="white" fontWeight="bold">限制酶切</text>
                  <text x="75" y="70" textAnchor="middle" fontSize="10" fill="white">从基因组或</text>
                  <text x="75" y="85" textAnchor="middle" fontSize="9" fill="white">cDNA文库获取</text>
                </g>
                
                <g transform="translate(410, 30)">
                  <rect x="0" y="0" width="150" height="100" fill={defaultColors.gene} fillOpacity="0.6" rx="10" />
                  <text x="75" y="45" textAnchor="middle" fontSize="14" fill="white" fontWeight="bold">化学合成</text>
                  <text x="75" y="70" textAnchor="middle" fontSize="10" fill="white">直接合成</text>
                  <text x="75" y="85" textAnchor="middle" fontSize="9" fill="white">基因序列</text>
                </g>
                
                <g transform="translate(50, 150)">
                  <rect x="0" y="0" width="510" height="80" fill="#f0f0f0" rx="10" />
                  <text x="255" y="30" textAnchor="middle" fontSize="12" fill="#333" fontWeight="bold">注意事项</text>
                  <text x="255" y="55" textAnchor="middle" fontSize="10" fill="#666">添加合适的酶切位点 • 去除内含子（如需要） • 确保阅读框正确</text>
                </g>
                
                <g transform="translate(50, 250)">
                  <text fontSize="11" fill="#333" fontWeight="bold">PCR扩增示意图：</text>
                  <g transform="translate(0, 30)">
                    <rect x="0" y="0" width="100" height="20" fill={defaultColors.dna} fillOpacity="0.3" />
                    <rect x="10" y="5" width="80" height="10" fill={defaultColors.gene} fillOpacity="0.8" />
                    <text x="50" y="15" textAnchor="middle" fontSize="8" fill="white">目的基因</text>
                  </g>
                  <text x="200" y="45" fontSize="10" fill="#666">引物1 5'-</text>
                  <text x="300" y="45" fontSize="10" fill="#666">-引物2 5'</text>
                  <text x="50" y="70" fontSize="10" fill="#666">变性 94°C</text>
                  <text x="150" y="70" fontSize="10" fill="#666">退火 50-65°C</text>
                  <text x="250" y="70" fontSize="10" fill="#666">延伸 72°C</text>
                </g>
              </svg>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h5 className="font-semibold mb-2">PCR扩增</h5>
                <p><strong>优点：</strong>快速、特异性高</p>
                <p><strong>适用：</strong>已知序列基因</p>
                <p><strong>引物设计：</strong>需添加酶切位点</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h5 className="font-semibold mb-2">限制酶切</h5>
                <p><strong>优点：</strong>可获取大片段</p>
                <p><strong>适用：</strong>文库筛选</p>
                <p><strong>注意：</strong>需确认酶切位点</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h5 className="font-semibold mb-2">化学合成</h5>
                <p><strong>优点：</strong>精确、快速</p>
                <p><strong>适用：</strong>短基因、优化序列</p>
                <p><strong>成本：</strong>较高</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'vector' && (
          <div>
            <h4 className="text-lg font-semibold mb-4">载体选择与构建</h4>
            
            <div className="flex justify-center mb-6">
              <svg width="600" height="400" viewBox="0 0 600 400">
                <g transform="translate(30, 30)">
                  <rect x="0" y="0" width="170" height="120" fill={defaultColors.vector} fillOpacity="0.6" rx="10" />
                  <text x="85" y="45" textAnchor="middle" fontSize="14" fill="white" fontWeight="bold">克隆载体</text>
                  <text x="85" y="70" textAnchor="middle" fontSize="10" fill="white">基因扩增和保存</text>
                  <text x="85" y="90" textAnchor="middle" fontSize="9" fill="white">高拷贝数、多克隆位点</text>
                </g>
                
                <g transform="translate(215, 30)">
                  <rect x="0" y="0" width="170" height="120" fill={defaultColors.vector} fillOpacity="0.6" rx="10" />
                  <text x="85" y="45" textAnchor="middle" fontSize="14" fill="white" fontWeight="bold">表达载体</text>
                  <text x="85" y="70" textAnchor="middle" fontSize="10" fill="white">蛋白表达</text>
                  <text x="85" y="90" textAnchor="middle" fontSize="9" fill="white">启动子、融合标签、筛选标记</text>
                </g>
                
                <g transform="translate(400, 30)">
                  <rect x="0" y="0" width="170" height="120" fill={defaultColors.vector} fillOpacity="0.6" rx="10" />
                  <text x="85" y="45" textAnchor="middle" fontSize="14" fill="white" fontWeight="bold">穿梭载体</text>
                  <text x="85" y="70" textAnchor="middle" fontSize="10" fill="white">在不同宿主间转移</text>
                  <text x="85" y="90" textAnchor="middle" fontSize="9" fill="white">多个复制原点</text>
                </g>
                
                <g transform="translate(50, 170)">
                  <rect x="0" y="0" width="500" height="80" fill="#f0f0f0" rx="10" />
                  <text x="250" y="30" textAnchor="middle" fontSize="12" fill="#333" fontWeight="bold">克隆方法</text>
                  <text x="250" y="55" textAnchor="middle" fontSize="10" fill="#666">限制酶切连接 • Gateway克隆 • Gibson组装 • TOPO克隆</text>
                </g>
                
                <g transform="translate(50, 270)">
                  <text fontSize="11" fill="#333" fontWeight="bold">载体构建示意图：</text>
                  <g transform="translate(0, 30)">
                    <line x1="0" y1="20" x2="200" y2="20" stroke={defaultColors.dna} strokeWidth="4" />
                    <text x="100" y="15" textAnchor="middle" fontSize="9" fill="#333">载体DNA</text>
                    
                    <rect x="80" y="15" width="40" height="10" fill="#f44336" />
                    <text x="100" y="24" textAnchor="middle" fontSize="7" fill="white">酶切</text>
                    
                    <line x1="250" y1="20" x2="350" y2="20" stroke={defaultColors.gene} strokeWidth="4" />
                    <text x="300" y="15" textAnchor="middle" fontSize="9" fill="#333">目的基因</text>
                    
                    <text x="400" y="25" fontSize="16" fill="#333">+</text>
                    
                    <g transform="translate(430, 10)">
                      <line x1="0" y1="10" x2="150" y2="10" stroke={defaultColors.dna} strokeWidth="4" />
                      <rect x="60" y="5" width="30" height="10" fill={defaultColors.gene} />
                      <text x="100" y="5" textAnchor="middle" fontSize="9" fill="#333">重组载体</text>
                    </g>
                  </g>
                </g>
              </svg>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-semibold mb-2">克隆方法比较</h5>
                <p><strong>限制酶切连接：</strong>传统方法，需匹配位点</p>
                <p><strong>Gateway克隆：</strong>位点特异性重组</p>
                <p><strong>Gibson组装：</strong>无缝连接，效率高</p>
                <p><strong>TOPO克隆：</strong>快速，无需连接酶</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-semibold mb-2">载体选择原则</h5>
                <p>• 根据宿主类型选择（原核/真核）</p>
                <p>• 根据目的选择（克隆/表达）</p>
                <p>• 考虑拷贝数和筛选标记</p>
                <p>• 确保多克隆位点兼容</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transformation' && (
          <div>
            <h4 className="text-lg font-semibold mb-4">转化/转染</h4>
            
            <div className="flex justify-center mb-6">
              <svg width="600" height="350" viewBox="0 0 600 350">
                <g transform="translate(30, 30)">
                  <rect x="0" y="0" width="170" height="100" fill={defaultColors.transformation} fillOpacity="0.6" rx="10" />
                  <text x="85" y="35" textAnchor="middle" fontSize="13" fill="white" fontWeight="bold">大肠杆菌</text>
                  <text x="85" y="60" textAnchor="middle" fontSize="10" fill="white">热激法</text>
                  <text x="85" y="75" textAnchor="middle" fontSize="10" fill="white">电穿孔法</text>
                </g>
                
                <g transform="translate(215, 30)">
                  <rect x="0" y="0" width="170" height="100" fill={defaultColors.transformation} fillOpacity="0.6" rx="10" />
                  <text x="85" y="35" textAnchor="middle" fontSize="13" fill="white" fontWeight="bold">酵母</text>
                  <text x="85" y="60" textAnchor="middle" fontSize="10" fill="white">醋酸锂法</text>
                  <text x="85" y="75" textAnchor="middle" fontSize="10" fill="white">电穿孔法</text>
                </g>
                
                <g transform="translate(400, 30)">
                  <rect x="0" y="0" width="170" height="100" fill={defaultColors.transformation} fillOpacity="0.6" rx="10" />
                  <text x="85" y="35" textAnchor="middle" fontSize="13" fill="white" fontWeight="bold">哺乳动物细胞</text>
                  <text x="85" y="60" textAnchor="middle" fontSize="10" fill="white">脂质体转染</text>
                  <text x="85" y="75" textAnchor="middle" fontSize="10" fill="white">磷酸钙沉淀</text>
                </g>
                
                <g transform="translate(50, 150)">
                  <text fontSize="11" fill="#333" fontWeight="bold">热激法示意图：</text>
                  <g transform="translate(0, 30)">
                    <circle cx="50" cy="30" r="25" fill="#ccc" />
                    <text x="50" y="35" textAnchor="middle" fontSize="8" fill="#333">细胞</text>
                    
                    <text x="100" y="35" fontSize="10" fill="#666">42°C 90秒</text>
                    
                    <line x1="85" y1="30" x2="130" y2="30" stroke="#333" strokeWidth="1" />
                    
                    <circle cx="160" cy="30" r="25" fill={defaultColors.transformation} fillOpacity="0.6" />
                    <rect x="150" y="20" width="20" height="20" fill={defaultColors.vector} fillOpacity="0.8" />
                    <text x="160" y="35" textAnchor="middle" fontSize="8" fill="white">载体</text>
                  </g>
                </g>
                
                <g transform="translate(300, 150)">
                  <text fontSize="11" fill="#333" fontWeight="bold">电穿孔法示意图：</text>
                  <g transform="translate(0, 30)">
                    <circle cx="50" cy="30" r="25" fill="#ccc" />
                    <text x="50" y="35" textAnchor="middle" fontSize="8" fill="#333">细胞</text>
                    
                    <text x="100" y="25" fontSize="10" fill="#666">高压脉冲</text>
                    <text x="100" y="40" fontSize="10" fill="#666">膜孔形成</text>
                    
                    <line x1="85" y1="30" x2="130" y2="30" stroke="#333" strokeWidth="1" />
                    
                    <circle cx="160" cy="30" r="25" fill={defaultColors.transformation} fillOpacity="0.6" />
                    <rect x="150" y="20" width="20" height="20" fill={defaultColors.vector} fillOpacity="0.8" />
                    <text x="160" y="35" textAnchor="middle" fontSize="8" fill="white">载体</text>
                  </g>
                </g>
                
                <g transform="translate(50, 250)">
                  <rect x="0" y="0" width="500" height="60" fill="#f0f0f0" rx="10" />
                  <text x="250" y="25" textAnchor="middle" fontSize="11" fill="#333" fontWeight="bold">转化效率影响因素</text>
                  <text x="250" y="45" textAnchor="middle" fontSize="9" fill="#666">载体纯度 • 宿主感受态细胞状态 • 转化方法 • 复苏时间</text>
                </g>
              </svg>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h5 className="font-semibold mb-2">热激法</h5>
                <p><strong>原理：</strong>温度变化增加膜通透性</p>
                <p><strong>优点：</strong>简单、成本低</p>
                <p><strong>缺点：</strong>效率较低</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h5 className="font-semibold mb-2">电穿孔法</h5>
                <p><strong>原理：</strong>电脉冲形成膜孔</p>
                <p><strong>优点：</strong>效率高</p>
                <p><strong>缺点：</strong>需要专用设备</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h5 className="font-semibold mb-2">脂质体转染</h5>
                <p><strong>原理：</strong>脂质体包裹DNA</p>
                <p><strong>优点：</strong>适用真核细胞</p>
                <p><strong>缺点：</strong>细胞毒性</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'screening' && (
          <div>
            <h4 className="text-lg font-semibold mb-4">克隆筛选与鉴定</h4>
            
            <div className="flex justify-center mb-6">
              <svg width="600" height="400" viewBox="0 0 600 400">
                <g transform="translate(30, 30)">
                  <rect x="0" y="0" width="250" height="90" fill={defaultColors.screening} fillOpacity="0.6" rx="10" />
                  <text x="125" y="35" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">抗生素筛选</text>
                  <text x="125" y="60" textAnchor="middle" fontSize="10" fill="white">只有含载体的细胞才能生长</text>
                  <text x="125" y="75" textAnchor="middle" fontSize="9" fill="white">氨苄青霉素、卡那霉素</text>
                </g>
                
                <g transform="translate(320, 30)">
                  <rect x="0" y="0" width="250" height="90" fill={defaultColors.screening} fillOpacity="0.6" rx="10" />
                  <text x="125" y="35" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">蓝白斑筛选</text>
                  <text x="125" y="60" textAnchor="middle" fontSize="10" fill="white">α-互补筛选重组克隆</text>
                  <text x="125" y="75" textAnchor="middle" fontSize="9" fill="white">X-gal底物显色</text>
                </g>
                
                <g transform="translate(30, 140)">
                  <rect x="0" y="0" width="250" height="90" fill={defaultColors.screening} fillOpacity="0.6" rx="10" />
                  <text x="125" y="35" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">菌落PCR</text>
                  <text x="125" y="60" textAnchor="middle" fontSize="10" fill="white">快速验证插入片段</text>
                  <text x="125" y="75" textAnchor="middle" fontSize="9" fill="white">直接扩增菌落DNA</text>
                </g>
                
                <g transform="translate(320, 140)">
                  <rect x="0" y="0" width="250" height="90" fill={defaultColors.screening} fillOpacity="0.6" rx="10" />
                  <text x="125" y="35" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">限制酶切分析</text>
                  <text x="125" y="60" textAnchor="middle" fontSize="10" fill="white">验证插入片段大小</text>
                  <text x="125" y="75" textAnchor="middle" fontSize="9" fill="white">酶切后电泳检测</text>
                </g>
                
                <g transform="translate(175, 250)">
                  <rect x="0" y="0" width="250" height="90" fill={defaultColors.screening} fillOpacity="0.6" rx="10" />
                  <text x="125" y="35" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">测序验证</text>
                  <text x="125" y="60" textAnchor="middle" fontSize="10" fill="white">确认序列正确性</text>
                  <text x="125" y="75" textAnchor="middle" fontSize="9" fill="white">Sanger测序或NGS</text>
                </g>
                
                <g transform="translate(30, 360)">
                  <text fontSize="10" fill="#666">筛选流程：</text>
                  <text x="80" y="10" fontSize="9" fill="#666">抗生素筛选 → 蓝白斑筛选 → 菌落PCR → 酶切验证 → 测序确认</text>
                </g>
              </svg>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-semibold mb-2">筛选方法比较</h5>
                <p><strong>抗生素筛选：</strong>初步筛选，效率高</p>
                <p><strong>蓝白斑筛选：</strong>区分重组与非重组</p>
                <p><strong>菌落PCR：</strong>快速，高通量</p>
                <p><strong>酶切分析：</strong>验证片段大小</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-semibold mb-2">验证标准</h5>
                <p>• 载体完整性</p>
                <p>• 插入片段大小正确</p>
                <p>• 序列无突变</p>
                <p>• 阅读框正确</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'expression' && (
          <div>
            <h4 className="text-lg font-semibold mb-4">表达系统</h4>
            
            <div className="flex justify-center mb-6">
              <svg width="600" height="350" viewBox="0 0 600 350">
                <g transform="translate(30, 30)">
                  <rect x="0" y="0" width="250" height="100" fill={defaultColors.expression} fillOpacity="0.6" rx="10" />
                  <text x="125" y="35" textAnchor="middle" fontSize="13" fill="white" fontWeight="bold">大肠杆菌</text>
                  <text x="125" y="60" textAnchor="middle" fontSize="10" fill="white">快速、廉价、高产</text>
                  <text x="125" y="80" textAnchor="middle" fontSize="9" fill="white">无翻译后修饰</text>
                </g>
                
                <g transform="translate(320, 30)">
                  <rect x="0" y="0" width="250" height="100" fill={defaultColors.expression} fillOpacity="0.6" rx="10" />
                  <text x="125" y="35" textAnchor="middle" fontSize="13" fill="white" fontWeight="bold">酵母</text>
                  <text x="125" y="60" textAnchor="middle" fontSize="10" fill="white">真核表达、分泌表达</text>
                  <text x="125" y="80" textAnchor="middle" fontSize="9" fill="white">糖基化与哺乳动物不同</text>
                </g>
                
                <g transform="translate(30, 150)">
                  <rect x="0" y="0" width="250" height="100" fill={defaultColors.expression} fillOpacity="0.6" rx="10" />
                  <text x="125" y="35" textAnchor="middle" fontSize="13" fill="white" fontWeight="bold">昆虫细胞</text>
                  <text x="125" y="60" textAnchor="middle" fontSize="10" fill="white">翻译后修饰、高表达</text>
                  <text x="125" y="80" textAnchor="middle" fontSize="9" fill="white">成本较高</text>
                </g>
                
                <g transform="translate(320, 150)">
                  <rect x="0" y="0" width="250" height="100" fill={defaultColors.expression} fillOpacity="0.6" rx="10" />
                  <text x="125" y="35" textAnchor="middle" fontSize="13" fill="white" fontWeight="bold">哺乳动物细胞</text>
                  <text x="125" y="60" textAnchor="middle" fontSize="10" fill="white">天然翻译后修饰</text>
                  <text x="125" y="80" textAnchor="middle" fontSize="9" fill="white">昂贵、低产</text>
                </g>
                
                <g transform="translate(50, 270)">
                  <rect x="0" y="0" width="500" height="60" fill="#f0f0f0" rx="10" />
                  <text x="250" y="25" textAnchor="middle" fontSize="11" fill="#333" fontWeight="bold">表达系统选择依据</text>
                  <text x="250" y="45" textAnchor="middle" fontSize="9" fill="#666">蛋白性质 • 翻译后修饰需求 • 表达量 • 成本 • 时间</text>
                </g>
              </svg>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-semibold mb-2">原核表达系统</h5>
                <p><strong>优点：</strong>生长快、成本低、易操作</p>
                <p><strong>缺点：</strong>无翻译后修饰</p>
                <p><strong>适用：</strong>细菌蛋白、无需修饰的蛋白</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-semibold mb-2">真核表达系统</h5>
                <p><strong>优点：</strong>天然翻译后修饰</p>
                <p><strong>缺点：</strong>成本高、表达量低</p>
                <p><strong>适用：</strong>需要正确折叠和修饰的蛋白</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'purification' && (
          <div>
            <h4 className="text-lg font-semibold mb-4">蛋白纯化</h4>
            
            <div className="flex justify-center mb-6">
              <svg width="600" height="350" viewBox="0 0 600 350">
                <g transform="translate(30, 30)">
                  <rect x="0" y="0" width="250" height="80" fill={defaultColors.purification} fillOpacity="0.6" rx="10" />
                  <text x="125" y="35" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">亲和层析</text>
                  <text x="125" y="60" textAnchor="middle" fontSize="10" fill="white">基于标签蛋白特异性结合</text>
                </g>
                
                <g transform="translate(320, 30)">
                  <rect x="0" y="0" width="250" height="80" fill={defaultColors.purification} fillOpacity="0.6" rx="10" />
                  <text x="125" y="35" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">离子交换层析</text>
                  <text x="125" y="60" textAnchor="middle" fontSize="10" fill="white">基于电荷差异分离</text>
                </g>
                
                <g transform="translate(30, 130)">
                  <rect x="0" y="0" width="250" height="80" fill={defaultColors.purification} fillOpacity="0.6" rx="10" />
                  <text x="125" y="35" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">凝胶过滤层析</text>
                  <text x="125" y="60" textAnchor="middle" fontSize="10" fill="white">基于分子大小分离</text>
                </g>
                
                <g transform="translate(320, 130)">
                  <rect x="0" y="0" width="250" height="80" fill={defaultColors.purification} fillOpacity="0.6" rx="10" />
                  <text x="125" y="35" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">标签蛋白纯化</text>
                  <text x="125" y="60" textAnchor="middle" fontSize="10" fill="white">His-tag、GST-tag</text>
                </g>
                
                <g transform="translate(50, 230)">
                  <text fontSize="11" fill="#333" fontWeight="bold">常用融合标签：</text>
                  <g transform="translate(0, 30)">
                    <rect x="0" y="0" width="100" height="30" fill="#4CAF50" fillOpacity="0.6" rx="5" />
                    <text x="50" y="20" textAnchor="middle" fontSize="10" fill="white">His-tag</text>
                    <text x="120" y="20" fontSize="9" fill="#666">镍柱亲和纯化</text>
                  </g>
                  <g transform="translate(250, 30)">
                    <rect x="0" y="0" width="100" height="30" fill="#2196F3" fillOpacity="0.6" rx="5" />
                    <text x="50" y="20" textAnchor="middle" fontSize="10" fill="white">GST-tag</text>
                    <text x="120" y="20" fontSize="9" fill="#666">谷胱甘肽柱纯化</text>
                  </g>
                  <g transform="translate(0, 70)">
                    <rect x="0" y="0" width="100" height="30" fill="#FF9800" fillOpacity="0.6" rx="5" />
                    <text x="50" y="20" textAnchor="middle" fontSize="10" fill="white">Flag-tag</text>
                    <text x="120" y="20" fontSize="9" fill="#666">抗Flag抗体纯化</text>
                  </g>
                  <g transform="translate(250, 70)">
                    <rect x="0" y="0" width="100" height="30" fill="#9C27B0" fillOpacity="0.6" rx="5" />
                    <text x="50" y="20" textAnchor="middle" fontSize="10" fill="white">GFP-tag</text>
                    <text x="120" y="20" fontSize="9" fill="#666">可视化检测</text>
                  </g>
                </g>
              </svg>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-semibold mb-2">纯化方法选择</h5>
                <p><strong>亲和层析：</strong>特异性高，一步纯化</p>
                <p><strong>离子交换：</strong>容量大，成本低</p>
                <p><strong>凝胶过滤：</strong>分离效果好，温和</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-semibold mb-2">纯化策略</h5>
                <p>• 粗纯化：亲和层析</p>
                <p>• 精纯化：离子交换+凝胶过滤</p>
                <p>• 标签切除：如需要</p>
                <p>• 质量检测：SDS-PAGE、Western blot</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
