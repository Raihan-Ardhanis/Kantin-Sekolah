import { Module } from '@nestjs/common';
import { DiskonController } from './diskon.controller';
import { DiskonService } from './diskon.service';

@Module({
  controllers: [DiskonController],
  providers: [DiskonService],
})
export class DiskonModule {}
