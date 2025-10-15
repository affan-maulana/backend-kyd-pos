import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Bundle } from './bundle.entity';
import { ProductVariant } from '@module/product-variant/entities/product-variant.entity';

@Entity({ name: 'bundle_items' })
export class BundleItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'bundle_id', type: 'uuid' })
  bundleId: string;

  @ManyToOne(() => Bundle, (bundle) => bundle.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bundle_id' })
  bundle: Bundle;

  @Column({ name: 'product_variant_id', type: 'uuid' })
  productVariantId: string;

  @ManyToOne(() => ProductVariant)
  @JoinColumn({ name: 'product_variant_id' })
  productVariant: ProductVariant;

  @Column({ type: 'integer', default: 1 })
  quantity: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
