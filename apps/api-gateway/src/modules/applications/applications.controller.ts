import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
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
import { ApplicationsGatewayService } from './services/applications-gateway.service';
import {
  ApiResponse as SharedApiResponse,
  ApplicationResponse,
} from '@app/shared';

@ApiTags('Solicitudes de Financiación (Applications)')
@Controller('applications')
export class ApplicationsController {
  constructor(
    private readonly applicationsGatewayService: ApplicationsGatewayService,
  ) {}

  @ApiOperation({ summary: 'Crear solicitud de financiación' })
  @Post()
  @ApiBody({ type: CreateApplicationDto })
  async createApplication(
    @Body() createDto: CreateApplicationDto,
  ): Promise<SharedApiResponse<ApplicationResponse>> {
    return await this.applicationsGatewayService.createApplication(createDto);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Listar solicitudes con filtros (Admin)',
    description:
      'Permite listar todas las solicitudes con paginación, y filtrar por estado o buscar por radicado.',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('admin/list')
  async getApplications(
    @Body() paginationDto: PaginationDto,
  ): Promise<SharedApiResponse<any>> {
    return await this.applicationsGatewayService.getApplications(paginationDto);
  }

  @Public()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Consultar detalle de solicitud (Público/Cliente)',
    description:
      'Retorna el estado de la solicitud sin exponer datos sensibles del cliente.',
  })
  @Post('get-by-id')
  async getApplicationById(
    @Req() req: Record<string, unknown>,
    @Body() body: { id: string },
  ): Promise<SharedApiResponse<ApplicationResponse>> {
    return await this.applicationsGatewayService.getApplicationById(body.id);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Consultar detalle completo de solicitud (Admin)',
    description:
      'Retorna todos los detalles de la solicitud incluyendo información completa del cliente, excepto el documento que viaja enmascarado por reglas de negocio.',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('admin/get-by-id')
  async getApplicationByIdAdmin(
    @Req() req: Record<string, unknown>,
    @Body() body: { id: string },
  ): Promise<SharedApiResponse<ApplicationResponse>> {
    return await this.applicationsGatewayService.getApplicationByIdAdmin(
      body.id,
    );
  }

  @ApiOperation({ summary: 'Actualizar parcialmente la solicitud' })
  @Post('update')
  @ApiBody({ type: UpdateApplicationDto })
  async updateApplication(
    @Body() body: { id: string; updateDto: UpdateApplicationDto },
  ): Promise<SharedApiResponse<ApplicationResponse>> {
    return await this.applicationsGatewayService.updateApplication(
      body.id,
      body.updateDto,
    );
  }

  @ApiOperation({ summary: 'Invocar simulación preliminar de oferta' })
  @Post('simulate-offer')
  @ApiBody({ type: SimulateOfferDto })
  async simulateOffer(
    @Body() body: { id: string; simulateDto: SimulateOfferDto },
  ): Promise<SharedApiResponse<any>> {
    return await this.applicationsGatewayService.simulateOffer(
      body.id,
      body.simulateDto,
    );
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Aceptar oferta de crédito' })
  @Post('accept-offer')
  async acceptOffer(
    @Body() body: { id: string; channel?: string },
  ): Promise<SharedApiResponse<any>> {
    return await this.applicationsGatewayService.acceptOffer(
      body.id,
      body.channel,
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
  ): Promise<SharedApiResponse<any>> {
    return await this.applicationsGatewayService.abandonApplication(
      body.id,
      body.reasonDto,
    );
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Consultar bitácora o trazabilidad (Eventos)' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('events')
  async getApplicationEvents(
    @Body() body: { id: string },
  ): Promise<SharedApiResponse<any[]>> {
    return await this.applicationsGatewayService.getApplicationEvents(body.id);
  }

  @ApiOperation({ summary: 'Consultar bitácora o trazabilidad (Eventos)' })
  @Post('events')
  async getPublicApplicationEvents(
    @Body() body: { id: string },
  ): Promise<SharedApiResponse<any[]>> {
    return await this.applicationsGatewayService.getPublicApplicationEvents(
      body.id,
    );
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Validar solicitud (Admin)' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('validate')
  async validateApplication(
    @Body() body: { id: string; validationData: Record<string, unknown> },
  ): Promise<SharedApiResponse<any>> {
    return await this.applicationsGatewayService.validateApplication(
      body.id,
      body.validationData,
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
  ): Promise<SharedApiResponse<any>> {
    return await this.applicationsGatewayService.finalizeApplication(body);
  }
}
