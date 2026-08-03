import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  Inject,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { timeout, retry } from 'rxjs/operators';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ApplicationPattern, CustomerPattern } from '@app/shared/enums';
import { PaginationDto } from '@app/shared/dtos';
import { CreateApplicationDto } from './dtos/create-application.dto';
import { UpdateApplicationDto } from './dtos/update-application.dto';
import { AbandonApplicationDto } from './dtos/abandon-application.dto';
import { SimulateOfferDto } from './dtos/simulate-offer.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '@app/shared/enums';

@ApiTags('Solicitudes de Financiación (Applications)')
@Controller('applications')
export class ApplicationsController {
  private readonly logger = new Logger(ApplicationsController.name);

  constructor(
    @Inject('APPLICATIONS_SERVICE')
    private readonly applicationsClient: ClientProxy,
    @Inject('CUSTOMER_SERVICE')
    private readonly customerClient: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'Crear solicitud de financiación' })
  @Post()
  @ApiBody({ type: CreateApplicationDto })
  async createApplication(
    @Body() createDto: CreateApplicationDto,
  ) {
    this.logger.log(`Gateway: Solicitud para crear aplicación`);
    return await firstValueFrom(
      this.applicationsClient
        .send({ cmd: ApplicationPattern.CREATE_APPLICATION }, { createDto })
        .pipe(timeout(5000), retry(3)),
    );
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Listar solicitudes con filtros' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  async getApplications(@Query() paginationDto: PaginationDto) {
    this.logger.log('Gateway: Solicitando listar solicitudes');
    const applications = await firstValueFrom(
      this.applicationsClient
        .send({ cmd: ApplicationPattern.GET_APPLICATIONS }, { paginationDto })
        .pipe(timeout(5000), retry(3)),
    );

    // Enriquecer con información del cliente
    if (applications && applications.data) {
      const enrichedApplications = await Promise.all(
        applications.data.map(async (app: any) => {
          try {
            // Obtener información del cliente usando el clientId como documento
            const customer = await firstValueFrom(
              this.customerClient
                .send({ cmd: CustomerPattern.GET_CUSTOMER_BY_DOCUMENT }, { document: app.clientId })
                .pipe(timeout(5000), retry(3)),
            );
            
            return {
              ...app,
              customer: {
                name: customer.name,
                lastName: customer.lastName,
                document: customer.document,
              },
            };
          } catch (error) {
            this.logger.error(`Error fetching customer for clientId ${app.clientId}: ${error}`);
            return {
              ...app,
              customer: null,
            };
          }
        }),
      );

      return {
        ...applications,
        data: enrichedApplications,
      };
    }

    return applications;
  }

  @ApiOperation({ summary: 'Consultar detalle de solicitud' })
  @Get(':id')
  async getApplicationById(
    @Param('id') id: string,
  ) {
    this.logger.log(`Gateway: Petición para consultar solicitud ${id}`);
    return await firstValueFrom(
      this.applicationsClient
        .send({ cmd: ApplicationPattern.GET_APPLICATION_BY_ID }, { id })
        .pipe(timeout(5000), retry(3)),
    );
  }

  @ApiOperation({ summary: 'Actualizar parcialmente la solicitud' })
  @Patch(':id')
  @ApiBody({ type: UpdateApplicationDto })
  async updateApplication(
    @Param('id') id: string,
    @Body() updateDto: UpdateApplicationDto,
  ) {
    this.logger.log(`Gateway: Petición para actualizar solicitud ${id}`);
    return await firstValueFrom(
      this.applicationsClient
        .send({ cmd: ApplicationPattern.UPDATE_APPLICATION }, { id, updateDto })
        .pipe(timeout(5000), retry(3)),
    );
  }

  @ApiOperation({ summary: 'Invocar simulación preliminar de oferta' })
  @Post(':id/simulate-offer')
  @ApiBody({ type: SimulateOfferDto })
  async simulateOffer(
    @Param('id') id: string,
    @Body() simulateDto: SimulateOfferDto,
  ) {
    this.logger.log(
      `Gateway: Petición para simular oferta para solicitud ${id}`,
    );
    return await firstValueFrom(
      this.applicationsClient
        .send({ cmd: ApplicationPattern.SIMULATE_OFFER }, { id, simulateDto })
        .pipe(timeout(5000), retry(3)),
    );
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Aceptar oferta de crédito' })
  @UseGuards(AuthGuard)
  @Post(':id/accept-offer')
  async acceptOffer(
    @Param('id') id: string,
    @Body() body: { channel?: string },
  ) {
    return await firstValueFrom(
      this.applicationsClient
        .send({ cmd: ApplicationPattern.ACCEPT_OFFER }, { id, channel: body?.channel })
        .pipe(timeout(5000), retry(3)),
    );
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Abandonar solicitud' })
  @UseGuards(AuthGuard)
  @Post(':id/abandon')
  @ApiBody({ type: AbandonApplicationDto })
  async abandonApplication(
    @Param('id') id: string,
    @Body() reasonDto: AbandonApplicationDto & { channel?: string },
  ) {
    return await firstValueFrom(
      this.applicationsClient
        .send({ cmd: ApplicationPattern.ABANDON_APPLICATION }, { id, reasonDto })
        .pipe(timeout(5000), retry(3)),
    );
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Consultar bitácora o trazabilidad (Eventos)' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get(':id/events')
  async getApplicationEvents(@Param('id') id: string) {
    this.logger.log(
      `Gateway: Petición para consultar eventos de solicitud ${id}`,
    );
    return await firstValueFrom(
      this.applicationsClient
        .send({ cmd: ApplicationPattern.GET_APPLICATION_EVENTS }, { id })
        .pipe(timeout(5000), retry(3)),
    );
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Validar solicitud (Admin)' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post(':id/validate')
  async validateApplication(
    @Param('id') id: string,
    @Body() validationData: any,
  ) {
    return await firstValueFrom(
      this.applicationsClient
        .send({ cmd: ApplicationPattern.VALIDATE_APPLICATION }, { id, validationData })
        .pipe(timeout(5000), retry(3)),
    );
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Finalizar solicitud (Admin)' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post(':id/finalize')
  async finalizeApplication(
    @Param('id') id: string,
    @Body() body: { withDisbursement: boolean; channel?: string },
  ) {
    return await firstValueFrom(
      this.applicationsClient
        .send({ cmd: ApplicationPattern.FINALIZE_APPLICATION }, { id, withDisbursement: body.withDisbursement, channel: body.channel })
        .pipe(timeout(5000), retry(3)),
    );
  }
}
