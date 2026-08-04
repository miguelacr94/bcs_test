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
  Req,
  BadRequestException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { timeout, retry } from 'rxjs/operators';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { ApplicationPattern, CustomerPattern } from '@app/shared/enums';
import { PaginationDto } from '@app/shared/dtos';
import { CreateApplicationDto } from './dtos/create-application.dto';
import { UpdateApplicationDto } from './dtos/update-application.dto';
import { AbandonApplicationDto } from './dtos/abandon-application.dto';
import { SimulateOfferDto } from './dtos/simulate-offer.dto';
import { FinalizeApplicationDto } from './dtos/finalize-application.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { Public } from '../../decorators/public.decorator';
import { Role } from '@app/shared/enums';
import { SensitiveDataMaskAdapter } from './adapters/sensitive-data-mask.adapter';

@ApiTags('Solicitudes de Financiación (Applications)')
@Controller('applications')
export class ApplicationsController {
  private readonly logger = new Logger(ApplicationsController.name);

  constructor(
    @Inject('APPLICATIONS_SERVICE')
    private readonly applicationsClient: ClientProxy,
    @Inject('CUSTOMER_SERVICE')
    private readonly customerClient: ClientProxy,
    private readonly sensitiveDataMask: SensitiveDataMaskAdapter,
  ) {}

