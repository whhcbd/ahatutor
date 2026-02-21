import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MinerUService } from './mineru.service';
import { MinerUParseDto } from './dto/mineru.dto';

@ApiTags('mineru')
@Controller('mineru')
export class MinerUController {
  constructor(private readonly minerUService: MinerUService) {}

  @Post('parse')
  @ApiOperation({ summary: '解析 PDF 文件' })
  @ApiResponse({ status: 200, description: '解析成功' })
  @ApiResponse({ status: 400, description: '参数错误' })
  @ApiResponse({ status: 500, description: '服务器错误' })
  async parsePDF(@Body() dto: MinerUParseDto) {
    const result = await this.minerUService.parsePDF(dto.filePath, {
      timeout: dto.timeout,
      outputPath: dto.outputPath,
      keepZip: dto.keepZip,
    });

    return {
      success: true,
      data: result,
    };
  }

  @Get('health')
  @ApiOperation({ summary: 'MinerU 服务健康检查' })
  @ApiResponse({ status: 200, description: '健康检查结果' })
  async healthCheck() {
    return await this.minerUService.healthCheck();
  }

  @Get('config')
  @ApiOperation({ summary: '获取 MinerU 服务配置' })
  @ApiResponse({ status: 200, description: '服务配置' })
  getConfig() {
    return this.minerUService.getConfig();
  }
}
