import type { VisualizationSuggestion } from '@ahatutor/shared';
import type { PunnettSquareData } from '@ahatutor/shared';
import type { InheritancePathData } from '@ahatutor/shared';
import type { ProbabilityDistributionData } from '@ahatutor/shared';
import type { A2UIPayload, A2UIComponent } from '@shared/types/a2ui.types';

// A2UI模板定义
export interface A2UITemplate {
  templateId: string;
  visualizationType: VisualizationSuggestion['type'];
  complexity: 'low' | 'medium' | 'high';
  schema: {
    type: string;
    properties: Record<string, any>;
    required: string[];
  };
  defaultValues: Record<string, any>;
  a2uiTemplate: {
    type: 'card';
    id: string;
    children: Array<{
      type: string;
      id: string;
      properties: Record<string, any>;
    }>;
  };
}

/**
 * A2UI 可视化模板库
 */
export const A2UI_TEMPLATES: A2UITemplate[] = [
  // Punnett方格模板
  {
    templateId: 'punnett_square_v1',
    visualizationType: 'punnett_square',
    complexity: 'low',
    schema: {
      type: 'object',
      properties: {
        maleGametes: {
          type: 'array',
          items: { type: 'string' },
          description: '雄配子列表，如 ["X", "Y"] 或 ["A", "a"]'
        },
        femaleGametes: {
          type: 'array',
          items: { type: 'string' },
          description: '雌配子列表'
        },
        parentalCross: {
          type: 'object',
          properties: {
            male: {
              type: 'object',
              properties: {
                genotype: { type: 'string', description: '父本基因型' },
                phenotype: { type: 'string', description: '父本表型' }
              },
              required: ['genotype', 'phenotype']
            },
            female: {
              type: 'object',
              properties: {
                genotype: { type: 'string', description: '母本基因型' },
                phenotype: { type: 'string', description: '母本表型' }
              },
              required: ['genotype', 'phenotype']
            }
          },
          required: ['male', 'female']
        },
        offspring: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              genotype: { type: 'string', description: '后代基因型' },
              phenotype: { type: 'string', description: '后代表型' },
              probability: { type: 'number', description: '概率值' },
              sex: { type: 'string', enum: ['male', 'female'], description: '性别（可选）' }
            },
            required: ['genotype', 'phenotype', 'probability']
          },
          description: '所有可能的后代组合'
        },
        description: {
          type: 'string',
          description: '杂交方式简要说明'
        }
      },
      required: ['maleGametes', 'femaleGametes', 'parentalCross', 'offspring']
    },
    defaultValues: {
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
    },
    a2uiTemplate: {
      type: 'card',
      id: 'viz_punnett_square',
      children: [
        {
          type: 'ahatutor-punnett-square',
          id: 'punnett_square_component',
          properties: {
            maleGametes: '${maleGametes}',
            femaleGametes: '${femaleGametes}',
            parentalCross: '${parentalCross}',
            offspring: '${offspring}',
            description: '${description}'
          }
        }
      ]
    }
  },

  // 概率分布模板
  {
    templateId: 'probability_distribution_v1',
    visualizationType: 'probability_distribution',
    complexity: 'low',
    schema: {
      type: 'object',
      properties: {
        categories: {
          type: 'array',
          items: { type: 'string' },
          description: '类别名称'
        },
        values: {
          type: 'array',
          items: { type: 'number' },
          description: '对应概率值（0-1之间）'
        },
        colors: {
          type: 'array',
          items: { type: 'string' },
          description: '各类别颜色（可选）'
        },
        total: {
          type: 'string',
          description: '总计说明'
        },
        formula: {
          type: 'string',
          description: '相关公式（如有）'
        }
      },
      required: ['categories', 'values']
    },
    defaultValues: {
      categories: ['显性纯合 (AA)', '杂合 (Aa)', '隐性纯合 (aa)'],
      values: [0.25, 0.5, 0.25],
      colors: ['#4CAF50', '#2196F3', '#FF9800'],
      total: '总和 = 1 (100%)',
      formula: '双杂合子自交：Aa × Aa → 1AA:2Aa:1aa'
    },
    a2uiTemplate: {
      type: 'card',
      id: 'viz_probability_distribution',
      children: [
        {
          type: 'ahatutor-probability-distribution',
          id: 'probability_distribution_component',
          properties: {
            categories: '${categories}',
            values: '${values}',
            colors: '${colors}',
            total: '${total}',
            formula: '${formula}'
          }
        }
      ]
    }
  },

  // 知识图谱模板
  {
    templateId: 'knowledge_graph_v1',
    visualizationType: 'knowledge_graph',
    complexity: 'high',
    schema: {
      type: 'object',
      properties: {
        nodes: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', description: '节点ID' },
              label: { type: 'string', description: '节点标签' },
              level: { type: 'number', description: '节点层级' },
              isFoundation: { type: 'boolean', description: '是否基础概念' }
            },
            required: ['id', 'label', 'level']
          },
          description: '知识图谱节点'
        },
        links: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              source: { type: 'string', description: '源节点ID' },
              target: { type: 'string', description: '目标节点ID' }
            },
            required: ['source', 'target']
          },
          description: '知识图谱连接'
        },
        title: {
          type: 'string',
          description: '知识图谱标题'
        },
        description: {
          type: 'string',
          description: '知识图谱描述'
        }
      },
      required: ['nodes', 'links', 'title']
    },
    defaultValues: {
      nodes: [
        { id: 'genetics', label: '遗传学', level: 0, isFoundation: true },
        { id: 'mendelian', label: '孟德尔遗传学', level: 1, isFoundation: true },
        { id: 'molecular', label: '分子遗传学', level: 1, isFoundation: true },
        { id: 'population', label: '群体遗传学', level: 1, isFoundation: false },
        { id: 'punnett', label: 'Punnett方格', level: 2, isFoundation: false },
        { id: 'dna', label: 'DNA结构', level: 2, isFoundation: false }
      ],
      links: [
        { source: 'genetics', target: 'mendelian' },
        { source: 'genetics', target: 'molecular' },
        { source: 'genetics', target: 'population' },
        { source: 'mendelian', target: 'punnett' },
        { source: 'molecular', target: 'dna' }
      ],
      title: '遗传学知识图谱',
      description: '展示遗传学核心概念之间的关系'
    },
    a2uiTemplate: {
      type: 'card',
      id: 'viz_knowledge_graph',
      children: [
        {
          type: 'ahatutor-knowledge-graph',
          id: 'knowledge_graph_component',
          properties: {
            nodes: '${nodes}',
            links: '${links}',
            title: '${title}',
            description: '${description}'
          }
        }
      ]
    }
  },

  // 减数分裂动画模板
  {
    templateId: 'meiosis_animation_v1',
    visualizationType: 'meiosis_animation',
    complexity: 'high',
    schema: {
      type: 'object',
      properties: {
        stages: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', description: '阶段ID' },
              name: { type: 'string', description: '阶段名称' },
              description: { type: 'string', description: '阶段描述' },
              keyEvents: {
                type: 'array',
                items: { type: 'string' },
                description: '关键事件'
              },
              duration: { type: 'number', description: '动画持续时间（秒）' }
            },
            required: ['id', 'name', 'description', 'keyEvents']
          },
          description: '减数分裂阶段'
        },
        title: {
          type: 'string',
          description: '动画标题'
        },
        description: {
          type: 'string',
          description: '动画描述'
        },
        controls: {
          type: 'object',
          properties: {
            autoplay: { type: 'boolean', description: '是否自动播放' },
            loop: { type: 'boolean', description: '是否循环播放' },
            speed: { type: 'number', description: '播放速度' }
          },
          description: '动画控制选项'
        }
      },
      required: ['stages', 'title', 'description']
    },
    defaultValues: {
      stages: [
        {
          id: 'prophase1',
          name: '前期I',
          description: '染色体配对和交叉互换',
          keyEvents: ['染色体凝聚', '同源染色体配对', '交叉互换'],
          duration: 3
        },
        {
          id: 'metaphase1',
          name: '中期I',
          description: '同源染色体排列在赤道板',
          keyEvents: ['纺锤体形成', '同源染色体排列'],
          duration: 2
        },
        {
          id: 'anaphase1',
          name: '后期I',
          description: '同源染色体分离',
          keyEvents: ['同源染色体分离', '向两极移动'],
          duration: 2
        },
        {
          id: 'telophase1',
          name: '末期I',
          description: '细胞质分裂',
          keyEvents: ['核膜重建', '细胞质分裂'],
          duration: 2
        },
        {
          id: 'prophase2',
          name: '前期II',
          description: '染色体重新凝聚',
          keyEvents: ['核膜消失', '染色体凝聚'],
          duration: 2
        },
        {
          id: 'metaphase2',
          name: '中期II',
          description: '染色体排列在赤道板',
          keyEvents: ['纺锤体形成', '染色体排列'],
          duration: 2
        },
        {
          id: 'anaphase2',
          name: '后期II',
          description: '姐妹染色单体分离',
          keyEvents: ['姐妹染色单体分离', '向两极移动'],
          duration: 2
        },
        {
          id: 'telophase2',
          name: '末期II',
          description: '形成四个子细胞',
          keyEvents: ['核膜重建', '细胞质分裂', '形成配子'],
          duration: 3
        }
      ],
      title: '减数分裂过程动画',
      description: '展示从二倍体细胞到单倍体配子的完整减数分裂过程',
      controls: {
        autoplay: true,
        loop: true,
        speed: 1
      }
    },
    a2uiTemplate: {
      type: 'card',
      id: 'viz_meiosis_animation',
      children: [
        {
          type: 'ahatutor-meiosis-animation',
          id: 'meiosis_animation_component',
          properties: {
            stages: '${stages}',
            title: '${title}',
            description: '${description}',
            controls: '${controls}'
          }
        }
      ]
    }
  },

  // 系谱图模板
  {
    templateId: 'pedigree_chart_v1',
    visualizationType: 'pedigree_chart',
    complexity: 'medium',
    schema: {
      type: 'object',
      properties: {
        individuals: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', description: '个体ID' },
              sex: { type: 'string', enum: ['male', 'female'], description: '性别' },
              affected: { type: 'boolean', description: '是否患病' },
              carrier: { type: 'boolean', description: '是否携带者（女性）' },
              generation: { type: 'number', description: '世代编号' },
              position: { type: 'number', description: '在该代中的位置' },
              parents: {
                type: 'object',
                properties: {
                  father: { type: 'string', description: '父亲ID' },
                  mother: { type: 'string', description: '母亲ID' }
                },
                description: '父母ID'
              },
              spouse: { type: 'string', description: '配偶ID' }
            },
            required: ['id', 'sex', 'affected', 'generation', 'position']
          },
          description: '系谱个体信息'
        },
        legend: {
          type: 'object',
          properties: {
            condition: { type: 'string', description: '疾病/性状名称' },
            inheritancePattern: { type: 'string', description: '遗传方式' }
          },
          required: ['condition', 'inheritancePattern']
        }
      },
      required: ['individuals', 'legend']
    },
    defaultValues: {
      individuals: [
        { id: 'I-1', sex: 'male', affected: true, generation: 1, position: 1 },
        { id: 'I-2', sex: 'female', affected: false, carrier: true, generation: 1, position: 2 },
        { id: 'II-1', sex: 'male', affected: false, generation: 2, position: 1, parents: { father: 'I-1', mother: 'I-2' } },
        { id: 'II-2', sex: 'female', affected: true, generation: 2, position: 2, parents: { father: 'I-1', mother: 'I-2' } }
      ],
      legend: {
        condition: '血友病',
        inheritancePattern: 'X连锁隐性遗传'
      }
    },
    a2uiTemplate: {
      type: 'card',
      id: 'viz_pedigree_chart',
      children: [
        {
          type: 'ahatutor-pedigree-chart',
          id: 'pedigree_chart_component',
          properties: {
            individuals: '${individuals}',
            legend: '${legend}'
          }
        }
      ]
    }
  },

  // 染色体行为可视化模板
  {
    templateId: 'chromosome_behavior_v1',
    visualizationType: 'chromosome_behavior',
    complexity: 'high',
    schema: {
      type: 'object',
      properties: {
        chromosomes: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', description: '染色体ID' },
              name: { type: 'string', description: '染色体名称' },
              length: { type: 'number', description: '相对长度' },
              color: { type: 'string', description: '颜色' },
              genes: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string', description: '基因名称' },
                    position: { type: 'number', description: '相对位置0-1' },
                    dominant: { type: 'boolean', description: '是否显性' }
                  },
                  required: ['name', 'position']
                },
                description: '基因列表'
              }
            },
            required: ['id', 'name', 'length', 'color']
          },
          description: '染色体列表'
        },
        behavior: {
          type: 'object',
          properties: {
            type: { type: 'string', description: '行为类型' },
            description: { type: 'string', description: '行为描述' },
            stage: { type: 'string', description: '发生阶段' }
          },
          required: ['type', 'description', 'stage']
        },
        title: {
          type: 'string',
          description: '可视化标题'
        }
      },
      required: ['chromosomes', 'behavior', 'title']
    },
    defaultValues: {
      chromosomes: [
        {
          id: 'chromosome_1',
          name: 'X染色体',
          length: 100,
          color: '#FF6B6B',
          genes: [
            { name: '血友病基因', position: 0.3, dominant: false },
            { name: '色盲基因', position: 0.6, dominant: false }
          ]
        },
        {
          id: 'chromosome_2',
          name: 'Y染色体',
          length: 60,
          color: '#4ECDC4',
          genes: []
        }
      ],
      behavior: {
        type: 'segregation',
        description: '同源染色体分离',
        stage: '减数分裂后期I'
      },
      title: '染色体分离行为'
    },
    a2uiTemplate: {
      type: 'card',
      id: 'viz_chromosome_behavior',
      children: [
        {
          type: 'ahatutor-chromosome-behavior',
          id: 'chromosome_behavior_component',
          properties: {
            chromosomes: '${chromosomes}',
            behavior: '${behavior}',
            title: '${title}'
          }
        }
      ]
    }
  },

  // DNA复制可视化模板
  {
    templateId: 'dna_replication_v1',
    visualizationType: 'diagram',
    complexity: 'high',
    schema: {
      type: 'object',
      properties: {
        dnaSequence: {
          type: 'object',
          properties: {
            strand1: { type: 'string', description: 'DNA链1序列' },
            strand2: { type: 'string', description: 'DNA链2序列' }
          },
          required: ['strand1', 'strand2']
        },
        replicationProcess: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              step: { type: 'number', description: '步骤编号' },
              description: { type: 'string', description: '步骤描述' },
              keyMolecules: {
                type: 'array',
                items: { type: 'string' },
                description: '关键分子'
              }
            },
            required: ['step', 'description']
          },
          description: '复制过程'
        },
        enzymes: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', description: '酶名称' },
              function: { type: 'string', description: '功能' }
            },
            required: ['name', 'function']
          },
          description: '参与的酶'
        },
        title: {
          type: 'string',
          description: '可视化标题'
        }
      },
      required: ['dnaSequence', 'replicationProcess', 'title']
    },
    defaultValues: {
      dnaSequence: {
        strand1: 'ATCGATCG',
        strand2: 'TAGCTAGC'
      },
      replicationProcess: [
        { step: 1, description: '解旋酶解开DNA双螺旋', keyMolecules: ['解旋酶', 'SSB蛋白'] },
        { step: 2, description: '引物酶合成RNA引物', keyMolecules: ['引物酶', 'RNA引物'] },
        { step: 3, description: 'DNA聚合酶延伸新链', keyMolecules: ['DNA聚合酶', 'dNTP'] },
        { step: 4, description: 'DNA连接酶连接片段', keyMolecules: ['DNA连接酶'] }
      ],
      enzymes: [
        { name: '解旋酶', function: '解开DNA双螺旋' },
        { name: 'DNA聚合酶', function: '合成新DNA链' },
        { name: 'DNA连接酶', function: '连接DNA片段' }
      ],
      title: 'DNA复制过程'
    },
    a2uiTemplate: {
      type: 'card',
      id: 'viz_dna_replication',
      children: [
        {
          type: 'ahatutor-dna-replication',
          id: 'dna_replication_component',
          properties: {
            dnaSequence: '${dnaSequence}',
            replicationProcess: '${replicationProcess}',
            enzymes: '${enzymes}',
            title: '${title}'
          }
        }
      ]
    }
  },

  // 转录可视化模板
  {
    templateId: 'transcription_v1',
    visualizationType: 'diagram',
    complexity: 'high',
    schema: {
      type: 'object',
      properties: {
        dnaTemplate: {
          type: 'string',
          description: 'DNA模板链序列'
        },
        rnaSequence: {
          type: 'string',
          description: '转录产生的mRNA序列'
        },
        geneStructure: {
          type: 'object',
          properties: {
            promoter: { type: 'string', description: '启动子序列' },
            exons: { type: 'array', items: { type: 'string' }, description: '外显子序列' },
            introns: { type: 'array', items: { type: 'string' }, description: '内含子序列' },
            terminator: { type: 'string', description: '终止子序列' }
          },
          description: '基因结构'
        },
        transcriptionFactors: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', description: '转录因子名称' },
              bindingSite: { type: 'string', description: '结合位点' }
            },
            required: ['name']
          },
          description: '转录因子'
        },
        title: {
          type: 'string',
          description: '可视化标题'
        }
      },
      required: ['dnaTemplate', 'rnaSequence', 'title']
    },
    defaultValues: {
      dnaTemplate: 'ATGCGATCG',
      rnaSequence: 'AUGCGAUCG',
      geneStructure: {
        promoter: 'TATAAT',
        exons: ['ATG', 'CGA', 'TCG'],
        introns: ['NNNN'],
        terminator: 'ATATAT'
      },
      transcriptionFactors: [
        { name: 'TATA结合蛋白', bindingSite: 'TATAAT' },
        { name: 'RNA聚合酶II' }
      ],
      title: '转录过程'
    },
    a2uiTemplate: {
      type: 'card',
      id: 'viz_transcription',
      children: [
        {
          type: 'ahatutor-transcription',
          id: 'transcription_component',
          properties: {
            dnaTemplate: '${dnaTemplate}',
            rnaSequence: '${rnaSequence}',
            geneStructure: '${geneStructure}',
            transcriptionFactors: '${transcriptionFactors}',
            title: '${title}'
          }
        }
      ]
    }
  },

  // 翻译可视化模板
  {
    templateId: 'translation_v1',
    visualizationType: 'diagram',
    complexity: 'high',
    schema: {
      type: 'object',
      properties: {
        mRNASequence: {
          type: 'string',
          description: 'mRNA序列'
        },
        proteinSequence: {
          type: 'array',
          items: { type: 'string' },
          description: '氨基酸序列'
        },
        codons: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              codon: { type: 'string', description: '密码子' },
              aminoAcid: { type: 'string', description: '氨基酸' },
              position: { type: 'number', description: '位置' }
            },
            required: ['codon', 'aminoAcid', 'position']
          },
          description: '密码子-氨基酸对应关系'
        },
        trnas: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              anticodon: { type: 'string', description: '反密码子' },
              aminoAcid: { type: 'string', description: '携带的氨基酸' }
            },
            required: ['anticodon', 'aminoAcid']
          },
          description: 'tRNA信息'
        },
        title: {
          type: 'string',
          description: '可视化标题'
        }
      },
      required: ['mRNASequence', 'proteinSequence', 'codons', 'title']
    },
    defaultValues: {
      mRNASequence: 'AUGCCGUAA',
      proteinSequence: ['甲硫氨酸', '脯氨酸', '终止'],
      codons: [
        { codon: 'AUG', aminoAcid: '甲硫氨酸', position: 0 },
        { codon: 'CCG', aminoAcid: '脯氨酸', position: 1 },
        { codon: 'UAA', aminoAcid: '终止', position: 2 }
      ],
      trnas: [
        { anticodon: 'UAC', aminoAcid: '甲硫氨酸' },
        { anticodon: 'GGC', aminoAcid: '脯氨酸' }
      ],
      title: '翻译过程'
    },
    a2uiTemplate: {
      type: 'card',
      id: 'viz_translation',
      children: [
        {
          type: 'ahatutor-translation',
          id: 'translation_component',
          properties: {
            mRNASequence: '${mRNASequence}',
            proteinSequence: '${proteinSequence}',
            codons: '${codons}',
            trnas: '${trnas}',
            title: '${title}'
          }
        }
      ]
    }
  },

  // 基因结构可视化模板
  {
    templateId: 'gene_structure_v1',
    visualizationType: 'diagram',
    complexity: 'medium',
    schema: {
      type: 'object',
      properties: {
        geneName: {
          type: 'string',
          description: '基因名称'
        },
        geneComponents: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              type: { type: 'string', enum: ['promoter', 'exon', 'intron', 'enhancer', 'silencer', 'terminator'], description: '组件类型' },
              sequence: { type: 'string', description: '序列' },
              length: { type: 'number', description: '长度' },
              position: { type: 'object', properties: { start: { type: 'number' }, end: { type: 'number' } }, description: '位置' },
              function: { type: 'string', description: '功能描述' }
            },
            required: ['type', 'length', 'position']
          },
          description: '基因组件'
        },
        regulatoryElements: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', description: '调控元件名称' },
              type: { type: 'string', description: '类型' },
              position: { type: 'number', description: '位置' },
              effect: { type: 'string', description: '作用效果' }
            },
            required: ['name', 'type', 'position']
          },
          description: '调控元件'
        },
        title: {
          type: 'string',
          description: '可视化标题'
        }
      },
      required: ['geneName', 'geneComponents', 'title']
    },
    defaultValues: {
      geneName: '胰岛素基因',
      geneComponents: [
        { type: 'promoter', length: 100, position: { start: 0, end: 100 }, function: '启动子，结合转录因子' },
        { type: 'exon', sequence: 'ATG...', length: 150, position: { start: 100, end: 250 }, function: '外显子1，编码区' },
        { type: 'intron', sequence: 'GT...AG', length: 500, position: { start: 250, end: 750 }, function: '内含子1，被剪接去除' },
        { type: 'exon', sequence: 'CGA...', length: 200, position: { start: 750, end: 950 }, function: '外显子2，编码区' },
        { type: 'terminator', length: 50, position: { start: 950, end: 1000 }, function: '终止子，终止转录' }
      ],
      regulatoryElements: [
        { name: '增强子1', type: 'enhancer', position: -500, effect: '增强转录' },
        { name: '沉默子1', type: 'silencer', position: -200, effect: '抑制转录' }
      ],
      title: '基因结构'
    },
    a2uiTemplate: {
      type: 'card',
      id: 'viz_gene_structure',
      children: [
        {
          type: 'ahatutor-gene-structure',
          id: 'gene_structure_component',
          properties: {
            geneName: '${geneName}',
            geneComponents: '${geneComponents}',
            regulatoryElements: '${regulatoryElements}',
            title: '${title}'
          }
        }
      ]
    }
  },

  // CRISPR可视化模板
  {
    templateId: 'crispr_v1',
    visualizationType: 'diagram',
    complexity: 'high',
    schema: {
      type: 'object',
      properties: {
        targetGene: {
          type: 'string',
          description: '目标基因'
        },
        targetSequence: {
          type: 'string',
          description: '目标序列'
        },
        gRNASequence: {
          type: 'string',
          description: 'gRNA序列'
        },
        pAMSequence: {
          type: 'string',
          description: 'PAM序列'
        },
        editingProcess: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              step: { type: 'number', description: '步骤编号' },
              description: { type: 'string', description: '步骤描述' },
              keyComponents: {
                type: 'array',
                items: { type: 'string' },
                description: '关键组件'
              }
            },
            required: ['step', 'description']
          },
          description: '编辑过程'
        },
        outcome: {
          type: 'string',
          description: '编辑结果'
        },
        title: {
          type: 'string',
          description: '可视化标题'
        }
      },
      required: ['targetGene', 'targetSequence', 'gRNASequence', 'pAMSequence', 'title']
    },
    defaultValues: {
      targetGene: 'CFTR基因',
      targetSequence: 'ATCGATCGATCG',
      gRNASequence: 'AUCGAUCG',
      pAMSequence: 'CGG',
      editingProcess: [
        { step: 1, description: 'gRNA-Cas9复合物识别目标序列', keyComponents: ['gRNA', 'Cas9', 'PAM序列'] },
        { step: 2, description: 'Cas9切割DNA双链', keyComponents: ['Cas9', 'DNA双链断裂'] },
        { step: 3, description: '细胞修复DNA', keyComponents: ['NHEJ修复', 'HDR修复'] }
      ],
      outcome: '基因敲除或精确编辑',
      title: 'CRISPR基因编辑'
    },
    a2uiTemplate: {
      type: 'card',
      id: 'viz_crispr',
      children: [
        {
          type: 'ahatutor-crispr',
          id: 'crispr_component',
          properties: {
            targetGene: '${targetGene}',
            targetSequence: '${targetSequence}',
            gRNASequence: '${gRNASequence}',
            pAMSequence: '${pAMSequence}',
            editingProcess: '${editingProcess}',
            outcome: '${outcome}',
            title: '${title}'
          }
        }
      ]
    }
  },

  // 三体综合征可视化模板
  {
    templateId: 'trisomy_v1',
    visualizationType: 'diagram',
    complexity: 'medium',
    schema: {
      type: 'object',
      properties: {
        chromosomeNumber: {
          type: 'number',
          description: '异常染色体编号'
        },
        conditionName: {
          type: 'string',
          description: '疾病名称'
        },
        normalKaryotype: {
          type: 'string',
          description: '正常核型'
        },
        abnormalKaryotype: {
          type: 'string',
          description: '异常核型'
        },
        cause: {
          type: 'string',
          description: '成因'
        },
        symptoms: {
          type: 'array',
          items: { type: 'string' },
          description: '症状'
        },
        title: {
          type: 'string',
          description: '可视化标题'
        }
      },
      required: ['chromosomeNumber', 'conditionName', 'title']
    },
    defaultValues: {
      chromosomeNumber: 21,
      conditionName: '唐氏综合征（21三体）',
      normalKaryotype: '46,XX或46,XY',
      abnormalKaryotype: '47,XX,+21或47,XY,+21',
      cause: '减数分裂时第21号染色体不分离',
      symptoms: ['智力障碍', '面部特征异常', '心脏缺陷', '肌肉张力低下'],
      title: '三体综合征'
    },
    a2uiTemplate: {
      type: 'card',
      id: 'viz_trisomy',
      children: [
        {
          type: 'ahatutor-trisomy',
          id: 'trisomy_component',
          properties: {
            chromosomeNumber: '${chromosomeNumber}',
            conditionName: '${conditionName}',
            normalKaryotype: '${normalKaryotype}',
            abnormalKaryotype: '${abnormalKaryotype}',
            cause: '${cause}',
            symptoms: '${symptoms}',
            title: '${title}'
          }
        }
      ]
    }
  },

  // 有丝分裂可视化模板
  {
    templateId: 'mitosis_v1',
    visualizationType: 'animation',
    complexity: 'high',
    schema: {
      type: 'object',
      properties: {
        stages: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', description: '阶段ID' },
              name: { type: 'string', description: '阶段名称' },
              description: { type: 'string', description: '阶段描述' },
              keyEvents: {
                type: 'array',
                items: { type: 'string' },
                description: '关键事件'
              },
              chromosomeState: { type: 'string', description: '染色体状态' },
              duration: { type: 'number', description: '持续时间（秒）' }
            },
            required: ['id', 'name', 'description', 'keyEvents']
          },
          description: '有丝分裂阶段'
        },
        cellType: {
          type: 'string',
          description: '细胞类型（体细胞）'
        },
        ploidyChange: {
          type: 'object',
          properties: {
            start: { type: 'string', description: '起始倍性' },
            end: { type: 'string', description: '结束倍性' }
          },
          description: '倍性变化'
        },
        title: {
          type: 'string',
          description: '可视化标题'
        }
      },
      required: ['stages', 'title']
    },
    defaultValues: {
      stages: [
        {
          id: 'prophase',
          name: '前期',
          description: '染色体凝聚，核膜消失',
          keyEvents: ['染色体凝聚', '核膜消失', '纺锤体形成'],
          chromosomeState: '染色质→染色体',
          duration: 3
        },
        {
          id: 'metaphase',
          name: '中期',
          description: '染色体排列在赤道板',
          keyEvents: ['染色体排列在赤道板', '纺锤丝附着'],
          chromosomeState: '排列整齐',
          duration: 2
        },
        {
          id: 'anaphase',
          name: '后期',
          description: '姐妹染色单体分离',
          keyEvents: ['姐妹染色单体分离', '向两极移动'],
          chromosomeState: '分离中',
          duration: 2
        },
        {
          id: 'telophase',
          name: '末期',
          description: '核膜重建，细胞质分裂',
          keyEvents: ['核膜重建', '细胞质分裂'],
          chromosomeState: '染色质',
          duration: 2
        }
      ],
      cellType: '体细胞',
      ploidyChange: { start: '二倍体(2n)', end: '二倍体(2n)' },
      title: '有丝分裂过程'
    },
    a2uiTemplate: {
      type: 'card',
      id: 'viz_mitosis',
      children: [
        {
          type: 'ahatutor-mitosis',
          id: 'mitosis_component',
          properties: {
            stages: '${stages}',
            cellType: '${cellType}',
            ploidyChange: '${ploidyChange}',
            title: '${title}'
          }
        }
      ]
    }
  },

  // 等位基因可视化模板
  {
    templateId: 'allele_v1',
    visualizationType: 'diagram',
    complexity: 'low',
    schema: {
      type: 'object',
      properties: {
        gene: {
          type: 'string',
          description: '基因名称'
        },
        alleles: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              symbol: { type: 'string', description: '等位基因符号' },
              type: { type: 'string', enum: ['dominant', 'recessive', 'codominant', 'incomplete'], description: '类型' },
              phenotype: { type: 'string', description: '表型' },
              dnaSequence: { type: 'string', description: 'DNA序列差异' }
            },
            required: ['symbol', 'type', 'phenotype']
          },
          description: '等位基因列表'
        },
        genotypes: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              genotype: { type: 'string', description: '基因型' },
              phenotype: { type: 'string', description: '表型' },
              probability: { type: 'number', description: '概率（可选）' }
            },
            required: ['genotype', 'phenotype']
          },
          description: '可能的基因型组合'
        },
        title: {
          type: 'string',
          description: '可视化标题'
        }
      },
      required: ['gene', 'alleles', 'title']
    },
    defaultValues: {
      gene: '花色基因',
      alleles: [
        { symbol: 'A', type: 'dominant', phenotype: '红色花', dnaSequence: 'ATG...' },
        { symbol: 'a', type: 'recessive', phenotype: '白色花', dnaSequence: 'ATa...' }
      ],
      genotypes: [
        { genotype: 'AA', phenotype: '红色花' },
        { genotype: 'Aa', phenotype: '红色花' },
        { genotype: 'aa', phenotype: '白色花' }
      ],
      title: '等位基因'
    },
    a2uiTemplate: {
      type: 'card',
      id: 'viz_allele',
      children: [
        {
          type: 'ahatutor-allele',
          id: 'allele_component',
          properties: {
            gene: '${gene}',
            alleles: '${alleles}',
            genotypes: '${genotypes}',
            title: '${title}'
          }
        }
      ]
    }
  },

  {
    templateId: 'dna_replication_okazaki_v1',
    visualizationType: 'diagram',
    complexity: 'medium',
    schema: {
      type: 'object',
      properties: {
        stage: {
          type: 'string',
          enum: ['initiation', 'elongation', 'termination', 'complete'],
          description: '复制阶段'
        },
        showLeadingStrand: {
          type: 'boolean',
          description: '是否显示前导链'
        },
        showLaggingStrand: {
          type: 'boolean',
          description: '是否显示后随链'
        },
        showOkazakiFragments: {
          type: 'boolean',
          description: '是否显示冈崎片段'
        },
        showEnzymes: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['helicase', 'primase', 'polymerase', 'ligase', 'ssb']
          },
          description: '要显示的酶'
        },
        okazakiFragments: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', description: '片段ID' },
              length: { type: 'number', description: '片段长度（核苷酸）' },
              hasPrimer: { type: 'boolean', description: '是否含RNA引物' },
              position: { type: 'number', description: '位置' }
            },
            required: ['id', 'length']
          },
          description: '冈崎片段数据'
        },
        organism: {
          type: 'string',
          enum: ['eukaryotic', 'prokaryotic'],
          description: '生物类型'
        },
        title: {
          type: 'string',
          description: '可视化标题'
        },
        description: {
          type: 'string',
          description: '描述文本'
        }
      },
      required: ['stage', 'organism', 'title', 'description']
    },
    defaultValues: {
      stage: 'elongation',
      showLeadingStrand: true,
      showLaggingStrand: true,
      showOkazakiFragments: true,
      showEnzymes: ['helicase', 'primase', 'polymerase', 'ligase'],
      okazakiFragments: [
        { id: 'OF1', length: 150, hasPrimer: true, position: 1 },
        { id: 'OF2', length: 180, hasPrimer: true, position: 2 },
        { id: 'OF3', length: 160, hasPrimer: true, position: 3 }
      ],
      organism: 'eukaryotic',
      title: '冈崎片段合成过程',
      description: '展示冈崎片段在后随链上的合成过程：由于DNA聚合酶只能沿5\'→3\'方向合成，后随链必须分段合成冈崎片段，最后由DNA连接酶连接成完整的链。'
    },
    a2uiTemplate: {
      type: 'card',
      id: 'viz_dna_replication_okazaki',
      children: [
        {
          type: 'ahatutor-dna-replication',
          id: 'dna_replication_component',
          properties: {
            stage: '${stage}',
            showLeadingStrand: '${showLeadingStrand}',
            showLaggingStrand: '${showLaggingStrand}',
            showOkazakiFragments: '${showOkazakiFragments}',
            showEnzymes: '${showEnzymes}',
            okazakiFragments: '${okazakiFragments}',
            organism: '${organism}',
            title: '${title}',
            description: '${description}'
          }
        }
      ]
    }
  },

  // 测交分析图模板
  {
    templateId: 'test_cross_v1',
    visualizationType: 'test_cross',
    complexity: 'medium',
    schema: {
      type: 'object',
      properties: {
        unknownGenotype: {
          type: 'object',
          properties: {
            symbol: { type: 'string', description: '未知基因型符号' },
            genotype: { type: 'string', description: '基因型（如 ? 或 A?）' },
            description: { type: 'string', description: '个体描述' }
          },
          required: ['symbol', 'genotype'],
          description: '待测个体基因型'
        },
        testParent: {
          type: 'object',
          properties: {
            symbol: { type: 'string', description: '测交亲本符号' },
            genotype: { type: 'string', description: '测交亲本基因型（通常是纯合隐性）' },
            phenotype: { type: 'string', description: '表型' }
          },
          required: ['symbol', 'genotype', 'phenotype'],
          description: '测交亲本信息'
        },
        crossResults: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              offspringGenotype: { type: 'string', description: '后代基因型' },
              offspringPhenotype: { type: 'string', description: '后代表型' },
              count: { type: 'number', description: '个体数量' },
              percentage: { type: 'number', description: '百分比' }
            },
            required: ['offspringGenotype', 'offspringPhenotype', 'count']
          },
          description: '杂交结果统计'
        },
        conclusion: {
          type: 'object',
          properties: {
            deducedGenotype: { type: 'string', description: '推断出的基因型' },
            confidence: { type: 'string', description: '推断置信度' },
            explanation: { type: 'string', description: '解释说明' }
          },
          required: ['deducedGenotype', 'explanation'],
          description: '结论分析'
        },
        title: {
          type: 'string',
          description: '可视化标题'
        }
      },
      required: ['unknownGenotype', 'testParent', 'crossResults', 'conclusion', 'title']
    },
    defaultValues: {
      unknownGenotype: {
        symbol: '?',
        genotype: 'A?',
        description: '待测个体，表现显性性状'
      },
      testParent: {
        symbol: 'aa',
        genotype: 'aa',
        phenotype: '隐性纯合'
      },
      crossResults: [
        { offspringGenotype: 'Aa', offspringPhenotype: '显性', count: 48, percentage: 50 },
        { offspringGenotype: 'aa', offspringPhenotype: '隐性', count: 48, percentage: 50 }
      ],
      conclusion: {
        deducedGenotype: 'Aa',
        confidence: '高',
        explanation: '测交后代中显性与隐性比例为1:1，说明待测个体为杂合子(Aa)'
      },
      title: '测交分析'
    },
    a2uiTemplate: {
      type: 'card',
      id: 'viz_test_cross',
      children: [
        {
          type: 'ahatutor-test-cross',
          id: 'test_cross_component',
          properties: {
            unknownGenotype: '${unknownGenotype}',
            testParent: '${testParent}',
            crossResults: '${crossResults}',
            conclusion: '${conclusion}',
            title: '${title}'
          }
        }
      ]
    }
  },

  // 三点测交图模板
  {
    templateId: 'three_point_test_cross_v1',
    visualizationType: 'three_point_test_cross',
    complexity: 'high',
    schema: {
      type: 'object',
      properties: {
        genes: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', description: '基因名称' },
              symbol: { type: 'string', description: '基因符号' },
              alleles: {
                type: 'array',
                items: { type: 'string' },
                description: '等位基因列表'
              }
            },
            required: ['name', 'symbol', 'alleles']
          },
          description: '三个基因的信息'
        },
        parentalGenotypes: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', description: '亲本ID' },
              genotype: { type: 'string', description: '基因型（如 A+B+C+）' },
              type: { type: 'string', enum: ['parent', 'trihybrid'], description: '亲本类型' }
            },
            required: ['id', 'genotype', 'type']
          },
          description: '亲本基因型'
        },
        offspringData: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              genotype: { type: 'string', description: '后代基因型' },
              count: { type: 'number', description: '个体数量' },
              percentage: { type: 'number', description: '百分比' },
              phenotypeDescription: { type: 'string', description: '表型描述' }
            },
            required: ['genotype', 'count', 'percentage']
          },
          description: '后代数据'
        },
        recombinationFrequencies: {
          type: 'object',
          properties: {
            region1_2: {
              type: 'object',
              properties: {
                distance: { type: 'number', description: '基因间距离（cM）' },
                rf: { type: 'number', description: '重组率（%）' }
              },
              required: ['distance', 'rf']
            },
            region2_3: {
              type: 'object',
              properties: {
                distance: { type: 'number', description: '基因间距离（cM）' },
                rf: { type: 'number', description: '重组率（%）' }
              },
              required: ['distance', 'rf']
            },
            region1_3: {
              type: 'object',
              properties: {
                distance: { type: 'number', description: '基因间距离（cM）' },
                rf: { type: 'number', description: '重组率（%）' }
              },
              required: ['distance', 'rf']
            }
          },
          description: '重组频率数据'
        },
        geneOrder: {
          type: 'string',
          description: '推断的基因顺序（如 A-B-C）'
        },
        chromosomeMap: {
          type: 'object',
          properties: {
            scale: { type: 'number', description: '比例尺' },
            unit: { type: 'string', description: '单位（如 cM）' },
            positions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  gene: { type: 'string', description: '基因名称' },
                  position: { type: 'number', description: '位置' }
                },
                required: ['gene', 'position']
              },
              description: '基因位置'
            }
          },
          description: '染色体图谱'
        },
        title: {
          type: 'string',
          description: '可视化标题'
        }
      },
      required: ['genes', 'parentalGenotypes', 'offspringData', 'recombinationFrequencies', 'title']
    },
    defaultValues: {
      genes: [
        { name: '基因A', symbol: 'A', alleles: ['A', 'a'] },
        { name: '基因B', symbol: 'B', alleles: ['B', 'b'] },
        { name: '基因C', symbol: 'C', alleles: ['C', 'c'] }
      ],
      parentalGenotypes: [
        { id: 'P1', genotype: 'A+B+C+', type: 'parent' },
        { id: 'P2', genotype: 'a+b+c-', type: 'parent' }
      ],
      offspringData: [
        { genotype: 'A+B+C+', count: 400, percentage: 40, phenotypeDescription: '三显性' },
        { genotype: 'a+b+c-', count: 400, percentage: 40, phenotypeDescription: '三隐性' },
        { genotype: 'A+b+c-', count: 50, percentage: 5, phenotypeDescription: '单显性' },
        { genotype: 'a+B+C+', count: 50, percentage: 5, phenotypeDescription: '双显性' },
        { genotype: 'A+B+c-', count: 40, percentage: 4, phenotypeDescription: '双显性' },
        { genotype: 'a+b+C+', count: 40, percentage: 4, phenotypeDescription: '双显性' },
        { genotype: 'A+b+C+', count: 10, percentage: 1, phenotypeDescription: '三显性（重组）' },
        { genotype: 'a+B+c-', count: 10, percentage: 1, phenotypeDescription: '单显性（重组）' }
      ],
      recombinationFrequencies: {
        region1_2: { distance: 5, rf: 5 },
        region2_3: { distance: 10, rf: 10 },
        region1_3: { distance: 15, rf: 15 }
      },
      geneOrder: 'A - B - C',
      chromosomeMap: {
        scale: 100,
        unit: 'cM',
        positions: [
          { gene: 'A', position: 0 },
          { gene: 'B', position: 5 },
          { gene: 'C', position: 15 }
        ]
      },
      title: '三点测交分析'
    },
    a2uiTemplate: {
      type: 'card',
      id: 'viz_three_point_test_cross',
      children: [
        {
          type: 'ahatutor-three-point-test-cross',
          id: 'three_point_test_cross_component',
          properties: {
            genes: '${genes}',
            parentalGenotypes: '${parentalGenotypes}',
            offspringData: '${offspringData}',
            recombinationFrequencies: '${recombinationFrequencies}',
            geneOrder: '${geneOrder}',
            chromosomeMap: '${chromosomeMap}',
            title: '${title}'
          }
        }
      ]
    }
  }
];

