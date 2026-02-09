import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { GraphService } from './services/graph.service';
import {
  CreateNodeDto,
  CreateEdgeDto,
  GetPathDto,
  GraphQueryDto,
} from './dto/graph.dto';

@Controller('graph')
export class GraphController {
  constructor(private readonly graphService: GraphService) {}

  /**
   * 创建知识节点
   * POST /graph/nodes
   */
  @Post('nodes')
  async createNode(@Body() dto: CreateNodeDto) {
    return this.graphService.createNode(dto);
  }

  /**
   * 获取节点详情
   * GET /graph/nodes/:id
   */
  @Get('nodes/:id')
  async getNode(@Param('id') id: string) {
    return this.graphService.getNode(id);
  }

  /**
   * 搜索节点
   * GET /graph/nodes/search?q=keyword
   */
  @Get('nodes/search')
  async searchNodes(@Query('q') query: string) {
    return this.graphService.searchNodes(query);
  }

  /**
   * 获取节点的关系
   * GET /graph/nodes/:id/relations
   */
  @Get('nodes/:id/relations')
  async getNodeRelations(
    @Param('id') id: string,
    @Query('direction') direction: 'incoming' | 'outgoing' | 'both' = 'both',
  ) {
    return this.graphService.getNodeRelations(id, direction);
  }

  /**
   * 删除节点
   * DELETE /graph/nodes/:id
   */
  @Delete('nodes/:id')
  async deleteNode(@Param('id') id: string) {
    return this.graphService.deleteNode(id);
  }

  /**
   * 创建关系（边）
   * POST /graph/edges
   */
  @Post('edges')
  async createEdge(@Body() dto: CreateEdgeDto) {
    return this.graphService.createEdge(dto);
  }

  /**
   * 删除关系
   * DELETE /graph/edges/:id
   */
  @Delete('edges/:id')
  async deleteEdge(@Param('id') id: string) {
    return this.graphService.deleteEdge(id);
  }

  /**
   * 查找学习路径
   * POST /graph/path
   */
  @Post('path')
  async findPath(@Body() dto: GetPathDto) {
    return this.graphService.findPath(dto);
  }

  /**
   * 获取知识图谱数据（用于前端可视化）
   * GET /graph/visualize
   */
  @Get('visualize')
  async getGraphData(@Query() dto: GraphQueryDto) {
    return this.graphService.getGraphData(dto);
  }

  /**
   * 获取图谱统计信息
   * GET /graph/stats
   */
  @Get('stats')
  async getStats() {
    return this.graphService.getStats();
  }

  /**
   * 从 Agent 结果构建知识树
   * POST /graph/build-from-agent
   */
  @Post('build-from-agent')
  async buildFromAgent(@Body() data: {
    concept: string;
    tree: any;
  }) {
    return this.graphService.buildFromAgent(data);
  }
}
