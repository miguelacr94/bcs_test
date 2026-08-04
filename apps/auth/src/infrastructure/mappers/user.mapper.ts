import { User } from '../../domain/models/user.entity';
import { UserDocument } from '../schemas/user.schema';

export class UserMapper {
  // Convierte un documento de Mongoose (Base de datos) a la Entidad de Dominio pura
  static toDomain(document: UserDocument): User {
    return new User(
      document._id.toString(), // Convertimos el ObjectId de MongoDB a un string para el dominio
      document.name,
      document.email,
      document.password,
      document.role,
      document.createdAt,
      document.refreshToken,
    );
  }

  // Convierte la Entidad de Dominio a un objeto plano listo para persistir en Mongoose
  static toPersistence(domain: User): Partial<UserDocument> {
    return {
      name: domain.name,
      email: domain.email,
      password: domain.password,
      role: domain.role,
      createdAt: domain.createdAt,
      refreshToken: domain.refreshToken,
    };
  }
}
