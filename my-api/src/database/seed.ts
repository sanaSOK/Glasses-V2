import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { Role } from '../common/enums/role.enum';

export async function clearAllTables(dataSource: DataSource) {
  console.log('🧹 Clearing all existing data from database tables...');
  const queryRunner = dataSource.createQueryRunner();
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
    }
    await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1;');
    await queryRunner.commitTransaction();
    console.log('✨ All tables truncated successfully.');
  } catch (err) {
    await queryRunner.rollbackTransaction();
    console.error('Error clearing tables:', err);
  } finally {
    await queryRunner.release();
  }
}

export async function runSeed(dataSource: DataSource) {
  console.log('🌱 Starting clean reset (Super Admin Only)...');
  await clearAllTables(dataSource);

  const userRepo = dataSource.getRepository(User);
  const hashedPassword = await bcrypt.hash('superadmin@123', 10);

  // Create Super Admin with exact requested credentials
  const superAdmin = userRepo.create({
    name: '066737549',
    email: 'superadmin@system.com',
    password: hashedPassword,
    phone: '066737549',
    role: Role.SUPER_ADMIN,
    status: 'ACTIVE',
  });

  await userRepo.save(superAdmin);
  console.log('👑 Super Admin created successfully!');
  console.log('  Username / Phone: 066737549');
  console.log('  Password:         superadmin@123');
}
