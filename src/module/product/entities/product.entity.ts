import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { ProductCategory } from '../../product-category/entities/product-category.entity';
import { ProductVariant } from '../../product-variant/entities/product-variant.entity';
import { ProductAddOnsGroup } from '../../add-on/entities/product-add-on-group.entity';
import { Outlet } from '../../outlet/entities/outlet.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Outlet, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'outlet_id' })
  outlet: Outlet;

  @ManyToOne(() => ProductCategory, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'product_category_id' })
  category: ProductCategory;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ type: 'text', nullable: true })
  image?: string;

  // categoy_id
  @Column({ type: 'uuid', name: 'product_category_id' })
  productCategoryId: string;

  // outlet_id
  @Column({ type: 'uuid', name: 'outlet_id' })
  outletId: string;

  @Column({ type: 'boolean', name: 'is_bundle', default: false })
  isBundle: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @OneToMany(() => ProductVariant, (variant) => variant.product)
  variants: ProductVariant[];

  @OneToMany(() => ProductAddOnsGroup, (group) => group.product)
  addOnsGroups: ProductAddOnsGroup[];
}
