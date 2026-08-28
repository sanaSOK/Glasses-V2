import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Customer } from '../../customers/entities/customer.entity';
import { Order } from '../../orders/entities/order.entity';

@Entity('prescriptions')
export class Prescription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customer_id: number;

  @ManyToOne(() => Customer, (customer) => customer.prescriptions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ nullable: true })
  order_id: number | null;

  @OneToOne(() => Order, (order) => order.prescription, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'order_id' })
  order: Order | null;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  right_sphere: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  right_cylinder: number;

  @Column({ type: 'int', nullable: true })
  right_axis: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  left_sphere: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  left_cylinder: number;

  @Column({ type: 'int', nullable: true })
  left_axis: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  pd: number; // Pupillary Distance

  @Column({ nullable: true })
  prescription_image: string;

  @CreateDateColumn()
  created_at: Date;
}
