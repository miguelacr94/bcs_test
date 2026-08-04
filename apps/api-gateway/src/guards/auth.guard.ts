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
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

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
      const result = await firstValueFrom(
        this.authClient.send({ cmd: AuthPattern.VALIDATE_TOKEN }, { token }),
      );

      if (!result || !result.isValid) {
        if (isPublic) return true;
        throw new UnauthorizedException(
          result?.error || 'Token inválido o expirado.',
        );
      }

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
