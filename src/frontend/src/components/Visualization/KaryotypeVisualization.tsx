import type { VisualizationData, VisualizationColors } from '@shared/types/agent.types';

interface KaryotypeVisualizationProps {
  data: VisualizationData;
  colors: VisualizationColors;
}

export function KaryotypeVisualization({ data, colors }: KaryotypeVisualizationProps) {
  const groups = data.karyotypeGroups as Array<{
    group: string;
    chromosomes: string;
    description: string;
    color: string;
  }>;
  const karyotypeNotation = data.karyotypeNotation as Array<{
    notation: string;
    description: string;
  }>;

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-center">
        <h4 className="text-lg font-semibold text-gray-800">人类核型分组 (A-G组)</h4>
      </div>

      <div className="w-full max-w-5xl overflow-x-auto">
        <div className="flex justify-center gap-6 min-w-max">
          {groups.map((group, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="flex gap-1 mb-2">
                {group.chromosomes.includes('-') ? (
                  group.chromosomes.split(',').map((chr, j) => (
                    <div key={j} className="flex flex-col items-center">
                      <svg width="20" height="50" viewBox="0 0 20 50">
                        <ellipse cx="10" cy="25" rx="8" ry="20" fill={group.color} />
                        <line x1="10" y1="5" x2="10" y2="45" stroke="white" strokeWidth="1" />
                      </svg>
                      <span className="text-xs text-gray-500 mt-1">{chr.trim()}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-gray-500">多对</div>
                )}
              </div>
              <div className="text-center">
                <span className="px-2 py-1 rounded text-xs font-bold text-white" style={{ backgroundColor: group.color }}>
                  {group.group}
                </span>
                <p className="text-xs text-gray-600 mt-1">{group.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-3xl">
        <h5 className="font-semibold text-gray-800 mb-3 text-center">核型符号表示</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {karyotypeNotation.map((item, i) => (
            <div key={i} className="bg-white rounded-lg p-3 border border-gray-200">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded font-mono text-sm font-bold">
                  {item.notation}
                </span>
                <span className="text-sm text-gray-600">{item.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function RobertsonTranslocationVisualization({ data, colors }: KaryotypeVisualizationProps) {
  const mechanism = data.mechanism as {
    involved: string;
    process: string;
    result: string;
    loss: string;
  };
  const commonTranslocations = data.commonTranslocations as Array<{
    type: string;
    frequency: string;
    description: string;
    carriers?: string;
    risk?: string;
    clinical?: string;
    outcome?: string;
  }>;

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-center">
        <h4 className="text-lg font-semibold text-gray-800">罗伯逊易位</h4>
        <p className="text-sm text-gray-600 mt-1">{mechanism.process}</p>
      </div>

      <svg width="500" height="200" viewBox="0 0 500 200" className="mx-auto">
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
          </marker>
        </defs>

        <text x="125" y="30" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#333">正常</text>
        <g transform="translate(50, 50)">
          <ellipse cx="40" cy="50" rx="12" ry="35" fill={colors.chromosome14 as string} />
          <ellipse cx="40" cy="50" rx="8" ry="30" fill="none" stroke="white" strokeWidth="1" />
          <circle cx="40" cy="50" r="4" fill={colors.centromere as string} />
          <text x="40" y="100" textAnchor="middle" fontSize="10" fill="#666">14</text>
        </g>
        <g transform="translate(100, 50)">
          <ellipse cx="40" cy="50" rx="10" ry="35" fill={colors.chromosome21 as string} />
          <circle cx="40" cy="50" r="3" fill={colors.centromere as string} />
          <text x="40" y="100" textAnchor="middle" fontSize="10" fill="#666">21</text>
        </g>

        <line x1="175" y1="100" x2="225" y2="100" stroke="#ddd" strokeWidth="2" markerEnd="url(#arrow)" />

        <text x="350" y="30" textAnchor="middle" fontSize="12" fontWeight="bold" fill={colors.derivative as string}>
          罗伯逊易位
        </text>
        <g transform="translate(260, 50)">
          <ellipse cx="60" cy="50" rx="18" ry="35" fill={colors.derivative as string} />
          <ellipse cx="60" cy="50" rx="14" ry="30" fill="none" stroke="white" strokeWidth="1" />
          <circle cx="60" cy="50" r="5" fill={colors.centromere as string} />
          <text x="60" y="100" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">der(14;21)</text>
        </g>

        <g transform="translate(400, 60)">
          <circle cx="20" cy="40" r="8" fill={colors.telomere as string} opacity="0.5" />
          <text x="20" y="45" textAnchor="middle" fontSize="8" fill="#999">丢失</text>
        </g>
      </svg>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
        {commonTranslocations.map((trans, i) => (
          <div key={i} className="bg-white rounded-lg p-4 border-2 border-orange-200 shadow-sm">
            <div className="text-center mb-2">
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-bold">
                {trans.type}
              </span>
            </div>
            <p className="text-xs text-gray-500 text-center mb-2">{trans.frequency}</p>
            <p className="text-sm text-gray-700 mb-2">{trans.description}</p>
            {trans.carriers && <p className="text-xs text-gray-600">携带者：{trans.carriers}</p>}
            {trans.risk && <p className="text-xs text-red-600">风险：{trans.risk}</p>}
            {trans.clinical && <p className="text-xs text-blue-600">临床：{trans.clinical}</p>}
            {trans.outcome && <p className="text-xs text-red-700 font-semibold">后果：{trans.outcome}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
