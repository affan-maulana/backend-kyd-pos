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

@Entity('product_variants')
export class ProductVariant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, (product) => product.variants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'uuid', name: 'product_id' })
  productId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true, unique: true })
  sku: string;

  @Column({ type: 'varchar', length: 64, nullable: true, unique: true })
  barcode: string;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  price: number;

  @Column({
    name: 'cost_price',
    type: 'numeric',
    precision: 12,
    scale: 2,
    default: 0,
  })
  costPrice: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ name: 'track_stock', type: 'boolean', default: true })
  trackStock: boolean;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'varchar', length: 20, nullable: true })
  unit: string;

  @Column({ type: 'int', default: 0 })
  sequence: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  // @OneToMany(() => ProductVariantFavorite, (favorite) => favorite.productVariant)
  // favorites: ProductVariantFavorite[];
}
