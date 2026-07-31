/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument */
import { Controller, Logger } from '@nestjs/common';
import { ProductPattern } from '@app/shared/enums';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import {
  ReduceStockUseCase,
  RestoreStockUseCase,
} from '../application/use-cases';

@Controller()
export class ProductsInventoryController {
  constructor(
    private readonly reduceStockUseCase: ReduceStockUseCase,
    private readonly restoreStockUseCase: RestoreStockUseCase,
  ) {}

  private readonly logger = new Logger(ProductsInventoryController.name);

  @MessagePattern({ cmd: ProductPattern.REDUCE_STOCK })
  async reduceStock(@Payload() data: { items: { productId: string; quantity: number }[] }) {
    this.logger.log('Microservicio Products (Inventario): Petición de reducción de stock recibida por Redis...');
    try {
      return await this.reduceStockUseCase.execute(data.items);
    } catch (error: any) {
      this.logger.error(`Microservicio Products Error (ReduceStock): ${error.message}`);
      throw new RpcException(error.message);
    }
  }

  @MessagePattern({ cmd: ProductPattern.RESTORE_STOCK })
  async restoreStock(@Payload() data: { items: { productId: string; quantity: number }[] }) {
    this.logger.log('Microservicio Products (Inventario): Petición de restauración de stock recibida por Redis...');
    try {
      return await this.restoreStockUseCase.execute(data.items);
    } catch (error: any) {
      this.logger.error(`Microservicio Products Error (RestoreStock): ${error.message}`);
      throw new RpcException(error.message);
    }
  }
}
