import { Inject, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { ApplicationRepositoryPort } from '../../domain/ports/application-repository.port';
import { Application } from '../../domain/models/application.entity';
import { ApplicationStatus } from '@app/shared/enums';
import { RestrictionException, SharedMessages } from '@app/shared';
import { OfferAmount } from '@app/shared/constants/offertAmount.constanst';

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
    const secureId = new Types.ObjectId().toString();

    try {
      await this.validateNoActiveApplication(clientId);
      await this.validate30DaysRestriction(clientId);

      if (offerResult?.approvedAmount) {
        await this.validateAmounts(clientId, offerResult);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      await this.applicationRepository.saveAudit(
        secureId,
        'BLOCKED_CREATION',
        errorMessage,
        'Inicio de proceso',
        ApplicationStatus.FINALIZED,
        { channel, offerResult },
      );
      throw error;
    }

    const createdAt = new Date();
    const radicado = this.generateRadicado(createdAt);

    const aplicationNewStatus = this.determineInitialStatus(
      offerResult,
      channel,
    );
    const auditMessage = this.determineAuditMessage(
      aplicationNewStatus,
      channel,
    );

    const application = new Application(
      secureId,
      radicado,
      clientId,
      channel,
      aplicationNewStatus,
      createdAt,
      offerResult,
    );

    const saved = await this.applicationRepository.save(application);

    await this.applicationRepository.saveAudit(
      saved.id,
      'USER_ACTION',
      auditMessage,
      'Inicio de proceso',
      aplicationNewStatus,
      { channel, offerResult },
    );

    return saved;
  }

  // --- MÉTODOS PRIVADOS DE VALIDACIÓN ---

  private async validateAmounts(
    clientId: string,
    offerResult: Record<string, unknown>,
  ): Promise<void> {
    const applications =
      await this.applicationRepository.findAllByClientId(clientId);

    let totalAmount = 0;

    for (const application of applications) {
      if (
        application.status === ApplicationStatus.IN_PROCESS ||
        application.status === ApplicationStatus.PENDING_VALIDATION
      ) {
        const approvedVal =
          application.offerResult?.approvedAmount ||
          application.offerResult?.amount ||
          0;
        totalAmount += Number(approvedVal);
      }
    }

    const currentOfferVal =
      offerResult?.approvedAmount || offerResult?.amount || 0;
    const newAmount = totalAmount + Number(currentOfferVal);

    if (newAmount > 1000000) {
      throw new Error(
        'Tu capacidad de crédito activa supera el límite permitido de $1,000,000.',
      );
    }
  }

  private async validateNoActiveApplication(clientId: string): Promise<void> {
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
  }

  private async validate30DaysRestriction(clientId: string): Promise<void> {
    const finalizedApp =
      await this.applicationRepository.findByClientIdAndStatus(
        clientId,
        ApplicationStatus.FINALIZED,
      );

    if (finalizedApp) {
      const audits = (await this.applicationRepository.findAuditsByOfferId(
        finalizedApp.id,
      )) as { createdAt?: string | Date }[];
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
        const availableDate = new Date(
          finalizedDate.getTime() + thirtyDaysInMs,
        );
        const dateStr = availableDate.toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
        const daysRemaining = Math.ceil(
          (thirtyDaysInMs - diffMs) / (1000 * 60 * 60 * 24),
        );

        throw new RestrictionException(
          SharedMessages.Application.RESTRICTION_ERROR(dateStr),
          availableDate.toISOString(),
          daysRemaining,
        );
      }
    }
  }

  // --- MÉTODOS PRIVADOS AUXILIARES ---

  private generateRadicado(date: Date): string {
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const randomPart = Math.floor(10000 + Math.random() * 90000).toString();
    return `RAD-${dateStr}-${randomPart}`;
  }

  private determineInitialStatus(
    offerResult: Record<string, unknown> | undefined,
    channel: string,
  ): ApplicationStatus {
    if (
      Number(offerResult?.approvedAmount) > OfferAmount.specialAmount &&
      channel?.toLowerCase() === 'web'
    ) {
      return ApplicationStatus.PENDING_VALIDATION;
    }
    return ApplicationStatus.IN_PROCESS;
  }

  private determineAuditMessage(
    status: ApplicationStatus,
    channel: string,
  ): string {
    if (status === ApplicationStatus.PENDING_VALIDATION) {
      return SharedMessages.Application.AUDIT_SPECIAL_OFFERT;
    }
    return SharedMessages.Application.AUDIT_CREATED(channel);
  }
}