/**
 * 根据可视化类型获取A2UI模板
 */
export const A2UITemplates = A2UI_TEMPLATES;

export function getA2UITemplate(visualizationType: VisualizationSuggestion['type']): A2UITemplate | undefined {
  return A2UI_TEMPLATES.find(template => template.visualizationType === visualizationType);
}

/**
 * 根据模板ID获取A2UI模板
 */
export function getA2UITemplateById(templateId: string): A2UITemplate | undefined {
  return A2UI_TEMPLATES.find(template => template.templateId === templateId);
}

/**
 * 构建A2UI载荷
 */
export function buildA2UIPayload(template: A2UITemplate, data: Record<string, any>): A2UIPayload {
  // 替换模板中的变量
  const replaceVariables = (obj: any): any => {
    if (typeof obj === 'string') {
      // 处理变量替换，如 "${maleGametes}"
      const variableMatch = obj.match(/\$\{(.*?)\}/);
      if (variableMatch) {
        const variableName = variableMatch[1];
        return data[variableName] !== undefined ? data[variableName] : obj;
      }
      return obj;
    }
    if (Array.isArray(obj)) {
      return obj.map(replaceVariables);
    }
    if (typeof obj === 'object' && obj !== null) {
      const newObj: Record<string, any> = {};
      for (const [key, value] of Object.entries(obj)) {
        newObj[key] = replaceVariables(value);
      }
      return newObj;
    }
    return obj;
  };

  // 构建surface（组件树）
  const surface = replaceVariables(template.a2uiTemplate) as A2UIComponent;

  // 扁平化组件树并构建组件映射
  const components: Record<string, A2UIComponent> = {};
  let rootId = surface.id || 'root';

  const flattenComponentTree = (component: any, parentPath: string = ''): string => {
    const componentId = component.id || `${parentPath}_${component.type}_${Date.now()}`;

    // 确保组件有 ID
    if (!component.id) {
      component.id = componentId;
    }

    // 保存组件到映射中
    components[componentId] = {
      type: component.type,
      id: componentId,
      properties: component.properties || {},
      metadata: component.metadata,
      dataRef: component.dataRef,
    };

    // 处理子组件
    if (component.children && Array.isArray(component.children)) {
      const childIds: string[] = [];
      component.children.forEach((child: any) => {
        childIds.push(flattenComponentTree(child, componentId));
      });
      // 更新组件的 children 为 ID 数组
      components[componentId].children = childIds;
    }

    return componentId;
  };

  // 扁平化组件树
  rootId = flattenComponentTree(surface);

  // 构建dataModel（独立的数据模型）
  const dataModel: Record<string, any> = {};

  // 为每个有dataRef的组件添加数据
  for (const [componentId, component] of Object.entries(components)) {
    if (component.dataRef && component.properties?.dataRef) {
      const refKey = component.properties.dataRef;
      dataModel[componentId] = data[refKey] || {};
    } else if (component.properties) {
      // 如果没有dataRef，直接使用所有properties作为数据
      dataModel[componentId] = { ...component.properties };
    }
  }

  // 提取知识点内容并添加到dataModel
  const knowledgePointFields = ['keyPoints', 'understandingPoints', 'commonMistakes', 'checkQuestions'];
  const knowledgePoints: Record<string, any> = {};

  for (const field of knowledgePointFields) {
    if (data[field]) {
      knowledgePoints[field] = data[field];
    }
  }

  // 如果有知识点内容，将其添加到dataModel中
  if (Object.keys(knowledgePoints).length > 0) {
    // 添加到根级别，便于前端访问
    dataModel['_knowledgePoints'] = knowledgePoints;

    // 同时也添加到每个组件中，方便组件内部使用
    for (const componentId of Object.keys(components)) {
      if (!dataModel[componentId]._knowledgePoints) {
        dataModel[componentId]._knowledgePoints = knowledgePoints;
      }
    }
  }

  // 构建完整的A2UI Payload（符合A2UI规范 - 扁平化结构）
  const payload: A2UIPayload = {
    version: '1.0',
    surface: {
      rootId,
      components,
    },
    dataModel,
    metadata: {
      templateId: template.templateId,
      generatedAt: new Date().toISOString(),
      version: '1.0',
    },
  };

  return payload;
}
