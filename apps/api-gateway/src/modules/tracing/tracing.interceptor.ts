import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Trace, TraceType } from '@app/shared/tracing/interfaces/trace.interface';
import {
  generateTraceId,
  generateSpanId,
  extractTraceIdFromHeaders,
  extractParentSpanIdFromHeaders,
} from '@app/shared/tracing/utils/trace-id.generator';
import {
  sanitizeData,
  sanitizeHeaders,
} from '@app/shared/tracing/utils/data-sanitizer';
import { getTracingConfig, shouldSample } from '@app/shared/tracing/tracing.config';
import { TraceRepository } from './infrastructure/repositories/trace.repository';

/**
 * Interceptor de tracing que persiste en MongoDB
 */
@Injectable()
export class TracingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(TracingInterceptor.name);

  constructor(private readonly traceRepository: TraceRepository) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const config = getTracingConfig();

    if (!config.enabled || !shouldSample()) {
      return next.handle();
    }

    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    // Extraer o generar trace context
    const traceId =
      extractTraceIdFromHeaders(request.headers) || generateTraceId();
    const parentSpanId = extractParentSpanIdFromHeaders(request.headers);
    const spanId = generateSpanId();

    // Inyectar headers para propagación
    request.headers['x-trace-id'] = traceId;
    request.headers['x-span-id'] = spanId;
    if (parentSpanId) {
      request.headers['x-parent-span-id'] = parentSpanId;
    }

    // Capturar información del request
    const startTime = Date.now();
    const className = context.getClass().name;
    const methodName = context.getHandler().name;

    // Construir el trace
    const trace: Trace = {
      traceId,
      parentSpanId,
      spanId,
      timestamp: new Date(startTime),
      duration: 0,
      service: config.serviceName,
      operation: `${className}.${methodName}`,
      type: TraceType.HTTP,
      method: request.method,
      path: request.url,
      headers: sanitizeHeaders(request.headers),
      queryParams: sanitizeData(request.query, { maxBodySize: config.maxBodySize }),
      body: sanitizeData(request.body, { maxBodySize: config.maxBodySize }),
      userId: request.user?.id || request.headers['x-user-id'],
      correlationId: request.headers['x-correlation-id'],
      tags: [`method:${request.method}`, `path:${request.url}`],
      links: [],
    };

    if (config.logToConsole) {
      this.logger.debug(
        `[TRACE] Starting ${trace.operation} - TraceID: ${traceId}`,
      );
    }

    return next.handle().pipe(
      tap((data) => {
        trace.duration = Date.now() - startTime;
        trace.statusCode = response.statusCode;
        trace.response = sanitizeData(data, { maxBodySize: config.maxBodySize });

        this.persistTrace(trace);

        if (config.logToConsole) {
          this.logger.debug(
            `[TRACE] Completed ${trace.operation} - Duration: ${trace.duration}ms`,
          );
        }
      }),
      catchError((error) => {
        trace.duration = Date.now() - startTime;
        trace.statusCode = error.status || 500;
        trace.error = {
          name: error.name,
          message: error.message,
          stack: config.includeStackTrace ? error.stack : undefined,
          code: error.code,
        };

        this.persistTrace(trace);

        if (config.logToConsole) {
          this.logger.error(
            `[TRACE] Failed ${trace.operation} - Error: ${error.message}`,
          );
        }

        throw error;
      }),
    );
  }

  private persistTrace(trace: Trace): void {
    const config = getTracingConfig();

    if (config.persistAsync) {
      setImmediate(() => {
        this.saveTrace(trace).catch((error) => {
          this.logger.error(`Failed to persist trace: ${error.message}`);
        });
      });
    } else {
      this.saveTrace(trace).catch((error) => {
        this.logger.error(`Failed to persist trace: ${error.message}`);
      });
    }
  }

  private async saveTrace(trace: Trace): Promise<void> {
    try {
      await this.traceRepository.create(trace);
    } catch (error: any) {
      this.logger.error(`Failed to persist trace: ${error.message}`);
    }
  }
}
