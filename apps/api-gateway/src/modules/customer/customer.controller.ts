import { Controller, Get, Post, Body, Param, Inject, Logger } from '@nestjs/common';
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
    return await firstValueFrom(
      this.customerClient
        .send({ cmd: CustomerPattern.CREATE_CUSTOMER }, createCustomerDto)
        .pipe(timeout(5000), retry(3)),
    );
  }

  @ApiOperation({ summary: 'Aplicar solicitud transaccional unificada (Registro + Solicitud + Oferta)' })
  @ApiBody({ type: ApplyTransactionDto })
  @Post('apply')
  async apply(@Body() dto: ApplyTransactionDto) {
    this.logger.log(`Gateway-Compose: Procesando transacción unificada aplicar para documento ${dto.customerData.document}`);

    let customer: any = null;

    // 1. Validar si el cliente ya existe en la base de datos local (Customer)
    try {
      customer = await firstValueFrom(
        this.customerClient
          .send({ cmd: CustomerPattern.GET_CUSTOMER_BY_DOCUMENT }, { document: dto.customerData.document })
          .pipe(timeout(3000)),
      );
    } catch (error) {
      this.logger.log(`Gateway-Compose: El cliente con documento ${dto.customerData.document} no existe en base de datos. Creándolo...`);
    }

    // Si no existe, procedemos a crearlo
    if (!customer) {
      customer = await firstValueFrom(
        this.customerClient
          .send({ cmd: CustomerPattern.CREATE_CUSTOMER }, dto.customerData)
          .pipe(timeout(5000), retry(3)),
      );
    } else {
      this.logger.log(`Gateway-Compose: Cliente con documento ${dto.customerData.document} ya registrado. Continuando con la solicitud...`);
    }

    // 2. Crear solicitud de financiación (inicialmente En Proceso) y guardar el resultado de la simulación
    const newApplication = await firstValueFrom(
      this.applicationsClient
        .send(
          { cmd: ApplicationPattern.CREATE_APPLICATION },
          { 
            createDto: { 
              clientId: customer.id, 
              channel: 'Autogestionado',
              offerResult: dto.offerResult 
            } 
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

  @ApiOperation({ summary: 'Consultar cliente por documento' })
  @Post('document')
  async getByDocument(@Body() body: { document: string }) {
    this.logger.log(`Gateway: Petición para consultar cliente con documento ${body.document}`);
    return await firstValueFrom(
      this.customerClient
        .send({ cmd: CustomerPattern.GET_CUSTOMER_BY_DOCUMENT }, { document: body.document })
        .pipe(timeout(5000), retry(3)),
    );
  }
}
