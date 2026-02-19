import React, { useState } from 'react';
import { VisualizationColors } from '../../constants/visualization-colors';

interface HomozygousHeterozygousVisualizationProps {
  data?: Record<string, unknown>;
  colors?: Record<string, string>;
}

interface GenotypeExample {
  genotype: string;
  type: string;
  phenotype: string;
  description: string;
}

export function HomozygousHeterozygousVisualization({ colors }: HomozygousHeterozygousVisualizationProps) {
  const [activeTab, setActiveTab] = useState<'definition' | 'comparison' | 'mechanism' | 'examples'>('definition');
  const [currentStep, setCurrentStep] = useState(0);
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);

  const defaultColors = {
    homozygousDominant: VisualizationColors.dominant,
    homozygousRecessive: VisualizationColors.affected,
    heterozygous: VisualizationColors.carrier,
    chromosome1: VisualizationColors.chromosome1,
    chromosome2: VisualizationColors.chromosome2,
    alleleA: VisualizationColors.dominant,
    allelea: VisualizationColors.affected,
  };

  const c = colors || defaultColors;

  const getElementDetails = (elementId: string) => {
    const elementMap: Record<string, { name: string; description: string; details?: string }> = {
      'homozygous': {
        name: '纯合子',
        description: '同源染色体同一基因座上具有相同的等位基因',
        details: '包括纯合显性(AA)和纯合隐性(aa)'
      },
      'heterozygous': {
        name: '杂合子',
        description: '同源染色体同一基因座上具有不同的等位基因',
        details: '基因型为Aa，一个显性基因，一个隐性基因'
      },
      'chromosome-paternal': {
        name: '父方染色体',
        description: '来自父亲的同源染色体',
        details: '携带一个等位基因'
      },
      'chromosome-maternal': {
        name: '母方染色体',
        description: '来自母亲的同源染色体',
        details: '携带一个等位基因'
      },
      'allele-A': {
        name: '显性等位基因A',
        description: '控制显性性状的基因',
        details: '在杂合子中会掩盖隐性基因的表达'
      },
      'allele-a': {
        name: '隐性等位基因a',
        description: '控制隐性性状的基因',
        details: '只有在纯合状态(aa)下才会表达'
      },
      'meiosis-I': {
        name: '减数分裂I',
        description: '同源染色体分离',
        details: '染色体数目减半，形成两个子细胞'
      },
      'meiosis-II': {
        name: '减数分裂II',
        description: '姐妹染色单体分离',
        details: '形成4个单倍体配子'
      },
      'gamete-formation': {
        name: '配子形成',
        description: '减数分裂产生配子的过程',
        details: '纯合子产生1种配子，杂合子产生2种配子'
      },
      'homozygousAA': {
        name: '纯合显性AA',
        description: '两个显性等位基因',
        details: '表现显性性状，只产生含A的配子'
      },
      'heterozygousAa': {
        name: '杂合子Aa',
        description: '一个显性基因，一个隐性基因',
        details: '表现显性性状，产生含A和含a的两种配子'
      },
      'homozygousaa': {
        name: '纯合隐性aa',
        description: '两个隐性等位基因',
        details: '表现隐性性状，只产生含a的配子'
      },
    };
    return elementMap[elementId];
  };

  const genotypeExamples: GenotypeExample[] = [
    {
      genotype: 'AA',
      type: '纯合显性',
      phenotype: '显性性状',
      description: '两个显性等位基因'
    },
    {
      genotype: 'Aa',
      type: '杂合子',
      phenotype: '显性性状',
      description: '一个显性，一个隐性'
    },
    {
      genotype: 'aa',
      type: '纯合隐性',
      phenotype: '隐性性状',
      description: '两个隐性等位基因'
    }
  ];

  const mechanismSteps = [
    {
      title: '步骤1: 同源染色体配对',
      description: '在减数分裂前期I，同源染色体进行配对',
      showElements: ['chromosome-paternal', 'chromosome-maternal'],
      highlight: 'chromosome-paternal'
    },
    {
      title: '步骤2: 基因座上的等位基因',
      description: '同源染色体同一位置（基因座）上的等位基因决定性状',
      showElements: ['chromosome-paternal', 'chromosome-maternal', 'allele-A', 'allele-a'],
      highlight: 'allele-A'
    },
    {
      title: '步骤3: 减数分裂I - 同源染色体分离',
      description: '同源染色体分离，分别进入不同的子细胞',
      showElements: ['chromosome-paternal', 'chromosome-maternal', 'allele-A', 'allele-a', 'meiosis-I'],
      highlight: 'meiosis-I'
    },
    {
      title: '步骤4: 减数分裂II - 姐妹染色单体分离',
      description: '姐妹染色单体分离，形成单倍体配子',
      showElements: ['chromosome-paternal', 'chromosome-maternal', 'allele-A', 'allele-a', 'meiosis-I', 'meiosis-II'],
      highlight: 'meiosis-II'
    },
    {
      title: '步骤5: 配子形成完成',
      description: '形成具有单倍体染色体的配子，准备受精',
      showElements: ['chromosome-paternal', 'chromosome-maternal', 'allele-A', 'allele-a', 'meiosis-I', 'meiosis-II', 'gamete-formation'],
      highlight: 'gamete-formation'
    },
  ];

  const getDefinitionContent = () => (
    <div style={{ position: 'relative', width: '100%', height: '450px' }}>
      <svg width="100%" height="100%" viewBox="0 0 800 450">
        <rect x="0" y="0" width="800" height="450" fill="#F5F5F5" rx="10" />
        <text x="400" y="40" fontSize="24" fontWeight="bold" fill="#333" textAnchor="middle">
          纯合子与杂合子
        </text>

        <g
          onMouseEnter={() => setHoveredElement('homozygous')}
          onMouseLeave={() => setHoveredElement(null)}
          style={{ cursor: 'pointer' }}
        >
          <rect x="50" y="80" width="220" height="320" rx="10" fill="white" stroke={c.homozygousDominant} strokeWidth="3" />
          <text x="160" y="110" fontSize="20" fontWeight="bold" fill="#2E7D32" textAnchor="middle">纯合子</text>
          <text x="160" y="135" fontSize="15" fill="#666" textAnchor="middle">(Homozygous)</text>

          <g transform="translate(70, 160)">
            <text x="0" y="15" fontSize="14" fontWeight="bold" fill="#333">定义:</text>
            <text x="0" y="40" fontSize="13" fill="#555">同源染色体同一</text>
            <text x="0" y="60" fontSize="13" fill="#555">基因座上具有</text>
            <text x="0" y="80" fontSize="13" fill="#555">相同的等位基因</text>
          </g>

          <line x1="70" y1="260" x2="250" y2="260" stroke="#ddd" strokeWidth="2" />

          <g transform="translate(70, 280)">
            <text x="0" y="15" fontSize="14" fontWeight="bold" fill="#333">类型:</text>
            
            <rect x="0" y="25" width="180" height="30" rx="5" fill="#C8E6C9" />
            <text x="90" y="45" fontSize="14" fontWeight="bold" fill="#2E7D32" textAnchor="middle">纯合显性 (AA)</text>

            <rect x="0" y="65" width="180" height="30" rx="5" fill="#FFCDD2" />
            <text x="90" y="85" fontSize="14" fontWeight="bold" fill="#C62828" textAnchor="middle">纯合隐性 (aa)</text>
          </g>

          {hoveredElement === 'homozygous' && (
            <foreignObject x="70" y="380" width="180" height="40">
              <div style={{
                backgroundColor: '#4CAF50',
                color: 'white',
                borderRadius: '6px',
                padding: '8px',
                fontSize: '11px',
                textAlign: 'center'
              }}>
                两个等位基因完全相同
              </div>
            </foreignObject>
          )}
        </g>

        <g
          onMouseEnter={() => setHoveredElement('heterozygous')}
          onMouseLeave={() => setHoveredElement(null)}
          style={{ cursor: 'pointer' }}
        >
          <rect x="290" y="80" width="220" height="320" rx="10" fill="white" stroke={c.heterozygous} strokeWidth="3" />
          <text x="400" y="110" fontSize="20" fontWeight="bold" fill="#E65100" textAnchor="middle">杂合子</text>
          <text x="400" y="135" fontSize="15" fill="#666" textAnchor="middle">(Heterozygous)</text>

          <g transform="translate(310, 160)">
            <text x="0" y="15" fontSize="14" fontWeight="bold" fill="#333">定义:</text>
            <text x="0" y="40" fontSize="13" fill="#555">同源染色体同一</text>
            <text x="0" y="60" fontSize="13" fill="#555">基因座上具有</text>
            <text x="0" y="80" fontSize="13" fill="#555">不同的等位基因</text>
          </g>

          <line x1="310" y1="260" x2="490" y2="260" stroke="#ddd" strokeWidth="2" />

          <g transform="translate(310, 280)">
            <text x="0" y="15" fontSize="14" fontWeight="bold" fill="#333">基因型:</text>
            
            <rect x="0" y="25" width="180" height="30" rx="5" fill="#FFF3E0" />
            <text x="90" y="45" fontSize="14" fontWeight="bold" fill="#E65100" textAnchor="middle">杂合子 (Aa)</text>
          </g>

          <g transform="translate(310, 345)">
            <text x="0" y="15" fontSize="13" fontWeight="bold" fill="#666">特点:</text>
            <text x="0" y="35" fontSize="12" fill="#555">• 显性基因表达</text>
            <text x="0" y="55" fontSize="12" fill="#555">• 携带隐性基因</text>
            <text x="0" y="75" fontSize="12" fill="#555">• 可遗传隐性</text>
          </g>

          {hoveredElement === 'heterozygous' && (
            <foreignObject x="310" y="380" width="180" height="40">
              <div style={{
                backgroundColor: '#FF9800',
                color: 'white',
                borderRadius: '6px',
                padding: '8px',
                fontSize: '11px',
                textAlign: 'center'
              }}>
                两个等位基因不同
              </div>
            </foreignObject>
          )}
        </g>

        <g>
          <rect x="530" y="80" width="220" height="320" rx="10" fill="white" stroke="#9C27B0" strokeWidth="2" />
          <text x="640" y="110" fontSize="18" fontWeight="bold" fill="#6A1B9A" textAnchor="middle">比较</text>

          <g transform="translate(550, 150)">
            <text x="0" y="15" fontSize="14" fontWeight="bold" fill="#333">基因型</text>
            <text x="0" y="40" fontSize="13" fill="#2E7D32">AA / aa</text>
            <text x="0" y="65" fontSize="13" fill="#E65100">Aa</text>
          </g>

          <g transform="translate(550, 230)">
            <text x="0" y="15" fontSize="14" fontWeight="bold" fill="#333">等位基因</text>
            <text x="0" y="40" fontSize="13" fill="#2E7D32">相同</text>
            <text x="0" y="65" fontSize="13" fill="#E65100">不同</text>
          </g>

          <g transform="translate(550, 310)">
            <text x="0" y="15" fontSize="14" fontWeight="bold" fill="#333">配子类型</text>
            <text x="0" y="40" fontSize="13" fill="#2E7D32">1种</text>
            <text x="0" y="65" fontSize="13" fill="#E65100">2种</text>
          </g>

          <g transform="translate(550, 370)">
            <text x="0" y="15" fontSize="14" fontWeight="bold" fill="#333">遗传</text>
            <text x="0" y="40" fontSize="13" fill="#2E7D32">稳定</text>
            <text x="0" y="65" fontSize="13" fill="#E65100">分离</text>
          </g>
        </g>
      </svg>
    </div>
  );

  const getComparisonContent = () => (
    <div style={{ position: 'relative', width: '100%', height: '450px' }}>
      <svg width="100%" height="100%" viewBox="0 0 800 450">
        <rect x="0" y="0" width="800" height="450" fill="#F5F5F5" rx="10" />
        <text x="400" y="40" fontSize="24" fontWeight="bold" fill="#333" textAnchor="middle">
          染色体结构对比
        </text>

        <g
          onMouseEnter={() => setHoveredElement('homozygousAA')}
          onMouseLeave={() => setHoveredElement(null)}
          style={{ cursor: 'pointer' }}
        >
          <rect x="50" y="80" width="220" height="340" rx="10" fill="white" stroke={c.homozygousDominant} strokeWidth="3" />
          <text x="160" y="110" fontSize="18" fontWeight="bold" fill="#2E7D32" textAnchor="middle">纯合显性</text>
          <text x="160" y="135" fontSize="14" fill="#666" textAnchor="middle">(AA)</text>

          <g transform="translate(80, 160)">
            <g
              onMouseEnter={() => setHoveredElement('chromosome-paternal')}
              onMouseLeave={() => setHoveredElement(null)}
              style={{ cursor: 'pointer' }}
            >
              <rect x="0" y="0" width="160" height="35" rx="17" fill={c.chromosome1} opacity="0.4" stroke={c.chromosome1} strokeWidth="2" />
              <text x="80" y="23" fontSize="14" fill="#333" textAnchor="middle">来自父方</text>
              
              <g
                onMouseEnter={() => setHoveredElement('allele-A')}
                onMouseLeave={() => setHoveredElement(null)}
                style={{ cursor: 'pointer' }}
              >
                <ellipse cx="80" cy="55" rx="30" ry="20" fill={c.alleleA} opacity="0.7" />
                <text x="80" y="60" fontSize="18" fontWeight="bold" fill="#fff" textAnchor="middle">A</text>
              </g>
            </g>
          </g>

          <g transform="translate(80, 250)">
            <g
              onMouseEnter={() => setHoveredElement('chromosome-maternal')}
              onMouseLeave={() => setHoveredElement(null)}
              style={{ cursor: 'pointer' }}
            >
              <rect x="0" y="0" width="160" height="35" rx="17" fill={c.chromosome2} opacity="0.4" stroke={c.chromosome2} strokeWidth="2" />
              <text x="80" y="23" fontSize="14" fill="#333" textAnchor="middle">来自母方</text>
              
              <g
                onMouseEnter={() => setHoveredElement('allele-A')}
                onMouseLeave={() => setHoveredElement(null)}
                style={{ cursor: 'pointer' }}
              >
                <ellipse cx="80" cy="55" rx="30" ry="20" fill={c.alleleA} opacity="0.7" />
                <text x="80" y="60" fontSize="18" fontWeight="bold" fill="#fff" textAnchor="middle">A</text>
              </g>
            </g>
          </g>

          <line x1="80" y1="325" x2="240" y2="325" stroke="#ddd" strokeWidth="2" />
          
          <text x="160" y="355" fontSize="13" fontWeight="bold" fill="#2E7D32" textAnchor="middle">配子: A</text>
          <text x="160" y="380" fontSize="12" fill="#666" textAnchor="middle">只产生一种配子</text>
          <text x="160" y="405" fontSize="12" fill="#666" textAnchor="middle">后代基因型稳定</text>

          {hoveredElement === 'homozygousAA' && (
            <foreignObject x="80" y="415" width="160" height="35">
              <div style={{
                backgroundColor: '#4CAF50',
                color: 'white',
                borderRadius: '6px',
                padding: '6px',
                fontSize: '11px',
                textAlign: 'center'
              }}>
                两个显性等位基因
              </div>
            </foreignObject>
          )}
        </g>

        <g
          onMouseEnter={() => setHoveredElement('heterozygousAa')}
          onMouseLeave={() => setHoveredElement(null)}
          style={{ cursor: 'pointer' }}
        >
          <rect x="290" y="80" width="220" height="340" rx="10" fill="white" stroke={c.heterozygous} strokeWidth="3" />
          <text x="400" y="110" fontSize="18" fontWeight="bold" fill="#E65100" textAnchor="middle">杂合子</text>
          <text x="400" y="135" fontSize="14" fill="#666" textAnchor="middle">(Aa)</text>

          <g transform="translate(320, 160)">
            <g
              onMouseEnter={() => setHoveredElement('chromosome-paternal')}
              onMouseLeave={() => setHoveredElement(null)}
              style={{ cursor: 'pointer' }}
            >
              <rect x="0" y="0" width="160" height="35" rx="17" fill={c.chromosome1} opacity="0.4" stroke={c.chromosome1} strokeWidth="2" />
              <text x="80" y="23" fontSize="14" fill="#333" textAnchor="middle">来自父方</text>
              
              <g
                onMouseEnter={() => setHoveredElement('allele-A')}
                onMouseLeave={() => setHoveredElement(null)}
                style={{ cursor: 'pointer' }}
              >
                <ellipse cx="80" cy="55" rx="30" ry="20" fill={c.alleleA} opacity="0.7" />
                <text x="80" y="60" fontSize="18" fontWeight="bold" fill="#fff" textAnchor="middle">A</text>
              </g>
            </g>
          </g>

          <g transform="translate(320, 250)">
            <g
              onMouseEnter={() => setHoveredElement('chromosome-maternal')}
              onMouseLeave={() => setHoveredElement(null)}
              style={{ cursor: 'pointer' }}
            >
              <rect x="0" y="0" width="160" height="35" rx="17" fill={c.chromosome2} opacity="0.4" stroke={c.chromosome2} strokeWidth="2" />
              <text x="80" y="23" fontSize="14" fill="#333" textAnchor="middle">来自母方</text>
              
              <g
                onMouseEnter={() => setHoveredElement('allele-a')}
                onMouseLeave={() => setHoveredElement(null)}
                style={{ cursor: 'pointer' }}
              >
                <ellipse cx="80" cy="55" rx="30" ry="20" fill={c.allelea} opacity="0.7" />
                <text x="80" y="60" fontSize="18" fontWeight="bold" fill="#fff" textAnchor="middle">a</text>
              </g>
            </g>
          </g>

          <line x1="320" y1="325" x2="480" y2="325" stroke="#ddd" strokeWidth="2" />
          
          <text x="400" y="355" fontSize="13" fontWeight="bold" fill="#E65100" textAnchor="middle">配子: A 或 a</text>
          <text x="400" y="380" fontSize="12" fill="#666" textAnchor="middle">产生两种配子</text>
          <text x="400" y="405" fontSize="12" fill="#666" textAnchor="middle">基因型分离(孟德尔)</text>

          {hoveredElement === 'heterozygousAa' && (
            <foreignObject x="320" y="415" width="160" height="35">
              <div style={{
                backgroundColor: '#FF9800',
                color: 'white',
                borderRadius: '6px',
                padding: '6px',
                fontSize: '11px',
                textAlign: 'center'
              }}>
                一个显性，一个隐性
              </div>
            </foreignObject>
          )}
        </g>

        <g
          onMouseEnter={() => setHoveredElement('homozygousaa')}
          onMouseLeave={() => setHoveredElement(null)}
          style={{ cursor: 'pointer' }}
        >
          <rect x="530" y="80" width="220" height="340" rx="10" fill="white" stroke={c.homozygousRecessive} strokeWidth="3" />
          <text x="640" y="110" fontSize="18" fontWeight="bold" fill="#C62828" textAnchor="middle">纯合隐性</text>
          <text x="640" y="135" fontSize="14" fill="#666" textAnchor="middle">(aa)</text>

          <g transform="translate(560, 160)">
            <g
              onMouseEnter={() => setHoveredElement('chromosome-paternal')}
              onMouseLeave={() => setHoveredElement(null)}
              style={{ cursor: 'pointer' }}
            >
              <rect x="0" y="0" width="160" height="35" rx="17" fill={c.chromosome1} opacity="0.4" stroke={c.chromosome1} strokeWidth="2" />
              <text x="80" y="23" fontSize="14" fill="#333" textAnchor="middle">来自父方</text>
              
              <g
                onMouseEnter={() => setHoveredElement('allele-a')}
                onMouseLeave={() => setHoveredElement(null)}
                style={{ cursor: 'pointer' }}
              >
                <ellipse cx="80" cy="55" rx="30" ry="20" fill={c.allelea} opacity="0.7" />
                <text x="80" y="60" fontSize="18" fontWeight="bold" fill="#fff" textAnchor="middle">a</text>
              </g>
            </g>
          </g>

          <g transform="translate(560, 250)">
            <g
              onMouseEnter={() => setHoveredElement('chromosome-maternal')}
              onMouseLeave={() => setHoveredElement(null)}
              style={{ cursor: 'pointer' }}
            >
              <rect x="0" y="0" width="160" height="35" rx="17" fill={c.chromosome2} opacity="0.4" stroke={c.chromosome2} strokeWidth="2" />
              <text x="80" y="23" fontSize="14" fill="#333" textAnchor="middle">来自母方</text>
              
              <g
                onMouseEnter={() => setHoveredElement('allele-a')}
                onMouseLeave={() => setHoveredElement(null)}
                style={{ cursor: 'pointer' }}
              >
                <ellipse cx="80" cy="55" rx="30" ry="20" fill={c.allelea} opacity="0.7" />
                <text x="80" y="60" fontSize="18" fontWeight="bold" fill="#fff" textAnchor="middle">a</text>
              </g>
            </g>
          </g>

          <line x1="560" y1="325" x2="720" y2="325" stroke="#ddd" strokeWidth="2" />
          
          <text x="640" y="355" fontSize="13" fontWeight="bold" fill="#C62828" textAnchor="middle">配子: a</text>
          <text x="640" y="380" fontSize="12" fill="#666" textAnchor="middle">只产生一种配子</text>
          <text x="640" y="405" fontSize="12" fill="#666" textAnchor="middle">后代基因型稳定</text>

          {hoveredElement === 'homozygousaa' && (
            <foreignObject x="560" y="415" width="160" height="35">
              <div style={{
                backgroundColor: '#F44336',
                color: 'white',
                borderRadius: '6px',
                padding: '6px',
                fontSize: '11px',
                textAlign: 'center'
              }}>
                两个隐性等位基因
              </div>
            </foreignObject>
          )}
        </g>

        {hoveredElement && getElementDetails(hoveredElement) && hoveredElement !== 'homozygousAA' && hoveredElement !== 'heterozygousAa' && hoveredElement !== 'homozygousaa' && (
          <foreignObject x="20" y="20" width="180" height="60">
            <div style={{
              backgroundColor: 'white',
              border: `2px solid ${hoveredElement === 'chromosome-paternal' ? c.chromosome1 : hoveredElement === 'chromosome-maternal' ? c.chromosome2 : hoveredElement === 'allele-A' ? c.alleleA : c.allelea}`,
              borderRadius: '8px',
              padding: '8px',
              fontSize: '11px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
            }}>
              <strong>{getElementDetails(hoveredElement).name}</strong>
              <p style={{ margin: '4px 0', color: '#666' }}>{getElementDetails(hoveredElement).description}</p>
              {getElementDetails(hoveredElement).details && (
                <p style={{ margin: '0', color: '#666', fontSize: '10px' }}>{getElementDetails(hoveredElement).details}</p>
              )}
            </div>
          </foreignObject>
        )}
      </svg>
    </div>
  );

  const getMechanismContent = () => (
    <div style={{ position: 'relative', width: '100%', height: '500px' }}>
      <svg width="100%" height="100%" viewBox="0 0 800 500">
        <rect x="0" y="0" width="800" height="500" fill="#F5F5F5" rx="10" />
        <text x="400" y="40" fontSize="24" fontWeight="bold" fill="#333" textAnchor="middle">
          减数分裂与配子形成过程
        </text>

        <div style={{ padding: '20px' }}>
          <div style={{ marginBottom: '20px' }}>
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                backgroundColor: currentStep === 0 ? '#ccc' : '#9C27B0',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                marginRight: '10px'
              }}
            >
              ← 上一步
            </button>
            <span style={{ fontSize: '14px', color: '#666' }}>
              步骤 {currentStep + 1} / {mechanismSteps.length}
            </span>
            <button
              onClick={() => setCurrentStep(Math.min(mechanismSteps.length - 1, currentStep + 1))}
              disabled={currentStep === mechanismSteps.length - 1}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                backgroundColor: currentStep === mechanismSteps.length - 1 ? '#ccc' : '#9C27B0',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: currentStep === mechanismSteps.length - 1 ? 'not-allowed' : 'pointer',
                marginLeft: '10px'
              }}
            >
              下一步 →
            </button>
          </div>

          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: 'white', borderRadius: '8px', border: '2px solid #9C27B0' }}>
            <h5 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: 'bold', color: '#6A1B9A' }}>
              {mechanismSteps[currentStep].title}
            </h5>
            <p style={{ margin: '0', fontSize: '14px', color: '#555' }}>
              {mechanismSteps[currentStep].description}
            </p>
          </div>

          <g transform="translate(50, 200)">
            <g
              onMouseEnter={() => setHoveredElement('chromosome-paternal')}
              onMouseLeave={() => setHoveredElement(null)}
              style={{ cursor: 'pointer', opacity: mechanismSteps[currentStep].showElements.includes('chromosome-paternal') ? 1 : 0.3 }}
            >
              <rect x="0" y="0" width="180" height="40" rx="20" fill={c.chromosome1} opacity="0.4" stroke={c.chromosome1} strokeWidth="2" />
              <text x="90" y="25" fontSize="14" fill="#333" textAnchor="middle">父方染色体</text>
              
              <g
                onMouseEnter={() => setHoveredElement('allele-A')}
                onMouseLeave={() => setHoveredElement(null)}
                style={{ cursor: 'pointer', opacity: mechanismSteps[currentStep].showElements.includes('allele-A') ? 1 : 0.3 }}
              >
                <ellipse cx="90" cy="65" rx="35" ry="22" fill={c.alleleA} opacity="0.7" />
                <text x="90" y="70" fontSize="20" fontWeight="bold" fill="#fff" textAnchor="middle">A</text>
              </g>
            </g>
          </g>

          <g transform="translate(310, 200)">
            <g
              onMouseEnter={() => setHoveredElement('chromosome-maternal')}
              onMouseLeave={() => setHoveredElement(null)}
              style={{ cursor: 'pointer', opacity: mechanismSteps[currentStep].showElements.includes('chromosome-maternal') ? 1 : 0.3 }}
            >
              <rect x="0" y="0" width="180" height="40" rx="20" fill={c.chromosome2} opacity="0.4" stroke={c.chromosome2} strokeWidth="2" />
              <text x="90" y="25" fontSize="14" fill="#333" textAnchor="middle">母方染色体</text>
              
              <g
                onMouseEnter={() => setHoveredElement('allele-a')}
                onMouseLeave={() => setHoveredElement(null)}
                style={{ cursor: 'pointer', opacity: mechanismSteps[currentStep].showElements.includes('allele-a') ? 1 : 0.3 }}
              >
                <ellipse cx="90" cy="65" rx="35" ry="22" fill={c.allelea} opacity="0.7" />
                <text x="90" y="70" fontSize="20" fontWeight="bold" fill="#fff" textAnchor="middle">a</text>
              </g>
            </g>
          </g>

          <g
            transform="translate(570, 200)"
            onMouseEnter={() => setHoveredElement('meiosis-I')}
            onMouseLeave={() => setHoveredElement(null)}
            style={{ cursor: 'pointer', opacity: mechanismSteps[currentStep].showElements.includes('meiosis-I') ? 1 : 0.3 }}
          >
            <rect x="0" y="0" width="180" height="120" rx="10" fill="#E1BEE7" stroke={mechanismSteps[currentStep].highlight === 'meiosis-I' ? '#9C27B0' : '#BA68C8'} strokeWidth={mechanismSteps[currentStep].highlight === 'meiosis-I' ? 3 : 2} />
            <text x="90" y="30" fontSize="14" fontWeight="bold" fill="#6A1B9A" textAnchor="middle">减数分裂I</text>
            <text x="90" y="55" fontSize="12" fill="#666" textAnchor="middle">同源染色体分离</text>
            <text x="90" y="80" fontSize="11" fill="#666" textAnchor="middle">染色体数目减半</text>
            <text x="90" y="100" fontSize="11" fill="#666" textAnchor="middle">形成2个子细胞</text>
          </g>

          <g
            transform="translate(50, 330)"
            onMouseEnter={() => setHoveredElement('meiosis-II')}
            onMouseLeave={() => setHoveredElement(null)}
            style={{ cursor: 'pointer', opacity: mechanismSteps[currentStep].showElements.includes('meiosis-II') ? 1 : 0.3 }}
          >
            <rect x="0" y="0" width="200" height="120" rx="10" fill="#F3E5F5" stroke={mechanismSteps[currentStep].highlight === 'meiosis-II' ? '#9C27B0' : '#BA68C8'} strokeWidth={mechanismSteps[currentStep].highlight === 'meiosis-II' ? 3 : 2} />
            <text x="100" y="30" fontSize="14" fontWeight="bold" fill="#6A1B9A" textAnchor="middle">减数分裂II</text>
            <text x="100" y="55" fontSize="12" fill="#666" textAnchor="middle">姐妹染色单体分离</text>
            <text x="100" y="80" fontSize="11" fill="#666" textAnchor="middle">形成4个单倍体配子</text>
            <text x="100" y="100" fontSize="11" fill="#666" textAnchor="middle">每个配子含1个等位基因</text>
          </g>

          <g
            transform="translate(300, 330)"
            onMouseEnter={() => setHoveredElement('gamete-formation')}
            onMouseLeave={() => setHoveredElement(null)}
            style={{ cursor: 'pointer', opacity: mechanismSteps[currentStep].showElements.includes('gamete-formation') ? 1 : 0.3 }}
          >
            <rect x="0" y="0" width="200" height="120" rx="10" fill="#FFF3E0" stroke={mechanismSteps[currentStep].highlight === 'gamete-formation' ? '#FF9800' : '#FFB74D'} strokeWidth={mechanismSteps[currentStep].highlight === 'gamete-formation' ? 3 : 2} />
            <text x="100" y="30" fontSize="14" fontWeight="bold" fill="#E65100" textAnchor="middle">配子形成完成</text>
            <text x="100" y="55" fontSize="12" fill="#666" textAnchor="middle">纯合子: 1种配子</text>
            <text x="100" y="80" fontSize="12" fill="#666" textAnchor="middle">杂合子: 2种配子</text>
            <text x="100" y="100" fontSize="11" fill="#666" textAnchor="middle">准备受精</text>
          </g>

          {hoveredElement && getElementDetails(hoveredElement) && (
            <foreignObject x="20" y="460" width="180" height="35">
              <div style={{
                backgroundColor: 'white',
                border: `2px solid ${hoveredElement === 'chromosome-paternal' ? c.chromosome1 : hoveredElement === 'chromosome-maternal' ? c.chromosome2 : hoveredElement === 'allele-A' ? c.alleleA : hoveredElement === 'allele-a' ? c.allelea : hoveredElement === 'meiosis-I' || hoveredElement === 'meiosis-II' ? '#9C27B0' : '#FF9800'}`,
                borderRadius: '8px',
                padding: '8px',
                fontSize: '11px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}>
                <strong>{getElementDetails(hoveredElement).name}</strong>
                <p style={{ margin: '4px 0', color: '#666' }}>{getElementDetails(hoveredElement).description}</p>
              </div>
            </foreignObject>
          )}
        </div>
      </svg>
    </div>
  );

  const getExamplesContent = () => (
    <div style={{ position: 'relative', width: '100%', height: '450px' }}>
      <svg width="100%" height="100%" viewBox="0 0 800 450">
        <rect x="0" y="0" width="800" height="450" fill="#F5F5F5" rx="10" />
        <text x="400" y="40" fontSize="24" fontWeight="bold" fill="#333" textAnchor="middle">
          实例分析
        </text>

        {genotypeExamples.map((example, index) => {
          const bgColor = index === 0 ? '#C8E6C9' : index === 1 ? '#FFF3E0' : '#FFCDD2';
          const strokeColor = index === 0 ? '#4CAF50' : index === 1 ? '#FF9800' : '#F44336';
          const textColor = index === 0 ? '#2E7D32' : index === 1 ? '#E65100' : '#C62828';
          
          return (
            <g key={index} transform={`translate(30, ${80 + index * 120})`}>
              <rect x="0" y="0" width="740" height="110" rx="10" fill="white" stroke="#ddd" strokeWidth="2" />
              
              <g transform="translate(20, 20)">
                <rect x="0" y="0" width="100" height="70" rx="10" fill={bgColor} stroke={strokeColor} strokeWidth="3" />
                <text x="50" y="45" fontSize="32" fontWeight="bold" fill={textColor} textAnchor="middle">{example.genotype}</text>
              </g>

              <g transform="translate(140, 20)">
                <text x="0" y="15" fontSize="14" fontWeight="bold" fill="#666">类型:</text>
                <text x="0" y="40" fontSize="16" fill={textColor} fontWeight="bold">{example.type}</text>
                <text x="0" y="65" fontSize="13" fill="#555">{example.description}</text>
              </g>

              <g transform="translate(300, 20)">
                <text x="0" y="15" fontSize="14" fontWeight="bold" fill="#666">表现型:</text>
                <rect x="0" y="25" width="150" height="30" rx="5" fill="#E3F2FD" />
                <text x="75" y="45" fontSize="14" fill="#1565C0" textAnchor="middle">{example.phenotype}</text>
              </g>

              <g transform="translate(470, 20)">
                <text x="0" y="15" fontSize="14" fontWeight="bold" fill="#666">配子:</text>
                {index === 0 && (
                  <>
                    <rect x="0" y="25" width="50" height="30" rx="5" fill="#C8E6C9" stroke="#4CAF50" strokeWidth="1" />
                    <text x="25" y="45" fontSize="16" fontWeight="bold" fill="#2E7D32" textAnchor="middle">A</text>
                  </>
                )}
                {index === 1 && (
                  <>
                    <rect x="0" y="25" width="50" height="30" rx="5" fill="#C8E6C9" stroke="#4CAF50" strokeWidth="1" />
                    <text x="25" y="45" fontSize="16" fontWeight="bold" fill="#2E7D32" textAnchor="middle">A</text>
                    <text x="60" y="45" fontSize="20" fontWeight="bold" fill="#666">+</text>
                    <rect x="80" y="25" width="50" height="30" rx="5" fill="#FFCDD2" stroke="#F44336" strokeWidth="1" />
                    <text x="105" y="45" fontSize="16" fontWeight="bold" fill="#C62828" textAnchor="middle">a</text>
                  </>
                )}
                {index === 2 && (
                  <>
                    <rect x="0" y="25" width="50" height="30" rx="5" fill="#FFCDD2" stroke="#F44336" strokeWidth="1" />
                    <text x="25" y="45" fontSize="16" fontWeight="bold" fill="#C62828" textAnchor="middle">a</text>
                  </>
                )}
              </g>

              <g transform="translate(650, 20)">
                <text x="0" y="15" fontSize="14" fontWeight="bold" fill="#666">稳定性:</text>
                <text x="0" y="45" fontSize="14" fill={index === 1 ? '#E65100' : '#4CAF50'} fontWeight="bold">
                  {index === 1 ? '分离' : '稳定'}
                </text>
              </g>
            </g>
          );
        })}

        <rect x="620" y="80" width="150" height="80" rx="10" fill="#FFF3E0" stroke="#FF9800" strokeWidth="2" />
        <text x="695" y="105" fontSize="14" fontWeight="bold" fill="#E65100" textAnchor="middle">关键提示</text>
        <text x="630" y="125" fontSize="11" fill="#555">杂合子Aa自交</text>
        <text x="630" y="145" fontSize="11" fill="#555">后代:</text>
        <text x="630" y="165" fontSize="11" fill="#555">AA(1):Aa(2):aa(1)</text>
      </svg>
    </div>
  );

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #e0e0e0', paddingBottom: '10px' }}>
        <button
          onClick={() => { setActiveTab('definition'); setCurrentStep(0); }}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            fontWeight: activeTab === 'definition' ? 'bold' : 'normal',
            backgroundColor: activeTab === 'definition' ? '#4CAF50' : '#f5f5f5',
            color: activeTab === 'definition' ? 'white' : '#333',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          定义
        </button>
        <button
          onClick={() => { setActiveTab('comparison'); setCurrentStep(0); }}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            fontWeight: activeTab === 'comparison' ? 'bold' : 'normal',
            backgroundColor: activeTab === 'comparison' ? '#FF9800' : '#f5f5f5',
            color: activeTab === 'comparison' ? 'white' : '#333',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          染色体对比
        </button>
        <button
          onClick={() => { setActiveTab('mechanism'); setCurrentStep(0); }}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            fontWeight: activeTab === 'mechanism' ? 'bold' : 'normal',
            backgroundColor: activeTab === 'mechanism' ? '#9C27B0' : '#f5f5f5',
            color: activeTab === 'mechanism' ? 'white' : '#333',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          减数分裂机制
        </button>
        <button
          onClick={() => { setActiveTab('examples'); setCurrentStep(0); }}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            fontWeight: activeTab === 'examples' ? 'bold' : 'normal',
            backgroundColor: activeTab === 'examples' ? '#2196F3' : '#f5f5f5',
            color: activeTab === 'examples' ? 'white' : '#333',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          实例
        </button>
      </div>

      {activeTab === 'definition' && getDefinitionContent()}
      {activeTab === 'comparison' && getComparisonContent()}
      {activeTab === 'mechanism' && getMechanismContent()}
      {activeTab === 'examples' && getExamplesContent()}

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#333' }}>纯合子与杂合子说明</h4>
        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: '#555', lineHeight: '1.8' }}>
          <li><strong>纯合子:</strong> 同源染色体同一基因座上具有相同的等位基因（AA或aa）</li>
          <li><strong>杂合子:</strong> 同源染色体同一基因座上具有不同的等位基因（Aa）</li>
          <li><strong>配子:</strong> 纯合子产生1种配子，杂合子产生2种配子</li>
          <li><strong>遗传:</strong> 杂合子自交后代会出现性状分离（孟德尔第一定律）</li>
        </ul>
      </div>
    </div>
  );
}
