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
    this.logger.log(
      'Gateway: Enviando petición de registro a Auth por Redis...',
    );

    const result = await firstValueFrom(
      this.authClient
        .send({ cmd: AuthPattern.REGISTER_USER }, dto)
        .pipe(timeout(5000), retry(3)),
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
      this.authClient
        .send({ cmd: AuthPattern.LOGIN_USER }, dto)
        .pipe(timeout(5000), retry(3)),
    );

    this.logger.log(
      `Gateway: Respuesta de login recibida del microservicio: ${JSON.stringify(result)}`,
    );
    return result;
  }





}
