import React from 'react';

import { PunnettSquare } from '../Visualization/PunnettSquare';
import { InheritancePath } from '../Visualization/InheritancePath';
import { KnowledgeGraph } from '../Visualization/KnowledgeGraph';
import { MeiosisAnimation } from '../Visualization/MeiosisAnimation';
import { ProbabilityDistribution } from '../Visualization/ProbabilityDistribution';
import { DNAReplicationVisualization } from '../Visualization/DNAReplicationVisualization';
import { TranscriptionVisualization } from '../Visualization/TranscriptionVisualization';
import { TranslationVisualization } from '../Visualization/TranslationVisualization';
import { GeneStructureVisualization } from '../Visualization/GeneStructureVisualization';
import { CRISPRVisualization } from '../Visualization/CRISPRVisualization';
import { TrisomyVisualization } from '../Visualization/TrisomyVisualization';
import { MitosisVisualization } from '../Visualization/MitosisVisualization';
import { AlleleVisualization } from '../Visualization/AlleleVisualization';
import { ChromosomeBehavior } from '../Visualization/ChromosomeBehavior';
import { ThreePointTestCross } from '../Visualization/ThreePointTestCross';
import { TestCross } from '../Visualization/TestCross';
import { DNAHelixVisualization } from '../Visualization/DNAHelixVisualization';
import { TextComponent } from './standard/TextComponent';
import { ButtonComponent } from './standard/ButtonComponent';
import { RowComponent } from './standard/RowComponent';
import { ColumnComponent } from './standard/ColumnComponent';
import { CardComponent } from './standard/CardComponent';
import { IconComponent } from './standard/IconComponent';

export interface A2UIComponentRegistration {
  component: React.ComponentType<any>;
  adapter?: (props: any) => any;
  defaultProps?: Record<string, any>;
  propMapping?: Record<string, string>;
  transformers?: Record<string, (value: any) => any>;
  displayName?: string;
  category?: string;
  version?: string;
  description?: string;
  author?: string;
  tags?: string[];
  dependencies?: string[];
  deprecated?: boolean;
  experimental?: boolean;
}

export interface A2UIComponentRegistry {
  [key: string]: A2UIComponentRegistration;
}

