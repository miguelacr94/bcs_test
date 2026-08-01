import { Controller, Get } from '@nestjs/common';
import { TechnicalTestService } from './technical-test.service';

@Controller()
export class TechnicalTestController {
  constructor(private readonly technicalTestService: TechnicalTestService) {}

  @Get()
  getHello(): string {
    return this.technicalTestService.getHello();
  }
}
