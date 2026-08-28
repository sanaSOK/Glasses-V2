import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Store } from '../stores/entities/store.entity';
import { User } from '../users/entities/user.entity';
import { Category } from '../categories/entities/category.entity';
import { Product } from '../products/entities/product.entity';
import { ProductImage } from '../products/entities/product-image.entity';
import { Customer } from '../customers/entities/customer.entity';
import { Order } from '../orders/entities/order.entity';
import { OrderItem } from '../orders/entities/order-item.entity';
import { Payment } from '../payments/entities/payment.entity';
import { Review } from '../reviews/entities/review.entity';
import { Promotion } from '../promotions/entities/promotion.entity';
import { Role } from '../common/enums/role.enum';
import { Gender } from '../common/enums/gender.enum';
import { OrderStatus } from '../common/enums/order-status.enum';
import { PaymentStatus, PaymentTransactionStatus } from '../common/enums/payment-status.enum';
import { PaymentMethod } from '../common/enums/payment-method.enum';
import { DiscountType } from '../common/enums/discount-type.enum';

export async function runSeed(dataSource: DataSource) {
  console.log('🌱 Starting database seeding process...');

  const storeRepo = dataSource.getRepository(Store);
  const userRepo = dataSource.getRepository(User);
  const categoryRepo = dataSource.getRepository(Category);
  const productRepo = dataSource.getRepository(Product);
  const imageRepo = dataSource.getRepository(ProductImage);
  const customerRepo = dataSource.getRepository(Customer);
  const orderRepo = dataSource.getRepository(Order);
  const orderItemRepo = dataSource.getRepository(OrderItem);
  const paymentRepo = dataSource.getRepository(Payment);
  const reviewRepo = dataSource.getRepository(Review);
  const promotionRepo = dataSource.getRepository(Promotion);

  const defaultPassword = await bcrypt.hash('password123', 10);

  // 1. Create Super Admin
  let superAdmin = await userRepo.findOne({ where: { email: 'superadmin@system.com' } });
  if (!superAdmin) {
    superAdmin = userRepo.create({
      name: 'System Super Admin',
      email: 'superadmin@system.com',
      password: defaultPassword,
      phone: '+1 800 000 0000',
      role: Role.SUPER_ADMIN,
    });
    await userRepo.save(superAdmin);
    console.log('✅ Super Admin created: superadmin@system.com / password123');
  }

  // 2. Create 3 Stores
  const storesData = [
    {
      name: 'SANA Optical',
      slug: 'sana-optical',
      logo: 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=500',
      description: 'Luxury handcrafted prescription eyewear & haute couture designer frames.',
      phone: '+1 212 555 0101',
      email: 'contact@sanaoptical.com',
      address: '740 Madison Avenue, New York, NY 10065',
    },
    {
      name: 'Vision Plus',
      slug: 'vision-plus',
      logo: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500',
      description: 'Modern sports optics, digital screen protection & light-reactive lenses.',
      phone: '+1 310 555 0102',
      email: 'support@visionplus.com',
      address: '420 Rodeo Drive, Beverly Hills, CA 90210',
    },
    {
      name: 'Modern Eyes',
      slug: 'modern-eyes',
      logo: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=500',
      description: 'Minimalist titanium frames, sustainable eco-acetate & boutique optics.',
      phone: '+1 415 555 0103',
      email: 'hello@moderneyes.com',
      address: '150 Post Street, San Francisco, CA 94108',
    },
  ];

  const stores: Store[] = [];
  for (const sData of storesData) {
    let store = await storeRepo.findOne({ where: { slug: sData.slug } });
    if (!store) {
      store = storeRepo.create(sData);
      store = await storeRepo.save(store);
    }
    stores.push(store);
  }
  console.log(`✅ ${stores.length} Stores verified/created`);

  // 3. Create Store Admins and Staff
  for (const store of stores) {
    const adminEmail = `admin@${store.slug}.com`;
    let admin = await userRepo.findOne({ where: { email: adminEmail } });
    if (!admin) {
      admin = userRepo.create({
        name: `${store.name} Manager`,
        email: adminEmail,
        password: defaultPassword,
        store_id: store.id,
        role: Role.STORE_ADMIN,
      });
      await userRepo.save(admin);
    }

    const staffEmail = `staff@${store.slug}.com`;
    let staff = await userRepo.findOne({ where: { email: staffEmail } });
    if (!staff) {
      staff = userRepo.create({
        name: `${store.name} Optician Staff`,
        email: staffEmail,
        password: defaultPassword,
        store_id: store.id,
        role: Role.STAFF,
      });
      await userRepo.save(staff);
    }
  }

  // 4. Create Categories
  const categoryNames = ['Prescription Glasses', 'Sunglasses', 'Blue Light Blocking', 'Reading Glasses'];
  const storeCategoriesMap: Map<number, Category[]> = new Map();

  for (const store of stores) {
    const categories: Category[] = [];
    for (const cName of categoryNames) {
      const slug = `${cName.toLowerCase().replace(/\s+/g, '-')}-${store.id}`;
      let cat = await categoryRepo.findOne({ where: { slug, store_id: store.id } });
      if (!cat) {
        cat = categoryRepo.create({
          store_id: store.id,
          name: cName,
          slug,
          description: `High performance ${cName.toLowerCase()} for all vision needs.`,
        });
        cat = await categoryRepo.save(cat);
      }
      categories.push(cat);
    }
    storeCategoriesMap.set(store.id, categories);
  }

  // 5. Seed 21 Products across 3 stores
  const seedProducts = [
    // SANA Optical Products
    {
      storeIndex: 0,
      catIndex: 0,
      name: 'Ray-Ban Wayfarer Classic',
      brand: 'Ray-Ban',
      price: 165.0,
      discount_price: 145.0,
      stock: 35,
      sku: 'RB-2140-001',
      frame_shape: 'Square',
      frame_material: 'Acetate',
      frame_color: 'Black',
      gender: Gender.UNISEX,
      lens_type: 'Single Vision Anti-Reflective',
      images: [
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800',
        'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800',
      ],
    },
    {
      storeIndex: 0,
      catIndex: 1,
      name: 'Gucci Oversized Square Sunglasses',
      brand: 'Gucci',
      price: 450.0,
      discount_price: 395.0,
      stock: 12,
      sku: 'GC-0024S-001',
      frame_shape: 'Oversized',
      frame_material: 'Bio-Acetate',
      frame_color: 'Havana Gold',
      gender: Gender.WOMEN,
      lens_type: 'Polarized Gradient UV400',
      images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800'],
    },
    {
      storeIndex: 0,
      catIndex: 2,
      name: 'Tom Ford Blue Block Aviator',
      brand: 'Tom Ford',
      price: 385.0,
      discount_price: null,
      stock: 20,
      sku: 'TF-5532-005',
      frame_shape: 'Aviator',
      frame_material: 'Titanium & Metal',
      frame_color: 'Shiny Gold',
      gender: Gender.UNISEX,
      lens_type: 'Blue Light Filter',
      images: ['https://images.unsplash.com/photo-1577803645773-f96470509666?w=800'],
    },
    {
      storeIndex: 0,
      catIndex: 0,
      name: 'Prada Linea Rossa Steel Optical',
      brand: 'Prada',
      price: 320.0,
      discount_price: 280.0,
      stock: 18,
      sku: 'PR-53UV-1BO1O1',
      frame_shape: 'Rectangle',
      frame_material: 'Ultra-Light Steel',
      frame_color: 'Matte Black',
      gender: Gender.MEN,
      lens_type: 'Progressive High Index',
      images: ['https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=800'],
    },
    {
      storeIndex: 0,
      catIndex: 3,
      name: 'Persol Calligrapher Edition',
      brand: 'Persol',
      price: 290.0,
      discount_price: null,
      stock: 15,
      sku: 'PO-3160V-95',
      frame_shape: 'Round',
      frame_material: 'Handcrafted Acetate',
      frame_color: 'Caffe Tortoise',
      gender: Gender.UNISEX,
      lens_type: 'Reading Lens +2.0',
      images: ['https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=800'],
    },
    {
      storeIndex: 0,
      catIndex: 1,
      name: 'Oliver Peoples Gregory Peck Sun',
      brand: 'Oliver Peoples',
      price: 490.0,
      discount_price: 430.0,
      stock: 8,
      sku: 'OP-1962S-501',
      frame_shape: 'P3 Vintage Round',
      frame_material: 'Custom Acetate',
      frame_color: 'Buff Amber',
      gender: Gender.UNISEX,
      lens_type: 'VFX Polarized Glass',
      images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800'],
    },
    {
      storeIndex: 0,
      catIndex: 2,
      name: 'Oakley Holbrook RX Blue',
      brand: 'Oakley',
      price: 180.0,
      discount_price: 155.0,
      stock: 22,
      sku: 'OX-8156-0156',
      frame_shape: 'Square',
      frame_material: 'O Matter Tech',
      frame_color: 'Satin Black',
      gender: Gender.MEN,
      lens_type: 'Prizm Gaming Lens',
      images: ['https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800'],
    },

    // Vision Plus Products
    {
      storeIndex: 1,
      catIndex: 1,
      name: 'Oakley Radar EV Path Sport',
      brand: 'Oakley',
      price: 215.0,
      discount_price: 190.0,
      stock: 30,
      sku: 'OO-9208-0538',
      frame_shape: 'Shield Sport',
      frame_material: 'O Matter Composite',
      frame_color: 'Polished White',
      gender: Gender.UNISEX,
      lens_type: 'Prizm Road Polarized',
      images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800'],
    },
    {
      storeIndex: 1,
      catIndex: 2,
      name: 'Gunnar Optiks Enigma Razer Edition',
      brand: 'Gunnar',
      price: 99.0,
      discount_price: 79.0,
      stock: 45,
      sku: 'GNR-ENIGMA-RZ',
      frame_shape: 'Wide Rectangle',
      frame_material: 'Polycarbonate Polymer',
      frame_color: 'Onyx Black / Razer Green',
      gender: Gender.UNISEX,
      lens_type: 'Amber 65% Blue Light Block',
      images: ['https://images.unsplash.com/photo-1577803645773-f96470509666?w=800'],
    },
    {
      storeIndex: 1,
      catIndex: 0,
      name: 'Nike Optical 7118 Flex Titanium',
      brand: 'Nike',
      price: 210.0,
      discount_price: 175.0,
      stock: 25,
      sku: 'NK-7118-002',
      frame_shape: 'Rectangle Flex',
      frame_material: 'Memory Titanium',
      frame_color: 'Gunmetal Gray',
      gender: Gender.MEN,
      lens_type: 'Impact-Resistant Polycarbonate',
      images: ['https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=800'],
    },
    {
      storeIndex: 1,
      catIndex: 1,
      name: 'Maui Jim Ho’okipa Polarized',
      brand: 'Maui Jim',
      price: 240.0,
      discount_price: 210.0,
      stock: 14,
      sku: 'MJ-807-02',
      frame_shape: 'Rimless Sport',
      frame_material: 'Grilamid TR90 Nylon',
      frame_color: 'Gloss Black',
      gender: Gender.UNISEX,
      lens_type: 'PolarizedPlus2 Neutral Grey',
      images: ['https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=800'],
    },
    {
      storeIndex: 1,
      catIndex: 3,
      name: 'ThinOptics Connect Executive Reader',
      brand: 'ThinOptics',
      price: 39.95,
      discount_price: null,
      stock: 60,
      sku: 'TO-READ-200',
      frame_shape: 'Oval Pinch',
      frame_material: 'Nitinol Memory Metal',
      frame_color: 'Clear Black',
      gender: Gender.UNISEX,
      lens_type: 'Optical Grade Polycarbonate +2.0',
      images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800'],
    },
    {
      storeIndex: 1,
      catIndex: 0,
      name: 'Ray-Ban Clubmaster Optics',
      brand: 'Ray-Ban',
      price: 185.0,
      discount_price: 160.0,
      stock: 28,
      sku: 'RB-5154-2000',
      frame_shape: 'Browline Clubmaster',
      frame_material: 'Acetate & Gold Metal',
      frame_color: 'Black Gold',
      gender: Gender.UNISEX,
      lens_type: 'Single Vision Anti-Glare',
      images: ['https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800'],
    },
    {
      storeIndex: 1,
      catIndex: 2,
      name: 'Barner Chamberí Screen Glasses',
      brand: 'Barner',
      price: 75.0,
      discount_price: 60.0,
      stock: 40,
      sku: 'BRN-CHMB-BL',
      frame_shape: 'Round Vintage',
      frame_material: 'TR90 Light Weight',
      frame_color: 'Navy Blue',
      gender: Gender.UNISEX,
      lens_type: 'CR-39 Anti-Blue',
      images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800'],
    },

    // Modern Eyes Products
    {
      storeIndex: 2,
      catIndex: 0,
      name: 'Warby Parker Winston Titanium',
      brand: 'Warby Parker',
      price: 145.0,
      discount_price: 125.0,
      stock: 50,
      sku: 'WP-WINSTON-01',
      frame_shape: 'Square',
      frame_material: 'Japanese Titanium',
      frame_color: 'Brushed Silver',
      gender: Gender.UNISEX,
      lens_type: 'Super Hydrophobic Polycarbonate',
      images: ['https://images.unsplash.com/photo-1577803645773-f96470509666?w=800'],
    },
    {
      storeIndex: 2,
      catIndex: 1,
      name: 'Mykita Lite Acetate Sun',
      brand: 'Mykita',
      price: 520.0,
      discount_price: 460.0,
      stock: 6,
      sku: 'MYK-LITE-S01',
      frame_shape: 'Geometrical Octagon',
      frame_material: 'Surgical Stainless Steel',
      frame_color: 'Champagne Gold',
      gender: Gender.UNISEX,
      lens_type: 'Zeiss Anti-Reflective Tint',
      images: ['https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=800'],
    },
    {
      storeIndex: 2,
      catIndex: 0,
      name: 'Lindberg Spirit Titanium Rimless',
      brand: 'Lindberg',
      price: 610.0,
      discount_price: null,
      stock: 10,
      sku: 'LND-SPIRIT-09',
      frame_shape: 'Rimless Oval',
      frame_material: 'Pure Medical Titanium Wire',
      frame_color: 'Nordic Blue Wire',
      gender: Gender.UNISEX,
      lens_type: 'High Index 1.74 Ultra Thin',
      images: ['https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=800'],
    },
    {
      storeIndex: 2,
      catIndex: 2,
      name: 'Moscot Lemtosh Blue Light Filter',
      brand: 'Moscot',
      price: 310.0,
      discount_price: 275.0,
      stock: 16,
      sku: 'MSC-LEM-BL',
      frame_shape: 'Classic Keyhole Bridge',
      frame_material: 'Italian Acetate',
      frame_color: 'Blonde Tortoise',
      gender: Gender.UNISEX,
      lens_type: 'Custom Blue Block 420nm',
      images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800'],
    },
    {
      storeIndex: 2,
      catIndex: 3,
      name: 'Cubitts Herbrand Reading Frame',
      brand: 'Cubitts',
      price: 175.0,
      discount_price: 150.0,
      stock: 24,
      sku: 'CUB-HER-250',
      frame_shape: 'Panto Round',
      frame_material: 'Milled Eco-Acetate',
      frame_color: 'Honey Crystal',
      gender: Gender.UNISEX,
      lens_type: 'Aspheric Precision Reader +1.5',
      images: ['https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800'],
    },
    {
      storeIndex: 2,
      catIndex: 1,
      name: 'Cutler and Gross 1386 Aviator Sun',
      brand: 'Cutler and Gross',
      price: 475.0,
      discount_price: 410.0,
      stock: 9,
      sku: 'CG-1386-04',
      frame_shape: 'Bold Square Aviator',
      frame_material: '10mm Heavyweight Acetate',
      frame_color: 'Smoky Olive',
      gender: Gender.MEN,
      lens_type: 'CR39 UV400 Solid Gray',
      images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800'],
    },
    {
      storeIndex: 2,
      catIndex: 2,
      name: 'Felix Gray Roebling Blue Filter',
      brand: 'Felix Gray',
      price: 95.0,
      discount_price: 85.0,
      stock: 32,
      sku: 'FG-ROE-AMB',
      frame_shape: 'Circular Round',
      frame_material: 'Hand-Finished Acetate',
      frame_color: 'Amber Toffee',
      gender: Gender.WOMEN,
      lens_type: 'Synthesised Blue Light Filter',
      images: ['https://images.unsplash.com/photo-1577803645773-f96470509666?w=800'],
    },
  ];

  for (const p of seedProducts) {
    const store = stores[p.storeIndex];
    const categories = storeCategoriesMap.get(store.id)!;
    const category = categories[p.catIndex];
    const slug = `${p.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '')}-${store.id}`;

    let product = await productRepo.findOne({ where: { slug, store_id: store.id } });
    if (!product) {
      product = productRepo.create({
        store_id: store.id,
        category_id: category.id,
        name: p.name,
        slug,
        description: `Premium quality ${p.brand} eyewear crafted with superior ${p.frame_material} and designed for optimal comfort and crystal-clear vision.`,
        brand: p.brand,
        price: p.price,
        discount_price: p.discount_price,
        stock: p.stock,
        sku: `${p.sku}-${store.id}`,
        frame_shape: p.frame_shape,
        frame_material: p.frame_material,
        frame_color: p.frame_color,
        gender: p.gender,
        lens_type: p.lens_type,
      });

      const savedProduct = await productRepo.save(product);

      for (let i = 0; i < p.images.length; i++) {
        const image = imageRepo.create({
          product_id: savedProduct.id,
          image_url: p.images[i],
          is_primary: i === 0,
        });
        await imageRepo.save(image);
      }
    }
  }

  console.log('✅ 21 Glasses Products & Gallery Images populated successfully');

  // 6. Create Customer Users
  const customerUsers = [
    { name: 'Alice Smith', email: 'customer1@example.com' },
    { name: 'David Johnson', email: 'customer2@example.com' },
    { name: 'Emma Watson', email: 'customer3@example.com' },
  ];

  for (let i = 0; i < customerUsers.length; i++) {
    const cData = customerUsers[i];
    const targetStore = stores[i % stores.length];

    let user = await userRepo.findOne({ where: { email: cData.email } });
    if (!user) {
      user = userRepo.create({
        name: cData.name,
        email: cData.email,
        password: defaultPassword,
        phone: `+1 555 010 ${i + 10}`,
        store_id: targetStore.id,
        role: Role.CUSTOMER,
      });
      user = await userRepo.save(user);

      let customer = await customerRepo.findOne({ where: { user_id: user.id } });
      if (!customer) {
        customer = customerRepo.create({
          user_id: user.id,
          store_id: targetStore.id,
          address: `${100 + i * 5} Fifth Ave, Apt ${i + 1}, New York, NY`,
        });
        await customerRepo.save(customer);
      }
    }
  }
  console.log('✅ Test Customers populated');

  // 7. Seed Store Promotions
  for (const store of stores) {
    const promo = promotionRepo.create({
      store_id: store.id,
      name: `Grand Opening ${store.name} 20% Off`,
      description: 'Get 20% discount on all designer prescription glasses this season!',
      discount_type: DiscountType.PERCENTAGE,
      discount_value: 20.0,
      start_date: new Date(),
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'ACTIVE',
    });
    await promotionRepo.save(promo);
  }
  console.log('✅ Store Promotions created');

  console.log('🎉 Database seeding completed cleanly!');
}
