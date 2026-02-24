import type { VisualizationData, VisualizationColors } from '@shared/types/agent.types';

interface EpigeneticsVisualizationProps {
  data: VisualizationData;
  colors: VisualizationColors;
}

export function DNAMethylationVisualization({ data, colors }: EpigeneticsVisualizationProps) {
  const mechanism = data.mechanism as {
    enzyme: string;
    substrate: string;
    target: string;
    product: string;
  };
  const locations = data.locations as Array<{ name: string; description: string }>;
  const effects = data.effects as Array<{
    methylation: string;
    outcome: string;
    example: string;
  }>;

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-center">
        <h4 className="text-lg font-semibold text-gray-800">DNA甲基化机制</h4>
        <p className="text-sm text-gray-600 mt-1">{mechanism.product}</p>
      </div>

      <svg width="500" height="200" viewBox="0 0 500 200" className="mx-auto">
        <defs>
          <marker id="arrow-meth" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill={colors.methylGroup as string} />
          </marker>
        </defs>

        <text x="250" y="30" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#333">
          CpG二核苷酸甲基化
        </text>

        <g transform="translate(100, 80)">
          <circle cx="40" cy="40" r="25" fill={colors.cytosine as string} />
          <text x="40" y="45" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">C</text>
          <circle cx="80" cy="40" r="25" fill={colors.guanine as string} />
          <text x="80" y="45" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">G</text>
          <line x1="65" y1="40" x2="55" y2="40" stroke="#333" strokeWidth="3" />
          <line x1="40" y1="65" x2="40" y2="75" stroke="#333" strokeWidth="2" />
          <line x1="80" y1="65" x2="80" y2="75" stroke="#333" strokeWidth="2" />
        </g>

        <g transform="translate(300, 80)">
          <circle cx="40" cy="40" r="25" fill={colors.methylated as string} />
          <text x="40" y="45" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">C</text>
          <circle cx="80" cy="40" r="25" fill={colors.guanine as string} />
          <text x="80" y="45" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">G</text>
          <circle cx="40" cy="15" r="10" fill={colors.methylGroup as string} />
          <text x="40" y="19" textAnchor="middle" fill="white" fontSize="8">CH₃</text>
          <line x1="65" y1="40" x2="55" y2="40" stroke="#333" strokeWidth="3" />
          <line x1="40" y1="65" x2="40" y2="75" stroke="#333" strokeWidth="2" />
          <line x1="80" y1="65" x2="80" y2="75" stroke="#333" strokeWidth="2" />
        </g>

        <g transform="translate(230, 150)">
          <text x="0" y="0" textAnchor="end" fontSize="11" fill="#666">未甲基化</text>
          <line x1="10" y1="-4" x2="40" y2="-4" stroke={colors.methylGroup as string} strokeWidth="2" markerEnd="url(#arrow-meth)" />
          <text x="50" y="0" fontSize="11" fill="#666">甲基化</text>
          <text x="120" y="0" fontSize="10" fill="#999">DNMT</text>
        </g>
      </svg>

      <div className="grid grid-cols-2 gap-4 w-full max-w-3xl">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h5 className="font-semibold text-gray-800 mb-2">发生位置</h5>
          <ul className="space-y-1 text-sm text-gray-600">
            {locations.map((loc, i) => (
              <li key={i}>• <span className="font-semibold">{loc.name}</span>：{loc.description}</li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h5 className="font-semibold text-gray-800 mb-2">生物学效应</h5>
          <ul className="space-y-2 text-sm">
            {effects.map((effect, i) => (
              <li key={i}>
                <span className={`px-2 py-1 rounded text-xs ${i === 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {effect.methylation}
                </span>
                <span className="text-gray-700 ml-1">{effect.outcome}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function HistoneModificationVisualization({ data, colors }: EpigeneticsVisualizationProps) {
  const modifications = data.modifications as Array<{
    type: string;
    enzyme: string;
    removal: string;
    effect: string;
    example: string;
  }>;
  const chromatinStates = data.chromatinStates as Array<{
    name: string;
    marks: string;
    structure: string;
    expression: string;
  }>;

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-center">
        <h4 className="text-lg font-semibold text-gray-800">组蛋白修饰与"组蛋白密码"</h4>
      </div>

      <svg width="400" height="180" viewBox="0 0 400 180" className="mx-auto">
        <defs>
          <marker id="arrow-hist" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
          </marker>
        </defs>

        <text x="200" y="25" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#333">
          核小体结构与修饰
        </text>

        <g transform="translate(50, 50)">
          <ellipse cx="150" cy="60" rx="130" ry="50" fill={colors.histone as string} opacity="0.3" />
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
            const angle = (i - 1) * (2 * Math.PI / 8);
            const x = 150 + Math.cos(angle) * 100;
            const y = 60 + Math.sin(angle) * 35;
            return (
              <g key={i}>
                <line x1={150} y1={60} x2={x} y2={y} stroke="#999" strokeWidth="3" />
                <ellipse cx={x} cy={y} rx="8" ry="20" fill="#ddd" stroke="#999" strokeWidth="1" />
              </g>
            );
          })}

          <g transform="translate(20, 40)">
            <circle cx="0" cy="0" r="6" fill={colors.acetylation as string} />
            <text x="0" y="15" textAnchor="middle" fontSize="8" fill="#666">Ac</text>
          </g>
          <g transform="translate(280, 50)">
            <circle cx="0" cy="0" r="6" fill={colors.methylation as string} />
            <text x="0" y="15" textAnchor="middle" fontSize="8" fill="#666">Me</text>
          </g>
          <g transform="translate(150, 15)">
            <circle cx="0" cy="0" r="6" fill={colors.phosphorylation as string} />
            <text x="0" y="-8" textAnchor="middle" fontSize="8" fill="#666">P</text>
          </g>
        </g>

        <g transform="translate(50, 140)">
          <rect x="0" y="0" width="300" height="25" fill={colors.euchromatin as string} rx="3" />
          <text x="150" y="17" textAnchor="middle" fontSize="10" fill="#333" fontWeight="bold">常染色质 - 基因活跃转录</text>
        </g>
      </svg>

      <div className="grid grid-cols-2 gap-3 w-full max-w-4xl">
        {modifications.map((mod, i) => (
          <div key={i} className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 rounded text-xs font-bold text-white"
                    style={{ backgroundColor: colors[mod.type.toLowerCase() as keyof typeof colors] as string || '#999' }}>
                {mod.type}
              </span>
            </div>
            <p className="text-xs text-gray-600">
              <span className="font-semibold">酶：</span>{mod.enzyme} / {mod.removal}
            </p>
            <p className="text-xs text-gray-700 mt-1">
              <span className="font-semibold">效应：</span>{mod.effect}
            </p>
            <p className="text-xs text-gray-500 italic mt-1">例：{mod.example}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RNAInterferenceVisualization({ data, colors }: EpigeneticsVisualizationProps) {
  const pathways = data.pathways as Array<{
    name: string;
    source: string;
    processing: string;
    loading: string;
    target: string;
    outcome: string;
    specificity: string;
  }>;
  const components = data.components as Array<{ name: string; function: string }>;

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-center">
        <h4 className="text-lg font-semibold text-gray-800">RNA干扰机制</h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
        {pathways.map((pathway, i) => (
          <div key={i} className="bg-white rounded-lg p-4 border-2 shadow-sm"
               style={{ borderColor: pathway.name.includes('siRNA') ? colors.sirna as string : colors.mirna as string }}>
            <h5 className="font-bold text-lg mb-3 text-center" style={{ color: pathway.name.includes('siRNA') ? colors.sirna as string : colors.mirna as string }}>
              {pathway.name}
            </h5>
            <svg width="280" height="180" viewBox="0 0 280 180" className="mx-auto mb-3">
              <text x="140" y="20" textAnchor="middle" fontSize="10" fill="#666">{pathway.source}</text>

              <g transform="translate(20, 50)">
                <rect x="0" y="0" width="240" height="30" fill="#ddd" rx="3" />
                <text x="120" y="20" textAnchor="middle" fontSize="10" fill="#666">长双链RNA</text>
                <text x="250" y="20" fontSize="8" fill="#999">Dicer</text>
                <line x1="260" y1="15" x2="260" y2="0" stroke="#999" strokeWidth="1" markerEnd="url(#arrow-hist)" />
              </g>

              <g transform="translate(50, 100)">
                <rect x="0" y="0" width="180" height="25" fill={pathway.name.includes('siRNA') ? colors.sirna as string : colors.mirna as string} rx="3" />
                <text x="90" y="17" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">
                  {pathway.name.includes('siRNA') ? 'siRNA' : 'miRNA'} (21-25bp)
                </text>
              </g>

              <g transform="translate(60, 140)">
                <circle cx="80" cy="20" r="25" fill={colors.risc as string} />
                <text x="80" y="25" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">RISC</text>
                <line x1="55" y1="5" x2="40" y2="-10" stroke="#999" strokeWidth="1" markerEnd="url(#arrow-hist)" />
                <text x="35" y="-15" fontSize="8" fill="#999">加载</text>
              </g>

              <g transform="translate(160, 140)">
                <rect x="0" y="0" width="100" height="25" fill={colors.mrna as string} rx="3" />
                <text x="50" y="17" textAnchor="middle" fontSize="9" fill="white">mRNA</text>
                <line x1="50" y1="-5" x2="50" y2="-25" stroke={colors.degraded as string} strokeWidth="2" strokeDasharray="3,2" />
                <text x="50" y="-35" textAnchor="middle" fontSize="8" fill={colors.degraded as string}>{pathway.outcome}</text>
              </g>
            </svg>
            <p className="text-xs text-gray-600 text-center italic">{pathway.specificity}</p>
          </div>
        ))}
      </div>

      <div className="w-full max-w-3xl">
        <h5 className="font-semibold text-gray-800 mb-3 text-center">核心组分</h5>
        <div className="grid grid-cols-2 gap-3">
          {components.map((comp, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <span className="font-semibold text-sm text-gray-800">{comp.name}</span>
              <p className="text-xs text-gray-600 mt-1">{comp.function}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ChromatinRemodelingVisualization({ data, colors }: EpigeneticsVisualizationProps) {
  const families = data.families as Array<{
    name: string;
    subunits: string;
    mechanism: string;
    effect: string;
    example: string;
    diseases: string;
  }>;
  const mechanisms = data.mechanisms as Array<{
    type: string;
    description: string;
    energy: string;
    result: string;
  }>;

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-center">
        <h4 className="text-lg font-semibold text-gray-800">染色质重塑复合物</h4>
        <p className="text-sm text-gray-600 mt-1">ATP依赖的染色质结构改变</p>
      </div>

      <svg width="450" height="150" viewBox="0 0 450 150" className="mx-auto">
        <text x="225" y="25" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#333">
          核小体重塑机制
        </text>

        <g transform="translate(50, 50)">
          <ellipse cx="60" cy="40" rx="50" ry="20" fill={colors.nucleosome as string} opacity="0.5" />
          <rect x="0" y="30" width="120" height="20" fill="#ddd" />
          <text x="60" y="75" textAnchor="middle" fontSize="10" fill="#666">紧密</text>
        </g>

        <line x1="170" y1="90" x2="200" y2="90" stroke="#ddd" strokeWidth="2" markerEnd="url(#arrow-hist)" />

        <g transform="translate(220, 50)">
          <ellipse cx="60" cy="40" rx="50" ry="20" fill={colors.remodelingComplex as string} opacity="0.3" />
          <rect x="0" y="30" width="120" height="20" fill="#ddd" />
          <circle cx="60" cy="20" r="15" fill={colors.atp as string} />
          <text x="60" y="25" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">ATP</text>
          <text x="60" y="75" textAnchor="middle" fontSize="10" fill="#666">重塑中</text>
        </g>

        <line x1="340" y1="90" x2="370" y2="90" stroke="#ddd" strokeWidth="2" markerEnd="url(#arrow-hist)" />

        <g transform="translate(380, 50)">
          <ellipse cx="60" cy="40" rx="50" ry="20" fill={colors.accessibleDna as string} opacity="0.5" />
          <rect x="0" y="30" width="120" height="20" fill="#ddd" />
          <text x="60" y="75" textAnchor="middle" fontSize="10" fill="#666">开放</text>
        </g>

        <g transform="translate(50, 120)">
          <text x="60" y="0" textAnchor="middle" fontSize="9" fill="#999"> inaccessibleDna</text>
        </g>
        <g transform="translate(220, 120)">
          <text x="60" y="0" textAnchor="middle" fontSize="9" fill="#999">重塑复合物+ATP</text>
        </g>
        <g transform="translate(380, 120)">
          <text x="60" y="0" textAnchor="middle" fontSize="9" fill="#999">accessibleDna</text>
        </g>
      </svg>

      <div className="grid grid-cols-2 gap-4 w-full max-w-4xl">
        <div>
          <h5 className="font-semibold text-gray-800 mb-2">重塑复合物家族</h5>
          <div className="space-y-2">
            {families.map((family, i) => (
              <div key={i} className="bg-white rounded-lg p-3 border border-gray-200">
                <h6 className="font-semibold text-sm" style={{ color: colors.remodelingComplex as string }}>{family.name}</h6>
                <p className="text-xs text-gray-600 mt-1">{family.mechanism} → {family.effect}</p>
                <p className="text-xs text-gray-500 italic">例：{family.example}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h5 className="font-semibold text-gray-800 mb-2">重塑机制</h5>
          <div className="space-y-2">
            {mechanisms.map((mech, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <h6 className="font-semibold text-sm text-gray-800">{mech.type}</h6>
                <p className="text-xs text-gray-600">{mech.description}</p>
                <p className="text-xs text-green-600 mt-1">{mech.result}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function NoncodingRNAVisualization({ data, colors }: EpigeneticsVisualizationProps) {
  const categories = data.categories as Array<{
    name: string;
    size: string;
    abundance: string;
    mechanisms: string[];
    examples: string[];
    functions: string;
  }>;

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-center">
        <h4 className="text-lg font-semibold text-gray-800">非编码RNA功能</h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-5xl">
        {categories.map((cat, i) => (
          <div key={i} className="bg-white rounded-lg p-4 border-2 shadow-sm"
               style={{ borderColor: colors[cat.name.toLowerCase().replace('-', '') as keyof typeof colors] as string || '#ddd' }}>
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-bold text-lg" style={{ color: colors[cat.name.toLowerCase().replace('-', '') as keyof typeof colors] as string || '#333' }}>
                {cat.name}
              </h5>
              <span className="px-2 py-1 bg-gray-100 rounded text-xs">{cat.size}</span>
            </div>
            <p className="text-xs text-gray-500 mb-2">{cat.abundance}</p>
            <div className="mb-2">
              <p className="text-xs font-semibold text-gray-700 mb-1">机制：</p>
              <div className="flex flex-wrap gap-1">
                {cat.mechanisms.map((mech, j) => (
                  <span key={j} className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                    {mech}
                  </span>
                ))}
              </div>
            </div>
            <div className="mb-2">
              <p className="text-xs font-semibold text-gray-700 mb-1">例子：</p>
              <p className="text-xs text-gray-600 italic">{cat.examples.join(', ')}</p>
            </div>
            <p className="text-xs text-gray-700"><span className="font-semibold">功能：</span>{cat.functions}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function GenomicImprintingVisualization({ data, colors }: EpigeneticsVisualizationProps) {
  const mechanism = data.mechanism as {
    establishment: string;
    maintenance: string;
    erasure: string;
    reestablishment: string;
  };
  const imprintedGenes = data.imprintedGenes as Array<{
    name: string;
    chromosome: string;
    paternalExpression: string;
    maternalExpression: string;
    disorder: string;
  }>;
  const disorders = data.disorders as Array<{
    name: string;
    cause: string;
    features: string[];
    pattern: string;
  }>;

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-center">
        <h4 className="text-lg font-semibold text-gray-800">基因组印记机制</h4>
        <p className="text-sm text-gray-600 mt-1">亲本来源依赖的基因表达</p>
      </div>

      <svg width="400" height="180" viewBox="0 0 400 180" className="mx-auto">
        <defs>
          <marker id="arrow-imp" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
          </marker>
        </defs>

        <text x="200" y="20" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#333">
          印记建立与维持
        </text>

        <g transform="translate(30, 40)">
          <rect x="0" y="0" width="90" height="50" fill={colors.paternal as string} opacity="0.3" rx="5" />
          <text x="45" y="25" textAnchor="middle" fontSize="11" fill={colors.paternal as string} fontWeight="bold">精子</text>
          <text x="45" y="40" textAnchor="middle" fontSize="8" fill="#666">建立印记</text>
        </g>

        <g transform="translate(155, 40)">
          <rect x="0" y="0" width="90" height="50" fill={colors.maternal as string} opacity="0.3" rx="5" />
          <text x="45" y="25" textAnchor="middle" fontSize="11" fill={colors.maternal as string} fontWeight="bold">卵子</text>
          <text x="45" y="40" textAnchor="middle" fontSize="8" fill="#666">建立印记</text>
        </g>

        <g transform="translate(280, 40)">
          <rect x="0" y="0" width="90" height="50" fill={colors.imprinted as string} opacity="0.3" rx="5" />
          <text x="45" y="25" textAnchor="middle" fontSize="11" fill={colors.imprinted as string} fontWeight="bold">合子</text>
          <text x="45" y="40" textAnchor="middle" fontSize="8" fill="#666">维持印记</text>
        </g>

        <line x1="120" y1="65" x2="155" y2="65" stroke="#ddd" strokeWidth="2" />
        <line x1="245" y1="65" x2="280" y2="65" stroke="#ddd" strokeWidth="2" markerEnd="url(#arrow-imp)" />

        <g transform="translate(50, 110)">
          <circle cx="30" cy="30" r="25" fill={colors.paternal as string} />
          <text x="30" y="35" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">P</text>
          <circle cx="70" cy="30" r="25" fill={colors.maternal as string} />
          <text x="70" y="35" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">M</text>
          <line x1="55" y1="30" x2="45" y2="30" stroke="#333" strokeWidth="2" />
          <text x="50" y="70" textAnchor="middle" fontSize="10" fill="#666">受精</text>
        </g>

        <g transform="translate(250, 110)">
          <circle cx="30" cy="30" r="25" fill={colors.methylated as string} />
          <text x="30" y="35" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">M*</text>
          <circle cx="70" cy="30" r="25" fill={colors.unmethylated as string} />
          <text x="70" y="35" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">M</text>
          <text x="50" y="70" textAnchor="middle" fontSize="10" fill="#666">差异甲基化</text>
        </g>
      </svg>

      <div className="grid grid-cols-3 gap-4 w-full max-w-4xl">
        {imprintedGenes.map((gene, i) => (
          <div key={i} className="bg-white rounded-lg p-3 border border-gray-200">
            <h5 className="font-semibold text-sm text-gray-800 mb-2">{gene.name}</h5>
            <p className="text-xs text-gray-500 mb-1">{gene.chromosome}</p>
            <div className="space-y-1 text-xs">
              <p><span style={{ color: colors.paternal as string }}>♂</span>：{gene.paternalExpression}</p>
              <p><span style={{ color: colors.maternal as string }}>♀</span>：{gene.maternalExpression}</p>
            </div>
            <p className="text-xs text-red-600 mt-2">相关疾病：{gene.disorder}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
