import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
// import { Product } from './product.entity';

@Entity('discount_products')
export class DiscountProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @ManyToOne(() => Discount, (discount) => discount.discountProducts, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'discount_id' })
  // discount: Discount;

  // @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'product_id' })
  // product: Product;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
