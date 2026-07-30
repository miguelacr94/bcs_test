import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Laptop Gamer ASUS ROG',
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre del producto es obligatorio.' })
  readonly name!: string;

  @ApiProperty({
    description: 'Descripción detallada del producto',
    example:
      'Laptop ASUS ROG con pantalla 144Hz, Ryzen 7, 16GB RAM, 512GB SSD y RTX 4060.',
  })
  @IsString()
  @IsNotEmpty({ message: 'La descripción del producto es obligatoria.' })
  readonly description!: string;

  @ApiProperty({
    description: 'Precio unitario del producto',
    example: 1299.99,
    minimum: 0,
  })
  @IsNumber()
  @Min(0, { message: 'El precio no puede ser menor a 0.' })
  readonly price!: number;

  @ApiProperty({
    description: 'Cantidad disponible en inventario (stock)',
    example: 15,
    minimum: 0,
  })
  @IsNumber()
  @Min(0, { message: 'El stock no puede ser menor a 0.' })
  readonly stock!: number;

  @ApiProperty({
    description: 'Categoria del producto',
    example: 'Laptops',
  })
  @IsString()
  @IsNotEmpty({ message: 'La categoria del producto es obligatoria.' })
  readonly categoryId!: string;

  @ApiProperty({
    description: 'Estado del producto',
    example: true,
  })
  @IsBoolean()
  readonly isActive: boolean = true;
}
