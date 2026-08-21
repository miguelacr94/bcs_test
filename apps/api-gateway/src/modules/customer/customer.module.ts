import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CustomerController } from './customer.controller';
import { CustomerDashboardService } from './services/customer-dashboard.service';
import { envs } from '@app/shared/config/envs';

@Module({
  imports: [
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
        name: 'APPLICATIONS_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: envs.redis.host,
          port: envs.redis.port,
        },
      },
    ]),
  ],
  controllers: [CustomerController],
  providers: [CustomerDashboardService],
})
export class CustomerModule {}
