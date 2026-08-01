import { Inject, Injectable } from '@nestjs/common';
import { ApplicationRepositoryPort } from '../../domain/ports/application-repository.port';
import { ApplicationEvent } from '../../domain/models/application.entity';

@Injectable()
export class GetApplicationEventsUseCase {
  constructor(
    @Inject('ApplicationRepositoryPort')
    private readonly applicationRepository: ApplicationRepositoryPort,
  ) {}

  async execute(id: string): Promise<ApplicationEvent[]> {
    const application = await this.applicationRepository.findById(id);
    if (!application) {
      throw new Error(`Solicitud con ID ${id} no encontrada.`);
    }

    return application.events;
  }
}
