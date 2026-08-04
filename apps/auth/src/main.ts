import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { MicroserviceOptions, Transport, ClientProxyFactory } from '@nestjs/microservices';
import { envs } from '@app/shared/config/envs';
import { configureTracing } from '@app/shared/tracing/tracing.config';
import { TracingInterceptor } from '@app/shared/interceptors/tracing.interceptor';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
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
    serviceName: 'auth',
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
  console.log('Microservicio Auth iniciado y escuchando en Redis...');
}
bootstrap();
