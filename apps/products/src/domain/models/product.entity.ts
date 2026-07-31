import { DomainException } from '@app/shared/exceptions/domain.exception';

export class Product {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly price: number,
    public readonly stock: number,
    public readonly categoryId: string,
    public isActive: boolean,
    public readonly createdAt: Date,
  ) {
    this.validateName();
    this.validatePrice();
    this.validateStock();
  }

  // Regla de negocio: El nombre no puede estar vacío
  private validateName(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new DomainException('El nombre del producto no puede estar vacío.');
    }

    if (this.name.length < 3) {
      throw new DomainException(
        'El nombre del producto debe tener al menos 3 caracteres.',
      );
    }
  }

  // Regla de negocio: El precio debe ser mayor o igual a 0
  private validatePrice(): void {
    if (this.price < 0) {
      throw new DomainException(
        'El precio del producto no puede ser menor a 0.',
      );
    }
  }

  // Regla de negocio: El stock debe ser mayor o igual a 0
  private validateStock(): void {
    if (this.stock < 0) {
      throw new DomainException(
        'El inventario (stock) del producto no puede ser negativo.',
      );
    }
  }

  public deactivate(): void {
    this.isActive = false;
  }

  public activate(): void {
    this.isActive = true;
  }
}
