import { NestFactory } from '@nestjs/core';
import { CustomerModule } from './customer.module';
import { MicroserviceOptions, Transport, ClientProxyFactory } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { configureTracing } from '@app/shared/tracing/tracing.config';
import { TracingInterceptor } from '@app/shared/interceptors/tracing.interceptor';
import { envs } from '@app/shared/config/envs';

async function bootstrap() {
  const logger = new Logger('CustomerMicroservice');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    CustomerModule,
    {
      transport: Transport.REDIS,
      options: {
        host: envs.redis.host,
        port: envs.redis.port,
      },
    },
  );

  // Configurar tracing
  configureTracing({
    enabled: true,
    serviceName: 'customer',
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
  logger.log('Microservicio Customer conectado a Redis y escuchando...');
}
bootstrap();
