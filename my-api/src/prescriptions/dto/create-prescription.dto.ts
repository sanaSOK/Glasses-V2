import { IsOptional, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePrescriptionDto {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  store_id?: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  order_id?: number;

  @ApiProperty({ example: -2.5, required: false })
  @IsOptional()
  @IsNumber()
  right_sphere?: number;

  @ApiProperty({ example: -0.75, required: false })
  @IsOptional()
  @IsNumber()
  right_cylinder?: number;

  @ApiProperty({ example: 90, required: false })
  @IsOptional()
  @IsNumber()
  right_axis?: number;

  @ApiProperty({ example: -2.25, required: false })
  @IsOptional()
  @IsNumber()
  left_sphere?: number;

  @ApiProperty({ example: -0.5, required: false })
  @IsOptional()
  @IsNumber()
  left_cylinder?: number;

  @ApiProperty({ example: 85, required: false })
  @IsOptional()
  @IsNumber()
  left_axis?: number;

  @ApiProperty({ example: 63, required: false })
  @IsOptional()
  @IsNumber()
  pd?: number;

  @ApiProperty({ example: 'https://example.com/prescription.jpg', required: false })
  @IsOptional()
  @IsString()
  prescription_image?: string;
}
