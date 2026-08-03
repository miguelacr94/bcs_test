import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ApplicationsModule } from './modules/applications/applications.module';
import { CustomerModule } from './modules/customer/customer.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { UserCoreGatewayModule } from './modules/user-core/user-core.module';
import { TracingModule } from './modules/tracing/tracing.module';

@Module({
  imports: [
    AuthModule,
    ApplicationsModule,
    CustomerModule,
    UserCoreGatewayModule,
    TracingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

