import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { timeout, retry } from 'rxjs/operators';
import {
  OfferServicePort,
  OfferSimulationResult,
} from '../../domain/ports/offer-service.port';
import { OfferPattern } from '@app/shared/enums/message-patterns.enum';

@Injectable()
export class RedisOfferServiceAdapter implements OfferServicePort {
  private readonly logger = new Logger(RedisOfferServiceAdapter.name);

  constructor(
    @Inject('OFFER_CORE_SERVICE')
    private readonly offerCoreClient: ClientProxy,
  ) {}

  async simulateOffer(
    applicationId: string,
    clientId: string,
    amount: number,
    termMonths: number,
  ): Promise<OfferSimulationResult> {
    this.logger.log(
      `Enviando simulación de oferta a Offer-Core por Redis (AppId: ${applicationId}, Monto: ${amount}, Plazo: ${termMonths})...`,
    );

    const payload = {
      applicationId,
      clientId,
      amount,
      termMonths,
    };

    try {
      const result = await firstValueFrom(
        this.offerCoreClient
          .send<OfferSimulationResult>({ cmd: OfferPattern.SIMULATE_OFFER }, payload)
          .pipe(timeout(5000), retry(3)),
      );

      return result;
    } catch (error) {
      this.logger.error(
        `Error al comunicarse con Offer-Core: ${error.message}`,
        error.stack,
      );
      throw new Error(
        'Error técnico conectando con el Core Bancario de Ofertas. Intente nuevamente.',
      );
    }
  }
}
