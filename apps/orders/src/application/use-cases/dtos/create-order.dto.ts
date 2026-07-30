import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsString, Min, ValidateNested } from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty({
    description: 'ID del producto a comprar',
    example: '64b2a123...',
  })
  @IsString()
  @IsNotEmpty({ message: 'El ID del producto es obligatorio.' })
  readonly productId!: string;

  @ApiProperty({
    description: 'Cantidad de unidades a comprar',
    example: 2,
    minimum: 1,
  })
  @IsNumber()
  @Min(1, { message: 'La cantidad debe ser de al menos 1 unidad.' })
  readonly quantity!: number;

  @ApiProperty({
    description: 'Precio unitario del producto',
    example: 1299.99,
    minimum: 0,
  })
  @IsNumber()
  @Min(0, { message: 'El precio no puede ser negativo.' })
  readonly price!: number;
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'Lista de ítems incluidos en la orden de compra',
    type: [CreateOrderItemDto],
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'La orden debe contener al menos un producto.' })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  readonly items!: CreateOrderItemDto[];
}
