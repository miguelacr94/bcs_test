import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ApplicationRepositoryPort } from '../../domain/ports/application-repository.port';
import { Application } from '../../domain/models/application.entity';
import { ApplicationDocument } from '../schemas/application.schema';
import { ApplicationMapper } from '../mappers/application.mapper';
import { PaginationDto } from '@app/shared/dtos';
import { ApplicationStatus } from '@app/shared/enums';
import { AuditOfferDocument } from '../schemas/audit-offer.schema';

@Injectable()
export class MongooseApplicationRepository implements ApplicationRepositoryPort {
  constructor(
    @InjectModel(ApplicationDocument.name)
    private readonly applicationModel: Model<ApplicationDocument>,
    @InjectModel(AuditOfferDocument.name)
    private readonly auditOfferModel: Model<AuditOfferDocument>,
  ) {}

  async save(application: Application): Promise<Application> {
    const persistenceData = ApplicationMapper.toPersistence(application);

    if (application.id) {
      const exists = await this.applicationModel.exists({
        _id: application.id,
      });
      if (exists) {
        const updatedDoc = await this.applicationModel
          .findByIdAndUpdate(application.id, persistenceData, { new: true })
          .exec();
        if (updatedDoc) {
          return ApplicationMapper.toDomain(updatedDoc);
        }
      }
    }

    const createdDoc = new this.applicationModel({
      ...persistenceData,
      ...(application.id ? { _id: new Types.ObjectId(application.id) } : {}),
    });
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
    const { page = 1, limit = 10, clientId, status, radicado } = paginationDto;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (clientId) {
      filter.clientId = new Types.ObjectId(clientId);
    }
    if (status) {
      filter.status = status;
    }
    if (radicado) {
      filter.radicado = { $regex: radicado, $options: 'i' };
    }

    const docs = await this.applicationModel
      .find(filter)
      .skip(skip)
      .limit(limit)
      .exec();
    const total = await this.applicationModel.countDocuments(filter).exec();

    return {
      data: docs.map((doc) => ApplicationMapper.toDomain(doc)),
      total,
    };
  }

  async findByClientIdAndStatus(
    clientId: string,
    status: string | string[],
  ): Promise<Application | null> {
    const queryStatus = Array.isArray(status)
      ? { $in: status as ApplicationStatus[] }
      : (status as ApplicationStatus);
    const doc = await this.applicationModel
      .findOne({ clientId: new Types.ObjectId(clientId), status: queryStatus })
      .sort({ createdAt: -1 })
      .exec();
    if (!doc) {
      return null;
    }
    return ApplicationMapper.toDomain(doc);
  }

  async saveAudit(
    offerId: string,
    type: string,
    message: string,
    previousStatus?: string,
    nextStatus?: string,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    const audit = new this.auditOfferModel({
      offerId: new Types.ObjectId(offerId),
      type,
      message,
      previousStatus,
      nextStatus,
      metadata,
    });
    await audit.save();
  }

  async findAuditsByOfferId(offerId: string): Promise<unknown[]> {
    return await this.auditOfferModel
      .find({ offerId: new Types.ObjectId(offerId) })
      .sort({ createdAt: 1 })
      .exec();
  }

  async findAllByClientId(clientId: string): Promise<Application[]> {
    const docs = await this.applicationModel
      .find({ clientId: new Types.ObjectId(clientId) })
      .sort({ createdAt: -1 })
      .exec();
    return docs.map((doc) => ApplicationMapper.toDomain(doc));
  }
}
