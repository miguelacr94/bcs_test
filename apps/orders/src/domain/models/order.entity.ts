import { OrderStatus } from '@app/shared/enums';

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export class Order {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly items: OrderItem[],
    public readonly totalAmount: number,
    public status: OrderStatus,
    public readonly createdAt: Date,
  ) {
    this.validateItems();
    this.validateTotalAmount();
  }

  // Regla de negocio: Una orden debe contener al menos un producto
  private validateItems(): void {
    if (!this.items || this.items.length === 0) {
      throw new Error(
        'Una orden de compra debe contener al menos un producto.',
      );
    }
  }

  // Regla de negocio: El monto total debe ser mayor a 0
  private validateTotalAmount(): void {
    if (this.totalAmount <= 0) {
      throw new Error('El monto total de la orden debe ser mayor a 0.');
    }
  }

  // Regla de Negocio: Completar una orden
  completeOrder(): void {
    if (this.status === OrderStatus.CANCELLED) {
      // Idealmente usaríamos tu DomainException, pero un Error normal sirve para probar
      throw new Error('No puedes completar una orden que ya fue cancelada.');
    }
    // Como es readonly, TypeScript podría quejarse.
    // Para solucionarlo temporalmente sin cambiar la estructura, puedes hacer un pequeño truco o quitar el readonly a 'status'.
    // Lo más sano es quitar el 'readonly' de 'status' en el constructor, ya que su estado SÍ muta en el tiempo.
    this.status = OrderStatus.COMPLETED;
  }

  // Regla de Negocio: Cancelar una orden
  cancelOrder(): void {
    if (this.status === OrderStatus.COMPLETED) {
      throw new Error('No puedes cancelar una orden que ya fue completada.');
    }
    this.status = OrderStatus.CANCELLED;
  }
}
