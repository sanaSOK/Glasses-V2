import { IsNotEmpty, IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DiscountType } from '../../common/enums/discount-type.enum';

export class CreatePromotionDto {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  store_id?: number;

  @ApiProperty({ example: 'Summer Glasses Special Sale' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: DiscountType, default: DiscountType.PERCENTAGE })
  @IsEnum(DiscountType)
  discount_type: DiscountType;

  @ApiProperty({ example: 20 })
  @IsNotEmpty()
  @IsNumber()
  discount_value: number;

  @ApiProperty({ required: false })
  @IsOptional()
  start_date?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  end_date?: Date;
}
