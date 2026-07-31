import { Inject, Injectable } from '@nestjs/common';
import type { ProductRepositoryPort } from '../../../domain/ports/product-repository.port';
import { Product } from '../../../domain/models/product.entity';

export interface RestoreStockItem {
  productId: string;
  quantity: number;
}

@Injectable()
export class RestoreStockUseCase {
  constructor(
    @Inject('ProductRepositoryPort')
    private readonly productRepository: ProductRepositoryPort,
  ) {}

  async execute(items: RestoreStockItem[]): Promise<boolean> {
    for (const item of items) {
      const product = await this.productRepository.findById(item.productId);
      if (!product) {
        throw new Error(
          `Producto con ID ${item.productId} no fue encontrado para restaurar inventario.`,
        );
      }

      const newStock = product.stock + item.quantity;

      const updatedProduct = new Product(
        product.id,
        product.name,
        product.description,
        product.price,
        newStock,
        product.categoryId,
        product.isActive,
        product.createdAt,
      );

      await this.productRepository.save(updatedProduct);
    }

    return true;
  }
}
