import type { VisualizationData, VisualizationColors } from '@shared/types/agent.types';

interface MutationVisualizationProps {
  data: VisualizationData;
  colors: VisualizationColors;
}

export function MutationVisualization({ data, colors }: MutationVisualizationProps) {
  const pointMutations = data.pointMutations as Array<{
    name: string;
    description: string;
    examples: string[];
    frequency: string;
    effect: string;
  }>;
  const effectsOnProtein = data.effectsOnProtein as Array<{
    type: string;
    description: string;
    example: string;
    effect: string;
  }>;
  const indelMutations = data.indelMutations as Array<{
    type: string;
    description: string;
    frameshift: string;
    example: string;
    consequence: string;
  }>;

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-center">
        <h4 className="text-lg font-semibold text-gray-800">基因突变类型与机制</h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
        <div>
          <h5 className="font-semibold text-gray-800 mb-3 text-center">点突变</h5>
          <div className="space-y-3">
            {pointMutations.map((mut, i) => (
              <div key={i} className="bg-white rounded-lg p-4 border-2" style={{ borderColor: colors.substitution as string }}>
                <h6 className="font-bold text-lg mb-2" style={{ color: colors.substitution as string }}>{mut.name}</h6>
                <p className="text-sm text-gray-600 mb-2">{mut.description}</p>
                <p className="text-xs text-gray-500">例子：{mut.examples.join(', ')}</p>
                <p className="text-xs text-gray-500 mt-1">频率：{mut.frequency}</p>
                <p className="text-xs text-gray-700 mt-1">效应：{mut.effect}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h5 className="font-semibold text-gray-800 mb-3 text-center">对蛋白质的影响</h5>
          <div className="space-y-3">
            {effectsOnProtein.map((effect, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <h6 className="font-semibold text-sm text-gray-800 mb-1">{effect.type}</h6>
                <p className="text-xs text-gray-600 mb-1">{effect.description}</p>
                <p className="text-xs text-gray-500 italic mb-1">例：{effect.example}</p>
                <p className={`text-xs ${i === 2 ? 'text-red-600 font-semibold' : 'text-gray-700'}`}>
                  效应：{effect.effect}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl">
        <h5 className="font-semibold text-gray-800 mb-3 text-center">插入/缺失突变</h5>
        <div className="grid grid-cols-3 gap-4">
          {indelMutations.map((indel, i) => (
            <div key={i} className="bg-white rounded-lg p-4 border-2 shadow-sm"
                 style={{ borderColor: colors[indel.type.toLowerCase() as keyof typeof colors] as string || '#ddd' }}>
              <h6 className="font-bold text-lg mb-2 text-center" style={{ color: colors[indel.type.toLowerCase() as keyof typeof colors] as string }}>
                {indel.type}
              </h6>
              <p className="text-sm text-gray-600 mb-2">{indel.description}</p>
              <p className="text-xs text-gray-700 mb-1"><span className="font-semibold">移码：</span>{indel.frameshift}</p>
              <p className="text-xs text-gray-500 italic mb-1">例：{indel.example}</p>
              <p className="text-xs text-red-600">后果：{indel.consequence}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
