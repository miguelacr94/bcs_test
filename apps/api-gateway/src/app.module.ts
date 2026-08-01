import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ApplicationsModule } from './modules/applications/applications.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { CustomerModule } from './modules/customer/customer.module';

@Module({
  imports: [
    AuthModule, // Módulo de autenticación
    ApplicationsModule, CustomerModule, // Módulo de solicitudes de financiación
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
