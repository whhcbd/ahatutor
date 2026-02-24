import type { VisualizationData, VisualizationColors } from '@shared/types/agent.types';

interface TrisomyDetailedVisualizationProps {
  data: VisualizationData;
  colors: VisualizationColors;
}

export function TrisomyDetailedVisualization({ data, colors }: TrisomyDetailedVisualizationProps) {
  const mechanism = data.mechanism as string;
  const nondisjunction = data.nondisjunction as {
    meiosis1: string;
    meiosis2: string;
    result: string;
  };
  const commonTrisomies = data.commonTrisomies as Array<{
    chromosome: string;
    name: string;
    incidence: string;
    features: string[];
  }>;

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-center">
        <h4 className="text-lg font-semibold text-gray-800">三体综合征</h4>
        <p className="text-sm text-gray-600 mt-1">{mechanism}</p>
      </div>

      <svg width="400" height="200" viewBox="0 0 400 200" className="mx-auto">
        <text x="200" y="25" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#333">
          正常 (46,XX)
        </text>
        <g transform="translate(50, 50)">
          {[1, 2].map((i) => (
            <g key={i} transform={`translate(${(i - 1) * 40}, 0)`}>
              <ellipse cx="20" cy="50" rx="12" ry="35" fill={colors.chromosome1 as string} />
              <ellipse cx="20" cy="50" rx="8" ry="30" fill="none" stroke="white" strokeWidth="1" />
              <circle cx="20" cy="50" r="4" fill={colors.centromere as string} />
            </g>
          ))}
        </g>
        <g transform="translate(150, 50)">
          {[1, 2, 3, 4].map((i) => (
            <g key={i} transform={`translate(${(i - 1) * 35}, 0)`}>
              <ellipse cx="17" cy="50" rx="10" ry="30" fill={colors.chromosome2 as string} />
              <circle cx="17" cy="50" r="3" fill={colors.centromere as string} />
            </g>
          ))}
        </g>

        <line x1="20" y1="130" x2="380" y2="130" stroke="#ddd" strokeWidth="2" />

        <text x="200" y="155" textAnchor="middle" fontSize="14" fontWeight="bold" fill={colors.trisomy as string}>
          三体 (47,XX,+21)
        </text>
        <g transform="translate(50, 170)">
          {[1, 2].map((i) => (
            <g key={i} transform={`translate(${(i - 1) * 40}, 0)`}>
              <ellipse cx="20" cy="50" rx="12" ry="35" fill={colors.chromosome1 as string} />
              <circle cx="20" cy="50" r="4" fill={colors.centromere as string} />
            </g>
          ))}
        </g>
        <g transform="translate(140, 170)">
          {[1, 2, 3].map((i) => (
            <g key={i} transform={`translate(${(i - 1) * 40}, 0)`}>
              <ellipse cx="20" cy="50" rx="10" ry="35" fill={colors.chromosome3 as string} />
              <circle cx="20" cy="50" r="4" fill={colors.centromere as string} />
            </g>
          ))}
        </g>
      </svg>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
        {commonTrisomies.map((trisomy, i) => (
          <div key={i} className="bg-white rounded-lg p-4 border-2 border-red-200 shadow-sm">
            <div className="text-center mb-2">
              <span className="text-2xl font-bold" style={{ color: colors.trisomy as string }}>
                {trisomy.chromosome}
              </span>
            </div>
            <h5 className="font-semibold text-gray-800 text-center mb-2">{trisomy.name}</h5>
            <p className="text-xs text-gray-500 text-center mb-2">发病率：{trisomy.incidence}</p>
            <ul className="text-xs text-gray-600 space-y-1">
              {trisomy.features.map((feature, j) => (
                <li key={j}>• {feature}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AneuploidyVisualization({ data, colors }: TrisomyDetailedVisualizationProps) {
  const types = data.types as Array<{
    name: string;
    description: string;
    formation: string;
    viability: string;
    examples: string[];
  }>;

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-center">
        <h4 className="text-lg font-semibold text-gray-800">非整倍体类型</h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
        {types.map((type, i) => (
          <div key={i} className="bg-white rounded-lg p-4 border-2 shadow-sm"
               style={{ borderColor: type.name.includes('单体') ? colors.monosomy as string :
                              type.name.includes('三体') ? colors.trisomy as string :
                              colors.tetrasomy as string }}>
            <div className="text-center mb-3">
              <span className="px-3 py-1 rounded-full text-sm font-bold text-white"
                    style={{ backgroundColor: type.name.includes('单体') ? colors.monosomy as string :
                                           type.name.includes('三体') ? colors.trisomy as string :
                                           colors.tetrasomy as string }}>
                {type.name}
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <p><span className="font-semibold">描述：</span>{type.description}</p>
              <p><span className="font-semibold">形成：</span>{type.formation}</p>
              <p><span className="font-semibold">存活：</span>{type.viability}</p>
              <div className="text-xs text-gray-600 mt-2">
                <p className="font-semibold mb-1">例子：</p>
                {type.examples.map((example, j) => (
                  <p key={j}>• {example}</p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
