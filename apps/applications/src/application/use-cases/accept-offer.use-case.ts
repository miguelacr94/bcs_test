import { Inject, Injectable } from '@nestjs/common';
import { ApplicationRepositoryPort } from '../../domain/ports/application-repository.port';

@Injectable()
export class AcceptOfferUseCase {
  constructor(
    @Inject('ApplicationRepositoryPort')
    private readonly applicationRepository: ApplicationRepositoryPort,
  ) {}

  async execute(id: string, channel?: string): Promise<{ success: boolean; message: string }> {
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
      'Oferta aceptada. Solicitud pasa a Pendiente Validación.',
      previousStatus,
      saved.status,
      { channel: channel ?? 'Autogestionado' }
    );
    return { success: true, message: 'Oferta aceptada correctamente.' };
  }
}
