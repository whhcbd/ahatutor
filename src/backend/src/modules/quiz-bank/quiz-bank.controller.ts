import { Controller, Get, Query, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { QuizBankService } from './quiz-bank.service';
import { Difficulty } from '@shared/types/genetics.types';

@ApiTags('Quiz Bank')
@Controller('quiz-bank')
export class QuizBankController {
  private readonly logger = new Logger(QuizBankController.name);

  constructor(private readonly quizBankService: QuizBankService) {}

  @Get('questions')
  @ApiOperation({ summary: '根据章节获取题目' })
  @ApiQuery({ name: 'chapters', required: true, type: [Number], description: '章节号数组' })
  @ApiQuery({ name: 'difficulty', required: false, enum: Difficulty, description: '难度' })
  @ApiQuery({ name: 'count', required: false, type: Number, description: '题目数量' })
  async getQuestionsByChapters(
    @Query('chapters') chapters: string,
    @Query('difficulty') difficulty?: Difficulty,
    @Query('count') count?: string
  ) {
    const chapterNumbers = chapters.split(',').map(n => parseInt(n.trim()));
    
    this.logger.log(`Fetching questions for chapters: ${chapterNumbers.join(', ')}`);
    
    return await this.quizBankService.getQuestionsByChapters({
      chapterNumbers,
      difficulty,
      count: count ? parseInt(count) : undefined
    });
  }

  @Get('questions/by-topics')
  @ApiOperation({ summary: '根据知识点获取题目' })
  @ApiQuery({ name: 'topics', required: true, type: [String], description: '知识点数组' })
  @ApiQuery({ name: 'difficulty', required: false, enum: Difficulty, description: '难度' })
  @ApiQuery({ name: 'count', required: false, type: Number, description: '题目数量' })
  async getQuestionsByTopics(
    @Query('topics') topics: string,
    @Query('difficulty') difficulty?: Difficulty,
    @Query('count') count?: string
  ) {
    const topicArray = topics.split(',').map(t => t.trim());
    
    this.logger.log(`Fetching questions for topics: ${topicArray.join(', ')}`);
    
    return await this.quizBankService.getQuestionsByTopics({
      topics: topicArray,
      difficulty,
      count: count ? parseInt(count) : undefined
    });
  }

  @Get('questions/random')
  @ApiOperation({ summary: '获取随机题目' })
  @ApiQuery({ name: 'count', required: true, type: Number, description: '题目数量' })
  @ApiQuery({ name: 'difficulty', required: false, enum: Difficulty, description: '难度' })
  @ApiQuery({ name: 'chapters', required: false, type: [Number], description: '章节号数组' })
  async getRandomQuestions(
    @Query('count') count: string,
    @Query('difficulty') difficulty?: Difficulty,
    @Query('chapters') chapters?: string
  ) {
    const questionCount = parseInt(count);
    const chapterNumbers = chapters ? chapters.split(',').map(n => parseInt(n.trim())) : undefined;
    
    this.logger.log(`Fetching ${questionCount} random questions`);
    
    return await this.quizBankService.getRandomQuestions({
      count: questionCount,
      difficulty,
      chapterNumbers
    });
  }

  @Get('chapters')
  @ApiOperation({ summary: '获取所有章节信息' })
  async getChapters() {
    return await this.quizBankService.getChapters();
  }

  @Get('topics')
  @ApiOperation({ summary: '获取所有知识点' })
  async getTopics() {
    return await this.quizBankService.getTopics();
  }

  @Get('stats')
  @ApiOperation({ summary: '获取题库统计信息' })
  async getStats() {
    return await this.quizBankService.getBankStats();
  }
}
