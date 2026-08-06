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
  private cache = new Map<string, { expiresAt: number; data: unknown }>();
  private readonly TTL_SECONDS = 10;

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;

    if (method !== 'GET') {
      return next.handle().pipe(
        tap(() => {
          const pathParts = request.originalUrl.split('/');
          const idIndex = pathParts.findIndex((p: string) =>
            /^[a-f0-9]{24}$/.test(p),
          );
          if (idIndex !== -1) {
            const resourceId = pathParts[idIndex];
            for (const key of this.cache.keys()) {
              if (key.includes(resourceId)) {
                this.cache.delete(key);
                console.log(`[CACHE] 🗑️  Caché invalidado para: ${key}`);
              }
            }
          }
        }),
      );
    }

    const cacheKey = request.originalUrl;
    const cachedResponse = this.cache.get(cacheKey);
    const now = Date.now();

    if (cachedResponse && cachedResponse.expiresAt > now) {
      console.log(
        `[CACHE] ⚡ Devolviendo respuesta cacheada para: ${cacheKey}`,
      );
      return of(cachedResponse.data);
    }

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
