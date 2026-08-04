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
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const TIMEOUT_MS = 3000;
    const RETRIES = 1;

    return next.handle().pipe(
      retry(RETRIES),
      timeout(TIMEOUT_MS),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          throw new RequestTimeoutException(
            'El microservicio tardó demasiado en responder. Inténtalo más tarde.',
          );
        }
        throw err;
      }),
    );
  }
}
