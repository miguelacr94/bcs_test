import { Body, Controller, Get, Inject, Post, Query, UseGuards, Request, Patch } from '@nestjs/common';
import { Role, AuthPattern } from '@app/shared/enums';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { RegisterUserDto } from '../../../../auth/src/application/use-cases/dtos/register-user.dto';
import { LoginUserDto } from '../../../../auth/src/application/use-cases/dtos/login-user.dto';
import { UpdateUserProfileDto } from './dtos/update-user-profile.dto';

@ApiTags('Autenticación')
@Controller()
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario registrado con éxito' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @Post('register')
  async registerUser(@Body() body: RegisterUserDto) {
    console.log('Gateway: Enviando petición de registro a Auth por Redis...');
    
    const result = await firstValueFrom(
      this.authClient.send({ cmd: AuthPattern.REGISTER_USER }, body),
    );

    console.log('Gateway: Respuesta de registro recibida del microservicio:', result);
    return result;
  }

  @ApiOperation({ summary: 'Iniciar sesión (Login)' })
  @ApiResponse({ status: 200, description: 'Token generado correctamente' })
  @ApiResponse({ status: 400, description: 'Credenciales inválidas o campos vacíos' })
  @Post('login')
  async loginUser(@Body() body: LoginUserDto) {
    console.log('Gateway: Enviando petición de login a Auth por Redis...');
    
    const result = await firstValueFrom(
      this.authClient.send({ cmd: AuthPattern.LOGIN_USER }, body),
    );

    console.log('Gateway: Respuesta de login recibida del microservicio:', result);
    return result;
  }

  @ApiOperation({ summary: 'Endpoint de prueba para validar tokens manualmente' })
  @Get('validate-test')
  async validateTokenTest(@Query('token') token: string) {
    console.log('Gateway: Enviando validación de token a Auth por Redis...');

    const result = await firstValueFrom(
      this.authClient.send({ cmd: AuthPattern.VALIDATE_TOKEN }, { token }),
    );

    console.log('Gateway: Respuesta recibida del microservicio Auth:', result);
    return result;
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil retornado con éxito' })
  @ApiResponse({ status: 401, description: 'Token no provisto o expirado' })
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    console.log('Gateway: Devolviendo perfil del usuario autenticado:', req.user.email);
    return {
      success: true,
      user: req.user,
    };
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Actualizar perfil del usuario autenticado (Demo DDD)' })
  @ApiResponse({ status: 200, description: 'Perfil actualizado con éxito' })
  @ApiResponse({ status: 401, description: 'Token no provisto o expirado' })
  @UseGuards(AuthGuard)
  @Patch('profile')
  async updateProfile(@Request() req: any, @Body() body: UpdateUserProfileDto) {
    console.log('Gateway: Enviando petición de actualización de perfil a Auth...');
    
    // El payload incluye el ID extraído del token JWT (seguridad) y el body enviado por el cliente
    const payload = {
      userId: req.user.id,
      ...body,
    };

    const result = await firstValueFrom(
      this.authClient.send({ cmd: AuthPattern.UPDATE_USER_PROFILE }, payload),
    );

    console.log('Gateway: Respuesta de actualización recibida:', result);
    return result;
  }

  @ApiOperation({ summary: 'Refrescar el token de acceso' })
  @ApiResponse({ status: 200, description: 'Nuevos tokens generados con éxito' })
  @ApiResponse({ status: 400, description: 'Refresh token inválido o expirado' })
  @Post('refresh')
  async refreshToken(@Body() body: { refreshToken: string }) {
    console.log('Gateway: Enviando petición de refresco de token a Auth...');
    
    const result = await firstValueFrom(
      this.authClient.send({ cmd: AuthPattern.REFRESH_TOKEN }, body),
    );

    console.log('Gateway: Respuesta de refresco recibida del microservicio:', result);
    return result;
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Cerrar sesión' })
  @ApiResponse({ status: 200, description: 'Sesión cerrada con éxito' })
  @ApiResponse({ status: 401, description: 'Token no provisto o expirado' })
  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Request() req: any) {
    console.log('Gateway: Enviando petición de logout para usuario:', req.user.id);
    
    const result = await firstValueFrom(
      this.authClient.send({ cmd: AuthPattern.LOGOUT }, { userId: req.user.id }),
    );

    console.log('Gateway: Respuesta de logout recibida del microservicio:', result);
    return result;
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Endpoint de prueba solo para administradores' })
  @ApiResponse({ status: 200, description: 'Acceso autorizado' })
  @ApiResponse({ status: 403, description: 'No tienes permisos suficientes' })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin-only')
  getAdminDashboard() {
    return {
      success: true,
      message: '¡Bienvenido al panel de administración!',
    };
  }
}
