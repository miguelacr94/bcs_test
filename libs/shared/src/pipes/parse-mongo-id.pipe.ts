import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
@Injectable()
export class ParseMongoIdPipe implements PipeTransform<string> {
  transform(value: string) {
    // 1. Verificamos si el valor NO es un ID válido de Mongo
    if (!isValidObjectId(value)) {
      throw new BadRequestException(`El ID enviado (${value}) no es válido.`);
    }
    // 2. Si es válido, lo dejamos pasar
    return value;
  }
}
