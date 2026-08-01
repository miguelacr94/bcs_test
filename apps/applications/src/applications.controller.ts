import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { ApplicationPattern } from '@app/shared/enums';
import {
  CreateApplicationUseCase,
  GetApplicationsUseCase,
  GetApplicationByIdUseCase,
  UpdateApplicationUseCase,
  SimulateOfferUseCase,
  FinalizeApplicationUseCase,
  AbandonApplicationUseCase,
  GetApplicationEventsUseCase,
} from './application/use-cases';

@Controller()
export class ApplicationsController {
  private readonly logger = new Logger(ApplicationsController.name);
  
  constructor(
    private readonly createApplicationUseCase: CreateApplicationUseCase,
    private readonly getApplicationsUseCase: GetApplicationsUseCase,
    private readonly getApplicationByIdUseCase: GetApplicationByIdUseCase,
    private readonly updateApplicationUseCase: UpdateApplicationUseCase,
    private readonly simulateOfferUseCase: SimulateOfferUseCase,
    private readonly finalizeApplicationUseCase: FinalizeApplicationUseCase,
    private readonly abandonApplicationUseCase: AbandonApplicationUseCase,
    private readonly getApplicationEventsUseCase: GetApplicationEventsUseCase,
  ) {}

  @MessagePattern({ cmd: ApplicationPattern.CREATE_APPLICATION })
  async createApplication(@Payload() data: { createDto: { clientId: string; channel: string } }) {
    try {
      return await this.createApplicationUseCase.execute(data.createDto.clientId, data.createDto.channel);
    } catch (error: any) {
      this.logger.error(`Error creating application: ${error.message}`);
      if (error instanceof RpcException) throw error;
      throw new RpcException({ error: error.message, statusCode: 400 });
    }
  }

  @MessagePattern({ cmd: ApplicationPattern.GET_APPLICATIONS })
  async getApplications(@Payload() data: { paginationDto: any }) {
    try {
      return await this.getApplicationsUseCase.execute(data.paginationDto);
    } catch (error: any) {
      this.logger.error(`Error fetching applications: ${error.message}`);
      if (error instanceof RpcException) throw error;
      throw new RpcException({ error: error.message, statusCode: 400 });
    }
  }

  @MessagePattern({ cmd: ApplicationPattern.GET_APPLICATION_BY_ID })
  async getApplicationById(@Payload() data: { id: string }) {
    try {
      const application = await this.getApplicationByIdUseCase.execute(data.id);
      if (!application) {
        throw new RpcException({ error: 'Solicitud no encontrada', statusCode: 404 });
      }
      return application;
    } catch (error: any) {
      this.logger.error(`Error getting application ${data.id}: ${error.message}`);
      // Si el error ya es un RpcException, relanzarlo
      if (error instanceof RpcException) throw error;
      throw new RpcException({ error: error.message, statusCode: 400 });
    }
  }

  @MessagePattern({ cmd: ApplicationPattern.UPDATE_APPLICATION })
  async updateApplication(@Payload() data: { id: string; updateDto: any }) {
    try {
      return await this.updateApplicationUseCase.execute(data.id, data.updateDto);
    } catch (error: any) {
      this.logger.error(`Error updating application ${data.id}: ${error.message}`);
      if (error instanceof RpcException) throw error;
      throw new RpcException({ error: error.message, statusCode: 400 });
    }
  }

  @MessagePattern({ cmd: ApplicationPattern.SIMULATE_OFFER })
  async simulateOffer(@Payload() data: { id: string; simulateDto: { amount: number; termMonths: number } }) {
    try {
      return await this.simulateOfferUseCase.execute(data.id, data.simulateDto.amount, data.simulateDto.termMonths);
    } catch (error: any) {
      this.logger.error(`Error simulating offer for ${data.id}: ${error.message}`);
      if (error instanceof RpcException) throw error;
      throw new RpcException({ error: error.message, statusCode: 400 });
    }
  }

  @MessagePattern({ cmd: ApplicationPattern.FINALIZE_APPLICATION })
  async finalizeApplication(@Payload() data: { id: string }) {
    try {
      return await this.finalizeApplicationUseCase.execute(data.id);
    } catch (error: any) {
      this.logger.error(`Error finalizing application ${data.id}: ${error.message}`);
      if (error instanceof RpcException) throw error;
      throw new RpcException({ error: error.message, statusCode: 400 });
    }
  }

  @MessagePattern({ cmd: ApplicationPattern.ABANDON_APPLICATION })
  async abandonApplication(@Payload() data: { id: string; reasonDto: { reason: string } }) {
    try {
      return await this.abandonApplicationUseCase.execute(data.id, data.reasonDto.reason);
    } catch (error: any) {
      this.logger.error(`Error abandoning application ${data.id}: ${error.message}`);
      if (error instanceof RpcException) throw error;
      throw new RpcException({ error: error.message, statusCode: 400 });
    }
  }

  @MessagePattern({ cmd: ApplicationPattern.GET_APPLICATION_EVENTS })
  async getApplicationEvents(@Payload() data: { id: string }) {
    try {
      return await this.getApplicationEventsUseCase.execute(data.id);
    } catch (error: any) {
      this.logger.error(`Error getting events for ${data.id}: ${error.message}`);
      if (error instanceof RpcException) throw error;
      throw new RpcException({ error: error.message, statusCode: 400 });
    }
  }
}
