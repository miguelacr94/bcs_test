export const ENCRYPTION_PORT = Symbol('ENCRYPTION_PORT');

export interface EncryptionPort {
  encrypt(text: string): string;
  decrypt(cipherText: string): string;
  encryptId(id: string): string;
  decryptId(cipherId: string): string;
  hash(text: string): string;
}
