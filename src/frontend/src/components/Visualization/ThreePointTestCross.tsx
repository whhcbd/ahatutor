import type { ThreePointTestCrossData } from '@shared/types/agent.types';

interface ThreePointTestCrossProps {
  data: ThreePointTestCrossData;
  colors?: Record<string, string>;
}

export function ThreePointTestCross({ data, colors }: ThreePointTestCrossProps) {
  const defaultColors = {
    primary: '#3b82f6',
    secondary: '#10b981',
    tertiary: '#f59e0b',
    text: '#1f2937',
    bg: '#f9fafb',
  };

  const safeColors = { ...defaultColors, ...colors };

  if (!data) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-4">🧬</div>
          <p>三点测交数据加载中...</p>
        </div>
      </div>
    );
  }

  const { genes, parentalGenotypes, offspringData, recombinationFrequencies, geneOrder, chromosomeMap, title } = data;

  const renderChromosomeMap = () => {
    const { positions } = chromosomeMap;
    const maxX = Math.max(...positions.map(p => p.position));

    return (
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">染色体连锁图</h3>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="relative">
            <div className="h-1 bg-gray-300 rounded mb-2"></div>
            {positions.map((pos) => (
              <div
                key={pos.gene}
                className="absolute transform -translate-x-1/2"
                style={{
                  left: `${(pos.position / maxX) * 100}%`,
                  top: '-10px',
                }}
              >
                <div
                  className="w-4 h-4 rounded-full border-2 border-white shadow"
                  style={{ backgroundColor: safeColors.primary }}
                ></div>
                <div className="text-center mt-2">
                  <div className="font-semibold text-sm">{pos.gene}</div>
                  <div className="text-xs text-gray-500">{pos.position} cM</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <span className="text-sm text-gray-600">基因顺序：{geneOrder}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderRecombinationRates = () => {
    const rfData = [
      { label: '区域1-2', ...recombinationFrequencies.region1_2, color: safeColors.primary },
      { label: '区域2-3', ...recombinationFrequencies.region2_3, color: safeColors.secondary },
      { label: '区域1-3', ...recombinationFrequencies.region1_3, color: safeColors.tertiary },
    ];

    return (
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">重组率</h3>
        <div className="grid grid-cols-3 gap-4">
          {rfData.map((rf, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow p-4">
              <div
                className="h-32 rounded flex items-end justify-center mb-3"
                style={{ backgroundColor: `${rf.color}20` }}
              >
                <div
                  className="w-16 rounded-t"
                  style={{
                    height: `${(rf.rf / 50) * 100}%`,
                    backgroundColor: rf.color,
                  }}
                ></div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: rf.color }}>
                  {rf.rf}%
                </div>
                <div className="text-sm text-gray-600">{rf.label}</div>
                <div className="text-xs text-gray-500">{rf.distance} cM</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderOffspringTable = () => {
    const total = offspringData.reduce((sum, offspring) => sum + offspring.count, 0);

    return (
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">后代统计</h3>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">基因型</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">表型描述</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">数量</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">百分比</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">类型</th>
              </tr>
            </thead>
            <tbody>
              {offspringData.map((offspring, idx) => {
                const isParental = offspring.count > 50;
                const isRecombinant = !isParental && offspring.count < 20;

                return (
                  <tr
                    key={idx}
                    className={`border-t ${isParental ? 'bg-blue-50' : isRecombinant ? 'bg-orange-50' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                        {offspring.genotype}
                      </code>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {offspring.phenotypeDescription || '-'}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">{offspring.count}</td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-semibold">{offspring.percentage}%</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {isParental ? (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                          亲本型
                        </span>
                      ) : isRecombinant ? (
                        <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">
                          双重组
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                          单重组
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-gray-50 font-semibold">
              <tr>
                <td className="px-4 py-3" colSpan={2}>
                  合计
                </td>
                <td className="px-4 py-3 text-right">{total}</td>
                <td className="px-4 py-3 text-right">100%</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  };

  const renderParentalGenotypes = () => {
    return (
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">亲本基因型</h3>
        <div className="grid grid-cols-2 gap-4">
          {parentalGenotypes.map((parent, idx) => (
            <div key={parent.id} className="bg-white rounded-lg shadow p-6">
              <div className="text-center">
                <div
                  className="text-3xl font-mono mb-2 inline-block px-4 py-2 rounded"
                  style={{
                    backgroundColor: idx === 0 ? `${safeColors.primary}20` : `${safeColors.secondary}20`,
                    color: idx === 0 ? safeColors.primary : safeColors.secondary,
                  }}
                >
                  {parent.genotype}
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  {parent.type === 'parent' ? '亲本' : '三杂合子'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderGenesInfo = () => {
    return (
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">基因信息</h3>
        <div className="grid grid-cols-3 gap-4">
          {genes.map((gene) => (
            <div key={gene.name} className="bg-white rounded-lg shadow p-4">
              <div className="font-semibold mb-2">{gene.name}</div>
              <div className="text-sm text-gray-600 mb-1">
                <span className="font-mono">{gene.symbol}</span>
              </div>
              <div className="text-xs text-gray-500">
                等位基因: {gene.alleles.join(', ')}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">{title || '三点测交分析'}</h1>

        {renderGenesInfo()}
        {renderParentalGenotypes()}
        {renderChromosomeMap()}
        {renderRecombinationRates()}
        {renderOffspringTable()}
      </div>
    </div>
  );
}
