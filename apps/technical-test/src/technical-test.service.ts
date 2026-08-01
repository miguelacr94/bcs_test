import { Injectable } from '@nestjs/common';

@Injectable()
export class TechnicalTestService {
  getHello(): string {
    return 'Hello World!';
  }
}
