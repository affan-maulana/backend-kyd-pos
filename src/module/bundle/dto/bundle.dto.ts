import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateBundleItemDto } from './create-bundle-item.dto';
import { Bundle } from '../entities/bundle.entity';
import { Optional } from '@nestjs/common';

class BundleItemDto {
  @ApiProperty()
  @IsUUID()
  productVariantId: string;

  @ApiProperty({ default: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class BundleDto {
  @ApiProperty()
  @IsUUID()
  @Optional()
  id: string;

  @IsUUID()
  productId: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty()
  @IsUUID()
  outletId: string;

  @ApiProperty({ type: [BundleItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BundleItemDto)
  items: CreateBundleItemDto[];

  constructor(partial: Partial<BundleDto>) {
    Object.assign(this, partial);
  }

  static fromEntity(bundle: Bundle): BundleDto {
    return new BundleDto({
      id: bundle.id,
      productId: bundle.productId,
      name: bundle.name,
      description: bundle.description,
      price: bundle.price,
      isActive: bundle.isActive,
      outletId: bundle.outletId,
      items: bundle.items,
    });
  }
}
