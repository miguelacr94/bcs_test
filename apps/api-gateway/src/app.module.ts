import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';

@Module({
  imports: [
    AuthModule, // Módulo de autenticación
    ProductsModule, // Módulo de productos
    OrdersModule, // Módulo de órdenes de compra
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*'); // Aplica el middleware a TODAS las rutas del Gateway
  }
}
