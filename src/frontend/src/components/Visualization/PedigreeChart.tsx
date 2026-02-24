import type { PedigreeChartData } from '@shared/types/agent.types';

interface PedigreeChartProps {
  data: PedigreeChartData;
  colors?: Record<string, string>;
}

export function PedigreeChart({ data, colors }: PedigreeChartProps) {
  const individuals = data?.individuals || [];
  const legend = data?.legend || { condition: '', inheritancePattern: '' };

  if (!data || !individuals || individuals.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-4">👨‍👩‍👧‍👦</div>
          <p>家系表数据加载中...</p>
        </div>
      </div>
    );
  }

  const generations = Array.from(new Set(individuals.map(i => i.generation))).sort((a, b) => a - b);

  const getGenerationLabel = (gen: number): string => {
    const labels = ['I', 'II', 'III', 'IV', 'V', 'VI'];
    return labels[gen - 1] || gen.toString();
  };

  const layoutIndividuals = () => {
    const generationWidth = 800;
    const generationHeight = 120;
    const startX = 50;
    const startY = 50;

    const laidOutIndividuals = individuals.map(ind => {
      const genIndex = ind.generation - 1;
      const positionInGen = ind.position;
      const individualsInGen = individuals.filter(i => i.generation === ind.generation).length;
      const spacing = generationWidth / (individualsInGen + 1);

      return {
        ...ind,
        x: startX + spacing * (positionInGen + 1),
        y: startY + genIndex * generationHeight,
      };
    });

    return laidOutIndividuals;
  };

  const laidOutIndividuals = layoutIndividuals();

  const getIndividualSymbol = (individual: typeof laidOutIndividuals[number]) => {
    const { sex, affected, carrier } = individual;

    let color = '#ccc';
    if (affected) {
      color = '#000';
    } else if (carrier) {
      color = '#666';
    }

    return (
      <g>
        {sex === 'male' ? (
          <rect
            x={-20} y={-20}
            width={40}
            height={40}
            fill="none"
            stroke={color}
            strokeWidth={3}
            rx={2}
          />
        ) : (
          <circle
            cx={0}
            cy={0}
            r={20}
            fill="none"
            stroke={color}
            strokeWidth={3}
          />
        )}
        {carrier && (
          <line
            x1={-15} y1={15}
            x2={15} y2={-15}
            stroke={color}
            strokeWidth={2}
            opacity={0.6}
          />
        )}
      </g>
    );
  };

  const getRelationshipLines = () => {
    const lines: Array<{ x1: number; y1: number; x2: number; y2: number; type: 'spouse' | 'parent' }> = [];

    laidOutIndividuals.forEach(ind => {
      if (ind.parents?.father) {
        const father = laidOutIndividuals.find(i => i.id === ind.parents.father);
        const mother = laidOutIndividuals.find(i => i.id === ind.parents.mother);
        if (father && mother) {
          const midX = (father.x + mother.x) / 2;
          const midY = (father.y + mother.y) / 2;
          lines.push({ x1: midX, y1: midY, x2: ind.x, y2: ind.y, type: 'parent' });
        }
      }
      if (ind.spouse) {
        const spouse = laidOutIndividuals.find(i => i.id === ind.spouse);
        if (spouse) {
          lines.push({ x1: ind.x, y1: ind.y, x2: spouse.x, y2: spouse.y, type: 'spouse' });
        }
      }
    });

    return lines;
  };

  const relationshipLines = getRelationshipLines();

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800">{legend.condition}</h3>
        <p className="text-sm text-gray-600">{legend.inheritancePattern}</p>
      </div>

      <svg width={900} height={600} viewBox="0 0 900 600" className="mx-auto border border-gray-200 rounded-lg bg-white">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
          </marker>
        </defs>

        {generations.map(gen => (
          <g key={gen}>
            <line
              x1={20}
              y1={40 + (gen - 1) * 120}
              x2={880}
              y2={40 + (gen - 1) * 120}
              stroke="#e0e0e0"
              strokeWidth={1}
              strokeDasharray="5,5"
            />
            <text
              x={30}
              y={35 + (gen - 1) * 120}
              fontSize="12"
              fontWeight="bold"
              fill="#666"
            >
              {getGenerationLabel(gen)}
            </text>
          </g>
        ))}

        {relationshipLines.map((line, i) => (
          <line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={line.type === 'spouse' ? '#999' : '#666'}
            strokeWidth={line.type === 'spouse' ? 1 : 1.5}
            strokeDasharray={line.type === 'spouse' ? 'none' : '3,3'}
          />
        ))}

        {laidOutIndividuals.map(ind => (
          <g key={ind.id} transform={`translate(${ind.x}, ${ind.y})`}>
            <title>
              {`ID: ${ind.id}
性别: ${ind.sex === 'male' ? '男' : '女'}
表型: ${ind.affected ? '患病' : (ind.carrier ? '携带者' : '正常')}
代数: ${ind.generation}`}
            </title>
            {getIndividualSymbol(ind)}
          </g>
        ))}
      </svg>

      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="flex gap-3">
            <div className="flex items-center gap-1">
              <svg width="20" height="20" viewBox="-20 -20 40 40">
                <rect x="-20" y="-20" width="40" height="40" fill="none" stroke="#000" strokeWidth="3" rx="2" />
              </svg>
              <span>男性</span>
            </div>
            <div className="flex items-center gap-1">
              <svg width="20" height="20" viewBox="-20 -20 40 40">
                <circle cx="0" cy="0" r="20" fill="none" stroke="#000" strokeWidth="3" />
              </svg>
              <span>女性</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-3">
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 border-3 border-black rounded" />
              <span>患病</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 border-3 border-gray-400 rounded" />
              <span>正常</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="relative">
                <div className="w-6 h-6 border-3 border-gray-600 rounded" />
                <div className="absolute top-1/2 left-1/2 w-6 h-0.5 -translate-x-1/2 -translate-y-1/2 rotate-[-25deg] bg-gray-600" />
              </div>
              <span>携带者</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
