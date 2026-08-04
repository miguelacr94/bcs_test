import { randomUUID } from 'crypto';

/**
 * Genera un nuevo Trace ID único
 */
export function generateTraceId(): string {
  return randomUUID();
}

/**
 * Genera un nuevo Span ID único
 */
export function generateSpanId(): string {
  return randomUUID();
}

/**
 * Extrae el Trace ID de los headers HTTP
 */
export function extractTraceIdFromHeaders(
  headers: Record<string, string>,
): string | undefined {
  return headers['x-trace-id'] || headers['x-request-id'] || undefined;
}

/**
 * Extrae el Span ID de los headers HTTP
 */
export function extractSpanIdFromHeaders(
  headers: Record<string, string>,
): string | undefined {
  return headers['x-span-id'] || undefined;
}

/**
 * Extrae el Parent Span ID de los headers HTTP
 */
export function extractParentSpanIdFromHeaders(
  headers: Record<string, string>,
): string | undefined {
  return headers['x-parent-span-id'] || undefined;
}
