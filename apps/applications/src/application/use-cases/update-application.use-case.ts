import { Inject, Injectable } from '@nestjs/common';
import { ApplicationRepositoryPort } from '../../domain/ports/application-repository.port';
import { Application } from '../../domain/models/application.entity';
import { ApplicationStatus } from '@app/shared/enums';

@Injectable()
export class UpdateApplicationUseCase {
  constructor(
    @Inject('ApplicationRepositoryPort')
    private readonly applicationRepository: ApplicationRepositoryPort,
  ) {}

  async execute(id: string, updateData: Record<string, unknown>): Promise<Application> {
    const application = await this.applicationRepository.findById(id);
    if (!application) {
      throw new Error(`Solicitud con ID ${id} no encontrada.`);
    }

    if (
      application.status === ApplicationStatus.FINALIZED ||
      application.status === ApplicationStatus.ABANDONED
    ) {
      throw new Error(
        'No se pueden editar las solicitudes que se encuentran Finalizadas o Abandonadas.',
      );
    }

    // Permitimos transicionar de PENDING_VALIDATION de vuelta a EN_PROCESO
    if (updateData.status === ApplicationStatus.IN_PROGRESS) {
      if (application.status === ApplicationStatus.PENDING_VALIDATION) {
        const previousStatus = application.status;
        application.status = ApplicationStatus.IN_PROGRESS;
        const saved = await this.applicationRepository.save(application);
        await this.applicationRepository.saveAudit(
          saved.id,
          'STATE_TRANSITION',
          'Solicitud regresada a En Proceso. Simulación previa invalidada.',
          previousStatus,
          saved.status,
          { updateData },
        );
        return saved;
      }
    }

    // Si está en PENDING_VALIDATION y no es para volver a EN_PROCESO, no se permite editar otros datos directamente
    if (application.status === ApplicationStatus.PENDING_VALIDATION) {
      throw new Error(
        'No se pueden editar los datos de la solicitud mientras esté Pendiente de Validación. Debe modificar las condiciones primero.',
      );
    }

    // Aquí actualizaríamos las propiedades parciales de la solicitud basado en updateData
    const saved = await this.applicationRepository.save(application);
    await this.applicationRepository.saveAudit(
      saved.id,
      'USER_ACTION',
      'Solicitud actualizada parcialmente por el cliente.',
      saved.status,
      saved.status,
      { updateData },
    );

    return saved;
  }
}
