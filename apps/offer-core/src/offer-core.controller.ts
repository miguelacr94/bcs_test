import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OfferPattern } from '@app/shared/enums/message-patterns.enum';
import { OfferSimulationResult } from '@app/shared';
import { SimulateOfferUseCase } from './application/use-cases';

@Controller()
export class OfferCoreController {
  constructor(private readonly simulateOfferUseCase: SimulateOfferUseCase) {}

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
    return this.simulateOfferUseCase.execute(
      data.applicationId,
      data.amount,
      data.termMonths,
    );
  }
}
