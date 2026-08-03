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

@Injectable()
export class TracingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(TracingInterceptor.name);

  constructor(private readonly traceRepository: TraceRepository) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const config = getTracingConfig();

    if (!config.enabled || !shouldSample()) {
      return next.handle();
    }

    const ctx = context.switchToRpc();
    const data = ctx.getData();
    const pattern = context.getArgByIndex(0); // Get the pattern/message from RPC context

    // Extraer trace context de los headers del mensaje
    const headers = data?.headers || {};
    const traceId = extractTraceIdFromHeaders(headers) || generateTraceId();
    const parentSpanId = extractParentSpanIdFromHeaders(headers);
    const spanId = generateSpanId();

    const startTime = Date.now();
    const className = context.getClass().name;
    const methodName = context.getHandler().name;

    const trace: Trace = {
      traceId,
      parentSpanId,
      spanId,
      timestamp: new Date(startTime),
      duration: 0,
      service: config.serviceName,
      operation: `${className}.${methodName}`,
      type: TraceType.MICROSERVICE,
      method: pattern as string,
      headers: sanitizeHeaders(headers),
      body: sanitizeData(data, { maxBodySize: config.maxBodySize }),
      tags: [`pattern:${pattern}`],
      links: [],
    };

    if (config.logToConsole) {
      this.logger.debug(
        `[TRACE] Starting ${trace.operation} - TraceID: ${traceId}`,
      );
    }

    return next.handle().pipe(
      tap((responseData) => {
        trace.duration = Date.now() - startTime;
        trace.response = sanitizeData(responseData, { maxBodySize: config.maxBodySize });

        this.persistTrace(trace);

        if (config.logToConsole) {
          this.logger.debug(
            `[TRACE] Completed ${trace.operation} - Duration: ${trace.duration}ms`,
          );
        }
      }),
      catchError((error) => {
        trace.duration = Date.now() - startTime;
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
