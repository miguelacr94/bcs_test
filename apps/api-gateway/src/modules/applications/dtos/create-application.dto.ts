import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsIn,
  IsObject,
  IsOptional,
} from 'class-validator';

export class CreateApplicationDto {
  @ApiProperty({
    description: 'ID del cliente solicitante (ObjectId) o Número de Documento',
    example: '111111111',
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
  @IsIn(['Autogestionado', 'Asistido', 'Sucursal'], {
    message:
      'El canal debe ser uno de los siguientes valores: Autogestionado, Asistido, Sucursal',
  })
  channel!: string;

  @ApiPropertyOptional({
    description: 'Resultado de la evaluación de oferta',
    example: { type: 'EXITOSO', success: true, offerDetails: {} },
  })
  @IsOptional()
  @IsObject()
  offerResult?: Record<string, unknown>;
}
