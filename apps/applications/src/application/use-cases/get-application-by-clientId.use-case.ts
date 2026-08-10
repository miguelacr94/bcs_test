import { Inject, Injectable } from '@nestjs/common';
import { ApplicationRepositoryPort } from '../../domain/ports/application-repository.port';
import { Application } from '../../domain/models/application.entity';

@Injectable()
export class GetApplicationByClientIdUseCase {
  constructor(
    @Inject('ApplicationRepositoryPort')
    private readonly applicationRepository: ApplicationRepositoryPort,
  ) {}

  async execute(clientId: string): Promise<Application[]> {
    return await this.applicationRepository.findAllByClientId(clientId);
  }
}
