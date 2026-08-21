import { Controller, Logger } from '@nestjs/common';
import {
  MessagePattern,
  EventPattern,
  Payload,
  RpcException,
} from '@nestjs/microservices';
import { CustomerPattern } from '@app/shared/enums';
import {
  CreateCustomerUseCase,
  FindCustomerByDocumentUseCase,
  FindCustomerByIdUseCase,
  DeactivateCustomerUseCase,
} from './application/use-cases';
import { CreateCustomerDto } from './application/dtos/create-customer.dto';

@Controller()
export class CustomerController {
  private readonly logger = new Logger(CustomerController.name);

  constructor(
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    private readonly findCustomerByDocumentUseCase: FindCustomerByDocumentUseCase,
    private readonly findCustomerByIdUseCase: FindCustomerByIdUseCase,
    private readonly deactivateCustomerUseCase: DeactivateCustomerUseCase,
  ) {}

  @EventPattern(CustomerPattern.DEACTIVATE_CUSTOMER)
  async handleDeactivate(@Payload() data: { clientId: string }) {
    this.logger.log(
      `Evento customer.deactivate recibido para cliente: ${data.clientId}`,
    );
    try {
      await this.deactivateCustomerUseCase.execute(data.clientId);
      this.logger.log(`Cliente ${data.clientId} desactivado con éxito.`);
    } catch (error: unknown) {
      this.logger.error(
        `Error al procesar desactivación de cliente: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  @MessagePattern({ cmd: CustomerPattern.CREATE_CUSTOMER })
  async create(@Payload() createCustomerDto: CreateCustomerDto) {
    try {
      return await this.createCustomerUseCase.execute(createCustomerDto);
    } catch (error: unknown) {
      const err = error as {
        message?: string;
        code?: number;
        keyValue?: Record<string, unknown>;
      };
      this.logger.error(
        `Error creating customer: ${err.message || String(error)}`,
      );

      if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || 'email';
        throw new RpcException({
          error: `El ${field} ya se encuentra registrado.`,
          statusCode: 400,
        });
      }

      throw new RpcException({
        error: err.message || String(error),
        statusCode: 400,
      });
    }
  }

  @MessagePattern({ cmd: CustomerPattern.GET_CUSTOMER_BY_DOCUMENT })
  async findByDocument(@Payload() payload: { document: string }) {
    try {
      const customer = await this.findCustomerByDocumentUseCase.execute(
        payload.document,
      );
      if (!customer) {
        throw new RpcException({
          error: 'Cliente no encontrado',
          statusCode: 404,
        });
      }
      return customer;
    } catch (error: unknown) {
      this.logger.error(
        `Error finding customer ${payload.document}: ${error instanceof Error ? error.message : String(error)}`,
      );
      if (error instanceof RpcException) throw error;
      throw new RpcException({
        error: error instanceof Error ? error.message : String(error),
        statusCode: 400,
      });
    }
  }

  @MessagePattern({ cmd: CustomerPattern.GET_CUSTOMER_BY_ID })
  async findById(@Payload() payload: { id: string }) {
    try {
      const customer = await this.findCustomerByIdUseCase.execute(payload.id);
      if (!customer) {
        throw new RpcException({
          error: 'Cliente no encontrado',
          statusCode: 404,
        });
      }
      return customer;
    } catch (error: unknown) {
      this.logger.error(
        `Error finding customer by ID ${payload.id}: ${error instanceof Error ? error.message : String(error)}`,
      );
      if (error instanceof RpcException) throw error;
      throw new RpcException({
        error: error instanceof Error ? error.message : String(error),
        statusCode: 400,
      });
    }
  }

  @MessagePattern({ cmd: CustomerPattern.CUSTOMER_HEALTH })
  async customerHealth(@Payload() payload: { document: string }) {
    try {
      const customer = await this.findCustomerByDocumentUseCase.execute(
        payload.document,
      );
      if (!customer) {
        throw new RpcException({
          error: 'Cliente no encontrado',
          statusCode: 404,
        });
      }
      return {
        status: 'ok',
        service: 'customer-service',
        timestamp: new Date().toISOString(),
      };
    } catch (error: unknown) {
      this.logger.error(
        `Error finding customer ${payload.document}: ${error instanceof Error ? error.message : String(error)}`,
      );
      if (error instanceof RpcException) throw error;
      throw new RpcException({
        error: error instanceof Error ? error.message : String(error),
        statusCode: 400,
      });
    }
  }
}
