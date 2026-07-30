/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import { ProductsModule } from './products.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { envs } from '@app/shared/config/envs';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ProductsModule,
    {
      transport: Transport.REDIS,
      options: {
        host: envs.redis.host,
        port: 6379,
      },
    },
  );
  await app.listen();
  console.log('Microservicio Products iniciado y escuchando en Redis...');
}
bootstrap();
