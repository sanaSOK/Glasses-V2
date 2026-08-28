import { Controller, Get, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { StoreAccessGuard } from '../common/guards/store-access.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';
import { ActiveUserData } from '../common/interfaces/active-user-data.interface';

@ApiTags('Customers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, StoreAccessGuard)
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @ApiOperation({ summary: 'List store customers' })
  @Roles(Role.SUPER_ADMIN, Role.STORE_ADMIN, Role.STAFF)
  @Get()
  findAll(@CurrentUser() currentUser: ActiveUserData) {
    return this.customersService.findAll(currentUser);
  }

  @ApiOperation({ summary: 'Get customer details by ID' })
  @Roles(Role.SUPER_ADMIN, Role.STORE_ADMIN, Role.STAFF, Role.CUSTOMER)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() currentUser: ActiveUserData) {
    return this.customersService.findOne(id, currentUser);
  }
}
