import { Inject, Injectable } from '@nestjs/common';
import type { OrderRepositoryPort } from '../../domain/ports/order-repository.port';
import { Order } from '../../domain/models/order.entity';
import { PaginationDto } from '@app/shared/dtos';

@Injectable()
export class GetUserOrdersUseCase {
  constructor(
    @Inject('OrderRepositoryPort')
    private readonly orderRepository: OrderRepositoryPort,
  ) {}

  async execute(userId: string, paginationDto: PaginationDto): Promise<Order[]> {
    return await this.orderRepository.findByUserId(userId, paginationDto);
  }
}
