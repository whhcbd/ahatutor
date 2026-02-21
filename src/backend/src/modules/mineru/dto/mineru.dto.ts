import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class MinerUParseDto {
  @IsString()
  filePath!: string;

  @IsNumber()
  @IsOptional()
  timeout?: number;

  @IsString()
  @IsOptional()
  outputPath?: string;

  @IsBoolean()
  @IsOptional()
  keepZip?: boolean;
}

export class MinerUHealthCheckDto {
  healthy!: boolean;
  url!: string;
  error?: string;
}
