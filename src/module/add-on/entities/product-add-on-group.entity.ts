import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Product } from '../../product/entities/product.entity';
import { AddOnGroup } from './add-on-group.entity';

@Entity('product_add_ons_group')
export class ProductAddOnsGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, (product) => product.addOnsGroups, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => AddOnGroup, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'add_ons_group_id' })
  addOnsGroup: AddOnGroup;

  @Column({ name: 'is_required', type: 'boolean', default: false })
  isRequired: boolean;

  @Column({ type: 'int', default: 0 })
  min: number;

  @Column({ type: 'int', default: 1 })
  max: number;

  @Column({ type: 'int', default: 0 })
  sequence: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
