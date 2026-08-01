import { Module } from '@nestjs/common';
import { TechnicalTestController } from './technical-test.controller';
import { TechnicalTestService } from './technical-test.service';

@Module({
  imports: [],
  controllers: [TechnicalTestController],
  providers: [TechnicalTestService],
})
export class TechnicalTestModule {}
