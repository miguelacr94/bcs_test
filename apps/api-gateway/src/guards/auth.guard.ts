import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SharedMessages } from '@app/shared';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
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
      throw new UnauthorizedException(SharedMessages.Auth.INVALID_TOKEN_FORMAT);
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      request['user'] = payload;
      return true;
    } catch (error: unknown) {
      if (isPublic) return true;
      throw new UnauthorizedException(
        SharedMessages.Auth.INVALID_OR_EXPIRED_TOKEN,
      );
    }
  }
}
