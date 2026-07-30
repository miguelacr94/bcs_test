import { Inject, Injectable } from '@nestjs/common';
import type { ProductRepositoryPort } from '../../domain/ports/product-repository.port';
import { Product } from '../../domain/models/product.entity';
import { PaginationDto } from '@app/shared/dtos';

import { PaginatedResponse } from '@app/shared/interfaces';

@Injectable()
export class GetAllProductsUseCase {
  constructor(
    @Inject('ProductRepositoryPort')
    private readonly productRepository: ProductRepositoryPort,
  ) {}

  async execute(paginationDto: PaginationDto): Promise<PaginatedResponse<Product>> {
    const { page = 1, limit = 10 } = paginationDto;
    const { data, total } = await this.productRepository.findAll(paginationDto);

    return {
      data,
      meta: {
        totalItems: total,
        itemCount: data.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }
}
