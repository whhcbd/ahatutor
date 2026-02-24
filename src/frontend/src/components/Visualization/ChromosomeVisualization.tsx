import { useState } from 'react';
import { VisualizationColors } from '../../constants/visualization-colors';

interface ChromosomeVisualizationProps {
  data: any;
  colors?: Record<string, string>;
}

export function ChromosomeVisualization({ data, colors }: ChromosomeVisualizationProps) {
  const [activeTab, setActiveTab] = useState<'structure' | 'condensation' | 'types' | 'function'>('structure');
  const [currentStep, setCurrentStep] = useState(0);
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);

  const defaultColors = {
    chromatid1: colors?.chromatid1 || VisualizationColors.gene,
    chromatid2: colors?.chromatid2 || VisualizationColors.affected,
    centromere: colors?.centromere || VisualizationColors.hover,
    telomere: colors?.telomere || VisualizationColors.dominant,
    sisterChromatids: colors?.sisterChromatids || VisualizationColors.nodePrinciple,
  };

  const getElementDetails = (elementId: string) => {
    const elementMap: Record<string, { name: string; description: string; details?: string }> = {
      'chromatid1': {
        name: '姐妹染色单体1',
        description: 'DNA复制后产生的一条染色单体',
        details: '包含一条DNA双螺旋分子和组蛋白'
      },
      'chromatid2': {
        name: '姐妹染色单体2',
        description: 'DNA复制后产生的另一条染色单体',
        details: '与姐妹染色单体1完全相同'
      },
      'centromere': {
        name: '着丝粒',
        description: '姐妹染色单体的连接点',
        details: '纺锤丝附着处，调控染色体分离'
      },
      'telomere': {
        name: '端粒',
        description: '染色体末端的保护结构',
        details: '防止DNA降解，随细胞分裂逐渐缩短'
      },
      'sister-chromatids': {
        name: '姐妹染色单体',
        description: '由DNA复制产生的两条相同染色体',
        details: '通过着丝粒连接，在减数分裂后期分离'
      },
      'dna': {
        name: 'DNA',
        description: '染色体的主要成分',
        details: '与组蛋白结合形成染色质纤维'
      },
      'autosome': {
        name: '常染色体',
        description: '非性染色体，控制大多数遗传性状',
        details: '人类有22对，编号1-22'
      },
      'sex-chromosome': {
        name: '性染色体',
        description: '决定性别的染色体',
        details: 'XX为女性，XY为男性'
      },
      'chromatin': {
        name: '染色质',
        description: '间期DNA与蛋白质的复合物',
        details: '细胞分裂前期高度螺旋化形成染色体'
      },
      'histone': {
        name: '组蛋白',
        description: 'DNA包装的核心蛋白',
        details: '形成核小体结构'
      },
      'nucleosome': {
        name: '核小体',
        description: '染色质的基本单位',
        details: 'DNA缠绕在组蛋白核心上'
      },
      'chromosome-formation': {
        name: '染色体形成',
        description: '染色质高度螺旋化的过程',
        details: '便于细胞分裂时遗传物质的分配'
      },
    };
    return elementMap[elementId];
  };

  const condensationSteps = [
    {
      title: '步骤1: 染色质状态',
      description: '间期细胞核中，DNA以染色质形式存在，呈松散的纤维状',
      showElements: ['chromatin', 'histone'],
      highlight: 'chromatin'
    },
    {
      title: '步骤2: 核小体形成',
      description: 'DNA缠绕在组蛋白核心上，形成串珠状的核小体结构',
      showElements: ['chromatin', 'histone', 'nucleosome'],
      highlight: 'nucleosome'
    },
    {
      title: '步骤3: 染色质螺旋化',
      description: '核小体进一步螺旋、折叠，形成染色质纤维',
      showElements: ['chromatin', 'histone', 'nucleosome', 'dna'],
      highlight: 'dna'
    },
    {
      title: '步骤4: 姐妹染色单体形成',
      description: 'DNA复制后形成两条完全相同的姐妹染色单体，通过着丝粒连接',
      showElements: ['chromatin', 'histone', 'nucleosome', 'dna', 'chromatid1', 'chromatid2', 'centromere'],
      highlight: 'centromere'
    },
    {
      title: '步骤5: 染色体完全形成',
      description: '染色体高度螺旋化，形成紧凑的中期染色体结构，准备分离',
      showElements: ['chromatin', 'histone', 'nucleosome', 'dna', 'chromatid1', 'chromatid2', 'centromere', 'telomere', 'chromosome-formation'],
      highlight: 'chromosome-formation'
    },
  ];

  const functions = data?.functions || [
    { name: 'DNA包装', description: '保护DNA免受损伤，便于遗传物质分配' },
    { name: '基因携带', description: '携带和传递遗传信息' },
    { name: '细胞分裂', description: '确保遗传物质平均分配给子细胞' },
    { name: '基因表达', description: '通过染色质结构调控基因活性' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => { setActiveTab('structure'); setCurrentStep(0); }}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'structure'
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          染色体结构
        </button>
        <button
          onClick={() => { setActiveTab('condensation'); setCurrentStep(0); }}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'condensation'
              ? 'bg-purple-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          染色体形成
        </button>
        <button
          onClick={() => { setActiveTab('types'); setCurrentStep(0); }}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'types'
              ? 'bg-green-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          染色体类型
        </button>
        <button
          onClick={() => { setActiveTab('function'); setCurrentStep(0); }}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            activeTab === 'function'
              ? 'bg-orange-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          染色体功能
        </button>
      </div>

      {activeTab === 'structure' && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-blue-800">染色体结构</h3>
          
          <div className="flex justify-center">
            <svg width="650" height="400" viewBox="0 0 650 400">
              <defs>
                <pattern id="dna-stripe" patternUnits="userSpaceOnUse" width="8" height="8">
                  <path d="M0,4 Q4,0 8,4 T16,4" fill="none" stroke="#3B82F6" strokeWidth="1" opacity="0.3"/>
                </pattern>
              </defs>

              <text x="325" y="25" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1976D2">染色体结构示意图</text>

              <g transform="translate(175, 50)">
                <text x="150" y="15" textAnchor="middle" fontSize="12" fill="#666">中期染色体结构</text>
                
                <g transform="translate(30, 30)">
                  <g
                    onMouseEnter={() => setHoveredElement('chromatid1')}
                    onMouseLeave={() => setHoveredElement(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    <ellipse cx="120" cy="60" rx="25" ry="55" fill={defaultColors.chromatid1} fillOpacity="0.2" stroke={defaultColors.chromatid1} strokeWidth="2"/>
                    <text x="120" y="120" textAnchor="middle" fontSize="10" fill={defaultColors.chromatid1}>姐妹染色单体1</text>
                    
                    <g
                      onMouseEnter={() => setHoveredElement('dna')}
                      onMouseLeave={() => setHoveredElement(null)}
                      style={{ cursor: 'pointer' }}
                    >
                      <rect x="110" y="20" width="80" height="40" fill="url(#dna-stripe)" stroke={defaultColors.chromatid1} strokeWidth="1" rx="2"/>
                      <text x="150" y="45" textAnchor="middle" fontSize="9" fill="#1976D2">DNA</text>
                    </g>
                  </g>
                  
                  <g
                    onMouseEnter={() => setHoveredElement('chromatid2')}
                    onMouseLeave={() => setHoveredElement(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    <ellipse cx="180" cy="60" rx="25" ry="55" fill={defaultColors.chromatid2} fillOpacity="0.2" stroke={defaultColors.chromatid2} strokeWidth="2"/>
                    <text x="180" y="120" textAnchor="middle" fontSize="10" fill={defaultColors.chromatid2}>姐妹染色单体2</text>
                    
                    <g
                      onMouseEnter={() => setHoveredElement('dna')}
                      onMouseLeave={() => setHoveredElement(null)}
                      style={{ cursor: 'pointer' }}
                    >
                      <rect x="130" y="20" width="80" height="40" fill="url(#dna-stripe)" stroke={defaultColors.chromatid2} strokeWidth="1" rx="2"/>
                      <text x="170" y="45" textAnchor="middle" fontSize="9" fill="#DC2626">DNA</text>
                    </g>
                  </g>
                  
                  <g
                    onMouseEnter={() => setHoveredElement('centromere')}
                    onMouseLeave={() => setHoveredElement(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    <circle cx="150" cy="60" r="15" fill={defaultColors.centromere} fillOpacity="0.3" stroke={defaultColors.centromere} strokeWidth="3"/>
                    <text x="150" y="65" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#B45309">着丝粒</text>
                  </g>
                  
                  <g
                    onMouseEnter={() => setHoveredElement('telomere')}
                    onMouseLeave={() => setHoveredElement(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    <circle cx="120" cy="15" r="8" fill={defaultColors.telomere} fillOpacity="0.3" stroke={defaultColors.telomere} strokeWidth="2"/>
                    <text x="120" y="8" textAnchor="middle" fontSize="8" fill="#059669">端粒</text>
                    
                    <circle cx="180" cy="15" r="8" fill={defaultColors.telomere} fillOpacity="0.3" stroke={defaultColors.telomere} strokeWidth="2"/>
                    <text x="180" y="8" textAnchor="middle" fontSize="8" fill="#059669">端粒</text>
                  </g>
                </g>
              </g>

              <g transform="translate(75, 220)">
                <text x="250" y="15" textAnchor="middle" fontSize="12" fill="#666">各部分功能</text>
                
                <g
                  onMouseEnter={() => setHoveredElement('sister-chromatids')}
                  onMouseLeave={() => setHoveredElement(null)}
                  style={{ cursor: 'pointer' }}
                  transform="translate(0, 30)"
                >
                  <rect x="0" y="0" width="150" height="60" fill="#E3F2FD" stroke={defaultColors.sisterChromatids} strokeWidth="2" rx="4"/>
                  <text x="75" y="25" textAnchor="middle" fontSize="12" fontWeight="bold" fill={defaultColors.sisterChromatids}>姐妹染色单体</text>
                  <text x="75" y="45" textAnchor="middle" fontSize="10" fill="#666">包含复制后的DNA</text>
                </g>
                
                <g
                  onMouseEnter={() => setHoveredElement('centromere')}
                  onMouseLeave={() => setHoveredElement(null)}
                  style={{ cursor: 'pointer' }}
                  transform="translate(170, 30)"
                >
                  <rect x="0" y="0" width="150" height="60" fill="#FFF3E0" stroke={defaultColors.centromere} strokeWidth="2" rx="4"/>
                  <text x="75" y="25" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#E65100">着丝粒</text>
                  <text x="75" y="45" textAnchor="middle" fontSize="10" fill="#666">纺锤丝附着点</text>
                </g>

                <g
                  onMouseEnter={() => setHoveredElement('telomere')}
                  onMouseLeave={() => setHoveredElement(null)}
                  style={{ cursor: 'pointer' }}
                  transform="translate(340, 30)"
                >
                  <rect x="0" y="0" width="100" height="60" fill="#D1FAE5" stroke={defaultColors.telomere} strokeWidth="2" rx="4"/>
                  <text x="50" y="25" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#059669">端粒</text>
                  <text x="50" y="45" textAnchor="middle" fontSize="10" fill="#666">保护DNA末端</text>
                </g>
              </g>

              {hoveredElement && getElementDetails(hoveredElement) && (
                <foreignObject x="20" y="20" width="180" height="80">
                  <div style={{
                    backgroundColor: 'white',
                    border: `2px solid ${hoveredElement === 'chromatid1' ? defaultColors.chromatid1 : hoveredElement === 'chromatid2' ? defaultColors.chromatid2 : hoveredElement === 'centromere' ? defaultColors.centromere : hoveredElement === 'telomere' ? defaultColors.telomere : hoveredElement === 'sister-chromatids' ? defaultColors.sisterChromatids : hoveredElement === 'dna' ? '#3B82F6' : '#666'}`,
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

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-3">结构组成</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>姐妹染色单体：</strong>由DNA复制产生的两条相同染色体</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>着丝粒：</strong>姐妹染色单体的连接点，纺锤丝附着处</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>端粒：</strong>染色体末端的保护结构，防止DNA降解</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>DNA：</strong>高度压缩的DNA分子，与组蛋白形成染色质</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'condensation' && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-purple-800">染色体形成过程</h3>
          
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-3">步骤控制</h4>
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currentStep === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-purple-500 text-white hover:bg-purple-600'
                }`}
              >
                ← 上一步
              </button>
              <span className="text-sm text-gray-600">步骤 {currentStep + 1} / {condensationSteps.length}</span>
              <button
                onClick={() => setCurrentStep(Math.min(condensationSteps.length - 1, currentStep + 1))}
                disabled={currentStep === condensationSteps.length - 1}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currentStep === condensationSteps.length - 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-purple-500 text-white hover:bg-purple-600'
                }`}
              >
                下一步 →
              </button>
            </div>
            
            <div className="mb-4">
              <h5 className="font-bold text-purple-700 mb-2">{condensationSteps[currentStep].title}</h5>
              <p className="text-sm text-gray-700">{condensationSteps[currentStep].description}</p>
            </div>

            <div className="flex justify-center">
              <svg width="600" height="350" viewBox="0 0 600 350">
                <text x="300" y="20" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#7C3AED">染色体形成示意图</text>

                <g
                  onMouseEnter={() => setHoveredElement('chromatin')}
                  onMouseLeave={() => setHoveredElement(null)}
                  style={{ cursor: 'pointer', opacity: condensationSteps[currentStep].showElements.includes('chromatin') ? 1 : 0.3 }}
                  transform="translate(50, 50)"
                >
                  <rect x="0" y="0" width="500" height="60" rx="5" fill="#F3E5F5" stroke={condensationSteps[currentStep].highlight === 'chromatin' ? '#9C27B0' : '#BA68C8'} strokeWidth={condensationSteps[currentStep].highlight === 'chromatin' ? 3 : 2} />
                  <text x="250" y="25" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#7C3AED">染色质</text>
                  <text x="250" y="45" textAnchor="middle" fontSize="11" fill="#666">间期：DNA与蛋白质的松散复合物</text>
                </g>

                <g
                  onMouseEnter={() => setHoveredElement('histone')}
                  onMouseLeave={() => setHoveredElement(null)}
                  style={{ cursor: 'pointer', opacity: condensationSteps[currentStep].showElements.includes('histone') ? 1 : 0.3 }}
                  transform="translate(50, 130)"
                >
                  <rect x="0" y="0" width="230" height="60" rx="5" fill="#E8EAF6" stroke={condensationSteps[currentStep].highlight === 'histone' ? '#3F51B5' : '#7986CB'} strokeWidth={condensationSteps[currentStep].highlight === 'histone' ? 3 : 2} />
                  <text x="115" y="25" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#3F51B5">组蛋白</text>
                  <text x="115" y="45" textAnchor="middle" fontSize="11" fill="#666">DNA包装的核心蛋白</text>
                </g>

                <g
                  onMouseEnter={() => setHoveredElement('nucleosome')}
                  onMouseLeave={() => setHoveredElement(null)}
                  style={{ cursor: 'pointer', opacity: condensationSteps[currentStep].showElements.includes('nucleosome') ? 1 : 0.3 }}
                  transform="translate(320, 130)"
                >
                  <rect x="0" y="0" width="230" height="60" rx="5" fill="#E1F5FE" stroke={condensationSteps[currentStep].highlight === 'nucleosome' ? '#0288D1' : '#4FC3F7'} strokeWidth={condensationSteps[currentStep].highlight === 'nucleosome' ? 3 : 2} />
                  <text x="115" y="25" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#0288D1">核小体</text>
                  <text x="115" y="45" textAnchor="middle" fontSize="11" fill="#666">染色质的基本单位</text>
                </g>

                <g
                  onMouseEnter={() => setHoveredElement('dna')}
                  onMouseLeave={() => setHoveredElement(null)}
                  style={{ cursor: 'pointer', opacity: condensationSteps[currentStep].showElements.includes('dna') ? 1 : 0.3 }}
                  transform="translate(50, 210)"
                >
                  <rect x="0" y="0" width="500" height="60" rx="5" fill="#E8F5E9" stroke={condensationSteps[currentStep].highlight === 'dna' ? '#4CAF50' : '#81C784'} strokeWidth={condensationSteps[currentStep].highlight === 'dna' ? 3 : 2} />
                  <text x="250" y="25" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#4CAF50">DNA螺旋化</text>
                  <text x="250" y="45" textAnchor="middle" fontSize="11" fill="#666">核小体进一步螺旋、折叠</text>
                </g>

                <g
                  onMouseEnter={() => setHoveredElement('chromatid1')}
                  onMouseLeave={() => setHoveredElement(null)}
                  style={{ cursor: 'pointer', opacity: condensationSteps[currentStep].showElements.includes('chromatid1') ? 1 : 0.3 }}
                  transform="translate(50, 290)"
                >
                  <rect x="0" y="0" width="230" height="50" rx="5" fill="#FFEBEE" stroke={condensationSteps[currentStep].highlight === 'chromatid1' ? '#F44336' : '#E57373'} strokeWidth={condensationSteps[currentStep].highlight === 'chromatid1' ? 3 : 2} />
                  <text x="115" y="30" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#F44336">姐妹染色单体</text>
                </g>

                <g
                  onMouseEnter={() => setHoveredElement('chromatid2')}
                  onMouseLeave={() => setHoveredElement(null)}
                  style={{ cursor: 'pointer', opacity: condensationSteps[currentStep].showElements.includes('chromatid2') ? 1 : 0.3 }}
                  transform="translate(320, 290)"
                >
                  <rect x="0" y="0" width="230" height="50" rx="5" fill="#FFEBEE" stroke={condensationSteps[currentStep].highlight === 'chromatid2' ? '#F44336' : '#E57373'} strokeWidth={condensationSteps[currentStep].highlight === 'chromatid2' ? 3 : 2} />
                  <text x="115" y="30" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#F44336">姐妹染色单体</text>
                </g>

                {condensationSteps[currentStep].showElements.includes('chromatid1') && (
                  <g
                    onMouseEnter={() => setHoveredElement('centromere')}
                    onMouseLeave={() => setHoveredElement(null)}
                    style={{ cursor: 'pointer', opacity: condensationSteps[currentStep].showElements.includes('centromere') ? 1 : 0.3 }}
                    transform="translate(285, 290)"
                  >
                    <circle cx="15" cy="25" r="10" fill={defaultColors.centromere} fillOpacity="0.5" stroke={condensationSteps[currentStep].highlight === 'centromere' ? '#F59E0B' : '#FFB74D'} strokeWidth={condensationSteps[currentStep].highlight === 'centromere' ? 3 : 2} />
                    <text x="15" y="29" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#B45309">着丝粒</text>
                  </g>
                )}

                {hoveredElement && getElementDetails(hoveredElement) && (
                  <foreignObject x="20" y="20" width="180" height="60">
                    <div style={{
                      backgroundColor: 'white',
                      border: `2px solid ${hoveredElement === 'chromatin' ? '#9C27B0' : hoveredElement === 'histone' ? '#3F51B5' : hoveredElement === 'nucleosome' ? '#0288D1' : hoveredElement === 'dna' ? '#4CAF50' : hoveredElement === 'chromatid1' || hoveredElement === 'chromatid2' ? '#F44336' : hoveredElement === 'centromere' ? '#F59E0B' : '#666'}`,
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
              </svg>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'types' && (
        <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-green-800">染色体类型</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div
              onMouseEnter={() => setHoveredElement('autosome')}
              onMouseLeave={() => setHoveredElement(null)}
              style={{ cursor: 'pointer' }}
              className="bg-white rounded-lg p-6 border-2 border-green-200 hover:border-green-400 transition-all"
            >
              <h4 className="font-semibold text-green-800 text-lg mb-3">常染色体</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">类型：</span>
                  <span className="font-bold text-green-700">autosome</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">数量：</span>
                  <span className="font-bold text-green-700">22 对</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">总数：</span>
                  <span className="font-bold text-green-700">44 条</span>
                </div>
              </div>
            </div>

            <div
              onMouseEnter={() => setHoveredElement('sex-chromosome')}
              onMouseLeave={() => setHoveredElement(null)}
              style={{ cursor: 'pointer' }}
              className="bg-white rounded-lg p-6 border-2 border-green-200 hover:border-green-400 transition-all"
            >
              <h4 className="font-semibold text-green-800 text-lg mb-3">性染色体</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">类型：</span>
                  <span className="font-bold text-green-700">sex</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">数量：</span>
                  <span className="font-bold text-green-700">1 对</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">总数：</span>
                  <span className="font-bold text-green-700">2 条</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-3">人类染色体组成</h4>
            <p className="text-sm text-gray-700 mb-3">
              人类正常体细胞含有 <strong>23对</strong> 染色体（46条），包括：
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>22对常染色体：</strong>编号1-22，按大小顺序排列</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>1对性染色体：</strong>XX（女性）或XY（男性）</span>
              </li>
            </ul>
          </div>

          {hoveredElement && getElementDetails(hoveredElement) && (
            <div className="bg-white rounded-lg p-4 border-2 border-green-300">
              <h5 className="font-bold text-green-700 mb-2">{getElementDetails(hoveredElement).name}</h5>
              <p className="text-sm text-gray-700">{getElementDetails(hoveredElement).description}</p>
              {getElementDetails(hoveredElement).details && (
                <p className="text-sm text-gray-600 mt-2">{getElementDetails(hoveredElement).details}</p>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'function' && (
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 space-y-6">
          <h3 className="text-xl font-bold text-orange-800">染色体功能</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            {functions.map((func: any, index: number) => (
              <div key={index} className="bg-white rounded-lg p-4 border-2 border-orange-200">
                <h4 className="font-semibold text-orange-800 mb-2">{func.name}</h4>
                <p className="text-sm text-gray-700">{func.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-orange-800 mb-3">功能特点</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                <span><strong>DNA保护：</strong>防止DNA断裂和丢失</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                <span><strong>基因调控：</strong>通过染色质结构调控基因表达</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                <span><strong>细胞分裂：</strong>确保遗传物质平均分配给子细胞</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                <span><strong>重组发生：</strong>同源染色体之间可发生基因重组</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
