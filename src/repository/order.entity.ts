import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Outlet } from '../module/outlet/entities/outlet.entity';
import { Staff } from '../module/staff/entities/staff.entity';
import { SalesType } from '../module/sales-type/entities/sales-type.entity';
import { OrderItem } from './order-item.entity';
import { OrderTax } from './order-tax.entity';
import { OrderDiscount } from './order-discount.entity';
import { OrderGratuity } from './order-gratuity.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Outlet, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'outlet_id' })
  outlet: Outlet;

  @ManyToOne(() => Staff, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'staff_id' })
  staff: Staff;

  @ManyToOne(() => SalesType, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'sales_type_id' })
  salesType: SalesType;

  @Column({ type: 'varchar', length: 100, nullable: true })
  reference: string;

  @Column({
    name: 'customer_name',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  customerName: string;

  @Column({
    name: 'customer_phone',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  customerPhone: string;

  @Column({ name: 'status', type: 'varchar', length: 50, default: 'draft' })
  status: string; // e.g., 'draft', 'completed', 'cancelled'

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  subtotal: number;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  total: number;

  @Column({
    name: 'discount_total',
    type: 'numeric',
    precision: 12,
    scale: 2,
    default: 0,
  })
  discountTotal: number;

  @Column({
    name: 'tax_total',
    type: 'numeric',
    precision: 12,
    scale: 2,
    default: 0,
  })
  taxTotal: number;

  @Column({
    name: 'gratuity_total',
    type: 'numeric',
    precision: 12,
    scale: 2,
    default: 0,
  })
  gratuityTotal: number;

  @Column({
    name: 'payment_status',
    type: 'varchar',
    length: 50,
    default: 'unpaid',
  })
  paymentStatus: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  // --- RELATIONS ---

  @OneToMany(() => OrderItem, (item) => item.order)
  orderItems: OrderItem[];

  // @OneToMany(() => OrderItemAddOn, (addon) => addon.orderItem)
  // orderItemAddOns: OrderItemAddOn[];

  @OneToMany(() => OrderTax, (tax) => tax.order)
  orderTaxes: OrderTax[];

  @OneToMany(() => OrderDiscount, (discount) => discount.order)
  orderDiscounts: OrderDiscount[];

  @OneToMany(() => OrderGratuity, (gratuity) => gratuity.order)
  orderGratuities: OrderGratuity[];

  // @OneToMany(() => Payment, (payment) => payment.order)
  // payments: Payment[];
}
