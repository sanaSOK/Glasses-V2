import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Store } from './stores/entities/store.entity';
import { User } from './users/entities/user.entity';
import { Category } from './categories/entities/category.entity';
import { Product } from './products/entities/product.entity';
import { ProductImage } from './products/entities/product-image.entity';
import { Customer } from './customers/entities/customer.entity';
import { Cart } from './carts/entities/cart.entity';
import { CartItem } from './carts/entities/cart-item.entity';
import { Order } from './orders/entities/order.entity';
import { OrderItem } from './orders/entities/order-item.entity';
import { Payment } from './payments/entities/payment.entity';
import { Review } from './reviews/entities/review.entity';
import { Favorite } from './favorites/entities/favorite.entity';
import { Prescription } from './prescriptions/entities/prescription.entity';
import { Promotion } from './promotions/entities/promotion.entity';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StoresModule } from './stores/stores.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { InventoryModule } from './inventory/inventory.module';
import { CustomersModule } from './customers/customers.module';
import { CartsModule } from './carts/carts.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { ReviewsModule } from './reviews/reviews.module';
import { FavoritesModule } from './favorites/favorites.module';
import { PrescriptionsModule } from './prescriptions/prescriptions.module';
import { PromotionsModule } from './promotions/promotions.module';
import { ReportsModule } from './reports/reports.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DATABASE_HOST', 'localhost'),
        port: config.get<number>('DATABASE_PORT', 3306),
        username: config.get<string>('DATABASE_USERNAME', 'root'),
        password: config.get<string>('DATABASE_PASSWORD', 'root'),
        database: config.get<string>('DATABASE_NAME', 'glasses_store_db'),
        entities: [
          Store,
          User,
          Category,
          Product,
          ProductImage,
          Customer,
          Cart,
          CartItem,
          Order,
          OrderItem,
          Payment,
          Review,
          Favorite,
          Prescription,
          Promotion,
        ],
        synchronize: true, // For development mode
        logging: false,
      }),
    }),
    AuthModule,
    UsersModule,
    StoresModule,
    CategoriesModule,
    ProductsModule,
    InventoryModule,
    CustomersModule,
    CartsModule,
    OrdersModule,
    PaymentsModule,
    ReviewsModule,
    FavoritesModule,
    PrescriptionsModule,
    PromotionsModule,
    ReportsModule,
    UploadsModule,
  ],
})
export class AppModule {}
