import { Inject, Injectable } from '@nestjs/common';
import type { ProductRepositoryPort } from '../../../domain/ports/product-repository.port';
import { Product } from '../../../domain/models/product.entity';

export interface ReduceStockItem {
  productId: string;
  quantity: number;
}

@Injectable()
export class ReduceStockUseCase {
  constructor(
    @Inject('ProductRepositoryPort')
    private readonly productRepository: ProductRepositoryPort,
  ) {}

  async execute(items: ReduceStockItem[]): Promise<boolean> {
    for (const item of items) {
      const product = await this.productRepository.findById(item.productId);
      if (!product) {
        throw new Error(
          `Producto con ID ${item.productId} no fue encontrado para descontar inventario.`,
        );
      }

      const newStock = product.stock - item.quantity;
      if (newStock < 0) {
        throw new Error(
          `Inventario insuficiente para el producto "${product.name}". Stock disponible: ${product.stock}, solicitado: ${item.quantity}`,
        );
      }

      // Reinstanciar la Entidad de Dominio para forzar la regla que prohíbe stock negativo
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
