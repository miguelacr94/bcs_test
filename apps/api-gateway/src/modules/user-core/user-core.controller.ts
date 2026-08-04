import {
  Controller,
  Post,
  Body,
  Logger,
  Inject,
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

  @Post('document')
  async getByDocument(@Body() body: { document: string }) {
    this.logger.log(
      `Gateway: consultando User‑Core para documento ${body.document}`,
    );
    return await firstValueFrom(
      this.userClient
        .send({ cmd: UserPattern.GET_USER_BY_DOCUMENT }, { document: body.document })
        .pipe(timeout(5000), retry(3)),
    );
  }

  @Post('validate')
  async validateStatus(@Body() body: { document: string }) {
    this.logger.log(
      `Gateway-Compose: Validando estado completo para documento ${body.document}`,
    );

    // 1. Validamos si existe en el Core (Centrales de riesgo)
    let coreUserExists = false;
    try {
      const coreUser = await firstValueFrom(
        this.userClient
          .send({ cmd: UserPattern.GET_USER_BY_DOCUMENT }, { document: body.document })
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

    // 2. Validamos si existe en la Base de Datos local del banco (Customer)
    let customer: any = null;
    try {
      customer = await firstValueFrom(
        this.customerClient
          .send({ cmd: CustomerPattern.GET_CUSTOMER_BY_DOCUMENT }, { document: body.document })
          .pipe(timeout(5000), retry(3)),
      );
    } catch (error) {
      this.logger.log(
        `Gateway-Compose: Cliente ${body.document} no registrado localmente en la db`,
      );
    }

    if (!customer) {
      // Elegible pero no tiene registro local → debe crear aplicación
      return {
        isEligible: true,
        existsInDb: false,
        activeApplicationId: null,
      };
    }

    // 3. Si existe en la DB local, buscamos solicitud activa.
    //    IMPORTANTE: el clientId guardado en las aplicaciones es el DOCUMENTO del cliente,
    //    no el ObjectId del customer (así se crea desde el gateway al llamar CREATE_APPLICATION).
    const clientId = body.document;
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
      // Si el microservicio no encuentra app activa, simplemente retornamos null
      this.logger.log(
        `Gateway-Compose: No se encontró solicitud activa para clientId ${clientId}`,
      );
    }

    return {
      isEligible: true,
      existsInDb: true,
      activeApplicationId, // null → frontend crea nueva; string base64 → frontend redirige al detalle
    };
  }
}
