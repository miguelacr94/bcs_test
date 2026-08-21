import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './auth.controller';
import { AuthGatewayService } from './services/auth-gateway.service';
import { envs } from '@app/shared/config/envs';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: envs.redis.host,
          port: 6379,
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthGatewayService],
})
export class AuthModule {}
