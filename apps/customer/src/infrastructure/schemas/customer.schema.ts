import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'customers', timestamps: true })
export class CustomerDocument extends Document {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  lastName!: string;

  @Prop({ required: true, unique: true })
  document!: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true })
  phone!: string;

  @Prop({ type: Object })
  familyReference1?: { name: string; phone: string; relationship: string };
}

export const CustomerSchema = SchemaFactory.createForClass(CustomerDocument);
