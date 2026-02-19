import { InheritancePathData } from '@shared/types/agent.types';
import { VisualizationColors } from '../../constants/visualization-colors';

interface InheritancePathProps {
  data: InheritancePathData;
  colors?: Record<string, string>;
}

/**
 * 遗传路径可视化组件
 * 展示基因在家族代际间的传递路径（用于伴性遗传等）
 */
export function InheritancePath({ data, colors }: InheritancePathProps) {
  const generations = data?.generations || [];
  const inheritance = data?.inheritance;
  const explanation = data?.explanation;

  // 默认颜色方案
  const defaultColors = {
    affected: colors?.affected || VisualizationColors.affected,
    carrier: colors?.carrier || VisualizationColors.carrier,
    normal: colors?.normal || VisualizationColors.normal,
    male: colors?.male || VisualizationColors.male,
    female: colors?.female || VisualizationColors.female,
  };

  // 获取个体样式
  const getIndividualStyle = (
    affected: boolean,
    carrier?: boolean,
    sex?: 'male' | 'female'
  ): { bgColor: string; borderColor: string; textColor: string; pattern?: string } => {
    if (affected) {
      return {
        bgColor: defaultColors.affected,
        borderColor: defaultColors.affected,
        textColor: '#fff',
      };
    }
    if (carrier) {
      return {
        bgColor: defaultColors.carrier,
        borderColor: defaultColors.carrier,
        textColor: '#000',
        pattern: 'striped',
      };
    }
    return {
      bgColor: sex === 'male' ? defaultColors.male : defaultColors.female,
      borderColor: sex === 'male' ? defaultColors.male : defaultColors.female,
      textColor: '#000',
    };
  };

  // 获取个体形状
  const IndividualShape = ({
    individual,
  }: {
    individual: InheritancePathData['generations'][0]['individuals'][0];
  }) => {
    const style = getIndividualStyle(
      individual.affected,
      individual.carrier,
      individual.sex
    );
    const size = 60;

    if (individual.sex === 'male') {
      return (
        <div
          className="relative flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
          title={`${individual.id}: ${individual.genotype} - ${individual.phenotype}`}
        >
          <div
            className="flex items-center justify-center font-mono font-bold text-xs"
            style={{
              width: size,
              height: size,
              backgroundColor: `${style.bgColor}30`,
              border: `3px solid ${style.borderColor}`,
              color: style.textColor,
            }}
          >
            {individual.genotype}
          </div>
          {individual.affected && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
          )}
          {individual.carrier && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full" />
          )}
        </div>
      );
    } else {
      return (
        <div
          className="relative flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
          title={`${individual.id}: ${individual.genotype} - ${individual.phenotype}`}
        >
          <div
            className="flex items-center justify-center font-mono font-bold text-xs rounded-full"
            style={{
              width: size,
              height: size,
              backgroundColor: `${style.bgColor}30`,
              border: `3px solid ${style.borderColor}`,
              color: style.textColor,
            }}
          >
            {individual.genotype}
          </div>
          {individual.affected && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
          )}
          {individual.carrier && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full" />
          )}
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">家族遗传路径</h3>
        {inheritance && (
          <div className="flex justify-center gap-4 text-sm text-gray-600">
            <span>{inheritance.pattern || '未知'}</span>
            <span>•</span>
            <span>{inheritance.chromosome || '未知'}</span>
            <span>•</span>
            <span>{inheritance.gene || '未知'}</span>
          </div>
        )}
      </div>

      {/* 遗传路径图 */}
      <div className="relative">
        {generations.map((gen, genIndex) => (
          <div key={genIndex} className="mb-6">
            <div className="text-sm text-gray-600 mb-2 text-center">
              第 {gen.generation} 代
            </div>
            <div className="flex justify-center gap-4 flex-wrap">
              {gen.individuals.map((individual) => (
                <div key={individual.id} className="flex flex-col items-center">
                  <IndividualShape individual={individual} />
                  <div className="text-xs text-gray-600 mt-1">{individual.id}</div>
                  <div className="text-xs text-gray-500">
                    {individual.affected && '患病'}
                    {individual.carrier && '携带者'}
                    {!individual.affected && !individual.carrier && '正常'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 图例 */}
      <div className="flex flex-wrap justify-center gap-4 text-sm bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6"
            style={{ backgroundColor: `${defaultColors.male}40`, border: `2px solid ${defaultColors.male}` }}
          />
          <span>正常男性</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full"
            style={{ backgroundColor: `${defaultColors.female}40`, border: `2px solid ${defaultColors.female}` }}
          />
          <span>正常女性</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 relative"
            style={{ backgroundColor: `${defaultColors.affected}40`, border: `2px solid ${defaultColors.affected}` }}
          >
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
          </div>
          <span>患病个体</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 relative"
            style={{ backgroundColor: `${defaultColors.carrier}40`, border: `2px solid ${defaultColors.carrier}` }}
          >
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full" />
          </div>
          <span>携带者</span>
        </div>
      </div>

      {/* 遗传解释 */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-semibold text-sm text-blue-800 mb-2">遗传解释</h4>
        <p className="text-sm text-blue-700 leading-relaxed">{explanation || '暂无解释'}</p>
      </div>

      {/* 关键观察点 */}
      <div className="bg-yellow-50 rounded-lg p-4">
        <h4 className="font-semibold text-sm text-yellow-800 mb-2">关键观察点</h4>
        <ul className="space-y-2 text-sm text-yellow-700">
          <li className="flex items-start gap-2">
            <span className="text-yellow-600">→</span>
            <span>观察基因如何在代际间传递</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-600">→</span>
            <span>注意性别差异：男性（方块）和女性（圆圈）的遗传方式不同</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-600">→</span>
            <span>携带者女性（橙色标记）可将基因传递给后代</span>
          </li>
          {inheritance?.pattern?.includes('X连锁') && (
            <li className="flex items-start gap-2">
              <span className="text-yellow-600">→</span>
              <span>
                X连锁遗传：男性从母亲获得X染色体，女性从双亲各获得一条X染色体
              </span>
            </li>
          )}
        </ul>
      </div>

      {/* 个体详情表格 */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">性别</th>
              <th className="px-4 py-2 text-left">基因型</th>
              <th className="px-4 py-2 text-left">表型</th>
              <th className="px-4 py-2 text-left">状态</th>
              <th className="px-4 py-2 text-left">父母</th>
            </tr>
          </thead>
          <tbody>
            {generations.flatMap((gen) =>
              gen.individuals.map((individual) => (
                <tr key={individual.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 font-mono">{individual.id}</td>
                  <td className="px-4 py-2">
                    {individual.sex === 'male' ? '♂ 男性' : '♀ 女性'}
                  </td>
                  <td className="px-4 py-2 font-mono">{individual.genotype}</td>
                  <td className="px-4 py-2">{individual.phenotype}</td>
                  <td className="px-4 py-2">
                    {individual.affected && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                        患病
                      </span>
                    )}
                    {individual.carrier && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">
                        携带者
                      </span>
                    )}
                    {!individual.affected && !individual.carrier && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                        正常
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-xs text-gray-600">
                    {individual.parents?.join(', ') || '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
