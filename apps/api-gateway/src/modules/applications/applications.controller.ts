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
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { timeout, retry } from 'rxjs/operators';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
} from '@nestjs/swagger';
import { ApplicationPattern } from '@app/shared/enums';
import { PaginationDto } from '@app/shared/dtos';
import { CreateApplicationDto } from './dtos/create-application.dto';
import { UpdateApplicationDto } from './dtos/update-application.dto';
import { AbandonApplicationDto } from './dtos/abandon-application.dto';
import { SimulateOfferDto } from './dtos/simulate-offer.dto';

@ApiTags('Solicitudes de Financiación (Applications)')
@Controller('applications')
export class ApplicationsController {
  private readonly logger = new Logger(ApplicationsController.name);

  constructor(
    @Inject('APPLICATIONS_SERVICE')
    private readonly applicationsClient: ClientProxy,
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

  @ApiOperation({ summary: 'Listar solicitudes con filtros' })
  @Get()
  async getApplications(@Query() paginationDto: PaginationDto) {
    this.logger.log('Gateway: Solicitando listar solicitudes');
    return await firstValueFrom(
      this.applicationsClient
        .send({ cmd: ApplicationPattern.GET_APPLICATIONS }, { paginationDto })
        .pipe(timeout(5000), retry(3)),
    );
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

  @ApiOperation({ summary: 'Finalizar solicitud' })
  @Post(':id/finalize')
  async finalizeApplication(
    @Param('id') id: string,
  ) {
    return await firstValueFrom(
      this.applicationsClient
        .send({ cmd: ApplicationPattern.FINALIZE_APPLICATION }, { id })
        .pipe(timeout(5000), retry(3)),
    );
  }

  @ApiOperation({ summary: 'Abandonar solicitud' })
  @Post(':id/abandon')
  @ApiBody({ type: AbandonApplicationDto })
  async abandonApplication(
    @Param('id') id: string,
    @Body() reasonDto: AbandonApplicationDto,
  ) {
    return await firstValueFrom(
      this.applicationsClient
        .send({ cmd: ApplicationPattern.ABANDON_APPLICATION }, { id, reasonDto })
        .pipe(timeout(5000), retry(3)),
    );
  }

  @ApiOperation({ summary: 'Consultar bitácora o trazabilidad (Eventos)' })
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
}
