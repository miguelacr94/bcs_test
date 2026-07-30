import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserProfileDto {
  @ApiProperty({
    description: 'Nuevo nombre del usuario (opcional)',
    example: 'Miguel Acr Actualizado',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres.' })
  readonly name?: string;
}
