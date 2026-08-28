import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { Product } from '../products/entities/product.entity';
import { Customer } from '../customers/entities/customer.entity';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { ActiveUserData } from '../common/interfaces/active-user-data.interface';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  private async getOrCreateCustomer(user: ActiveUserData, storeId: number): Promise<Customer> {
    let customer = await this.customerRepository.findOne({
      where: { user_id: user.userId, store_id: storeId },
    });

    if (!customer) {
      try {
        customer = this.customerRepository.create({
          user_id: user.userId,
          store_id: storeId,
        });
        customer = await this.customerRepository.save(customer);
      } catch (e) {
        customer = await this.customerRepository.findOne({
          where: { user_id: user.userId, store_id: storeId },
        });
        if (!customer) throw e;
      }
    }
    return customer;
  }

  async getCart(user: ActiveUserData, storeId?: number) {
    const targetStoreId = storeId || user.storeId || 1;
    const customer = await this.getOrCreateCustomer(user, targetStoreId);

    let cart = await this.cartRepository.findOne({
      where: { customer_id: customer.id, store_id: targetStoreId },
      relations: { items: { product: { images: true } } },
    });

    if (!cart) {
      try {
        cart = this.cartRepository.create({
          customer_id: customer.id,
          store_id: targetStoreId,
          items: [],
        });
        cart = await this.cartRepository.save(cart);
      } catch (e) {
        cart = await this.cartRepository.findOne({
          where: { customer_id: customer.id, store_id: targetStoreId },
          relations: { items: { product: { images: true } } },
        });
        if (!cart) throw e;
      }
    }

    const total = cart.items
      ? cart.items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
      : 0;

    return {
      ...cart,
      total: parseFloat(total.toFixed(2)),
    };
  }

  async addItem(dto: AddCartItemDto, user: ActiveUserData) {
    const product = await this.productRepository.findOne({ where: { id: dto.product_id } });
    if (!product) {
      throw new NotFoundException(`Product #${dto.product_id} not found`);
    }

    if (product.stock < dto.quantity) {
      throw new BadRequestException(
        `Insufficient stock for '${product.name}'. Available: ${product.stock}`,
      );
    }

    const storeId = dto.store_id || product.store_id;
    const customer = await this.getOrCreateCustomer(user, storeId);

    let cart = await this.cartRepository.findOne({
      where: { customer_id: customer.id, store_id: storeId },
      relations: { items: true },
    });

    if (!cart) {
      cart = this.cartRepository.create({
        customer_id: customer.id,
        store_id: storeId,
      });
      cart = await this.cartRepository.save(cart);
    }

    const itemPrice = product.discount_price ? Number(product.discount_price) : Number(product.price);

    let cartItem = await this.cartItemRepository.findOne({
      where: { cart_id: cart.id, product_id: product.id },
    });

    if (cartItem) {
      cartItem.quantity += dto.quantity;
      cartItem.price = itemPrice;
    } else {
      cartItem = this.cartItemRepository.create({
        cart_id: cart.id,
        product_id: product.id,
        quantity: dto.quantity,
        price: itemPrice,
      });
    }

    await this.cartItemRepository.save(cartItem);
    return this.getCart(user, storeId);
  }

  async updateItem(itemId: number, dto: UpdateCartItemDto, user: ActiveUserData) {
    const item = await this.cartItemRepository.findOne({
      where: { id: itemId },
      relations: { cart: true, product: true },
    });

    if (!item) {
      throw new NotFoundException(`Cart item #${itemId} not found`);
    }

    if (item.product.stock < dto.quantity) {
      throw new BadRequestException(
        `Insufficient stock for '${item.product.name}'. Available: ${item.product.stock}`,
      );
    }

    item.quantity = dto.quantity;
    await this.cartItemRepository.save(item);
    return this.getCart(user, item.cart.store_id);
  }

  async removeItem(itemId: number, user: ActiveUserData) {
    const item = await this.cartItemRepository.findOne({
      where: { id: itemId },
      relations: { cart: true },
    });

    if (!item) {
      throw new NotFoundException(`Cart item #${itemId} not found`);
    }

    const storeId = item.cart.store_id;
    await this.cartItemRepository.remove(item);
    return this.getCart(user, storeId);
  }

  async clearCart(user: ActiveUserData, storeId?: number) {
    const cart = await this.getCart(user, storeId);
    if (cart.items && cart.items.length > 0) {
      await this.cartItemRepository.remove(cart.items);
    }
    return { message: 'Cart cleared successfully' };
  }
}
