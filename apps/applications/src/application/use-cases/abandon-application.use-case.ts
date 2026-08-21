import { Inject, Injectable, Logger } from '@nestjs/common';
import { ApplicationRepositoryPort } from '../../domain/ports/application-repository.port';
import { OfferAmount } from '@app/shared/constants/offertAmount.constanst';
import { ClientProxy } from '@nestjs/microservices';
import { CustomerPattern } from '@app/shared/enums';
import { firstValueFrom, retry, timeout } from 'rxjs';
import { ApplicationsController } from '../../applications.controller';

@Injectable()
export class AbandonApplicationUseCase {
  private readonly logger = new Logger(ApplicationsController.name);
  constructor(
    @Inject('ApplicationRepositoryPort')
    private readonly applicationRepository: ApplicationRepositoryPort,
    @Inject('CUSTOMER_SERVICE')
    private readonly customerClient: ClientProxy,
  ) {}

  async execute(
    id: string,
    reason: string,
    channel?: string,
  ): Promise<{ success: boolean; message: string }> {
    const application = await this.applicationRepository.findById(id);
    if (!application) {
      throw new Error(`Solicitud con ID ${id} no encontrada.`);
    }

    const customer = await firstValueFrom(
      this.customerClient
        .send(
          { cmd: CustomerPattern.GET_CUSTOMER_BY_ID },
          { id: application.clientId },
        )
        .pipe(timeout(5000), retry(3)),
    );

    if (!customer) {
      throw new Error(`Cliente con ID ${application.clientId} no encontrado.`);
    }

    const amount = application.offerResult?.amount as number;

    if (amount > OfferAmount.hightAmount) {
      throw new Error(
        'Las solicitudes de alto monto no pueden ser abandonadas sin revisión del comité de crédito.',
      );
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
      { reason, channel: channel ?? 'Autogestionado' },
    );
    this.customerClient
      .emit(CustomerPattern.DEACTIVATE_CUSTOMER, {
        clientId: application.clientId,
      })
      .subscribe({
        error: (err) => {
          this.logger.error('Error al desactivar cliente', err);
        },
      });
    return { success: true, message: 'Solicitud abandonada correctamente.' };
  }
}
