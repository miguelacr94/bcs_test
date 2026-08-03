import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
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
} from './application/use-cases';

@Module({
  imports: [
    MongooseModule.forRoot(envs.mongo.applicationsUri),
    MongooseModule.forFeature([
      { name: ApplicationDocument.name, schema: ApplicationSchema },
      { name: AuditOfferDocument.name, schema: AuditOfferSchema },
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
