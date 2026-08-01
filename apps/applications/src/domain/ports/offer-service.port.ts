export interface OfferSimulationResult {
  success: boolean;
  message: string;
  offerDetails?: any;
}

export interface OfferServicePort {
  simulateOffer(applicationId: string, clientId: string, amount: number, termMonths: number): Promise<OfferSimulationResult>;
}
