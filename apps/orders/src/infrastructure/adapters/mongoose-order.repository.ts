import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { OrderRepositoryPort } from '../../domain/ports/order-repository.port';
import { Order } from '../../domain/models/order.entity';
import { OrderDocument } from '../schemas/order.schema';
import { OrderMapper } from '../mappers/order.mapper';
import { PaginationDto } from '@app/shared/dtos';

@Injectable()
export class MongooseOrderRepository implements OrderRepositoryPort {
  constructor(
    @InjectModel(OrderDocument.name)
    private readonly orderModel: Model<OrderDocument>,
  ) {}

  // Guardar o actualizar una orden de compra
  async save(order: Order): Promise<Order> {
    const persistenceData = OrderMapper.toPersistence(order);

    if (order.id && Types.ObjectId.isValid(order.id)) {
      const updatedDoc = await this.orderModel
        .findByIdAndUpdate(order.id, persistenceData, { new: true })
        .exec();
      if (updatedDoc) {
        return OrderMapper.toDomain(updatedDoc);
      }
    }

    const createdDoc = new this.orderModel(persistenceData);
    const savedDoc = await createdDoc.save();

    return OrderMapper.toDomain(savedDoc);
  }

  // Obtener todas las órdenes de un usuario con paginación
  async findByUserId(userId: string, paginationDto: PaginationDto): Promise<Order[]> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const docs = await this.orderModel
      .find({ userId })
      .skip(skip)
      .limit(limit)
      .exec();
      
    return docs.map(doc => OrderMapper.toDomain(doc));
  }

  // Buscar una orden por ID
  async findById(id: string): Promise<Order | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    const doc = await this.orderModel.findById(id).exec();
    if (!doc) {
      return null;
    }
    return OrderMapper.toDomain(doc);
  }
}
