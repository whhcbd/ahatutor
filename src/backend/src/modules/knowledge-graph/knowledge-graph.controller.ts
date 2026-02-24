import { Controller, Get, Post, Query, Param, Body, UseGuards, Optional } from '@nestjs/common';
import { KnowledgeGraphService } from './knowledge-graph.service';
import { KnowledgeGraph, KnowledgeGraphQuery, KnowledgeGraphNodeDetail } from '@shared/types/knowledge-graph.types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('knowledge-graph')
export class KnowledgeGraphController {
  constructor(
    private readonly knowledgeGraphService: KnowledgeGraphService,
    @Optional() private readonly jwtAuthGuard: JwtAuthGuard
  ) {}

  @Get('stats')
  async getStats() {
    return await this.knowledgeGraphService.getGraphStats();
  }

  @Get('build')
  async buildGraph(): Promise<KnowledgeGraph> {
    return await this.knowledgeGraphService.buildKnowledgeGraph();
  }

  @Get('query')
  async queryGraph(@Query() query: KnowledgeGraphQuery): Promise<KnowledgeGraph> {
    return await this.knowledgeGraphService.queryGraph(query);
  }

  @Get('node/:nodeId')
  async getNodeDetail(@Param('nodeId') nodeId: string): Promise<KnowledgeGraphNodeDetail | null> {
    return await this.knowledgeGraphService.getNodeDetail(nodeId);
  }

  @Post('cache/clear')
  async clearCache(): Promise<{ success: boolean }> {
    await this.knowledgeGraphService.clearCache();
    return { success: true };
  }
}
