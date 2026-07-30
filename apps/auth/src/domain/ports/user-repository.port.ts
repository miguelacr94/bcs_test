import { User } from '../models/user.entity';

export interface UserRepositoryPort {
  // Guarda un usuario en la base de datos
  save(user: User): Promise<User>;

  // Busca un usuario por correo electrónico
  findByEmail(email: string): Promise<User | null>;

  // Busca un usuario por ID único
  findById(id: string): Promise<User | null>;
}
