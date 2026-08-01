import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive, Min } from 'class-validator';

export class SimulateOfferDto {
  @ApiProperty({
    description: 'Monto solicitado',
    example: 5000000,
  })
  @IsNumber()
  @IsPositive()
  amount!: number;

  @ApiProperty({
    description: 'Plazo en meses',
    example: 36,
  })
  @IsNumber()
  @Min(1)
  termMonths!: number;
}
