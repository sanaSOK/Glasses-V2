import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Store } from '../../stores/entities/store.entity';
import { Category } from '../../categories/entities/category.entity';
import { ProductImage } from './product-image.entity';
import { Gender } from '../../common/enums/gender.enum';
import { Review } from '../../reviews/entities/review.entity';
import { Favorite } from '../../favorites/entities/favorite.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  store_id: number;

  @ManyToOne(() => Store, (store) => store.products, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @Column({ nullable: true })
  category_id: number | null;

  @ManyToOne(() => Category, (category) => category.products, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ length: 150 })
  name: string;

  @Column({ length: 180 })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 80, nullable: true })
  brand: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  discount_price: number | null;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ length: 100, nullable: true })
  sku: string;

  @Column({ length: 50, nullable: true })
  frame_shape: string;

  @Column({ length: 50, nullable: true })
  frame_material: string;

  @Column({ length: 50, nullable: true })
  frame_color: string;

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.UNISEX,
  })
  gender: Gender;

  @Column({ length: 80, nullable: true })
  lens_type: string;

  @Column({ default: 'ACTIVE' })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => ProductImage, (image) => image.product, { cascade: true })
  images: ProductImage[];

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @OneToMany(() => Favorite, (favorite) => favorite.product)
  favorites: Favorite[];
}
