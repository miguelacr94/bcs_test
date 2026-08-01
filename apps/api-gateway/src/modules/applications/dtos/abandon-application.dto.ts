import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AbandonApplicationDto {
  @ApiProperty({
    description: 'Motivo por el cual se abandona o rechaza la solicitud',
    example: 'El cliente encontró una mejor tasa en otra entidad.',
  })
  @IsNotEmpty()
  @IsString()
  reason!: string;
}
