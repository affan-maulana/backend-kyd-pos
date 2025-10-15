import { Module } from '@nestjs/common';
import { ProductVariantService } from './product-variant.service';
import { ProductVariantController } from './product-variant.controller';
import { ProductVariant } from '@module/product-variant/entities/product-variant.entity';
import { Product } from '@module/product/entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductVariantFavorite } from '@module/product-variant-favorite/entities/product-variant-favorite.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductVariant, Product, ProductVariantFavorite]),
  ],
  controllers: [ProductVariantController],
  providers: [ProductVariantService],
})
export class ProductVariantModule {}
