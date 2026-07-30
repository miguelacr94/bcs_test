import { Order, OrderItem } from '../../domain/models/order.entity';
import { OrderDocument } from '../schemas/order.schema';

export class OrderMapper {
  // Convierte un documento de Mongoose a la Entidad de Dominio Order
  static toDomain(document: OrderDocument): Order {
    const domainItems: OrderItem[] = document.items.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    }));

    return new Order(
      document._id.toString(),
      document.userId,
      domainItems,
      document.totalAmount,
      document.status,
      document.createdAt,
    );
  }

  // Convierte la Entidad de Dominio Order a un objeto listo para guardar en Mongoose
  static toPersistence(domain: Order): Partial<OrderDocument> {
    return {
      userId: domain.userId,
      items: domain.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: domain.totalAmount,
      status: domain.status,
      createdAt: domain.createdAt,
    };
  }
}
