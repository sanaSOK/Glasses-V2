import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  store_id?: number;

  @ApiProperty({ example: 'Prescription Glasses' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'prescription-glasses', required: false })
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
  image?: string;
}
