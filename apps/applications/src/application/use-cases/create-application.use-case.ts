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

    // Regla de Negocio: Validar si existe una solicitud finalizada en los últimos 30 días
    const finalizedApp = await this.applicationRepository.findByClientIdAndStatus(
      clientId,
      ApplicationStatus.FINALIZED,
    );

    if (finalizedApp) {
      // Find the date it was finalized
      const audits = await this.applicationRepository.findAuditsByOfferId(finalizedApp.id) as any[];
      let finalizedDate = finalizedApp.createdAt;
      
      if (audits && audits.length > 0) {
        const lastAudit = audits[audits.length - 1];
        if (lastAudit.createdAt) {
          finalizedDate = new Date(lastAudit.createdAt);
        }
      }

      const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
      const now = new Date();
      const diffMs = now.getTime() - finalizedDate.getTime();
      
      if (diffMs < thirtyDaysInMs) {
        const availableDate = new Date(finalizedDate.getTime() + thirtyDaysInMs);
        const dateStr = availableDate.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
        const daysRemaining = Math.ceil((thirtyDaysInMs - diffMs) / (1000 * 60 * 60 * 24));
        
        const error = new Error(
          `Tiene una solicitud finalizada recientemente. Podrá iniciar un nuevo proceso a partir del ${dateStr}.`,
        );
        (error as any).availableDate = availableDate.toISOString();
        (error as any).daysRemaining = daysRemaining;
        throw error;
      }
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
