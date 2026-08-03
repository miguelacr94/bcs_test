import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TraceDocument = Trace & Document;

@Schema({ timestamps: true })
export class Trace {
  @Prop({ required: true, index: true })
  traceId!: string;

  @Prop()
  parentSpanId?: string;

  @Prop({ required: true, index: true })
  spanId!: string;

  @Prop({ required: true, index: true })
  timestamp!: Date;

  @Prop({ required: true })
  duration!: number;

  @Prop({ required: true, index: true })
  service!: string;

  @Prop({ required: true })
  operation!: string;

  @Prop({ required: true, enum: ['HTTP', 'MICROSERVICE', 'DATABASE'] })
  type!: string;

  @Prop()
  method?: string;

  @Prop()
  path?: string;

  @Prop()
  headers?: Record<string, string>;

  @Prop()
  queryParams?: any;

  @Prop()
  body?: any;

  @Prop({ index: true })
  userId?: string;

  @Prop()
  correlationId?: string;

  @Prop()
  metadata?: Record<string, any>;

  @Prop()
  statusCode?: number;

  @Prop()
  response?: any;

  @Prop()
  error?: {
    name: string;
    message: string;
    stack?: string;
    code?: string;
  };

  @Prop({ type: [String], default: [] })
  tags!: string[];

  @Prop({ type: [{ traceId: String, spanId: String, type: String }], default: [] })
  links!: Array<{ traceId: string; spanId: string; type: string }>;
}

export const TraceSchema = SchemaFactory.createForClass(Trace);

// Índices compuestos para búsquedas comunes
TraceSchema.index({ traceId: 1, timestamp: -1 });
TraceSchema.index({ service: 1, timestamp: -1 });
TraceSchema.index({ userId: 1, timestamp: -1 });
TraceSchema.index({ timestamp: -1 }); // Para TTL si se implementa
