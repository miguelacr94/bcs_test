import { Module } from '@nestjs/common';
import { OfferCoreController } from './offer-core.controller';
import { SimulateOfferUseCase } from './application/use-cases';

@Module({
  imports: [],
  controllers: [OfferCoreController],
  providers: [SimulateOfferUseCase],
})
export class OfferCoreModule {}
