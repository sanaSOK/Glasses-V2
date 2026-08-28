import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';
import { Customer } from '../customers/entities/customer.entity';
import { Product } from '../products/entities/product.entity';
import { ActiveUserData } from '../common/interfaces/active-user-data.interface';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findAll(user: ActiveUserData) {
    const customers = await this.customerRepository.find({ where: { user_id: user.userId } });
    if (customers.length === 0) {
      return [];
    }

    const customerIds = customers.map((c) => c.id);
    return this.favoriteRepository
      .createQueryBuilder('fav')
      .leftJoinAndSelect('fav.product', 'product')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.store', 'store')
      .where('fav.customer_id IN (:...customerIds)', { customerIds })
      .getMany();
  }

  async addFavorite(productId: number, user: ActiveUserData) {
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException(`Product #${productId} not found`);
    }

    let customer = await this.customerRepository.findOne({
      where: { user_id: user.userId, store_id: product.store_id },
    });

    if (!customer) {
      try {
        customer = this.customerRepository.create({
          user_id: user.userId,
          store_id: product.store_id,
        });
        customer = await this.customerRepository.save(customer);
      } catch (e) {
        customer = await this.customerRepository.findOne({
          where: { user_id: user.userId, store_id: product.store_id },
        });
        if (!customer) throw e;
      }
    }

    const existing = await this.favoriteRepository.findOne({
      where: { customer_id: customer.id, product_id: productId },
    });

    if (existing) {
      throw new ConflictException('Product is already in favorites');
    }

    const favorite = this.favoriteRepository.create({
      customer_id: customer.id,
      product_id: productId,
    });

    return this.favoriteRepository.save(favorite);
  }

  async removeFavorite(productId: number, user: ActiveUserData) {
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException(`Product #${productId} not found`);
    }

    const customer = await this.customerRepository.findOne({
      where: { user_id: user.userId, store_id: product.store_id },
    });

    if (!customer) {
      throw new NotFoundException('Favorite not found');
    }

    const favorite = await this.favoriteRepository.findOne({
      where: { customer_id: customer.id, product_id: productId },
    });

    if (!favorite) {
      throw new NotFoundException('Favorite not found');
    }

    await this.favoriteRepository.remove(favorite);
    return { message: 'Removed from favorites' };
  }
}
