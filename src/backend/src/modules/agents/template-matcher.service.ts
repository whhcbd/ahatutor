import { Injectable, Logger } from '@nestjs/common';
import { A2UITemplates, type A2UITemplate } from './data/a2ui-templates.data';

interface TemplateMatchRule {
  templateId: string;
  keywords: string[];
  concepts: string[];
  priority: number;
  requiredParameters: string[];
  examples: string[];
}

interface QuestionAnalysis {
  extractedConcept: string | null;
  matchedKeywords: string[];
  confidence: number;
}

interface TemplateMatchResult {
  matched: boolean;
  template: A2UITemplate | null;
  templateId: string | null;
  confidence: number;
  analysis: QuestionAnalysis;
  requiredParameters: string[];
  suggestedParameters: Record<string, any>;
}

@Injectable()
export class TemplateMatcherService {
  private readonly logger = new Logger(TemplateMatcherService.name);

  private matchRules: TemplateMatchRule[] = [
    {
      templateId: 'punnett_square_v1',
      keywords: ['punnett', '杂交', '配子', '基因型', '表型', '分离比', '遗传比例', '杂交实验'],
      concepts: ['孟德尔定律', '分离定律', '自由组合定律', '单基因遗传', '双基因遗传'],
      priority: 10,
      requiredParameters: ['maleGametes', 'femaleGametes', 'parentalCross', 'offspring'],
      examples: ['孟德尔杂交实验', 'Aa × aa杂交', 'Punnett方格表', '基因型分离比']
    },
    {
      templateId: 'inheritance_path_v1',
      keywords: ['遗传路径', '传递', '多世代', '遗传模式'],
      concepts: ['常染色体遗传', '性染色体遗传', 'X连锁遗传', 'Y连锁遗传'],
      priority: 8,
      requiredParameters: ['generations', 'inheritance', 'explanation'],
      examples: ['血友病遗传路径', '亨廷顿舞蹈病遗传', '囊性纤维化遗传', '色盲遗传']
    },
    {
      templateId: 'pedigree_chart_v1',
      keywords: ['系谱', '系谱图', '家族遗传', '遗传病', '家系图', '遗传系谱', '血友病', '色盲', '遗传图谱'],
      concepts: ['系谱图', '家系图', '遗传病系谱', 'X连锁遗传', '常染色体遗传'],
      priority: 9,
      requiredParameters: ['individuals', 'relationships', 'inheritance', 'explanation'],
      examples: ['血友病系谱', '色盲家系图', '亨廷顿舞蹈病系谱', '囊性纤维化系谱']
    },
    {
      templateId: 'dna_replication_okazaki_v1',
      keywords: ['冈崎片段', '后随链', '前导链', 'dna复制', '复制叉', '半保留复制', 'rna引物', '连接酶'],
      concepts: ['DNA复制', '半不连续复制', '冈崎片段', '前导链', '后随链'],
      priority: 9,
      requiredParameters: ['stage', 'showLeadingStrand', 'showLaggingStrand', 'showOkazakiFragments', 'organism'],
      examples: ['冈崎片段合成', '冈崎片段', 'DNA半保留复制', '复制叉结构']
    },
    {
      templateId: 'dna_replication_v1',
      keywords: ['dna复制', '复制叉', '前导链', '后随链', '半保留复制', '复制酶', '聚合酶'],
      concepts: ['DNA复制', '半不连续复制', '前导链', '后随链'],
      priority: 7,
      requiredParameters: ['stage', 'showLeadingStrand', 'showLaggingStrand', 'showOkazakiFragments'],
      examples: ['DNA半保留复制', '复制叉结构', 'DNA复制过程']
    },
    {
      templateId: 'transcription_v1',
      keywords: ['转录', 'rna聚合酶', '启动子', 'mrna', '转录过程', '模板链'],
      concepts: ['转录', 'RNA聚合酶', '启动子', '终止子', 'mRNA合成'],
      priority: 7,
      requiredParameters: ['dnaTemplate', 'rnaPolymerase', 'promoter', 'transcript'],
      examples: ['基因转录过程', 'mRNA合成', 'RNA聚合酶作用']
    },
    {
      templateId: 'translation_v1',
      keywords: ['翻译', '核糖体', '密码子', '氨基酸', 'trna', '多肽链', '蛋白质合成'],
      concepts: ['翻译', '核糖体', '密码子', 'tRNA', '蛋白质合成'],
      priority: 7,
      requiredParameters: ['mrna', 'ribosome', 'trna', 'aminoAcids', 'polypeptide'],
      examples: ['蛋白质翻译过程', '核糖体合成', '密码子翻译']
    },
    {
      templateId: 'gene_structure_v1',
      keywords: ['基因结构', '外显子', '内含子', '启动子', '增强子', '编码区', '非编码区'],
      concepts: ['基因结构', '外显子', '内含子', '启动子', '增强子'],
      priority: 6,
      requiredParameters: ['geneName', 'exons', 'introns', 'promoter', 'utr'],
      examples: ['基因结构示意图', '外显子内含子结构', '启动子区域']
    },
    {
      templateId: 'chromosome_behavior_v1',
      keywords: ['染色体', '同源染色体', '减数分裂', '有丝分裂', '联会', '交换', '配对'],
      concepts: ['染色体行为', '减数分裂', '有丝分裂', '同源染色体', '交叉'],
      priority: 6,
      requiredParameters: ['organism', 'chromosomeNumber', 'stages', 'showCrossover'],
      examples: ['减数分裂过程', '染色体配对', '同源染色体交换']
    },
    {
      templateId: 'crispr_v1',
      keywords: ['crispr', '基因编辑', 'gRNA', 'cas9', 'sgrna', '基因敲除'],
      concepts: ['CRISPR', '基因编辑', 'gRNA', 'Cas9', '基因敲除'],
      priority: 5,
      requiredParameters: ['targetGene', 'gRNA', 'cas9', 'editType'],
      examples: ['CRISPR基因编辑', 'Cas9切割', 'gRNA设计']
    },
    {
      templateId: 'trisomy_v1',
      keywords: ['三体', '唐氏综合征', '染色体异常', '非整倍体', '额外染色体'],
      concepts: ['染色体数目变异', '三体综合征', '非整倍体', '唐氏综合征'],
      priority: 5,
      requiredParameters: ['chromosomeNumber', 'condition', 'mechanism', 'symptoms'],
      examples: ['唐氏综合征', '21三体', '18三体']
    },
    {
      templateId: 'mitosis_v1',
      keywords: ['有丝分裂', '细胞分裂', '间期', '前期', '中期', '后期', '末期'],
      concepts: ['有丝分裂', '细胞周期', '染色体分离', '细胞质分裂'],
      priority: 5,
      requiredParameters: ['organism', 'stages', 'showChromosomes', 'showCentrosomes'],
      examples: ['有丝分裂过程', '细胞分裂周期', '染色体分离']
    },
    {
      templateId: 'allele_v1',
      keywords: ['等位基因', '显性', '隐性', '纯合子', '杂合子', '基因型'],
      concepts: ['等位基因', '显性', '隐性', '基因型', '表型'],
      priority: 4,
      requiredParameters: ['gene', 'alleles', 'genotypes', 'phenotypes'],
      examples: ['等位基因概念', '显性隐性关系', '基因型表型']
    }
  ];

