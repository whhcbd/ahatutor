import type { TestCrossData } from '@shared/types/agent.types';

interface TestCrossProps {
  data: TestCrossData;
  colors?: Record<string, string>;
}

export function TestCross({ data, colors }: TestCrossProps) {
  const defaultColors = {
    unknown: '#6b7280',
    test: '#3b82f6',
    result: '#10b981',
    text: '#1f2937',
    bg: '#f9fafb',
  };

  const safeColors = { ...defaultColors, ...colors };

  if (!data) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-4">🧪</div>
          <p>测交数据加载中...</p>
        </div>
      </div>
    );
  }

  const { unknownGenotype, testParent, crossResults, conclusion, title } = data;

  const renderUnknownIndividual = () => {
    return (
      <div className="flex flex-col items-center">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center text-4xl shadow-lg mb-3"
          style={{ backgroundColor: safeColors.unknown }}
        >
          ?
        </div>
        <div className="text-center">
          <div className="font-semibold text-lg">{unknownGenotype.description}</div>
          <div className="text-sm text-gray-600 mt-1">
            基因型: <code className="bg-gray-100 px-2 py-1 rounded">{unknownGenotype.genotype}</code>
          </div>
          <div className="text-xs text-gray-500 mt-1">待测个体</div>
        </div>
      </div>
    );
  };

  const renderTestParent = () => {
    return (
      <div className="flex flex-col items-center">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center text-4xl shadow-lg mb-3"
          style={{ backgroundColor: safeColors.test }}
        >
          {testParent.symbol}
        </div>
        <div className="text-center">
          <div className="font-semibold text-lg">测交亲本</div>
          <div className="text-sm text-gray-600 mt-1">
            基因型: <code className="bg-gray-100 px-2 py-1 rounded">{testParent.genotype}</code>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            表型: {testParent.phenotype}
          </div>
        </div>
      </div>
    );
  };

  const renderCrossFlow = () => {
    return (
      <div className="flex items-center justify-center my-8">
        <div className="flex items-center gap-8">
          <div className="text-center">
            <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl shadow-lg mb-3"
                 style={{ backgroundColor: safeColors.unknown }}>
              ?
            </div>
            <div className="text-sm text-gray-600">待测</div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="w-0 h-1" style={{ borderLeft: `3px solid ${safeColors.text}` }}></div>
            <div className="text-2xl text-gray-400">×</div>
            <div className="w-0 h-1" style={{ borderLeft: `3px solid ${safeColors.text}` }}></div>
          </div>

          <div className="text-center">
            <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl shadow-lg mb-3"
                 style={{ backgroundColor: safeColors.test }}>
              {testParent.symbol}
            </div>
            <div className="text-sm text-gray-600">测交亲本</div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="w-0 h-1" style={{ borderLeft: `3px solid ${safeColors.text}` }}></div>
            <div className="text-2xl">↓</div>
            <div className="w-0 h-1" style={{ borderLeft: `3px solid ${safeColors.text}` }}></div>
          </div>

          <div className="text-center">
            <div className="w-24 h-24 rounded-full flex items-center justify-center text-4xl shadow-lg mb-3"
                 style={{ backgroundColor: safeColors.result }}>
              F1
            </div>
            <div className="text-sm text-gray-600">后代</div>
          </div>
        </div>
      </div>
    );
  };

  const renderResultsTable = () => {
    const total = crossResults.reduce((sum, result) => sum + result.count, 0);

    return (
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">测交结果统计</h3>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">后代基因型</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">后代表型</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">数量</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">百分比</th>
              </tr>
            </thead>
            <tbody>
              {crossResults.map((result, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-4 py-3">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                      {result.offspringGenotype}
                    </code>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {result.offspringPhenotype}
                  </td>
                  <td className="px-4 py-3 text-right font-mono">{result.count}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-semibold">{result.percentage}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 font-semibold">
              <tr>
                <td className="px-4 py-3" colSpan={2}>
                  合计
                </td>
                <td className="px-4 py-3 text-right">{total}</td>
                <td className="px-4 py-3 text-right">100%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  };

  const renderConclusion = () => {
    const confidenceColor = {
      '高': 'bg-green-100 text-green-700',
      '中': 'bg-yellow-100 text-yellow-700',
      '低': 'bg-red-100 text-red-700',
    };

    return (
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">结论分析</h3>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <div className="text-sm text-gray-600 mb-2">推断基因型</div>
              <div className="text-3xl font-mono font-bold" style={{ color: safeColors.result }}>
                {conclusion.deducedGenotype}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-2">推断置信度</div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${confidenceColor[conclusion.confidence as keyof typeof confidenceColor] || confidenceColor['中']}`}>
                {conclusion.confidence}
              </span>
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-2">解释说明</div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-800 leading-relaxed">{conclusion.explanation}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPhenotypeRatio = () => {
    const dominantCount = crossResults
      .filter(r => r.offspringPhenotype.includes('显性'))
      .reduce((sum, r) => sum + r.count, 0);
    const recessiveCount = crossResults
      .filter(r => r.offspringPhenotype.includes('隐性'))
      .reduce((sum, r) => sum + r.count, 0);
    const total = dominantCount + recessiveCount;

    return (
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">表型比例</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-2">显性表型</div>
            <div className="text-4xl font-bold mb-2" style={{ color: safeColors.result }}>
              {dominantCount}
            </div>
            <div className="text-sm text-gray-500">
              {total > 0 ? `${((dominantCount / total) * 100).toFixed(1)}%` : '0%'}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-2">隐性表型</div>
            <div className="text-4xl font-bold mb-2" style={{ color: safeColors.test }}>
              {recessiveCount}
            </div>
            <div className="text-sm text-gray-500">
              {total > 0 ? `${((recessiveCount / total) * 100).toFixed(1)}%` : '0%'}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">{title || '测交分析'}</h1>

        <div className="grid grid-cols-2 gap-8 mb-8">
          {renderUnknownIndividual()}
          {renderTestParent()}
        </div>

        {renderCrossFlow()}
        {renderPhenotypeRatio()}
        {renderResultsTable()}
        {renderConclusion()}
      </div>
    </div>
  );
}
