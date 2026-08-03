export interface TracingConfig {
  enabled: boolean;
  serviceName: string;
  sampleRate: number; // 0.0 a 1.0
  logLevel: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  sanitizeFields: string[];
  maxBodySize: number;
  persistAsync: boolean;
  includeStackTrace: boolean;
  logToConsole: boolean;
}

export const defaultTracingConfig: TracingConfig = {
  enabled: true,
  serviceName: 'unknown-service',
  sampleRate: 1.0,
  logLevel: 'INFO',
  sanitizeFields: [
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
  ],
  maxBodySize: 1024 * 10, // 10KB
  persistAsync: true,
  includeStackTrace: true,
  logToConsole: false,
};

let currentConfig: TracingConfig = { ...defaultTracingConfig };

/**
 * Configura el sistema de tracing
 */
export function configureTracing(config: Partial<TracingConfig>): void {
  currentConfig = { ...currentConfig, ...config };
}

/**
 * Obtiene la configuración actual de tracing
 */
export function getTracingConfig(): TracingConfig {
  return currentConfig;
}

/**
 * Determina si un trace debe ser sampleado
 */
export function shouldSample(): boolean {
  return Math.random() < currentConfig.sampleRate;
}
