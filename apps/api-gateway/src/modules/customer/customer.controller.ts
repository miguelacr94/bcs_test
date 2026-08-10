import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Inject,
  Logger,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { timeout, retry } from 'rxjs/operators';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { CustomerPattern, ApplicationPattern, Role } from '@app/shared/enums';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { ApplyTransactionDto } from './dtos/apply-transaction.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { CustomerDashboardService } from './services/customer-dashboard.service';
import {
  ApiResponse as SharedApiResponse,
  CustomerResponse,
  DashboardData,
  FinancialSummaryData,
} from '@app/shared';

export interface ApplyTransactionResponse {
  customer: CustomerResponse;
  application: {
    id: string;
    status: string;
    offerResult?: any;
  };
}

@ApiTags('Clientes (Customers)')
@Controller('customers')
export class CustomerController {
  private readonly logger = new Logger(CustomerController.name);

  constructor(
    @Inject('CUSTOMER_SERVICE')
    private readonly customerClient: ClientProxy,
    @Inject('APPLICATIONS_SERVICE')
    private readonly applicationsClient: ClientProxy,
    private readonly customerDashboardService: CustomerDashboardService,
  ) {}

  @ApiOperation({ summary: 'Crear cliente' })
  @ApiBody({ type: CreateCustomerDto })
  @Post()
  async create(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<SharedApiResponse<CustomerResponse>> {
    this.logger.log(`Gateway: Petición para crear cliente`);
    try {
      const result = await firstValueFrom<CustomerResponse>(
        this.customerClient
          .send({ cmd: CustomerPattern.CREATE_CUSTOMER }, createCustomerDto)
          .pipe(timeout(5000), retry(3)),
      );

      return {
        success: true,
        message: 'Cliente creado exitosamente.',
        data: result,
      };
    } catch (error: unknown) {
      const err = error as { error?: string; message?: string };
      throw new BadRequestException(
        err.error || err.message || 'Error al crear el cliente',
      );
    }
  }

  @ApiOperation({ summary: 'Obtener Dashboard 360 del Cliente (Admin)' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin/dashboard/:document')
  async getCustomerDashboard(
    @Param('document') document: string,
  ): Promise<SharedApiResponse<DashboardData>> {
    this.logger.log(
      `Gateway-Compose: Recibiendo petición de Dashboard para documento ${document}`,
    );
    return await this.customerDashboardService.getDashboard(document);
  }

  @ApiOperation({ summary: 'Consultar estado de salud' })
  @Get(':document')
  async getCustomerHealth(
    @Param('document') document: string,
  ): Promise<
    SharedApiResponse<{ status: string; service: string; timestamp: string }>
  > {
    this.logger.log(
      `Gateway-Compose: Consultando estado de salud para documento ${document}`,
    );
    try {
      const result = await firstValueFrom<{
        status: string;
        service: string;
        timestamp: string;
      }>(
        this.customerClient
          .send({ cmd: CustomerPattern.CUSTOMER_HEALTH }, { document })
          .pipe(timeout(3000)),
      );

      return {
        success: true,
        message: 'Estado de salud consultado exitosamente.',
        data: result,
      };
    } catch (error: unknown) {
      const err = error as { error?: string; message?: string };
      throw new BadRequestException(
        err.error || err.message || 'Error al consultar el estado de salud',
      );
    }
  }

  @ApiOperation({
    summary:
      'Aplicar solicitud transaccional unificada (Registro + Solicitud + Oferta)',
  })
  @ApiBody({ type: ApplyTransactionDto })
  @Post('apply')
  async apply(
    @Body() dto: ApplyTransactionDto,
  ): Promise<SharedApiResponse<ApplyTransactionResponse>> {
    this.logger.log(
      `Gateway-Compose: Procesando transacción unificada aplicar para documento ${dto.customerData.document}`,
    );

    let customer: CustomerResponse | null = null;

    try {
      customer = await firstValueFrom<CustomerResponse>(
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
        customer = await firstValueFrom<CustomerResponse>(
          this.customerClient
            .send({ cmd: CustomerPattern.CREATE_CUSTOMER }, dto.customerData)
            .pipe(timeout(5000), retry(3)),
        );
      } catch (error: unknown) {
        const err = error as { error?: string; message?: string };
        throw new BadRequestException(
          err.error || err.message || 'Error al crear el cliente',
        );
      }
    } else {
      this.logger.log(
        `Gateway-Compose: Cliente con documento ${dto.customerData.document} ya registrado. Continuando con la solicitud...`,
      );
    }

    const newApplication: any = await firstValueFrom(
      this.applicationsClient
        .send(
          { cmd: ApplicationPattern.CREATE_APPLICATION },
          {
            createDto: {
              clientId: customer.id,
              channel: 'Autogestionado',
              offerResult: dto.offerResult,
            },
          },
        )
        .pipe(timeout(5000), retry(3)),
    );

    return {
      success: true,
      message: 'Transacción unificada procesada exitosamente.',
      data: {
        customer: customer,
        application: {
          id: newApplication.id,
          status: newApplication.status,
          offerResult: newApplication.offerResult,
        },
      },
    };
  }

  @ApiOperation({
    summary: 'Obtener información financiera del cliente (Admin)',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('financial-summary/admin/:document')
  async getCustomerFinancialSummary(
    @Param('document') document: string,
  ): Promise<SharedApiResponse<FinancialSummaryData>> {
    this.logger.log(
      `Gateway-Compose: Recibiendo petición de Dashboard para documento ${document}`,
    );
    return await this.customerDashboardService.getFinancialSummary(document);
  }
}
