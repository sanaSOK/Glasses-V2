import { IsOptional, IsString, IsNumber, IsEnum, IsArray, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../../common/enums/gender.enum';

export class UpdateProductDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  store_id?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  category_id?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discount_price?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  frame_shape?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  frame_material?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  frame_color?: string;

  @ApiProperty({ enum: Gender, required: false })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  lens_type?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  images?: string[];
}
