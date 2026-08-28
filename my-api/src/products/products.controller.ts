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
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductDto } from './dto/filter-product.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { StoreAccessGuard } from '../common/guards/store-access.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Role } from '../common/enums/role.enum';
import { ActiveUserData } from '../common/interfaces/active-user-data.interface';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({ summary: 'Create new product (Store Admin / Staff)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, StoreAccessGuard)
  @Roles(Role.SUPER_ADMIN, Role.STORE_ADMIN, Role.STAFF)
  @Post()
  create(@Body() dto: CreateProductDto, @CurrentUser() currentUser: ActiveUserData) {
    return this.productsService.create(dto, currentUser);
  }

  @ApiOperation({ summary: 'List and filter products (Public storefront & Admin view)' })
  @Get()
  findAll(@Query() filter: FilterProductDto, @CurrentUser() currentUser?: ActiveUserData) {
    return this.productsService.findAll(filter, currentUser);
  }

  @ApiOperation({ summary: 'Get product by slug' })
  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @ApiOperation({ summary: 'Get product by ID' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update product' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, StoreAccessGuard)
  @Roles(Role.SUPER_ADMIN, Role.STORE_ADMIN, Role.STAFF)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
    @CurrentUser() currentUser: ActiveUserData,
  ) {
    return this.productsService.update(id, dto, currentUser);
  }

  @ApiOperation({ summary: 'Delete product' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard, StoreAccessGuard)
  @Roles(Role.SUPER_ADMIN, Role.STORE_ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() currentUser: ActiveUserData) {
    return this.productsService.remove(id, currentUser);
  }
}
