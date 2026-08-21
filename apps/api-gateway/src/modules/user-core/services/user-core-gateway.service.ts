import {
  Injectable,
  Inject,
  Logger,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { timeout, retry } from 'rxjs/operators';
import {
  UserPattern,
  CustomerPattern,
  ApplicationPattern,
} from '@app/shared/enums/message-patterns.enum';
import { ApiResponse, UserValidationResponse } from '@app/shared';

@Injectable()
export class UserCoreGatewayService {
  private readonly logger = new Logger(UserCoreGatewayService.name);

  constructor(
    @Inject('USER_CORE_SERVICE')
    private readonly userClient: ClientProxy,
    @Inject('CUSTOMER_SERVICE')
    private readonly customerClient: ClientProxy,
    @Inject('APPLICATIONS_SERVICE')
    private readonly applicationsClient: ClientProxy,
  ) {}

  async validateStatus(
    document: string,
  ): Promise<ApiResponse<UserValidationResponse>> {
    this.logger.log(
      `Orchestrator: Validando estado completo para documento ${document}`,
    );
    let coreUserExists = false;
    try {
      const coreUser = await firstValueFrom(
        this.userClient
          .send(
            { cmd: UserPattern.GET_USER_BY_DOCUMENT },
            { document: document },
          )
          .pipe(timeout(5000), retry(3)),
      );
      if (coreUser) {
        coreUserExists = true;
      }
    } catch (error) {
      this.logger.warn(
        `Orchestrator: Usuario ${document} no es elegible (no encontrado en centrales)`,
      );
      return {
        success: true,
        message: 'Usuario no elegible en centrales de riesgo.',
        data: {
          isEligible: false,
          existsInDb: false,
        },
      };
    }

    if (!coreUserExists) {
      return {
        success: true,
        message: 'Usuario no elegible en centrales de riesgo.',
        data: {
          isEligible: false,
          existsInDb: false,
        },
      };
    }
    let customer: { id: string } | null = null;
    try {
      customer = await firstValueFrom<{ id: string }>(
        this.customerClient
          .send(
            { cmd: CustomerPattern.GET_CUSTOMER_BY_DOCUMENT },
            { document: document },
          )
          .pipe(timeout(5000), retry(3)),
      );
    } catch (error) {
      this.logger.log(
        `Orchestrator: Cliente ${document} no registrado localmente en la db`,
      );
    }

    if (!customer) {
      return {
        success: true,
        message: 'Usuario apto para iniciar proceso de registro.',
        data: {
          isEligible: true,
          existsInDb: false,
          activeApplicationId: null,
        },
      };
    }

    const clientId = customer.id;
    let activeApplicationId: string | null = null;

    try {
      const activeApp = await firstValueFrom<any>(
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
          `Orchestrator: Solicitud activa encontrada para ${document}`,
        );
      }
    } catch (error) {
      this.logger.log(
        `Orchestrator: No se encontró solicitud activa para clientId ${clientId}`,
      );
    }

    if (!activeApplicationId) {
      // Si no tiene solicitud activa, verificamos si tiene una restricción de 30 días
      try {
        const restriction = await firstValueFrom<{
          restricted: boolean;
          availableDate?: string;
          daysRemaining?: number;
        }>(
          this.applicationsClient
            .send(
              {
                cmd: ApplicationPattern.CHECK_RECENT_FINALIZED_APPLICATION_BY_CLIENT_ID,
              },
              { clientId },
            )
            .pipe(timeout(5000), retry(3)),
        );

        if (restriction && restriction.restricted) {
          const dateStr = restriction.availableDate
            ? new Date(restriction.availableDate).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            : '';
          const errorMsg = `Tiene una solicitud finalizada recientemente. Podrá iniciar un nuevo proceso a partir del ${dateStr}.`;
          const err = new BadRequestException(
            errorMsg,
          ) as BadRequestException & {
            availableDate?: string;
            daysRemaining?: number;
          };
          err.availableDate = restriction.availableDate;
          err.daysRemaining = restriction.daysRemaining;
          throw err;
        }
      } catch (error: unknown) {
        if (error instanceof HttpException) throw error;
        this.logger.log(
          `Orchestrator: Error verificando solicitudes recientes para clientId ${clientId}`,
        );
      }
    }

    return {
      success: true,
      message: 'Información de validación del cliente obtenida con éxito.',
      data: {
        isEligible: true,
        existsInDb: true,
        activeApplicationId,
      },
    };
  }
}
