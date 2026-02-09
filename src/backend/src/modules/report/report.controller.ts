import {
  Controller,
  Get,
  Post,
  Query,
  Param,
  Body,
} from '@nestjs/common';
import { ReportService } from './services/report.service';
import { GenerateReportDto } from './dto/report.dto';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  /**
   * 生成学情报告
   * POST /report/generate
   */
  @Post('generate')
  async generateReport(@Body() dto: GenerateReportDto) {
    return this.reportService.generate(dto);
  }

  /**
   * 获取日报告
   * GET /report/daily
   */
  @Get('daily')
  async getDailyReport(@Query('date') dateStr?: string) {
    const date = dateStr ? new Date(dateStr) : new Date();
    return this.reportService.getDailyReport(date);
  }

  /**
   * 获取周报告
   * GET /report/weekly
   */
  @Get('weekly')
  async getWeeklyReport(@Query('startDate') startDateStr?: string) {
    const startDate = startDateStr
      ? new Date(startDateStr)
      : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return this.reportService.getWeeklyReport(startDate);
  }

  /**
   * 获取专题报告
   * GET /report/topic/:topic
   */
  @Get('topic/:topic')
  async getTopicReport(@Param('topic') topic: string) {
    return this.reportService.getTopicReport(topic);
  }

  /**
   * 获取薄弱点分析
   * GET /report/weakness
   */
  @Get('weakness')
  async getWeaknessAnalysis() {
    return this.reportService.getWeaknessAnalysis();
  }

  /**
   * 获取学习进度
   * GET /report/progress
   */
  @Get('progress')
  async getLearningProgress(@Query('userId') userId?: string) {
    return this.reportService.getLearningProgress(userId);
  }

  /**
   * 获取统计图表数据
   * GET /report/charts
   */
  @Get('charts')
  async getChartData(@Query() query: { type?: string; period?: string }) {
    return this.reportService.getChartData(query);
  }

  /**
   * 导出报告（PDF）
   * POST /report/export
   */
  @Post('export')
  async exportReport(@Body() dto: { reportId: string; format?: 'pdf' | 'json' }) {
    return this.reportService.exportReport(dto.reportId, dto.format || 'pdf');
  }
}
