import type { VisualizationData, VisualizationColors } from '@shared/types/agent.types';

interface DNAHelixVisualizationProps {
  data: VisualizationData;
  colors: VisualizationColors;
}

export function DNAHelixVisualization({ data, colors }: DNAHelixVisualizationProps) {
  const basePairs = data.basePairs as Array<{
    base1: string;
    base2: string;
    bonds: number;
    color1: string;
    color2: string;
  }>;
  const structure = data.structure as { strands: number; orientation: string };

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-center">
        <h4 className="text-lg font-semibold text-gray-800">DNA双螺旋结构</h4>
        <p className="text-sm text-gray-600 mt-1">{structure.orientation}，{structure.helixTurn}</p>
      </div>

      <svg width="400" height="200" viewBox="0 0 400 200" className="mx-auto">
        <defs>
          <linearGradient id="backboneGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.backbone as string} />
            <stop offset="100%" stopColor="#455A64" />
          </linearGradient>
        </defs>

        {basePairs.map((pair, i) => {
          const x = 60 + i * 70;
          const y1 = 60 + Math.sin(i * 0.8) * 40;
          const y2 = 140 + Math.sin(i * 0.8) * 40;

          return (
            <g key={i}>
              <line
                x1={x} y1={y1}
                x2={x} y2={y2}
                stroke={colors.hydrogenBond as string}
                strokeWidth={pair.bonds}
                strokeDasharray="3,2"
              />
              <circle cx={x} cy={y1} r={18} fill={pair.color1} />
              <circle cx={x} cy={y2} r={18} fill={pair.color2} />
              <text x={x} y={y1 + 4} textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
                {pair.base1}
              </text>
              <text x={x} y={y2 + 4} textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
                {pair.base2}
              </text>
            </g>
          );
        })}

        <path
          d="M 60 60 Q 165 20 270 60 T 480 60"
          stroke="url(#backboneGrad)"
          strokeWidth="3"
          fill="none"
        />
        <path
          d="M 60 140 Q 165 180 270 140 T 480 140"
          stroke="url(#backboneGrad)"
          strokeWidth="3"
          fill="none"
        />
      </svg>

      <div className="flex flex-wrap justify-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: colors.adenine as string }} />
          <span className="text-sm text-gray-600">腺嘌呤(A)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: colors.thymine as string }} />
          <span className="text-sm text-gray-600">胸腺嘧啶(T)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: colors.guanine as string }} />
          <span className="text-sm text-gray-600">鸟嘌呤(G)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: colors.cytosine as string }} />
          <span className="text-sm text-gray-600">胞嘧啶(C)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-1" style={{ backgroundColor: colors.hydrogenBond as string }} />
          <span className="text-sm text-gray-600">氢键</span>
        </div>
      </div>
    </div>
  );
}
