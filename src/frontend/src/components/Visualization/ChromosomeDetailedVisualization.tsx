import type { VisualizationData, VisualizationColors } from '@shared/types/agent.types';

interface ChromosomeDetailedVisualizationProps {
  data: VisualizationData;
  colors: VisualizationColors;
}

export function ChromosomeDetailedVisualization({ data, colors }: ChromosomeDetailedVisualizationProps) {
  const structure = data.structure as {
    type: string;
    chromatids: number;
    sisterChromatids: string;
  };
  const parts = data.parts as Array<{ name: string; description: string }>;

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-center">
        <h4 className="text-lg font-semibold text-gray-800">{structure.type}</h4>
        <p className="text-sm text-gray-600 mt-1">{structure.sisterChromatids}</p>
      </div>

      <svg width="350" height="400" viewBox="0 0 350 400" className="mx-auto">
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3" />
          </filter>
        </defs>

        <g filter="url(#shadow)">
          <ellipse
            cx="175" cy="180"
            rx="60" ry="140"
            fill={colors.chromatid as string}
            fillOpacity="0.9"
            stroke={colors.chromatid as string}
            strokeWidth="2"
          />
          <ellipse
            cx="175" cy="180"
            rx="55" ry="135"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeOpacity="0.5"
          />

          <ellipse
            cx="175" cy="200"
            rx="30" ry="15"
            fill={colors.centromere as string}
          />
          <text x="175" y="205" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
            着丝粒
          </text>

          <circle
            cx="175" cy="60"
            r="8"
            fill={colors.telomere as string}
          />
          <circle
            cx="175" cy="300"
            r="8"
            fill={colors.telomere as string}
          />
          <circle
            cx="235" cy="180"
            r="6"
            fill={colors.kinetoche as string}
          />
        </g>

        <g>
          <line x1="175" y1="65" x2="260" y2="65" stroke="#666" strokeWidth="1" />
          <text x="265" y="70" fontSize="11" fill="#666">短臂(p)</text>

          <line x1="175" y1="295" x2="260" y2="295" stroke="#666" strokeWidth="1" />
          <text x="265" y="300" fontSize="11" fill="#666">长臂(q)</text>

          <line x1="175" y1="60" x2="110" y2="60" stroke={colors.telomere as string} strokeWidth="1" />
          <text x="105" y="65" textAnchor="end" fontSize="10" fill={colors.telomere as string}>端粒</text>

          <line x1="175" y1="300" x2="110" y2="300" stroke={colors.telomere as string} strokeWidth="1" />
          <text x="105" y="305" textAnchor="end" fontSize="10" fill={colors.telomere as string}>端粒</text>
        </g>
      </svg>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-md">
        {parts.map((part, i) => (
          <div key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <h5 className="font-semibold text-gray-800 text-sm">{part.name}</h5>
            <p className="text-xs text-gray-600 mt-1">{part.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChromosomeAberrationVisualization({ data, colors }: ChromosomeDetailedVisualizationProps) {
  const types = data.types as Array<{
    name: string;
    mechanism: string;
    diagram: string;
    consequence: string;
    example: string;
  }>;

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h4 className="text-lg font-semibold text-gray-800">染色体结构畸变类型</h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {types.map((type, i) => (
          <div key={i} className="bg-white rounded-lg p-4 border-2" style={{ borderColor: colors[type.name as keyof typeof colors] as string || '#ddd' }}>
            <h5 className="font-bold text-lg mb-2" style={{ color: colors[type.name as keyof typeof colors] as string || '#333' }}>
              {type.name}
            </h5>
            <svg width="200" height="80" viewBox="0 0 200 80" className="mx-auto my-3">
              <rect x="20" y="30" width="160" height="20" fill={colors.normal as string} rx="2" />
              <text x="100" y="65" textAnchor="middle" fontSize="10" fill="#666">正常</text>
            </svg>
            <div className="mt-3 space-y-2 text-sm">
              <p><span className="font-semibold">机制：</span>{type.mechanism}</p>
              <p><span className="font-semibold">后果：</span>{type.consequence}</p>
              <p className="text-xs text-gray-500 italic">例：{type.example}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
