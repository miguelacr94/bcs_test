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
import { SharedMessages } from '@app/shared';
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
      throw new UnauthorizedException(SharedMessages.Auth.TOKEN_NOT_PROVIDED);
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      if (isPublic) return true;
      throw new UnauthorizedException(
        SharedMessages.Auth.INVALID_TOKEN_FORMAT,
      );
    }

    try {
      const result = await firstValueFrom(
        this.authClient.send({ cmd: AuthPattern.VALIDATE_TOKEN }, { token }),
      );

      if (!result || !result.isValid) {
        if (isPublic) return true;
        throw new UnauthorizedException(
          result?.error || SharedMessages.Auth.INVALID_OR_EXPIRED_TOKEN,
        );
      }

      request['user'] = result.user;
      return true;
    } catch (error: unknown) {
      if (isPublic) return true;
      throw new UnauthorizedException(
        (error instanceof Error ? error.message : String(error)) || SharedMessages.Auth.AUTH_ERROR,
      );
    }
  }
}
