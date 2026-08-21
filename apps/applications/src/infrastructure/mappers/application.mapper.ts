import { Application } from '../../domain/models/application.entity';
import { ApplicationDocument } from '../schemas/application.schema';
import { Types } from 'mongoose';

export class ApplicationMapper {
  static toDomain(doc: ApplicationDocument): Application {
    return new Application(
      doc._id.toString(),
      doc.radicado,
      doc.clientId ? doc.clientId.toString() : '',
      doc.channel,
      doc.status,
      doc.createdAt,
      doc.offerResult as Record<string, unknown>,
      doc.validationData,
      doc.statusReason,
    );
  }

  static toPersistence(entity: Application): Record<string, unknown> {
    return {
      radicado: entity.radicado,
      clientId: new Types.ObjectId(entity.clientId),
      channel: entity.channel,
      status: entity.status,
      createdAt: entity.createdAt,
      offerResult: entity.offerResult,
      validationData: entity.validationData,
      statusReason: entity.statusReason,
    };
  }
}
