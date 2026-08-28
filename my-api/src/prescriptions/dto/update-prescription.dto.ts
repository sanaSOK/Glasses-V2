import { IsOptional, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePrescriptionDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  right_sphere?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  right_cylinder?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  right_axis?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  left_sphere?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  left_cylinder?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  left_axis?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  pd?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  prescription_image?: string;
}
