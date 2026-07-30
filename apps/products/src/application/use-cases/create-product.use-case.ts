import { Inject, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import type { ProductRepositoryPort } from '../../domain/ports/product-repository.port';
import { Product } from '../../domain/models/product.entity';
import { CreateProductDto } from './dtos/create-product.dto';

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject('ProductRepositoryPort')
    private readonly productRepository: ProductRepositoryPort,
  ) {}

  async execute(dto: CreateProductDto): Promise<Product> {
    // 1. Generar ID y fecha actuales para la entidad
    const secureId = crypto.randomUUID();
    const createdAt = new Date();

    // 2. Instanciar la entidad del dominio (esto ejecuta las reglas de negocio de Product)
    const newProduct = new Product(
      secureId,
      dto.name,
      dto.description,
      dto.price,
      dto.stock,
      dto.categoryId,
      dto.isActive,
      createdAt,
    );

    // 3. Persistir usando el puerto
    return await this.productRepository.save(newProduct);
  }
}
