import { useState } from 'react';
import { VisualizationColors } from '../../constants/visualization-colors';

interface AlleleVisualizationProps {
  colors?: Record<string, string>;
}

interface GeneExample {
  gene: string;
  alleles: string[];
  phenotype: string;
  description: string;
}

export function AlleleVisualization({ colors }: AlleleVisualizationProps) {
  const [activeTab, setActiveTab] = useState<'definition' | 'types' | 'examples'>('definition');
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);

  const defaultColors = {
    chromosome1: VisualizationColors.chromosome1,
    chromosome2: VisualizationColors.chromosome2,
    alleleA: VisualizationColors.dominant,
    allelea: VisualizationColors.affected,
    locus: VisualizationColors.locus,
    gene: VisualizationColors.gene,
    highlight: VisualizationColors.hover,
  };

  const c = colors || defaultColors;

  const geneExamples: GeneExample[] = [
    {
      gene: '花色',
      alleles: ['A (红色)', 'a (白色)'],
      phenotype: 'AA-红色, Aa-红色, aa-白色',
      description: 'A是显性等位基因，a是隐性等位基因'
    },
    {
      gene: '血型',
      alleles: ['IA', 'IB', 'i'],
      phenotype: 'IAIA/A型, IBIB/B型, IAIB/AB型, ii/O型',
      description: 'IA和IB为共显性，i为隐性'
    },
    {
      gene: '豌豆形状',
      alleles: ['R (圆粒)', 'r (皱粒)'],
      phenotype: 'RR-圆粒, Rr-圆粒, rr-皱粒',
      description: '孟德尔第一定律的经典例子'
    }
  ];

  const getDefinitionContent = () => (
    <div style={{ position: 'relative', width: '100%', height: '420px' }}>
      <svg width="100%" height="100%" viewBox="0 0 800 420">
        <defs>
          <marker id="arrowDef" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
          </marker>
        </defs>

        <rect x="0" y="0" width="800" height="420" fill="#F5F5F5" rx="10" />
        <text x="400" y="40" fontSize="24" fontWeight="bold" fill="#333" textAnchor="middle">
          等位基因 (Allele)
        </text>

        <g
          onMouseEnter={() => setHoveredElement('chromosomePair')}
          onMouseLeave={() => setHoveredElement(null)}
          style={{ cursor: 'pointer' }}
        >
          <text x="150" y="90" fontSize="18" fontWeight="bold" fill="#666">同源染色体对</text>
          
          <g transform="translate(100, 110)">
            <rect x="0" y="0" width="150" height="40" rx="20" fill={c.chromosome1} opacity="0.4" stroke={c.chromosome1} strokeWidth="3" />
            <text x="75" y="27" fontSize="16" fontWeight="bold" fill="#333" textAnchor="middle">来自父亲</text>
            <text x="75" y="55" fontSize="14" fill="#666" textAnchor="middle">同源染色体 1</text>
          </g>

          <g transform="translate(100, 175)">
            <rect x="0" y="0" width="150" height="40" rx="20" fill={c.chromosome2} opacity="0.4" stroke={c.chromosome2} strokeWidth="3" />
            <text x="75" y="27" fontSize="16" fontWeight="bold" fill="#333" textAnchor="middle">来自母亲</text>
            <text x="75" y="55" fontSize="14" fill="#666" textAnchor="middle">同源染色体 2</text>
          </g>

          {hoveredElement === 'chromosomePair' && (
            <foreignObject x="80" y="250" width="190" height="80">
              <div style={{
                backgroundColor: 'white',
                border: '2px solid #9C27B0',
                borderRadius: '8px',
                padding: '10px',
                fontSize: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}>
                <strong>同源染色体:</strong> 一对形态大小相同的染色体
                <br />
                <strong>来源:</strong> 一条来自父方，一条来自母方
                <br />
                <strong>位置:</strong> 减数分裂时配对
              </div>
            </foreignObject>
          )}
        </g>

        <line x1="280" y1="150" x2="350" y2="150" stroke="#666" strokeWidth="2" markerEnd="url(#arrowDef)" />

        <g
          onMouseEnter={() => setHoveredElement('geneLocus')}
          onMouseLeave={() => setHoveredElement(null)}
          style={{ cursor: 'pointer' }}
        >
          <text x="475" y="90" fontSize="18" fontWeight="bold" fill="#666">基因座 (Locus)</text>
          
          <g transform="translate(360, 110)">
            <rect x="0" y="0" width="230" height="40" rx="20" fill={c.locus} opacity="0.3" stroke={c.locus} strokeWidth="3" />
            <text x="115" y="27" fontSize="16" fill="#333" textAnchor="middle">基因座</text>
          </g>

          <g transform="translate(370, 70)">
            <ellipse cx="60" cy="0" rx="25" ry="15" fill={c.alleleA} opacity="0.7" />
            <text x="60" y="5" fontSize="14" fontWeight="bold" fill="#fff" textAnchor="middle">A</text>
          </g>

          <g transform="translate(490, 70)">
            <ellipse cx="60" cy="0" rx="25" ry="15" fill={c.allelea} opacity="0.7" />
            <text x="60" y="5" fontSize="14" fontWeight="bold" fill="#fff" textAnchor="middle">a</text>
          </g>

          {hoveredElement === 'geneLocus' && (
            <foreignObject x="360" y="175" width="230" height="70">
              <div style={{
                backgroundColor: 'white',
                border: '2px solid #FF9800',
                borderRadius: '8px',
                padding: '10px',
                fontSize: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}>
                <strong>基因座:</strong> 染色体上基因的特定位置
                <br />
                <strong>等位基因:</strong> 同一基因座上的不同基因形式
                <br />
                <strong>例子:</strong> A 和 a 是等位基因
              </div>
            </foreignObject>
          )}
        </g>

        <line x1="475" y1="275" x2="475" y2="300" stroke="#666" strokeWidth="2" markerEnd="url(#arrowDef)" />

        <g
          onMouseEnter={() => setHoveredElement('genotype')}
          onMouseLeave={() => setHoveredElement(null)}
          style={{ cursor: 'pointer' }}
        >
          <rect x="360" y="310" width="230" height="60" rx="10" fill={c.gene} opacity="0.2" stroke={c.gene} strokeWidth="2" />
          <text x="475" y="335" fontSize="18" fontWeight="bold" fill="#1565C0" textAnchor="middle">基因型 (Genotype)</text>
          <text x="475" y="358" fontSize="14" fill="#333" textAnchor="middle">AA, Aa, aa</text>
          {hoveredElement === 'genotype' && (
            <foreignObject x="360" y="380" width="230" height="60">
              <div style={{
                backgroundColor: 'white',
                border: '2px solid #2196F3',
                borderRadius: '8px',
                padding: '10px',
                fontSize: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}>
                <strong>基因型:</strong> 个体的基因组成
                <br />
                <strong>表现型:</strong> 基因型决定的可观察特征
              </div>
            </foreignObject>
          )}
        </g>

        <rect x="620" y="110" width="170" height="100" rx="10" fill="white" stroke="#4CAF50" strokeWidth="2" />
        <text x="705" y="135" fontSize="14" fontWeight="bold" fill="#2E7D32" textAnchor="middle">关键概念</text>
        <text x="630" y="160" fontSize="12" fill="#555">• 等位基因位于</text>
        <text x="630" y="180" fontSize="12" fill="#555">  同一基因座</text>
        <text x="630" y="200" fontSize="12" fill="#555">• 二倍体个体有</text>
        <text x="630" y="220" fontSize="12" fill="#555">  两个等位基因</text>
      </svg>
    </div>
  );

  const getTypesContent = () => (
    <div style={{ position: 'relative', width: '100%', height: '420px' }}>
      <svg width="100%" height="100%" viewBox="0 0 800 420">
        <rect x="0" y="0" width="800" height="420" fill="#F5F5F5" rx="10" />
        <text x="400" y="40" fontSize="24" fontWeight="bold" fill="#333" textAnchor="middle">
          等位基因的类型
        </text>

        <g
          onMouseEnter={() => setHoveredElement('dominant')}
          onMouseLeave={() => setHoveredElement(null)}
          style={{ cursor: 'pointer' }}
        >
          <rect x="50" y="80" width="220" height="280" rx="10" fill="white" stroke={c.alleleA} strokeWidth="3" />
          <text x="160" y="110" fontSize="18" fontWeight="bold" fill="#2E7D32" textAnchor="middle">显性等位基因</text>
          <text x="160" y="135" fontSize="16" fill="#666" textAnchor="middle">(Dominant)</text>

          <circle cx="160" cy="180" r="35" fill={c.alleleA} opacity="0.7" />
          <text x="160" y="186" fontSize="24" fontWeight="bold" fill="#fff" textAnchor="middle">A</text>

          <text x="70" y="240" fontSize="14" fill="#333">• 在杂合状态下</text>
          <text x="70" y="265" fontSize="14" fill="#333">  完全表现其性状</text>
          <text x="70" y="290" fontSize="14" fill="#333">• 用大写字母表示</text>
          <text x="70" y="315" fontSize="14" fill="#333">• 如：A, B, C</text>

          {hoveredElement === 'dominant' && (
            <foreignObject x="70" y="370" width="180" height="40">
              <div style={{
                backgroundColor: '#4CAF50',
                color: 'white',
                borderRadius: '6px',
                padding: '8px',
                fontSize: '11px',
                textAlign: 'center'
              }}>
                Aa 中 A 为显性，表现 A 的性状
              </div>
            </foreignObject>
          )}
        </g>

        <g
          onMouseEnter={() => setHoveredElement('recessive')}
          onMouseLeave={() => setHoveredElement(null)}
          style={{ cursor: 'pointer' }}
        >
          <rect x="290" y="80" width="220" height="280" rx="10" fill="white" stroke={c.allelea} strokeWidth="3" />
          <text x="400" y="110" fontSize="18" fontWeight="bold" fill="#C62828" textAnchor="middle">隐性等位基因</text>
          <text x="400" y="135" fontSize="16" fill="#666" textAnchor="middle">(Recessive)</text>

          <circle cx="400" cy="180" r="35" fill={c.allelea} opacity="0.7" />
          <text x="400" y="186" fontSize="24" fontWeight="bold" fill="#fff" textAnchor="middle">a</text>

          <text x="310" y="240" fontSize="14" fill="#333">• 只在纯合状态下</text>
          <text x="310" y="265" fontSize="14" fill="#333">  表现其性状</text>
          <text x="310" y="290" fontSize="14" fill="#333">• 用小写字母表示</text>
          <text x="310" y="315" fontSize="14" fill="#333">• 如：a, b, c</text>

          {hoveredElement === 'recessive' && (
            <foreignObject x="310" y="370" width="180" height="40">
              <div style={{
                backgroundColor: '#F44336',
                color: 'white',
                borderRadius: '6px',
                padding: '8px',
                fontSize: '11px',
                textAlign: 'center'
              }}>
                Aa 中 a 为隐性，不表现
              </div>
            </foreignObject>
          )}
        </g>

        <g
          onMouseEnter={() => setHoveredElement('codominant')}
          onMouseLeave={() => setHoveredElement(null)}
          style={{ cursor: 'pointer' }}
        >
          <rect x="530" y="80" width="220" height="280" rx="10" fill="white" stroke="#FF9800" strokeWidth="3" />
          <text x="640" y="110" fontSize="18" fontWeight="bold" fill="#E65100" textAnchor="middle">共显性</text>
          <text x="640" y="135" fontSize="16" fill="#666" textAnchor="middle">(Codominant)</text>

          <g>
            <circle cx="620" cy="180" r="20" fill={c.alleleA} opacity="0.7" />
            <text x="620" y="185" fontSize="16" fontWeight="bold" fill="#fff" textAnchor="middle">IA</text>
          </g>

          <text x="640" y="185" fontSize="20" fontWeight="bold" fill="#333">+</text>

          <g>
            <circle cx="660" cy="180" r="20" fill="#1565C0" opacity="0.7" />
            <text x="660" y="185" fontSize="16" fontWeight="bold" fill="#fff" textAnchor="middle">IB</text>
          </g>

          <text x="640" y="230" fontSize="14" fontWeight="bold" fill="#E65100" textAnchor="middle">AB 血型</text>

          <text x="550" y="260" fontSize="14" fill="#333">• 两个等位基因</text>
          <text x="550" y="285" fontSize="14" fill="#333">  都同时表现</text>
          <text x="550" y="310" fontSize="14" fill="#333">• 无显隐性之分</text>

          {hoveredElement === 'codominant' && (
            <foreignObject x="550" y="370" width="180" height="40">
              <div style={{
                backgroundColor: '#FF9800',
                color: 'white',
                borderRadius: '6px',
                padding: '8px',
                fontSize: '11px',
                textAlign: 'center'
              }}>
                IAIB 同时表现 A 和 B 抗原
              </div>
            </foreignObject>
          )}
        </g>
      </svg>
    </div>
  );

  const getExamplesContent = () => (
    <div style={{ position: 'relative', width: '100%', height: '420px' }}>
      <svg width="100%" height="100%" viewBox="0 0 800 420">
        <rect x="0" y="0" width="800" height="420" fill="#F5F5F5" rx="10" />
        <text x="400" y="40" fontSize="24" fontWeight="bold" fill="#333" textAnchor="middle">
          等位基因实例
        </text>

        {geneExamples.map((example, index) => (
          <g key={index} transform={`translate(30, ${80 + index * 110})`}>
            <rect x="0" y="0" width="740" height="100" rx="10" fill="white" stroke="#ddd" strokeWidth="2" />
            
            <text x="20" y="30" fontSize="18" fontWeight="bold" fill="#333">{example.gene}</text>
            <text x="20" y="55" fontSize="13" fill="#666">{example.description}</text>

            <g transform="translate(200, 20)">
              <text x="0" y="15" fontSize="14" fontWeight="bold" fill="#666">等位基因:</text>
              {example.alleles.map((_, i) => (
                <rect key={i} x={i * 120} y="25" width="110" height="30" rx="5" fill="#E3F2FD" stroke="#2196F3" strokeWidth="1" />
              ))}
              {example.alleles.map((allele, i) => (
                <text key={i} x={i * 120 + 55} y="45" fontSize="12" fill="#1565C0" textAnchor="middle">{allele}</text>
              ))}
            </g>

            <g transform="translate(500, 20)">
              <text x="0" y="15" fontSize="14" fontWeight="bold" fill="#666">表现型:</text>
              <rect x="0" y="25" width="220" height="30" rx="5" fill="#FFF3E0" stroke="#FF9800" strokeWidth="1" />
              <text x="110" y="45" fontSize="12" fill="#E65100" textAnchor="middle">{example.phenotype}</text>
            </g>

            <g transform="translate(200, 70)">
              <text x="0" y="15" fontSize="14" fontWeight="bold" fill="#666">基因型:</text>
              {index === 0 && (
                <>
                  <rect x="60" y="0" width="35" height="25" rx="5" fill="#C8E6C9" stroke="#4CAF50" strokeWidth="1" />
                  <text x="77" y="17" fontSize="13" fontWeight="bold" fill="#2E7D32" textAnchor="middle">AA</text>
                  <rect x="105" y="0" width="35" height="25" rx="5" fill="#C8E6C9" stroke="#4CAF50" strokeWidth="1" />
                  <text x="122" y="17" fontSize="13" fontWeight="bold" fill="#2E7D32" textAnchor="middle">Aa</text>
                  <rect x="150" y="0" width="35" height="25" rx="5" fill="#FFCDD2" stroke="#F44336" strokeWidth="1" />
                  <text x="167" y="17" fontSize="13" fontWeight="bold" fill="#C62828" textAnchor="middle">aa</text>
                </>
              )}
              {index === 1 && (
                <>
                  <rect x="60" y="0" width="35" height="25" rx="5" fill="#C8E6C9" stroke="#4CAF50" strokeWidth="1" />
                  <text x="77" y="17" fontSize="12" fontWeight="bold" fill="#2E7D32" textAnchor="middle">IAIA</text>
                  <rect x="105" y="0" width="35" height="25" rx="5" fill="#C8E6C9" stroke="#4CAF50" strokeWidth="1" />
                  <text x="122" y="17" fontSize="12" fontWeight="bold" fill="#2E7D32" textAnchor="middle">IBIB</text>
                  <rect x="150" y="0" width="35" height="25" rx="5" fill="#BBDEFB" stroke="#2196F3" strokeWidth="1" />
                  <text x="167" y="17" fontSize="12" fontWeight="bold" fill="#1565C0" textAnchor="middle">IAIB</text>
                  <rect x="195" y="0" width="35" height="25" rx="5" fill="#FFCDD2" stroke="#F44336" strokeWidth="1" />
                  <text x="212" y="17" fontSize="12" fontWeight="bold" fill="#C62828" textAnchor="middle">ii</text>
                </>
              )}
              {index === 2 && (
                <>
                  <rect x="60" y="0" width="35" height="25" rx="5" fill="#C8E6C9" stroke="#4CAF50" strokeWidth="1" />
                  <text x="77" y="17" fontSize="13" fontWeight="bold" fill="#2E7D32" textAnchor="middle">RR</text>
                  <rect x="105" y="0" width="35" height="25" rx="5" fill="#C8E6C9" stroke="#4CAF50" strokeWidth="1" />
                  <text x="122" y="17" fontSize="13" fontWeight="bold" fill="#2E7D32" textAnchor="middle">Rr</text>
                  <rect x="150" y="0" width="35" height="25" rx="5" fill="#FFCDD2" stroke="#F44336" strokeWidth="1" />
                  <text x="167" y="17" fontSize="13" fontWeight="bold" fill="#C62828" textAnchor="middle">rr</text>
                </>
              )}
            </g>
          </g>
        ))}
      </svg>
    </div>
  );

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #e0e0e0', paddingBottom: '10px' }}>
        <button
          onClick={() => setActiveTab('definition')}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            fontWeight: activeTab === 'definition' ? 'bold' : 'normal',
            backgroundColor: activeTab === 'definition' ? '#2196F3' : '#f5f5f5',
            color: activeTab === 'definition' ? 'white' : '#333',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          定义
        </button>
        <button
          onClick={() => setActiveTab('types')}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            fontWeight: activeTab === 'types' ? 'bold' : 'normal',
            backgroundColor: activeTab === 'types' ? '#2196F3' : '#f5f5f5',
            color: activeTab === 'types' ? 'white' : '#333',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          类型
        </button>
        <button
          onClick={() => setActiveTab('examples')}
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
      {activeTab === 'types' && getTypesContent()}
      {activeTab === 'examples' && getExamplesContent()}

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#333' }}>等位基因说明</h4>
        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: '#555', lineHeight: '1.8' }}>
          <li><strong>定义:</strong> 位于同源染色体同一基因座上的不同基因形式</li>
          <li><strong>来源:</strong> 一条来自父方，一条来自母方</li>
          <li><strong>类型:</strong> 显性、隐性、共显性、不完全显性等</li>
          <li><strong>作用:</strong> 决定个体的基因型和表现型</li>
        </ul>
      </div>
    </div>
  );
}
