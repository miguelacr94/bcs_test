import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UseGuards,
  Request,
  Patch,
  Logger,
} from '@nestjs/common';
import { Role, AuthPattern } from '@app/shared/enums';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '../../guards/auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { timeout, retry } from 'rxjs/operators';
import { RegisterUserDto } from './dtos/register-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { UpdateUserProfileDto } from './dtos/update-user-profile.dto';
import { CurrentUser } from '@app/shared/decorator/current-user.decorator';
import { CurrentUserInterface } from '@app/shared/interfaces';
import { Public } from '@app/shared/decorator/public.decorator';

@ApiTags('Autenticación')
@UseGuards(AuthGuard)
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @ApiOperation({
    summary: 'Registrar un nuevo usuario',
    description: 'Crea una cuenta nueva para un usuario con rol USER',
  })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'El correo ya está registrado' })
  @Public()
  @Post('register')
  async registerUser(@Body() dto: RegisterUserDto) {
    this.logger.log('Gateway: Enviando petición de registro a Auth por Redis...');

    const result = await firstValueFrom(
      this.authClient.send({ cmd: AuthPattern.REGISTER_USER }, dto).pipe(timeout(5000), retry(3)),
    );

    this.logger.log(
      `Gateway: Respuesta de registro recibida del microservicio: ${JSON.stringify(result)}`,
    );
    return result;
  }

  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({ status: 200, description: 'Login exitoso, devuelve JWT' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  @Public()
  @Post('login')
  async loginUser(@Body() dto: LoginUserDto) {
    this.logger.log('Gateway: Enviando petición de login a Auth por Redis...');

    const result = await firstValueFrom(
      this.authClient.send({ cmd: AuthPattern.LOGIN_USER }, dto).pipe(timeout(5000), retry(3)),
    );

    this.logger.log(
      `Gateway: Respuesta de login recibida del microservicio: ${JSON.stringify(result)}`,
    );
    return result;
  }

  @Public()
  @ApiOperation({
    summary: 'Endpoint de prueba para validar tokens manualmente',
  })
  @Get('validate-test')
  async validateTokenTest(@Query('token') token: string) {
    this.logger.log('Gateway: Enviando validación de token a Auth por Redis...');

    const result = await firstValueFrom(
      this.authClient.send({ cmd: AuthPattern.VALIDATE_TOKEN }, { token }).pipe(timeout(5000), retry(3)),
    );

    this.logger.log(`Gateway: Respuesta recibida del microservicio Auth: ${JSON.stringify(result)}`);
    return result;
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil devuelto exitosamente' })
  @ApiResponse({ status: 401, description: 'Token no provisto o expirado' })
  @Get('profile')
  getProfile(@CurrentUser() user: CurrentUserInterface) {
    this.logger.log(
      `Gateway: Devolviendo perfil del usuario autenticado: ${user.email}`,
    );
    return {
      success: true,
      user: user,
    };
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Actualizar perfil del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil actualizado exitosamente' })
  @ApiResponse({ status: 401, description: 'Token no provisto o expirado' })
  @Patch('profile')
  async updateProfile(
    @CurrentUser() user: CurrentUserInterface,
    @Body() body: UpdateUserProfileDto,
  ) {
    this.logger.log(
      'Gateway: Enviando petición de actualización de perfil a Auth...',
    );

    const payload = {
      userId: user.id,
      ...body,
    };

    const result = await firstValueFrom(
      this.authClient.send({ cmd: AuthPattern.UPDATE_USER_PROFILE }, payload).pipe(timeout(5000), retry(3)),
    );

    this.logger.log(`Gateway: Respuesta de actualización recibida: ${JSON.stringify(result)}`);
    return result;
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Refrescar el token de acceso' })
  @ApiResponse({
    status: 200,
    description: 'Nuevos tokens generados con éxito',
  })
  @ApiResponse({
    status: 400,
    description: 'Refresh token inválido o expirado',
  })
  @Post('refresh')
  async refreshToken(@Body() body: { refreshToken: string }) {
    this.logger.log('Gateway: Enviando petición de refresco de token a Auth...');

    const result = await firstValueFrom(
      this.authClient.send({ cmd: AuthPattern.REFRESH_TOKEN }, body).pipe(timeout(5000), retry(3)),
    );

    this.logger.log(
      `Gateway: Respuesta de refresco recibida del microservicio: ${JSON.stringify(result)}`,
    );
    return result;
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Cerrar sesión' })
  @ApiResponse({ status: 200, description: 'Sesión cerrada con éxito' })
  @ApiResponse({ status: 401, description: 'Token no provisto o expirado' })
  @Post('logout')
  async logout(@CurrentUser() user: CurrentUserInterface) {
    this.logger.log(`Gateway: Enviando petición de logout para usuario: ${user.id}`);

    const result = await firstValueFrom(
      this.authClient.send({ cmd: AuthPattern.LOGOUT }, { userId: user.id }).pipe(timeout(5000), retry(3)),
    );

    this.logger.log(
      `Gateway: Respuesta de logout recibida del microservicio: ${JSON.stringify(result)}`,
    );
    return result;
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Endpoint de prueba solo para administradores' })
  @ApiResponse({ status: 200, description: 'Acceso autorizado' })
  @ApiResponse({ status: 403, description: 'No tienes permisos suficientes' })
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin-only')
  getAdminDashboard() {
    return {
      success: true,
      message: '¡Bienvenido al panel de administración!',
    };
  }
}
