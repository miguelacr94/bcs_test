import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest();
    const methodName = context.getHandler().name;
    const className = context.getClass().name;

    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const executionTime = Date.now() - now;
        console.log(
          `[INTERCEPTOR] ⏱️ Ejecución de ${className}.${methodName}() tomó: ${executionTime}ms`,
        );
      }),
    );
  }
}
