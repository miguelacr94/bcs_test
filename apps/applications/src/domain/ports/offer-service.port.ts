import { OfferSimulationResult } from '@app/shared';
export type { OfferSimulationResult };

export interface OfferServicePort {
  simulateOffer(
    applicationId: string,
    clientId: string,
    amount: number,
    termMonths: number,
  ): Promise<OfferSimulationResult>;
}
