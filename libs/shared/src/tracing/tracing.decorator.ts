import type { Trace } from './interfaces/trace.interface';
import { TraceType, TraceLinkType } from './interfaces/trace.interface';
import { TraceOptions } from './interfaces/trace-options.interface';
import {
  generateTraceId,
  generateSpanId,
  extractTraceIdFromHeaders,
  extractParentSpanIdFromHeaders,
} from './utils/trace-id.generator';
import { sanitizeData, safeStringify } from './utils/data-sanitizer';
import { getTracingConfig, shouldSample } from './tracing.config';

/**
 * Decorador para instrumentación manual de métodos
 *
 * @example
 * @Trace({ operation: 'calculateCreditScore', tags: ['credit-scoring'] })
 * async calculateScore(customerId: string) {
 *   // ...
 * }
 */
export function Trace(options: TraceOptions = {}): MethodDecorator {
  return (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    const originalMethod = descriptor.value;
    const config = getTracingConfig();

    descriptor.value = async function (...args: unknown[]) {
      if (!config.enabled || !shouldSample()) {
        return originalMethod.apply(this, args);
      }

      // Extraer trace context de los argumentos (si viene de HTTP)
      let traceId: string;
      let parentSpanId: string | undefined;
      let spanId: string;

      // Intentar extraer de headers si está disponible
      const headersArg = args.find(
        (arg): arg is { headers: Record<string, string> } =>
          typeof arg === 'object' && arg !== null && 'headers' in arg,
      );

      if (headersArg?.headers) {
        traceId =
          extractTraceIdFromHeaders(headersArg.headers) || generateTraceId();
        parentSpanId = extractParentSpanIdFromHeaders(headersArg.headers);
      } else {
        traceId = generateTraceId();
      }

      spanId = generateSpanId();

      const startTime = Date.now();
      const operationName = options.operation || String(propertyKey);
      const className = target?.constructor?.name || 'Unknown';

      // Construir el trace
      const trace: Trace = {
        traceId,
        parentSpanId,
        spanId,
        timestamp: new Date(startTime),
        duration: 0,
        service: config.serviceName,
        operation: `${className}.${operationName}`,
        type: TraceType.MICROSERVICE,
        tags: options.tags || [],
        links: parentSpanId
          ? [{ traceId, spanId: parentSpanId, type: TraceLinkType.CHILD_OF }]
          : [],
      };

      // Loggear request si está configurado
      if (options.logRequest !== false && config.logLevel !== 'ERROR') {
        trace.body = sanitizeData(args, { maxBodySize: config.maxBodySize }) as Record<string, unknown> | undefined;
      }

      try {
        const result = await originalMethod.apply(this, args);

        // Success
        trace.duration = Date.now() - startTime;

        if (options.logResponse && config.logLevel !== 'ERROR') {
          trace.response = sanitizeData(result, {
            maxBodySize: config.maxBodySize,
          }) as Record<string, unknown> | undefined;
        }

        persistTrace(trace);

        return result;
      } catch (error: unknown) {
      // Error
        trace.duration = Date.now() - startTime;
        const errCode = error && typeof error === 'object' && 'code' in error ? (error as { code: unknown }).code : undefined;
        trace.error = {
          name: (error instanceof Error ? error.name : "Error"),
          message: (error instanceof Error ? error.message : String(error)),
          stack: config.includeStackTrace ? (error instanceof Error ? error.stack : undefined) : undefined,
          code: errCode ? String(errCode) : undefined,
        };

        persistTrace(trace);

        throw error;
      }
    };

    return descriptor;
  };
}

/**
 * Persiste un trace de forma asíncrona
 */
function persistTrace(trace: Trace): void {
  const config = getTracingConfig();

  if (config.persistAsync) {
    setImmediate(() => {
      saveTrace(trace).catch((error) => {
        console.error(`Failed to persist trace: ${(error instanceof Error ? error.message : String(error))}`);
      });
    });
  } else {
    saveTrace(trace).catch((error) => {
      console.error(`Failed to persist trace: ${(error instanceof Error ? error.message : String(error))}`);
    });
  }
}

/**
 * Guarda un trace (debe ser sobrescrito por cada servicio)
 */
async function saveTrace(trace: Trace): Promise<void> {
  if (getTracingConfig().logToConsole) {
    console.log(`[TRACE] ${JSON.stringify(trace)}`);
  }
}
