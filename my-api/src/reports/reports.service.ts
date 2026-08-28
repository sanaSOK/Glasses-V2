import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from '../stores/entities/store.entity';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { Order } from '../orders/entities/order.entity';
import { Customer } from '../customers/entities/customer.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
import { ActiveUserData } from '../common/interfaces/active-user-data.interface';
import { Role } from '../common/enums/role.enum';
import { OrderStatus } from '../common/enums/order-status.enum';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
  ) {}

  async getSuperAdminOverview() {
    const totalStores = await this.storeRepository.count();
    const totalUsers = await this.userRepository.count();
    const totalProducts = await this.productRepository.count();
    const totalOrders = await this.orderRepository.count();

    const revenueResult = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.total_amount)', 'sum')
      .where('order.status != :cancelled', { cancelled: OrderStatus.CANCELLED })
      .getRawOne();

    const totalRevenue = parseFloat(revenueResult?.sum || '0');

    // Best-selling products across all stores
    const bestSellingProducts = await this.orderItemRepository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.product', 'product')
      .select('item.product_id', 'productId')
      .addSelect('product.name', 'productName')
      .addSelect('SUM(item.quantity)', 'totalQuantity')
      .addSelect('SUM(item.subtotal)', 'totalRevenue')
      .groupBy('item.product_id')
      .addGroupBy('product.name')
      .orderBy('"totalQuantity"', 'DESC')
      .limit(5)
      .getRawMany();

    // Store performance
    const storePerformance = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.store', 'store')
      .select('order.store_id', 'storeId')
      .addSelect('store.name', 'storeName')
      .addSelect('COUNT(order.id)', 'totalOrders')
      .addSelect('SUM(order.total_amount)', 'totalRevenue')
      .where('order.status != :cancelled', { cancelled: OrderStatus.CANCELLED })
      .groupBy('order.store_id')
      .addGroupBy('store.name')
      .orderBy('"totalRevenue"', 'DESC')
      .getRawMany();

    return {
      totalStores,
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      bestSellingProducts,
      storePerformance,
    };
  }

  async getStoreAdminOverview(user: ActiveUserData) {
    const storeId = user.storeId!;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Today's sales
    const todaySalesResult = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.total_amount)', 'sum')
      .where('order.store_id = :storeId', { storeId })
      .andWhere('order.created_at >= :today', { today })
      .andWhere('order.status != :cancelled', { cancelled: OrderStatus.CANCELLED })
      .getRawOne();
    const todaySales = parseFloat(todaySalesResult?.sum || '0');

    // Monthly sales
    const monthlySalesResult = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.total_amount)', 'sum')
      .where('order.store_id = :storeId', { storeId })
      .andWhere('order.created_at >= :firstDayOfMonth', { firstDayOfMonth })
      .andWhere('order.status != :cancelled', { cancelled: OrderStatus.CANCELLED })
      .getRawOne();
    const monthlySales = parseFloat(monthlySalesResult?.sum || '0');

    const totalOrders = await this.orderRepository.count({ where: { store_id: storeId } });
    const pendingOrders = await this.orderRepository.count({
      where: { store_id: storeId, status: OrderStatus.PENDING },
    });

    const totalCustomers = await this.customerRepository.count({ where: { store_id: storeId } });

    // Low stock products count
    const lowStockProductsCount = await this.productRepository
      .createQueryBuilder('product')
      .where('product.store_id = :storeId', { storeId })
      .andWhere('product.stock <= 5')
      .getCount();

    // Top 5 store best-sellers
    const topProducts = await this.orderItemRepository
      .createQueryBuilder('item')
      .leftJoin('item.order', 'order')
      .leftJoin('item.product', 'product')
      .select('item.product_id', 'productId')
      .addSelect('product.name', 'productName')
      .addSelect('SUM(item.quantity)', 'totalQuantity')
      .where('order.store_id = :storeId', { storeId })
      .groupBy('item.product_id')
      .addGroupBy('product.name')
      .orderBy('"totalQuantity"', 'DESC')
      .limit(5)
      .getRawMany();

    return {
      todaySales: parseFloat(todaySales.toFixed(2)),
      monthlySales: parseFloat(monthlySales.toFixed(2)),
      totalOrders,
      pendingOrders,
      totalCustomers,
      lowStockProductsCount,
      topProducts,
    };
  }
}
