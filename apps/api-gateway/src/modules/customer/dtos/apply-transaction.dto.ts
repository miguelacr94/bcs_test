import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional } from 'class-validator';
import { CreateCustomerDto } from './create-customer.dto';

export class ApplyTransactionDto {
  @ApiProperty({ type: CreateCustomerDto })
  @IsObject()
  @IsNotEmpty()
  customerData!: CreateCustomerDto;

  @ApiProperty({
    example: {
      success: true,
      message: 'Oferta pre-aprobada disponible',
      offerDetails: {
        approvedAmount: 50000000,
        interestRate: 1.45,
        termMonths: 36,
      },
    },
  })
  @IsObject()
  @IsOptional()
  offerResult!: Record<string, unknown>;
}
