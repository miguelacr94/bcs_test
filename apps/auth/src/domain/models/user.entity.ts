export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
    public readonly role: string,
    public readonly createdAt: Date,
    public readonly refreshToken?: string | null,
  ) {
    this.validateEmail();
    this.validatePassword();
  }

  // Regla de Negocio del Dominio: Validación de Email
  private validateEmail(): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      throw new Error(
        'El correo electrónico provisto no tiene un formato válido.',
      );
    }
  }

  // Regla de Negocio del Dominio: Validación de Contraseña
  private validatePassword(): void {
    if (!this.password || this.password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres.');
    }
  }
}
