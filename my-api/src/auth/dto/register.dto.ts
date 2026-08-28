import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, IsEnum, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../common/enums/role.enum';

export class RegisterDto {
  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

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
