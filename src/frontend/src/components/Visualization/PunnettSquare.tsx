import { PunnettSquareData } from '@shared/types/agent.types';
import { VisualizationColors, getPhenotypeColor, getSexColor } from '../../constants/visualization-colors';

interface PunnettSquareProps {
  data: PunnettSquareData;
  colors?: Record<string, string>;
}

/**
 * Punnett 方格可视化组件
 * 展示杂交组合的后代基因型和表型分布
 */
export function PunnettSquare({ data, colors }: PunnettSquareProps) {
  const {
    maleGametes,
    femaleGametes,
    offspring,
    parentalCross,
    description,
  } = data || {};

  if (!data) {
    return <div className="text-center text-gray-500 p-8">数据加载中...</div>;
  }

  if (!maleGametes || !femaleGametes || !offspring) {
    return <div className="text-center text-gray-500 p-8">Punnett 方格数据不完整</div>;
  }

  // 使用标准配色方案
  const standardColors = {
    dominant: VisualizationColors.dominant,
    recessive: VisualizationColors.recessive,
    heterozygous: VisualizationColors.carrier,
    male: VisualizationColors.male,
    female: VisualizationColors.female,
  };

  // 获取表型颜色（使用导入的函数）
  const getCellPhenotypeColor = (phenotype: string, sex?: 'male' | 'female'): string => {
    if (sex === 'male') {
      return standardColors.male;
    }
    if (sex === 'female') {
      return standardColors.female;
    }
    return getPhenotypeColor(phenotype);
  };

  // 计算方格中每个单元格的内容
  const getCellContent = (maleIndex: number, femaleIndex: number) => {
    const matching = offspring.filter(o => {
      // 匹配配子组合
      const maleGamete = maleGametes[maleIndex];
      const femaleGamete = femaleGametes[femaleIndex];

      // 简单匹配：基因型包含这两个配子
      return o.genotype.includes(maleGamete.replace('^', '')) &&
             o.genotype.includes(femaleGamete.replace('^', ''));
    });

    return matching.length > 0 ? matching[0] : null;
  };

  return (
    <div className="space-y-6">
      {/* 标题和说明 */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Punnett 方格</h3>
        {description && (
          <p className="text-gray-600 text-sm">{description}</p>
        )}
      </div>

      {/* 双亲信息 */}
      {parentalCross && (
        <div className="grid grid-cols-2 gap-4">
          <div
            className="p-4 rounded-lg text-center"
            style={{ backgroundColor: `${standardColors.male}20` }}
          >
            <div className="text-sm text-gray-600 mb-1">父本</div>
            <div className="font-mono font-bold text-lg">{parentalCross.male?.genotype || '未知'}</div>
            <div className="text-sm text-gray-700">{parentalCross.male?.phenotype || '未知'}</div>
          </div>
          <div
            className="p-4 rounded-lg text-center"
            style={{ backgroundColor: `${standardColors.female}20` }}
          >
            <div className="text-sm text-gray-600 mb-1">母本</div>
            <div className="font-mono font-bold text-lg">{parentalCross.female?.genotype || '未知'}</div>
            <div className="text-sm text-gray-700">{parentalCross.female?.phenotype || '未知'}</div>
          </div>
        </div>
      )}

      {/* Punnett 方格 */}
      <div className="flex justify-center">
        <div className="inline-block">
          {/* 表头 - 雌配子 */}
          <div className="flex">
            <div className="w-16 h-16"></div> {/* 左上角空白 */}
            {femaleGametes.map((gamete, i) => (
              <div
                key={i}
                className="w-24 h-16 flex items-center justify-center bg-gray-100 border border-gray-300"
              >
                <span className="font-mono text-lg font-bold">{gamete}</span>
              </div>
            ))}
          </div>

          {/* 方格主体 */}
          {maleGametes.map((maleGamete, maleIndex) => (
            <div key={maleIndex} className="flex">
              {/* 雄配子标签 */}
              <div className="w-16 h-24 flex items-center justify-center bg-gray-100 border border-gray-300">
                <span className="font-mono text-lg font-bold">{maleGamete}</span>
              </div>

              {/* 后代单元格 */}
              {femaleGametes.map((_femaleGamete, femaleIndex) => {
                const cellData = getCellContent(maleIndex, femaleIndex);
                if (!cellData) {
                  return (
                    <div
                      key={femaleIndex}
                      className="w-24 h-24 border border-gray-300 bg-gray-50"
                    />
                  );
                }

                const bgColor = getCellPhenotypeColor(cellData.phenotype, cellData.sex);
                // const textColor = bgColor === defaultColors.recessive ? '#fff' : '#000';

                return (
                  <div
                    key={femaleIndex}
                    className="w-24 h-24 border border-gray-300 flex flex-col items-center justify-center relative hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: `${bgColor}40` }}
                  >
                    {/* 性别图标 */}
                    {cellData.sex && (
                      <div className="absolute top-1 right-1">
                        {cellData.sex === 'male' ? (
                          <span className="text-blue-600 text-xs">♂</span>
                        ) : (
                          <span className="text-pink-600 text-xs">♀</span>
                        )}
                      </div>
                    )}

                    {/* 基因型 */}
                    <div className="font-mono font-bold text-sm" style={{ color: bgColor }}>
                      {cellData.genotype}
                    </div>

                    {/* 概率 */}
                    <div className="text-xs text-gray-600 mt-1">
                      {(cellData.probability * 100).toFixed(0)}%
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* 图例 */}
      <div className="flex flex-wrap justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded"
            style={{ backgroundColor: standardColors.dominant }}
          />
          <span>显性/正常</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded"
            style={{ backgroundColor: standardColors.heterozygous }}
          />
          <span>杂合/携带者</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded"
            style={{ backgroundColor: standardColors.recessive }}
          />
          <span>隐性/患病</span>
        </div>
      </div>

      {/* 后代概率汇总 */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-sm text-gray-700 mb-3">后代概率分布</h4>
        <div className="space-y-2">
          {offspring.map((child, index) => {
            return (
              <div key={index} className="flex items-center gap-4">
                <div
                  className="w-3 h-3 rounded flex-shrink-0"
                  style={{ backgroundColor: getCellPhenotypeColor(child.phenotype, child.sex) }}
                />
                <div className="flex-1 grid grid-cols-3 gap-2 text-sm">
                  <span className="font-mono">{child.genotype}</span>
                  <span>{child.phenotype}</span>
                  <span className="text-gray-600">
                    {child.sex === 'male' && '♂ '}
                    {child.sex === 'female' && '♀ '}
                    {(child.probability * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-32 bg-gray-200 rounded-full h-2 flex-shrink-0">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${child.probability * 100}%`,
                      backgroundColor: getCellPhenotypeColor(child.phenotype, child.sex),
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
