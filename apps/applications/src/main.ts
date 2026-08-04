import { NestFactory } from '@nestjs/core';
import { ApplicationsModule } from './applications.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { envs } from '@app/shared/config/envs';
import { configureTracing } from '@app/shared/tracing/tracing.config';
import { TracingInterceptor } from '@app/shared/interceptors/tracing.interceptor';
import { ClientProxyFactory } from '@nestjs/microservices';

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

  // Configurar tracing
  configureTracing({
    enabled: true,
    serviceName: 'applications',
    sampleRate: 1.0,
    logLevel: 'INFO',
    logToConsole: true,
  });

  const tracingClient = ClientProxyFactory.create({
    transport: Transport.REDIS,
    options: { host: envs.redis.host, port: envs.redis.port },
  });

  // Agregar interceptor de tracing
  app.useGlobalInterceptors(new TracingInterceptor(tracingClient));

  await app.listen();
  console.log('Microservicio Applications iniciado y escuchando en Redis...');
}
bootstrap();
