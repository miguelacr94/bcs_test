import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { timeout } from 'rxjs/operators';
import {
  CustomerPattern,
  ApplicationPattern,
  ApplicationStatus,
} from '@app/shared/enums';
import {
  ApiResponse,
  CustomerResponse,
  ApplicationResponse,
  DashboardData,
  FinancialSummaryData,
} from '@app/shared';

@Injectable()
export class CustomerDashboardService {
  private readonly logger = new Logger(CustomerDashboardService.name);

  constructor(
    @Inject('CUSTOMER_SERVICE')
    private readonly customerClient: ClientProxy,
    @Inject('APPLICATIONS_SERVICE')
    private readonly applicationsClient: ClientProxy,
  ) {}

  async getDashboard(document: string): Promise<ApiResponse<DashboardData>> {
    this.logger.log(
      `Orchestrator: Consolidando Dashboard para documento ${document}`,
    );

    // 1. Consultamos los datos del cliente al microservicio de clientes (Obligatorio)
    let customer: CustomerResponse | null = null;
    try {
      customer = await firstValueFrom(
        this.customerClient
          .send<CustomerResponse>(
            { cmd: CustomerPattern.GET_CUSTOMER_BY_DOCUMENT },
            { document },
          )
          .pipe(timeout(3000)),
      );
    } catch (error) {
      throw new BadRequestException(
        'El cliente solicitado no existe o no pudo ser consultado.',
      );
    }

    if (!customer) {
      throw new NotFoundException('El cliente solicitado no existe.');
    }

    let applications: ApplicationResponse[] = [];
    let applicationsWarning: string | undefined = undefined;

    try {
      applications = await firstValueFrom(
        this.applicationsClient
          .send<ApplicationResponse[]>(
            { cmd: ApplicationPattern.GET_APPLICATIONS_BY_CLIENT_ID },
            { clientId: customer.id },
          )
          .pipe(timeout(3000)),
      );
    } catch (error) {
      this.logger.error(
        'Orchestrator: Error consultando solicitudes del cliente. Aplicando fallback.',
      );
      applications = [];
      applicationsWarning =
        'El servicio de solicitudes no está disponible temporalmente.';
    }

    // 3. Composición de Datos
    return {
      success: true,
      message: 'Dashboard del cliente consultado exitosamente.',
      data: {
        customer,
        applications,
        ...(applicationsWarning ? { applicationsWarning } : {}),
      },
    };
  }

  async getFinancialSummary(
    document: string,
  ): Promise<ApiResponse<FinancialSummaryData>> {
    this.logger.log(
      `Orchestrator: Consolidando información financiera del cliente para documento ${document}`,
    );

    // 1. Consultamos los datos del cliente al microservicio de clientes (Obligatorio)
    let customer: CustomerResponse | null = null;
    try {
      customer = await firstValueFrom(
        this.customerClient
          .send<CustomerResponse>(
            { cmd: CustomerPattern.GET_CUSTOMER_BY_DOCUMENT },
            { document },
          )
          .pipe(timeout(3000)),
      );
    } catch (error) {
      throw new BadRequestException(
        'El cliente solicitado no existe o no pudo ser consultado.',
      );
    }

    if (!customer) {
      throw new NotFoundException('El cliente solicitado no existe.');
    }

    let applications: ApplicationResponse[] = [];
    let applicationsWarning: string | undefined = undefined;

    try {
      applications = await firstValueFrom(
        this.applicationsClient
          .send<ApplicationResponse[]>(
            { cmd: ApplicationPattern.GET_APPLICATIONS_BY_CLIENT_ID },
            { clientId: customer.id },
          )
          .pipe(timeout(3000)),
      );
    } catch (error) {
      // Fallback gracioso: Si falla el microservicio de solicitudes, retornamos lista vacía
      this.logger.error(
        'Orchestrator: Error consultando solicitudes del cliente. Aplicando fallback.',
      );
      applications = [];
      applicationsWarning =
        'El servicio de solicitudes no está disponible temporalmente.';
    }

    const totalApplications = applications.length;
    let activeRisk = 0;

    for (const application of applications) {
      if (
        application.status === ApplicationStatus.IN_PROCESS ||
        application.status === ApplicationStatus.PENDING_VALIDATION
      ) {
        const approvedVal =
          application.offerResult?.approvedAmount ||
          application.offerResult?.amount ||
          0;
        activeRisk += Number(approvedVal);
      }
    }

    // 3. Composición de Datos (Retorno fuera del ciclo for)
    return {
      success: true,
      message: 'Dashboard del cliente consultado exitosamente.',
      data: {
        customer,
        financialSummary: {
          totalApplications,
          activeRisk,
        },
        applications,
        ...(applicationsWarning ? { applicationsWarning } : {}),
      },
    };
  }
}
