import { useState } from 'react';

interface XLinkedInheritanceProps {
  data: any;
  colors?: Record<string, string>;
}

export function XLinkedInheritance({ data, colors }: XLinkedInheritanceProps) {
  const [activeTab, setActiveTab] = useState<'recessive' | 'dominant' | 'examples'>('recessive');
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);

  const defaultColors = {
    xChromosome: colors?.xChromosome || '#E91E63',
    yChromosome: colors?.yChromosome || '#1976D2',
    affected: colors?.affected || '#F44336',
    carrier: colors?.carrier || '#FFB74D',
    normal: colors?.normal || '#4CAF50',
    male: colors?.male || '#64B5F6',
    female: colors?.female || '#F06292',
  };

  const patterns = data?.patterns || [];
  const recessivePattern = patterns.find((p: any) => p.type === 'X连锁隐性遗传');
  const dominantPattern = patterns.find((p: any) => p.type === 'X连锁显性遗传');

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('recessive')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'recessive'
              ? 'bg-pink-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          X连锁隐性遗传
        </button>
        <button
          onClick={() => setActiveTab('dominant')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'dominant'
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          X连锁显性遗传
        </button>
        <button
          onClick={() => setActiveTab('examples')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'examples'
              ? 'bg-green-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          实例对比
        </button>
      </div>

      {activeTab === 'recessive' && (
        <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-pink-800">X连锁隐性遗传</h3>
          
          <div className="flex justify-center">
            <svg width="500" height="300" viewBox="0 0 500 300">
              <defs>
                <pattern id="stripes-pink" patternUnits="userSpaceOnUse" width="8" height="8">
                  <path d="M-2,2 l4,-4 M0,8 l8,-8 M6,10 l4,-4" stroke="#F06292" strokeWidth="1" opacity="0.3"/>
                </pattern>
              </defs>

              <text x="250" y="25" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#E91E63">X连锁隐性遗传模式</text>

              <g transform="translate(50, 50)">
                <text x="100" y="15" textAnchor="middle" fontSize="12" fill="#666">第一代（父母）</text>
                
                <g transform="translate(0, 30)">
                  <text x="50" y="35" textAnchor="middle" fontSize="11" fill="#666">正常男性</text>
                  <text x="50" y="50" textAnchor="middle" fontSize="10" fill="#E91E63">XᴬY</text>
                  <rect x="25" y="55" width="50" height="50" fill={defaultColors.normal} fillOpacity="0.2" stroke={defaultColors.normal} strokeWidth="2"/>
                </g>
                
                <g transform="translate(150, 30)">
                  <text x="50" y="35" textAnchor="middle" fontSize="11" fill="#666">携带者女性</text>
                  <text x="50" y="50" textAnchor="middle" fontSize="10" fill="#E91E63">XᴬXᵃ</text>
                  <circle cx="50" cy="80" r="25" fill="url(#stripes-pink)" stroke={defaultColors.female} strokeWidth="2"/>
                </g>
              </g>

              <line x1="125" y1="135" x2="200" y2="165" stroke="#999" strokeWidth="1" strokeDasharray="5,5"/>
              <line x1="225" y1="135" x2="200" y2="165" stroke="#999" strokeWidth="1" strokeDasharray="5,5"/>

              <g transform="translate(50, 180)">
                <text x="100" y="15" textAnchor="middle" fontSize="12" fill="#666">第二代（子女）</text>
                
                <g transform="translate(20, 30)">
                  <text x="30" y="35" textAnchor="middle" fontSize="11" fill="#666">儿子</text>
                  <text x="30" y="50" textAnchor="middle" fontSize="10" fill="#E91E63">XᴬY</text>
                  <rect x="5" y="55" width="50" height="50" fill={defaultColors.normal} fillOpacity="0.2" stroke={defaultColors.normal} strokeWidth="2"/>
                  <text x="30" y="120" textAnchor="middle" fontSize="10" fill="#4CAF50">正常</text>
                </g>
                
                <g transform="translate(100, 30)">
                  <text x="30" y="35" textAnchor="middle" fontSize="11" fill="#666">女儿</text>
                  <text x="30" y="50" textAnchor="middle" fontSize="10" fill="#E91E63">XᴬXᴬ</text>
                  <circle cx="30" cy="80" r="25" fill={defaultColors.normal} fillOpacity="0.2" stroke={defaultColors.female} strokeWidth="2"/>
                  <text x="30" y="120" textAnchor="middle" fontSize="10" fill="#4CAF50">正常</text>
                </g>

                <g transform="translate(180, 30)">
                  <text x="30" y="35" textAnchor="middle" fontSize="11" fill="#666">儿子</text>
                  <text x="30" y="50" textAnchor="middle" fontSize="10" fill="#E91E63">XᵃY</text>
                  <rect x="5" y="55" width="50" height="50" fill={defaultColors.affected} fillOpacity="0.2" stroke={defaultColors.affected} strokeWidth="2"/>
                  <text x="30" y="120" textAnchor="middle" fontSize="10" fill="#F44336">患病</text>
                </g>

                <g transform="translate(260, 30)">
                  <text x="30" y="35" textAnchor="middle" fontSize="11" fill="#666">女儿</text>
                  <text x="30" y="50" textAnchor="middle" fontSize="10" fill="#E91E63">XᴬXᵃ</text>
                  <circle cx="30" cy="80" r="25" fill="url(#stripes-pink)" stroke={defaultColors.female} strokeWidth="2"/>
                  <text x="30" y="120" textAnchor="middle" fontSize="10" fill="#FFB74D">携带者</text>
                </g>
              </g>
            </svg>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-pink-800 mb-3">特征</h4>
            <ul className="space-y-2">
              {recessivePattern?.characteristics?.map((char: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-pink-500 mt-1">•</span>
                  <span>{char}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-pink-800 mb-3">常见疾病</h4>
            <div className="flex flex-wrap gap-2">
              {recessivePattern?.examples?.map((ex: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
                  {ex}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'dominant' && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-blue-800">X连锁显性遗传</h3>
          
          <div className="flex justify-center">
            <svg width="500" height="300" viewBox="0 0 500 300">
              <text x="250" y="25" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1976D2">X连锁显性遗传模式</text>

              <g transform="translate(50, 50)">
                <text x="100" y="15" textAnchor="middle" fontSize="12" fill="#666">第一代（父母）</text>
                
                <g transform="translate(0, 30)">
                  <text x="50" y="35" textAnchor="middle" fontSize="11" fill="#666">患病男性</text>
                  <text x="50" y="50" textAnchor="middle" fontSize="10" fill="#1976D2">XᴬY</text>
                  <rect x="25" y="55" width="50" height="50" fill={defaultColors.affected} fillOpacity="0.2" stroke={defaultColors.affected} strokeWidth="2"/>
                </g>
                
                <g transform="translate(150, 30)">
                  <text x="50" y="35" textAnchor="middle" fontSize="11" fill="#666">正常女性</text>
                  <text x="50" y="50" textAnchor="middle" fontSize="10" fill="#1976D2">XᵃXᵃ</text>
                  <circle cx="50" cy="80" r="25" fill={defaultColors.normal} fillOpacity="0.2" stroke={defaultColors.female} strokeWidth="2"/>
                </g>
              </g>

              <line x1="125" y1="135" x2="200" y2="165" stroke="#999" strokeWidth="1" strokeDasharray="5,5"/>
              <line x1="225" y1="135" x2="200" y2="165" stroke="#999" strokeWidth="1" strokeDasharray="5,5"/>

              <g transform="translate(50, 180)">
                <text x="100" y="15" textAnchor="middle" fontSize="12" fill="#666">第二代（子女）</text>
                
                <g transform="translate(50, 30)">
                  <text x="50" y="35" textAnchor="middle" fontSize="11" fill="#666">女儿</text>
                  <text x="50" y="50" textAnchor="middle" fontSize="10" fill="#1976D2">XᴬXᵃ</text>
                  <circle cx="50" cy="80" r="25" fill={defaultColors.affected} fillOpacity="0.2" stroke={defaultColors.female} strokeWidth="2"/>
                  <text x="50" y="120" textAnchor="middle" fontSize="10" fill="#F44336">患病</text>
                </g>

                <g transform="translate(180, 30)">
                  <text x="50" y="35" textAnchor="middle" fontSize="11" fill="#666">女儿</text>
                  <text x="50" y="50" textAnchor="middle" fontSize="10" fill="#1976D2">XᵃXᵃ</text>
                  <circle cx="50" cy="80" r="25" fill={defaultColors.normal} fillOpacity="0.2" stroke={defaultColors.female} strokeWidth="2"/>
                  <text x="50" y="120" textAnchor="middle" fontSize="10" fill="#4CAF50">正常</text>
                </g>
              </g>
            </svg>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-3">特征</h4>
            <ul className="space-y-2">
              {dominantPattern?.characteristics?.map((char: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>{char}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-3">常见疾病</h4>
            <div className="flex flex-wrap gap-2">
              {dominantPattern?.examples?.map((ex: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {ex}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'examples' && (
        <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-green-800">实例对比</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-green-100">
                  <th className="px-4 py-3 text-left text-green-800">比较项目</th>
                  <th className="px-4 py-3 text-left text-green-800">X连锁隐性遗传</th>
                  <th className="px-4 py-3 text-left text-green-800">X连锁显性遗传</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-3 font-medium">患病性别比例</td>
                  <td className="px-4 py-3 text-pink-600">男性 &gt;&gt; 女性</td>
                  <td className="px-4 py-3 text-blue-600">女性 &gt; 男性</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3 font-medium">男性患者来源</td>
                  <td className="px-4 py-3 text-pink-600">从母亲获得致病基因</td>
                  <td className="px-4 py-3 text-blue-600">从母亲获得致病基因</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3 font-medium">父亲→儿子传递</td>
                  <td className="px-4 py-3 text-pink-600">不存在（Y染色体不传递）</td>
                  <td className="px-4 py-3 text-blue-600">不存在</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3 font-medium">携带者</td>
                  <td className="px-4 py-3 text-pink-600">女性携带者表型正常</td>
                  <td className="px-4 py-3 text-blue-600">无携带者概念</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">常见疾病</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      <span className="px-2 py-1 bg-pink-100 rounded text-xs">色盲</span>
                      <span className="px-2 py-1 bg-pink-100 rounded text-xs">血友病A</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      <span className="px-2 py-1 bg-blue-100 rounded text-xs">抗维生素D佝偻病</span>
                      <span className="px-2 py-1 bg-blue-100 rounded text-xs">遗传性肾炎</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-3">关键要点</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>X连锁隐性遗传：</strong>男性只需要一条X染色体上有致病基因就会发病，女性需要两条X染色体都有致病基因才会发病</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>X连锁显性遗传：</strong>只要X染色体上有致病基因就会发病，无论男性还是女性</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>共同特点：</strong>都不存在父亲→儿子的传递，因为父亲将Y染色体传给儿子</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
