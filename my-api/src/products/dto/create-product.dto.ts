import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
  IsArray,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../../common/enums/gender.enum';

export class CreateProductDto {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  store_id?: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  category_id: number;

  @ApiProperty({ example: 'Aviator Classic Round Glasses' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Ray-Ban' })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiProperty({ example: 149.99 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 119.99, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discount_price?: number;

  @ApiProperty({ example: 25, default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  stock?: number;

  @ApiProperty({ example: 'RB-3025-001', required: false })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty({ example: 'Round' })
  @IsOptional()
  @IsString()
  frame_shape?: string;

  @ApiProperty({ example: 'Titanium' })
  @IsOptional()
  @IsString()
  frame_material?: string;

  @ApiProperty({ example: 'Gold' })
  @IsOptional()
  @IsString()
  frame_color?: string;

  @ApiProperty({ enum: Gender, default: Gender.UNISEX })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiProperty({ example: 'Single Vision Anti-Reflective' })
  @IsOptional()
  @IsString()
  lens_type?: string;

  @ApiProperty({ example: ['https://example.com/glasses1.jpg'], required: false })
  @IsOptional()
  @IsArray()
  images?: string[];
}
