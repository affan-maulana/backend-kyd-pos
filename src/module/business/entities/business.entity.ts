import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  DeleteDateColumn,
} from 'typeorm';

import { BusinessType } from '@module/business-type/entities/business-type.entity';
import { Users } from '../../user/entities/users.entity';

@Entity('businesses')
export class Business {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  name: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @CreateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'business_type_id' })
  businessTypeId: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @Column({
    name: 'user_id',
    type: 'uuid',
  })
  userId: string;

  // Relations
  @ManyToOne(() => BusinessType)
  @JoinColumn({ name: 'business_type_id' })
  businessType: BusinessType;

  // user id
  @ManyToOne(() => Users)
  @JoinColumn({ name: 'user_id' })
  user: Users;
}
