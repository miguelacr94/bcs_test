import { Inject, Injectable } from '@nestjs/common';
import type { UserRepositoryPort } from '../../domain/ports/user-repository.port';
import { User } from '../../domain/models/user.entity';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject('UserRepositoryPort')
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(
    dto: UpdateUserDto,
  ): Promise<Omit<User, 'password' | 'refreshToken'>> {
    // 1. Obtener la entidad original completa de la base de datos
    const user = await this.userRepository.findById(dto.userId);

    if (!user) {
      throw new Error('Usuario no encontrado.');
    }

    // 2. Mezclar (Merge) los datos viejos con los nuevos.
    // Si el Frontend no envió un nuevo 'name', conservamos el 'user.name' original.
    const newName = dto.name !== undefined ? dto.name : user.name;

    // 3. Reconstruir la entidad pura de Dominio para validar reglas de negocio.
    // Pasamos todos los campos originales (correo, contraseña encriptada, etc.)
    // y solo sobrescribimos los que cambiaron.
    const updatedUser = new User(
      user.id,
      newName,
      user.email,
      user.password,
      user.role,
      user.createdAt,
      user.refreshToken, // Conservamos el token de sesión
    );

    // 4. Guardar la entidad reconstruida. El repositorio hará un "Upsert/Replace".
    const savedUser = await this.userRepository.save(updatedUser);

    // 5. Retornar los datos sin exponer la contraseña ni el refresh token por seguridad
    return {
      id: savedUser.id,
      name: savedUser.name,
      email: savedUser.email,
      role: savedUser.role,
      createdAt: savedUser.createdAt,
    };
  }
}