  constructor() {
    this.logger.log('TemplateMatcherService initialized with rules for ' + this.matchRules.length + ' templates');
  }

  async matchTemplate(question: string, concept?: string): Promise<TemplateMatchResult> {
    const lowerQuestion = question.toLowerCase();
    
    const directMatch = this.findDirectMatch(lowerQuestion);
    if (directMatch) {
      this.logger.log(`Direct match found: ${directMatch.templateId}`);
      const suggestedParameters = this.generateSuggestedParameters(question, directMatch);
      return {
        matched: true,
        template: directMatch,
        templateId: directMatch.templateId,
        confidence: 1.0,
        analysis: {
          extractedConcept: directMatch.templateId,
          matchedKeywords: [],
          confidence: 1.0
        },
        requiredParameters: directMatch.schema.required,
        suggestedParameters
      };
    }
    
    const analysis = this.analyzeQuestion(question, concept);
    
    if (analysis.confidence < 0.2) {
      this.logger.debug('Low confidence match for question: ' + question.substring(0, 50));
      return {
        matched: false,
        template: null,
        templateId: null,
        confidence: analysis.confidence,
        analysis,
        requiredParameters: [],
        suggestedParameters: {}
      };
    }

    const matchedTemplate = this.findBestTemplate(analysis);
    
    if (!matchedTemplate) {
      this.logger.debug('No matching template found for question: ' + question.substring(0, 50));
      return {
        matched: false,
        template: null,
        templateId: null,
        confidence: analysis.confidence,
        analysis,
        requiredParameters: [],
        suggestedParameters: {}
      };
    }

    const suggestedParameters = this.generateSuggestedParameters(question, matchedTemplate);

    this.logger.log(`Matched template ${matchedTemplate.templateId} with confidence ${analysis.confidence.toFixed(2)}`);

    return {
      matched: true,
      template: matchedTemplate,
      templateId: matchedTemplate.templateId,
      confidence: analysis.confidence,
      analysis,
      requiredParameters: matchedTemplate.schema.required,
      suggestedParameters
    };
  }

