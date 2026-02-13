import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserData } from '../auth/decorators/current-user.decorator';
import { ProgressService } from './services/progress.service';
import {
  CreateProgressDto,
  UpdateProgressDto,
  CreateSessionDto,
  UpdateSessionDto,
  RecordQuizResultDto,
} from './dto/progress.dto';

@Controller('progress')
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post('progress')
  async createProgress(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: CreateProgressDto,
  ) {
    return this.progressService.createProgress(user.userId, dto);
  }

  @Get('progress')
  async getProgress(
    @CurrentUser() user: CurrentUserData,
    @Query('conceptId') conceptId?: string,
  ) {
    return this.progressService.getProgress(user.userId, conceptId);
  }

  @Get('progress/:id')
  async getProgressById(@Param('id') id: string) {
    return this.progressService.getProgressById(id);
  }

  @Put('progress/:id')
  async updateProgress(
    @Param('id') id: string,
    @Body() dto: UpdateProgressDto,
  ) {
    return this.progressService.updateProgress(id, dto);
  }

  @Delete('progress/:id')
  async deleteProgress(@Param('id') id: string) {
    await this.progressService.deleteProgress(id);
    return { success: true };
  }

  @Post('progress/:progressId/quiz')
  async recordQuizResult(
    @Param('progressId') progressId: string,
    @Body() dto: RecordQuizResultDto,
  ) {
    return this.progressService.recordQuizResult(progressId, dto);
  }

  @Post('sessions')
  async createSession(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: CreateSessionDto,
  ) {
    return this.progressService.createSession(user.userId, dto);
  }

  @Get('sessions')
  async getSessions(
    @CurrentUser() user: CurrentUserData,
    @Query('mode') mode?: string,
  ) {
    return this.progressService.getSessions(user.userId, mode);
  }

  @Get('sessions/:id')
  async getSession(@Param('id') id: string) {
    return this.progressService.getSession(id);
  }

  @Put('sessions/:id')
  async updateSession(
    @Param('id') id: string,
    @Body() dto: UpdateSessionDto,
  ) {
    return this.progressService.updateSession(id, dto);
  }

  @Delete('sessions/:id')
  async deleteSession(@Param('id') id: string) {
    await this.progressService.deleteSession(id);
    return { success: true };
  }

  @Get('stats')
  async getUserStats(@CurrentUser() user: CurrentUserData) {
    return this.progressService.getUserStats(user.userId);
  }

  @Get('stats/mastered')
  async getMasteredConcepts(
    @CurrentUser() user: CurrentUserData,
    @Query('threshold') threshold: string = '80',
  ) {
    return this.progressService.getMasteredConcepts(user.userId, parseInt(threshold, 10));
  }

  @Get('stats/weak')
  async getWeakConcepts(
    @CurrentUser() user: CurrentUserData,
    @Query('threshold') threshold: string = '50',
  ) {
    return this.progressService.getWeakConcepts(user.userId, parseInt(threshold, 10));
  }
}
