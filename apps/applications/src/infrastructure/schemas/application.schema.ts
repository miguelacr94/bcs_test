import { ApplicationStatus } from '@app/shared/enums';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
  @Prop({ required: true })
  clientId!: string;

  @Prop({ required: true })
  channel!: string;

  @Prop({ required: true, type: String, enum: ApplicationStatus })
  status!: ApplicationStatus;

  @Prop({ default: Date.now })
  createdAt!: Date;

  @Prop({ type: Object })
  offerResult!: object;
}

export const ApplicationSchema =
  SchemaFactory.createForClass(ApplicationDocument);
