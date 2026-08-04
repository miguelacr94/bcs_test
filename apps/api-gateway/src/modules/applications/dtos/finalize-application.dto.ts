import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FinalizeApplicationDto {
  @ApiProperty({
    description: 'ID de la solicitud',
    example: '60d5ecb8b392d7001f112233',
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'Indica si la finalización incluye un desembolso',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  withDisbursement: boolean;

  @ApiProperty({
    description: 'Canal por el cual se finaliza',
    example: 'Oficina',
    required: false,
  })
  @IsString()
  @IsOptional()
  channel?: string;

  @ApiProperty({
    description: 'Razón de la finalización o comentarios adicionales',
    example: 'Finalización aprobada por comité',
    required: false,
  })
  @IsString()
  @IsOptional()
  reason?: string;
}
