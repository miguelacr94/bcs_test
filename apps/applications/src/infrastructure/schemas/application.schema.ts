import { ApplicationStatus } from '@app/shared/enums';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ _id: false })
export class ApplicationEventSchema {
  @Prop({ required: true })
  type!: string;

  @Prop({ required: true })
  message!: string;

  @Prop({ required: true })
  timestamp!: string;

  @Prop({ type: Object })
  metadata?: any;
}

@Schema({ collection: 'applications' })
export class ApplicationDocument extends Document {
  @Prop({ required: true, unique: true })
  radicado!: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Customer' })
  clientId!: Types.ObjectId;

  @Prop({ required: true })
  channel!: string;

  @Prop({ required: true, type: String, enum: ApplicationStatus })
  status!: ApplicationStatus;

  @Prop({ default: Date.now })
  createdAt!: Date;

  @Prop({ type: Object })
  offerResult!: object;

  @Prop({ type: Object })
  validationData?: {
    familyReference1?: { name: string; phone: string; relationship: string };
    familyReference2?: { map: string; phone: string; relationship: string };
    additionalNotes?: string;
  };
}

export const ApplicationSchema =
  SchemaFactory.createForClass(ApplicationDocument);