export const A2UI_REGISTRY: A2UIComponentRegistry = {
  'text': {
    component: TextComponent,
    displayName: '文本',
    category: 'standard.display',
    version: '1.0.0'
  },
  'button': {
    component: ButtonComponent,
    displayName: '按钮',
    category: 'standard.interactive',
    version: '1.0.0'
  },
  'row': {
    component: RowComponent,
    displayName: '行布局',
    category: 'standard.layout',
    version: '1.0.0'
  },
  'column': {
    component: ColumnComponent,
    displayName: '列布局',
    category: 'standard.layout',
    version: '1.0.0'
  },
  'card': {
    component: CardComponent,
    displayName: '卡片',
    category: 'standard.layout',
    version: '1.0.0'
  },
  'ahatutor-punnett-square': {
    component: PunnettSquare,
    displayName: 'Punnett方格',
    category: 'genetics',
    version: '1.0.0',
    defaultProps: {
      data: {
        maleGametes: ['A', 'a'],
        femaleGametes: ['A', 'a'],
        parentalCross: {
          male: { genotype: 'Aa', phenotype: '显性' },
          female: { genotype: 'Aa', phenotype: '显性' }
        },
        offspring: [
          { genotype: 'AA', phenotype: '显性', probability: 0.25 },
          { genotype: 'Aa', phenotype: '显性', probability: 0.5 },
          { genotype: 'aa', phenotype: '隐性', probability: 0.25 }
        ],
        description: '经典孟德尔杂交实验'
      }
    }
  },

  'ahatutor-inheritance-path': {
    component: InheritancePath,
    displayName: '遗传路径',
    category: 'genetics',
    version: '1.0.0',
    defaultProps: {
      layout: 'hierarchical',
      interactions: ['hover', 'click']
    }
  },

  'ahatutor-knowledge-graph': {
    component: KnowledgeGraph,
    displayName: '知识图谱',
    category: 'learning',
    version: '1.0.0',
    defaultProps: {
      width: 800,
      height: 600
    }
  },

  'ahatutor-meiosis-animation': {
    component: MeiosisAnimation,
    displayName: '减数分裂动画',
    category: 'cell_biology',
    version: '1.0.0',
    defaultProps: {
      autoplay: true,
      loop: true,
      speed: 1
    }
  },

  'ahatutor-probability-distribution': {
    component: ProbabilityDistribution,
    displayName: '概率分布',
    category: 'genetics',
    version: '1.0.0'
  },

  'ahatutor-chromosome-behavior': {
    component: ChromosomeBehavior,
    displayName: '染色体行为',
    category: 'cell_biology',
    version: '1.0.0'
  },

  'ahatutor-dna-replication': {
    component: DNAReplicationVisualization,
    displayName: 'DNA复制',
    category: 'molecular_biology',
    version: '1.0.0'
  },

  'ahatutor-transcription': {
    component: TranscriptionVisualization,
    displayName: '转录',
    category: 'molecular_biology',
    version: '1.0.0'
  },

  'ahatutor-translation': {
    component: TranslationVisualization,
    displayName: '翻译',
    category: 'molecular_biology',
    version: '1.0.0'
  },

  'ahatutor-gene-structure': {
    component: GeneStructureVisualization,
    displayName: '基因结构',
    category: 'molecular_biology',
    version: '1.0.0'
  },

  'ahatutor-crispr': {
    component: CRISPRVisualization,
    displayName: 'CRISPR基因编辑',
    category: 'biotechnology',
    version: '1.0.0'
  },

  'ahatutor-trisomy': {
    component: TrisomyVisualization,
    displayName: '三体综合征',
    category: 'genetics',
    version: '1.0.0'
  },

  'ahatutor-mitosis': {
    component: MitosisVisualization,
    displayName: '有丝分裂',
    category: 'cell_biology',
    version: '1.0.0'
  },

  'ahatutor-allele': {
    component: AlleleVisualization,
    displayName: '等位基因',
    category: 'genetics',
    version: '1.0.0'
  },

  'ahatutor-dna-helix': {
    component: DNAHelixVisualization,
    displayName: 'DNA双螺旋',
    category: 'molecular_biology',
    version: '1.0.0',
    defaultProps: {
      data: {
        basePairs: [
          { base1: 'A', base2: 'T', bonds: 2, color1: '#FF6B6B', color2: '#4ECDC4' },
          { base1: 'C', base2: 'G', bonds: 3, color1: '#45B7D1', color2: '#FFE66D' }
        ],
        structure: {
          strands: 2,
          orientation: '反向平行',
          helixTurn: '右旋'
        }
      }
    }
  },

  'ahatutor-three-point-test-cross': {
    component: ThreePointTestCross,
    displayName: '三点测交',
    category: 'genetics',
    version: '1.0.0',
    defaultProps: {
      data: {
        genes: [
          { name: '基因1', symbol: 'A', alleles: ['A', 'a'] },
          { name: '基因2', symbol: 'B', alleles: ['B', 'b'] },
          { name: '基因3', symbol: 'C', alleles: ['C', 'c'] }
        ],
        parentalGenotypes: [
          { id: 'parent1', genotype: 'ABC/abc', type: 'parent' },
          { id: 'parent2', genotype: 'abc/abc', type: 'test_cross' }
        ],
        chromosomeMap: {
          positions: [
            { gene: 'A', position: 10 },
            { gene: 'B', position: 25 },
            { gene: 'C', position: 40 }
          ]
        },
        recombinationFrequencies: {
          region1_2: { rf: 15, distance: 15 },
          region2_3: { rf: 12, distance: 12 },
          region1_3: { rf: 27, distance: 27 }
        },
        geneOrder: 'A-B-C',
        offspringData: [
          { genotype: 'ABC/abc', count: 200, percentage: 40, phenotypeDescription: '亲本型' },
          { genotype: 'abc/abc', count: 180, percentage: 36, phenotypeDescription: '亲本型' },
          { genotype: 'ABc/abc', count: 35, percentage: 7, phenotypeDescription: '单重组(BC间)' },
          { genotype: 'abC/abc', count: 30, percentage: 6, phenotypeDescription: '单重组(BC间)' },
          { genotype: 'Abc/abc', count: 25, percentage: 5, phenotypeDescription: '单重组(AB间)' },
          { genotype: 'aBC/abc', count: 20, percentage: 4, phenotypeDescription: '单重组(AB间)' },
          { genotype: 'AbC/abc', count: 8, percentage: 1.6, phenotypeDescription: '双重组' },
          { genotype: 'aBc/abc', count: 2, percentage: 0.4, phenotypeDescription: '双重组' }
        ],
        title: '三点测交分析'
      }
    }
  },

  'ahatutor-test-cross': {
    component: TestCross,
    displayName: '测交分析',
    category: 'genetics',
    version: '1.0.0',
    defaultProps: {
      data: {
        unknownGenotype: {
          genotype: 'A?',
          description: '未知基因型个体'
        },
        testParent: {
          genotype: 'aa',
          symbol: '♂',
          phenotype: '隐性纯合'
        },
        crossResults: [
          { offspringGenotype: 'Aa', offspringPhenotype: '显性表型', count: 48, percentage: 96 },
          { offspringGenotype: 'aa', offspringPhenotype: '隐性表型', count: 2, percentage: 4 }
        ],
        conclusion: {
          deducedGenotype: 'AA',
          confidence: '高',
          explanation: '所有后代均为显性表型（96%），说明待测个体为显性纯合子AA。若有隐性后代出现，则待测个体为杂合子Aa。'
        },
        title: '测交分析'
      }
    }
  },

  'ahatutor-pedigree-chart': {
    component: InheritancePath,
    displayName: '系谱图',
    category: 'genetics',
    version: '1.0.0',
    adapter: (props) => {
      return {
        ...props,
        displayMode: 'pedigree'
      };
    }
  },

  'error-card': {
    component: CardComponent,
    displayName: '错误卡片',
    category: 'standard',
    version: '1.0.0'
  },

  'error-icon': {
    component: IconComponent,
    displayName: '错误图标',
    category: 'standard',
    version: '1.0.0'
  },

  'error-message': {
    component: TextComponent,
    displayName: '错误消息',
    category: 'standard',
    version: '1.0.0'
  },

  'retry-button': {
    component: ButtonComponent,
    displayName: '重试按钮',
    category: 'standard',
    version: '1.0.0'
  }
};

