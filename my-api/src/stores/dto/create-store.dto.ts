import { IsNotEmpty, IsOptional, IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStoreDto {
  @ApiProperty({ example: 'SANA Optical' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'sana-optical', required: false })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({ example: 'https://example.com/logo.png', required: false })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiProperty({ example: 'Premium prescription glasses store', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '+1 800 555 0199', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'contact@sanaoptical.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '123 Main St, New York, NY', required: false })
  @IsOptional()
  @IsString()
  address?: string;
}
