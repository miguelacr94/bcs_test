import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ProductRepositoryPort } from '../../domain/ports/product-repository.port';
import { Product } from '../../domain/models/product.entity';
import { ProductDocument } from '../schemas/product.schema';
import { ProductMapper } from '../mappers/product.mapper';
import { PaginationDto } from '@app/shared/dtos';

@Injectable()
export class MongooseProductRepository implements ProductRepositoryPort {
  constructor(
    @InjectModel(ProductDocument.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  // Guardar o actualizar un producto
  async save(product: Product): Promise<Product> {
    const persistenceData = ProductMapper.toPersistence(product);

    // Si tiene un ID y es un ObjectId válido de Mongoose, actualizamos
    if (product.id && Types.ObjectId.isValid(product.id)) {
      const updatedDoc = await this.productModel
        .findByIdAndUpdate(product.id, persistenceData, { new: true })
        .exec();
      if (updatedDoc) {
        return ProductMapper.toDomain(updatedDoc);
      }
    }

    // De lo contrario (o si es un UUID nuevo generado temporalmente en el caso de uso), insertamos uno nuevo
    const createdProduct = new this.productModel(persistenceData);
    const savedDoc = await createdProduct.save();

    return ProductMapper.toDomain(savedDoc);
  }

  // Obtener todos los productos con paginación
  async findAll(
    paginationDto: PaginationDto,
  ): Promise<{ data: Product[]; total: number }> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [docs, total] = await Promise.all([
      this.productModel.find({ isActive: true }).skip(skip).limit(limit).exec(),
      this.productModel.countDocuments({ isActive: true }).exec(),
    ]);

    return {
      data: docs.map((doc) => ProductMapper.toDomain(doc)),
      total,
    };
  }

  // Buscar un producto por ID
  async findById(id: string): Promise<Product | null> {
    // Si no es un ID válido de Mongo, evitamos hacer la petición y retornamos null
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }

    const doc = await this.productModel.findById(id).exec();
    if (!doc) {
      return null;
    }
    return ProductMapper.toDomain(doc);
  }

  // Buscar productos por categoria
  async findByCategory(
    categoryId: string,
    paginationDto: PaginationDto,
  ): Promise<{ data: Product[]; total: number }> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [docs, total] = await Promise.all([
      this.productModel
        .find({ categoryId, isActive: true })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.productModel.countDocuments({ categoryId, isActive: true }).exec(),
    ]);

    return {
      data: docs.map((doc) => ProductMapper.toDomain(doc)),
      total,
    };
  }

  // Eliminar un producto por ID
  async delete(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      return false;
    }

    const doc = await this.productModel.findByIdAndDelete(id).exec();
    return !!doc;
  }
}
