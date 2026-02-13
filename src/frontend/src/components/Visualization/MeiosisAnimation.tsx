import { useState, useEffect } from 'react';
import { MeiosisAnimationData } from '@shared/types/agent.types';
import { Play, Pause, SkipBack, SkipForward, RefreshCw, Lightbulb } from 'lucide-react';

interface MeiosisAnimationProps {
  data: MeiosisAnimationData;
  colors?: Record<string, string>;
  autoplay?: boolean;
  onStageChange?: (stageIndex: number) => void;
}

const STAGE_CONFIG = [
  { phase: 'interphase', color: '#3B82F6', emoji: '🧬' },
  { phase: 'prophase1', color: '#8B5CF6', emoji: '🔄' },
  { phase: 'metaphase1', color: '#EC4899', emoji: '⚖️' },
  { phase: 'anaphase1', color: '#F59E0B', emoji: '➡️' },
  { phase: 'telophase1', color: '#10B981', emoji: '✂️' },
  { phase: 'prophase2', color: '#6366F1', emoji: '🔄' },
  { phase: 'metaphase2', color: '#EF4444', emoji: '⚖️' },
  { phase: 'anaphase2', color: '#F97316', emoji: '➡️' },
  { phase: 'telophase2', color: '#14B8A6', emoji: '🎉' },
];

const CHROMOSOME_COLORS = {
  paternal: '#3B82F6',
  maternal: '#EC4899',
  sister: '#8B5CF6',
};

