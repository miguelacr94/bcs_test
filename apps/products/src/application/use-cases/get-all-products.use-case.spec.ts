/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { GetAllProductsUseCase } from './get-all-products.use-case';
import { ProductRepositoryPort } from '../../domain/ports/product-repository.port';
import { Product } from '../../domain/models/product.entity';
import { PaginationDto } from '@app/shared/dtos';

describe('GetAllProductsUseCase (Unit Testing)', () => {
  let useCase: GetAllProductsUseCase;
  let mockRepository: jest.Mocked<ProductRepositoryPort>;

  beforeEach(async () => {
    // 1. Arrange (Preparar el Entorno Fake)
    // Creamos una falsificación (Mock) de nuestra Base de Datos (Puerto)
    const mockProductRepositoryProvider = {
      provide: 'ProductRepositoryPort',
      useValue: {
        findAll: jest.fn(), // Convertimos findAll en una función espía de Jest
        save: jest.fn(),
        findById: jest.fn(),
        delete: jest.fn(),
        findByCategory: jest.fn(),
      },
    };

    // Levantamos un mini-servidor de NestJS en memoria solo para esta prueba
    const module: TestingModule = await Test.createTestingModule({
      providers: [GetAllProductsUseCase, mockProductRepositoryProvider],
    }).compile();

    useCase = module.get<GetAllProductsUseCase>(GetAllProductsUseCase);
    mockRepository = module.get('ProductRepositoryPort');
  });

  it('Debería retornar un array de productos paginado y llamar al repositorio', async () => {
    // --- 1. Arrange (Preparación Específica del Test) ---
    const fakePaginationDto: PaginationDto = { page: 2, limit: 5 };
    const fakeProductsArray: Product[] = [
      new Product(
        '1',
        'Zapatos',
        'Rojos',
        100,
        10,
        'Laptops',
        true,
        new Date(),
      ),
      new Product('2', 'Camisa', 'Azul', 50, 20, 'Laptops', true, new Date()),
    ];

    // Le enseñamos al Mock qué debe responder cuando alguien llame a findAll()
    mockRepository.findAll.mockResolvedValue(fakeProductsArray);

    // --- 2. Act (Actuación / Ejecución) ---
    // Ejecutamos el caso de uso tal como lo haría el Controlador
    const result = await useCase.execute(fakePaginationDto);

    // --- 3. Assert (Afirmaciones / Verificaciones) ---
    // A. Verificamos que no explote y que la respuesta sea correcta
    expect(result).toBeDefined();
    expect(result).toEqual(fakeProductsArray);
    expect(result.length).toBe(2);

    // B. Verificación Arquitectónica Crítica:
    // Nos aseguramos que el Caso de Uso sí le pasó la paginación a la Base de Datos
    expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    expect(mockRepository.findAll).toHaveBeenCalledWith(fakePaginationDto);
  });
});
