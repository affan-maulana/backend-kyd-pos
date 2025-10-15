import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AddOn } from './add-on.entity';
import { Outlet } from '../../outlet/entities/outlet.entity';

@Entity('add_ons_group')
export class AddOnGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  // @Column({ type: 'uuid' })
  // outletId: string;

  @Column({ name: 'is_required', type: 'boolean', default: false })
  isRequired: boolean;

  @Column({ name: 'max_selection', type: 'int', default: 0 })
  maxSelection: number;

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

  @OneToMany(() => AddOn, (addOn) => addOn.addOnGroup)
  addOns: AddOn[];

  @OneToOne(() => Outlet)
  @JoinColumn({ name: 'outlet_id' })
  outlet: Outlet;
}
