import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { CreateOrderUseCase } from './application/use-cases/create-order.use-case';
import { GetUserOrdersUseCase } from './application/use-cases/get-user-orders.use-case';

describe('OrdersController', () => {
  let ordersController: OrdersController;

  const mockUseCase = { execute: jest.fn() };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        { provide: CreateOrderUseCase, useValue: mockUseCase },
        { provide: GetUserOrdersUseCase, useValue: mockUseCase },
      ],
    }).compile();

    ordersController = app.get<OrdersController>(OrdersController);
  });

  it('should be defined', () => {
    expect(ordersController).toBeDefined();
  });
});
