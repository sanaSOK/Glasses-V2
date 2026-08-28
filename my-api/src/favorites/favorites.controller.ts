import { Controller, Get, Post, Delete, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ActiveUserData } from '../common/interfaces/active-user-data.interface';

@ApiTags('Favorites')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @ApiOperation({ summary: 'Get current customer favorites' })
  @Get()
  findAll(@CurrentUser() user: ActiveUserData) {
    return this.favoritesService.findAll(user);
  }

  @ApiOperation({ summary: 'Add product to favorites' })
  @Post(':productId')
  addFavorite(
    @Param('productId', ParseIntPipe) productId: number,
    @CurrentUser() user: ActiveUserData,
  ) {
    return this.favoritesService.addFavorite(productId, user);
  }

  @ApiOperation({ summary: 'Remove product from favorites' })
  @Delete(':productId')
  removeFavorite(
    @Param('productId', ParseIntPipe) productId: number,
    @CurrentUser() user: ActiveUserData,
  ) {
    return this.favoritesService.removeFavorite(productId, user);
  }
}
