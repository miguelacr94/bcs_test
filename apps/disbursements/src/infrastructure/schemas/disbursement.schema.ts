import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class DisbursementDocument extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Application' })
  applicationId!: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Customer' })
  clientId!: Types.ObjectId;

  @Prop({ required: true })
  amount!: number;

  @Prop({ required: true, default: 'SCHEDULED' })
  status!: string;
}

export const DisbursementSchema =
  SchemaFactory.createForClass(DisbursementDocument);
