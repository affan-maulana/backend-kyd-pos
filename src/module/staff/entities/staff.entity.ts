import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Business } from '../../../module/business/entities/business.entity';
import { Outlet } from '../../../module/outlet/entities/outlet.entity';

@Entity('staffs')
export class Staff {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  firstname: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  lastname?: string;

  @Column({
    name: 'expires_at',
    type: 'timestamp',
    nullable: true,
  })
  expiresAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  description?: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  image: string;

  @Column({
    type: 'varchar',
    default: true,
  })
  status: string;

  @Column({
    name: 'business_id',
    type: 'uuid',
  })
  businessId: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @Column({
    name: 'outlet_id',
    type: 'uuid',
    nullable: true,
  })
  outletId: string;

  // Relations
  @ManyToOne(() => Business)
  @JoinColumn({ name: 'business_id' })
  business: Business;

  @ManyToOne(() => Outlet)
  @JoinColumn({ name: 'outlet_id' })
  outlet: Outlet;
}
