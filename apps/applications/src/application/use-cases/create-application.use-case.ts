import { Inject, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { ApplicationRepositoryPort } from '../../domain/ports/application-repository.port';
import { Application } from '../../domain/models/application.entity';
import { ApplicationStatus } from '@app/shared/enums';

@Injectable()
export class CreateApplicationUseCase {
  constructor(
    @Inject('ApplicationRepositoryPort')
    private readonly applicationRepository: ApplicationRepositoryPort,
  ) {}

  async execute(
    clientId: string,
    channel: string,
    offerResult?: Record<string, unknown>,
  ): Promise<Application> {
    // Control de Duplicidad: Buscar si ya existe una solicitud activa
    const existingApplication =
      await this.applicationRepository.findByClientIdAndStatus(clientId, [
        ApplicationStatus.IN_PROCESS,
        ApplicationStatus.PENDING_VALIDATION,
      ]);

    if (existingApplication) {
      throw new Error(
        `Ya existe una solicitud activa en estado: ${existingApplication.status}`,
      );
    }

    const secureId = new Types.ObjectId().toString();
    const createdAt = new Date();

    // Generar radicado único: RAD-YYYYMMDD-XXXXX
    const dateStr = createdAt.toISOString().slice(0, 10).replace(/-/g, '');
    const randomPart = Math.floor(10000 + Math.random() * 90000).toString();
    const radicado = `RAD-${dateStr}-${randomPart}`;

    const application = new Application(
      secureId,
      radicado,
      clientId,
      channel,
      ApplicationStatus.IN_PROCESS,
      createdAt,
      offerResult,
    );

    const saved = await this.applicationRepository.save(application);
    await this.applicationRepository.saveAudit(
      saved.id,
      'USER_ACTION',
      `Solicitud creada por el cliente desde el canal: ${channel}`,
      'Inicio de proceso',
      ApplicationStatus.IN_PROCESS,
      { channel, offerResult },
    );
    return saved;
  }
}
