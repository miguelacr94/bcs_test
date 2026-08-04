import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Inject,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { timeout, retry } from 'rxjs/operators';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { CustomerPattern, ApplicationPattern } from '@app/shared/enums';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { ApplyTransactionDto } from './dtos/apply-transaction.dto';

@ApiTags('Clientes (Customers)')
@Controller('customers')
export class CustomerController {
  private readonly logger = new Logger(CustomerController.name);

  constructor(
    @Inject('CUSTOMER_SERVICE')
    private readonly customerClient: ClientProxy,
    @Inject('APPLICATIONS_SERVICE')
    private readonly applicationsClient: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'Crear cliente' })
  @ApiBody({ type: CreateCustomerDto })
  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    this.logger.log(`Gateway: Petición para crear cliente`);
    try {
      return await firstValueFrom(
        this.customerClient
          .send({ cmd: CustomerPattern.CREATE_CUSTOMER }, createCustomerDto)
          .pipe(timeout(5000), retry(3)),
      );
    } catch (error: any) {
      throw new BadRequestException(error.error || error.message || 'Error al crear el cliente');
    }
  }

  @ApiOperation({
    summary:
      'Aplicar solicitud transaccional unificada (Registro + Solicitud + Oferta)',
  })
  @ApiBody({ type: ApplyTransactionDto })
  @Post('apply')
  async apply(@Body() dto: ApplyTransactionDto) {
    this.logger.log(
      `Gateway-Compose: Procesando transacción unificada aplicar para documento ${dto.customerData.document}`,
    );

    let customer: Record<string, unknown> | null = null;

    try {
      customer = await firstValueFrom(
        this.customerClient
          .send(
            { cmd: CustomerPattern.GET_CUSTOMER_BY_DOCUMENT },
            { document: dto.customerData.document },
          )
          .pipe(timeout(3000)),
      );
    } catch (error) {
      this.logger.log(
        `Gateway-Compose: El cliente con documento ${dto.customerData.document} no existe en base de datos. Creándolo...`,
      );
    }

    if (!customer) {
      try {
        customer = await firstValueFrom(
          this.customerClient
            .send({ cmd: CustomerPattern.CREATE_CUSTOMER }, dto.customerData)
            .pipe(timeout(5000), retry(3)),
        );
      } catch (error: any) {
        throw new BadRequestException(error.error || error.message || 'Error al crear el cliente');
      }
    } else {
      this.logger.log(
        `Gateway-Compose: Cliente con documento ${dto.customerData.document} ya registrado. Continuando con la solicitud...`,
      );
    }

    const newApplication = await firstValueFrom(
      this.applicationsClient
        .send(
          { cmd: ApplicationPattern.CREATE_APPLICATION },
          {
            createDto: {
              clientId: customer!.id,
              channel: 'Autogestionado',
              offerResult: dto.offerResult,
            },
          },
        )
        .pipe(timeout(5000), retry(3)),
    );

    return {
      success: true,
      customer,
      application: {
        id: newApplication.id,
        status: newApplication.status,
        offerResult: newApplication.offerResult,
      },
    };
  }

}
