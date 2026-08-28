import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt';
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
import { Role } from '../common/enums/role.enum';

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
  synchronize: false,
});

async function resetDatabaseToCustomSuperAdmin() {
  console.log('🧹 Clearing all existing database tables...');
  const ds = await AppDataSource.initialize();
  const queryRunner = ds.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0;');

    const tables = [
      'reviews',
      'payments',
      'order_items',
      'orders',
      'cart_items',
      'carts',
      'favorites',
      'prescriptions',
      'product_images',
      'products',
      'categories',
      'promotions',
      'customers',
      'users',
      'stores',
    ];

    for (const table of tables) {
      await queryRunner.query(`TRUNCATE TABLE \`${table}\`;`);
      console.log(`  - Truncated table \`${table}\``);
    }

    await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1;');
    await queryRunner.commitTransaction();

    // Re-create Super Admin account ONLY with requested credentials
    const userRepo = ds.getRepository(User);
    const hashedPassword = await bcrypt.hash('superadmin@123', 10);
    const superAdmin = userRepo.create({
      name: '066737549',
      email: 'superadmin@system.com',
      password: hashedPassword,
      phone: '066737549',
      role: Role.SUPER_ADMIN,
      status: 'ACTIVE',
    });
    await userRepo.save(superAdmin);

    console.log('\n👑 Database reset complete!');
    console.log('Single Super Admin account created:');
    console.log('  Username / Phone: 066737549');
    console.log('  Password:         superadmin@123');
  } catch (err) {
    await queryRunner.rollbackTransaction();
    console.error('❌ Error clearing database:', err);
  } finally {
    await queryRunner.release();
    await ds.destroy();
    process.exit(0);
  }
}

resetDatabaseToCustomSuperAdmin();
