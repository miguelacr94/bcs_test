import { AesEncryptionAdapter } from './aes-encryption.adapter';

describe('AesEncryptionAdapter', () => {
  let adapter: AesEncryptionAdapter;

  beforeEach(() => {
    adapter = new AesEncryptionAdapter();
  });

  describe('Document / Text Encryption', () => {
    it('should encrypt and decrypt a document number correctly', () => {
      const originalDocument = '1020304050';
      const encrypted = adapter.encrypt(originalDocument);

      expect(encrypted).not.toEqual(originalDocument);
      expect(encrypted.split(':').length).toBe(3);

      const decrypted = adapter.decrypt(encrypted);
      expect(decrypted).toBe(originalDocument);
    });

    it('should return original text if format is not encrypted', () => {
      const plainText = '1020304050';
      expect(adapter.decrypt(plainText)).toBe(plainText);
    });
  });

  describe('ID Encryption', () => {
    it('should encrypt and decrypt a Mongo ObjectId into a URL-safe string', () => {
      const mongoId = '65f123456789abcdef012345';
      const encryptedId = adapter.encryptId(mongoId);

      expect(encryptedId).not.toEqual(mongoId);
      // Validar que sea un string base64url sin caracteres inválidos de URL
      expect(encryptedId).not.toContain('+');
      expect(encryptedId).not.toContain('/');

      const decryptedId = adapter.decryptId(encryptedId);
      expect(decryptedId).toBe(mongoId);
    });

    it('should return original string if decrypting an unencrypted 24-character Mongo ID', () => {
      const mongoId = '65f123456789abcdef012345';
      expect(adapter.decryptId(mongoId)).toBe(mongoId);
    });
  });
});
