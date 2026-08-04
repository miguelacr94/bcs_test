import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = exception.message || 'Error interno del servidor';

    if (exception.getStatus && typeof exception.getStatus === 'function') {
      status = exception.getStatus();
      const res = exception.getResponse();
      message = typeof res === 'object' ? res.message : res;
    } else if (exception.error) {
      message = exception.error;

      if (exception.statusCode) {
        status = exception.statusCode;
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
