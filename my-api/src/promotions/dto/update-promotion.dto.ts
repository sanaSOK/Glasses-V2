import { IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DiscountType } from '../../common/enums/discount-type.enum';

export class UpdatePromotionDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: DiscountType, required: false })
  @IsOptional()
  @IsEnum(DiscountType)
  discount_type?: DiscountType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  discount_value?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  start_date?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  end_date?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  status?: string;
}
