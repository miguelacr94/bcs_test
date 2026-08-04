import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ApplicationsController } from './applications.controller';
import { envs } from '@app/shared/config/envs';
import { SensitiveDataMaskAdapter } from './adapters/sensitive-data-mask.adapter';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'APPLICATIONS_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: envs.redis.host,
          port: 6379,
        },
      },

      {
        name: 'AUTH_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: envs.redis.host,
          port: 6379,
        },
      },

      {
        name: 'CUSTOMER_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: envs.redis.host,
          port: 6379,
        },
      },
    ]),
  ],
  controllers: [ApplicationsController],
  providers: [SensitiveDataMaskAdapter],
})
export class ApplicationsModule {}
