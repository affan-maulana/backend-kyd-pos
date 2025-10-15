import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { ProductVariant } from '../module/product-variant/entities/product-variant.entity';
import { Product } from '../module/product/entities/product.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.orderItems)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => ProductVariant)
  @JoinColumn({ name: 'product_variant_id' })
  productVariant: ProductVariant;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column()
  quantity: number;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  price: number;

  // bundle_id
  @Column({ type: 'uuid', nullable: true })
  bundleId: string;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  discount_value: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // @OneToMany(() => OrderItemAddOn, (addon) => addon.orderItem)
  // addOns: OrderItemAddOn[];
}
