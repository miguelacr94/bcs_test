import { Controller, Logger } from '@nestjs/common';
import { OrderPattern } from '@app/shared/enums';
import { PaginationDto } from '@app/shared/dtos';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import {
  CancelOrderUseCase,
  CreateOrderUseCase,
  GetOrderUseCase,
  GetUserOrdersUseCase,
} from './application/use-cases';
import { CreateOrderDto } from './application/use-cases/dtos';

@Controller()
export class OrdersController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly cancelOrderUseCase: CancelOrderUseCase,
    private readonly getUserOrdersUseCase: GetUserOrdersUseCase,
    private readonly getOrderUseCase: GetOrderUseCase,
  ) {}

  private readonly logger = new Logger(OrdersController.name);

  // Escuchar mensaje para crear una orden de compra
  @MessagePattern({ cmd: OrderPattern.CREATE_ORDER })
  async createOrder(@Payload() data: { userId: string; dto: CreateOrderDto }) {
    this.logger.log(
      `Microservicio Orders: Creando orden para usuario: ${data.userId}`,
    );
    try {
      return await this.createOrderUseCase.execute(data.userId, data.dto);
    } catch (error: any) {
      this.logger.error(`Microservicio Orders Error (Create): ${error.message}`);
      throw new RpcException(error.message);
    }
  }

  // Escuchar mensaje para obtener las órdenes de un usuario
  @MessagePattern({ cmd: OrderPattern.GET_USER_ORDERS })
  async getUserOrders(
    @Payload() data: { userId: string; paginationDto: PaginationDto },
  ) {
    this.logger.log(
      `Microservicio Orders: Consultando órdenes del usuario: ${data.userId}`,
    );
    try {
      return await this.getUserOrdersUseCase.execute(
        data.userId,
        data.paginationDto || { page: 1, limit: 10 },
      );
    } catch (error: any) {
      this.logger.error(
        `Microservicio Orders Error (GetUserOrders): ${error.message}`,
      );
      throw new RpcException(error.message);
    }
  }

  @MessagePattern({ cmd: OrderPattern.GET_ORDER_BY_ID })
  async getOrderById(@Payload() data: { orderId: string }) {
    this.logger.log(`Microservicio Orders: Buscando orden: ${data.orderId}`);
    try {
      return await this.getOrderUseCase.execute(data.orderId); // Acuérdate de inyectarlo en el constructor
    } catch (error: any) {
      throw new RpcException(error.message);
    }
  }

  // NUEVO: Escuchar mensaje para cancelar una orden
  @MessagePattern({ cmd: OrderPattern.CANCEL_ORDER })
  async cancelOrder(@Payload() data: { orderId: string }) {
    this.logger.log(`Microservicio Orders: Cancelando orden: ${data.orderId}`);
    try {
      return await this.cancelOrderUseCase.execute(data.orderId);
    } catch (error: any) {
      this.logger.error(`Microservicio Orders Error (CancelOrder): ${error.message}`);
      throw new RpcException(error.message);
    }
  }
}
