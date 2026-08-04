import { Inject, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import type { UserRepositoryPort } from '../../domain/ports/user-repository.port';
import type { PasswordHasherPort } from '../../domain/ports/password-hasher.port';
import { User } from '../../domain/models/user.entity';
import { RegisterUserDto } from './dtos/register-user.dto';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    // Inyectamos el puerto usando su token string ya que la interfaz desaparece al compilar
    @Inject('UserRepositoryPort')
    private readonly userRepository: UserRepositoryPort,

    @Inject('PasswordHasherPort')
    private readonly passwordHasher: PasswordHasherPort,
  ) {}

  async execute(dto: RegisterUserDto): Promise<User> {
    // 1. Verificar si el usuario ya existe por email
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new Error('El correo electrónico ya se encuentra registrado.');
    }

    // 2. Cifrar la contraseña usando el puerto
    const hashedPassword = await this.passwordHasher.hash(dto.password);

    // 3. Generar un ID definitivo seguro y la fecha actual
    const secureId = crypto.randomUUID();
    const createdAt = new Date();

    // 4. Crear la entidad de dominio pura (esto disparará las validaciones internas de la clase User)
    const newUser = new User(
      secureId,
      dto.name,
      dto.email,
      hashedPassword,
      'USER', // Rol por defecto
      createdAt,
    );

    // 5. Guardar a través del puerto (sin saber qué base de datos hay detrás)
    return this.userRepository.save(newUser);
  }
}
