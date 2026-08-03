export interface TraceOptions {
  operation?: string;
  tags?: string[];
  logRequest?: boolean;
  logResponse?: boolean;
  logError?: boolean;
  includeStackTrace?: boolean;
}
