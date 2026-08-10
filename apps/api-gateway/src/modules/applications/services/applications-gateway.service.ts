import {
  Injectable,
  Inject,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { timeout, retry } from 'rxjs/operators';
import { ApplicationPattern, CustomerPattern } from '@app/shared/enums';
import { PaginationDto } from '@app/shared/dtos';
import { CreateApplicationDto } from '../dtos/create-application.dto';
import { UpdateApplicationDto } from '../dtos/update-application.dto';
import { AbandonApplicationDto } from '../dtos/abandon-application.dto';
import { SimulateOfferDto } from '../dtos/simulate-offer.dto';
import { FinalizeApplicationDto } from '../dtos/finalize-application.dto';
import { SensitiveDataMaskAdapter } from '../adapters/sensitive-data-mask.adapter';
import {
  ApiResponse as SharedApiResponse,
  ApplicationResponse,
} from '@app/shared';

@Injectable()
export class ApplicationsGatewayService {
  private readonly logger = new Logger(ApplicationsGatewayService.name);

  constructor(
    @Inject('APPLICATIONS_SERVICE')
    private readonly applicationsClient: ClientProxy,
    @Inject('CUSTOMER_SERVICE')
    private readonly customerClient: ClientProxy,
    private readonly sensitiveDataMask: SensitiveDataMaskAdapter,
  ) {}

  async createApplication(
    createDto: CreateApplicationDto,
  ): Promise<SharedApiResponse<ApplicationResponse>> {
    this.logger.log(`Orchestrator: Solicitud para crear aplicación`);

    let finalClientId = createDto.clientId;

    if (finalClientId && finalClientId.length !== 24) {
      try {
        const customer = await firstValueFrom<{ id: string }>(
          this.customerClient
            .send(
              { cmd: CustomerPattern.GET_CUSTOMER_BY_DOCUMENT },
              { document: finalClientId },
            )
            .pipe(timeout(3000)),
        );

        if (customer && customer.id) {
          finalClientId = customer.id;
        } else {
          throw new BadRequestException(
            'No existe un cliente asociado a ese documento.',
          );
        }
      } catch (error: unknown) {
        throw new BadRequestException(
          (error instanceof Error ? error.message : undefined) ||
            'Error al validar el cliente asociado al documento.',
        );
      }
    }

    const payload = {
      ...createDto,
      clientId: finalClientId,
    };

    const result = await firstValueFrom<ApplicationResponse>(
      this.applicationsClient
        .send(
          { cmd: ApplicationPattern.CREATE_APPLICATION },
          { createDto: payload },
        )
        .pipe(timeout(5000), retry(3)),
    );

    return {
      success: true,
      message: 'Solicitud de financiación creada con éxito.',
      data: result,
    };
  }

  async getApplications(
    paginationDto: PaginationDto,
  ): Promise<SharedApiResponse<any>> {
    this.logger.log('Orchestrator: Solicitando listar solicitudes');
    const applications = await firstValueFrom<any>(
      this.applicationsClient
        .send({ cmd: ApplicationPattern.GET_APPLICATIONS }, { paginationDto })
        .pipe(timeout(5000), retry(3)),
    );

    if (applications && applications.data) {
      const enrichedApplications = await Promise.all(
        applications.data.map(async (app: Record<string, unknown>) => {
          try {
            const customer = await firstValueFrom<any>(
              this.customerClient
                .send(
                  { cmd: CustomerPattern.GET_CUSTOMER_BY_ID },
                  { id: app.clientId },
                )
                .pipe(timeout(5000), retry(3)),
            );

            const { clientId, offerResult, ...appWithoutSensitiveData } = app;

            return {
              ...appWithoutSensitiveData,
              customer:
                this.sensitiveDataMask.sanitizeCustomerForList(customer),
            };
          } catch (error) {
            this.logger.error(
              `Error fetching customer for clientId ${app.clientId}: ${error}`,
            );
            const { clientId, offerResult, ...appWithoutSensitiveData } = app;
            return {
              ...appWithoutSensitiveData,
              customer: null,
            };
          }
        }),
      );

      return {
        success: true,
        message: 'Solicitudes listadas con éxito.',
        data: {
          ...applications,
          data: enrichedApplications,
        },
      };
    }

    return {
      success: true,
      message: 'Solicitudes listadas con éxito.',
      data: applications,
    };
  }

  async getApplicationById(
    id: string,
  ): Promise<SharedApiResponse<ApplicationResponse>> {
    this.logger.log(`Orchestrator: Petición para consultar solicitud ${id}`);
    const application = await firstValueFrom<any>(
      this.applicationsClient
        .send({ cmd: ApplicationPattern.GET_APPLICATION_BY_ID }, { id })
        .pipe(timeout(5000), retry(3)),
    );

    if (application && application.clientId) {
      delete application.clientId;
    }

    return {
      success: true,
      message: 'Detalle de la solicitud obtenido con éxito.',
      data: application,
    };
  }

  async getApplicationByIdAdmin(
    id: string,
  ): Promise<SharedApiResponse<ApplicationResponse>> {
    this.logger.log(
      `Orchestrator: Petición ADMIN para consultar solicitud ${id}`,
    );
    const application = await firstValueFrom<any>(
      this.applicationsClient
        .send({ cmd: ApplicationPattern.GET_APPLICATION_BY_ID }, { id })
        .pipe(timeout(5000), retry(3)),
    );

    if (application && application.clientId) {
      try {
        const customer = await firstValueFrom<any>(
          this.customerClient
            .send(
              { cmd: CustomerPattern.GET_CUSTOMER_BY_ID },
              { id: application.clientId },
            )
            .pipe(timeout(5000)),
        );

        if (customer) {
          if (customer.document) {
            customer.document = this.sensitiveDataMask.maskDocument(
              customer.document,
            );
          }
          application.customer = customer;
        }
      } catch (error) {
        this.logger.warn(
          `No se pudo obtener la información del cliente para la solicitud ${id}`,
        );
      }

      delete application.clientId;
    }

    return {
      success: true,
      message: 'Detalle administrativo de la solicitud obtenido con éxito.',
      data: application,
    };
  }

  async updateApplication(
    id: string,
    updateDto: UpdateApplicationDto,
  ): Promise<SharedApiResponse<ApplicationResponse>> {
    this.logger.log(`Orchestrator: Petición para actualizar solicitud ${id}`);
    const result = await firstValueFrom<ApplicationResponse>(
      this.applicationsClient
        .send({ cmd: ApplicationPattern.UPDATE_APPLICATION }, { id, updateDto })
        .pipe(timeout(5000), retry(3)),
    );

    return {
      success: true,
      message: 'Solicitud actualizada con éxito.',
      data: result,
    };
  }

  async simulateOffer(
    id: string,
    simulateDto: SimulateOfferDto,
  ): Promise<SharedApiResponse<any>> {
    this.logger.log(
      `Orchestrator: Petición para simular oferta para solicitud ${id}`,
    );
    const result = await firstValueFrom<any>(
      this.applicationsClient
        .send({ cmd: ApplicationPattern.SIMULATE_OFFER }, { id, simulateDto })
        .pipe(timeout(5000), retry(3)),
    );

    return {
      success: true,
      message: 'Simulación de crédito calculada con éxito.',
      data: result,
    };
  }

  async acceptOffer(
    id: string,
    channel?: string,
  ): Promise<SharedApiResponse<any>> {
    const result = await firstValueFrom<any>(
      this.applicationsClient
        .send({ cmd: ApplicationPattern.ACCEPT_OFFER }, { id, channel })
        .pipe(timeout(5000), retry(3)),
    );

    return {
      success: true,
      message: 'Oferta de crédito aceptada con éxito.',
      data: result,
    };
  }

  async abandonApplication(
    id: string,
    reasonDto: AbandonApplicationDto & { channel?: string },
  ): Promise<SharedApiResponse<any>> {
    const result = await firstValueFrom<any>(
      this.applicationsClient
        .send(
          { cmd: ApplicationPattern.ABANDON_APPLICATION },
          { id, reasonDto },
        )
        .pipe(timeout(5000), retry(3)),
    );

    return {
      success: true,
      message: 'Solicitud abandonada/cancelada con éxito.',
      data: result,
    };
  }

  async getApplicationEvents(id: string): Promise<SharedApiResponse<any[]>> {
    this.logger.log(
      `Orchestrator: Petición para consultar eventos de solicitud ${id}`,
    );
    const result = await firstValueFrom<any[]>(
      this.applicationsClient
        .send({ cmd: ApplicationPattern.GET_APPLICATION_EVENTS }, { id })
        .pipe(timeout(5000), retry(3)),
    );

    return {
      success: true,
      message: 'Bitácora de eventos obtenida con éxito.',
      data: result,
    };
  }

  async getPublicApplicationEvents(
    id: string,
  ): Promise<SharedApiResponse<any[]>> {
    this.logger.log(
      `Orchestrator: Petición para consultar eventos de solicitud ${id}`,
    );
    const result = await firstValueFrom<any[]>(
      this.applicationsClient
        .send({ cmd: ApplicationPattern.GET_PUBLIC_APPLICATION_EVENTS }, { id })
        .pipe(timeout(5000), retry(3)),
    );

    return {
      success: true,
      message: 'Bitácora pública de eventos obtenida con éxito.',
      data: result,
    };
  }

  async validateApplication(
    id: string,
    validationData: Record<string, unknown>,
  ): Promise<SharedApiResponse<any>> {
    const result = await firstValueFrom<any>(
      this.applicationsClient
        .send(
          { cmd: ApplicationPattern.VALIDATE_APPLICATION },
          { id, validationData },
        )
        .pipe(timeout(5000), retry(3)),
    );

    return {
      success: true,
      message: 'Solicitud validada exitosamente.',
      data: result,
    };
  }

  async finalizeApplication(
    body: FinalizeApplicationDto,
  ): Promise<SharedApiResponse<any>> {
    const result = await firstValueFrom<any>(
      this.applicationsClient
        .send(
          { cmd: ApplicationPattern.FINALIZE_APPLICATION },
          {
            id: body.id,
            withDisbursement: body.withDisbursement,
            channel: body.channel,
            reason: body.reason,
          },
        )
        .pipe(timeout(5000), retry(3)),
    );

    return {
      success: true,
      message: 'Solicitud finalizada con éxito.',
      data: result,
    };
  }
}
