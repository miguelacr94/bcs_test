import { Controller, Get, Post, Body, Param, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { timeout, retry } from 'rxjs/operators';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { CustomerPattern } from '@app/shared/enums';
import { CreateCustomerDto } from './dtos/create-customer.dto';

@ApiTags('Clientes (Customers)')
@Controller('customers')
export class CustomerController {
  private readonly logger = new Logger(CustomerController.name);

  constructor(
    @Inject('CUSTOMER_SERVICE')
    private readonly customerClient: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'Crear cliente' })
  @ApiBody({ type: CreateCustomerDto })
  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    this.logger.log(`Gateway: Petición para crear cliente`);
    return await firstValueFrom(
      this.customerClient
        .send({ cmd: CustomerPattern.CREATE_CUSTOMER }, createCustomerDto)
        .pipe(timeout(5000), retry(3)),
    );
  }

  @ApiOperation({ summary: 'Consultar cliente por documento' })
  @Get('document/:document')
  async getByDocument(@Param('document') document: string) {
    this.logger.log(`Gateway: Petición para consultar cliente con documento ${document}`);
    return await firstValueFrom(
      this.customerClient
        .send({ cmd: CustomerPattern.GET_CUSTOMER_BY_DOCUMENT }, { document })
        .pipe(timeout(5000), retry(3)),
    );
  }
}
