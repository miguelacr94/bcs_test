import { Inject, Injectable } from '@nestjs/common';
import { ApplicationRepositoryPort } from '../../domain/ports/application-repository.port';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ValidateApplicationUseCase {
  constructor(
    @Inject('ApplicationRepositoryPort')
    private readonly applicationRepository: ApplicationRepositoryPort,
    @Inject('CUSTOMER_SERVICE')
    private readonly customerClient: ClientProxy,
  ) {}

  async execute(
    id: string,
    validationData: Record<string, unknown>,
    channel?: string,
  ): Promise<{ success: boolean; message: string }> {
    const application = await this.applicationRepository.findById(id);
    if (!application) {
      throw new Error(`Solicitud con ID ${id} no encontrada.`);
    }

    const previousStatus = application.status;
    application.validateApplication(validationData);

    // Update customer with validation data (family references) via microservice
    if (validationData.familyReference1) {
      try {
        await this.customerClient
          .emit('customer.update', {
            document: application.clientId,
            data: { familyReference1: validationData.familyReference1 },
          })
          .toPromise();
      } catch (error) {
        console.error('Failed to update customer:', error);
        // Continue even if customer update fails
      }
    }

    const saved = await this.applicationRepository.save(application);
    await this.applicationRepository.saveAudit(
      saved.id,
      'VALIDATION',
      'El analista ha guardado los datos de validación (referencias).',
      previousStatus,
      saved.status,
      { validationData, channel: channel ?? 'Autogestionado' },
    );
    return { success: true, message: 'Validación guardada correctamente.' };
  }
}
