import { Controller, Inject, Logger } from '@nestjs/common';
import { AuthPattern } from '@app/shared/enums';
import type { TokenServicePort } from './domain/ports/token-service.port';
import type { UserRepositoryPort } from './domain/ports/user-repository.port';
import { AuthService } from './auth.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import {
  RegisterUserUseCase,
  LoginUserUseCase,
  RefreshTokenUseCase,
  LogoutUseCase,
  UpdateUserUseCase,
} from './application/use-cases';
import {
  RegisterUserDto,
  LoginUserDto,
  UpdateUserDto,
} from './application/use-cases/dtos';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    @Inject('TokenServicePort')
    private readonly tokenService: TokenServicePort,
    @Inject('UserRepositoryPort')
    private readonly userRepository: UserRepositoryPort,
  ) {}

  private readonly logger = new Logger(AuthController.name);

  // Patrón de mensaje para registrar un nuevo usuario
  @MessagePattern({ cmd: AuthPattern.REGISTER_USER })
  async registerUser(@Payload() dto: RegisterUserDto) {
    this.logger.log(
      `Microservicio Auth: Procesando registro para el correo: ${dto.email}`,
    );
    try {
      const user = await this.registerUserUseCase.execute(dto);
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      };
    } catch (error: unknown) {
      this.logger.error(`Microservicio Auth Error: ${(error instanceof Error ? error.message : String(error))}`);
      throw new RpcException((error instanceof Error ? error.message : String(error)));
    }
  }

  // Patrón de mensaje para iniciar sesión de un usuario
  @MessagePattern({ cmd: AuthPattern.LOGIN_USER })
  async loginUser(@Payload() dto: LoginUserDto) {
    this.logger.log(
      `Microservicio Auth: Procesando inicio de sesión para el correo: ${dto.email}`,
    );
    try {
      return await this.loginUserUseCase.execute(dto);
    } catch (error: unknown) {
      this.logger.error(`Microservicio Auth Login Error: ${(error instanceof Error ? error.message : String(error))}`);
      throw new RpcException((error instanceof Error ? error.message : String(error)));
    }
  }

  // Escucha mensajes en el patrón de comando 'validate_token' a través de Redis
  @MessagePattern({ cmd: AuthPattern.VALIDATE_TOKEN })
  async validateToken(@Payload() data: { token: string }) {
    this.logger.log(`Recibida petición de validación de token: ${data.token}`);
    try {
      // 1. Verificar firma y expiración usando el puerto de tokens
      const decoded = await this.tokenService.verifyToken(data.token);

      // 2. Obtener el ID del usuario ('sub' del payload)
      const userId = decoded.sub;

      // 3. Confirmar que el usuario existe en la base de datos
      const user = await this.userRepository.findById(userId);
      if (!user) {
        return { isValid: false, error: 'Usuario no encontrado.' };
      }

      return {
        isValid: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      };
    } catch (error: unknown) {
      this.logger.error(`Error al validar token: ${(error instanceof Error ? error.message : String(error))}`);
      return {
        isValid: false,
        error: 'Token inválido o expirado.',
      };
    }
  }

  // Patrón de mensaje para refrescar tokens
  @MessagePattern({ cmd: AuthPattern.REFRESH_TOKEN })
  async refreshToken(@Payload() data: { refreshToken: string }) {
    this.logger.log('Microservicio Auth: Refrescando token...');
    try {
      return await this.refreshTokenUseCase.execute(data.refreshToken);
    } catch (error: unknown) {
      this.logger.error(`Microservicio Auth Refresh Error: ${(error instanceof Error ? error.message : String(error))}`);
      throw new RpcException((error instanceof Error ? error.message : String(error)));
    }
  }

  // Patrón de mensaje para cerrar sesión
  @MessagePattern({ cmd: AuthPattern.LOGOUT })
  async logout(@Payload() data: { userId: string }) {
    this.logger.log(
      `Microservicio Auth: Cerrando sesión para usuario: ${data.userId}`,
    );
    try {
      return await this.logoutUseCase.execute(data.userId);
    } catch (error: unknown) {
      this.logger.error(`Microservicio Auth Logout Error: ${(error instanceof Error ? error.message : String(error))}`);
      throw new RpcException((error instanceof Error ? error.message : String(error)));
    }
  }

  // Patrón de mensaje para actualizar el perfil del usuario
  @MessagePattern({ cmd: AuthPattern.UPDATE_USER_PROFILE })
  async updateUserProfile(@Payload() dto: UpdateUserDto) {
    this.logger.log(
      `Microservicio Auth: Actualizando perfil para el usuario: ${dto.userId}`,
    );
    try {
      return await this.updateUserUseCase.execute(dto);
    } catch (error: unknown) {
      this.logger.error(
        `Microservicio Auth Update Profile Error: ${(error instanceof Error ? error.message : String(error))}`,
      );
      throw new RpcException((error instanceof Error ? error.message : String(error)));
    }
  }
}
