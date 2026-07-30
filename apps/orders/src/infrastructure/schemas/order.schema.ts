import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { OrderStatus } from '@app/shared/enums';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class OrderItemDocument {
  @Prop({ required: true })
  productId!: string;

  @Prop({ required: true, min: 1 })
  quantity!: number;

  @Prop({ required: true, min: 0 })
  price!: number;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItemDocument);

@Schema({ collection: 'orders' })
export class OrderDocument extends Document {
  @Prop({ required: true })
  userId!: string;

  @Prop({ type: [OrderItemSchema], required: true })
  items!: OrderItemDocument[];

  @Prop({ required: true, min: 0 })
  totalAmount!: number;

  @Prop({ required: true, enum: Object.values(OrderStatus), default: OrderStatus.PENDING })
  status!: OrderStatus;

  @Prop({ default: Date.now })
  createdAt!: Date;
}

export const OrderSchema = SchemaFactory.createForClass(OrderDocument);
