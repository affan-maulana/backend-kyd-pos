import { Module } from '@nestjs/common';
import { ProductVariantFavoriteService } from './product-variant-favorite.service';
import { ProductVariantFavoriteController } from './product-variant-favorite.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductVariantFavorite } from './entities/product-variant-favorite.entity';
import { Outlet } from '@module/outlet/entities/outlet.entity';
import { ProductVariant } from '@module/product-variant/entities/product-variant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductVariantFavorite, Outlet, ProductVariant]),
  ],
  controllers: [ProductVariantFavoriteController],
  providers: [ProductVariantFavoriteService],
})
export class ProductVariantFavoriteModule {}
