/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument */
import { Controller } from '@nestjs/common';
import { PaginationDto } from '@app/shared/dtos';
import { ProductPattern } from '@app/shared/enums';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import {
  CreateProductUseCase,
  GetAllProductsUseCase,
  GetProductUseCase,
  UpdateProductUseCase,
  DeleteProductUseCase,
  ReduceStockUseCase,
  GetProductsByCategoryUseCase,
} from './application/use-cases';
import {
  CreateProductDto,
  UpdateProductDto,
} from './application/use-cases/dtos';
import { ActivateProductUseCase } from './application/use-cases/activate-product-use-case';

@Controller()
export class ProductsController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly getAllProductsUseCase: GetAllProductsUseCase,
    private readonly getProductUseCase: GetProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
    private readonly reduceStockUseCase: ReduceStockUseCase,
    private readonly getProductsByCategoryUseCase: GetProductsByCategoryUseCase,
    private readonly activateProductUseCase: ActivateProductUseCase,
  ) {}

  // Escuchar mensaje para crear un producto
  @MessagePattern({ cmd: ProductPattern.CREATE_PRODUCT })
  async createProduct(@Payload() dto: CreateProductDto) {
    console.log(
      'Microservicio Products (Hexagonal): Creando producto:',
      dto.name,
    );
    try {
      return await this.createProductUseCase.execute(dto);
    } catch (error: any) {
      console.error('Microservicio Products Error (Create):', error.message);
      throw new RpcException(error.message);
    }
  }

  // Escuchar mensaje para obtener todos los productos
  @MessagePattern({ cmd: ProductPattern.GET_ALL_PRODUCTS })
  async getAllProducts(@Payload() paginationDto: PaginationDto) {
    console.log(
      'Microservicio Products (Hexagonal): Solicitando todos los productos con paginación...',
      paginationDto,
    );
    try {
      const products = await this.getAllProductsUseCase.execute(
        paginationDto || { page: 1, limit: 10 },
      );
      return products;
    } catch (error: any) {
      console.error('Microservicio Products Error (FindAll):', error.message);
      throw new RpcException(error.message);
    }
  }

  // Escuchar mensaje para obtener un producto por ID
  @MessagePattern({ cmd: ProductPattern.GET_PRODUCT_BY_ID })
  async getProductById(@Payload() data: { id: string }) {
    console.log(
      'Microservicio Products (Hexagonal): Buscando producto con ID:',
      data.id,
    );
    try {
      return await this.getProductUseCase.execute(data.id);
    } catch (error: any) {
      console.error('Microservicio Products Error (FindOne):', error.message);
      throw new RpcException(error.message);
    }
  }

  // Escuchar mensaje para obtener un producto por categoria
  @MessagePattern({ cmd: ProductPattern.GET_PRODUCTS_BY_CATEGORY })
  async getProductsByCategory(
    @Payload() data: { id: string; paginationDto: PaginationDto },
  ) {
    console.log(
      'Microservicio Products (Hexagonal): Buscando producto por categoria con ID:',
      data.id,
    );
    try {
      return await this.getProductsByCategoryUseCase.execute(
        data.id,
        data.paginationDto,
      );
    } catch (error: any) {
      console.error(
        'Microservicio Products Error (FindByCategory):',
        error.message,
      );
      throw new RpcException(error.message);
    }
  }

  // Escuchar mensaje para actualizar un producto
  @MessagePattern({ cmd: ProductPattern.UPDATE_PRODUCT })
  async updateProduct(@Payload() data: { id: string; dto: UpdateProductDto }) {
    console.log(
      'Microservicio Products (Hexagonal): Actualizando producto con ID:',
      data.id,
    );
    try {
      return await this.updateProductUseCase.execute(data.id, data.dto);
    } catch (error: any) {
      console.error('Microservicio Products Error (Update):', error.message);
      throw new RpcException(error.message);
    }
  }

  // Escuchar mensaje para activar un producto
  @MessagePattern({ cmd: ProductPattern.ACTIVATE_PRODUCT })
  async activateProduct(@Payload() data: { id: string }) {
    console.log(
      'Microservicio Products (Hexagonal): Activando producto con ID:',
      data.id,
    );
    try {
      return await this.activateProductUseCase.execute(data.id);
    } catch (error: any) {
      console.error('Microservicio Products Error (Activate):', error.message);
      throw new RpcException(error.message);
    }
  }

  // Escuchar mensaje para eliminar un producto
  @MessagePattern({ cmd: ProductPattern.DELETE_PRODUCT })
  async deleteProduct(@Payload() data: { id: string }) {
    console.log(
      'Microservicio Products (Hexagonal): Eliminando producto con ID:',
      data.id,
    );
    try {
      return await this.deleteProductUseCase.execute(data.id);
    } catch (error: any) {
      console.error('Microservicio Products Error (Delete):', error.message);
      throw new RpcException(error.message);
    }
  }

  // Escuchar mensaje inter-microservicio para descontar inventario
  @MessagePattern({ cmd: ProductPattern.REDUCE_STOCK })
  async reduceStock(
    @Payload() data: { items: { productId: string; quantity: number }[] },
  ) {
    console.log(
      'Microservicio Products: Petición de reducción de stock recibida por Redis...',
    );
    try {
      return await this.reduceStockUseCase.execute(data.items);
    } catch (error: any) {
      console.error(
        'Microservicio Products Error (ReduceStock):',
        error.message,
      );
      throw new RpcException(error.message);
    }
  }
}
