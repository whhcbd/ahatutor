import { useState } from 'react';
import { VisualizationColors } from '../../constants/visualization-colors';

interface VectorSystemVisualizationProps {
  colors?: Record<string, string>;
}

export function VectorSystemVisualization({ colors }: VectorSystemVisualizationProps) {
  const [activeTab, setActiveTab] = useState<'plasmid' | 'phage' | 'viral' | 'artificial' | 'components' | 'selection'>('plasmid');

  const defaultColors = {
    plasmid: colors?.plasmid || VisualizationColors.dominant,
    phage: colors?.phage || VisualizationColors.recessive,
    viral: colors?.viral || VisualizationColors.affected,
    artificialChromosome: colors?.artificialChromosome || VisualizationColors.nodePrinciple,
    ori: colors?.ori || VisualizationColors.locus,
    resistance: colors?.resistance || VisualizationColors.nodePrinciple,
    mcs: colors?.mcs || VisualizationColors.masteryHigh,
    promoter: colors?.promoter || VisualizationColors.enhancer,
    dna: VisualizationColors.gene,
    protein: VisualizationColors.hover,
  };

  const tabs = [
    { id: 'plasmid' as const, label: '质粒载体' },
    { id: 'phage' as const, label: '噬菌体载体' },
    { id: 'viral' as const, label: '病毒载体' },
    { id: 'artificial' as const, label: '人工染色体' },
    { id: 'components' as const, label: '载体元件' },
    { id: 'selection' as const, label: '筛选方法' },
  ];

  return (
    <div className="w-full p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">基因载体系统可视化</h3>
        <p className="text-gray-600">展示不同类型的基因载体及其特点</p>
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
        {activeTab === 'plasmid' && (
          <div>
            <h4 className="text-lg font-semibold mb-4">质粒载体</h4>
            
            <div className="flex justify-center mb-6">
              <svg width="500" height="350" viewBox="0 0 500 350">
                <defs>
                  <linearGradient id="plasmidGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: defaultColors.plasmid, stopOpacity: 0.8 }} />
                    <stop offset="100%" style={{ stopColor: '#66BB6A', stopOpacity: 0.8 }} />
                  </linearGradient>
                </defs>
                
                <circle cx="250" cy="150" r="100" fill="none" stroke={defaultColors.plasmid} strokeWidth="20" strokeOpacity="0.3" />
                
                <circle cx="250" cy="150" r="100" fill="none" stroke={defaultColors.plasmid} strokeWidth="12" />
                
                <g transform="translate(130, 80)">
                  <rect x="0" y="0" width="30" height="20" rx="3" fill={defaultColors.ori} />
                  <text x="15" y="14" textAnchor="middle" fill="white" fontSize="8">Ori</text>
                </g>
                
                <g transform="translate(230, 60)">
                  <rect x="0" y="0" width="40" height="20" rx="3" fill={defaultColors.resistance} />
                  <text x="20" y="14" textAnchor="middle" fill="white" fontSize="7">AmpR</text>
                </g>
                
                <g transform="translate(280, 80)">
                  <rect x="0" y="0" width="35" height="20" rx="3" fill={defaultColors.mcs} />
                  <text x="17.5" y="14" textAnchor="middle" fill="white" fontSize="7">MCS</text>
                </g>
                
                <g transform="translate(200, 220)">
                  <rect x="0" y="0" width="40" height="20" rx="3" fill={defaultColors.promoter} />
                  <text x="20" y="14" textAnchor="middle" fill="white" fontSize="7">Promoter</text>
                </g>
                
                <g transform="translate(300, 220)">
                  <rect x="0" y="0" width="30" height="20" rx="3" fill="#FF9800" />
                  <text x="15" y="14" textAnchor="middle" fill="white" fontSize="7">lacZ</text>
                </g>
                
                <line x1="140" y1="90" x2="180" y2="120" stroke="#333" strokeWidth="1" />
                <line x1="250" y1="80" x2="250" y2="120" stroke="#333" strokeWidth="1" />
                <line x1="297" y1="90" x2="320" y2="120" stroke="#333" strokeWidth="1" />
                <line x1="220" y1="180" x2="240" y2="220" stroke="#333" strokeWidth="1" />
                <line x1="280" y1="180" x2="300" y2="220" stroke="#333" strokeWidth="1" />
                
                <text x="250" y="300" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#333">环状质粒结构</text>
              </svg>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-semibold mb-2">基本信息</h5>
                <p><strong>宿主：</strong>原核生物（主要是大肠杆菌）</p>
                <p><strong>大小：</strong>2-15 kb</p>
                <p><strong>拷贝数：</strong>高拷贝（100-500）或低拷贝（5-20）</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-semibold mb-2">应用</h5>
                <p>• 基因克隆</p>
                <p>• 质粒制备</p>
                <p>• 基因表达</p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h5 className="font-semibold mb-2">常见质粒载体</h5>
              <p>pUC系列、pBR322、pET系列</p>
            </div>
          </div>
        )}

        {activeTab === 'phage' && (
          <div>
            <h4 className="text-lg font-semibold mb-4">噬菌体载体</h4>
            
            <div className="flex justify-center mb-6">
              <svg width="500" height="300" viewBox="0 0 500 300">
                <g transform="translate(200, 50)">
                  <ellipse cx="50" cy="30" rx="40" ry="25" fill={defaultColors.phage} fillOpacity="0.6" stroke={defaultColors.phage} strokeWidth="2" />
                  <rect x="30" y="50" width="40" height="80" fill={defaultColors.phage} fillOpacity="0.4" stroke={defaultColors.phage} strokeWidth="2" />
                  
                  <line x1="30" y1="130" x2="10" y2="180" stroke={defaultColors.phage} strokeWidth="3" />
                  <line x1="40" y1="130" x2="40" y2="180" stroke={defaultColors.phage} strokeWidth="3" />
                  <line x1="50" y1="130" x2="50" y2="180" stroke={defaultColors.phage} strokeWidth="3" />
                  <line x1="60" y1="130" x2="60" y2="180" stroke={defaultColors.phage} strokeWidth="3" />
                  <line x1="70" y1="130" x2="90" y2="180" stroke={defaultColors.phage} strokeWidth="3" />
                  
                  <ellipse cx="25" cy="185" rx="8" ry="5" fill={defaultColors.phage} />
                  <ellipse cx="40" cy="190" rx="8" ry="5" fill={defaultColors.phage} />
                  <ellipse cx="50" cy="192" rx="8" ry="5" fill={defaultColors.phage} />
                  <ellipse cx="60" cy="190" rx="8" ry="5" fill={defaultColors.phage} />
                  <ellipse cx="75" cy="185" rx="8" ry="5" fill={defaultColors.phage} />
                </g>
                
                <text x="250" y="260" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#333">λ噬菌体结构</text>
                
                <g transform="translate(50, 50)">
                  <rect x="0" y="0" width="120" height="200" fill="none" stroke={defaultColors.phage} strokeWidth="2" rx="5" />
                  <text x="60" y="30" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#333">替换型载体</text>
                  <line x1="10" y1="45" x2="110" y2="45" stroke={defaultColors.phage} strokeWidth="1" />
                  <text x="60" y="70" textAnchor="middle" fontSize="10" fill="#555">非必需区域</text>
                  <rect x="20" y="80" width="80" height="20" fill={defaultColors.phage} fillOpacity="0.3" />
                  <text x="60" y="94" textAnchor="middle" fontSize="8" fill="#333">可替换</text>
                  <text x="60" y="130" textAnchor="middle" fontSize="10" fill="#555">插入外源基因</text>
                </g>
                
                <g transform="translate(330, 50)">
                  <rect x="0" y="0" width="120" height="200" fill="none" stroke={defaultColors.phage} strokeWidth="2" rx="5" />
                  <text x="60" y="30" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#333">插入型载体</text>
                  <line x1="10" y1="45" x2="110" y2="45" stroke={defaultColors.phage} strokeWidth="1" />
                  <text x="60" y="70" textAnchor="middle" fontSize="10" fill="#555">保留必需基因</text>
                  <rect x="20" y="90" width="80" height="40" fill={defaultColors.phage} fillOpacity="0.3" />
                  <text x="60" y="110" textAnchor="middle" fontSize="8" fill="#333">插入位点</text>
                  <text x="60" y="150" textAnchor="middle" fontSize="10" fill="#555">小片段插入</text>
                </g>
              </svg>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-semibold mb-2">基本信息</h5>
                <p><strong>宿主：</strong>原核生物</p>
                <p><strong>大小：</strong>λ噬菌体：40-50 kb，M13：7 kb</p>
                <p><strong>特点：</strong>高效转导、高容量、筛选系统</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-semibold mb-2">应用</h5>
                <p>• 文库构建</p>
                <p>• 基因克隆</p>
                <p>• 噬菌体展示</p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-orange-50 rounded-lg">
              <h5 className="font-semibold mb-2">常见噬菌体载体</h5>
              <p>λgt11、M13mp系列</p>
            </div>
          </div>
        )}

        {activeTab === 'viral' && (
          <div>
            <h4 className="text-lg font-semibold mb-4">病毒载体</h4>
            
            <div className="flex justify-center mb-6">
              <svg width="500" height="320" viewBox="0 0 500 320">
                <g transform="translate(30, 50)">
                  <circle cx="50" cy="80" r="40" fill={defaultColors.viral} fillOpacity="0.6" stroke={defaultColors.viral} strokeWidth="2" />
                  <text x="50" y="85" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">逆转录病毒</text>
                  <text x="50" y="140" textAnchor="middle" fontSize="9" fill="#333">8-10 kb</text>
                  <text x="50" y="155" textAnchor="middle" fontSize="8" fill="#666">整合表达</text>
                </g>
                
                <g transform="translate(150, 50)">
                  <circle cx="50" cy="80" r="40" fill="#E91E63" fillOpacity="0.6" stroke="#E91E63" strokeWidth="2" />
                  <text x="50" y="85" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">慢病毒</text>
                  <text x="50" y="140" textAnchor="middle" fontSize="9" fill="#333">8-10 kb</text>
                  <text x="50" y="155" textAnchor="middle" fontSize="8" fill="#666">非分裂细胞</text>
                </g>
                
                <g transform="translate(270, 50)">
                  <polygon points="50,40 90,80 50,120 10,80" fill={defaultColors.viral} fillOpacity="0.6" stroke={defaultColors.viral} strokeWidth="2" />
                  <text x="50" y="85" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">腺病毒</text>
                  <text x="50" y="140" textAnchor="middle" fontSize="9" fill="#333">8-35 kb</text>
                  <text x="50" y="155" textAnchor="middle" fontSize="8" fill="#666">瞬时表达</text>
                </g>
                
                <g transform="translate(390, 50)">
                  <circle cx="50" cy="80" r="40" fill="#9C27B0" fillOpacity="0.6" stroke="#9C27B0" strokeWidth="2" />
                  <text x="50" y="85" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">AAV</text>
                  <text x="50" y="140" textAnchor="middle" fontSize="9" fill="#333">4.7 kb</text>
                  <text x="50" y="155" textAnchor="middle" fontSize="8" fill="#666">基因治疗</text>
                </g>
                
                <g transform="translate(200, 200)">
                  <rect x="0" y="0" width="100" height="80" fill="#4CAF50" fillOpacity="0.6" stroke="#4CAF50" strokeWidth="2" rx="5" />
                  <text x="50" y="45" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">杆状病毒</text>
                  <text x="50" y="65" textAnchor="middle" fontSize="8" fill="#333">38 kb</text>
                  <text x="50" y="105" textAnchor="middle" fontSize="9" fill="#333">昆虫表达</text>
                </g>
              </svg>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-semibold mb-2">病毒载体类型</h5>
                <p><strong>逆转录病毒：</strong>整合到宿主基因组，稳定表达</p>
                <p><strong>慢病毒：</strong>感染分裂和非分裂细胞，整合表达</p>
                <p><strong>腺病毒：</strong>不整合，瞬时高表达，高容量</p>
                <p><strong>AAV：</strong>低免疫原性，长效表达，基因治疗常用</p>
                <p><strong>杆状病毒：</strong>昆虫细胞表达，高产量</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-semibold mb-2">应用</h5>
                <p>• 基因治疗</p>
                <p>• 疫苗开发</p>
                <p>• 真核表达</p>
                <p>• 功能基因研究</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'artificial' && (
          <div>
            <h4 className="text-lg font-semibold mb-4">人工染色体</h4>
            
            <div className="flex justify-center mb-6">
              <svg width="500" height="300" viewBox="0 0 500 300">
                <g transform="translate(50, 50)">
                  <ellipse cx="80" cy="80" rx="60" ry="80" fill="none" stroke={defaultColors.artificialChromosome} strokeWidth="3" />
                  <ellipse cx="80" cy="80" rx="40" ry="50" fill={defaultColors.artificialChromosome} fillOpacity="0.3" />
                  <text x="80" y="85" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">YAC</text>
                  <text x="80" y="180" textAnchor="middle" fontSize="10" fill="#333">酵母人工染色体</text>
                  <text x="80" y="195" textAnchor="middle" fontSize="9" fill="#666">100-2000 kb</text>
                </g>
                
                <g transform="translate(210, 50)">
                  <ellipse cx="80" cy="80" rx="60" ry="80" fill="none" stroke={defaultColors.plasmid} strokeWidth="3" />
                  <ellipse cx="80" cy="80" rx="40" ry="50" fill={defaultColors.plasmid} fillOpacity="0.3" />
                  <text x="80" y="85" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">BAC</text>
                  <text x="80" y="180" textAnchor="middle" fontSize="10" fill="#333">细菌人工染色体</text>
                  <text x="80" y="195" textAnchor="middle" fontSize="9" fill="#666">100-300 kb</text>
                </g>
                
                <g transform="translate(370, 50)">
                  <ellipse cx="80" cy="80" rx="60" ry="80" fill="none" stroke="#FF5722" strokeWidth="3" />
                  <ellipse cx="80" cy="80" rx="40" ry="50" fill="#FF5722" fillOpacity="0.3" />
                  <text x="80" y="85" textAnchor="middle" fontSize="11" fill="white" fontWeight="bold">MAC</text>
                  <text x="80" y="180" textAnchor="middle" fontSize="10" fill="#333">哺乳动物人工染色体</text>
                  <text x="80" y="195" textAnchor="middle" fontSize="9" fill="#666">Mb级别</text>
                </g>
                
                <g transform="translate(50, 240)">
                  <rect x="0" y="0" width="400" height="50" fill="none" stroke="#333" strokeWidth="1" rx="5" />
                  <rect x="10" y="10" width="80" height="30" fill={defaultColors.artificialChromosome} fillOpacity="0.6" />
                  <text x="50" y="30" textAnchor="middle" fontSize="9" fill="white">中心粒</text>
                  <rect x="100" y="10" width="80" height="30" fill={defaultColors.ori} fillOpacity="0.6" />
                  <text x="140" y="30" textAnchor="middle" fontSize="9" fill="white">复制原点</text>
                  <rect x="190" y="10" width="80" height="30" fill={defaultColors.resistance} fillOpacity="0.6" />
                  <text x="230" y="30" textAnchor="middle" fontSize="9" fill="white">筛选标记</text>
                  <rect x="280" y="10" width="110" height="30" fill={defaultColors.mcs} fillOpacity="0.6" />
                  <text x="335" y="30" textAnchor="middle" fontSize="9" fill="white">插入位点</text>
                </g>
              </svg>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-semibold mb-2">YAC</h5>
                <p><strong>宿主：</strong>酵母</p>
                <p><strong>容量：</strong>100-2000 kb</p>
                <p><strong>特点：</strong>超大容量</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-semibold mb-2">BAC</h5>
                <p><strong>宿主：</strong>大肠杆菌</p>
                <p><strong>容量：</strong>100-300 kb</p>
                <p><strong>特点：</strong>稳定维持</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-semibold mb-2">MAC</h5>
                <p><strong>宿主：</strong>哺乳动物细胞</p>
                <p><strong>容量：</strong>Mb级别</p>
                <p><strong>特点：</strong>包含中心粒</p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-purple-50 rounded-lg">
              <h5 className="font-semibold mb-2">应用</h5>
              <p>基因组文库、大基因克隆、转基因动物</p>
            </div>
          </div>
        )}

        {activeTab === 'components' && (
          <div>
            <h4 className="text-lg font-semibold mb-4">载体元件</h4>
            
            <div className="flex justify-center mb-6">
              <svg width="500" height="400" viewBox="0 0 500 400">
                <g transform="translate(50, 30)">
                  <rect x="0" y="0" width="400" height="40" fill={defaultColors.ori} fillOpacity="0.6" rx="5" />
                  <text x="200" y="25" textAnchor="middle" fontSize="14" fill="white" fontWeight="bold">复制原点（Ori）</text>
                </g>
                
                <g transform="translate(50, 90)">
                  <rect x="0" y="0" width="400" height="40" fill={defaultColors.resistance} fillOpacity="0.6" rx="5" />
                  <text x="200" y="25" textAnchor="middle" fontSize="14" fill="white" fontWeight="bold">筛选标记（抗生素抗性基因）</text>
                </g>
                
                <g transform="translate(50, 150)">
                  <rect x="0" y="0" width="400" height="40" fill={defaultColors.mcs} fillOpacity="0.6" rx="5" />
                  <text x="200" y="25" textAnchor="middle" fontSize="14" fill="white" fontWeight="bold">多克隆位点（MCS）</text>
                </g>
                
                <g transform="translate(50, 210)">
                  <rect x="0" y="0" width="400" height="40" fill={defaultColors.promoter} fillOpacity="0.6" rx="5" />
                  <text x="200" y="25" textAnchor="middle" fontSize="14" fill="white" fontWeight="bold">启动子（Promoter）</text>
                </g>
                
                <g transform="translate(50, 270)">
                  <rect x="0" y="0" width="400" height="40" fill="#FF9800" fillOpacity="0.6" rx="5" />
                  <text x="200" y="25" textAnchor="middle" fontSize="14" fill="white" fontWeight="bold">融合标签（Tag）</text>
                </g>
                
                <g transform="translate(50, 330)">
                  <rect x="0" y="0" width="400" height="40" fill="#607D8B" fillOpacity="0.6" rx="5" />
                  <text x="200" y="25" textAnchor="middle" fontSize="14" fill="white" fontWeight="bold">终止子（Terminator）</text>
                </g>
                
                <line x1="250" y1="70" x2="250" y2="90" stroke="#333" strokeWidth="2" />
                <line x1="250" y1="130" x2="250" y2="150" stroke="#333" strokeWidth="2" />
                <line x1="250" y1="190" x2="250" y2="210" stroke="#333" strokeWidth="2" />
                <line x1="250" y1="250" x2="250" y2="270" stroke="#333" strokeWidth="2" />
                <line x1="250" y1="310" x2="250" y2="330" stroke="#333" strokeWidth="2" />
              </svg>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h5 className="font-semibold mb-2">复制原点示例</h5>
                <p>ColE1（高拷贝）、p15A（低拷贝）、SV40 ori（真核）</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h5 className="font-semibold mb-2">筛选标记示例</h5>
                <p>氨苄青霉素抗性（AmpR）、卡那霉素抗性（KanR）、lacZ（蓝白斑筛选）</p>
              </div>
              <div className="bg-cyan-50 p-4 rounded-lg">
                <h5 className="font-semibold mb-2">启动子示例</h5>
                <p>T7启动子（原核表达）、CMV启动子（真核强表达）、lac启动子（可诱导）</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <h5 className="font-semibold mb-2">融合标签示例</h5>
                <p>His-tag、GST-tag、Flag-tag、GFP</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'selection' && (
          <div>
            <h4 className="text-lg font-semibold mb-4">筛选方法</h4>
            
            <div className="flex justify-center mb-6">
              <svg width="500" height="350" viewBox="0 0 500 350">
                <g transform="translate(30, 30)">
                  <rect x="0" y="0" width="140" height="280" fill="none" stroke={defaultColors.resistance} strokeWidth="2" rx="10" />
                  <text x="70" y="30" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#333">抗生素抗性</text>
                  
                  <circle cx="30" cy="60" r="15" fill={defaultColors.resistance} fillOpacity="0.6" />
                  <text x="30" y="65" textAnchor="middle" fontSize="8" fill="white">+</text>
                  <text x="70" y="65" textAnchor="middle" fontSize="10" fill="#333">含载体</text>
                  
                  <circle cx="30" cy="90" r="15" fill="#ccc" />
                  <text x="30" y="95" textAnchor="middle" fontSize="8" fill="white">-</text>
                  <text x="70" y="95" textAnchor="middle" fontSize="10" fill="#333">不含载体</text>
                  
                  <rect x="10" y="120" width="120" height="40" fill={defaultColors.resistance} fillOpacity="0.3" rx="5" />
                  <text x="70" y="145" textAnchor="middle" fontSize="9" fill="#333">抗生素培养基</text>
                  
                  <line x1="30" y1="105" x2="30" y2="120" stroke="#333" strokeWidth="1" />
                  <line x1="110" y1="105" x2="110" y2="120" stroke="#333" strokeWidth="1" />
                  
                  <circle cx="30" cy="200" r="15" fill={defaultColors.resistance} fillOpacity="0.6" />
                  <text x="30" y="205" textAnchor="middle" fontSize="8" fill="white">✓</text>
                  <text x="70" y="205" textAnchor="middle" fontSize="10" fill="#333">生长</text>
                  
                  <circle cx="30" cy="240" r="15" fill="#f44336" fillOpacity="0.6" />
                  <text x="30" y="245" textAnchor="middle" fontSize="8" fill="white">✗</text>
                  <text x="70" y="245" textAnchor="middle" fontSize="10" fill="#333">不生长</text>
                  
                  <line x1="30" y1="160" x2="30" y2="185" stroke="#333" strokeWidth="1" />
                  <line x1="110" y1="160" x2="110" y2="185" stroke="#333" strokeWidth="1" />
                </g>
                
                <g transform="translate(190, 30)">
                  <rect x="0" y="0" width="140" height="280" fill="none" stroke="#607D8B" strokeWidth="2" rx="10" />
                  <text x="70" y="30" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#333">蓝白斑筛选</text>
                  
                  <rect x="20" y="50" width="100" height="30" fill="#607D8B" fillOpacity="0.3" rx="3" />
                  <text x="70" y="70" textAnchor="middle" fontSize="8" fill="#333">X-gal + IPTG</text>
                  
                  <circle cx="30" cy="120" r="20" fill="#2196F3" />
                  <text x="30" y="125" textAnchor="middle" fontSize="8" fill="white">蓝色</text>
                  <text x="80" y="125" textAnchor="middle" fontSize="9" fill="#333">lacZ完整</text>
                  
                  <circle cx="30" cy="170" r="20" fill="white" stroke="#333" strokeWidth="2" />
                  <text x="80" y="175" textAnchor="middle" fontSize="9" fill="#333">lacZ被插入破坏</text>
                  
                  <text x="70" y="220" textAnchor="middle" fontSize="9" fill="#666">α-互补原理</text>
                  <text x="70" y="240" textAnchor="middle" fontSize="8" fill="#999">插入片段破坏lacZ</text>
                  <text x="70" y="255" textAnchor="middle" fontSize="8" fill="#999">形成白色菌落</text>
                </g>
                
                <g transform="translate(350, 30)">
                  <rect x="0" y="0" width="130" height="280" fill="none" stroke="#FF9800" strokeWidth="2" rx="10" />
                  <text x="70" y="30" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#333">营养缺陷型</text>
                  
                  <rect x="20" y="50" width="90" height="30" fill="#FF9800" fillOpacity="0.3" rx="3" />
                  <text x="65" y="70" textAnchor="middle" fontSize="8" fill="#333">缺失培养基</text>
                  
                  <circle cx="30" cy="120" r="20" fill="#4CAF50" fillOpacity="0.6" />
                  <text x="30" y="125" textAnchor="middle" fontSize="8" fill="white">+</text>
                  <text x="75" y="125" textAnchor="middle" fontSize="9" fill="#333">载体互补</text>
                  
                  <circle cx="30" cy="170" r="20" fill="#f44336" fillOpacity="0.6" />
                  <text x="30" y="175" textAnchor="middle" fontSize="8" fill="white">-</text>
                  <text x="75" y="175" textAnchor="middle" fontSize="9" fill="#333">无载体</text>
                  
                  <text x="65" y="220" textAnchor="middle" fontSize="9" fill="#666">互补原理</text>
                  <text x="65" y="240" textAnchor="middle" fontSize="8" fill="#999">载体携带完整基因</text>
                  <text x="65" y="255" textAnchor="middle" fontSize="8" fill="#999">补充宿主缺陷</text>
                </g>
              </svg>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-semibold mb-2">抗生素抗性</h5>
                <p><strong>原理：</strong>只有含载体的细胞能在抗生素培养基上生长</p>
                <p><strong>常用抗生素：</strong></p>
                <p>• 氨苄青霉素</p>
                <p>• 卡那霉素</p>
                <p>• 氯霉素</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-semibold mb-2">蓝白斑筛选</h5>
                <p><strong>原理：</strong>α-互补：插入片段破坏lacZ基因，形成白色菌落</p>
                <p><strong>底物：</strong>X-gal</p>
                <p><strong>诱导剂：</strong>IPTG</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-semibold mb-2">营养缺陷型</h5>
                <p><strong>原理：</strong>互补宿主细胞的营养缺陷</p>
                <p><strong>常见标记：</strong></p>
                <p>• leu2</p>
                <p>• ura3</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
