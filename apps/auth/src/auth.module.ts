import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserDocument, UserSchema } from './infrastructure/schemas/user.schema';
import { MongooseUserRepository } from './infrastructure/adapters/mongoose-user.repository';
import { BcryptHasherAdapter } from './infrastructure/adapters/bcrypt-hasher.adapter';
import { JwtModule } from '@nestjs/jwt';
import { JwtTokenAdapter } from './infrastructure/adapters/jwt-token.adapter';
import {
  RegisterUserUseCase,
  LoginUserUseCase,
  RefreshTokenUseCase,
  LogoutUseCase,
  UpdateUserUseCase,
} from './application/use-cases';
import { envs } from '@app/shared/config/envs';

@Module({
  imports: [
    // Conectamos este microservicio a su base de datos independiente en MongoDB
    MongooseModule.forRoot(envs.mongo.authUri),

    // Registramos el esquema de Mongoose para que esté disponible para inyección
    MongooseModule.forFeature([
      { name: UserDocument.name, schema: UserSchema },
    ]),
    JwtModule.register({
      secret: envs.jwt.secret,
      signOptions: { expiresIn: envs.jwt.expiresIn as never },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    RegisterUserUseCase,
    LoginUserUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,
    UpdateUserUseCase,

    // Inversión de Control: Enlazamos el token del Port con la clase del Adapter de persistencia
    {
      provide: 'UserRepositoryPort',
      useClass: MongooseUserRepository,
    },
    {
      provide: 'PasswordHasherPort',
      useClass: BcryptHasherAdapter,
    },
    {
      provide: 'TokenServicePort',
      useClass: JwtTokenAdapter,
    },
  ],
})
export class AuthModule {}
