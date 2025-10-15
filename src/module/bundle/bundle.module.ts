import { Module } from '@nestjs/common';
import { BundleService } from './bundle.service';
import { BundleController } from './bundle.controller';
import { BundleItemService } from './bundle-item.service';
import { BundleItemController } from './bundle-item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BundleItem } from './entities/bundle-item.entity';
import { Bundle } from './entities/bundle.entity';
import { Product } from '@module/product/entities/product.entity';
import { ProductVariant } from '@module/product-variant/entities/product-variant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BundleItem, Bundle, Product, ProductVariant]),
  ],
  controllers: [BundleController, BundleItemController],
  providers: [BundleService, BundleItemService],
})
export class BundleModule {}
