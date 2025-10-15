import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Outlet } from '../../outlet/entities/outlet.entity';

@Entity('payment_methods')
export class PaymentMethod {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text' })
  code: string;

  @Column({ type: 'varchar', length: 20 })
  type: string;

  @Column({
    name: 'fee_percent',
    type: 'numeric',
    precision: 5,
    scale: 4,
    default: 0,
  })
  feePercent: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @ManyToOne(() => Outlet, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'outlet_id' })
  outlet: Outlet;

  @Column({ name: 'outlet_id', type: 'uuid' })
  outletId: string;

  @Column({ name: 'is_default', type: 'boolean', default: false })
  isDefault: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Removed OneToMany relation to avoid TypeORM metadata error
  // @OneToMany(() => Payment, (payment) => payment.paymentMethod)
  // payments: Payment[];
}
