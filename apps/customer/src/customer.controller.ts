import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { CustomerPattern } from '@app/shared/enums';
import { CreateCustomerUseCase } from './application/use-cases/create-customer.use-case';
import { FindCustomerByDocumentUseCase } from './application/use-cases/find-customer-by-document.use-case';
import { CreateCustomerDto } from './application/dtos/create-customer.dto';

@Controller()
export class CustomerController {
  private readonly logger = new Logger(CustomerController.name);

  constructor(
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    private readonly findCustomerByDocumentUseCase: FindCustomerByDocumentUseCase,
  ) {}

  @MessagePattern({ cmd: CustomerPattern.CREATE_CUSTOMER })
  async create(@Payload() createCustomerDto: CreateCustomerDto) {
    try {
      return await this.createCustomerUseCase.execute(createCustomerDto);
    } catch (error: any) {
      this.logger.error(`Error creating customer: ${error.message}`);
      throw new RpcException({ error: error.message });
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
    } catch (error: any) {
      this.logger.error(
        `Error finding customer ${payload.document}: ${error.message}`,
      );
      if (error instanceof RpcException) throw error;
      throw new RpcException({ error: error.message, statusCode: 400 });
    }
  }
}
