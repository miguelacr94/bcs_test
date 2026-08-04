import { Inject, Injectable } from '@nestjs/common';
import { ApplicationRepositoryPort } from '../../domain/ports/application-repository.port';
import { ApplicationEvent } from '../../domain/models/application.entity';

@Injectable()
export class GetApplicationEventsUseCase {
  constructor(
    @Inject('ApplicationRepositoryPort')
    private readonly applicationRepository: ApplicationRepositoryPort,
  ) {}

  async execute(id: string): Promise<unknown[]> {
    return await this.applicationRepository.findAuditsByOfferId(id);
  }
}
