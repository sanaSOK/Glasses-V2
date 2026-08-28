import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { StoreAccessGuard } from '../common/guards/store-access.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';
import { ActiveUserData } from '../common/interfaces/active-user-data.interface';

@ApiTags('Reports & Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, StoreAccessGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @ApiOperation({ summary: 'Get global dashboard analytics (Super Admin)' })
  @Roles(Role.SUPER_ADMIN)
  @Get('super-admin')
  getSuperAdminOverview() {
    return this.reportsService.getSuperAdminOverview();
  }

  @ApiOperation({ summary: 'Get store dashboard analytics (Store Admin / Staff)' })
  @Roles(Role.SUPER_ADMIN, Role.STORE_ADMIN, Role.STAFF)
  @Get('store-admin')
  getStoreAdminOverview(@CurrentUser() user: ActiveUserData) {
    return this.reportsService.getStoreAdminOverview(user);
  }
}
