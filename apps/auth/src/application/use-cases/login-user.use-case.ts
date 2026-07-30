import { Inject, Injectable } from '@nestjs/common';
import type { UserRepositoryPort } from '../../domain/ports/user-repository.port';
import type { PasswordHasherPort } from '../../domain/ports/password-hasher.port';
import type { TokenServicePort } from '../../domain/ports/token-service.port';
import { LoginUserDto } from './dtos/login-user.dto';
import { User } from '../../domain/models/user.entity';

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject('UserRepositoryPort')
    private readonly userRepository: UserRepositoryPort,

    @Inject('PasswordHasherPort')
    private readonly passwordHasher: PasswordHasherPort,

    @Inject('TokenServicePort')
    private readonly tokenService: TokenServicePort,
  ) {}

  async execute(dto: LoginUserDto): Promise<{ 
    accessToken: string; 
    refreshToken: string; 
    user: { id: string; name: string; email: string; role: string } 
  }> {
    // 1. Buscar al usuario por correo electrónico
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      // Por buenas prácticas de seguridad, usamos el mismo mensaje genérico para no dar pistas
      throw new Error('Credenciales inválidas.');
    }

    // 2. Comparar la contraseña enviada con el hash persistido
    const isPasswordValid = await this.passwordHasher.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas.');
    }

    // 3. Definir el payload del token (información útil de sesión)
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    // 4. Generar tokens (Access Token corto y Refresh Token largo)
    const accessToken = await this.tokenService.generateToken(payload, { expiresIn: '1h' });
    const refreshToken = await this.tokenService.generateToken(payload, { expiresIn: '7d' });

    // 5. Guardar el nuevo refresh token en la base de datos
    const updatedUser = new User(
      user.id,
      user.name,
      user.email,
      user.password,
      user.role,
      user.createdAt,
      refreshToken
    );
    await this.userRepository.save(updatedUser);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
