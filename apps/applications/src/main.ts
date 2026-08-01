import { NestFactory } from '@nestjs/core';
import { ApplicationsModule } from './applications.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { envs } from '@app/shared/config/envs';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ApplicationsModule,
    {
      transport: Transport.REDIS,
      options: {
        host: envs.redis.host,
        port: 6379,
      },
    },
  );
  await app.listen();
  console.log('Microservicio Applications iniciado y escuchando en Redis...');
}
bootstrap();
