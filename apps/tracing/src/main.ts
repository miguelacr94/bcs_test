import { NestFactory } from '@nestjs/core';
import { TracingModule } from './tracing.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { envs } from '@app/shared/config/envs';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    TracingModule,
    {
      transport: Transport.REDIS,
      options: {
        host: envs.redis.host,
        port: envs.redis.port,
      },
    },
  );

  await app.listen();
  console.log('Microservicio Tracing iniciado y escuchando en Redis...');
}
bootstrap();
