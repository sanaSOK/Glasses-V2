import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { StoreAccessGuard } from '../common/guards/store-access.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';
import { ActiveUserData } from '../common/interfaces/active-user-data.interface';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({ summary: 'Create category (Super Admin or Store Admin)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, StoreAccessGuard)
  @Roles(Role.SUPER_ADMIN, Role.STORE_ADMIN)
  @Post()
  create(@Body() dto: CreateCategoryDto, @CurrentUser() currentUser: ActiveUserData) {
    return this.categoriesService.create(dto, currentUser);
  }

  @ApiOperation({ summary: 'Get categories (Optional filter by store_id)' })
  @ApiQuery({ name: 'store_id', required: false, type: Number })
  @Get()
  findAll(@Query('store_id') storeId?: number) {
    return this.categoriesService.findAll(storeId ? Number(storeId) : undefined);
  }

  @ApiOperation({ summary: 'Get category by ID' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOne(id);
  }

  @ApiOperation({ summary: 'Update category' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, StoreAccessGuard)
  @Roles(Role.SUPER_ADMIN, Role.STORE_ADMIN)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto,
    @CurrentUser() currentUser: ActiveUserData,
  ) {
    return this.categoriesService.update(id, dto, currentUser);
  }

  @ApiOperation({ summary: 'Delete category' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, StoreAccessGuard)
  @Roles(Role.SUPER_ADMIN, Role.STORE_ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() currentUser: ActiveUserData) {
    return this.categoriesService.remove(id, currentUser);
  }
}
