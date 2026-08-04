import { Controller, Logger, Inject } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { ApplicationPattern } from '@app/shared/enums';
import {
  CreateApplicationUseCase,
  GetApplicationsUseCase,
  GetApplicationByIdUseCase,
  UpdateApplicationUseCase,
  SimulateOfferUseCase,
  AcceptOfferUseCase,
  AbandonApplicationUseCase,
  GetApplicationEventsUseCase,
  ValidateApplicationUseCase,
  FinalizeApplicationUseCase,
  CheckRecentFinalizedApplicationUseCase,
} from './application/use-cases';
import { ApplicationRepositoryPort } from './domain/ports/application-repository.port';

@Controller()
export class ApplicationsController {
  private readonly logger = new Logger(ApplicationsController.name);

  constructor(
    private readonly createApplicationUseCase: CreateApplicationUseCase,
    private readonly getApplicationsUseCase: GetApplicationsUseCase,
    private readonly getApplicationByIdUseCase: GetApplicationByIdUseCase,
    private readonly updateApplicationUseCase: UpdateApplicationUseCase,
    private readonly simulateOfferUseCase: SimulateOfferUseCase,
    private readonly acceptOfferUseCase: AcceptOfferUseCase,
    private readonly abandonApplicationUseCase: AbandonApplicationUseCase,
    private readonly getApplicationEventsUseCase: GetApplicationEventsUseCase,
    private readonly validateApplicationUseCase: ValidateApplicationUseCase,
    private readonly finalizeApplicationUseCase: FinalizeApplicationUseCase,
    private readonly checkRecentFinalizedApplicationUseCase: CheckRecentFinalizedApplicationUseCase,
    @Inject('ApplicationRepositoryPort')
    private readonly applicationRepository: ApplicationRepositoryPort,
  ) {}

  @MessagePattern({ cmd: ApplicationPattern.CREATE_APPLICATION })
  async createApplication(
    @Payload()
    data: {
      createDto: { clientId: string; channel: string; offerResult?: Record<string, unknown> };
    },
  ) {
    try {
      return await this.createApplicationUseCase.execute(
        data.createDto.clientId,
        data.createDto.channel,
        data.createDto.offerResult,
      );
    } catch (error: any) {
      this.logger.error(`Error creating application: ${error.message || String(error)}`);
      if (error instanceof RpcException) throw error;
      const payload: any = { error: error.message || String(error), statusCode: 400 };
      if (error.availableDate) payload.availableDate = error.availableDate;
      if (error.daysRemaining) payload.daysRemaining = error.daysRemaining;
      throw new RpcException(payload);
    }
  }

  @MessagePattern({ cmd: ApplicationPattern.GET_APPLICATIONS })
  async getApplications(@Payload() data: { paginationDto: Record<string, unknown> }) {
    try {
      return await this.getApplicationsUseCase.execute(data.paginationDto);
    } catch (error: unknown) {
      this.logger.error(`Error fetching applications: ${(error instanceof Error ? error.message : String(error))}`);
      if (error instanceof RpcException) throw error;
      throw new RpcException({ error: (error instanceof Error ? error.message : String(error)), statusCode: 400 });
    }
  }

  @MessagePattern({ cmd: ApplicationPattern.GET_APPLICATION_BY_ID })
  async getApplicationById(@Payload() data: { id: string }) {
    try {
      const application = await this.getApplicationByIdUseCase.execute(data.id);
      if (!application) {
        throw new RpcException({
          error: 'Solicitud no encontrada',
          statusCode: 404,
        });
      }
      return application;
    } catch (error: unknown) {
      this.logger.error(
        `Error getting application ${data.id}: ${(error instanceof Error ? error.message : String(error))}`,
      );
      // Si el error ya es un RpcException, relanzarlo
      if (error instanceof RpcException) throw error;
      throw new RpcException({ error: (error instanceof Error ? error.message : String(error)), statusCode: 400 });
    }
  }

  @MessagePattern({
    cmd: ApplicationPattern.GET_ACTIVE_APPLICATION_BY_CLIENT_ID,
  })
  async getActiveApplicationByClientId(@Payload() data: { clientId: string }) {
    try {
      const activeStatuses = ['En Proceso', 'Pendiente Validación'];
      const application =
        await this.applicationRepository.findByClientIdAndStatus(
          data.clientId,
          activeStatuses,
        );
      return application ?? null;
    } catch (error: unknown) {
      this.logger.error(
        `Error finding active application for client ${data.clientId}: ${(error instanceof Error ? error.message : String(error))}`,
      );
      if (error instanceof RpcException) throw error;
      throw new RpcException({ error: (error instanceof Error ? error.message : String(error)), statusCode: 400 });
    }
  }

