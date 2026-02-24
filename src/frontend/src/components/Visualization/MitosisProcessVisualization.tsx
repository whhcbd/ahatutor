import type { VisualizationData, VisualizationColors } from '@shared/types/agent.types';

interface MitosisProcessVisualizationProps {
  data: VisualizationData;
  colors: VisualizationColors;
}

export function MitosisProcessVisualization({ data, colors }: MitosisProcessVisualizationProps) {
  const phases = data.phases as Array<{ name: string; events: string[] }>;
  const outcome = data.outcome as string;

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-center">
        <h4 className="text-lg font-semibold text-gray-800">有丝分裂过程</h4>
        <p className="text-sm text-gray-600 mt-1">{outcome}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 w-full">
        {phases.map((phase, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full border-4 bg-white flex items-center justify-center"
                 style={{ borderColor: colors.chromosome as string }}>
              <div className="text-center">
                <div className="w-2 h-2 rounded-full mx-auto mb-1" style={{ backgroundColor: colors.centromere as string }} />
                <div className="flex gap-1 justify-center">
                  <div className="w-1 h-8 rounded" style={{ backgroundColor: colors.chromosome as string }} />
                  <div className="w-1 h-8 rounded" style={{ backgroundColor: colors.chromosome as string }} />
                </div>
              </div>
            </div>
            <div className="mt-2 text-center">
              <span className="px-2 py-1 rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: colors.chromosome as string }}>
                {phase.name}
              </span>
            </div>
            <ul className="mt-2 text-xs text-gray-600 space-y-1 w-28">
              {phase.events.map((event, j) => (
                <li key={j}>• {event}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: colors.chromosome as string }} />
          <span>染色体</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.centromere as string }} />
          <span>着丝粒</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-1" style={{ backgroundColor: colors.spindle as string }} />
          <span>纺锤丝</span>
        </div>
      </div>
    </div>
  );
}