export function MeiosisAnimation({
  data,
  colors: _colors,
  autoplay = false,
  onStageChange,
}: MeiosisAnimationProps) {
  const { stages, duration, highlights } = data || {};

  if (!data || !stages || stages.length === 0) {
    return <div className="text-center text-gray-500 p-8">减数分裂数据加载中...</div>;
  }

  const [currentStage, setCurrentStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const showExplanation = true;

  const stageDuration = duration / stages.length;
  const config = STAGE_CONFIG[currentStage] || STAGE_CONFIG[0];

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentStage((prev) => {
        const next = prev + 1;
        if (next >= stages.length) {
          setIsPlaying(false);
          return 0;
        }
        return next;
      });
    }, stageDuration);

    return () => clearInterval(timer);
  }, [isPlaying, stageDuration, stages.length]);

  useEffect(() => {
    onStageChange?.(currentStage);
  }, [currentStage, onStageChange]);

  const handlePrev = () => {
    setCurrentStage((prev) => (prev > 0 ? prev - 1 : stages.length - 1));
  };

  const handleNext = () => {
    setCurrentStage((prev) => (prev < stages.length - 1 ? prev + 1 : 0));
  };

  const handleReset = () => {
    setCurrentStage(0);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const isHighlighted = (text: string) => {
    return highlights.some((h) => text.includes(h));
  };

  const renderChromosomes = () => {
    const stage = stages[currentStage];
    const chromosomeCount = stage.chromosomeCount;
    
    const renderChromosome = (index: number, isPaternal: boolean) => {
      const isPair = currentStage < 5;
      const isSeparated = currentStage >= 3;
      const isReplicated = currentStage >= 0;
      const isSisterSeparated = currentStage >= 6;

      const baseColor = isPaternal ? CHROMOSOME_COLORS.paternal : CHROMOSOME_COLORS.maternal;
      const x = isSeparated ? (isPaternal ? 25 : 75) : 50;
      const yOffset = isPair ? (isPaternal ? -8 : 8) : 0;

      const sisterOffset = isSisterSeparated ? 6 : 2;

      return (
        <g key={`${isPaternal ? 'p' : 'm'}-${index}`}>
          {isReplicated && (
            <>
              <path
                d={`M ${x - 15} ${40 + yOffset - sisterOffset} Q ${x} ${35 + yOffset - sisterOffset} ${x + 15} ${40 + yOffset - sisterOffset}`}
                stroke={baseColor}
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d={`M ${x - 15} ${40 + yOffset + sisterOffset} Q ${x} ${45 + yOffset + sisterOffset} ${x + 15} ${40 + yOffset + sisterOffset}`}
                stroke={CHROMOSOME_COLORS.sister}
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
              {currentStage >= 1 && currentStage <= 2 && (
                <circle
                  cx={x}
                  cy={40 + yOffset}
                  r="3"
                  fill="#F59E0B"
                  className="animate-pulse"
                />
              )}
            </>
          )}
        </g>
      );
    };

    const visiblePairs = Math.min(Math.ceil(chromosomeCount / 2), 5);

    return (
      <svg viewBox="0 0 100 80" className="w-full h-full">
        {Array.from({ length: visiblePairs }).map((_, i) => (
          <g key={i}>
            {renderChromosome(i, true)}
            {renderChromosome(i, false)}
          </g>
        ))}

        {currentStage >= 5 && currentStage < 9 && (
          <>
            <line x1="50" y1="20" x2="50" y2="70" stroke="#E5E7EB" strokeWidth="2" strokeDasharray="4" />
          </>
        )}
      </svg>
    );
  };

  const renderCellDivision = () => {
    if (currentStage < 4) {
      return (
        <div className="w-full h-full rounded-full border-4 border-blue-300 bg-blue-50 flex items-center justify-center">
          <div className="text-blue-400 font-bold">2n</div>
        </div>
      );
    }

    if (currentStage >= 4 && currentStage < 8) {
      return (
        <div className="w-full h-full flex gap-2">
          <div className="flex-1 rounded-full border-4 border-green-300 bg-green-50 flex items-center justify-center">
            <div className="text-green-400 font-bold">n</div>
          </div>
          <div className="flex-1 rounded-full border-4 border-green-300 bg-green-50 flex items-center justify-center">
            <div className="text-green-400 font-bold">n</div>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full h-full grid grid-cols-2 gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-full border-2 border-purple-300 bg-purple-50 flex items-center justify-center"
          >
            <div className="text-purple-400 text-xs font-bold">n</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">减数分裂动画</h3>
        <p className="text-gray-600 text-sm">展示减数分裂的全过程</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{config.emoji}</span>
                  <div>
                    <div className="font-bold text-gray-800">{stages[currentStage].name}</div>
                    <div className="text-xs text-gray-500">第 {currentStage + 1} / {stages.length} 阶段</div>
                  </div>
                </div>
                {isHighlighted(stages[currentStage].keyEvent) && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium flex items-center gap-1">
                    <Lightbulb className="w-3 h-3" />
                    重点
                  </span>
                )}
              </div>
            </div>

            <div className="p-6">
              <div className="h-48 mb-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                {renderChromosomes()}
              </div>

              {showExplanation && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-blue-800 mb-1">阶段描述</div>
                      <p className="text-sm text-blue-700">{stages[currentStage].description}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-orange-800 mb-1">关键事件</div>
                      <p className={`text-sm ${isHighlighted(stages[currentStage].keyEvent) ? 'text-orange-600 font-medium' : 'text-orange-700'}`}>
                        {stages[currentStage].keyEvent}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center gap-2">
            <button
              onClick={handleReset}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              title="重置"
            >
              <RefreshCw className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={handlePrev}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              title="上一阶段"
            >
              <SkipBack className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={togglePlay}
              className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                isPlaying ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  暂停
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  播放
                </>
              )}
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              title="下一阶段"
            >
              <SkipForward className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <div className="font-bold text-gray-800">阶段进度</div>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                {stages.map((stage, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentStage(index);
                      setIsPlaying(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      index === currentStage
                        ? 'bg-blue-100 border-2 border-blue-500'
                        : index < currentStage
                        ? 'bg-green-50 border-2 border-green-200'
                        : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            index === currentStage
                              ? 'bg-blue-500 text-white'
                              : index < currentStage
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-300 text-gray-600'
                          }`}
                        >
                          {index + 1}
                        </div>
                        <span className={`font-medium ${index === currentStage ? 'text-blue-800' : 'text-gray-700'}`}>
                          {stage.name}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">{stage.chromosomeCount} 条</span>
                      </div>
                    </div>
                    {isHighlighted(stage.keyEvent) && index !== currentStage && (
                      <div className="mt-1 text-xs text-orange-600 font-medium">
                        {stage.keyEvent}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <div className="font-bold text-gray-800">细胞分裂示意</div>
            </div>
            <div className="p-6">
              <div className="h-32 flex items-center justify-center">
                {renderCellDivision()}
              </div>
              <div className="text-center text-sm text-gray-600 mt-2">
                {currentStage < 4 && '二倍体细胞 (2n)'}
                {currentStage >= 4 && currentStage < 8 && '两个单倍体细胞 (n + n)'}
                {currentStage >= 8 && '四个单倍体细胞 (4 × n)'}
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-yellow-600" />
              <div className="font-semibold text-sm text-yellow-800">重点标注</div>
            </div>
            <div className="flex flex-wrap gap-2">
              {highlights.map((highlight, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    isHighlighted(stages[currentStage].keyEvent) && stages[currentStage].keyEvent.includes(highlight)
                      ? 'bg-yellow-400 text-yellow-900'
                      : 'bg-yellow-200 text-yellow-800'
                  }`}
                >
                  {highlight}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
