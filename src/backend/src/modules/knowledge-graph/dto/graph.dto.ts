import { IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { KnowledgeNodeType } from '@shared/types/knowledge-tree.types';

/**
 * 创建节点 DTO
 */
export class CreateNodeDto {
  @IsString()
  name!: string;

  @IsEnum(KnowledgeNodeType)
  type!: KnowledgeNodeType;

  @IsOptional()
  @IsNumber()
  level?: number;

  @IsOptional()
  @IsString()
  domain?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  metadata?: Record<string, any>;
}

/**
 * 创建关系 DTO
 */
export class CreateEdgeDto {
  @IsString()
  from!: string; // 源节点 ID

  @IsString()
  to!: string; // 目标节点 ID

  @IsString()
  type!: string; // 关系类型：PREREQUISITE, RELATED, CONTAINS 等

  @IsOptional()
  weight?: number; // 关系权重
}

/**
 * 路径查询 DTO
 */
export class GetPathDto {
  @IsString()
  from!: string; // 起始节点 ID 或名称

  @IsString()
  to!: string; // 目标节点 ID 或名称

  @IsOptional()
  @IsString()
  algorithm?: 'shortest' | 'breadth' | 'depth'; // 算法类型
}

/**
 * 图谱查询 DTO
 */
export class GraphQueryDto {
  @IsOptional()
  @IsString()
  root?: string; // 根节点 ID（用于获取子图）

  @IsOptional()
  @IsNumber()
  depth?: number; // 深度限制

  @IsOptional()
  @IsString()
  domain?: string; // 领域过滤
}
