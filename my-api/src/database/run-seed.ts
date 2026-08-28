import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Store } from '../stores/entities/store.entity';
import { User } from '../users/entities/user.entity';
import { Category } from '../categories/entities/category.entity';
import { Product } from '../products/entities/product.entity';
import { ProductImage } from '../products/entities/product-image.entity';
import { Customer } from '../customers/entities/customer.entity';
import { Cart } from '../carts/entities/cart.entity';
import { CartItem } from '../carts/entities/cart-item.entity';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
import { Payment } from '../payments/entities/payment.entity';
import { Review } from '../reviews/entities/review.entity';
import { Favorite } from '../favorites/entities/favorite.entity';
import { Prescription } from '../prescriptions/entities/prescription.entity';
import { Promotion } from '../promotions/entities/promotion.entity';
import { runSeed } from './seed';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '3306', 10),
  username: process.env.DATABASE_USERNAME || 'root',
  password: process.env.DATABASE_PASSWORD || 'root',
  database: process.env.DATABASE_NAME || 'glasses_store_db',
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
  synchronize: true,
});

AppDataSource.initialize()
  .then(async (ds) => {
    await runSeed(ds);
    await ds.destroy();
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error during database seed execution:', err);
    process.exit(1);
  });
