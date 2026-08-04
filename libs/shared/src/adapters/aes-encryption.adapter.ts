import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { EncryptionPort } from '../ports/encryption.port';

@Injectable()
export class AesEncryptionAdapter implements EncryptionPort {
  private readonly algorithm = 'aes-256-gcm';
  private readonly key: Buffer;
  private readonly idKey: Buffer;

  constructor() {
    const envSecret =
      process.env.ENCRYPTION_SECRET || 'bcs-secure-default-secret-key-32b!';
    const envIdSecret =
      process.env.ID_ENCRYPTION_SECRET || 'bcs-secure-id-secret-key-32bytes!';
    this.key = crypto.scryptSync(envSecret, 'salt', 32);
    this.idKey = crypto.scryptSync(envIdSecret, 'idSalt', 32);
  }

  /**
   * Encripta un texto sensible (ej. documento de identidad) utilizando AES-256-GCM.
   * Formato retornado: "iv:authTag:encryptedData" en hex.
   */
  encrypt(text: string): string {
    if (!text) return text;
    // Si ya está en formato encriptado (dos dos puntos en hex), evitar re-encriptar
    if (this.isEncrypted(text)) return text;

    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');

    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
  }

  /**
   * Desencripta un texto cifrado. Si no está encriptado o falla la desencriptación, retorna el texto original.
   */
  decrypt(cipherText: string): string {
    if (!cipherText || typeof cipherText !== 'string') return cipherText;

    const parts = cipherText.split(':');
    if (parts.length !== 3) {
      return cipherText; // No es un cifrado válido de nuestro formato
    }

    try {
      const [ivHex, authTagHex, encryptedHex] = parts;
      const iv = Buffer.from(ivHex, 'hex');
      const authTag = Buffer.from(authTagHex, 'hex');
      const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);

      decipher.setAuthTag(authTag);
      let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch {
      return cipherText;
    }
  }

  /**
   * Encripta un ID (ej. ObjectId de MongoDB) produciendo un string seguro para URLs (base64url).
   */
  encryptId(id: string): string {
    if (!id || typeof id !== 'string') return id;

    try {
      const iv = crypto.randomBytes(12);
      const cipher = crypto.createCipheriv(this.algorithm, this.idKey, iv);

      const encryptedBuf = Buffer.concat([
        cipher.update(id, 'utf8'),
        cipher.final(),
      ]);
      const authTag = cipher.getAuthTag();

      // Combinar iv (12 bytes) + authTag (16 bytes) + encrypted
      const combined = Buffer.concat([iv, authTag, encryptedBuf]);
      return combined.toString('base64url');
    } catch {
      return id;
    }
  }

  /**
   * Desencripta un ID que viene del frontend (base64url). Si falla o es un ObjectId puro de 24 hex chars, lo retorna.
   */
  decryptId(cipherId: string): string {
    if (!cipherId || typeof cipherId !== 'string') return cipherId;

    // Si ya parece un Mongo ObjectId directo (24 caracteres hex)
    if (/^[0-9a-fA-F]{24}$/.test(cipherId)) {
      return cipherId;
    }

    try {
      const combined = Buffer.from(cipherId, 'base64url');
      if (combined.length < 28) {
        // 12 iv + 16 authTag = 28 bytes mínimo
        return cipherId;
      }

      const iv = combined.subarray(0, 12);
      const authTag = combined.subarray(12, 28);
      const encrypted = combined.subarray(28);

      const decipher = crypto.createDecipheriv(this.algorithm, this.idKey, iv);
      decipher.setAuthTag(authTag);

      let decrypted = decipher.update(encrypted, undefined, 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch {
      return cipherId;
    }
  }

  /**
   * Genera un hash determinístico (HMAC-SHA256) de un texto.
   * Se usa para búsquedas por igualdad (ej. buscar cliente por documento).
   * A diferencia de encrypt(), siempre produce el mismo resultado para la misma entrada.
   */
  hash(text: string): string {
    if (!text) return text;
    return crypto.createHmac('sha256', this.key).update(text).digest('hex');
  }

  private isEncrypted(text: string): boolean {
    const parts = text.split(':');
    return (
      parts.length === 3 && parts[0].length === 24 && parts[1].length === 32
    );
  }
}
