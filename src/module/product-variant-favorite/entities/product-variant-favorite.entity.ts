import { Column, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export class ProductVariantFavorite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @ManyToOne(() => ProductVariant, (productVariant) => productVariant.favorites, { onDelete: 'CASCADE' })
  // productVariant: ProductVariant;

  // @ManyToOne(() => Outlet, (outlet) => outlet.productVariantFavorites, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'outlet_id' })
  // outlet: Outlet;

  @Column({ type: 'uuid', name: 'outlet_id' })
  outletId: string;

  @Column({ type: 'int', default: 0 })
  position: number;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
