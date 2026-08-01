import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ApplicationRepositoryPort } from '../../domain/ports/application-repository.port';
import { Application } from '../../domain/models/application.entity';
import { ApplicationDocument } from '../schemas/application.schema';
import { ApplicationMapper } from '../mappers/application.mapper';
import { PaginationDto } from '@app/shared/dtos';
import { ApplicationStatus } from '@app/shared/enums';
@Injectable()
export class MongooseApplicationRepository implements ApplicationRepositoryPort {
  constructor(
    @InjectModel(ApplicationDocument.name)
    private readonly applicationModel: Model<ApplicationDocument>,
  ) {}

  async save(application: Application): Promise<Application> {
    const persistenceData = ApplicationMapper.toPersistence(application);

    if (application.id && Types.ObjectId.isValid(application.id)) {
      const updatedDoc = await this.applicationModel
        .findByIdAndUpdate(application.id, persistenceData, { new: true })
        .exec();
      if (updatedDoc) {
        return ApplicationMapper.toDomain(updatedDoc);
      }
    }

    const createdDoc = new this.applicationModel(persistenceData);
    const savedDoc = await createdDoc.save();
    return ApplicationMapper.toDomain(savedDoc);
  }

  async findById(id: string): Promise<Application | null> {
    if (!Types.ObjectId.isValid(id)) {
      return null;
    }
    const doc = await this.applicationModel.findById(id).exec();
    if (!doc) {
      return null;
    }
    return ApplicationMapper.toDomain(doc);
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<{ data: Application[]; total: number }> {
    const { page = 1, limit = 10, clientId, status } = paginationDto;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (clientId) {
      filter.clientId = clientId;
    }
    if (status) {
      filter.status = status;
    }

    const docs = await this.applicationModel.find(filter).skip(skip).limit(limit).exec();
    const total = await this.applicationModel.countDocuments(filter).exec();

    return {
      data: docs.map((doc) => ApplicationMapper.toDomain(doc)),
      total,
    };
  }

  async findByClientIdAndStatus(clientId: string, status: string | string[]): Promise<Application | null> {
    const queryStatus = Array.isArray(status) ? { $in: status as ApplicationStatus[] } : (status as ApplicationStatus);
    const doc = await this.applicationModel.findOne({ clientId, status: queryStatus }).exec();
    if (!doc) {
      return null;
    }
    return ApplicationMapper.toDomain(doc);
  }
}
