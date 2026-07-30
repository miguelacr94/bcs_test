export interface TokenServicePort {
  generateToken(payload: any, options?: any): Promise<string>;
  verifyToken(token: string): Promise<any>;
}
