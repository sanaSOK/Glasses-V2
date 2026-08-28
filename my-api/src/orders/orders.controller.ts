import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { StoreAccessGuard } from '../common/guards/store-access.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';
import { ActiveUserData } from '../common/interfaces/active-user-data.interface';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, StoreAccessGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Checkout and create order from cart' })
  @Roles(Role.CUSTOMER, Role.SUPER_ADMIN, Role.STORE_ADMIN)
  @Post()
  create(@Body() dto: CreateOrderDto, @CurrentUser() user: ActiveUserData) {
    return this.ordersService.create(dto, user);
  }

  @ApiOperation({ summary: 'List orders' })
  @ApiQuery({ name: 'store_id', required: false, type: Number })
  @Get()
  findAll(@CurrentUser() user: ActiveUserData, @Query('store_id') storeId?: number) {
    return this.ordersService.findAll(user, storeId ? Number(storeId) : undefined);
  }

  @ApiOperation({ summary: 'Get order details by ID' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: ActiveUserData) {
    return this.ordersService.findOne(id, user);
  }

  @ApiOperation({ summary: 'Update order status (Staff / Store Admin / Super Admin)' })
  @Roles(Role.SUPER_ADMIN, Role.STORE_ADMIN, Role.STAFF)
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderStatusDto,
    @CurrentUser() user: ActiveUserData,
  ) {
    return this.ordersService.updateStatus(id, dto, user);
  }
}
