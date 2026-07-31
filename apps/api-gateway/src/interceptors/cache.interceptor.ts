import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  // Diccionario en memoria: { '/api/productos': { expiresAt: 12345, data: [...] } }
  private cache = new Map<string, { expiresAt: number; data: any }>();
  private readonly TTL_SECONDS = 10; // Tiempo de vida de la caché (10 segundos)

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    // Solo cacheamos peticiones GET
    if (request.method !== 'GET') {
      return next.handle();
    }

    const cacheKey = request.originalUrl;
    const cachedResponse = this.cache.get(cacheKey);
    const now = Date.now();

    // Si existe en caché y aún no expira, lo devolvemos MÁGICAMENTE al instante
    if (cachedResponse && cachedResponse.expiresAt > now) {
      console.log(
        `[CACHE] ⚡ Devolviendo respuesta cacheada para: ${cacheKey}`,
      );
      return of(cachedResponse.data);
    }

    // Si no existe, dejamos pasar la petición y atrapamos la respuesta a la salida
    return next.handle().pipe(
      tap((responseData) => {
        console.log(
          `[CACHE] 💾 Guardando nueva respuesta en caché para: ${cacheKey}`,
        );
        this.cache.set(cacheKey, {
          expiresAt: now + this.TTL_SECONDS * 1000,
          data: responseData,
        });
      }),
    );
  }
}
