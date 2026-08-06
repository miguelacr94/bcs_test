import { Controller, Post, Body, Logger, Inject, BadRequestException, HttpException } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { timeout, retry } from 'rxjs/operators';
import {
  UserPattern,
  CustomerPattern,
  ApplicationPattern,
} from '@app/shared/enums/message-patterns.enum';

@ApiTags('Validación Core (Centrales)')
@Controller('users')
export class UserCoreGatewayController {
  private readonly logger = new Logger(UserCoreGatewayController.name);

  constructor(
    @Inject('USER_CORE_SERVICE')
    private readonly userClient: ClientProxy,
    @Inject('CUSTOMER_SERVICE')
    private readonly customerClient: ClientProxy,
    @Inject('APPLICATIONS_SERVICE')
    private readonly applicationsClient: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'Validar estado del usuario en centrales y local' })
  @Post('validate')
  async validateStatus(@Body() body: { document: string }) {
    this.logger.log(
      `Gateway-Compose: Validando estado completo para documento ${body.document}`,
    );
    let coreUserExists = false;
    try {
      const coreUser = await firstValueFrom(
        this.userClient
          .send(
            { cmd: UserPattern.GET_USER_BY_DOCUMENT },
            { document: body.document },
          )
          .pipe(timeout(5000), retry(3)),
      );
      if (coreUser) {
        coreUserExists = true;
      }
    } catch (error) {
      this.logger.warn(
        `Gateway-Compose: Usuario ${body.document} no es elegible (no encontrado en centrales)`,
      );
      return {
        isEligible: false,
        existsInDb: false,
      };
    }

    if (!coreUserExists) {
      return {
        isEligible: false,
        existsInDb: false,
      };
    }
    let customer: Record<string, unknown> | null = null;
    try {
      customer = await firstValueFrom(
        this.customerClient
          .send(
            { cmd: CustomerPattern.GET_CUSTOMER_BY_DOCUMENT },
            { document: body.document },
          )
          .pipe(timeout(5000), retry(3)),
      );
    } catch (error) {
      this.logger.log(
        `Gateway-Compose: Cliente ${body.document} no registrado localmente en la db`,
      );
    }

    if (!customer) {
      return {
        isEligible: true,
        existsInDb: false,
        activeApplicationId: null,
      };
    }

    const clientId = customer.id;
    let activeApplicationId: string | null = null;

    try {
      const activeApp = await firstValueFrom(
        this.applicationsClient
          .send(
            { cmd: ApplicationPattern.GET_ACTIVE_APPLICATION_BY_CLIENT_ID },
            { clientId },
          )
          .pipe(timeout(5000), retry(3)),
      );

      if (activeApp) {
        activeApplicationId = activeApp.id || activeApp._id || null;
        this.logger.log(
          `Gateway-Compose: Solicitud activa encontrada para ${body.document}`,
        );
      }
    } catch (error) {
      this.logger.log(
        `Gateway-Compose: No se encontró solicitud activa para clientId ${clientId}`,
      );
    }

    if (!activeApplicationId) {
      // Si no tiene solicitud activa, verificamos si tiene una restricción de 30 días
      try {
        const restriction = await firstValueFrom<{ restricted: boolean; availableDate?: string; daysRemaining?: number }>(
          this.applicationsClient
            .send(
              { cmd: ApplicationPattern.CHECK_RECENT_FINALIZED_APPLICATION_BY_CLIENT_ID },
              { clientId },
            )
            .pipe(timeout(5000), retry(3)),
        );

        if (restriction && restriction.restricted) {
          const dateStr = restriction.availableDate 
            ? new Date(restriction.availableDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
            : '';
          const errorMsg = `Tiene una solicitud finalizada recientemente. Podrá iniciar un nuevo proceso a partir del ${dateStr}.`;
          const err = new BadRequestException(errorMsg) as BadRequestException & { availableDate?: string; daysRemaining?: number };
          err.availableDate = restriction.availableDate;
          err.daysRemaining = restriction.daysRemaining;
          throw err;
        }
      } catch (error: unknown) {
        if (error instanceof HttpException) throw error;
        this.logger.log(
          `Gateway-Compose: Error verificando solicitudes recientes para clientId ${clientId}`,
        );
      }
    }

    return {
      isEligible: true,
      existsInDb: true,
      activeApplicationId,
    };
  }
}
