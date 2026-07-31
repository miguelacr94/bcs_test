import { Inject, Injectable } from '@nestjs/common';
import type { OrderRepositoryPort } from '../../domain/ports/order-repository.port';
import { Order } from '../../domain/models/order.entity';

@Injectable()
export class GetOrderUseCase {
  constructor(
    @Inject('OrderRepositoryPort')
    private readonly orderRepository: OrderRepositoryPort,
  ) {}

  async execute(id: string): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new Error(`Orden con ID ${id} no encontrada.`);
    }
    return order;
  }
}
