import { Inject, Injectable } from '@nestjs/common';
import type { UserRepositoryPort } from '../../domain/ports/user-repository.port';
import type { TokenServicePort } from '../../domain/ports/token-service.port';
import { User } from '../../domain/models/user.entity';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject('UserRepositoryPort')
    private readonly userRepository: UserRepositoryPort,

    @Inject('TokenServicePort')
    private readonly tokenService: TokenServicePort,
  ) {}

  async execute(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      // 1. Verificar firma y expiración del refresh token
      const decoded = await this.tokenService.verifyToken(refreshToken);
      const userId = (decoded as { sub: string }).sub;

      // 2. Buscar al usuario en la base de datos
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error('Usuario no encontrado.');
      }

      // 3. Verificar si el refresh token enviado coincide con el guardado en la BD
      if (!user.refreshToken || user.refreshToken !== refreshToken) {
        throw new Error('Refresh token inválido o revocado.');
      }

      // 4. Generar nuevo par de tokens (Rotación de tokens)
      const payload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      const newAccessToken = await this.tokenService.generateToken(payload, {
        expiresIn: '1h',
      });
      const newRefreshToken = await this.tokenService.generateToken(payload, {
        expiresIn: '7d',
      });

      // 5. Guardar el nuevo refresh token en la base de datos
      const updatedUser = new User(
        user.id,
        user.name,
        user.email,
        user.password,
        user.role,
        user.createdAt,
        newRefreshToken,
      );
      await this.userRepository.save(updatedUser);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error: unknown) {
      throw new RpcException(
        (error instanceof Error ? error.message : String(error)) ||
          'Refresh token inválido.',
      );
    }
  }
}
