import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrdersController } from './orders.controller';
import { OrderDocument, OrderSchema } from './infrastructure/schemas/order.schema';
import { MongooseOrderRepository } from './infrastructure/adapters/mongoose-order.repository';
import { RedisProductServiceAdapter } from './infrastructure/adapters/redis-product-service.adapter';
import { CreateOrderUseCase, GetUserOrdersUseCase } from './application/use-cases';
import { envs } from '@app/shared/config/envs';

@Module({
  imports: [
    MongooseModule.forRoot(envs.mongo.ordersUri),
    MongooseModule.forFeature([
      { name: OrderDocument.name, schema: OrderSchema },
    ]),
    ClientsModule.register([
      {
        name: 'PRODUCTS_SERVICE',
        transport: Transport.REDIS,
        options: {
          host: envs.redis.host,
          port: 6379,
        },
      },
    ]),
  ],
  controllers: [OrdersController],
  providers: [
    CreateOrderUseCase,
    GetUserOrdersUseCase,

    // Inversión de Control: Vinculamos el Puerto de negocio de órdenes con el Adaptador de Mongoose
    {
      provide: 'OrderRepositoryPort',
      useClass: MongooseOrderRepository,
    },

    // Inversión de Control: Vinculamos el Puerto de comunicación de productos con el Adaptador de Redis
    {
      provide: 'ProductServicePort',
      useClass: RedisProductServiceAdapter,
    },
  ],
})
export class OrdersModule {}
