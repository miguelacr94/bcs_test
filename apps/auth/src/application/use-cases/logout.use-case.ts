import { Inject, Injectable } from '@nestjs/common';
import type { UserRepositoryPort } from '../../domain/ports/user-repository.port';
import { User } from '../../domain/models/user.entity';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject('UserRepositoryPort')
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(userId: string): Promise<{ success: boolean }> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error('Usuario no encontrado.');
      }

      // Limpiamos el refresh token de la base de datos
      const updatedUser = new User(
        user.id,
        user.name,
        user.email,
        user.password,
        user.role,
        user.createdAt,
        null,
      );
      await this.userRepository.save(updatedUser);

      return { success: true };
    } catch (error: unknown) {
      throw new RpcException(
        (error instanceof Error ? error.message : String(error)) ||
          'Error al cerrar sesión.',
      );
    }
  }
}
