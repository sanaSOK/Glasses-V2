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
  console.log('🧹 Clearing database and setting store_name column...');
  const ds = await AppDataSource.initialize();
  const queryRunner = ds.createQueryRunner();

  await queryRunner.connect();

  try {
    await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0;');

    // Safely drop store_id foreign key constraint and column if present
    try {
      await queryRunner.query('ALTER TABLE `users` DROP FOREIGN KEY `FK_98a52595c9031d60f5c8d280ca4`;');
    } catch { }

    try {
      await queryRunner.query('ALTER TABLE `users` DROP COLUMN `store_id`;');
      console.log('  - Dropped `store_id` column from `users` table');
    } catch { }

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

    // Re-create Super Admin account ONLY
    const userRepo = ds.getRepository(User);
    const superAdmin = userRepo.create({
      store_name: 'sana_store',
      phone: '066737549',
      address: 'https://maps.google.com/?q=Institute+of+Technology+of+Cambodia',
      role: Role.SUPER_ADMIN,
      status: 'ACTIVE',
    });
    await userRepo.save(superAdmin);

    console.log('\n👑 Database reset complete!');
    console.log('Single Super Admin account created with store_name = super_admin:');
    console.log('  Username / Phone: 066737549');
  } catch (err) {
    console.error('❌ Error clearing database:', err);
  } finally {
    await queryRunner.release();
    await ds.destroy();
    process.exit(0);
  }
}

resetDatabaseToCustomSuperAdmin();
