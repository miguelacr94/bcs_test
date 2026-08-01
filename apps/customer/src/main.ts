import { NestFactory } from '@nestjs/core';
import { CustomerModule } from './customer.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('CustomerMicroservice');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    CustomerModule,
    {
      transport: Transport.REDIS,
      options: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    },
  );
  await app.listen();
  logger.log('Microservicio Customer conectado a Redis y escuchando...');
}
bootstrap();
