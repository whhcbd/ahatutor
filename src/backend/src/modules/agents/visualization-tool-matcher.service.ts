import { Injectable, Logger } from '@nestjs/common';
import { VisualizationRAGService, VisualizationMatch } from './visualization-rag.service';
import { A2UITemplates, type A2UITemplate } from './data/a2ui-templates.data';
import { TemplateMatcherService } from './template-matcher.service';

interface UserQuestion {
  content: string;
  concept?: string;
  userLevel?: 'beginner' | 'intermediate' | 'advanced';
}

export interface IntentAnalysis {
  needsVisualization: boolean;
  confidence: number;
  reasoning: string;
  keywords: string[];
  concepts: string[];
}

export interface ToolRecommendation {
  matched: boolean;
  tool: A2UITemplate | null;
  toolId: string | null;
  toolName: string;
  confidence: number;
  intentAnalysis: IntentAnalysis;
  suggestedParameters: Record<string, any>;
  shouldTriggerA2UI: boolean;
}

interface ToolMatchScore {
  template: A2UITemplate;
  ragScore: number;
  keywordScore: number;
  categoryScore: number;
  totalScore: number;
}

@Injectable()
export class VisualizationToolMatcherService {
  private readonly logger = new Logger(VisualizationToolMatcherService.name);

  constructor(
    private readonly visualizationRAG: VisualizationRAGService,
    private readonly templateMatcher: TemplateMatcherService,
  ) {}

  async analyzeAndMatchTool(question: UserQuestion): Promise<ToolRecommendation> {
    this.logger.log(`Analyzing question: ${question.content.substring(0, 50)}...`);

    const intentAnalysis = this.analyzeIntent(question);
    
    if (!intentAnalysis.needsVisualization && intentAnalysis.confidence < 0.3) {
      this.logger.debug('No visualization intent detected');
      return {
        matched: false,
        tool: null,
        toolId: null,
        toolName: '',
        confidence: 0,
        intentAnalysis,
        suggestedParameters: {},
        shouldTriggerA2UI: false,
      };
    }

    const toolMatch = await this.findBestTool(question, intentAnalysis);

    const shouldTriggerA2UI = this.shouldTriggerA2UI(question, intentAnalysis, toolMatch);

    this.logger.log(
      `Tool match result: ${toolMatch.template?.templateId}, confidence: ${toolMatch.totalScore.toFixed(2)}, ` +
      `trigger A2UI: ${shouldTriggerA2UI}`
    );

    return {
      matched: toolMatch.template !== null,
      tool: toolMatch.template,
      toolId: toolMatch.template?.templateId || null,
      toolName: toolMatch.template?.templateId || '',
      confidence: toolMatch.totalScore,
      intentAnalysis,
      suggestedParameters: toolMatch.template?.defaultValues || {},
      shouldTriggerA2UI,
    };
  }

  private analyzeIntent(question: UserQuestion): IntentAnalysis {
    const content = question.content.toLowerCase();
    
    const visualizationKeywords = [
      '可视化', '图', '图表', '展示', '演示', '画', '图解',
      '分析', '计算', '推导', '预测', '验证', '检查',
      '杂交', '测交', '系谱', '家系', '概率', '比例',
      '卡方', '连锁', '基因定位', '遗传图谱', '三点测交',
      '细菌接合', '数量性状', '染色体畸变', '孟德尔',
      '庞氏', 'punnett', '遗传病', '携带者'
    ];

    const explicitRequestPatterns = [
      /帮我.*图/i,
      /需要.*可视化/i,
      /用.*展示/i,
      /生成.*图/i,
      /画出/i,
      /显示/i
    ];

    const matchedKeywords: string[] = [];
    for (const keyword of visualizationKeywords) {
      if (content.includes(keyword)) {
        matchedKeywords.push(keyword);
      }
    }

    const concepts = this.extractConcepts(content);
    
    let confidence = 0;
    let reasoning = '';

    if (matchedKeywords.length >= 3) {
      confidence = 0.9;
      reasoning = '检测到多个遗传学可视化相关关键词，强烈需要可视化';
    } else if (matchedKeywords.length >= 2) {
      confidence = 0.75;
      reasoning = '检测到多个遗传学分析关键词，需要可视化辅助';
    } else if (matchedKeywords.length === 1) {
      confidence = 0.5;
      reasoning = '检测到遗传学分析关键词，可能需要可视化';
    }

    for (const pattern of explicitRequestPatterns) {
      if (pattern.test(question.content)) {
        confidence = Math.min(confidence + 0.3, 1.0);
        reasoning = '用户明确请求可视化展示';
        break;
      }
    }

    const needsVisualization = confidence >= 0.3;

    return {
      needsVisualization,
      confidence,
      reasoning,
      keywords: matchedKeywords,
      concepts,
    };
  }

