import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'users' })
export class UserDocument extends Document {
  // Nota: MongoDB genera automáticamente el campo _id,
  // por lo que no necesitamos declararlo a menos que queramos tiparlo explícitamente.

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ default: 'USER' })
  role!: string;

  @Prop({ default: Date.now })
  createdAt!: Date;

  @Prop({ type: String, default: null })
  refreshToken?: string | null;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
