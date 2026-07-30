import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'products' })
export class ProductDocument extends Document {
  // para extender todas las propiedades de Document y que sea un documento de mongoose
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ required: true, min: 0 })
  price!: number;

  @Prop({ required: true, min: 0 })
  stock!: number;

  @Prop({ required: true })
  categoryId!: string;

  @Prop({ default: true })
  isActive!: boolean;

  @Prop({ default: Date.now })
  createdAt!: Date;
}

export const ProductSchema = SchemaFactory.createForClass(ProductDocument);
