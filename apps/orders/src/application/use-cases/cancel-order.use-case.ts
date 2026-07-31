import { Inject, Injectable } from '@nestjs/common';
import type { OrderRepositoryPort } from '../../domain/ports/order-repository.port';
import { ProductServicePort } from '../../domain/ports/product-service.port';

@Injectable()
export class CancelOrderUseCase {
  constructor(
    @Inject('OrderRepositoryPort')
    private readonly orderRepository: OrderRepositoryPort,
    @Inject('ProductServicePort')
    private readonly productService: ProductServicePort,
  ) {}

  async execute(id: string): Promise<{ success: boolean }> {
    // 1. Buscamos el producto por su ID
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new Error(`Orden con ID ${id} no encontrada.`);
    }

    // 2. Ejecutamos nuestra regla de negocio (Soft Delete)
    order.cancelOrder();

    // 3. Lo guardamos de vuelta en la base de datos ya desactivado
    const res = await this.orderRepository.save(order);

    if (res) {
      // Usamos el Walkie-Talkie para enviarle el mensaje a Redis
      await this.productService.restoreStock(
        order.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      );
    }

    return { success: true };
  }
}
