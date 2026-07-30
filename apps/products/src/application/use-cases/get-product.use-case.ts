import { Inject, Injectable } from '@nestjs/common';
import type { ProductRepositoryPort } from '../../domain/ports/product-repository.port';
import { Product } from '../../domain/models/product.entity';

@Injectable()
export class GetProductUseCase {
  constructor(
    @Inject('ProductRepositoryPort')
    private readonly productRepository: ProductRepositoryPort,
  ) {}

  async execute(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error(`Producto con ID ${id} no encontrado.`);
    }
    return product;
  }
}
