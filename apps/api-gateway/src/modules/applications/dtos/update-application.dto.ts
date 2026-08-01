import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateApplicationDto {
  @ApiProperty({
    description: 'Ingresos mensuales actualizados del solicitante',
    example: '5000000',
    required: false,
  })
  @IsOptional()
  @IsString()
  monthlyIncome?: string;

  @ApiProperty({
    description: 'Ocupación o profesión actualizada',
    example: 'Ingeniero de Software',
    required: false,
  })
  @IsOptional()
  @IsString()
  occupation?: string;
}
