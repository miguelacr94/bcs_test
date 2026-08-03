import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserCoreGatewayController } from './user-core.controller';
import { envs } from '@app/shared/config/envs';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_CORE_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: envs.redis.host,
          port: envs.redis.port,
        },
      },
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
  controllers: [UserCoreGatewayController],
})
export class UserCoreGatewayModule {}
