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
import { PromotionsService } from './promotions.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { StoreAccessGuard } from '../common/guards/store-access.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';
import { ActiveUserData } from '../common/interfaces/active-user-data.interface';

@ApiTags('Promotions')
@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @ApiOperation({ summary: 'Create promotion' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, StoreAccessGuard)
  @Roles(Role.SUPER_ADMIN, Role.STORE_ADMIN)
  @Post()
  create(@Body() dto: CreatePromotionDto, @CurrentUser() user: ActiveUserData) {
    return this.promotionsService.create(dto, user);
  }

  @ApiOperation({ summary: 'List store promotions' })
  @ApiQuery({ name: 'store_id', required: false, type: Number })
  @Get()
  findAll(@Query('store_id') storeId?: number) {
    return this.promotionsService.findAll(storeId ? Number(storeId) : undefined);
  }

  @ApiOperation({ summary: 'Get promotion by ID' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.promotionsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update promotion' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, StoreAccessGuard)
  @Roles(Role.SUPER_ADMIN, Role.STORE_ADMIN)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePromotionDto,
    @CurrentUser() user: ActiveUserData,
  ) {
    return this.promotionsService.update(id, dto, user);
  }

  @ApiOperation({ summary: 'Delete promotion' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, StoreAccessGuard)
  @Roles(Role.SUPER_ADMIN, Role.STORE_ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: ActiveUserData) {
    return this.promotionsService.remove(id, user);
  }
}
