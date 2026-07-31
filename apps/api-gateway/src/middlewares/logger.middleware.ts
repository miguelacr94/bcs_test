import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;

    // Registramos qué están pidiendo
    this.logger.log(`📥 Petición Entrante: ${method} ${originalUrl}`);

    // next() es VITAL. Si no lo llamas, la petición se queda colgada para siempre
    next();
  }
}
