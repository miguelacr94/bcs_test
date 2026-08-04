import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { envs } from '@app/shared/config/envs';
import { OfferCoreModule } from './offer-core.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    OfferCoreModule,
    {
      transport: Transport.REDIS,
      options: {
        host: envs.redis.host,
        port: envs.redis.port,
      },
    },
  );
  await app.listen();
  console.log('Offer-Core microservice listening on Redis');
}
bootstrap();
