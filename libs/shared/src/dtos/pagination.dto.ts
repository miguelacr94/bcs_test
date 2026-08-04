import { IsOptional, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {
  @ApiPropertyOptional({ description: 'Página actual', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Cantidad de elementos por página',
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Filtrar por clientId' })
  @IsOptional()
  clientId?: string;

  @ApiPropertyOptional({ description: 'Filtrar por estado' })
  @IsOptional()
  status?: string;
}
