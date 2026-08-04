import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class DisbursementDocument extends Document {
  @Prop({ required: true })
  applicationId!: string;

  @Prop({ required: true })
  clientId!: string;

  @Prop({ required: true })
  amount!: number;

  @Prop({ required: true, default: 'SCHEDULED' })
  status!: string;
}

export const DisbursementSchema =
  SchemaFactory.createForClass(DisbursementDocument);
