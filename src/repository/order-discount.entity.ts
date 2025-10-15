import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Discount } from './discount.entity';

@Entity('order_discounts')
export class OrderDiscount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.orderDiscounts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Discount, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'discount_id' })
  discount: Discount;

  @Column({ name: 'discount_name', type: 'text', nullable: true })
  discountName: string;

  @Column({
    name: 'discount_type',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  discountType: string;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  value: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
