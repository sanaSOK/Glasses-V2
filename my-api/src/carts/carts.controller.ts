import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CartsService } from './carts.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ActiveUserData } from '../common/interfaces/active-user-data.interface';

@ApiTags('Cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @ApiOperation({ summary: 'Get current customer shopping cart' })
  @ApiQuery({ name: 'store_id', required: false, type: Number })
  @Get()
  getCart(@CurrentUser() user: ActiveUserData, @Query('store_id') storeId?: number) {
    return this.cartsService.getCart(user, storeId ? Number(storeId) : undefined);
  }

  @ApiOperation({ summary: 'Add product item to cart' })
  @Post('items')
  addItem(@Body() dto: AddCartItemDto, @CurrentUser() user: ActiveUserData) {
    return this.cartsService.addItem(dto, user);
  }

  @ApiOperation({ summary: 'Update cart item quantity' })
  @Patch('items/:id')
  updateItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCartItemDto,
    @CurrentUser() user: ActiveUserData,
  ) {
    return this.cartsService.updateItem(id, dto, user);
  }

  @ApiOperation({ summary: 'Remove item from cart' })
  @Delete('items/:id')
  removeItem(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: ActiveUserData) {
    return this.cartsService.removeItem(id, user);
  }

  @ApiOperation({ summary: 'Clear all items from cart' })
  @ApiQuery({ name: 'store_id', required: false, type: Number })
  @Delete()
  clearCart(@CurrentUser() user: ActiveUserData, @Query('store_id') storeId?: number) {
    return this.cartsService.clearCart(user, storeId ? Number(storeId) : undefined);
  }
}
