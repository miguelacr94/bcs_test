import { Injectable, Logger } from '@nestjs/common';
import { OfferSimulationResult } from '@app/shared';

@Injectable()
export class SimulateOfferUseCase {
  private readonly logger = new Logger(SimulateOfferUseCase.name);

  async execute(
    applicationId: string,
    amount: number,
    termMonths: number,
  ): Promise<OfferSimulationResult> {
    this.logger.log(
      `Offer-Core-UseCase: Iniciando simulación para la solicitud ${applicationId} por monto ${amount} y plazo ${termMonths}...`,
    );

    // Simulamos latencia de red (1 segundo)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const random = Math.random();

    // 33% de probabilidad: Error técnico temporal
    if (random < 0.33) {
      throw new Error(
        'Error técnico temporal conectando con el Core Bancario de Ofertas. Intente nuevamente.',
      );
    }

    // 33% de probabilidad: No viable (con propuesta alternativa de cupo menor)
    if (random < 0.66) {
      const alternativeAmount = Math.round(amount * 0.7); // Ofrecer el 70% del monto original
      return {
        success: false,
        message: `Monto solicitado de ${amount.toLocaleString('es-CO')} no es viable según perfil crediticio.`,
        offerDetails: {
          approvedAmount: alternativeAmount,
          interestRate: 1.85,
          termMonths: Math.min(termMonths, 48), // Limitar plazo de alternativa
        },
      };
    }

    // 34% de probabilidad: Oferta disponible viable
    return {
      success: true,
      message: 'Oferta pre-aprobada disponible',
      offerDetails: {
        approvedAmount: amount,
        interestRate: 1.45,
        termMonths: termMonths,
      },
    };
  }
}
