import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProductsController } from './products.controller';
import { envs } from '@app/shared/config/envs';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PRODUCTS_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: envs.redis.host,
          port: 6379,
        },
      },
      {
        name: 'AUTH_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: envs.redis.host,
          port: 6379,
        },
      },
    ]),
  ],
  controllers: [ProductsController],
})
export class ProductsModule {}
