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
    public readonly radicado: string,
    public readonly clientId: string,
    public readonly channel: string,
    public status: ApplicationStatus,
    public readonly createdAt: Date,
    public offerResult?: any,
    public validationData?: any,
  ) {}

  acceptOffer(): void {
    if (this.status !== ApplicationStatus.IN_PROCESS) {
      throw new Error(
        'La solicitud debe estar en estado En Proceso antes de poder aceptar la oferta.',
      );
    }

    this.status = ApplicationStatus.PENDING_VALIDATION;
  }

  abandonApplication(reason: string): void {
    if (
      this.status === ApplicationStatus.FINALIZED ||
      this.status === ApplicationStatus.ABANDONED
    ) {
      throw new Error(
        'No puedes abandonar una solicitud que ya está cerrada (Finalizada o Abandonada).',
      );
    }

    if (!reason || reason.trim() === '') {
      throw new Error('El motivo de abandono es obligatorio.');
    }

    this.status = ApplicationStatus.ABANDONED;
  }

  validateApplication(validationData: any): void {
    if (this.status !== ApplicationStatus.PENDING_VALIDATION) {
      throw new Error(
        'La solicitud debe estar pendiente de validación para poder validarla.',
      );
    }

    this.validationData = validationData;
    // status can remain PENDING_VALIDATION or change, let's keep it PENDING_VALIDATION
    // but the presence of validationData will unlock finalization.
  }

  finalizeApplication(): void {
    if (this.status !== ApplicationStatus.PENDING_VALIDATION) {
      throw new Error(
        'La solicitud debe estar pendiente de validación para ser finalizada.',
      );
    }

    if (!this.validationData) {
      throw new Error(
        'No puedes finalizar la solicitud sin haber ingresado los datos de validación (referencias familiares).',
      );
    }

    this.status = ApplicationStatus.FINALIZED;
  }
}
