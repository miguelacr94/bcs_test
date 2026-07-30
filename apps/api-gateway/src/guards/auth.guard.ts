import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AuthPattern } from '@app/shared/enums';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy, // Inyectamos el cliente proxy de Auth
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Token no provisto.');
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Formato de token inválido. Debe ser Bearer <token>.');
    }

    try {
      // 1. Enviar el token al microservicio Auth mediante Redis para su validación
      const result = await firstValueFrom(
        this.authClient.send({ cmd: AuthPattern.VALIDATE_TOKEN }, { token }),
      );

      // 2. Si el microservicio responde que no es válido, lanzar excepción
      if (!result || !result.isValid) {
        throw new UnauthorizedException(result?.error || 'Token inválido o expirado.');
      }

      // 3. Adjuntar la información del usuario a la petición para que el controlador tenga acceso
      request['user'] = result.user;
      return true;
    } catch (error: any) {
      throw new UnauthorizedException(error.message || 'Error de autenticación.');
    }
  }
}
