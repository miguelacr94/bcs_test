import { Inject, Injectable } from '@nestjs/common';
import { ApplicationRepositoryPort } from '../../domain/ports/application-repository.port';
import { ClientProxy } from '@nestjs/microservices';
import { DisbursementPattern } from '@app/shared/enums';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FinalizeApplicationUseCase {
  constructor(
    @Inject('ApplicationRepositoryPort')
    private readonly applicationRepository: ApplicationRepositoryPort,
    @Inject('DISBURSEMENTS_SERVICE')
    private readonly disbursementsClient: ClientProxy,
  ) {}

  async execute(
    id: string,
    withDisbursement: boolean,
    channel?: string,
    reason?: string,
  ): Promise<{ success: boolean; message: string }> {
    const application = await this.applicationRepository.findById(id);
    if (!application) {
      throw new Error(`Solicitud con ID ${id} no encontrada.`);
    }

    const previousStatus = application.status;
    application.finalizeApplication(withDisbursement, reason);

    const saved = await this.applicationRepository.save(application);

    let message = 'Solicitud finalizada correctamente sin desembolso.';

    if (withDisbursement) {
      await firstValueFrom(
        this.disbursementsClient.send(
          { cmd: DisbursementPattern.CREATE_DISBURSEMENT },
          {
            applicationId: saved.id,
            clientId: saved.clientId,
            amount:
              (
                saved.offerResult as {
                  offerDetails?: { approvedAmount?: number };
                }
              )?.offerDetails?.approvedAmount || 0,
          },
        ),
      );
      message = 'Solicitud finalizada y desembolso programado correctamente.';
    }

    await this.applicationRepository.saveAudit(
      saved.id,
      'STATE_TRANSITION',
      message,
      previousStatus,
      saved.status,
      { withDisbursement, channel: channel ?? 'Autogestionado', reason },
    );

    return { success: true, message };
  }
}
