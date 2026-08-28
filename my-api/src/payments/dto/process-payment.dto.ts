import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '../../common/enums/payment-method.enum';

export class ProcessPaymentDto {
  @ApiProperty({ enum: PaymentMethod, default: PaymentMethod.CREDIT_CARD })
  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  payment_method: PaymentMethod;

  @ApiProperty({ example: 'TXN-99887766', required: false })
  @IsOptional()
  @IsString()
  transaction_id?: string;
}