  private async findBestTool(
    question: UserQuestion,
    intentAnalysis: IntentAnalysis
  ): Promise<ToolMatchScore> {
    let ragMatches: VisualizationMatch[] = [];
    try {
      ragMatches = await this.visualizationRAG.retrieveByQuestion(
        question.content,
        0.6,
        5
      );
    } catch (error) {
      this.logger.warn('RAG检索失败，使用关键词和类别匹配', error);
      ragMatches = [];
    }

    const templateScores: ToolMatchScore[] = [];

    for (const template of A2UITemplates) {
      const ragMatch = ragMatches.find(
        m => m.visualization.type === template.visualizationType
      );

      let ragScore = ragMatch ? ragMatch.score : 0;
      
      let keywordScore = 0;
      const content = question.content.toLowerCase();
      const typeKeywords = this.getTypeKeywords(template.visualizationType);
      for (const keyword of typeKeywords) {
        if (content.includes(keyword.toLowerCase())) {
          keywordScore += 1;
        }
      }

      let categoryScore = 0;
      if (template.category === '核心工具') {
        categoryScore = 10;
      } else if (template.category === '重要方法') {
        categoryScore = 8;
      } else if (template.category === '原理演示') {
        categoryScore = 5;
      } else if (template.category === '实验技术') {
        categoryScore = 6;
      }

      const totalScore = (ragScore * 0.4) + (keywordScore * 0.4) + (categoryScore * 0.2);

      templateScores.push({
        template,
        ragScore,
        keywordScore,
        categoryScore,
        totalScore,
      });
    }

    templateScores.sort((a, b) => b.totalScore - a.totalScore);

    const bestMatch = templateScores[0] || {
      template: null as any,
      ragScore: 0,
      keywordScore: 0,
      categoryScore: 0,
      totalScore: 0,
    };

    this.logger.debug(
      `Best tool match: ${bestMatch.template?.templateId}, ` +
      `RAG: ${bestMatch.ragScore.toFixed(2)}, ` +
      `Keywords: ${bestMatch.keywordScore}, ` +
      `Category: ${bestMatch.categoryScore}, ` +
      `Total: ${bestMatch.totalScore.toFixed(2)}`
    );

    return bestMatch;
  }

  private getTypeKeywords(visualizationType: string): string[] {
    const keywordMap: Record<string, string[]> = {
      punnett_square: ['庞氏', 'punnett', '杂交', '配子', '基因型', '表型', '分离比'],
      pedigree_chart: ['系谱', '家系', '遗传病', '家族遗传', '系谱图', '家系图'],
      three_point_test_cross: ['三点测交', '基因定位', '连锁', '重组率', '基因图'],
      test_cross: ['测交', '未知基因型', '基因型测定', 'aa杂交'],
      probability_distribution: ['概率', '分布', '比例', '孟德尔比例', '卡方'],
      chi_square_test: ['卡方检验', '适合度测验', '统计验证', '期望值', '观察值'],
      bacterial_conjugation: ['细菌接合', 'F因子', '性菌毛', '质粒', '基因转移'],
      quantitative_traits: ['数量性状', '多基因', '连续变异', '正态分布', '遗传力'],
      chromosome_aberration: ['染色体畸变', '缺失', '重复', '倒位', '易位', '三体', '单体'],
      meiosis_animation: ['减数分裂', '分裂过程', '配子形成'],
      chromosome_behavior: ['染色体行为', '同源染色体', '交叉', '联会'],
      dna_replication: ['dna复制', '复制叉', '半保留复制'],
      crispr: ['crispr', '基因编辑', 'gRNA', 'cas9'],
    };

    return keywordMap[visualizationType] || [];
  }

  private extractConcepts(content: string): string[] {
    const conceptPatterns = [
      /孟德尔/i,
      /分离定律/i,
      /自由组合/i,
      /连锁/i,
      /交换/i,
      /测交/i,
      /系谱/i,
      /家系/i,
      /概率/i,
      /比例/i,
      /卡方/i,
      /三点/i,
      /细菌/i,
      /接合/i,
      /数量/i,
      /多基因/i,
      /染色体/i,
      /畸变/i,
      /缺失/i,
      /重复/i,
      /倒位/i,
      /易位/i,
      /三体/i,
      /单体/i,
      /dna/i,
      /rna/i,
      /转录/i,
      /翻译/i,
      /复制/i,
      /crispr/i,
      /基因/i,
    ];

    const concepts: string[] = [];
    for (const pattern of conceptPatterns) {
      const match = content.match(pattern);
      if (match && !concepts.includes(match[0])) {
        concepts.push(match[0]);
      }
    }

    return concepts;
  }

  private shouldTriggerA2UI(
    question: UserQuestion,
    intentAnalysis: IntentAnalysis,
    toolMatch: ToolMatchScore
  ): boolean {
    if (toolMatch.totalScore < 0.4) {
      return false;
    }

    const explicitRequestPatterns = [
      /帮我.*图/i,
      /需要.*可视化/i,
      /用.*展示/i,
      /生成.*图/i,
      /画出/i,
      /显示/i
    ];

    for (const pattern of explicitRequestPatterns) {
      if (pattern.test(question.content)) {
        return true;
      }
    }

    if (intentAnalysis.confidence >= 0.7) {
      return true;
    }

    if (toolMatch.template?.category === '核心工具' && intentAnalysis.confidence >= 0.5) {
      return true;
    }

    return false;
  }

  getAvailableTools(): A2UITemplate[] {
    return A2UITemplates;
  }

  getToolByCategory(category: string): A2UITemplate[] {
    return A2UITemplates.filter(t => t.category === category);
  }
}
