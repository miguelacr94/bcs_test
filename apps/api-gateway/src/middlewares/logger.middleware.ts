import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const userAgent = req.get('user-agent') || 'Desconocido';

    console.log(`\n[MIDDLEWARE] 🌐 Petición Entrante: ${method} ${originalUrl} - Agente: ${userAgent}`);

    // next() es crucial. Si no lo llamas, la petición se queda "colgada" aquí y nunca llega al controlador.
    next();
  }
}
