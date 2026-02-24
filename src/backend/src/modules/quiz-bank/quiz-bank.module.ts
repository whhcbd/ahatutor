import { Module } from '@nestjs/common';
import { QuizBankController } from './quiz-bank.controller';
import { QuizBankService } from './quiz-bank.service';

@Module({
  controllers: [QuizBankController],
  providers: [QuizBankService],
  exports: [QuizBankService]
})
export class QuizBankModule {}
