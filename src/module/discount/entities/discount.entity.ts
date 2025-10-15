import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Check,
} from 'typeorm';
import { Outlet } from '../../outlet/entities/outlet.entity';

@Entity('discounts')
@Check(`"discount_type" IN ('percentage', 'fixed')`)
export class Discount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Outlet, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'outlet_id' })
  outlet: Outlet;

  @Column({ name: 'outlet_id', type: 'uuid' })
  outletId: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'discount_type', type: 'varchar' })
  discountType: 'percentage' | 'fixed';

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  value: number;

  @Column({ type: 'text', nullable: true })
  code: string;

  @Column({ name: 'applies_to', type: 'varchar', length: 20, nullable: true })
  appliesTo: string;

  @Column({ name: 'start_at', type: 'timestamp', nullable: true })
  startAt: Date;

  @Column({ name: 'end_at', type: 'timestamp', nullable: true })
  endAt: Date;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // @OneToMany(() => DiscountProduct, (dp) => dp.discount)
  // discountProducts: DiscountProduct[];
}
