import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Store } from '../../stores/entities/store.entity';
import { Role } from '../../common/enums/role.enum';
import { Customer } from '../../customers/entities/customer.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  store_id: number | null;

  @ManyToOne(() => Store, (store) => store.users, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'store_id' })
  store: Store | null;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  phone: string | null;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.CUSTOMER,
  })
  role: Role;

  @Column({ type: 'varchar', default: 'ACTIVE' })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => Customer, (customer) => customer.user)
  customer: Customer;
}
