import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserCoreGatewayController } from './user-core.controller';
import { UserCoreGatewayService } from './services/user-core-gateway.service';
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
  providers: [UserCoreGatewayService],
})
export class UserCoreGatewayModule {}
