import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AdjustStockDto {
  @ApiProperty({ example: 10, description: 'Positive number to add stock, negative to reduce' })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 'Stock shipment received', required: false })
  @IsOptional()
  @IsString()
  reason?: string;
}
