import { IsString, IsOptional, IsEnum, IsArray, IsNumber } from 'class-validator';

export enum ErrorType {
  LOW_LEVEL = 'low_level',    // 低级错误
  HIGH_LEVEL = 'high_level',  // 高级错误（知识性）
}

export enum Subject {
  GENETICS = 'genetics',
  BIOLOGY = 'biology',
  CHEMISTRY = 'chemistry',
  PHYSICS = 'physics',
  MATH = 'math',
}

/**
 * 上传错题 DTO
 */
export class UploadMistakeDto {
  @IsString()
  question!: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  correctAnswer?: string;

  @IsOptional()
  @IsString()
  userAnswer?: string;

  @IsOptional()
  @IsEnum(ErrorType)
  errorType?: ErrorType;

  @IsOptional()
  @IsEnum(Subject)
  subject?: Subject;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  notes?: string;
}

/**
 * 更新错题 DTO
 */
export class UpdateMistakeDto {
  @IsOptional()
  @IsString()
  question?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  correctAnswer?: string;

  @IsOptional()
  @IsString()
  userAnswer?: string;

  @IsOptional()
  @IsEnum(ErrorType)
  errorType?: ErrorType;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  notes?: string;
}

/**
 * 生成相似题 DTO
 */
export class GenerateSimilarDto {
  @IsOptional()
  @IsNumber()
  count?: number;

  @IsOptional()
  difficulty?: 'easy' | 'medium' | 'hard';
}
