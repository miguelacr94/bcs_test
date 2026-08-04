import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AuthPattern } from '@app/shared/enums';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy, // Inyectamos el cliente proxy de Auth
    private reflector: Reflector, // Inyectamos el Reflector para leer metadatos
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Verificamos si la ruta tiene el decorador @Public()
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    // Si es pública y no hay token, dejamos pasar directamente
    if (isPublic && !authHeader) {
      return true;
    }

    if (!authHeader) {
      throw new UnauthorizedException('Token no provisto.');
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      if (isPublic) return true;
      throw new UnauthorizedException(
        'Formato de token inválido. Debe ser Bearer <token>.',
      );
    }

    try {
      // 2. Enviar el token al microservicio Auth mediante Redis para su validación
      const result = await firstValueFrom(
        this.authClient.send({ cmd: AuthPattern.VALIDATE_TOKEN }, { token }),
      );

      // 3. Si el microservicio responde que no es válido, lanzar excepción (o ignorar si es pública)
      if (!result || !result.isValid) {
        if (isPublic) return true;
        throw new UnauthorizedException(
          result?.error || 'Token inválido o expirado.',
        );
      }

      // 4. Adjuntar la información del usuario a la petición para que el controlador tenga acceso
      request['user'] = result.user;
      return true;
    } catch (error: any) {
      if (isPublic) return true;
      throw new UnauthorizedException(
        error.message || 'Error de autenticación.',
      );
    }
  }
}
