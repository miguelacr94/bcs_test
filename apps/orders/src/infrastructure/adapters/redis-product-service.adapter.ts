import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ProductServicePort } from '../../domain/ports/product-service.port';
import { ProductPattern } from '@app/shared/enums';

@Injectable()
export class RedisProductServiceAdapter implements ProductServicePort {
  constructor(
    @Inject('PRODUCTS_SERVICE') private readonly productsClient: ClientProxy,
  ) {}

  async reduceStock(
    items: { productId: string; quantity: number }[],
  ): Promise<boolean> {
    try {
      const result = await firstValueFrom(
        this.productsClient.send(
          { cmd: ProductPattern.REDUCE_STOCK },
          { items },
        ),
      );
      return result;
    } catch (error) {
      throw error;
    }
  }

  async restoreStock(
    items: { productId: string; quantity: number }[],
  ): Promise<boolean> {
    try {
      const result = await firstValueFrom(
        this.productsClient.send(
          { cmd: ProductPattern.RESTORE_STOCK },
          { items },
        ),
      );
      return result;
    } catch (error) {
      console.error(
        'ERROR CRÍTICO: Falló la compensación de la Saga. Posible inconsistencia de datos.',
      );
      throw error;
    }
  }
}
