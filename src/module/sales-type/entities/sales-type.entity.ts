import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Outlet } from '../../../module/outlet/entities/outlet.entity';

@Entity('sales_type')
export class SalesType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  name: string;

  @Column({
    name: 'is_active',
    type: 'boolean',
    default: true,
  })
  isActive: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @CreateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @Column({
    name: 'outlet_id',
    type: 'uuid',
  })
  outletId: string;

  // Relations
  @ManyToOne(() => Outlet)
  @JoinColumn({ name: 'outlet_id' })
  outlet: Outlet;
}
