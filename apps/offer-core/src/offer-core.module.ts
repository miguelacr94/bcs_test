import { Module } from '@nestjs/common';
import { OfferCoreController } from './offer-core.controller';
import { OfferCoreService } from './offer-core.service';

@Module({
  imports: [],
  controllers: [OfferCoreController],
  providers: [OfferCoreService],
})
export class OfferCoreModule {}
