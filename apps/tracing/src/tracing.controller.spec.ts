import { Test, TestingModule } from '@nestjs/testing';
import { TracingController } from './tracing.controller';
import { TracingService } from './tracing.service';

describe('TracingController', () => {
  let tracingController: TracingController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TracingController],
      providers: [TracingService],
    }).compile();

    tracingController = app.get<TracingController>(TracingController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(tracingController.getHello()).toBe('Hello World!');
    });
  });
});
