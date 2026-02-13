import { useState } from 'react';
import { ChromosomeBehaviorData } from '@shared/types/agent.types';
import { Info, RefreshCw, ArrowRight, Shuffle } from 'lucide-react';

interface ChromosomeBehaviorProps {
  data: ChromosomeBehaviorData;
  colors?: Record<string, string>;
  behaviorType?: 'segregation' | 'recombination' | 'assortment';
  onBehaviorChange?: (type: string) => void;
}

type BehaviorType = 'segregation' | 'recombination' | 'assortment';

const BEHAVIOR_LABELS: Record<BehaviorType, string> = {
  segregation: '同源染色体分离',
  recombination: '基因互换重组',
  assortment: '自由组合定律',
};

const BEHAVIOR_DESCRIPTIONS: Record<BehaviorType, string> = {
  segregation: '同源染色体在减数分裂后期I分离到不同的配子中',
  recombination: '同源染色体的非姐妹染色单体之间发生基因互换',
  assortment: '不同对同源染色体在减数分裂时的分配是独立的',
};

const BEHAVIOR_STAGES: Record<BehaviorType, string> = {
  segregation: '后期 I',
  recombination: '前期 I',
  assortment: '中期 I',
};

export function ChromosomeBehavior({
  data,
  colors: _colors,
  behaviorType: initialBehaviorType,
  onBehaviorChange,
}: ChromosomeBehaviorProps) {
  const { chromosomes, behavior } = data || {};

  if (!data || !chromosomes || !behavior) {
    return <div className="text-center text-gray-500 p-8">染色体行为数据加载中...</div>;
  }

  const [activeBehavior, setActiveBehavior] = useState<BehaviorType>(
    initialBehaviorType || (behavior.type as BehaviorType) || 'segregation'
  );
  const [selectedChromosome, setSelectedChromosome] = useState<string | null>(null);
  const [animationStep, setAnimationStep] = useState(0);

  const selectedChromo = chromosomes.find((c) => c.id === selectedChromosome);

  const handleBehaviorChange = (type: BehaviorType) => {
    setActiveBehavior(type);
    onBehaviorChange?.(type);
    setAnimationStep(0);
    setSelectedChromosome(null);
  };

  const renderChromosome = (
    chromo: ChromosomeBehaviorData['chromosomes'][0],
    index: number,
    isPaired: boolean,
    animationOffset: number = 0
  ) => {
    const isSelected = selectedChromosome === chromo.id;
    const width = chromo.length * 0.4;
    const xOffset = isPaired ? -10 : 10;
    const finalX = 50 + xOffset + (activeBehavior === 'segregation' && animationStep > 1 ? (isPaired ? -20 : 20) : 0);
    const x = finalX + animationOffset;

    return (
      <g
        key={chromo.id}
        onClick={() => setSelectedChromosome(isSelected ? null : chromo.id)}
        style={{ cursor: 'pointer' }}
        className={isSelected ? 'opacity-100' : 'opacity-80 hover:opacity-100'}
      >
        <rect
          x={x - width / 2}
          y={20 + index * 25}
          width={width}
          height={16}
          rx={4}
          fill={chromo.color}
          stroke={isSelected ? '#1F2937' : chromo.color}
          strokeWidth={isSelected ? 3 : 1}
          className="transition-all duration-300"
        />
        
        <text
          x={x}
          y={32 + index * 25}
          textAnchor="middle"
          className="text-xs font-bold"
          fill="white"
          style={{ fontSize: '8px' }}
        >
          {chromo.name}
        </text>

        {selectedChromosome === chromo.id && (
          <>
            <circle cx={x - width / 2 - 5} cy={28 + index * 25} r="4" fill="#10B981" />
            <text x={x - width / 2 - 5} y={31 + index * 25} textAnchor="middle" className="text-xs" fill="white" style={{ fontSize: '6px' }}>
              ✓
            </text>
          </>
        )}
      </g>
    );
  };

  const renderGenes = () => {
    if (!selectedChromo) return null;

    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <div className="font-medium text-gray-800 mb-3">{selectedChromo.name} 基因分布</div>
        <div className="relative h-8 bg-white rounded border border-gray-200">
          {selectedChromo.genes.map((gene, index) => (
            <div
              key={index}
              className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-xs text-white font-bold cursor-pointer hover:scale-110 transition-transform"
              style={{
                left: `${gene.position * 100}%`,
                backgroundColor: gene.dominant ? '#10B981' : '#EF4444',
                transform: 'translate(-50%, -50%)',
              }}
              title={`${gene.name} (${gene.dominant ? '显性' : '隐性'})`}
            >
              {gene.name.charAt(0)}
            </div>
          ))}
        </div>
        <div className="mt-3 space-y-2">
          {selectedChromo.genes.map((gene, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: gene.dominant ? '#10B981' : '#EF4444' }}
              />
              <span className="font-medium text-gray-700">{gene.name}</span>
              <span className="text-gray-500">位置: {(gene.position * 100).toFixed(0)}%</span>
              <span className={`px-2 py-0.5 rounded text-xs ${gene.dominant ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {gene.dominant ? '显性' : '隐性'}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderBehaviorVisualization = () => {
    switch (activeBehavior) {
      case 'segregation':
        return (
          <div className="space-y-4">
            <div className="relative h-24">
              <svg viewBox="0 0 200 80" className="w-full h-full">
                {chromosomes.slice(0, 4).map((chromo, i) => (
                  <g key={chromo.id}>
                    {renderChromosome(chromo, i, true, animationStep > 1 ? -15 * (i % 2) : 0)}
                    {renderChromosome(chromo, i, false, animationStep > 1 ? 15 * (i % 2) : 0)}
                  </g>
                ))}
                {animationStep > 1 && (
                  <>
                    <line x1="50" y1="20" x2="50" y2="70" stroke="#E5E7EB" strokeWidth="2" strokeDasharray="4" />
                    <text x="25" y="75" textAnchor="middle" className="text-xs" fill="#6B7280">配子1</text>
                    <text x="175" y="75" textAnchor="middle" className="text-xs" fill="#6B7280">配子2</text>
                  </>
                )}
              </svg>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-sm">
                <ArrowRight className="w-4 h-4 text-blue-600" />
                <span className="text-blue-700">同源染色体分离到不同的配子中</span>
              </div>
            </div>
          </div>
        );

      case 'recombination':
        return (
          <div className="space-y-4">
            <div className="relative h-24">
              <svg viewBox="0 0 200 80" className="w-full h-full">
                {chromosomes.slice(0, 2).map((chromo, i) => (
                  <g key={chromo.id}>
                    <rect
                      x={i === 0 ? 40 : 100}
                      y={20}
                      width={chromo.length * 0.4}
                      height={16}
                      rx={4}
                      fill={chromo.color}
                      opacity={animationStep >= 1 ? 1 : 0.5}
                    />
                    {animationStep >= 2 && (
                      <>
                        <path
                          d={`M ${i === 0 ? 60 : 90} 28 Q ${75} ${28 + animationStep * 5} ${i === 0 ? 90 : 60} 28`}
                          stroke="#F59E0B"
                          strokeWidth="2"
                          fill="none"
                          strokeDasharray="4"
                          className="animate-pulse"
                        />
                        <circle cx={75} cy={28 + animationStep * 5} r="4" fill="#F59E0B" />
                      </>
                    )}
                  </g>
                ))}
                {animationStep >= 3 && (
                  <>
                    <rect x="40" y="20" width={chromosomes[0].length * 0.4} height={16} rx={4} fill={chromosomes[1].color} />
                    <rect x="100" y="20" width={chromosomes[1].length * 0.4} height={16} rx={4} fill={chromosomes[0].color} />
                    <text x="75" y="55" textAnchor="middle" className="text-xs" fill="#F59E0B">基因互换</text>
                  </>
                )}
              </svg>
            </div>
            <div className="bg-orange-50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-sm">
                <Shuffle className="w-4 h-4 text-orange-600" />
                <span className="text-orange-700">非姐妹染色单体之间发生基因互换</span>
              </div>
            </div>
          </div>
        );

      case 'assortment':
        return (
          <div className="space-y-4">
            <div className="relative h-24">
              <svg viewBox="0 0 200 80" className="w-full h-full">
                {chromosomes.slice(0, 4).map((chromo, i) => {
                  const row = Math.floor(i / 2);
                  const col = i % 2;
                  return (
                    <g key={chromo.id}>
                      <rect
                        x={30 + col * 50 + (animationStep > 1 ? (col === 0 ? (row === 0 ? -10 : 10) : (row === 0 ? 10 : -10)) : 0)}
                        y={20 + row * 20}
                        width={chromo.length * 0.35}
                        height={14}
                        rx={3}
                        fill={chromo.color}
                        opacity={animationStep >= 1 ? 1 : 0.5}
                      />
                      <text
                        x={50 + col * 50 + (animationStep > 1 ? (col === 0 ? (row === 0 ? -10 : 10) : (row === 0 ? 10 : -10)) : 0)}
                        y={30 + row * 20}
                        textAnchor="middle"
                        className="text-xs"
                        fill="white"
                        style={{ fontSize: '7px' }}
                      >
                        {chromo.id}
                      </text>
                    </g>
                  );
                })}
                {animationStep > 1 && (
                  <>
                    <line x1="50" y1="10" x2="50" y2="70" stroke="#E5E7EB" strokeWidth="1" />
                    <line x1="150" y1="10" x2="150" y2="70" stroke="#E5E7EB" strokeWidth="1" />
                    <text x="25" y="75" textAnchor="middle" className="text-xs" fill="#6B7280">配子A</text>
                    <text x="175" y="75" textAnchor="middle" className="text-xs" fill="#6B7280">配子B</text>
                  </>
                )}
              </svg>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-sm">
                <RefreshCw className="w-4 h-4 text-green-600" />
                <span className="text-green-700">不同对染色体独立分配到配子中</span>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">染色体行为</h3>
        <p className="text-gray-600 text-sm">展示染色体的分离和组合</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="font-bold text-gray-800">行为类型</div>
                <button
                  onClick={() => {
                    setAnimationStep(0);
                  }}
                  className="p-1.5 rounded bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors"
                  title="重新播放动画"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-4 space-y-2">
              {(['segregation', 'recombination', 'assortment'] as BehaviorType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => handleBehaviorChange(type)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeBehavior === type
                      ? 'bg-blue-100 border-2 border-blue-500'
                      : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                  }`}
                >
                  <div className="font-medium text-gray-800">{BEHAVIOR_LABELS[type]}</div>
                  <div className="text-sm text-gray-500 mt-1">{BEHAVIOR_DESCRIPTIONS[type]}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <div className="font-bold text-gray-800">染色体选择</div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-2">
                {chromosomes.map((chromo) => (
                  <button
                    key={chromo.id}
                    onClick={() => setSelectedChromosome(selectedChromosome === chromo.id ? null : chromo.id)}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      selectedChromosome === chromo.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: chromo.color }}
                      />
                      <span className="text-sm font-medium text-gray-700">{chromo.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="font-bold text-gray-800">{BEHAVIOR_LABELS[activeBehavior]}</div>
                <span className="text-xs text-gray-500">发生阶段: {BEHAVIOR_STAGES[activeBehavior]}</span>
              </div>
            </div>
            <div className="p-6">
              {renderBehaviorVisualization()}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-gray-500" />
                <div className="font-bold text-gray-800">行为说明</div>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                {BEHAVIOR_DESCRIPTIONS[activeBehavior]}。这个过程发生在减数分裂的
                <span className="font-medium text-blue-700"> {BEHAVIOR_STAGES[activeBehavior]}</span>
                阶段，对于理解遗传学的基本原理至关重要。
              </p>
            </div>
          </div>

          {renderGenes()}
        </div>
      </div>
    </div>
  );
}
