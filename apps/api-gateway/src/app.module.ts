import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ApplicationsModule } from './modules/applications/applications.module';
import { CustomerModule } from './modules/customer/customer.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { UserCoreGatewayModule } from './modules/user-core/user-core.module';
import { JwtModule } from '@nestjs/jwt';
import { envs } from '@app/shared/config/envs';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: envs.jwt.secret,
      signOptions: { expiresIn: envs.jwt.expiresIn as any },
    }),
    AuthModule,
    ApplicationsModule,
    CustomerModule,
    UserCoreGatewayModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
