import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateProductDto {
  @ApiPropertyOptional({
    description: 'Nombre del producto',
    example: 'Laptop Gamer ASUS ROG Z',
  })
  @IsString()
  @IsOptional()
  readonly name?: string;

  @ApiPropertyOptional({
    description: 'Descripción del producto',
    example: 'Edición especial ASUS ROG...',
  })
  @IsString()
  @IsOptional()
  readonly description?: string;

  @ApiPropertyOptional({
    description: 'Precio unitario del producto',
    example: 1399.99,
    minimum: 0,
  })
  @IsNumber()
  @Min(0, { message: 'El precio no puede ser menor a 0.' })
  @IsOptional()
  readonly price?: number;

  @ApiPropertyOptional({
    description: 'Cantidad disponible en inventario (stock)',
    example: 20,
    minimum: 0,
  })
  @IsNumber()
  @Min(0, { message: 'El stock no puede ser menor a 0.' })
  @IsOptional()
  readonly stock?: number;

  @ApiPropertyOptional({
    description: 'Categoria del producto',
    example: 'Laptops',
  })
  @IsString()
  @IsOptional()
  readonly categoryId?: string;

  @ApiPropertyOptional({
    description: 'ID del producto',
    example: '23434-22423-e4234',
  })
  @IsString()
  @IsOptional()
  readonly id?: string;

  @ApiPropertyOptional({
    description: 'Estado del producto',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  readonly isActive?: boolean;
}
