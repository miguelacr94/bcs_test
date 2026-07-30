import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenServicePort } from '../../domain/ports/token-service.port';

@Injectable()
export class JwtTokenAdapter implements TokenServicePort {
  constructor(private readonly jwtService: JwtService) {}

  async generateToken(payload: any, options?: any): Promise<string> {
    return this.jwtService.signAsync(payload, options);
  }

  async verifyToken(token: string): Promise<any> {
    return this.jwtService.verifyAsync(token);
  }
}