  @MessagePattern({
    cmd: ApplicationPattern.CHECK_RECENT_FINALIZED_APPLICATION_BY_CLIENT_ID,
  })
  async checkRecentFinalizedApplicationByClientId(@Payload() data: { clientId: string }) {
    try {
      return await this.checkRecentFinalizedApplicationUseCase.execute(data.clientId);
    } catch (error: unknown) {
      this.logger.error(
        `Error checking recent finalized application for client ${data.clientId}: ${(error instanceof Error ? error.message : String(error))}`,
      );
      if (error instanceof RpcException) throw error;
      throw new RpcException({ error: (error instanceof Error ? error.message : String(error)), statusCode: 400 });
    }
  }

  @MessagePattern({ cmd: ApplicationPattern.UPDATE_APPLICATION })
  async updateApplication(@Payload() data: { id: string; updateDto: Record<string, unknown> }) {
    try {
      return await this.updateApplicationUseCase.execute(
        data.id,
        data.updateDto,
      );
    } catch (error: unknown) {
      this.logger.error(
        `Error updating application ${data.id}: ${(error instanceof Error ? error.message : String(error))}`,
      );
      if (error instanceof RpcException) throw error;
      throw new RpcException({ error: (error instanceof Error ? error.message : String(error)), statusCode: 400 });
    }
  }

  @MessagePattern({ cmd: ApplicationPattern.SIMULATE_OFFER })
  async simulateOffer(
    @Payload()
    data: {
      id: string;
      simulateDto: { amount: number; termMonths: number };
    },
  ) {
    try {
      return await this.simulateOfferUseCase.execute(
        data.id,
        data.simulateDto.amount,
        data.simulateDto.termMonths,
      );
    } catch (error: unknown) {
      this.logger.error(
        `Error simulating offer for ${data.id}: ${(error instanceof Error ? error.message : String(error))}`,
      );
      if (error instanceof RpcException) throw error;
      throw new RpcException({ error: (error instanceof Error ? error.message : String(error)), statusCode: 400 });
    }
  }

  @MessagePattern({ cmd: ApplicationPattern.ACCEPT_OFFER })
  async acceptOffer(@Payload() data: { id: string; channel?: string }) {
    try {
      return await this.acceptOfferUseCase.execute(data.id, data.channel);
    } catch (error: unknown) {
      this.logger.error(
        `Error accepting offer for application ${data.id}: ${(error instanceof Error ? error.message : String(error))}`,
      );
      if (error instanceof RpcException) throw error;
      throw new RpcException({ error: (error instanceof Error ? error.message : String(error)), statusCode: 400 });
    }
  }

  @MessagePattern({ cmd: ApplicationPattern.ABANDON_APPLICATION })
  async abandonApplication(
    @Payload()
    data: {
      id: string;
      reasonDto: { reason: string; channel?: string };
    },
  ) {
    try {
      return await this.abandonApplicationUseCase.execute(
        data.id,
        data.reasonDto.reason,
        data.reasonDto.channel,
      );
    } catch (error: unknown) {
      this.logger.error(
        `Error abandoning application ${data.id}: ${(error instanceof Error ? error.message : String(error))}`,
      );
      if (error instanceof RpcException) throw error;
      throw new RpcException({ error: (error instanceof Error ? error.message : String(error)), statusCode: 400 });
    }
  }

  @MessagePattern({ cmd: ApplicationPattern.GET_APPLICATION_EVENTS })
  async getApplicationEvents(@Payload() data: { id: string }) {
    try {
      return await this.getApplicationEventsUseCase.execute(data.id);
    } catch (error: unknown) {
      this.logger.error(
        `Error getting events for ${data.id}: ${(error instanceof Error ? error.message : String(error))}`,
      );
      if (error instanceof RpcException) throw error;
      throw new RpcException({ error: (error instanceof Error ? error.message : String(error)), statusCode: 400 });
    }
  }

  @MessagePattern({ cmd: ApplicationPattern.VALIDATE_APPLICATION })
  async validateApplication(
    @Payload() data: { id: string; validationData: Record<string, unknown> },
  ) {
    try {
      const { channel, ...rest } = data.validationData;
      return await this.validateApplicationUseCase.execute(
        data.id,
        rest,
        channel as string | undefined,
      );
    } catch (error: unknown) {
      this.logger.error(
        `Error validating application ${data.id}: ${(error instanceof Error ? error.message : String(error))}`,
      );
      if (error instanceof RpcException) throw error;
      throw new RpcException({ error: (error instanceof Error ? error.message : String(error)), statusCode: 400 });
    }
  }

  @MessagePattern({ cmd: ApplicationPattern.FINALIZE_APPLICATION })
  async finalizeApplication(
    @Payload()
    data: {
      id: string;
      withDisbursement: boolean;
      channel?: string;
      reason?: string;
    },
  ) {
    try {
      return await this.finalizeApplicationUseCase.execute(
        data.id,
        data.withDisbursement,
        data.channel,
        data.reason,
      );
    } catch (error: unknown) {
      this.logger.error(
        `Error finalizing application ${data.id}: ${(error instanceof Error ? error.message : String(error))}`,
      );
      if (error instanceof RpcException) throw error;
      throw new RpcException({ error: (error instanceof Error ? error.message : String(error)), statusCode: 400 });
    }
  }
}
