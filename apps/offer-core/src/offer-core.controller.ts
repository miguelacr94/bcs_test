import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OfferCoreService, OfferSimulationResult } from './offer-core.service';
import { OfferPattern } from '@app/shared/enums/message-patterns.enum';

@Controller()
export class OfferCoreController {
  constructor(private readonly offerCoreService: OfferCoreService) {}

  @MessagePattern({ cmd: OfferPattern.SIMULATE_OFFER })
  async simulateOffer(
    @Payload()
    data: {
      applicationId: string;
      clientId: string;
      amount: number;
      termMonths: number;
    },
  ): Promise<OfferSimulationResult> {
    return this.offerCoreService.simulateOffer(
      data.applicationId,
      data.clientId,
      data.amount,
      data.termMonths,
    );
  }
}
