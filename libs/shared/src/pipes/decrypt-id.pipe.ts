import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { AesEncryptionAdapter } from '../adapters/aes-encryption.adapter';

@Injectable()
export class DecryptIdPipe implements PipeTransform<string, string> {
  private cryptoAdapter = new AesEncryptionAdapter();

  transform(value: string): string {
    if (!value) {
      throw new BadRequestException('ID es requerido');
    }

    const decryptedId = this.cryptoAdapter.decryptId(value);

    if (!isValidObjectId(decryptedId)) {
      throw new BadRequestException(`El ID enviado (${value}) no pudo ser procesado o es inválido.`);
    }

    return decryptedId;
  }
}
