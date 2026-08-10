/**
 * Campos sensibles que deben ser sanitizados por defecto
 */
const DEFAULT_SENSITIVE_FIELDS = [
  'password',
  'token',
  'accessToken',
  'refreshToken',
  'apiKey',
  'secret',
  'creditCard',
  'cardNumber',
  'cvv',
  'ssn',
  'socialSecurityNumber',
  'pin',
  'authorization',
  'bearer',
];

/**
 * Configuración del sanitizer
 */
interface SanitizerConfig {
  sensitiveFields?: string[];
  maxBodySize?: number;
  maskChar?: string;
}

/**
 * Sanitiza datos sensibles de un objeto
 */
export function sanitizeData(
  data: unknown,
  config: SanitizerConfig = {},
): unknown {
  const {
    sensitiveFields = DEFAULT_SENSITIVE_FIELDS,
    maxBodySize = 1024 * 10, // 10KB por defecto
    maskChar = '***',
  } = config;

  if (!data) return data;

  // Si es string y es muy largo, truncar
  if (typeof data === 'string') {
    return data.length > maxBodySize
      ? data.substring(0, maxBodySize) + '...'
      : data;
  }

  // Si es primitivo, retornar tal cual
  if (typeof data !== 'object') return data;

  // Si es array, sanitizar cada elemento
  if (Array.isArray(data)) {
    return data.map((item) => sanitizeData(item, config));
  }

  // Si es objeto, sanitizar campos sensibles
  const sanitized: Record<string, unknown> = {};
  const dataRecord = data as Record<string, unknown>;

  for (const key in dataRecord) {
    if (Object.prototype.hasOwnProperty.call(dataRecord, key)) {
      const lowerKey = key.toLowerCase();
      const isSensitive = sensitiveFields.some((field) =>
        lowerKey.includes(field.toLowerCase()),
      );

      if (isSensitive) {
        sanitized[key] = maskChar;
      } else {
        sanitized[key] = sanitizeData(dataRecord[key], config);
      }
    }
  }

  return sanitized;
}

/**
 * Sanitiza headers HTTP
 */
export function sanitizeHeaders(
  headers: Record<string, string>,
): Record<string, string> {
  const sensitiveHeaders = [
    'authorization',
    'cookie',
    'x-api-key',
    'x-auth-token',
  ];
  const sanitized: Record<string, string> = {};

  for (const key in headers) {
    if (Object.prototype.hasOwnProperty.call(headers, key)) {
      const lowerKey = key.toLowerCase();
      if (sensitiveHeaders.includes(lowerKey)) {
        sanitized[key] = '***';
      } else {
        sanitized[key] = headers[key];
      }
    }
  }

  return sanitized;
}

/**
 * Trunca un string si excede el tamaño máximo
 */
export function truncateString(str: string, maxSize: number): string {
  if (!str || str.length <= maxSize) return str;
  return str.substring(0, maxSize) + '...';
}

/**
 * Convierte un objeto a string de forma segura
 */
export function safeStringify(
  data: unknown,
  maxSize: number = 1024 * 10,
): string {
  try {
    const str = JSON.stringify(data);
    return truncateString(str, maxSize);
  } catch (error) {
    return '[Unable to stringify]';
  }
}
