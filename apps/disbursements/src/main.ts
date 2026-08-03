import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DisbursementsModule } from './disbursements.module';
import { envs } from '@app/shared/config/envs';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    DisbursementsModule,
    {
      transport: Transport.REDIS,
      options: {
        host: envs.redis.host,
        port: envs.redis.port,
      },
    },
  );
  await app.listen();
}
bootstrap();
