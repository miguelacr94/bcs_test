import { Inject, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { ApplicationRepositoryPort } from '../../domain/ports/application-repository.port';
import { Application } from '../../domain/models/application.entity';
import { ApplicationStatus } from '@app/shared/enums';

@Injectable()
export class CreateApplicationUseCase {
  constructor(
    @Inject('ApplicationRepositoryPort')
    private readonly applicationRepository: ApplicationRepositoryPort,
  ) {}

  async execute(clientId: string, channel: string): Promise<Application> {
    // Control de Duplicidad: Buscar si ya existe una solicitud activa
    const existingApplication = await this.applicationRepository.findByClientIdAndStatus(
      clientId,
      [ApplicationStatus.IN_PROCESS, ApplicationStatus.PENDING_VALIDATION]
    );

    if (existingApplication) {
      throw new Error(`Ya existe una solicitud activa en estado: ${existingApplication.status}`);
    }

    const secureId = crypto.randomUUID();
    const createdAt = new Date();

    const application = new Application(
      secureId,
      clientId,
      channel,
      ApplicationStatus.IN_PROCESS,
      createdAt,
    );

    application.addEvent('USER_ACTION', `Solicitud creada por el cliente desde el canal: ${channel}`, { channel });

    return await this.applicationRepository.save(application);
  }
}
