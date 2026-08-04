export enum TraceType {
  HTTP = 'HTTP',
  MICROSERVICE = 'MICROSERVICE',
  DATABASE = 'DATABASE',
}

export enum TraceLinkType {
  CHILD_OF = 'CHILD_OF',
  FOLLOWS_FROM = 'FOLLOWS_FROM',
}

export interface TraceLink {
  traceId: string;
  spanId: string;
  type: TraceLinkType;
}

export interface TraceError {
  name: string;
  message: string;
  stack?: string;
  code?: string;
}

export interface Trace {
  _id?: string;
  traceId: string;
  parentSpanId?: string;
  spanId: string;
  timestamp: Date;
  duration: number;
  service: string;
  operation: string;
  type: TraceType;

  // Request info
  method?: string;
  path?: string;
  headers?: Record<string, string>;
  queryParams?: Record<string, unknown>;
  body?: Record<string, unknown>;

  // Contexto de negocio
  userId?: string;
  correlationId?: string;
  metadata?: Record<string, unknown>;

  // Response info
  statusCode?: number;
  response?: Record<string, unknown>;
  error?: TraceError;

  // Tags para filtrado
  tags: string[];

  // Links a otros spans
  links: TraceLink[];
}
