import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Cart } from '../carts/entities/cart.entity';
import { Product } from '../products/entities/product.entity';
import { Customer } from '../customers/entities/customer.entity';
import { Payment } from '../payments/entities/payment.entity';
import { Prescription } from '../prescriptions/entities/prescription.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from '../common/enums/order-status.enum';
import { PaymentStatus } from '../common/enums/payment-status.enum';
import { ActiveUserData } from '../common/interfaces/active-user-data.interface';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Prescription)
    private prescriptionRepository: Repository<Prescription>,
  ) {}

  async create(dto: CreateOrderDto, user: ActiveUserData) {
    let customer = await this.customerRepository.findOne({
      where: { user_id: user.userId, store_id: dto.store_id },
    });

    if (!customer) {
      try {
        customer = this.customerRepository.create({
          user_id: user.userId,
          store_id: dto.store_id,
          address: dto.shipping_address,
        });
        customer = await this.customerRepository.save(customer);
      } catch (e) {
        customer = await this.customerRepository.findOne({
          where: { user_id: user.userId, store_id: dto.store_id },
        });
        if (!customer) throw e;
      }
    }

    const cart = await this.cartRepository.findOne({
      where: { customer_id: customer.id, store_id: dto.store_id },
      relations: { items: { product: true } },
    });

    if (!cart || !cart.items || cart.items.length === 0) {
      throw new BadRequestException('Shopping cart is empty. Cannot checkout.');
    }

    // Verify stock & calculate total
    let totalAmount = 0;
    const orderItemsToCreate: Partial<OrderItem>[] = [];

    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        throw new BadRequestException(
          `Product '${item.product.name}' is out of stock or does not have enough stock`,
        );
      }

      const itemPrice = Number(item.price);
      const subtotal = itemPrice * item.quantity;
      totalAmount += subtotal;

      orderItemsToCreate.push({
        product_id: item.product.id,
        quantity: item.quantity,
        price: itemPrice,
        subtotal: parseFloat(subtotal.toFixed(2)),
      });
    }

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const order = this.orderRepository.create({
      customer_id: customer.id,
      store_id: dto.store_id,
      order_number: orderNumber,
      total_amount: parseFloat(totalAmount.toFixed(2)),
      status: OrderStatus.PENDING,
      payment_status: PaymentStatus.UNPAID,
      shipping_address: dto.shipping_address,
    });

    const savedOrder = await this.orderRepository.save(order);

    // Save Order Items & Deduct Stock
    for (const itemData of orderItemsToCreate) {
      const orderItem = this.orderItemRepository.create({
        ...itemData,
        order_id: savedOrder.id,
      });
      await this.orderItemRepository.save(orderItem);

      // Decrement product stock
      const product = await this.productRepository.findOne({ where: { id: itemData.product_id } });
      if (product) {
        product.stock -= itemData.quantity!;
        await this.productRepository.save(product);
      }
    }

    // Link Prescription if provided
    if (dto.prescription_id) {
      const prescription = await this.prescriptionRepository.findOne({
        where: { id: dto.prescription_id },
      });
      if (prescription) {
        prescription.order_id = savedOrder.id;
        await this.prescriptionRepository.save(prescription);
      }
    }

    // Create Initial Payment Record
    const payment = this.paymentRepository.create({
      order_id: savedOrder.id,
      amount: savedOrder.total_amount,
    });
    await this.paymentRepository.save(payment);

    // Clear Cart Items
    await this.cartRepository.manager.delete('cart_items', { cart_id: cart.id });

    return this.findOne(savedOrder.id, user);
  }

  async findAll(user: ActiveUserData, storeId?: number) {
    const query = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('customer.user', 'user')
      .leftJoinAndSelect('order.store', 'store')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .leftJoinAndSelect('order.payment', 'payment')
      .leftJoinAndSelect('order.prescription', 'prescription');

    if (user.role === Role.CUSTOMER) {
      query.andWhere('customer.user_id = :userId', { userId: user.userId });
    } else if (user.role !== Role.SUPER_ADMIN) {
      query.andWhere('order.store_id = :storeId', { storeId: user.storeId });
    } else if (storeId) {
      query.andWhere('order.store_id = :storeId', { storeId });
    }

    query.orderBy('order.created_at', 'DESC');
    return query.getMany();
  }

  async findOne(id: number, user: ActiveUserData) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: {
        customer: { user: true },
        store: true,
        items: { product: { images: true } },
        payment: true,
        prescription: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }

    // Cross-tenant access validation
    if (user.role === Role.CUSTOMER && order.customer.user_id !== user.userId) {
      throw new NotFoundException(`Order #${id} not found`);
    }

    if (
      user.role !== Role.SUPER_ADMIN &&
      user.role !== Role.CUSTOMER &&
      order.store_id !== user.storeId
    ) {
      throw new NotFoundException(`Order #${id} not found`);
    }

    return order;
  }

  async updateStatus(id: number, dto: UpdateOrderStatusDto, user: ActiveUserData) {
    const order = await this.findOne(id, user);
    order.status = dto.status;
    return this.orderRepository.save(order);
  }
}
