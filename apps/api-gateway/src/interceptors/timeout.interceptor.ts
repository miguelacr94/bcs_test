import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  RequestTimeoutException,
} from '@nestjs/common';
import { Observable, TimeoutError } from 'rxjs';
import { catchError, retry, timeout } from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Definimos el tiempo máximo de espera (ej. 3 segundos) y los reintentos
    const TIMEOUT_MS = 3000;
    const RETRIES = 1;

    return next.handle().pipe(
      // Si el microservicio falla (ej. red intermitente), reintenta automáticamente
      retry(RETRIES),
      
      // Si la petición tarda más de 3 segundos, aborta la conexión
      timeout(TIMEOUT_MS),
      
      // Si ocurre un error, atrapamos específicamente el TimeoutError de RxJS
      catchError((err) => {
        if (err instanceof TimeoutError) {
          throw new RequestTimeoutException('El microservicio tardó demasiado en responder. Inténtalo más tarde.');
        }
        // Si es otro tipo de error (ej. BadRequest de validación), lo dejamos pasar tal cual
        throw err;
      }),
    );
  }
}
