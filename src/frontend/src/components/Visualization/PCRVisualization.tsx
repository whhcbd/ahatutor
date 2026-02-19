import { useState } from 'react';
import { VisualizationColors } from '../../constants/visualization-colors';

interface PCRVisualizationProps {
  data: any;
  colors?: Record<string, string>;
}

export function PCRVisualization({ data, colors }: PCRVisualizationProps) {
  const [activeTab, setActiveTab] = useState<'denaturation' | 'annealing' | 'extension' | 'cycles'>('denaturation');

  const defaultColors = {
    dna: colors?.dna || VisualizationColors.normal,
    primer: colors?.primer || VisualizationColors.gene,
    polymerase: colors?.polymerase || VisualizationColors.hover,
    newDna: colors?.newDna || VisualizationColors.affected,
    nucleotide: colors?.nucleotide || VisualizationColors.nodePrinciple,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('denaturation')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'denaturation'
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          变性
        </button>
        <button
          onClick={() => setActiveTab('annealing')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'annealing'
              ? 'bg-green-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          退火
        </button>
        <button
          onClick={() => setActiveTab('extension')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'extension'
              ? 'bg-purple-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          延伸
        </button>
        <button
          onClick={() => setActiveTab('cycles')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'cycles'
              ? 'bg-orange-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          循环扩增
        </button>
      </div>

      {activeTab === 'denaturation' && (
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-blue-800">变性</h3>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">94-98°C</span>
          </div>
          
          <div className="flex justify-center">
            <svg width="600" height="350" viewBox="0 0 600 350">
              <defs>
                <marker id="arrow-blue" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L9,3 z" fill="#3B82F6"/>
                </marker>
              </defs>

              <text x="300" y="25" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1976D2">DNA变性步骤</text>

              <g transform="translate(50, 50)">
                <text x="100" y="15" textAnchor="middle" fontSize="12" fill="#666">双链DNA</text>
                
                <g transform="translate(30, 30)">
                  <path d="M0,50 Q70,20 140,50" stroke={defaultColors.dna} strokeWidth="4" fill="none"/>
                  <path d="M0,50 Q70,80 140,50" stroke={defaultColors.dna} strokeWidth="4" fill="none"/>
                  
                  <text x="70" y="20" textAnchor="middle" fontSize="10" fill="#059669">5'</text>
                  <text x="70" y="90" textAnchor="middle" fontSize="10" fill="#059669">3'</text>
                  <text x="70" y="110" textAnchor="middle" fontSize="10" fill="#666">模板DNA</text>
                </g>
              </g>

              <path d="M200,100 L240,100" stroke="#EF4444" strokeWidth="4" markerEnd="url(#arrow-blue)"/>
              <text x="220" y="85" textAnchor="middle" fontSize="10" fill="#DC2626">高温</text>

              <g transform="translate(250, 50)">
                <text x="100" y="15" textAnchor="middle" fontSize="12" fill="#666">变性中</text>
                
                <g transform="translate(30, 30)">
                  <path d="M0,50 Q35,30 70,50" stroke={defaultColors.dna} strokeWidth="3" fill="none" strokeDasharray="4,2"/>
                  <path d="M70,50 Q105,70 140,50" stroke={defaultColors.dna} strokeWidth="3" fill="none" strokeDasharray="4,2"/>
                  
                  <path d="M0,50 Q35,70 70,50" stroke={defaultColors.dna} strokeWidth="3" fill="none" strokeDasharray="4,2"/>
                  <path d="M70,50 Q105,30 140,50" stroke={defaultColors.dna} strokeWidth="3" fill="none" strokeDasharray="4,2"/>
                  
                  <text x="35" y="20" textAnchor="middle" fontSize="9" fill="#DC2626">5'</text>
                  <text x="105" y="20" textAnchor="middle" fontSize="9" fill="#DC2626">3'</text>
                  <text x="70" y="110" textAnchor="middle" fontSize="10" fill="#666">氢键断裂</text>
                </g>
              </g>

              <path d="M400,100 L440,100" stroke="#3B82F6" strokeWidth="4" markerEnd="url(#arrow-blue)"/>

              <g transform="translate(450, 50)">
                <text x="50" y="15" textAnchor="middle" fontSize="12" fill="#666">单链DNA</text>
                
                <g transform="translate(20, 30)">
                  <path d="M0,50 Q25,35 50,50" stroke={defaultColors.dna} strokeWidth="3" fill="none"/>
                  <text x="25" y="25" textAnchor="middle" fontSize="9" fill="#059669">5'</text>
                  
                  <path d="M0,50 Q25,65 50,50" stroke={defaultColors.dna} strokeWidth="3" fill="none"/>
                  <text x="25" y="85" textAnchor="middle" fontSize="9" fill="#059669">3'</text>
                </g>
                
                <text x="50" y="110" textAnchor="middle" fontSize="10" fill="#666">两条单链</text>
              </g>

              <g transform="translate(50, 180)">
                <rect x="0" y="0" width="500" height="140" fill="white" stroke="#3B82F6" strokeWidth="2" rx="8"/>
                
                <text x="250" y="25" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1D4ED8">变性原理</text>
                
                <g transform="translate(20, 40)">
                  <rect x="0" y="0" width="150" height="80" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1" rx="4"/>
                  <text x="75" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1D4ED8">温度</text>
                  <text x="75" y="45" textAnchor="middle" fontSize="8" fill="#666">• 94-98°C</text>
                  <text x="75" y="60" textAnchor="middle" fontSize="8" fill="#666">• 高温破坏氢键</text>
                  <text x="75" y="75" textAnchor="middle" fontSize="8" fill="#666">• 双链解离</text>
                </g>
                
                <g transform="translate(175, 40)">
                  <rect x="0" y="0" width="150" height="80" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1" rx="4"/>
                  <text x="75" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1D4ED8">时间</text>
                  <text x="75" y="45" textAnchor="middle" fontSize="8" fill="#666">• 30秒-1分钟</text>
                  <text x="75" y="60" textAnchor="middle" fontSize="8" fill="#666">• 取决于DNA长度</text>
                  <text x="75" y="75" textAnchor="middle" fontSize="8" fill="#666">• GC含量影响</text>
                </g>
                
                <g transform="overlap(330, 40)">
                  <rect x="330" y="40" width="150" height="80" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1" rx="4"/>
                  <text x="75" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1D4ED8">结果</text>
                  <text x="75" y="45" textAnchor="middle" fontSize="8" fill="#666">• 产生两条单链</text>
                  <text x="75" y="60" textAnchor="middle" fontSize="8" fill="#666">• 作为引物结合模板</text>
                  <text x="75" y="75" textAnchor="middle" fontSize="8" fill="#666">• 为后续步骤准备</text>
                </g>
              </g>
            </svg>
          </div>
        </div>
      )}

      {activeTab === 'annealing' && (
        <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-green-800">退火</h3>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">50-65°C</span>
          </div>
          
          <div className="flex justify-center">
            <svg width="600" height="350" viewBox="0 0 600 350">
              <text x="300" y="25" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1976D2">引物退火步骤</text>

              <g transform="translate(50, 50)">
                <text x="100" y="15" textAnchor="middle" fontSize="12" fill="#666">单链DNA</text>
                
                <g transform="translate(30, 30)">
                  <path d="M0,50 Q35,35 70,50" stroke={defaultColors.dna} strokeWidth="3" fill="none"/>
                  <text x="35" y="25" textAnchor="middle" fontSize="9" fill="#059669">5'</text>
                  
                  <path d="M0,50 Q35,65 70,50" stroke={defaultColors.dna} strokeWidth="3" fill="none"/>
                  <text x="35" y="85" textAnchor="middle" fontSize="9" fill="#059669">3'</text>
                </g>
              </g>

              <path d="M150,100 L190,100" stroke="#10B981" strokeWidth="4" markerEnd="url(#arrow-blue)"/>
              <text x="170" y="85" textAnchor="middle" fontSize="10" fill="#059669">降温</text>

              <g transform="translate(200, 50)">
                <text x="100" y="15" textAnchor="middle" fontSize="12" fill="#666">引物结合</text>
                
                <g transform="translate(30, 30)">
                  <path d="M0,50 Q35,35 70,50" stroke={defaultColors.dna} strokeWidth="3" fill="none"/>
                  <text x="35" y="25" textAnchor="middle" fontSize="9" fill="#059669">5'</text>
                  
                  <path d="M70,50 Q105,35 140,50" stroke={defaultColors.primer} strokeWidth="3" fill="none"/>
                  <text x="105" y="25" textAnchor="middle" fontSize="8" fill="#1D4ED8">引物</text>
                  
                  <path d="M0,50 Q35,65 70,50" stroke={defaultColors.dna} strokeWidth="3" fill="none"/>
                  <text x="35" y="85" textAnchor="middle" fontSize="9" fill="#059669">3'</text>
                  
                  <path d="M70,50 Q105,65 140,50" stroke={defaultColors.primer} strokeWidth="3" fill="none"/>
                  <text x="105" y="85" textAnchor="middle" fontSize="8" fill="#1D4ED8">3'</text>
                </g>
              </g>

              <path dM="350,100 L390,100" stroke="#10B981" strokeWidth="4" markerEnd="url(#arrow-blue)"/>

              <g transform="translate(400, 50)">
                <text x="100" y="15" textAnchor="middle" fontSize="12" fill="#666">双引物结合</text>
                
                <g transform="translate(30, 30)">
                  <path d="M0,50 Q25,35 50,50" stroke={defaultColors.dna} strokeWidth="3" fill="none"/>
                  <path d="M50,50 Q75,35 100,50" stroke={defaultColors.primer} strokeWidth="3" fill="none"/>
                  
                  <path d="M0,50 Q25,65 50,50" stroke={defaultColors.dna} strokeWidth="3" fill="none"/>
                  <path d="M50,50 Q75,65 100,50" stroke={defaultColors.primer} strokeWidth="3" fill="none"/>
                </g>
                
                <text x="50" y="110" textAnchor="middle" fontSize="10" fill="#666">引物-模板复合物</text>
              </g>

              <g transform="translate(50, 180)">
                <rect x="0" y="0" width="500" height="140" fill="white" stroke="#10B981" strokeWidth="2" rx="8"/>
                
                <text x="250" y="25" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#059669">退火原理</text>
                
                <g transform="translate(20, 40)">
                  <rect x="0" y="0" width="150" height="80" fill="#D1FAE5" stroke="#10B981" strokeWidth="1" rx="4"/>
                  <text x="75" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#059669">温度</text>
                  <text x="75" y="45" textAnchor="middle" fontSize="8" fill="#666">• 50-65°C</text>
                  <text x="75" y="60" textAnchor="middle" fontSize="8" fill="#666">• 低于Tm值</text>
                  <text x="75" y="75" textAnchor="middle" fontSize="8" fill="#666">• 引物特异性结合</text>
                </g>
                
                <g transform="translate(175, 40)">
                  <rect x="0" y="0" width="150" height="80" fill="#D1FAE5" stroke="#10B981" strokeWidth="1" rx="4"/>
                  <text x="75" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#059669">时间</text>
                  <text x="75" y="45" textAnchor="middle" fontSize="8" fill="#666">• 30秒-1分钟</text>
                  <text x="75" y="60" textAnchor="middle" fontSize="8" fill="#666">• 确保充分结合</text>
                  <text x="75" y="75" textAnchor="middle" fontSize="8" fill="#666">• 优化特异性</text>
                </g>
                
                <g transform="translate(330, 40)">
                  <rect x="0" y="0" width="150" height="80" fill="#D1FAE5" stroke="#10B981" strokeWidth="1" rx="4"/>
                  <text x="75" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#059669">关键因素</text>
                  <text x="75" y="45" textAnchor="middle" fontSize="8" fill="#666">• 引物长度</text>
                  <text x="75" y="60" textAnchor="middle" fontSize="8" fill="#666">• GC含量</text>
                  <text x="75" y="75" textAnchor="middle" fontSize="8" fill="#666">• 二级结构</text>
                </g>
              </g>
            </svg>
          </div>
        </div>
      )}

      {activeTab === 'extension' && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-purple-800">延伸</h3>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">72°C</span>
          </div>
          
          <div className="flex justify-center">
            <svg width="600" height="350" viewBox="0 0 600 350">
              <text x="300" y="25" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1976D2">DNA延伸步骤</text>

              <g transform="translate(50, 50)">
                <text x="100" y="15" textAnchor="middle" fontSize="12" fill="#666">起始</text>
                
                <g transform="translate(30, 30)">
                  <path d="M0,50 Q35,35 70,50" stroke={defaultColors.dna} strokeWidth="3" fill="none"/>
                  <path d="M70,50 Q85,35 100,50" stroke={defaultColors.primer} strokeWidth="3" fill="none"/>
                  
                  <path d="M0,50 Q35,65 70,50" stroke={defaultColors.dna} strokeWidth="3" fill="none"/>
                  <path d="M70,50 Q85,65 100,50" stroke={defaultColors.primer} strokeWidth="3" fill="none"/>
                  
                  <ellipse cx="85" cy="30" rx="15" ry="10" fill={defaultColors.polymerase} fillOpacity="0.4" stroke={defaultColors.polymerase} strokeWidth="2"/>
                  <text x="85" y="34" textAnchor="middle" fontSize="7" fill="#B45309">Taq</text>
                </g>
              </g>

              <path d="M150,100 L190,100" stroke="#8B5CF6" strokeWidth="4" markerEnd="url(#arrow-blue)"/>
              <text x="170" y="85" textAnchor="middle" fontSize="10" fill="#6D28D9">延伸中</text>

              <g transform="translate(200, 50)">
                <text x="100" y="15" textAnchor="middle" fontSize="12" fill="#666">合成</text>
                
                <g transform="translate(30, 30)">
                  <path d="M0,50 Q35,35 70,50" stroke={defaultColors.dna} strokeWidth="3" fill="none"/>
                  <path d="M70,50 Q100,35 130,50" stroke={defaultColors.primer} strokeWidth="3" fill="none"/>
                  <path d="M130,50 Q145,35 160,50" stroke={defaultColors.newDna} strokeWidth="3" fill="none"/>
                  
                  <path d="M0,50 Q35,65 70,50" stroke={defaultColors.dna} strokeWidth="3" fill="none"/>
                  <path d="M70,50 Q100,65 130,50" stroke={defaultColors.primer} strokeWidth="3" fill="none"/>
                  <path d="M130,50 Q145,65 160,50" stroke={defaultColors.newDna} strokeWidth="3" fill="none"/>
                  
                  <ellipse cx="100" cy="30" rx="15" ry="10" fill={defaultColors.polymerase} fillOpacity="0.4" stroke={defaultColors.polymerase} strokeWidth="2"/>
                  <text x="100" y="34" textAnchor="middle" fontSize="7" fill="#B45309">Taq</text>
                  
                  <g transform="translate(135, 15)">
                    <circle cx="5" cy="5" r="4" fill={defaultColors.nucleotide} fillOpacity="0.6"/>
                    <text x="5" y="7" textAnchor="middle" fontSize="5" fill="#6D28D9">NTP</text>
                  </g>
                </g>
              </g>

              <path d="M380,100 L420,100" stroke="#8B5CF6" strokeWidth="4" markerEnd="url(#arrow-blue)"/>

              <g transform="translate(430, 50)">
                <text x="60" y="15" textAnchor="middle" fontSize="12" fill="#666">完成</text>
                
                <g transform="translate(30, 30)">
                  <path d="M0,50 Q30,35 60,50" stroke={defaultColors.dna} strokeWidth="3" fill="none"/>
                  <path d="M60,50 Q90,35 120,50" stroke={defaultColors.newDna} strokeWidth="3" fill="none"/>
                  
                  <path d="M0,50 Q30,65 60,50" stroke={defaultColors.dna} strokeWidth="3" fill="none"/>
                  <path d="M60,50 Q90,65 120,50" stroke={defaultColors.newDna} strokeWidth="3" fill="none"/>
                  
                  <text x="60" y="20" textAnchor="middle" fontSize="8" fill="#059669">5'</text>
                  <text x="60" y="90" textAnchor="middle" fontSize="8" fill="#DC2626">3'</text>
                  <text x="60" y="110" textAnchor="middle" fontSize="10" fill="#666">新DNA链</text>
                </g>
              </g>

              <g transform="translate(50, 180)">
                <rect x="0" y="0" width="500" height="140" fill="white" stroke="#8B5CF6" strokeWidth="2" rx="8"/>
                
                <text x="250" y="25" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#6D28D9">延伸原理</text>
                
                <g transform="translate(20, 40)">
                  <rect x="0" y="0" width="150" height="80" fill="#F3E8FF" stroke="#8B5CF6" strokeWidth="1" rx="4"/>
                  <text x="75" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#6D28D9">酶</text>
                  <text x="75" y="45" textAnchor="middle" fontSize="8" fill="#666">• Taq聚合酶</text>
                  <text x="75" y="60" textAnchor="middle" fontSize="8" fill="#666">• 5'-3'合成</text>
                  <text x="75" y="75" textAnchor="middle" fontSize="8" fill="#666">• 耐高温</text>
                </g>
                
                <g transform="translate(175, 40)">
                  <rect x="0" y="0" width="150" height="80" fill="#F3E8FF" stroke="#8B5CF6" strokeWidth="1" rx="4"/>
                  <text x="75" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#6D28D9">温度</text>
                  <text x="75" y="45" textAnchor="middle" fontSize="8" fill="#666">• 72°C</text>
                  <text x="75" y="60" textAnchor="middle" fontSize="8" fill="#666">• 最适温度</text>
                  <text x="75" y="75" textAnchor="middle" fontSize="8" fill="#666">• 1分钟/kb</text>
                </g>
                
                <g transform="translate(330, 40)">
                  <rect x="0" y="0" width="150" height="80" fill="#F3E8FF" stroke="#8B5CF6" strokeWidth="1" rx="4"/>
                  <text x="75" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#6D28D9">底物</text>
                  <text x="75" y="45" textAnchor="middle" fontSize="8" fill="#666">• dNTPs</text>
                  <text x="75" y="60" textAnchor="middle" fontSize="8" fill="#666">• Mg2+离子</text>
                  <text x="75" y="75" textAnchor="middle" fontSize="8" fill="#666">• 合成新链</text>
                </g>
              </g>
            </svg>
          </div>
        </div>
      )}

      {activeTab === 'cycles' && (
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-orange-800">PCR循环扩增</h3>
          
          <div className="flex justify-center">
            <svg width="600" height="400" viewBox="0 0 600 400">
              <text x="300" y="25" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1976D2">PCR循环扩增</text>

              <g transform="translate(50, 50)">
                <text x="100" y="15" textAnchor="middle" fontSize="12" fill="#666">第1循环</text>
                
                <g transform="translate(30, 30)">
                  <path d="M0,50 Q35,35 70,50" stroke={defaultColors.dna} strokeWidth="2" fill="none"/>
                  <path d="M70,50 Q105,35 140,50" stroke={defaultColors.newDna} strokeWidth="2" fill="none"/>
                  
                  <path d="M0,50 Q35,65 70,50" stroke={defaultColors.dna} strokeWidth="2" fill="none"/>
                  <path d="M70,50 Q105,65 140,50" stroke={defaultColors.newDna} strokeWidth="2" fill="none"/>
                  
                  <text x="70" y="80" textAnchor="middle" fontSize="9" fill="#666">2条新链</text>
                </g>
              </g>

              <path d="M200,100 L220,100" stroke="#F97316" strokeWidth="3" markerEnd="url(#arrow-blue)"/>

              <g transform="translate(230, 50)">
                <text x="100" y="15" textAnchor="middle" fontSize="12" fill="#666">第2循环</text>
                
                <g transform="translate(30, 30)">
                  <path d="M0,50 Q25,35 50,50" stroke={defaultColors.dna} strokeWidth="2" fill="none"/>
                  <path d="M50,50 Q75,35 100,50" stroke={defaultColors.newDna} strokeWidth="2" fill="none"/>
                  <path d="M100,50 Q125,35 150,50" stroke={defaultColors.newDna} strokeWidth="2" fill="none"/>
                  
                  <path d="M0,50 Q25,65 50,50" stroke={defaultColors.dna} strokeWidth="2" fill="none"/>
                  <path d="M50,50 Q75,65 100,50" stroke={defaultColors.newDna} strokeWidth="2" fill="none"/>
                  <path d="M100,50 Q125,65 150,50" stroke={defaultColors.newDna} strokeWidth="2" fill="none"/>
                  
                  <text x="75" y="80" textAnchor="middle" fontSize="9" fill="#666">4条DNA</text>
                </g>
              </g>

              <path d="M400,100 L420,100" stroke="#F97316" strokeWidth="3" markerEnd="url(#arrow-blue)"/>

              <g transform="translate(430, 50)">
                <text x="70" y="15" textAnchor="middle" fontSize="12" fill="#666">第3循环</text>
                
                <g transform="translate(20, 30)">
                  <path d="M0,50 Q15,35 30,50" stroke={defaultColors.dna} strokeWidth="2" fill="none"/>
                  <path d="M30,50 Q45,35 60,50" stroke={defaultColors.newDna} strokeWidth="2" fill="none"/>
                  <path d="M60,50 Q75,35 90,50" stroke={defaultColors.newDna} strokeWidth="2" fill="none"/>
                  <path d="M90,50 Q105,35 120,50" stroke={defaultColors.newDna} strokeWidth="2" fill="none"/>
                  
                  <path d="M0,50 Q15,65 30,50" stroke={defaultColors.dna} strokeWidth="2" fill="none"/>
                  <path d="M30,50 Q45,65 60,50" stroke={defaultColors.newDna} strokeWidth="2" fill="none"/>
                  <path d="M60,50 Q75,65 90,50" stroke={defaultColors.newDna} strokeWidth="2" fill="none"/>
                  <path d="M90,50 Q105,65 120,50" stroke={defaultColors.newDna} strokeWidth="2" fill="none"/>
                  
                  <text x="60" y="80" textAnchor="middle" fontSize="9" fill="#666">8条DNA</text>
                </g>
              </g>

              <g transform="translate(50, 180)">
                <rect x="0" y="0" width="500" height="180" fill="white" stroke="#F97316" strokeWidth="2" rx="8"/>
                
                <text x="250" y="25" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#C2410C">指数扩增</text>
                
                <g transform="translate(20, 40)">
                  <rect x="0" y="0" width="150" height="120" fill="#FFEDD5" stroke="#F97316" strokeWidth="1" rx="4"/>
                  <text x="75" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#C2410C">循环数</text>
                  <text x="75" y="50" textAnchor="middle" fontSize="9" fill="#666">通常25-35轮</text>
                  <text x="75" y="70" textAnchor="middle" fontSize="9" fill="#666">每轮翻倍</text>
                  <text x="75" y="90" textAnchor="middle" fontSize="9" fill="#666">2^n拷贝</text>
                  <text x="75" y="110" textAnchor="middle" fontSize="9" fill="#666">n=循环数</text>
                </g>
                
                <g transform="translate(175, 40)">
                  <rect x="0" y="0" width="150" height="120" fill="#FFEDD5" stroke="#F97316" strokeWidth="1" rx="4"/>
                  <text x="75" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#C2410C">扩增曲线</text>
                  <g transform="translate(10, 30)">
                    <path d="M0,80 Q30,80 50,70 Q70,50 90,30 Q110,10 130,5" stroke="#EF4444" strokeWidth="2" fill="none"/>
                    <text x="65" y="90" textAnchor="middle" fontSize="7" fill="#666">Cycles</text>
                    <text x="65" y="0" textAnchor="middle" fontSize="7" fill="#666">Copies</text>
                  </g>
                </g>
                
                <g transform="translate(330, 40)">
                  <rect x="0" y="0" width="150" height="120" fill="#FFEDD5" stroke="#F97316" strokeWidth="1" rx="4"/>
                  <text x="75" y="20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#C2410C">实际效果</text>
                  <text x="75" y="45" textAnchor="middle" fontSize="9" fill="#666">30轮 ≈ 10^9拷贝</text>
                  <text x="75" y="65" textAnchor="middle" fontSize="9" fill="#666">35轮 ≈ 10^10拷贝</text>
                  <text x="75" y="85" textAnchor="middle" fontSize="9" fill="#666">特异性产物</text>
                  <text x="75" y="105" textAnchor="middle" fontSize="9" fill="#666">便于检测分析</text>
                </g>
              </g>
            </svg>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
        <h4 className="font-semibold text-gray-800 mb-3">PCR关键参数</h4>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h5 className="font-medium text-blue-700 mb-2">引物设计</h5>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• 长度18-25bp</li>
              <li>• GC含量40-60%</li>
              <li>• Tm值相近</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h5 className="font-medium text-green-700 mb-2">反应条件</h5>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Mg2+浓度优化</li>
              <li>• dNTP浓度平衡</li>
              <li>• 酶用量调整</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h5 className="font-medium text-purple-700 mb-2">应用领域</h5>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• 基因克隆</li>
              <li>• 疾病诊断</li>
              <li>• 基因分型</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
