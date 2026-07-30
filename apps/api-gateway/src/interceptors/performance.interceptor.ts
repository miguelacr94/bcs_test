import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const methodName = context.getHandler().name;
    const className = context.getClass().name;
    
    // Inicia el cronómetro ANTES de que el controlador empiece a trabajar
    const now = Date.now();

    return next
      .handle() // Aquí cedemos el control al Controlador (ej. OrdersController)
      .pipe(
        // 'tap' se ejecuta DESPUÉS de que el controlador terminó su trabajo y devolvió datos
        tap(() => {
          const executionTime = Date.now() - now;
          console.log(`[INTERCEPTOR] ⏱️ Ejecución de ${className}.${methodName}() tomó: ${executionTime}ms`);
        }),
      );
  }
}
