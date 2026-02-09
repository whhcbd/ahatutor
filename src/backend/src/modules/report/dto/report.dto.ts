import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';

export enum ReportType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  TOPIC = 'topic',
  MISTAKE = 'mistake',
  PROGRESS = 'progress',
}

/**
 * 生成报告 DTO
 */
export class GenerateReportDto {
  @IsEnum(ReportType)
  type!: ReportType;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  topic?: string;

  @IsOptional()
  includeCharts?: boolean;
}

/**
 * 图表查询 DTO
 */
export class ChartQueryDto {
  @IsOptional()
  @IsString()
  type?: 'line' | 'bar' | 'pie' | 'radar';

  @IsOptional()
  @IsString()
  period?: 'day' | 'week' | 'month' | 'year';

  @IsOptional()
  @IsString()
  metric?: 'accuracy' | 'count' | 'time' | 'mastery';
}
