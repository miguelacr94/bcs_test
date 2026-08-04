import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerController } from './customer.controller';
import {
  CustomerSchema,
  CustomerDocument,
} from './infrastructure/schemas/customer.schema';
import { CustomerRepositoryAdapter } from './infrastructure/adapters/customer.repository.adapter';
import { CreateCustomerUseCase } from './application/use-cases/create-customer.use-case';
import { FindCustomerByDocumentUseCase } from './application/use-cases/find-customer-by-document.use-case';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envs } from '@app/shared/config/envs';

@Module({
  imports: [
    MongooseModule.forRoot(envs.mongo.customerUri),
    MongooseModule.forFeature([
      { name: CustomerDocument.name, schema: CustomerSchema },
    ]),
  ],
  controllers: [CustomerController],
  providers: [
    {
      provide: 'CustomerRepositoryPort',
      useClass: CustomerRepositoryAdapter,
    },
    CreateCustomerUseCase,
    FindCustomerByDocumentUseCase,
  ],
})
export class CustomerModule {}
