import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Check,
  CreateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { Tax } from '../module/tax/entities/tax.entity';
// import { Tax } from '@/taxes/entities/tax.entity';

@Entity('order_taxes')
@Check(`"type" IN ('percentage', 'fixed')`)
export class OrderTax {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.orderTaxes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Tax, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tax_id' })
  tax: Tax;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'varchar', length: 20 })
  type: 'percentage' | 'fixed';

  @Column({ type: 'numeric', precision: 5, scale: 2, nullable: true })
  rate: number | null;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  amount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
