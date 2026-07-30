import { Order } from '../models/order.entity';
import { PaginationDto } from '@app/shared/dtos';

export interface OrderRepositoryPort {
  // Guardar una nueva orden o actualizar su estado
  save(order: Order): Promise<Order>;

  // Obtener todas las órdenes pertenecientes a un usuario con paginación
  findByUserId(userId: string, paginationDto: PaginationDto): Promise<Order[]>;

  // Obtener una orden específica por su ID
  findById(id: string): Promise<Order | null>;
}
