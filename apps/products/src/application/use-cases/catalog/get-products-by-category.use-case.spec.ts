/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { GetProductsByCategoryUseCase } from './get-products-by-category.use-case';
import { ProductRepositoryPort } from '../../../domain/ports/product-repository.port';
import { Product } from '../../../domain/models/product.entity';
import { PaginationDto } from '@app/shared/dtos';

describe('GetProductsByCategoryUseCase (Unit Testing)', () => {
  let useCase: GetProductsByCategoryUseCase;
  let mockRepository: jest.Mocked<ProductRepositoryPort>;

  beforeEach(async () => {
    const mockProductRepositoryProvider = {
      provide: 'ProductRepositoryPort',
      useValue: {
        findAll: jest.fn(),
        save: jest.fn(),
        findById: jest.fn(),
        delete: jest.fn(),
        findByCategory: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [GetProductsByCategoryUseCase, mockProductRepositoryProvider],
    }).compile();

    useCase = module.get<GetProductsByCategoryUseCase>(
      GetProductsByCategoryUseCase,
    );
    mockRepository = module.get('ProductRepositoryPort');
  });

  it('Debería retornar un array de productos paginado por categoría y llamar al repositorio', async () => {
    const fakePaginationDto: PaginationDto = { page: 1, limit: 10 };
    const fakeCategoryId = 'Laptops';
    const fakeProductsArray: Product[] = [
      new Product(
        '1',
        'Zapatos',
        'Rojos',
        100,
        10,
        fakeCategoryId,
        true,
        new Date(),
      ),
    ];

    mockRepository.findByCategory.mockResolvedValue({
      data: fakeProductsArray,
      total: 1,
    });

    const result = await useCase.execute(fakeCategoryId, fakePaginationDto);

    expect(result).toBeDefined();
    expect(result.data).toEqual(fakeProductsArray);
    expect(result.meta.totalItems).toBe(1);

    expect(mockRepository.findByCategory).toHaveBeenCalledTimes(1);
    expect(mockRepository.findByCategory).toHaveBeenCalledWith(
      fakeCategoryId,
      fakePaginationDto,
    );
  });
});
