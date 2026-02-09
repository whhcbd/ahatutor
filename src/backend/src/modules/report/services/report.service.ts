import { Injectable } from '@nestjs/common';
import { MistakeService } from '../../mistake/services/mistake.service';
import { LLMService } from '../../llm/llm.service';
import { GenerateReportDto, ReportType } from '../dto/report.dto';

/**
 * 学情报告服务
 * 负责学习数据统计和报告生成
 */
@Injectable()
export class ReportService {
  // 模拟学习会话数据
  private learningSessions = new Map<string, any>();

  constructor(
    private readonly mistakeService: MistakeService,
    private readonly llmService: LLMService,
  ) {}

  /**
   * 生成报告
   */
  async generate(dto: GenerateReportDto) {
    switch (dto.type) {
      case ReportType.DAILY:
        return this.getDailyReport(dto.startDate ? new Date(dto.startDate) : undefined);
      case ReportType.WEEKLY:
        return this.getWeeklyReport(dto.startDate ? new Date(dto.startDate) : undefined);
      case ReportType.TOPIC:
        return this.getTopicReport(dto.topic || '');
      case ReportType.MISTAKE:
        return this.getMistakeReport();
      case ReportType.PROGRESS:
        return this.getLearningProgress(dto.userId);
      default:
        throw new Error(`Unknown report type: ${dto.type}`);
    }
  }

  /**
   * 获取日报告
   */
  async getDailyReport(date?: Date) {
    const targetDate = date || new Date();
    const dateStr = targetDate.toISOString().split('T')[0];

    // 模拟获取当日数据
    const sessions = this.getSessionsByDate(targetDate);

    const totalQuestions = sessions.reduce((sum, s) => sum + (s.questionsAnswered || 0), 0);
    const correctAnswers = sessions.reduce((sum, s) => sum + (s.correctAnswers || 0), 0);
    const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    return {
      type: 'daily',
      date: dateStr,
      summary: {
        totalQuestions,
        correctAnswers,
        wrongAnswers: totalQuestions - correctAnswers,
        accuracy: Math.round(accuracy * 10) / 10,
        studyTime: sessions.reduce((sum, s) => sum + (s.duration || 0), 0),
        sessionCount: sessions.length,
      },
      timeline: this.generateHourlyData(sessions),
      topics: this.getTopicsFromSessions(sessions),
      mistakes: await this.mistakeService.findAll(),
      recommendations: await this.generateDailyRecommendations(accuracy),
    };
  }

  /**
   * 获取周报告
   */
  async getWeeklyReport(startDate?: Date) {
    const start = startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);

    const sessions = this.getSessionsByDateRange(start, end);

