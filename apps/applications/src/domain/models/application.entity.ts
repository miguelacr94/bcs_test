import { ApplicationStatus } from '@app/shared/enums';

export interface ApplicationEvent {
  type: string;
  message: string;
  timestamp: string;
  metadata?: any;
}

export class Application {
  constructor(
    public readonly id: string,
    public readonly clientId: string,
    public readonly channel: string,
    public status: ApplicationStatus,
    public readonly createdAt: Date,
    public events: ApplicationEvent[] = [],
    public simulationResult?: any,
  ) {}

  finalizeApplication(): void {
    if (this.status === ApplicationStatus.FINALIZED || this.status === ApplicationStatus.ABANDONED) {
      throw new Error('No puedes finalizar una solicitud que ya está cerrada (Finalizada o Abandonada).');
    }
    
    // Precondiciones mínimas definidas para finalizar: debe existir una oferta pre-aprobada viable
    if (!this.simulationResult || !this.simulationResult.success || !this.simulationResult.offerDetails) {
      throw new Error('No se puede finalizar la solicitud sin tener una oferta pre-aprobada viable.');
    }

    this.status = ApplicationStatus.FINALIZED;
    this.addEvent('STATE_TRANSITION', 'Solicitud finalizada exitosamente.');
  }

  abandonApplication(reason: string): void {
    if (this.status === ApplicationStatus.FINALIZED || this.status === ApplicationStatus.ABANDONED) {
      throw new Error('No puedes abandonar una solicitud que ya está cerrada (Finalizada o Abandonada).');
    }

    if (!reason || reason.trim() === '') {
      throw new Error('El motivo de abandono es obligatorio.');
    }

    this.status = ApplicationStatus.ABANDONED;
    this.addEvent('STATE_TRANSITION', `Solicitud abandonada. Motivo: ${reason}`);
  }

  registerSimulation(result: any): void {
    this.simulationResult = result;
    this.addEvent('SIMULATION_RESULT', 'Se ejecutó simulación preliminar de oferta.', { result });
  }

  addEvent(type: string, message: string, metadata?: any): void {
    this.events.push({
      type,
      message,
      timestamp: new Date().toISOString(),
      metadata,
    });
  }
}
