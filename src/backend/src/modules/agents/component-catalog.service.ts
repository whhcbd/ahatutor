import { Injectable, Logger } from '@nestjs/common';
import { ComponentCatalog, ComponentDefinition, UserAction } from '@ahatutor/shared';

@Injectable()
export class ComponentCatalogService {
  private readonly logger = new Logger(ComponentCatalogService.name);
  private catalog: ComponentCatalog;

  constructor() {
    this.catalog = this.initializeCatalog();
    this.logger.log('Component Catalog Service initialized with ' + Object.keys(this.catalog.components).length + ' components');
  }

  private initializeCatalog(): ComponentCatalog {
    return {
      version: '1.0.0',
      components: {
        'text': {
          type: 'text',
          version: '1.0.0',
          displayName: '文本组件',
          description: '基础文本展示组件',
          allowedProps: ['content', 'style', 'className'],
          allowedEvents: ['click'],
          requiresAuth: false,
          dataBinding: false
        },
        'card': {
          type: 'card',
          version: '1.0.0',
          displayName: '卡片组件',
          description: '卡片布局容器',
          allowedProps: ['title', 'content', 'style', 'className'],
          allowedEvents: ['click'],
          requiresAuth: false,
          dataBinding: false
        },
        'button': {
          type: 'button',
          version: '1.0.0',
          displayName: '按钮组件',
          description: '可点击的按钮',
          allowedProps: ['label', 'disabled', 'variant', 'style', 'className'],
          allowedEvents: ['click'],
          requiresAuth: false,
          dataBinding: false
        },
        'input': {
          type: 'input',
          version: '1.0.0',
          displayName: '输入框组件',
          description: '文本输入框',
          allowedProps: ['placeholder', 'value', 'type', 'disabled', 'style', 'className'],
          allowedEvents: ['input', 'change', 'focus', 'blur'],
          requiresAuth: false,
          dataBinding: true
        },
        'form': {
          type: 'form',
          version: '1.0.0',
          displayName: '表单组件',
          description: '表单容器',
          allowedProps: ['fields', 'submitLabel', 'style', 'className'],
          allowedEvents: ['submit'],
          requiresAuth: false,
          dataBinding: true
        },
        'ahatutor-punnett-square': {
          type: 'ahatutor-punnett-square',
          version: '1.0.0',
          displayName: 'Punnett方格',
          description: '孟德尔杂交实验可视化',
          allowedProps: ['data', 'layout', 'interactive', 'style', 'className'],
          allowedEvents: ['click', 'hover'],
          requiresAuth: false,
          dataBinding: true,
          metadata: {
            author: 'AhaTutor',
            category: 'genetics',
            tags: ['visualization', 'genetics', 'mendelian']
          }
        },
        'ahatutor-inheritance-path': {
          type: 'ahatutor-inheritance-path',
          version: '1.0.0',
          displayName: '遗传路径',
          description: '遗传路径可视化',
          allowedProps: ['data', 'layout', 'interactions', 'style', 'className'],
          allowedEvents: ['click', 'hover'],
          requiresAuth: false,
          dataBinding: true,
          metadata: {
            author: 'AhaTutor',
            category: 'genetics',
            tags: ['visualization', 'genetics', 'inheritance']
          }
        },
        'ahatutor-knowledge-graph': {
          type: 'ahatutor-knowledge-graph',
          version: '1.0.0',
          displayName: '知识图谱',
          description: '知识图谱可视化',
          allowedProps: ['nodes', 'links', 'width', 'height', 'style', 'className'],
          allowedEvents: ['click', 'hover', 'drag'],
          requiresAuth: false,
          dataBinding: true,
          metadata: {
            author: 'AhaTutor',
            category: 'learning',
            tags: ['visualization', 'graph', 'knowledge']
          }
        },
        'ahatutor-meiosis-animation': {
          type: 'ahatutor-meiosis-animation',
          version: '1.0.0',
          displayName: '减数分裂动画',
          description: '减数分裂过程动画',
          allowedProps: ['autoplay', 'loop', 'speed', 'style', 'className'],
          allowedEvents: ['play', 'pause', 'seek'],
          requiresAuth: false,
          dataBinding: false,
          metadata: {
            author: 'AhaTutor',
            category: 'cell_biology',
            tags: ['animation', 'cell', 'meiosis']
          }
        },
        'ahatutor-probability-distribution': {
          type: 'ahatutor-probability-distribution',
          version: '1.0.0',
          displayName: '概率分布',
          description: '遗传概率分布可视化',
          allowedProps: ['data', 'chartType', 'style', 'className'],
          allowedEvents: ['click', 'hover'],
          requiresAuth: false,
          dataBinding: true,
          metadata: {
            author: 'AhaTutor',
            category: 'genetics',
            tags: ['visualization', 'probability', 'genetics']
          }
        },
        'ahatutor-chromosome-behavior': {
          type: 'ahatutor-chromosome-behavior',
          version: '1.0.0',
          displayName: '染色体行为',
          description: '染色体行为可视化',
          allowedProps: ['phase', 'interactions', 'style', 'className'],
          allowedEvents: ['click', 'hover'],
          requiresAuth: false,
          dataBinding: true,
          metadata: {
            author: 'AhaTutor',
            category: 'cell_biology',
            tags: ['visualization', 'chromosome', 'cell']
          }
        },
        'ahatutor-dna-replication': {
          type: 'ahatutor-dna-replication',
          version: '1.0.0',
          displayName: 'DNA复制',
          description: 'DNA复制过程可视化',
          allowedProps: ['phase', 'speed', 'interactions', 'style', 'className'],
          allowedEvents: ['play', 'pause', 'click'],
          requiresAuth: false,
          dataBinding: false,
          metadata: {
            author: 'AhaTutor',
            category: 'molecular_biology',
            tags: ['animation', 'dna', 'replication']
          }
        },
        'ahatutor-transcription': {
          type: 'ahatutor-transcription',
          version: '1.0.0',
          displayName: '转录',
          description: '转录过程可视化',
          allowedProps: ['phase', 'speed', 'interactions', 'style', 'className'],
          allowedEvents: ['play', 'pause', 'click'],
          requiresAuth: false,
          dataBinding: false,
          metadata: {
            author: 'AhaTutor',
            category: 'molecular_biology',
            tags: ['animation', 'rna', 'transcription']
          }
        },
        'ahatutor-translation': {
          type: 'ahatutor-translation',
          version: '1.0.0',
          displayName: '翻译',
          description: '翻译过程可视化',
          allowedProps: ['phase', 'speed', 'interactions', 'style', 'className'],
          allowedEvents: ['play', 'pause', 'click'],
          requiresAuth: false,
          dataBinding: false,
          metadata: {
            author: 'AhaTutor',
            category: 'molecular_biology',
            tags: ['animation', 'protein', 'translation']
          }
        },
        'ahatutor-gene-structure': {
          type: 'ahatutor-gene-structure',
          version: '1.0.0',
          displayName: '基因结构',
          description: '基因结构可视化',
          allowedProps: ['gene', 'features', 'interactions', 'style', 'className'],
          allowedEvents: ['click', 'hover'],
          requiresAuth: false,
          dataBinding: true,
          metadata: {
            author: 'AhaTutor',
            category: 'molecular_biology',
            tags: ['visualization', 'gene', 'structure']
          }
        },
        'ahatutor-crispr': {
          type: 'ahatutor-crispr',
          version: '1.0.0',
          displayName: 'CRISPR基因编辑',
          description: 'CRISPR基因编辑可视化',
          allowedProps: ['sequence', 'target', 'interactions', 'style', 'className'],
          allowedEvents: ['click', 'edit'],
          requiresAuth: false,
          dataBinding: true,
          metadata: {
            author: 'AhaTutor',
            category: 'biotechnology',
            tags: ['visualization', 'crispr', 'editing']
          }
        },
        'ahatutor-trisomy': {
          type: 'ahatutor-trisomy',
          version: '1.0.0',
          displayName: '三体综合征',
          description: '三体综合征可视化',
          allowedProps: ['chromosomeCount', 'type', 'interactions', 'style', 'className'],
          allowedEvents: ['click', 'hover'],
          requiresAuth: false,
          dataBinding: true,
          metadata: {
            author: 'AhaTutor',
            category: 'genetics',
            tags: ['visualization', 'trisomy', 'chromosome']
          }
        },
        'ahatutor-mitosis': {
          type: 'ahatutor-mitosis',
          version: '1.0.0',
          displayName: '有丝分裂',
          description: '有丝分裂过程可视化',
          allowedProps: ['phase', 'speed', 'interactions', 'style', 'className'],
          allowedEvents: ['play', 'pause', 'click'],
          requiresAuth: false,
          dataBinding: false,
          metadata: {
            author: 'AhaTutor',
            category: 'cell_biology',
            tags: ['animation', 'cell', 'mitosis']
          }
        },
        'ahatutor-allele': {
          type: 'ahatutor-allele',
          version: '1.0.0',
          displayName: '等位基因',
          description: '等位基因可视化',
          allowedProps: ['alleles', 'genotype', 'interactions', 'style', 'className'],
          allowedEvents: ['click', 'hover'],
          requiresAuth: false,
          dataBinding: true,
          metadata: {
            author: 'AhaTutor',
            category: 'genetics',
            tags: ['visualization', 'allele', 'genotype']
          }
        },
        'ahatutor-pedigree-chart': {
          type: 'ahatutor-pedigree-chart',
          version: '1.0.0',
          displayName: '系谱图',
          description: '系谱图可视化',
          allowedProps: ['pedigreeData', 'generations', 'interactions', 'style', 'className'],
          allowedEvents: ['click', 'hover'],
          requiresAuth: false,
          dataBinding: true,
          metadata: {
            author: 'AhaTutor',
            category: 'genetics',
            tags: ['visualization', 'pedigree', 'inheritance']
          }
        }
      }
    };
  }

