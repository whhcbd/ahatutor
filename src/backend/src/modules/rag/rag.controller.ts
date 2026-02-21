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
import { RAGService } from './services/rag.service';
import {
  UploadDocumentDto,
  QueryDto,
  DocumentResponseDto,
  QueryResponseDto,
} from './dto/rag.dto';

@Controller('rag')
export class RAGController {
  constructor(private readonly ragService: RAGService) {}

  @Post('documents')
  @HttpCode(HttpStatus.CREATED)
  async uploadDocument(
    @Body() uploadDto: UploadDocumentDto,
  ): Promise<DocumentResponseDto> {
    return this.ragService.uploadDocument(uploadDto);
  }

  @Get('documents')
  async getDocuments(): Promise<DocumentResponseDto[]> {
    return this.ragService.getDocuments();
  }

  @Get('documents/:id')
  async getDocument(
    @Param('id') id: string,
  ): Promise<DocumentResponseDto> {
    return this.ragService.getDocument(id);
  }

  @Delete('documents/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteDocument(@Param('id') id: string): Promise<void> {
    return this.ragService.deleteDocument(id);
  }

  @Post('query')
  @HttpCode(HttpStatus.OK)
  async query(@Body() queryDto: QueryDto): Promise<QueryResponseDto> {
    return this.ragService.query(queryDto);
  }

  @Get('stats')
  async getStats(): Promise<{
    totalDocuments: number;
    totalChunks: number;
    totalEmbeddings: number;
  }> {
    return this.ragService.getStats();
  }
}
