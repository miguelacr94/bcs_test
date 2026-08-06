import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { CustomerPattern } from '@app/shared/enums';
import { CreateCustomerUseCase } from './application/use-cases/create-customer.use-case';
import { FindCustomerByDocumentUseCase } from './application/use-cases/find-customer-by-document.use-case';
import { FindCustomerByIdUseCase } from './application/use-cases/find-customer-by-id.use-case';
import { CreateCustomerDto } from './application/dtos/create-customer.dto';

@Controller()
export class CustomerController {
  private readonly logger = new Logger(CustomerController.name);

  constructor(
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    private readonly findCustomerByDocumentUseCase: FindCustomerByDocumentUseCase,
    private readonly findCustomerByIdUseCase: FindCustomerByIdUseCase,
  ) {}

  @MessagePattern({ cmd: CustomerPattern.CREATE_CUSTOMER })
  async create(@Payload() createCustomerDto: CreateCustomerDto) {
    try {
      return await this.createCustomerUseCase.execute(createCustomerDto);
    } catch (error: unknown) {
      const err = error as { message?: string; code?: number; keyValue?: Record<string, unknown> };
      this.logger.error(`Error creating customer: ${err.message || String(error)}`);
      
      if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || 'email';
        throw new RpcException({ 
          error: `El ${field} ya se encuentra registrado.`,
          statusCode: 400
        });
      }

      throw new RpcException({ 
        error: err.message || String(error),
        statusCode: 400 
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
        `Error finding customer ${payload.document}: ${(error instanceof Error ? error.message : String(error))}`,
      );
      if (error instanceof RpcException) throw error;
      throw new RpcException({ error: (error instanceof Error ? error.message : String(error)), statusCode: 400 });
    }
  }

  @MessagePattern({ cmd: CustomerPattern.GET_CUSTOMER_BY_ID })
  async findById(@Payload() payload: { id: string }) {
    try {
      const customer = await this.findCustomerByIdUseCase.execute(
        payload.id,
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
        `Error finding customer by ID ${payload.id}: ${(error instanceof Error ? error.message : String(error))}`,
      );
      if (error instanceof RpcException) throw error;
      throw new RpcException({ error: (error instanceof Error ? error.message : String(error)), statusCode: 400 });
    }
  }
}
