import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { Product } from '../products/entities/product.entity';
import { Customer } from '../customers/entities/customer.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { ActiveUserData } from '../common/interfaces/active-user-data.interface';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async findByProduct(productId: number) {
    return this.reviewRepository.find({
      where: { product_id: productId },
      relations: { customer: { user: true } },
      order: { created_at: 'DESC' },
    });
  }

  async create(productId: number, dto: CreateReviewDto, user: ActiveUserData) {
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException(`Product #${productId} not found`);
    }

    let customer = await this.customerRepository.findOne({
      where: { user_id: user.userId, store_id: product.store_id },
    });

    if (!customer) {
      customer = this.customerRepository.create({
        user_id: user.userId,
        store_id: product.store_id,
      });
      customer = await this.customerRepository.save(customer);
    }

    const review = this.reviewRepository.create({
      product_id: productId,
      customer_id: customer.id,
      rating: dto.rating,
      comment: dto.comment,
    });

    return this.reviewRepository.save(review);
  }

  async remove(id: number) {
    const review = await this.reviewRepository.findOne({ where: { id } });
    if (!review) {
      throw new NotFoundException(`Review #${id} not found`);
    }
    await this.reviewRepository.remove(review);
    return { message: `Review #${id} deleted` };
  }
}
