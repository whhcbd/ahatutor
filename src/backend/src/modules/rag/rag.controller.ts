import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RagService } from './services/rag.service';
import {
  UploadDocumentDto,
  QueryDto,
  DocumentResponseDto,
  QueryResponseDto,
} from './dto/rag.dto';

@Controller('rag')
export class RAGController {
  constructor(private readonly ragService: RagService) {}

  /**
   * 上传文档内容（文本/Markdown）
   * POST /rag/documents
   */
  @Post('documents')
  @HttpCode(HttpStatus.CREATED)
  async uploadDocument(
    @Body() uploadDto: UploadDocumentDto,
  ): Promise<DocumentResponseDto> {
    return this.ragService.uploadDocument(uploadDto);
  }

  /**
   * 获取所有文档列表
   * GET /rag/documents
   */
  @Get('documents')
  async getDocuments(): Promise<DocumentResponseDto[]> {
    return this.ragService.getDocuments();
  }

  /**
   * 获取单个文档详情
   * GET /rag/documents/:id
   */
  @Get('documents/:id')
  async getDocument(
    @Param('id') id: string,
  ): Promise<DocumentResponseDto> {
    return this.ragService.getDocument(id);
  }

  /**
   * 删除文档
   * DELETE /rag/documents/:id
   */
  @Delete('documents/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteDocument(@Param('id') id: string): Promise<void> {
    return this.ragService.deleteDocument(id);
  }

  /**
   * 知识库查询（语义搜索）
   * POST /rag/query
   */
  @Post('query')
  @HttpCode(HttpStatus.OK)
  async query(@Body() queryDto: QueryDto): Promise<QueryResponseDto> {
    return this.ragService.query(queryDto);
  }

  /**
   * 获取知识库统计信息
   * GET /rag/stats
   */
  @Get('stats')
  async getStats(): Promise<{
    totalDocuments: number;
    totalChunks: number;
    totalEmbeddings: number;
  }> {
    return this.ragService.getStats();
  }
}
