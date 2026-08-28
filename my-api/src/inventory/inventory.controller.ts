import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { AdjustStockDto } from './dto/adjust-stock.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { StoreAccessGuard } from '../common/guards/store-access.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';
import { ActiveUserData } from '../common/interfaces/active-user-data.interface';

@ApiTags('Inventory')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, StoreAccessGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @ApiOperation({ summary: 'Adjust product stock quantity' })
  @Roles(Role.SUPER_ADMIN, Role.STORE_ADMIN, Role.STAFF)
  @Patch('products/:id/adjust')
  adjustStock(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AdjustStockDto,
    @CurrentUser() currentUser: ActiveUserData,
  ) {
    return this.inventoryService.adjustStock(id, dto, currentUser);
  }

  @ApiOperation({ summary: 'Get list of low-stock products' })
  @ApiQuery({ name: 'threshold', required: false, type: Number })
  @Roles(Role.SUPER_ADMIN, Role.STORE_ADMIN, Role.STAFF)
  @Get('low-stock')
  getLowStock(
    @Query('threshold') threshold: number = 5,
    @CurrentUser() currentUser: ActiveUserData,
  ) {
    return this.inventoryService.getLowStock(Number(threshold), currentUser);
  }
}
