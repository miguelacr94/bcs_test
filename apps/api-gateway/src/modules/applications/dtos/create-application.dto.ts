import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class CreateApplicationDto {
  @ApiProperty({
    description: 'ID del cliente solicitante (generalmente se toma del token JWT, pero se incluye aquí para flexibilidad si es llamado por un admin)',
    example: '64a7f9b8e4b0f5a1c2d3e4f5',
  })
  @IsNotEmpty({ message: 'El ID del cliente es obligatorio' })
  @IsString({ message: 'El ID del cliente debe ser una cadena de texto' })
  clientId!: string;

  @ApiProperty({
    description: 'Canal por el cual se origina la solicitud',
    example: 'Autogestionado',
    enum: ['Autogestionado', 'Asistido', 'Sucursal'],
  })
  @IsNotEmpty({ message: 'El canal es obligatorio' })
  @IsString({ message: 'El canal debe ser una cadena de texto' })
  @IsIn(['Autogestionado', 'Asistido', 'Sucursal'], { message: 'El canal debe ser uno de los siguientes valores: Autogestionado, Asistido, Sucursal' })
  channel!: string;
}
