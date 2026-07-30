import { Product } from '../models/product.entity';
import { PaginationDto } from '@app/shared/dtos';

export interface ProductRepositoryPort {
  // Guardar o actualizar un producto
  save(product: Product): Promise<Product>;

  // Obtener todos los productos con paginación
  findAll(
    paginationDto: PaginationDto,
  ): Promise<{ data: Product[]; total: number }>;

  // Buscar un producto por ID
  findById(id: string): Promise<Product | null>;

  // Buscar un producto por categoria
  findByCategory(
    id: string,
    paginationDto: PaginationDto,
  ): Promise<{ data: Product[]; total: number }>;

  // Eliminar un producto por ID
  delete(id: string): Promise<boolean>;
}
