import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { envs } from '@app/shared/config/envs';
import { UserCoreModule } from './user-core.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(UserCoreModule, {
    transport: Transport.REDIS,
    options: {
      host: envs.redis.host,
      port: envs.redis.port,
    },
  });
  await app.listen();
  console.log('User-Core microservice listening on Redis');
}
bootstrap();
