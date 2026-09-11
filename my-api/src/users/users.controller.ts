import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { StoreAccessGuard } from '../common/guards/store-access.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';
import { ActiveUserData } from '../common/interfaces/active-user-data.interface';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, StoreAccessGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create user/admin (Super Admin can create Store Admins)' })
  @Roles(Role.SUPER_ADMIN, Role.STORE_ADMIN)
  @Post()
  create(@Body() dto: CreateUserDto, @CurrentUser() currentUser: ActiveUserData) {
    return this.usersService.create(dto, currentUser);
  }

  @ApiOperation({ summary: 'Get all users/admins (Super Admin sees all Admins across all stores)' })
  @Roles(Role.SUPER_ADMIN, Role.STORE_ADMIN)
  @Get()
  findAll(@CurrentUser() currentUser: ActiveUserData) {
    return this.usersService.findAll(currentUser);
  }

  @ApiOperation({ summary: 'Get user/admin details by ID' })
  @Roles(Role.SUPER_ADMIN, Role.STORE_ADMIN)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() currentUser: ActiveUserData) {
    return this.usersService.findOne(id, currentUser);
  }

  @ApiOperation({ summary: 'Update user/admin details, status, or role (Super Admin authority)' })
  @Roles(Role.SUPER_ADMIN, Role.STORE_ADMIN)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
    @CurrentUser() currentUser: ActiveUserData,
  ) {
    return this.usersService.update(id, dto, currentUser);
  }

  @ApiOperation({ summary: 'Delete user/admin account (Super Admin authority)' })
  @Roles(Role.SUPER_ADMIN, Role.STORE_ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() currentUser: ActiveUserData) {
    return this.usersService.remove(id, currentUser);
  }
}
