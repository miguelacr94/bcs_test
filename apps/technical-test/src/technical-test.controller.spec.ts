import { Test, TestingModule } from '@nestjs/testing';
import { TechnicalTestController } from './technical-test.controller';
import { TechnicalTestService } from './technical-test.service';

describe('TechnicalTestController', () => {
  let technicalTestController: TechnicalTestController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TechnicalTestController],
      providers: [TechnicalTestService],
    }).compile();

    technicalTestController = app.get<TechnicalTestController>(TechnicalTestController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(technicalTestController.getHello()).toBe('Hello World!');
    });
  });
});
