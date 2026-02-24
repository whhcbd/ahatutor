import type { VisualizationData, VisualizationColors } from '@shared/types/agent.types';

interface RecombinationVisualizationProps {
  data: VisualizationData;
  colors: VisualizationColors;
}

export function SynapsisVisualization({ data, colors }: RecombinationVisualizationProps) {
  const stages = data.stages as Array<{
    name: string;
    description: string;
    keyEvents: string[];
  }>;

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-center">
        <h4 className="text-lg font-semibold text-gray-800">减数分裂联会过程</h4>
      </div>

      <div className="flex flex-wrap justify-center gap-4 w-full">
        {stages.map((stage, i) => (
          <div key={i} className="flex flex-col items-center w-28">
            <div className="w-20 h-20 rounded-full border-4 bg-white flex items-center justify-center mb-2"
                 style={{ borderColor: colors.synaptonemal as string }}>
              <div className="flex gap-1">
                <div className="w-2 h-10 rounded" style={{ backgroundColor: colors.homolog1 as string }} />
                <div className="w-1 h-10 rounded" style={{ backgroundColor: colors.synaptonemal as string }} />
                <div className="w-2 h-10 rounded" style={{ backgroundColor: colors.homolog2 as string }} />
              </div>
            </div>
            <span className="text-xs font-bold text-gray-800">{stage.name}</span>
          </div>
        ))}
      </div>

      <div className="w-full max-w-3xl">
        {stages.map((stage, i) => (
          <div key={i} className="bg-gray-50 rounded-lg p-3 mb-2 border border-gray-200">
            <h5 className="font-semibold text-gray-800 text-sm mb-1">{stage.name}</h5>
            <p className="text-xs text-gray-600 mb-1">{stage.description}</p>
            <div className="flex flex-wrap gap-1">
              {stage.keyEvents.map((event, j) => (
                <span key={j} className="px-2 py-1 bg-white rounded text-xs text-gray-600 border">
                  {event}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HomologousRecombinationVisualization({ data, colors }: RecombinationVisualizationProps) {
  const process = data.process as Array<{
    step: number;
    name: string;
    description: string;
  }>;

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-center">
        <h4 className="text-lg font-semibold text-gray-800">同源重组分子机制</h4>
      </div>

      <svg width="600" height="300" viewBox="0 0 600 300" className="mx-auto">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
          </marker>
        </defs>

        {process.map((step, i) => {
          const x = 30 + i * 110;
          return (
            <g key={i}>
              <line x1={x + 55} y1="250" x2={x + 55} y2="220" stroke="#ddd" strokeWidth="2" />
              <line x1={x + 55} y1="220" x2={x + 110} y2="220" stroke="#ddd" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <rect x={x} y="40" width="110" height="170" rx="5" fill="white" stroke={colors.dna1 as string} strokeWidth="2" />
              <text x={x + 55} y="60" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#333">
                步骤 {step.step}
              </text>
              <text x={x + 55} y="80" textAnchor="middle" fontSize="11" fontWeight="bold" fill={colors.dna1 as string}>
                {step.name}
              </text>
              <foreignObject x={x + 10} y="95" width="90" height="100">
                <div className="text-xs text-gray-600 leading-tight">
                  {step.description}
                </div>
              </foreignObject>
            </g>
          );
        })}
      </svg>

      <div className="flex flex-wrap justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: colors.dna1 as string }} />
          <span>DNA链1</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: colors.dna2 as string }} />
          <span>DNA链2</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: colors.break as string }} />
          <span>断裂</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: colors.holliday as string }} />
          <span>Holliday连接体</span>
        </div>
      </div>
    </div>
  );
}
