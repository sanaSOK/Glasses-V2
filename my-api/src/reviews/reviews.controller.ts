import { Controller, Get, Post, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ActiveUserData } from '../common/interfaces/active-user-data.interface';

@ApiTags('Reviews')
@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ApiOperation({ summary: 'Get product reviews' })
  @Get('products/:id/reviews')
  findByProduct(@Param('id', ParseIntPipe) productId: number) {
    return this.reviewsService.findByProduct(productId);
  }

  @ApiOperation({ summary: 'Add review for product' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('products/:id/reviews')
  create(
    @Param('id', ParseIntPipe) productId: number,
    @Body() dto: CreateReviewDto,
    @CurrentUser() user: ActiveUserData,
  ) {
    return this.reviewsService.create(productId, dto, user);
  }

  @ApiOperation({ summary: 'Delete review' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('reviews/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reviewsService.remove(id);
  }
}
