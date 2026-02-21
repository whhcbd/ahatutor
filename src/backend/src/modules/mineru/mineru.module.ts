import { Module } from '@nestjs/common';
import { MinerUService } from './mineru.service';
import { MinerUController } from './mineru.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [MinerUController],
  providers: [MinerUService],
  exports: [MinerUService],
})
export class MinerUModule {}
