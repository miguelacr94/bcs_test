import { Inject, Injectable } from '@nestjs/common';
import { OfferServicePort, OfferSimulationResult } from '../../domain/ports/offer-service.port';
import { ApplicationRepositoryPort } from '../../domain/ports/application-repository.port';

@Injectable()
export class SimulateOfferUseCase {
  constructor(
    @Inject('ApplicationRepositoryPort')
    private readonly applicationRepository: ApplicationRepositoryPort,
    @Inject('OfferServicePort')
    private readonly offerService: OfferServicePort,
  ) {}

  async execute(id: string, amount: number, termMonths: number): Promise<OfferSimulationResult> {
    const application = await this.applicationRepository.findById(id);
    if (!application) {
      throw new Error(`Solicitud con ID ${id} no encontrada.`);
    }

    // Consultar la viabilidad de la oferta con el Core del Banco
    // La simulación es solo informativa para el frontend, no genera eventos de auditoría
    return await this.offerService.simulateOffer(application.id, application.clientId, amount, termMonths);
  }
}

