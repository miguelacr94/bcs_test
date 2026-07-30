import { Controller } from '@nestjs/common';
import { OrderPattern } from '@app/shared/enums';
import { PaginationDto } from '@app/shared/dtos';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { CreateOrderUseCase, GetUserOrdersUseCase } from './application/use-cases';
import { CreateOrderDto } from './application/use-cases/dtos';

@Controller()
export class OrdersController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly getUserOrdersUseCase: GetUserOrdersUseCase,
  ) {}

  // Escuchar mensaje para crear una orden de compra
  @MessagePattern({ cmd: OrderPattern.CREATE_ORDER })
  async createOrder(@Payload() data: { userId: string; dto: CreateOrderDto }) {
    console.log('Microservicio Orders: Creando orden para usuario:', data.userId);
    try {
      return await this.createOrderUseCase.execute(data.userId, data.dto);
    } catch (error: any) {
      console.error('Microservicio Orders Error:', error.message);
      throw new RpcException(error.message);
    }
  }

  // Escuchar mensaje para obtener las órdenes de un usuario
  @MessagePattern({ cmd: OrderPattern.GET_USER_ORDERS })
  async getUserOrders(@Payload() data: { userId: string; paginationDto: PaginationDto }) {
    console.log('Microservicio Orders: Consultando órdenes del usuario:', data.userId);
    try {
      return await this.getUserOrdersUseCase.execute(data.userId, data.paginationDto || { page: 1, limit: 10 });
    } catch (error: any) {
      console.error('Microservicio Orders Error (GetUserOrders):', error.message);
      throw new RpcException(error.message);
    }
  }
}
