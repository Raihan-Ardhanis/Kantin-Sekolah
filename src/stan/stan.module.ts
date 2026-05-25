import { Module } from '@nestjs/common';
import { StanController } from './stan.controller';
import { StanService } from './stan.service';

@Module({
  controllers: [StanController],
  providers: [StanService],
})
export class StanModule {}
