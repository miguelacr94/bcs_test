import { Inject, Injectable } from '@nestjs/common';
import { ApplicationRepositoryPort } from '../../domain/ports/application-repository.port';

@Injectable()
export class AbandonApplicationUseCase {
  constructor(
    @Inject('ApplicationRepositoryPort')
    private readonly applicationRepository: ApplicationRepositoryPort,
  ) {}

  async execute(id: string, reason: string): Promise<{ success: boolean; message: string }> {
    const application = await this.applicationRepository.findById(id);
    if (!application) {
      throw new Error(`Solicitud con ID ${id} no encontrada.`);
    }

    const previousStatus = application.status;
    application.abandonApplication(reason);

    const saved = await this.applicationRepository.save(application);
    await this.applicationRepository.saveAudit(
      saved.id,
      'STATE_TRANSITION',
      `Solicitud abandonada. Motivo: ${reason}`,
      previousStatus,
      saved.status,
      { reason }
    );
    return { success: true, message: 'Solicitud abandonada correctamente.' };
  }
}
