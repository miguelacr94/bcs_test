import { Inject, Injectable } from '@nestjs/common';
import type { ProductRepositoryPort } from '../../domain/ports/product-repository.port';
import { Product } from '../../domain/models/product.entity';
import { UpdateProductDto } from './dtos/update-product.dto';

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject('ProductRepositoryPort')
    private readonly productRepository: ProductRepositoryPort,
  ) {}

  async execute(id: string, dto: UpdateProductDto): Promise<Product> {
    // 1. Obtener el producto existente
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error(`Producto con ID ${id} no encontrado para actualizar.`);
    }

    // 2. Mezclar valores y crear la nueva entidad de dominio para forzar validaciones
    const updatedProduct = new Product(
      product.id,
      dto.name !== undefined ? dto.name : product.name,
      dto.description !== undefined ? dto.description : product.description,
      dto.price !== undefined ? dto.price : product.price,
      dto.stock !== undefined ? dto.stock : product.stock,
      dto.categoryId !== undefined ? dto.categoryId : product.categoryId,
      dto.isActive !== undefined ? dto.isActive : product.isActive,
      product.createdAt,
    );

    // 3. Persistir los cambios en la base de datos
    return await this.productRepository.save(updatedProduct);
  }
}
