export interface TokenServicePort {
  generateToken(
    payload: Record<string, unknown>,
    options?: Record<string, unknown>,
  ): Promise<string>;
  verifyToken(token: string): Promise<unknown>;
}
