import { useState } from 'react';
import { VisualizationColors } from '../../constants/visualization-colors';

interface TranslationVisualizationProps {
  data: any;
  colors?: Record<string, string>;
}

export function TranslationVisualization({ data, colors }: TranslationVisualizationProps) {
  const [activeTab, setActiveTab] = useState<'process' | 'ribosome' | 'codons'>('process');
  const [currentStep, setCurrentStep] = useState(0);

  const defaultColors = {
    mrna: colors?.mrna || VisualizationColors.nodePrinciple,
    trna: colors?.trna || VisualizationColors.dominant,
    ribosomeLarge: colors?.ribosomeLarge || VisualizationColors.male,
    ribosomeSmall: colors?.ribosomeSmall || VisualizationColors.affected,
    aminoAcid: colors?.aminoAcid || VisualizationColors.hover,
  };

  const steps = data?.steps || [
    { name: '起始', description: '核糖体识别起始密码子' },
    { name: '延伸', description: 'tRNA依次进入核糖体' },
    { name: '终止', description: '核糖体识别终止密码子' },
  ];

  const codonTable = data?.codonTable || [
    { codon: 'AUG', aminoAcid: '甲硫氨酸' },
    { codon: 'UUU', aminoAcid: '苯丙氨酸' },
    { codon: 'GAA', aminoAcid: '谷氨酸' },
    { codon: 'UAA', aminoAcid: '终止' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('process')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'process'
              ? 'bg-green-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          翻译过程
        </button>
        <button
          onClick={() => setActiveTab('ribosome')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'ribosome'
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          核糖体结构
        </button>
        <button
          onClick={() => setActiveTab('codons')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'codons'
              ? 'bg-purple-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          密码子表
        </button>
      </div>

      {activeTab === 'process' && (
        <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-green-800">翻译过程概述</h3>
          
          <div className="flex justify-center">
            <svg width="600" height="280" viewBox="0 0 600 280">
              <text x="300" y="25" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1976D2">翻译过程示意图</text>

              <g transform="translate(50, 50)">
                <text x="250" y="15" textAnchor="middle" fontSize="12" fill="#666">mRNA模板</text>
                <rect x="50" y="30" width="400" height="25" fill="#EDE9FE" stroke={defaultColors.mrna} strokeWidth="2" rx="4"/>
                <text x="250" y="47" textAnchor="middle" fontSize="11" fontWeight="bold" fill={defaultColors.mrna}>5' - AUG - UUU - GAA - UAA - 3'</text>
              </g>

              <g transform="translate(100, 100)">
                <ellipse cx="200" cy="50" rx="180" ry="70" fill={defaultColors.ribosomeLarge} fillOpacity="0.15" stroke={defaultColors.ribosomeLarge} strokeWidth="3"/>
                <text x="200" y="45" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1E40AF">核糖体</text>
                <text x="200" y="65" textAnchor="middle" fontSize="10" fill="#666">大亚基</text>
                
                <ellipse cx="200" cy="55" rx="100" ry="40" fill={defaultColors.ribosomeSmall} fillOpacity="0.15" stroke={defaultColors.ribosomeSmall} strokeWidth="2"/>
                <text x="200" y="90" textAnchor="middle" fontSize="10" fill="#666">小亚基</text>
              </g>

              <g transform="translate(100, 220)">
                <text x="250" y="15" textAnchor="middle" fontSize="12" fill="#666">tRNA进入核糖体</text>
                
                <g transform="translate(50, 30)">
                  <rect x="0" y="0" width="80" height="30" fill="#D1FAE5" stroke={defaultColors.trna} strokeWidth="2" rx="4"/>
                  <text x="40" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill={defaultColors.trna}>tRNA-AUG</text>
                  <circle cx="40" cy="40" r="12" fill={defaultColors.aminoAcid} fillOpacity="0.3" stroke={defaultColors.aminoAcid} strokeWidth="1"/>
                  <text x="40" y="44" textAnchor="middle" fontSize="9" fill="#B45309">Met</text>
                </g>
                
                <g transform="translate(150, 30)">
                  <rect x="0" y="0" width="80" height="30" fill="#D1FAE5" stroke={defaultColors.trna} strokeWidth="2" rx="4"/>
                  <text x="40" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill={defaultColors.trna}>tRNA-UUU</text>
                  <circle cx="40" cy="40" r="12" fill={defaultColors.aminoAcid} fillOpacity="0.3" stroke={defaultColors.aminoAcid} strokeWidth="1"/>
                  <text x="40" y="44" textAnchor="middle" fontSize="9" fill="#B45309">Phe</text>
                </g>

                <g transform="translate(250, 30)">
                  <rect x="0" y="0" width="80" height="30" fill="#D1FAE5" stroke={defaultColors.trna} strokeWidth="2" rx="4"/>
                  <text x="40" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill={defaultColors.trna}>tRNA-GAA</text>
                  <circle cx="40" cy="40" r="12" fill={defaultColors.aminoAcid} fillOpacity="0.3" stroke={defaultColors.aminoAcid} strokeWidth="1"/>
                  <text x="40" y="44" textAnchor="middle" fontSize="9" fill="#B45309">Glu</text>
                </g>

                <g transform="translate(350, 30)">
                  <rect x="0" y="0" width="80" height="30" fill="#FEE2E2" stroke="#EF4444" strokeWidth="2" rx="4"/>
                  <text x="40" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#DC2626">tRNA-UAA</text>
                  <circle cx="40" cy="40" r="12" fill="#FEE2E2" stroke="#EF4444" strokeWidth="1" strokeDasharray="3,3"/>
                  <text x="40" y="44" textAnchor="middle" fontSize="9" fill="#DC2626">终止</text>
                </g>
              </g>
            </svg>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-3">翻译特点</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>场所：</strong>细胞质中的核糖体</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>模板：</strong>mRNA</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>运输者：</strong>tRNA携带氨基酸</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>产物：</strong>多肽链（蛋白质）</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>方向：</strong>从N端到C端延伸</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'ribosome' && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-blue-800">核糖体结构</h3>
          
          <div className="flex justify-center">
            <svg width="500" height="300" viewBox="0 0 500 300">
              <text x="250" y="25" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1976D2">核糖体结构</text>

              <g transform="translate(50, 50)">
                <ellipse cx="200" cy="100" rx="160" ry="90" fill={defaultColors.ribosomeLarge} fillOpacity="0.2" stroke={defaultColors.ribosomeLarge} strokeWidth="3"/>
                <text x="200" y="90" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1E40AF">大亚基 (60S)</text>
                <text x="200" y="110" textAnchor="middle" fontSize="12" fill="#666">含肽酰转移酶活性位点</text>

                <ellipse cx="200" cy="115" rx="90" ry="55" fill={defaultColors.ribosomeSmall} fillOpacity="0.2" stroke={defaultColors.ribosomeSmall} strokeWidth="3"/>
                <text x="200" y="190" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#991B1B">小亚基 (40S)</text>
                <text x="200" y="210" textAnchor="middle" fontSize="12" fill="#666">含mRNA结合位点</text>
              </g>

              <g transform="translate(50, 260)">
                <text x="200" y="15" textAnchor="middle" fontSize="12" fill="#666">功能位点</text>
                <rect x="50" y="30" width="100" height="25" fill="#EDE9FE" stroke={defaultColors.mrna} strokeWidth="1.5" rx="3"/>
                <text x="100" y="47" textAnchor="middle" fontSize="10" fill={defaultColors.mrna}>A位点</text>
                
                <rect x="170" y="30" width="100" height="25" fill="#D1FAE5" stroke={defaultColors.trna} strokeWidth="1.5" rx="3"/>
                <text x="220" y="47" textAnchor="middle" fontSize="10" fill={defaultColors.trna}>P位点</text>
                
                <rect x="290" y="30" width="100" height="25" fill="#FEE2E2" stroke="#EF4444" strokeWidth="1.5" rx="3"/>
                <text x="340" y="47" textAnchor="middle" fontSize="10" fill="#DC2626">E位点</text>
              </g>
            </svg>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">A位点</h4>
              <p className="text-sm text-gray-700">氨酰-tRNA进入位点</p>
            </div>
            <div className="bg-white rounded-lg p-4 border-2 border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">P位点</h4>
              <p className="text-sm text-gray-700">肽酰-tRNA结合位点</p>
            </div>
            <div className="bg-white rounded-lg p-4 border-2 border-red-200">
              <h4 className="font-semibold text-red-800 mb-2">E位点</h4>
              <p className="text-sm text-gray-700">空tRNA退出位点</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'codons' && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-purple-800">密码子表</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-purple-100">
                <tr>
                  <th className="px-3 py-2 text-left border border-purple-200">密码子</th>
                  <th className="px-3 py-2 text-left border border-purple-200">氨基酸</th>
                  <th className="px-3 py-2 text-left border border-purple-200">密码子</th>
                  <th className="px-3 py-2 text-left border border-purple-200">氨基酸</th>
                </tr>
              </thead>
              <tbody>
                {codonTable.map((item: any, index: number) => (
                  <tr key={index} className={item.aminoAcid === '终止' ? 'bg-red-50' : ''}>
                    <td className="px-3 py-2 border border-purple-200 font-mono font-bold text-purple-700">
                      {item.codon}
                    </td>
                    <td className="px-3 py-2 border border-purple-200">
                      {item.aminoAcid}
                    </td>
                    {index + 1 < codonTable.length ? (
                      <>
                        <td className="px-3 py-2 border border-purple-200 font-mono font-bold text-purple-700">
                          {codonTable[index + 1]?.codon || ''}
                        </td>
                        <td className="px-3 py-2 border border-purple-200">
                          {codonTable[index + 1]?.aminoAcid || ''}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-3 py-2 border border-purple-200"></td>
                        <td className="px-3 py-2 border border-purple-200"></td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-3">密码子特点</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span><strong>简并性：</strong>多个密码子可编码同一种氨基酸</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span><strong>通用性：</strong>几乎所有生物共用同一套密码子</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span><strong>方向性：</strong>从5'端到3'端阅读</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span><strong>起始密码子：</strong>AUG编码甲硫氨酸</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span><strong>终止密码子：</strong>UAA、UAG、UGA不编码氨基酸</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