    const dailyData = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
      const daySessions = this.getSessionsByDate(date);
      dailyData.push({
        date: date.toISOString().split('T')[0],
        questions: daySessions.reduce((sum, s) => sum + (s.questionsAnswered || 0), 0),
        accuracy: this.calculateDayAccuracy(daySessions),
        time: daySessions.reduce((sum, s) => sum + (s.duration || 0), 0),
      });
    }

    const totalQuestions = sessions.reduce((sum, s) => sum + (s.questionsAnswered || 0), 0);
    const correctAnswers = sessions.reduce((sum, s) => sum + (s.correctAnswers || 0), 0);

    return {
      type: 'weekly',
      period: {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0],
      },
      summary: {
        totalQuestions,
        correctAnswers,
        accuracy: totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 1000) / 10 : 0,
        studyDays: new Set(sessions.map((s) => s.date?.split('T')[0])).size,
        totalTime: sessions.reduce((sum, s) => sum + (s.duration || 0), 0),
      },
      dailyTrend: dailyData,
      weaknessAnalysis: await this.mistakeService.getWeaknessStats(),
      improvementTips: await this.generateWeeklyTips(),
    };
  }

  /**
   * 获取专题报告
   */
  async getTopicReport(topic: string) {
    const mistakes = await this.mistakeService.findByTopic(topic);
    const topicSessions = Array.from(this.learningSessions.values()).filter(
      (s) => s.topic === topic,
    );

    const totalQuestions = topicSessions.reduce((sum, s) => sum + (s.questionsAnswered || 0), 0);
    const correctAnswers = topicSessions.reduce((sum, s) => sum + (s.correctAnswers || 0), 0);

    return {
      type: 'topic',
      topic,
      summary: {
        totalQuestions,
        correctAnswers,
        accuracy: totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 1000) / 10 : 0,
        mistakeCount: mistakes.length,
        sessionCount: topicSessions.length,
      },
      mistakes: mistakes.map((m) => ({
        id: m.id,
        question: m.question,
        errorType: m.errorType,
        tags: m.tags,
      })),
      mastery: this.calculateTopicMastery(topic),
      nextSteps: await this.generateTopicRecommendations(topic),
    };
  }

  /**
   * 获取薄弱点分析
   */
  async getWeaknessAnalysis() {
    const weaknessStats = await this.mistakeService.getWeaknessStats();

    // 使用 AI 分析薄弱点并给出建议
    const prompt = `基于以下错题统计数据，分析学习薄弱点并给出改进建议：

${JSON.stringify(weaknessStats, null, 2)}

返回 JSON 格式：
{
  "weakPoints": ["知识点1", "知识点2"],
  "analysis": "整体分析",
  "recommendations": ["建议1", "建议2", "建议3"],
  "priority": ["优先复习1", "优先复习2"]
}`;

    try {
      const result = await this.llmService.structuredChat(
        [{ role: 'user', content: prompt }],
        {
          type: 'object',
          properties: {
            weakPoints: { type: 'array', items: { type: 'string' } },
            analysis: { type: 'string' },
            recommendations: { type: 'array', items: { type: 'string' } },
            priority: { type: 'array', items: { type: 'string' } },
          },
        },
      );

      return {
        stats: weaknessStats,
        aiAnalysis: result,
      };
    } catch {
      return { stats: weaknessStats };
    }
  }

  /**
   * 获取学习进度
   */
  async getLearningProgress(userId?: string) {
    const sessions = Array.from(this.learningSessions.values());
    const mistakes = await this.mistakeService.findAll();

    return {
      overview: {
        totalSessions: sessions.length,
        totalQuestions: sessions.reduce((sum, s) => sum + (s.questionsAnswered || 0), 0),
        totalMistakes: mistakes.length,
        masteredTopics: this.getMasteredTopicsCount(),
      },
      timeline: this.generateProgressTimeline(sessions),
      upcomingReviews: this.getUpcomingReviews(),
      streaks: this.calculateStreaks(sessions),
    };
  }

  /**
   * 获取图表数据
   */
  async getChartData(query: { type?: string; period?: string }) {
    const sessions = Array.from(this.learningSessions.values());

    switch (query.type) {
      case 'line':
        return {
          type: 'line',
          data: this.generateLineChartData(sessions, query.period),
        };
      case 'bar':
        return {
          type: 'bar',
          data: this.generateBarChartData(sessions),
        };
      case 'pie':
        return {
          type: 'pie',
          data: this.generatePieChartData(sessions),
        };
      case 'radar':
        return {
          type: 'radar',
          data: this.generateRadarChartData(sessions),
        };
      default:
        return {
          type: 'mixed',
          data: {
            line: this.generateLineChartData(sessions, query.period),
            bar: this.generateBarChartData(sessions),
            radar: this.generateRadarChartData(sessions),
          },
        };
    }
  }

  /**
   * 导出报告
   */
  async exportReport(reportId: string, format: 'pdf' | 'json' = 'pdf') {
    // 查找报告
    const report = this.learningSessions.get(reportId);

    if (format === 'json') {
      return report;
    }

    // PDF 导出需要额外库支持，这里返回数据
    return {
      reportId,
      format,
      data: report,
      message: 'PDF export requires additional setup',
    };
  }

  // ========== 私有辅助方法 ==========

  private getSessionsByDate(date: Date): any[] {
    const dateStr = date.toISOString().split('T')[0];
    return Array.from(this.learningSessions.values()).filter(
      (s) => s.date?.startsWith(dateStr),
    );
  }

  private getSessionsByDateRange(start: Date, end: Date): any[] {
    return Array.from(this.learningSessions.values()).filter((s) => {
      const sessionDate = new Date(s.date);
      return sessionDate >= start && sessionDate <= end;
    });
  }

  private calculateDayAccuracy(sessions: any[]): number {
    const total = sessions.reduce((sum, s) => sum + (s.questionsAnswered || 0), 0);
    const correct = sessions.reduce((sum, s) => sum + (s.correctAnswers || 0), 0);
    return total > 0 ? (correct / total) * 100 : 0;
  }

  private generateHourlyData(sessions: any[]): any[] {
    const hourlyData = Array(24).fill(0).map((_, i) => ({
      hour: i,
      count: 0,
      accuracy: 0,
    }));

    for (const session of sessions) {
      const hour = new Date(session.date).getHours();
      hourlyData[hour].count += session.questionsAnswered || 0;
    }

    return hourlyData.filter((d) => d.count > 0);
  }

  private getTopicsFromSessions(sessions: any[]): string[] {
    const topics = new Set<string>();
    for (const session of sessions) {
      if (session.topic) topics.add(session.topic);
    }
    return Array.from(topics);
  }

  private calculateTopicMastery(topic: string): number {
    // 简化计算，实际应基于正确率和复习次数
    return Math.floor(Math.random() * 100);
  }

  private getMasteredTopicsCount(): number {
    return Math.floor(Math.random() * 10);
  }

  private generateProgressTimeline(sessions: any[]): any[] {
    return sessions.slice(-7).map((s) => ({
      date: s.date,
      accuracy: s.questionsAnswered > 0 ? (s.correctAnswers / s.questionsAnswered) * 100 : 0,
      questions: s.questionsAnswered,
    }));
  }

  private getUpcomingReviews(): any[] {
    return [];
  }

  private calculateStreaks(sessions: any[]): { current: number; longest: number } {
    return { current: 3, longest: 7 };
  }

  private generateLineChartData(sessions: any[], period?: string): any {
    return {
      labels: sessions.slice(-7).map((s) => s.date?.split('T')[0]),
      datasets: [
        {
          label: '正确率',
          data: sessions.slice(-7).map((s) =>
            s.questionsAnswered > 0 ? (s.correctAnswers / s.questionsAnswered) * 100 : 0,
          ),
          borderColor: 'rgb(59, 130, 246)',
        },
      ],
    };
  }

  private generateBarChartData(sessions: any[]): any {
    return {
      labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      datasets: [
        {
          label: '答题数',
          data: sessions.slice(-7).map((s) => s.questionsAnswered || 0),
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
        },
      ],
    };
  }

  private generatePieChartData(sessions: any[]): any {
    return {
      labels: ['正确', '错误'],
      datasets: [
        {
          data: [
            sessions.reduce((sum, s) => sum + (s.correctAnswers || 0), 0),
            sessions.reduce((sum, s) => sum + (s.questionsAnswered - (s.correctAnswers || 0)), 0),
          ],
          backgroundColor: ['rgb(74, 222, 128)', 'rgb(248, 113, 113)'],
        },
      ],
    };
  }

  private generateRadarChartData(sessions: any[]): any {
    return {
      labels: ['遗传学', '细胞生物学', '进化论', '生态学', '分子生物学'],
      datasets: [
        {
          label: '掌握度',
          data: [80, 65, 70, 55, 75],
          backgroundColor: 'rgba(139, 92, 246, 0.2)',
          borderColor: 'rgb(139, 92, 246)',
        },
      ],
    };
  }

  private async generateDailyRecommendations(accuracy: number): Promise<string[]> {
    if (accuracy >= 90) {
      return ['保持当前学习状态', '尝试挑战更高难度题目'];
    } else if (accuracy >= 70) {
      return ['巩固薄弱知识点', '增加练习量'];
    } else {
      return ['复习基础概念', '查看错题解析', '调整学习节奏'];
    }
  }

  private async generateWeeklyTips(): Promise<string[]> {
    return [
      '建议重点复习错误率超过30%的知识点',
      '保持每天至少30分钟的学习时间',
      '定期回顾错题本，巩固易错点',
    ];
  }

  private async generateTopicRecommendations(topic: string): Promise<string[]> {
    return [
      `完成${topic}相关练习题`,
      `观看${topic}相关教学视频`,
      `制作${topic}知识点思维导图`,
    ];
  }

  private async getMistakeReport() {
    const mistakes = await this.mistakeService.findAll();
    return {
      type: 'mistake',
      summary: {
        total: mistakes.length,
        byType: {
          lowLevel: mistakes.filter((m) => m.errorType === 'low_level').length,
          highLevel: mistakes.filter((m) => m.errorType === 'high_level').length,
        },
        bySubject: this.groupBySubject(mistakes),
      },
      recent: mistakes.slice(0, 10),
    };
  }

  private groupBySubject(mistakes: any[]): Record<string, number> {
    const grouped: Record<string, number> = {};
    for (const mistake of mistakes) {
      const subject = mistake.subject || 'other';
      grouped[subject] = (grouped[subject] || 0) + 1;
    }
    return grouped;
  }
}
