import { Inject, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import type { OrderRepositoryPort } from '../../domain/ports/order-repository.port';
import type { ProductServicePort } from '../../domain/ports/product-service.port';
import { Order, OrderItem } from '../../domain/models/order.entity';
import { CreateOrderDto } from './dtos/create-order.dto';
import { OrderStatus } from '@app/shared/enums';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject('OrderRepositoryPort')
    private readonly orderRepository: OrderRepositoryPort,

    @Inject('ProductServicePort')
    private readonly productService: ProductServicePort,
  ) {}

  async execute(userId: string, dto: CreateOrderDto): Promise<Order> {
    // 1. Generar ID y fecha actuales para la orden
    const secureId = crypto.randomUUID();
    const createdAt = new Date();

    // 2. Calcular el total acumulado de la orden de compra
    const totalAmount = dto.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    // 3. Mapear los ítems a la interfaz del dominio OrderItem
    const domainItems: OrderItem[] = dto.items.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    }));

    // 4. Instanciar la Entidad de Dominio Order (esto ejecuta las validaciones de negocio de Order)
    const newOrder = new Order(
      secureId,
      userId,
      domainItems,
      totalAmount,
      OrderStatus.PENDING,
      createdAt,
    );

    // 5. Comunicación Inter-Microservicio: Descontar el inventario en Products vía Redis
    const stockReduced = await this.productService.reduceStock(
      dto.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    );

    if (!stockReduced) {
      throw new Error('No se pudo reducir el inventario para procesar la orden.');
    }

    // 6. El Patrón Saga: Intentar persistir, y si falla, COMPENSAR
    try {
      return await this.orderRepository.save(newOrder);
    } catch (error) {
      // ACCIÓN COMPENSATORIA (Saga de Reversa)
      console.error('SAGA: Falló al guardar la orden. Devolviendo inventario a Products...');
      await this.productService.restoreStock(
        dto.items.map(item => ({ productId: item.productId, quantity: item.quantity }))
      );
      
      throw new Error('SAGA: Orden abortada, inventario restaurado.');
    }
  }
}
