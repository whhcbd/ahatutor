import { IsEnum, IsNumber, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateProgressDto {
  @IsString()
  conceptId!: string;

  @IsString()
  conceptName!: string;

  @IsNumber()
  @IsOptional()
  masteryLevel?: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}

export class UpdateProgressDto {
  @IsNumber()
  @IsOptional()
  masteryLevel?: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}

export class CreateSessionDto {
  @IsEnum(['speed', 'depth', 'practice'])
  mode!: 'speed' | 'depth' | 'practice';

  @IsString()
  @IsOptional()
  conceptId?: string;

  @IsString()
  @IsOptional()
  conceptName?: string;
}

export class UpdateSessionDto {
  @IsDateString()
  @IsOptional()
  endedAt?: string;

  @IsNumber()
  @IsOptional()
  duration?: number;

  @IsNumber()
  @IsOptional()
  questionsAnswered?: number;

  @IsNumber()
  @IsOptional()
  correctAnswers?: number;

  @IsNumber()
  @IsOptional()
  accuracy?: number;
}

export class RecordQuizResultDto {
  @IsString()
  questionId!: string;

  @IsString()
  question!: string;

  @IsString()
  userAnswer!: string;

  @IsString()
  correctAnswer!: string;

  @IsEnum(['true', 'false'])
  isCorrect!: string;

  @IsNumber()
  timeSpent!: number;
}
