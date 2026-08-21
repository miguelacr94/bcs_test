import { Body, Controller, Post, UseGuards, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '../../guards/auth.guard';
import { RegisterUserDto } from './dtos/register-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { Public } from '@app/shared/decorator/public.decorator';
import { AuthGatewayService } from './services/auth-gateway.service';

import {
  ApiResponse as SharedApiResponse,
  RegisterResponse,
  LoginResponse,
} from '@app/shared';

@ApiTags('Autenticación')
@UseGuards(AuthGuard)
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authGatewayService: AuthGatewayService) {}

  @ApiOperation({
    summary: 'Registrar un nuevo usuario',
    description: 'Crea una cuenta nueva para un usuario con rol USER',
  })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'El correo ya está registrado' })
  @Public()
  @Post('register')
  async registerUser(
    @Body() dto: RegisterUserDto,
  ): Promise<SharedApiResponse<RegisterResponse>> {
    this.logger.log('Gateway: Petición para registrar usuario recibida');
    return await this.authGatewayService.register(dto);
  }

  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({ status: 200, description: 'Login exitoso, devuelve JWT' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  @Public()
  @Post('login')
  async loginUser(
    @Body() dto: LoginUserDto,
  ): Promise<SharedApiResponse<LoginResponse>> {
    this.logger.log('Gateway: Petición de login recibida');
    return await this.authGatewayService.login(dto);
  }
}
