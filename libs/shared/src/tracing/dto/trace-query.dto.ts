import { IsOptional, IsString, IsDateString } from 'class-validator';

export class TraceQueryDto {
  @IsOptional()
  @IsString()
  traceId?: string;

  @IsOptional()
  @IsString()
  service?: string;

  @IsOptional()
  @IsString()
  operation?: string;

  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @IsOptional()
  @IsString()
  userId?: string;
}
