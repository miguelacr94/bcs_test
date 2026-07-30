import { Product } from '../../domain/models/product.entity';
import { ProductDocument } from '../schemas/product.schema';

export class ProductMapper {
  // Convierte un documento de Mongoose a la Entidad de Dominio Product
  static toDomain(document: ProductDocument): Product {
    return new Product(
      document._id.toString(),
      document.name,
      document.description,
      document.price,
      document.stock,
      document.categoryId,
      document.isActive !== undefined ? document.isActive : true,
      document.createdAt,
    );
  }

  // Convierte la Entidad de Dominio Product a un objeto plano listo para guardar en MongoDB
  static toPersistence(domain: Product): Partial<ProductDocument> {
    return {
      name: domain.name,
      description: domain.description,
      price: domain.price,
      stock: domain.stock,
      categoryId: domain.categoryId,
      createdAt: domain.createdAt,
    };
  }
}
