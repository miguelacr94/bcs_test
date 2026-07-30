import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { CreateProductUseCase } from './application/use-cases/create-product.use-case';
import { GetAllProductsUseCase } from './application/use-cases/get-all-products.use-case';
import { GetProductUseCase } from './application/use-cases/get-product.use-case';
import { UpdateProductUseCase } from './application/use-cases/update-product.use-case';
import { DeleteProductUseCase } from './application/use-cases/delete-product.use-case';
import { ReduceStockUseCase } from './application/use-cases/reduce-stock.use-case';
import { GetProductsByCategoryUseCase } from './application/use-cases/get-products-by-category.use-case';

describe('ProductsController', () => {
  let productsController: ProductsController;

  const mockUseCase = { execute: jest.fn() };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        { provide: CreateProductUseCase, useValue: mockUseCase },
        { provide: GetAllProductsUseCase, useValue: mockUseCase },
        { provide: GetProductUseCase, useValue: mockUseCase },
        { provide: UpdateProductUseCase, useValue: mockUseCase },
        { provide: DeleteProductUseCase, useValue: mockUseCase },
        { provide: ReduceStockUseCase, useValue: mockUseCase },
        { provide: GetProductsByCategoryUseCase, useValue: mockUseCase },
      ],
    }).compile();

    productsController = app.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(productsController).toBeDefined();
  });
});