  @ApiOperation({ summary: 'Crear solicitud de financiación' })
  @Post()
  @ApiBody({ type: CreateApplicationDto })
  async createApplication(@Body() createDto: CreateApplicationDto) {
    this.logger.log(`Gateway: Solicitud para crear aplicación`);

    let finalClientId = createDto.clientId;

    if (finalClientId && finalClientId.length !== 24) {
      try {
        const customer = await firstValueFrom(
          this.customerClient
            .send(
              { cmd: CustomerPattern.GET_CUSTOMER_BY_DOCUMENT },
              { document: finalClientId },
            )
            .pipe(timeout(3000)),
        );

        if (customer && customer.id) {
          finalClientId = customer.id;
        } else {
          throw new BadRequestException(
            'No existe un cliente asociado a ese documento.',
          );
        }
      } catch (error: unknown) {
      throw new BadRequestException(
          (error as any)?.message ||
            'Error al validar el cliente asociado al documento.',
        );
      }
    }

    const payload = {
      ...createDto,
      clientId: finalClientId,
    };

    return await firstValueFrom(
      this.applicationsClient
        .send(
          { cmd: ApplicationPattern.CREATE_APPLICATION },
          { createDto: payload },
        )
        .pipe(timeout(5000), retry(3)),
    );
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Listar solicitudes con filtros' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('list')
  async getApplications(@Body() paginationDto: PaginationDto) {
    this.logger.log('Gateway: Solicitando listar solicitudes');
    const applications = await firstValueFrom(
      this.applicationsClient
        .send({ cmd: ApplicationPattern.GET_APPLICATIONS }, { paginationDto })
        .pipe(timeout(5000), retry(3)),
    );

    if (applications && applications.data) {
      const enrichedApplications = await Promise.all(
        applications.data.map(async (app: Record<string, unknown>) => {
          try {
            const customer = await firstValueFrom(
              this.customerClient
                .send(
                  { cmd: CustomerPattern.GET_CUSTOMER_BY_ID },
                  { id: app.clientId },
                )
                .pipe(timeout(5000), retry(3)),
            );

            const { clientId, offerResult, ...appWithoutSensitiveData } = app as any;

            return {
              ...appWithoutSensitiveData,
              customer:
                this.sensitiveDataMask.sanitizeCustomerForList(customer),
            };
          } catch (error) {
            this.logger.error(
              `Error fetching customer for clientId ${app.clientId}: ${error}`,
            );
            const { clientId, offerResult, ...appWithoutSensitiveData } = app as any;
            return {
              ...appWithoutSensitiveData,
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

  @Public()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Consultar detalle de solicitud' })
  @Post('get-by-id')
  async getApplicationById(@Req() req: Record<string, unknown>, @Body() body: { id: string }) {
    this.logger.log(`Gateway: Petición para consultar solicitud ${body.id}`);
    const application: Record<string, unknown> = await firstValueFrom(
      this.applicationsClient
        .send(
          { cmd: ApplicationPattern.GET_APPLICATION_BY_ID },
          { id: body.id },
        )
        .pipe(timeout(5000), retry(3)),
    );

    if (application && application.clientId) {
      // Endpoint público/cliente: NO debe traer info del customer según regla de negocio
      delete application.clientId;
    }

    return application;
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Consultar detalle completo de solicitud (Admin)' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('admin/get-by-id')
  async getApplicationByIdAdmin(@Req() req: Record<string, unknown>, @Body() body: { id: string }) {
    this.logger.log(`Gateway: Petición ADMIN para consultar solicitud ${body.id}`);
    const application: Record<string, unknown> = await firstValueFrom(
      this.applicationsClient
        .send(
          { cmd: ApplicationPattern.GET_APPLICATION_BY_ID },
          { id: body.id },
        )
        .pipe(timeout(5000), retry(3)),
    );

    if (application && application.clientId) {
      try {
        const customer = await firstValueFrom(
          this.customerClient
            .send(
              { cmd: CustomerPattern.GET_CUSTOMER_BY_ID },
              { id: application.clientId },
            )
            .pipe(timeout(5000)),
        );

        if (customer) {
          // Regla: Siempre que se exponga el documento en el front debe ir enmascarado
          if (customer.document) {
            customer.document = this.sensitiveDataMask.maskDocument(customer.document);
          }
          // Admin: El resto de datos viajan completos (sin enmascarar)
          application.customer = customer;
        }
      } catch (error) {
        this.logger.warn(
          `No se pudo obtener la información del cliente para la solicitud ${body.id}`,
        );
      }

      delete application.clientId;
    }

    return application;
  }

  @ApiOperation({ summary: 'Actualizar parcialmente la solicitud' })
  @Post('update')
  @ApiBody({ type: UpdateApplicationDto })
  async updateApplication(
    @Body() body: { id: string; updateDto: UpdateApplicationDto },
  ) {
    this.logger.log(`Gateway: Petición para actualizar solicitud ${body.id}`);
    return await firstValueFrom(
      this.applicationsClient
        .send(
          { cmd: ApplicationPattern.UPDATE_APPLICATION },
          { id: body.id, updateDto: body.updateDto },
        )
        .pipe(timeout(5000), retry(3)),
    );
  }

  @ApiOperation({ summary: 'Invocar simulación preliminar de oferta' })
  @Post('simulate-offer')
  @ApiBody({ type: SimulateOfferDto })
  async simulateOffer(
    @Body() body: { id: string; simulateDto: SimulateOfferDto },
  ) {
    this.logger.log(
      `Gateway: Petición para simular oferta para solicitud ${body.id}`,
    );
    return await firstValueFrom(
      this.applicationsClient
        .send(
          { cmd: ApplicationPattern.SIMULATE_OFFER },
          { id: body.id, simulateDto: body.simulateDto },
        )
        .pipe(timeout(5000), retry(3)),
    );
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Aceptar oferta de crédito' })
  @Post('accept-offer')
  async acceptOffer(@Body() body: { id: string; channel?: string }) {
    return await firstValueFrom(
      this.applicationsClient
        .send(
          { cmd: ApplicationPattern.ACCEPT_OFFER },
          { id: body.id, channel: body?.channel },
        )
        .pipe(timeout(5000), retry(3)),
    );
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Abandonar solicitud' })
  @Post('abandon')
  @ApiBody({ type: AbandonApplicationDto })
  async abandonApplication(
    @Body()
    body: {
      id: string;
      reasonDto: AbandonApplicationDto & { channel?: string };
    },
  ) {
    return await firstValueFrom(
      this.applicationsClient
        .send(
          { cmd: ApplicationPattern.ABANDON_APPLICATION },
          { id: body.id, reasonDto: body.reasonDto },
        )
        .pipe(timeout(5000), retry(3)),
    );
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Consultar bitácora o trazabilidad (Eventos)' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('events')
  async getApplicationEvents(@Body() body: { id: string }) {
    this.logger.log(
      `Gateway: Petición para consultar eventos de solicitud ${body.id}`,
    );
    return await firstValueFrom(
      this.applicationsClient
        .send(
          { cmd: ApplicationPattern.GET_APPLICATION_EVENTS },
          { id: body.id },
        )
        .pipe(timeout(5000), retry(3)),
    );
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Validar solicitud (Admin)' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('validate')
  async validateApplication(@Body() body: { id: string; validationData: Record<string, unknown> }) {
    return await firstValueFrom(
      this.applicationsClient
        .send(
          { cmd: ApplicationPattern.VALIDATE_APPLICATION },
          { id: body.id, validationData: body.validationData },
        )
        .pipe(timeout(5000), retry(3)),
    );
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Finalizar solicitud (Admin)' })
  @ApiBody({ type: FinalizeApplicationDto })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('finalize')
  async finalizeApplication(
    @Body() body: FinalizeApplicationDto,
  ) {
    return await firstValueFrom(
      this.applicationsClient
        .send(
          { cmd: ApplicationPattern.FINALIZE_APPLICATION },
          {
            id: body.id,
            withDisbursement: body.withDisbursement,
            channel: body.channel,
            reason: body.reason,
          },
        )
        .pipe(timeout(5000), retry(3)),
    );
  }
}
