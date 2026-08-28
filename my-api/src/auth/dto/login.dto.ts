import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: '066737549', required: false })
  @IsOptional()
  @IsString()
  usernameOrPhone?: string;

  @ApiProperty({ example: '066737549', required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ example: 'superadmin@123', required: false })
  @IsOptional()
  @IsString()
  password?: string;
}
