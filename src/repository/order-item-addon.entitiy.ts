import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('order_item_add_ons')
export class OrderItemAddOn {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @ManyToOne(() => OrderItem, (orderItem) => orderItem.addOns, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'order_item_id' })
  // orderItem: OrderItem;

  // @ManyToOne(() => AddOn, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'add_on_id' })
  // addOn: AddOn;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  price: number;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
