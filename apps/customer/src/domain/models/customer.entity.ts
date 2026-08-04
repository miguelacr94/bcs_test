export class Customer {
  constructor(
    public readonly id: string,
    public name: string,
    public lastName: string,
    public document: string,
    public email: string,
    public phone: string,
    public createdAt?: Date,
    public updatedAt?: Date,
    public familyReference1?: {
      name: string;
      phone: string;
      relationship: string;
    },
  ) {}
}
