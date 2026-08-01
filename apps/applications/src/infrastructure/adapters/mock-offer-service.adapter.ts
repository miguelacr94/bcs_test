import { Injectable, Logger } from '@nestjs/common';
import { OfferServicePort, OfferSimulationResult } from '../../domain/ports/offer-service.port';

@Injectable()
export class MockOfferServiceAdapter implements OfferServicePort {
  private readonly logger = new Logger(MockOfferServiceAdapter.name);

  async simulateOffer(applicationId: string, clientId: string, amount: number, termMonths: number): Promise<OfferSimulationResult> {
    this.logger.log(`Iniciando simulación mock para la solicitud ${applicationId} por monto ${amount} y plazo ${termMonths}...`);
    
    // Simulamos latencia de red (1 segundo)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Lógica para cumplir con los escenarios basados en monto y plazo
    const random = Math.random();

    // 15% de probabilidad: Error técnico temporal (Simulando inestabilidad)
    if (random > 0.85) {
      throw new Error('Error técnico temporal conectando con el Core Bancario. Intente nuevamente.');
    }

    // Regla de negocio ficticia: Monto máximo viable es 50,000,000 y plazo máximo 72 meses
    if (amount > 50000000) {
      return {
        success: false,
        message: 'Cliente no viable para el monto solicitado. El monto máximo permitido es 50,000,000.',
        offerDetails: {
          approvedAmount: 50000000,
          interestRate: 2.5,
          termMonths: Math.min(termMonths, 72),
        }
      };
    }
    
    if (termMonths > 72) {
       return {
        success: false,
        message: 'El plazo excede el máximo permitido (72 meses).',
      };
    }

    // Éxito con oferta
    return {
      success: true,
      message: 'Oferta preliminar aprobada',
      offerDetails: {
        approvedAmount: amount,
        interestRate: 1.5,
        termMonths: termMonths,
      },
    };
  }
}
