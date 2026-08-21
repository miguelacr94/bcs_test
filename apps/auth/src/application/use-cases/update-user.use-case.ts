import { Inject, Injectable } from '@nestjs/common';
import type { UserRepositoryPort } from '../../domain/ports/user-repository.port';
import { User } from '../../domain/models/user.entity';
import { UpdateUserDto } from './dtos/update-user.dto';
import { EmailsConstans } from '@app/shared/constants/emails.constanst';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject('UserRepositoryPort')
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(
    dto: UpdateUserDto,
  ): Promise<Omit<User, 'password' | 'refreshToken'>> {
    const user = await this.userRepository.findById(dto.userId);

    if (!user) {
      throw new Error('Usuario no encontrado.');
    }

    if (
      dto.role === 'ADMIN' &&
      dto.email !== EmailsConstans.SUPER_ADMIN_EMAIL
    ) {
      throw new Error(
        'No tienes permisos de Super Administrador para asignar el rol de ADMIN.',
      );
    }

    const newRole = dto.role !== undefined ? dto.role : user.role;
    const newName = dto.name !== undefined ? dto.name : user.name;

    const updatedUser = new User(
      user.id,
      newName,
      user.email,
      user.password,
      newRole,
      user.createdAt,
      user.refreshToken,
    );

    const savedUser = await this.userRepository.save(updatedUser);

    return {
      id: savedUser.id,
      name: savedUser.name,
      email: savedUser.email,
      role: savedUser.role,
      createdAt: savedUser.createdAt,
    };
  }
}
