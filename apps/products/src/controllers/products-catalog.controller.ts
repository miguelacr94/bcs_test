/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument */
import { Controller, Logger } from '@nestjs/common';
import { PaginationDto } from '@app/shared/dtos';
import { ProductPattern } from '@app/shared/enums';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import {
  CreateProductUseCase,
  GetAllProductsUseCase,
  GetProductUseCase,
  UpdateProductUseCase,
  DeleteProductUseCase,
  GetProductsByCategoryUseCase,
  ActivateProductUseCase,
} from '../application/use-cases';
import {
  CreateProductDto,
  UpdateProductDto,
} from '../application/use-cases/dtos';

@Controller()
export class ProductsCatalogController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly getAllProductsUseCase: GetAllProductsUseCase,
    private readonly getProductUseCase: GetProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
    private readonly getProductsByCategoryUseCase: GetProductsByCategoryUseCase,
    private readonly activateProductUseCase: ActivateProductUseCase,
  ) {}

  private readonly logger = new Logger(ProductsCatalogController.name);

  @MessagePattern({ cmd: ProductPattern.CREATE_PRODUCT })
  async createProduct(@Payload() dto: CreateProductDto) {
    this.logger.log(`Microservicio Products (Catálogo): Creando producto: ${dto.name}`);
    try {
      return await this.createProductUseCase.execute(dto);
    } catch (error: any) {
      this.logger.error(`Microservicio Products Error (Create): ${error.message}`);
      throw new RpcException(error.message);
    }
  }

  @MessagePattern({ cmd: ProductPattern.GET_ALL_PRODUCTS })
  async getAllProducts(@Payload() paginationDto: PaginationDto) {
    this.logger.log(`Microservicio Products (Catálogo): Solicitando todos los productos con paginación... ${JSON.stringify(paginationDto)}`);
    try {
      return await this.getAllProductsUseCase.execute(paginationDto || { page: 1, limit: 10 });
    } catch (error: any) {
      this.logger.error(`Microservicio Products Error (FindAll): ${error.message}`);
      throw new RpcException(error.message);
    }
  }

  @MessagePattern({ cmd: ProductPattern.GET_PRODUCT_BY_ID })
  async getProductById(@Payload() data: { id: string }) {
    this.logger.log(`Microservicio Products (Catálogo): Buscando producto con ID: ${data.id}`);
    try {
      return await this.getProductUseCase.execute(data.id);
    } catch (error: any) {
      this.logger.error(`Microservicio Products Error (FindOne): ${error.message}`);
      throw new RpcException(error.message);
    }
  }

  @MessagePattern({ cmd: ProductPattern.GET_PRODUCTS_BY_CATEGORY })
  async getProductsByCategory(@Payload() data: { id: string; paginationDto: PaginationDto }) {
    this.logger.log(`Microservicio Products (Catálogo): Buscando producto por categoria con ID: ${data.id}`);
    try {
      return await this.getProductsByCategoryUseCase.execute(data.id, data.paginationDto);
    } catch (error: any) {
      this.logger.error(`Microservicio Products Error (FindByCategory): ${error.message}`);
      throw new RpcException(error.message);
    }
  }

  @MessagePattern({ cmd: ProductPattern.UPDATE_PRODUCT })
  async updateProduct(@Payload() data: { id: string; dto: UpdateProductDto }) {
    this.logger.log(`Microservicio Products (Catálogo): Actualizando producto con ID: ${data.id}`);
    try {
      return await this.updateProductUseCase.execute(data.id, data.dto);
    } catch (error: any) {
      this.logger.error(`Microservicio Products Error (Update): ${error.message}`);
      throw new RpcException(error.message);
    }
  }

  @MessagePattern({ cmd: ProductPattern.ACTIVATE_PRODUCT })
  async activateProduct(@Payload() data: { id: string }) {
    this.logger.log(`Microservicio Products (Catálogo): Activando producto con ID: ${data.id}`);
    try {
      return await this.activateProductUseCase.execute(data.id);
    } catch (error: any) {
      this.logger.error(`Microservicio Products Error (Activate): ${error.message}`);
      throw new RpcException(error.message);
    }
  }

  @MessagePattern({ cmd: ProductPattern.DELETE_PRODUCT })
  async deleteProduct(@Payload() data: { id: string }) {
    this.logger.log(`Microservicio Products (Catálogo): Eliminando producto con ID: ${data.id}`);
    try {
      return await this.deleteProductUseCase.execute(data.id);
    } catch (error: any) {
      this.logger.error(`Microservicio Products Error (Delete): ${error.message}`);
      throw new RpcException(error.message);
    }
  }
}
