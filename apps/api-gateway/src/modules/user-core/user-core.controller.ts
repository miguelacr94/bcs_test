import {
  Controller,
  Get,
  Param,
  Logger,
  Inject,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { timeout, retry } from 'rxjs/operators';
import {
  UserPattern,
  CustomerPattern,
  ApplicationPattern,
} from '@app/shared/enums/message-patterns.enum';

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

  @Get('document/:document')
  async getByDocument(@Param('document') document: string) {
    this.logger.log(
      `Gateway: consultando User‑Core para documento ${document}`,
    );
    return await firstValueFrom(
      this.userClient
        .send({ cmd: UserPattern.GET_USER_BY_DOCUMENT }, { document })
        .pipe(timeout(5000), retry(3)),
    );
  }

  @Get('validate/:document')
  async validateStatus(@Param('document') document: string) {
    this.logger.log(
      `Gateway-Compose: Validando estado completo para documento ${document}`,
    );

    // 1. Validamos si existe en el Core (Centrales de riesgo)
    let coreUserExists = false;
    try {
      const coreUser = await firstValueFrom(
        this.userClient
          .send({ cmd: UserPattern.GET_USER_BY_DOCUMENT }, { document })
          .pipe(timeout(5000), retry(3)),
      );
      if (coreUser) {
        coreUserExists = true;
      }
    } catch (error) {
      this.logger.warn(
        `Gateway-Compose: Usuario ${document} no es elegible (no encontrado en centrales)`,
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

    // 2. Validamos si existe en la Base de Datos local del banco (Customer)
    let customerExists = false;
    try {
      const customer = await firstValueFrom(
        this.customerClient
          .send({ cmd: CustomerPattern.GET_CUSTOMER_BY_DOCUMENT }, { document })
          .pipe(timeout(5000), retry(3)),
      );
      if (customer) {
        customerExists = true;
      }
    } catch (error) {
      this.logger.log(
        `Gateway-Compose: Cliente ${document} no registrado localmente en la db`,
      );
    }

    if (!customerExists) {
      return {
        isEligible: true,
        existsInDb: false,
        activeApplicationId: null,
      };
    }

    // 3. Si existe en la base de datos local, miramos si tiene solicitudes activas
    let activeApplicationId: string | null = null;
    try {
      const appsResponse = await firstValueFrom(
        this.applicationsClient
          .send(
            { cmd: ApplicationPattern.GET_APPLICATIONS },
            { paginationDto: { limit: 100, page: 1 } },
          )
          .pipe(timeout(5000), retry(3)),
      );

      // Filtramos las solicitudes del cliente que estén activas (estados que no estén cerrados)
      if (appsResponse && appsResponse.data) {
        const activeApp = appsResponse.data.find(
          (app: any) =>
            app.clientId === document &&
            app.status !== 'Finalizada' &&
            app.status !== 'Abandonada',
        );
        if (activeApp) {
          activeApplicationId = activeApp.id || activeApp._id || null;
        }
      }
    } catch (error) {
      this.logger.error(
        `Gateway-Compose: Error consultando solicitudes para ${document}`,
        error,
      );
    }

    return {
      isEligible: true,
      existsInDb: true,
      activeApplicationId,
    };
  }
}
