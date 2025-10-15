import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Order } from './order.entity';
import { Gratuity } from '../module/gratuity/entities/gratuity.entity';

@Entity('order_gratuities')
@Unique(['order', 'gratuity']) // enforce one gratuity per order
export class OrderGratuity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.orderGratuities, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Gratuity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'gratuity_id' })
  gratuity: Gratuity;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  amount: number; // actual charged amount

  @Column({ type: 'numeric', precision: 5, scale: 2, nullable: true })
  percentage: number;

  @Column({ type: 'text', nullable: true })
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
