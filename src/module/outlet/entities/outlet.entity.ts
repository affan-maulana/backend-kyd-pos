import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Business } from '../../business/entities/business.entity';

@Entity('outlets')
export class Outlet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  name: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  address: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({
    name: 'business_id',
    type: 'uuid',
    nullable: true,
  })
  businessId: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @Column({
    name: 'is_active',
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  // Relations
  @ManyToOne(() => Business)
  @JoinColumn({ name: 'business_id' })
  business: Business;

  // @OneToMany(() => ProductVariantFavorite, (favorite) => favorite.outlet)
  // productVariantFavorites: ProductVariantFavorite[];
}
