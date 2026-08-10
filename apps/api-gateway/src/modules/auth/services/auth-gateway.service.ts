import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { timeout, retry } from 'rxjs/operators';
import { AuthPattern } from '@app/shared/enums';
import { RegisterUserDto } from '../dtos/register-user.dto';
import { LoginUserDto } from '../dtos/login-user.dto';
import {
  ApiResponse as SharedApiResponse,
  RegisterResponse,
  LoginResponse,
} from '@app/shared';

@Injectable()
export class AuthGatewayService {
  private readonly logger = new Logger(AuthGatewayService.name);

  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  async register(
    dto: RegisterUserDto,
  ): Promise<SharedApiResponse<RegisterResponse>> {
    this.logger.log(
      'Orchestrator: Enviando petición de registro a Auth por Redis...',
    );

    const result = await firstValueFrom<RegisterResponse>(
      this.authClient
        .send({ cmd: AuthPattern.REGISTER_USER }, dto)
        .pipe(timeout(5000), retry(3)),
    );

    return {
      success: true,
      message: 'Usuario registrado exitosamente.',
      data: result,
    };
  }

  async login(dto: LoginUserDto): Promise<SharedApiResponse<LoginResponse>> {
    this.logger.log(
      'Orchestrator: Enviando petición de login a Auth por Redis...',
    );

    const result = await firstValueFrom<LoginResponse>(
      this.authClient
        .send({ cmd: AuthPattern.LOGIN_USER }, dto)
        .pipe(timeout(5000), retry(3)),
    );

    return {
      success: true,
      message: 'Sesión iniciada exitosamente.',
      data: result,
    };
  }
}
