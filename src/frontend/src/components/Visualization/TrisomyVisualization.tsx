import { useState } from 'react';
import { VisualizationColors } from '../../constants/visualization-colors';

interface TrisomyVisualizationProps {
  colors?: Record<string, string>;
}

export function TrisomyVisualization({ colors }: TrisomyVisualizationProps) {
  const [activeTab, setActiveTab] = useState<'down' | 'patau' | 'edwards' | 'klinefelter'>('down');

  const defaultColors = {
    normal: colors?.normal || VisualizationColors.normal,
    extra: colors?.extra || VisualizationColors.affected,
    highlight: colors?.highlight || VisualizationColors.hover,
    marker: colors?.marker || VisualizationColors.nodePrinciple,
  };

  const trisomyTypes = [
    {
      id: 'down',
      name: '唐氏综合征',
      chromosome: '21三体',
      description: '21号染色体多出一条',
      incidence: '1/700',
      features: ['智力障碍', '面部特征', '心脏缺陷'],
    },
    {
      id: 'patau',
      name: '帕陶综合征',
      chromosome: '13三体',
      description: '13号染色体多出一条',
      incidence: '1/10000',
      features: ['严重畸形', '中枢神经系统异常', '多器官缺陷'],
    },
    {
      id: 'edwards',
      name: '爱德华兹综合征',
      chromosome: '18三体',
      description: '18号染色体多出一条',
      incidence: '1/5000',
      features: ['生长迟缓', '心脏异常', '肌肉张力低'],
    },
    {
      id: 'klinefelter',
      name: '克莱恩费尔特综合征',
      chromosome: 'XXY',
      description: '性染色体多出一条X',
      incidence: '1/650',
      features: ['男性不育', '乳房发育', '学习障碍'],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {trisomyTypes.map((type) => (
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

      {activeTab === 'down' && (
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-blue-800">唐氏综合征（21三体）</h3>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">1/700</span>
          </div>
          
          <div className="flex justify-center">
            <svg width="600" height="400" viewBox="0 0 600 400">
              <defs>
                <marker id="arrow-blue" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L9,3 z" fill="#3B82F6"/>
                </marker>
              </defs>

              <text x="300" y="25" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1976D2">唐氏综合征染色体核型</text>

              <g transform="translate(80, 50)">
                <text x="220" y="15" textAnchor="middle" fontSize="12" fill="#666">正常核型（46,XX 或 46,XY）</text>
                
                <g transform="translate(30, 30)">
                  <g transform="translate(0, 0)">
                    <rect x="0" y="0" width="30" height="50" fill={defaultColors.normal} fillOpacity="0.4" stroke={defaultColors.normal} strokeWidth="2" rx="8"/>
                    <rect x="5" y="20" width="20" height="10" fill="#1D4ED8" fillOpacity="0.3"/>
                  </g>
                  <g transform="translate(40, 0)">
                    <rect x="0" y="0" width="30" height="50" fill={defaultColors.normal} fillOpacity="0.4" stroke={defaultColors.normal} strokeWidth="2" rx="8"/>
                    <rect x="5" y="20" width="20" height="10" fill="#1D4ED8" fillOpacity="0.3"/>
                  </g>
                  <text x="35" y="70" textAnchor="middle" fontSize="10" fill={defaultColors.normal}>21号</text>
                </g>
                
                <g transform="translate(130, 30)">
                  <g transform="translate(0, 0)">
                    <rect x="0" y="0" width="30" height="50" fill={defaultColors.normal} fillOpacity="0.4" stroke={defaultColors.normal} strokeWidth="2" rx="8"/>
                  </g>
                  <g transform="translate(40, 0)">
                    <rect x="0" y="0" width="30" height="50" fill={defaultColors.normal} fillOpacity="0.4" stroke={defaultColors.normal} strokeWidth="2" rx="8"/>
                  </g>
                  <text x="35" y="70" textAnchor="middle" fontSize="10" fill={defaultColors.normal}>22号</text>
                </g>
                
                <g transform="translate(260, 30)">
                  <g transform="translate(0, 0)">
                    <rect x="0" y="0" width="30" height="30" fill={defaultColors.normal} fillOpacity="0.4" stroke={defaultColors.normal} strokeWidth="2" rx="8"/>
                  </g>
                  <g transform="translate(40, 0)">
                    <rect x="0" y="0" width="30" height="30" fill={defaultColors.normal} fillOpacity="0.4" stroke={defaultColors.normal} strokeWidth="2" rx="8"/>
                  </g>
                  <text x="35" y="50" textAnchor="middle" fontSize="10" fill={defaultColors.normal}>性染色体</text>
                </g>
              </g>

              <g transform="translate(80, 200)">
                <text x="220" y="15" textAnchor="middle" fontSize="12" fill="#666">唐氏综合征核型（47,XX,+21 或 47,XY,+21）</text>
                
                <g transform="translate(30, 30)">
                  <g transform="translate(0, 0)">
                    <rect x="0" y="0" width="30" height="50" fill={defaultColors.normal} fillOpacity="0.4" stroke={defaultColors.normal} strokeWidth="2" rx="8"/>
                    <rect x="5" y="20" width="20" height="10" fill="#1D4ED8" fillOpacity="0.3"/>
                  </g>
                  <g transform="translate(40, 0)">
                    <rect x="0" y="0" width="30" height="50" fill={defaultColors.normal} fillOpacity="0.4" stroke={defaultColors.normal} strokeWidth="2" rx="8"/>
                    <rect x="5" y="20" width="20" height="10" fill="#1D4ED8" fillOpacity="0.3"/>
                  </g>
                  <g transform="translate(80, 0)">
                    <rect x="0" y="0" width="30" height="50" fill={defaultColors.extra} fillOpacity="0.4" stroke={defaultColors.extra} strokeWidth="3" rx="8"/>
                    <rect x="5" y="20" width="20" height="10" fill="#DC2626" fillOpacity="0.3"/>
                    <text x="15" y="-5" textAnchor="middle" fontSize="8" fill="#DC2626">+1</text>
                  </g>
                  <text x="50" y="70" textAnchor="middle" fontSize="10" fill={defaultColors.extra}>21号（三体）</text>
                </g>
                
                <g transform="translate(130, 30)">
                  <g transform="translate(0, 0)">
                    <rect x="0" y="0" width="30" height="50" fill={defaultColors.normal} fillOpacity="0.4" stroke={defaultColors.normal} strokeWidth="2" rx="8"/>
                  </g>
                  <g transform="translate(40, 0)">
                    <rect x="0" y="0" width="30" height="50" fill={defaultColors.normal} fillOpacity="0.4" stroke={defaultColors.normal} strokeWidth="2" rx="8"/>
                  </g>
                  <text x="35" y="70" textAnchor="middle" fontSize="10" fill={defaultColors.normal}>22号</text>
                </g>
                
                <g transform="translate(260, 30)">
                  <g transform="translate(0, 0)">
                    <rect x="0" y="0" width="30" height="30" fill={defaultColors.normal} fillOpacity="0.4" stroke={defaultColors.normal} strokeWidth="2" rx="8"/>
                  </g>
                  <g transform="translate(40, 0)">
                    <rect x="0" y="0" width="30" height="30" fill={defaultColors.normal} fillOpacity="0.4" stroke={defaultColors.normal} strokeWidth="2" rx="8"/>
                  </g>
                  <text x="35" y="50" textAnchor="middle" fontSize="10" fill={defaultColors.normal}>性染色体</text>
                </g>

                <path d="M50,0 L50,30" stroke={defaultColors.extra} strokeWidth="2" strokeDasharray="4,2"/>
                <path d="M120,0 L120,30" stroke={defaultColors.extra} strokeWidth="2" strokeDasharray="4,2"/>
              </g>
            </svg>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-3">临床特征</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium text-gray-800 mb-2">外貌特征</h5>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• 眼距宽</li>
                  <li>• 扁平鼻梁</li>
                  <li>• 向上倾斜的眼睛</li>
                  <li>• 小耳朵</li>
                  <li>• 短脖子</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-gray-800 mb-2">健康问题</h5>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• 轻度至中度智力障碍</li>
                  <li>• 先天性心脏缺陷</li>
                  <li>• 肌张力低</li>
                  <li>• 免疫系统异常</li>
                  <li>• 寿命缩短</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'patau' && (
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-red-800">帕陶综合征（13三体）</h3>
            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">1/10000</span>
          </div>
          
          <div className="flex justify-center">
            <svg width="600" height="350" viewBox="0 0 600 350">
              <defs>
                <marker id="arrow-red" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L9,3 z" fill="#EF4444"/>
                </marker>
              </defs>

              <text x="300" y="25" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1976D2">帕陶综合征染色体核型</text>

              <g transform="translate(150, 50)">
                <text x="150" y="15" textAnchor="middle" fontSize="12" fill="#666">核型：47,XX,+13 或 47,XY,+13</text>
                
                <g transform="translate(30, 30)">
                  <g transform="translate(0, 0)">
                    <rect x="0" y="0" width="35" height="60" fill={defaultColors.normal} fillOpacity="0.4" stroke={defaultColors.normal} strokeWidth="2" rx="8"/>
                  </g>
                  <g transform="translate(45, 0)">
                    <rect x="0" y="0" width="35" height="60" fill={defaultColors.normal} fillOpacity="0.4" stroke={defaultColors.normal} strokeWidth="2" rx="8"/>
                  </g>
                  <g transform="translate(90, 0)">
                    <rect x="0" y="0" width="35" height="60" fill={defaultColors.extra} fillOpacity="0.4" stroke={defaultColors.extra} strokeWidth="3" rx="8"/>
                    <text x="17" y="-5" textAnchor="middle" fontSize="8" fill="#DC2626">+1</text>
                  </g>
                  <text x="57" y="80" textAnchor="middle" fontSize="10" fill={defaultColors.extra}>13号（三体）</text>
                </g>
              </g>

              <g transform="translate(80, 150)">
                <rect x="0" y="0" width="440" height="150" fill="white" stroke={defaultColors.extra} strokeWidth="2" rx="8"/>
                
                <text x="220" y="25" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#DC2626">严重畸形特征</text>
                
                <g transform="translate(20, 40)">
                  <rect x="0" y="0" width="130" height="90" fill="#FEF2F2" stroke="#EF4444" strokeWidth="1" rx="4"/>
                  <text x="65" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#DC2626">中枢神经系统</text>
                  <text x="65" y="40" textAnchor="middle" fontSize="9" fill="#666">• 前脑无裂</text>
                  <text x="65" y="55" textAnchor="middle" fontSize="9" fill="#666">• 小头畸形</text>
                  <text x="65" y="70" textAnchor="middle" fontSize="9" fill="#666">• 严重智力障碍</text>
                </g>
                
                <g transform="translate(155, 40)">
                  <rect x="0" y="0" width="130" height="90" fill="#FEF2F2" stroke="#EF4444" strokeWidth="1" rx="4"/>
                  <text x="65" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#DC2626">面部特征</text>
                  <text x="65" y="40" textAnchor="middle" fontSize="9" fill="#666">• 唇裂/腭裂</text>
                  <text x="65" y="55" textAnchor="middle" fontSize="9" fill="#666">• 小眼畸形</text>
                  <text x="65" y="70" textAnchor="middle" fontSize="9" fill="#666">• 多指畸形</text>
                </g>
                
                <g transform="translate(290, 40)">
                  <rect x="0" y="0" width="130" height="90" fill="#FEF2F2" stroke="#EF4444" strokeWidth="1" rx="4"/>
                  <text x="65" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#DC2626">内脏异常</text>
                  <text x="65" y="40" textAnchor="middle" fontSize="9" fill="#666">• 心脏缺陷</text>
                  <text x="65" y="55" textAnchor="middle" fontSize="9" fill="#666">• 肾脏异常</text>
                  <text x="65" y="70" textAnchor="middle" fontSize="9" fill="#666">• 脐疝</text>
                </g>
              </g>
            </svg>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-red-800 mb-3">预后</h4>
            <p className="text-sm text-gray-700 mb-3">
              帕陶综合征是最严重的三体综合征之一，预后极差。大多数患儿在出生后数月内死亡，只有约5-10%的患儿能存活至1岁以上。
            </p>
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-red-50 rounded-lg p-3">
                <p className="text-xs text-red-800 font-medium">平均生存期</p>
                <p className="text-lg font-bold text-red-900">6-12个月</p>
              </div>
              <div className="flex-1 bg-red-50 rounded-lg p-3">
                <p className="text-xs text-red-800 font-medium">1岁生存率</p>
                <p className="text-lg font-bold text-red-900">5-10%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'edwards' && (
        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-orange-800">爱德华兹综合征（18三体）</h3>
            <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">1/5000</span>
          </div>
          
          <div className="flex justify-center">
            <svg width="600" height="350" viewBox="0 0 600 350">
              <text x="300" y="25" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1976D2">爱德华兹综合征染色体核型</text>

              <g transform="translate(150, 50)">
                <text x="150" y="15" textAnchor="middle" fontSize="12" fill="#666">核型：47,XX,+18 或 47,XY,+18</text>
                
                <g transform="translate(30, 30)">
                  <g transform="translate(0, 0)">
                    <rect x="0" y="0" width="32" height="55" fill={defaultColors.normal} fillOpacity="0.4" stroke={defaultColors.normal} strokeWidth="2" rx="8"/>
                  </g>
                  <g transform="translate(42, 0)">
                    <rect x="0" y="0" width="32" height="55" fill={defaultColors.normal} fillOpacity="0.4" stroke={defaultColors.normal} strokeWidth="2" rx="8"/>
                  </g>
                  <g transform="translate(84, 0)">
                    <rect x="0" y="0" width="32" height="55" fill={defaultColors.extra} fillOpacity="0.4" stroke={defaultColors.extra} strokeWidth="3" rx="8"/>
                    <text x="16" y="-5" textAnchor="middle" fontSize="8" fill="#DC2626">+1</text>
                  </g>
                  <text x="54" y="75" textAnchor="middle" fontSize="10" fill={defaultColors.extra}>18号（三体）</text>
                </g>
              </g>

              <g transform="translate(80, 150)">
                <rect x="0" y="0" width="440" height="150" fill="white" stroke={defaultColors.extra} strokeWidth="2" rx="8"/>
                
                <text x="220" y="25" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#EA580C">临床特征</text>
                
                <g transform="translate(20, 40)">
                  <rect x="0" y="0" width="130" height="90" fill="#FFF7ED" stroke="#F97316" strokeWidth="1" rx="4"/>
                  <text x="65" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#EA580C">外貌特征</text>
                  <text x="65" y="40" textAnchor="middle" fontSize="9" fill="#666">• 低出生体重</text>
                  <text x="65" y="55" textAnchor="middle" fontSize="9" fill="#666">• 小头畸形</text>
                  <text x="65" y="70" textAnchor="middle" fontSize="9" fill="#666">• 下颌小</text>
                </g>
                
                <g transform="translate(155, 40)">
                  <rect x="0" y="0" width="130" height="90" fill="#FFF7ED" stroke="#F97316" strokeWidth="1" rx="4"/>
                  <text x="65" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#EA580C">肢体异常</text>
                  <text x="65" y="40" textAnchor="middle" fontSize="9" fill="#666">• 握拳畸形</text>
                  <text x="65" y="55" textAnchor="middle" fontSize="9" fill="#666">• 摇椅足</text>
                  <text x="65" y="70" textAnchor="middle" fontSize="9" fill="#666">• 短指</text>
                </g>
                
                <g transform="translate(290, 40)">
                  <rect x="0" y="0" width="130" height="90" fill="#FFF7ED" stroke="#F97316" strokeWidth="1" rx="4"/>
                  <text x="65" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#EA580C">内脏异常</text>
                  <text x="65" y="40" textAnchor="middle" fontSize="9" fill="#666">• 心脏缺陷</text>
                  <text x="65" y="55" textAnchor="middle" fontSize="9" fill="#666">• 肾脏异常</text>
                  <text x="65" y="70" textAnchor="middle" fontSize="9" fill="#666">• 膈疝</text>
                </g>
              </g>
            </svg>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-orange-800 mb-3">预后</h4>
            <p className="text-sm text-gray-700 mb-3">
              爱德华兹综合征预后较差，多数患儿在出生后1年内死亡。约50%的患儿在1个月内死亡，只有约5-10%的患儿能存活至1岁以上。
            </p>
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-orange-50 rounded-lg p-3">
                <p className="text-xs text-orange-800 font-medium">1个月生存率</p>
                <p className="text-lg font-bold text-orange-900">约50%</p>
              </div>
              <div className="flex-1 bg-orange-50 rounded-lg p-3">
                <p className="text-xs text-orange-800 font-medium">1岁生存率</p>
                <p className="text-lg font-bold text-orange-900">5-10%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'klinefelter' && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-purple-800">克莱恩费尔特综合征（XXY）</h3>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">1/650</span>
          </div>
          
          <div className="flex justify-center">
            <svg width="600" height="350" viewBox="0 0 600 350">
              <text x="300" y="25" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1976D2">克莱恩费尔特综合征染色体核型</text>

              <g transform="translate(100, 50)">
                <text x="200" y="15" textAnchor="middle" fontSize="12" fill="#666">核型：47,XXY</text>
                
                <g transform="translate(30, 30)">
                  <text x="60" y="0" textAnchor="middle" fontSize="10" fill="#666">正常男性（46,XY）</text>
                  
                  <g transform="translate(0, 20)">
                    <rect x="0" y="0" width="30" height="30" fill="#3B82F6" fillOpacity="0.4" stroke="#3B82F6" strokeWidth="2" rx="8"/>
                    <text x="15" y="18" textAnchor="middle" fontSize="10" fill="#1D4ED8">X</text>
                  </g>
                  <g transform="translate(40, 20)">
                    <rect x="0" y="0" width="30" height="30" fill="#EF4444" fillOpacity="0.4" stroke="#EF4444" strokeWidth="2" rx="8"/>
                    <text x="15" y="18" textAnchor="middle" fontSize="10" fill="#DC2626">Y</text>
                  </g>
                  <text x="35" y="70" textAnchor="middle" fontSize="10" fill={defaultColors.normal}>性染色体</text>
                </g>
                
                <g transform="translate(200, 30)">
                  <text x="60" y="0" textAnchor="middle" fontSize="10" fill="#666">XXY综合征（47,XXY）</text>
                  
                  <g transform="translate(0, 20)">
                    <rect x="0" y="0" width="30" height="30" fill="#3B82F6" fillOpacity="0.4" stroke="#3B82F6" strokeWidth="2" rx="8"/>
                    <text x="15" y="18" textAnchor="middle" fontSize="10" fill="#1D4ED8">X</text>
                  </g>
                  <g transform="translate(40, 20)">
                    <rect x="0" y="0" width="30" height="30" fill="#3B82F6" fillOpacity="0.4" stroke="#3B82F6" strokeWidth="3" rx="8"/>
                    <text x="15" y="18" textAnchor="middle" fontSize="10" fill="#1D4ED8">X</text>
                    <text x="15" y="-5" textAnchor="middle" fontSize="8" fill="#1D4ED8">+X</text>
                  </g>
                  <g transform="translate(80, 20)">
                    <rect x="0" y="0" width="30" height="30" fill="#EF4444" fillOpacity="0.4" stroke="#EF4444" strokeWidth="2" rx="8"/>
                    <text x="15" y="18" textAnchor="middle" fontSize="10" fill="#DC2626">Y</text>
                  </g>
                  <text x="55" y="70" textAnchor="middle" fontSize="10" fill={defaultColors.extra}>性染色体（XXY）</text>
                </g>
              </g>

              <g transform="translate(80, 150)">
                <rect x="0" y="0" width="440" height="150" fill="white" stroke={defaultColors.extra} strokeWidth="2" rx="8"/>
                
                <text x="220" y="25" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#6D28D9">临床特征</text>
                
                <g transform="translate(20, 40)">
                  <rect x="0" y="0" width="130" height="90" fill="#F3E8FF" stroke="#8B5CF6" strokeWidth="1" rx="4"/>
                  <text x="65" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#6D28D9">身体特征</text>
                  <text x="65" y="40" textAnchor="middle" fontSize="9" fill="#666">• 身材高大</text>
                  <text x="65" y="55" textAnchor="middle" fontSize="9" fill="#666">• 四肢细长</text>
                  <text x="65" y="70" textAnchor="middle" fontSize="9" fill="#666">• 乳房发育</text>
                </g>
                
                <g transform="translate(155, 40)">
                  <rect x="0" y="0" width="130" height="90" fill="#F3E8FF" stroke="#8B5CF6" strokeWidth="1" rx="4"/>
                  <text x="65" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#6D28D9">生殖功能</text>
                  <text x="65" y="40" textAnchor="middle" fontSize="9" fill="#666">• 睾丸小</text>
                  <text x="65" y="55" textAnchor="middle" fontSize="9" fill="#666">• 男性不育</text>
                  <text x="65" y="70" textAnchor="middle" fontSize="9" fill="#666">• 雌激素水平高</text>
                </g>
                
                <g transform="translate(290, 40)">
                  <rect x="0" y="0" width="130" height="90" fill="#F3E8FF" stroke="#8B5CF6" strokeWidth="1" rx="4"/>
                  <text x="65" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#6D28D9">认知影响</text>
                  <text x="65" y="40" textAnchor="middle" fontSize="9" fill="#666">• 学习困难</text>
                  <text x="65" y="55" textAnchor="middle" fontSize="9" fill="#666">• 语言发育迟缓</text>
                  <text x="65" y="70" textAnchor="middle" fontSize="9" fill="#666">• 社交技能差</text>
                </g>
              </g>
            </svg>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-3">治疗与预后</h4>
            <p className="text-sm text-gray-700 mb-3">
              克莱恩费尔特综合征是最常见的性染色体异常，患者通常寿命正常。通过睾酮替代治疗可以改善症状。
            </p>
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-purple-50 rounded-lg p-3">
                <p className="text-xs text-purple-800 font-medium">主要治疗</p>
                <p className="text-sm font-bold text-purple-900">睾酮替代治疗</p>
              </div>
              <div className="flex-1 bg-purple-50 rounded-lg p-3">
                <p className="text-xs text-purple-800 font-medium">预期寿命</p>
                <p className="text-sm font-bold text-purple-900">正常</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
        <h4 className="font-semibold text-gray-800 mb-3">三体综合征发病机制</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h5 className="font-medium text-blue-700 mb-2">非整倍体形成</h5>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• 减数分裂I同源染色体不分离</li>
              <li>• 减数分裂II姐妹染色单体不分离</li>
              <li>• 受精后早期有丝分裂不分离</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h5 className="font-medium text-green-700 mb-2">风险因素</h5>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• 母亲年龄增大（主要因素）</li>
              <li>• 遗传易感性</li>
              <li>• 环境因素</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