  private findDirectMatch(question: string): A2UITemplate | null {
    for (const rule of this.matchRules) {
      for (const keyword of rule.keywords) {
        if (question.includes(keyword.toLowerCase())) {
          const template = this.getTemplateById(rule.templateId);
          if (template) {
            return template;
          }
        }
      }
    }
    return null;
  }

  private analyzeQuestion(question: string, concept?: string): QuestionAnalysis {
    const lowerQuestion = question.toLowerCase();
    const extractedConcept = concept || this.extractConceptFromQuestion(lowerQuestion);
    
    let matchedKeywords: string[] = [];
    let conceptMatchScore = 0;

    for (const rule of this.matchRules) {
      for (const keyword of rule.keywords) {
        if (lowerQuestion.includes(keyword.toLowerCase())) {
          if (!matchedKeywords.includes(keyword)) {
            matchedKeywords.push(keyword);
          }
        }
      }
      
      if (extractedConcept && rule.concepts.some(c => c.toLowerCase().includes(extractedConcept.toLowerCase()))) {
        conceptMatchScore = Math.max(conceptMatchScore, rule.priority);
      }
    }

    const keywordScore = matchedKeywords.length * 10;
    const totalScore = keywordScore + conceptMatchScore;
    const confidence = Math.min(totalScore / 100, 1.0);

    this.logger.debug(`Question analysis - Concept: ${extractedConcept}, Keywords: ${matchedKeywords.length}, KeywordScore: ${keywordScore}, ConceptScore: ${conceptMatchScore}, Confidence: ${confidence.toFixed(2)}`);

    return {
      extractedConcept,
      matchedKeywords,
      confidence
    };
  }

  private extractConceptFromQuestion(question: string): string | null {
    const conceptPatterns = [
      /冈崎片段/i,
      /dna复制/i,
      /转录/i,
      /翻译/i,
      /孟德尔/i,
      /系谱/i,
      /家系/i,
      /punnett/i,
      /染色体/i,
      /减数分裂/i,
      /有丝分裂/i,
      /等位基因/i,
      /基因结构/i,
      /crispr/i,
      /三体/i
    ];

    for (const pattern of conceptPatterns) {
      const match = question.match(pattern);
      if (match) {
        return match[0];
      }
    }

    return null;
  }

