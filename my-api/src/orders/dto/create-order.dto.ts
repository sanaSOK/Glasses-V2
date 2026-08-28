import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  store_id: number;

  @ApiProperty({ example: '123 Main St, Apartment 4B, New York, NY 10001' })
  @IsNotEmpty()
  @IsString()
  shipping_address: string;

  @ApiProperty({ example: 1, required: false, description: 'Optional optical prescription ID' })
  @IsOptional()
  @IsNumber()
  prescription_id?: number;
}
