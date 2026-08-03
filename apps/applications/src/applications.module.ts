import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ApplicationsController } from './applications.controller';
import { envs } from '@app/shared/config/envs';
import { ApplicationDocument, ApplicationSchema } from './infrastructure/schemas/application.schema';
import { AuditOfferDocument, AuditOfferSchema } from './infrastructure/schemas/audit-offer.schema';
import { MongooseApplicationRepository } from './infrastructure/adapters/mongoose-application.repository';
import { MockOfferServiceAdapter } from './infrastructure/adapters/mock-offer-service.adapter';
import {
  CreateApplicationUseCase,
  GetApplicationsUseCase,
  GetApplicationByIdUseCase,
  UpdateApplicationUseCase,
  SimulateOfferUseCase,
  AcceptOfferUseCase,
  AbandonApplicationUseCase,
  GetApplicationEventsUseCase,
  ValidateApplicationUseCase,
  FinalizeApplicationUseCase,
} from './application/use-cases';
import { TracingModule } from './modules/tracing/tracing.module';

@Module({
  imports: [
    MongooseModule.forRoot(envs.mongo.applicationsUri),
    MongooseModule.forFeature([
      { name: ApplicationDocument.name, schema: ApplicationSchema },
      { name: AuditOfferDocument.name, schema: AuditOfferSchema },
    ]),
    TracingModule,
    ClientsModule.register([
      {
        name: 'CUSTOMER_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: envs.redis.host,
          port: envs.redis.port,
        },
      },
      {
        name: 'DISBURSEMENTS_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: envs.redis.host,
          port: envs.redis.port,
        },
      },
    ]),
  ],
  controllers: [ApplicationsController],
  providers: [
    // Casos de Uso
    CreateApplicationUseCase,
    GetApplicationsUseCase,
    GetApplicationByIdUseCase,
    UpdateApplicationUseCase,
    SimulateOfferUseCase,
    AcceptOfferUseCase,
    AbandonApplicationUseCase,
    GetApplicationEventsUseCase,
    ValidateApplicationUseCase,
    FinalizeApplicationUseCase,

    // Inversión de Dependencias (Puertos -> Adaptadores)
    {
      provide: 'ApplicationRepositoryPort',
      useClass: MongooseApplicationRepository,
    },
    {
      provide: 'OfferServicePort',
      useClass: MockOfferServiceAdapter,
    },
  ],
})
export class ApplicationsModule {}

