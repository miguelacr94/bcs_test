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

  async execute(id: string, updateData: any): Promise<Application> {
    const application = await this.applicationRepository.findById(id);
    if (!application) {
      throw new Error(`Solicitud con ID ${id} no encontrada.`);
    }

    if (application.status !== ApplicationStatus.IN_PROCESS) {
      throw new Error('Solo se pueden actualizar las solicitudes que se encuentran EN_PROCESO.');
    }

    // Aquí actualizaríamos las propiedades parciales de la solicitud basado en updateData
    // (Por ejemplo, actualizar datos personales, ingresos, etc.)
    application.addEvent('USER_ACTION', 'Solicitud actualizada parcialmente por el cliente.', { updateData });

    return await this.applicationRepository.save(application);
  }
}
