import { invalidEmails } from '@app/shared/enums';

export class Customer {
  constructor(
    public readonly id: string,
    public name: string,
    public lastName: string,
    public document: string,
    public email: string,
    public phone: string,
    public status: boolean,
    public createdAt?: Date,
    public updatedAt?: Date,
    public familyReference1?: {
      name: string;
      phone: string;
      relationship: string;
    },
  ) {}

  checkInvalidEmail(): void {
    const domain = this.email.split('@')[1]?.toLowerCase();

    if (domain && invalidEmails.includes(domain)) {
      throw new Error(
        'El correo electrónico provisto pertenece a un dominio temporal no permitido.',
      );
    }
  }
}
