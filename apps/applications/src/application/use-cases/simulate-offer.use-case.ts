import { Inject, Injectable } from '@nestjs/common';
import { ApplicationRepositoryPort } from '../../domain/ports/application-repository.port';
import { OfferServicePort } from '../../domain/ports/offer-service.port';
import { Application } from '../../domain/models/application.entity';
import { ApplicationStatus } from '@app/shared/enums';

@Injectable()
export class SimulateOfferUseCase {
  constructor(
    @Inject('ApplicationRepositoryPort')
    private readonly applicationRepository: ApplicationRepositoryPort,
    @Inject('OfferServicePort')
    private readonly offerService: OfferServicePort,
  ) {}

  async execute(id: string, amount: number, termMonths: number): Promise<Application> {
    const application = await this.applicationRepository.findById(id);
    if (!application) {
      throw new Error(`Solicitud con ID ${id} no encontrada.`);
    }

    if (application.status === ApplicationStatus.FINALIZED || application.status === ApplicationStatus.ABANDONED) {
      throw new Error('No se puede simular una oferta para una solicitud cerrada.');
    }

    // Cambiamos el estado a Pendiente Validación (ya que estamos yendo al Core)
    application.status = ApplicationStatus.PENDING_VALIDATION;

    try {
      const simulation = await this.offerService.simulateOffer(application.id, application.clientId, amount, termMonths);
      
      application.registerSimulation(simulation);
      
      // La validación terminó (aprobada o no viable). Cambiamos a VALIDATED
      application.status = ApplicationStatus.VALIDATED;
      
      if (!simulation.success) {
        application.addEvent('SIMULATION_ERROR', `Simulación procesada (No Viable): ${simulation.message}`, { simulation });
      } else {
        application.addEvent('SIMULATION_RESULT', `Simulación procesada (Aprobada). Oferta generada.`, { simulation });
      }
      
      application.addEvent('STATE_TRANSITION', 'Solicitud validada por el sistema. Nuevo estado: Validada.');

    } catch (error: any) {
      // Se queda en PENDING_VALIDATION (representando el error de validación técnica pendiente de reintento)
      application.addEvent('SYSTEM_ERROR', `Fallo técnico en simulación: ${error.message}`, { error: error.message, stack: error.stack });
      await this.applicationRepository.save(application); // Persistir el error antes de propagar
      throw error;
    }

    return await this.applicationRepository.save(application);
  }
}
