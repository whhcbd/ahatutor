import React, { useState } from 'react';

interface CentralDogmaVisualizationProps {
  data?: Record<string, unknown>;
  colors?: Record<string, string>;
}

interface FlowPath {
  from: string;
  to: string;
  label: string;
  description: string;
  examples?: string;
}

interface Molecule {
  name: string;
  structure: string;
  location: string;
  role: string;
}

export function CentralDogmaVisualization({ colors }: CentralDogmaVisualizationProps) {
  const [activeTab, setActiveTab] = useState<'classic' | 'reverse' | 'rna'>('classic');
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);

  const defaultColors = {
    dna: '#4CAF50',
    rna: '#2196F3',
    protein: '#F44336',
    nucleus: '#E8F5E9',
    cytoplasm: '#FFF3E0',
    arrow: '#FF9800',
    virus: '#9C27B0',
  };

  const c = colors || defaultColors;

  const classicFlow: FlowPath[] = [
    { from: 'DNA', to: 'RNA', label: '转录', description: '以DNA为模板合成RNA', examples: '在细胞核内进行' },
    { from: 'RNA', to: '蛋白质', label: '翻译', description: '以mRNA为模板合成蛋白质', examples: '在细胞质中核糖体上进行' },
  ];

  const reverseFlow: FlowPath[] = [
    { from: 'RNA', to: 'DNA', label: '逆转录', description: '以RNA为模板合成DNA', examples: 'HIV病毒、某些肿瘤病毒' },
  ];

  const rnaFlow: FlowPath[] = [
    { from: 'RNA', to: 'RNA', label: 'RNA复制', description: '以RNA为模板合成RNA', examples: '流感病毒、冠状病毒' },
  ];

  const molecules: Record<string, Molecule[]> = {
    DNA: [
      { name: '脱氧核糖核酸', structure: '双螺旋结构', location: '细胞核', role: '遗传信息存储' },
    ],
    RNA: [
      { name: '信使RNA (mRNA)', structure: '单链', location: '细胞核→细胞质', role: '携带遗传信息' },
      { name: '转运RNA (tRNA)', structure: '三叶草结构', location: '细胞质', role: '运输氨基酸' },
      { name: '核糖体RNA (rRNA)', structure: '与蛋白质结合', location: '核糖体', role: '核糖体组成' },
    ],
    蛋白质: [
      { name: '蛋白质', structure: '多肽链折叠', location: '细胞质/细胞膜', role: '执行生命功能' },
    ],
  };

  const getClassicContent = () => (
    <div style={{ position: 'relative', width: '100%', height: '400px' }}>
      <svg width="100%" height="100%" viewBox="0 0 800 400">
        <defs>
          <linearGradient id="dnaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#2E7D32', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#4CAF50', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="rnaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#1565C0', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#2196F3', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="proteinGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#C62828', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#F44336', stopOpacity: 1 }} />
          </linearGradient>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#FF9800" />
          </marker>
        </defs>

        <rect x="0" y="0" width="800" height="400" fill={c.nucleus || '#E8F5E9'} opacity="0.3" rx="10" />
        <text x="30" y="30" fontSize="18" fontWeight="bold" fill="#2E7D32">细胞核</text>

        <rect x="0" y="250" width="800" height="150" fill={c.cytoplasm || '#FFF3E0'} opacity="0.5" rx="0" ry="0" />
        <text x="30" y="280" fontSize="18" fontWeight="bold" fill="#E65100">细胞质</text>

        <g
          onMouseEnter={() => setHoveredElement('DNA')}
          onMouseLeave={() => setHoveredElement(null)}
          style={{ cursor: 'pointer' }}
        >
          <text x="150" y="100" fontSize="20" fontWeight="bold" fill="#1B5E20">DNA</text>
          <text x="130" y="130" fontSize="14" fill="#388E3C">脱氧核糖核酸</text>
          <path d="M 100 150 Q 120 130, 140 150 Q 160 170, 180 150 Q 200 130, 220 150" 
                stroke="#2E7D32" strokeWidth="4" fill="none" />
          <path d="M 100 150 Q 120 170, 140 150 Q 160 130, 180 150 Q 200 170, 220 150" 
                stroke="#4CAF50" strokeWidth="4" fill="none" />
          {hoveredElement === 'DNA' && (
            <foreignObject x="100" y="175" width="200" height="60">
              <div style={{
                backgroundColor: 'white',
                border: '2px solid #2E7D32',
                borderRadius: '8px',
                padding: '8px',
                fontSize: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}>
                <strong>结构:</strong> 双螺旋
                <br />
                <strong>位置:</strong> 细胞核
                <br />
                <strong>功能:</strong> 遗传信息存储
              </div>
            </foreignObject>
          )}
        </g>

        <g>
          <line x1="230" y1="180" x2="320" y2="180" 
                stroke={c.arrow || '#FF9800'} strokeWidth="4" 
                markerEnd="url(#arrowhead)" />
          <text x="250" y="170" fontSize="16" fontWeight="bold" fill={c.arrow || '#FF9800'}>转录</text>
        </g>

        <g
          onMouseEnter={() => setHoveredElement('RNA')}
          onMouseLeave={() => setHoveredElement(null)}
          style={{ cursor: 'pointer' }}
        >
          <text x="400" y="180" fontSize="20" fontWeight="bold" fill="#0D47A1">RNA</text>
          <text x="380" y="210" fontSize="14" fill="#1565C0">信使RNA (mRNA)</text>
          <path d="M 360 230 Q 380 210, 400 230 Q 420 250, 440 230" 
                stroke="#1565C0" strokeWidth="4" fill="none" />
          <text x="385" y="255" fontSize="12" fill="#1565C0">A</text>
          <text x="400" y="255" fontSize="12" fill="#1565C0">U</text>
          <text x="415" y="255" fontSize="12" fill="#1565C0">G</text>
          <text x="430" y="255" fontSize="12" fill="#1565C0">C</text>
          {hoveredElement === 'RNA' && (
            <foreignObject x="360" y="265" width="200" height="60">
              <div style={{
                backgroundColor: 'white',
                border: '2px solid #1565C0',
                borderRadius: '8px',
                padding: '8px',
                fontSize: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}>
                <strong>结构:</strong> 单链
                <br />
                <strong>位置:</strong> 细胞核→细胞质
                <br />
                <strong>功能:</strong> 携带遗传信息
              </div>
            </foreignObject>
          )}
        </g>

        <g>
          <line x1="450" y1="290" x2="540" y2="290" 
                stroke={c.arrow || '#FF9800'} strokeWidth="4" 
                markerEnd="url(#arrowhead)" />
          <text x="470" y="280" fontSize="16" fontWeight="bold" fill={c.arrow || '#FF9800'}>翻译</text>
        </g>

        <g
          onMouseEnter={() => setHoveredElement('protein')}
          onMouseLeave={() => setHoveredElement(null)}
          style={{ cursor: 'pointer' }}
        >
          <text x="620" y="310" fontSize="20" fontWeight="bold" fill="#B71C1C">蛋白质</text>
          <text x="580" y="340" fontSize="14" fill="#C62828">多肽链折叠</text>
          <circle cx="600" cy="370" r="20" fill="#F44336" opacity="0.7" />
          <circle cx="625" cy="360" r="18" fill="#EF5350" opacity="0.7" />
          <circle cx="650" cy="375" r="22" fill="#E53935" opacity="0.7" />
          <circle cx="635" cy="390" r="16" fill="#FFCDD2" opacity="0.7" />
          {hoveredElement === 'protein' && (
            <foreignObject x="580" y="315" width="160" height="40">
              <div style={{
                backgroundColor: 'white',
                border: '2px solid #C62828',
                borderRadius: '8px',
                padding: '6px',
                fontSize: '11px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}>
                <strong>位置:</strong> 细胞质/细胞膜
                <br />
                <strong>功能:</strong> 执行生命功能
              </div>
            </foreignObject>
          )}
        </g>

        <rect x="500" y="50" width="280" height="80" rx="8" fill="white" stroke="#4CAF50" strokeWidth="2" />
        <text x="520" y="75" fontSize="14" fontWeight="bold" fill="#2E7D32">经典中心法则</text>
        <text x="520" y="95" fontSize="12" fill="#555">DNA → RNA → 蛋白质</text>
        <text x="520" y="115" fontSize="11" fill="#777">遗传信息单向流动</text>
      </svg>
    </div>
  );

  const getReverseContent = () => (
    <div style={{ position: 'relative', width: '100%', height: '400px' }}>
      <svg width="100%" height="100%" viewBox="0 0 800 400">
        <defs>
          <linearGradient id="rnaGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#1565C0', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#2196F3', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="dnaGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#2E7D32', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#4CAF50', stopOpacity: 1 }} />
          </linearGradient>
          <marker id="arrowhead2" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#FF9800" />
          </marker>
        </defs>

        <rect x="0" y="0" width="800" height="400" fill={c.virus || '#F3E5F5'} opacity="0.3" rx="10" />
        <text x="30" y="35" fontSize="18" fontWeight="bold" fill="#6A1B9A">逆转录病毒</text>

        <g
          onMouseEnter={() => setHoveredElement('viralRNA')}
          onMouseLeave={() => setHoveredElement(null)}
          style={{ cursor: 'pointer' }}
        >
          <text x="150" y="150" fontSize="20" fontWeight="bold" fill="#1565C0">病毒RNA</text>
          <text x="120" y="180" fontSize="14" fill="#1976D2">单链RNA基因组</text>
          <path d="M 100 200 Q 120 180, 140 200 Q 160 220, 180 200 Q 200 180, 220 200" 
                stroke="#1565C0" strokeWidth="4" fill="none" />
          {hoveredElement === 'viralRNA' && (
            <foreignObject x="100" y="225" width="200" height="60">
              <div style={{
                backgroundColor: 'white',
                border: '2px solid #1565C0',
                borderRadius: '8px',
                padding: '8px',
                fontSize: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}>
                <strong>类型:</strong> 正链或负链RNA
                <br />
                <strong>例子:</strong> HIV、某些肿瘤病毒
                <br />
                <strong>特点:</strong> RNA作为遗传物质
              </div>
            </foreignObject>
          )}
        </g>

        <g>
          <line x1="230" y1="200" x2="350" y2="200" 
                stroke={c.arrow || '#FF9800'} strokeWidth="4" 
                markerEnd="url(#arrowhead2)" />
          <text x="260" y="190" fontSize="16" fontWeight="bold" fill={c.arrow || '#FF9800'}>逆转录</text>
        </g>

        <g
          onMouseEnter={() => setHoveredElement('reverseTranscriptase')}
          onMouseLeave={() => setHoveredElement(null)}
          style={{ cursor: 'pointer' }}
        >
          <ellipse cx="400" cy="200" rx="50" ry="40" fill="#9C27B0" opacity="0.3" />
          <text x="360" y="195" fontSize="13" fontWeight="bold" fill="#6A1B9A">逆转录酶</text>
          <text x="350" y="215" fontSize="11" fill="#7B1FA2">Reverse Transcriptase</text>
          {hoveredElement === 'reverseTranscriptase' && (
            <foreignObject x="340" y="250" width="150" height="50">
              <div style={{
                backgroundColor: 'white',
                border: '2px solid #6A1B9A',
                borderRadius: '8px',
                padding: '6px',
                fontSize: '11px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}>
                <strong>功能:</strong> RNA→DNA
                <br />
                <strong>特点:</strong> 无校正活性
              </div>
            </foreignObject>
          )}
        </g>

        <g>
          <line x1="460" y1="200" x2="550" y2="200" 
                stroke={c.arrow || '#FF9800'} strokeWidth="4" 
                markerEnd="url(#arrowhead2)" />
        </g>

        <g
          onMouseEnter={() => setHoveredElement('proviralDNA')}
          onMouseLeave={() => setHoveredElement(null)}
          style={{ cursor: 'pointer' }}
        >
          <text x="620" y="150" fontSize="20" fontWeight="bold" fill="#2E7D32">前病毒DNA</text>
          <text x="590" y="180" fontSize="14" fill="#388E3C">整合到宿主基因组</text>
          <path d="M 580 200 Q 600 180, 620 200 Q 640 220, 660 200 Q 680 180, 700 200" 
                stroke="#2E7D32" strokeWidth="4" fill="none" />
          <path d="M 580 200 Q 600 220, 620 200 Q 640 180, 660 200 Q 680 220, 700 200" 
                stroke="#4CAF50" strokeWidth="4" fill="none" />
          {hoveredElement === 'proviralDNA' && (
            <foreignObject x="580" y="225" width="180" height="60">
              <div style={{
                backgroundColor: 'white',
                border: '2px solid #2E7D32',
                borderRadius: '8px',
                padding: '8px',
                fontSize: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}>
                <strong>结构:</strong> 双螺旋DNA
                <br />
                <strong>位置:</strong> 宿主细胞核
                <br />
                <strong>功能:</strong> 持续感染
              </div>
            </foreignObject>
          )}
        </g>

        <rect x="250" y="300" width="300" height="80" rx="8" fill="white" stroke="#9C27B0" strokeWidth="2" />
        <text x="270" y="325" fontSize="14" fontWeight="bold" fill="#6A1B9A">逆转录过程</text>
        <text x="270" y="345" fontSize="12" fill="#555">RNA → DNA (逆转录)</text>
        <text x="270" y="365" fontSize="11" fill="#777">逆转录病毒的特殊机制</text>

        <g>
          <line x1="550" y1="250" x2="600" y2="280" stroke="#9C27B0" strokeWidth="2" strokeDasharray="5,5" />
          <text x="530" y="245" fontSize="11" fill="#6A1B9A">整合酶</text>
        </g>
      </svg>
    </div>
  );

  const getRnaContent = () => (
    <div style={{ position: 'relative', width: '100%', height: '400px' }}>
      <svg width="100%" height="100%" viewBox="0 0 800 400">
        <defs>
          <linearGradient id="rnaGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#1565C0', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#2196F3', stopOpacity: 1 }} />
          </linearGradient>
          <marker id="arrowhead3" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#FF9800" />
          </marker>
        </defs>

        <rect x="0" y="0" width="800" height="400" fill={c.virus || '#E3F2FD'} opacity="0.3" rx="10" />
        <text x="30" y="35" fontSize="18" fontWeight="bold" fill="#1565C0">RNA病毒</text>

        <g
          onMouseEnter={() => setHoveredElement('plusRNA')}
          onMouseLeave={() => setHoveredElement(null)}
          style={{ cursor: 'pointer' }}
        >
          <text x="150" y="120" fontSize="20" fontWeight="bold" fill="#1565C0">正链RNA</text>
          <text x="120" y="150" fontSize="14" fill="#1976D2">(+)-strand RNA</text>
          <text x="100" y="175" fontSize="12" fill="#555">可直接作为mRNA翻译</text>
          <path d="M 80 190 Q 100 170, 120 190 Q 140 210, 160 190 Q 180 170, 200 190" 
                stroke="#1565C0" strokeWidth="4" fill="none" />
          {hoveredElement === 'plusRNA' && (
            <foreignObject x="80" y="210" width="200" height="70">
              <div style={{
                backgroundColor: 'white',
                border: '2px solid #1565C0',
                borderRadius: '8px',
                padding: '8px',
                fontSize: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}>
                <strong>功能:</strong> 可直接翻译
                <br />
                <strong>例子:</strong> SARS-CoV-2、脊髓灰质炎病毒
                <br />
                <strong>特点:</strong> 感染性强
              </div>
            </foreignObject>
          )}
        </g>

        <g>
          <line x1="220" y1="190" x2="320" y2="190" 
                stroke={c.arrow || '#FF9800'} strokeWidth="4" 
                markerEnd="url(#arrowhead3)" />
          <text x="250" y="180" fontSize="14" fontWeight="bold" fill={c.arrow || '#FF9800'}>复制</text>
        </g>

        <g
          onMouseEnter={() => setHoveredElement('rnaReplicase')}
          onMouseLeave={() => setHoveredElement(null)}
          style={{ cursor: 'pointer' }}
        >
          <ellipse cx="370" cy="190" rx="45" ry="35" fill="#2196F3" opacity="0.3" />
          <text x="345" y="185" fontSize="12" fontWeight="bold" fill="#1565C0">RNA复制酶</text>
          <text x="335" y="205" fontSize="10" fill="#1976D2">RNA Replicase</text>
        </g>

        <g>
          <line x1="420" y1="190" x2="510" y2="190" 
                stroke={c.arrow || '#FF9800'} strokeWidth="4" 
                markerEnd="url(#arrowhead3)" />
        </g>

        <g
          onMouseEnter={() => setHoveredElement('minusRNA')}
          onMouseLeave={() => setHoveredElement(null)}
          style={{ cursor: 'pointer' }}
        >
          <text x="580" y="120" fontSize="20" fontWeight="bold" fill="#0D47A1">负链RNA</text>
          <text x="550" y="150" fontSize="14" fill="#1565C0">(-)-strand RNA</text>
          <text x="530" y="175" fontSize="12" fill="#555">作为模板合成正链</text>
          <path d="M 510 190 Q 530 170, 550 190 Q 570 210, 590 190 Q 610 170, 630 190" 
                stroke="#0D47A1" strokeWidth="4" fill="none" />
          {hoveredElement === 'minusRNA' && (
            <foreignObject x="510" y="210" width="200" height="70">
              <div style={{
                backgroundColor: 'white',
                border: '2px solid #0D47A1',
                borderRadius: '8px',
                padding: '8px',
                fontSize: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}>
                <strong>功能:</strong> 作为模板
                <br />
                <strong>例子:</strong> 流感病毒、狂犬病病毒
                <br />
                <strong>特点:</strong> 需携带复制酶
              </div>
            </foreignObject>
          )}
        </g>

        <g
          onMouseEnter={() => setHoveredElement('genomicRNA')}
          onMouseLeave={() => setHoveredElement(null)}
          style={{ cursor: 'pointer' }}
        >
          <text x="350" y="300" fontSize="20" fontWeight="bold" fill="#1565C0">基因组RNA</text>
          <text x="280" y="330" fontSize="14" fill="#1976D2">子代病毒RNA</text>
          <path d="M 250 350 Q 270 330, 290 350 Q 310 370, 330 350 Q 350 330, 370 350 Q 390 370, 410 350 Q 430 330, 450 350" 
                stroke="#1565C0" strokeWidth="4" fill="none" />
        </g>

        <g>
          <path d="M 300 220 Q 250 260, 300 300" stroke="#FF9800" strokeWidth="2" fill="none" strokeDasharray="5,5" markerEnd="url(#arrowhead3)" />
          <path d="M 450 220 Q 500 260, 450 300" stroke="#FF9800" strokeWidth="2" fill="none" strokeDasharray="5,5" markerEnd="url(#arrowhead3)" />
        </g>

        <rect x="480" y="320" width="280" height="70" rx="8" fill="white" stroke="#2196F3" strokeWidth="2" />
        <text x="500" y="345" fontSize="14" fontWeight="bold" fill="#1565C0">RNA复制过程</text>
        <text x="500" y="365" fontSize="12" fill="#555">RNA → RNA (自我复制)</text>
        <text x="500" y="380" fontSize="11" fill="#777">RNA病毒复制机制</text>
      </svg>
    </div>
  );

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #e0e0e0', paddingBottom: '10px' }}>
        <button
          onClick={() => setActiveTab('classic')}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            fontWeight: activeTab === 'classic' ? 'bold' : 'normal',
            backgroundColor: activeTab === 'classic' ? '#4CAF50' : '#f5f5f5',
            color: activeTab === 'classic' ? 'white' : '#333',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          经典中心法则
        </button>
        <button
          onClick={() => setActiveTab('reverse')}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            fontWeight: activeTab === 'reverse' ? 'bold' : 'normal',
            backgroundColor: activeTab === 'reverse' ? '#9C27B0' : '#f5f5f5',
            color: activeTab === 'reverse' ? 'white' : '#333',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          逆转录
        </button>
        <button
          onClick={() => setActiveTab('rna')}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            fontWeight: activeTab === 'rna' ? 'bold' : 'normal',
            backgroundColor: activeTab === 'rna' ? '#2196F3' : '#f5f5f5',
            color: activeTab === 'rna' ? 'white' : '#333',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          RNA复制
        </button>
      </div>

      {activeTab === 'classic' && getClassicContent()}
      {activeTab === 'reverse' && getReverseContent()}
      {activeTab === 'rna' && getRnaContent()}

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#333' }}>中心法则说明</h4>
        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: '#555', lineHeight: '1.8' }}>
          <li><strong>经典中心法则 (DNA→RNA→蛋白质):</strong> 遗传信息从DNA传递到RNA，再由RNA翻译成蛋白质，是生物遗传信息传递的基本规律</li>
          <li><strong>逆转录 (RNA→DNA):</strong> 某些病毒（如HIV）能以RNA为模板合成DNA，打破了中心法则的单向性</li>
          <li><strong>RNA复制 (RNA→RNA):</strong> RNA病毒能以RNA为模板合成新的RNA，实现自我复制</li>
        </ul>
      </div>
    </div>
  );
}
