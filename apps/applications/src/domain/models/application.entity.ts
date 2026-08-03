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
    public offerResult?: any,
  ) {}

  acceptOffer(): void {
    if (this.status !== ApplicationStatus.IN_PROCESS) {
      throw new Error('La solicitud debe estar en estado En Proceso antes de poder aceptar la oferta.');
    }

    this.status = ApplicationStatus.PENDING_VALIDATION;
  }

  abandonApplication(reason: string): void {
    if (this.status === ApplicationStatus.FINALIZED || this.status === ApplicationStatus.ABANDONED) {
      throw new Error('No puedes abandonar una solicitud que ya está cerrada (Finalizada o Abandonada).');
    }

    if (!reason || reason.trim() === '') {
      throw new Error('El motivo de abandono es obligatorio.');
    }

    this.status = ApplicationStatus.ABANDONED;
  }
}
