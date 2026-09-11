import { DataSource } from 'typeorm';
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
  console.log('🌱 Starting clean reset (Super Admin & Admin Management)...');
  await clearAllTables(dataSource);

  const userRepo = dataSource.getRepository(User);

  // 1. Create Global Super Admin
  const superAdmin = userRepo.create({
    store_name: 'sana_store',
    phone: '066737549',
    address: 'https://maps.google.com/?q=Institute+of+Technology+of+Cambodia',
    role: Role.SUPER_ADMIN,
    status: 'ACTIVE',
  });

  // 2. Create Store Admins
  const storeAdmin1 = userRepo.create({
    store_name: 'Phnom Penh Optics',
    phone: '012345678',
    address: 'Monivong Blvd, Phnom Penh',
    role: Role.STORE_ADMIN,
    status: 'ACTIVE',
  });

  const storeAdmin2 = userRepo.create({
    store_name: 'Siem Reap EyeCare',
    phone: '098765432',
    address: 'Pub Street Area, Siem Reap',
    role: Role.STORE_ADMIN,
    status: 'ACTIVE',
  });

  const storeStaff = userRepo.create({
    store_name: 'Phnom Penh Optics',
    phone: '011223344',
    address: 'Monivong Blvd, Phnom Penh',
    role: Role.STAFF,
    status: 'ACTIVE',
  });

  await userRepo.save([superAdmin, storeAdmin1, storeAdmin2, storeStaff]);

  console.log('👑 Super Admin & Store Admins seeded successfully!');
  console.log('  👑 Super Admin Username / Phone: 066737549 (Global Authority)');
  console.log('  🏬 Store Admin 1 Phone: 012345678 (Phnom Penh Optics)');
  console.log('  🏬 Store Admin 2 Phone: 098765432 (Siem Reap EyeCare)');
}
