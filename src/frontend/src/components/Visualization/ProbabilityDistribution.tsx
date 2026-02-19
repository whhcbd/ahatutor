import { ProbabilityDistributionData } from '@shared/types/agent.types';
import { VisualizationColors } from '../../constants/visualization-colors';

interface ProbabilityDistributionProps {
  data: ProbabilityDistributionData;
  colors?: Record<string, string>;
}

/**
 * 概率分布可视化组件
 * 展示遗传学中的概率分布（如基因型比例、表型比例等）
 */
export function ProbabilityDistribution({ data, colors }: ProbabilityDistributionProps) {
  const { categories, values, colors: dataColors, total, formula } = data || {};

  if (!data || !categories || !values) {
    return <div className="text-center text-gray-500 p-8">概率分布数据加载中...</div>;
  }

  // 默认颜色方案
  const defaultColors = [
    colors?.high || VisualizationColors.masteryHigh,
    colors?.medium || VisualizationColors.masteryMedium,
    colors?.low || VisualizationColors.masteryLow,
    VisualizationColors.nodePrinciple,
    VisualizationColors.affected,
    VisualizationColors.gene,
  ];

  // 使用数据中的颜色或默认颜色
  const chartColors = dataColors || defaultColors;

  // 验证数据
  if (categories.length !== values.length) {
    return (
      <div className="text-center text-red-500 p-4">
        数据错误：类别和值的数量不匹配
      </div>
    );
  }

  // 计算总和
  const sum = values.reduce((acc, val) => acc + val, 0);

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">概率分布</h3>
        {formula && (
          <div className="bg-blue-50 inline-block px-4 py-2 rounded-lg mb-2">
            <span className="text-sm font-mono text-blue-800">{formula}</span>
          </div>
        )}
        {total && (
          <p className="text-gray-600 text-sm">{total}</p>
        )}
      </div>

      {/* 水平条形图 */}
      <div className="space-y-3">
        {categories.map((category, index) => {
          const value = values[index];
          const percentage = (value * 100).toFixed(1);
          const color = chartColors[index % chartColors.length];

          return (
            <div key={index} className="space-y-1">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-gray-700">{category}</span>
                <span className="text-gray-600">
                  {value} ({percentage}%)
                </span>
              </div>
              <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                <div
                  className="h-full flex items-center px-3 transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: color,
                  }}
                >
                  {parseFloat(percentage) > 10 && (
                    <span className="text-white text-sm font-medium">
                      {percentage}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 饼图表示 */}
      <div className="flex justify-center">
        <div className="relative">
          <svg width="200" height="200" viewBox="0 0 200 200">
            {/* 背景圆 */}
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="40"
            />

            {/* 计算扇形 */}
            {categories.map((_, index) => {
              const value = values[index];
              const previousValues = values.slice(0, index);
              const previousSum = previousValues.reduce((acc, val) => acc + val, 0);

              const percentage = value / sum;
              const startAngle = (previousSum / sum) * 360 - 90; // -90 使其从顶部开始
              const endAngle = startAngle + percentage * 360;

              // 计算扇形路径
              const startRad = (startAngle * Math.PI) / 180;
              const endRad = (endAngle * Math.PI) / 180;

              const x1 = 100 + 80 * Math.cos(startRad);
              const y1 = 100 + 80 * Math.sin(startRad);
              const x2 = 100 + 80 * Math.cos(endRad);
              const y2 = 100 + 80 * Math.sin(endRad);

              const largeArcFlag = percentage > 0.5 ? 1 : 0;

              // 如果只有一个类别占100%，画圆
              if (percentage > 0.999) {
                return (
                  <circle
                    key={index}
                    cx="100"
                    cy="100"
                    r="80"
                    fill={chartColors[index % chartColors.length]}
                  />
                );
              }

              return (
                <path
                  key={index}
                  d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                  fill={chartColors[index % chartColors.length]}
                  stroke="white"
                  strokeWidth="2"
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                >
                  <title>{categories[index]}: {percentage.toFixed(1)}%</title>
                </path>
              );
            })}
          </svg>

          {/* 中心文字 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{sum.toFixed(2)}</div>
              <div className="text-xs text-gray-600">总计</div>
            </div>
          </div>
        </div>
      </div>

      {/* 图例 */}
      <div className="flex flex-wrap justify-center gap-4">
        {categories.map((category, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{
                backgroundColor: chartColors[index % chartColors.length],
              }}
            />
            <span className="text-sm text-gray-700">{category}</span>
            <span className="text-sm text-gray-500">
              ({(values[index] * 100).toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>

      {/* 数据表格 */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">类别</th>
              <th className="px-4 py-2 text-right">概率值</th>
              <th className="px-4 py-2 text-right">百分比</th>
              <th className="px-4 py-2 text-left">可视化</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded flex-shrink-0"
                      style={{
                        backgroundColor:
                          chartColors[index % chartColors.length],
                      }}
                    />
                    <span>{category}</span>
                  </div>
                </td>
                <td className="px-4 py-2 text-right font-mono">{values[index]}</td>
                <td className="px-4 py-2 text-right">
                  {(values[index] * 100).toFixed(1)}%
                </td>
                <td className="px-4 py-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${(values[index] / sum) * 100}%`,
                        backgroundColor:
                          chartColors[index % chartColors.length],
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
            <tr className="bg-gray-50 font-semibold">
              <td className="px-4 py-2">总计</td>
              <td className="px-4 py-2 text-right font-mono">{sum.toFixed(4)}</td>
              <td className="px-4 py-2 text-right">100%</td>
              <td className="px-4 py-2"></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 理解提示 */}
      <div className="bg-green-50 rounded-lg p-4">
        <h4 className="font-semibold text-sm text-green-800 mb-2">理解要点</h4>
        <ul className="space-y-2 text-sm text-green-700">
          <li className="flex items-start gap-2">
            <span className="text-green-600">→</span>
            <span>
              概率总和为 {sum.toFixed(2)}（应该等于1），表示所有可能性的完备集合
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600">→</span>
            <span>
              最高概率的类别是{' '}
              <strong>
                {
                  categories[
                    values.indexOf(Math.max(...values))
                  ]
                }
              </strong>{' '}
              ({(Math.max(...values) * 100).toFixed(1)}%)
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600">→</span>
            <span>
              这种分布反映了遗传学原理在大量后代中的统计规律
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
