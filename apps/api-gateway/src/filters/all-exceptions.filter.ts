import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

interface ExceptionPayload {
  message?: string;
  error?: string;
  statusCode?: number;
  code?: number;
  getStatus?: () => number;
  getResponse?: () => string | { message: string };
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const exc = exception as ExceptionPayload;

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = exc.message || 'Error interno del servidor';

    if (exc.getStatus && typeof exc.getStatus === 'function') {
      status = exc.getStatus();
      const res = exc.getResponse ? exc.getResponse() : null;
      message = typeof res === 'object' && res !== null ? res.message : String(res);
    } else if (exc.code) {
      // Mapeo de códigos de error de negocio a HTTP status
      if (exc.code === 4001) {
        status = HttpStatus.NOT_FOUND;
      } else if (exc.code >= 4000 && exc.code < 5000) {
        status = HttpStatus.BAD_REQUEST;
      }
    } else if (exc.error) {
      message = exc.error;

      if (exc.statusCode) {
        status = exc.statusCode;
      } else {
        if (message.includes('registrado') || message.includes('existe')) {
          status = HttpStatus.CONFLICT;
        } else if (
          message.includes('inválidas') ||
          message.includes('incorrecto') ||
          message.includes('expirado')
        ) {
          status = HttpStatus.UNAUTHORIZED;
        } else if (
          message.includes('No puedes') ||
          message.includes('No se puede') ||
          message.includes('no encontrada')
        ) {
          status = HttpStatus.BAD_REQUEST;
        } else {
          status = HttpStatus.BAD_REQUEST;
        }
      }
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: Array.isArray(message) ? message : [message],
    });
  }
}
