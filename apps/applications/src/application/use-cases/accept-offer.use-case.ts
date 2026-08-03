import { Inject, Injectable } from '@nestjs/common';
import { ApplicationRepositoryPort } from '../../domain/ports/application-repository.port';
import { Application } from '../../domain/models/application.entity';

@Injectable()
export class AcceptOfferUseCase {
  constructor(
    @Inject('ApplicationRepositoryPort')
    private readonly applicationRepository: ApplicationRepositoryPort,
  ) {}

  async execute(id: string): Promise<Application> {
    const application = await this.applicationRepository.findById(id);
    if (!application) {
      throw new Error(`Solicitud con ID ${id} no encontrada.`);
    }

    const previousStatus = application.status;
    application.acceptOffer();

    const saved = await this.applicationRepository.save(application);
    await this.applicationRepository.saveAudit(
      saved.id,
      'STATE_TRANSITION',
      'Oferta aceptada por el cliente. Solicitud pasa a Pendiente Validación.',
      previousStatus,
      saved.status
    );
    return saved;
  }
}
