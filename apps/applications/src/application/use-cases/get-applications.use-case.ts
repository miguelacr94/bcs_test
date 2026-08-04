import { Inject, Injectable } from '@nestjs/common';
import { PaginationDto } from '@app/shared/dtos';
import { Application } from '../../domain/models/application.entity';
import { PaginatedResponse } from '@app/shared/interfaces';
import { ApplicationRepositoryPort } from '../../domain/ports/application-repository.port';

@Injectable()
export class GetApplicationsUseCase {
  constructor(
    @Inject('ApplicationRepositoryPort')
    private readonly applicationRepository: ApplicationRepositoryPort,
  ) {}

  async execute(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<Application>> {
    const { page = 1, limit = 10 } = paginationDto;
    const { data, total } =
      await this.applicationRepository.findAll(paginationDto);

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
