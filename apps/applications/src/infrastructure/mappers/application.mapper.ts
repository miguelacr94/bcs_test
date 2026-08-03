import { Application } from '../../domain/models/application.entity';
import { ApplicationDocument } from '../schemas/application.schema';

export class ApplicationMapper {
  static toDomain(doc: ApplicationDocument): Application {
    return new Application(
      (doc._id as any).toString(),
      doc.radicado,
      doc.clientId,
      doc.channel,
      doc.status,
      doc.createdAt,
      doc.offerResult,
      doc.validationData,
    );
  }

  static toPersistence(entity: Application): any {
    return {
      radicado: entity.radicado,
      clientId: entity.clientId,
      channel: entity.channel,
      status: entity.status,
      createdAt: entity.createdAt,
      offerResult: entity.offerResult,
      validationData: entity.validationData,
    };
  }
}
