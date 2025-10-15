import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { AddOnGroup } from './add-on-group.entity';

@Entity('add_ons')
export class AddOn {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'add_ons_group_id', type: 'uuid' })
  addOnsGroupId: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  price: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'now()',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'now()',
  })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date;

  @ManyToOne(() => AddOnGroup, (addOnGroup) => addOnGroup.addOns)
  @JoinColumn({ name: 'add_ons_group_id' })
  addOnGroup: AddOnGroup;
}
