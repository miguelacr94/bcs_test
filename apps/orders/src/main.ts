import { NestFactory } from '@nestjs/core';
import { OrdersModule } from './orders.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { envs } from '@app/shared/config/envs';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    OrdersModule,
    {
      transport: Transport.REDIS,
      options: {
        host: envs.redis.host,
        port: 6379,
      },
    },
  );
  await app.listen();
  console.log('Microservicio Orders iniciado y escuchando en Redis...');
}
bootstrap();
