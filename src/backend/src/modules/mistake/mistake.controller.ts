import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MistakeService } from './services/mistake.service';
import { OcrService } from './services/ocr.service';
import { SimilarQuestionService } from './services/similar-question.service';
import {
  UploadMistakeDto,
  UpdateMistakeDto,
  GenerateSimilarDto,
} from './dto/mistake.dto';

@Controller('mistake')
export class MistakeController {
  constructor(
    private readonly mistakeService: MistakeService,
    private readonly ocrService: OcrService,
    private readonly similarQuestionService: SimilarQuestionService,
  ) {}

  /**
   * 上传错题图片
   * POST /mistake/upload
   */
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadMistake(
    @UploadedFile() file: Express.Multer.File,
    @Body() _body: { subject?: string; tags?: string },
  ) {
    const imageUrl = await this.mistakeService.uploadImage(file);
    return { imageUrl };
  }

  /**
   * 识别错题图片
   * POST /mistake/recognize
   */
  @Post('recognize')
  async recognizeMistake(@Body() dto: { imageUrl: string }) {
    const result = await this.ocrService.recognizeQuestion(dto.imageUrl);
    return result;
  }

  /**
   * 创建错题
   * POST /mistake
   */
  @Post()
  async createMistake(@Body() dto: UploadMistakeDto) {
    return this.mistakeService.create(dto);
  }

  /**
   * 获取所有错题
   * GET /mistake
   */
  @Get()
  async getMistakes(@Query() query: { subject?: string; tags?: string }) {
    return this.mistakeService.findAll(query);
  }

  /**
   * 获取单个错题
   * GET /mistake/:id
   */
  @Get(':id')
  async getMistake(@Param('id') id: string) {
    return this.mistakeService.findOne(id);
  }

  /**
   * 更新错题
   * PUT /mistake/:id
   */
  @Post(':id')
  async updateMistake(@Param('id') id: string, @Body() dto: UpdateMistakeDto) {
    return this.mistakeService.update(id, dto);
  }

  /**
   * 删除错题
   * DELETE /mistake/:id
   */
  @Delete(':id')
  async deleteMistake(@Param('id') id: string) {
    return this.mistakeService.delete(id);
  }

  /**
   * 举一反三 - 生成相似题
   * POST /mistake/:id/similar
   */
  @Post(':id/similar')
  async generateSimilar(
    @Param('id') id: string,
    @Body() dto: GenerateSimilarDto,
  ) {
    const mistake = await this.mistakeService.findOne(id);
    return this.similarQuestionService.generate(mistake, dto);
  }

  /**
   * 按知识点获取错题
   * GET /mistake/by-topic/:topic
   */
  @Get('by-topic/:topic')
  async getByTopic(@Param('topic') topic: string) {
    return this.mistakeService.findByTopic(topic);
  }

  /**
   * 获取薄弱知识点统计
   * GET /mistake/stats/weakness
   */
  @Get('stats/weakness')
  async getWeaknessStats() {
    return this.mistakeService.getWeaknessStats();
  }
}
