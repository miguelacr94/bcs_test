import {
  TraceType,
  TraceLink,
  TraceError,
} from '../interfaces/trace.interface';

export class CreateTraceDto {
  traceId!: string;
  parentSpanId?: string;
  spanId!: string;
  timestamp!: Date;
  duration!: number;
  service!: string;
  operation!: string;
  type!: TraceType;

  method?: string;
  path?: string;
  headers?: Record<string, string>;
  queryParams?: Record<string, unknown>;
  body?: Record<string, unknown>;

  userId?: string;
  correlationId?: string;
  metadata?: Record<string, unknown>;

  statusCode?: number;
  response?: Record<string, unknown>;
  error?: TraceError;

  tags!: string[];
  links!: TraceLink[];
}
