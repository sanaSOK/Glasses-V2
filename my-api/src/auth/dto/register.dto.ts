import { IsNotEmpty, IsOptional, IsString, MinLength, IsEnum, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../common/enums/role.enum';

export class RegisterDto {
  @ApiProperty({ example: 'username_or_phone', required: false })
  @IsOptional()
  @IsString()
  usernameOrPhone?: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'BrightEyes Optical Boutique', required: false })
  @IsOptional()
  @IsString()
  storeName?: string;

  @ApiProperty({ example: '123 Main St, New York, NY', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'John Doe', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'john@example.com', required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ example: '+1234567890', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  store_id?: number;

  @ApiProperty({ enum: Role, default: Role.CUSTOMER, required: false })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
