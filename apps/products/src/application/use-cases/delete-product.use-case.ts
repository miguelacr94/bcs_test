import { Inject, Injectable } from '@nestjs/common';
import type { ProductRepositoryPort } from '../../domain/ports/product-repository.port';

@Injectable()
export class DeleteProductUseCase {
  constructor(
    @Inject('ProductRepositoryPort')
    private readonly productRepository: ProductRepositoryPort,
  ) {}

  async execute(id: string): Promise<{ success: boolean }> {
    // 1. Buscamos el producto por su ID
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error(`Producto con ID ${id} no encontrado para eliminar.`);
    }

    // 2. Ejecutamos nuestra regla de negocio (Soft Delete)
    product.deactivate();

    // 3. Lo guardamos de vuelta en la base de datos ya desactivado
    await this.productRepository.save(product);

    return { success: true };
  }
}
