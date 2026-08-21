import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AesEncryptionAdapter } from '../adapters/aes-encryption.adapter';

@Injectable()
export class EncryptIdInterceptor implements NestInterceptor {
  private readonly cryptoAdapter = new AesEncryptionAdapter();

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();

    // 1. Desencriptar IDs recibidos en el Body, Params o Query
    if (request) {
      if (request.body) {
        request.body = this.decryptObjectIds(request.body);
      }
      if (request.params && request.params.id) {
        request.params.id = this.cryptoAdapter.decryptId(request.params.id);
      }
      if (request.query && request.query.id) {
        request.query.id = this.cryptoAdapter.decryptId(
          request.query.id as string,
        );
      }
    }

    // 2. Encriptar IDs en la respuesta devuelta al frontend
    return next.handle().pipe(map((data) => this.encryptObjectIds(data)));
  }

  private decryptObjectIds(obj: unknown): unknown {
    if (!obj || typeof obj !== 'object') return obj;

    if (Array.isArray(obj)) {
      return obj.map((item) => this.decryptObjectIds(item));
    }

    const newObj: Record<string, unknown> = {
      ...(obj as Record<string, unknown>),
    };
    for (const key of Object.keys(newObj)) {
      if (
        (key === 'id' ||
          key === '_id' ||
          key === 'applicationId' ||
          key === 'activeApplicationId' ||
          key === 'clientId' ||
          key === 'document') &&
        typeof newObj[key] === 'string'
      ) {
        newObj[key] = this.cryptoAdapter.decryptId(newObj[key]);
      } else if (typeof newObj[key] === 'object' && newObj[key] !== null) {
        newObj[key] = this.decryptObjectIds(newObj[key]);
      }
    }
    return newObj;
  }

  private encryptObjectIds(obj: unknown): unknown {
    if (!obj || typeof obj !== 'object') return obj;

    if (Array.isArray(obj)) {
      return obj.map((item) => this.encryptObjectIds(item));
    }

    // Preservar instancias de Date, RegExp, etc.
    if (obj instanceof Date || obj instanceof RegExp) return obj;

    const newObj: Record<string, unknown> = {
      ...(obj as Record<string, unknown>),
    };
    for (const key of Object.keys(newObj)) {
      if (
        (key === 'id' ||
          key === '_id' ||
          key === 'applicationId' ||
          key === 'activeApplicationId' ||
          key === 'clientId' ||
          key === 'document') &&
        typeof newObj[key] === 'string'
      ) {
        newObj[key] = this.cryptoAdapter.encryptId(newObj[key]);
      } else if (typeof newObj[key] === 'object' && newObj[key] !== null) {
        newObj[key] = this.encryptObjectIds(newObj[key]);
      }
    }
    return newObj;
  }
}
