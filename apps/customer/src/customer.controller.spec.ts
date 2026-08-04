import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from './customer.controller';
import { CreateCustomerUseCase } from './application/use-cases/create-customer.use-case';
import { FindCustomerByDocumentUseCase } from './application/use-cases/find-customer-by-document.use-case';
import { RpcException } from '@nestjs/microservices';

describe('CustomerController', () => {
  let controller: CustomerController;
  let createUseCase: CreateCustomerUseCase;
  let findUseCase: FindCustomerByDocumentUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        {
          provide: CreateCustomerUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: FindCustomerByDocumentUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CustomerController>(CustomerController);
    createUseCase = module.get<CreateCustomerUseCase>(CreateCustomerUseCase);
    findUseCase = module.get<FindCustomerByDocumentUseCase>(FindCustomerByDocumentUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a customer successfully', async () => {
      const dto = { name: 'Juan', lastName: 'Perez', document: '123', email: 'a@a.com', phone: '123' };
      const expectedResult = { id: '1', ...dto };
      
      jest.spyOn(createUseCase, 'execute').mockResolvedValue(expectedResult as unknown as Awaited<ReturnType<typeof createUseCase.execute>>);

      const result = await controller.create(dto);
      expect(result).toEqual(expectedResult);
      expect(createUseCase.execute).toHaveBeenCalledWith(dto);
    });

    it('should throw RpcException on error', async () => {
      const dto = { name: 'Juan', lastName: 'Perez', document: '123', email: 'a@a.com', phone: '123' };
      jest.spyOn(createUseCase, 'execute').mockRejectedValue(new Error('Validation error'));

      await expect(controller.create(dto)).rejects.toThrow(RpcException);
    });
  });

  describe('findByDocument', () => {
    it('should find a customer', async () => {
      const mockCustomer = { id: '1', document: '123' };
      jest.spyOn(findUseCase, 'execute').mockResolvedValue(mockCustomer as unknown as Awaited<ReturnType<typeof findUseCase.execute>>);

      const result = await controller.findByDocument({ document: '123' });
      expect(result).toEqual(mockCustomer);
    });

    it('should throw RpcException (404) if not found', async () => {
      jest.spyOn(findUseCase, 'execute').mockResolvedValue(null);

      await expect(controller.findByDocument({ document: '123' })).rejects.toThrow(RpcException);
    });
  });
});