export function registerA2UIComponent(
  type: string,
  component: React.ComponentType<any>,
  options?: {
    adapter?: (props: any) => any;
    defaultProps?: Record<string, any>;
    displayName?: string;
    category?: string;
    version?: string;
  }
): void {
  A2UI_REGISTRY[type] = {
    component,
    ...options
  };
}

export function getA2UIComponent(type: string): React.ComponentType<any> | undefined {
  return A2UI_REGISTRY[type]?.component;
}

export function getA2UIComponentRegistration(type: string): A2UIComponentRegistration | undefined {
  return A2UI_REGISTRY[type];
}

export function getA2UIComponentAdapter(type: string): ((props: any) => any) | undefined {
  return A2UI_REGISTRY[type]?.adapter;
}

export function getA2UIComponentDefaultProps(type: string): Record<string, any> | undefined {
  return A2UI_REGISTRY[type]?.defaultProps;
}

export function getRegisteredComponentTypes(): string[] {
  return Object.keys(A2UI_REGISTRY);
}

export function getComponentsByCategory(category: string): A2UIComponentRegistry {
  const result: A2UIComponentRegistry = {};
  for (const [type, registration] of Object.entries(A2UI_REGISTRY)) {
    if (registration.category === category) {
      result[type] = registration;
    }
  }
  return result;
}

export function isComponentRegistered(type: string): boolean {
  return type in A2UI_REGISTRY;
}

export function unregisterA2UIComponent(type: string): boolean {
  if (isComponentRegistered(type)) {
    delete A2UI_REGISTRY[type];
    return true;
  }
  return false;
}

export function getComponentMetadata(type: string): {
  displayName?: string;
  category?: string;
  version?: string;
  description?: string;
  author?: string;
  tags?: string[];
  deprecated?: boolean;
  experimental?: boolean;
} | null {
  const registration = A2UI_REGISTRY[type];
  if (!registration) {
    return null;
  }
  return {
    displayName: registration.displayName,
    category: registration.category,
    version: registration.version,
    description: registration.description,
    author: registration.author,
    tags: registration.tags,
    deprecated: registration.deprecated,
    experimental: registration.experimental
  };
}

export function adaptComponentProps(type: string, props: any): any {
  const registration = A2UI_REGISTRY[type];
  if (!registration) {
    return props;
  }

  const { adapter, defaultProps } = registration;

  let adaptedProps = { ...props };

  if (defaultProps) {
    adaptedProps = {
      ...defaultProps,
      ...adaptedProps
    };
  }

  if (adapter) {
    adaptedProps = adapter(adaptedProps);
  }

  return adaptedProps;
}

export function validateComponent(type: string): {
  valid: boolean;
  errors: string[];
} {
  const registration = A2UI_REGISTRY[type];
  const errors: string[] = [];

  if (!registration) {
    errors.push(`Component type "${type}" is not registered`);
    return { valid: false, errors };
  }

  if (!registration.component) {
    errors.push(`Component "${type}" is missing a React component`);
  }

  if (registration.deprecated) {
    errors.push(`Component "${type}" is deprecated`);
  }

  return { valid: errors.length === 0, errors };
}

export function getComponentDependencies(type: string): string[] {
  const registration = A2UI_REGISTRY[type];
  return registration?.dependencies || [];
}

export function checkDependenciesSatisfied(type: string): boolean {
  const dependencies = getComponentDependencies(type);
  return dependencies.every(dep => isComponentRegistered(dep));
}
