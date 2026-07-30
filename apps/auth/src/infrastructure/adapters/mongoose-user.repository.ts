import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserRepositoryPort } from '../../domain/ports/user-repository.port';
import { User } from '../../domain/models/user.entity';
import { UserDocument } from '../schemas/user.schema';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class MongooseUserRepository implements UserRepositoryPort {
  constructor(
    @InjectModel(UserDocument.name)
    private readonly userModel: Model<UserDocument>
  ) {}

  // Implementación del método para guardar un usuario (soporta creación y actualización)
  async save(user: User): Promise<User> {
    const persistenceData = UserMapper.toPersistence(user);
    
    // Si la entidad tiene un ID que corresponde a un ObjectId válido de Mongo, es un update.
    if (user.id && Types.ObjectId.isValid(user.id)) {
      const updatedDoc = await this.userModel.findByIdAndUpdate(
        user.id,
        persistenceData,
        { new: true }
      ).exec();
      if (updatedDoc) {
        return UserMapper.toDomain(updatedDoc);
      }
    }
    
    const createdUser = new this.userModel(persistenceData);
    const savedDoc = await createdUser.save();
    
    return UserMapper.toDomain(savedDoc);
  }

  // Implementación de la búsqueda por correo
  async findByEmail(email: string): Promise<User | null> {
    const doc = await this.userModel.findOne({ email }).exec();
    if (!doc) {
      return null;
    }
    return UserMapper.toDomain(doc);
  }

  // Implementación de la búsqueda por ID
  async findById(id: string): Promise<User | null> {
    const doc = await this.userModel.findById(id).exec();
    if (!doc) {
      return null;
    }
    return UserMapper.toDomain(doc);
  }
}