  getCatalog(): ComponentCatalog {
    return this.catalog;
  }

  getComponentDefinition(componentType: string): ComponentDefinition | null {
    return this.catalog.components[componentType] || null;
  }

  isComponentRegistered(componentType: string): boolean {
    return componentType in this.catalog.components;
  }

  validateUserAction(action: UserAction): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!action.actionId) {
      errors.push('Missing required field: actionId');
    }

    if (!action.componentId) {
      errors.push('Missing required field: componentId');
    }

    if (!action.actionType) {
      errors.push('Missing required field: actionType');
    } else if (!['click', 'change', 'submit', 'focus', 'blur', 'input'].includes(action.actionType)) {
      errors.push(`Invalid actionType: ${action.actionType}`);
    }

    if (!action.messageId) {
      errors.push('Missing required field: messageId');
    }

    if (!action.timestamp) {
      errors.push('Missing required field: timestamp');
    }

    if (errors.length > 0) {
      return { valid: false, errors };
    }

    if (!this.isComponentRegistered(action.componentId)) {
      errors.push(`Component type "${action.componentId}" is not registered in catalog`);
      return { valid: false, errors };
    }

    const component = this.getComponentDefinition(action.componentId);

    if (!component!.allowedEvents.includes(action.actionType)) {
      errors.push(`Action type "${action.actionType}" is not allowed for component "${action.componentId}"`);
    }

    return { valid: errors.length === 0, errors };
  }

  checkAuthRequirement(componentType: string): boolean {
    const component = this.getComponentDefinition(componentType);
    return component?.requiresAuth || false;
  }

  getAuthorizedActions(componentType: string): string[] {
    const component = this.getComponentDefinition(componentType);
    return component?.allowedEvents || [];
  }

  getDataBindingSupport(componentType: string): boolean {
    const component = this.getComponentDefinition(componentType);
    return component?.dataBinding || false;
  }

  getComponentsByCategory(category: string): ComponentDefinition[] {
    return Object.values(this.catalog.components).filter(
      component => component.metadata?.category === category
    );
  }

  getComponentsByTag(tag: string): ComponentDefinition[] {
    return Object.values(this.catalog.components).filter(
      component => component.metadata?.tags?.includes(tag)
    );
  }
}
