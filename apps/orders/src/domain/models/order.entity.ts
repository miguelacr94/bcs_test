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
    public readonly status: OrderStatus,
    public readonly createdAt: Date,
  ) {
    this.validateItems();
    this.validateTotalAmount();
  }

  // Regla de negocio: Una orden debe contener al menos un producto
  private validateItems(): void {
    if (!this.items || this.items.length === 0) {
      throw new Error('Una orden de compra debe contener al menos un producto.');
    }
  }

  // Regla de negocio: El monto total debe ser mayor a 0
  private validateTotalAmount(): void {
    if (this.totalAmount <= 0) {
      throw new Error('El monto total de la orden debe ser mayor a 0.');
    }
  }
}
