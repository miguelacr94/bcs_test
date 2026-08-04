import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'audit_offert' })
export class AuditOfferDocument extends Document {
  @Prop({ required: true })
  offerId!: string;

  @Prop({ required: false })
  previousStatus?: string;

  @Prop({ required: false })
  nextStatus?: string;

  @Prop({ required: true })
  type!: string;

  @Prop({ required: true })
  message!: string;

  @Prop({ required: true, default: Date.now })
  createdAt!: Date;

  @Prop({ type: Object })
  metadata?: Record<string, unknown>;
}

export const AuditOfferSchema =
  SchemaFactory.createForClass(AuditOfferDocument);