  private findBestTemplate(analysis: QuestionAnalysis): A2UITemplate | null {
    const scoredTemplates = this.matchRules.map(rule => {
      let score = 0;
      
      for (const keyword of rule.keywords) {
        if (analysis.matchedKeywords.some(k => k.toLowerCase() === keyword.toLowerCase())) {
          score += 1;
        }
      }

      if (analysis.extractedConcept && rule.concepts.some(c => 
        c.toLowerCase().includes(analysis.extractedConcept!.toLowerCase()))) {
        score += 3;
      }

      return {
        template: this.getTemplateById(rule.templateId),
        rule,
        score
      };
    }).filter(item => item.template !== null);

    if (scoredTemplates.length === 0) {
      return null;
    }

    scoredTemplates.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return b.rule.priority - a.rule.priority;
    });

    return scoredTemplates[0].template;
  }

  private getTemplateById(templateId: string): A2UITemplate | null {
    return A2UITemplates.find(t => t.templateId === templateId) || null;
  }

  private generateSuggestedParameters(question: string, template: A2UITemplate): Record<string, any> {
    const params: Record<string, any> = {};
    const lowerQuestion = question.toLowerCase();

    if (template.templateId === 'dna_replication_okazaki_v1') {
      params.stage = 'elongation';
      params.showLeadingStrand = true;
      params.showLaggingStrand = true;
      params.showOkazakiFragments = true;
      params.showEnzymes = ['helicase', 'primase', 'polymerase', 'ligase'];
      params.organism = 'eukaryotic';
      params.okazakiFragments = [
        { id: 'OF1', length: 150, hasPrimer: true, position: 1 },
        { id: 'OF2', length: 180, hasPrimer: true, position: 2 },
        { id: 'OF3', length: 160, hasPrimer: true, position: 3 }
      ];
      params.title = '冈崎片段合成过程';
      params.description = '展示冈崎片段在后随链上的合成过程：由于DNA聚合酶只能沿5\'→3\'方向合成，后随链必须分段合成冈崎片段，最后由DNA连接酶连接成完整的链。';
    } else if (template.templateId === 'dna_replication_v1') {
      params.stage = 'elongation';
      params.showLeadingStrand = true;
      params.showLaggingStrand = true;
      params.showOkazakiFragments = lowerQuestion.includes('冈崎片段');
    } else if (template.templateId === 'punnett_square_v1') {
      if (lowerQuestion.includes('显性') && lowerQuestion.includes('隐性')) {
        params.maleGametes = ['A', 'a'];
        params.femaleGametes = ['A', 'a'];
        params.parentalCross = {
          male: { genotype: 'Aa', phenotype: '显性' },
          female: { genotype: 'Aa', phenotype: '显性' }
        };
        params.offspring = [
          { genotype: 'AA', phenotype: '显性', probability: 0.25 },
          { genotype: 'Aa', phenotype: '显性', probability: 0.5 },
          { genotype: 'aa', phenotype: '隐性', probability: 0.25 }
        ];
      }
      // 添加知识点字段占位符，AI将填充这些内容
      params.keyPoints = [];
      params.understandingPoints = [];
      params.commonMistakes = [];
      params.checkQuestions = [];
    } else if (template.templateId === 'inheritance_path_v1') {
      if (lowerQuestion.includes('血友病') || lowerQuestion.includes('色盲')) {
        params.inheritance = {
          pattern: 'X连锁隐性遗传',
          chromosome: 'X染色体',
          gene: lowerQuestion.includes('血友病') ? 'F8' : 'OPN1LW'
        };
      }
      // 添加知识点字段占位符，AI将填充这些内容
      params.keyPoints = [];
      params.understandingPoints = [];
      params.commonMistakes = [];
      params.checkQuestions = [];
    }

    return { ...template.defaultValues, ...params };
  }

  getAvailableTemplates(): A2UITemplate[] {
    return A2UITemplates;
  }

  getTemplateByIdPublic(templateId: string): A2UITemplate | null {
    return this.getTemplateById(templateId);
  }
}
